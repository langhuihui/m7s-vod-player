export class YuvRenderer {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private yTexture: WebGLTexture | null = null;
  private uTexture: WebGLTexture | null = null;
  private vTexture: WebGLTexture | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private texCoordBuffer: WebGLBuffer | null = null;
  private width: number = 0;
  private height: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.setupWebGL(canvas);
  }

  private setupWebGL(canvas: HTMLCanvasElement): void {
    try {
      // Initialize WebGL context
      this.gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

      if (!this.gl) {
        throw new Error('WebGL not supported');
      }

      // Create shader program
      const vertexShader = this.createShader(this.gl.VERTEX_SHADER, `
        attribute vec4 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        void main() {
          gl_Position = a_position;
          v_texCoord = a_texCoord;
        }
      `);

      const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, `
        precision mediump float;
        uniform sampler2D y_texture;
        uniform sampler2D u_texture;
        uniform sampler2D v_texture;
        varying vec2 v_texCoord;
        
        void main() {
          float y = texture2D(y_texture, v_texCoord).r;
          float u = texture2D(u_texture, v_texCoord).r - 0.5;
          float v = texture2D(v_texture, v_texCoord).r - 0.5;
          
          // YUV to RGB conversion
          float r = y + 1.402 * v;
          float g = y - 0.344 * u - 0.714 * v;
          float b = y + 1.772 * u;
          
          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `);

      if (!vertexShader || !fragmentShader) {
        throw new Error('Failed to create shaders');
      }

      // Create program
      this.program = this.createProgram(vertexShader, fragmentShader);
      if (!this.program) {
        throw new Error('Failed to create shader program');
      }

      // Create buffers
      this.createBuffers();

      // Create textures
      this.yTexture = this.createTexture();
      this.uTexture = this.createTexture();
      this.vTexture = this.createTexture();

    } catch (error) {
      console.error('Error initializing WebGL:', error);
      this.gl = null;
    }
  }

  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;

    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    if (!this.gl) return null;

    const program = this.gl.createProgram();
    if (!program) return null;

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program link error:', this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  private createTexture(): WebGLTexture | null {
    if (!this.gl) return null;

    const texture = this.gl.createTexture();
    if (!texture) return null;

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // Set texture parameters
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    return texture;
  }

  private createBuffers(): void {
    if (!this.gl || !this.program) return;

    // Position buffer (full canvas quad)
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

    const positions = [
      -1.0, -1.0,
      1.0, -1.0,
      -1.0, 1.0,
      1.0, 1.0,
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

    // Texture coordinate buffer
    this.texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);

    const texCoords = [
      0.0, 1.0,
      1.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texCoords), this.gl.STATIC_DRAW);
  }

  // Set dimensions for the renderer
  setDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;

    if (this.gl) {
      this.gl.viewport(0, 0, width, height);
    }
  }

  // Render YUV data to the canvas
  render(yData: Uint8Array, uData: Uint8Array, vData: Uint8Array, yStride: number, uvStride: number): void {
    if (!this.gl || !this.program || !this.yTexture || !this.uTexture || !this.vTexture) {
      console.error('WebGL not initialized properly');
      return;
    }

    // Use the shader program
    this.gl.useProgram(this.program);

    // Bind position buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Bind texture coordinate buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    const texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
    this.gl.enableVertexAttribArray(texCoordLocation);
    this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Update textures with YUV data
    this.updateTexture(this.yTexture, 0, yData, this.width, this.height, yStride);
    this.updateTexture(this.uTexture, 1, uData, this.width / 2, this.height / 2, uvStride);
    this.updateTexture(this.vTexture, 2, vData, this.width / 2, this.height / 2, uvStride);

    // Set texture uniforms
    const yLocation = this.gl.getUniformLocation(this.program, 'y_texture');
    const uLocation = this.gl.getUniformLocation(this.program, 'u_texture');
    const vLocation = this.gl.getUniformLocation(this.program, 'v_texture');

    this.gl.uniform1i(yLocation, 0);
    this.gl.uniform1i(uLocation, 1);
    this.gl.uniform1i(vLocation, 2);

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  private updateTexture(texture: WebGLTexture, textureUnit: number, data: Uint8Array, width: number, height: number, stride: number): void {
    if (!this.gl) return;

    this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // If stride equals width, we can upload the data directly
    if (stride === width) {
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.LUMINANCE,
        width,
        height,
        0,
        this.gl.LUMINANCE,
        this.gl.UNSIGNED_BYTE,
        data
      );
    } else {
      // Otherwise, we need to handle the stride
      // Create a temporary buffer with correct stride
      const tempData = new Uint8Array(width * height);
      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          tempData[row * width + col] = data[row * stride + col];
        }
      }

      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.LUMINANCE,
        width,
        height,
        0,
        this.gl.LUMINANCE,
        this.gl.UNSIGNED_BYTE,
        tempData
      );
    }
  }

  // Add a method to render directly from a VideoFrame with YUV format
  renderVideoFrame(frame: VideoFrame): void {
    // if (!frame || frame.format !== 'I420' && frame.format !== 'YV12') {
    //   console.error('Unsupported video frame format', frame.format);
    //   return;
    // }

    // Set dimensions from the frame
    this.setDimensions(frame.codedWidth, frame.codedHeight);

    // Extract YUV data from the frame
    const ySize = frame.codedWidth * frame.codedHeight;
    const uvSize = (frame.codedWidth / 2) * (frame.codedHeight / 2);

    const yData = new Uint8Array(ySize);
    const uData = new Uint8Array(uvSize);
    const vData = new Uint8Array(uvSize);

    // Copy data from the video frame
    frame.copyTo(yData, { rect: { x: 0, y: 0, width: frame.codedWidth, height: frame.codedHeight }, layout: [{ offset: 0, stride: frame.codedWidth }] });

    // The layout of U and V depends on the format
    if (frame.format === 'I420') {
      frame.copyTo(uData, { rect: { x: 0, y: 0, width: frame.codedWidth / 2, height: frame.codedHeight / 2 }, layout: [{ offset: ySize, stride: frame.codedWidth / 2 }] });
      frame.copyTo(vData, { rect: { x: 0, y: 0, width: frame.codedWidth / 2, height: frame.codedHeight / 2 }, layout: [{ offset: ySize + uvSize, stride: frame.codedWidth / 2 }] });
    } else { // YV12
      frame.copyTo(vData, { rect: { x: 0, y: 0, width: frame.codedWidth / 2, height: frame.codedHeight / 2 }, layout: [{ offset: ySize, stride: frame.codedWidth / 2 }] });
      frame.copyTo(uData, { rect: { x: 0, y: 0, width: frame.codedWidth / 2, height: frame.codedHeight / 2 }, layout: [{ offset: ySize + uvSize, stride: frame.codedWidth / 2 }] });
    }

    // Render the YUV data
    this.render(yData, uData, vData, frame.codedWidth, frame.codedWidth / 2);
  }

  // Cleanup resources
  dispose(): void {
    if (!this.gl) return;

    // Delete textures
    this.gl.deleteTexture(this.yTexture);
    this.gl.deleteTexture(this.uTexture);
    this.gl.deleteTexture(this.vTexture);

    // Delete buffers
    this.gl.deleteBuffer(this.positionBuffer);
    this.gl.deleteBuffer(this.texCoordBuffer);

    // Delete program and shaders
    if (this.program) {
      this.gl.deleteProgram(this.program);
    }

    this.gl = null;
  }
} 