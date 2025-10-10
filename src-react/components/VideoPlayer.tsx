import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { Engine } from "../../src/engine";
import "./VideoPlayer.css";

interface VideoPlayerProps {
  src?: string;
  debug?: boolean;
  autoPlay?: boolean;
  onTimeUpdate?: (time: number) => void;
  onSegments?: (segments: any) => void;
}

export interface VideoPlayerHandle {
  videoElement: HTMLVideoElement | null;
  seek: (time: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  ({ src, debug = false, autoPlay = false, onTimeUpdate, onSegments }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const bufferRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const hideControlsTimeoutRef = useRef<number | null>(null);

    const [loadingPercent, setLoadingPercent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showPlaybackRateMenu, setShowPlaybackRateMenu] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isVolumeDragging, setIsVolumeDragging] = useState(false);
    const [singleFmp4] = useState(false);
    const [isWideScreen, setIsWideScreen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipTime, setTooltipTime] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);

    const playbackRates = [0.5, 1, 1.5, 2, 3, 4];

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      videoElement: videoRef.current,
      seek: (time: number) => {
        if (engineRef.current) {
          engineRef.current.seek(time);
          setCurrentPosition(time);
        }
      },
    }));

    const formatTime = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      if (hours > 0) {
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      } else {
        return `${minutes.toString().padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`;
      }
    };

    const checkScreenWidth = useCallback(() => {
      if (playerRef.current) {
        setIsWideScreen(playerRef.current.offsetWidth >= 400);
      }
    }, []);

    const updateTimelineUI = useCallback(() => {
      if (
        !timelineRef.current ||
        !progressRef.current ||
        !bufferRef.current ||
        !engineRef.current
      )
        return;

      const position = engineRef.current.position;
      setCurrentPosition(position);

      const duration = engineRef.current.totalDuration;
      if (totalDuration !== duration) {
        setTotalDuration(duration);
      }

      const percentage = (position / duration) * 100;
      progressRef.current.style.width = `${percentage}%`;

      const bufferPercentage =
        ((position + engineRef.current.bufferedLength) / duration) * 100;
      bufferRef.current.style.width = `${bufferPercentage}%`;

      if (onTimeUpdate) {
        onTimeUpdate(position);
      }

      setIsPlaying(!videoRef.current?.paused);
    }, [totalDuration, onTimeUpdate]);

    const handleTimelineClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (!timelineRef.current || !engineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const clickPosition = (event.clientX - rect.left) / rect.width;
        const seekTime = clickPosition * totalDuration;

        engineRef.current.seek(seekTime);
        setCurrentPosition(seekTime);
      },
      [totalDuration]
    );

    const handleDrag = useCallback(
      (event: MouseEvent) => {
        if (!isDragging || !timelineRef.current || !engineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const dragPosition = (event.clientX - rect.left) / rect.width;
        const seekTime = Math.max(
          0,
          Math.min(dragPosition * totalDuration, totalDuration)
        );

        setCurrentPosition(seekTime);

        const percentage = (seekTime / totalDuration) * 100;
        if (progressRef.current) {
          progressRef.current.style.width = `${percentage}%`;
        }
      },
      [isDragging, totalDuration]
    );

    const stopDrag = useCallback(
      (event: MouseEvent) => {
        if (!isDragging) return;

        if (timelineRef.current && engineRef.current) {
          const rect = timelineRef.current.getBoundingClientRect();
          const clickPosition = (event.clientX - rect.left) / rect.width;
          const seekTime = clickPosition * totalDuration;
          engineRef.current.seek(seekTime);
          setCurrentPosition(seekTime);
        }

        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", stopDrag);
        setIsDragging(false);
      },
      [isDragging, totalDuration, handleDrag]
    );

    const startDrag = (event: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      const nativeEvent = event.nativeEvent;
      handleDrag(nativeEvent);

      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", stopDrag);
    };

    const onTimelineMouseEnter = () => {
      setIsHovering(true);
      setShowTooltip(true);
    };

    const onTimelineMouseLeave = () => {
      setIsHovering(false);
      setShowTooltip(false);
    };

    const handleTimelineMouseMove = (
      event: React.MouseEvent<HTMLDivElement>
    ) => {
      if (!timelineRef.current || !engineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const mousePosition = (event.clientX - rect.left) / rect.width;
      const time = mousePosition * totalDuration;

      setTooltipPosition({
        x: event.clientX - rect.left,
        y: -30,
      });
      setTooltipTime(formatTime(time));
    };

    const changePlaybackRate = (rate: number) => {
      setPlaybackRate(rate);
      if (engineRef.current) {
        engineRef.current.playbackRate = rate;
      }
      setShowPlaybackRateMenu(false);
    };

    const togglePlaybackRateMenu = () => {
      setShowPlaybackRateMenu((prev) => !prev);
    };

    const togglePlay = () => {
      if (!videoRef.current || !engineRef.current) return;

      if (engineRef.current.isPlaying) {
        engineRef.current.pause();
      } else {
        engineRef.current.play();
      }
    };

    const toggleMute = () => {
      if (!videoRef.current) return;

      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
    };

    const updateVolumeFromPosition = useCallback(
      (clientY: number, rect: DOMRect) => {
        const sliderHeight = rect.height;
        const volumePercentage =
          1 - Math.max(0, Math.min(1, (clientY - rect.top) / sliderHeight));
        const clampedVolume = Math.max(0, Math.min(1, volumePercentage));

        setVolume(clampedVolume);
        if (videoRef.current) {
          videoRef.current.volume = clampedVolume;
          setIsMuted(clampedVolume === 0);
          videoRef.current.muted = clampedVolume === 0;
        }
      },
      []
    );

    const handleVolumeChange = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!videoRef.current) return;

      const slider = event.currentTarget as HTMLElement;
      const rect = slider.getBoundingClientRect();
      updateVolumeFromPosition(event.clientY, rect);
    };

    const startVolumeDrag = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsVolumeDragging(true);

      const slider = event.currentTarget as HTMLElement;
      const sliderRect = slider.getBoundingClientRect();

      updateVolumeFromPosition(event.clientY, sliderRect);

      const handleDrag = (e: MouseEvent) => {
        updateVolumeFromPosition(e.clientY, sliderRect);
      };

      document.addEventListener("mousemove", handleDrag);

      const stopDrag = () => {
        setIsVolumeDragging(false);
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", stopDrag);

        setTimeout(() => {
          if (!document.querySelector(".volume-control:hover")) {
            setShowVolumeSlider(false);
          }
        }, 500);
      };

      document.addEventListener("mouseup", stopDrag);
    };

    const seekForward = () => {
      if (!engineRef.current) return;

      const newTime = Math.min(engineRef.current.position + 10, totalDuration);
      engineRef.current.seek(newTime);
      setCurrentPosition(newTime);
    };

    const seekBackward = () => {
      if (!engineRef.current) return;

      const newTime = Math.max(engineRef.current.position - 10, 0);
      engineRef.current.seek(newTime);
      setCurrentPosition(newTime);
    };

    const handleMouseEnter = () => {
      setShowControls(true);
      if (hideControlsTimeoutRef.current !== null) {
        window.clearTimeout(hideControlsTimeoutRef.current);
        hideControlsTimeoutRef.current = null;
      }
    };

    const handleMouseLeave = () => {
      if (isDragging) return;

      hideControlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 2000);
    };

    const handleMouseMove = () => {
      handleMouseEnter();
    };

    const toggleFullscreen = () => {
      if (!playerRef.current) return;

      if (!document.fullscreenElement) {
        playerRef.current
          .requestFullscreen()
          .then(() => {
            setIsFullscreen(true);
          })
          .catch((err) => {
            console.error(
              `Error attempting to enable fullscreen: ${err.message}`
            );
          });
      } else {
        document
          .exitFullscreen()
          .then(() => {
            setIsFullscreen(false);
          })
          .catch((err) => {
            console.error(
              `Error attempting to exit fullscreen: ${err.message}`
            );
          });
      }
    };

    // Effect to handle src changes
    useEffect(() => {
      if (!src || !videoRef.current) return;

      // Cleanup previous engine
      if (engineRef.current) {
        engineRef.current.destroy();
      }

      setIsLoading(true);

      const engine = new Engine(videoRef.current, { debug, autoPlay: debug });
      engine.on("progress", (progress: any) => {
        setLoadingPercent(progress.percent);
      });
      engineRef.current = engine;

      setCurrentPosition(0);
      setTotalDuration(0);

      engine
        .load(src)
        .then(() => {
          setTotalDuration(engine.totalDuration);
          if (onSegments) {
            onSegments(engine.segments);
          }
          setIsLoading(false);
        })
        .catch((error: any) => {
          console.error("Failed to load video:", error);
          setIsLoading(false);
        });

      return () => {
        if (engineRef.current) {
          engineRef.current.destroy();
        }
      };
    }, [src, debug, autoPlay, onSegments]);

    // Effect to setup video event listeners
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleTimeUpdate = () => updateTimelineUI();
      const handlePlay = () => {
        console.log("Video started playing");
        setIsPlaying(true);
        setIsLoading(false);
      };
      const handlePause = () => {
        console.log("Video paused");
        setIsPlaying(false);
        if (engineRef.current?.isPlaying) {
          setIsLoading(true);
        }
      };
      const handleCanPlay = () => {
        console.log("Video can play");
        setIsLoading(false);
      };
      const handlePlaying = () => {
        console.log("Video is playing");
        setIsLoading(false);
      };
      const handleError = (e: Event) => {
        console.error("Video error occurred:", e);
        setIsLoading(false);
      };
      const handleWaiting = () => {
        console.log("Video is waiting for data");
        setIsLoading(true);
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("playing", handlePlaying);
      video.addEventListener("error", handleError);
      video.addEventListener("waiting", handleWaiting);

      // Initialize volume
      video.volume = volume;

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("playing", handlePlaying);
        video.removeEventListener("error", handleError);
        video.removeEventListener("waiting", handleWaiting);
      };
    }, [updateTimelineUI, volume]);

    // Effect for ResizeObserver
    useEffect(() => {
      if (!playerRef.current) return;

      const resizeObserver = new ResizeObserver(() => {
        checkScreenWidth();
      });
      resizeObserver.observe(playerRef.current);

      checkScreenWidth();

      return () => {
        resizeObserver.disconnect();
      };
    }, [checkScreenWidth]);

    return (
      <div
        className="video-player"
        ref={playerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Video element */}
        <video ref={videoRef} onClick={togglePlay} controls={singleFmp4} />

        {/* Loading indicator */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span className="loading-text">加载中...</span>
              {engineRef.current && (
                <div className="loading-text">{loadingPercent.toFixed(2)}%</div>
              )}
            </div>
          </div>
        )}

        {/* Custom timeline UI */}
        {engineRef.current && !singleFmp4 && (
          <div
            className={`controls-overlay ${
              showControls || isDragging ? "show-controls" : ""
            }`}
          >
            {/* Timeline slider */}
            <div
              className={`timeline ${isHovering ? "timeline-hover" : ""}`}
              ref={timelineRef}
              onClick={handleTimelineClick}
              onMouseEnter={onTimelineMouseEnter}
              onMouseMove={handleTimelineMouseMove}
              onMouseLeave={onTimelineMouseLeave}
            >
              <div className="timeline-buffer" ref={bufferRef}></div>
              <div className="timeline-progress" ref={progressRef}></div>
              <div
                className={`timeline-handle ${
                  isHovering || isDragging ? "timeline-handle-hover" : ""
                }`}
                style={{
                  left: `${(currentPosition / (totalDuration || 1)) * 100}%`,
                }}
                onMouseDown={startDrag}
              ></div>
              {/* Tooltip */}
              {showTooltip && (
                <div
                  className="timeline-tooltip"
                  style={{
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`,
                  }}
                >
                  {tooltipTime}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="controls-container">
              {/* Left side controls */}
              <div className="controls-left">
                {/* Play/Pause Button */}
                <button className="control-button" onClick={togglePlay}>
                  {isPlaying ? (
                    <i className="icon-pause">▮▮</i>
                  ) : (
                    <i className="icon-play">▶</i>
                  )}
                </button>

                {/* Rewind Button */}
                {isWideScreen && (
                  <button className="control-button" onClick={seekBackward}>
                    <i className="icon-backward">◀◀</i>
                  </button>
                )}

                {/* Fast Forward Button */}
                {isWideScreen && (
                  <button className="control-button" onClick={seekForward}>
                    <i className="icon-forward">▶▶</i>
                  </button>
                )}

                {/* Current time display */}
                <div className="time-display">
                  {formatTime(currentPosition)} / {formatTime(totalDuration)}
                </div>
              </div>

              {/* Right side controls */}
              <div className="controls-right">
                {/* Playback rate control */}
                <div className="playback-rate-control">
                  <button
                    className="control-button playback-rate-button"
                    onClick={togglePlaybackRateMenu}
                  >
                    <span>{playbackRate}x</span>
                  </button>
                  {showPlaybackRateMenu && (
                    <div className="playback-rate-menu">
                      {playbackRates.map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={`playback-rate-option ${
                            playbackRate === rate ? "active" : ""
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Volume Control */}
                <div
                  className="volume-control"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => {
                    if (!isVolumeDragging) {
                      setShowVolumeSlider(false);
                    }
                  }}
                >
                  <button className="control-button" onClick={toggleMute}>
                    {isMuted || volume === 0 ? (
                      <i className="icon-volume-mute"></i>
                    ) : volume < 0.5 ? (
                      <i className="icon-volume-low"></i>
                    ) : (
                      <i className="icon-volume-high"></i>
                    )}
                  </button>
                  {showVolumeSlider && (
                    <div className="volume-slider-container">
                      <div
                        className="volume-slider"
                        onClick={handleVolumeChange}
                        onMouseDown={startVolumeDrag}
                      >
                        <div className="volume-slider-track"></div>
                        <div
                          className="volume-slider-fill"
                          style={{ height: `${volume * 100}%` }}
                        ></div>
                        <div
                          className="volume-slider-thumb"
                          style={{ bottom: `${volume * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Fullscreen Button */}
                <button className="control-button" onClick={toggleFullscreen}>
                  {isFullscreen ? (
                    <i className="icon-fullscreen-exit">⤓</i>
                  ) : (
                    <i className="icon-fullscreen">⤢</i>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
