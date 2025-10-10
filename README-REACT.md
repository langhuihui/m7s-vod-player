# M7S VOD Player - React Version

这是 M7S VOD Player 的 React 版本，提供与 Vue 版本相同的功能。

## 项目结构

```
HLSv7/
├── src/                    # Vue 版本源代码
├── src-react/              # React 版本源代码
│   ├── main.tsx           # React 入口文件
│   ├── App.tsx            # React 主应用组件
│   └── components/
│       ├── VideoPlayer.tsx # React 视频播放器组件
│       └── VideoPlayer.css # 视频播放器样式
├── index.html             # Vue 版本 HTML 入口
├── index-react.html       # React 版本 HTML 入口
├── vite.config.ts         # Vue 版本 Vite 配置
├── vite-react.config.ts   # React 版本 Vite 配置
└── package.json           # 包含两个版本的依赖
```

## 安装依赖

```bash
pnpm install
```

## 开发模式

### 运行 Vue 版本
```bash
pnpm dev
```

### 运行 React 版本
```bash
pnpm dev:react
```

## 构建

### 构建 Vue 版本
```bash
pnpm build
# 输出目录: dist/
```

### 构建 React 版本
```bash
pnpm build:react
# 输出目录: dist-react/
```

## 预览构建结果

### Vue 版本
```bash
pnpm preview
```

### React 版本
```bash
pnpm preview:react
```

## 使用说明

### React 组件使用示例

```tsx
import React, { useRef } from 'react';
import VideoPlayer, { VideoPlayerHandle } from './components/VideoPlayer';

function App() {
  const playerRef = useRef<VideoPlayerHandle>(null);
  
  const handleTimeUpdate = (time: number) => {
    console.log('Current time:', time);
  };
  
  const handleSegments = (segments: any) => {
    console.log('Video segments:', segments);
  };
  
  return (
    <VideoPlayer
      ref={playerRef}
      src="http://example.com/video.m3u8"
      debug={true}
      autoPlay={false}
      onTimeUpdate={handleTimeUpdate}
      onSegments={handleSegments}
    />
  );
}
```

### VideoPlayer Props

- `src`: 视频源 URL (HLS m3u8 格式)
- `debug`: 是否开启调试模式 (可选，默认 false)
- `autoPlay`: 是否自动播放 (可选，默认 false)
- `onTimeUpdate`: 时间更新回调函数 (可选)
- `onSegments`: 视频片段加载完成回调 (可选)

### VideoPlayer Ref 方法

通过 ref 可以访问以下方法：

```tsx
// 获取视频元素
playerRef.current?.videoElement

// 跳转到指定时间
playerRef.current?.seek(timeInSeconds)
```

## 功能特性

- ✅ HLS 视频播放
- ✅ 自定义播放控制界面
- ✅ 播放/暂停
- ✅ 进度条拖拽
- ✅ 快进/快退
- ✅ 音量控制
- ✅ 倍速播放 (0.5x - 4x)
- ✅ 全屏支持
- ✅ 加载进度显示
- ✅ 缓冲进度显示
- ✅ 时间轴悬停预览
- ✅ 响应式设计

## 技术栈

- React 18
- TypeScript
- Vite
- WebCodecs API
- HLS 视频流处理

## 注意事项

1. React 版本和 Vue 版本共享同一套核心引擎代码（`src/engine.ts` 等）
2. 两个版本可以独立开发和构建，互不影响
3. 确保浏览器支持 WebCodecs API
4. 建议使用 Chrome/Edge 等现代浏览器

## 浏览器兼容性

- Chrome 94+
- Edge 94+
- Opera 80+
- 其他支持 WebCodecs API 的浏览器

## License

ISC

