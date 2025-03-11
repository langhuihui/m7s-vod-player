/**
 * Fmp4Parser - A class to parse fragmented MP4 format with debug capabilities
 * 
 * This class provides functionality to parse and analyze fmp4 files, 
 * with an option to enable detailed debug information.
 */

export interface Box {
  type: string;
  size: number;
  start: number;
  end: number;
  data?: any;
  children?: Box[];
}

export interface Sample {
  duration?: number;
  size?: number;
  flags?: number;
  compositionTimeOffset?: number;
  dataStart: number; // start position of sample data
  dataEnd: number;   // end position of sample data
  data: Uint8Array;  // reference to the actual data
  keyFrame: boolean; // indicates if this is a key frame
}

export interface TrackRun {
  version: number;
  flags: number;
  sampleCount: number;
  dataOffset?: number;
  firstSampleFlags?: number;
  samples: Sample[];
}

export interface CodecInfo {
  codecString: string;
  mimeType: string;
  extraData?: Uint8Array;
}

export class Track {
  id: number;
  type: string;  // 'video' or 'audio'
  codec: string;
  timescale: number;
  duration: number;
  width?: number;    // for video
  height?: number;   // for video
  channelCount?: number;  // for audio
  sampleRate?: number;    // for audio
  language: string;
  samples: Sample[];
  codecInfo?: CodecInfo;

  constructor(id: number) {
    this.id = id;
    this.type = '';
    this.codec = '';
    this.timescale = 0;
    this.duration = 0;
    this.language = 'und';
    this.samples = [];
  }

  addSample(sample: Sample): void {
    this.samples.push(sample);
  }

  addSamples(samples: Sample[]): void {
    this.samples.push(...samples);
  }

  getSampleCount(): number {
    return this.samples.length;
  }

  getTotalDuration(): number {
    return this.samples.reduce((total, sample) => total + (sample.duration || 0), 0);
  }
}

export class Fmp4Parser {
  private debug: boolean;
  private readonly HEADER_SIZE = 8; // box header size in bytes
  private sourceUint8Array: Uint8Array | null = null;
  private tracks: Map<number, Track> = new Map();

  /**
   * Create a new Fmp4Parser instance
   * @param debug Whether to enable debug output
   */
  constructor(debug = false) {
    this.debug = debug;
  }

  /**
   * Set debug mode
   * @param debug Whether to enable debug output
   */
  setDebug(debug: boolean): void {
    this.debug = debug;
  }

  /**
   * Parse an fmp4 buffer
   * @param buffer ArrayBuffer containing fmp4 data
   * @returns Array of tracks
   */
  parse(buffer: ArrayBuffer): Track[] {
    // Store reference to source buffer for sample extraction
    this.sourceUint8Array = new Uint8Array(buffer);

    // Clear tracks
    this.tracks.clear();

    const boxes: Box[] = [];
    let offset = 0;

    while (offset < buffer.byteLength) {
      const box = this.parseBox(buffer, offset);
      if (!box) break;

      boxes.push(box);
      offset = box.end;

      if (this.debug) {
        this.logBox(box);
      }
    }

    // Process track information
    this.processTrackInfo(boxes);

    // Process samples for all trun boxes
    this.processSampleData(boxes);

    // Generate codec strings
    this.processCodecInfo(boxes);

    return Array.from(this.tracks.values());
  }

  /**
   * Process track information from moov box
   */
  private processTrackInfo(boxes: Box[]): void {
    const moovBox = boxes.find(box => box.type === 'moov');
    if (!moovBox?.children) return;

    // Process each track
    const trakBoxes = moovBox.children.filter(box => box.type === 'trak');
    for (const trakBox of trakBoxes) {
      if (!trakBox.children) continue;

      // Get track ID from tkhd
      const tkhdBox = this.findBox(trakBox, 'tkhd');
      if (!tkhdBox?.data) continue;

      const trackId = tkhdBox.data.trackID;
      const track = new Track(trackId);

      // Get media info from mdia
      const mdiaBox = this.findBox(trakBox, 'mdia');
      if (!mdiaBox?.children) continue;

      // Get handler type
      const hdlrBox = this.findBox(mdiaBox, 'hdlr');
      if (hdlrBox?.data) {
        track.type = hdlrBox.data.handlerType === 'vide' ? 'video' :
          hdlrBox.data.handlerType === 'soun' ? 'audio' :
            'unknown';
      }

      // Get media header info
      const mdhdBox = this.findBox(mdiaBox, 'mdhd');
      if (mdhdBox?.data) {
        track.timescale = mdhdBox.data.timescale;
        track.duration = Number(mdhdBox.data.duration);
        track.language = mdhdBox.data.language;
      }

      // Get sample descriptions
      const stsdBox = this.findBox(trakBox, 'stsd');
      if (stsdBox?.data?.entries?.[0]) {
        const entry = stsdBox.data.entries[0];
        if (entry.data) {
          if (track.type === 'video') {
            track.width = entry.data.width;
            track.height = entry.data.height;
          } else if (track.type === 'audio') {
            track.channelCount = entry.data.channelCount;
            track.sampleRate = entry.data.sampleRate;
          }
        }
      }

      this.tracks.set(trackId, track);
    }
  }

  /**
   * Process codec information for all tracks
   */
  private processCodecInfo(boxes: Box[]): void {
    const codecInfos = this.generateCodecStrings(boxes);

    // Match codec info with tracks based on type
    for (const track of this.tracks.values()) {
      const codecInfo = codecInfos.find(info =>
        (track.type === 'video' && info.mimeType === 'video/mp4') ||
        (track.type === 'audio' && info.mimeType === 'audio/mp4')
      );

      if (codecInfo) {
        track.codecInfo = codecInfo;
        track.codec = codecInfo.codecString;
      }
    }
  }

  /**
   * Find a box of specific type within a parent box
   */
  private findBox(parentBox: Box, type: string): Box | undefined {
    if (!parentBox.children) return undefined;
    return parentBox.children.find(box => box.type === type);
  }

  /**
   * Process sample data for all trun boxes
   */
  private processSampleData(boxes: Box[]): void {
    // Find all moof and mdat boxes at the top level
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].type === 'moof' && i + 1 < boxes.length && boxes[i + 1].type === 'mdat') {
        const moofBox = boxes[i];
        const mdatBox = boxes[i + 1];

        // Find traf boxes inside moof
        if (moofBox.children) {
          for (const child of moofBox.children) {
            if (child.type === 'traf') {
              this.processTrafBox(child, moofBox.start, mdatBox);
            }
          }
        }
      }
    }
  }

  /**
   * Process a traf box to extract sample data
   */
  private processTrafBox(trafBox: Box, moofStart: number, mdatBox: Box): void {
    if (!trafBox.children) return;

    let tfhdBox: Box | null = null;
    let trunBox: Box | null = null;

    // Find tfhd and trun boxes
    for (const child of trafBox.children) {
      if (child.type === 'tfhd') {
        tfhdBox = child;
      } else if (child.type === 'trun') {
        trunBox = child;
      }
    }

    if (!tfhdBox?.data || !trunBox?.data) return;

    const trackId = tfhdBox.data.trackID;
    const track = this.tracks.get(trackId);
    if (!track) return;

    // Process trun data as before
    const trunData = trunBox.data as TrackRun;
    if (!trunData.samples || trunData.dataOffset === undefined) return;

    // Calculate absolute data offset from moof start
    const absoluteDataOffset = moofStart + trunData.dataOffset;

    // Data begins at absoluteDataOffset (usually points to beginning of mdat data area)
    if (absoluteDataOffset < mdatBox.start + this.HEADER_SIZE || absoluteDataOffset >= mdatBox.end) {
      if (this.debug) {
        console.warn(`Data offset ${absoluteDataOffset} is outside mdat box range`);
      }
      return;
    }

    // Calculate offsets for each sample
    let currentOffset = absoluteDataOffset;

    for (const sample of trunData.samples) {
      const sampleSize = sample.size || tfhdBox.data.defaultSampleSize || 0;
      if (sampleSize <= 0) continue;

      const dataStart = currentOffset;
      const dataEnd = dataStart + sampleSize;

      if (dataEnd <= mdatBox.end && this.sourceUint8Array) {
        sample.dataStart = dataStart;
        sample.dataEnd = dataEnd;
        sample.data = this.sourceUint8Array.subarray(dataStart, dataEnd);
        track.addSample(sample);
      }

      currentOffset += sampleSize;
    }
  }

  /**
   * Parse a single box from the buffer
   * @param buffer ArrayBuffer containing fmp4 data
   * @param offset Offset to start parsing from
   * @returns Parsed box or null if the buffer is too small
   */
  private parseBox(buffer: ArrayBuffer, offset: number): Box | null {
    // Ensure we have enough bytes for the header
    if (offset + this.HEADER_SIZE > buffer.byteLength) {
      return null;
    }

    const dataView = new DataView(buffer);

    // Parse box size and type
    const size = dataView.getUint32(offset, false);
    const typeBytes = new Uint8Array(buffer, offset + 4, 4);
    const type = String.fromCharCode(...typeBytes);

    // Calculate box end position
    const start = offset;
    const end = offset + size;

    // Create box object
    const box: Box = {
      type,
      size,
      start,
      end
    };

    // Parse box data based on type
    if (this.isContainerBox(type)) {
      box.children = this.parseChildren(buffer, offset + this.HEADER_SIZE, end);
    } else {
      box.data = this.parseBoxData(buffer, type, offset + this.HEADER_SIZE, end);
    }

    return box;
  }

  /**
   * Parse children boxes within a container box
   * @param buffer ArrayBuffer containing fmp4 data
   * @param offset Start offset for children
   * @param end End offset for children
   * @returns Array of child boxes
   */
  private parseChildren(buffer: ArrayBuffer, offset: number, end: number): Box[] {
    const children: Box[] = [];
    let currentOffset = offset;

    while (currentOffset < end) {
      const childBox = this.parseBox(buffer, currentOffset);
      if (!childBox) break;

      children.push(childBox);
      currentOffset = childBox.end;
    }

    return children;
  }

  /**
   * Parse box data based on box type
   */
  private parseBoxData(buffer: ArrayBuffer, type: string, offset: number, end: number): any {
    const dataView = new DataView(buffer);
    const dataSize = end - offset;

    // Return null for empty data
    if (dataSize <= 0) return null;

    // Parse box data based on box type
    switch (type) {
      case 'ftyp':
        return this.parseFtypBox(buffer, offset, end);
      case 'mvhd':
        return this.parseMvhdBox(buffer, offset, end);
      case 'mdhd':
        return this.parseMdhdBox(buffer, offset, end);
      case 'hdlr':
        return this.parseHdlrBox(buffer, offset, end);
      case 'tkhd':
        return this.parseTkhdBox(buffer, offset, end);
      case 'elst':
        return this.parseElstBox(buffer, offset, end);
      case 'moof':
      case 'mfhd':
        return this.parseMfhdBox(buffer, offset, end);
      case 'tfhd':
        return this.parseTfhdBox(buffer, offset, end);
      case 'tfdt':
        return this.parseTfdtBox(buffer, offset, end);
      case 'trun':
        return this.parseTrunBox(buffer, offset, end);
      case 'mdat':
        return this.parseMdatBox(buffer, offset, end);
      case 'stsd':
        return this.parseStsdBox(buffer, offset, end);
      case 'avc1':
      case 'avc3':
        return this.parseAvcBox(buffer, offset, end);
      case 'hev1':
      case 'hvc1':
        return this.parseHevcBox(buffer, offset, end);
      case 'mp4a':
        return this.parseMp4aBox(buffer, offset, end);
      case 'avcC':
        return this.parseAvcCBox(buffer, offset, end);
      case 'hvcC':
        return this.parseHvcCBox(buffer, offset, end);
      case 'esds':
        return this.parseEsdsBox(buffer, offset, end);
      default:
        // For unimplemented box types, return a copy of the raw data
        return new Uint8Array(buffer.slice(offset, end));
    }
  }

  /**
   * Parse 'mdat' box data
   */
  private parseMdatBox(buffer: ArrayBuffer, offset: number, end: number): any {
    // For mdat box, we don't parse the data immediately, as it's typically large
    // We'll extract the sample data when processing the trun box
    // Just return basic info about the box
    const dataSize = end - offset;

    return {
      dataSize,
      dataOffset: offset
    };
  }

  /**
   * Check if a box is a container box
   * @param type Box type
   * @returns True if the box is a container box
   */
  private isContainerBox(type: string): boolean {
    const containerBoxes = [
      'moov', 'trak', 'edts', 'mdia', 'minf', 'dinf', 'stbl', 'mvex',
      'moof', 'traf', 'mfra', 'skip', 'meta', 'ipro', 'sinf'
    ];
    return containerBoxes.includes(type);
  }

  /**
   * Parse 'ftyp' box data
   */
  private parseFtypBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);
    const majorBrand = this.readFourCC(buffer, offset);
    const minorVersion = dataView.getUint32(offset + 4, false);

    const compatibleBrands: string[] = [];
    for (let i = offset + 8; i < end; i += 4) {
      compatibleBrands.push(this.readFourCC(buffer, i));
    }

    return {
      majorBrand,
      minorVersion,
      compatibleBrands
    };
  }

  /**
   * Parse 'mvhd' box data
   */
  private parseMvhdBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);
    const version = dataView.getUint8(offset);
    const flags = (dataView.getUint8(offset + 1) << 16) |
      (dataView.getUint8(offset + 2) << 8) |
      dataView.getUint8(offset + 3);

    let creationTime, modificationTime, timescale, duration;
    let nextOffset;

    if (version === 1) {
      creationTime = dataView.getBigUint64(offset + 4, false);
      modificationTime = dataView.getBigUint64(offset + 12, false);
      timescale = dataView.getUint32(offset + 20, false);
      duration = dataView.getBigUint64(offset + 24, false);
      nextOffset = offset + 32;
    } else {
      creationTime = dataView.getUint32(offset + 4, false);
      modificationTime = dataView.getUint32(offset + 8, false);
      timescale = dataView.getUint32(offset + 12, false);
      duration = dataView.getUint32(offset + 16, false);
      nextOffset = offset + 20;
    }

    return {
      version,
      flags,
      creationTime,
      modificationTime,
      timescale,
      duration
    };
  }

  /**
   * Parse 'mdhd' box data
   */
  private parseMdhdBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);
    const version = dataView.getUint8(offset);
    const flags = (dataView.getUint8(offset + 1) << 16) |
      (dataView.getUint8(offset + 2) << 8) |
      dataView.getUint8(offset + 3);

    let creationTime, modificationTime, timescale, duration, language;

    if (version === 1) {
      creationTime = dataView.getBigUint64(offset + 4, false);
      modificationTime = dataView.getBigUint64(offset + 12, false);
      timescale = dataView.getUint32(offset + 20, false);
      duration = dataView.getBigUint64(offset + 24, false);
      language = this.parseLanguage(dataView.getUint16(offset + 32, false));
    } else {
      creationTime = dataView.getUint32(offset + 4, false);
      modificationTime = dataView.getUint32(offset + 8, false);
      timescale = dataView.getUint32(offset + 12, false);
      duration = dataView.getUint32(offset + 16, false);
      language = this.parseLanguage(dataView.getUint16(offset + 20, false));
    }

    return {
      version,
      flags,
      creationTime,
      modificationTime,
      timescale,
      duration,
      language
    };
  }

  /**
   * Parse 'hdlr' box data
   */
  private parseHdlrBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);
    const version = dataView.getUint8(offset);
    const flags = (dataView.getUint8(offset + 1) << 16) |
      (dataView.getUint8(offset + 2) << 8) |
      dataView.getUint8(offset + 3);

    const handlerType = this.readFourCC(buffer, offset + 8);

    // Try to extract name (null-terminated string)
    let name = '';
    let nameOffset = offset + 24;
    while (nameOffset < end) {
      const char = dataView.getUint8(nameOffset);
      if (char === 0) break;
      name += String.fromCharCode(char);
      nameOffset++;
    }

    return {
      version,
      flags,
      handlerType,
      name
    };
  }

  /**
   * Parse 'tkhd' box data
   */
  private parseTkhdBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);
    const version = dataView.getUint8(offset);
    const flags = (dataView.getUint8(offset + 1) << 16) |
      (dataView.getUint8(offset + 2) << 8) |
      dataView.getUint8(offset + 3);

    let creationTime, modificationTime, trackID, duration;
    let nextOffset;

    if (version === 1) {
      creationTime = dataView.getBigUint64(offset + 4, false);
      modificationTime = dataView.getBigUint64(offset + 12, false);
      trackID = dataView.getUint32(offset + 20, false);
      // 4 bytes reserved
      duration = dataView.getBigUint64(offset + 28, false);
      nextOffset = offset + 36;
    } else {
      creationTime = dataView.getUint32(offset + 4, false);
      modificationTime = dataView.getUint32(offset + 8, false);
      trackID = dataView.getUint32(offset + 12, false);
      // 4 bytes reserved
      duration = dataView.getUint32(offset + 20, false);
      nextOffset = offset + 24;
    }

    return {
      version,
      flags,
      creationTime,
      modificationTime,
      trackID,
      duration,
      enabled: (flags & 0x000001) !== 0,
      inMovie: (flags & 0x000002) !== 0,
      inPreview: (flags & 0x000004) !== 0
    };
  }

  /**
   * Parse 'elst' box data
   */
  private parseElstBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);
    const version = dataView.getUint8(offset);
    const flags = (dataView.getUint8(offset + 1) << 16) |
      (dataView.getUint8(offset + 2) << 8) |
      dataView.getUint8(offset + 3);

    const entryCount = dataView.getUint32(offset + 4, false);
    const entries = [];

    let entryOffset = offset + 8;
    for (let i = 0; i < entryCount; i++) {
      if (version === 1) {
        const segmentDuration = dataView.getBigUint64(entryOffset, false);
        const mediaTime = dataView.getBigInt64(entryOffset + 8, false);
        const mediaRateInteger = dataView.getInt16(entryOffset + 16, false);
        const mediaRateFraction = dataView.getInt16(entryOffset + 18, false);

        entries.push({
          segmentDuration,
          mediaTime,
          mediaRateInteger,
          mediaRateFraction
        });

        entryOffset += 20;
      } else {
        const segmentDuration = dataView.getUint32(entryOffset, false);
        const mediaTime = dataView.getInt32(entryOffset + 4, false);
        const mediaRateInteger = dataView.getInt16(entryOffset + 8, false);
        const mediaRateFraction = dataView.getInt16(entryOffset + 10, false);

        entries.push({
          segmentDuration,
          mediaTime,
          mediaRateInteger,
          mediaRateFraction
        });

        entryOffset += 12;
      }
    }

    return {
      version,
      flags,
      entries
    };
  }

  /**
   * Parse 'mfhd' box data
   */
  private parseMfhdBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);
    const version = dataView.getUint8(offset);
    const flags = (dataView.getUint8(offset + 1) << 16) |
      (dataView.getUint8(offset + 2) << 8) |
      dataView.getUint8(offset + 3);

    const sequenceNumber = dataView.getUint32(offset + 4, false);

    return {
      version,
      flags,
      sequenceNumber
    };
  }

  /**
   * Parse 'tfhd' box data
   */
  private parseTfhdBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);
    const version = dataView.getUint8(offset);
    const flags = (dataView.getUint8(offset + 1) << 16) |
      (dataView.getUint8(offset + 2) << 8) |
      dataView.getUint8(offset + 3);

    const trackID = dataView.getUint32(offset + 4, false);
    let currentOffset = offset + 8;
    const result: any = {
      version,
      flags,
      trackID
    };

    // Parse optional fields based on flags
    if (flags & 0x000001) { // base-data-offset-present
      result.baseDataOffset = dataView.getBigUint64(currentOffset, false);
      currentOffset += 8;
    }

    if (flags & 0x000002) { // sample-description-index-present
      result.sampleDescriptionIndex = dataView.getUint32(currentOffset, false);
      currentOffset += 4;
    }

    if (flags & 0x000008) { // default-sample-duration-present
      result.defaultSampleDuration = dataView.getUint32(currentOffset, false);
      currentOffset += 4;
    }

    if (flags & 0x000010) { // default-sample-size-present
      result.defaultSampleSize = dataView.getUint32(currentOffset, false);
      currentOffset += 4;
    }

    if (flags & 0x000020) { // default-sample-flags-present
      result.defaultSampleFlags = dataView.getUint32(currentOffset, false);
    }

    return result;
  }

  /**
   * Parse 'tfdt' box data
   */
  private parseTfdtBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);
    const version = dataView.getUint8(offset);
    const flags = (dataView.getUint8(offset + 1) << 16) |
      (dataView.getUint8(offset + 2) << 8) |
      dataView.getUint8(offset + 3);

    let baseMediaDecodeTime;
    if (version === 1) {
      baseMediaDecodeTime = dataView.getBigUint64(offset + 4, false);
    } else {
      baseMediaDecodeTime = dataView.getUint32(offset + 4, false);
    }

    return {
      version,
      flags,
      baseMediaDecodeTime
    };
  }

  /**
   * Parse 'trun' box data
   */
  private parseTrunBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);
    const version = dataView.getUint8(offset);
    const flags = (dataView.getUint8(offset + 1) << 16) |
      (dataView.getUint8(offset + 2) << 8) |
      dataView.getUint8(offset + 3);

    const sampleCount = dataView.getUint32(offset + 4, false);
    let currentOffset = offset + 8;
    const result: TrackRun = {
      version,
      flags,
      sampleCount,
      samples: []
    };

    // Parse optional fields based on flags
    if (flags & 0x000001) { // data-offset-present
      result.dataOffset = dataView.getInt32(currentOffset, false);
      currentOffset += 4;
    }

    if (flags & 0x000004) { // first-sample-flags-present
      result.firstSampleFlags = dataView.getUint32(currentOffset, false);
      currentOffset += 4;
    }

    // Parse sample information
    const samples: Sample[] = [];
    for (let i = 0; i < sampleCount; i++) {
      const sample: Sample = {
        dataStart: 0,
        dataEnd: 0,
        data: new Uint8Array(0),  // Placeholder, will be set later
        keyFrame: true // Default to true, will be updated based on flags
      };

      if (flags & 0x000100) { // sample-duration-present
        sample.duration = dataView.getUint32(currentOffset, false);
        currentOffset += 4;
      }

      if (flags & 0x000200) { // sample-size-present
        sample.size = dataView.getUint32(currentOffset, false);
        currentOffset += 4;
      }

      if (flags & 0x000400) { // sample-flags-present
        sample.flags = dataView.getUint32(currentOffset, false);
        // Check if this is a key frame based on sample_depends_on field
        // sample_depends_on is bits 24-25 of the sample flags
        // 2 means this sample does not depend on others (key frame)
        const sampleDependsOn = (sample.flags >> 24) & 0x03;
        sample.keyFrame = sampleDependsOn === 2;
        currentOffset += 4;
      } else if (i === 0 && result.firstSampleFlags !== undefined) {
        // Use first-sample-flags for the first sample if present
        const sampleDependsOn = (result.firstSampleFlags >> 24) & 0x03;
        sample.keyFrame = sampleDependsOn === 2;
      }

      if (flags & 0x000800) { // sample-composition-time-offsets-present
        if (version === 0) {
          sample.compositionTimeOffset = dataView.getUint32(currentOffset, false);
        } else {
          sample.compositionTimeOffset = dataView.getInt32(currentOffset, false);
        }
        currentOffset += 4;
      }

      samples.push(sample);
    }

    result.samples = samples;

    return result;
  }

  /**
   * Parse language code
   * @param value 16-bit language code
   * @returns ISO language code
   */
  private parseLanguage(value: number): string {
    // Language is stored as an ISO-639-2/T code in an unusual format
    // Each character is stored as the difference between its ASCII value and 0x60
    const char1 = String.fromCharCode(((value >> 10) & 0x1F) + 0x60);
    const char2 = String.fromCharCode(((value >> 5) & 0x1F) + 0x60);
    const char3 = String.fromCharCode((value & 0x1F) + 0x60);
    return char1 + char2 + char3;
  }

  /**
   * Read a 4-character code from the buffer
   * @param buffer ArrayBuffer containing data
   * @param offset Offset to read from
   * @returns 4-character code as string
   */
  private readFourCC(buffer: ArrayBuffer, offset: number): string {
    const bytes = new Uint8Array(buffer, offset, 4);
    return String.fromCharCode(...bytes);
  }

  /**
   * Log box information in debug mode
   * @param box Box to log
   * @param depth Nesting depth for indentation
   */
  private logBox(box: Box, depth = 0): void {
    if (!this.debug) return;

    const indent = '  '.repeat(depth);
    console.log(`${indent}Box: ${box.type}, Size: ${box.size}, Range: ${box.start}-${box.end}`);

    if (box.data) {
      console.log(`${indent}  Data:`, box.data);
    }

    if (box.children && box.children.length > 0) {
      console.log(`${indent}  Children (${box.children.length}):`);
      for (const child of box.children) {
        this.logBox(child, depth + 2);
      }
    }
  }

  /**
   * Utility method to pretty print a box structure
   * @param boxes Parsed box structure
   * @returns Formatted string representation
   */
  printBoxes(boxes: Box[]): string {
    let result = 'FMP4 Structure:\n';

    const printBox = (box: Box, depth = 0): void => {
      const indent = '  '.repeat(depth);
      result += `${indent}${box.type} (${box.size} bytes)\n`;

      if (box.data) {
        const dataStr = JSON.stringify(box.data, (key, value) => {
          // Handle BigInt values in the JSON output
          if (typeof value === 'bigint') {
            return value.toString();
          }
          // Don't include the actual sample data in the output
          if (key === 'data' && value instanceof Uint8Array) {
            return `Uint8Array(${value.byteLength} bytes)`;
          }
          return value;
        }, 2);
        result += `${indent}  Data: ${dataStr}\n`;
      }

      if (box.children && box.children.length > 0) {
        for (const child of box.children) {
          printBox(child, depth + 1);
        }
      }
    };

    for (const box of boxes) {
      printBox(box);
    }

    return result;
  }

  /**
   * Get all samples for a specific track
   * @param boxes Parsed box structure
   * @param trackId Track ID to find samples for (optional)
   * @returns Array of samples
   */
  getSamples(boxes: Box[], trackId?: number): Sample[] {
    const samples: Sample[] = [];

    // Find all moof boxes
    this.findBoxes(boxes, 'moof').forEach(moofBox => {
      if (!moofBox.children) return;

      // Find traf boxes within moof
      moofBox.children.filter(box => box.type === 'traf').forEach(trafBox => {
        if (!trafBox.children) return;

        // Get track ID from tfhd
        const tfhdBox = trafBox.children.find(box => box.type === 'tfhd');
        if (!tfhdBox || !tfhdBox.data) return;

        // Skip if trackId is specified and doesn't match
        if (trackId !== undefined && tfhdBox.data.trackID !== trackId) return;

        // Find trun boxes
        const trunBoxes = trafBox.children.filter(box => box.type === 'trun');

        trunBoxes.forEach(trunBox => {
          if (!trunBox.data || !trunBox.data.samples) return;

          // Add all samples from this trun
          trunBox.data.samples.forEach((sample: Sample) => {
            if (sample.data && sample.data.byteLength > 0) {
              samples.push(sample);
            }
          });
        });
      });
    });

    return samples;
  }

  /**
   * Find all boxes of a specific type
   * @param boxes Array of boxes to search
   * @param type Box type to find
   * @returns Array of matching boxes
   */
  findBoxes(boxes: Box[], type: string): Box[] {
    const result: Box[] = [];

    const searchBoxes = (boxArray: Box[]) => {
      for (const box of boxArray) {
        if (box.type === type) {
          result.push(box);
        }

        if (box.children && box.children.length > 0) {
          searchBoxes(box.children);
        }
      }
    };

    searchBoxes(boxes);
    return result;
  }

  /**
   * Parse 'stsd' box data (Sample Description Box)
   */
  private parseStsdBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);

    // Parse version and flags
    const version = dataView.getUint8(offset);
    const flags = (dataView.getUint8(offset + 1) << 16) |
      (dataView.getUint8(offset + 2) << 8) |
      dataView.getUint8(offset + 3);

    // Get entry count
    const entryCount = dataView.getUint32(offset + 4, false);

    // Move offset past header and entry count
    let currentOffset = offset + 8;

    // Parse each sample description entry
    const entries = [];
    for (let i = 0; i < entryCount && currentOffset < end; i++) {
      // Get entry size and type
      const entrySize = dataView.getUint32(currentOffset, false);
      const entryType = this.readFourCC(buffer, currentOffset + 4);

      // Parse entry based on its type
      let entryData;
      switch (entryType) {
        case 'avc1':
        case 'avc3':
          entryData = this.parseAvcBox(buffer, currentOffset + 8, currentOffset + entrySize);
          // Parse avcC box if present
          if (currentOffset + entrySize > currentOffset + 8 + 78) { // 78 is minimum size of avc1 box
            const avcCBox = this.parseBox(buffer, currentOffset + 8 + 78);
            if (avcCBox && avcCBox.type === 'avcC') {
              entryData.avcC = avcCBox.data;
            }
          }
          break;

        case 'hev1':
        case 'hvc1':
          entryData = this.parseHevcBox(buffer, currentOffset + 8, currentOffset + entrySize);
          // Parse hvcC box if present
          if (currentOffset + entrySize > currentOffset + 8 + 78) {
            const hvcCBox = this.parseBox(buffer, currentOffset + 8 + 78);
            if (hvcCBox && hvcCBox.type === 'hvcC') {
              entryData.hvcC = hvcCBox.data;
            }
          }
          break;

        case 'mp4a':
          entryData = this.parseMp4aBox(buffer, currentOffset + 8, currentOffset + entrySize);
          // Parse esds box if present
          if (currentOffset + entrySize > currentOffset + 8 + 28) { // 28 is minimum size of mp4a box
            const esdsBox = this.parseBox(buffer, currentOffset + 8 + 28);
            if (esdsBox && esdsBox.type === 'esds') {
              entryData.esds = esdsBox.data;
            }
          }
          break;

        default:
          // For unknown types, store raw data
          entryData = new Uint8Array(buffer.slice(currentOffset + 8, currentOffset + entrySize));
      }

      entries.push({
        size: entrySize,
        type: entryType,
        data: entryData
      });

      currentOffset += entrySize;
    }

    return {
      version,
      flags,
      entryCount,
      entries
    };
  }

  /**
   * Parse AVC Sample Entry box (avc1, avc3)
   */
  private parseAvcBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);

    // Skip 6 bytes of reserved data
    offset += 6;

    // Parse data reference index
    const dataReferenceIndex = dataView.getUint16(offset, false);
    offset += 2;

    // Skip pre-defined and reserved data (16 bytes)
    offset += 16;

    // Parse visual properties
    const width = dataView.getUint16(offset, false);
    const height = dataView.getUint16(offset + 2, false);
    const horizresolution = dataView.getUint32(offset + 4, false);
    const vertresolution = dataView.getUint32(offset + 8, false);
    offset += 12;

    // Skip 4 bytes reserved
    offset += 4;

    // Frame count and compressor name
    const frameCount = dataView.getUint16(offset, false);
    offset += 2;

    // Compressor name is a 32-byte Pascal string
    const compressorNameLength = dataView.getUint8(offset);
    const compressorName = this.readString(buffer, offset + 1, compressorNameLength);
    offset += 32;

    // Depth and pre-defined
    const depth = dataView.getUint16(offset, false);
    const preDefined = dataView.getInt16(offset + 2, false);

    return {
      dataReferenceIndex,
      width,
      height,
      horizresolution,
      vertresolution,
      frameCount,
      compressorName,
      depth,
      preDefined
    };
  }

  /**
   * Parse HEVC Sample Entry box (hev1, hvc1)
   */
  private parseHevcBox(buffer: ArrayBuffer, offset: number, end: number): any {
    // HEVC sample entry has the same structure as AVC
    return this.parseAvcBox(buffer, offset, end);
  }

  /**
   * Parse MP4 Audio Sample Entry box (mp4a)
   */
  private parseMp4aBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);

    // Skip 6 bytes of reserved data
    offset += 6;

    // Parse data reference index
    const dataReferenceIndex = dataView.getUint16(offset, false);
    offset += 2;

    // Skip pre-defined and reserved data (8 bytes)
    offset += 8;

    // Parse audio properties
    const channelCount = dataView.getUint16(offset, false);
    const sampleSize = dataView.getUint16(offset + 2, false);
    offset += 4;

    // Skip pre-defined and reserved
    offset += 4;

    // Sample rate is fixed point 16.16
    const sampleRate = dataView.getUint32(offset, false) >> 16;

    return {
      dataReferenceIndex,
      channelCount,
      sampleSize,
      sampleRate
    };
  }

  /**
   * Read a string from the buffer
   */
  private readString(buffer: ArrayBuffer, offset: number, length: number): string {
    const bytes = new Uint8Array(buffer, offset, length);
    return String.fromCharCode(...bytes).replace(/\0+$/, ''); // Remove trailing nulls
  }

  /**
   * Parse 'avcC' box data
   */
  private parseAvcCBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);

    return {
      data: new Uint8Array(buffer, offset, end - offset),
      configurationVersion: dataView.getUint8(offset),
      profileIndication: dataView.getUint8(offset + 1),
      profileCompatibility: dataView.getUint8(offset + 2),
      levelIndication: dataView.getUint8(offset + 3),
      // There are more fields but we only need these for the codec string
    };
  }

  /**
   * Parse 'hvcC' box data
   */
  private parseHvcCBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);
    const data = new Uint8Array(buffer, offset, end - offset);
    return {
      data,
      configurationVersion: dataView.getUint8(offset),
      generalProfileSpace: (dataView.getUint8(offset + 1) >> 6) & 0x03,
      generalTierFlag: (dataView.getUint8(offset + 1) >> 5) & 0x01,
      generalProfileIdc: dataView.getUint8(offset + 1) & 0x1F,
      generalProfileCompatibilityFlags: dataView.getUint32(offset + 2, false),
      generalConstraintIndicatorFlags: new DataView(buffer, offset + 6, 6),
      generalLevelIdc: dataView.getUint8(offset + 12),
      minSpatialSegmentationIdc: dataView.getUint16(offset + 13, false) & 0x0FFF,
      parallelismType: dataView.getUint8(offset + 15) & 0x03
      // There are more fields but we only need these for the codec string
    };
  }

  /**
   * Parse 'esds' box data
   */
  private parseEsdsBox(buffer: ArrayBuffer, offset: number, end: number): any {
    const dataView = new DataView(buffer);

    // Skip version and flags
    offset += 4;

    // Parse ES_Descriptor
    if (dataView.getUint8(offset) === 0x03) { // ES_DescrTag
      const esLength = this.parseExpandableLength(buffer, offset + 1);
      offset += 1 + esLength.bytesRead;

      // Skip ES_ID and streamDependenceFlag, URL_Flag, OCRstreamFlag
      offset += 3;

      // Parse DecoderConfigDescriptor
      if (dataView.getUint8(offset) === 0x04) { // DecoderConfigDescrTag
        const dcLength = this.parseExpandableLength(buffer, offset + 1);
        offset += 1 + dcLength.bytesRead;
        const decoderConfig = {
          objectTypeIndication: (dataView.getUint8(offset) >> 6) + 1,
          streamType: (dataView.getUint8(offset + 1) >> 2) & 0x3F,
          bufferSizeDB: (dataView.getUint8(offset + 1) & 0x03) << 16 |
            dataView.getUint8(offset + 2) << 8 |
            dataView.getUint8(offset + 3),
          maxBitrate: dataView.getUint32(offset + 4, false),
          avgBitrate: dataView.getUint32(offset + 8, false)
        };
        offset += 13;

        // Parse DecoderSpecificInfo
        if (offset < end && dataView.getUint8(offset) === 0x05) { // DecoderSpecificInfoTag
          const dsLength = this.parseExpandableLength(buffer, offset + 1);
          offset += 1 + dsLength.bytesRead;

          // Get the DecoderSpecificInfo data
          const specificInfoData = new Uint8Array(buffer, offset, dsLength.length);
          offset += dsLength.length;

          return {
            decoderConfig,
            specificInfo: specificInfoData,
            data: specificInfoData // Keep the original data field for compatibility
          };
        }

        return {
          decoderConfig,
          data: new Uint8Array(0) // Empty array if no DecoderSpecificInfo found
        };
      }
    }

    return null;
  }

  /**
   * Parse expandable length field used in esds box
   */
  private parseExpandableLength(buffer: ArrayBuffer, offset: number): { length: number, bytesRead: number; } {
    const dataView = new DataView(buffer);
    let length = 0;
    let bytesRead = 0;
    let byte;

    do {
      byte = dataView.getUint8(offset + bytesRead);
      length = (length << 7) | (byte & 0x7F);
      bytesRead++;
    } while (byte & 0x80);

    return { length, bytesRead };
  }

  /**
   * Generate codec string for MSE from codec specific box
   * @param boxes Array of parsed boxes
   * @returns Array of codec info objects containing codec strings and MIME types
   */
  private generateCodecStrings(boxes: Box[]): CodecInfo[] {
    const codecInfos: CodecInfo[] = [];

    // Find stsd boxes (sample descriptions)
    const stsdBoxes = this.findBoxes(boxes, 'stsd');

    for (const stsd of stsdBoxes) {
      if (!stsd.data?.entries) continue;

      // Process each entry in the stsd box
      for (const entry of stsd.data.entries) {
        const { type, data } = entry;

        switch (type) {
          case 'avc1':
          case 'avc3': {
            if (data?.avcC) {
              const { profileIndication, profileCompatibility, levelIndication } = data.avcC;
              // Format: avc1.PPCCLL
              // PP: profile, CC: constraints/compatibility, LL: level
              const codec = `${type}.` +
                profileIndication.toString(16).padStart(2, '0') +
                profileCompatibility.toString(16).padStart(2, '0') +
                levelIndication.toString(16).padStart(2, '0');

              codecInfos.push({
                codecString: codec,
                mimeType: 'video/mp4',
                extraData: data.avcC.data,
              });
            }
            break;
          }
          case 'hev1':
          case 'hvc1': {
            if (data?.hvcC) {
              const {
                generalProfileSpace,
                generalProfileIdc,
                generalProfileCompatibilityFlags,
                generalConstraintIndicatorFlags,
                generalLevelIdc
              } = data.hvcC;

              // Format: hvc1.P.A.LB.B
              // P: profile space and IDC
              // A: constraints
              // L: level IDC
              // B: other constraints and flags
              const profileSpace = ['', 'A', 'B', 'C'][generalProfileSpace] || '';
              const profile = profileSpace + generalProfileIdc;

              // Convert constraint flags to hex string
              const constraints = generalConstraintIndicatorFlags.toString(16).padStart(6, '0');

              // Level IDC as hex
              const level = generalLevelIdc.toString(16).padStart(2, '0');

              const codec = `${type}.${profile}.${constraints}.${level}`;

              codecInfos.push({
                codecString: codec,
                mimeType: 'video/mp4',
                extraData: data.hvcC.data,
              });
            }
            break;
          }
          case 'mp4a': {
            if (data?.esds?.decoderConfig) {
              const { objectTypeIndication } = data.esds.decoderConfig;
              // Format: mp4a.40.X where X is the audio object type
              const codec = `mp4a.40.${objectTypeIndication}`;

              codecInfos.push({
                codecString: codec,
                mimeType: 'audio/mp4',
                extraData: data.esds.data,
              });
            }
            break;
          }
        }
      }
    }

    return codecInfos;
  }
} 