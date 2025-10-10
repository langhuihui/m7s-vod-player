# React 版本快速启动

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 运行 React 版本

```bash
pnpm dev:react
```

浏览器会自动打开 `http://localhost:5173`，显示 React 版本的视频播放器。

### 3. 构建生产版本

```bash
pnpm build:react
```

构建后的文件将输出到 `dist-react/` 目录。

## 📁 文件说明

- `src-react/` - React 版本的源代码目录
  - `main.tsx` - React 应用入口
  - `App.tsx` - 主应用组件
  - `components/VideoPlayer.tsx` - 视频播放器组件
  - `components/VideoPlayer.css` - 播放器样式

- `index-react.html` - React 版本的 HTML 入口文件
- `vite-react.config.ts` - React 版本的 Vite 配置
- `tsconfig-react.json` - React 版本的 TypeScript 配置

## 🎯 与 Vue 版本的区别

### 项目结构
- Vue 版本：`src/` 目录
- React 版本：`src-react/` 目录

### 开发命令
- Vue 版本：`pnpm dev`
- React 版本：`pnpm dev:react`

### 构建命令
- Vue 版本：`pnpm build` → `dist/`
- React 版本：`pnpm build:react` → `dist-react/`

## 🔧 组件使用

### 基本用法

```tsx
import VideoPlayer from './components/VideoPlayer';

function App() {
  return (
    <VideoPlayer 
      src="http://example.com/video.m3u8"
      debug={true}
    />
  );
}
```

### 使用 Ref

```tsx
import { useRef } from 'react';
import VideoPlayer, { VideoPlayerHandle } from './components/VideoPlayer';

function App() {
  const playerRef = useRef<VideoPlayerHandle>(null);
  
  const handleSeek = () => {
    // 跳转到 30 秒位置
    playerRef.current?.seek(30);
  };
  
  return (
    <>
      <VideoPlayer ref={playerRef} src="..." />
      <button onClick={handleSeek}>跳转到 30s</button>
    </>
  );
}
```

### 监听事件

```tsx
function App() {
  const handleTimeUpdate = (time: number) => {
    console.log('当前播放时间:', time);
  };
  
  const handleSegments = (segments: any) => {
    console.log('视频片段信息:', segments);
  };
  
  return (
    <VideoPlayer 
      src="..."
      onTimeUpdate={handleTimeUpdate}
      onSegments={handleSegments}
    />
  );
}
```

## 💡 注意事项

1. **共享核心代码**：React 版本和 Vue 版本共享相同的引擎代码（位于 `src/` 目录）
2. **浏览器要求**：需要支持 WebCodecs API 的浏览器（Chrome 94+, Edge 94+）
3. **TypeScript**：完整的 TypeScript 类型支持
4. **样式隔离**：VideoPlayer 组件的样式通过 CSS 文件导入，不会影响全局样式

## 🐛 常见问题

### Q: 视频无法播放？
A: 请确保：
- 视频 URL 是有效的 HLS m3u8 格式
- 浏览器支持 WebCodecs API
- 检查浏览器控制台是否有错误信息

### Q: 如何自定义样式？
A: 修改 `src-react/components/VideoPlayer.css` 文件

### Q: 可以同时运行 Vue 和 React 版本吗？
A: 不可以在同一端口，但可以分别在不同终端运行：
- 终端 1: `pnpm dev` (Vue 版本，端口 5173)
- 终端 2: `pnpm dev:react --port 5174` (React 版本，端口 5174)

## 📚 更多文档

详细文档请参考 [README-REACT.md](./README-REACT.md)

