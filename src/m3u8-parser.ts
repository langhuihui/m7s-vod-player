const EXTINFRegex = /#EXTINF:(\d+\.\d+),(.*?)\s*$/;
import { MediaSegment } from "./media-segment";

export interface PlaylistInfo {
    segments: MediaSegment[];
    totalDuration: number;
}

export function createPlaylistFromM3U8(m3u8Content: string, baseUrl: string): PlaylistInfo {
    const lines = m3u8Content.split("\n");
    const segments: MediaSegment[] = [];
    let totalDuration = 0;
    let segmentIndex = 0;
    let segmentDuration = 0;
    let segmentTime: Date | null = null;
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
  
      // 解析EXTINF行
      if (line.startsWith("#EXTINF:")) {
        const match = line.match(EXTINFRegex);
        if (match) {
          segmentDuration = parseFloat(match[1]);
          const timeString = match[2] ? match[2].trim() : "";
          // 解析物理时间
          try {
            if (timeString) {
              segmentTime = new Date(timeString);
            } else {
              segmentTime = null;
            }
          } catch (e) {
            segmentTime = null;
          }
        }
      }
      // 处理片段URL行
      else if (!line.startsWith("#") && line !== "") {
        const url = new URL(line, baseUrl);
        const virtualStartTime = totalDuration;
        const virtualEndTime = totalDuration + segmentDuration;
        const segment = new MediaSegment(segmentIndex, {
          url: url.toString(),
          duration: segmentDuration,
          physicalTime: segmentTime,
        });
        segment.virtualStartTime = virtualStartTime;
        segment.virtualEndTime = virtualEndTime;
        segments.push(segment);
  
        totalDuration += segmentDuration;
        segmentIndex++;
        segmentTime = null;
      }
    }
  
    return { segments, totalDuration };
  }
  