var ii = Object.defineProperty;
var oi = (L, c, i) => c in L ? ii(L, c, { enumerable: !0, configurable: !0, writable: !0, value: i }) : L[c] = i;
var O = (L, c, i) => (oi(L, typeof c != "symbol" ? c + "" : c, i), i);
import { LitElement as si, css as ai, html as Xe } from "lit";
class ui {
  constructor(c) {
    O(this, "id");
    O(this, "type");
    // 'video' or 'audio'
    O(this, "codec");
    O(this, "timescale");
    O(this, "duration");
    O(this, "width");
    // for video
    O(this, "height");
    // for video
    O(this, "channelCount");
    // for audio
    O(this, "sampleRate");
    // for audio
    O(this, "language");
    O(this, "samples");
    O(this, "codecInfo");
    this.id = c, this.type = "", this.codec = "", this.timescale = 0, this.duration = 0, this.language = "und", this.samples = [];
  }
  addSample(c) {
    this.samples.push(c);
  }
  addSamples(c) {
    this.samples.push(...c);
  }
  getSampleCount() {
    return this.samples.length;
  }
  getTotalDuration() {
    return this.samples.reduce((c, i) => c + (i.duration || 0), 0);
  }
}
class li {
  /**
   * Create a new Fmp4Parser instance
   * @param debug Whether to enable debug output
   */
  constructor(c = !1) {
    O(this, "debug");
    O(this, "HEADER_SIZE", 8);
    // box header size in bytes
    O(this, "sourceUint8Array", null);
    O(this, "tracks", /* @__PURE__ */ new Map());
    this.debug = c;
  }
  /**
   * Set debug mode
   * @param debug Whether to enable debug output
   */
  setDebug(c) {
    this.debug = c;
  }
  /**
   * Parse an fmp4 buffer
   * @param buffer ArrayBuffer containing fmp4 data
   * @returns Array of tracks
   */
  parse(c) {
    this.sourceUint8Array = new Uint8Array(c), this.tracks.clear();
    const i = [];
    let p = 0;
    for (; p < c.byteLength; ) {
      const h = this.parseBox(c, p);
      if (!h)
        break;
      i.push(h), p = h.end, this.debug && this.logBox(h);
    }
    return this.processTrackInfo(i), this.processSampleData(i), this.processCodecInfo(i), Array.from(this.tracks.values());
  }
  /**
   * Process track information from moov box
   */
  processTrackInfo(c) {
    var h, b;
    const i = c.find((_) => _.type === "moov");
    if (!(i != null && i.children))
      return;
    const p = i.children.filter((_) => _.type === "trak");
    for (const _ of p) {
      if (!_.children)
        continue;
      const C = this.findBox(_, "tkhd");
      if (!(C != null && C.data))
        continue;
      const w = C.data.trackID, y = new ui(w), A = this.findBox(_, "mdia");
      if (!(A != null && A.children))
        continue;
      const $ = this.findBox(A, "hdlr");
      $ != null && $.data && (y.type = $.data.handlerType === "vide" ? "video" : $.data.handlerType === "soun" ? "audio" : "unknown");
      const z = this.findBox(A, "mdhd");
      z != null && z.data && (y.timescale = z.data.timescale, y.duration = Number(z.data.duration), y.language = z.data.language);
      const W = this.findBox(_, "stsd");
      if ((b = (h = W == null ? void 0 : W.data) == null ? void 0 : h.entries) != null && b[0]) {
        const H = W.data.entries[0];
        H.data && (y.type === "video" ? (y.width = H.data.width, y.height = H.data.height) : y.type === "audio" && (y.channelCount = H.data.channelCount, y.sampleRate = H.data.sampleRate));
      }
      this.tracks.set(w, y);
    }
  }
  /**
   * Process codec information for all tracks
   */
  processCodecInfo(c) {
    const i = this.generateCodecStrings(c);
    for (const p of this.tracks.values()) {
      const h = i.find(
        (b) => p.type === "video" && b.mimeType === "video/mp4" || p.type === "audio" && b.mimeType === "audio/mp4"
      );
      h && (p.codecInfo = h, p.codec = h.codecString);
    }
  }
  /**
   * Find a box of specific type within a parent box
   */
  findBox(c, i) {
    if (c.children)
      return c.children.find((p) => p.type === i);
  }
  /**
   * Process sample data for all trun boxes
   */
  processSampleData(c) {
    for (let i = 0; i < c.length; i++)
      if (c[i].type === "moof" && i + 1 < c.length && c[i + 1].type === "mdat") {
        const p = c[i], h = c[i + 1];
        if (p.children)
          for (const b of p.children)
            b.type === "traf" && this.processTrafBox(b, p.start, h);
      }
  }
  /**
   * Process a traf box to extract sample data
   */
  processTrafBox(c, i, p) {
    if (!c.children)
      return;
    let h = null, b = null;
    for (const $ of c.children)
      $.type === "tfhd" ? h = $ : $.type === "trun" && (b = $);
    if (!(h != null && h.data) || !(b != null && b.data))
      return;
    const _ = h.data.trackID, C = this.tracks.get(_);
    if (!C)
      return;
    const w = b.data;
    if (!w.samples || w.dataOffset === void 0)
      return;
    const y = i + w.dataOffset;
    if (y < p.start + this.HEADER_SIZE || y >= p.end) {
      this.debug && console.warn(`Data offset ${y} is outside mdat box range`);
      return;
    }
    let A = y;
    for (const $ of w.samples) {
      const z = $.size || h.data.defaultSampleSize || 0;
      if (z <= 0)
        continue;
      const W = A, H = W + z;
      H <= p.end && this.sourceUint8Array && ($.dataStart = W, $.dataEnd = H, $.data = this.sourceUint8Array.subarray(W, H), C.addSample($)), A += z;
    }
  }
  /**
   * Parse a single box from the buffer
   * @param buffer ArrayBuffer containing fmp4 data
   * @param offset Offset to start parsing from
   * @returns Parsed box or null if the buffer is too small
   */
  parseBox(c, i) {
    if (i + this.HEADER_SIZE > c.byteLength)
      return null;
    const h = new DataView(c).getUint32(i, !1), b = new Uint8Array(c, i + 4, 4), _ = String.fromCharCode(...b), C = i, w = i + h, y = {
      type: _,
      size: h,
      start: C,
      end: w
    };
    return this.isContainerBox(_) ? y.children = this.parseChildren(c, i + this.HEADER_SIZE, w) : y.data = this.parseBoxData(c, _, i + this.HEADER_SIZE, w), y;
  }
  /**
   * Parse children boxes within a container box
   * @param buffer ArrayBuffer containing fmp4 data
   * @param offset Start offset for children
   * @param end End offset for children
   * @returns Array of child boxes
   */
  parseChildren(c, i, p) {
    const h = [];
    let b = i;
    for (; b < p; ) {
      const _ = this.parseBox(c, b);
      if (!_)
        break;
      h.push(_), b = _.end;
    }
    return h;
  }
  /**
   * Parse box data based on box type
   */
  parseBoxData(c, i, p, h) {
    if (h - p <= 0)
      return null;
    switch (i) {
      case "ftyp":
        return this.parseFtypBox(c, p, h);
      case "mvhd":
        return this.parseMvhdBox(c, p, h);
      case "mdhd":
        return this.parseMdhdBox(c, p, h);
      case "hdlr":
        return this.parseHdlrBox(c, p, h);
      case "tkhd":
        return this.parseTkhdBox(c, p, h);
      case "elst":
        return this.parseElstBox(c, p, h);
      case "moof":
      case "mfhd":
        return this.parseMfhdBox(c, p, h);
      case "tfhd":
        return this.parseTfhdBox(c, p, h);
      case "tfdt":
        return this.parseTfdtBox(c, p, h);
      case "trun":
        return this.parseTrunBox(c, p, h);
      case "mdat":
        return this.parseMdatBox(c, p, h);
      case "stsd":
        return this.parseStsdBox(c, p, h);
      case "avc1":
      case "avc3":
        return this.parseAvcBox(c, p, h);
      case "hev1":
      case "hvc1":
        return this.parseHevcBox(c, p, h);
      case "mp4a":
        return this.parseMp4aBox(c, p, h);
      case "avcC":
        return this.parseAvcCBox(c, p, h);
      case "hvcC":
        return this.parseHvcCBox(c, p, h);
      case "esds":
        return this.parseEsdsBox(c, p, h);
      default:
        return new Uint8Array(c.slice(p, h));
    }
  }
  /**
   * Parse 'mdat' box data
   */
  parseMdatBox(c, i, p) {
    return {
      dataSize: p - i,
      dataOffset: i
    };
  }
  /**
   * Check if a box is a container box
   * @param type Box type
   * @returns True if the box is a container box
   */
  isContainerBox(c) {
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
    ].includes(c);
  }
  /**
   * Parse 'ftyp' box data
   */
  parseFtypBox(c, i, p) {
    const h = new DataView(c), b = this.readFourCC(c, i), _ = h.getUint32(i + 4, !1), C = [];
    for (let w = i + 8; w < p; w += 4)
      C.push(this.readFourCC(c, w));
    return {
      majorBrand: b,
      minorVersion: _,
      compatibleBrands: C
    };
  }
  /**
   * Parse 'mvhd' box data
   */
  parseMvhdBox(c, i, p) {
    const h = new DataView(c), b = h.getUint8(i), _ = h.getUint8(i + 1) << 16 | h.getUint8(i + 2) << 8 | h.getUint8(i + 3);
    let C, w, y, A;
    return b === 1 ? (C = h.getBigUint64(i + 4, !1), w = h.getBigUint64(i + 12, !1), y = h.getUint32(i + 20, !1), A = h.getBigUint64(i + 24, !1)) : (C = h.getUint32(i + 4, !1), w = h.getUint32(i + 8, !1), y = h.getUint32(i + 12, !1), A = h.getUint32(i + 16, !1)), {
      version: b,
      flags: _,
      creationTime: C,
      modificationTime: w,
      timescale: y,
      duration: A
    };
  }
  /**
   * Parse 'mdhd' box data
   */
  parseMdhdBox(c, i, p) {
    const h = new DataView(c), b = h.getUint8(i), _ = h.getUint8(i + 1) << 16 | h.getUint8(i + 2) << 8 | h.getUint8(i + 3);
    let C, w, y, A, $;
    return b === 1 ? (C = h.getBigUint64(i + 4, !1), w = h.getBigUint64(i + 12, !1), y = h.getUint32(i + 20, !1), A = h.getBigUint64(i + 24, !1), $ = this.parseLanguage(h.getUint16(i + 32, !1))) : (C = h.getUint32(i + 4, !1), w = h.getUint32(i + 8, !1), y = h.getUint32(i + 12, !1), A = h.getUint32(i + 16, !1), $ = this.parseLanguage(h.getUint16(i + 20, !1))), {
      version: b,
      flags: _,
      creationTime: C,
      modificationTime: w,
      timescale: y,
      duration: A,
      language: $
    };
  }
  /**
   * Parse 'hdlr' box data
   */
  parseHdlrBox(c, i, p) {
    const h = new DataView(c), b = h.getUint8(i), _ = h.getUint8(i + 1) << 16 | h.getUint8(i + 2) << 8 | h.getUint8(i + 3), C = this.readFourCC(c, i + 8);
    let w = "", y = i + 24;
    for (; y < p; ) {
      const A = h.getUint8(y);
      if (A === 0)
        break;
      w += String.fromCharCode(A), y++;
    }
    return {
      version: b,
      flags: _,
      handlerType: C,
      name: w
    };
  }
  /**
   * Parse 'tkhd' box data
   */
  parseTkhdBox(c, i, p) {
    const h = new DataView(c), b = h.getUint8(i), _ = h.getUint8(i + 1) << 16 | h.getUint8(i + 2) << 8 | h.getUint8(i + 3);
    let C, w, y, A;
    return b === 1 ? (C = h.getBigUint64(i + 4, !1), w = h.getBigUint64(i + 12, !1), y = h.getUint32(i + 20, !1), A = h.getBigUint64(i + 28, !1)) : (C = h.getUint32(i + 4, !1), w = h.getUint32(i + 8, !1), y = h.getUint32(i + 12, !1), A = h.getUint32(i + 20, !1)), {
      version: b,
      flags: _,
      creationTime: C,
      modificationTime: w,
      trackID: y,
      duration: A,
      enabled: (_ & 1) !== 0,
      inMovie: (_ & 2) !== 0,
      inPreview: (_ & 4) !== 0
    };
  }
  /**
   * Parse 'elst' box data
   */
  parseElstBox(c, i, p) {
    const h = new DataView(c), b = h.getUint8(i), _ = h.getUint8(i + 1) << 16 | h.getUint8(i + 2) << 8 | h.getUint8(i + 3), C = h.getUint32(i + 4, !1), w = [];
    let y = i + 8;
    for (let A = 0; A < C; A++)
      if (b === 1) {
        const $ = h.getBigUint64(y, !1), z = h.getBigInt64(y + 8, !1), W = h.getInt16(y + 16, !1), H = h.getInt16(y + 18, !1);
        w.push({
          segmentDuration: $,
          mediaTime: z,
          mediaRateInteger: W,
          mediaRateFraction: H
        }), y += 20;
      } else {
        const $ = h.getUint32(y, !1), z = h.getInt32(y + 4, !1), W = h.getInt16(y + 8, !1), H = h.getInt16(y + 10, !1);
        w.push({
          segmentDuration: $,
          mediaTime: z,
          mediaRateInteger: W,
          mediaRateFraction: H
        }), y += 12;
      }
    return {
      version: b,
      flags: _,
      entries: w
    };
  }
  /**
   * Parse 'mfhd' box data
   */
  parseMfhdBox(c, i, p) {
    const h = new DataView(c), b = h.getUint8(i), _ = h.getUint8(i + 1) << 16 | h.getUint8(i + 2) << 8 | h.getUint8(i + 3), C = h.getUint32(i + 4, !1);
    return {
      version: b,
      flags: _,
      sequenceNumber: C
    };
  }
  /**
   * Parse 'tfhd' box data
   */
  parseTfhdBox(c, i, p) {
    const h = new DataView(c), b = h.getUint8(i), _ = h.getUint8(i + 1) << 16 | h.getUint8(i + 2) << 8 | h.getUint8(i + 3), C = h.getUint32(i + 4, !1);
    let w = i + 8;
    const y = {
      version: b,
      flags: _,
      trackID: C
    };
    return _ & 1 && (y.baseDataOffset = h.getBigUint64(w, !1), w += 8), _ & 2 && (y.sampleDescriptionIndex = h.getUint32(w, !1), w += 4), _ & 8 && (y.defaultSampleDuration = h.getUint32(w, !1), w += 4), _ & 16 && (y.defaultSampleSize = h.getUint32(w, !1), w += 4), _ & 32 && (y.defaultSampleFlags = h.getUint32(w, !1)), y;
  }
  /**
   * Parse 'tfdt' box data
   */
  parseTfdtBox(c, i, p) {
    const h = new DataView(c), b = h.getUint8(i), _ = h.getUint8(i + 1) << 16 | h.getUint8(i + 2) << 8 | h.getUint8(i + 3);
    let C;
    return b === 1 ? C = h.getBigUint64(i + 4, !1) : C = h.getUint32(i + 4, !1), {
      version: b,
      flags: _,
      baseMediaDecodeTime: C
    };
  }
  /**
   * Parse 'trun' box data
   */
  parseTrunBox(c, i, p) {
    const h = new DataView(c), b = h.getUint8(i), _ = h.getUint8(i + 1) << 16 | h.getUint8(i + 2) << 8 | h.getUint8(i + 3), C = h.getUint32(i + 4, !1);
    let w = i + 8;
    const y = {
      version: b,
      flags: _,
      sampleCount: C,
      samples: []
    };
    _ & 1 && (y.dataOffset = h.getInt32(w, !1), w += 4), _ & 4 && (y.firstSampleFlags = h.getUint32(w, !1), w += 4);
    const A = [];
    for (let $ = 0; $ < C; $++) {
      const z = {
        dataStart: 0,
        dataEnd: 0,
        data: new Uint8Array(0),
        // Placeholder, will be set later
        keyFrame: !0
        // Default to true, will be updated based on flags
      };
      if (_ & 256 && (z.duration = h.getUint32(w, !1), w += 4), _ & 512 && (z.size = h.getUint32(w, !1), w += 4), _ & 1024) {
        z.flags = h.getUint32(w, !1);
        const W = z.flags >> 24 & 3;
        z.keyFrame = W === 2, w += 4;
      } else if ($ === 0 && y.firstSampleFlags !== void 0) {
        const W = y.firstSampleFlags >> 24 & 3;
        z.keyFrame = W === 2;
      }
      _ & 2048 && (b === 0 ? z.compositionTimeOffset = h.getUint32(w, !1) : z.compositionTimeOffset = h.getInt32(w, !1), w += 4), A.push(z);
    }
    return y.samples = A, y;
  }
  /**
   * Parse language code
   * @param value 16-bit language code
   * @returns ISO language code
   */
  parseLanguage(c) {
    const i = String.fromCharCode((c >> 10 & 31) + 96), p = String.fromCharCode((c >> 5 & 31) + 96), h = String.fromCharCode((c & 31) + 96);
    return i + p + h;
  }
  /**
   * Read a 4-character code from the buffer
   * @param buffer ArrayBuffer containing data
   * @param offset Offset to read from
   * @returns 4-character code as string
   */
  readFourCC(c, i) {
    const p = new Uint8Array(c, i, 4);
    return String.fromCharCode(...p);
  }
  /**
   * Log box information in debug mode
   * @param box Box to log
   * @param depth Nesting depth for indentation
   */
  logBox(c, i = 0) {
    if (!this.debug)
      return;
    const p = "  ".repeat(i);
    if (console.log(`${p}Box: ${c.type}, Size: ${c.size}, Range: ${c.start}-${c.end}`), c.data && console.log(`${p}  Data:`, c.data), c.children && c.children.length > 0) {
      console.log(`${p}  Children (${c.children.length}):`);
      for (const h of c.children)
        this.logBox(h, i + 2);
    }
  }
  /**
   * Utility method to pretty print a box structure
   * @param boxes Parsed box structure
   * @returns Formatted string representation
   */
  printBoxes(c) {
    let i = `FMP4 Structure:
`;
    const p = (h, b = 0) => {
      const _ = "  ".repeat(b);
      if (i += `${_}${h.type} (${h.size} bytes)
`, h.data) {
        const C = JSON.stringify(h.data, (w, y) => typeof y == "bigint" ? y.toString() : w === "data" && y instanceof Uint8Array ? `Uint8Array(${y.byteLength} bytes)` : y, 2);
        i += `${_}  Data: ${C}
`;
      }
      if (h.children && h.children.length > 0)
        for (const C of h.children)
          p(C, b + 1);
    };
    for (const h of c)
      p(h);
    return i;
  }
  /**
   * Get all samples for a specific track
   * @param boxes Parsed box structure
   * @param trackId Track ID to find samples for (optional)
   * @returns Array of samples
   */
  getSamples(c, i) {
    const p = [];
    return this.findBoxes(c, "moof").forEach((h) => {
      h.children && h.children.filter((b) => b.type === "traf").forEach((b) => {
        if (!b.children)
          return;
        const _ = b.children.find((w) => w.type === "tfhd");
        if (!_ || !_.data || i !== void 0 && _.data.trackID !== i)
          return;
        b.children.filter((w) => w.type === "trun").forEach((w) => {
          !w.data || !w.data.samples || w.data.samples.forEach((y) => {
            y.data && y.data.byteLength > 0 && p.push(y);
          });
        });
      });
    }), p;
  }
  /**
   * Find all boxes of a specific type
   * @param boxes Array of boxes to search
   * @param type Box type to find
   * @returns Array of matching boxes
   */
  findBoxes(c, i) {
    const p = [], h = (b) => {
      for (const _ of b)
        _.type === i && p.push(_), _.children && _.children.length > 0 && h(_.children);
    };
    return h(c), p;
  }
  /**
   * Parse 'stsd' box data (Sample Description Box)
   */
  parseStsdBox(c, i, p) {
    const h = new DataView(c), b = h.getUint8(i), _ = h.getUint8(i + 1) << 16 | h.getUint8(i + 2) << 8 | h.getUint8(i + 3), C = h.getUint32(i + 4, !1);
    let w = i + 8;
    const y = [];
    for (let A = 0; A < C && w < p; A++) {
      const $ = h.getUint32(w, !1), z = this.readFourCC(c, w + 4);
      let W;
      switch (z) {
        case "avc1":
        case "avc3":
          if (W = this.parseAvcBox(c, w + 8, w + $), w + $ > w + 8 + 78) {
            const H = this.parseBox(c, w + 8 + 78);
            H && H.type === "avcC" && (W.avcC = H.data);
          }
          break;
        case "hev1":
        case "hvc1":
          if (W = this.parseHevcBox(c, w + 8, w + $), w + $ > w + 8 + 78) {
            const H = this.parseBox(c, w + 8 + 78);
            H && H.type === "hvcC" && (W.hvcC = H.data);
          }
          break;
        case "mp4a":
          if (W = this.parseMp4aBox(c, w + 8, w + $), w + $ > w + 8 + 28) {
            const H = this.parseBox(c, w + 8 + 28);
            H && H.type === "esds" && (W.esds = H.data);
          }
          break;
        default:
          W = new Uint8Array(c.slice(w + 8, w + $));
      }
      y.push({
        size: $,
        type: z,
        data: W
      }), w += $;
    }
    return {
      version: b,
      flags: _,
      entryCount: C,
      entries: y
    };
  }
  /**
   * Parse AVC Sample Entry box (avc1, avc3)
   */
  parseAvcBox(c, i, p) {
    const h = new DataView(c);
    i += 6;
    const b = h.getUint16(i, !1);
    i += 2, i += 16;
    const _ = h.getUint16(i, !1), C = h.getUint16(i + 2, !1), w = h.getUint32(i + 4, !1), y = h.getUint32(i + 8, !1);
    i += 12, i += 4;
    const A = h.getUint16(i, !1);
    i += 2;
    const $ = h.getUint8(i), z = this.readString(c, i + 1, $);
    i += 32;
    const W = h.getUint16(i, !1), H = h.getInt16(i + 2, !1);
    return {
      dataReferenceIndex: b,
      width: _,
      height: C,
      horizresolution: w,
      vertresolution: y,
      frameCount: A,
      compressorName: z,
      depth: W,
      preDefined: H
    };
  }
  /**
   * Parse HEVC Sample Entry box (hev1, hvc1)
   */
  parseHevcBox(c, i, p) {
    return this.parseAvcBox(c, i, p);
  }
  /**
   * Parse MP4 Audio Sample Entry box (mp4a)
   */
  parseMp4aBox(c, i, p) {
    const h = new DataView(c);
    i += 6;
    const b = h.getUint16(i, !1);
    i += 2, i += 8;
    const _ = h.getUint16(i, !1), C = h.getUint16(i + 2, !1);
    i += 4, i += 4;
    const w = h.getUint32(i, !1) >> 16;
    return {
      dataReferenceIndex: b,
      channelCount: _,
      sampleSize: C,
      sampleRate: w
    };
  }
  /**
   * Read a string from the buffer
   */
  readString(c, i, p) {
    const h = new Uint8Array(c, i, p);
    return String.fromCharCode(...h).replace(/\0+$/, "");
  }
  /**
   * Parse 'avcC' box data
   */
  parseAvcCBox(c, i, p) {
    const h = new DataView(c);
    return {
      data: new Uint8Array(c, i, p - i),
      configurationVersion: h.getUint8(i),
      profileIndication: h.getUint8(i + 1),
      profileCompatibility: h.getUint8(i + 2),
      levelIndication: h.getUint8(i + 3)
      // There are more fields but we only need these for the codec string
    };
  }
  /**
   * Parse 'hvcC' box data
   */
  parseHvcCBox(c, i, p) {
    const h = new DataView(c);
    return {
      data: new Uint8Array(c, i, p - i),
      configurationVersion: h.getUint8(i),
      generalProfileSpace: h.getUint8(i + 1) >> 6 & 3,
      generalTierFlag: h.getUint8(i + 1) >> 5 & 1,
      generalProfileIdc: h.getUint8(i + 1) & 31,
      generalProfileCompatibilityFlags: h.getUint32(i + 2, !1),
      generalConstraintIndicatorFlags: new DataView(c, i + 6, 6),
      generalLevelIdc: h.getUint8(i + 12),
      minSpatialSegmentationIdc: h.getUint16(i + 13, !1) & 4095,
      parallelismType: h.getUint8(i + 15) & 3
      // There are more fields but we only need these for the codec string
    };
  }
  /**
   * Parse 'esds' box data
   */
  parseEsdsBox(c, i, p) {
    const h = new DataView(c);
    if (i += 4, h.getUint8(i) === 3) {
      const b = this.parseExpandableLength(c, i + 1);
      if (i += 1 + b.bytesRead, i += 3, h.getUint8(i) === 4) {
        const _ = this.parseExpandableLength(c, i + 1);
        i += 1 + _.bytesRead;
        const C = {
          objectTypeIndication: (h.getUint8(i) >> 6) + 1,
          streamType: h.getUint8(i + 1) >> 2 & 63,
          bufferSizeDB: (h.getUint8(i + 1) & 3) << 16 | h.getUint8(i + 2) << 8 | h.getUint8(i + 3),
          maxBitrate: h.getUint32(i + 4, !1),
          avgBitrate: h.getUint32(i + 8, !1)
        };
        if (i += 13, i < p && h.getUint8(i) === 5) {
          const w = this.parseExpandableLength(c, i + 1);
          i += 1 + w.bytesRead;
          const y = new Uint8Array(c, i, w.length);
          return i += w.length, {
            decoderConfig: C,
            specificInfo: y,
            data: y
            // Keep the original data field for compatibility
          };
        }
        return {
          decoderConfig: C,
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
  parseExpandableLength(c, i) {
    const p = new DataView(c);
    let h = 0, b = 0, _;
    do
      _ = p.getUint8(i + b), h = h << 7 | _ & 127, b++;
    while (_ & 128);
    return { length: h, bytesRead: b };
  }
  /**
   * Generate codec string for MSE from codec specific box
   * @param boxes Array of parsed boxes
   * @returns Array of codec info objects containing codec strings and MIME types
   */
  generateCodecStrings(c) {
    var h, b;
    const i = [], p = this.findBoxes(c, "stsd");
    for (const _ of p)
      if ((h = _.data) != null && h.entries)
        for (const C of _.data.entries) {
          const { type: w, data: y } = C;
          switch (w) {
            case "avc1":
            case "avc3": {
              if (y != null && y.avcC) {
                const { profileIndication: A, profileCompatibility: $, levelIndication: z } = y.avcC, W = `${w}.` + A.toString(16).padStart(2, "0") + $.toString(16).padStart(2, "0") + z.toString(16).padStart(2, "0");
                i.push({
                  codecString: W,
                  mimeType: "video/mp4",
                  extraData: y.avcC.data
                });
              }
              break;
            }
            case "hev1":
            case "hvc1": {
              if (y != null && y.hvcC) {
                const {
                  generalProfileSpace: A,
                  generalProfileIdc: $,
                  generalProfileCompatibilityFlags: z,
                  generalConstraintIndicatorFlags: W,
                  generalLevelIdc: H
                } = y.hvcC, j = (["", "A", "B", "C"][A] || "") + $, pe = W.toString(16).padStart(6, "0"), K = H.toString(16).padStart(2, "0"), ae = `${w}.${j}.${pe}.${K}`;
                i.push({
                  codecString: ae,
                  mimeType: "video/mp4",
                  extraData: y.hvcC.data
                });
              }
              break;
            }
            case "mp4a": {
              if ((b = y == null ? void 0 : y.esds) != null && b.decoderConfig) {
                const { objectTypeIndication: A } = y.esds.decoderConfig, $ = `mp4a.40.${A}`;
                i.push({
                  codecString: $,
                  mimeType: "audio/mp4",
                  extraData: y.esds.data
                });
              }
              break;
            }
          }
        }
    return i;
  }
}
var It = /* @__PURE__ */ ((L) => (L.VideoCodecInfo = "videoCodecInfo", L.VideoFrame = "videoFrame", L.Error = "error", L))(It || {}), Un = /* @__PURE__ */ ((L) => (L.AudioCodecInfo = "audioCodecInfo", L.AudioFrame = "audioFrame", L.Error = "error", L))(Un || {});
function ci(L) {
  return L && L.__esModule && Object.prototype.hasOwnProperty.call(L, "default") ? L.default : L;
}
var ni = { exports: {} };
(function(L) {
  var c = Object.prototype.hasOwnProperty, i = "~";
  function p() {
  }
  Object.create && (p.prototype = /* @__PURE__ */ Object.create(null), new p().__proto__ || (i = !1));
  function h(w, y, A) {
    this.fn = w, this.context = y, this.once = A || !1;
  }
  function b(w, y, A, $, z) {
    if (typeof A != "function")
      throw new TypeError("The listener must be a function");
    var W = new h(A, $ || w, z), H = i ? i + y : y;
    return w._events[H] ? w._events[H].fn ? w._events[H] = [w._events[H], W] : w._events[H].push(W) : (w._events[H] = W, w._eventsCount++), w;
  }
  function _(w, y) {
    --w._eventsCount === 0 ? w._events = new p() : delete w._events[y];
  }
  function C() {
    this._events = new p(), this._eventsCount = 0;
  }
  C.prototype.eventNames = function() {
    var y = [], A, $;
    if (this._eventsCount === 0)
      return y;
    for ($ in A = this._events)
      c.call(A, $) && y.push(i ? $.slice(1) : $);
    return Object.getOwnPropertySymbols ? y.concat(Object.getOwnPropertySymbols(A)) : y;
  }, C.prototype.listeners = function(y) {
    var A = i ? i + y : y, $ = this._events[A];
    if (!$)
      return [];
    if ($.fn)
      return [$.fn];
    for (var z = 0, W = $.length, H = new Array(W); z < W; z++)
      H[z] = $[z].fn;
    return H;
  }, C.prototype.listenerCount = function(y) {
    var A = i ? i + y : y, $ = this._events[A];
    return $ ? $.fn ? 1 : $.length : 0;
  }, C.prototype.emit = function(y, A, $, z, W, H) {
    var re = i ? i + y : y;
    if (!this._events[re])
      return !1;
    var j = this._events[re], pe = arguments.length, K, ae;
    if (j.fn) {
      switch (j.once && this.removeListener(y, j.fn, void 0, !0), pe) {
        case 1:
          return j.fn.call(j.context), !0;
        case 2:
          return j.fn.call(j.context, A), !0;
        case 3:
          return j.fn.call(j.context, A, $), !0;
        case 4:
          return j.fn.call(j.context, A, $, z), !0;
        case 5:
          return j.fn.call(j.context, A, $, z, W), !0;
        case 6:
          return j.fn.call(j.context, A, $, z, W, H), !0;
      }
      for (ae = 1, K = new Array(pe - 1); ae < pe; ae++)
        K[ae - 1] = arguments[ae];
      j.fn.apply(j.context, K);
    } else {
      var He = j.length, ne;
      for (ae = 0; ae < He; ae++)
        switch (j[ae].once && this.removeListener(y, j[ae].fn, void 0, !0), pe) {
          case 1:
            j[ae].fn.call(j[ae].context);
            break;
          case 2:
            j[ae].fn.call(j[ae].context, A);
            break;
          case 3:
            j[ae].fn.call(j[ae].context, A, $);
            break;
          case 4:
            j[ae].fn.call(j[ae].context, A, $, z);
            break;
          default:
            if (!K)
              for (ne = 1, K = new Array(pe - 1); ne < pe; ne++)
                K[ne - 1] = arguments[ne];
            j[ae].fn.apply(j[ae].context, K);
        }
    }
    return !0;
  }, C.prototype.on = function(y, A, $) {
    return b(this, y, A, $, !1);
  }, C.prototype.once = function(y, A, $) {
    return b(this, y, A, $, !0);
  }, C.prototype.removeListener = function(y, A, $, z) {
    var W = i ? i + y : y;
    if (!this._events[W])
      return this;
    if (!A)
      return _(this, W), this;
    var H = this._events[W];
    if (H.fn)
      H.fn === A && (!z || H.once) && (!$ || H.context === $) && _(this, W);
    else {
      for (var re = 0, j = [], pe = H.length; re < pe; re++)
        (H[re].fn !== A || z && !H[re].once || $ && H[re].context !== $) && j.push(H[re]);
      j.length ? this._events[W] = j.length === 1 ? j[0] : j : _(this, W);
    }
    return this;
  }, C.prototype.removeAllListeners = function(y) {
    var A;
    return y ? (A = i ? i + y : y, this._events[A] && _(this, A)) : (this._events = new p(), this._eventsCount = 0), this;
  }, C.prototype.off = C.prototype.removeListener, C.prototype.addListener = C.prototype.on, C.prefixed = i, C.EventEmitter = C, L.exports = C;
})(ni);
var di = ni.exports;
const fi = /* @__PURE__ */ ci(di), ri = Symbol("instance"), jn = Symbol("cacheResult");
class ei {
  constructor(c, i, p) {
    this.oldState = c, this.newState = i, this.action = p, this.aborted = !1;
  }
  abort(c) {
    this.aborted = !0, Mn.call(c, this.oldState, new Error(`action '${this.action}' aborted`));
  }
  toString() {
    return `${this.action}ing`;
  }
}
class zn extends Error {
  /*************  ✨ Codeium Command ⭐  *************/
  /**
     * Create a new instance of FSMError.
     * @param state current state.
     * @param message error message.
     * @param cause original error.
  /******  625fa23f-3ee1-42ac-94bd-4f6ffd4578ff  *******/
  constructor(c, i, p) {
    super(i), this.state = c, this.message = i, this.cause = p;
  }
}
function hi(L) {
  return typeof L == "object" && L && "then" in L;
}
const Bn = /* @__PURE__ */ new Map();
function Yt(L, c, i = {}) {
  return (p, h, b) => {
    const _ = i.action || h;
    if (!i.context) {
      const w = Bn.get(p) || [];
      Bn.has(p) || Bn.set(p, w), w.push({ from: L, to: c, action: _ });
    }
    const C = b.value;
    b.value = function(...w) {
      let y = this;
      if (i.context && (y = me.get(typeof i.context == "function" ? i.context.call(this, ...w) : i.context)), y.state === c)
        return i.sync ? y[jn] : Promise.resolve(y[jn]);
      y.state instanceof ei && y.state.action == i.abortAction && y.state.abort(y);
      let A = null;
      Array.isArray(L) ? L.length == 0 ? y.state instanceof ei && y.state.abort(y) : (typeof y.state != "string" || !L.includes(y.state)) && (A = new zn(y._state, `${y.name} ${_} to ${c} failed: current state ${y._state} not from ${L.join("|")}`)) : L !== y.state && (A = new zn(y._state, `${y.name} ${_} to ${c} failed: current state ${y._state} not from ${L}`));
      const $ = (j) => {
        if (i.fail && i.fail.call(this, j), i.sync) {
          if (i.ignoreError)
            return j;
          throw j;
        } else
          return i.ignoreError ? Promise.resolve(j) : Promise.reject(j);
      };
      if (A)
        return $(A);
      const z = y.state, W = new ei(z, c, _);
      Mn.call(y, W);
      const H = (j) => {
        var pe;
        return y[jn] = j, W.aborted || (Mn.call(y, c), (pe = i.success) === null || pe === void 0 || pe.call(this, y[jn])), j;
      }, re = (j) => (Mn.call(y, z, j), $(j));
      try {
        const j = C.apply(this, w);
        return hi(j) ? j.then(H).catch(re) : i.sync ? H(j) : Promise.resolve(H(j));
      } catch (j) {
        return re(new zn(y._state, `${y.name} ${_} from ${L} to ${c} failed: ${j}`, j instanceof Error ? j : new Error(String(j))));
      }
    };
  };
}
function pi(...L) {
  return (c, i, p) => {
    const h = p.value, b = i;
    p.value = function(..._) {
      if (!L.includes(this.state.toString()))
        throw new zn(this.state, `${this.name} ${b} failed: current state ${this.state} not in ${L}`);
      return h.apply(this, _);
    };
  };
}
const vi = (() => typeof window < "u" && window.__AFSM__ ? (i, p) => {
  window.dispatchEvent(new CustomEvent(i, { detail: p }));
} : typeof importScripts < "u" ? (i, p) => {
  postMessage({ type: i, payload: p });
} : () => {
})();
function Mn(L, c) {
  const i = this._state;
  this._state = L;
  const p = L.toString();
  L && this.emit(p, i), this.emit(me.STATECHANGED, L, i, c), this.updateDevTools({ value: L, old: i, err: c instanceof Error ? c.message : String(c) });
}
class me extends fi {
  constructor(c, i, p) {
    super(), this.name = c, this.groupName = i, this._state = me.INIT, c || (c = Date.now().toString(36)), p ? Object.setPrototypeOf(this, p) : p = Object.getPrototypeOf(this), i || (this.groupName = this.constructor.name);
    const h = p[ri];
    h ? this.name = h.name + "-" + h.count++ : p[ri] = { name: this.name, count: 0 }, this.updateDevTools({ diagram: this.stateDiagram });
  }
  get stateDiagram() {
    const c = Object.getPrototypeOf(this), i = Bn.get(c) || [];
    let p = /* @__PURE__ */ new Set(), h = [], b = [];
    const _ = /* @__PURE__ */ new Set(), C = Object.getPrototypeOf(c);
    Bn.has(C) && (C.stateDiagram.forEach((y) => p.add(y)), C.allStates.forEach((y) => _.add(y))), i.forEach(({ from: y, to: A, action: $ }) => {
      typeof y == "string" ? h.push({ from: y, to: A, action: $ }) : y.length ? y.forEach((z) => {
        h.push({ from: z, to: A, action: $ });
      }) : b.push({ to: A, action: $ });
    }), h.forEach(({ from: y, to: A, action: $ }) => {
      _.add(y), _.add(A), _.add($ + "ing"), p.add(`${y} --> ${$}ing : ${$}`), p.add(`${$}ing --> ${A} : ${$} 🟢`), p.add(`${$}ing --> ${y} : ${$} 🔴`);
    }), b.forEach(({ to: y, action: A }) => {
      p.add(`${A}ing --> ${y} : ${A} 🟢`), _.forEach(($) => {
        $ !== y && p.add(`${$} --> ${A}ing : ${A}`);
      });
    });
    const w = [...p];
    return Object.defineProperties(c, {
      stateDiagram: { value: w },
      allStates: { value: _ }
    }), w;
  }
  static get(c) {
    let i;
    return typeof c == "string" ? (i = me.instances.get(c), i || me.instances.set(c, i = new me(c, void 0, Object.create(me.prototype)))) : (i = me.instances2.get(c), i || me.instances2.set(c, i = new me(c.constructor.name, void 0, Object.create(me.prototype)))), i;
  }
  static getState(c) {
    var i;
    return (i = me.get(c)) === null || i === void 0 ? void 0 : i.state;
  }
  updateDevTools(c = {}) {
    vi(me.UPDATEAFSM, Object.assign({ name: this.name, group: this.groupName }, c));
  }
  get state() {
    return this._state;
  }
  set state(c) {
    Mn.call(this, c);
  }
}
me.STATECHANGED = "stateChanged";
me.UPDATEAFSM = "updateAFSM";
me.INIT = "[*]";
me.ON = "on";
me.OFF = "off";
me.instances = /* @__PURE__ */ new Map();
me.instances2 = /* @__PURE__ */ new WeakMap();
var mi = Object.defineProperty, gi = Object.getOwnPropertyDescriptor, Wn = (L, c, i, p) => {
  for (var h = p > 1 ? void 0 : p ? gi(c, i) : c, b = L.length - 1, _; b >= 0; b--)
    (_ = L[b]) && (h = (p ? _(c, i, h) : _(h)) || h);
  return p && h && mi(c, i, h), h;
};
function yi() {
  var L;
  self.onmessage = (c) => {
    if (c.data.type === "init") {
      const { canvas: i, wasmScript: p, wasmBinary: h } = c.data, b = i == null ? void 0 : i.getContext("2d");
      let _ = 0, C = 0;
      const w = {
        wasmBinary: h,
        postRun: () => {
          L = new w.VideoDecoder({
            videoInfo(y, A) {
              _ = y, C = A, console.log("video info", y, A);
            },
            yuvData(y, A) {
              const $ = _ * C, z = $ >> 2;
              let W = w.HEAPU32[y >> 2], H = w.HEAPU32[(y >> 2) + 1], re = w.HEAPU32[(y >> 2) + 2], j = w.HEAPU8.subarray(W, W + $), pe = w.HEAPU8.subarray(H, H + z), K = w.HEAPU8.subarray(re, re + z);
              const ae = new Uint8Array($ + z + z);
              ae.set(j), ae.set(pe, $), ae.set(K, $ + z);
              const He = new VideoFrame(ae, {
                codedWidth: _,
                codedHeight: C,
                format: "I420",
                timestamp: A
              });
              i ? (b == null || b.drawImage(He, 0, 0, i.width, i.height), b == null || b.commit()) : self.postMessage({ type: "yuvData", videoFrame: He }, [He]);
            }
          }), self.postMessage({ type: "ready" });
        }
      };
      Function("var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;return " + p)()(w);
    } else if (c.data.type === "decode") {
      const { packet: i } = c.data;
      L == null || L.decode(i.data, i.type == "key", i.timestamp);
    } else if (c.data.type === "setCodec") {
      const { codec: i, format: p, description: h } = c.data;
      L == null || L.setCodec(i, p, h ?? "");
    }
  };
}
class On extends me {
  constructor(c, i, p = !1, h, b = !1) {
    super(), this.createModule = c, this.wasmBinary = i, this.workerMode = p, this.canvas = h, this.yuvMode = b, this.module = {}, this.width = 0, this.height = 0;
  }
  async initialize(c) {
    var p;
    if (this.workerMode) {
      const h = /\{(.+)\}/s.exec(yi.toString())[1];
      this.worker = new Worker(URL.createObjectURL(new Blob([h], { type: "text/javascript" })));
      const b = (p = this.canvas) == null ? void 0 : p.transferControlToOffscreen(), _ = await this.wasmBinary;
      return console.warn("worker mode", _), this.worker.postMessage({ type: "init", canvas: b, wasmScript: this.createModule.toString(), wasmBinary: _ }, b ? [b, _] : [_]), new Promise((C) => {
        this.worker.onmessage = (w) => {
          if (w.data.type === "ready")
            delete this.wasmBinary, C(), console.warn("worker mode initialize success");
          else if (w.data.type === "yuvData") {
            const { videoFrame: y } = w.data;
            this.emit(It.VideoFrame, y);
          }
        };
      });
    }
    const i = this.module;
    return this.wasmBinary && (i.wasmBinary = await this.wasmBinary), i.print = (h) => console.log(h), i.printErr = (h) => console.log(`[JS] ERROR: ${h}`), i.onAbort = () => console.log("[JS] FATAL: WASM ABORTED"), new Promise((h) => {
      i.postRun = (b) => {
        this.decoder = new this.module.VideoDecoder(this), console.log("video soft decoder initialize success"), h();
      }, c && Object.assign(i, c), this.createModule(i);
    });
  }
  configure(c) {
    var h, b;
    this.config = c;
    const i = this.config.codec.startsWith("avc") ? "avc" : "hevc", p = this.config.description ? i == "avc" ? "avcc" : "hvcc" : "annexb";
    (h = this.decoder) == null || h.setCodec(i, p, this.config.description ?? ""), (b = this.worker) == null || b.postMessage({ type: "setCodec", codec: i, format: p, description: this.config.description });
  }
  decode(c) {
    var i, p;
    (i = this.decoder) == null || i.decode(c.data, c.type == "key", c.timestamp), this.state === "configured" && ((p = this.worker) == null || p.postMessage({ type: "decode", packet: c }));
  }
  flush() {
  }
  reset() {
    this.config = void 0, this.decoder && this.decoder.clear();
  }
  close() {
    this.removeAllListeners(), this.decoder && (this.decoder.clear(), this.decoder.delete());
  }
  // wasm callback function
  videoInfo(c, i) {
    this.width = c, this.height = i;
    let p = {
      width: c,
      height: i
    };
    this.emit(It.VideoCodecInfo, p);
  }
  yuvData(c, i) {
    if (!this.module)
      return;
    const p = this.width * this.height, h = p >> 2;
    let b = this.module.HEAPU32[c >> 2], _ = this.module.HEAPU32[(c >> 2) + 1], C = this.module.HEAPU32[(c >> 2) + 2], w = this.module.HEAPU8.subarray(b, b + p), y = this.module.HEAPU8.subarray(_, _ + h), A = this.module.HEAPU8.subarray(C, C + h);
    if (this.yuvMode) {
      this.emit(It.VideoFrame, [w, y, A]);
      return;
    }
    const $ = new Uint8Array(p + h + h);
    $.set(w), $.set(y, p), $.set(A, p + h), this.emit(It.VideoFrame, new VideoFrame($, {
      codedWidth: this.width,
      codedHeight: this.height,
      format: "I420",
      timestamp: i
    }));
  }
  errorInfo(c) {
    let i = {
      errMsg: c
    };
    this.emit(It.Error, i);
  }
}
Wn([
  Yt([me.INIT, "closed"], "initialized")
], On.prototype, "initialize", 1);
Wn([
  Yt("initialized", "configured")
], On.prototype, "configure", 1);
Wn([
  Yt([], me.INIT)
], On.prototype, "reset", 1);
Wn([
  Yt([], "closed")
], On.prototype, "close", 1);
(() => {
  var L = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
  return function(c = {}) {
    var i = c, p, h;
    i.ready = new Promise((d, f) => {
      p = d, h = f;
    });
    var b = Object.assign({}, i), _ = typeof window == "object", C = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && process.versions.node;
    var w = "";
    function y(d) {
      return i.locateFile ? i.locateFile(d, w) : w + d;
    }
    var A;
    (_ || C) && (C ? w = self.location.href : typeof document < "u" && document.currentScript && (w = document.currentScript.src), L && (w = L), w.indexOf("blob:") !== 0 ? w = w.substr(0, w.replace(/[?#].*/, "").lastIndexOf("/") + 1) : w = "", C && (A = (d) => {
      var f = new XMLHttpRequest();
      return f.open("GET", d, !1), f.responseType = "arraybuffer", f.send(null), new Uint8Array(f.response);
    }));
    var $ = i.print || console.log.bind(console), z = i.printErr || console.error.bind(console);
    Object.assign(i, b), b = null, i.arguments && i.arguments, i.thisProgram && i.thisProgram, i.quit && i.quit;
    var W;
    i.wasmBinary && (W = i.wasmBinary), i.noExitRuntime, typeof WebAssembly != "object" && Te("no native wasm support detected");
    var H, re, j = !1, pe, K, ae, He, ne, Q, Pe, tt;
    function V() {
      var d = H.buffer;
      i.HEAP8 = pe = new Int8Array(d), i.HEAP16 = ae = new Int16Array(d), i.HEAP32 = ne = new Int32Array(d), i.HEAPU8 = K = new Uint8Array(d), i.HEAPU16 = He = new Uint16Array(d), i.HEAPU32 = Q = new Uint32Array(d), i.HEAPF32 = Pe = new Float32Array(d), i.HEAPF64 = tt = new Float64Array(d);
    }
    var X, Lt = [], jt = [], _r = [];
    function Zt() {
      if (i.preRun)
        for (typeof i.preRun == "function" && (i.preRun = [i.preRun]); i.preRun.length; )
          tr(i.preRun.shift());
      Pt(Lt);
    }
    function Jt() {
      Pt(jt);
    }
    function er() {
      if (i.postRun)
        for (typeof i.postRun == "function" && (i.postRun = [i.postRun]); i.postRun.length; )
          Lr(i.postRun.shift());
      Pt(_r);
    }
    function tr(d) {
      Lt.unshift(d);
    }
    function Ir(d) {
      jt.unshift(d);
    }
    function Lr(d) {
      _r.unshift(d);
    }
    var st = 0, Et = null;
    function jr(d) {
      st++, i.monitorRunDependencies && i.monitorRunDependencies(st);
    }
    function zr(d) {
      if (st--, i.monitorRunDependencies && i.monitorRunDependencies(st), st == 0 && Et) {
        var f = Et;
        Et = null, f();
      }
    }
    function Te(d) {
      i.onAbort && i.onAbort(d), d = "Aborted(" + d + ")", z(d), j = !0, d += ". Build with -sASSERTIONS for more info.";
      var f = new WebAssembly.RuntimeError(d);
      throw h(f), f;
    }
    var Ke = "data:application/octet-stream;base64,";
    function Ln(d) {
      return d.startsWith(Ke);
    }
    var Ve;
    Ve = "videodec_simd.wasm", Ln(Ve) || (Ve = y(Ve));
    function rt(d) {
      if (d == Ve && W)
        return new Uint8Array(W);
      if (A)
        return A(d);
      throw "both async and sync fetching of the wasm failed";
    }
    function Ae(d) {
      return !W && (_ || C) && typeof fetch == "function" ? fetch(d, { credentials: "same-origin" }).then((f) => {
        if (!f.ok)
          throw "failed to load wasm binary file at '" + d + "'";
        return f.arrayBuffer();
      }).catch(() => rt(d)) : Promise.resolve().then(() => rt(d));
    }
    function br(d, f, v) {
      return Ae(d).then((E) => WebAssembly.instantiate(E, f)).then((E) => E).then(v, (E) => {
        z("failed to asynchronously prepare wasm: " + E), Te(E);
      });
    }
    function rr(d, f, v, E) {
      return !d && typeof WebAssembly.instantiateStreaming == "function" && !Ln(f) && typeof fetch == "function" ? fetch(f, { credentials: "same-origin" }).then((D) => {
        var x = WebAssembly.instantiateStreaming(D, v);
        return x.then(E, function(B) {
          return z("wasm streaming compile failed: " + B), z("falling back to ArrayBuffer instantiation"), br(f, v, E);
        });
      }) : br(f, v, E);
    }
    function Oe() {
      var d = { a: $n };
      function f(E, D) {
        var x = E.exports;
        return re = x, H = re.v, V(), X = re.z, Ir(re.w), zr(), x;
      }
      jr();
      function v(E) {
        f(E.instance);
      }
      if (i.instantiateWasm)
        try {
          return i.instantiateWasm(d, f);
        } catch (E) {
          z("Module.instantiateWasm callback failed with error: " + E), h(E);
        }
      return rr(W, Ve, d, v).catch(h), {};
    }
    var Pt = (d) => {
      for (; d.length > 0; )
        d.shift()(i);
    };
    function Wr(d) {
      this.excPtr = d, this.ptr = d - 24, this.set_type = function(f) {
        Q[this.ptr + 4 >> 2] = f;
      }, this.get_type = function() {
        return Q[this.ptr + 4 >> 2];
      }, this.set_destructor = function(f) {
        Q[this.ptr + 8 >> 2] = f;
      }, this.get_destructor = function() {
        return Q[this.ptr + 8 >> 2];
      }, this.set_caught = function(f) {
        f = f ? 1 : 0, pe[this.ptr + 12 >> 0] = f;
      }, this.get_caught = function() {
        return pe[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(f) {
        f = f ? 1 : 0, pe[this.ptr + 13 >> 0] = f;
      }, this.get_rethrown = function() {
        return pe[this.ptr + 13 >> 0] != 0;
      }, this.init = function(f, v) {
        this.set_adjusted_ptr(0), this.set_type(f), this.set_destructor(v);
      }, this.set_adjusted_ptr = function(f) {
        Q[this.ptr + 16 >> 2] = f;
      }, this.get_adjusted_ptr = function() {
        return Q[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var f = Ur(this.get_type());
        if (f)
          return Q[this.excPtr >> 2];
        var v = this.get_adjusted_ptr();
        return v !== 0 ? v : this.excPtr;
      };
    }
    var zt = 0;
    function Hr(d, f, v) {
      var E = new Wr(d);
      throw E.init(f, v), zt = d, zt;
    }
    function Vr(d, f, v, E, D) {
    }
    function R(d) {
      switch (d) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError(`Unknown type size: ${d}`);
      }
    }
    function Y() {
      for (var d = new Array(256), f = 0; f < 256; ++f)
        d[f] = String.fromCharCode(f);
      gt = d;
    }
    var gt = void 0;
    function Fe(d) {
      for (var f = "", v = d; K[v]; )
        f += gt[K[v++]];
      return f;
    }
    var nt = {}, at = {}, Wt = {}, G = void 0;
    function ce(d) {
      throw new G(d);
    }
    var Ht = void 0;
    function ye(d) {
      throw new Ht(d);
    }
    function ut(d, f, v) {
      d.forEach(function(F) {
        Wt[F] = f;
      });
      function E(F) {
        var q = v(F);
        q.length !== d.length && ye("Mismatched type converter count");
        for (var M = 0; M < d.length; ++M)
          Re(d[M], q[M]);
      }
      var D = new Array(f.length), x = [], B = 0;
      f.forEach((F, q) => {
        at.hasOwnProperty(F) ? D[q] = at[F] : (x.push(F), nt.hasOwnProperty(F) || (nt[F] = []), nt[F].push(() => {
          D[q] = at[F], ++B, B === x.length && E(D);
        }));
      }), x.length === 0 && E(D);
    }
    function Ie(d, f, v = {}) {
      var E = f.name;
      if (d || ce(`type "${E}" must have a positive integer typeid pointer`), at.hasOwnProperty(d)) {
        if (v.ignoreDuplicateRegistrations)
          return;
        ce(`Cannot register type '${E}' twice`);
      }
      if (at[d] = f, delete Wt[d], nt.hasOwnProperty(d)) {
        var D = nt[d];
        delete nt[d], D.forEach((x) => x());
      }
    }
    function Re(d, f, v = {}) {
      if (!("argPackAdvance" in f))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      return Ie(d, f, v);
    }
    function Tt(d, f, v, E, D) {
      var x = R(v);
      f = Fe(f), Re(d, { name: f, fromWireType: function(B) {
        return !!B;
      }, toWireType: function(B, F) {
        return F ? E : D;
      }, argPackAdvance: 8, readValueFromPointer: function(B) {
        var F;
        if (v === 1)
          F = pe;
        else if (v === 2)
          F = ae;
        else if (v === 4)
          F = ne;
        else
          throw new TypeError("Unknown boolean type size: " + f);
        return this.fromWireType(F[B >> x]);
      }, destructorFunction: null });
    }
    function kt(d) {
      if (!(this instanceof Ne) || !(d instanceof Ne))
        return !1;
      for (var f = this.$$.ptrType.registeredClass, v = this.$$.ptr, E = d.$$.ptrType.registeredClass, D = d.$$.ptr; f.baseClass; )
        v = f.upcast(v), f = f.baseClass;
      for (; E.baseClass; )
        D = E.upcast(D), E = E.baseClass;
      return f === E && v === D;
    }
    function Ct(d) {
      return { count: d.count, deleteScheduled: d.deleteScheduled, preservePointerOnDelete: d.preservePointerOnDelete, ptr: d.ptr, ptrType: d.ptrType, smartPtr: d.smartPtr, smartPtrType: d.smartPtrType };
    }
    function nr(d) {
      function f(v) {
        return v.$$.ptrType.registeredClass.name;
      }
      ce(f(d) + " instance already deleted");
    }
    var Ce = !1;
    function Vt(d) {
    }
    function I(d) {
      d.smartPtr ? d.smartPtrType.rawDestructor(d.smartPtr) : d.ptrType.registeredClass.rawDestructor(d.ptr);
    }
    function Er(d) {
      d.count.value -= 1;
      var f = d.count.value === 0;
      f && I(d);
    }
    function Pr(d, f, v) {
      if (f === v)
        return d;
      if (v.baseClass === void 0)
        return null;
      var E = Pr(d, f, v.baseClass);
      return E === null ? null : v.downcast(E);
    }
    var Tr = {};
    function Nr() {
      return Object.keys($t).length;
    }
    function qr() {
      var d = [];
      for (var f in $t)
        $t.hasOwnProperty(f) && d.push($t[f]);
      return d;
    }
    var Qe = [];
    function o() {
      for (; Qe.length; ) {
        var d = Qe.pop();
        d.$$.deleteScheduled = !1, d.delete();
      }
    }
    var lt = void 0;
    function ue(d) {
      lt = d, Qe.length && lt && lt(o);
    }
    function Gr() {
      i.getInheritedInstanceCount = Nr, i.getLiveInheritedInstances = qr, i.flushPendingDeletes = o, i.setDelayFunction = ue;
    }
    var $t = {};
    function Xr(d, f) {
      for (f === void 0 && ce("ptr should not be undefined"); d.baseClass; )
        f = d.upcast(f), d = d.baseClass;
      return f;
    }
    function St(d, f) {
      return f = Xr(d, f), $t[f];
    }
    function Nt(d, f) {
      (!f.ptrType || !f.ptr) && ye("makeClassHandle requires ptr and ptrType");
      var v = !!f.smartPtrType, E = !!f.smartPtr;
      return v !== E && ye("Both smartPtrType and smartPtr must be specified"), f.count = { value: 1 }, de(Object.create(d, { $$: { value: f } }));
    }
    function ir(d) {
      var f = this.getPointee(d);
      if (!f)
        return this.destructor(d), null;
      var v = St(this.registeredClass, f);
      if (v !== void 0) {
        if (v.$$.count.value === 0)
          return v.$$.ptr = f, v.$$.smartPtr = d, v.clone();
        var E = v.clone();
        return this.destructor(d), E;
      }
      function D() {
        return this.isSmartPointer ? Nt(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: f, smartPtrType: this, smartPtr: d }) : Nt(this.registeredClass.instancePrototype, { ptrType: this, ptr: d });
      }
      var x = this.registeredClass.getActualType(f), B = Tr[x];
      if (!B)
        return D.call(this);
      var F;
      this.isConst ? F = B.constPointerType : F = B.pointerType;
      var q = Pr(f, this.registeredClass, F.registeredClass);
      return q === null ? D.call(this) : this.isSmartPointer ? Nt(F.registeredClass.instancePrototype, { ptrType: F, ptr: q, smartPtrType: this, smartPtr: d }) : Nt(F.registeredClass.instancePrototype, { ptrType: F, ptr: q });
    }
    var de = function(d) {
      return typeof FinalizationRegistry > "u" ? (de = (f) => f, d) : (Ce = new FinalizationRegistry((f) => {
        Er(f.$$);
      }), de = (f) => {
        var v = f.$$, E = !!v.smartPtr;
        if (E) {
          var D = { $$: v };
          Ce.register(f, D, f);
        }
        return f;
      }, Vt = (f) => Ce.unregister(f), de(d));
    };
    function Le() {
      if (this.$$.ptr || nr(this), this.$$.preservePointerOnDelete)
        return this.$$.count.value += 1, this;
      var d = de(Object.create(Object.getPrototypeOf(this), { $$: { value: Ct(this.$$) } }));
      return d.$$.count.value += 1, d.$$.deleteScheduled = !1, d;
    }
    function xe() {
      this.$$.ptr || nr(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && ce("Object already scheduled for deletion"), Vt(this), Er(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
    }
    function ct() {
      return !this.$$.ptr;
    }
    function je() {
      return this.$$.ptr || nr(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && ce("Object already scheduled for deletion"), Qe.push(this), Qe.length === 1 && lt && lt(o), this.$$.deleteScheduled = !0, this;
    }
    function N() {
      Ne.prototype.isAliasOf = kt, Ne.prototype.clone = Le, Ne.prototype.delete = xe, Ne.prototype.isDeleted = ct, Ne.prototype.deleteLater = je;
    }
    function Ne() {
    }
    var dt = 48, Ye = 57;
    function qt(d) {
      if (d === void 0)
        return "_unknown";
      d = d.replace(/[^a-zA-Z0-9_]/g, "$");
      var f = d.charCodeAt(0);
      return f >= dt && f <= Ye ? `_${d}` : d;
    }
    function we(d, f) {
      return d = qt(d), { [d]: function() {
        return f.apply(this, arguments);
      } }[d];
    }
    function kr(d, f, v) {
      if (d[f].overloadTable === void 0) {
        var E = d[f];
        d[f] = function() {
          return d[f].overloadTable.hasOwnProperty(arguments.length) || ce(`Function '${v}' called with an invalid number of arguments (${arguments.length}) - expects one of (${d[f].overloadTable})!`), d[f].overloadTable[arguments.length].apply(this, arguments);
        }, d[f].overloadTable = [], d[f].overloadTable[E.argCount] = E;
      }
    }
    function Kr(d, f, v) {
      i.hasOwnProperty(d) ? ((v === void 0 || i[d].overloadTable !== void 0 && i[d].overloadTable[v] !== void 0) && ce(`Cannot register public name '${d}' twice`), kr(i, d, d), i.hasOwnProperty(v) && ce(`Cannot register multiple overloads of a function with the same number of arguments (${v})!`), i[d].overloadTable[v] = f) : (i[d] = f, v !== void 0 && (i[d].numArguments = v));
    }
    function Qr(d, f, v, E, D, x, B, F) {
      this.name = d, this.constructor = f, this.instancePrototype = v, this.rawDestructor = E, this.baseClass = D, this.getActualType = x, this.upcast = B, this.downcast = F, this.pureVirtualFunctions = [];
    }
    function ft(d, f, v) {
      for (; f !== v; )
        f.upcast || ce(`Expected null or instance of ${v.name}, got an instance of ${f.name}`), d = f.upcast(d), f = f.baseClass;
      return d;
    }
    function Dt(d, f) {
      if (f === null)
        return this.isReference && ce(`null is not a valid ${this.name}`), 0;
      f.$$ || ce(`Cannot pass "${lr(f)}" as a ${this.name}`), f.$$.ptr || ce(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var v = f.$$.ptrType.registeredClass, E = ft(f.$$.ptr, v, this.registeredClass);
      return E;
    }
    function or(d, f) {
      var v;
      if (f === null)
        return this.isReference && ce(`null is not a valid ${this.name}`), this.isSmartPointer ? (v = this.rawConstructor(), d !== null && d.push(this.rawDestructor, v), v) : 0;
      f.$$ || ce(`Cannot pass "${lr(f)}" as a ${this.name}`), f.$$.ptr || ce(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && f.$$.ptrType.isConst && ce(`Cannot convert argument of type ${f.$$.smartPtrType ? f.$$.smartPtrType.name : f.$$.ptrType.name} to parameter type ${this.name}`);
      var E = f.$$.ptrType.registeredClass;
      if (v = ft(f.$$.ptr, E, this.registeredClass), this.isSmartPointer)
        switch (f.$$.smartPtr === void 0 && ce("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            f.$$.smartPtrType === this ? v = f.$$.smartPtr : ce(`Cannot convert argument of type ${f.$$.smartPtrType ? f.$$.smartPtrType.name : f.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            v = f.$$.smartPtr;
            break;
          case 2:
            if (f.$$.smartPtrType === this)
              v = f.$$.smartPtr;
            else {
              var D = f.clone();
              v = this.rawShare(v, Xt.toHandle(function() {
                D.delete();
              })), d !== null && d.push(this.rawDestructor, v);
            }
            break;
          default:
            ce("Unsupporting sharing policy");
        }
      return v;
    }
    function Yr(d, f) {
      if (f === null)
        return this.isReference && ce(`null is not a valid ${this.name}`), 0;
      f.$$ || ce(`Cannot pass "${lr(f)}" as a ${this.name}`), f.$$.ptr || ce(`Cannot pass deleted object as a pointer of type ${this.name}`), f.$$.ptrType.isConst && ce(`Cannot convert argument of type ${f.$$.ptrType.name} to parameter type ${this.name}`);
      var v = f.$$.ptrType.registeredClass, E = ft(f.$$.ptr, v, this.registeredClass);
      return E;
    }
    function yt(d) {
      return this.fromWireType(ne[d >> 2]);
    }
    function sr(d) {
      return this.rawGetPointee && (d = this.rawGetPointee(d)), d;
    }
    function ar(d) {
      this.rawDestructor && this.rawDestructor(d);
    }
    function Zr(d) {
      d !== null && d.delete();
    }
    function Jr() {
      _e.prototype.getPointee = sr, _e.prototype.destructor = ar, _e.prototype.argPackAdvance = 8, _e.prototype.readValueFromPointer = yt, _e.prototype.deleteObject = Zr, _e.prototype.fromWireType = ir;
    }
    function _e(d, f, v, E, D, x, B, F, q, M, te) {
      this.name = d, this.registeredClass = f, this.isReference = v, this.isConst = E, this.isSmartPointer = D, this.pointeeType = x, this.sharingPolicy = B, this.rawGetPointee = F, this.rawConstructor = q, this.rawShare = M, this.rawDestructor = te, !D && f.baseClass === void 0 ? E ? (this.toWireType = Dt, this.destructorFunction = null) : (this.toWireType = Yr, this.destructorFunction = null) : this.toWireType = or;
    }
    function At(d, f, v) {
      i.hasOwnProperty(d) || ye("Replacing nonexistant public symbol"), i[d].overloadTable !== void 0 && v !== void 0 ? i[d].overloadTable[v] = f : (i[d] = f, i[d].argCount = v);
    }
    var Ze = (d, f, v) => {
      var E = i["dynCall_" + d];
      return v && v.length ? E.apply(null, [f].concat(v)) : E.call(null, f);
    }, Gt = [], Cr = (d) => {
      var f = Gt[d];
      return f || (d >= Gt.length && (Gt.length = d + 1), Gt[d] = f = X.get(d)), f;
    }, Je = (d, f, v) => {
      if (d.includes("j"))
        return Ze(d, f, v);
      var E = Cr(f).apply(null, v);
      return E;
    }, en = (d, f) => {
      var v = [];
      return function() {
        return v.length = 0, Object.assign(v, arguments), Je(d, f, v);
      };
    };
    function wt(d, f) {
      d = Fe(d);
      function v() {
        return d.includes("j") ? en(d, f) : Cr(f);
      }
      var E = v();
      return typeof E != "function" && ce(`unknown function pointer with signature ${d}: ${f}`), E;
    }
    function ht(d, f) {
      var v = we(f, function(E) {
        this.name = f, this.message = E;
        var D = new Error(E).stack;
        D !== void 0 && (this.stack = this.toString() + `
` + D.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return v.prototype = Object.create(d.prototype), v.prototype.constructor = v, v.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, v;
    }
    var $r = void 0;
    function qe(d) {
      var f = xr(d), v = Fe(f);
      return et(f), v;
    }
    function ur(d, f) {
      var v = [], E = {};
      function D(x) {
        if (!E[x] && !at[x]) {
          if (Wt[x]) {
            Wt[x].forEach(D);
            return;
          }
          v.push(x), E[x] = !0;
        }
      }
      throw f.forEach(D), new $r(`${d}: ` + v.map(qe).join([", "]));
    }
    function tn(d, f, v, E, D, x, B, F, q, M, te, ie, le) {
      te = Fe(te), x = wt(D, x), F && (F = wt(B, F)), M && (M = wt(q, M)), le = wt(ie, le);
      var fe = qt(te);
      Kr(fe, function() {
        ur(`Cannot construct ${te} due to unbound types`, [E]);
      }), ut([d, f, v], E ? [E] : [], function(Ee) {
        Ee = Ee[0];
        var Me, De;
        E ? (Me = Ee.registeredClass, De = Me.instancePrototype) : De = Ne.prototype;
        var ot = we(fe, function() {
          if (Object.getPrototypeOf(this) !== yr)
            throw new G("Use 'new' to construct " + te);
          if (ze.constructor_body === void 0)
            throw new G(te + " has no accessible constructor");
          var Ge = ze.constructor_body[arguments.length];
          if (Ge === void 0)
            throw new G(`Tried to invoke ctor of ${te} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(ze.constructor_body).toString()}) parameters instead!`);
          return Ge.apply(this, arguments);
        }), yr = Object.create(De, { constructor: { value: ot } });
        ot.prototype = yr;
        var ze = new Qr(te, ot, yr, le, Me, x, F, M);
        ze.baseClass && (ze.baseClass.__derivedClasses === void 0 && (ze.baseClass.__derivedClasses = []), ze.baseClass.__derivedClasses.push(ze));
        var Sn = new _e(te, ze, !0, !1, !1), bt = new _e(te + "*", ze, !1, !1, !1), Mr = new _e(te + " const*", ze, !1, !0, !1);
        return Tr[d] = { pointerType: bt, constPointerType: Mr }, At(fe, ot), [Sn, bt, Mr];
      });
    }
    function Sr(d, f) {
      for (var v = [], E = 0; E < d; E++)
        v.push(Q[f + E * 4 >> 2]);
      return v;
    }
    function rn(d) {
      for (; d.length; ) {
        var f = d.pop(), v = d.pop();
        v(f);
      }
    }
    function Dr(d, f) {
      if (!(d instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof d} which is not a function`);
      var v = we(d.name || "unknownFunctionName", function() {
      });
      v.prototype = d.prototype;
      var E = new v(), D = d.apply(E, f);
      return D instanceof Object ? D : E;
    }
    function ke(d, f, v, E, D, x) {
      var B = f.length;
      B < 2 && ce("argTypes array size mismatch! Must at least get return value and 'this' types!");
      for (var F = f[1] !== null && v !== null, q = !1, M = 1; M < f.length; ++M)
        if (f[M] !== null && f[M].destructorFunction === void 0) {
          q = !0;
          break;
        }
      for (var te = f[0].name !== "void", ie = "", le = "", M = 0; M < B - 2; ++M)
        ie += (M !== 0 ? ", " : "") + "arg" + M, le += (M !== 0 ? ", " : "") + "arg" + M + "Wired";
      var fe = `
        return function ${qt(d)}(${ie}) {
        if (arguments.length !== ${B - 2}) {
          throwBindingError('function ${d} called with ${arguments.length} arguments, expected ${B - 2} args!');
        }`;
      q && (fe += `var destructors = [];
`);
      var Ee = q ? "destructors" : "null", Me = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"], De = [ce, E, D, rn, f[0], f[1]];
      F && (fe += "var thisWired = classParam.toWireType(" + Ee + `, this);
`);
      for (var M = 0; M < B - 2; ++M)
        fe += "var arg" + M + "Wired = argType" + M + ".toWireType(" + Ee + ", arg" + M + "); // " + f[M + 2].name + `
`, Me.push("argType" + M), De.push(f[M + 2]);
      if (F && (le = "thisWired" + (le.length > 0 ? ", " : "") + le), fe += (te || x ? "var rv = " : "") + "invoker(fn" + (le.length > 0 ? ", " : "") + le + `);
`, q)
        fe += `runDestructors(destructors);
`;
      else
        for (var M = F ? 1 : 2; M < f.length; ++M) {
          var ot = M === 1 ? "thisWired" : "arg" + (M - 2) + "Wired";
          f[M].destructorFunction !== null && (fe += ot + "_dtor(" + ot + "); // " + f[M].name + `
`, Me.push(ot + "_dtor"), De.push(f[M].destructorFunction));
        }
      return te && (fe += `var ret = retType.fromWireType(rv);
return ret;
`), fe += `}
`, Me.push(fe), Dr(Function, Me).apply(null, De);
    }
    function nn(d, f, v, E, D, x) {
      var B = Sr(f, v);
      D = wt(E, D), ut([], [d], function(F) {
        F = F[0];
        var q = `constructor ${F.name}`;
        if (F.registeredClass.constructor_body === void 0 && (F.registeredClass.constructor_body = []), F.registeredClass.constructor_body[f - 1] !== void 0)
          throw new G(`Cannot register multiple constructors with identical number of parameters (${f - 1}) for class '${F.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return F.registeredClass.constructor_body[f - 1] = () => {
          ur(`Cannot construct ${F.name} due to unbound types`, B);
        }, ut([], B, function(M) {
          return M.splice(1, 0, null), F.registeredClass.constructor_body[f - 1] = ke(q, M, null, D, x), [];
        }), [];
      });
    }
    function on(d, f, v, E, D, x, B, F, q) {
      var M = Sr(v, E);
      f = Fe(f), x = wt(D, x), ut([], [d], function(te) {
        te = te[0];
        var ie = `${te.name}.${f}`;
        f.startsWith("@@") && (f = Symbol[f.substring(2)]), F && te.registeredClass.pureVirtualFunctions.push(f);
        function le() {
          ur(`Cannot call ${ie} due to unbound types`, M);
        }
        var fe = te.registeredClass.instancePrototype, Ee = fe[f];
        return Ee === void 0 || Ee.overloadTable === void 0 && Ee.className !== te.name && Ee.argCount === v - 2 ? (le.argCount = v - 2, le.className = te.name, fe[f] = le) : (kr(fe, f, ie), fe[f].overloadTable[v - 2] = le), ut([], M, function(Me) {
          var De = ke(ie, Me, te, x, B, q);
          return fe[f].overloadTable === void 0 ? (De.argCount = v - 2, fe[f] = De) : fe[f].overloadTable[v - 2] = De, [];
        }), [];
      });
    }
    function pt() {
      Object.assign(_t.prototype, { get(d) {
        return this.allocated[d];
      }, has(d) {
        return this.allocated[d] !== void 0;
      }, allocate(d) {
        var f = this.freelist.pop() || this.allocated.length;
        return this.allocated[f] = d, f;
      }, free(d) {
        this.allocated[d] = void 0, this.freelist.push(d);
      } });
    }
    function _t() {
      this.allocated = [void 0], this.freelist = [];
    }
    var Ue = new _t();
    function Ar(d) {
      d >= Ue.reserved && --Ue.get(d).refcount === 0 && Ue.free(d);
    }
    function sn() {
      for (var d = 0, f = Ue.reserved; f < Ue.allocated.length; ++f)
        Ue.allocated[f] !== void 0 && ++d;
      return d;
    }
    function Ft() {
      Ue.allocated.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 }), Ue.reserved = Ue.allocated.length, i.count_emval_handles = sn;
    }
    var Xt = { toValue: (d) => (d || ce("Cannot use deleted val. handle = " + d), Ue.get(d).value), toHandle: (d) => {
      switch (d) {
        case void 0:
          return 1;
        case null:
          return 2;
        case !0:
          return 3;
        case !1:
          return 4;
        default:
          return Ue.allocate({ refcount: 1, value: d });
      }
    } };
    function an(d, f) {
      f = Fe(f), Re(d, { name: f, fromWireType: function(v) {
        var E = Xt.toValue(v);
        return Ar(v), E;
      }, toWireType: function(v, E) {
        return Xt.toHandle(E);
      }, argPackAdvance: 8, readValueFromPointer: yt, destructorFunction: null });
    }
    function lr(d) {
      if (d === null)
        return "null";
      var f = typeof d;
      return f === "object" || f === "array" || f === "function" ? d.toString() : "" + d;
    }
    function vt(d, f) {
      switch (f) {
        case 2:
          return function(v) {
            return this.fromWireType(Pe[v >> 2]);
          };
        case 3:
          return function(v) {
            return this.fromWireType(tt[v >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + d);
      }
    }
    function un(d, f, v) {
      var E = R(v);
      f = Fe(f), Re(d, { name: f, fromWireType: function(D) {
        return D;
      }, toWireType: function(D, x) {
        return x;
      }, argPackAdvance: 8, readValueFromPointer: vt(f, E), destructorFunction: null });
    }
    function ln(d, f, v) {
      switch (f) {
        case 0:
          return v ? function(D) {
            return pe[D];
          } : function(D) {
            return K[D];
          };
        case 1:
          return v ? function(D) {
            return ae[D >> 1];
          } : function(D) {
            return He[D >> 1];
          };
        case 2:
          return v ? function(D) {
            return ne[D >> 2];
          } : function(D) {
            return Q[D >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + d);
      }
    }
    function cn(d, f, v, E, D) {
      f = Fe(f);
      var x = R(v), B = (ie) => ie;
      if (E === 0) {
        var F = 32 - 8 * v;
        B = (ie) => ie << F >>> F;
      }
      var q = f.includes("unsigned"), M = (ie, le) => {
      }, te;
      q ? te = function(ie, le) {
        return M(le, this.name), le >>> 0;
      } : te = function(ie, le) {
        return M(le, this.name), le;
      }, Re(d, { name: f, fromWireType: B, toWireType: te, argPackAdvance: 8, readValueFromPointer: ln(f, x, E !== 0), destructorFunction: null });
    }
    function dn(d, f, v) {
      var E = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], D = E[f];
      function x(B) {
        B = B >> 2;
        var F = Q, q = F[B], M = F[B + 1];
        return new D(F.buffer, M, q);
      }
      v = Fe(v), Re(d, { name: v, fromWireType: x, argPackAdvance: 8, readValueFromPointer: x }, { ignoreDuplicateRegistrations: !0 });
    }
    var be = (d, f, v, E) => {
      if (!(E > 0))
        return 0;
      for (var D = v, x = v + E - 1, B = 0; B < d.length; ++B) {
        var F = d.charCodeAt(B);
        if (F >= 55296 && F <= 57343) {
          var q = d.charCodeAt(++B);
          F = 65536 + ((F & 1023) << 10) | q & 1023;
        }
        if (F <= 127) {
          if (v >= x)
            break;
          f[v++] = F;
        } else if (F <= 2047) {
          if (v + 1 >= x)
            break;
          f[v++] = 192 | F >> 6, f[v++] = 128 | F & 63;
        } else if (F <= 65535) {
          if (v + 2 >= x)
            break;
          f[v++] = 224 | F >> 12, f[v++] = 128 | F >> 6 & 63, f[v++] = 128 | F & 63;
        } else {
          if (v + 3 >= x)
            break;
          f[v++] = 240 | F >> 18, f[v++] = 128 | F >> 12 & 63, f[v++] = 128 | F >> 6 & 63, f[v++] = 128 | F & 63;
        }
      }
      return f[v] = 0, v - D;
    }, fn = (d, f, v) => be(d, K, f, v), hn = (d) => {
      for (var f = 0, v = 0; v < d.length; ++v) {
        var E = d.charCodeAt(v);
        E <= 127 ? f++ : E <= 2047 ? f += 2 : E >= 55296 && E <= 57343 ? (f += 4, ++v) : f += 3;
      }
      return f;
    }, it = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, Kt = (d, f, v) => {
      for (var E = f + v, D = f; d[D] && !(D >= E); )
        ++D;
      if (D - f > 16 && d.buffer && it)
        return it.decode(d.subarray(f, D));
      for (var x = ""; f < D; ) {
        var B = d[f++];
        if (!(B & 128)) {
          x += String.fromCharCode(B);
          continue;
        }
        var F = d[f++] & 63;
        if ((B & 224) == 192) {
          x += String.fromCharCode((B & 31) << 6 | F);
          continue;
        }
        var q = d[f++] & 63;
        if ((B & 240) == 224 ? B = (B & 15) << 12 | F << 6 | q : B = (B & 7) << 18 | F << 12 | q << 6 | d[f++] & 63, B < 65536)
          x += String.fromCharCode(B);
        else {
          var M = B - 65536;
          x += String.fromCharCode(55296 | M >> 10, 56320 | M & 1023);
        }
      }
      return x;
    }, pn = (d, f) => d ? Kt(K, d, f) : "";
    function vn(d, f) {
      f = Fe(f);
      var v = f === "std::string";
      Re(d, { name: f, fromWireType: function(E) {
        var D = Q[E >> 2], x = E + 4, B;
        if (v)
          for (var F = x, q = 0; q <= D; ++q) {
            var M = x + q;
            if (q == D || K[M] == 0) {
              var te = M - F, ie = pn(F, te);
              B === void 0 ? B = ie : (B += String.fromCharCode(0), B += ie), F = M + 1;
            }
          }
        else {
          for (var le = new Array(D), q = 0; q < D; ++q)
            le[q] = String.fromCharCode(K[x + q]);
          B = le.join("");
        }
        return et(E), B;
      }, toWireType: function(E, D) {
        D instanceof ArrayBuffer && (D = new Uint8Array(D));
        var x, B = typeof D == "string";
        B || D instanceof Uint8Array || D instanceof Uint8ClampedArray || D instanceof Int8Array || ce("Cannot pass non-string to std::string"), v && B ? x = hn(D) : x = D.length;
        var F = Ut(4 + x + 1), q = F + 4;
        if (Q[F >> 2] = x, v && B)
          fn(D, q, x + 1);
        else if (B)
          for (var M = 0; M < x; ++M) {
            var te = D.charCodeAt(M);
            te > 255 && (et(q), ce("String has UTF-16 code units that do not fit in 8 bits")), K[q + M] = te;
          }
        else
          for (var M = 0; M < x; ++M)
            K[q + M] = D[M];
        return E !== null && E.push(et, F), F;
      }, argPackAdvance: 8, readValueFromPointer: yt, destructorFunction: function(E) {
        et(E);
      } });
    }
    var Be = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, mn = (d, f) => {
      for (var v = d, E = v >> 1, D = E + f / 2; !(E >= D) && He[E]; )
        ++E;
      if (v = E << 1, v - d > 32 && Be)
        return Be.decode(K.subarray(d, v));
      for (var x = "", B = 0; !(B >= f / 2); ++B) {
        var F = ae[d + B * 2 >> 1];
        if (F == 0)
          break;
        x += String.fromCharCode(F);
      }
      return x;
    }, cr = (d, f, v) => {
      if (v === void 0 && (v = 2147483647), v < 2)
        return 0;
      v -= 2;
      for (var E = f, D = v < d.length * 2 ? v / 2 : d.length, x = 0; x < D; ++x) {
        var B = d.charCodeAt(x);
        ae[f >> 1] = B, f += 2;
      }
      return ae[f >> 1] = 0, f - E;
    }, dr = (d) => d.length * 2, Rt = (d, f) => {
      for (var v = 0, E = ""; !(v >= f / 4); ) {
        var D = ne[d + v * 4 >> 2];
        if (D == 0)
          break;
        if (++v, D >= 65536) {
          var x = D - 65536;
          E += String.fromCharCode(55296 | x >> 10, 56320 | x & 1023);
        } else
          E += String.fromCharCode(D);
      }
      return E;
    }, gn = (d, f, v) => {
      if (v === void 0 && (v = 2147483647), v < 4)
        return 0;
      for (var E = f, D = E + v - 4, x = 0; x < d.length; ++x) {
        var B = d.charCodeAt(x);
        if (B >= 55296 && B <= 57343) {
          var F = d.charCodeAt(++x);
          B = 65536 + ((B & 1023) << 10) | F & 1023;
        }
        if (ne[f >> 2] = B, f += 4, f + 4 > D)
          break;
      }
      return ne[f >> 2] = 0, f - E;
    }, fr = (d) => {
      for (var f = 0, v = 0; v < d.length; ++v) {
        var E = d.charCodeAt(v);
        E >= 55296 && E <= 57343 && ++v, f += 4;
      }
      return f;
    }, yn = function(d, f, v) {
      v = Fe(v);
      var E, D, x, B, F;
      f === 2 ? (E = mn, D = cr, B = dr, x = () => He, F = 1) : f === 4 && (E = Rt, D = gn, B = fr, x = () => Q, F = 2), Re(d, { name: v, fromWireType: function(q) {
        for (var M = Q[q >> 2], te = x(), ie, le = q + 4, fe = 0; fe <= M; ++fe) {
          var Ee = q + 4 + fe * f;
          if (fe == M || te[Ee >> F] == 0) {
            var Me = Ee - le, De = E(le, Me);
            ie === void 0 ? ie = De : (ie += String.fromCharCode(0), ie += De), le = Ee + f;
          }
        }
        return et(q), ie;
      }, toWireType: function(q, M) {
        typeof M != "string" && ce(`Cannot pass non-string to C++ string type ${v}`);
        var te = B(M), ie = Ut(4 + te + f);
        return Q[ie >> 2] = te >> F, D(M, ie + 4, te + f), q !== null && q.push(et, ie), ie;
      }, argPackAdvance: 8, readValueFromPointer: yt, destructorFunction: function(q) {
        et(q);
      } });
    };
    function hr(d, f) {
      f = Fe(f), Re(d, { isVoid: !0, name: f, argPackAdvance: 0, fromWireType: function() {
      }, toWireType: function(v, E) {
      } });
    }
    var pr = {};
    function wn(d) {
      var f = pr[d];
      return f === void 0 ? Fe(d) : f;
    }
    var vr = [];
    function _n(d, f, v, E) {
      d = vr[d], f = Xt.toValue(f), v = wn(v), d(f, v, null, E);
    }
    function mr(d) {
      var f = vr.length;
      return vr.push(d), f;
    }
    function ge(d, f) {
      var v = at[d];
      return v === void 0 && ce(f + " has unknown type " + qe(d)), v;
    }
    function gr(d, f) {
      for (var v = new Array(d), E = 0; E < d; ++E)
        v[E] = ge(Q[f + E * 4 >> 2], "parameter " + E);
      return v;
    }
    var Fr = [];
    function bn(d, f) {
      var v = gr(d, f), E = v[0], D = E.name + "_$" + v.slice(1).map(function(Ee) {
        return Ee.name;
      }).join("_") + "$", x = Fr[D];
      if (x !== void 0)
        return x;
      for (var B = ["retType"], F = [E], q = "", M = 0; M < d - 1; ++M)
        q += (M !== 0 ? ", " : "") + "arg" + M, B.push("argType" + M), F.push(v[1 + M]);
      for (var te = qt("methodCaller_" + D), ie = "return function " + te + `(handle, name, destructors, args) {
`, le = 0, M = 0; M < d - 1; ++M)
        ie += "    var arg" + M + " = argType" + M + ".readValueFromPointer(args" + (le ? "+" + le : "") + `);
`, le += v[M + 1].argPackAdvance;
      ie += "    var rv = handle[name](" + q + `);
`;
      for (var M = 0; M < d - 1; ++M)
        v[M + 1].deleteObject && (ie += "    argType" + M + ".deleteObject(arg" + M + `);
`);
      E.isVoid || (ie += `    return retType.toWireType(destructors, rv);
`), ie += `};
`, B.push(ie);
      var fe = Dr(Function, B).apply(null, F);
      return x = mr(fe), Fr[D] = x, x;
    }
    var mt = () => {
      Te("");
    }, Rr;
    Rr = () => performance.now();
    var xt = (d, f, v) => K.copyWithin(d, f, f + v), En = (d) => {
      Te("OOM");
    }, Pn = (d) => {
      K.length, En();
    }, Tn = [null, [], []], kn = (d, f) => {
      var v = Tn[d];
      f === 0 || f === 10 ? ((d === 1 ? $ : z)(Kt(v, 0)), v.length = 0) : v.push(f);
    }, Cn = (d, f, v, E) => {
      for (var D = 0, x = 0; x < v; x++) {
        var B = Q[f >> 2], F = Q[f + 4 >> 2];
        f += 8;
        for (var q = 0; q < F; q++)
          kn(d, K[B + q]);
        D += F;
      }
      return Q[E >> 2] = D, 0;
    };
    Y(), G = i.BindingError = class extends Error {
      constructor(f) {
        super(f), this.name = "BindingError";
      }
    }, Ht = i.InternalError = class extends Error {
      constructor(f) {
        super(f), this.name = "InternalError";
      }
    }, N(), Gr(), Jr(), $r = i.UnboundTypeError = ht(Error, "UnboundTypeError"), pt(), Ft();
    var $n = { o: Hr, r: Vr, m: Tt, q: tn, p: nn, d: on, u: an, k: un, b: cn, a: dn, j: vn, g: yn, n: hr, e: _n, l: Ar, h: bn, f: mt, c: Rr, t: xt, s: Pn, i: Cn };
    Oe();
    var et = (d) => (et = re.x)(d), Ut = (d) => (Ut = re.y)(d), xr = (d) => (xr = re.A)(d);
    i.__embind_initialize_bindings = () => (i.__embind_initialize_bindings = re.B)();
    var Ur = (d) => (Ur = re.C)(d);
    i.dynCall_jiji = (d, f, v, E, D) => (i.dynCall_jiji = re.D)(d, f, v, E, D);
    var Qt;
    Et = function d() {
      Qt || Br(), Qt || (Et = d);
    };
    function Br() {
      if (st > 0 || (Zt(), st > 0))
        return;
      function d() {
        Qt || (Qt = !0, i.calledRun = !0, !j && (Jt(), p(i), i.onRuntimeInitialized && i.onRuntimeInitialized(), er()));
      }
      i.setStatus ? (i.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          i.setStatus("");
        }, 1), d();
      }, 1)) : d();
    }
    if (i.preInit)
      for (typeof i.preInit == "function" && (i.preInit = [i.preInit]); i.preInit.length > 0; )
        i.preInit.pop()();
    return Br(), c.ready;
  };
})();
var wi = (() => {
  var L = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
  return function(c = {}) {
    var i = c, p, h;
    i.ready = new Promise((e, t) => {
      p = e, h = t;
    });
    var b = Object.assign({}, i), _ = "./this.program", C = typeof window == "object", w = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && process.versions.node;
    var y = "";
    function A(e) {
      return i.locateFile ? i.locateFile(e, y) : y + e;
    }
    var $, z, W;
    (C || w) && (w ? y = self.location.href : typeof document < "u" && document.currentScript && (y = document.currentScript.src), L && (y = L), y.indexOf("blob:") !== 0 ? y = y.substr(0, y.replace(/[?#].*/, "").lastIndexOf("/") + 1) : y = "", $ = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.send(null), t.responseText;
    }, w && (W = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
    }), z = (e, t, r) => {
      var n = new XMLHttpRequest();
      n.open("GET", e, !0), n.responseType = "arraybuffer", n.onload = () => {
        if (n.status == 200 || n.status == 0 && n.response) {
          t(n.response);
          return;
        }
        r();
      }, n.onerror = r, n.send(null);
    });
    var H = i.print || console.log.bind(console), re = i.printErr || console.error.bind(console);
    Object.assign(i, b), b = null, i.arguments && i.arguments, i.thisProgram && (_ = i.thisProgram), i.quit && i.quit;
    var j;
    i.wasmBinary && (j = i.wasmBinary), i.noExitRuntime, typeof WebAssembly != "object" && Ae("no native wasm support detected");
    var pe, K, ae = !1;
    function He(e, t) {
      e || Ae(t);
    }
    var ne, Q, Pe, tt, V, X, Lt, jt;
    function _r() {
      var e = pe.buffer;
      i.HEAP8 = ne = new Int8Array(e), i.HEAP16 = Pe = new Int16Array(e), i.HEAP32 = V = new Int32Array(e), i.HEAPU8 = Q = new Uint8Array(e), i.HEAPU16 = tt = new Uint16Array(e), i.HEAPU32 = X = new Uint32Array(e), i.HEAPF32 = Lt = new Float32Array(e), i.HEAPF64 = jt = new Float64Array(e);
    }
    var Zt, Jt = [], er = [], tr = [];
    function Ir() {
      if (i.preRun)
        for (typeof i.preRun == "function" && (i.preRun = [i.preRun]); i.preRun.length; )
          Et(i.preRun.shift());
      gt(Jt);
    }
    function Lr() {
      !i.noFSInit && !o.init.initialized && o.init(), o.ignorePermissions = !1, gt(er);
    }
    function st() {
      if (i.postRun)
        for (typeof i.postRun == "function" && (i.postRun = [i.postRun]); i.postRun.length; )
          zr(i.postRun.shift());
      gt(tr);
    }
    function Et(e) {
      Jt.unshift(e);
    }
    function jr(e) {
      er.unshift(e);
    }
    function zr(e) {
      tr.unshift(e);
    }
    var Te = 0, Ke = null;
    function Ln(e) {
      return e;
    }
    function Ve(e) {
      Te++, i.monitorRunDependencies && i.monitorRunDependencies(Te);
    }
    function rt(e) {
      if (Te--, i.monitorRunDependencies && i.monitorRunDependencies(Te), Te == 0 && Ke) {
        var t = Ke;
        Ke = null, t();
      }
    }
    function Ae(e) {
      i.onAbort && i.onAbort(e), e = "Aborted(" + e + ")", re(e), ae = !0, e += ". Build with -sASSERTIONS for more info.";
      var t = new WebAssembly.RuntimeError(e);
      throw h(t), t;
    }
    var br = "data:application/octet-stream;base64,";
    function rr(e) {
      return e.startsWith(br);
    }
    var Oe;
    Oe = "videodec.wasm", rr(Oe) || (Oe = A(Oe));
    function Pt(e) {
      if (e == Oe && j)
        return new Uint8Array(j);
      if (W)
        return W(e);
      throw "both async and sync fetching of the wasm failed";
    }
    function Wr(e) {
      return !j && (C || w) && typeof fetch == "function" ? fetch(e, { credentials: "same-origin" }).then((t) => {
        if (!t.ok)
          throw "failed to load wasm binary file at '" + e + "'";
        return t.arrayBuffer();
      }).catch(() => Pt(e)) : Promise.resolve().then(() => Pt(e));
    }
    function zt(e, t, r) {
      return Wr(e).then((n) => WebAssembly.instantiate(n, t)).then((n) => n).then(r, (n) => {
        re("failed to asynchronously prepare wasm: " + n), Ae(n);
      });
    }
    function Hr(e, t, r, n) {
      return !e && typeof WebAssembly.instantiateStreaming == "function" && !rr(t) && typeof fetch == "function" ? fetch(t, { credentials: "same-origin" }).then((s) => {
        var a = WebAssembly.instantiateStreaming(s, r);
        return a.then(n, function(l) {
          return re("wasm streaming compile failed: " + l), re("falling back to ArrayBuffer instantiation"), zt(t, r, n);
        });
      }) : zt(t, r, n);
    }
    function Vr() {
      var e = { a: Jn };
      function t(n, s) {
        var a = n.exports;
        return K = a, pe = K.E, _r(), Zt = K.H, jr(K.F), rt(), a;
      }
      Ve();
      function r(n) {
        t(n.instance);
      }
      if (i.instantiateWasm)
        try {
          return i.instantiateWasm(e, t);
        } catch (n) {
          re("Module.instantiateWasm callback failed with error: " + n), h(n);
        }
      return Hr(j, Oe, e, r).catch(h), {};
    }
    var R, Y, gt = (e) => {
      for (; e.length > 0; )
        e.shift()(i);
    };
    function Fe(e) {
      this.excPtr = e, this.ptr = e - 24, this.set_type = function(t) {
        X[this.ptr + 4 >> 2] = t;
      }, this.get_type = function() {
        return X[this.ptr + 4 >> 2];
      }, this.set_destructor = function(t) {
        X[this.ptr + 8 >> 2] = t;
      }, this.get_destructor = function() {
        return X[this.ptr + 8 >> 2];
      }, this.set_caught = function(t) {
        t = t ? 1 : 0, ne[this.ptr + 12 >> 0] = t;
      }, this.get_caught = function() {
        return ne[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(t) {
        t = t ? 1 : 0, ne[this.ptr + 13 >> 0] = t;
      }, this.get_rethrown = function() {
        return ne[this.ptr + 13 >> 0] != 0;
      }, this.init = function(t, r) {
        this.set_adjusted_ptr(0), this.set_type(t), this.set_destructor(r);
      }, this.set_adjusted_ptr = function(t) {
        X[this.ptr + 16 >> 2] = t;
      }, this.get_adjusted_ptr = function() {
        return X[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var t = Rn(this.get_type());
        if (t)
          return X[this.excPtr >> 2];
        var r = this.get_adjusted_ptr();
        return r !== 0 ? r : this.excPtr;
      };
    }
    var nt = 0;
    function at(e, t, r) {
      var n = new Fe(e);
      throw n.init(t, r), nt = e, nt;
    }
    var Wt = (e) => (V[An() >> 2] = e, e), G = { isAbs: (e) => e.charAt(0) === "/", splitPath: (e) => {
      var t = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
      return t.exec(e).slice(1);
    }, normalizeArray: (e, t) => {
      for (var r = 0, n = e.length - 1; n >= 0; n--) {
        var s = e[n];
        s === "." ? e.splice(n, 1) : s === ".." ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--);
      }
      if (t)
        for (; r; r--)
          e.unshift("..");
      return e;
    }, normalize: (e) => {
      var t = G.isAbs(e), r = e.substr(-1) === "/";
      return e = G.normalizeArray(e.split("/").filter((n) => !!n), !t).join("/"), !e && !t && (e = "."), e && r && (e += "/"), (t ? "/" : "") + e;
    }, dirname: (e) => {
      var t = G.splitPath(e), r = t[0], n = t[1];
      return !r && !n ? "." : (n && (n = n.substr(0, n.length - 1)), r + n);
    }, basename: (e) => {
      if (e === "/")
        return "/";
      e = G.normalize(e), e = e.replace(/\/$/, "");
      var t = e.lastIndexOf("/");
      return t === -1 ? e : e.substr(t + 1);
    }, join: function() {
      var e = Array.prototype.slice.call(arguments);
      return G.normalize(e.join("/"));
    }, join2: (e, t) => G.normalize(e + "/" + t) }, ce = () => {
      if (typeof crypto == "object" && typeof crypto.getRandomValues == "function")
        return (e) => crypto.getRandomValues(e);
      Ae("initRandomDevice");
    }, Ht = (e) => (Ht = ce())(e), ye = { resolve: function() {
      for (var e = "", t = !1, r = arguments.length - 1; r >= -1 && !t; r--) {
        var n = r >= 0 ? arguments[r] : o.cwd();
        if (typeof n != "string")
          throw new TypeError("Arguments to path.resolve must be strings");
        if (!n)
          return "";
        e = n + "/" + e, t = G.isAbs(n);
      }
      return e = G.normalizeArray(e.split("/").filter((s) => !!s), !t).join("/"), (t ? "/" : "") + e || ".";
    }, relative: (e, t) => {
      e = ye.resolve(e).substr(1), t = ye.resolve(t).substr(1);
      function r(m) {
        for (var T = 0; T < m.length && m[T] === ""; T++)
          ;
        for (var S = m.length - 1; S >= 0 && m[S] === ""; S--)
          ;
        return T > S ? [] : m.slice(T, S - T + 1);
      }
      for (var n = r(e.split("/")), s = r(t.split("/")), a = Math.min(n.length, s.length), l = a, u = 0; u < a; u++)
        if (n[u] !== s[u]) {
          l = u;
          break;
        }
      for (var g = [], u = l; u < n.length; u++)
        g.push("..");
      return g = g.concat(s.slice(l)), g.join("/");
    } }, ut = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, Ie = (e, t, r) => {
      for (var n = t + r, s = t; e[s] && !(s >= n); )
        ++s;
      if (s - t > 16 && e.buffer && ut)
        return ut.decode(e.subarray(t, s));
      for (var a = ""; t < s; ) {
        var l = e[t++];
        if (!(l & 128)) {
          a += String.fromCharCode(l);
          continue;
        }
        var u = e[t++] & 63;
        if ((l & 224) == 192) {
          a += String.fromCharCode((l & 31) << 6 | u);
          continue;
        }
        var g = e[t++] & 63;
        if ((l & 240) == 224 ? l = (l & 15) << 12 | u << 6 | g : l = (l & 7) << 18 | u << 12 | g << 6 | e[t++] & 63, l < 65536)
          a += String.fromCharCode(l);
        else {
          var m = l - 65536;
          a += String.fromCharCode(55296 | m >> 10, 56320 | m & 1023);
        }
      }
      return a;
    }, Re = [], Tt = (e) => {
      for (var t = 0, r = 0; r < e.length; ++r) {
        var n = e.charCodeAt(r);
        n <= 127 ? t++ : n <= 2047 ? t += 2 : n >= 55296 && n <= 57343 ? (t += 4, ++r) : t += 3;
      }
      return t;
    }, kt = (e, t, r, n) => {
      if (!(n > 0))
        return 0;
      for (var s = r, a = r + n - 1, l = 0; l < e.length; ++l) {
        var u = e.charCodeAt(l);
        if (u >= 55296 && u <= 57343) {
          var g = e.charCodeAt(++l);
          u = 65536 + ((u & 1023) << 10) | g & 1023;
        }
        if (u <= 127) {
          if (r >= a)
            break;
          t[r++] = u;
        } else if (u <= 2047) {
          if (r + 1 >= a)
            break;
          t[r++] = 192 | u >> 6, t[r++] = 128 | u & 63;
        } else if (u <= 65535) {
          if (r + 2 >= a)
            break;
          t[r++] = 224 | u >> 12, t[r++] = 128 | u >> 6 & 63, t[r++] = 128 | u & 63;
        } else {
          if (r + 3 >= a)
            break;
          t[r++] = 240 | u >> 18, t[r++] = 128 | u >> 12 & 63, t[r++] = 128 | u >> 6 & 63, t[r++] = 128 | u & 63;
        }
      }
      return t[r] = 0, r - s;
    };
    function Ct(e, t, r) {
      var n = r > 0 ? r : Tt(e) + 1, s = new Array(n), a = kt(e, s, 0, s.length);
      return t && (s.length = a), s;
    }
    var nr = () => {
      if (!Re.length) {
        var e = null;
        if (typeof window < "u" && typeof window.prompt == "function" ? (e = window.prompt("Input: "), e !== null && (e += `
`)) : typeof readline == "function" && (e = readline(), e !== null && (e += `
`)), !e)
          return null;
        Re = Ct(e, !0);
      }
      return Re.shift();
    }, Ce = { ttys: [], init: function() {
    }, shutdown: function() {
    }, register: function(e, t) {
      Ce.ttys[e] = { input: [], output: [], ops: t }, o.registerDevice(e, Ce.stream_ops);
    }, stream_ops: { open: function(e) {
      var t = Ce.ttys[e.node.rdev];
      if (!t)
        throw new o.ErrnoError(43);
      e.tty = t, e.seekable = !1;
    }, close: function(e) {
      e.tty.ops.fsync(e.tty);
    }, fsync: function(e) {
      e.tty.ops.fsync(e.tty);
    }, read: function(e, t, r, n, s) {
      if (!e.tty || !e.tty.ops.get_char)
        throw new o.ErrnoError(60);
      for (var a = 0, l = 0; l < n; l++) {
        var u;
        try {
          u = e.tty.ops.get_char(e.tty);
        } catch {
          throw new o.ErrnoError(29);
        }
        if (u === void 0 && a === 0)
          throw new o.ErrnoError(6);
        if (u == null)
          break;
        a++, t[r + l] = u;
      }
      return a && (e.node.timestamp = Date.now()), a;
    }, write: function(e, t, r, n, s) {
      if (!e.tty || !e.tty.ops.put_char)
        throw new o.ErrnoError(60);
      try {
        for (var a = 0; a < n; a++)
          e.tty.ops.put_char(e.tty, t[r + a]);
      } catch {
        throw new o.ErrnoError(29);
      }
      return n && (e.node.timestamp = Date.now()), a;
    } }, default_tty_ops: { get_char: function(e) {
      return nr();
    }, put_char: function(e, t) {
      t === null || t === 10 ? (H(Ie(e.output, 0)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync: function(e) {
      e.output && e.output.length > 0 && (H(Ie(e.output, 0)), e.output = []);
    }, ioctl_tcgets: function(e) {
      return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    }, ioctl_tcsets: function(e, t, r) {
      return 0;
    }, ioctl_tiocgwinsz: function(e) {
      return [24, 80];
    } }, default_tty1_ops: { put_char: function(e, t) {
      t === null || t === 10 ? (re(Ie(e.output, 0)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync: function(e) {
      e.output && e.output.length > 0 && (re(Ie(e.output, 0)), e.output = []);
    } } }, Vt = (e) => {
      Ae();
    }, I = { ops_table: null, mount(e) {
      return I.createNode(null, "/", 16895, 0);
    }, createNode(e, t, r, n) {
      if (o.isBlkdev(r) || o.isFIFO(r))
        throw new o.ErrnoError(63);
      I.ops_table || (I.ops_table = { dir: { node: { getattr: I.node_ops.getattr, setattr: I.node_ops.setattr, lookup: I.node_ops.lookup, mknod: I.node_ops.mknod, rename: I.node_ops.rename, unlink: I.node_ops.unlink, rmdir: I.node_ops.rmdir, readdir: I.node_ops.readdir, symlink: I.node_ops.symlink }, stream: { llseek: I.stream_ops.llseek } }, file: { node: { getattr: I.node_ops.getattr, setattr: I.node_ops.setattr }, stream: { llseek: I.stream_ops.llseek, read: I.stream_ops.read, write: I.stream_ops.write, allocate: I.stream_ops.allocate, mmap: I.stream_ops.mmap, msync: I.stream_ops.msync } }, link: { node: { getattr: I.node_ops.getattr, setattr: I.node_ops.setattr, readlink: I.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: I.node_ops.getattr, setattr: I.node_ops.setattr }, stream: o.chrdev_stream_ops } });
      var s = o.createNode(e, t, r, n);
      return o.isDir(s.mode) ? (s.node_ops = I.ops_table.dir.node, s.stream_ops = I.ops_table.dir.stream, s.contents = {}) : o.isFile(s.mode) ? (s.node_ops = I.ops_table.file.node, s.stream_ops = I.ops_table.file.stream, s.usedBytes = 0, s.contents = null) : o.isLink(s.mode) ? (s.node_ops = I.ops_table.link.node, s.stream_ops = I.ops_table.link.stream) : o.isChrdev(s.mode) && (s.node_ops = I.ops_table.chrdev.node, s.stream_ops = I.ops_table.chrdev.stream), s.timestamp = Date.now(), e && (e.contents[t] = s, e.timestamp = s.timestamp), s;
    }, getFileDataAsTypedArray(e) {
      return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
    }, expandFileStorage(e, t) {
      var r = e.contents ? e.contents.length : 0;
      if (!(r >= t)) {
        var n = 1024 * 1024;
        t = Math.max(t, r * (r < n ? 2 : 1.125) >>> 0), r != 0 && (t = Math.max(t, 256));
        var s = e.contents;
        e.contents = new Uint8Array(t), e.usedBytes > 0 && e.contents.set(s.subarray(0, e.usedBytes), 0);
      }
    }, resizeFileStorage(e, t) {
      if (e.usedBytes != t)
        if (t == 0)
          e.contents = null, e.usedBytes = 0;
        else {
          var r = e.contents;
          e.contents = new Uint8Array(t), r && e.contents.set(r.subarray(0, Math.min(t, e.usedBytes))), e.usedBytes = t;
        }
    }, node_ops: { getattr(e) {
      var t = {};
      return t.dev = o.isChrdev(e.mode) ? e.id : 1, t.ino = e.id, t.mode = e.mode, t.nlink = 1, t.uid = 0, t.gid = 0, t.rdev = e.rdev, o.isDir(e.mode) ? t.size = 4096 : o.isFile(e.mode) ? t.size = e.usedBytes : o.isLink(e.mode) ? t.size = e.link.length : t.size = 0, t.atime = new Date(e.timestamp), t.mtime = new Date(e.timestamp), t.ctime = new Date(e.timestamp), t.blksize = 4096, t.blocks = Math.ceil(t.size / t.blksize), t;
    }, setattr(e, t) {
      t.mode !== void 0 && (e.mode = t.mode), t.timestamp !== void 0 && (e.timestamp = t.timestamp), t.size !== void 0 && I.resizeFileStorage(e, t.size);
    }, lookup(e, t) {
      throw o.genericErrors[44];
    }, mknod(e, t, r, n) {
      return I.createNode(e, t, r, n);
    }, rename(e, t, r) {
      if (o.isDir(e.mode)) {
        var n;
        try {
          n = o.lookupNode(t, r);
        } catch {
        }
        if (n)
          for (var s in n.contents)
            throw new o.ErrnoError(55);
      }
      delete e.parent.contents[e.name], e.parent.timestamp = Date.now(), e.name = r, t.contents[r] = e, t.timestamp = e.parent.timestamp, e.parent = t;
    }, unlink(e, t) {
      delete e.contents[t], e.timestamp = Date.now();
    }, rmdir(e, t) {
      var r = o.lookupNode(e, t);
      for (var n in r.contents)
        throw new o.ErrnoError(55);
      delete e.contents[t], e.timestamp = Date.now();
    }, readdir(e) {
      var t = [".", ".."];
      for (var r in e.contents)
        e.contents.hasOwnProperty(r) && t.push(r);
      return t;
    }, symlink(e, t, r) {
      var n = I.createNode(e, t, 41471, 0);
      return n.link = r, n;
    }, readlink(e) {
      if (!o.isLink(e.mode))
        throw new o.ErrnoError(28);
      return e.link;
    } }, stream_ops: { read(e, t, r, n, s) {
      var a = e.node.contents;
      if (s >= e.node.usedBytes)
        return 0;
      var l = Math.min(e.node.usedBytes - s, n);
      if (l > 8 && a.subarray)
        t.set(a.subarray(s, s + l), r);
      else
        for (var u = 0; u < l; u++)
          t[r + u] = a[s + u];
      return l;
    }, write(e, t, r, n, s, a) {
      if (!n)
        return 0;
      var l = e.node;
      if (l.timestamp = Date.now(), t.subarray && (!l.contents || l.contents.subarray)) {
        if (a)
          return l.contents = t.subarray(r, r + n), l.usedBytes = n, n;
        if (l.usedBytes === 0 && s === 0)
          return l.contents = t.slice(r, r + n), l.usedBytes = n, n;
        if (s + n <= l.usedBytes)
          return l.contents.set(t.subarray(r, r + n), s), n;
      }
      if (I.expandFileStorage(l, s + n), l.contents.subarray && t.subarray)
        l.contents.set(t.subarray(r, r + n), s);
      else
        for (var u = 0; u < n; u++)
          l.contents[s + u] = t[r + u];
      return l.usedBytes = Math.max(l.usedBytes, s + n), n;
    }, llseek(e, t, r) {
      var n = t;
      if (r === 1 ? n += e.position : r === 2 && o.isFile(e.node.mode) && (n += e.node.usedBytes), n < 0)
        throw new o.ErrnoError(28);
      return n;
    }, allocate(e, t, r) {
      I.expandFileStorage(e.node, t + r), e.node.usedBytes = Math.max(e.node.usedBytes, t + r);
    }, mmap(e, t, r, n, s) {
      if (!o.isFile(e.node.mode))
        throw new o.ErrnoError(43);
      var a, l, u = e.node.contents;
      if (!(s & 2) && u.buffer === ne.buffer)
        l = !1, a = u.byteOffset;
      else {
        if ((r > 0 || r + t < u.length) && (u.subarray ? u = u.subarray(r, r + t) : u = Array.prototype.slice.call(u, r, r + t)), l = !0, a = Vt(), !a)
          throw new o.ErrnoError(48);
        ne.set(u, a);
      }
      return { ptr: a, allocated: l };
    }, msync(e, t, r, n, s) {
      return I.stream_ops.write(e, t, 0, n, r, !1), 0;
    } } }, Er = (e, t, r, n) => {
      var s = n ? "" : `al ${e}`;
      z(e, (a) => {
        He(a, `Loading data file "${e}" failed (no arrayBuffer).`), t(new Uint8Array(a)), s && rt();
      }, (a) => {
        if (r)
          r();
        else
          throw `Loading data file "${e}" failed.`;
      }), s && Ve();
    }, Pr = i.preloadPlugins || [];
    function Tr(e, t, r, n) {
      typeof Browser < "u" && Browser.init();
      var s = !1;
      return Pr.forEach(function(a) {
        s || a.canHandle(t) && (a.handle(e, t, r, n), s = !0);
      }), s;
    }
    function Nr(e, t, r, n, s, a, l, u, g, m) {
      var T = t ? ye.resolve(G.join2(e, t)) : e;
      function S(k) {
        function P(U) {
          m && m(), u || o.createDataFile(e, t, U, n, s, g), a && a(), rt();
        }
        Tr(k, T, P, () => {
          l && l(), rt();
        }) || P(k);
      }
      Ve(), typeof r == "string" ? Er(r, (k) => S(k), l) : S(r);
    }
    function qr(e) {
      var t = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }, r = t[e];
      if (typeof r > "u")
        throw new Error(`Unknown file open mode: ${e}`);
      return r;
    }
    function Qe(e, t) {
      var r = 0;
      return e && (r |= 365), t && (r |= 146), r;
    }
    var o = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: !1, ignorePermissions: !0, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, lookupPath: (e, t = {}) => {
      if (e = ye.resolve(e), !e)
        return { path: "", node: null };
      var r = { follow_mount: !0, recurse_count: 0 };
      if (t = Object.assign(r, t), t.recurse_count > 8)
        throw new o.ErrnoError(32);
      for (var n = e.split("/").filter((S) => !!S), s = o.root, a = "/", l = 0; l < n.length; l++) {
        var u = l === n.length - 1;
        if (u && t.parent)
          break;
        if (s = o.lookupNode(s, n[l]), a = G.join2(a, n[l]), o.isMountpoint(s) && (!u || u && t.follow_mount) && (s = s.mounted.root), !u || t.follow)
          for (var g = 0; o.isLink(s.mode); ) {
            var m = o.readlink(a);
            a = ye.resolve(G.dirname(a), m);
            var T = o.lookupPath(a, { recurse_count: t.recurse_count + 1 });
            if (s = T.node, g++ > 40)
              throw new o.ErrnoError(32);
          }
      }
      return { path: a, node: s };
    }, getPath: (e) => {
      for (var t; ; ) {
        if (o.isRoot(e)) {
          var r = e.mount.mountpoint;
          return t ? r[r.length - 1] !== "/" ? `${r}/${t}` : r + t : r;
        }
        t = t ? `${e.name}/${t}` : e.name, e = e.parent;
      }
    }, hashName: (e, t) => {
      for (var r = 0, n = 0; n < t.length; n++)
        r = (r << 5) - r + t.charCodeAt(n) | 0;
      return (e + r >>> 0) % o.nameTable.length;
    }, hashAddNode: (e) => {
      var t = o.hashName(e.parent.id, e.name);
      e.name_next = o.nameTable[t], o.nameTable[t] = e;
    }, hashRemoveNode: (e) => {
      var t = o.hashName(e.parent.id, e.name);
      if (o.nameTable[t] === e)
        o.nameTable[t] = e.name_next;
      else
        for (var r = o.nameTable[t]; r; ) {
          if (r.name_next === e) {
            r.name_next = e.name_next;
            break;
          }
          r = r.name_next;
        }
    }, lookupNode: (e, t) => {
      var r = o.mayLookup(e);
      if (r)
        throw new o.ErrnoError(r, e);
      for (var n = o.hashName(e.id, t), s = o.nameTable[n]; s; s = s.name_next) {
        var a = s.name;
        if (s.parent.id === e.id && a === t)
          return s;
      }
      return o.lookup(e, t);
    }, createNode: (e, t, r, n) => {
      var s = new o.FSNode(e, t, r, n);
      return o.hashAddNode(s), s;
    }, destroyNode: (e) => {
      o.hashRemoveNode(e);
    }, isRoot: (e) => e === e.parent, isMountpoint: (e) => !!e.mounted, isFile: (e) => (e & 61440) === 32768, isDir: (e) => (e & 61440) === 16384, isLink: (e) => (e & 61440) === 40960, isChrdev: (e) => (e & 61440) === 8192, isBlkdev: (e) => (e & 61440) === 24576, isFIFO: (e) => (e & 61440) === 4096, isSocket: (e) => (e & 49152) === 49152, flagsToPermissionString: (e) => {
      var t = ["r", "w", "rw"][e & 3];
      return e & 512 && (t += "w"), t;
    }, nodePermissions: (e, t) => o.ignorePermissions ? 0 : t.includes("r") && !(e.mode & 292) || t.includes("w") && !(e.mode & 146) || t.includes("x") && !(e.mode & 73) ? 2 : 0, mayLookup: (e) => {
      var t = o.nodePermissions(e, "x");
      return t || (e.node_ops.lookup ? 0 : 2);
    }, mayCreate: (e, t) => {
      try {
        var r = o.lookupNode(e, t);
        return 20;
      } catch {
      }
      return o.nodePermissions(e, "wx");
    }, mayDelete: (e, t, r) => {
      var n;
      try {
        n = o.lookupNode(e, t);
      } catch (a) {
        return a.errno;
      }
      var s = o.nodePermissions(e, "wx");
      if (s)
        return s;
      if (r) {
        if (!o.isDir(n.mode))
          return 54;
        if (o.isRoot(n) || o.getPath(n) === o.cwd())
          return 10;
      } else if (o.isDir(n.mode))
        return 31;
      return 0;
    }, mayOpen: (e, t) => e ? o.isLink(e.mode) ? 32 : o.isDir(e.mode) && (o.flagsToPermissionString(t) !== "r" || t & 512) ? 31 : o.nodePermissions(e, o.flagsToPermissionString(t)) : 44, MAX_OPEN_FDS: 4096, nextfd: () => {
      for (var e = 0; e <= o.MAX_OPEN_FDS; e++)
        if (!o.streams[e])
          return e;
      throw new o.ErrnoError(33);
    }, getStreamChecked: (e) => {
      var t = o.getStream(e);
      if (!t)
        throw new o.ErrnoError(8);
      return t;
    }, getStream: (e) => o.streams[e], createStream: (e, t = -1) => (o.FSStream || (o.FSStream = function() {
      this.shared = {};
    }, o.FSStream.prototype = {}, Object.defineProperties(o.FSStream.prototype, { object: { get() {
      return this.node;
    }, set(r) {
      this.node = r;
    } }, isRead: { get() {
      return (this.flags & 2097155) !== 1;
    } }, isWrite: { get() {
      return (this.flags & 2097155) !== 0;
    } }, isAppend: { get() {
      return this.flags & 1024;
    } }, flags: { get() {
      return this.shared.flags;
    }, set(r) {
      this.shared.flags = r;
    } }, position: { get() {
      return this.shared.position;
    }, set(r) {
      this.shared.position = r;
    } } })), e = Object.assign(new o.FSStream(), e), t == -1 && (t = o.nextfd()), e.fd = t, o.streams[t] = e, e), closeStream: (e) => {
      o.streams[e] = null;
    }, chrdev_stream_ops: { open: (e) => {
      var t = o.getDevice(e.node.rdev);
      e.stream_ops = t.stream_ops, e.stream_ops.open && e.stream_ops.open(e);
    }, llseek: () => {
      throw new o.ErrnoError(70);
    } }, major: (e) => e >> 8, minor: (e) => e & 255, makedev: (e, t) => e << 8 | t, registerDevice: (e, t) => {
      o.devices[e] = { stream_ops: t };
    }, getDevice: (e) => o.devices[e], getMounts: (e) => {
      for (var t = [], r = [e]; r.length; ) {
        var n = r.pop();
        t.push(n), r.push.apply(r, n.mounts);
      }
      return t;
    }, syncfs: (e, t) => {
      typeof e == "function" && (t = e, e = !1), o.syncFSRequests++, o.syncFSRequests > 1 && re(`warning: ${o.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
      var r = o.getMounts(o.root.mount), n = 0;
      function s(l) {
        return o.syncFSRequests--, t(l);
      }
      function a(l) {
        if (l)
          return a.errored ? void 0 : (a.errored = !0, s(l));
        ++n >= r.length && s(null);
      }
      r.forEach((l) => {
        if (!l.type.syncfs)
          return a(null);
        l.type.syncfs(l, e, a);
      });
    }, mount: (e, t, r) => {
      var n = r === "/", s = !r, a;
      if (n && o.root)
        throw new o.ErrnoError(10);
      if (!n && !s) {
        var l = o.lookupPath(r, { follow_mount: !1 });
        if (r = l.path, a = l.node, o.isMountpoint(a))
          throw new o.ErrnoError(10);
        if (!o.isDir(a.mode))
          throw new o.ErrnoError(54);
      }
      var u = { type: e, opts: t, mountpoint: r, mounts: [] }, g = e.mount(u);
      return g.mount = u, u.root = g, n ? o.root = g : a && (a.mounted = u, a.mount && a.mount.mounts.push(u)), g;
    }, unmount: (e) => {
      var t = o.lookupPath(e, { follow_mount: !1 });
      if (!o.isMountpoint(t.node))
        throw new o.ErrnoError(28);
      var r = t.node, n = r.mounted, s = o.getMounts(n);
      Object.keys(o.nameTable).forEach((l) => {
        for (var u = o.nameTable[l]; u; ) {
          var g = u.name_next;
          s.includes(u.mount) && o.destroyNode(u), u = g;
        }
      }), r.mounted = null;
      var a = r.mount.mounts.indexOf(n);
      r.mount.mounts.splice(a, 1);
    }, lookup: (e, t) => e.node_ops.lookup(e, t), mknod: (e, t, r) => {
      var n = o.lookupPath(e, { parent: !0 }), s = n.node, a = G.basename(e);
      if (!a || a === "." || a === "..")
        throw new o.ErrnoError(28);
      var l = o.mayCreate(s, a);
      if (l)
        throw new o.ErrnoError(l);
      if (!s.node_ops.mknod)
        throw new o.ErrnoError(63);
      return s.node_ops.mknod(s, a, t, r);
    }, create: (e, t) => (t = t !== void 0 ? t : 438, t &= 4095, t |= 32768, o.mknod(e, t, 0)), mkdir: (e, t) => (t = t !== void 0 ? t : 511, t &= 1023, t |= 16384, o.mknod(e, t, 0)), mkdirTree: (e, t) => {
      for (var r = e.split("/"), n = "", s = 0; s < r.length; ++s)
        if (r[s]) {
          n += "/" + r[s];
          try {
            o.mkdir(n, t);
          } catch (a) {
            if (a.errno != 20)
              throw a;
          }
        }
    }, mkdev: (e, t, r) => (typeof r > "u" && (r = t, t = 438), t |= 8192, o.mknod(e, t, r)), symlink: (e, t) => {
      if (!ye.resolve(e))
        throw new o.ErrnoError(44);
      var r = o.lookupPath(t, { parent: !0 }), n = r.node;
      if (!n)
        throw new o.ErrnoError(44);
      var s = G.basename(t), a = o.mayCreate(n, s);
      if (a)
        throw new o.ErrnoError(a);
      if (!n.node_ops.symlink)
        throw new o.ErrnoError(63);
      return n.node_ops.symlink(n, s, e);
    }, rename: (e, t) => {
      var r = G.dirname(e), n = G.dirname(t), s = G.basename(e), a = G.basename(t), l, u, g;
      if (l = o.lookupPath(e, { parent: !0 }), u = l.node, l = o.lookupPath(t, { parent: !0 }), g = l.node, !u || !g)
        throw new o.ErrnoError(44);
      if (u.mount !== g.mount)
        throw new o.ErrnoError(75);
      var m = o.lookupNode(u, s), T = ye.relative(e, n);
      if (T.charAt(0) !== ".")
        throw new o.ErrnoError(28);
      if (T = ye.relative(t, r), T.charAt(0) !== ".")
        throw new o.ErrnoError(55);
      var S;
      try {
        S = o.lookupNode(g, a);
      } catch {
      }
      if (m !== S) {
        var k = o.isDir(m.mode), P = o.mayDelete(u, s, k);
        if (P)
          throw new o.ErrnoError(P);
        if (P = S ? o.mayDelete(g, a, k) : o.mayCreate(g, a), P)
          throw new o.ErrnoError(P);
        if (!u.node_ops.rename)
          throw new o.ErrnoError(63);
        if (o.isMountpoint(m) || S && o.isMountpoint(S))
          throw new o.ErrnoError(10);
        if (g !== u && (P = o.nodePermissions(u, "w"), P))
          throw new o.ErrnoError(P);
        o.hashRemoveNode(m);
        try {
          u.node_ops.rename(m, g, a);
        } catch (U) {
          throw U;
        } finally {
          o.hashAddNode(m);
        }
      }
    }, rmdir: (e) => {
      var t = o.lookupPath(e, { parent: !0 }), r = t.node, n = G.basename(e), s = o.lookupNode(r, n), a = o.mayDelete(r, n, !0);
      if (a)
        throw new o.ErrnoError(a);
      if (!r.node_ops.rmdir)
        throw new o.ErrnoError(63);
      if (o.isMountpoint(s))
        throw new o.ErrnoError(10);
      r.node_ops.rmdir(r, n), o.destroyNode(s);
    }, readdir: (e) => {
      var t = o.lookupPath(e, { follow: !0 }), r = t.node;
      if (!r.node_ops.readdir)
        throw new o.ErrnoError(54);
      return r.node_ops.readdir(r);
    }, unlink: (e) => {
      var t = o.lookupPath(e, { parent: !0 }), r = t.node;
      if (!r)
        throw new o.ErrnoError(44);
      var n = G.basename(e), s = o.lookupNode(r, n), a = o.mayDelete(r, n, !1);
      if (a)
        throw new o.ErrnoError(a);
      if (!r.node_ops.unlink)
        throw new o.ErrnoError(63);
      if (o.isMountpoint(s))
        throw new o.ErrnoError(10);
      r.node_ops.unlink(r, n), o.destroyNode(s);
    }, readlink: (e) => {
      var t = o.lookupPath(e), r = t.node;
      if (!r)
        throw new o.ErrnoError(44);
      if (!r.node_ops.readlink)
        throw new o.ErrnoError(28);
      return ye.resolve(o.getPath(r.parent), r.node_ops.readlink(r));
    }, stat: (e, t) => {
      var r = o.lookupPath(e, { follow: !t }), n = r.node;
      if (!n)
        throw new o.ErrnoError(44);
      if (!n.node_ops.getattr)
        throw new o.ErrnoError(63);
      return n.node_ops.getattr(n);
    }, lstat: (e) => o.stat(e, !0), chmod: (e, t, r) => {
      var n;
      if (typeof e == "string") {
        var s = o.lookupPath(e, { follow: !r });
        n = s.node;
      } else
        n = e;
      if (!n.node_ops.setattr)
        throw new o.ErrnoError(63);
      n.node_ops.setattr(n, { mode: t & 4095 | n.mode & -4096, timestamp: Date.now() });
    }, lchmod: (e, t) => {
      o.chmod(e, t, !0);
    }, fchmod: (e, t) => {
      var r = o.getStreamChecked(e);
      o.chmod(r.node, t);
    }, chown: (e, t, r, n) => {
      var s;
      if (typeof e == "string") {
        var a = o.lookupPath(e, { follow: !n });
        s = a.node;
      } else
        s = e;
      if (!s.node_ops.setattr)
        throw new o.ErrnoError(63);
      s.node_ops.setattr(s, { timestamp: Date.now() });
    }, lchown: (e, t, r) => {
      o.chown(e, t, r, !0);
    }, fchown: (e, t, r) => {
      var n = o.getStreamChecked(e);
      o.chown(n.node, t, r);
    }, truncate: (e, t) => {
      if (t < 0)
        throw new o.ErrnoError(28);
      var r;
      if (typeof e == "string") {
        var n = o.lookupPath(e, { follow: !0 });
        r = n.node;
      } else
        r = e;
      if (!r.node_ops.setattr)
        throw new o.ErrnoError(63);
      if (o.isDir(r.mode))
        throw new o.ErrnoError(31);
      if (!o.isFile(r.mode))
        throw new o.ErrnoError(28);
      var s = o.nodePermissions(r, "w");
      if (s)
        throw new o.ErrnoError(s);
      r.node_ops.setattr(r, { size: t, timestamp: Date.now() });
    }, ftruncate: (e, t) => {
      var r = o.getStreamChecked(e);
      if (!(r.flags & 2097155))
        throw new o.ErrnoError(28);
      o.truncate(r.node, t);
    }, utime: (e, t, r) => {
      var n = o.lookupPath(e, { follow: !0 }), s = n.node;
      s.node_ops.setattr(s, { timestamp: Math.max(t, r) });
    }, open: (e, t, r) => {
      if (e === "")
        throw new o.ErrnoError(44);
      t = typeof t == "string" ? qr(t) : t, r = typeof r > "u" ? 438 : r, t & 64 ? r = r & 4095 | 32768 : r = 0;
      var n;
      if (typeof e == "object")
        n = e;
      else {
        e = G.normalize(e);
        try {
          var s = o.lookupPath(e, { follow: !(t & 131072) });
          n = s.node;
        } catch {
        }
      }
      var a = !1;
      if (t & 64)
        if (n) {
          if (t & 128)
            throw new o.ErrnoError(20);
        } else
          n = o.mknod(e, r, 0), a = !0;
      if (!n)
        throw new o.ErrnoError(44);
      if (o.isChrdev(n.mode) && (t &= -513), t & 65536 && !o.isDir(n.mode))
        throw new o.ErrnoError(54);
      if (!a) {
        var l = o.mayOpen(n, t);
        if (l)
          throw new o.ErrnoError(l);
      }
      t & 512 && !a && o.truncate(n, 0), t &= -131713;
      var u = o.createStream({ node: n, path: o.getPath(n), flags: t, seekable: !0, position: 0, stream_ops: n.stream_ops, ungotten: [], error: !1 });
      return u.stream_ops.open && u.stream_ops.open(u), i.logReadFiles && !(t & 1) && (o.readFiles || (o.readFiles = {}), e in o.readFiles || (o.readFiles[e] = 1)), u;
    }, close: (e) => {
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      e.getdents && (e.getdents = null);
      try {
        e.stream_ops.close && e.stream_ops.close(e);
      } catch (t) {
        throw t;
      } finally {
        o.closeStream(e.fd);
      }
      e.fd = null;
    }, isClosed: (e) => e.fd === null, llseek: (e, t, r) => {
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if (!e.seekable || !e.stream_ops.llseek)
        throw new o.ErrnoError(70);
      if (r != 0 && r != 1 && r != 2)
        throw new o.ErrnoError(28);
      return e.position = e.stream_ops.llseek(e, t, r), e.ungotten = [], e.position;
    }, read: (e, t, r, n, s) => {
      if (n < 0 || s < 0)
        throw new o.ErrnoError(28);
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if ((e.flags & 2097155) === 1)
        throw new o.ErrnoError(8);
      if (o.isDir(e.node.mode))
        throw new o.ErrnoError(31);
      if (!e.stream_ops.read)
        throw new o.ErrnoError(28);
      var a = typeof s < "u";
      if (!a)
        s = e.position;
      else if (!e.seekable)
        throw new o.ErrnoError(70);
      var l = e.stream_ops.read(e, t, r, n, s);
      return a || (e.position += l), l;
    }, write: (e, t, r, n, s, a) => {
      if (n < 0 || s < 0)
        throw new o.ErrnoError(28);
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if (!(e.flags & 2097155))
        throw new o.ErrnoError(8);
      if (o.isDir(e.node.mode))
        throw new o.ErrnoError(31);
      if (!e.stream_ops.write)
        throw new o.ErrnoError(28);
      e.seekable && e.flags & 1024 && o.llseek(e, 0, 2);
      var l = typeof s < "u";
      if (!l)
        s = e.position;
      else if (!e.seekable)
        throw new o.ErrnoError(70);
      var u = e.stream_ops.write(e, t, r, n, s, a);
      return l || (e.position += u), u;
    }, allocate: (e, t, r) => {
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if (t < 0 || r <= 0)
        throw new o.ErrnoError(28);
      if (!(e.flags & 2097155))
        throw new o.ErrnoError(8);
      if (!o.isFile(e.node.mode) && !o.isDir(e.node.mode))
        throw new o.ErrnoError(43);
      if (!e.stream_ops.allocate)
        throw new o.ErrnoError(138);
      e.stream_ops.allocate(e, t, r);
    }, mmap: (e, t, r, n, s) => {
      if (n & 2 && !(s & 2) && (e.flags & 2097155) !== 2)
        throw new o.ErrnoError(2);
      if ((e.flags & 2097155) === 1)
        throw new o.ErrnoError(2);
      if (!e.stream_ops.mmap)
        throw new o.ErrnoError(43);
      return e.stream_ops.mmap(e, t, r, n, s);
    }, msync: (e, t, r, n, s) => e.stream_ops.msync ? e.stream_ops.msync(e, t, r, n, s) : 0, munmap: (e) => 0, ioctl: (e, t, r) => {
      if (!e.stream_ops.ioctl)
        throw new o.ErrnoError(59);
      return e.stream_ops.ioctl(e, t, r);
    }, readFile: (e, t = {}) => {
      if (t.flags = t.flags || 0, t.encoding = t.encoding || "binary", t.encoding !== "utf8" && t.encoding !== "binary")
        throw new Error(`Invalid encoding type "${t.encoding}"`);
      var r, n = o.open(e, t.flags), s = o.stat(e), a = s.size, l = new Uint8Array(a);
      return o.read(n, l, 0, a, 0), t.encoding === "utf8" ? r = Ie(l, 0) : t.encoding === "binary" && (r = l), o.close(n), r;
    }, writeFile: (e, t, r = {}) => {
      r.flags = r.flags || 577;
      var n = o.open(e, r.flags, r.mode);
      if (typeof t == "string") {
        var s = new Uint8Array(Tt(t) + 1), a = kt(t, s, 0, s.length);
        o.write(n, s, 0, a, void 0, r.canOwn);
      } else if (ArrayBuffer.isView(t))
        o.write(n, t, 0, t.byteLength, void 0, r.canOwn);
      else
        throw new Error("Unsupported data type");
      o.close(n);
    }, cwd: () => o.currentPath, chdir: (e) => {
      var t = o.lookupPath(e, { follow: !0 });
      if (t.node === null)
        throw new o.ErrnoError(44);
      if (!o.isDir(t.node.mode))
        throw new o.ErrnoError(54);
      var r = o.nodePermissions(t.node, "x");
      if (r)
        throw new o.ErrnoError(r);
      o.currentPath = t.path;
    }, createDefaultDirectories: () => {
      o.mkdir("/tmp"), o.mkdir("/home"), o.mkdir("/home/web_user");
    }, createDefaultDevices: () => {
      o.mkdir("/dev"), o.registerDevice(o.makedev(1, 3), { read: () => 0, write: (n, s, a, l, u) => l }), o.mkdev("/dev/null", o.makedev(1, 3)), Ce.register(o.makedev(5, 0), Ce.default_tty_ops), Ce.register(o.makedev(6, 0), Ce.default_tty1_ops), o.mkdev("/dev/tty", o.makedev(5, 0)), o.mkdev("/dev/tty1", o.makedev(6, 0));
      var e = new Uint8Array(1024), t = 0, r = () => (t === 0 && (t = Ht(e).byteLength), e[--t]);
      o.createDevice("/dev", "random", r), o.createDevice("/dev", "urandom", r), o.mkdir("/dev/shm"), o.mkdir("/dev/shm/tmp");
    }, createSpecialDirectories: () => {
      o.mkdir("/proc");
      var e = o.mkdir("/proc/self");
      o.mkdir("/proc/self/fd"), o.mount({ mount: () => {
        var t = o.createNode(e, "fd", 16895, 73);
        return t.node_ops = { lookup: (r, n) => {
          var s = +n, a = o.getStreamChecked(s), l = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => a.path } };
          return l.parent = l, l;
        } }, t;
      } }, {}, "/proc/self/fd");
    }, createStandardStreams: () => {
      i.stdin ? o.createDevice("/dev", "stdin", i.stdin) : o.symlink("/dev/tty", "/dev/stdin"), i.stdout ? o.createDevice("/dev", "stdout", null, i.stdout) : o.symlink("/dev/tty", "/dev/stdout"), i.stderr ? o.createDevice("/dev", "stderr", null, i.stderr) : o.symlink("/dev/tty1", "/dev/stderr"), o.open("/dev/stdin", 0), o.open("/dev/stdout", 1), o.open("/dev/stderr", 1);
    }, ensureErrnoError: () => {
      o.ErrnoError || (o.ErrnoError = function(t, r) {
        this.name = "ErrnoError", this.node = r, this.setErrno = function(n) {
          this.errno = n;
        }, this.setErrno(t), this.message = "FS error";
      }, o.ErrnoError.prototype = new Error(), o.ErrnoError.prototype.constructor = o.ErrnoError, [44].forEach((e) => {
        o.genericErrors[e] = new o.ErrnoError(e), o.genericErrors[e].stack = "<generic error, no stack>";
      }));
    }, staticInit: () => {
      o.ensureErrnoError(), o.nameTable = new Array(4096), o.mount(I, {}, "/"), o.createDefaultDirectories(), o.createDefaultDevices(), o.createSpecialDirectories(), o.filesystems = { MEMFS: I };
    }, init: (e, t, r) => {
      o.init.initialized = !0, o.ensureErrnoError(), i.stdin = e || i.stdin, i.stdout = t || i.stdout, i.stderr = r || i.stderr, o.createStandardStreams();
    }, quit: () => {
      o.init.initialized = !1;
      for (var e = 0; e < o.streams.length; e++) {
        var t = o.streams[e];
        t && o.close(t);
      }
    }, findObject: (e, t) => {
      var r = o.analyzePath(e, t);
      return r.exists ? r.object : null;
    }, analyzePath: (e, t) => {
      try {
        var r = o.lookupPath(e, { follow: !t });
        e = r.path;
      } catch {
      }
      var n = { isRoot: !1, exists: !1, error: 0, name: null, path: null, object: null, parentExists: !1, parentPath: null, parentObject: null };
      try {
        var r = o.lookupPath(e, { parent: !0 });
        n.parentExists = !0, n.parentPath = r.path, n.parentObject = r.node, n.name = G.basename(e), r = o.lookupPath(e, { follow: !t }), n.exists = !0, n.path = r.path, n.object = r.node, n.name = r.node.name, n.isRoot = r.path === "/";
      } catch (s) {
        n.error = s.errno;
      }
      return n;
    }, createPath: (e, t, r, n) => {
      e = typeof e == "string" ? e : o.getPath(e);
      for (var s = t.split("/").reverse(); s.length; ) {
        var a = s.pop();
        if (a) {
          var l = G.join2(e, a);
          try {
            o.mkdir(l);
          } catch {
          }
          e = l;
        }
      }
      return l;
    }, createFile: (e, t, r, n, s) => {
      var a = G.join2(typeof e == "string" ? e : o.getPath(e), t), l = Qe(n, s);
      return o.create(a, l);
    }, createDataFile: (e, t, r, n, s, a) => {
      var l = t;
      e && (e = typeof e == "string" ? e : o.getPath(e), l = t ? G.join2(e, t) : e);
      var u = Qe(n, s), g = o.create(l, u);
      if (r) {
        if (typeof r == "string") {
          for (var m = new Array(r.length), T = 0, S = r.length; T < S; ++T)
            m[T] = r.charCodeAt(T);
          r = m;
        }
        o.chmod(g, u | 146);
        var k = o.open(g, 577);
        o.write(k, r, 0, r.length, 0, a), o.close(k), o.chmod(g, u);
      }
      return g;
    }, createDevice: (e, t, r, n) => {
      var s = G.join2(typeof e == "string" ? e : o.getPath(e), t), a = Qe(!!r, !!n);
      o.createDevice.major || (o.createDevice.major = 64);
      var l = o.makedev(o.createDevice.major++, 0);
      return o.registerDevice(l, { open: (u) => {
        u.seekable = !1;
      }, close: (u) => {
        n && n.buffer && n.buffer.length && n(10);
      }, read: (u, g, m, T, S) => {
        for (var k = 0, P = 0; P < T; P++) {
          var U;
          try {
            U = r();
          } catch {
            throw new o.ErrnoError(29);
          }
          if (U === void 0 && k === 0)
            throw new o.ErrnoError(6);
          if (U == null)
            break;
          k++, g[m + P] = U;
        }
        return k && (u.node.timestamp = Date.now()), k;
      }, write: (u, g, m, T, S) => {
        for (var k = 0; k < T; k++)
          try {
            n(g[m + k]);
          } catch {
            throw new o.ErrnoError(29);
          }
        return T && (u.node.timestamp = Date.now()), k;
      } }), o.mkdev(s, a, l);
    }, forceLoadFile: (e) => {
      if (e.isDevice || e.isFolder || e.link || e.contents)
        return !0;
      if (typeof XMLHttpRequest < "u")
        throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
      if ($)
        try {
          e.contents = Ct($(e.url), !0), e.usedBytes = e.contents.length;
        } catch {
          throw new o.ErrnoError(29);
        }
      else
        throw new Error("Cannot load without read() or XMLHttpRequest.");
    }, createLazyFile: (e, t, r, n, s) => {
      function a() {
        this.lengthKnown = !1, this.chunks = [];
      }
      if (a.prototype.get = function(P) {
        if (!(P > this.length - 1 || P < 0)) {
          var U = P % this.chunkSize, Z = P / this.chunkSize | 0;
          return this.getter(Z)[U];
        }
      }, a.prototype.setDataGetter = function(P) {
        this.getter = P;
      }, a.prototype.cacheLength = function() {
        var P = new XMLHttpRequest();
        if (P.open("HEAD", r, !1), P.send(null), !(P.status >= 200 && P.status < 300 || P.status === 304))
          throw new Error("Couldn't load " + r + ". Status: " + P.status);
        var U = Number(P.getResponseHeader("Content-length")), Z, J = (Z = P.getResponseHeader("Accept-Ranges")) && Z === "bytes", oe = (Z = P.getResponseHeader("Content-Encoding")) && Z === "gzip", he = 1024 * 1024;
        J || (he = U);
        var ee = (ve, Se) => {
          if (ve > Se)
            throw new Error("invalid range (" + ve + ", " + Se + ") or no bytes requested!");
          if (Se > U - 1)
            throw new Error("only " + U + " bytes available! programmer error!");
          var se = new XMLHttpRequest();
          if (se.open("GET", r, !1), U !== he && se.setRequestHeader("Range", "bytes=" + ve + "-" + Se), se.responseType = "arraybuffer", se.overrideMimeType && se.overrideMimeType("text/plain; charset=x-user-defined"), se.send(null), !(se.status >= 200 && se.status < 300 || se.status === 304))
            throw new Error("Couldn't load " + r + ". Status: " + se.status);
          return se.response !== void 0 ? new Uint8Array(se.response || []) : Ct(se.responseText || "", !0);
        }, We = this;
        We.setDataGetter((ve) => {
          var Se = ve * he, se = (ve + 1) * he - 1;
          if (se = Math.min(se, U - 1), typeof We.chunks[ve] > "u" && (We.chunks[ve] = ee(Se, se)), typeof We.chunks[ve] > "u")
            throw new Error("doXHR failed!");
          return We.chunks[ve];
        }), (oe || !U) && (he = U = 1, U = this.getter(0).length, he = U, H("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = U, this._chunkSize = he, this.lengthKnown = !0;
      }, typeof XMLHttpRequest < "u") {
        if (!w)
          throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
        var l = new a();
        Object.defineProperties(l, { length: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._length;
        } }, chunkSize: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._chunkSize;
        } } });
        var u = { isDevice: !1, contents: l };
      } else
        var u = { isDevice: !1, url: r };
      var g = o.createFile(e, t, u, n, s);
      u.contents ? g.contents = u.contents : u.url && (g.contents = null, g.url = u.url), Object.defineProperties(g, { usedBytes: { get: function() {
        return this.contents.length;
      } } });
      var m = {}, T = Object.keys(g.stream_ops);
      T.forEach((k) => {
        var P = g.stream_ops[k];
        m[k] = function() {
          return o.forceLoadFile(g), P.apply(null, arguments);
        };
      });
      function S(k, P, U, Z, J) {
        var oe = k.node.contents;
        if (J >= oe.length)
          return 0;
        var he = Math.min(oe.length - J, Z);
        if (oe.slice)
          for (var ee = 0; ee < he; ee++)
            P[U + ee] = oe[J + ee];
        else
          for (var ee = 0; ee < he; ee++)
            P[U + ee] = oe.get(J + ee);
        return he;
      }
      return m.read = (k, P, U, Z, J) => (o.forceLoadFile(g), S(k, P, U, Z, J)), m.mmap = (k, P, U, Z, J) => {
        o.forceLoadFile(g);
        var oe = Vt();
        if (!oe)
          throw new o.ErrnoError(48);
        return S(k, ne, oe, P, U), { ptr: oe, allocated: !0 };
      }, g.stream_ops = m, g;
    } }, lt = (e, t) => e ? Ie(Q, e, t) : "", ue = { DEFAULT_POLLMASK: 5, calculateAt: function(e, t, r) {
      if (G.isAbs(t))
        return t;
      var n;
      if (e === -100)
        n = o.cwd();
      else {
        var s = ue.getStreamFromFD(e);
        n = s.path;
      }
      if (t.length == 0) {
        if (!r)
          throw new o.ErrnoError(44);
        return n;
      }
      return G.join2(n, t);
    }, doStat: function(e, t, r) {
      try {
        var n = e(t);
      } catch (u) {
        if (u && u.node && G.normalize(t) !== G.normalize(o.getPath(u.node)))
          return -54;
        throw u;
      }
      V[r >> 2] = n.dev, V[r + 4 >> 2] = n.mode, X[r + 8 >> 2] = n.nlink, V[r + 12 >> 2] = n.uid, V[r + 16 >> 2] = n.gid, V[r + 20 >> 2] = n.rdev, Y = [n.size >>> 0, (R = n.size, +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 24 >> 2] = Y[0], V[r + 28 >> 2] = Y[1], V[r + 32 >> 2] = 4096, V[r + 36 >> 2] = n.blocks;
      var s = n.atime.getTime(), a = n.mtime.getTime(), l = n.ctime.getTime();
      return Y = [Math.floor(s / 1e3) >>> 0, (R = Math.floor(s / 1e3), +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 40 >> 2] = Y[0], V[r + 44 >> 2] = Y[1], X[r + 48 >> 2] = s % 1e3 * 1e3, Y = [Math.floor(a / 1e3) >>> 0, (R = Math.floor(a / 1e3), +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 56 >> 2] = Y[0], V[r + 60 >> 2] = Y[1], X[r + 64 >> 2] = a % 1e3 * 1e3, Y = [Math.floor(l / 1e3) >>> 0, (R = Math.floor(l / 1e3), +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 72 >> 2] = Y[0], V[r + 76 >> 2] = Y[1], X[r + 80 >> 2] = l % 1e3 * 1e3, Y = [n.ino >>> 0, (R = n.ino, +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 88 >> 2] = Y[0], V[r + 92 >> 2] = Y[1], 0;
    }, doMsync: function(e, t, r, n, s) {
      if (!o.isFile(t.node.mode))
        throw new o.ErrnoError(43);
      if (n & 2)
        return 0;
      var a = Q.slice(e, e + r);
      o.msync(t, a, s, r, n);
    }, varargs: void 0, get() {
      ue.varargs += 4;
      var e = V[ue.varargs - 4 >> 2];
      return e;
    }, getStr(e) {
      var t = lt(e);
      return t;
    }, getStreamFromFD: function(e) {
      var t = o.getStreamChecked(e);
      return t;
    } };
    function Gr(e, t, r) {
      ue.varargs = r;
      try {
        var n = ue.getStreamFromFD(e);
        switch (t) {
          case 0: {
            var s = ue.get();
            if (s < 0)
              return -28;
            var a;
            return a = o.createStream(n, s), a.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return n.flags;
          case 4: {
            var s = ue.get();
            return n.flags |= s, 0;
          }
          case 5: {
            var s = ue.get(), l = 0;
            return Pe[s + l >> 1] = 2, 0;
          }
          case 6:
          case 7:
            return 0;
          case 16:
          case 8:
            return -28;
          case 9:
            return Wt(28), -1;
          default:
            return -28;
        }
      } catch (u) {
        if (typeof o > "u" || u.name !== "ErrnoError")
          throw u;
        return -u.errno;
      }
    }
    function $t(e, t, r, n) {
      ue.varargs = n;
      try {
        t = ue.getStr(t), t = ue.calculateAt(e, t);
        var s = n ? ue.get() : 0;
        return o.open(t, r, s).fd;
      } catch (a) {
        if (typeof o > "u" || a.name !== "ErrnoError")
          throw a;
        return -a.errno;
      }
    }
    function Xr(e, t, r, n, s) {
    }
    function St(e) {
      switch (e) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError(`Unknown type size: ${e}`);
      }
    }
    function Nt() {
      for (var e = new Array(256), t = 0; t < 256; ++t)
        e[t] = String.fromCharCode(t);
      ir = e;
    }
    var ir = void 0;
    function de(e) {
      for (var t = "", r = e; Q[r]; )
        t += ir[Q[r++]];
      return t;
    }
    var Le = {}, xe = {}, ct = {}, je = void 0;
    function N(e) {
      throw new je(e);
    }
    var Ne = void 0;
    function dt(e) {
      throw new Ne(e);
    }
    function Ye(e, t, r) {
      e.forEach(function(u) {
        ct[u] = t;
      });
      function n(u) {
        var g = r(u);
        g.length !== e.length && dt("Mismatched type converter count");
        for (var m = 0; m < e.length; ++m)
          we(e[m], g[m]);
      }
      var s = new Array(t.length), a = [], l = 0;
      t.forEach((u, g) => {
        xe.hasOwnProperty(u) ? s[g] = xe[u] : (a.push(u), Le.hasOwnProperty(u) || (Le[u] = []), Le[u].push(() => {
          s[g] = xe[u], ++l, l === a.length && n(s);
        }));
      }), a.length === 0 && n(s);
    }
    function qt(e, t, r = {}) {
      var n = t.name;
      if (e || N(`type "${n}" must have a positive integer typeid pointer`), xe.hasOwnProperty(e)) {
        if (r.ignoreDuplicateRegistrations)
          return;
        N(`Cannot register type '${n}' twice`);
      }
      if (xe[e] = t, delete ct[e], Le.hasOwnProperty(e)) {
        var s = Le[e];
        delete Le[e], s.forEach((a) => a());
      }
    }
    function we(e, t, r = {}) {
      if (!("argPackAdvance" in t))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      return qt(e, t, r);
    }
    function kr(e, t, r, n, s) {
      var a = St(r);
      t = de(t), we(e, { name: t, fromWireType: function(l) {
        return !!l;
      }, toWireType: function(l, u) {
        return u ? n : s;
      }, argPackAdvance: 8, readValueFromPointer: function(l) {
        var u;
        if (r === 1)
          u = ne;
        else if (r === 2)
          u = Pe;
        else if (r === 4)
          u = V;
        else
          throw new TypeError("Unknown boolean type size: " + t);
        return this.fromWireType(u[l >> a]);
      }, destructorFunction: null });
    }
    function Kr(e) {
      if (!(this instanceof ke) || !(e instanceof ke))
        return !1;
      for (var t = this.$$.ptrType.registeredClass, r = this.$$.ptr, n = e.$$.ptrType.registeredClass, s = e.$$.ptr; t.baseClass; )
        r = t.upcast(r), t = t.baseClass;
      for (; n.baseClass; )
        s = n.upcast(s), n = n.baseClass;
      return t === n && r === s;
    }
    function Qr(e) {
      return { count: e.count, deleteScheduled: e.deleteScheduled, preservePointerOnDelete: e.preservePointerOnDelete, ptr: e.ptr, ptrType: e.ptrType, smartPtr: e.smartPtr, smartPtrType: e.smartPtrType };
    }
    function ft(e) {
      function t(r) {
        return r.$$.ptrType.registeredClass.name;
      }
      N(t(e) + " instance already deleted");
    }
    var Dt = !1;
    function or(e) {
    }
    function Yr(e) {
      e.smartPtr ? e.smartPtrType.rawDestructor(e.smartPtr) : e.ptrType.registeredClass.rawDestructor(e.ptr);
    }
    function yt(e) {
      e.count.value -= 1;
      var t = e.count.value === 0;
      t && Yr(e);
    }
    function sr(e, t, r) {
      if (t === r)
        return e;
      if (r.baseClass === void 0)
        return null;
      var n = sr(e, t, r.baseClass);
      return n === null ? null : r.downcast(n);
    }
    var ar = {};
    function Zr() {
      return Object.keys(Je).length;
    }
    function Jr() {
      var e = [];
      for (var t in Je)
        Je.hasOwnProperty(t) && e.push(Je[t]);
      return e;
    }
    var _e = [];
    function At() {
      for (; _e.length; ) {
        var e = _e.pop();
        e.$$.deleteScheduled = !1, e.delete();
      }
    }
    var Ze = void 0;
    function Gt(e) {
      Ze = e, _e.length && Ze && Ze(At);
    }
    function Cr() {
      i.getInheritedInstanceCount = Zr, i.getLiveInheritedInstances = Jr, i.flushPendingDeletes = At, i.setDelayFunction = Gt;
    }
    var Je = {};
    function en(e, t) {
      for (t === void 0 && N("ptr should not be undefined"); e.baseClass; )
        t = e.upcast(t), e = e.baseClass;
      return t;
    }
    function wt(e, t) {
      return t = en(e, t), Je[t];
    }
    function ht(e, t) {
      (!t.ptrType || !t.ptr) && dt("makeClassHandle requires ptr and ptrType");
      var r = !!t.smartPtrType, n = !!t.smartPtr;
      return r !== n && dt("Both smartPtrType and smartPtr must be specified"), t.count = { value: 1 }, qe(Object.create(e, { $$: { value: t } }));
    }
    function $r(e) {
      var t = this.getPointee(e);
      if (!t)
        return this.destructor(e), null;
      var r = wt(this.registeredClass, t);
      if (r !== void 0) {
        if (r.$$.count.value === 0)
          return r.$$.ptr = t, r.$$.smartPtr = e, r.clone();
        var n = r.clone();
        return this.destructor(e), n;
      }
      function s() {
        return this.isSmartPointer ? ht(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: t, smartPtrType: this, smartPtr: e }) : ht(this.registeredClass.instancePrototype, { ptrType: this, ptr: e });
      }
      var a = this.registeredClass.getActualType(t), l = ar[a];
      if (!l)
        return s.call(this);
      var u;
      this.isConst ? u = l.constPointerType : u = l.pointerType;
      var g = sr(t, this.registeredClass, u.registeredClass);
      return g === null ? s.call(this) : this.isSmartPointer ? ht(u.registeredClass.instancePrototype, { ptrType: u, ptr: g, smartPtrType: this, smartPtr: e }) : ht(u.registeredClass.instancePrototype, { ptrType: u, ptr: g });
    }
    var qe = function(e) {
      return typeof FinalizationRegistry > "u" ? (qe = (t) => t, e) : (Dt = new FinalizationRegistry((t) => {
        yt(t.$$);
      }), qe = (t) => {
        var r = t.$$, n = !!r.smartPtr;
        if (n) {
          var s = { $$: r };
          Dt.register(t, s, t);
        }
        return t;
      }, or = (t) => Dt.unregister(t), qe(e));
    };
    function ur() {
      if (this.$$.ptr || ft(this), this.$$.preservePointerOnDelete)
        return this.$$.count.value += 1, this;
      var e = qe(Object.create(Object.getPrototypeOf(this), { $$: { value: Qr(this.$$) } }));
      return e.$$.count.value += 1, e.$$.deleteScheduled = !1, e;
    }
    function tn() {
      this.$$.ptr || ft(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && N("Object already scheduled for deletion"), or(this), yt(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
    }
    function Sr() {
      return !this.$$.ptr;
    }
    function rn() {
      return this.$$.ptr || ft(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && N("Object already scheduled for deletion"), _e.push(this), _e.length === 1 && Ze && Ze(At), this.$$.deleteScheduled = !0, this;
    }
    function Dr() {
      ke.prototype.isAliasOf = Kr, ke.prototype.clone = ur, ke.prototype.delete = tn, ke.prototype.isDeleted = Sr, ke.prototype.deleteLater = rn;
    }
    function ke() {
    }
    var nn = 48, on = 57;
    function pt(e) {
      if (e === void 0)
        return "_unknown";
      e = e.replace(/[^a-zA-Z0-9_]/g, "$");
      var t = e.charCodeAt(0);
      return t >= nn && t <= on ? `_${e}` : e;
    }
    function _t(e, t) {
      return e = pt(e), { [e]: function() {
        return t.apply(this, arguments);
      } }[e];
    }
    function Ue(e, t, r) {
      if (e[t].overloadTable === void 0) {
        var n = e[t];
        e[t] = function() {
          return e[t].overloadTable.hasOwnProperty(arguments.length) || N(`Function '${r}' called with an invalid number of arguments (${arguments.length}) - expects one of (${e[t].overloadTable})!`), e[t].overloadTable[arguments.length].apply(this, arguments);
        }, e[t].overloadTable = [], e[t].overloadTable[n.argCount] = n;
      }
    }
    function Ar(e, t, r) {
      i.hasOwnProperty(e) ? ((r === void 0 || i[e].overloadTable !== void 0 && i[e].overloadTable[r] !== void 0) && N(`Cannot register public name '${e}' twice`), Ue(i, e, e), i.hasOwnProperty(r) && N(`Cannot register multiple overloads of a function with the same number of arguments (${r})!`), i[e].overloadTable[r] = t) : (i[e] = t, r !== void 0 && (i[e].numArguments = r));
    }
    function sn(e, t, r, n, s, a, l, u) {
      this.name = e, this.constructor = t, this.instancePrototype = r, this.rawDestructor = n, this.baseClass = s, this.getActualType = a, this.upcast = l, this.downcast = u, this.pureVirtualFunctions = [];
    }
    function Ft(e, t, r) {
      for (; t !== r; )
        t.upcast || N(`Expected null or instance of ${r.name}, got an instance of ${t.name}`), e = t.upcast(e), t = t.baseClass;
      return e;
    }
    function Xt(e, t) {
      if (t === null)
        return this.isReference && N(`null is not a valid ${this.name}`), 0;
      t.$$ || N(`Cannot pass "${xt(t)}" as a ${this.name}`), t.$$.ptr || N(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var r = t.$$.ptrType.registeredClass, n = Ft(t.$$.ptr, r, this.registeredClass);
      return n;
    }
    function an(e, t) {
      var r;
      if (t === null)
        return this.isReference && N(`null is not a valid ${this.name}`), this.isSmartPointer ? (r = this.rawConstructor(), e !== null && e.push(this.rawDestructor, r), r) : 0;
      t.$$ || N(`Cannot pass "${xt(t)}" as a ${this.name}`), t.$$.ptr || N(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && t.$$.ptrType.isConst && N(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
      var n = t.$$.ptrType.registeredClass;
      if (r = Ft(t.$$.ptr, n, this.registeredClass), this.isSmartPointer)
        switch (t.$$.smartPtr === void 0 && N("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            t.$$.smartPtrType === this ? r = t.$$.smartPtr : N(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            r = t.$$.smartPtr;
            break;
          case 2:
            if (t.$$.smartPtrType === this)
              r = t.$$.smartPtr;
            else {
              var s = t.clone();
              r = this.rawShare(r, mt.toHandle(function() {
                s.delete();
              })), e !== null && e.push(this.rawDestructor, r);
            }
            break;
          default:
            N("Unsupporting sharing policy");
        }
      return r;
    }
    function lr(e, t) {
      if (t === null)
        return this.isReference && N(`null is not a valid ${this.name}`), 0;
      t.$$ || N(`Cannot pass "${xt(t)}" as a ${this.name}`), t.$$.ptr || N(`Cannot pass deleted object as a pointer of type ${this.name}`), t.$$.ptrType.isConst && N(`Cannot convert argument of type ${t.$$.ptrType.name} to parameter type ${this.name}`);
      var r = t.$$.ptrType.registeredClass, n = Ft(t.$$.ptr, r, this.registeredClass);
      return n;
    }
    function vt(e) {
      return this.fromWireType(V[e >> 2]);
    }
    function un(e) {
      return this.rawGetPointee && (e = this.rawGetPointee(e)), e;
    }
    function ln(e) {
      this.rawDestructor && this.rawDestructor(e);
    }
    function cn(e) {
      e !== null && e.delete();
    }
    function dn() {
      be.prototype.getPointee = un, be.prototype.destructor = ln, be.prototype.argPackAdvance = 8, be.prototype.readValueFromPointer = vt, be.prototype.deleteObject = cn, be.prototype.fromWireType = $r;
    }
    function be(e, t, r, n, s, a, l, u, g, m, T) {
      this.name = e, this.registeredClass = t, this.isReference = r, this.isConst = n, this.isSmartPointer = s, this.pointeeType = a, this.sharingPolicy = l, this.rawGetPointee = u, this.rawConstructor = g, this.rawShare = m, this.rawDestructor = T, !s && t.baseClass === void 0 ? n ? (this.toWireType = Xt, this.destructorFunction = null) : (this.toWireType = lr, this.destructorFunction = null) : this.toWireType = an;
    }
    function fn(e, t, r) {
      i.hasOwnProperty(e) || dt("Replacing nonexistant public symbol"), i[e].overloadTable !== void 0 && r !== void 0 ? i[e].overloadTable[r] = t : (i[e] = t, i[e].argCount = r);
    }
    var hn = (e, t, r) => {
      var n = i["dynCall_" + e];
      return r && r.length ? n.apply(null, [t].concat(r)) : n.call(null, t);
    }, it = [], Kt = (e) => {
      var t = it[e];
      return t || (e >= it.length && (it.length = e + 1), it[e] = t = Zt.get(e)), t;
    }, pn = (e, t, r) => {
      if (e.includes("j"))
        return hn(e, t, r);
      var n = Kt(t).apply(null, r);
      return n;
    }, vn = (e, t) => {
      var r = [];
      return function() {
        return r.length = 0, Object.assign(r, arguments), pn(e, t, r);
      };
    };
    function Be(e, t) {
      e = de(e);
      function r() {
        return e.includes("j") ? vn(e, t) : Kt(t);
      }
      var n = r();
      return typeof n != "function" && N(`unknown function pointer with signature ${e}: ${t}`), n;
    }
    function mn(e, t) {
      var r = _t(t, function(n) {
        this.name = t, this.message = n;
        var s = new Error(n).stack;
        s !== void 0 && (this.stack = this.toString() + `
` + s.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return r.prototype = Object.create(e.prototype), r.prototype.constructor = r, r.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, r;
    }
    var cr = void 0;
    function dr(e) {
      var t = Fn(e), r = de(t);
      return $e(t), r;
    }
    function Rt(e, t) {
      var r = [], n = {};
      function s(a) {
        if (!n[a] && !xe[a]) {
          if (ct[a]) {
            ct[a].forEach(s);
            return;
          }
          r.push(a), n[a] = !0;
        }
      }
      throw t.forEach(s), new cr(`${e}: ` + r.map(dr).join([", "]));
    }
    function gn(e, t, r, n, s, a, l, u, g, m, T, S, k) {
      T = de(T), a = Be(s, a), u && (u = Be(l, u)), m && (m = Be(g, m)), k = Be(S, k);
      var P = pt(T);
      Ar(P, function() {
        Rt(`Cannot construct ${T} due to unbound types`, [n]);
      }), Ye([e, t, r], n ? [n] : [], function(U) {
        U = U[0];
        var Z, J;
        n ? (Z = U.registeredClass, J = Z.instancePrototype) : J = ke.prototype;
        var oe = _t(P, function() {
          if (Object.getPrototypeOf(this) !== he)
            throw new je("Use 'new' to construct " + T);
          if (ee.constructor_body === void 0)
            throw new je(T + " has no accessible constructor");
          var se = ee.constructor_body[arguments.length];
          if (se === void 0)
            throw new je(`Tried to invoke ctor of ${T} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(ee.constructor_body).toString()}) parameters instead!`);
          return se.apply(this, arguments);
        }), he = Object.create(J, { constructor: { value: oe } });
        oe.prototype = he;
        var ee = new sn(T, oe, he, k, Z, a, u, m);
        ee.baseClass && (ee.baseClass.__derivedClasses === void 0 && (ee.baseClass.__derivedClasses = []), ee.baseClass.__derivedClasses.push(ee));
        var We = new be(T, ee, !0, !1, !1), ve = new be(T + "*", ee, !1, !1, !1), Se = new be(T + " const*", ee, !1, !0, !1);
        return ar[e] = { pointerType: ve, constPointerType: Se }, fn(P, oe), [We, ve, Se];
      });
    }
    function fr(e, t) {
      for (var r = [], n = 0; n < e; n++)
        r.push(X[t + n * 4 >> 2]);
      return r;
    }
    function yn(e) {
      for (; e.length; ) {
        var t = e.pop(), r = e.pop();
        r(t);
      }
    }
    function hr(e, t) {
      if (!(e instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof e} which is not a function`);
      var r = _t(e.name || "unknownFunctionName", function() {
      });
      r.prototype = e.prototype;
      var n = new r(), s = e.apply(n, t);
      return s instanceof Object ? s : n;
    }
    function pr(e, t, r, n, s, a) {
      var l = t.length;
      l < 2 && N("argTypes array size mismatch! Must at least get return value and 'this' types!");
      for (var u = t[1] !== null && r !== null, g = !1, m = 1; m < t.length; ++m)
        if (t[m] !== null && t[m].destructorFunction === void 0) {
          g = !0;
          break;
        }
      for (var T = t[0].name !== "void", S = "", k = "", m = 0; m < l - 2; ++m)
        S += (m !== 0 ? ", " : "") + "arg" + m, k += (m !== 0 ? ", " : "") + "arg" + m + "Wired";
      var P = `
        return function ${pt(e)}(${S}) {
        if (arguments.length !== ${l - 2}) {
          throwBindingError('function ${e} called with ${arguments.length} arguments, expected ${l - 2} args!');
        }`;
      g && (P += `var destructors = [];
`);
      var U = g ? "destructors" : "null", Z = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"], J = [N, n, s, yn, t[0], t[1]];
      u && (P += "var thisWired = classParam.toWireType(" + U + `, this);
`);
      for (var m = 0; m < l - 2; ++m)
        P += "var arg" + m + "Wired = argType" + m + ".toWireType(" + U + ", arg" + m + "); // " + t[m + 2].name + `
`, Z.push("argType" + m), J.push(t[m + 2]);
      if (u && (k = "thisWired" + (k.length > 0 ? ", " : "") + k), P += (T || a ? "var rv = " : "") + "invoker(fn" + (k.length > 0 ? ", " : "") + k + `);
`, g)
        P += `runDestructors(destructors);
`;
      else
        for (var m = u ? 1 : 2; m < t.length; ++m) {
          var oe = m === 1 ? "thisWired" : "arg" + (m - 2) + "Wired";
          t[m].destructorFunction !== null && (P += oe + "_dtor(" + oe + "); // " + t[m].name + `
`, Z.push(oe + "_dtor"), J.push(t[m].destructorFunction));
        }
      return T && (P += `var ret = retType.fromWireType(rv);
return ret;
`), P += `}
`, Z.push(P), hr(Function, Z).apply(null, J);
    }
    function wn(e, t, r, n, s, a) {
      var l = fr(t, r);
      s = Be(n, s), Ye([], [e], function(u) {
        u = u[0];
        var g = `constructor ${u.name}`;
        if (u.registeredClass.constructor_body === void 0 && (u.registeredClass.constructor_body = []), u.registeredClass.constructor_body[t - 1] !== void 0)
          throw new je(`Cannot register multiple constructors with identical number of parameters (${t - 1}) for class '${u.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return u.registeredClass.constructor_body[t - 1] = () => {
          Rt(`Cannot construct ${u.name} due to unbound types`, l);
        }, Ye([], l, function(m) {
          return m.splice(1, 0, null), u.registeredClass.constructor_body[t - 1] = pr(g, m, null, s, a), [];
        }), [];
      });
    }
    function vr(e, t, r, n, s, a, l, u, g) {
      var m = fr(r, n);
      t = de(t), a = Be(s, a), Ye([], [e], function(T) {
        T = T[0];
        var S = `${T.name}.${t}`;
        t.startsWith("@@") && (t = Symbol[t.substring(2)]), u && T.registeredClass.pureVirtualFunctions.push(t);
        function k() {
          Rt(`Cannot call ${S} due to unbound types`, m);
        }
        var P = T.registeredClass.instancePrototype, U = P[t];
        return U === void 0 || U.overloadTable === void 0 && U.className !== T.name && U.argCount === r - 2 ? (k.argCount = r - 2, k.className = T.name, P[t] = k) : (Ue(P, t, S), P[t].overloadTable[r - 2] = k), Ye([], m, function(Z) {
          var J = pr(S, Z, T, a, l, g);
          return P[t].overloadTable === void 0 ? (J.argCount = r - 2, P[t] = J) : P[t].overloadTable[r - 2] = J, [];
        }), [];
      });
    }
    function _n() {
      Object.assign(mr.prototype, { get(e) {
        return this.allocated[e];
      }, has(e) {
        return this.allocated[e] !== void 0;
      }, allocate(e) {
        var t = this.freelist.pop() || this.allocated.length;
        return this.allocated[t] = e, t;
      }, free(e) {
        this.allocated[e] = void 0, this.freelist.push(e);
      } });
    }
    function mr() {
      this.allocated = [void 0], this.freelist = [];
    }
    var ge = new mr();
    function gr(e) {
      e >= ge.reserved && --ge.get(e).refcount === 0 && ge.free(e);
    }
    function Fr() {
      for (var e = 0, t = ge.reserved; t < ge.allocated.length; ++t)
        ge.allocated[t] !== void 0 && ++e;
      return e;
    }
    function bn() {
      ge.allocated.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 }), ge.reserved = ge.allocated.length, i.count_emval_handles = Fr;
    }
    var mt = { toValue: (e) => (e || N("Cannot use deleted val. handle = " + e), ge.get(e).value), toHandle: (e) => {
      switch (e) {
        case void 0:
          return 1;
        case null:
          return 2;
        case !0:
          return 3;
        case !1:
          return 4;
        default:
          return ge.allocate({ refcount: 1, value: e });
      }
    } };
    function Rr(e, t) {
      t = de(t), we(e, { name: t, fromWireType: function(r) {
        var n = mt.toValue(r);
        return gr(r), n;
      }, toWireType: function(r, n) {
        return mt.toHandle(n);
      }, argPackAdvance: 8, readValueFromPointer: vt, destructorFunction: null });
    }
    function xt(e) {
      if (e === null)
        return "null";
      var t = typeof e;
      return t === "object" || t === "array" || t === "function" ? e.toString() : "" + e;
    }
    function En(e, t) {
      switch (t) {
        case 2:
          return function(r) {
            return this.fromWireType(Lt[r >> 2]);
          };
        case 3:
          return function(r) {
            return this.fromWireType(jt[r >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + e);
      }
    }
    function Pn(e, t, r) {
      var n = St(r);
      t = de(t), we(e, { name: t, fromWireType: function(s) {
        return s;
      }, toWireType: function(s, a) {
        return a;
      }, argPackAdvance: 8, readValueFromPointer: En(t, n), destructorFunction: null });
    }
    function Tn(e, t, r) {
      switch (t) {
        case 0:
          return r ? function(s) {
            return ne[s];
          } : function(s) {
            return Q[s];
          };
        case 1:
          return r ? function(s) {
            return Pe[s >> 1];
          } : function(s) {
            return tt[s >> 1];
          };
        case 2:
          return r ? function(s) {
            return V[s >> 2];
          } : function(s) {
            return X[s >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + e);
      }
    }
    function kn(e, t, r, n, s) {
      t = de(t);
      var a = St(r), l = (S) => S;
      if (n === 0) {
        var u = 32 - 8 * r;
        l = (S) => S << u >>> u;
      }
      var g = t.includes("unsigned"), m = (S, k) => {
      }, T;
      g ? T = function(S, k) {
        return m(k, this.name), k >>> 0;
      } : T = function(S, k) {
        return m(k, this.name), k;
      }, we(e, { name: t, fromWireType: l, toWireType: T, argPackAdvance: 8, readValueFromPointer: Tn(t, a, n !== 0), destructorFunction: null });
    }
    function Cn(e, t, r) {
      var n = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], s = n[t];
      function a(l) {
        l = l >> 2;
        var u = X, g = u[l], m = u[l + 1];
        return new s(u.buffer, m, g);
      }
      r = de(r), we(e, { name: r, fromWireType: a, argPackAdvance: 8, readValueFromPointer: a }, { ignoreDuplicateRegistrations: !0 });
    }
    var $n = (e, t, r) => kt(e, Q, t, r);
    function et(e, t) {
      t = de(t);
      var r = t === "std::string";
      we(e, { name: t, fromWireType: function(n) {
        var s = X[n >> 2], a = n + 4, l;
        if (r)
          for (var u = a, g = 0; g <= s; ++g) {
            var m = a + g;
            if (g == s || Q[m] == 0) {
              var T = m - u, S = lt(u, T);
              l === void 0 ? l = S : (l += String.fromCharCode(0), l += S), u = m + 1;
            }
          }
        else {
          for (var k = new Array(s), g = 0; g < s; ++g)
            k[g] = String.fromCharCode(Q[a + g]);
          l = k.join("");
        }
        return $e(n), l;
      }, toWireType: function(n, s) {
        s instanceof ArrayBuffer && (s = new Uint8Array(s));
        var a, l = typeof s == "string";
        l || s instanceof Uint8Array || s instanceof Uint8ClampedArray || s instanceof Int8Array || N("Cannot pass non-string to std::string"), r && l ? a = Tt(s) : a = s.length;
        var u = wr(4 + a + 1), g = u + 4;
        if (X[u >> 2] = a, r && l)
          $n(s, g, a + 1);
        else if (l)
          for (var m = 0; m < a; ++m) {
            var T = s.charCodeAt(m);
            T > 255 && ($e(g), N("String has UTF-16 code units that do not fit in 8 bits")), Q[g + m] = T;
          }
        else
          for (var m = 0; m < a; ++m)
            Q[g + m] = s[m];
        return n !== null && n.push($e, u), u;
      }, argPackAdvance: 8, readValueFromPointer: vt, destructorFunction: function(n) {
        $e(n);
      } });
    }
    var Ut = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, xr = (e, t) => {
      for (var r = e, n = r >> 1, s = n + t / 2; !(n >= s) && tt[n]; )
        ++n;
      if (r = n << 1, r - e > 32 && Ut)
        return Ut.decode(Q.subarray(e, r));
      for (var a = "", l = 0; !(l >= t / 2); ++l) {
        var u = Pe[e + l * 2 >> 1];
        if (u == 0)
          break;
        a += String.fromCharCode(u);
      }
      return a;
    }, Ur = (e, t, r) => {
      if (r === void 0 && (r = 2147483647), r < 2)
        return 0;
      r -= 2;
      for (var n = t, s = r < e.length * 2 ? r / 2 : e.length, a = 0; a < s; ++a) {
        var l = e.charCodeAt(a);
        Pe[t >> 1] = l, t += 2;
      }
      return Pe[t >> 1] = 0, t - n;
    }, Qt = (e) => e.length * 2, Br = (e, t) => {
      for (var r = 0, n = ""; !(r >= t / 4); ) {
        var s = V[e + r * 4 >> 2];
        if (s == 0)
          break;
        if (++r, s >= 65536) {
          var a = s - 65536;
          n += String.fromCharCode(55296 | a >> 10, 56320 | a & 1023);
        } else
          n += String.fromCharCode(s);
      }
      return n;
    }, d = (e, t, r) => {
      if (r === void 0 && (r = 2147483647), r < 4)
        return 0;
      for (var n = t, s = n + r - 4, a = 0; a < e.length; ++a) {
        var l = e.charCodeAt(a);
        if (l >= 55296 && l <= 57343) {
          var u = e.charCodeAt(++a);
          l = 65536 + ((l & 1023) << 10) | u & 1023;
        }
        if (V[t >> 2] = l, t += 4, t + 4 > s)
          break;
      }
      return V[t >> 2] = 0, t - n;
    }, f = (e) => {
      for (var t = 0, r = 0; r < e.length; ++r) {
        var n = e.charCodeAt(r);
        n >= 55296 && n <= 57343 && ++r, t += 4;
      }
      return t;
    }, v = function(e, t, r) {
      r = de(r);
      var n, s, a, l, u;
      t === 2 ? (n = xr, s = Ur, l = Qt, a = () => tt, u = 1) : t === 4 && (n = Br, s = d, l = f, a = () => X, u = 2), we(e, { name: r, fromWireType: function(g) {
        for (var m = X[g >> 2], T = a(), S, k = g + 4, P = 0; P <= m; ++P) {
          var U = g + 4 + P * t;
          if (P == m || T[U >> u] == 0) {
            var Z = U - k, J = n(k, Z);
            S === void 0 ? S = J : (S += String.fromCharCode(0), S += J), k = U + t;
          }
        }
        return $e(g), S;
      }, toWireType: function(g, m) {
        typeof m != "string" && N(`Cannot pass non-string to C++ string type ${r}`);
        var T = l(m), S = wr(4 + T + t);
        return X[S >> 2] = T >> u, s(m, S + 4, T + t), g !== null && g.push($e, S), S;
      }, argPackAdvance: 8, readValueFromPointer: vt, destructorFunction: function(g) {
        $e(g);
      } });
    };
    function E(e, t) {
      t = de(t), we(e, { isVoid: !0, name: t, argPackAdvance: 0, fromWireType: function() {
      }, toWireType: function(r, n) {
      } });
    }
    var D = {};
    function x(e) {
      var t = D[e];
      return t === void 0 ? de(e) : t;
    }
    var B = [];
    function F(e, t, r, n) {
      e = B[e], t = mt.toValue(t), r = x(r), e(t, r, null, n);
    }
    function q(e) {
      var t = B.length;
      return B.push(e), t;
    }
    function M(e, t) {
      var r = xe[e];
      return r === void 0 && N(t + " has unknown type " + dr(e)), r;
    }
    function te(e, t) {
      for (var r = new Array(e), n = 0; n < e; ++n)
        r[n] = M(X[t + n * 4 >> 2], "parameter " + n);
      return r;
    }
    var ie = [];
    function le(e, t) {
      var r = te(e, t), n = r[0], s = n.name + "_$" + r.slice(1).map(function(U) {
        return U.name;
      }).join("_") + "$", a = ie[s];
      if (a !== void 0)
        return a;
      for (var l = ["retType"], u = [n], g = "", m = 0; m < e - 1; ++m)
        g += (m !== 0 ? ", " : "") + "arg" + m, l.push("argType" + m), u.push(r[1 + m]);
      for (var T = pt("methodCaller_" + s), S = "return function " + T + `(handle, name, destructors, args) {
`, k = 0, m = 0; m < e - 1; ++m)
        S += "    var arg" + m + " = argType" + m + ".readValueFromPointer(args" + (k ? "+" + k : "") + `);
`, k += r[m + 1].argPackAdvance;
      S += "    var rv = handle[name](" + g + `);
`;
      for (var m = 0; m < e - 1; ++m)
        r[m + 1].deleteObject && (S += "    argType" + m + ".deleteObject(arg" + m + `);
`);
      n.isVoid || (S += `    return retType.toWireType(destructors, rv);
`), S += `};
`, l.push(S);
      var P = hr(Function, l).apply(null, u);
      return a = q(P), ie[s] = a, a;
    }
    function fe(e, t) {
      return t + 2097152 >>> 0 < 4194305 - !!e ? (e >>> 0) + t * 4294967296 : NaN;
    }
    var Ee = () => {
      Ae("");
    };
    function Me() {
      return Date.now();
    }
    var De = () => Q.length, ot = () => De(), yr = (e, t, r) => Q.copyWithin(e, t, t + r), ze = (e) => {
      Ae("OOM");
    }, Sn = (e) => {
      Q.length, ze();
    }, bt = {}, Mr = () => _ || "./this.program", Ge = () => {
      if (!Ge.strings) {
        var e = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", t = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: e, _: Mr() };
        for (var r in bt)
          bt[r] === void 0 ? delete t[r] : t[r] = bt[r];
        var n = [];
        for (var r in t)
          n.push(`${r}=${t[r]}`);
        Ge.strings = n;
      }
      return Ge.strings;
    }, Hn = (e, t) => {
      for (var r = 0; r < e.length; ++r)
        ne[t++ >> 0] = e.charCodeAt(r);
      ne[t >> 0] = 0;
    }, Vn = (e, t) => {
      var r = 0;
      return Ge().forEach(function(n, s) {
        var a = t + r;
        X[e + s * 4 >> 2] = a, Hn(n, a), r += n.length + 1;
      }), 0;
    }, Nn = (e, t) => {
      var r = Ge();
      X[e >> 2] = r.length;
      var n = 0;
      return r.forEach(function(s) {
        n += s.length + 1;
      }), X[t >> 2] = n, 0;
    };
    function qn(e) {
      try {
        var t = ue.getStreamFromFD(e);
        return o.close(t), 0;
      } catch (r) {
        if (typeof o > "u" || r.name !== "ErrnoError")
          throw r;
        return r.errno;
      }
    }
    function Gn(e, t) {
      try {
        var r = 0, n = 0, s = 0, a = ue.getStreamFromFD(e), l = a.tty ? 2 : o.isDir(a.mode) ? 3 : o.isLink(a.mode) ? 7 : 4;
        return ne[t >> 0] = l, Pe[t + 2 >> 1] = s, Y = [r >>> 0, (R = r, +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[t + 8 >> 2] = Y[0], V[t + 12 >> 2] = Y[1], Y = [n >>> 0, (R = n, +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[t + 16 >> 2] = Y[0], V[t + 20 >> 2] = Y[1], 0;
      } catch (u) {
        if (typeof o > "u" || u.name !== "ErrnoError")
          throw u;
        return u.errno;
      }
    }
    var Xn = (e, t, r, n) => {
      for (var s = 0, a = 0; a < r; a++) {
        var l = X[t >> 2], u = X[t + 4 >> 2];
        t += 8;
        var g = o.read(e, ne, l, u, n);
        if (g < 0)
          return -1;
        if (s += g, g < u)
          break;
        typeof n < "u" && (n += g);
      }
      return s;
    };
    function Kn(e, t, r, n) {
      try {
        var s = ue.getStreamFromFD(e), a = Xn(s, t, r);
        return X[n >> 2] = a, 0;
      } catch (l) {
        if (typeof o > "u" || l.name !== "ErrnoError")
          throw l;
        return l.errno;
      }
    }
    function Qn(e, t, r, n, s) {
      var a = fe(t, r);
      try {
        if (isNaN(a))
          return 61;
        var l = ue.getStreamFromFD(e);
        return o.llseek(l, a, n), Y = [l.position >>> 0, (R = l.position, +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[s >> 2] = Y[0], V[s + 4 >> 2] = Y[1], l.getdents && a === 0 && n === 0 && (l.getdents = null), 0;
      } catch (u) {
        if (typeof o > "u" || u.name !== "ErrnoError")
          throw u;
        return u.errno;
      }
    }
    var Yn = (e, t, r, n) => {
      for (var s = 0, a = 0; a < r; a++) {
        var l = X[t >> 2], u = X[t + 4 >> 2];
        t += 8;
        var g = o.write(e, ne, l, u, n);
        if (g < 0)
          return -1;
        s += g, typeof n < "u" && (n += g);
      }
      return s;
    };
    function Zn(e, t, r, n) {
      try {
        var s = ue.getStreamFromFD(e), a = Yn(s, t, r);
        return X[n >> 2] = a, 0;
      } catch (l) {
        if (typeof o > "u" || l.name !== "ErrnoError")
          throw l;
        return l.errno;
      }
    }
    var Dn = function(e, t, r, n) {
      e || (e = this), this.parent = e, this.mount = e.mount, this.mounted = null, this.id = o.nextInode++, this.name = t, this.mode = r, this.node_ops = {}, this.stream_ops = {}, this.rdev = n;
    }, Bt = 365, Mt = 146;
    Object.defineProperties(Dn.prototype, { read: { get: function() {
      return (this.mode & Bt) === Bt;
    }, set: function(e) {
      e ? this.mode |= Bt : this.mode &= ~Bt;
    } }, write: { get: function() {
      return (this.mode & Mt) === Mt;
    }, set: function(e) {
      e ? this.mode |= Mt : this.mode &= ~Mt;
    } }, isFolder: { get: function() {
      return o.isDir(this.mode);
    } }, isDevice: { get: function() {
      return o.isChrdev(this.mode);
    } } }), o.FSNode = Dn, o.createPreloadedFile = Nr, o.staticInit(), Nt(), je = i.BindingError = class extends Error {
      constructor(t) {
        super(t), this.name = "BindingError";
      }
    }, Ne = i.InternalError = class extends Error {
      constructor(t) {
        super(t), this.name = "InternalError";
      }
    }, Dr(), Cr(), dn(), cr = i.UnboundTypeError = mn(Error, "UnboundTypeError"), _n(), bn();
    var Jn = { p: at, C: Gr, w: $t, t: Xr, n: kr, r: gn, q: wn, d: vr, D: Rr, k: Pn, c: kn, b: Cn, j: et, f: v, o: E, g: F, m: gr, l: le, a: Ee, e: Me, v: ot, A: yr, u: Sn, y: Vn, z: Nn, i: qn, x: Gn, B: Kn, s: Qn, h: Zn };
    Vr();
    var wr = (e) => (wr = K.G)(e), $e = (e) => ($e = K.I)(e), An = () => (An = K.J)(), Fn = (e) => (Fn = K.K)(e);
    i.__embind_initialize_bindings = () => (i.__embind_initialize_bindings = K.L)();
    var Rn = (e) => (Rn = K.M)(e);
    i.dynCall_jiji = (e, t, r, n, s) => (i.dynCall_jiji = K.N)(e, t, r, n, s), i._ff_h264_cabac_tables = 67061;
    var Ot;
    Ke = function e() {
      Ot || xn(), Ot || (Ke = e);
    };
    function xn() {
      if (Te > 0 || (Ir(), Te > 0))
        return;
      function e() {
        Ot || (Ot = !0, i.calledRun = !0, !ae && (Lr(), p(i), i.onRuntimeInitialized && i.onRuntimeInitialized(), st()));
      }
      i.setStatus ? (i.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          i.setStatus("");
        }, 1), e();
      }, 1)) : e();
    }
    if (i.preInit)
      for (typeof i.preInit == "function" && (i.preInit = [i.preInit]); i.preInit.length > 0; )
        i.preInit.pop()();
    return xn(), c.ready;
  };
})();
class _i extends On {
  constructor(c) {
    super(wi, c != null && c.wasmPath ? fetch(c == null ? void 0 : c.wasmPath).then((i) => i.arrayBuffer()) : void 0, c == null ? void 0 : c.workerMode, c == null ? void 0 : c.canvas, c == null ? void 0 : c.yuvMode);
  }
}
var bi = (() => {
  var L = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
  return function(c = {}) {
    var i = c, p, h;
    i.ready = new Promise((e, t) => {
      p = e, h = t;
    });
    var b = Object.assign({}, i), _ = "./this.program", C = typeof window == "object", w = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && process.versions.node;
    var y = "";
    function A(e) {
      return i.locateFile ? i.locateFile(e, y) : y + e;
    }
    var $, z, W;
    (C || w) && (w ? y = self.location.href : typeof document < "u" && document.currentScript && (y = document.currentScript.src), L && (y = L), y.indexOf("blob:") !== 0 ? y = y.substr(0, y.replace(/[?#].*/, "").lastIndexOf("/") + 1) : y = "", $ = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.send(null), t.responseText;
    }, w && (W = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
    }), z = (e, t, r) => {
      var n = new XMLHttpRequest();
      n.open("GET", e, !0), n.responseType = "arraybuffer", n.onload = () => {
        if (n.status == 200 || n.status == 0 && n.response) {
          t(n.response);
          return;
        }
        r();
      }, n.onerror = r, n.send(null);
    });
    var H = i.print || console.log.bind(console), re = i.printErr || console.error.bind(console);
    Object.assign(i, b), b = null, i.arguments && i.arguments, i.thisProgram && (_ = i.thisProgram), i.quit && i.quit;
    var j;
    i.wasmBinary && (j = i.wasmBinary), i.noExitRuntime, typeof WebAssembly != "object" && Ae("no native wasm support detected");
    var pe, K, ae = !1;
    function He(e, t) {
      e || Ae(t);
    }
    var ne, Q, Pe, tt, V, X, Lt, jt;
    function _r() {
      var e = pe.buffer;
      i.HEAP8 = ne = new Int8Array(e), i.HEAP16 = Pe = new Int16Array(e), i.HEAP32 = V = new Int32Array(e), i.HEAPU8 = Q = new Uint8Array(e), i.HEAPU16 = tt = new Uint16Array(e), i.HEAPU32 = X = new Uint32Array(e), i.HEAPF32 = Lt = new Float32Array(e), i.HEAPF64 = jt = new Float64Array(e);
    }
    var Zt, Jt = [], er = [], tr = [];
    function Ir() {
      if (i.preRun)
        for (typeof i.preRun == "function" && (i.preRun = [i.preRun]); i.preRun.length; )
          Et(i.preRun.shift());
      gt(Jt);
    }
    function Lr() {
      !i.noFSInit && !o.init.initialized && o.init(), o.ignorePermissions = !1, gt(er);
    }
    function st() {
      if (i.postRun)
        for (typeof i.postRun == "function" && (i.postRun = [i.postRun]); i.postRun.length; )
          zr(i.postRun.shift());
      gt(tr);
    }
    function Et(e) {
      Jt.unshift(e);
    }
    function jr(e) {
      er.unshift(e);
    }
    function zr(e) {
      tr.unshift(e);
    }
    var Te = 0, Ke = null;
    function Ln(e) {
      return e;
    }
    function Ve(e) {
      Te++, i.monitorRunDependencies && i.monitorRunDependencies(Te);
    }
    function rt(e) {
      if (Te--, i.monitorRunDependencies && i.monitorRunDependencies(Te), Te == 0 && Ke) {
        var t = Ke;
        Ke = null, t();
      }
    }
    function Ae(e) {
      i.onAbort && i.onAbort(e), e = "Aborted(" + e + ")", re(e), ae = !0, e += ". Build with -sASSERTIONS for more info.";
      var t = new WebAssembly.RuntimeError(e);
      throw h(t), t;
    }
    var br = "data:application/octet-stream;base64,";
    function rr(e) {
      return e.startsWith(br);
    }
    var Oe;
    Oe = "audiodec.wasm", rr(Oe) || (Oe = A(Oe));
    function Pt(e) {
      if (e == Oe && j)
        return new Uint8Array(j);
      if (W)
        return W(e);
      throw "both async and sync fetching of the wasm failed";
    }
    function Wr(e) {
      return !j && (C || w) && typeof fetch == "function" ? fetch(e, { credentials: "same-origin" }).then((t) => {
        if (!t.ok)
          throw "failed to load wasm binary file at '" + e + "'";
        return t.arrayBuffer();
      }).catch(() => Pt(e)) : Promise.resolve().then(() => Pt(e));
    }
    function zt(e, t, r) {
      return Wr(e).then((n) => WebAssembly.instantiate(n, t)).then((n) => n).then(r, (n) => {
        re("failed to asynchronously prepare wasm: " + n), Ae(n);
      });
    }
    function Hr(e, t, r, n) {
      return !e && typeof WebAssembly.instantiateStreaming == "function" && !rr(t) && typeof fetch == "function" ? fetch(t, { credentials: "same-origin" }).then((s) => {
        var a = WebAssembly.instantiateStreaming(s, r);
        return a.then(n, function(l) {
          return re("wasm streaming compile failed: " + l), re("falling back to ArrayBuffer instantiation"), zt(t, r, n);
        });
      }) : zt(t, r, n);
    }
    function Vr() {
      var e = { a: Jn };
      function t(n, s) {
        var a = n.exports;
        return K = a, pe = K.E, _r(), Zt = K.H, jr(K.F), rt(), a;
      }
      Ve();
      function r(n) {
        t(n.instance);
      }
      if (i.instantiateWasm)
        try {
          return i.instantiateWasm(e, t);
        } catch (n) {
          re("Module.instantiateWasm callback failed with error: " + n), h(n);
        }
      return Hr(j, Oe, e, r).catch(h), {};
    }
    var R, Y, gt = (e) => {
      for (; e.length > 0; )
        e.shift()(i);
    };
    function Fe(e) {
      this.excPtr = e, this.ptr = e - 24, this.set_type = function(t) {
        X[this.ptr + 4 >> 2] = t;
      }, this.get_type = function() {
        return X[this.ptr + 4 >> 2];
      }, this.set_destructor = function(t) {
        X[this.ptr + 8 >> 2] = t;
      }, this.get_destructor = function() {
        return X[this.ptr + 8 >> 2];
      }, this.set_caught = function(t) {
        t = t ? 1 : 0, ne[this.ptr + 12 >> 0] = t;
      }, this.get_caught = function() {
        return ne[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(t) {
        t = t ? 1 : 0, ne[this.ptr + 13 >> 0] = t;
      }, this.get_rethrown = function() {
        return ne[this.ptr + 13 >> 0] != 0;
      }, this.init = function(t, r) {
        this.set_adjusted_ptr(0), this.set_type(t), this.set_destructor(r);
      }, this.set_adjusted_ptr = function(t) {
        X[this.ptr + 16 >> 2] = t;
      }, this.get_adjusted_ptr = function() {
        return X[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var t = Rn(this.get_type());
        if (t)
          return X[this.excPtr >> 2];
        var r = this.get_adjusted_ptr();
        return r !== 0 ? r : this.excPtr;
      };
    }
    var nt = 0;
    function at(e, t, r) {
      var n = new Fe(e);
      throw n.init(t, r), nt = e, nt;
    }
    var Wt = (e) => (V[An() >> 2] = e, e), G = { isAbs: (e) => e.charAt(0) === "/", splitPath: (e) => {
      var t = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
      return t.exec(e).slice(1);
    }, normalizeArray: (e, t) => {
      for (var r = 0, n = e.length - 1; n >= 0; n--) {
        var s = e[n];
        s === "." ? e.splice(n, 1) : s === ".." ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--);
      }
      if (t)
        for (; r; r--)
          e.unshift("..");
      return e;
    }, normalize: (e) => {
      var t = G.isAbs(e), r = e.substr(-1) === "/";
      return e = G.normalizeArray(e.split("/").filter((n) => !!n), !t).join("/"), !e && !t && (e = "."), e && r && (e += "/"), (t ? "/" : "") + e;
    }, dirname: (e) => {
      var t = G.splitPath(e), r = t[0], n = t[1];
      return !r && !n ? "." : (n && (n = n.substr(0, n.length - 1)), r + n);
    }, basename: (e) => {
      if (e === "/")
        return "/";
      e = G.normalize(e), e = e.replace(/\/$/, "");
      var t = e.lastIndexOf("/");
      return t === -1 ? e : e.substr(t + 1);
    }, join: function() {
      var e = Array.prototype.slice.call(arguments);
      return G.normalize(e.join("/"));
    }, join2: (e, t) => G.normalize(e + "/" + t) }, ce = () => {
      if (typeof crypto == "object" && typeof crypto.getRandomValues == "function")
        return (e) => crypto.getRandomValues(e);
      Ae("initRandomDevice");
    }, Ht = (e) => (Ht = ce())(e), ye = { resolve: function() {
      for (var e = "", t = !1, r = arguments.length - 1; r >= -1 && !t; r--) {
        var n = r >= 0 ? arguments[r] : o.cwd();
        if (typeof n != "string")
          throw new TypeError("Arguments to path.resolve must be strings");
        if (!n)
          return "";
        e = n + "/" + e, t = G.isAbs(n);
      }
      return e = G.normalizeArray(e.split("/").filter((s) => !!s), !t).join("/"), (t ? "/" : "") + e || ".";
    }, relative: (e, t) => {
      e = ye.resolve(e).substr(1), t = ye.resolve(t).substr(1);
      function r(m) {
        for (var T = 0; T < m.length && m[T] === ""; T++)
          ;
        for (var S = m.length - 1; S >= 0 && m[S] === ""; S--)
          ;
        return T > S ? [] : m.slice(T, S - T + 1);
      }
      for (var n = r(e.split("/")), s = r(t.split("/")), a = Math.min(n.length, s.length), l = a, u = 0; u < a; u++)
        if (n[u] !== s[u]) {
          l = u;
          break;
        }
      for (var g = [], u = l; u < n.length; u++)
        g.push("..");
      return g = g.concat(s.slice(l)), g.join("/");
    } }, ut = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, Ie = (e, t, r) => {
      for (var n = t + r, s = t; e[s] && !(s >= n); )
        ++s;
      if (s - t > 16 && e.buffer && ut)
        return ut.decode(e.subarray(t, s));
      for (var a = ""; t < s; ) {
        var l = e[t++];
        if (!(l & 128)) {
          a += String.fromCharCode(l);
          continue;
        }
        var u = e[t++] & 63;
        if ((l & 224) == 192) {
          a += String.fromCharCode((l & 31) << 6 | u);
          continue;
        }
        var g = e[t++] & 63;
        if ((l & 240) == 224 ? l = (l & 15) << 12 | u << 6 | g : l = (l & 7) << 18 | u << 12 | g << 6 | e[t++] & 63, l < 65536)
          a += String.fromCharCode(l);
        else {
          var m = l - 65536;
          a += String.fromCharCode(55296 | m >> 10, 56320 | m & 1023);
        }
      }
      return a;
    }, Re = [], Tt = (e) => {
      for (var t = 0, r = 0; r < e.length; ++r) {
        var n = e.charCodeAt(r);
        n <= 127 ? t++ : n <= 2047 ? t += 2 : n >= 55296 && n <= 57343 ? (t += 4, ++r) : t += 3;
      }
      return t;
    }, kt = (e, t, r, n) => {
      if (!(n > 0))
        return 0;
      for (var s = r, a = r + n - 1, l = 0; l < e.length; ++l) {
        var u = e.charCodeAt(l);
        if (u >= 55296 && u <= 57343) {
          var g = e.charCodeAt(++l);
          u = 65536 + ((u & 1023) << 10) | g & 1023;
        }
        if (u <= 127) {
          if (r >= a)
            break;
          t[r++] = u;
        } else if (u <= 2047) {
          if (r + 1 >= a)
            break;
          t[r++] = 192 | u >> 6, t[r++] = 128 | u & 63;
        } else if (u <= 65535) {
          if (r + 2 >= a)
            break;
          t[r++] = 224 | u >> 12, t[r++] = 128 | u >> 6 & 63, t[r++] = 128 | u & 63;
        } else {
          if (r + 3 >= a)
            break;
          t[r++] = 240 | u >> 18, t[r++] = 128 | u >> 12 & 63, t[r++] = 128 | u >> 6 & 63, t[r++] = 128 | u & 63;
        }
      }
      return t[r] = 0, r - s;
    };
    function Ct(e, t, r) {
      var n = r > 0 ? r : Tt(e) + 1, s = new Array(n), a = kt(e, s, 0, s.length);
      return t && (s.length = a), s;
    }
    var nr = () => {
      if (!Re.length) {
        var e = null;
        if (typeof window < "u" && typeof window.prompt == "function" ? (e = window.prompt("Input: "), e !== null && (e += `
`)) : typeof readline == "function" && (e = readline(), e !== null && (e += `
`)), !e)
          return null;
        Re = Ct(e, !0);
      }
      return Re.shift();
    }, Ce = { ttys: [], init: function() {
    }, shutdown: function() {
    }, register: function(e, t) {
      Ce.ttys[e] = { input: [], output: [], ops: t }, o.registerDevice(e, Ce.stream_ops);
    }, stream_ops: { open: function(e) {
      var t = Ce.ttys[e.node.rdev];
      if (!t)
        throw new o.ErrnoError(43);
      e.tty = t, e.seekable = !1;
    }, close: function(e) {
      e.tty.ops.fsync(e.tty);
    }, fsync: function(e) {
      e.tty.ops.fsync(e.tty);
    }, read: function(e, t, r, n, s) {
      if (!e.tty || !e.tty.ops.get_char)
        throw new o.ErrnoError(60);
      for (var a = 0, l = 0; l < n; l++) {
        var u;
        try {
          u = e.tty.ops.get_char(e.tty);
        } catch {
          throw new o.ErrnoError(29);
        }
        if (u === void 0 && a === 0)
          throw new o.ErrnoError(6);
        if (u == null)
          break;
        a++, t[r + l] = u;
      }
      return a && (e.node.timestamp = Date.now()), a;
    }, write: function(e, t, r, n, s) {
      if (!e.tty || !e.tty.ops.put_char)
        throw new o.ErrnoError(60);
      try {
        for (var a = 0; a < n; a++)
          e.tty.ops.put_char(e.tty, t[r + a]);
      } catch {
        throw new o.ErrnoError(29);
      }
      return n && (e.node.timestamp = Date.now()), a;
    } }, default_tty_ops: { get_char: function(e) {
      return nr();
    }, put_char: function(e, t) {
      t === null || t === 10 ? (H(Ie(e.output, 0)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync: function(e) {
      e.output && e.output.length > 0 && (H(Ie(e.output, 0)), e.output = []);
    }, ioctl_tcgets: function(e) {
      return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    }, ioctl_tcsets: function(e, t, r) {
      return 0;
    }, ioctl_tiocgwinsz: function(e) {
      return [24, 80];
    } }, default_tty1_ops: { put_char: function(e, t) {
      t === null || t === 10 ? (re(Ie(e.output, 0)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync: function(e) {
      e.output && e.output.length > 0 && (re(Ie(e.output, 0)), e.output = []);
    } } }, Vt = (e) => {
      Ae();
    }, I = { ops_table: null, mount(e) {
      return I.createNode(null, "/", 16895, 0);
    }, createNode(e, t, r, n) {
      if (o.isBlkdev(r) || o.isFIFO(r))
        throw new o.ErrnoError(63);
      I.ops_table || (I.ops_table = { dir: { node: { getattr: I.node_ops.getattr, setattr: I.node_ops.setattr, lookup: I.node_ops.lookup, mknod: I.node_ops.mknod, rename: I.node_ops.rename, unlink: I.node_ops.unlink, rmdir: I.node_ops.rmdir, readdir: I.node_ops.readdir, symlink: I.node_ops.symlink }, stream: { llseek: I.stream_ops.llseek } }, file: { node: { getattr: I.node_ops.getattr, setattr: I.node_ops.setattr }, stream: { llseek: I.stream_ops.llseek, read: I.stream_ops.read, write: I.stream_ops.write, allocate: I.stream_ops.allocate, mmap: I.stream_ops.mmap, msync: I.stream_ops.msync } }, link: { node: { getattr: I.node_ops.getattr, setattr: I.node_ops.setattr, readlink: I.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: I.node_ops.getattr, setattr: I.node_ops.setattr }, stream: o.chrdev_stream_ops } });
      var s = o.createNode(e, t, r, n);
      return o.isDir(s.mode) ? (s.node_ops = I.ops_table.dir.node, s.stream_ops = I.ops_table.dir.stream, s.contents = {}) : o.isFile(s.mode) ? (s.node_ops = I.ops_table.file.node, s.stream_ops = I.ops_table.file.stream, s.usedBytes = 0, s.contents = null) : o.isLink(s.mode) ? (s.node_ops = I.ops_table.link.node, s.stream_ops = I.ops_table.link.stream) : o.isChrdev(s.mode) && (s.node_ops = I.ops_table.chrdev.node, s.stream_ops = I.ops_table.chrdev.stream), s.timestamp = Date.now(), e && (e.contents[t] = s, e.timestamp = s.timestamp), s;
    }, getFileDataAsTypedArray(e) {
      return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
    }, expandFileStorage(e, t) {
      var r = e.contents ? e.contents.length : 0;
      if (!(r >= t)) {
        var n = 1024 * 1024;
        t = Math.max(t, r * (r < n ? 2 : 1.125) >>> 0), r != 0 && (t = Math.max(t, 256));
        var s = e.contents;
        e.contents = new Uint8Array(t), e.usedBytes > 0 && e.contents.set(s.subarray(0, e.usedBytes), 0);
      }
    }, resizeFileStorage(e, t) {
      if (e.usedBytes != t)
        if (t == 0)
          e.contents = null, e.usedBytes = 0;
        else {
          var r = e.contents;
          e.contents = new Uint8Array(t), r && e.contents.set(r.subarray(0, Math.min(t, e.usedBytes))), e.usedBytes = t;
        }
    }, node_ops: { getattr(e) {
      var t = {};
      return t.dev = o.isChrdev(e.mode) ? e.id : 1, t.ino = e.id, t.mode = e.mode, t.nlink = 1, t.uid = 0, t.gid = 0, t.rdev = e.rdev, o.isDir(e.mode) ? t.size = 4096 : o.isFile(e.mode) ? t.size = e.usedBytes : o.isLink(e.mode) ? t.size = e.link.length : t.size = 0, t.atime = new Date(e.timestamp), t.mtime = new Date(e.timestamp), t.ctime = new Date(e.timestamp), t.blksize = 4096, t.blocks = Math.ceil(t.size / t.blksize), t;
    }, setattr(e, t) {
      t.mode !== void 0 && (e.mode = t.mode), t.timestamp !== void 0 && (e.timestamp = t.timestamp), t.size !== void 0 && I.resizeFileStorage(e, t.size);
    }, lookup(e, t) {
      throw o.genericErrors[44];
    }, mknod(e, t, r, n) {
      return I.createNode(e, t, r, n);
    }, rename(e, t, r) {
      if (o.isDir(e.mode)) {
        var n;
        try {
          n = o.lookupNode(t, r);
        } catch {
        }
        if (n)
          for (var s in n.contents)
            throw new o.ErrnoError(55);
      }
      delete e.parent.contents[e.name], e.parent.timestamp = Date.now(), e.name = r, t.contents[r] = e, t.timestamp = e.parent.timestamp, e.parent = t;
    }, unlink(e, t) {
      delete e.contents[t], e.timestamp = Date.now();
    }, rmdir(e, t) {
      var r = o.lookupNode(e, t);
      for (var n in r.contents)
        throw new o.ErrnoError(55);
      delete e.contents[t], e.timestamp = Date.now();
    }, readdir(e) {
      var t = [".", ".."];
      for (var r in e.contents)
        e.contents.hasOwnProperty(r) && t.push(r);
      return t;
    }, symlink(e, t, r) {
      var n = I.createNode(e, t, 41471, 0);
      return n.link = r, n;
    }, readlink(e) {
      if (!o.isLink(e.mode))
        throw new o.ErrnoError(28);
      return e.link;
    } }, stream_ops: { read(e, t, r, n, s) {
      var a = e.node.contents;
      if (s >= e.node.usedBytes)
        return 0;
      var l = Math.min(e.node.usedBytes - s, n);
      if (l > 8 && a.subarray)
        t.set(a.subarray(s, s + l), r);
      else
        for (var u = 0; u < l; u++)
          t[r + u] = a[s + u];
      return l;
    }, write(e, t, r, n, s, a) {
      if (!n)
        return 0;
      var l = e.node;
      if (l.timestamp = Date.now(), t.subarray && (!l.contents || l.contents.subarray)) {
        if (a)
          return l.contents = t.subarray(r, r + n), l.usedBytes = n, n;
        if (l.usedBytes === 0 && s === 0)
          return l.contents = t.slice(r, r + n), l.usedBytes = n, n;
        if (s + n <= l.usedBytes)
          return l.contents.set(t.subarray(r, r + n), s), n;
      }
      if (I.expandFileStorage(l, s + n), l.contents.subarray && t.subarray)
        l.contents.set(t.subarray(r, r + n), s);
      else
        for (var u = 0; u < n; u++)
          l.contents[s + u] = t[r + u];
      return l.usedBytes = Math.max(l.usedBytes, s + n), n;
    }, llseek(e, t, r) {
      var n = t;
      if (r === 1 ? n += e.position : r === 2 && o.isFile(e.node.mode) && (n += e.node.usedBytes), n < 0)
        throw new o.ErrnoError(28);
      return n;
    }, allocate(e, t, r) {
      I.expandFileStorage(e.node, t + r), e.node.usedBytes = Math.max(e.node.usedBytes, t + r);
    }, mmap(e, t, r, n, s) {
      if (!o.isFile(e.node.mode))
        throw new o.ErrnoError(43);
      var a, l, u = e.node.contents;
      if (!(s & 2) && u.buffer === ne.buffer)
        l = !1, a = u.byteOffset;
      else {
        if ((r > 0 || r + t < u.length) && (u.subarray ? u = u.subarray(r, r + t) : u = Array.prototype.slice.call(u, r, r + t)), l = !0, a = Vt(), !a)
          throw new o.ErrnoError(48);
        ne.set(u, a);
      }
      return { ptr: a, allocated: l };
    }, msync(e, t, r, n, s) {
      return I.stream_ops.write(e, t, 0, n, r, !1), 0;
    } } }, Er = (e, t, r, n) => {
      var s = n ? "" : `al ${e}`;
      z(e, (a) => {
        He(a, `Loading data file "${e}" failed (no arrayBuffer).`), t(new Uint8Array(a)), s && rt();
      }, (a) => {
        if (r)
          r();
        else
          throw `Loading data file "${e}" failed.`;
      }), s && Ve();
    }, Pr = i.preloadPlugins || [];
    function Tr(e, t, r, n) {
      typeof Browser < "u" && Browser.init();
      var s = !1;
      return Pr.forEach(function(a) {
        s || a.canHandle(t) && (a.handle(e, t, r, n), s = !0);
      }), s;
    }
    function Nr(e, t, r, n, s, a, l, u, g, m) {
      var T = t ? ye.resolve(G.join2(e, t)) : e;
      function S(k) {
        function P(U) {
          m && m(), u || o.createDataFile(e, t, U, n, s, g), a && a(), rt();
        }
        Tr(k, T, P, () => {
          l && l(), rt();
        }) || P(k);
      }
      Ve(), typeof r == "string" ? Er(r, (k) => S(k), l) : S(r);
    }
    function qr(e) {
      var t = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }, r = t[e];
      if (typeof r > "u")
        throw new Error(`Unknown file open mode: ${e}`);
      return r;
    }
    function Qe(e, t) {
      var r = 0;
      return e && (r |= 365), t && (r |= 146), r;
    }
    var o = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: !1, ignorePermissions: !0, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, lookupPath: (e, t = {}) => {
      if (e = ye.resolve(e), !e)
        return { path: "", node: null };
      var r = { follow_mount: !0, recurse_count: 0 };
      if (t = Object.assign(r, t), t.recurse_count > 8)
        throw new o.ErrnoError(32);
      for (var n = e.split("/").filter((S) => !!S), s = o.root, a = "/", l = 0; l < n.length; l++) {
        var u = l === n.length - 1;
        if (u && t.parent)
          break;
        if (s = o.lookupNode(s, n[l]), a = G.join2(a, n[l]), o.isMountpoint(s) && (!u || u && t.follow_mount) && (s = s.mounted.root), !u || t.follow)
          for (var g = 0; o.isLink(s.mode); ) {
            var m = o.readlink(a);
            a = ye.resolve(G.dirname(a), m);
            var T = o.lookupPath(a, { recurse_count: t.recurse_count + 1 });
            if (s = T.node, g++ > 40)
              throw new o.ErrnoError(32);
          }
      }
      return { path: a, node: s };
    }, getPath: (e) => {
      for (var t; ; ) {
        if (o.isRoot(e)) {
          var r = e.mount.mountpoint;
          return t ? r[r.length - 1] !== "/" ? `${r}/${t}` : r + t : r;
        }
        t = t ? `${e.name}/${t}` : e.name, e = e.parent;
      }
    }, hashName: (e, t) => {
      for (var r = 0, n = 0; n < t.length; n++)
        r = (r << 5) - r + t.charCodeAt(n) | 0;
      return (e + r >>> 0) % o.nameTable.length;
    }, hashAddNode: (e) => {
      var t = o.hashName(e.parent.id, e.name);
      e.name_next = o.nameTable[t], o.nameTable[t] = e;
    }, hashRemoveNode: (e) => {
      var t = o.hashName(e.parent.id, e.name);
      if (o.nameTable[t] === e)
        o.nameTable[t] = e.name_next;
      else
        for (var r = o.nameTable[t]; r; ) {
          if (r.name_next === e) {
            r.name_next = e.name_next;
            break;
          }
          r = r.name_next;
        }
    }, lookupNode: (e, t) => {
      var r = o.mayLookup(e);
      if (r)
        throw new o.ErrnoError(r, e);
      for (var n = o.hashName(e.id, t), s = o.nameTable[n]; s; s = s.name_next) {
        var a = s.name;
        if (s.parent.id === e.id && a === t)
          return s;
      }
      return o.lookup(e, t);
    }, createNode: (e, t, r, n) => {
      var s = new o.FSNode(e, t, r, n);
      return o.hashAddNode(s), s;
    }, destroyNode: (e) => {
      o.hashRemoveNode(e);
    }, isRoot: (e) => e === e.parent, isMountpoint: (e) => !!e.mounted, isFile: (e) => (e & 61440) === 32768, isDir: (e) => (e & 61440) === 16384, isLink: (e) => (e & 61440) === 40960, isChrdev: (e) => (e & 61440) === 8192, isBlkdev: (e) => (e & 61440) === 24576, isFIFO: (e) => (e & 61440) === 4096, isSocket: (e) => (e & 49152) === 49152, flagsToPermissionString: (e) => {
      var t = ["r", "w", "rw"][e & 3];
      return e & 512 && (t += "w"), t;
    }, nodePermissions: (e, t) => o.ignorePermissions ? 0 : t.includes("r") && !(e.mode & 292) || t.includes("w") && !(e.mode & 146) || t.includes("x") && !(e.mode & 73) ? 2 : 0, mayLookup: (e) => {
      var t = o.nodePermissions(e, "x");
      return t || (e.node_ops.lookup ? 0 : 2);
    }, mayCreate: (e, t) => {
      try {
        var r = o.lookupNode(e, t);
        return 20;
      } catch {
      }
      return o.nodePermissions(e, "wx");
    }, mayDelete: (e, t, r) => {
      var n;
      try {
        n = o.lookupNode(e, t);
      } catch (a) {
        return a.errno;
      }
      var s = o.nodePermissions(e, "wx");
      if (s)
        return s;
      if (r) {
        if (!o.isDir(n.mode))
          return 54;
        if (o.isRoot(n) || o.getPath(n) === o.cwd())
          return 10;
      } else if (o.isDir(n.mode))
        return 31;
      return 0;
    }, mayOpen: (e, t) => e ? o.isLink(e.mode) ? 32 : o.isDir(e.mode) && (o.flagsToPermissionString(t) !== "r" || t & 512) ? 31 : o.nodePermissions(e, o.flagsToPermissionString(t)) : 44, MAX_OPEN_FDS: 4096, nextfd: () => {
      for (var e = 0; e <= o.MAX_OPEN_FDS; e++)
        if (!o.streams[e])
          return e;
      throw new o.ErrnoError(33);
    }, getStreamChecked: (e) => {
      var t = o.getStream(e);
      if (!t)
        throw new o.ErrnoError(8);
      return t;
    }, getStream: (e) => o.streams[e], createStream: (e, t = -1) => (o.FSStream || (o.FSStream = function() {
      this.shared = {};
    }, o.FSStream.prototype = {}, Object.defineProperties(o.FSStream.prototype, { object: { get() {
      return this.node;
    }, set(r) {
      this.node = r;
    } }, isRead: { get() {
      return (this.flags & 2097155) !== 1;
    } }, isWrite: { get() {
      return (this.flags & 2097155) !== 0;
    } }, isAppend: { get() {
      return this.flags & 1024;
    } }, flags: { get() {
      return this.shared.flags;
    }, set(r) {
      this.shared.flags = r;
    } }, position: { get() {
      return this.shared.position;
    }, set(r) {
      this.shared.position = r;
    } } })), e = Object.assign(new o.FSStream(), e), t == -1 && (t = o.nextfd()), e.fd = t, o.streams[t] = e, e), closeStream: (e) => {
      o.streams[e] = null;
    }, chrdev_stream_ops: { open: (e) => {
      var t = o.getDevice(e.node.rdev);
      e.stream_ops = t.stream_ops, e.stream_ops.open && e.stream_ops.open(e);
    }, llseek: () => {
      throw new o.ErrnoError(70);
    } }, major: (e) => e >> 8, minor: (e) => e & 255, makedev: (e, t) => e << 8 | t, registerDevice: (e, t) => {
      o.devices[e] = { stream_ops: t };
    }, getDevice: (e) => o.devices[e], getMounts: (e) => {
      for (var t = [], r = [e]; r.length; ) {
        var n = r.pop();
        t.push(n), r.push.apply(r, n.mounts);
      }
      return t;
    }, syncfs: (e, t) => {
      typeof e == "function" && (t = e, e = !1), o.syncFSRequests++, o.syncFSRequests > 1 && re(`warning: ${o.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
      var r = o.getMounts(o.root.mount), n = 0;
      function s(l) {
        return o.syncFSRequests--, t(l);
      }
      function a(l) {
        if (l)
          return a.errored ? void 0 : (a.errored = !0, s(l));
        ++n >= r.length && s(null);
      }
      r.forEach((l) => {
        if (!l.type.syncfs)
          return a(null);
        l.type.syncfs(l, e, a);
      });
    }, mount: (e, t, r) => {
      var n = r === "/", s = !r, a;
      if (n && o.root)
        throw new o.ErrnoError(10);
      if (!n && !s) {
        var l = o.lookupPath(r, { follow_mount: !1 });
        if (r = l.path, a = l.node, o.isMountpoint(a))
          throw new o.ErrnoError(10);
        if (!o.isDir(a.mode))
          throw new o.ErrnoError(54);
      }
      var u = { type: e, opts: t, mountpoint: r, mounts: [] }, g = e.mount(u);
      return g.mount = u, u.root = g, n ? o.root = g : a && (a.mounted = u, a.mount && a.mount.mounts.push(u)), g;
    }, unmount: (e) => {
      var t = o.lookupPath(e, { follow_mount: !1 });
      if (!o.isMountpoint(t.node))
        throw new o.ErrnoError(28);
      var r = t.node, n = r.mounted, s = o.getMounts(n);
      Object.keys(o.nameTable).forEach((l) => {
        for (var u = o.nameTable[l]; u; ) {
          var g = u.name_next;
          s.includes(u.mount) && o.destroyNode(u), u = g;
        }
      }), r.mounted = null;
      var a = r.mount.mounts.indexOf(n);
      r.mount.mounts.splice(a, 1);
    }, lookup: (e, t) => e.node_ops.lookup(e, t), mknod: (e, t, r) => {
      var n = o.lookupPath(e, { parent: !0 }), s = n.node, a = G.basename(e);
      if (!a || a === "." || a === "..")
        throw new o.ErrnoError(28);
      var l = o.mayCreate(s, a);
      if (l)
        throw new o.ErrnoError(l);
      if (!s.node_ops.mknod)
        throw new o.ErrnoError(63);
      return s.node_ops.mknod(s, a, t, r);
    }, create: (e, t) => (t = t !== void 0 ? t : 438, t &= 4095, t |= 32768, o.mknod(e, t, 0)), mkdir: (e, t) => (t = t !== void 0 ? t : 511, t &= 1023, t |= 16384, o.mknod(e, t, 0)), mkdirTree: (e, t) => {
      for (var r = e.split("/"), n = "", s = 0; s < r.length; ++s)
        if (r[s]) {
          n += "/" + r[s];
          try {
            o.mkdir(n, t);
          } catch (a) {
            if (a.errno != 20)
              throw a;
          }
        }
    }, mkdev: (e, t, r) => (typeof r > "u" && (r = t, t = 438), t |= 8192, o.mknod(e, t, r)), symlink: (e, t) => {
      if (!ye.resolve(e))
        throw new o.ErrnoError(44);
      var r = o.lookupPath(t, { parent: !0 }), n = r.node;
      if (!n)
        throw new o.ErrnoError(44);
      var s = G.basename(t), a = o.mayCreate(n, s);
      if (a)
        throw new o.ErrnoError(a);
      if (!n.node_ops.symlink)
        throw new o.ErrnoError(63);
      return n.node_ops.symlink(n, s, e);
    }, rename: (e, t) => {
      var r = G.dirname(e), n = G.dirname(t), s = G.basename(e), a = G.basename(t), l, u, g;
      if (l = o.lookupPath(e, { parent: !0 }), u = l.node, l = o.lookupPath(t, { parent: !0 }), g = l.node, !u || !g)
        throw new o.ErrnoError(44);
      if (u.mount !== g.mount)
        throw new o.ErrnoError(75);
      var m = o.lookupNode(u, s), T = ye.relative(e, n);
      if (T.charAt(0) !== ".")
        throw new o.ErrnoError(28);
      if (T = ye.relative(t, r), T.charAt(0) !== ".")
        throw new o.ErrnoError(55);
      var S;
      try {
        S = o.lookupNode(g, a);
      } catch {
      }
      if (m !== S) {
        var k = o.isDir(m.mode), P = o.mayDelete(u, s, k);
        if (P)
          throw new o.ErrnoError(P);
        if (P = S ? o.mayDelete(g, a, k) : o.mayCreate(g, a), P)
          throw new o.ErrnoError(P);
        if (!u.node_ops.rename)
          throw new o.ErrnoError(63);
        if (o.isMountpoint(m) || S && o.isMountpoint(S))
          throw new o.ErrnoError(10);
        if (g !== u && (P = o.nodePermissions(u, "w"), P))
          throw new o.ErrnoError(P);
        o.hashRemoveNode(m);
        try {
          u.node_ops.rename(m, g, a);
        } catch (U) {
          throw U;
        } finally {
          o.hashAddNode(m);
        }
      }
    }, rmdir: (e) => {
      var t = o.lookupPath(e, { parent: !0 }), r = t.node, n = G.basename(e), s = o.lookupNode(r, n), a = o.mayDelete(r, n, !0);
      if (a)
        throw new o.ErrnoError(a);
      if (!r.node_ops.rmdir)
        throw new o.ErrnoError(63);
      if (o.isMountpoint(s))
        throw new o.ErrnoError(10);
      r.node_ops.rmdir(r, n), o.destroyNode(s);
    }, readdir: (e) => {
      var t = o.lookupPath(e, { follow: !0 }), r = t.node;
      if (!r.node_ops.readdir)
        throw new o.ErrnoError(54);
      return r.node_ops.readdir(r);
    }, unlink: (e) => {
      var t = o.lookupPath(e, { parent: !0 }), r = t.node;
      if (!r)
        throw new o.ErrnoError(44);
      var n = G.basename(e), s = o.lookupNode(r, n), a = o.mayDelete(r, n, !1);
      if (a)
        throw new o.ErrnoError(a);
      if (!r.node_ops.unlink)
        throw new o.ErrnoError(63);
      if (o.isMountpoint(s))
        throw new o.ErrnoError(10);
      r.node_ops.unlink(r, n), o.destroyNode(s);
    }, readlink: (e) => {
      var t = o.lookupPath(e), r = t.node;
      if (!r)
        throw new o.ErrnoError(44);
      if (!r.node_ops.readlink)
        throw new o.ErrnoError(28);
      return ye.resolve(o.getPath(r.parent), r.node_ops.readlink(r));
    }, stat: (e, t) => {
      var r = o.lookupPath(e, { follow: !t }), n = r.node;
      if (!n)
        throw new o.ErrnoError(44);
      if (!n.node_ops.getattr)
        throw new o.ErrnoError(63);
      return n.node_ops.getattr(n);
    }, lstat: (e) => o.stat(e, !0), chmod: (e, t, r) => {
      var n;
      if (typeof e == "string") {
        var s = o.lookupPath(e, { follow: !r });
        n = s.node;
      } else
        n = e;
      if (!n.node_ops.setattr)
        throw new o.ErrnoError(63);
      n.node_ops.setattr(n, { mode: t & 4095 | n.mode & -4096, timestamp: Date.now() });
    }, lchmod: (e, t) => {
      o.chmod(e, t, !0);
    }, fchmod: (e, t) => {
      var r = o.getStreamChecked(e);
      o.chmod(r.node, t);
    }, chown: (e, t, r, n) => {
      var s;
      if (typeof e == "string") {
        var a = o.lookupPath(e, { follow: !n });
        s = a.node;
      } else
        s = e;
      if (!s.node_ops.setattr)
        throw new o.ErrnoError(63);
      s.node_ops.setattr(s, { timestamp: Date.now() });
    }, lchown: (e, t, r) => {
      o.chown(e, t, r, !0);
    }, fchown: (e, t, r) => {
      var n = o.getStreamChecked(e);
      o.chown(n.node, t, r);
    }, truncate: (e, t) => {
      if (t < 0)
        throw new o.ErrnoError(28);
      var r;
      if (typeof e == "string") {
        var n = o.lookupPath(e, { follow: !0 });
        r = n.node;
      } else
        r = e;
      if (!r.node_ops.setattr)
        throw new o.ErrnoError(63);
      if (o.isDir(r.mode))
        throw new o.ErrnoError(31);
      if (!o.isFile(r.mode))
        throw new o.ErrnoError(28);
      var s = o.nodePermissions(r, "w");
      if (s)
        throw new o.ErrnoError(s);
      r.node_ops.setattr(r, { size: t, timestamp: Date.now() });
    }, ftruncate: (e, t) => {
      var r = o.getStreamChecked(e);
      if (!(r.flags & 2097155))
        throw new o.ErrnoError(28);
      o.truncate(r.node, t);
    }, utime: (e, t, r) => {
      var n = o.lookupPath(e, { follow: !0 }), s = n.node;
      s.node_ops.setattr(s, { timestamp: Math.max(t, r) });
    }, open: (e, t, r) => {
      if (e === "")
        throw new o.ErrnoError(44);
      t = typeof t == "string" ? qr(t) : t, r = typeof r > "u" ? 438 : r, t & 64 ? r = r & 4095 | 32768 : r = 0;
      var n;
      if (typeof e == "object")
        n = e;
      else {
        e = G.normalize(e);
        try {
          var s = o.lookupPath(e, { follow: !(t & 131072) });
          n = s.node;
        } catch {
        }
      }
      var a = !1;
      if (t & 64)
        if (n) {
          if (t & 128)
            throw new o.ErrnoError(20);
        } else
          n = o.mknod(e, r, 0), a = !0;
      if (!n)
        throw new o.ErrnoError(44);
      if (o.isChrdev(n.mode) && (t &= -513), t & 65536 && !o.isDir(n.mode))
        throw new o.ErrnoError(54);
      if (!a) {
        var l = o.mayOpen(n, t);
        if (l)
          throw new o.ErrnoError(l);
      }
      t & 512 && !a && o.truncate(n, 0), t &= -131713;
      var u = o.createStream({ node: n, path: o.getPath(n), flags: t, seekable: !0, position: 0, stream_ops: n.stream_ops, ungotten: [], error: !1 });
      return u.stream_ops.open && u.stream_ops.open(u), i.logReadFiles && !(t & 1) && (o.readFiles || (o.readFiles = {}), e in o.readFiles || (o.readFiles[e] = 1)), u;
    }, close: (e) => {
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      e.getdents && (e.getdents = null);
      try {
        e.stream_ops.close && e.stream_ops.close(e);
      } catch (t) {
        throw t;
      } finally {
        o.closeStream(e.fd);
      }
      e.fd = null;
    }, isClosed: (e) => e.fd === null, llseek: (e, t, r) => {
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if (!e.seekable || !e.stream_ops.llseek)
        throw new o.ErrnoError(70);
      if (r != 0 && r != 1 && r != 2)
        throw new o.ErrnoError(28);
      return e.position = e.stream_ops.llseek(e, t, r), e.ungotten = [], e.position;
    }, read: (e, t, r, n, s) => {
      if (n < 0 || s < 0)
        throw new o.ErrnoError(28);
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if ((e.flags & 2097155) === 1)
        throw new o.ErrnoError(8);
      if (o.isDir(e.node.mode))
        throw new o.ErrnoError(31);
      if (!e.stream_ops.read)
        throw new o.ErrnoError(28);
      var a = typeof s < "u";
      if (!a)
        s = e.position;
      else if (!e.seekable)
        throw new o.ErrnoError(70);
      var l = e.stream_ops.read(e, t, r, n, s);
      return a || (e.position += l), l;
    }, write: (e, t, r, n, s, a) => {
      if (n < 0 || s < 0)
        throw new o.ErrnoError(28);
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if (!(e.flags & 2097155))
        throw new o.ErrnoError(8);
      if (o.isDir(e.node.mode))
        throw new o.ErrnoError(31);
      if (!e.stream_ops.write)
        throw new o.ErrnoError(28);
      e.seekable && e.flags & 1024 && o.llseek(e, 0, 2);
      var l = typeof s < "u";
      if (!l)
        s = e.position;
      else if (!e.seekable)
        throw new o.ErrnoError(70);
      var u = e.stream_ops.write(e, t, r, n, s, a);
      return l || (e.position += u), u;
    }, allocate: (e, t, r) => {
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if (t < 0 || r <= 0)
        throw new o.ErrnoError(28);
      if (!(e.flags & 2097155))
        throw new o.ErrnoError(8);
      if (!o.isFile(e.node.mode) && !o.isDir(e.node.mode))
        throw new o.ErrnoError(43);
      if (!e.stream_ops.allocate)
        throw new o.ErrnoError(138);
      e.stream_ops.allocate(e, t, r);
    }, mmap: (e, t, r, n, s) => {
      if (n & 2 && !(s & 2) && (e.flags & 2097155) !== 2)
        throw new o.ErrnoError(2);
      if ((e.flags & 2097155) === 1)
        throw new o.ErrnoError(2);
      if (!e.stream_ops.mmap)
        throw new o.ErrnoError(43);
      return e.stream_ops.mmap(e, t, r, n, s);
    }, msync: (e, t, r, n, s) => e.stream_ops.msync ? e.stream_ops.msync(e, t, r, n, s) : 0, munmap: (e) => 0, ioctl: (e, t, r) => {
      if (!e.stream_ops.ioctl)
        throw new o.ErrnoError(59);
      return e.stream_ops.ioctl(e, t, r);
    }, readFile: (e, t = {}) => {
      if (t.flags = t.flags || 0, t.encoding = t.encoding || "binary", t.encoding !== "utf8" && t.encoding !== "binary")
        throw new Error(`Invalid encoding type "${t.encoding}"`);
      var r, n = o.open(e, t.flags), s = o.stat(e), a = s.size, l = new Uint8Array(a);
      return o.read(n, l, 0, a, 0), t.encoding === "utf8" ? r = Ie(l, 0) : t.encoding === "binary" && (r = l), o.close(n), r;
    }, writeFile: (e, t, r = {}) => {
      r.flags = r.flags || 577;
      var n = o.open(e, r.flags, r.mode);
      if (typeof t == "string") {
        var s = new Uint8Array(Tt(t) + 1), a = kt(t, s, 0, s.length);
        o.write(n, s, 0, a, void 0, r.canOwn);
      } else if (ArrayBuffer.isView(t))
        o.write(n, t, 0, t.byteLength, void 0, r.canOwn);
      else
        throw new Error("Unsupported data type");
      o.close(n);
    }, cwd: () => o.currentPath, chdir: (e) => {
      var t = o.lookupPath(e, { follow: !0 });
      if (t.node === null)
        throw new o.ErrnoError(44);
      if (!o.isDir(t.node.mode))
        throw new o.ErrnoError(54);
      var r = o.nodePermissions(t.node, "x");
      if (r)
        throw new o.ErrnoError(r);
      o.currentPath = t.path;
    }, createDefaultDirectories: () => {
      o.mkdir("/tmp"), o.mkdir("/home"), o.mkdir("/home/web_user");
    }, createDefaultDevices: () => {
      o.mkdir("/dev"), o.registerDevice(o.makedev(1, 3), { read: () => 0, write: (n, s, a, l, u) => l }), o.mkdev("/dev/null", o.makedev(1, 3)), Ce.register(o.makedev(5, 0), Ce.default_tty_ops), Ce.register(o.makedev(6, 0), Ce.default_tty1_ops), o.mkdev("/dev/tty", o.makedev(5, 0)), o.mkdev("/dev/tty1", o.makedev(6, 0));
      var e = new Uint8Array(1024), t = 0, r = () => (t === 0 && (t = Ht(e).byteLength), e[--t]);
      o.createDevice("/dev", "random", r), o.createDevice("/dev", "urandom", r), o.mkdir("/dev/shm"), o.mkdir("/dev/shm/tmp");
    }, createSpecialDirectories: () => {
      o.mkdir("/proc");
      var e = o.mkdir("/proc/self");
      o.mkdir("/proc/self/fd"), o.mount({ mount: () => {
        var t = o.createNode(e, "fd", 16895, 73);
        return t.node_ops = { lookup: (r, n) => {
          var s = +n, a = o.getStreamChecked(s), l = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => a.path } };
          return l.parent = l, l;
        } }, t;
      } }, {}, "/proc/self/fd");
    }, createStandardStreams: () => {
      i.stdin ? o.createDevice("/dev", "stdin", i.stdin) : o.symlink("/dev/tty", "/dev/stdin"), i.stdout ? o.createDevice("/dev", "stdout", null, i.stdout) : o.symlink("/dev/tty", "/dev/stdout"), i.stderr ? o.createDevice("/dev", "stderr", null, i.stderr) : o.symlink("/dev/tty1", "/dev/stderr"), o.open("/dev/stdin", 0), o.open("/dev/stdout", 1), o.open("/dev/stderr", 1);
    }, ensureErrnoError: () => {
      o.ErrnoError || (o.ErrnoError = function(t, r) {
        this.name = "ErrnoError", this.node = r, this.setErrno = function(n) {
          this.errno = n;
        }, this.setErrno(t), this.message = "FS error";
      }, o.ErrnoError.prototype = new Error(), o.ErrnoError.prototype.constructor = o.ErrnoError, [44].forEach((e) => {
        o.genericErrors[e] = new o.ErrnoError(e), o.genericErrors[e].stack = "<generic error, no stack>";
      }));
    }, staticInit: () => {
      o.ensureErrnoError(), o.nameTable = new Array(4096), o.mount(I, {}, "/"), o.createDefaultDirectories(), o.createDefaultDevices(), o.createSpecialDirectories(), o.filesystems = { MEMFS: I };
    }, init: (e, t, r) => {
      o.init.initialized = !0, o.ensureErrnoError(), i.stdin = e || i.stdin, i.stdout = t || i.stdout, i.stderr = r || i.stderr, o.createStandardStreams();
    }, quit: () => {
      o.init.initialized = !1;
      for (var e = 0; e < o.streams.length; e++) {
        var t = o.streams[e];
        t && o.close(t);
      }
    }, findObject: (e, t) => {
      var r = o.analyzePath(e, t);
      return r.exists ? r.object : null;
    }, analyzePath: (e, t) => {
      try {
        var r = o.lookupPath(e, { follow: !t });
        e = r.path;
      } catch {
      }
      var n = { isRoot: !1, exists: !1, error: 0, name: null, path: null, object: null, parentExists: !1, parentPath: null, parentObject: null };
      try {
        var r = o.lookupPath(e, { parent: !0 });
        n.parentExists = !0, n.parentPath = r.path, n.parentObject = r.node, n.name = G.basename(e), r = o.lookupPath(e, { follow: !t }), n.exists = !0, n.path = r.path, n.object = r.node, n.name = r.node.name, n.isRoot = r.path === "/";
      } catch (s) {
        n.error = s.errno;
      }
      return n;
    }, createPath: (e, t, r, n) => {
      e = typeof e == "string" ? e : o.getPath(e);
      for (var s = t.split("/").reverse(); s.length; ) {
        var a = s.pop();
        if (a) {
          var l = G.join2(e, a);
          try {
            o.mkdir(l);
          } catch {
          }
          e = l;
        }
      }
      return l;
    }, createFile: (e, t, r, n, s) => {
      var a = G.join2(typeof e == "string" ? e : o.getPath(e), t), l = Qe(n, s);
      return o.create(a, l);
    }, createDataFile: (e, t, r, n, s, a) => {
      var l = t;
      e && (e = typeof e == "string" ? e : o.getPath(e), l = t ? G.join2(e, t) : e);
      var u = Qe(n, s), g = o.create(l, u);
      if (r) {
        if (typeof r == "string") {
          for (var m = new Array(r.length), T = 0, S = r.length; T < S; ++T)
            m[T] = r.charCodeAt(T);
          r = m;
        }
        o.chmod(g, u | 146);
        var k = o.open(g, 577);
        o.write(k, r, 0, r.length, 0, a), o.close(k), o.chmod(g, u);
      }
      return g;
    }, createDevice: (e, t, r, n) => {
      var s = G.join2(typeof e == "string" ? e : o.getPath(e), t), a = Qe(!!r, !!n);
      o.createDevice.major || (o.createDevice.major = 64);
      var l = o.makedev(o.createDevice.major++, 0);
      return o.registerDevice(l, { open: (u) => {
        u.seekable = !1;
      }, close: (u) => {
        n && n.buffer && n.buffer.length && n(10);
      }, read: (u, g, m, T, S) => {
        for (var k = 0, P = 0; P < T; P++) {
          var U;
          try {
            U = r();
          } catch {
            throw new o.ErrnoError(29);
          }
          if (U === void 0 && k === 0)
            throw new o.ErrnoError(6);
          if (U == null)
            break;
          k++, g[m + P] = U;
        }
        return k && (u.node.timestamp = Date.now()), k;
      }, write: (u, g, m, T, S) => {
        for (var k = 0; k < T; k++)
          try {
            n(g[m + k]);
          } catch {
            throw new o.ErrnoError(29);
          }
        return T && (u.node.timestamp = Date.now()), k;
      } }), o.mkdev(s, a, l);
    }, forceLoadFile: (e) => {
      if (e.isDevice || e.isFolder || e.link || e.contents)
        return !0;
      if (typeof XMLHttpRequest < "u")
        throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
      if ($)
        try {
          e.contents = Ct($(e.url), !0), e.usedBytes = e.contents.length;
        } catch {
          throw new o.ErrnoError(29);
        }
      else
        throw new Error("Cannot load without read() or XMLHttpRequest.");
    }, createLazyFile: (e, t, r, n, s) => {
      function a() {
        this.lengthKnown = !1, this.chunks = [];
      }
      if (a.prototype.get = function(P) {
        if (!(P > this.length - 1 || P < 0)) {
          var U = P % this.chunkSize, Z = P / this.chunkSize | 0;
          return this.getter(Z)[U];
        }
      }, a.prototype.setDataGetter = function(P) {
        this.getter = P;
      }, a.prototype.cacheLength = function() {
        var P = new XMLHttpRequest();
        if (P.open("HEAD", r, !1), P.send(null), !(P.status >= 200 && P.status < 300 || P.status === 304))
          throw new Error("Couldn't load " + r + ". Status: " + P.status);
        var U = Number(P.getResponseHeader("Content-length")), Z, J = (Z = P.getResponseHeader("Accept-Ranges")) && Z === "bytes", oe = (Z = P.getResponseHeader("Content-Encoding")) && Z === "gzip", he = 1024 * 1024;
        J || (he = U);
        var ee = (ve, Se) => {
          if (ve > Se)
            throw new Error("invalid range (" + ve + ", " + Se + ") or no bytes requested!");
          if (Se > U - 1)
            throw new Error("only " + U + " bytes available! programmer error!");
          var se = new XMLHttpRequest();
          if (se.open("GET", r, !1), U !== he && se.setRequestHeader("Range", "bytes=" + ve + "-" + Se), se.responseType = "arraybuffer", se.overrideMimeType && se.overrideMimeType("text/plain; charset=x-user-defined"), se.send(null), !(se.status >= 200 && se.status < 300 || se.status === 304))
            throw new Error("Couldn't load " + r + ". Status: " + se.status);
          return se.response !== void 0 ? new Uint8Array(se.response || []) : Ct(se.responseText || "", !0);
        }, We = this;
        We.setDataGetter((ve) => {
          var Se = ve * he, se = (ve + 1) * he - 1;
          if (se = Math.min(se, U - 1), typeof We.chunks[ve] > "u" && (We.chunks[ve] = ee(Se, se)), typeof We.chunks[ve] > "u")
            throw new Error("doXHR failed!");
          return We.chunks[ve];
        }), (oe || !U) && (he = U = 1, U = this.getter(0).length, he = U, H("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = U, this._chunkSize = he, this.lengthKnown = !0;
      }, typeof XMLHttpRequest < "u") {
        if (!w)
          throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
        var l = new a();
        Object.defineProperties(l, { length: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._length;
        } }, chunkSize: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._chunkSize;
        } } });
        var u = { isDevice: !1, contents: l };
      } else
        var u = { isDevice: !1, url: r };
      var g = o.createFile(e, t, u, n, s);
      u.contents ? g.contents = u.contents : u.url && (g.contents = null, g.url = u.url), Object.defineProperties(g, { usedBytes: { get: function() {
        return this.contents.length;
      } } });
      var m = {}, T = Object.keys(g.stream_ops);
      T.forEach((k) => {
        var P = g.stream_ops[k];
        m[k] = function() {
          return o.forceLoadFile(g), P.apply(null, arguments);
        };
      });
      function S(k, P, U, Z, J) {
        var oe = k.node.contents;
        if (J >= oe.length)
          return 0;
        var he = Math.min(oe.length - J, Z);
        if (oe.slice)
          for (var ee = 0; ee < he; ee++)
            P[U + ee] = oe[J + ee];
        else
          for (var ee = 0; ee < he; ee++)
            P[U + ee] = oe.get(J + ee);
        return he;
      }
      return m.read = (k, P, U, Z, J) => (o.forceLoadFile(g), S(k, P, U, Z, J)), m.mmap = (k, P, U, Z, J) => {
        o.forceLoadFile(g);
        var oe = Vt();
        if (!oe)
          throw new o.ErrnoError(48);
        return S(k, ne, oe, P, U), { ptr: oe, allocated: !0 };
      }, g.stream_ops = m, g;
    } }, lt = (e, t) => e ? Ie(Q, e, t) : "", ue = { DEFAULT_POLLMASK: 5, calculateAt: function(e, t, r) {
      if (G.isAbs(t))
        return t;
      var n;
      if (e === -100)
        n = o.cwd();
      else {
        var s = ue.getStreamFromFD(e);
        n = s.path;
      }
      if (t.length == 0) {
        if (!r)
          throw new o.ErrnoError(44);
        return n;
      }
      return G.join2(n, t);
    }, doStat: function(e, t, r) {
      try {
        var n = e(t);
      } catch (u) {
        if (u && u.node && G.normalize(t) !== G.normalize(o.getPath(u.node)))
          return -54;
        throw u;
      }
      V[r >> 2] = n.dev, V[r + 4 >> 2] = n.mode, X[r + 8 >> 2] = n.nlink, V[r + 12 >> 2] = n.uid, V[r + 16 >> 2] = n.gid, V[r + 20 >> 2] = n.rdev, Y = [n.size >>> 0, (R = n.size, +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 24 >> 2] = Y[0], V[r + 28 >> 2] = Y[1], V[r + 32 >> 2] = 4096, V[r + 36 >> 2] = n.blocks;
      var s = n.atime.getTime(), a = n.mtime.getTime(), l = n.ctime.getTime();
      return Y = [Math.floor(s / 1e3) >>> 0, (R = Math.floor(s / 1e3), +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 40 >> 2] = Y[0], V[r + 44 >> 2] = Y[1], X[r + 48 >> 2] = s % 1e3 * 1e3, Y = [Math.floor(a / 1e3) >>> 0, (R = Math.floor(a / 1e3), +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 56 >> 2] = Y[0], V[r + 60 >> 2] = Y[1], X[r + 64 >> 2] = a % 1e3 * 1e3, Y = [Math.floor(l / 1e3) >>> 0, (R = Math.floor(l / 1e3), +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 72 >> 2] = Y[0], V[r + 76 >> 2] = Y[1], X[r + 80 >> 2] = l % 1e3 * 1e3, Y = [n.ino >>> 0, (R = n.ino, +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 88 >> 2] = Y[0], V[r + 92 >> 2] = Y[1], 0;
    }, doMsync: function(e, t, r, n, s) {
      if (!o.isFile(t.node.mode))
        throw new o.ErrnoError(43);
      if (n & 2)
        return 0;
      var a = Q.slice(e, e + r);
      o.msync(t, a, s, r, n);
    }, varargs: void 0, get() {
      ue.varargs += 4;
      var e = V[ue.varargs - 4 >> 2];
      return e;
    }, getStr(e) {
      var t = lt(e);
      return t;
    }, getStreamFromFD: function(e) {
      var t = o.getStreamChecked(e);
      return t;
    } };
    function Gr(e, t, r) {
      ue.varargs = r;
      try {
        var n = ue.getStreamFromFD(e);
        switch (t) {
          case 0: {
            var s = ue.get();
            if (s < 0)
              return -28;
            var a;
            return a = o.createStream(n, s), a.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return n.flags;
          case 4: {
            var s = ue.get();
            return n.flags |= s, 0;
          }
          case 5: {
            var s = ue.get(), l = 0;
            return Pe[s + l >> 1] = 2, 0;
          }
          case 6:
          case 7:
            return 0;
          case 16:
          case 8:
            return -28;
          case 9:
            return Wt(28), -1;
          default:
            return -28;
        }
      } catch (u) {
        if (typeof o > "u" || u.name !== "ErrnoError")
          throw u;
        return -u.errno;
      }
    }
    function $t(e, t, r, n) {
      ue.varargs = n;
      try {
        t = ue.getStr(t), t = ue.calculateAt(e, t);
        var s = n ? ue.get() : 0;
        return o.open(t, r, s).fd;
      } catch (a) {
        if (typeof o > "u" || a.name !== "ErrnoError")
          throw a;
        return -a.errno;
      }
    }
    function Xr(e, t, r, n, s) {
    }
    function St(e) {
      switch (e) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError(`Unknown type size: ${e}`);
      }
    }
    function Nt() {
      for (var e = new Array(256), t = 0; t < 256; ++t)
        e[t] = String.fromCharCode(t);
      ir = e;
    }
    var ir = void 0;
    function de(e) {
      for (var t = "", r = e; Q[r]; )
        t += ir[Q[r++]];
      return t;
    }
    var Le = {}, xe = {}, ct = {}, je = void 0;
    function N(e) {
      throw new je(e);
    }
    var Ne = void 0;
    function dt(e) {
      throw new Ne(e);
    }
    function Ye(e, t, r) {
      e.forEach(function(u) {
        ct[u] = t;
      });
      function n(u) {
        var g = r(u);
        g.length !== e.length && dt("Mismatched type converter count");
        for (var m = 0; m < e.length; ++m)
          we(e[m], g[m]);
      }
      var s = new Array(t.length), a = [], l = 0;
      t.forEach((u, g) => {
        xe.hasOwnProperty(u) ? s[g] = xe[u] : (a.push(u), Le.hasOwnProperty(u) || (Le[u] = []), Le[u].push(() => {
          s[g] = xe[u], ++l, l === a.length && n(s);
        }));
      }), a.length === 0 && n(s);
    }
    function qt(e, t, r = {}) {
      var n = t.name;
      if (e || N(`type "${n}" must have a positive integer typeid pointer`), xe.hasOwnProperty(e)) {
        if (r.ignoreDuplicateRegistrations)
          return;
        N(`Cannot register type '${n}' twice`);
      }
      if (xe[e] = t, delete ct[e], Le.hasOwnProperty(e)) {
        var s = Le[e];
        delete Le[e], s.forEach((a) => a());
      }
    }
    function we(e, t, r = {}) {
      if (!("argPackAdvance" in t))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      return qt(e, t, r);
    }
    function kr(e, t, r, n, s) {
      var a = St(r);
      t = de(t), we(e, { name: t, fromWireType: function(l) {
        return !!l;
      }, toWireType: function(l, u) {
        return u ? n : s;
      }, argPackAdvance: 8, readValueFromPointer: function(l) {
        var u;
        if (r === 1)
          u = ne;
        else if (r === 2)
          u = Pe;
        else if (r === 4)
          u = V;
        else
          throw new TypeError("Unknown boolean type size: " + t);
        return this.fromWireType(u[l >> a]);
      }, destructorFunction: null });
    }
    function Kr(e) {
      if (!(this instanceof ke) || !(e instanceof ke))
        return !1;
      for (var t = this.$$.ptrType.registeredClass, r = this.$$.ptr, n = e.$$.ptrType.registeredClass, s = e.$$.ptr; t.baseClass; )
        r = t.upcast(r), t = t.baseClass;
      for (; n.baseClass; )
        s = n.upcast(s), n = n.baseClass;
      return t === n && r === s;
    }
    function Qr(e) {
      return { count: e.count, deleteScheduled: e.deleteScheduled, preservePointerOnDelete: e.preservePointerOnDelete, ptr: e.ptr, ptrType: e.ptrType, smartPtr: e.smartPtr, smartPtrType: e.smartPtrType };
    }
    function ft(e) {
      function t(r) {
        return r.$$.ptrType.registeredClass.name;
      }
      N(t(e) + " instance already deleted");
    }
    var Dt = !1;
    function or(e) {
    }
    function Yr(e) {
      e.smartPtr ? e.smartPtrType.rawDestructor(e.smartPtr) : e.ptrType.registeredClass.rawDestructor(e.ptr);
    }
    function yt(e) {
      e.count.value -= 1;
      var t = e.count.value === 0;
      t && Yr(e);
    }
    function sr(e, t, r) {
      if (t === r)
        return e;
      if (r.baseClass === void 0)
        return null;
      var n = sr(e, t, r.baseClass);
      return n === null ? null : r.downcast(n);
    }
    var ar = {};
    function Zr() {
      return Object.keys(Je).length;
    }
    function Jr() {
      var e = [];
      for (var t in Je)
        Je.hasOwnProperty(t) && e.push(Je[t]);
      return e;
    }
    var _e = [];
    function At() {
      for (; _e.length; ) {
        var e = _e.pop();
        e.$$.deleteScheduled = !1, e.delete();
      }
    }
    var Ze = void 0;
    function Gt(e) {
      Ze = e, _e.length && Ze && Ze(At);
    }
    function Cr() {
      i.getInheritedInstanceCount = Zr, i.getLiveInheritedInstances = Jr, i.flushPendingDeletes = At, i.setDelayFunction = Gt;
    }
    var Je = {};
    function en(e, t) {
      for (t === void 0 && N("ptr should not be undefined"); e.baseClass; )
        t = e.upcast(t), e = e.baseClass;
      return t;
    }
    function wt(e, t) {
      return t = en(e, t), Je[t];
    }
    function ht(e, t) {
      (!t.ptrType || !t.ptr) && dt("makeClassHandle requires ptr and ptrType");
      var r = !!t.smartPtrType, n = !!t.smartPtr;
      return r !== n && dt("Both smartPtrType and smartPtr must be specified"), t.count = { value: 1 }, qe(Object.create(e, { $$: { value: t } }));
    }
    function $r(e) {
      var t = this.getPointee(e);
      if (!t)
        return this.destructor(e), null;
      var r = wt(this.registeredClass, t);
      if (r !== void 0) {
        if (r.$$.count.value === 0)
          return r.$$.ptr = t, r.$$.smartPtr = e, r.clone();
        var n = r.clone();
        return this.destructor(e), n;
      }
      function s() {
        return this.isSmartPointer ? ht(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: t, smartPtrType: this, smartPtr: e }) : ht(this.registeredClass.instancePrototype, { ptrType: this, ptr: e });
      }
      var a = this.registeredClass.getActualType(t), l = ar[a];
      if (!l)
        return s.call(this);
      var u;
      this.isConst ? u = l.constPointerType : u = l.pointerType;
      var g = sr(t, this.registeredClass, u.registeredClass);
      return g === null ? s.call(this) : this.isSmartPointer ? ht(u.registeredClass.instancePrototype, { ptrType: u, ptr: g, smartPtrType: this, smartPtr: e }) : ht(u.registeredClass.instancePrototype, { ptrType: u, ptr: g });
    }
    var qe = function(e) {
      return typeof FinalizationRegistry > "u" ? (qe = (t) => t, e) : (Dt = new FinalizationRegistry((t) => {
        yt(t.$$);
      }), qe = (t) => {
        var r = t.$$, n = !!r.smartPtr;
        if (n) {
          var s = { $$: r };
          Dt.register(t, s, t);
        }
        return t;
      }, or = (t) => Dt.unregister(t), qe(e));
    };
    function ur() {
      if (this.$$.ptr || ft(this), this.$$.preservePointerOnDelete)
        return this.$$.count.value += 1, this;
      var e = qe(Object.create(Object.getPrototypeOf(this), { $$: { value: Qr(this.$$) } }));
      return e.$$.count.value += 1, e.$$.deleteScheduled = !1, e;
    }
    function tn() {
      this.$$.ptr || ft(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && N("Object already scheduled for deletion"), or(this), yt(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
    }
    function Sr() {
      return !this.$$.ptr;
    }
    function rn() {
      return this.$$.ptr || ft(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && N("Object already scheduled for deletion"), _e.push(this), _e.length === 1 && Ze && Ze(At), this.$$.deleteScheduled = !0, this;
    }
    function Dr() {
      ke.prototype.isAliasOf = Kr, ke.prototype.clone = ur, ke.prototype.delete = tn, ke.prototype.isDeleted = Sr, ke.prototype.deleteLater = rn;
    }
    function ke() {
    }
    var nn = 48, on = 57;
    function pt(e) {
      if (e === void 0)
        return "_unknown";
      e = e.replace(/[^a-zA-Z0-9_]/g, "$");
      var t = e.charCodeAt(0);
      return t >= nn && t <= on ? `_${e}` : e;
    }
    function _t(e, t) {
      return e = pt(e), { [e]: function() {
        return t.apply(this, arguments);
      } }[e];
    }
    function Ue(e, t, r) {
      if (e[t].overloadTable === void 0) {
        var n = e[t];
        e[t] = function() {
          return e[t].overloadTable.hasOwnProperty(arguments.length) || N(`Function '${r}' called with an invalid number of arguments (${arguments.length}) - expects one of (${e[t].overloadTable})!`), e[t].overloadTable[arguments.length].apply(this, arguments);
        }, e[t].overloadTable = [], e[t].overloadTable[n.argCount] = n;
      }
    }
    function Ar(e, t, r) {
      i.hasOwnProperty(e) ? ((r === void 0 || i[e].overloadTable !== void 0 && i[e].overloadTable[r] !== void 0) && N(`Cannot register public name '${e}' twice`), Ue(i, e, e), i.hasOwnProperty(r) && N(`Cannot register multiple overloads of a function with the same number of arguments (${r})!`), i[e].overloadTable[r] = t) : (i[e] = t, r !== void 0 && (i[e].numArguments = r));
    }
    function sn(e, t, r, n, s, a, l, u) {
      this.name = e, this.constructor = t, this.instancePrototype = r, this.rawDestructor = n, this.baseClass = s, this.getActualType = a, this.upcast = l, this.downcast = u, this.pureVirtualFunctions = [];
    }
    function Ft(e, t, r) {
      for (; t !== r; )
        t.upcast || N(`Expected null or instance of ${r.name}, got an instance of ${t.name}`), e = t.upcast(e), t = t.baseClass;
      return e;
    }
    function Xt(e, t) {
      if (t === null)
        return this.isReference && N(`null is not a valid ${this.name}`), 0;
      t.$$ || N(`Cannot pass "${xt(t)}" as a ${this.name}`), t.$$.ptr || N(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var r = t.$$.ptrType.registeredClass, n = Ft(t.$$.ptr, r, this.registeredClass);
      return n;
    }
    function an(e, t) {
      var r;
      if (t === null)
        return this.isReference && N(`null is not a valid ${this.name}`), this.isSmartPointer ? (r = this.rawConstructor(), e !== null && e.push(this.rawDestructor, r), r) : 0;
      t.$$ || N(`Cannot pass "${xt(t)}" as a ${this.name}`), t.$$.ptr || N(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && t.$$.ptrType.isConst && N(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
      var n = t.$$.ptrType.registeredClass;
      if (r = Ft(t.$$.ptr, n, this.registeredClass), this.isSmartPointer)
        switch (t.$$.smartPtr === void 0 && N("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            t.$$.smartPtrType === this ? r = t.$$.smartPtr : N(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            r = t.$$.smartPtr;
            break;
          case 2:
            if (t.$$.smartPtrType === this)
              r = t.$$.smartPtr;
            else {
              var s = t.clone();
              r = this.rawShare(r, mt.toHandle(function() {
                s.delete();
              })), e !== null && e.push(this.rawDestructor, r);
            }
            break;
          default:
            N("Unsupporting sharing policy");
        }
      return r;
    }
    function lr(e, t) {
      if (t === null)
        return this.isReference && N(`null is not a valid ${this.name}`), 0;
      t.$$ || N(`Cannot pass "${xt(t)}" as a ${this.name}`), t.$$.ptr || N(`Cannot pass deleted object as a pointer of type ${this.name}`), t.$$.ptrType.isConst && N(`Cannot convert argument of type ${t.$$.ptrType.name} to parameter type ${this.name}`);
      var r = t.$$.ptrType.registeredClass, n = Ft(t.$$.ptr, r, this.registeredClass);
      return n;
    }
    function vt(e) {
      return this.fromWireType(V[e >> 2]);
    }
    function un(e) {
      return this.rawGetPointee && (e = this.rawGetPointee(e)), e;
    }
    function ln(e) {
      this.rawDestructor && this.rawDestructor(e);
    }
    function cn(e) {
      e !== null && e.delete();
    }
    function dn() {
      be.prototype.getPointee = un, be.prototype.destructor = ln, be.prototype.argPackAdvance = 8, be.prototype.readValueFromPointer = vt, be.prototype.deleteObject = cn, be.prototype.fromWireType = $r;
    }
    function be(e, t, r, n, s, a, l, u, g, m, T) {
      this.name = e, this.registeredClass = t, this.isReference = r, this.isConst = n, this.isSmartPointer = s, this.pointeeType = a, this.sharingPolicy = l, this.rawGetPointee = u, this.rawConstructor = g, this.rawShare = m, this.rawDestructor = T, !s && t.baseClass === void 0 ? n ? (this.toWireType = Xt, this.destructorFunction = null) : (this.toWireType = lr, this.destructorFunction = null) : this.toWireType = an;
    }
    function fn(e, t, r) {
      i.hasOwnProperty(e) || dt("Replacing nonexistant public symbol"), i[e].overloadTable !== void 0 && r !== void 0 ? i[e].overloadTable[r] = t : (i[e] = t, i[e].argCount = r);
    }
    var hn = (e, t, r) => {
      var n = i["dynCall_" + e];
      return r && r.length ? n.apply(null, [t].concat(r)) : n.call(null, t);
    }, it = [], Kt = (e) => {
      var t = it[e];
      return t || (e >= it.length && (it.length = e + 1), it[e] = t = Zt.get(e)), t;
    }, pn = (e, t, r) => {
      if (e.includes("j"))
        return hn(e, t, r);
      var n = Kt(t).apply(null, r);
      return n;
    }, vn = (e, t) => {
      var r = [];
      return function() {
        return r.length = 0, Object.assign(r, arguments), pn(e, t, r);
      };
    };
    function Be(e, t) {
      e = de(e);
      function r() {
        return e.includes("j") ? vn(e, t) : Kt(t);
      }
      var n = r();
      return typeof n != "function" && N(`unknown function pointer with signature ${e}: ${t}`), n;
    }
    function mn(e, t) {
      var r = _t(t, function(n) {
        this.name = t, this.message = n;
        var s = new Error(n).stack;
        s !== void 0 && (this.stack = this.toString() + `
` + s.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return r.prototype = Object.create(e.prototype), r.prototype.constructor = r, r.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, r;
    }
    var cr = void 0;
    function dr(e) {
      var t = Fn(e), r = de(t);
      return $e(t), r;
    }
    function Rt(e, t) {
      var r = [], n = {};
      function s(a) {
        if (!n[a] && !xe[a]) {
          if (ct[a]) {
            ct[a].forEach(s);
            return;
          }
          r.push(a), n[a] = !0;
        }
      }
      throw t.forEach(s), new cr(`${e}: ` + r.map(dr).join([", "]));
    }
    function gn(e, t, r, n, s, a, l, u, g, m, T, S, k) {
      T = de(T), a = Be(s, a), u && (u = Be(l, u)), m && (m = Be(g, m)), k = Be(S, k);
      var P = pt(T);
      Ar(P, function() {
        Rt(`Cannot construct ${T} due to unbound types`, [n]);
      }), Ye([e, t, r], n ? [n] : [], function(U) {
        U = U[0];
        var Z, J;
        n ? (Z = U.registeredClass, J = Z.instancePrototype) : J = ke.prototype;
        var oe = _t(P, function() {
          if (Object.getPrototypeOf(this) !== he)
            throw new je("Use 'new' to construct " + T);
          if (ee.constructor_body === void 0)
            throw new je(T + " has no accessible constructor");
          var se = ee.constructor_body[arguments.length];
          if (se === void 0)
            throw new je(`Tried to invoke ctor of ${T} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(ee.constructor_body).toString()}) parameters instead!`);
          return se.apply(this, arguments);
        }), he = Object.create(J, { constructor: { value: oe } });
        oe.prototype = he;
        var ee = new sn(T, oe, he, k, Z, a, u, m);
        ee.baseClass && (ee.baseClass.__derivedClasses === void 0 && (ee.baseClass.__derivedClasses = []), ee.baseClass.__derivedClasses.push(ee));
        var We = new be(T, ee, !0, !1, !1), ve = new be(T + "*", ee, !1, !1, !1), Se = new be(T + " const*", ee, !1, !0, !1);
        return ar[e] = { pointerType: ve, constPointerType: Se }, fn(P, oe), [We, ve, Se];
      });
    }
    function fr(e, t) {
      for (var r = [], n = 0; n < e; n++)
        r.push(X[t + n * 4 >> 2]);
      return r;
    }
    function yn(e) {
      for (; e.length; ) {
        var t = e.pop(), r = e.pop();
        r(t);
      }
    }
    function hr(e, t) {
      if (!(e instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof e} which is not a function`);
      var r = _t(e.name || "unknownFunctionName", function() {
      });
      r.prototype = e.prototype;
      var n = new r(), s = e.apply(n, t);
      return s instanceof Object ? s : n;
    }
    function pr(e, t, r, n, s, a) {
      var l = t.length;
      l < 2 && N("argTypes array size mismatch! Must at least get return value and 'this' types!");
      for (var u = t[1] !== null && r !== null, g = !1, m = 1; m < t.length; ++m)
        if (t[m] !== null && t[m].destructorFunction === void 0) {
          g = !0;
          break;
        }
      for (var T = t[0].name !== "void", S = "", k = "", m = 0; m < l - 2; ++m)
        S += (m !== 0 ? ", " : "") + "arg" + m, k += (m !== 0 ? ", " : "") + "arg" + m + "Wired";
      var P = `
        return function ${pt(e)}(${S}) {
        if (arguments.length !== ${l - 2}) {
          throwBindingError('function ${e} called with ${arguments.length} arguments, expected ${l - 2} args!');
        }`;
      g && (P += `var destructors = [];
`);
      var U = g ? "destructors" : "null", Z = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"], J = [N, n, s, yn, t[0], t[1]];
      u && (P += "var thisWired = classParam.toWireType(" + U + `, this);
`);
      for (var m = 0; m < l - 2; ++m)
        P += "var arg" + m + "Wired = argType" + m + ".toWireType(" + U + ", arg" + m + "); // " + t[m + 2].name + `
`, Z.push("argType" + m), J.push(t[m + 2]);
      if (u && (k = "thisWired" + (k.length > 0 ? ", " : "") + k), P += (T || a ? "var rv = " : "") + "invoker(fn" + (k.length > 0 ? ", " : "") + k + `);
`, g)
        P += `runDestructors(destructors);
`;
      else
        for (var m = u ? 1 : 2; m < t.length; ++m) {
          var oe = m === 1 ? "thisWired" : "arg" + (m - 2) + "Wired";
          t[m].destructorFunction !== null && (P += oe + "_dtor(" + oe + "); // " + t[m].name + `
`, Z.push(oe + "_dtor"), J.push(t[m].destructorFunction));
        }
      return T && (P += `var ret = retType.fromWireType(rv);
return ret;
`), P += `}
`, Z.push(P), hr(Function, Z).apply(null, J);
    }
    function wn(e, t, r, n, s, a) {
      var l = fr(t, r);
      s = Be(n, s), Ye([], [e], function(u) {
        u = u[0];
        var g = `constructor ${u.name}`;
        if (u.registeredClass.constructor_body === void 0 && (u.registeredClass.constructor_body = []), u.registeredClass.constructor_body[t - 1] !== void 0)
          throw new je(`Cannot register multiple constructors with identical number of parameters (${t - 1}) for class '${u.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return u.registeredClass.constructor_body[t - 1] = () => {
          Rt(`Cannot construct ${u.name} due to unbound types`, l);
        }, Ye([], l, function(m) {
          return m.splice(1, 0, null), u.registeredClass.constructor_body[t - 1] = pr(g, m, null, s, a), [];
        }), [];
      });
    }
    function vr(e, t, r, n, s, a, l, u, g) {
      var m = fr(r, n);
      t = de(t), a = Be(s, a), Ye([], [e], function(T) {
        T = T[0];
        var S = `${T.name}.${t}`;
        t.startsWith("@@") && (t = Symbol[t.substring(2)]), u && T.registeredClass.pureVirtualFunctions.push(t);
        function k() {
          Rt(`Cannot call ${S} due to unbound types`, m);
        }
        var P = T.registeredClass.instancePrototype, U = P[t];
        return U === void 0 || U.overloadTable === void 0 && U.className !== T.name && U.argCount === r - 2 ? (k.argCount = r - 2, k.className = T.name, P[t] = k) : (Ue(P, t, S), P[t].overloadTable[r - 2] = k), Ye([], m, function(Z) {
          var J = pr(S, Z, T, a, l, g);
          return P[t].overloadTable === void 0 ? (J.argCount = r - 2, P[t] = J) : P[t].overloadTable[r - 2] = J, [];
        }), [];
      });
    }
    function _n() {
      Object.assign(mr.prototype, { get(e) {
        return this.allocated[e];
      }, has(e) {
        return this.allocated[e] !== void 0;
      }, allocate(e) {
        var t = this.freelist.pop() || this.allocated.length;
        return this.allocated[t] = e, t;
      }, free(e) {
        this.allocated[e] = void 0, this.freelist.push(e);
      } });
    }
    function mr() {
      this.allocated = [void 0], this.freelist = [];
    }
    var ge = new mr();
    function gr(e) {
      e >= ge.reserved && --ge.get(e).refcount === 0 && ge.free(e);
    }
    function Fr() {
      for (var e = 0, t = ge.reserved; t < ge.allocated.length; ++t)
        ge.allocated[t] !== void 0 && ++e;
      return e;
    }
    function bn() {
      ge.allocated.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 }), ge.reserved = ge.allocated.length, i.count_emval_handles = Fr;
    }
    var mt = { toValue: (e) => (e || N("Cannot use deleted val. handle = " + e), ge.get(e).value), toHandle: (e) => {
      switch (e) {
        case void 0:
          return 1;
        case null:
          return 2;
        case !0:
          return 3;
        case !1:
          return 4;
        default:
          return ge.allocate({ refcount: 1, value: e });
      }
    } };
    function Rr(e, t) {
      t = de(t), we(e, { name: t, fromWireType: function(r) {
        var n = mt.toValue(r);
        return gr(r), n;
      }, toWireType: function(r, n) {
        return mt.toHandle(n);
      }, argPackAdvance: 8, readValueFromPointer: vt, destructorFunction: null });
    }
    function xt(e) {
      if (e === null)
        return "null";
      var t = typeof e;
      return t === "object" || t === "array" || t === "function" ? e.toString() : "" + e;
    }
    function En(e, t) {
      switch (t) {
        case 2:
          return function(r) {
            return this.fromWireType(Lt[r >> 2]);
          };
        case 3:
          return function(r) {
            return this.fromWireType(jt[r >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + e);
      }
    }
    function Pn(e, t, r) {
      var n = St(r);
      t = de(t), we(e, { name: t, fromWireType: function(s) {
        return s;
      }, toWireType: function(s, a) {
        return a;
      }, argPackAdvance: 8, readValueFromPointer: En(t, n), destructorFunction: null });
    }
    function Tn(e, t, r) {
      switch (t) {
        case 0:
          return r ? function(s) {
            return ne[s];
          } : function(s) {
            return Q[s];
          };
        case 1:
          return r ? function(s) {
            return Pe[s >> 1];
          } : function(s) {
            return tt[s >> 1];
          };
        case 2:
          return r ? function(s) {
            return V[s >> 2];
          } : function(s) {
            return X[s >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + e);
      }
    }
    function kn(e, t, r, n, s) {
      t = de(t);
      var a = St(r), l = (S) => S;
      if (n === 0) {
        var u = 32 - 8 * r;
        l = (S) => S << u >>> u;
      }
      var g = t.includes("unsigned"), m = (S, k) => {
      }, T;
      g ? T = function(S, k) {
        return m(k, this.name), k >>> 0;
      } : T = function(S, k) {
        return m(k, this.name), k;
      }, we(e, { name: t, fromWireType: l, toWireType: T, argPackAdvance: 8, readValueFromPointer: Tn(t, a, n !== 0), destructorFunction: null });
    }
    function Cn(e, t, r) {
      var n = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], s = n[t];
      function a(l) {
        l = l >> 2;
        var u = X, g = u[l], m = u[l + 1];
        return new s(u.buffer, m, g);
      }
      r = de(r), we(e, { name: r, fromWireType: a, argPackAdvance: 8, readValueFromPointer: a }, { ignoreDuplicateRegistrations: !0 });
    }
    var $n = (e, t, r) => kt(e, Q, t, r);
    function et(e, t) {
      t = de(t);
      var r = t === "std::string";
      we(e, { name: t, fromWireType: function(n) {
        var s = X[n >> 2], a = n + 4, l;
        if (r)
          for (var u = a, g = 0; g <= s; ++g) {
            var m = a + g;
            if (g == s || Q[m] == 0) {
              var T = m - u, S = lt(u, T);
              l === void 0 ? l = S : (l += String.fromCharCode(0), l += S), u = m + 1;
            }
          }
        else {
          for (var k = new Array(s), g = 0; g < s; ++g)
            k[g] = String.fromCharCode(Q[a + g]);
          l = k.join("");
        }
        return $e(n), l;
      }, toWireType: function(n, s) {
        s instanceof ArrayBuffer && (s = new Uint8Array(s));
        var a, l = typeof s == "string";
        l || s instanceof Uint8Array || s instanceof Uint8ClampedArray || s instanceof Int8Array || N("Cannot pass non-string to std::string"), r && l ? a = Tt(s) : a = s.length;
        var u = wr(4 + a + 1), g = u + 4;
        if (X[u >> 2] = a, r && l)
          $n(s, g, a + 1);
        else if (l)
          for (var m = 0; m < a; ++m) {
            var T = s.charCodeAt(m);
            T > 255 && ($e(g), N("String has UTF-16 code units that do not fit in 8 bits")), Q[g + m] = T;
          }
        else
          for (var m = 0; m < a; ++m)
            Q[g + m] = s[m];
        return n !== null && n.push($e, u), u;
      }, argPackAdvance: 8, readValueFromPointer: vt, destructorFunction: function(n) {
        $e(n);
      } });
    }
    var Ut = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, xr = (e, t) => {
      for (var r = e, n = r >> 1, s = n + t / 2; !(n >= s) && tt[n]; )
        ++n;
      if (r = n << 1, r - e > 32 && Ut)
        return Ut.decode(Q.subarray(e, r));
      for (var a = "", l = 0; !(l >= t / 2); ++l) {
        var u = Pe[e + l * 2 >> 1];
        if (u == 0)
          break;
        a += String.fromCharCode(u);
      }
      return a;
    }, Ur = (e, t, r) => {
      if (r === void 0 && (r = 2147483647), r < 2)
        return 0;
      r -= 2;
      for (var n = t, s = r < e.length * 2 ? r / 2 : e.length, a = 0; a < s; ++a) {
        var l = e.charCodeAt(a);
        Pe[t >> 1] = l, t += 2;
      }
      return Pe[t >> 1] = 0, t - n;
    }, Qt = (e) => e.length * 2, Br = (e, t) => {
      for (var r = 0, n = ""; !(r >= t / 4); ) {
        var s = V[e + r * 4 >> 2];
        if (s == 0)
          break;
        if (++r, s >= 65536) {
          var a = s - 65536;
          n += String.fromCharCode(55296 | a >> 10, 56320 | a & 1023);
        } else
          n += String.fromCharCode(s);
      }
      return n;
    }, d = (e, t, r) => {
      if (r === void 0 && (r = 2147483647), r < 4)
        return 0;
      for (var n = t, s = n + r - 4, a = 0; a < e.length; ++a) {
        var l = e.charCodeAt(a);
        if (l >= 55296 && l <= 57343) {
          var u = e.charCodeAt(++a);
          l = 65536 + ((l & 1023) << 10) | u & 1023;
        }
        if (V[t >> 2] = l, t += 4, t + 4 > s)
          break;
      }
      return V[t >> 2] = 0, t - n;
    }, f = (e) => {
      for (var t = 0, r = 0; r < e.length; ++r) {
        var n = e.charCodeAt(r);
        n >= 55296 && n <= 57343 && ++r, t += 4;
      }
      return t;
    }, v = function(e, t, r) {
      r = de(r);
      var n, s, a, l, u;
      t === 2 ? (n = xr, s = Ur, l = Qt, a = () => tt, u = 1) : t === 4 && (n = Br, s = d, l = f, a = () => X, u = 2), we(e, { name: r, fromWireType: function(g) {
        for (var m = X[g >> 2], T = a(), S, k = g + 4, P = 0; P <= m; ++P) {
          var U = g + 4 + P * t;
          if (P == m || T[U >> u] == 0) {
            var Z = U - k, J = n(k, Z);
            S === void 0 ? S = J : (S += String.fromCharCode(0), S += J), k = U + t;
          }
        }
        return $e(g), S;
      }, toWireType: function(g, m) {
        typeof m != "string" && N(`Cannot pass non-string to C++ string type ${r}`);
        var T = l(m), S = wr(4 + T + t);
        return X[S >> 2] = T >> u, s(m, S + 4, T + t), g !== null && g.push($e, S), S;
      }, argPackAdvance: 8, readValueFromPointer: vt, destructorFunction: function(g) {
        $e(g);
      } });
    };
    function E(e, t) {
      t = de(t), we(e, { isVoid: !0, name: t, argPackAdvance: 0, fromWireType: function() {
      }, toWireType: function(r, n) {
      } });
    }
    var D = {};
    function x(e) {
      var t = D[e];
      return t === void 0 ? de(e) : t;
    }
    var B = [];
    function F(e, t, r, n) {
      e = B[e], t = mt.toValue(t), r = x(r), e(t, r, null, n);
    }
    function q(e) {
      var t = B.length;
      return B.push(e), t;
    }
    function M(e, t) {
      var r = xe[e];
      return r === void 0 && N(t + " has unknown type " + dr(e)), r;
    }
    function te(e, t) {
      for (var r = new Array(e), n = 0; n < e; ++n)
        r[n] = M(X[t + n * 4 >> 2], "parameter " + n);
      return r;
    }
    var ie = [];
    function le(e, t) {
      var r = te(e, t), n = r[0], s = n.name + "_$" + r.slice(1).map(function(U) {
        return U.name;
      }).join("_") + "$", a = ie[s];
      if (a !== void 0)
        return a;
      for (var l = ["retType"], u = [n], g = "", m = 0; m < e - 1; ++m)
        g += (m !== 0 ? ", " : "") + "arg" + m, l.push("argType" + m), u.push(r[1 + m]);
      for (var T = pt("methodCaller_" + s), S = "return function " + T + `(handle, name, destructors, args) {
`, k = 0, m = 0; m < e - 1; ++m)
        S += "    var arg" + m + " = argType" + m + ".readValueFromPointer(args" + (k ? "+" + k : "") + `);
`, k += r[m + 1].argPackAdvance;
      S += "    var rv = handle[name](" + g + `);
`;
      for (var m = 0; m < e - 1; ++m)
        r[m + 1].deleteObject && (S += "    argType" + m + ".deleteObject(arg" + m + `);
`);
      n.isVoid || (S += `    return retType.toWireType(destructors, rv);
`), S += `};
`, l.push(S);
      var P = hr(Function, l).apply(null, u);
      return a = q(P), ie[s] = a, a;
    }
    function fe(e, t) {
      return t + 2097152 >>> 0 < 4194305 - !!e ? (e >>> 0) + t * 4294967296 : NaN;
    }
    var Ee = () => {
      Ae("");
    };
    function Me() {
      return Date.now();
    }
    var De = () => Q.length, ot = () => De(), yr = (e, t, r) => Q.copyWithin(e, t, t + r), ze = (e) => {
      Ae("OOM");
    }, Sn = (e) => {
      Q.length, ze();
    }, bt = {}, Mr = () => _ || "./this.program", Ge = () => {
      if (!Ge.strings) {
        var e = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", t = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: e, _: Mr() };
        for (var r in bt)
          bt[r] === void 0 ? delete t[r] : t[r] = bt[r];
        var n = [];
        for (var r in t)
          n.push(`${r}=${t[r]}`);
        Ge.strings = n;
      }
      return Ge.strings;
    }, Hn = (e, t) => {
      for (var r = 0; r < e.length; ++r)
        ne[t++ >> 0] = e.charCodeAt(r);
      ne[t >> 0] = 0;
    }, Vn = (e, t) => {
      var r = 0;
      return Ge().forEach(function(n, s) {
        var a = t + r;
        X[e + s * 4 >> 2] = a, Hn(n, a), r += n.length + 1;
      }), 0;
    }, Nn = (e, t) => {
      var r = Ge();
      X[e >> 2] = r.length;
      var n = 0;
      return r.forEach(function(s) {
        n += s.length + 1;
      }), X[t >> 2] = n, 0;
    };
    function qn(e) {
      try {
        var t = ue.getStreamFromFD(e);
        return o.close(t), 0;
      } catch (r) {
        if (typeof o > "u" || r.name !== "ErrnoError")
          throw r;
        return r.errno;
      }
    }
    function Gn(e, t) {
      try {
        var r = 0, n = 0, s = 0, a = ue.getStreamFromFD(e), l = a.tty ? 2 : o.isDir(a.mode) ? 3 : o.isLink(a.mode) ? 7 : 4;
        return ne[t >> 0] = l, Pe[t + 2 >> 1] = s, Y = [r >>> 0, (R = r, +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[t + 8 >> 2] = Y[0], V[t + 12 >> 2] = Y[1], Y = [n >>> 0, (R = n, +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[t + 16 >> 2] = Y[0], V[t + 20 >> 2] = Y[1], 0;
      } catch (u) {
        if (typeof o > "u" || u.name !== "ErrnoError")
          throw u;
        return u.errno;
      }
    }
    var Xn = (e, t, r, n) => {
      for (var s = 0, a = 0; a < r; a++) {
        var l = X[t >> 2], u = X[t + 4 >> 2];
        t += 8;
        var g = o.read(e, ne, l, u, n);
        if (g < 0)
          return -1;
        if (s += g, g < u)
          break;
        typeof n < "u" && (n += g);
      }
      return s;
    };
    function Kn(e, t, r, n) {
      try {
        var s = ue.getStreamFromFD(e), a = Xn(s, t, r);
        return X[n >> 2] = a, 0;
      } catch (l) {
        if (typeof o > "u" || l.name !== "ErrnoError")
          throw l;
        return l.errno;
      }
    }
    function Qn(e, t, r, n, s) {
      var a = fe(t, r);
      try {
        if (isNaN(a))
          return 61;
        var l = ue.getStreamFromFD(e);
        return o.llseek(l, a, n), Y = [l.position >>> 0, (R = l.position, +Math.abs(R) >= 1 ? R > 0 ? +Math.floor(R / 4294967296) >>> 0 : ~~+Math.ceil((R - +(~~R >>> 0)) / 4294967296) >>> 0 : 0)], V[s >> 2] = Y[0], V[s + 4 >> 2] = Y[1], l.getdents && a === 0 && n === 0 && (l.getdents = null), 0;
      } catch (u) {
        if (typeof o > "u" || u.name !== "ErrnoError")
          throw u;
        return u.errno;
      }
    }
    var Yn = (e, t, r, n) => {
      for (var s = 0, a = 0; a < r; a++) {
        var l = X[t >> 2], u = X[t + 4 >> 2];
        t += 8;
        var g = o.write(e, ne, l, u, n);
        if (g < 0)
          return -1;
        s += g, typeof n < "u" && (n += g);
      }
      return s;
    };
    function Zn(e, t, r, n) {
      try {
        var s = ue.getStreamFromFD(e), a = Yn(s, t, r);
        return X[n >> 2] = a, 0;
      } catch (l) {
        if (typeof o > "u" || l.name !== "ErrnoError")
          throw l;
        return l.errno;
      }
    }
    var Dn = function(e, t, r, n) {
      e || (e = this), this.parent = e, this.mount = e.mount, this.mounted = null, this.id = o.nextInode++, this.name = t, this.mode = r, this.node_ops = {}, this.stream_ops = {}, this.rdev = n;
    }, Bt = 365, Mt = 146;
    Object.defineProperties(Dn.prototype, { read: { get: function() {
      return (this.mode & Bt) === Bt;
    }, set: function(e) {
      e ? this.mode |= Bt : this.mode &= ~Bt;
    } }, write: { get: function() {
      return (this.mode & Mt) === Mt;
    }, set: function(e) {
      e ? this.mode |= Mt : this.mode &= ~Mt;
    } }, isFolder: { get: function() {
      return o.isDir(this.mode);
    } }, isDevice: { get: function() {
      return o.isChrdev(this.mode);
    } } }), o.FSNode = Dn, o.createPreloadedFile = Nr, o.staticInit(), Nt(), je = i.BindingError = class extends Error {
      constructor(t) {
        super(t), this.name = "BindingError";
      }
    }, Ne = i.InternalError = class extends Error {
      constructor(t) {
        super(t), this.name = "InternalError";
      }
    }, Dr(), Cr(), dn(), cr = i.UnboundTypeError = mn(Error, "UnboundTypeError"), _n(), bn();
    var Jn = { p: at, C: Gr, w: $t, t: Xr, n: kr, r: gn, q: wn, d: vr, D: Rr, k: Pn, c: kn, b: Cn, j: et, f: v, o: E, g: F, m: gr, l: le, a: Ee, e: Me, v: ot, A: yr, u: Sn, y: Vn, z: Nn, i: qn, x: Gn, B: Kn, s: Qn, h: Zn };
    Vr();
    var wr = (e) => (wr = K.G)(e), $e = (e) => ($e = K.I)(e), An = () => (An = K.J)(), Fn = (e) => (Fn = K.K)(e);
    i.__embind_initialize_bindings = () => (i.__embind_initialize_bindings = K.L)();
    var Rn = (e) => (Rn = K.M)(e);
    i.dynCall_viiijj = (e, t, r, n, s, a, l, u) => (i.dynCall_viiijj = K.N)(e, t, r, n, s, a, l, u), i.dynCall_jij = (e, t, r, n) => (i.dynCall_jij = K.O)(e, t, r, n), i.dynCall_jii = (e, t, r) => (i.dynCall_jii = K.P)(e, t, r), i.dynCall_jiji = (e, t, r, n, s) => (i.dynCall_jiji = K.Q)(e, t, r, n, s);
    var Ot;
    Ke = function e() {
      Ot || xn(), Ot || (Ke = e);
    };
    function xn() {
      if (Te > 0 || (Ir(), Te > 0))
        return;
      function e() {
        Ot || (Ot = !0, i.calledRun = !0, !ae && (Lr(), p(i), i.onRuntimeInitialized && i.onRuntimeInitialized(), st()));
      }
      i.setStatus ? (i.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          i.setStatus("");
        }, 1), e();
      }, 1)) : e();
    }
    if (i.preInit)
      for (typeof i.preInit == "function" && (i.preInit = [i.preInit]); i.preInit.length > 0; )
        i.preInit.pop()();
    return xn(), c.ready;
  };
})(), Ei = Object.defineProperty, Pi = Object.getOwnPropertyDescriptor, In = (L, c, i, p) => {
  for (var h = p > 1 ? void 0 : p ? Pi(c, i) : c, b = L.length - 1, _; b >= 0; b--)
    (_ = L[b]) && (h = (p ? _(c, i, h) : _(h)) || h);
  return p && h && Ei(c, i, h), h;
};
class Or extends me {
  constructor() {
    super(...arguments), this.sampleRate = 0, this.channels = 0;
  }
  initialize() {
    return new Promise((c) => {
      const i = {};
      i.print = (p) => console.log(p), i.printErr = (p) => console.log(`[JS] ERROR: ${p}`), i.onAbort = () => console.log("[JS] FATAL: WASM ABORTED"), i.postRun = (p) => {
        this.module = p, this.decoder = new this.module.AudioDecoder(this), c();
      }, console.log("audio soft decoder initialize call"), bi(i);
    });
  }
  configure(c) {
    this.config = c, this.decoder.setCodec(this.config.codec, this.config.description ?? "");
  }
  decode(c) {
    this.decoder.decode(c.data, c.timestamp);
  }
  flush() {
  }
  reset() {
    this.config = void 0, this.decoder && this.decoder.clear();
  }
  close() {
    this.removeAllListeners(), this.decoder && (this.decoder.clear(), this.decoder.delete());
  }
  // wasm callback function
  audioInfo(c, i) {
    this.sampleRate = c, this.channels = i;
    let p = {
      sampleRate: c,
      channels: i,
      depth: 16
    };
    this.emit(Un.AudioCodecInfo, p);
  }
  pcmData(c, i, p) {
    if (!this.module)
      return;
    let h = [], b = 0, _ = 0;
    for (let w = 0; w < this.channels; w++) {
      let y = this.module.HEAPU32[(c >> 2) + w] >> 2;
      const A = this.module.HEAPF32.subarray(y, y + i);
      h.push(A), b += A.length;
    }
    const C = new Float32Array(b);
    this.emit(Un.AudioFrame, new AudioData({
      format: "f32-planar",
      sampleRate: this.sampleRate,
      numberOfChannels: this.channels,
      timestamp: p,
      numberOfFrames: i,
      data: h.reduce((w, y) => (w.subarray(_).set(y), _ += y.length, w), C)
    }));
  }
  errorInfo(c) {
    let i = {
      errMsg: c
    };
    this.emit(Un.Error, i);
  }
}
In([
  Yt(me.INIT, "initialized")
], Or.prototype, "initialize", 1);
In([
  Yt("initialized", "configured", { sync: !0 })
], Or.prototype, "configure", 1);
In([
  pi("configured")
], Or.prototype, "decode", 1);
In([
  Yt("configured", "initialized", { sync: !0 })
], Or.prototype, "reset", 1);
In([
  Yt([], "closed", { sync: !0 })
], Or.prototype, "close", 1);
class Ti {
  constructor(c) {
    O(this, "gl", null);
    O(this, "program", null);
    O(this, "yTexture", null);
    O(this, "uTexture", null);
    O(this, "vTexture", null);
    O(this, "positionBuffer", null);
    O(this, "texCoordBuffer", null);
    O(this, "width", 0);
    O(this, "height", 0);
    this.setupWebGL(c);
  }
  setupWebGL(c) {
    try {
      if (this.gl = c.getContext("webgl", { preserveDrawingBuffer: !0 }), !this.gl)
        throw new Error("WebGL not supported");
      const i = this.createShader(this.gl.VERTEX_SHADER, `
        attribute vec4 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        void main() {
          gl_Position = a_position;
          v_texCoord = a_texCoord;
        }
      `), p = this.createShader(this.gl.FRAGMENT_SHADER, `
        precision mediump float;
        uniform sampler2D y_texture;
        uniform sampler2D u_texture;
        uniform sampler2D v_texture;
        varying vec2 v_texCoord;
        
        void main() {
          float y = texture2D(y_texture, v_texCoord).r;
          float u = texture2D(u_texture, v_texCoord).r - 0.5;
          float v = texture2D(v_texture, v_texCoord).r - 0.5;
          
          // YUV to RGB conversion
          float r = y + 1.402 * v;
          float g = y - 0.344 * u - 0.714 * v;
          float b = y + 1.772 * u;
          
          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `);
      if (!i || !p)
        throw new Error("Failed to create shaders");
      if (this.program = this.createProgram(i, p), !this.program)
        throw new Error("Failed to create shader program");
      this.createBuffers(), this.yTexture = this.createTexture(), this.uTexture = this.createTexture(), this.vTexture = this.createTexture();
    } catch (i) {
      console.error("Error initializing WebGL:", i), this.gl = null;
    }
  }
  createShader(c, i) {
    if (!this.gl)
      return null;
    const p = this.gl.createShader(c);
    return p ? (this.gl.shaderSource(p, i), this.gl.compileShader(p), this.gl.getShaderParameter(p, this.gl.COMPILE_STATUS) ? p : (console.error("Shader compile error:", this.gl.getShaderInfoLog(p)), this.gl.deleteShader(p), null)) : null;
  }
  createProgram(c, i) {
    if (!this.gl)
      return null;
    const p = this.gl.createProgram();
    return p ? (this.gl.attachShader(p, c), this.gl.attachShader(p, i), this.gl.linkProgram(p), this.gl.getProgramParameter(p, this.gl.LINK_STATUS) ? p : (console.error("Program link error:", this.gl.getProgramInfoLog(p)), this.gl.deleteProgram(p), null)) : null;
  }
  createTexture() {
    if (!this.gl)
      return null;
    const c = this.gl.createTexture();
    return c ? (this.gl.bindTexture(this.gl.TEXTURE_2D, c), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR), c) : null;
  }
  createBuffers() {
    if (!this.gl || !this.program)
      return;
    this.positionBuffer = this.gl.createBuffer(), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    const c = [
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      1
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(c), this.gl.STATIC_DRAW), this.texCoordBuffer = this.gl.createBuffer(), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    const i = [
      0,
      1,
      1,
      1,
      0,
      0,
      1,
      0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(i), this.gl.STATIC_DRAW);
  }
  // Set dimensions for the renderer
  setDimensions(c, i) {
    this.width = c, this.height = i, this.gl && this.gl.viewport(0, 0, c, i);
  }
  // Render YUV data to the canvas
  render(c, i, p, h, b) {
    if (!this.gl || !this.program || !this.yTexture || !this.uTexture || !this.vTexture) {
      console.error("WebGL not initialized properly");
      return;
    }
    this.gl.useProgram(this.program), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    const _ = this.gl.getAttribLocation(this.program, "a_position");
    this.gl.enableVertexAttribArray(_), this.gl.vertexAttribPointer(_, 2, this.gl.FLOAT, !1, 0, 0), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    const C = this.gl.getAttribLocation(this.program, "a_texCoord");
    this.gl.enableVertexAttribArray(C), this.gl.vertexAttribPointer(C, 2, this.gl.FLOAT, !1, 0, 0), this.updateTexture(this.yTexture, 0, c, this.width, this.height, h), this.updateTexture(this.uTexture, 1, i, this.width / 2, this.height / 2, b), this.updateTexture(this.vTexture, 2, p, this.width / 2, this.height / 2, b);
    const w = this.gl.getUniformLocation(this.program, "y_texture"), y = this.gl.getUniformLocation(this.program, "u_texture"), A = this.gl.getUniformLocation(this.program, "v_texture");
    this.gl.uniform1i(w, 0), this.gl.uniform1i(y, 1), this.gl.uniform1i(A, 2), this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
  updateTexture(c, i, p, h, b, _) {
    if (this.gl)
      if (this.gl.activeTexture(this.gl.TEXTURE0 + i), this.gl.bindTexture(this.gl.TEXTURE_2D, c), _ === h)
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.LUMINANCE,
          h,
          b,
          0,
          this.gl.LUMINANCE,
          this.gl.UNSIGNED_BYTE,
          p
        );
      else {
        const C = new Uint8Array(h * b);
        for (let w = 0; w < b; w++)
          for (let y = 0; y < h; y++)
            C[w * h + y] = p[w * _ + y];
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.LUMINANCE,
          h,
          b,
          0,
          this.gl.LUMINANCE,
          this.gl.UNSIGNED_BYTE,
          C
        );
      }
  }
  // Add a method to render directly from a VideoFrame with YUV format
  renderVideoFrame(c) {
    this.setDimensions(c.codedWidth, c.codedHeight);
    const i = c.codedWidth * c.codedHeight, p = c.codedWidth / 2 * (c.codedHeight / 2), h = new Uint8Array(i), b = new Uint8Array(p), _ = new Uint8Array(p);
    c.copyTo(h, { rect: { x: 0, y: 0, width: c.codedWidth, height: c.codedHeight }, layout: [{ offset: 0, stride: c.codedWidth }] }), c.format === "I420" ? (c.copyTo(b, { rect: { x: 0, y: 0, width: c.codedWidth / 2, height: c.codedHeight / 2 }, layout: [{ offset: i, stride: c.codedWidth / 2 }] }), c.copyTo(_, { rect: { x: 0, y: 0, width: c.codedWidth / 2, height: c.codedHeight / 2 }, layout: [{ offset: i + p, stride: c.codedWidth / 2 }] })) : (c.copyTo(_, { rect: { x: 0, y: 0, width: c.codedWidth / 2, height: c.codedHeight / 2 }, layout: [{ offset: i, stride: c.codedWidth / 2 }] }), c.copyTo(b, { rect: { x: 0, y: 0, width: c.codedWidth / 2, height: c.codedHeight / 2 }, layout: [{ offset: i + p, stride: c.codedWidth / 2 }] })), this.render(h, b, _, c.codedWidth, c.codedWidth / 2);
  }
  // Cleanup resources
  dispose() {
    this.gl && (this.gl.deleteTexture(this.yTexture), this.gl.deleteTexture(this.uTexture), this.gl.deleteTexture(this.vTexture), this.gl.deleteBuffer(this.positionBuffer), this.gl.deleteBuffer(this.texCoordBuffer), this.program && this.gl.deleteProgram(this.program), this.gl = null);
  }
}
class ki {
  constructor(c, i) {
    O(this, "videoDecoder");
    O(this, "audioDecoder");
    O(this, "canvas");
    O(this, "audioContext", null);
    O(this, "videoBuffer", []);
    O(this, "audioBuffer", []);
    O(this, "startTime", 0);
    O(this, "isPlaying", !1);
    O(this, "animationFrameId", null);
    O(this, "maxBufferSize", 1 / 0);
    O(this, "playbackSpeed", 1);
    O(this, "keyFrameList", []);
    O(this, "seekTime", null);
    O(this, "timeOffset", 0);
    O(this, "gl", null);
    O(this, "yuvRenderer", null);
    // Audio playback related properties
    O(this, "audioQueue", []);
    O(this, "audioQueueTimestamps", []);
    O(this, "nextAudioStartTime", 0);
    O(this, "audioScheduleAheadTime", 0.2);
    // Schedule audio 200ms ahead
    O(this, "lastAudioScheduleTime", 0);
    O(this, "audioGain", null);
    O(this, "pausedAt", null);
    O(this, "processNextFrame", () => {
      if (!this.isPlaying)
        return;
      const c = this.getCurrentTime();
      if (this.seekTime !== null) {
        for (; this.videoBuffer.length > 0 && this.videoBuffer[0].timestamp < this.seekTime; )
          this.videoBuffer.shift();
        for (; this.audioBuffer.length > 0 && this.audioBuffer[0].timestamp < this.seekTime; )
          this.audioBuffer.shift();
        this.seekTime = null;
      }
      if (this.videoBuffer.length > 0 && this.videoBuffer[0].timestamp <= c) {
        const i = this.videoBuffer.shift();
        i && this.videoDecoder.decode(i);
      }
      if (this.audioBuffer.length > 0 && this.audioBuffer[0].timestamp <= c) {
        const i = this.audioBuffer.shift();
        i && this.audioDecoder.decode(i);
      }
      this.audioContext && this.audioContext.currentTime - this.lastAudioScheduleTime > this.audioScheduleAheadTime / 2 && this.scheduleAudioPlayback(), this.animationFrameId = requestAnimationFrame(this.processNextFrame);
    });
    this.canvas = document.createElement("canvas"), i != null && i.yuvMode ? this.yuvRenderer = new Ti(this.canvas) : this.gl = this.canvas.getContext("2d"), this.videoDecoder = new _i({
      workerMode: !1,
      yuvMode: !!this.yuvRenderer,
      canvas: this.canvas,
      wasmPath: c
    }), this.audioDecoder = new Or(), this.videoDecoder.on(It.VideoFrame, (p) => {
      if (this.yuvRenderer) {
        const h = p;
        this.yuvRenderer.render(h[0], h[1], h[2], this.canvas.width, this.canvas.width / 2);
      } else
        this.gl && (this.gl.drawImage(p, 0, 0), p.close());
    }), this.videoDecoder.on(It.VideoCodecInfo, (p) => {
      this.canvas.width = p.width, this.canvas.height = p.height, this.yuvRenderer && this.yuvRenderer.setDimensions(p.width, p.height);
    }), this.videoDecoder.on(It.Error, (p) => {
      console.error(p);
    }), this.audioDecoder.on(Un.AudioFrame, (p) => {
      this.audioContext || this.initAudioContext();
      const h = this.audioContext.createBuffer(
        p.numberOfChannels,
        p.numberOfFrames,
        p.sampleRate
      );
      for (let b = 0; b < p.numberOfChannels; b++) {
        const _ = new Float32Array(p.numberOfFrames);
        p.copyTo(_, { planeIndex: b }), h.copyToChannel(_, b);
      }
      this.audioQueue.push(h), this.audioQueueTimestamps.push(p.timestamp), this.scheduleAudioPlayback();
    });
  }
  initAudioContext() {
    this.audioContext = new AudioContext(), this.audioGain = this.audioContext.createGain(), this.audioGain.connect(this.audioContext.destination), this.nextAudioStartTime = this.audioContext.currentTime;
  }
  scheduleAudioPlayback() {
    if (!(!this.isPlaying || !this.audioContext || this.audioQueue.length === 0) && !(this.nextAudioStartTime > this.audioContext.currentTime + this.audioScheduleAheadTime)) {
      for (; this.audioQueue.length > 0; ) {
        const c = this.audioQueue[0], i = this.audioQueueTimestamps[0], p = this.audioContext.createBufferSource();
        p.buffer = c, p.connect(this.audioGain), p.playbackRate.value = this.playbackSpeed;
        const h = performance.now(), b = i * this.playbackSpeed, _ = this.audioContext.currentTime + Math.max(0, (b - (h - this.startTime)) / 1e3), C = Math.max(
          this.audioContext.currentTime,
          Math.max(_, this.nextAudioStartTime)
        );
        if (p.start(C), this.nextAudioStartTime = C + c.duration / this.playbackSpeed, this.audioQueue.shift(), this.audioQueueTimestamps.shift(), this.nextAudioStartTime > this.audioContext.currentTime + this.audioScheduleAheadTime)
          break;
      }
      this.lastAudioScheduleTime = this.audioContext.currentTime;
    }
  }
  setPlaybackSpeed(c) {
    if (c <= 0)
      throw new Error("Playback speed must be greater than 0");
    this.playbackSpeed = c;
  }
  seek(c) {
    if (!this.isPlaying)
      return;
    const i = this.findNearestKeyFrame(c);
    this.videoBuffer = this.videoBuffer.filter((p) => p.timestamp >= i), this.audioBuffer = this.audioBuffer.filter((p) => p.timestamp >= i), this.audioQueue = [], this.audioQueueTimestamps = [], this.audioContext && (this.nextAudioStartTime = this.audioContext.currentTime), this.timeOffset = c, this.startTime = performance.now() - c, this.seekTime = i;
  }
  findNearestKeyFrame(c) {
    for (let i = this.keyFrameList.length - 1; i >= 0; i--)
      if (this.keyFrameList[i] <= c)
        return this.keyFrameList[i];
    return this.keyFrameList[0] || 0;
  }
  start() {
    this.isPlaying || (this.isPlaying = !0, this.pausedAt !== null ? (this.startTime = performance.now() - this.pausedAt, this.pausedAt = null) : this.startTime = performance.now() - this.timeOffset, this.processInitialFrame(), this.processNextFrame(), this.audioContext ? this.audioContext.state === "suspended" && this.audioContext.resume() : this.initAudioContext(), this.scheduleAudioPlayback());
  }
  stop() {
    this.isPlaying && (this.isPlaying = !1, this.pausedAt = this.getCurrentTime(), this.animationFrameId !== null && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null), this.audioContext && this.audioContext.state === "running" && this.audioContext.suspend());
  }
  getCurrentTime() {
    return this.pausedAt !== null ? this.pausedAt : (performance.now() - this.startTime) * this.playbackSpeed;
  }
  processInitialFrame() {
    if (this.videoBuffer.length > 0) {
      const c = this.videoBuffer[0];
      c && this.videoDecoder.decode(c);
    }
  }
  decodeVideo(c) {
    if (this.videoBuffer.length >= this.maxBufferSize) {
      console.warn("Video buffer full, dropping frame");
      return;
    }
    c.type === "key" && this.keyFrameList.push(c.timestamp), this.videoBuffer.push(c), this.isPlaying || this.start();
  }
  decodeAudio(c) {
    if (this.audioBuffer.length >= this.maxBufferSize) {
      console.warn("Audio buffer full, dropping frame");
      return;
    }
    this.audioBuffer.push(c), this.isPlaying || this.start();
  }
  // Get current playback position
  getCurrentPosition() {
    return this.getCurrentTime();
  }
  // Dispose of resources
  dispose() {
    this.stop(), this.videoBuffer = [], this.audioBuffer = [], this.audioQueue = [], this.audioQueueTimestamps = [], this.yuvRenderer && (this.yuvRenderer.dispose(), this.yuvRenderer = null), this.audioContext && (this.audioContext.close(), this.audioContext = null), this.gl = null, this.audioGain = null;
  }
}
const Ci = /#EXTINF:(\d+\.\d+),(.*?)\s*$/;
class $i {
  constructor(c, i) {
    O(this, "url");
    // 片段URL
    O(this, "duration");
    // 片段实际持续时间
    O(this, "virtualStartTime");
    // 虚拟时间轴上的开始时间
    O(this, "virtualEndTime");
    // 虚拟时间轴上的结束时间
    O(this, "physicalTime");
    // 物理时间（从EXTINF中解析）
    O(this, "data");
    // 片段的二进制数据
    O(this, "state", "init");
    O(this, "fmp4Parser", new li(!1));
    O(this, "tracks", []);
    O(this, "softDecoder");
    this.index = c, this.url = i.url, this.duration = i.duration, this.virtualStartTime = 0, this.virtualEndTime = 0, this.physicalTime = i.physicalTime;
  }
  async load(c) {
    if (this.state = "loading", !this.data) {
      const p = await fetch(this.url);
      this.data = p.arrayBuffer();
    }
    const i = await this.data;
    if (this.tracks.length === 0) {
      this.tracks = this.fmp4Parser.parse(i);
      const p = `video/mp4; codecs="${this.tracks.map((h) => h.codec).join(", ")}"`;
      if (!c.initialized)
        if (MediaSource.isTypeSupported(p))
          c.init(p);
        else
          throw new Error(`Unsupported codec: ${p}`);
    }
    this.state === "loading" && (this.state = "buffering", await c.appendBuffer({ data: i, tracks: this.tracks }), this.state = "buffered");
  }
  async load2(c) {
    var h, b;
    if (this.softDecoder = c, this.state === "init") {
      if (this.state = "loading", !this.data) {
        const C = await fetch(this.url);
        this.data = C.arrayBuffer();
      }
      const _ = await this.data;
      this.tracks = this.fmp4Parser.parse(_), this.state = "buffering";
    }
    const i = this.tracks.filter((_) => _.type === "video"), p = this.tracks.filter((_) => _.type === "audio");
    for (const _ of i) {
      c.videoDecoder.state !== "configured" && (await c.videoDecoder.initialize(), await c.videoDecoder.configure({
        codec: "hevc",
        description: (h = _.codecInfo) == null ? void 0 : h.extraData
      }), c.canvas.width = _.width ?? 1920, c.canvas.height = _.height ?? 1080);
      let C = this.virtualStartTime;
      _.samples.forEach((w) => {
        c.decodeVideo({
          data: w.data,
          timestamp: C,
          type: w.keyFrame ? "key" : "delta"
        }), C += w.duration ?? 0;
      });
    }
    for (const _ of p) {
      c.audioDecoder.state !== "configured" && (await c.audioDecoder.initialize(), await c.audioDecoder.configure({
        codec: "aac",
        description: (b = _.codecInfo) == null ? void 0 : b.extraData,
        numberOfChannels: _.channelCount ?? 2,
        sampleRate: _.sampleRate ?? 44100
      }));
      let C = this.virtualStartTime;
      _.samples.forEach((w) => {
        c.decodeAudio({
          data: w.data,
          timestamp: C,
          type: "key"
        }), C += w.duration ?? 0;
      });
    }
    this.state = "buffered";
  }
  unBuffer() {
    this.state !== "init" && (this.state = "loaded", this.softDecoder && (this.softDecoder.videoBuffer = this.softDecoder.videoBuffer.filter(
      (c) => c.timestamp < this.virtualStartTime || c.timestamp >= this.virtualEndTime
    ), this.softDecoder.audioBuffer = this.softDecoder.audioBuffer.filter(
      (c) => c.timestamp < this.virtualStartTime || c.timestamp >= this.virtualEndTime
    )));
  }
}
class Si {
  constructor(c) {
    O(this, "queue", []);
    // 排队
    O(this, "removeQueue", []);
    O(this, "currentWaiting");
    O(this, "currentError", () => {
    });
    O(this, "sourceBuffer");
    this.mediaSource = c;
  }
  get initialized() {
    return !!this.sourceBuffer;
  }
  init(c) {
    this.sourceBuffer = this.mediaSource.addSourceBuffer(c), this.sourceBuffer.mode = "sequence", this.sourceBuffer.addEventListener("updateend", () => {
      var i;
      if ((i = this.currentWaiting) == null || i.call(this), this.removeQueue.length > 0) {
        const { start: p, end: h, resolve: b, reject: _ } = this.removeQueue.shift();
        this.sourceBuffer.remove(p, h), this.currentWaiting = b, this.currentError = _;
      } else if (this.queue.length > 0) {
        const { data: p, resolve: h, reject: b } = this.queue.shift();
        this.sourceBuffer.appendBuffer(p), this.currentWaiting = h, this.currentError = b;
      } else
        delete this.currentWaiting;
    }), this.sourceBuffer.addEventListener("error", (i) => {
      this.currentError(i);
    });
  }
  appendBuffer(c) {
    return this.currentWaiting ? new Promise((i, p) => {
      this.queue.push({ data: c.data, resolve: i, reject: p });
    }) : (this.sourceBuffer.appendBuffer(c.data), new Promise((i, p) => {
      this.currentWaiting = i, this.currentError = p;
    }));
  }
  remove(c, i) {
    return this.currentWaiting ? new Promise((p, h) => {
      this.removeQueue.push({ start: c, end: i, resolve: p, reject: h });
    }) : (this.sourceBuffer.remove(c, i), new Promise((p, h) => {
      this.currentWaiting = p, this.currentError = h;
    }));
  }
}
function Di(L, c) {
  const i = L.split(`
`), p = [];
  let h = 0, b = 0, _ = 0, C = null;
  for (let w = 0; w < i.length; w++) {
    const y = i[w].trim();
    if (y.startsWith("#EXTINF:")) {
      const A = y.match(Ci);
      if (A) {
        _ = parseFloat(A[1]);
        const $ = A[2] ? A[2].trim() : "";
        try {
          $ ? C = new Date($) : C = null;
        } catch {
          C = null;
        }
      }
    } else if (!y.startsWith("#") && y !== "") {
      const A = new URL(y, c), $ = h, z = h + _, W = new $i(b, {
        url: A.toString(),
        duration: _,
        physicalTime: C
      });
      W.virtualStartTime = $, W.virtualEndTime = z, p.push(W), h += _, b++, C = null;
    }
  }
  return { segments: p, totalDuration: h };
}
class Ai {
  constructor(c, i = { debug: !1 }) {
    O(this, "segments", []);
    O(this, "totalDuration", 0);
    O(this, "mediaSource", new MediaSource());
    O(this, "sourceBufferProxy");
    O(this, "position", 0);
    O(this, "offset", 0);
    O(this, "_offset", 0);
    O(this, "windowSize", 2);
    O(this, "currentSegment");
    O(this, "urlSrouce");
    O(this, "debug", !1);
    O(this, "singleFmp4", !1);
    O(this, "softDecoder");
    O(this, "updatePosition", () => {
      this.position = this.currentTime + this.offset, this.checkBuffer();
    });
    O(this, "onWaiting", () => {
      const c = this.video.buffered;
      for (let i = 0; i < c.length; i++) {
        const p = c.start(i);
        this.currentTime >= p || (this.currentTime = p, this.video.play());
      }
    });
    this.video = c, this.debug = i.debug;
  }
  async load(c) {
    console.log("load", c);
    const i = this.mediaSource, p = new URL(c);
    switch (p.pathname.split(".").pop()) {
      case "m3u8":
        this.singleFmp4 = !1;
        const h = await fetch(c).then((_) => _.text()), b = Di(h, p.origin + p.pathname.split("/").slice(0, -1).join("/"));
        console.log("playlist", b), this.segments = b.segments, this.totalDuration = b.totalDuration, this.urlSrouce = URL.createObjectURL(i), this.video.src = this.urlSrouce, this.currentSegment = this.segments[0], this.sourceBufferProxy = new Si(i), i.addEventListener("sourceopen", async () => {
          for (let _ = 0; _ < 2 && _ < this.segments.length; _++)
            await this.appendSegment(this.segments[_]);
        }), i.addEventListener("sourceended", () => {
          this.video.pause();
        }), this.video.addEventListener("timeupdate", this.updatePosition), this.video.addEventListener("waiting", this.onWaiting);
        break;
    }
  }
  destroy() {
    var c;
    this.video.pause(), this.video.src = "", this.video.removeEventListener("timeupdate", this.updatePosition), this.video.removeEventListener("waiting", this.onWaiting), ((c = this.mediaSource) == null ? void 0 : c.readyState) === "open" && this.mediaSource.endOfStream(), this.urlSrouce && URL.revokeObjectURL(this.urlSrouce), this.softDecoder && this.softDecoder.dispose();
  }
  printSegments() {
    this.debug && console.table(this.segments.map((c) => ({
      state: c.state,
      virtualStartTime: c.virtualStartTime,
      virtualEndTime: c.virtualEndTime,
      duration: c.duration
    })));
  }
  checkBuffer() {
    if (!this.currentSegment)
      return;
    let c = "";
    for (let i = 0; i < this.video.buffered.length; i++) {
      const p = this.video.buffered.start(i).toFixed(2), h = this.video.buffered.end(i).toFixed(2);
      c += `[${p}-${h}] `;
    }
    if (this.debug && console.debug(
      `Time: ${this.video.currentTime.toFixed(2)}, Buffered: ${c}，BufferedLength: ${this.bufferedLength.toFixed(2)}`
    ), this.position >= this.currentSegment.virtualEndTime)
      if (this.segments.length > this.currentSegment.index + 1)
        this.bufferNext(), this.printSegments();
      else
        return;
  }
  async appendSegment(c) {
    if (this.softDecoder)
      await c.load2(this.softDecoder), this.printSegments();
    else
      return c.load(this.sourceBufferProxy).then(() => {
        this.printSegments();
      }).catch((i) => (this.softDecoder = new ki("", { yuvMode: !0 }), this.video.srcObject = this.softDecoder.canvas.captureStream(), this.video.addEventListener("play", () => {
        var p;
        (p = this.softDecoder) == null || p.start();
      }), this.video.addEventListener("pause", () => {
        var p;
        (p = this.softDecoder) == null || p.stop();
      }), this.video.addEventListener("ended", () => {
        var p;
        (p = this.softDecoder) == null || p.stop();
      }), this.video.addEventListener("waiting", () => {
        var p;
        (p = this.softDecoder) == null || p.stop();
      }), this.video.addEventListener("canplay", () => {
        this.video.play();
      }), this.appendSegment(c)));
  }
  get bufferedLength() {
    if (!this.currentSegment)
      return 0;
    let c = 0;
    for (let i = this.currentSegment.index; i < this.segments.length; i++)
      this.segments[i].state === "buffered" && (c += this.segments[i].duration);
    return c - (this.position - this.currentSegment.virtualStartTime);
  }
  bufferNext() {
    if (!this.currentSegment)
      return;
    this.currentSegment.unBuffer(), this.currentSegment = this.segments[this.currentSegment.index + 1];
    const c = this.segments[this.currentSegment.index + 1];
    c && this.appendSegment(c);
  }
  set currentTime(c) {
    this.softDecoder ? this._offset = c - this.video.currentTime : this.video.currentTime = c;
  }
  get currentTime() {
    return this.softDecoder ? this.video.currentTime + this._offset : this.video.currentTime;
  }
  async seek(c) {
    if (!this.currentSegment)
      return;
    const i = this.segments.find((w) => w.virtualEndTime > c);
    if (!i)
      return;
    const p = c - i.virtualStartTime, h = this.currentSegment.virtualEndTime - this.position, b = this.segments[i.index + 1];
    if (this.softDecoder)
      return this.segments.forEach((w) => {
        w.unBuffer();
      }), this.softDecoder.videoBuffer = [], this.softDecoder.audioBuffer = [], await i.load2(this.softDecoder), b && await this.appendSegment(b), this.offset = c - this.currentTime, this.position = c, this.currentSegment = i, this.softDecoder.seek(c), this.checkBuffer(), this.video.play();
    if (i.state === "buffered")
      return this.position = c, this.currentTime = c - this.offset, i.index === this.currentSegment.index + 1 && this.bufferNext(), this.video.play();
    this.segments.forEach((w) => {
      w.unBuffer();
    });
    const _ = this.video.buffered.start(0), C = this.video.buffered.end(this.video.buffered.length - 1);
    return await i.load(this.sourceBufferProxy), b && await this.appendSegment(b), this.printSegments(), this.currentTime += p + h + b.duration, this.offset = c - this.currentTime, this.position = c, await this.sourceBufferProxy.remove(_, C), this.currentSegment = i, this.checkBuffer(), this.video.play();
  }
}
class ti extends si {
  constructor() {
    super();
    // DOM references - using private fields instead of decorators
    O(this, "_video");
    O(this, "_timelineRef");
    O(this, "_progressRef");
    O(this, "_bufferRef");
    O(this, "_playerRef");
    // Internal state
    O(this, "timeline");
    O(this, "hideControlsTimeoutId", null);
    O(this, "playbackRates", [0.5, 1, 1.5, 2, 3, 4]);
    // Event handlers
    O(this, "updateTimelineUI", () => {
      var h;
      if (!this.timelineRef || !this.progressRef || !this.bufferRef || !this.timeline)
        return;
      this.currentPosition = this.timeline.position, this.totalDuration !== this.timeline.totalDuration && (this.totalDuration = this.timeline.totalDuration);
      const i = this.timeline.position / this.totalDuration * 100;
      this.progressRef.style.width = `${i}%`;
      const p = (this.timeline.bufferedLength + this.timeline.position) / this.totalDuration * 100;
      this.bufferRef.style.width = `${p}%`, this.dispatchEvent(new CustomEvent("timeupdate", {
        detail: this.timeline.position,
        bubbles: !0,
        composed: !0
      })), this.isPlaying = !((h = this.video) != null && h.paused);
    });
    O(this, "handleDrag", (i) => {
      if (!this.isDragging || !this.timelineRef || !this.timeline)
        return;
      const p = this.timelineRef.getBoundingClientRect(), h = (i.clientX - p.left) / p.width, b = Math.max(
        0,
        Math.min(h * this.totalDuration, this.totalDuration)
      );
      this.currentPosition = b;
      const _ = b / this.totalDuration * 100;
      this.progressRef && (this.progressRef.style.width = `${_}%`);
    });
    O(this, "stopDrag", (i) => {
      this.isDragging && (this.handleTimelineClick(i), document.removeEventListener("mousemove", this.handleDrag), document.removeEventListener("mouseup", this.stopDrag), this.isDragging = !1);
    });
    O(this, "handleKeyDown", (i) => {
      switch (i.key) {
        case " ":
        case "k":
          this.togglePlay(), i.preventDefault();
          break;
        case "ArrowRight":
          this.seekForward(), i.preventDefault();
          break;
        case "ArrowLeft":
          this.seekBackward(), i.preventDefault();
          break;
        case "f":
          this.toggleFullscreen(), i.preventDefault();
          break;
        case "m":
          this.toggleMute(), i.preventDefault();
          break;
      }
    });
    this.src = void 0, this.debug = !1, this.isDragging = !1, this.isHovering = !1, this.playbackRate = 1, this.isPlaying = !1, this.currentPosition = 0, this.totalDuration = 0, this.showControls = !1, this.volume = 1, this.isMuted = !1, this.showPlaybackRateMenu = !1, this.showVolumeSlider = !1, this.isFullscreen = !1, this.isVolumeDragging = !1, this.singleFmp4 = !1, this.isWideScreen = !0;
  }
  // Getters for DOM references
  get video() {
    return this._video || (this._video = this.renderRoot.querySelector("video")), this._video;
  }
  get timelineRef() {
    return this._timelineRef || (this._timelineRef = this.renderRoot.querySelector(".timeline")), this._timelineRef;
  }
  get progressRef() {
    return this._progressRef || (this._progressRef = this.renderRoot.querySelector(".timeline-progress")), this._progressRef;
  }
  get bufferRef() {
    return this._bufferRef || (this._bufferRef = this.renderRoot.querySelector(".timeline-buffer")), this._bufferRef;
  }
  get playerRef() {
    return this._playerRef || (this._playerRef = this.renderRoot.querySelector(".video-player")), this._playerRef;
  }
  // Lifecycle methods
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("keydown", this.handleKeyDown);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("keydown", this.handleKeyDown), this.timeline && this.timeline.destroy(), this.video && (this.video.removeEventListener("timeupdate", this.updateTimelineUI), this.video.removeEventListener("play", () => {
      this.isPlaying = !0;
    }), this.video.removeEventListener("pause", () => {
      this.isPlaying = !1;
    }));
  }
  firstUpdated() {
    this.video && (this.video.addEventListener("timeupdate", this.updateTimelineUI), this.video.addEventListener("play", () => {
      this.isPlaying = !0;
    }), this.video.addEventListener("pause", () => {
      this.isPlaying = !1;
    }), this.video.volume = this.volume), this.playerRef && (new ResizeObserver(() => {
      this.checkScreenWidth();
    }).observe(this.playerRef), this.checkScreenWidth()), this.src && this.setupTimeline();
  }
  updated(i) {
    i.has("src") && this.src && this.setupTimeline();
  }
  // Helper methods
  formatTime(i) {
    const p = Math.floor(i / 3600), h = Math.floor(i % 3600 / 60), b = Math.floor(i % 60);
    return p > 0 ? `${p.toString().padStart(2, "0")}:${h.toString().padStart(2, "0")}:${b.toString().padStart(2, "0")}` : `${h.toString().padStart(2, "0")}:${b.toString().padStart(2, "0")}`;
  }
  checkScreenWidth() {
    this.playerRef && (this.isWideScreen = this.playerRef.offsetWidth >= 400);
  }
  setupTimeline() {
    if (this.timeline && this.timeline.destroy(), !this.src || !this.video)
      return;
    const i = new Ai(this.video, { debug: this.debug });
    this.timeline = i, this.currentPosition = 0, this.totalDuration = 0, i.load(this.src).then(() => {
      this.singleFmp4 = i.singleFmp4, this.totalDuration = i.totalDuration, this.dispatchEvent(new CustomEvent("segments", {
        detail: i.segments,
        bubbles: !0,
        composed: !0
      }));
    });
  }
  handleTimelineClick(i) {
    if (!this.timelineRef || !this.timeline)
      return;
    const p = this.timelineRef.getBoundingClientRect(), b = (i.clientX - p.left) / p.width * this.totalDuration;
    this.timeline.seek(b), this.currentPosition = b;
  }
  startDrag(i) {
    this.isDragging = !0, this.handleDrag(i), document.addEventListener("mousemove", this.handleDrag), document.addEventListener("mouseup", this.stopDrag);
  }
  onTimelineMouseEnter() {
    this.isHovering = !0;
  }
  onTimelineMouseLeave() {
    this.isHovering = !1;
  }
  changePlaybackRate(i) {
    this.video && (this.playbackRate = i, this.video.playbackRate = i, this.showPlaybackRateMenu = !1);
  }
  togglePlaybackRateMenu() {
    this.showPlaybackRateMenu = !this.showPlaybackRateMenu;
  }
  togglePlay() {
    this.video && (this.video.paused ? (this.video.play(), this.isPlaying = !0) : (this.video.pause(), this.isPlaying = !1));
  }
  toggleMute() {
    this.video && (this.isMuted = !this.isMuted, this.video.muted = this.isMuted);
  }
  handleVolumeChange(i) {
    if (!this.video)
      return;
    const h = i.currentTarget.getBoundingClientRect();
    this.updateVolumeFromPosition(i.clientY, h);
  }
  updateVolumeFromPosition(i, p) {
    const h = p.height, b = 1 - Math.max(0, Math.min(1, (i - p.top) / h)), _ = Math.max(0, Math.min(1, b));
    this.volume = _, this.video && (this.video.volume = _, this.isMuted = _ === 0, this.video.muted = _ === 0);
  }
  startVolumeDrag(i) {
    i.preventDefault(), this.isVolumeDragging = !0;
    const h = i.currentTarget.getBoundingClientRect();
    this.updateVolumeFromPosition(i.clientY, h);
    const b = (C) => {
      this.isVolumeDragging && this.updateVolumeFromPosition(C.clientY, h);
    };
    document.addEventListener("mousemove", b);
    const _ = () => {
      this.isVolumeDragging = !1, document.removeEventListener("mousemove", b), document.removeEventListener("mouseup", _), setTimeout(() => {
        document.querySelector(".volume-control:hover") || (this.showVolumeSlider = !1);
      }, 500);
    };
    document.addEventListener("mouseup", _);
  }
  seekForward() {
    if (!this.timeline)
      return;
    const i = Math.min(this.timeline.position + 10, this.totalDuration);
    this.timeline.seek(i), this.currentPosition = i;
  }
  seekBackward() {
    if (!this.timeline)
      return;
    const i = Math.max(this.timeline.position - 10, 0);
    this.timeline.seek(i), this.currentPosition = i;
  }
  handleMouseEnter() {
    this.showControls = !0, this.hideControlsTimeoutId !== null && (window.clearTimeout(this.hideControlsTimeoutId), this.hideControlsTimeoutId = null);
  }
  handleMouseLeave() {
    this.isDragging || (this.hideControlsTimeoutId = window.setTimeout(() => {
      this.showControls = !1;
    }, 2e3));
  }
  handleMouseMove() {
    this.handleMouseEnter();
  }
  toggleFullscreen() {
    this.playerRef && (document.fullscreenElement ? document.exitFullscreen().then(() => {
      this.isFullscreen = !1;
    }).catch((i) => {
      console.error(`Error attempting to exit fullscreen: ${i.message}`);
    }) : this.playerRef.requestFullscreen().then(() => {
      this.isFullscreen = !0;
    }).catch((i) => {
      console.error(`Error attempting to enable fullscreen: ${i.message}`);
    }));
  }
  // Public methods
  seek(i) {
    this.timeline && (this.timeline.seek(i), this.currentPosition = i);
  }
  // Render methods
  render() {
    const i = this.formatTime(this.currentPosition), p = this.formatTime(this.totalDuration);
    return Xe`
      <div
        class="video-player"
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
        @mousemove=${this.handleMouseMove}
      >
        <!-- Video element -->
        <video @click=${this.togglePlay} .controls=${this.singleFmp4}></video>

        <!-- Custom timeline UI -->
        ${this.timeline && !this.singleFmp4 ? Xe`
          <div
            class="controls-overlay ${this.showControls || this.isDragging ? "show-controls" : ""}"
          >
            <!-- Timeline slider -->
            <div
              class="timeline ${this.isHovering ? "timeline-hover" : ""}"
              @click=${this.handleTimelineClick}
              @mouseenter=${this.onTimelineMouseEnter}
              @mouseleave=${this.onTimelineMouseLeave}
            >
              <div class="timeline-buffer"></div>
              <div class="timeline-progress"></div>
              <div
                class="timeline-handle ${this.isHovering || this.isDragging ? "timeline-handle-hover" : ""}"
                style="left: ${this.currentPosition / (this.totalDuration || 1) * 100}%"
                @mousedown=${(h) => {
      h.stopPropagation(), this.startDrag(h);
    }}
              ></div>
            </div>

            <!-- Controls -->
            <div class="controls-container">
              <!-- Left side controls -->
              <div class="controls-left">
                <!-- Play/Pause Button -->
                <button class="control-button" @click=${this.togglePlay}>
                  ${this.isPlaying ? Xe`<i class="icon-pause">▮▮</i>` : Xe`<i class="icon-play">▶</i>`}
                </button>

                <!-- Rewind Button - Only visible on wide screens -->
                ${this.isWideScreen ? Xe`
                  <button class="control-button" @click=${this.seekBackward}>
                    <i class="icon-backward">◀◀</i>
                  </button>
                ` : ""}

                <!-- Fast Forward Button - Only visible on wide screens -->
                ${this.isWideScreen ? Xe`
                  <button class="control-button" @click=${this.seekForward}>
                    <i class="icon-forward">▶▶</i>
                  </button>
                ` : ""}

                <!-- Current time display -->
                <div class="time-display">
                  ${i} / ${p}
                </div>
              </div>

              <!-- Right side controls -->
              <div class="controls-right">
                <!-- Playback rate control -->
                <div class="playback-rate-control">
                  <button
                    class="control-button playback-rate-button"
                    @click=${this.togglePlaybackRateMenu}
                  >
                    <span>${this.playbackRate}x</span>
                  </button>
                  ${this.showPlaybackRateMenu ? Xe`
                    <div class="playback-rate-menu">
                      ${this.playbackRates.map((h) => Xe`
                        <button
                          @click=${() => this.changePlaybackRate(h)}
                          class="playback-rate-option ${this.playbackRate === h ? "active" : ""}"
                        >
                          ${h}x
                        </button>
                      `)}
                    </div>
                  ` : ""}
                </div>

                <!-- Volume Control -->
                <div
                  class="volume-control"
                  @mouseenter=${() => this.showVolumeSlider = !0}
                  @mouseleave=${() => {
      this.isVolumeDragging || (this.showVolumeSlider = !1);
    }}
                >
                  <button class="control-button" @click=${this.toggleMute}>
                    ${this.isMuted || this.volume === 0 ? Xe`<i class="icon-volume-mute"></i>` : this.volume < 0.5 ? Xe`<i class="icon-volume-low"></i>` : Xe`<i class="icon-volume-high"></i>`}
                  </button>
                  ${this.showVolumeSlider ? Xe`
                    <div class="volume-slider-container">
                      <div
                        class="volume-slider"
                        @click=${this.handleVolumeChange}
                        @mousedown=${this.startVolumeDrag}
                      >
                        <div class="volume-slider-track"></div>
                        <div
                          class="volume-slider-fill"
                          style="height: ${this.volume * 100}%"
                        ></div>
                        <div
                          class="volume-slider-thumb"
                          style="bottom: ${this.volume * 100}%"
                        ></div>
                      </div>
                    </div>
                  ` : ""}
                </div>

                <!-- Fullscreen Button -->
                <button class="control-button" @click=${this.toggleFullscreen}>
                  ${this.isFullscreen ? Xe`<i class="icon-fullscreen-exit">⤓</i>` : Xe`<i class="icon-fullscreen">⤢</i>`}
                </button>
              </div>
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }
}
O(ti, "styles", ai`
    .video-player {
      position: relative;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 4px;
      background-color: #000;
    }

    video {
      width: 100%;
      display: block;
      cursor: pointer;
    }

    .controls-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px;
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0) 100%
      );
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(100%);
      z-index: 10;
    }

    .show-controls {
      opacity: 1;
      transform: translateY(0);
    }

    .controls-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
      color: white;
    }

    .controls-left,
    .controls-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .control-button {
      background: transparent;
      border: none;
      color: white;
      padding: 5px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      border-radius: 4px;
    }

    .control-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .bili-icon {
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .time-display {
      font-size: 12px;
      color: white;
    }

    .timeline {
      position: relative;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 1.5px;
      cursor: pointer;
      overflow: hidden;
      margin-bottom: 10px;
      transition: height 0.2s ease;
    }

    .timeline-hover {
      height: 5px;
    }

    .timeline-buffer {
      position: absolute;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.5);
      width: 0;
      pointer-events: none;
    }

    .timeline-progress {
      position: absolute;
      height: 100%;
      background-color: #fb7299;
      width: 0;
      pointer-events: none;
    }

    .timeline-handle {
      position: absolute;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      background: #fb7299;
      top: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      pointer-events: none;
      transition: transform 0.2s ease, height 0.2s ease, width 0.2s ease,
        box-shadow 0.2s ease;
    }

    .timeline-handle-hover {
      transform: translate(-50%, -50%) scale(1);
      height: 12px;
      width: 12px;
      box-shadow: 0 0 0 4px rgba(251, 114, 153, 0.2);
      cursor: grab;
      pointer-events: auto;
    }

    /* Playback Rate Control */
    .playback-rate-control {
      position: relative;
    }

    .playback-rate-menu {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 4px;
      padding: 5px;
      margin-bottom: 5px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      z-index: 100;
    }

    .playback-rate-option {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
      color: white;
      transition: all 0.2s;
      width: 100%;
      text-align: center;
    }

    .playback-rate-option:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .playback-rate-option.active {
      background-color: #fb7299;
      color: white;
      border-color: #fb7299;
    }

    /* Volume Control - Fixed vertical implementation */
    .volume-control {
      position: relative;
      z-index: 101; /* Ensure this is above other controls for mouseleave detection */
    }

    .volume-slider-container {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 4px;
      padding: 15px 10px;
      margin-bottom: 5px;
      z-index: 100;
    }

    /* Add a pseudo-element to bridge the gap between button and slider container */
    .volume-control:hover .volume-slider-container::after {
      content: "";
      position: absolute;
      bottom: -15px; /* Match margin-bottom of slider container */
      left: 0;
      width: 100%;
      height: 15px;
      background: transparent;
    }

    .volume-slider {
      position: relative;
      height: 80px;
      width: 10px;
      cursor: pointer;
      user-select: none;
    }

    .volume-slider-track {
      position: absolute;
      height: 100%;
      width: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      left: 3px;
    }

    .volume-slider-fill {
      position: absolute;
      width: 4px;
      background: #fb7299;
      border-radius: 2px;
      left: 3px;
      bottom: 0;
    }

    .volume-slider-thumb {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fb7299;
      left: -1px;
      transform: translateY(50%);
      cursor: pointer;
    }

    .icon-play,
    .icon-pause,
    .icon-forward,
    .icon-backward,
    .icon-volume-high,
    .icon-volume-low,
    .icon-volume-mute,
    .icon-fullscreen,
    .icon-fullscreen-exit {
      font-style: normal;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    /* Volume icon custom styles */
    .icon-volume-mute::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 20px;
      background: white;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z'/%3E%3C/svg%3E") no-repeat 50% 50%;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z'/%3E%3C/svg%3E") no-repeat 50% 50%;
    }

    .icon-volume-low::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 20px;
      background: white;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 9v6h4l5 5V4l-5 5H7z'/%3E%3C/svg%3E") no-repeat 50% 50%;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 9v6h4l5 5V4l-5 5H7z'/%3E%3C/svg%3E") no-repeat 50% 50%;
    }

    .icon-volume-high::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 20px;
      background: white;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E") no-repeat 50% 50%;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E") no-repeat 50% 50%;
    }

    /* Fullscreen styles */
    .video-player:fullscreen {
      width: 100%;
      max-width: none;
    }

    .video-player:fullscreen video {
      height: 100vh;
      object-fit: contain;
    }
  `), O(ti, "properties", {
  src: { type: String },
  debug: { type: Boolean },
  isDragging: { type: Boolean, state: !0 },
  isHovering: { type: Boolean, state: !0 },
  playbackRate: { type: Number, state: !0 },
  isPlaying: { type: Boolean, state: !0 },
  currentPosition: { type: Number, state: !0 },
  totalDuration: { type: Number, state: !0 },
  showControls: { type: Boolean, state: !0 },
  volume: { type: Number, state: !0 },
  isMuted: { type: Boolean, state: !0 },
  showPlaybackRateMenu: { type: Boolean, state: !0 },
  showVolumeSlider: { type: Boolean, state: !0 },
  isFullscreen: { type: Boolean, state: !0 },
  isVolumeDragging: { type: Boolean, state: !0 },
  singleFmp4: { type: Boolean, state: !0 },
  isWideScreen: { type: Boolean, state: !0 }
});
customElements.define("video-player", ti);
export {
  ti as VideoPlayer
};
