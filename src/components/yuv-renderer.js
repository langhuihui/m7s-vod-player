class d {
  gl = null;
  program = null;
  yTexture = null;
  uTexture = null;
  vTexture = null;
  positionBuffer = null;
  texCoordBuffer = null;
  width = 0;
  height = 0;
  constructor(t) {
    this.setupWebGL(t);
  }
  setupWebGL(t) {
    try {
      if (this.gl = t.getContext("webgl", { preserveDrawingBuffer: !0 }), !this.gl)
        throw new Error("WebGL not supported");
      const i = this.createShader(this.gl.VERTEX_SHADER, `
        attribute vec4 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        void main() {
          gl_Position = a_position;
          v_texCoord = a_texCoord;
        }
      `), e = this.createShader(this.gl.FRAGMENT_SHADER, `
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
      if (!i || !e)
        throw new Error("Failed to create shaders");
      if (this.program = this.createProgram(i, e), !this.program)
        throw new Error("Failed to create shader program");
      this.createBuffers(), this.yTexture = this.createTexture(), this.uTexture = this.createTexture(), this.vTexture = this.createTexture();
    } catch (i) {
      console.error("Error initializing WebGL:", i), this.gl = null;
    }
  }
  createShader(t, i) {
    if (!this.gl)
      return null;
    const e = this.gl.createShader(t);
    return e ? (this.gl.shaderSource(e, i), this.gl.compileShader(e), this.gl.getShaderParameter(e, this.gl.COMPILE_STATUS) ? e : (console.error("Shader compile error:", this.gl.getShaderInfoLog(e)), this.gl.deleteShader(e), null)) : null;
  }
  createProgram(t, i) {
    if (!this.gl)
      return null;
    const e = this.gl.createProgram();
    return e ? (this.gl.attachShader(e, t), this.gl.attachShader(e, i), this.gl.linkProgram(e), this.gl.getProgramParameter(e, this.gl.LINK_STATUS) ? e : (console.error("Program link error:", this.gl.getProgramInfoLog(e)), this.gl.deleteProgram(e), null)) : null;
  }
  createTexture() {
    if (!this.gl)
      return null;
    const t = this.gl.createTexture();
    return t ? (this.gl.bindTexture(this.gl.TEXTURE_2D, t), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR), t) : null;
  }
  createBuffers() {
    if (!this.gl || !this.program)
      return;
    this.positionBuffer = this.gl.createBuffer(), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    const t = [
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      1
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(t), this.gl.STATIC_DRAW), this.texCoordBuffer = this.gl.createBuffer(), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    const i = [
      0,
      1,
      1,
      1,
      0,
      0,
      1,
      0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(i), this.gl.STATIC_DRAW);
  }
  // Set dimensions for the renderer
  setDimensions(t, i) {
    this.width = t, this.height = i, this.gl && this.gl.viewport(0, 0, t, i);
  }
  // Render YUV data to the canvas
  render(t, i, e, r, o) {
    if (!this.gl || !this.program || !this.yTexture || !this.uTexture || !this.vTexture) {
      console.error("WebGL not initialized properly");
      return;
    }
    this.gl.useProgram(this.program), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    const s = this.gl.getAttribLocation(this.program, "a_position");
    this.gl.enableVertexAttribArray(s), this.gl.vertexAttribPointer(s, 2, this.gl.FLOAT, !1, 0, 0), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    const g = this.gl.getAttribLocation(this.program, "a_texCoord");
    this.gl.enableVertexAttribArray(g), this.gl.vertexAttribPointer(g, 2, this.gl.FLOAT, !1, 0, 0), this.updateTexture(this.yTexture, 0, t, this.width, this.height, r), this.updateTexture(this.uTexture, 1, i, this.width / 2, this.height / 2, o), this.updateTexture(this.vTexture, 2, e, this.width / 2, this.height / 2, o);
    const h = this.gl.getUniformLocation(this.program, "y_texture"), l = this.gl.getUniformLocation(this.program, "u_texture"), u = this.gl.getUniformLocation(this.program, "v_texture");
    this.gl.uniform1i(h, 0), this.gl.uniform1i(l, 1), this.gl.uniform1i(u, 2), this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
  updateTexture(t, i, e, r, o, s) {
    if (this.gl)
      if (this.gl.activeTexture(this.gl.TEXTURE0 + i), this.gl.bindTexture(this.gl.TEXTURE_2D, t), s === r)
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.LUMINANCE,
          r,
          o,
          0,
          this.gl.LUMINANCE,
          this.gl.UNSIGNED_BYTE,
          e
        );
      else {
        const g = new Uint8Array(r * o);
        for (let h = 0; h < o; h++)
          for (let l = 0; l < r; l++)
            g[h * r + l] = e[h * s + l];
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.LUMINANCE,
          r,
          o,
          0,
          this.gl.LUMINANCE,
          this.gl.UNSIGNED_BYTE,
          g
        );
      }
  }
  // Add a method to render directly from a VideoFrame with YUV format
  renderVideoFrame(t) {
    this.setDimensions(t.codedWidth, t.codedHeight);
    const i = t.codedWidth * t.codedHeight, e = t.codedWidth / 2 * (t.codedHeight / 2), r = new Uint8Array(i), o = new Uint8Array(e), s = new Uint8Array(e);
    t.copyTo(r, { rect: { x: 0, y: 0, width: t.codedWidth, height: t.codedHeight }, layout: [{ offset: 0, stride: t.codedWidth }] }), t.format === "I420" ? (t.copyTo(o, { rect: { x: 0, y: 0, width: t.codedWidth / 2, height: t.codedHeight / 2 }, layout: [{ offset: i, stride: t.codedWidth / 2 }] }), t.copyTo(s, { rect: { x: 0, y: 0, width: t.codedWidth / 2, height: t.codedHeight / 2 }, layout: [{ offset: i + e, stride: t.codedWidth / 2 }] })) : (t.copyTo(s, { rect: { x: 0, y: 0, width: t.codedWidth / 2, height: t.codedHeight / 2 }, layout: [{ offset: i, stride: t.codedWidth / 2 }] }), t.copyTo(o, { rect: { x: 0, y: 0, width: t.codedWidth / 2, height: t.codedHeight / 2 }, layout: [{ offset: i + e, stride: t.codedWidth / 2 }] })), this.render(r, o, s, t.codedWidth, t.codedWidth / 2);
  }
  // Cleanup resources
  dispose() {
    this.gl && (this.gl.deleteTexture(this.yTexture), this.gl.deleteTexture(this.uTexture), this.gl.deleteTexture(this.vTexture), this.gl.deleteBuffer(this.positionBuffer), this.gl.deleteBuffer(this.texCoordBuffer), this.program && this.gl.deleteProgram(this.program), this.gl = null);
  }
}
export {
  d as YuvRenderer
};
