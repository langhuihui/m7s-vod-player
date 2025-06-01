import { Engine } from './engine';

export class VideoPlayer {
    private video: HTMLVideoElement;
    private engine: Engine | null = null;
    private isPlaying: boolean = false;
    private currentPosition: number = 0;
    private totalDuration: number = 0;
    private volume: number = 1;
    private isMuted: boolean = false;
    private playbackRate: number = 1;
    private isLoading: boolean = false;
    private debug: boolean = false;

    constructor(videoElement: HTMLVideoElement, options: { debug?: boolean } = {}) {
        this.video = videoElement;
        this.debug = options.debug || false;
        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        this.video.addEventListener('timeupdate', this.updateTimelineUI.bind(this));
        this.video.addEventListener('play', () => {
            this.isPlaying = true;
            this.isLoading = false;
        });
        this.video.addEventListener('pause', () => {
            this.isPlaying = false;
            if (this.engine?.isPlaying) {
                this.isLoading = true;
            }
        });
        this.video.addEventListener('canplay', () => {
            this.isLoading = false;
        });
        this.video.addEventListener('playing', () => {
            this.isLoading = false;
        });
        this.video.addEventListener('error', (e) => {
            console.error('Video error occurred:', e);
            this.isLoading = false;
        });
    }

    public load(src: string): Promise<void> {
        if (this.engine) {
            this.engine.destroy();
        }

        this.isLoading = true;
        this.currentPosition = 0;
        this.totalDuration = 0;

        this.engine = new Engine(this.video, { debug: this.debug });
        return this.engine.load(src).then(() => {
            this.totalDuration = this.engine!.totalDuration;
            this.isLoading = false;
        }).catch((error) => {
            console.error('Failed to load video:', error);
            this.isLoading = false;
            throw error;
        });
    }

    public play(): void {
        if (this.engine) {
            this.engine.play();
        }
    }

    public pause(): void {
        if (this.engine) {
            this.engine.pause();
        }
    }

    public seek(time: number): void {
        if (this.engine) {
            this.engine.seek(time);
            this.currentPosition = time;
        }
    }

    public setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
        this.video.volume = this.volume;
        this.isMuted = this.volume === 0;
        this.video.muted = this.isMuted;
    }

    public toggleMute(): void {
        this.isMuted = !this.isMuted;
        this.video.muted = this.isMuted;
    }

    public setPlaybackRate(rate: number): void {
        this.playbackRate = rate;
        this.video.playbackRate = rate;
        if (this.engine?.softDecoder) {
            this.engine.softDecoder.setPlaybackSpeed(rate);
        }
    }

    private updateTimelineUI(): void {
        if (!this.engine) return;

        this.currentPosition = this.engine.position;
        if (this.totalDuration !== this.engine.totalDuration) {
            this.totalDuration = this.engine.totalDuration;
        }
    }

    public getPosition(): number {
        return this.currentPosition;
    }

    public getDuration(): number {
        return this.totalDuration;
    }

    public getIsPlaying(): boolean {
        return this.isPlaying;
    }

    public getIsLoading(): boolean {
        return this.isLoading;
    }

    public getVolume(): number {
        return this.volume;
    }

    public getIsMuted(): boolean {
        return this.isMuted;
    }

    public getPlaybackRate(): number {
        return this.playbackRate;
    }

    public destroy(): void {
        if (this.engine) {
            this.engine.destroy();
        }
        this.video.removeEventListener('timeupdate', this.updateTimelineUI.bind(this));
    }
} 