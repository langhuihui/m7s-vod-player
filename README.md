# Custom Video Player with Timeline UI

This project implements a custom video player with a timeline UI for an HLS video stream.

## Features

- Custom timeline UI showing playback position
- Buffer visualization
- Playback control buttons:
  - Play/Pause toggle
  - 10 seconds rewind
  - 10 seconds fast forward
- Playback speed control
- Timeline seeking (click and drag)
- HLS video streaming support
- Encapsulated video player component

## Component Structure

- **VideoPlayer**: Self-contained component that handles:
  - HLS playlist loading
  - Timeline construction and management
  - Playback controls including play/pause, seek, and speed adjustment
  - Timeline UI with buffer visualization
  - Seeking functionality

## Project Setup

### Install dependencies

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

## Testing with Chrome DevTools Protocol (CDP)

To test the player using CDP:

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Make sure Chrome/Chromium is running with remote debugging enabled:
   ```bash
   # For macOS
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
   ```

3. Run the CDP test script:
   ```bash
   pnpm test:cdp
   ```

## Implementation Details

- The VideoPlayer component encapsulates the entire video playback functionality
- Timeline management, including initialization and seeking, is handled within the VideoPlayer
- Timeline UI updates according to the video's current position and buffer status
- Control buttons allow for play/pause, fast forward (10s) and rewind (10s)
- Playback speed can be adjusted through UI buttons

## Requirements

- Node.js 14+
- Chrome/Chromium with remote debugging enabled
- HLS server (for video content)
