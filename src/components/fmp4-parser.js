class y {
  id;
  type;
  // 'video' or 'audio'
  codec;
  timescale;
  duration;
  width;
  // for video
  height;
  // for video
  channelCount;
  // for audio
  sampleRate;
  // for audio
  language;
  samples;
  codecInfo;
  constructor(a) {
    this.id = a, this.type = "", this.codec = "", this.timescale = 0, this.duration = 0, this.language = "und", this.samples = [];
  }
  addSample(a) {
    this.samples.push(a);
  }
  addSamples(a) {
    this.samples.push(...a);
  }
  getSampleCount() {
    return this.samples.length;
  }
  getTotalDuration() {
    return this.samples.reduce((a, t) => a + (t.duration || 0), 0);
  }
}
class w {
  debug;
  HEADER_SIZE = 8;
  // box header size in bytes
  sourceUint8Array = null;
  tracks = /* @__PURE__ */ new Map();
  /**
   * Create a new Fmp4Parser instance
   * @param debug Whether to enable debug output
   */
  constructor(a = !1) {
    this.debug = a;
  }
  /**
   * Set debug mode
   * @param debug Whether to enable debug output
   */
  setDebug(a) {
    this.debug = a;
  }
  /**
   * Parse an fmp4 buffer
   * @param buffer ArrayBuffer containing fmp4 data
   * @returns Array of tracks
   */
  parse(a) {
    this.sourceUint8Array = new Uint8Array(a), this.tracks.clear();
    const t = [];
    let i = 0;
    for (; i < a.byteLength; ) {
      const e = this.parseBox(a, i);
      if (!e)
        break;
      t.push(e), i = e.end, this.debug && this.logBox(e);
    }
    return this.processTrackInfo(t), this.processSampleData(t), this.processCodecInfo(t), Array.from(this.tracks.values());
  }
  /**
   * Process track information from moov box
   */
  processTrackInfo(a) {
    const t = a.find((e) => e.type === "moov");
    if (!t?.children)
      return;
    const i = t.children.filter((e) => e.type === "trak");
    for (const e of i) {
      if (!e.children)
        continue;
      const c = this.findBox(e, "tkhd");
      if (!c?.data)
        continue;
      const s = c.data.trackID, o = new y(s), n = this.findBox(e, "mdia");
      if (!n?.children)
        continue;
      const r = this.findBox(n, "hdlr");
      r?.data && (o.type = r.data.handlerType === "vide" ? "video" : r.data.handlerType === "soun" ? "audio" : "unknown");
      const l = this.findBox(n, "mdhd");
      l?.data && (o.timescale = l.data.timescale, o.duration = Number(l.data.duration), o.language = l.data.language);
      const d = this.findBox(e, "stsd");
      if (d?.data?.entries?.[0]) {
        const g = d.data.entries[0];
        g.data && (o.type === "video" ? (o.width = g.data.width, o.height = g.data.height) : o.type === "audio" && (o.channelCount = g.data.channelCount, o.sampleRate = g.data.sampleRate));
      }
      this.tracks.set(s, o);
    }
  }
  /**
   * Process codec information for all tracks
   */
  processCodecInfo(a) {
    const t = this.generateCodecStrings(a);
    for (const i of this.tracks.values()) {
      const e = t.find(
        (c) => i.type === "video" && c.mimeType === "video/mp4" || i.type === "audio" && c.mimeType === "audio/mp4"
      );
      e && (i.codecInfo = e, i.codec = e.codecString);
    }
  }
  /**
   * Find a box of specific type within a parent box
   */
  findBox(a, t) {
    if (a.children)
      return a.children.find((i) => i.type === t);
  }
  /**
   * Process sample data for all trun boxes
   */
  processSampleData(a) {
    for (let t = 0; t < a.length; t++)
      if (a[t].type === "moof" && t + 1 < a.length && a[t + 1].type === "mdat") {
        const i = a[t], e = a[t + 1];
        if (i.children)
          for (const c of i.children)
            c.type === "traf" && this.processTrafBox(c, i.start, e);
      }
  }
  /**
   * Process a traf box to extract sample data
   */
  processTrafBox(a, t, i) {
    if (!a.children)
      return;
    let e = null, c = null;
    for (const d of a.children)
      d.type === "tfhd" ? e = d : d.type === "trun" && (c = d);
    if (!e?.data || !c?.data)
      return;
    const s = e.data.trackID, o = this.tracks.get(s);
    if (!o)
      return;
    const n = c.data;
    if (!n.samples || n.dataOffset === void 0)
      return;
    const r = t + n.dataOffset;
    if (r < i.start + this.HEADER_SIZE || r >= i.end) {
      this.debug && console.warn(`Data offset ${r} is outside mdat box range`);
      return;
    }
    let l = r;
    for (const d of n.samples) {
      const g = d.size || e.data.defaultSampleSize || 0;
      if (g <= 0)
        continue;
      const h = l, p = h + g;
      p <= i.end && this.sourceUint8Array && (d.dataStart = h, d.dataEnd = p, d.data = this.sourceUint8Array.subarray(h, p), o.addSample(d)), l += g;
    }
  }
  /**
   * Parse a single box from the buffer
   * @param buffer ArrayBuffer containing fmp4 data
   * @param offset Offset to start parsing from
   * @returns Parsed box or null if the buffer is too small
   */
  parseBox(a, t) {
    if (t + this.HEADER_SIZE > a.byteLength)
      return null;
    const e = new DataView(a).getUint32(t, !1), c = new Uint8Array(a, t + 4, 4), s = String.fromCharCode(...c), o = t, n = t + e, r = {
      type: s,
      size: e,
      start: o,
      end: n
    };
    return this.isContainerBox(s) ? r.children = this.parseChildren(a, t + this.HEADER_SIZE, n) : r.data = this.parseBoxData(a, s, t + this.HEADER_SIZE, n), r;
  }
  /**
   * Parse children boxes within a container box
   * @param buffer ArrayBuffer containing fmp4 data
   * @param offset Start offset for children
   * @param end End offset for children
   * @returns Array of child boxes
   */
  parseChildren(a, t, i) {
    const e = [];
    let c = t;
    for (; c < i; ) {
      const s = this.parseBox(a, c);
      if (!s)
        break;
      e.push(s), c = s.end;
    }
    return e;
  }
  /**
   * Parse box data based on box type
   */
  parseBoxData(a, t, i, e) {
    if (e - i <= 0)
      return null;
    switch (t) {
      case "ftyp":
        return this.parseFtypBox(a, i, e);
      case "mvhd":
        return this.parseMvhdBox(a, i, e);
      case "mdhd":
        return this.parseMdhdBox(a, i, e);
      case "hdlr":
        return this.parseHdlrBox(a, i, e);
      case "tkhd":
        return this.parseTkhdBox(a, i, e);
      case "elst":
        return this.parseElstBox(a, i, e);
      case "moof":
      case "mfhd":
        return this.parseMfhdBox(a, i, e);
      case "tfhd":
        return this.parseTfhdBox(a, i, e);
      case "tfdt":
        return this.parseTfdtBox(a, i, e);
      case "trun":
        return this.parseTrunBox(a, i, e);
      case "mdat":
        return this.parseMdatBox(a, i, e);
      case "stsd":
        return this.parseStsdBox(a, i, e);
      case "avc1":
      case "avc3":
        return this.parseAvcBox(a, i, e);
      case "hev1":
      case "hvc1":
        return this.parseHevcBox(a, i, e);
      case "mp4a":
        return this.parseMp4aBox(a, i, e);
      case "avcC":
        return this.parseAvcCBox(a, i, e);
      case "hvcC":
        return this.parseHvcCBox(a, i, e);
      case "esds":
        return this.parseEsdsBox(a, i, e);
      default:
        return new Uint8Array(a.slice(i, e));
    }
  }
  /**
   * Parse 'mdat' box data
   */
  parseMdatBox(a, t, i) {
    return {
      dataSize: i - t,
      dataOffset: t
    };
  }
  /**
   * Check if a box is a container box
   * @param type Box type
   * @returns True if the box is a container box
   */
  isContainerBox(a) {
    return [
      "moov",
      "trak",
      "edts",
      "mdia",
      "minf",
      "dinf",
      "stbl",
      "mvex",
      "moof",
      "traf",
      "mfra",
      "skip",
      "meta",
      "ipro",
      "sinf"
    ].includes(a);
  }
  /**
   * Parse 'ftyp' box data
   */
  parseFtypBox(a, t, i) {
    const e = new DataView(a), c = this.readFourCC(a, t), s = e.getUint32(t + 4, !1), o = [];
    for (let n = t + 8; n < i; n += 4)
      o.push(this.readFourCC(a, n));
    return {
      majorBrand: c,
      minorVersion: s,
      compatibleBrands: o
    };
  }
  /**
   * Parse 'mvhd' box data
   */
  parseMvhdBox(a, t, i) {
    const e = new DataView(a), c = e.getUint8(t), s = e.getUint8(t + 1) << 16 | e.getUint8(t + 2) << 8 | e.getUint8(t + 3);
    let o, n, r, l;
    return c === 1 ? (o = e.getBigUint64(t + 4, !1), n = e.getBigUint64(t + 12, !1), r = e.getUint32(t + 20, !1), l = e.getBigUint64(t + 24, !1)) : (o = e.getUint32(t + 4, !1), n = e.getUint32(t + 8, !1), r = e.getUint32(t + 12, !1), l = e.getUint32(t + 16, !1)), {
      version: c,
      flags: s,
      creationTime: o,
      modificationTime: n,
      timescale: r,
      duration: l
    };
  }
  /**
   * Parse 'mdhd' box data
   */
  parseMdhdBox(a, t, i) {
    const e = new DataView(a), c = e.getUint8(t), s = e.getUint8(t + 1) << 16 | e.getUint8(t + 2) << 8 | e.getUint8(t + 3);
    let o, n, r, l, d;
    return c === 1 ? (o = e.getBigUint64(t + 4, !1), n = e.getBigUint64(t + 12, !1), r = e.getUint32(t + 20, !1), l = e.getBigUint64(t + 24, !1), d = this.parseLanguage(e.getUint16(t + 32, !1))) : (o = e.getUint32(t + 4, !1), n = e.getUint32(t + 8, !1), r = e.getUint32(t + 12, !1), l = e.getUint32(t + 16, !1), d = this.parseLanguage(e.getUint16(t + 20, !1))), {
      version: c,
      flags: s,
      creationTime: o,
      modificationTime: n,
      timescale: r,
      duration: l,
      language: d
    };
  }
  /**
   * Parse 'hdlr' box data
   */
  parseHdlrBox(a, t, i) {
    const e = new DataView(a), c = e.getUint8(t), s = e.getUint8(t + 1) << 16 | e.getUint8(t + 2) << 8 | e.getUint8(t + 3), o = this.readFourCC(a, t + 8);
    let n = "", r = t + 24;
    for (; r < i; ) {
      const l = e.getUint8(r);
      if (l === 0)
        break;
      n += String.fromCharCode(l), r++;
    }
    return {
      version: c,
      flags: s,
      handlerType: o,
      name: n
    };
  }
  /**
   * Parse 'tkhd' box data
   */
  parseTkhdBox(a, t, i) {
    const e = new DataView(a), c = e.getUint8(t), s = e.getUint8(t + 1) << 16 | e.getUint8(t + 2) << 8 | e.getUint8(t + 3);
    let o, n, r, l;
    return c === 1 ? (o = e.getBigUint64(t + 4, !1), n = e.getBigUint64(t + 12, !1), r = e.getUint32(t + 20, !1), l = e.getBigUint64(t + 28, !1)) : (o = e.getUint32(t + 4, !1), n = e.getUint32(t + 8, !1), r = e.getUint32(t + 12, !1), l = e.getUint32(t + 20, !1)), {
      version: c,
      flags: s,
      creationTime: o,
      modificationTime: n,
      trackID: r,
      duration: l,
      enabled: (s & 1) !== 0,
      inMovie: (s & 2) !== 0,
      inPreview: (s & 4) !== 0
    };
  }
  /**
   * Parse 'elst' box data
   */
  parseElstBox(a, t, i) {
    const e = new DataView(a), c = e.getUint8(t), s = e.getUint8(t + 1) << 16 | e.getUint8(t + 2) << 8 | e.getUint8(t + 3), o = e.getUint32(t + 4, !1), n = [];
    let r = t + 8;
    for (let l = 0; l < o; l++)
      if (c === 1) {
        const d = e.getBigUint64(r, !1), g = e.getBigInt64(r + 8, !1), h = e.getInt16(r + 16, !1), p = e.getInt16(r + 18, !1);
        n.push({
          segmentDuration: d,
          mediaTime: g,
          mediaRateInteger: h,
          mediaRateFraction: p
        }), r += 20;
      } else {
        const d = e.getUint32(r, !1), g = e.getInt32(r + 4, !1), h = e.getInt16(r + 8, !1), p = e.getInt16(r + 10, !1);
        n.push({
          segmentDuration: d,
          mediaTime: g,
          mediaRateInteger: h,
          mediaRateFraction: p
        }), r += 12;
      }
    return {
      version: c,
      flags: s,
      entries: n
    };
  }
  /**
   * Parse 'mfhd' box data
   */
  parseMfhdBox(a, t, i) {
    const e = new DataView(a), c = e.getUint8(t), s = e.getUint8(t + 1) << 16 | e.getUint8(t + 2) << 8 | e.getUint8(t + 3), o = e.getUint32(t + 4, !1);
    return {
      version: c,
      flags: s,
      sequenceNumber: o
    };
  }
  /**
   * Parse 'tfhd' box data
   */
  parseTfhdBox(a, t, i) {
    const e = new DataView(a), c = e.getUint8(t), s = e.getUint8(t + 1) << 16 | e.getUint8(t + 2) << 8 | e.getUint8(t + 3), o = e.getUint32(t + 4, !1);
    let n = t + 8;
    const r = {
      version: c,
      flags: s,
      trackID: o
    };
    return s & 1 && (r.baseDataOffset = e.getBigUint64(n, !1), n += 8), s & 2 && (r.sampleDescriptionIndex = e.getUint32(n, !1), n += 4), s & 8 && (r.defaultSampleDuration = e.getUint32(n, !1), n += 4), s & 16 && (r.defaultSampleSize = e.getUint32(n, !1), n += 4), s & 32 && (r.defaultSampleFlags = e.getUint32(n, !1)), r;
  }
  /**
   * Parse 'tfdt' box data
   */
  parseTfdtBox(a, t, i) {
    const e = new DataView(a), c = e.getUint8(t), s = e.getUint8(t + 1) << 16 | e.getUint8(t + 2) << 8 | e.getUint8(t + 3);
    let o;
    return c === 1 ? o = e.getBigUint64(t + 4, !1) : o = e.getUint32(t + 4, !1), {
      version: c,
      flags: s,
      baseMediaDecodeTime: o
    };
  }
  /**
   * Parse 'trun' box data
   */
  parseTrunBox(a, t, i) {
    const e = new DataView(a), c = e.getUint8(t), s = e.getUint8(t + 1) << 16 | e.getUint8(t + 2) << 8 | e.getUint8(t + 3), o = e.getUint32(t + 4, !1);
    let n = t + 8;
    const r = {
      version: c,
      flags: s,
      sampleCount: o,
      samples: []
    };
    s & 1 && (r.dataOffset = e.getInt32(n, !1), n += 4), s & 4 && (r.firstSampleFlags = e.getUint32(n, !1), n += 4);
    const l = [];
    for (let d = 0; d < o; d++) {
      const g = {
        dataStart: 0,
        dataEnd: 0,
        data: new Uint8Array(0),
        // Placeholder, will be set later
        keyFrame: !0
        // Default to true, will be updated based on flags
      };
      if (s & 256 && (g.duration = e.getUint32(n, !1), n += 4), s & 512 && (g.size = e.getUint32(n, !1), n += 4), s & 1024) {
        g.flags = e.getUint32(n, !1);
        const h = g.flags >> 24 & 3;
        g.keyFrame = h === 2, n += 4;
      } else if (d === 0 && r.firstSampleFlags !== void 0) {
        const h = r.firstSampleFlags >> 24 & 3;
        g.keyFrame = h === 2;
      }
      s & 2048 && (c === 0 ? g.compositionTimeOffset = e.getUint32(n, !1) : g.compositionTimeOffset = e.getInt32(n, !1), n += 4), l.push(g);
    }
    return r.samples = l, r;
  }
  /**
   * Parse language code
   * @param value 16-bit language code
   * @returns ISO language code
   */
  parseLanguage(a) {
    const t = String.fromCharCode((a >> 10 & 31) + 96), i = String.fromCharCode((a >> 5 & 31) + 96), e = String.fromCharCode((a & 31) + 96);
    return t + i + e;
  }
  /**
   * Read a 4-character code from the buffer
   * @param buffer ArrayBuffer containing data
   * @param offset Offset to read from
   * @returns 4-character code as string
   */
  readFourCC(a, t) {
    const i = new Uint8Array(a, t, 4);
    return String.fromCharCode(...i);
  }
  /**
   * Log box information in debug mode
   * @param box Box to log
   * @param depth Nesting depth for indentation
   */
  logBox(a, t = 0) {
    if (!this.debug)
      return;
    const i = "  ".repeat(t);
    if (console.log(`${i}Box: ${a.type}, Size: ${a.size}, Range: ${a.start}-${a.end}`), a.data && console.log(`${i}  Data:`, a.data), a.children && a.children.length > 0) {
      console.log(`${i}  Children (${a.children.length}):`);
      for (const e of a.children)
        this.logBox(e, t + 2);
    }
  }
  /**
   * Utility method to pretty print a box structure
   * @param boxes Parsed box structure
   * @returns Formatted string representation
   */
  printBoxes(a) {
    let t = `FMP4 Structure:
`;
    const i = (e, c = 0) => {
      const s = "  ".repeat(c);
      if (t += `${s}${e.type} (${e.size} bytes)
`, e.data) {
        const o = JSON.stringify(e.data, (n, r) => typeof r == "bigint" ? r.toString() : n === "data" && r instanceof Uint8Array ? `Uint8Array(${r.byteLength} bytes)` : r, 2);
        t += `${s}  Data: ${o}
`;
      }
      if (e.children && e.children.length > 0)
        for (const o of e.children)
          i(o, c + 1);
    };
    for (const e of a)
      i(e);
    return t;
  }
  /**
   * Get all samples for a specific track
   * @param boxes Parsed box structure
   * @param trackId Track ID to find samples for (optional)
   * @returns Array of samples
   */
  getSamples(a, t) {
    const i = [];
    return this.findBoxes(a, "moof").forEach((e) => {
      e.children && e.children.filter((c) => c.type === "traf").forEach((c) => {
        if (!c.children)
          return;
        const s = c.children.find((n) => n.type === "tfhd");
        if (!s || !s.data || t !== void 0 && s.data.trackID !== t)
          return;
        c.children.filter((n) => n.type === "trun").forEach((n) => {
          !n.data || !n.data.samples || n.data.samples.forEach((r) => {
            r.data && r.data.byteLength > 0 && i.push(r);
          });
        });
      });
    }), i;
  }
  /**
   * Find all boxes of a specific type
   * @param boxes Array of boxes to search
   * @param type Box type to find
   * @returns Array of matching boxes
   */
  findBoxes(a, t) {
    const i = [], e = (c) => {
      for (const s of c)
        s.type === t && i.push(s), s.children && s.children.length > 0 && e(s.children);
    };
    return e(a), i;
  }
  /**
   * Parse 'stsd' box data (Sample Description Box)
   */
  parseStsdBox(a, t, i) {
    const e = new DataView(a), c = e.getUint8(t), s = e.getUint8(t + 1) << 16 | e.getUint8(t + 2) << 8 | e.getUint8(t + 3), o = e.getUint32(t + 4, !1);
    let n = t + 8;
    const r = [];
    for (let l = 0; l < o && n < i; l++) {
      const d = e.getUint32(n, !1), g = this.readFourCC(a, n + 4);
      let h;
      switch (g) {
        case "avc1":
        case "avc3":
          if (h = this.parseAvcBox(a, n + 8, n + d), n + d > n + 8 + 78) {
            const p = this.parseBox(a, n + 8 + 78);
            p && p.type === "avcC" && (h.avcC = p.data);
          }
          break;
        case "hev1":
        case "hvc1":
          if (h = this.parseHevcBox(a, n + 8, n + d), n + d > n + 8 + 78) {
            const p = this.parseBox(a, n + 8 + 78);
            p && p.type === "hvcC" && (h.hvcC = p.data);
          }
          break;
        case "mp4a":
          if (h = this.parseMp4aBox(a, n + 8, n + d), n + d > n + 8 + 28) {
            const p = this.parseBox(a, n + 8 + 28);
            p && p.type === "esds" && (h.esds = p.data);
          }
          break;
        default:
          h = new Uint8Array(a.slice(n + 8, n + d));
      }
      r.push({
        size: d,
        type: g,
        data: h
      }), n += d;
    }
    return {
      version: c,
      flags: s,
      entryCount: o,
      entries: r
    };
  }
  /**
   * Parse AVC Sample Entry box (avc1, avc3)
   */
  parseAvcBox(a, t, i) {
    const e = new DataView(a);
    t += 6;
    const c = e.getUint16(t, !1);
    t += 2, t += 16;
    const s = e.getUint16(t, !1), o = e.getUint16(t + 2, !1), n = e.getUint32(t + 4, !1), r = e.getUint32(t + 8, !1);
    t += 12, t += 4;
    const l = e.getUint16(t, !1);
    t += 2;
    const d = e.getUint8(t), g = this.readString(a, t + 1, d);
    t += 32;
    const h = e.getUint16(t, !1), p = e.getInt16(t + 2, !1);
    return {
      dataReferenceIndex: c,
      width: s,
      height: o,
      horizresolution: n,
      vertresolution: r,
      frameCount: l,
      compressorName: g,
      depth: h,
      preDefined: p
    };
  }
  /**
   * Parse HEVC Sample Entry box (hev1, hvc1)
   */
  parseHevcBox(a, t, i) {
    return this.parseAvcBox(a, t, i);
  }
  /**
   * Parse MP4 Audio Sample Entry box (mp4a)
   */
  parseMp4aBox(a, t, i) {
    const e = new DataView(a);
    t += 6;
    const c = e.getUint16(t, !1);
    t += 2, t += 8;
    const s = e.getUint16(t, !1), o = e.getUint16(t + 2, !1);
    t += 4, t += 4;
    const n = e.getUint32(t, !1) >> 16;
    return {
      dataReferenceIndex: c,
      channelCount: s,
      sampleSize: o,
      sampleRate: n
    };
  }
  /**
   * Read a string from the buffer
   */
  readString(a, t, i) {
    const e = new Uint8Array(a, t, i);
    return String.fromCharCode(...e).replace(/\0+$/, "");
  }
  /**
   * Parse 'avcC' box data
   */
  parseAvcCBox(a, t, i) {
    const e = new DataView(a);
    return {
      data: new Uint8Array(a, t, i - t),
      configurationVersion: e.getUint8(t),
      profileIndication: e.getUint8(t + 1),
      profileCompatibility: e.getUint8(t + 2),
      levelIndication: e.getUint8(t + 3)
      // There are more fields but we only need these for the codec string
    };
  }
  /**
   * Parse 'hvcC' box data
   */
  parseHvcCBox(a, t, i) {
    const e = new DataView(a);
    return {
      data: new Uint8Array(a, t, i - t),
      configurationVersion: e.getUint8(t),
      generalProfileSpace: e.getUint8(t + 1) >> 6 & 3,
      generalTierFlag: e.getUint8(t + 1) >> 5 & 1,
      generalProfileIdc: e.getUint8(t + 1) & 31,
      generalProfileCompatibilityFlags: e.getUint32(t + 2, !1),
      generalConstraintIndicatorFlags: new DataView(a, t + 6, 6),
      generalLevelIdc: e.getUint8(t + 12),
      minSpatialSegmentationIdc: e.getUint16(t + 13, !1) & 4095,
      parallelismType: e.getUint8(t + 15) & 3
      // There are more fields but we only need these for the codec string
    };
  }
  /**
   * Parse 'esds' box data
   */
  parseEsdsBox(a, t, i) {
    const e = new DataView(a);
    if (t += 4, e.getUint8(t) === 3) {
      const c = this.parseExpandableLength(a, t + 1);
      if (t += 1 + c.bytesRead, t += 3, e.getUint8(t) === 4) {
        const s = this.parseExpandableLength(a, t + 1);
        t += 1 + s.bytesRead;
        const o = {
          objectTypeIndication: (e.getUint8(t) >> 6) + 1,
          streamType: e.getUint8(t + 1) >> 2 & 63,
          bufferSizeDB: (e.getUint8(t + 1) & 3) << 16 | e.getUint8(t + 2) << 8 | e.getUint8(t + 3),
          maxBitrate: e.getUint32(t + 4, !1),
          avgBitrate: e.getUint32(t + 8, !1)
        };
        if (t += 13, t < i && e.getUint8(t) === 5) {
          const n = this.parseExpandableLength(a, t + 1);
          t += 1 + n.bytesRead;
          const r = new Uint8Array(a, t, n.length);
          return t += n.length, {
            decoderConfig: o,
            specificInfo: r,
            data: r
            // Keep the original data field for compatibility
          };
        }
        return {
          decoderConfig: o,
          data: new Uint8Array(0)
          // Empty array if no DecoderSpecificInfo found
        };
      }
    }
    return null;
  }
  /**
   * Parse expandable length field used in esds box
   */
  parseExpandableLength(a, t) {
    const i = new DataView(a);
    let e = 0, c = 0, s;
    do
      s = i.getUint8(t + c), e = e << 7 | s & 127, c++;
    while (s & 128);
    return { length: e, bytesRead: c };
  }
  /**
   * Generate codec string for MSE from codec specific box
   * @param boxes Array of parsed boxes
   * @returns Array of codec info objects containing codec strings and MIME types
   */
  generateCodecStrings(a) {
    const t = [], i = this.findBoxes(a, "stsd");
    for (const e of i)
      if (e.data?.entries)
        for (const c of e.data.entries) {
          const { type: s, data: o } = c;
          switch (s) {
            case "avc1":
            case "avc3": {
              if (o?.avcC) {
                const { profileIndication: n, profileCompatibility: r, levelIndication: l } = o.avcC, d = `${s}.` + n.toString(16).padStart(2, "0") + r.toString(16).padStart(2, "0") + l.toString(16).padStart(2, "0");
                t.push({
                  codecString: d,
                  mimeType: "video/mp4",
                  extraData: o.avcC.data
                });
              }
              break;
            }
            case "hev1":
            case "hvc1": {
              if (o?.hvcC) {
                const {
                  generalProfileSpace: n,
                  generalProfileIdc: r,
                  generalProfileCompatibilityFlags: l,
                  generalConstraintIndicatorFlags: d,
                  generalLevelIdc: g
                } = o.hvcC, p = (["", "A", "B", "C"][n] || "") + r, m = d.toString(16).padStart(6, "0"), U = g.toString(16).padStart(2, "0"), B = `${s}.${p}.${m}.${U}`;
                t.push({
                  codecString: B,
                  mimeType: "video/mp4",
                  extraData: o.hvcC.data
                });
              }
              break;
            }
            case "mp4a": {
              if (o?.esds?.decoderConfig) {
                const { objectTypeIndication: n } = o.esds.decoderConfig, r = `mp4a.40.${n}`;
                t.push({
                  codecString: r,
                  mimeType: "audio/mp4",
                  extraData: o.esds.data
                });
              }
              break;
            }
          }
        }
    return t;
  }
}
export {
  w as Fmp4Parser,
  y as Track
};
