import { LitElement } from 'lit';
import { Timeline } from '../timeline';

/**
 * VideoPlayer - A custom Lit Element for video playback
 * 
 * @customElement video-player
 */
export declare class VideoPlayer extends LitElement {
  /**
   * Source URL for the video
   */
  src?: string;

  /**
   * Enable debug mode
   */
  debug: boolean;

  /**
   * Reference to the video element
   */
  readonly video: HTMLVideoElement;

  /**
   * Current playback position in seconds
   */
  readonly currentPosition: number;

  /**
   * Total duration of the video in seconds
   */
  readonly totalDuration: number;

  /**
   * Whether the video is currently playing
   */
  readonly isPlaying: boolean;

  /**
   * Whether the video is using a single fmp4 source
   */
  readonly singleFmp4: boolean;

  /**
   * The timeline instance managing the video playback
   */
  readonly timeline?: Timeline;

  /**
   * Seek to a specific time in the video
   * @param time Time in seconds
   */
  seek(time: number): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'video-player': VideoPlayer;
  }
} 