import React, { useRef, useState } from "react";
import VideoPlayer, { VideoPlayerHandle } from "./components/VideoPlayer";

const App: React.FC = () => {
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);
  const [url, setUrl] = useState(
    "http://36.138.207.41:18080/hls/vod/fmp4.m3u8?start=1750062313568&end=1750063386052&streamPath=live/1581F6Q8D242U00CQ357"
    // "http://localhost:8080/hls/vod/fmp4.m3u8?start=1741944171&streamPath=live/1581F6Q8X24BU00G01HK"
    // "http://localhost:8080/hls/vod/fmp4.m3u8?start=1741674505&streamPath=live/265"
    // "http://218.94.109.62:21221/hls/vod/fmp4.m3u8?start=1747962393962&end=1747962940311&streamPath=live/1581F6Q8X24BU00G01HK"
  );

  const handleTimeUpdate = (time: number) => {
    console.log("timeupdate", time);
  };

  return (
    <div>
      <VideoPlayer
        ref={videoPlayerRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        debug
      />
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter video URL"
        aria-label="Video URL"
        className="url-input"
      />
    </div>
  );
};

export default App;
