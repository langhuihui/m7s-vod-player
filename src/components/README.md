# Video Player Web Component

A custom video player implemented as a web component using the Lit framework. This component provides a modern video player interface with custom controls, timeline seeking, volume control, playback rate adjustment, and fullscreen support.

## Features

- Custom playback controls
- Interactive timeline with draggable position indicator
- Volume control with vertical slider
- Playback rate adjustment
- Fullscreen support
- Automatic controls hiding
- Responsive design
- Keyboard shortcuts for playback control
- Integration with HLS video segments via Timeline class

## Installation

```bash
pnpm add lit
```

## Usage

### Basic Usage

```html
<script type="module" src="./components/video-player.js"></script>

<video-player src="https://example.com/video.mp4"></video-player>
```

### With TypeScript

```typescript
import { VideoPlayer } from './components/video-player';

// Ensure the component is defined
if (!customElements.get('video-player')) {
  customElements.define('video-player', VideoPlayer);
}

// Use the component
const player = document.createElement('video-player');
player.src = 'https://example.com/video.mp4';
document.body.appendChild(player);
```

### Available Attributes

- `src`: The URL of the video to play
- `debug`: Enable debug mode for the Timeline class (default: false)

### Methods

- `seek(time: number)`: Seek to a specific time in seconds

### Events

- `timeupdate`: Fired when the playback position changes with current time in the `detail` property
- `segments`: Fired when segments are loaded with segments array in the `detail` property

### Example with Events

```javascript
const player = document.querySelector('video-player');

player.addEventListener('timeupdate', (e) => {
  console.log('Current position:', e.detail);
});

player.addEventListener('segments', (e) => {
  console.log('Segments loaded:', e.detail.length);
});
```

## Using with Chrome DevTools Protocol (CDP)

For testing or automation, you can control the video player using CDP via the `chrome-remote-interface` library:

```javascript
const CDP = require('chrome-remote-interface');

async function controlPlayer() {
  const client = await CDP();
  const { Runtime } = client;
  
  await Runtime.evaluate({
    expression: `
      const player = document.querySelector('video-player');
      player.seek(30); // Seek to 30 seconds
    `
  });
  
  await client.close();
}

controlPlayer().catch(console.error);
```

## Keyboard Shortcuts

- Space or K: Play/Pause
- Left Arrow: Seek backward 10 seconds
- Right Arrow: Seek forward 10 seconds
- F: Toggle fullscreen
- M: Toggle mute

## Browser Support

This component uses modern web standards and is supported in all major browsers that support Custom Elements v1 and ES2017+ features. 