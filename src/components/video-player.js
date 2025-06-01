/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gr = globalThis, Fi = gr.ShadowRoot && (gr.ShadyCSS === void 0 || gr.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ri = Symbol(), zi = /* @__PURE__ */ new WeakMap();
let Qi = class {
  constructor(s, i, f) {
    if (this._$cssResult$ = !0, f !== Ri)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = s, this.t = i;
  }
  get styleSheet() {
    let s = this.o;
    const i = this.t;
    if (Fi && s === void 0) {
      const f = i !== void 0 && i.length === 1;
      f && (s = zi.get(i)), s === void 0 && ((this.o = s = new CSSStyleSheet()).replaceSync(this.cssText), f && zi.set(i, s));
    }
    return s;
  }
  toString() {
    return this.cssText;
  }
};
const uo = (y) => new Qi(typeof y == "string" ? y : y + "", void 0, Ri), co = (y, ...s) => {
  const i = y.length === 1 ? y[0] : s.reduce((f, u, m) => f + ((w) => {
    if (w._$cssResult$ === !0)
      return w.cssText;
    if (typeof w == "number")
      return w;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + w + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(u) + y[m + 1], y[0]);
  return new Qi(i, y, Ri);
}, fo = (y, s) => {
  if (Fi)
    y.adoptedStyleSheets = s.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else
    for (const i of s) {
      const f = document.createElement("style"), u = gr.litNonce;
      u !== void 0 && f.setAttribute("nonce", u), f.textContent = i.cssText, y.appendChild(f);
    }
}, Hi = Fi ? (y) => y : (y) => y instanceof CSSStyleSheet ? ((s) => {
  let i = "";
  for (const f of s.cssRules)
    i += f.cssText;
  return uo(i);
})(y) : y;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ho, defineProperty: po, getOwnPropertyDescriptor: vo, getOwnPropertyNames: mo, getOwnPropertySymbols: go, getPrototypeOf: yo } = Object, Er = globalThis, Ni = Er.trustedTypes, wo = Ni ? Ni.emptyScript : "", _o = Er.reactiveElementPolyfillSupport, nr = (y, s) => y, xi = { toAttribute(y, s) {
  switch (s) {
    case Boolean:
      y = y ? wo : null;
      break;
    case Object:
    case Array:
      y = y == null ? y : JSON.stringify(y);
  }
  return y;
}, fromAttribute(y, s) {
  let i = y;
  switch (s) {
    case Boolean:
      i = y !== null;
      break;
    case Number:
      i = y === null ? null : Number(y);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(y);
      } catch {
        i = null;
      }
  }
  return i;
} }, eo = (y, s) => !ho(y, s), Vi = { attribute: !0, type: String, converter: xi, reflect: !1, useDefault: !1, hasChanged: eo };
Symbol.metadata ??= Symbol("metadata"), Er.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let pt = class extends HTMLElement {
  static addInitializer(s) {
    this._$Ei(), (this.l ??= []).push(s);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(s, i = Vi) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(s) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(s, i), !i.noAccessor) {
      const f = Symbol(), u = this.getPropertyDescriptor(s, f, i);
      u !== void 0 && po(this.prototype, s, u);
    }
  }
  static getPropertyDescriptor(s, i, f) {
    const { get: u, set: m } = vo(this.prototype, s) ?? { get() {
      return this[i];
    }, set(w) {
      this[i] = w;
    } };
    return { get: u, set(w) {
      const b = u?.call(this);
      m?.call(this, w), this.requestUpdate(s, b, f);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(s) {
    return this.elementProperties.get(s) ?? Vi;
  }
  static _$Ei() {
    if (this.hasOwnProperty(nr("elementProperties")))
      return;
    const s = yo(this);
    s.finalize(), s.l !== void 0 && (this.l = [...s.l]), this.elementProperties = new Map(s.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(nr("finalized")))
      return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(nr("properties"))) {
      const i = this.properties, f = [...mo(i), ...go(i)];
      for (const u of f)
        this.createProperty(u, i[u]);
    }
    const s = this[Symbol.metadata];
    if (s !== null) {
      const i = litPropertyMetadata.get(s);
      if (i !== void 0)
        for (const [f, u] of i)
          this.elementProperties.set(f, u);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, f] of this.elementProperties) {
      const u = this._$Eu(i, f);
      u !== void 0 && this._$Eh.set(u, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s) {
    const i = [];
    if (Array.isArray(s)) {
      const f = new Set(s.flat(1 / 0).reverse());
      for (const u of f)
        i.unshift(Hi(u));
    } else
      s !== void 0 && i.push(Hi(s));
    return i;
  }
  static _$Eu(s, i) {
    const f = i.attribute;
    return f === !1 ? void 0 : typeof f == "string" ? f : typeof s == "string" ? s.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((s) => this.enableUpdating = s), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((s) => s(this));
  }
  addController(s) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(s), this.renderRoot !== void 0 && this.isConnected && s.hostConnected?.();
  }
  removeController(s) {
    this._$EO?.delete(s);
  }
  _$E_() {
    const s = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const f of i.keys())
      this.hasOwnProperty(f) && (s.set(f, this[f]), delete this[f]);
    s.size > 0 && (this._$Ep = s);
  }
  createRenderRoot() {
    const s = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return fo(s, this.constructor.elementStyles), s;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((s) => s.hostConnected?.());
  }
  enableUpdating(s) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((s) => s.hostDisconnected?.());
  }
  attributeChangedCallback(s, i, f) {
    this._$AK(s, f);
  }
  _$ET(s, i) {
    const f = this.constructor.elementProperties.get(s), u = this.constructor._$Eu(s, f);
    if (u !== void 0 && f.reflect === !0) {
      const m = (f.converter?.toAttribute !== void 0 ? f.converter : xi).toAttribute(i, f.type);
      this._$Em = s, m == null ? this.removeAttribute(u) : this.setAttribute(u, m), this._$Em = null;
    }
  }
  _$AK(s, i) {
    const f = this.constructor, u = f._$Eh.get(s);
    if (u !== void 0 && this._$Em !== u) {
      const m = f.getPropertyOptions(u), w = typeof m.converter == "function" ? { fromAttribute: m.converter } : m.converter?.fromAttribute !== void 0 ? m.converter : xi;
      this._$Em = u, this[u] = w.fromAttribute(i, m.type) ?? this._$Ej?.get(u) ?? null, this._$Em = null;
    }
  }
  requestUpdate(s, i, f) {
    if (s !== void 0) {
      const u = this.constructor, m = this[s];
      if (f ??= u.getPropertyOptions(s), !((f.hasChanged ?? eo)(m, i) || f.useDefault && f.reflect && m === this._$Ej?.get(s) && !this.hasAttribute(u._$Eu(s, f))))
        return;
      this.C(s, i, f);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(s, i, { useDefault: f, reflect: u, wrapped: m }, w) {
    f && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(s) && (this._$Ej.set(s, w ?? i ?? this[s]), m !== !0 || w !== void 0) || (this._$AL.has(s) || (this.hasUpdated || f || (i = void 0), this._$AL.set(s, i)), u === !0 && this._$Em !== s && (this._$Eq ??= /* @__PURE__ */ new Set()).add(s));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const s = this.scheduleUpdate();
    return s != null && await s, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [u, m] of this._$Ep)
          this[u] = m;
        this._$Ep = void 0;
      }
      const f = this.constructor.elementProperties;
      if (f.size > 0)
        for (const [u, m] of f) {
          const { wrapped: w } = m, b = this[u];
          w !== !0 || this._$AL.has(u) || b === void 0 || this.C(u, void 0, m, b);
        }
    }
    let s = !1;
    const i = this._$AL;
    try {
      s = this.shouldUpdate(i), s ? (this.willUpdate(i), this._$EO?.forEach((f) => f.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (f) {
      throw s = !1, this._$EM(), f;
    }
    s && this._$AE(i);
  }
  willUpdate(s) {
  }
  _$AE(s) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(s)), this.updated(s);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(s) {
    return !0;
  }
  update(s) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(s) {
  }
  firstUpdated(s) {
  }
};
pt.elementStyles = [], pt.shadowRootOptions = { mode: "open" }, pt[nr("elementProperties")] = /* @__PURE__ */ new Map(), pt[nr("finalized")] = /* @__PURE__ */ new Map(), _o?.({ ReactiveElement: pt }), (Er.reactiveElementVersions ??= []).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ui = globalThis, _r = Ui.trustedTypes, Wi = _r ? _r.createPolicy("lit-html", { createHTML: (y) => y }) : void 0, to = "$lit$", Ve = `lit$${Math.random().toFixed(9).slice(2)}$`, ro = "?" + Ve, Eo = `<${ro}>`, ht = document, ar = () => ht.createComment(""), lr = (y) => y === null || typeof y != "object" && typeof y != "function", Mi = Array.isArray, bo = (y) => Mi(y) || typeof y?.[Symbol.iterator] == "function", Si = `[ 	
\f\r]`, rr = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, qi = /-->/g, Xi = />/g, ct = RegExp(`>|${Si}(?:([^\\s"'>=/]+)(${Si}*=${Si}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Gi = /'/g, Ki = /"/g, no = /^(?:script|style|textarea|title)$/i, ko = (y) => (s, ...i) => ({ _$litType$: y, strings: s, values: i }), ge = ko(1), mt = Symbol.for("lit-noChange"), ue = Symbol.for("lit-nothing"), Yi = /* @__PURE__ */ new WeakMap(), dt = ht.createTreeWalker(ht, 129);
function io(y, s) {
  if (!Mi(y) || !y.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return Wi !== void 0 ? Wi.createHTML(s) : s;
}
const $o = (y, s) => {
  const i = y.length - 1, f = [];
  let u, m = s === 2 ? "<svg>" : s === 3 ? "<math>" : "", w = rr;
  for (let b = 0; b < i; b++) {
    const v = y[b];
    let h, E, _ = -1, D = 0;
    for (; D < v.length && (w.lastIndex = D, E = w.exec(v), E !== null); )
      D = w.lastIndex, w === rr ? E[1] === "!--" ? w = qi : E[1] !== void 0 ? w = Xi : E[2] !== void 0 ? (no.test(E[2]) && (u = RegExp("</" + E[2], "g")), w = ct) : E[3] !== void 0 && (w = ct) : w === ct ? E[0] === ">" ? (w = u ?? rr, _ = -1) : E[1] === void 0 ? _ = -2 : (_ = w.lastIndex - E[2].length, h = E[1], w = E[3] === void 0 ? ct : E[3] === '"' ? Ki : Gi) : w === Ki || w === Gi ? w = ct : w === qi || w === Xi ? w = rr : (w = ct, u = void 0);
    const F = w === ct && y[b + 1].startsWith("/>") ? " " : "";
    m += w === rr ? v + Eo : _ >= 0 ? (f.push(h), v.slice(0, _) + to + v.slice(_) + Ve + F) : v + Ve + (_ === -2 ? b : F);
  }
  return [io(y, m + (y[i] || "<?>") + (s === 2 ? "</svg>" : s === 3 ? "</math>" : "")), f];
};
class ur {
  constructor({ strings: s, _$litType$: i }, f) {
    let u;
    this.parts = [];
    let m = 0, w = 0;
    const b = s.length - 1, v = this.parts, [h, E] = $o(s, i);
    if (this.el = ur.createElement(h, f), dt.currentNode = this.el.content, i === 2 || i === 3) {
      const _ = this.el.content.firstChild;
      _.replaceWith(..._.childNodes);
    }
    for (; (u = dt.nextNode()) !== null && v.length < b; ) {
      if (u.nodeType === 1) {
        if (u.hasAttributes())
          for (const _ of u.getAttributeNames())
            if (_.endsWith(to)) {
              const D = E[w++], F = u.getAttribute(_).split(Ve), x = /([.?@])?(.*)/.exec(D);
              v.push({ type: 1, index: m, name: x[2], strings: F, ctor: x[1] === "." ? So : x[1] === "?" ? Co : x[1] === "@" ? Ao : br }), u.removeAttribute(_);
            } else
              _.startsWith(Ve) && (v.push({ type: 6, index: m }), u.removeAttribute(_));
        if (no.test(u.tagName)) {
          const _ = u.textContent.split(Ve), D = _.length - 1;
          if (D > 0) {
            u.textContent = _r ? _r.emptyScript : "";
            for (let F = 0; F < D; F++)
              u.append(_[F], ar()), dt.nextNode(), v.push({ type: 2, index: ++m });
            u.append(_[D], ar());
          }
        }
      } else if (u.nodeType === 8)
        if (u.data === ro)
          v.push({ type: 2, index: m });
        else {
          let _ = -1;
          for (; (_ = u.data.indexOf(Ve, _ + 1)) !== -1; )
            v.push({ type: 7, index: m }), _ += Ve.length - 1;
        }
      m++;
    }
  }
  static createElement(s, i) {
    const f = ht.createElement("template");
    return f.innerHTML = s, f;
  }
}
function gt(y, s, i = y, f) {
  if (s === mt)
    return s;
  let u = f !== void 0 ? i._$Co?.[f] : i._$Cl;
  const m = lr(s) ? void 0 : s._$litDirective$;
  return u?.constructor !== m && (u?._$AO?.(!1), m === void 0 ? u = void 0 : (u = new m(y), u._$AT(y, i, f)), f !== void 0 ? (i._$Co ??= [])[f] = u : i._$Cl = u), u !== void 0 && (s = gt(y, u._$AS(y, s.values), u, f)), s;
}
class Po {
  constructor(s, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = s, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(s) {
    const { el: { content: i }, parts: f } = this._$AD, u = (s?.creationScope ?? ht).importNode(i, !0);
    dt.currentNode = u;
    let m = dt.nextNode(), w = 0, b = 0, v = f[0];
    for (; v !== void 0; ) {
      if (w === v.index) {
        let h;
        v.type === 2 ? h = new cr(m, m.nextSibling, this, s) : v.type === 1 ? h = new v.ctor(m, v.name, v.strings, this, s) : v.type === 6 && (h = new To(m, this, s)), this._$AV.push(h), v = f[++b];
      }
      w !== v?.index && (m = dt.nextNode(), w++);
    }
    return dt.currentNode = ht, u;
  }
  p(s) {
    let i = 0;
    for (const f of this._$AV)
      f !== void 0 && (f.strings !== void 0 ? (f._$AI(s, f, i), i += f.strings.length - 2) : f._$AI(s[i])), i++;
  }
}
class cr {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(s, i, f, u) {
    this.type = 2, this._$AH = ue, this._$AN = void 0, this._$AA = s, this._$AB = i, this._$AM = f, this.options = u, this._$Cv = u?.isConnected ?? !0;
  }
  get parentNode() {
    let s = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && s?.nodeType === 11 && (s = i.parentNode), s;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(s, i = this) {
    s = gt(this, s, i), lr(s) ? s === ue || s == null || s === "" ? (this._$AH !== ue && this._$AR(), this._$AH = ue) : s !== this._$AH && s !== mt && this._(s) : s._$litType$ !== void 0 ? this.$(s) : s.nodeType !== void 0 ? this.T(s) : bo(s) ? this.k(s) : this._(s);
  }
  O(s) {
    return this._$AA.parentNode.insertBefore(s, this._$AB);
  }
  T(s) {
    this._$AH !== s && (this._$AR(), this._$AH = this.O(s));
  }
  _(s) {
    this._$AH !== ue && lr(this._$AH) ? this._$AA.nextSibling.data = s : this.T(ht.createTextNode(s)), this._$AH = s;
  }
  $(s) {
    const { values: i, _$litType$: f } = s, u = typeof f == "number" ? this._$AC(s) : (f.el === void 0 && (f.el = ur.createElement(io(f.h, f.h[0]), this.options)), f);
    if (this._$AH?._$AD === u)
      this._$AH.p(i);
    else {
      const m = new Po(u, this), w = m.u(this.options);
      m.p(i), this.T(w), this._$AH = m;
    }
  }
  _$AC(s) {
    let i = Yi.get(s.strings);
    return i === void 0 && Yi.set(s.strings, i = new ur(s)), i;
  }
  k(s) {
    Mi(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let f, u = 0;
    for (const m of s)
      u === i.length ? i.push(f = new cr(this.O(ar()), this.O(ar()), this, this.options)) : f = i[u], f._$AI(m), u++;
    u < i.length && (this._$AR(f && f._$AB.nextSibling, u), i.length = u);
  }
  _$AR(s = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); s && s !== this._$AB; ) {
      const f = s.nextSibling;
      s.remove(), s = f;
    }
  }
  setConnected(s) {
    this._$AM === void 0 && (this._$Cv = s, this._$AP?.(s));
  }
}
class br {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(s, i, f, u, m) {
    this.type = 1, this._$AH = ue, this._$AN = void 0, this.element = s, this.name = i, this._$AM = u, this.options = m, f.length > 2 || f[0] !== "" || f[1] !== "" ? (this._$AH = Array(f.length - 1).fill(new String()), this.strings = f) : this._$AH = ue;
  }
  _$AI(s, i = this, f, u) {
    const m = this.strings;
    let w = !1;
    if (m === void 0)
      s = gt(this, s, i, 0), w = !lr(s) || s !== this._$AH && s !== mt, w && (this._$AH = s);
    else {
      const b = s;
      let v, h;
      for (s = m[0], v = 0; v < m.length - 1; v++)
        h = gt(this, b[f + v], i, v), h === mt && (h = this._$AH[v]), w ||= !lr(h) || h !== this._$AH[v], h === ue ? s = ue : s !== ue && (s += (h ?? "") + m[v + 1]), this._$AH[v] = h;
    }
    w && !u && this.j(s);
  }
  j(s) {
    s === ue ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, s ?? "");
  }
}
class So extends br {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(s) {
    this.element[this.name] = s === ue ? void 0 : s;
  }
}
class Co extends br {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(s) {
    this.element.toggleAttribute(this.name, !!s && s !== ue);
  }
}
class Ao extends br {
  constructor(s, i, f, u, m) {
    super(s, i, f, u, m), this.type = 5;
  }
  _$AI(s, i = this) {
    if ((s = gt(this, s, i, 0) ?? ue) === mt)
      return;
    const f = this._$AH, u = s === ue && f !== ue || s.capture !== f.capture || s.once !== f.once || s.passive !== f.passive, m = s !== ue && (f === ue || u);
    u && this.element.removeEventListener(this.name, this, f), m && this.element.addEventListener(this.name, this, s), this._$AH = s;
  }
  handleEvent(s) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, s) : this._$AH.handleEvent(s);
  }
}
class To {
  constructor(s, i, f) {
    this.element = s, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = f;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(s) {
    gt(this, s);
  }
}
const Do = Ui.litHtmlPolyfillSupport;
Do?.(ur, cr), (Ui.litHtmlVersions ??= []).push("3.3.0");
const xo = (y, s, i) => {
  const f = i?.renderBefore ?? s;
  let u = f._$litPart$;
  if (u === void 0) {
    const m = i?.renderBefore ?? null;
    f._$litPart$ = u = new cr(s.insertBefore(ar(), m), m, void 0, i ?? {});
  }
  return u._$AI(y), u;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Bi = globalThis;
class ir extends pt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const s = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= s.firstChild, s;
  }
  update(s) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(s), this._$Do = xo(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return mt;
  }
}
ir._$litElement$ = !0, ir.finalized = !0, Bi.litElementHydrateSupport?.({ LitElement: ir });
const Fo = Bi.litElementPolyfillSupport;
Fo?.({ LitElement: ir });
(Bi.litElementVersions ??= []).push("4.2.0");
function oo(y) {
  return y && y.__esModule && Object.prototype.hasOwnProperty.call(y, "default") ? y.default : y;
}
var so = { exports: {} };
(function(y) {
  var s = Object.prototype.hasOwnProperty, i = "~";
  function f() {
  }
  Object.create && (f.prototype = /* @__PURE__ */ Object.create(null), new f().__proto__ || (i = !1));
  function u(v, h, E) {
    this.fn = v, this.context = h, this.once = E || !1;
  }
  function m(v, h, E, _, D) {
    if (typeof E != "function")
      throw new TypeError("The listener must be a function");
    var F = new u(E, _ || v, D), x = i ? i + h : h;
    return v._events[x] ? v._events[x].fn ? v._events[x] = [v._events[x], F] : v._events[x].push(F) : (v._events[x] = F, v._eventsCount++), v;
  }
  function w(v, h) {
    --v._eventsCount === 0 ? v._events = new f() : delete v._events[h];
  }
  function b() {
    this._events = new f(), this._eventsCount = 0;
  }
  b.prototype.eventNames = function() {
    var h = [], E, _;
    if (this._eventsCount === 0)
      return h;
    for (_ in E = this._events)
      s.call(E, _) && h.push(i ? _.slice(1) : _);
    return Object.getOwnPropertySymbols ? h.concat(Object.getOwnPropertySymbols(E)) : h;
  }, b.prototype.listeners = function(h) {
    var E = i ? i + h : h, _ = this._events[E];
    if (!_)
      return [];
    if (_.fn)
      return [_.fn];
    for (var D = 0, F = _.length, x = new Array(F); D < F; D++)
      x[D] = _[D].fn;
    return x;
  }, b.prototype.listenerCount = function(h) {
    var E = i ? i + h : h, _ = this._events[E];
    return _ ? _.fn ? 1 : _.length : 0;
  }, b.prototype.emit = function(h, E, _, D, F, x) {
    var N = i ? i + h : h;
    if (!this._events[N])
      return !1;
    var C = this._events[N], K = arguments.length, V, L;
    if (C.fn) {
      switch (C.once && this.removeListener(h, C.fn, void 0, !0), K) {
        case 1:
          return C.fn.call(C.context), !0;
        case 2:
          return C.fn.call(C.context, E), !0;
        case 3:
          return C.fn.call(C.context, E, _), !0;
        case 4:
          return C.fn.call(C.context, E, _, D), !0;
        case 5:
          return C.fn.call(C.context, E, _, D, F), !0;
        case 6:
          return C.fn.call(C.context, E, _, D, F, x), !0;
      }
      for (L = 1, V = new Array(K - 1); L < K; L++)
        V[L - 1] = arguments[L];
      C.fn.apply(C.context, V);
    } else {
      var ke = C.length, W;
      for (L = 0; L < ke; L++)
        switch (C[L].once && this.removeListener(h, C[L].fn, void 0, !0), K) {
          case 1:
            C[L].fn.call(C[L].context);
            break;
          case 2:
            C[L].fn.call(C[L].context, E);
            break;
          case 3:
            C[L].fn.call(C[L].context, E, _);
            break;
          case 4:
            C[L].fn.call(C[L].context, E, _, D);
            break;
          default:
            if (!V)
              for (W = 1, V = new Array(K - 1); W < K; W++)
                V[W - 1] = arguments[W];
            C[L].fn.apply(C[L].context, V);
        }
    }
    return !0;
  }, b.prototype.on = function(h, E, _) {
    return m(this, h, E, _, !1);
  }, b.prototype.once = function(h, E, _) {
    return m(this, h, E, _, !0);
  }, b.prototype.removeListener = function(h, E, _, D) {
    var F = i ? i + h : h;
    if (!this._events[F])
      return this;
    if (!E)
      return w(this, F), this;
    var x = this._events[F];
    if (x.fn)
      x.fn === E && (!D || x.once) && (!_ || x.context === _) && w(this, F);
    else {
      for (var N = 0, C = [], K = x.length; N < K; N++)
        (x[N].fn !== E || D && !x[N].once || _ && x[N].context !== _) && C.push(x[N]);
      C.length ? this._events[F] = C.length === 1 ? C[0] : C : w(this, F);
    }
    return this;
  }, b.prototype.removeAllListeners = function(h) {
    var E;
    return h ? (E = i ? i + h : h, this._events[E] && w(this, E)) : (this._events = new f(), this._eventsCount = 0), this;
  }, b.prototype.off = b.prototype.removeListener, b.prototype.addListener = b.prototype.on, b.prefixed = i, b.EventEmitter = b, y.exports = b;
})(so);
var Ro = so.exports;
const Oi = /* @__PURE__ */ oo(Ro);
function le(...y) {
}
const Uo = (y) => y();
function Mo() {
  this.dispose();
}
const Bo = () => typeof __FASTRX_DEVTOOLS__ < "u";
let Oo = 1;
class yt extends Function {
  toString() {
    return `${this.name}(${this.args.length ? [...this.args].join(", ") : ""})`;
  }
  // pipe(...args: [...Operator<unknown>[], Operator<unknown>]): Observable<unknown> {
  //   return pipe(this as unknown as Observable<T>, ...args);
  // }
  subscribe(s) {
    const i = new Io(s, this, this.streamId++);
    return ae.subscribe({ id: this.id, end: !1 }, { nodeId: i.sourceId, streamId: i.id }), this(i), i;
  }
}
class Li {
  constructor() {
    this.defers = /* @__PURE__ */ new Set(), this.disposed = !1;
  }
  next(s) {
  }
  complete() {
    this.dispose();
  }
  error(s) {
    this.dispose();
  }
  get bindDispose() {
    return () => this.dispose();
  }
  dispose() {
    this.disposed = !0, this.complete = le, this.error = le, this.next = le, this.dispose = le, this.subscribe = le, this.doDefer();
  }
  subscribe(s) {
    return s instanceof yt ? s.subscribe(this) : s(this), this;
  }
  get bindSubscribe() {
    return (s) => this.subscribe(s);
  }
  doDefer() {
    this.defers.forEach(Uo), this.defers.clear();
  }
  defer(s) {
    this.defers.add(s);
  }
  removeDefer(s) {
    this.defers.delete(s);
  }
  reset() {
    this.disposed = !1, delete this.complete, delete this.next, delete this.dispose, delete this.next, delete this.subscribe;
  }
  resetNext() {
    delete this.next;
  }
  resetComplete() {
    delete this.complete;
  }
  resetError() {
    delete this.error;
  }
}
class wt extends Li {
  constructor(s) {
    super(), this.sink = s, s.defer(this.bindDispose);
  }
  next(s) {
    this.sink.next(s);
  }
  complete() {
    this.sink.complete();
  }
  error(s) {
    this.sink.error(s);
  }
}
class Lo extends Li {
  constructor(s, i = le, f = le, u = le) {
    if (super(), this._next = i, this._error = f, this._complete = u, this.then = le, s instanceof yt) {
      const m = { toString: () => "subscribe", id: 0, source: s };
      this.defer(() => {
        ae.defer(m, 0);
      }), ae.create(m), ae.pipe(m), this.sourceId = m.id, this.subscribe(s), ae.subscribe({ id: m.id, end: !0 }), i == le ? this._next = (w) => ae.next(m, 0, w) : this.next = (w) => {
        ae.next(m, 0, w), i(w);
      }, u == le ? this._complete = () => ae.complete(m, 0) : this.complete = () => {
        this.dispose(), ae.complete(m, 0), u();
      }, f == le ? this._error = (w) => ae.complete(m, 0, w) : this.error = (w) => {
        this.dispose(), ae.complete(m, 0, w), f();
      };
    } else
      this.subscribe(s);
  }
  next(s) {
    this._next(s);
  }
  complete() {
    this.dispose(), this._complete();
  }
  error(s) {
    this.dispose(), this._error(s);
  }
}
function hr(y, ...s) {
  return s.reduce((i, f) => f(i), y);
}
function ft(y, s, i) {
  if (Bo()) {
    const f = Object.defineProperties(Object.setPrototypeOf(y, yt.prototype), {
      streamId: { value: 0, writable: !0, configurable: !0 },
      name: { value: s, writable: !0, configurable: !0 },
      args: { value: i, writable: !0, configurable: !0 },
      id: { value: 0, writable: !0, configurable: !0 }
    });
    ae.create(f);
    for (let u = 0; u < i.length; u++) {
      const m = i[u];
      typeof m == "function" && m instanceof yt && ae.addSource(f, m);
    }
    return f;
  }
  return y;
}
function Ii(y, s) {
  return function(...i) {
    return (f) => {
      if (f instanceof yt) {
        const u = ft((m) => {
          const w = new y(m, ...i);
          w.sourceId = u.id, w.subscribe(f);
        }, s, arguments);
        return u.source = f, ae.pipe(u), u;
      } else
        return (u) => f(new y(u, ...i));
    };
  };
}
function Ne(y, s) {
  window.postMessage({ source: "fastrx-devtools-backend", payload: { event: y, payload: s } });
}
class Io extends wt {
  constructor(s, i, f) {
    super(s), this.source = i, this.id = f, this.sourceId = s.sourceId, this.defer(() => {
      ae.defer(this.source, this.id);
    });
  }
  next(s) {
    ae.next(this.source, this.id, s), this.sink.next(s);
  }
  complete() {
    ae.complete(this.source, this.id), this.sink.complete();
  }
  error(s) {
    ae.complete(this.source, this.id, s), this.sink.error(s);
  }
}
const ae = {
  addSource(y, s) {
    Ne("addSource", {
      id: y.id,
      name: y.toString(),
      source: { id: s.id, name: s.toString() }
    });
  },
  next(y, s, i) {
    Ne("next", { id: y.id, streamId: s, data: i && i.toString() });
  },
  subscribe({ id: y, end: s }, i) {
    Ne("subscribe", {
      id: y,
      end: s,
      sink: { nodeId: i && i.nodeId, streamId: i && i.streamId }
    });
  },
  complete(y, s, i) {
    Ne("complete", { id: y.id, streamId: s, err: i ? i.toString() : null });
  },
  defer(y, s) {
    Ne("defer", { id: y.id, streamId: s });
  },
  pipe(y) {
    Ne("pipe", {
      name: y.toString(),
      id: y.id,
      source: { id: y.source.id, name: y.source.toString() }
    });
  },
  update(y) {
    Ne("update", { id: y.id, name: y.toString() });
  },
  create(y) {
    y.id || (y.id = Oo++), Ne("create", { name: y.toString(), id: y.id });
  }
};
class jo extends Li {
  constructor(s) {
    super(), this.source = s, this.sinks = /* @__PURE__ */ new Set();
  }
  add(s) {
    s.defer(() => this.remove(s)), this.sinks.add(s).size === 1 && (this.reset(), this.subscribe(this.source));
  }
  remove(s) {
    this.sinks.delete(s), this.sinks.size === 0 && this.dispose();
  }
  next(s) {
    this.sinks.forEach((i) => i.next(s));
  }
  complete() {
    this.sinks.forEach((s) => s.complete()), this.sinks.clear();
  }
  error(s) {
    this.sinks.forEach((i) => i.error(s)), this.sinks.clear();
  }
}
function zo() {
  return (y) => {
    const s = new jo(y);
    if (y instanceof yt) {
      const i = ft((f) => {
        s.add(f);
      }, "share", arguments);
      return s.sourceId = i.id, i.source = y, ae.pipe(i), i;
    }
    return ft(s.add.bind(s), "share", arguments);
  };
}
globalThis && globalThis.__awaiter;
function Ci(y) {
  const s = arguments, i = zo()(ft((f) => {
    i.next = (u) => f.next(u), i.complete = () => f.complete(), i.error = (u) => f.error(u), y && f.subscribe(y);
  }, "subject", s));
  return i.next = le, i.complete = le, i.error = le, i;
}
function Ai(y, s) {
  return (i) => {
    const f = (u) => i.next(u);
    i.defer(() => s(f)), y(f);
  };
}
function Ti(y, s) {
  if ("on" in y && "off" in y)
    return ft(Ai((i) => y.on(s, i), (i) => y.off(s, i)), "fromEvent", arguments);
  if ("addListener" in y && "removeListener" in y)
    return ft(Ai((i) => y.addListener(s, i), (i) => y.removeListener(s, i)), "fromEvent", arguments);
  if ("addEventListener" in y)
    return ft(Ai((i) => y.addEventListener(s, i), (i) => y.removeEventListener(s, i)), "fromEvent", arguments);
  throw "target is not a EventDispachter";
}
class Ho extends wt {
  constructor(s, i) {
    super(s);
    const f = new wt(s);
    f.next = () => s.complete(), f.complete = Mo, f.subscribe(i);
  }
}
const pr = Ii(Ho, "takeUntil");
class No extends wt {
  constructor(s, i, f) {
    super(s), this.mapper = i, this.thisArg = f;
  }
  next(s) {
    super.next(this.mapper.call(this.thisArg, s));
  }
}
const Vo = Ii(No, "map");
class Wo extends wt {
  constructor(s, i, f) {
    super(s), this.data = i, this.context = f;
  }
  next(s) {
    const i = this.context.combineResults;
    i ? this.sink.next(i(this.data, s)) : this.sink.next(s);
  }
  // 如果complete先于context的complete触发，则激活原始的context的complete
  tryComplete() {
    this.context.resetComplete(), this.dispose();
  }
}
class qo extends wt {
  constructor(s, i, f) {
    super(s), this.makeSource = i, this.combineResults = f, this.index = 0;
  }
  subInner(s, i) {
    const f = this.currentSink = new i(this.sink, s, this);
    this.complete = this.tryComplete, f.complete = f.tryComplete, f.subscribe(this.makeSource(s, this.index++));
  }
  // 如果complete先于inner的complete触发，则不传播complete
  tryComplete() {
    this.currentSink.resetComplete(), this.dispose();
  }
}
class Ji extends Wo {
}
class Xo extends qo {
  next(s) {
    this.subInner(s, Ji), this.next = (i) => {
      this.currentSink.dispose(), this.subInner(i, Ji);
    };
  }
}
const Go = Ii(Xo, "switchMap"), vr = (y = le, s = le, i = le) => (f) => new Lo(f, y, s, i);
class Ko {
  constructor(s) {
    this.id = s, this.type = "", this.codec = "", this.timescale = 0, this.duration = 0, this.language = "und", this.samples = [];
  }
  addSample(s) {
    this.samples.push(s);
  }
  addSamples(s) {
    this.samples.push(...s);
  }
  getSampleCount() {
    return this.samples.length;
  }
  getTotalDuration() {
    return this.samples.reduce((s, i) => s + (i.duration || 0), 0);
  }
}
class Yo {
  /**
   * Create a new Fmp4Parser instance
   * @param debug Whether to enable debug output
   */
  constructor(s = !1) {
    this.HEADER_SIZE = 8, this.sourceUint8Array = null, this.tracks = /* @__PURE__ */ new Map(), this.debug = s;
  }
  /**
   * Set debug mode
   * @param debug Whether to enable debug output
   */
  setDebug(s) {
    this.debug = s;
  }
  /**
   * Parse an fmp4 buffer
   * @param buffer ArrayBuffer containing fmp4 data
   * @returns Array of tracks
   */
  parse(s) {
    this.sourceUint8Array = new Uint8Array(s), this.tracks.clear();
    const i = [];
    let f = 0;
    for (; f < s.byteLength; ) {
      const u = this.parseBox(s, f);
      if (!u)
        break;
      i.push(u), f = u.end, this.debug && this.logBox(u);
    }
    return this.processTrackInfo(i), this.processSampleData(i), this.processCodecInfo(i), Array.from(this.tracks.values());
  }
  /**
   * Process track information from moov box
   */
  processTrackInfo(s) {
    const i = s.find((u) => u.type === "moov");
    if (!i?.children)
      return;
    const f = i.children.filter((u) => u.type === "trak");
    for (const u of f) {
      if (!u.children)
        continue;
      const m = this.findBox(u, "tkhd");
      if (!m?.data)
        continue;
      const w = m.data.trackID, b = new Ko(w), v = this.findBox(u, "mdia");
      if (!v?.children)
        continue;
      const h = this.findBox(v, "hdlr");
      h?.data && (b.type = h.data.handlerType === "vide" ? "video" : h.data.handlerType === "soun" ? "audio" : "unknown");
      const E = this.findBox(v, "mdhd");
      E?.data && (b.timescale = E.data.timescale, b.duration = Number(E.data.duration), b.language = E.data.language);
      const _ = this.findBox(u, "stsd");
      if (_?.data?.entries?.[0]) {
        const D = _.data.entries[0];
        D.data && (b.type === "video" ? (b.width = D.data.width, b.height = D.data.height) : b.type === "audio" && (b.channelCount = D.data.channelCount, b.sampleRate = D.data.sampleRate));
      }
      this.tracks.set(w, b);
    }
  }
  /**
   * Process codec information for all tracks
   */
  processCodecInfo(s) {
    const i = this.generateCodecStrings(s);
    for (const f of this.tracks.values()) {
      const u = i.find(
        (m) => f.type === "video" && m.mimeType === "video/mp4" || f.type === "audio" && m.mimeType === "audio/mp4"
      );
      u && (f.codecInfo = u, f.codec = u.codecString);
    }
  }
  /**
   * Find a box of specific type within a parent box
   */
  findBox(s, i) {
    if (s.children)
      return s.children.find((f) => f.type === i);
  }
  /**
   * Process sample data for all trun boxes
   */
  processSampleData(s) {
    for (let i = 0; i < s.length; i++)
      if (s[i].type === "moof" && i + 1 < s.length && s[i + 1].type === "mdat") {
        const f = s[i], u = s[i + 1];
        if (f.children)
          for (const m of f.children)
            m.type === "traf" && this.processTrafBox(m, f.start, u);
      }
  }
  /**
   * Process a traf box to extract sample data
   */
  processTrafBox(s, i, f) {
    if (!s.children)
      return;
    let u = null, m = null;
    for (const _ of s.children)
      _.type === "tfhd" ? u = _ : _.type === "trun" && (m = _);
    if (!u?.data || !m?.data)
      return;
    const w = u.data.trackID, b = this.tracks.get(w);
    if (!b)
      return;
    const v = m.data;
    if (!v.samples || v.dataOffset === void 0)
      return;
    const h = i + v.dataOffset;
    if (h < f.start + this.HEADER_SIZE || h >= f.end) {
      this.debug && console.warn(`Data offset ${h} is outside mdat box range`);
      return;
    }
    let E = h;
    for (const _ of v.samples) {
      const D = _.size || u.data.defaultSampleSize || 0;
      if (D <= 0)
        continue;
      const F = E, x = F + D;
      x <= f.end && this.sourceUint8Array && (_.dataStart = F, _.dataEnd = x, _.data = this.sourceUint8Array.subarray(F, x), b.addSample(_)), E += D;
    }
  }
  /**
   * Parse a single box from the buffer
   * @param buffer ArrayBuffer containing fmp4 data
   * @param offset Offset to start parsing from
   * @returns Parsed box or null if the buffer is too small
   */
  parseBox(s, i) {
    if (i + this.HEADER_SIZE > s.byteLength)
      return null;
    const u = new DataView(s).getUint32(i, !1), m = new Uint8Array(s, i + 4, 4), w = String.fromCharCode(...m), b = i, v = i + u, h = {
      type: w,
      size: u,
      start: b,
      end: v
    };
    return this.isContainerBox(w) ? h.children = this.parseChildren(s, i + this.HEADER_SIZE, v) : h.data = this.parseBoxData(s, w, i + this.HEADER_SIZE, v), h;
  }
  /**
   * Parse children boxes within a container box
   * @param buffer ArrayBuffer containing fmp4 data
   * @param offset Start offset for children
   * @param end End offset for children
   * @returns Array of child boxes
   */
  parseChildren(s, i, f) {
    const u = [];
    let m = i;
    for (; m < f; ) {
      const w = this.parseBox(s, m);
      if (!w)
        break;
      u.push(w), m = w.end;
    }
    return u;
  }
  /**
   * Parse box data based on box type
   */
  parseBoxData(s, i, f, u) {
    if (u - f <= 0)
      return null;
    switch (i) {
      case "ftyp":
        return this.parseFtypBox(s, f, u);
      case "mvhd":
        return this.parseMvhdBox(s, f, u);
      case "mdhd":
        return this.parseMdhdBox(s, f, u);
      case "hdlr":
        return this.parseHdlrBox(s, f, u);
      case "tkhd":
        return this.parseTkhdBox(s, f, u);
      case "elst":
        return this.parseElstBox(s, f, u);
      case "moof":
      case "mfhd":
        return this.parseMfhdBox(s, f, u);
      case "tfhd":
        return this.parseTfhdBox(s, f, u);
      case "tfdt":
        return this.parseTfdtBox(s, f, u);
      case "trun":
        return this.parseTrunBox(s, f, u);
      case "mdat":
        return this.parseMdatBox(s, f, u);
      case "stsd":
        return this.parseStsdBox(s, f, u);
      case "avc1":
      case "avc3":
        return this.parseAvcBox(s, f, u);
      case "hev1":
      case "hvc1":
        return this.parseHevcBox(s, f, u);
      case "mp4a":
        return this.parseMp4aBox(s, f, u);
      case "avcC":
        return this.parseAvcCBox(s, f, u);
      case "hvcC":
        return this.parseHvcCBox(s, f, u);
      case "esds":
        return this.parseEsdsBox(s, f, u);
      default:
        return new Uint8Array(s.slice(f, u));
    }
  }
  /**
   * Parse 'mdat' box data
   */
  parseMdatBox(s, i, f) {
    return {
      dataSize: f - i,
      dataOffset: i
    };
  }
  /**
   * Check if a box is a container box
   * @param type Box type
   * @returns True if the box is a container box
   */
  isContainerBox(s) {
    return [
      "moov",
      "trak",
      "edts",
      "mdia",
      "minf",
      "dinf",
      "stbl",
      "mvex",
      "moof",
      "traf",
      "mfra",
      "skip",
      "meta",
      "ipro",
      "sinf"
    ].includes(s);
  }
  /**
   * Parse 'ftyp' box data
   */
  parseFtypBox(s, i, f) {
    const u = new DataView(s), m = this.readFourCC(s, i), w = u.getUint32(i + 4, !1), b = [];
    for (let v = i + 8; v < f; v += 4)
      b.push(this.readFourCC(s, v));
    return {
      majorBrand: m,
      minorVersion: w,
      compatibleBrands: b
    };
  }
  /**
   * Parse 'mvhd' box data
   */
  parseMvhdBox(s, i, f) {
    const u = new DataView(s), m = u.getUint8(i), w = u.getUint8(i + 1) << 16 | u.getUint8(i + 2) << 8 | u.getUint8(i + 3);
    let b, v, h, E;
    return m === 1 ? (b = u.getBigUint64(i + 4, !1), v = u.getBigUint64(i + 12, !1), h = u.getUint32(i + 20, !1), E = u.getBigUint64(i + 24, !1)) : (b = u.getUint32(i + 4, !1), v = u.getUint32(i + 8, !1), h = u.getUint32(i + 12, !1), E = u.getUint32(i + 16, !1)), {
      version: m,
      flags: w,
      creationTime: b,
      modificationTime: v,
      timescale: h,
      duration: E
    };
  }
  /**
   * Parse 'mdhd' box data
   */
  parseMdhdBox(s, i, f) {
    const u = new DataView(s), m = u.getUint8(i), w = u.getUint8(i + 1) << 16 | u.getUint8(i + 2) << 8 | u.getUint8(i + 3);
    let b, v, h, E, _;
    return m === 1 ? (b = u.getBigUint64(i + 4, !1), v = u.getBigUint64(i + 12, !1), h = u.getUint32(i + 20, !1), E = u.getBigUint64(i + 24, !1), _ = this.parseLanguage(u.getUint16(i + 32, !1))) : (b = u.getUint32(i + 4, !1), v = u.getUint32(i + 8, !1), h = u.getUint32(i + 12, !1), E = u.getUint32(i + 16, !1), _ = this.parseLanguage(u.getUint16(i + 20, !1))), {
      version: m,
      flags: w,
      creationTime: b,
      modificationTime: v,
      timescale: h,
      duration: E,
      language: _
    };
  }
  /**
   * Parse 'hdlr' box data
   */
  parseHdlrBox(s, i, f) {
    const u = new DataView(s), m = u.getUint8(i), w = u.getUint8(i + 1) << 16 | u.getUint8(i + 2) << 8 | u.getUint8(i + 3), b = this.readFourCC(s, i + 8);
    let v = "", h = i + 24;
    for (; h < f; ) {
      const E = u.getUint8(h);
      if (E === 0)
        break;
      v += String.fromCharCode(E), h++;
    }
    return {
      version: m,
      flags: w,
      handlerType: b,
      name: v
    };
  }
  /**
   * Parse 'tkhd' box data
   */
  parseTkhdBox(s, i, f) {
    const u = new DataView(s), m = u.getUint8(i), w = u.getUint8(i + 1) << 16 | u.getUint8(i + 2) << 8 | u.getUint8(i + 3);
    let b, v, h, E;
    return m === 1 ? (b = u.getBigUint64(i + 4, !1), v = u.getBigUint64(i + 12, !1), h = u.getUint32(i + 20, !1), E = u.getBigUint64(i + 28, !1)) : (b = u.getUint32(i + 4, !1), v = u.getUint32(i + 8, !1), h = u.getUint32(i + 12, !1), E = u.getUint32(i + 20, !1)), {
      version: m,
      flags: w,
      creationTime: b,
      modificationTime: v,
      trackID: h,
      duration: E,
      enabled: (w & 1) !== 0,
      inMovie: (w & 2) !== 0,
      inPreview: (w & 4) !== 0
    };
  }
  /**
   * Parse 'elst' box data
   */
  parseElstBox(s, i, f) {
    const u = new DataView(s), m = u.getUint8(i), w = u.getUint8(i + 1) << 16 | u.getUint8(i + 2) << 8 | u.getUint8(i + 3), b = u.getUint32(i + 4, !1), v = [];
    let h = i + 8;
    for (let E = 0; E < b; E++)
      if (m === 1) {
        const _ = u.getBigUint64(h, !1), D = u.getBigInt64(h + 8, !1), F = u.getInt16(h + 16, !1), x = u.getInt16(h + 18, !1);
        v.push({
          segmentDuration: _,
          mediaTime: D,
          mediaRateInteger: F,
          mediaRateFraction: x
        }), h += 20;
      } else {
        const _ = u.getUint32(h, !1), D = u.getInt32(h + 4, !1), F = u.getInt16(h + 8, !1), x = u.getInt16(h + 10, !1);
        v.push({
          segmentDuration: _,
          mediaTime: D,
          mediaRateInteger: F,
          mediaRateFraction: x
        }), h += 12;
      }
    return {
      version: m,
      flags: w,
      entries: v
    };
  }
  /**
   * Parse 'mfhd' box data
   */
  parseMfhdBox(s, i, f) {
    const u = new DataView(s), m = u.getUint8(i), w = u.getUint8(i + 1) << 16 | u.getUint8(i + 2) << 8 | u.getUint8(i + 3), b = u.getUint32(i + 4, !1);
    return {
      version: m,
      flags: w,
      sequenceNumber: b
    };
  }
  /**
   * Parse 'tfhd' box data
   */
  parseTfhdBox(s, i, f) {
    const u = new DataView(s), m = u.getUint8(i), w = u.getUint8(i + 1) << 16 | u.getUint8(i + 2) << 8 | u.getUint8(i + 3), b = u.getUint32(i + 4, !1);
    let v = i + 8;
    const h = {
      version: m,
      flags: w,
      trackID: b
    };
    return w & 1 && (h.baseDataOffset = u.getBigUint64(v, !1), v += 8), w & 2 && (h.sampleDescriptionIndex = u.getUint32(v, !1), v += 4), w & 8 && (h.defaultSampleDuration = u.getUint32(v, !1), v += 4), w & 16 && (h.defaultSampleSize = u.getUint32(v, !1), v += 4), w & 32 && (h.defaultSampleFlags = u.getUint32(v, !1)), h;
  }
  /**
   * Parse 'tfdt' box data
   */
  parseTfdtBox(s, i, f) {
    const u = new DataView(s), m = u.getUint8(i), w = u.getUint8(i + 1) << 16 | u.getUint8(i + 2) << 8 | u.getUint8(i + 3);
    let b;
    return m === 1 ? b = u.getBigUint64(i + 4, !1) : b = u.getUint32(i + 4, !1), {
      version: m,
      flags: w,
      baseMediaDecodeTime: b
    };
  }
  /**
   * Parse 'trun' box data
   */
  parseTrunBox(s, i, f) {
    const u = new DataView(s), m = u.getUint8(i), w = u.getUint8(i + 1) << 16 | u.getUint8(i + 2) << 8 | u.getUint8(i + 3), b = u.getUint32(i + 4, !1);
    let v = i + 8;
    const h = {
      version: m,
      flags: w,
      sampleCount: b,
      samples: []
    };
    w & 1 && (h.dataOffset = u.getInt32(v, !1), v += 4), w & 4 && (h.firstSampleFlags = u.getUint32(v, !1), v += 4);
    const E = [];
    for (let _ = 0; _ < b; _++) {
      const D = {
        dataStart: 0,
        dataEnd: 0,
        data: new Uint8Array(0),
        // Placeholder, will be set later
        keyFrame: !0
        // Default to true, will be updated based on flags
      };
      if (w & 256 && (D.duration = u.getUint32(v, !1), v += 4), w & 512 && (D.size = u.getUint32(v, !1), v += 4), w & 1024) {
        D.flags = u.getUint32(v, !1);
        const F = D.flags >> 24 & 3;
        D.keyFrame = F === 2, v += 4;
      } else if (_ === 0 && h.firstSampleFlags !== void 0) {
        const F = h.firstSampleFlags >> 24 & 3;
        D.keyFrame = F === 2;
      }
      w & 2048 && (m === 0 ? D.compositionTimeOffset = u.getUint32(v, !1) : D.compositionTimeOffset = u.getInt32(v, !1), v += 4), E.push(D);
    }
    return h.samples = E, h;
  }
  /**
   * Parse language code
   * @param value 16-bit language code
   * @returns ISO language code
   */
  parseLanguage(s) {
    const i = String.fromCharCode((s >> 10 & 31) + 96), f = String.fromCharCode((s >> 5 & 31) + 96), u = String.fromCharCode((s & 31) + 96);
    return i + f + u;
  }
  /**
   * Read a 4-character code from the buffer
   * @param buffer ArrayBuffer containing data
   * @param offset Offset to read from
   * @returns 4-character code as string
   */
  readFourCC(s, i) {
    const f = new Uint8Array(s, i, 4);
    return String.fromCharCode(...f);
  }
  /**
   * Log box information in debug mode
   * @param box Box to log
   * @param depth Nesting depth for indentation
   */
  logBox(s, i = 0) {
    if (!this.debug)
      return;
    const f = "  ".repeat(i);
    if (console.log(`${f}Box: ${s.type}, Size: ${s.size}, Range: ${s.start}-${s.end}`), s.data && console.log(`${f}  Data:`, s.data), s.children && s.children.length > 0) {
      console.log(`${f}  Children (${s.children.length}):`);
      for (const u of s.children)
        this.logBox(u, i + 2);
    }
  }
  /**
   * Utility method to pretty print a box structure
   * @param boxes Parsed box structure
   * @returns Formatted string representation
   */
  printBoxes(s) {
    let i = `FMP4 Structure:
`;
    const f = (u, m = 0) => {
      const w = "  ".repeat(m);
      if (i += `${w}${u.type} (${u.size} bytes)
`, u.data) {
        const b = JSON.stringify(u.data, (v, h) => typeof h == "bigint" ? h.toString() : v === "data" && h instanceof Uint8Array ? `Uint8Array(${h.byteLength} bytes)` : h, 2);
        i += `${w}  Data: ${b}
`;
      }
      if (u.children && u.children.length > 0)
        for (const b of u.children)
          f(b, m + 1);
    };
    for (const u of s)
      f(u);
    return i;
  }
  /**
   * Get all samples for a specific track
   * @param boxes Parsed box structure
   * @param trackId Track ID to find samples for (optional)
   * @returns Array of samples
   */
  getSamples(s, i) {
    const f = [];
    return this.findBoxes(s, "moof").forEach((u) => {
      u.children && u.children.filter((m) => m.type === "traf").forEach((m) => {
        if (!m.children)
          return;
        const w = m.children.find((v) => v.type === "tfhd");
        if (!w || !w.data || i !== void 0 && w.data.trackID !== i)
          return;
        m.children.filter((v) => v.type === "trun").forEach((v) => {
          !v.data || !v.data.samples || v.data.samples.forEach((h) => {
            h.data && h.data.byteLength > 0 && f.push(h);
          });
        });
      });
    }), f;
  }
  /**
   * Find all boxes of a specific type
   * @param boxes Array of boxes to search
   * @param type Box type to find
   * @returns Array of matching boxes
   */
  findBoxes(s, i) {
    const f = [], u = (m) => {
      for (const w of m)
        w.type === i && f.push(w), w.children && w.children.length > 0 && u(w.children);
    };
    return u(s), f;
  }
  /**
   * Parse 'stsd' box data (Sample Description Box)
   */
  parseStsdBox(s, i, f) {
    const u = new DataView(s), m = u.getUint8(i), w = u.getUint8(i + 1) << 16 | u.getUint8(i + 2) << 8 | u.getUint8(i + 3), b = u.getUint32(i + 4, !1);
    let v = i + 8;
    const h = [];
    for (let E = 0; E < b && v < f; E++) {
      const _ = u.getUint32(v, !1), D = this.readFourCC(s, v + 4);
      let F;
      switch (D) {
        case "avc1":
        case "avc3":
          if (F = this.parseAvcBox(s, v + 8, v + _), v + _ > v + 8 + 78) {
            const x = this.parseBox(s, v + 8 + 78);
            x && x.type === "avcC" && (F.avcC = x.data);
          }
          break;
        case "hev1":
        case "hvc1":
          if (F = this.parseHevcBox(s, v + 8, v + _), v + _ > v + 8 + 78) {
            const x = this.parseBox(s, v + 8 + 78);
            x && x.type === "hvcC" && (F.hvcC = x.data);
          }
          break;
        case "mp4a":
          if (F = this.parseMp4aBox(s, v + 8, v + _), v + _ > v + 8 + 28) {
            const x = this.parseBox(s, v + 8 + 28);
            x && x.type === "esds" && (F.esds = x.data);
          }
          break;
        default:
          F = new Uint8Array(s.slice(v + 8, v + _));
      }
      h.push({
        size: _,
        type: D,
        data: F
      }), v += _;
    }
    return {
      version: m,
      flags: w,
      entryCount: b,
      entries: h
    };
  }
  /**
   * Parse AVC Sample Entry box (avc1, avc3)
   */
  parseAvcBox(s, i, f) {
    const u = new DataView(s);
    i += 6;
    const m = u.getUint16(i, !1);
    i += 2, i += 16;
    const w = u.getUint16(i, !1), b = u.getUint16(i + 2, !1), v = u.getUint32(i + 4, !1), h = u.getUint32(i + 8, !1);
    i += 12, i += 4;
    const E = u.getUint16(i, !1);
    i += 2;
    const _ = u.getUint8(i), D = this.readString(s, i + 1, _);
    i += 32;
    const F = u.getUint16(i, !1), x = u.getInt16(i + 2, !1);
    return {
      dataReferenceIndex: m,
      width: w,
      height: b,
      horizresolution: v,
      vertresolution: h,
      frameCount: E,
      compressorName: D,
      depth: F,
      preDefined: x
    };
  }
  /**
   * Parse HEVC Sample Entry box (hev1, hvc1)
   */
  parseHevcBox(s, i, f) {
    return this.parseAvcBox(s, i, f);
  }
  /**
   * Parse MP4 Audio Sample Entry box (mp4a)
   */
  parseMp4aBox(s, i, f) {
    const u = new DataView(s);
    i += 6;
    const m = u.getUint16(i, !1);
    i += 2, i += 8;
    const w = u.getUint16(i, !1), b = u.getUint16(i + 2, !1);
    i += 4, i += 4;
    const v = u.getUint32(i, !1) >> 16;
    return {
      dataReferenceIndex: m,
      channelCount: w,
      sampleSize: b,
      sampleRate: v
    };
  }
  /**
   * Read a string from the buffer
   */
  readString(s, i, f) {
    const u = new Uint8Array(s, i, f);
    return String.fromCharCode(...u).replace(/\0+$/, "");
  }
  /**
   * Parse 'avcC' box data
   */
  parseAvcCBox(s, i, f) {
    const u = new DataView(s);
    return {
      data: new Uint8Array(s, i, f - i),
      configurationVersion: u.getUint8(i),
      profileIndication: u.getUint8(i + 1),
      profileCompatibility: u.getUint8(i + 2),
      levelIndication: u.getUint8(i + 3)
      // There are more fields but we only need these for the codec string
    };
  }
  /**
   * Parse 'hvcC' box data
   */
  parseHvcCBox(s, i, f) {
    const u = new DataView(s);
    return {
      data: new Uint8Array(s, i, f - i),
      configurationVersion: u.getUint8(i),
      generalProfileSpace: u.getUint8(i + 1) >> 6 & 3,
      generalTierFlag: u.getUint8(i + 1) >> 5 & 1,
      generalProfileIdc: u.getUint8(i + 1) & 31,
      generalProfileCompatibilityFlags: u.getUint32(i + 2, !1),
      generalConstraintIndicatorFlags: new DataView(s, i + 6, 6),
      generalLevelIdc: u.getUint8(i + 12),
      minSpatialSegmentationIdc: u.getUint16(i + 13, !1) & 4095,
      parallelismType: u.getUint8(i + 15) & 3
      // There are more fields but we only need these for the codec string
    };
  }
  /**
   * Parse 'esds' box data
   */
  parseEsdsBox(s, i, f) {
    const u = new DataView(s);
    if (i += 4, u.getUint8(i) === 3) {
      const m = this.parseExpandableLength(s, i + 1);
      if (i += 1 + m.bytesRead, i += 3, u.getUint8(i) === 4) {
        const w = this.parseExpandableLength(s, i + 1);
        i += 1 + w.bytesRead;
        const b = {
          objectTypeIndication: (u.getUint8(i) >> 6) + 1,
          streamType: u.getUint8(i + 1) >> 2 & 63,
          bufferSizeDB: (u.getUint8(i + 1) & 3) << 16 | u.getUint8(i + 2) << 8 | u.getUint8(i + 3),
          maxBitrate: u.getUint32(i + 4, !1),
          avgBitrate: u.getUint32(i + 8, !1)
        };
        if (i += 13, i < f && u.getUint8(i) === 5) {
          const v = this.parseExpandableLength(s, i + 1);
          i += 1 + v.bytesRead;
          const h = new Uint8Array(s, i, v.length);
          return i += v.length, {
            decoderConfig: b,
            specificInfo: h,
            data: h
            // Keep the original data field for compatibility
          };
        }
        return {
          decoderConfig: b,
          data: new Uint8Array(0)
          // Empty array if no DecoderSpecificInfo found
        };
      }
    }
    return null;
  }
  /**
   * Parse expandable length field used in esds box
   */
  parseExpandableLength(s, i) {
    const f = new DataView(s);
    let u = 0, m = 0, w;
    do
      w = f.getUint8(i + m), u = u << 7 | w & 127, m++;
    while (w & 128);
    return { length: u, bytesRead: m };
  }
  /**
   * Generate codec string for MSE from codec specific box
   * @param boxes Array of parsed boxes
   * @returns Array of codec info objects containing codec strings and MIME types
   */
  generateCodecStrings(s) {
    const i = [], f = this.findBoxes(s, "stsd");
    for (const u of f)
      if (u.data?.entries)
        for (const m of u.data.entries) {
          const { type: w, data: b } = m;
          switch (w) {
            case "avc1":
            case "avc3": {
              if (b?.avcC) {
                const { profileIndication: v, profileCompatibility: h, levelIndication: E } = b.avcC, _ = `${w}.` + v.toString(16).padStart(2, "0") + h.toString(16).padStart(2, "0") + E.toString(16).padStart(2, "0");
                i.push({
                  codecString: _,
                  mimeType: "video/mp4",
                  extraData: b.avcC.data
                });
              }
              break;
            }
            case "hev1":
            case "hvc1": {
              if (b?.hvcC) {
                const {
                  generalProfileSpace: v,
                  generalProfileIdc: h,
                  generalProfileCompatibilityFlags: E,
                  generalConstraintIndicatorFlags: _,
                  generalLevelIdc: D
                } = b.hvcC, x = (["", "A", "B", "C"][v] || "") + h, N = _.toString(16).padStart(6, "0"), C = D.toString(16).padStart(2, "0"), K = `${w}.${x}.${N}.${C}`;
                i.push({
                  codecString: K,
                  mimeType: "video/mp4",
                  extraData: b.hvcC.data
                });
              }
              break;
            }
            case "mp4a": {
              if (b?.esds?.decoderConfig) {
                const { objectTypeIndication: v } = b.esds.decoderConfig, h = `mp4a.40.${v}`;
                i.push({
                  codecString: h,
                  mimeType: "audio/mp4",
                  extraData: b.esds.data
                });
              }
              break;
            }
          }
        }
    return i;
  }
}
var vt = /* @__PURE__ */ ((y) => (y.VideoCodecInfo = "videoCodecInfo", y.VideoFrame = "videoFrame", y.Error = "error", y))(vt || {}), yr = /* @__PURE__ */ ((y) => (y.AudioCodecInfo = "audioCodecInfo", y.AudioFrame = "audioFrame", y.Error = "error", y))(yr || {}), ao = { exports: {} };
(function(y) {
  var s = Object.prototype.hasOwnProperty, i = "~";
  function f() {
  }
  Object.create && (f.prototype = /* @__PURE__ */ Object.create(null), new f().__proto__ || (i = !1));
  function u(v, h, E) {
    this.fn = v, this.context = h, this.once = E || !1;
  }
  function m(v, h, E, _, D) {
    if (typeof E != "function")
      throw new TypeError("The listener must be a function");
    var F = new u(E, _ || v, D), x = i ? i + h : h;
    return v._events[x] ? v._events[x].fn ? v._events[x] = [v._events[x], F] : v._events[x].push(F) : (v._events[x] = F, v._eventsCount++), v;
  }
  function w(v, h) {
    --v._eventsCount === 0 ? v._events = new f() : delete v._events[h];
  }
  function b() {
    this._events = new f(), this._eventsCount = 0;
  }
  b.prototype.eventNames = function() {
    var h = [], E, _;
    if (this._eventsCount === 0)
      return h;
    for (_ in E = this._events)
      s.call(E, _) && h.push(i ? _.slice(1) : _);
    return Object.getOwnPropertySymbols ? h.concat(Object.getOwnPropertySymbols(E)) : h;
  }, b.prototype.listeners = function(h) {
    var E = i ? i + h : h, _ = this._events[E];
    if (!_)
      return [];
    if (_.fn)
      return [_.fn];
    for (var D = 0, F = _.length, x = new Array(F); D < F; D++)
      x[D] = _[D].fn;
    return x;
  }, b.prototype.listenerCount = function(h) {
    var E = i ? i + h : h, _ = this._events[E];
    return _ ? _.fn ? 1 : _.length : 0;
  }, b.prototype.emit = function(h, E, _, D, F, x) {
    var N = i ? i + h : h;
    if (!this._events[N])
      return !1;
    var C = this._events[N], K = arguments.length, V, L;
    if (C.fn) {
      switch (C.once && this.removeListener(h, C.fn, void 0, !0), K) {
        case 1:
          return C.fn.call(C.context), !0;
        case 2:
          return C.fn.call(C.context, E), !0;
        case 3:
          return C.fn.call(C.context, E, _), !0;
        case 4:
          return C.fn.call(C.context, E, _, D), !0;
        case 5:
          return C.fn.call(C.context, E, _, D, F), !0;
        case 6:
          return C.fn.call(C.context, E, _, D, F, x), !0;
      }
      for (L = 1, V = new Array(K - 1); L < K; L++)
        V[L - 1] = arguments[L];
      C.fn.apply(C.context, V);
    } else {
      var ke = C.length, W;
      for (L = 0; L < ke; L++)
        switch (C[L].once && this.removeListener(h, C[L].fn, void 0, !0), K) {
          case 1:
            C[L].fn.call(C[L].context);
            break;
          case 2:
            C[L].fn.call(C[L].context, E);
            break;
          case 3:
            C[L].fn.call(C[L].context, E, _);
            break;
          case 4:
            C[L].fn.call(C[L].context, E, _, D);
            break;
          default:
            if (!V)
              for (W = 1, V = new Array(K - 1); W < K; W++)
                V[W - 1] = arguments[W];
            C[L].fn.apply(C[L].context, V);
        }
    }
    return !0;
  }, b.prototype.on = function(h, E, _) {
    return m(this, h, E, _, !1);
  }, b.prototype.once = function(h, E, _) {
    return m(this, h, E, _, !0);
  }, b.prototype.removeListener = function(h, E, _, D) {
    var F = i ? i + h : h;
    if (!this._events[F])
      return this;
    if (!E)
      return w(this, F), this;
    var x = this._events[F];
    if (x.fn)
      x.fn === E && (!D || x.once) && (!_ || x.context === _) && w(this, F);
    else {
      for (var N = 0, C = [], K = x.length; N < K; N++)
        (x[N].fn !== E || D && !x[N].once || _ && x[N].context !== _) && C.push(x[N]);
      C.length ? this._events[F] = C.length === 1 ? C[0] : C : w(this, F);
    }
    return this;
  }, b.prototype.removeAllListeners = function(h) {
    var E;
    return h ? (E = i ? i + h : h, this._events[E] && w(this, E)) : (this._events = new f(), this._eventsCount = 0), this;
  }, b.prototype.off = b.prototype.removeListener, b.prototype.addListener = b.prototype.on, b.prefixed = i, b.EventEmitter = b, y.exports = b;
})(ao);
var Jo = ao.exports;
const Zo = /* @__PURE__ */ oo(Jo), Zi = Symbol("instance"), mr = Symbol("cacheResult");
class Di {
  constructor(s, i, f) {
    this.oldState = s, this.newState = i, this.action = f, this.aborted = !1;
  }
  abort(s) {
    this.aborted = !0, sr.call(s, this.oldState, new Error(`action '${this.action}' aborted`));
  }
  toString() {
    return `${this.action}ing`;
  }
}
class wr extends Error {
  /*************  ✨ Codeium Command ⭐  *************/
  /**
     * Create a new instance of FSMError.
     * @param state current state.
     * @param message error message.
     * @param cause original error.
  /******  625fa23f-3ee1-42ac-94bd-4f6ffd4578ff  *******/
  constructor(s, i, f) {
    super(i), this.state = s, this.message = i, this.cause = f;
  }
}
function Qo(y) {
  return typeof y == "object" && y && "then" in y;
}
const or = /* @__PURE__ */ new Map();
function We(y, s, i = {}) {
  return (f, u, m) => {
    const w = i.action || u;
    if (!i.context) {
      const v = or.get(f) || [];
      or.has(f) || or.set(f, v), v.push({ from: y, to: s, action: w });
    }
    const b = m.value;
    m.value = function(...v) {
      let h = this;
      if (i.context && (h = ee.get(typeof i.context == "function" ? i.context.call(this, ...v) : i.context)), h.state === s)
        return i.sync ? h[mr] : Promise.resolve(h[mr]);
      h.state instanceof Di && h.state.action == i.abortAction && h.state.abort(h);
      let E = null;
      Array.isArray(y) ? y.length == 0 ? h.state instanceof Di && h.state.abort(h) : (typeof h.state != "string" || !y.includes(h.state)) && (E = new wr(h._state, `${h.name} ${w} to ${s} failed: current state ${h._state} not from ${y.join("|")}`)) : y !== h.state && (E = new wr(h._state, `${h.name} ${w} to ${s} failed: current state ${h._state} not from ${y}`));
      const _ = (C) => {
        if (i.fail && i.fail.call(this, C), i.sync) {
          if (i.ignoreError)
            return C;
          throw C;
        } else
          return i.ignoreError ? Promise.resolve(C) : Promise.reject(C);
      };
      if (E)
        return _(E);
      const D = h.state, F = new Di(D, s, w);
      sr.call(h, F);
      const x = (C) => {
        var K;
        return h[mr] = C, F.aborted || (sr.call(h, s), (K = i.success) === null || K === void 0 || K.call(this, h[mr])), C;
      }, N = (C) => (sr.call(h, D, C), _(C));
      try {
        const C = b.apply(this, v);
        return Qo(C) ? C.then(x).catch(N) : i.sync ? x(C) : Promise.resolve(x(C));
      } catch (C) {
        return N(new wr(h._state, `${h.name} ${w} from ${y} to ${s} failed: ${C}`, C instanceof Error ? C : new Error(String(C))));
      }
    };
  };
}
function es(...y) {
  return (s, i, f) => {
    const u = f.value, m = i;
    f.value = function(...w) {
      if (!y.includes(this.state.toString()))
        throw new wr(this.state, `${this.name} ${m} failed: current state ${this.state} not in ${y}`);
      return u.apply(this, w);
    };
  };
}
const ts = (() => typeof window < "u" && window.__AFSM__ ? (i, f) => {
  window.dispatchEvent(new CustomEvent(i, { detail: f }));
} : typeof importScripts < "u" ? (i, f) => {
  postMessage({ type: i, payload: f });
} : () => {
})();
function sr(y, s) {
  const i = this._state;
  this._state = y;
  const f = y.toString();
  y && this.emit(f, i), this.emit(ee.STATECHANGED, y, i, s), this.updateDevTools({ value: y, old: i, err: s instanceof Error ? s.message : String(s) });
}
class ee extends Zo {
  constructor(s, i, f) {
    super(), this.name = s, this.groupName = i, this._state = ee.INIT, s || (s = Date.now().toString(36)), f ? Object.setPrototypeOf(this, f) : f = Object.getPrototypeOf(this), i || (this.groupName = this.constructor.name);
    const u = f[Zi];
    u ? this.name = u.name + "-" + u.count++ : f[Zi] = { name: this.name, count: 0 }, this.updateDevTools({ diagram: this.stateDiagram });
  }
  get stateDiagram() {
    const s = Object.getPrototypeOf(this), i = or.get(s) || [];
    let f = /* @__PURE__ */ new Set(), u = [], m = [];
    const w = /* @__PURE__ */ new Set(), b = Object.getPrototypeOf(s);
    or.has(b) && (b.stateDiagram.forEach((h) => f.add(h)), b.allStates.forEach((h) => w.add(h))), i.forEach(({ from: h, to: E, action: _ }) => {
      typeof h == "string" ? u.push({ from: h, to: E, action: _ }) : h.length ? h.forEach((D) => {
        u.push({ from: D, to: E, action: _ });
      }) : m.push({ to: E, action: _ });
    }), u.forEach(({ from: h, to: E, action: _ }) => {
      w.add(h), w.add(E), w.add(_ + "ing"), f.add(`${h} --> ${_}ing : ${_}`), f.add(`${_}ing --> ${E} : ${_} 🟢`), f.add(`${_}ing --> ${h} : ${_} 🔴`);
    }), m.forEach(({ to: h, action: E }) => {
      f.add(`${E}ing --> ${h} : ${E} 🟢`), w.forEach((_) => {
        _ !== h && f.add(`${_} --> ${E}ing : ${E}`);
      });
    });
    const v = [...f];
    return Object.defineProperties(s, {
      stateDiagram: { value: v },
      allStates: { value: w }
    }), v;
  }
  static get(s) {
    let i;
    return typeof s == "string" ? (i = ee.instances.get(s), i || ee.instances.set(s, i = new ee(s, void 0, Object.create(ee.prototype)))) : (i = ee.instances2.get(s), i || ee.instances2.set(s, i = new ee(s.constructor.name, void 0, Object.create(ee.prototype)))), i;
  }
  static getState(s) {
    var i;
    return (i = ee.get(s)) === null || i === void 0 ? void 0 : i.state;
  }
  updateDevTools(s = {}) {
    ts(ee.UPDATEAFSM, Object.assign({ name: this.name, group: this.groupName }, s));
  }
  get state() {
    return this._state;
  }
  set state(s) {
    sr.call(this, s);
  }
}
ee.STATECHANGED = "stateChanged";
ee.UPDATEAFSM = "updateAFSM";
ee.INIT = "[*]";
ee.ON = "on";
ee.OFF = "off";
ee.instances = /* @__PURE__ */ new Map();
ee.instances2 = /* @__PURE__ */ new WeakMap();
var rs = Object.defineProperty, ns = Object.getOwnPropertyDescriptor, kr = (y, s, i, f) => {
  for (var u = f > 1 ? void 0 : f ? ns(s, i) : s, m = y.length - 1, w; m >= 0; m--)
    (w = y[m]) && (u = (f ? w(s, i, u) : w(u)) || u);
  return f && u && rs(s, i, u), u;
};
function is() {
  var y;
  self.onmessage = (s) => {
    if (s.data.type === "init") {
      const { canvas: i, wasmScript: f, wasmBinary: u } = s.data, m = i?.getContext("2d");
      let w = 0, b = 0;
      const v = {
        wasmBinary: u,
        postRun: () => {
          y = new v.VideoDecoder({
            videoInfo(h, E) {
              w = h, b = E, console.log("video info", h, E);
            },
            yuvData(h, E) {
              const _ = w * b, D = _ >> 2;
              let F = v.HEAPU32[h >> 2], x = v.HEAPU32[(h >> 2) + 1], N = v.HEAPU32[(h >> 2) + 2], C = v.HEAPU8.subarray(F, F + _), K = v.HEAPU8.subarray(x, x + D), V = v.HEAPU8.subarray(N, N + D);
              const L = new Uint8Array(_ + D + D);
              L.set(C), L.set(K, _), L.set(V, _ + D);
              const ke = new VideoFrame(L, {
                codedWidth: w,
                codedHeight: b,
                format: "I420",
                timestamp: E
              });
              i ? (m?.drawImage(ke, 0, 0, i.width, i.height), m?.commit()) : self.postMessage({ type: "yuvData", videoFrame: ke }, [ke]);
            }
          }), self.postMessage({ type: "ready" });
        }
      };
      Function("var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;return " + f)()(v);
    } else if (s.data.type === "decode") {
      const { packet: i } = s.data;
      y?.decode(i.data, i.type == "key", i.timestamp);
    } else if (s.data.type === "setCodec") {
      const { codec: i, format: f, description: u } = s.data;
      y?.setCodec(i, f, u ?? "");
    }
  };
}
class $r extends ee {
  constructor(s, i, f = !1, u, m = !1) {
    super(), this.createModule = s, this.wasmBinary = i, this.workerMode = f, this.canvas = u, this.yuvMode = m, this.module = {}, this.width = 0, this.height = 0;
  }
  async initialize(s) {
    if (this.workerMode) {
      const f = /\{(.+)\}/s.exec(is.toString())[1];
      this.worker = new Worker(URL.createObjectURL(new Blob([f], { type: "text/javascript" })));
      const u = this.canvas?.transferControlToOffscreen(), m = await this.wasmBinary;
      return console.warn("worker mode", m), this.worker.postMessage({ type: "init", canvas: u, wasmScript: this.createModule.toString(), wasmBinary: m }, u ? [u, m] : [m]), new Promise((w) => {
        this.worker.onmessage = (b) => {
          if (b.data.type === "ready")
            delete this.wasmBinary, w(), console.warn("worker mode initialize success");
          else if (b.data.type === "yuvData") {
            const { videoFrame: v } = b.data;
            this.emit(vt.VideoFrame, v);
          }
        };
      });
    }
    const i = this.module;
    return this.wasmBinary && (i.wasmBinary = await this.wasmBinary), i.print = (f) => console.log(f), i.printErr = (f) => console.log(`[JS] ERROR: ${f}`), i.onAbort = () => console.log("[JS] FATAL: WASM ABORTED"), new Promise((f) => {
      i.postRun = (u) => {
        this.decoder = new this.module.VideoDecoder(this), console.log("video soft decoder initialize success"), f();
      }, s && Object.assign(i, s), this.createModule(i);
    });
  }
  configure(s) {
    this.config = s;
    const i = this.config.codec.startsWith("avc") ? "avc" : "hevc", f = this.config.description ? i == "avc" ? "avcc" : "hvcc" : "annexb";
    this.decoder?.setCodec(i, f, this.config.description ?? ""), this.worker?.postMessage({ type: "setCodec", codec: i, format: f, description: this.config.description });
  }
  decode(s) {
    this.decoder?.decode(s.data, s.type == "key", s.timestamp), this.state === "configured" && this.worker?.postMessage({ type: "decode", packet: s });
  }
  flush() {
  }
  reset() {
    this.config = void 0, this.decoder && this.decoder.clear();
  }
  close() {
    this.removeAllListeners(), this.decoder && (this.decoder.clear(), this.decoder.delete());
  }
  // wasm callback function
  videoInfo(s, i) {
    this.width = s, this.height = i;
    let f = {
      width: s,
      height: i
    };
    this.emit(vt.VideoCodecInfo, f);
  }
  yuvData(s, i) {
    if (!this.module)
      return;
    const f = this.width * this.height, u = f >> 2;
    let m = this.module.HEAPU32[s >> 2], w = this.module.HEAPU32[(s >> 2) + 1], b = this.module.HEAPU32[(s >> 2) + 2], v = this.module.HEAPU8.subarray(m, m + f), h = this.module.HEAPU8.subarray(w, w + u), E = this.module.HEAPU8.subarray(b, b + u);
    if (this.yuvMode) {
      this.emit(vt.VideoFrame, { y: v, u: h, v: E, timestamp: i });
      return;
    }
    const _ = new Uint8Array(f + u + u);
    _.set(v), _.set(h, f), _.set(E, f + u), this.emit(vt.VideoFrame, new VideoFrame(_, {
      codedWidth: this.width,
      codedHeight: this.height,
      format: "I420",
      timestamp: i
    }));
  }
  errorInfo(s) {
    let i = {
      errMsg: s
    };
    this.emit(vt.Error, i);
  }
}
kr([
  We([ee.INIT, "closed"], "initialized")
], $r.prototype, "initialize", 1);
kr([
  We("initialized", "configured", { sync: !0 })
], $r.prototype, "configure", 1);
kr([
  We([], ee.INIT, { sync: !0 })
], $r.prototype, "reset", 1);
kr([
  We([], "closed", { sync: !0 })
], $r.prototype, "close", 1);
(() => {
  var y = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
  return function(s = {}) {
    var i = s, f, u;
    i.ready = new Promise((e, t) => {
      f = e, u = t;
    });
    var m = Object.assign({}, i), w = "./this.program", b = typeof window == "object", v = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && process.versions.node;
    var h = "";
    function E(e) {
      return i.locateFile ? i.locateFile(e, h) : h + e;
    }
    var _, D, F;
    (b || v) && (v ? h = self.location.href : typeof document < "u" && document.currentScript && (h = document.currentScript.src), y && (h = y), h.indexOf("blob:") !== 0 ? h = h.substr(0, h.replace(/[?#].*/, "").lastIndexOf("/") + 1) : h = "", _ = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.send(null), t.responseText;
    }, v && (F = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
    }), D = (e, t, r) => {
      var n = new XMLHttpRequest();
      n.open("GET", e, !0), n.responseType = "arraybuffer", n.onload = () => {
        if (n.status == 200 || n.status == 0 && n.response) {
          t(n.response);
          return;
        }
        r();
      }, n.onerror = r, n.send(null);
    });
    var x = i.print || console.log.bind(console), N = i.printErr || console.error.bind(console);
    Object.assign(i, m), m = null, i.arguments && i.arguments, i.thisProgram && (w = i.thisProgram), i.quit && i.quit;
    var C;
    i.wasmBinary && (C = i.wasmBinary), i.noExitRuntime, typeof WebAssembly != "object" && he("no native wasm support detected");
    var K, V, L = !1;
    function ke(e, t) {
      e || he(t);
    }
    var W, Y, ce, xe, U, B, _t, Et;
    function Pr() {
      var e = K.buffer;
      i.HEAP8 = W = new Int8Array(e), i.HEAP16 = ce = new Int16Array(e), i.HEAP32 = U = new Int32Array(e), i.HEAPU8 = Y = new Uint8Array(e), i.HEAPU16 = xe = new Uint16Array(e), i.HEAPU32 = B = new Uint32Array(e), i.HEAPF32 = _t = new Float32Array(e), i.HEAPF64 = Et = new Float64Array(e);
    }
    var bt, kt = [], $t = [], Pt = [];
    function Sr() {
      if (i.preRun)
        for (typeof i.preRun == "function" && (i.preRun = [i.preRun]); i.preRun.length; )
          Tr(i.preRun.shift());
      Xe(kt);
    }
    function Cr() {
      !i.noFSInit && !o.init.initialized && o.init(), o.ignorePermissions = !1, Xe($t);
    }
    function Ar() {
      if (i.postRun)
        for (typeof i.postRun == "function" && (i.postRun = [i.postRun]); i.postRun.length; )
          xr(i.postRun.shift());
      Xe(Pt);
    }
    function Tr(e) {
      kt.unshift(e);
    }
    function Dr(e) {
      $t.unshift(e);
    }
    function xr(e) {
      Pt.unshift(e);
    }
    var fe = 0, $e = null;
    function lo(e) {
      return e;
    }
    function qe(e) {
      fe++, i.monitorRunDependencies && i.monitorRunDependencies(fe);
    }
    function Fe(e) {
      if (fe--, i.monitorRunDependencies && i.monitorRunDependencies(fe), fe == 0 && $e) {
        var t = $e;
        $e = null, t();
      }
    }
    function he(e) {
      i.onAbort && i.onAbort(e), e = "Aborted(" + e + ")", N(e), L = !0, e += ". Build with -sASSERTIONS for more info.";
      var t = new WebAssembly.RuntimeError(e);
      throw u(t), t;
    }
    var Fr = "data:application/octet-stream;base64,";
    function St(e) {
      return e.startsWith(Fr);
    }
    var ye;
    ye = "videodec.wasm", St(ye) || (ye = E(ye));
    function Ct(e) {
      if (e == ye && C)
        return new Uint8Array(C);
      if (F)
        return F(e);
      throw "both async and sync fetching of the wasm failed";
    }
    function Rr(e) {
      return !C && (b || v) && typeof fetch == "function" ? fetch(e, { credentials: "same-origin" }).then((t) => {
        if (!t.ok)
          throw "failed to load wasm binary file at '" + e + "'";
        return t.arrayBuffer();
      }).catch(() => Ct(e)) : Promise.resolve().then(() => Ct(e));
    }
    function At(e, t, r) {
      return Rr(e).then((n) => WebAssembly.instantiate(n, t)).then((n) => n).then(r, (n) => {
        N("failed to asynchronously prepare wasm: " + n), he(n);
      });
    }
    function Ur(e, t, r, n) {
      return !e && typeof WebAssembly.instantiateStreaming == "function" && !St(t) && typeof fetch == "function" ? fetch(t, { credentials: "same-origin" }).then((a) => {
        var l = WebAssembly.instantiateStreaming(a, r);
        return l.then(n, function(d) {
          return N("wasm streaming compile failed: " + d), N("falling back to ArrayBuffer instantiation"), At(t, r, n);
        });
      }) : At(t, r, n);
    }
    function Mr() {
      var e = { a: Pi };
      function t(n, a) {
        var l = n.exports;
        return V = l, K = V.E, Pr(), bt = V.H, Dr(V.F), Fe(), l;
      }
      qe();
      function r(n) {
        t(n.instance);
      }
      if (i.instantiateWasm)
        try {
          return i.instantiateWasm(e, t);
        } catch (n) {
          N("Module.instantiateWasm callback failed with error: " + n), u(n);
        }
      return Ur(C, ye, e, r).catch(u), {};
    }
    var T, j, Xe = (e) => {
      for (; e.length > 0; )
        e.shift()(i);
    };
    function Br(e) {
      this.excPtr = e, this.ptr = e - 24, this.set_type = function(t) {
        B[this.ptr + 4 >> 2] = t;
      }, this.get_type = function() {
        return B[this.ptr + 4 >> 2];
      }, this.set_destructor = function(t) {
        B[this.ptr + 8 >> 2] = t;
      }, this.get_destructor = function() {
        return B[this.ptr + 8 >> 2];
      }, this.set_caught = function(t) {
        t = t ? 1 : 0, W[this.ptr + 12 >> 0] = t;
      }, this.get_caught = function() {
        return W[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(t) {
        t = t ? 1 : 0, W[this.ptr + 13 >> 0] = t;
      }, this.get_rethrown = function() {
        return W[this.ptr + 13 >> 0] != 0;
      }, this.init = function(t, r) {
        this.set_adjusted_ptr(0), this.set_type(t), this.set_destructor(r);
      }, this.set_adjusted_ptr = function(t) {
        B[this.ptr + 16 >> 2] = t;
      }, this.get_adjusted_ptr = function() {
        return B[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var t = er(this.get_type());
        if (t)
          return B[this.excPtr >> 2];
        var r = this.get_adjusted_ptr();
        return r !== 0 ? r : this.excPtr;
      };
    }
    var Tt = 0;
    function Or(e, t, r) {
      var n = new Br(e);
      throw n.init(t, r), Tt = e, Tt;
    }
    var Lr = (e) => (U[Zt() >> 2] = e, e), O = { isAbs: (e) => e.charAt(0) === "/", splitPath: (e) => {
      var t = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
      return t.exec(e).slice(1);
    }, normalizeArray: (e, t) => {
      for (var r = 0, n = e.length - 1; n >= 0; n--) {
        var a = e[n];
        a === "." ? e.splice(n, 1) : a === ".." ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--);
      }
      if (t)
        for (; r; r--)
          e.unshift("..");
      return e;
    }, normalize: (e) => {
      var t = O.isAbs(e), r = e.substr(-1) === "/";
      return e = O.normalizeArray(e.split("/").filter((n) => !!n), !t).join("/"), !e && !t && (e = "."), e && r && (e += "/"), (t ? "/" : "") + e;
    }, dirname: (e) => {
      var t = O.splitPath(e), r = t[0], n = t[1];
      return !r && !n ? "." : (n && (n = n.substr(0, n.length - 1)), r + n);
    }, basename: (e) => {
      if (e === "/")
        return "/";
      e = O.normalize(e), e = e.replace(/\/$/, "");
      var t = e.lastIndexOf("/");
      return t === -1 ? e : e.substr(t + 1);
    }, join: function() {
      var e = Array.prototype.slice.call(arguments);
      return O.normalize(e.join("/"));
    }, join2: (e, t) => O.normalize(e + "/" + t) }, Ir = () => {
      if (typeof crypto == "object" && typeof crypto.getRandomValues == "function")
        return (e) => crypto.getRandomValues(e);
      he("initRandomDevice");
    }, Dt = (e) => (Dt = Ir())(e), re = { resolve: function() {
      for (var e = "", t = !1, r = arguments.length - 1; r >= -1 && !t; r--) {
        var n = r >= 0 ? arguments[r] : o.cwd();
        if (typeof n != "string")
          throw new TypeError("Arguments to path.resolve must be strings");
        if (!n)
          return "";
        e = n + "/" + e, t = O.isAbs(n);
      }
      return e = O.normalizeArray(e.split("/").filter((a) => !!a), !t).join("/"), (t ? "/" : "") + e || ".";
    }, relative: (e, t) => {
      e = re.resolve(e).substr(1), t = re.resolve(t).substr(1);
      function r(p) {
        for (var $ = 0; $ < p.length && p[$] === ""; $++)
          ;
        for (var S = p.length - 1; S >= 0 && p[S] === ""; S--)
          ;
        return $ > S ? [] : p.slice($, S - $ + 1);
      }
      for (var n = r(e.split("/")), a = r(t.split("/")), l = Math.min(n.length, a.length), d = l, c = 0; c < l; c++)
        if (n[c] !== a[c]) {
          d = c;
          break;
        }
      for (var g = [], c = d; c < n.length; c++)
        g.push("..");
      return g = g.concat(a.slice(d)), g.join("/");
    } }, xt = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, we = (e, t, r) => {
      for (var n = t + r, a = t; e[a] && !(a >= n); )
        ++a;
      if (a - t > 16 && e.buffer && xt)
        return xt.decode(e.subarray(t, a));
      for (var l = ""; t < a; ) {
        var d = e[t++];
        if (!(d & 128)) {
          l += String.fromCharCode(d);
          continue;
        }
        var c = e[t++] & 63;
        if ((d & 224) == 192) {
          l += String.fromCharCode((d & 31) << 6 | c);
          continue;
        }
        var g = e[t++] & 63;
        if ((d & 240) == 224 ? d = (d & 15) << 12 | c << 6 | g : d = (d & 7) << 18 | c << 12 | g << 6 | e[t++] & 63, d < 65536)
          l += String.fromCharCode(d);
        else {
          var p = d - 65536;
          l += String.fromCharCode(55296 | p >> 10, 56320 | p & 1023);
        }
      }
      return l;
    }, Ge = [], Ke = (e) => {
      for (var t = 0, r = 0; r < e.length; ++r) {
        var n = e.charCodeAt(r);
        n <= 127 ? t++ : n <= 2047 ? t += 2 : n >= 55296 && n <= 57343 ? (t += 4, ++r) : t += 3;
      }
      return t;
    }, Ye = (e, t, r, n) => {
      if (!(n > 0))
        return 0;
      for (var a = r, l = r + n - 1, d = 0; d < e.length; ++d) {
        var c = e.charCodeAt(d);
        if (c >= 55296 && c <= 57343) {
          var g = e.charCodeAt(++d);
          c = 65536 + ((c & 1023) << 10) | g & 1023;
        }
        if (c <= 127) {
          if (r >= l)
            break;
          t[r++] = c;
        } else if (c <= 2047) {
          if (r + 1 >= l)
            break;
          t[r++] = 192 | c >> 6, t[r++] = 128 | c & 63;
        } else if (c <= 65535) {
          if (r + 2 >= l)
            break;
          t[r++] = 224 | c >> 12, t[r++] = 128 | c >> 6 & 63, t[r++] = 128 | c & 63;
        } else {
          if (r + 3 >= l)
            break;
          t[r++] = 240 | c >> 18, t[r++] = 128 | c >> 12 & 63, t[r++] = 128 | c >> 6 & 63, t[r++] = 128 | c & 63;
        }
      }
      return t[r] = 0, r - a;
    };
    function Je(e, t, r) {
      var n = r > 0 ? r : Ke(e) + 1, a = new Array(n), l = Ye(e, a, 0, a.length);
      return t && (a.length = l), a;
    }
    var jr = () => {
      if (!Ge.length) {
        var e = null;
        if (typeof window < "u" && typeof window.prompt == "function" ? (e = window.prompt("Input: "), e !== null && (e += `
`)) : typeof readline == "function" && (e = readline(), e !== null && (e += `
`)), !e)
          return null;
        Ge = Je(e, !0);
      }
      return Ge.shift();
    }, pe = { ttys: [], init: function() {
    }, shutdown: function() {
    }, register: function(e, t) {
      pe.ttys[e] = { input: [], output: [], ops: t }, o.registerDevice(e, pe.stream_ops);
    }, stream_ops: { open: function(e) {
      var t = pe.ttys[e.node.rdev];
      if (!t)
        throw new o.ErrnoError(43);
      e.tty = t, e.seekable = !1;
    }, close: function(e) {
      e.tty.ops.fsync(e.tty);
    }, fsync: function(e) {
      e.tty.ops.fsync(e.tty);
    }, read: function(e, t, r, n, a) {
      if (!e.tty || !e.tty.ops.get_char)
        throw new o.ErrnoError(60);
      for (var l = 0, d = 0; d < n; d++) {
        var c;
        try {
          c = e.tty.ops.get_char(e.tty);
        } catch {
          throw new o.ErrnoError(29);
        }
        if (c === void 0 && l === 0)
          throw new o.ErrnoError(6);
        if (c == null)
          break;
        l++, t[r + d] = c;
      }
      return l && (e.node.timestamp = Date.now()), l;
    }, write: function(e, t, r, n, a) {
      if (!e.tty || !e.tty.ops.put_char)
        throw new o.ErrnoError(60);
      try {
        for (var l = 0; l < n; l++)
          e.tty.ops.put_char(e.tty, t[r + l]);
      } catch {
        throw new o.ErrnoError(29);
      }
      return n && (e.node.timestamp = Date.now()), l;
    } }, default_tty_ops: { get_char: function(e) {
      return jr();
    }, put_char: function(e, t) {
      t === null || t === 10 ? (x(we(e.output, 0)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync: function(e) {
      e.output && e.output.length > 0 && (x(we(e.output, 0)), e.output = []);
    }, ioctl_tcgets: function(e) {
      return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    }, ioctl_tcsets: function(e, t, r) {
      return 0;
    }, ioctl_tiocgwinsz: function(e) {
      return [24, 80];
    } }, default_tty1_ops: { put_char: function(e, t) {
      t === null || t === 10 ? (N(we(e.output, 0)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync: function(e) {
      e.output && e.output.length > 0 && (N(we(e.output, 0)), e.output = []);
    } } }, Ft = (e) => {
      he();
    }, R = { ops_table: null, mount(e) {
      return R.createNode(null, "/", 16895, 0);
    }, createNode(e, t, r, n) {
      if (o.isBlkdev(r) || o.isFIFO(r))
        throw new o.ErrnoError(63);
      R.ops_table || (R.ops_table = { dir: { node: { getattr: R.node_ops.getattr, setattr: R.node_ops.setattr, lookup: R.node_ops.lookup, mknod: R.node_ops.mknod, rename: R.node_ops.rename, unlink: R.node_ops.unlink, rmdir: R.node_ops.rmdir, readdir: R.node_ops.readdir, symlink: R.node_ops.symlink }, stream: { llseek: R.stream_ops.llseek } }, file: { node: { getattr: R.node_ops.getattr, setattr: R.node_ops.setattr }, stream: { llseek: R.stream_ops.llseek, read: R.stream_ops.read, write: R.stream_ops.write, allocate: R.stream_ops.allocate, mmap: R.stream_ops.mmap, msync: R.stream_ops.msync } }, link: { node: { getattr: R.node_ops.getattr, setattr: R.node_ops.setattr, readlink: R.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: R.node_ops.getattr, setattr: R.node_ops.setattr }, stream: o.chrdev_stream_ops } });
      var a = o.createNode(e, t, r, n);
      return o.isDir(a.mode) ? (a.node_ops = R.ops_table.dir.node, a.stream_ops = R.ops_table.dir.stream, a.contents = {}) : o.isFile(a.mode) ? (a.node_ops = R.ops_table.file.node, a.stream_ops = R.ops_table.file.stream, a.usedBytes = 0, a.contents = null) : o.isLink(a.mode) ? (a.node_ops = R.ops_table.link.node, a.stream_ops = R.ops_table.link.stream) : o.isChrdev(a.mode) && (a.node_ops = R.ops_table.chrdev.node, a.stream_ops = R.ops_table.chrdev.stream), a.timestamp = Date.now(), e && (e.contents[t] = a, e.timestamp = a.timestamp), a;
    }, getFileDataAsTypedArray(e) {
      return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
    }, expandFileStorage(e, t) {
      var r = e.contents ? e.contents.length : 0;
      if (!(r >= t)) {
        var n = 1024 * 1024;
        t = Math.max(t, r * (r < n ? 2 : 1.125) >>> 0), r != 0 && (t = Math.max(t, 256));
        var a = e.contents;
        e.contents = new Uint8Array(t), e.usedBytes > 0 && e.contents.set(a.subarray(0, e.usedBytes), 0);
      }
    }, resizeFileStorage(e, t) {
      if (e.usedBytes != t)
        if (t == 0)
          e.contents = null, e.usedBytes = 0;
        else {
          var r = e.contents;
          e.contents = new Uint8Array(t), r && e.contents.set(r.subarray(0, Math.min(t, e.usedBytes))), e.usedBytes = t;
        }
    }, node_ops: { getattr(e) {
      var t = {};
      return t.dev = o.isChrdev(e.mode) ? e.id : 1, t.ino = e.id, t.mode = e.mode, t.nlink = 1, t.uid = 0, t.gid = 0, t.rdev = e.rdev, o.isDir(e.mode) ? t.size = 4096 : o.isFile(e.mode) ? t.size = e.usedBytes : o.isLink(e.mode) ? t.size = e.link.length : t.size = 0, t.atime = new Date(e.timestamp), t.mtime = new Date(e.timestamp), t.ctime = new Date(e.timestamp), t.blksize = 4096, t.blocks = Math.ceil(t.size / t.blksize), t;
    }, setattr(e, t) {
      t.mode !== void 0 && (e.mode = t.mode), t.timestamp !== void 0 && (e.timestamp = t.timestamp), t.size !== void 0 && R.resizeFileStorage(e, t.size);
    }, lookup(e, t) {
      throw o.genericErrors[44];
    }, mknod(e, t, r, n) {
      return R.createNode(e, t, r, n);
    }, rename(e, t, r) {
      if (o.isDir(e.mode)) {
        var n;
        try {
          n = o.lookupNode(t, r);
        } catch {
        }
        if (n)
          for (var a in n.contents)
            throw new o.ErrnoError(55);
      }
      delete e.parent.contents[e.name], e.parent.timestamp = Date.now(), e.name = r, t.contents[r] = e, t.timestamp = e.parent.timestamp, e.parent = t;
    }, unlink(e, t) {
      delete e.contents[t], e.timestamp = Date.now();
    }, rmdir(e, t) {
      var r = o.lookupNode(e, t);
      for (var n in r.contents)
        throw new o.ErrnoError(55);
      delete e.contents[t], e.timestamp = Date.now();
    }, readdir(e) {
      var t = [".", ".."];
      for (var r in e.contents)
        e.contents.hasOwnProperty(r) && t.push(r);
      return t;
    }, symlink(e, t, r) {
      var n = R.createNode(e, t, 41471, 0);
      return n.link = r, n;
    }, readlink(e) {
      if (!o.isLink(e.mode))
        throw new o.ErrnoError(28);
      return e.link;
    } }, stream_ops: { read(e, t, r, n, a) {
      var l = e.node.contents;
      if (a >= e.node.usedBytes)
        return 0;
      var d = Math.min(e.node.usedBytes - a, n);
      if (d > 8 && l.subarray)
        t.set(l.subarray(a, a + d), r);
      else
        for (var c = 0; c < d; c++)
          t[r + c] = l[a + c];
      return d;
    }, write(e, t, r, n, a, l) {
      if (!n)
        return 0;
      var d = e.node;
      if (d.timestamp = Date.now(), t.subarray && (!d.contents || d.contents.subarray)) {
        if (l)
          return d.contents = t.subarray(r, r + n), d.usedBytes = n, n;
        if (d.usedBytes === 0 && a === 0)
          return d.contents = t.slice(r, r + n), d.usedBytes = n, n;
        if (a + n <= d.usedBytes)
          return d.contents.set(t.subarray(r, r + n), a), n;
      }
      if (R.expandFileStorage(d, a + n), d.contents.subarray && t.subarray)
        d.contents.set(t.subarray(r, r + n), a);
      else
        for (var c = 0; c < n; c++)
          d.contents[a + c] = t[r + c];
      return d.usedBytes = Math.max(d.usedBytes, a + n), n;
    }, llseek(e, t, r) {
      var n = t;
      if (r === 1 ? n += e.position : r === 2 && o.isFile(e.node.mode) && (n += e.node.usedBytes), n < 0)
        throw new o.ErrnoError(28);
      return n;
    }, allocate(e, t, r) {
      R.expandFileStorage(e.node, t + r), e.node.usedBytes = Math.max(e.node.usedBytes, t + r);
    }, mmap(e, t, r, n, a) {
      if (!o.isFile(e.node.mode))
        throw new o.ErrnoError(43);
      var l, d, c = e.node.contents;
      if (!(a & 2) && c.buffer === W.buffer)
        d = !1, l = c.byteOffset;
      else {
        if ((r > 0 || r + t < c.length) && (c.subarray ? c = c.subarray(r, r + t) : c = Array.prototype.slice.call(c, r, r + t)), d = !0, l = Ft(), !l)
          throw new o.ErrnoError(48);
        W.set(c, l);
      }
      return { ptr: l, allocated: d };
    }, msync(e, t, r, n, a) {
      return R.stream_ops.write(e, t, 0, n, r, !1), 0;
    } } }, zr = (e, t, r, n) => {
      var a = n ? "" : `al ${e}`;
      D(e, (l) => {
        ke(l, `Loading data file "${e}" failed (no arrayBuffer).`), t(new Uint8Array(l)), a && Fe();
      }, (l) => {
        if (r)
          r();
        else
          throw `Loading data file "${e}" failed.`;
      }), a && qe();
    }, Hr = i.preloadPlugins || [];
    function Nr(e, t, r, n) {
      typeof Browser < "u" && Browser.init();
      var a = !1;
      return Hr.forEach(function(l) {
        a || l.canHandle(t) && (l.handle(e, t, r, n), a = !0);
      }), a;
    }
    function Vr(e, t, r, n, a, l, d, c, g, p) {
      var $ = t ? re.resolve(O.join2(e, t)) : e;
      function S(P) {
        function k(A) {
          p && p(), c || o.createDataFile(e, t, A, n, a, g), l && l(), Fe();
        }
        Nr(P, $, k, () => {
          d && d(), Fe();
        }) || k(P);
      }
      qe(), typeof r == "string" ? zr(r, (P) => S(P), d) : S(r);
    }
    function Wr(e) {
      var t = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }, r = t[e];
      if (typeof r > "u")
        throw new Error(`Unknown file open mode: ${e}`);
      return r;
    }
    function Ze(e, t) {
      var r = 0;
      return e && (r |= 365), t && (r |= 146), r;
    }
    var o = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: !1, ignorePermissions: !0, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, lookupPath: (e, t = {}) => {
      if (e = re.resolve(e), !e)
        return { path: "", node: null };
      var r = { follow_mount: !0, recurse_count: 0 };
      if (t = Object.assign(r, t), t.recurse_count > 8)
        throw new o.ErrnoError(32);
      for (var n = e.split("/").filter((S) => !!S), a = o.root, l = "/", d = 0; d < n.length; d++) {
        var c = d === n.length - 1;
        if (c && t.parent)
          break;
        if (a = o.lookupNode(a, n[d]), l = O.join2(l, n[d]), o.isMountpoint(a) && (!c || c && t.follow_mount) && (a = a.mounted.root), !c || t.follow)
          for (var g = 0; o.isLink(a.mode); ) {
            var p = o.readlink(l);
            l = re.resolve(O.dirname(l), p);
            var $ = o.lookupPath(l, { recurse_count: t.recurse_count + 1 });
            if (a = $.node, g++ > 40)
              throw new o.ErrnoError(32);
          }
      }
      return { path: l, node: a };
    }, getPath: (e) => {
      for (var t; ; ) {
        if (o.isRoot(e)) {
          var r = e.mount.mountpoint;
          return t ? r[r.length - 1] !== "/" ? `${r}/${t}` : r + t : r;
        }
        t = t ? `${e.name}/${t}` : e.name, e = e.parent;
      }
    }, hashName: (e, t) => {
      for (var r = 0, n = 0; n < t.length; n++)
        r = (r << 5) - r + t.charCodeAt(n) | 0;
      return (e + r >>> 0) % o.nameTable.length;
    }, hashAddNode: (e) => {
      var t = o.hashName(e.parent.id, e.name);
      e.name_next = o.nameTable[t], o.nameTable[t] = e;
    }, hashRemoveNode: (e) => {
      var t = o.hashName(e.parent.id, e.name);
      if (o.nameTable[t] === e)
        o.nameTable[t] = e.name_next;
      else
        for (var r = o.nameTable[t]; r; ) {
          if (r.name_next === e) {
            r.name_next = e.name_next;
            break;
          }
          r = r.name_next;
        }
    }, lookupNode: (e, t) => {
      var r = o.mayLookup(e);
      if (r)
        throw new o.ErrnoError(r, e);
      for (var n = o.hashName(e.id, t), a = o.nameTable[n]; a; a = a.name_next) {
        var l = a.name;
        if (a.parent.id === e.id && l === t)
          return a;
      }
      return o.lookup(e, t);
    }, createNode: (e, t, r, n) => {
      var a = new o.FSNode(e, t, r, n);
      return o.hashAddNode(a), a;
    }, destroyNode: (e) => {
      o.hashRemoveNode(e);
    }, isRoot: (e) => e === e.parent, isMountpoint: (e) => !!e.mounted, isFile: (e) => (e & 61440) === 32768, isDir: (e) => (e & 61440) === 16384, isLink: (e) => (e & 61440) === 40960, isChrdev: (e) => (e & 61440) === 8192, isBlkdev: (e) => (e & 61440) === 24576, isFIFO: (e) => (e & 61440) === 4096, isSocket: (e) => (e & 49152) === 49152, flagsToPermissionString: (e) => {
      var t = ["r", "w", "rw"][e & 3];
      return e & 512 && (t += "w"), t;
    }, nodePermissions: (e, t) => o.ignorePermissions ? 0 : t.includes("r") && !(e.mode & 292) || t.includes("w") && !(e.mode & 146) || t.includes("x") && !(e.mode & 73) ? 2 : 0, mayLookup: (e) => {
      var t = o.nodePermissions(e, "x");
      return t || (e.node_ops.lookup ? 0 : 2);
    }, mayCreate: (e, t) => {
      try {
        var r = o.lookupNode(e, t);
        return 20;
      } catch {
      }
      return o.nodePermissions(e, "wx");
    }, mayDelete: (e, t, r) => {
      var n;
      try {
        n = o.lookupNode(e, t);
      } catch (l) {
        return l.errno;
      }
      var a = o.nodePermissions(e, "wx");
      if (a)
        return a;
      if (r) {
        if (!o.isDir(n.mode))
          return 54;
        if (o.isRoot(n) || o.getPath(n) === o.cwd())
          return 10;
      } else if (o.isDir(n.mode))
        return 31;
      return 0;
    }, mayOpen: (e, t) => e ? o.isLink(e.mode) ? 32 : o.isDir(e.mode) && (o.flagsToPermissionString(t) !== "r" || t & 512) ? 31 : o.nodePermissions(e, o.flagsToPermissionString(t)) : 44, MAX_OPEN_FDS: 4096, nextfd: () => {
      for (var e = 0; e <= o.MAX_OPEN_FDS; e++)
        if (!o.streams[e])
          return e;
      throw new o.ErrnoError(33);
    }, getStreamChecked: (e) => {
      var t = o.getStream(e);
      if (!t)
        throw new o.ErrnoError(8);
      return t;
    }, getStream: (e) => o.streams[e], createStream: (e, t = -1) => (o.FSStream || (o.FSStream = function() {
      this.shared = {};
    }, o.FSStream.prototype = {}, Object.defineProperties(o.FSStream.prototype, { object: { get() {
      return this.node;
    }, set(r) {
      this.node = r;
    } }, isRead: { get() {
      return (this.flags & 2097155) !== 1;
    } }, isWrite: { get() {
      return (this.flags & 2097155) !== 0;
    } }, isAppend: { get() {
      return this.flags & 1024;
    } }, flags: { get() {
      return this.shared.flags;
    }, set(r) {
      this.shared.flags = r;
    } }, position: { get() {
      return this.shared.position;
    }, set(r) {
      this.shared.position = r;
    } } })), e = Object.assign(new o.FSStream(), e), t == -1 && (t = o.nextfd()), e.fd = t, o.streams[t] = e, e), closeStream: (e) => {
      o.streams[e] = null;
    }, chrdev_stream_ops: { open: (e) => {
      var t = o.getDevice(e.node.rdev);
      e.stream_ops = t.stream_ops, e.stream_ops.open && e.stream_ops.open(e);
    }, llseek: () => {
      throw new o.ErrnoError(70);
    } }, major: (e) => e >> 8, minor: (e) => e & 255, makedev: (e, t) => e << 8 | t, registerDevice: (e, t) => {
      o.devices[e] = { stream_ops: t };
    }, getDevice: (e) => o.devices[e], getMounts: (e) => {
      for (var t = [], r = [e]; r.length; ) {
        var n = r.pop();
        t.push(n), r.push.apply(r, n.mounts);
      }
      return t;
    }, syncfs: (e, t) => {
      typeof e == "function" && (t = e, e = !1), o.syncFSRequests++, o.syncFSRequests > 1 && N(`warning: ${o.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
      var r = o.getMounts(o.root.mount), n = 0;
      function a(d) {
        return o.syncFSRequests--, t(d);
      }
      function l(d) {
        if (d)
          return l.errored ? void 0 : (l.errored = !0, a(d));
        ++n >= r.length && a(null);
      }
      r.forEach((d) => {
        if (!d.type.syncfs)
          return l(null);
        d.type.syncfs(d, e, l);
      });
    }, mount: (e, t, r) => {
      var n = r === "/", a = !r, l;
      if (n && o.root)
        throw new o.ErrnoError(10);
      if (!n && !a) {
        var d = o.lookupPath(r, { follow_mount: !1 });
        if (r = d.path, l = d.node, o.isMountpoint(l))
          throw new o.ErrnoError(10);
        if (!o.isDir(l.mode))
          throw new o.ErrnoError(54);
      }
      var c = { type: e, opts: t, mountpoint: r, mounts: [] }, g = e.mount(c);
      return g.mount = c, c.root = g, n ? o.root = g : l && (l.mounted = c, l.mount && l.mount.mounts.push(c)), g;
    }, unmount: (e) => {
      var t = o.lookupPath(e, { follow_mount: !1 });
      if (!o.isMountpoint(t.node))
        throw new o.ErrnoError(28);
      var r = t.node, n = r.mounted, a = o.getMounts(n);
      Object.keys(o.nameTable).forEach((d) => {
        for (var c = o.nameTable[d]; c; ) {
          var g = c.name_next;
          a.includes(c.mount) && o.destroyNode(c), c = g;
        }
      }), r.mounted = null;
      var l = r.mount.mounts.indexOf(n);
      r.mount.mounts.splice(l, 1);
    }, lookup: (e, t) => e.node_ops.lookup(e, t), mknod: (e, t, r) => {
      var n = o.lookupPath(e, { parent: !0 }), a = n.node, l = O.basename(e);
      if (!l || l === "." || l === "..")
        throw new o.ErrnoError(28);
      var d = o.mayCreate(a, l);
      if (d)
        throw new o.ErrnoError(d);
      if (!a.node_ops.mknod)
        throw new o.ErrnoError(63);
      return a.node_ops.mknod(a, l, t, r);
    }, create: (e, t) => (t = t !== void 0 ? t : 438, t &= 4095, t |= 32768, o.mknod(e, t, 0)), mkdir: (e, t) => (t = t !== void 0 ? t : 511, t &= 1023, t |= 16384, o.mknod(e, t, 0)), mkdirTree: (e, t) => {
      for (var r = e.split("/"), n = "", a = 0; a < r.length; ++a)
        if (r[a]) {
          n += "/" + r[a];
          try {
            o.mkdir(n, t);
          } catch (l) {
            if (l.errno != 20)
              throw l;
          }
        }
    }, mkdev: (e, t, r) => (typeof r > "u" && (r = t, t = 438), t |= 8192, o.mknod(e, t, r)), symlink: (e, t) => {
      if (!re.resolve(e))
        throw new o.ErrnoError(44);
      var r = o.lookupPath(t, { parent: !0 }), n = r.node;
      if (!n)
        throw new o.ErrnoError(44);
      var a = O.basename(t), l = o.mayCreate(n, a);
      if (l)
        throw new o.ErrnoError(l);
      if (!n.node_ops.symlink)
        throw new o.ErrnoError(63);
      return n.node_ops.symlink(n, a, e);
    }, rename: (e, t) => {
      var r = O.dirname(e), n = O.dirname(t), a = O.basename(e), l = O.basename(t), d, c, g;
      if (d = o.lookupPath(e, { parent: !0 }), c = d.node, d = o.lookupPath(t, { parent: !0 }), g = d.node, !c || !g)
        throw new o.ErrnoError(44);
      if (c.mount !== g.mount)
        throw new o.ErrnoError(75);
      var p = o.lookupNode(c, a), $ = re.relative(e, n);
      if ($.charAt(0) !== ".")
        throw new o.ErrnoError(28);
      if ($ = re.relative(t, r), $.charAt(0) !== ".")
        throw new o.ErrnoError(55);
      var S;
      try {
        S = o.lookupNode(g, l);
      } catch {
      }
      if (p !== S) {
        var P = o.isDir(p.mode), k = o.mayDelete(c, a, P);
        if (k)
          throw new o.ErrnoError(k);
        if (k = S ? o.mayDelete(g, l, P) : o.mayCreate(g, l), k)
          throw new o.ErrnoError(k);
        if (!c.node_ops.rename)
          throw new o.ErrnoError(63);
        if (o.isMountpoint(p) || S && o.isMountpoint(S))
          throw new o.ErrnoError(10);
        if (g !== c && (k = o.nodePermissions(c, "w"), k))
          throw new o.ErrnoError(k);
        o.hashRemoveNode(p);
        try {
          c.node_ops.rename(p, g, l);
        } catch (A) {
          throw A;
        } finally {
          o.hashAddNode(p);
        }
      }
    }, rmdir: (e) => {
      var t = o.lookupPath(e, { parent: !0 }), r = t.node, n = O.basename(e), a = o.lookupNode(r, n), l = o.mayDelete(r, n, !0);
      if (l)
        throw new o.ErrnoError(l);
      if (!r.node_ops.rmdir)
        throw new o.ErrnoError(63);
      if (o.isMountpoint(a))
        throw new o.ErrnoError(10);
      r.node_ops.rmdir(r, n), o.destroyNode(a);
    }, readdir: (e) => {
      var t = o.lookupPath(e, { follow: !0 }), r = t.node;
      if (!r.node_ops.readdir)
        throw new o.ErrnoError(54);
      return r.node_ops.readdir(r);
    }, unlink: (e) => {
      var t = o.lookupPath(e, { parent: !0 }), r = t.node;
      if (!r)
        throw new o.ErrnoError(44);
      var n = O.basename(e), a = o.lookupNode(r, n), l = o.mayDelete(r, n, !1);
      if (l)
        throw new o.ErrnoError(l);
      if (!r.node_ops.unlink)
        throw new o.ErrnoError(63);
      if (o.isMountpoint(a))
        throw new o.ErrnoError(10);
      r.node_ops.unlink(r, n), o.destroyNode(a);
    }, readlink: (e) => {
      var t = o.lookupPath(e), r = t.node;
      if (!r)
        throw new o.ErrnoError(44);
      if (!r.node_ops.readlink)
        throw new o.ErrnoError(28);
      return re.resolve(o.getPath(r.parent), r.node_ops.readlink(r));
    }, stat: (e, t) => {
      var r = o.lookupPath(e, { follow: !t }), n = r.node;
      if (!n)
        throw new o.ErrnoError(44);
      if (!n.node_ops.getattr)
        throw new o.ErrnoError(63);
      return n.node_ops.getattr(n);
    }, lstat: (e) => o.stat(e, !0), chmod: (e, t, r) => {
      var n;
      if (typeof e == "string") {
        var a = o.lookupPath(e, { follow: !r });
        n = a.node;
      } else
        n = e;
      if (!n.node_ops.setattr)
        throw new o.ErrnoError(63);
      n.node_ops.setattr(n, { mode: t & 4095 | n.mode & -4096, timestamp: Date.now() });
    }, lchmod: (e, t) => {
      o.chmod(e, t, !0);
    }, fchmod: (e, t) => {
      var r = o.getStreamChecked(e);
      o.chmod(r.node, t);
    }, chown: (e, t, r, n) => {
      var a;
      if (typeof e == "string") {
        var l = o.lookupPath(e, { follow: !n });
        a = l.node;
      } else
        a = e;
      if (!a.node_ops.setattr)
        throw new o.ErrnoError(63);
      a.node_ops.setattr(a, { timestamp: Date.now() });
    }, lchown: (e, t, r) => {
      o.chown(e, t, r, !0);
    }, fchown: (e, t, r) => {
      var n = o.getStreamChecked(e);
      o.chown(n.node, t, r);
    }, truncate: (e, t) => {
      if (t < 0)
        throw new o.ErrnoError(28);
      var r;
      if (typeof e == "string") {
        var n = o.lookupPath(e, { follow: !0 });
        r = n.node;
      } else
        r = e;
      if (!r.node_ops.setattr)
        throw new o.ErrnoError(63);
      if (o.isDir(r.mode))
        throw new o.ErrnoError(31);
      if (!o.isFile(r.mode))
        throw new o.ErrnoError(28);
      var a = o.nodePermissions(r, "w");
      if (a)
        throw new o.ErrnoError(a);
      r.node_ops.setattr(r, { size: t, timestamp: Date.now() });
    }, ftruncate: (e, t) => {
      var r = o.getStreamChecked(e);
      if (!(r.flags & 2097155))
        throw new o.ErrnoError(28);
      o.truncate(r.node, t);
    }, utime: (e, t, r) => {
      var n = o.lookupPath(e, { follow: !0 }), a = n.node;
      a.node_ops.setattr(a, { timestamp: Math.max(t, r) });
    }, open: (e, t, r) => {
      if (e === "")
        throw new o.ErrnoError(44);
      t = typeof t == "string" ? Wr(t) : t, r = typeof r > "u" ? 438 : r, t & 64 ? r = r & 4095 | 32768 : r = 0;
      var n;
      if (typeof e == "object")
        n = e;
      else {
        e = O.normalize(e);
        try {
          var a = o.lookupPath(e, { follow: !(t & 131072) });
          n = a.node;
        } catch {
        }
      }
      var l = !1;
      if (t & 64)
        if (n) {
          if (t & 128)
            throw new o.ErrnoError(20);
        } else
          n = o.mknod(e, r, 0), l = !0;
      if (!n)
        throw new o.ErrnoError(44);
      if (o.isChrdev(n.mode) && (t &= -513), t & 65536 && !o.isDir(n.mode))
        throw new o.ErrnoError(54);
      if (!l) {
        var d = o.mayOpen(n, t);
        if (d)
          throw new o.ErrnoError(d);
      }
      t & 512 && !l && o.truncate(n, 0), t &= -131713;
      var c = o.createStream({ node: n, path: o.getPath(n), flags: t, seekable: !0, position: 0, stream_ops: n.stream_ops, ungotten: [], error: !1 });
      return c.stream_ops.open && c.stream_ops.open(c), i.logReadFiles && !(t & 1) && (o.readFiles || (o.readFiles = {}), e in o.readFiles || (o.readFiles[e] = 1)), c;
    }, close: (e) => {
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      e.getdents && (e.getdents = null);
      try {
        e.stream_ops.close && e.stream_ops.close(e);
      } catch (t) {
        throw t;
      } finally {
        o.closeStream(e.fd);
      }
      e.fd = null;
    }, isClosed: (e) => e.fd === null, llseek: (e, t, r) => {
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if (!e.seekable || !e.stream_ops.llseek)
        throw new o.ErrnoError(70);
      if (r != 0 && r != 1 && r != 2)
        throw new o.ErrnoError(28);
      return e.position = e.stream_ops.llseek(e, t, r), e.ungotten = [], e.position;
    }, read: (e, t, r, n, a) => {
      if (n < 0 || a < 0)
        throw new o.ErrnoError(28);
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if ((e.flags & 2097155) === 1)
        throw new o.ErrnoError(8);
      if (o.isDir(e.node.mode))
        throw new o.ErrnoError(31);
      if (!e.stream_ops.read)
        throw new o.ErrnoError(28);
      var l = typeof a < "u";
      if (!l)
        a = e.position;
      else if (!e.seekable)
        throw new o.ErrnoError(70);
      var d = e.stream_ops.read(e, t, r, n, a);
      return l || (e.position += d), d;
    }, write: (e, t, r, n, a, l) => {
      if (n < 0 || a < 0)
        throw new o.ErrnoError(28);
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if (!(e.flags & 2097155))
        throw new o.ErrnoError(8);
      if (o.isDir(e.node.mode))
        throw new o.ErrnoError(31);
      if (!e.stream_ops.write)
        throw new o.ErrnoError(28);
      e.seekable && e.flags & 1024 && o.llseek(e, 0, 2);
      var d = typeof a < "u";
      if (!d)
        a = e.position;
      else if (!e.seekable)
        throw new o.ErrnoError(70);
      var c = e.stream_ops.write(e, t, r, n, a, l);
      return d || (e.position += c), c;
    }, allocate: (e, t, r) => {
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if (t < 0 || r <= 0)
        throw new o.ErrnoError(28);
      if (!(e.flags & 2097155))
        throw new o.ErrnoError(8);
      if (!o.isFile(e.node.mode) && !o.isDir(e.node.mode))
        throw new o.ErrnoError(43);
      if (!e.stream_ops.allocate)
        throw new o.ErrnoError(138);
      e.stream_ops.allocate(e, t, r);
    }, mmap: (e, t, r, n, a) => {
      if (n & 2 && !(a & 2) && (e.flags & 2097155) !== 2)
        throw new o.ErrnoError(2);
      if ((e.flags & 2097155) === 1)
        throw new o.ErrnoError(2);
      if (!e.stream_ops.mmap)
        throw new o.ErrnoError(43);
      return e.stream_ops.mmap(e, t, r, n, a);
    }, msync: (e, t, r, n, a) => e.stream_ops.msync ? e.stream_ops.msync(e, t, r, n, a) : 0, munmap: (e) => 0, ioctl: (e, t, r) => {
      if (!e.stream_ops.ioctl)
        throw new o.ErrnoError(59);
      return e.stream_ops.ioctl(e, t, r);
    }, readFile: (e, t = {}) => {
      if (t.flags = t.flags || 0, t.encoding = t.encoding || "binary", t.encoding !== "utf8" && t.encoding !== "binary")
        throw new Error(`Invalid encoding type "${t.encoding}"`);
      var r, n = o.open(e, t.flags), a = o.stat(e), l = a.size, d = new Uint8Array(l);
      return o.read(n, d, 0, l, 0), t.encoding === "utf8" ? r = we(d, 0) : t.encoding === "binary" && (r = d), o.close(n), r;
    }, writeFile: (e, t, r = {}) => {
      r.flags = r.flags || 577;
      var n = o.open(e, r.flags, r.mode);
      if (typeof t == "string") {
        var a = new Uint8Array(Ke(t) + 1), l = Ye(t, a, 0, a.length);
        o.write(n, a, 0, l, void 0, r.canOwn);
      } else if (ArrayBuffer.isView(t))
        o.write(n, t, 0, t.byteLength, void 0, r.canOwn);
      else
        throw new Error("Unsupported data type");
      o.close(n);
    }, cwd: () => o.currentPath, chdir: (e) => {
      var t = o.lookupPath(e, { follow: !0 });
      if (t.node === null)
        throw new o.ErrnoError(44);
      if (!o.isDir(t.node.mode))
        throw new o.ErrnoError(54);
      var r = o.nodePermissions(t.node, "x");
      if (r)
        throw new o.ErrnoError(r);
      o.currentPath = t.path;
    }, createDefaultDirectories: () => {
      o.mkdir("/tmp"), o.mkdir("/home"), o.mkdir("/home/web_user");
    }, createDefaultDevices: () => {
      o.mkdir("/dev"), o.registerDevice(o.makedev(1, 3), { read: () => 0, write: (n, a, l, d, c) => d }), o.mkdev("/dev/null", o.makedev(1, 3)), pe.register(o.makedev(5, 0), pe.default_tty_ops), pe.register(o.makedev(6, 0), pe.default_tty1_ops), o.mkdev("/dev/tty", o.makedev(5, 0)), o.mkdev("/dev/tty1", o.makedev(6, 0));
      var e = new Uint8Array(1024), t = 0, r = () => (t === 0 && (t = Dt(e).byteLength), e[--t]);
      o.createDevice("/dev", "random", r), o.createDevice("/dev", "urandom", r), o.mkdir("/dev/shm"), o.mkdir("/dev/shm/tmp");
    }, createSpecialDirectories: () => {
      o.mkdir("/proc");
      var e = o.mkdir("/proc/self");
      o.mkdir("/proc/self/fd"), o.mount({ mount: () => {
        var t = o.createNode(e, "fd", 16895, 73);
        return t.node_ops = { lookup: (r, n) => {
          var a = +n, l = o.getStreamChecked(a), d = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => l.path } };
          return d.parent = d, d;
        } }, t;
      } }, {}, "/proc/self/fd");
    }, createStandardStreams: () => {
      i.stdin ? o.createDevice("/dev", "stdin", i.stdin) : o.symlink("/dev/tty", "/dev/stdin"), i.stdout ? o.createDevice("/dev", "stdout", null, i.stdout) : o.symlink("/dev/tty", "/dev/stdout"), i.stderr ? o.createDevice("/dev", "stderr", null, i.stderr) : o.symlink("/dev/tty1", "/dev/stderr"), o.open("/dev/stdin", 0), o.open("/dev/stdout", 1), o.open("/dev/stderr", 1);
    }, ensureErrnoError: () => {
      o.ErrnoError || (o.ErrnoError = function(t, r) {
        this.name = "ErrnoError", this.node = r, this.setErrno = function(n) {
          this.errno = n;
        }, this.setErrno(t), this.message = "FS error";
      }, o.ErrnoError.prototype = new Error(), o.ErrnoError.prototype.constructor = o.ErrnoError, [44].forEach((e) => {
        o.genericErrors[e] = new o.ErrnoError(e), o.genericErrors[e].stack = "<generic error, no stack>";
      }));
    }, staticInit: () => {
      o.ensureErrnoError(), o.nameTable = new Array(4096), o.mount(R, {}, "/"), o.createDefaultDirectories(), o.createDefaultDevices(), o.createSpecialDirectories(), o.filesystems = { MEMFS: R };
    }, init: (e, t, r) => {
      o.init.initialized = !0, o.ensureErrnoError(), i.stdin = e || i.stdin, i.stdout = t || i.stdout, i.stderr = r || i.stderr, o.createStandardStreams();
    }, quit: () => {
      o.init.initialized = !1;
      for (var e = 0; e < o.streams.length; e++) {
        var t = o.streams[e];
        t && o.close(t);
      }
    }, findObject: (e, t) => {
      var r = o.analyzePath(e, t);
      return r.exists ? r.object : null;
    }, analyzePath: (e, t) => {
      try {
        var r = o.lookupPath(e, { follow: !t });
        e = r.path;
      } catch {
      }
      var n = { isRoot: !1, exists: !1, error: 0, name: null, path: null, object: null, parentExists: !1, parentPath: null, parentObject: null };
      try {
        var r = o.lookupPath(e, { parent: !0 });
        n.parentExists = !0, n.parentPath = r.path, n.parentObject = r.node, n.name = O.basename(e), r = o.lookupPath(e, { follow: !t }), n.exists = !0, n.path = r.path, n.object = r.node, n.name = r.node.name, n.isRoot = r.path === "/";
      } catch (a) {
        n.error = a.errno;
      }
      return n;
    }, createPath: (e, t, r, n) => {
      e = typeof e == "string" ? e : o.getPath(e);
      for (var a = t.split("/").reverse(); a.length; ) {
        var l = a.pop();
        if (l) {
          var d = O.join2(e, l);
          try {
            o.mkdir(d);
          } catch {
          }
          e = d;
        }
      }
      return d;
    }, createFile: (e, t, r, n, a) => {
      var l = O.join2(typeof e == "string" ? e : o.getPath(e), t), d = Ze(n, a);
      return o.create(l, d);
    }, createDataFile: (e, t, r, n, a, l) => {
      var d = t;
      e && (e = typeof e == "string" ? e : o.getPath(e), d = t ? O.join2(e, t) : e);
      var c = Ze(n, a), g = o.create(d, c);
      if (r) {
        if (typeof r == "string") {
          for (var p = new Array(r.length), $ = 0, S = r.length; $ < S; ++$)
            p[$] = r.charCodeAt($);
          r = p;
        }
        o.chmod(g, c | 146);
        var P = o.open(g, 577);
        o.write(P, r, 0, r.length, 0, l), o.close(P), o.chmod(g, c);
      }
      return g;
    }, createDevice: (e, t, r, n) => {
      var a = O.join2(typeof e == "string" ? e : o.getPath(e), t), l = Ze(!!r, !!n);
      o.createDevice.major || (o.createDevice.major = 64);
      var d = o.makedev(o.createDevice.major++, 0);
      return o.registerDevice(d, { open: (c) => {
        c.seekable = !1;
      }, close: (c) => {
        n && n.buffer && n.buffer.length && n(10);
      }, read: (c, g, p, $, S) => {
        for (var P = 0, k = 0; k < $; k++) {
          var A;
          try {
            A = r();
          } catch {
            throw new o.ErrnoError(29);
          }
          if (A === void 0 && P === 0)
            throw new o.ErrnoError(6);
          if (A == null)
            break;
          P++, g[p + k] = A;
        }
        return P && (c.node.timestamp = Date.now()), P;
      }, write: (c, g, p, $, S) => {
        for (var P = 0; P < $; P++)
          try {
            n(g[p + P]);
          } catch {
            throw new o.ErrnoError(29);
          }
        return $ && (c.node.timestamp = Date.now()), P;
      } }), o.mkdev(a, l, d);
    }, forceLoadFile: (e) => {
      if (e.isDevice || e.isFolder || e.link || e.contents)
        return !0;
      if (typeof XMLHttpRequest < "u")
        throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
      if (_)
        try {
          e.contents = Je(_(e.url), !0), e.usedBytes = e.contents.length;
        } catch {
          throw new o.ErrnoError(29);
        }
      else
        throw new Error("Cannot load without read() or XMLHttpRequest.");
    }, createLazyFile: (e, t, r, n, a) => {
      function l() {
        this.lengthKnown = !1, this.chunks = [];
      }
      if (l.prototype.get = function(k) {
        if (!(k > this.length - 1 || k < 0)) {
          var A = k % this.chunkSize, I = k / this.chunkSize | 0;
          return this.getter(I)[A];
        }
      }, l.prototype.setDataGetter = function(k) {
        this.getter = k;
      }, l.prototype.cacheLength = function() {
        var k = new XMLHttpRequest();
        if (k.open("HEAD", r, !1), k.send(null), !(k.status >= 200 && k.status < 300 || k.status === 304))
          throw new Error("Couldn't load " + r + ". Status: " + k.status);
        var A = Number(k.getResponseHeader("Content-length")), I, z = (I = k.getResponseHeader("Accept-Ranges")) && I === "bytes", q = (I = k.getResponseHeader("Content-Encoding")) && I === "gzip", J = 1024 * 1024;
        z || (J = A);
        var H = (Q, se) => {
          if (Q > se)
            throw new Error("invalid range (" + Q + ", " + se + ") or no bytes requested!");
          if (se > A - 1)
            throw new Error("only " + A + " bytes available! programmer error!");
          var X = new XMLHttpRequest();
          if (X.open("GET", r, !1), A !== J && X.setRequestHeader("Range", "bytes=" + Q + "-" + se), X.responseType = "arraybuffer", X.overrideMimeType && X.overrideMimeType("text/plain; charset=x-user-defined"), X.send(null), !(X.status >= 200 && X.status < 300 || X.status === 304))
            throw new Error("Couldn't load " + r + ". Status: " + X.status);
          return X.response !== void 0 ? new Uint8Array(X.response || []) : Je(X.responseText || "", !0);
        }, me = this;
        me.setDataGetter((Q) => {
          var se = Q * J, X = (Q + 1) * J - 1;
          if (X = Math.min(X, A - 1), typeof me.chunks[Q] > "u" && (me.chunks[Q] = H(se, X)), typeof me.chunks[Q] > "u")
            throw new Error("doXHR failed!");
          return me.chunks[Q];
        }), (q || !A) && (J = A = 1, A = this.getter(0).length, J = A, x("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = A, this._chunkSize = J, this.lengthKnown = !0;
      }, typeof XMLHttpRequest < "u") {
        if (!v)
          throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
        var d = new l();
        Object.defineProperties(d, { length: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._length;
        } }, chunkSize: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._chunkSize;
        } } });
        var c = { isDevice: !1, contents: d };
      } else
        var c = { isDevice: !1, url: r };
      var g = o.createFile(e, t, c, n, a);
      c.contents ? g.contents = c.contents : c.url && (g.contents = null, g.url = c.url), Object.defineProperties(g, { usedBytes: { get: function() {
        return this.contents.length;
      } } });
      var p = {}, $ = Object.keys(g.stream_ops);
      $.forEach((P) => {
        var k = g.stream_ops[P];
        p[P] = function() {
          return o.forceLoadFile(g), k.apply(null, arguments);
        };
      });
      function S(P, k, A, I, z) {
        var q = P.node.contents;
        if (z >= q.length)
          return 0;
        var J = Math.min(q.length - z, I);
        if (q.slice)
          for (var H = 0; H < J; H++)
            k[A + H] = q[z + H];
        else
          for (var H = 0; H < J; H++)
            k[A + H] = q.get(z + H);
        return J;
      }
      return p.read = (P, k, A, I, z) => (o.forceLoadFile(g), S(P, k, A, I, z)), p.mmap = (P, k, A, I, z) => {
        o.forceLoadFile(g);
        var q = Ft();
        if (!q)
          throw new o.ErrnoError(48);
        return S(P, W, q, k, A), { ptr: q, allocated: !0 };
      }, g.stream_ops = p, g;
    } }, Rt = (e, t) => e ? we(Y, e, t) : "", G = { DEFAULT_POLLMASK: 5, calculateAt: function(e, t, r) {
      if (O.isAbs(t))
        return t;
      var n;
      if (e === -100)
        n = o.cwd();
      else {
        var a = G.getStreamFromFD(e);
        n = a.path;
      }
      if (t.length == 0) {
        if (!r)
          throw new o.ErrnoError(44);
        return n;
      }
      return O.join2(n, t);
    }, doStat: function(e, t, r) {
      try {
        var n = e(t);
      } catch (c) {
        if (c && c.node && O.normalize(t) !== O.normalize(o.getPath(c.node)))
          return -54;
        throw c;
      }
      U[r >> 2] = n.dev, U[r + 4 >> 2] = n.mode, B[r + 8 >> 2] = n.nlink, U[r + 12 >> 2] = n.uid, U[r + 16 >> 2] = n.gid, U[r + 20 >> 2] = n.rdev, j = [n.size >>> 0, (T = n.size, +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[r + 24 >> 2] = j[0], U[r + 28 >> 2] = j[1], U[r + 32 >> 2] = 4096, U[r + 36 >> 2] = n.blocks;
      var a = n.atime.getTime(), l = n.mtime.getTime(), d = n.ctime.getTime();
      return j = [Math.floor(a / 1e3) >>> 0, (T = Math.floor(a / 1e3), +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[r + 40 >> 2] = j[0], U[r + 44 >> 2] = j[1], B[r + 48 >> 2] = a % 1e3 * 1e3, j = [Math.floor(l / 1e3) >>> 0, (T = Math.floor(l / 1e3), +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[r + 56 >> 2] = j[0], U[r + 60 >> 2] = j[1], B[r + 64 >> 2] = l % 1e3 * 1e3, j = [Math.floor(d / 1e3) >>> 0, (T = Math.floor(d / 1e3), +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[r + 72 >> 2] = j[0], U[r + 76 >> 2] = j[1], B[r + 80 >> 2] = d % 1e3 * 1e3, j = [n.ino >>> 0, (T = n.ino, +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[r + 88 >> 2] = j[0], U[r + 92 >> 2] = j[1], 0;
    }, doMsync: function(e, t, r, n, a) {
      if (!o.isFile(t.node.mode))
        throw new o.ErrnoError(43);
      if (n & 2)
        return 0;
      var l = Y.slice(e, e + r);
      o.msync(t, l, a, r, n);
    }, varargs: void 0, get() {
      G.varargs += 4;
      var e = U[G.varargs - 4 >> 2];
      return e;
    }, getStr(e) {
      var t = Rt(e);
      return t;
    }, getStreamFromFD: function(e) {
      var t = o.getStreamChecked(e);
      return t;
    } };
    function qr(e, t, r) {
      G.varargs = r;
      try {
        var n = G.getStreamFromFD(e);
        switch (t) {
          case 0: {
            var a = G.get();
            if (a < 0)
              return -28;
            var l;
            return l = o.createStream(n, a), l.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return n.flags;
          case 4: {
            var a = G.get();
            return n.flags |= a, 0;
          }
          case 5: {
            var a = G.get(), d = 0;
            return ce[a + d >> 1] = 2, 0;
          }
          case 6:
          case 7:
            return 0;
          case 16:
          case 8:
            return -28;
          case 9:
            return Lr(28), -1;
          default:
            return -28;
        }
      } catch (c) {
        if (typeof o > "u" || c.name !== "ErrnoError")
          throw c;
        return -c.errno;
      }
    }
    function Xr(e, t, r, n) {
      G.varargs = n;
      try {
        t = G.getStr(t), t = G.calculateAt(e, t);
        var a = n ? G.get() : 0;
        return o.open(t, r, a).fd;
      } catch (l) {
        if (typeof o > "u" || l.name !== "ErrnoError")
          throw l;
        return -l.errno;
      }
    }
    function Gr(e, t, r, n, a) {
    }
    function Qe(e) {
      switch (e) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError(`Unknown type size: ${e}`);
      }
    }
    function Kr() {
      for (var e = new Array(256), t = 0; t < 256; ++t)
        e[t] = String.fromCharCode(t);
      Ut = e;
    }
    var Ut = void 0;
    function Z(e) {
      for (var t = "", r = e; Y[r]; )
        t += Ut[Y[r++]];
      return t;
    }
    var _e = {}, ve = {}, Re = {}, Ee = void 0;
    function M(e) {
      throw new Ee(e);
    }
    var Mt = void 0;
    function Ue(e) {
      throw new Mt(e);
    }
    function Pe(e, t, r) {
      e.forEach(function(c) {
        Re[c] = t;
      });
      function n(c) {
        var g = r(c);
        g.length !== e.length && Ue("Mismatched type converter count");
        for (var p = 0; p < e.length; ++p)
          ne(e[p], g[p]);
      }
      var a = new Array(t.length), l = [], d = 0;
      t.forEach((c, g) => {
        ve.hasOwnProperty(c) ? a[g] = ve[c] : (l.push(c), _e.hasOwnProperty(c) || (_e[c] = []), _e[c].push(() => {
          a[g] = ve[c], ++d, d === l.length && n(a);
        }));
      }), l.length === 0 && n(a);
    }
    function Yr(e, t, r = {}) {
      var n = t.name;
      if (e || M(`type "${n}" must have a positive integer typeid pointer`), ve.hasOwnProperty(e)) {
        if (r.ignoreDuplicateRegistrations)
          return;
        M(`Cannot register type '${n}' twice`);
      }
      if (ve[e] = t, delete Re[e], _e.hasOwnProperty(e)) {
        var a = _e[e];
        delete _e[e], a.forEach((l) => l());
      }
    }
    function ne(e, t, r = {}) {
      if (!("argPackAdvance" in t))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      return Yr(e, t, r);
    }
    function Jr(e, t, r, n, a) {
      var l = Qe(r);
      t = Z(t), ne(e, { name: t, fromWireType: function(d) {
        return !!d;
      }, toWireType: function(d, c) {
        return c ? n : a;
      }, argPackAdvance: 8, readValueFromPointer: function(d) {
        var c;
        if (r === 1)
          c = W;
        else if (r === 2)
          c = ce;
        else if (r === 4)
          c = U;
        else
          throw new TypeError("Unknown boolean type size: " + t);
        return this.fromWireType(c[d >> l]);
      }, destructorFunction: null });
    }
    function Zr(e) {
      if (!(this instanceof de) || !(e instanceof de))
        return !1;
      for (var t = this.$$.ptrType.registeredClass, r = this.$$.ptr, n = e.$$.ptrType.registeredClass, a = e.$$.ptr; t.baseClass; )
        r = t.upcast(r), t = t.baseClass;
      for (; n.baseClass; )
        a = n.upcast(a), n = n.baseClass;
      return t === n && r === a;
    }
    function Qr(e) {
      return { count: e.count, deleteScheduled: e.deleteScheduled, preservePointerOnDelete: e.preservePointerOnDelete, ptr: e.ptr, ptrType: e.ptrType, smartPtr: e.smartPtr, smartPtrType: e.smartPtrType };
    }
    function et(e) {
      function t(r) {
        return r.$$.ptrType.registeredClass.name;
      }
      M(t(e) + " instance already deleted");
    }
    var tt = !1;
    function Bt(e) {
    }
    function en(e) {
      e.smartPtr ? e.smartPtrType.rawDestructor(e.smartPtr) : e.ptrType.registeredClass.rawDestructor(e.ptr);
    }
    function Ot(e) {
      e.count.value -= 1;
      var t = e.count.value === 0;
      t && en(e);
    }
    function Lt(e, t, r) {
      if (t === r)
        return e;
      if (r.baseClass === void 0)
        return null;
      var n = Lt(e, t, r.baseClass);
      return n === null ? null : r.downcast(n);
    }
    var It = {};
    function tn() {
      return Object.keys(Ae).length;
    }
    function rn() {
      var e = [];
      for (var t in Ae)
        Ae.hasOwnProperty(t) && e.push(Ae[t]);
      return e;
    }
    var Se = [];
    function rt() {
      for (; Se.length; ) {
        var e = Se.pop();
        e.$$.deleteScheduled = !1, e.delete();
      }
    }
    var Ce = void 0;
    function nn(e) {
      Ce = e, Se.length && Ce && Ce(rt);
    }
    function on() {
      i.getInheritedInstanceCount = tn, i.getLiveInheritedInstances = rn, i.flushPendingDeletes = rt, i.setDelayFunction = nn;
    }
    var Ae = {};
    function sn(e, t) {
      for (t === void 0 && M("ptr should not be undefined"); e.baseClass; )
        t = e.upcast(t), e = e.baseClass;
      return t;
    }
    function an(e, t) {
      return t = sn(e, t), Ae[t];
    }
    function Me(e, t) {
      (!t.ptrType || !t.ptr) && Ue("makeClassHandle requires ptr and ptrType");
      var r = !!t.smartPtrType, n = !!t.smartPtr;
      return r !== n && Ue("Both smartPtrType and smartPtr must be specified"), t.count = { value: 1 }, Te(Object.create(e, { $$: { value: t } }));
    }
    function ln(e) {
      var t = this.getPointee(e);
      if (!t)
        return this.destructor(e), null;
      var r = an(this.registeredClass, t);
      if (r !== void 0) {
        if (r.$$.count.value === 0)
          return r.$$.ptr = t, r.$$.smartPtr = e, r.clone();
        var n = r.clone();
        return this.destructor(e), n;
      }
      function a() {
        return this.isSmartPointer ? Me(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: t, smartPtrType: this, smartPtr: e }) : Me(this.registeredClass.instancePrototype, { ptrType: this, ptr: e });
      }
      var l = this.registeredClass.getActualType(t), d = It[l];
      if (!d)
        return a.call(this);
      var c;
      this.isConst ? c = d.constPointerType : c = d.pointerType;
      var g = Lt(t, this.registeredClass, c.registeredClass);
      return g === null ? a.call(this) : this.isSmartPointer ? Me(c.registeredClass.instancePrototype, { ptrType: c, ptr: g, smartPtrType: this, smartPtr: e }) : Me(c.registeredClass.instancePrototype, { ptrType: c, ptr: g });
    }
    var Te = function(e) {
      return typeof FinalizationRegistry > "u" ? (Te = (t) => t, e) : (tt = new FinalizationRegistry((t) => {
        Ot(t.$$);
      }), Te = (t) => {
        var r = t.$$, n = !!r.smartPtr;
        if (n) {
          var a = { $$: r };
          tt.register(t, a, t);
        }
        return t;
      }, Bt = (t) => tt.unregister(t), Te(e));
    };
    function un() {
      if (this.$$.ptr || et(this), this.$$.preservePointerOnDelete)
        return this.$$.count.value += 1, this;
      var e = Te(Object.create(Object.getPrototypeOf(this), { $$: { value: Qr(this.$$) } }));
      return e.$$.count.value += 1, e.$$.deleteScheduled = !1, e;
    }
    function cn() {
      this.$$.ptr || et(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && M("Object already scheduled for deletion"), Bt(this), Ot(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
    }
    function dn() {
      return !this.$$.ptr;
    }
    function fn() {
      return this.$$.ptr || et(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && M("Object already scheduled for deletion"), Se.push(this), Se.length === 1 && Ce && Ce(rt), this.$$.deleteScheduled = !0, this;
    }
    function hn() {
      de.prototype.isAliasOf = Zr, de.prototype.clone = un, de.prototype.delete = cn, de.prototype.isDeleted = dn, de.prototype.deleteLater = fn;
    }
    function de() {
    }
    var pn = 48, vn = 57;
    function Be(e) {
      if (e === void 0)
        return "_unknown";
      e = e.replace(/[^a-zA-Z0-9_]/g, "$");
      var t = e.charCodeAt(0);
      return t >= pn && t <= vn ? `_${e}` : e;
    }
    function nt(e, t) {
      return e = Be(e), { [e]: function() {
        return t.apply(this, arguments);
      } }[e];
    }
    function jt(e, t, r) {
      if (e[t].overloadTable === void 0) {
        var n = e[t];
        e[t] = function() {
          return e[t].overloadTable.hasOwnProperty(arguments.length) || M(`Function '${r}' called with an invalid number of arguments (${arguments.length}) - expects one of (${e[t].overloadTable})!`), e[t].overloadTable[arguments.length].apply(this, arguments);
        }, e[t].overloadTable = [], e[t].overloadTable[n.argCount] = n;
      }
    }
    function mn(e, t, r) {
      i.hasOwnProperty(e) ? ((r === void 0 || i[e].overloadTable !== void 0 && i[e].overloadTable[r] !== void 0) && M(`Cannot register public name '${e}' twice`), jt(i, e, e), i.hasOwnProperty(r) && M(`Cannot register multiple overloads of a function with the same number of arguments (${r})!`), i[e].overloadTable[r] = t) : (i[e] = t, r !== void 0 && (i[e].numArguments = r));
    }
    function gn(e, t, r, n, a, l, d, c) {
      this.name = e, this.constructor = t, this.instancePrototype = r, this.rawDestructor = n, this.baseClass = a, this.getActualType = l, this.upcast = d, this.downcast = c, this.pureVirtualFunctions = [];
    }
    function it(e, t, r) {
      for (; t !== r; )
        t.upcast || M(`Expected null or instance of ${r.name}, got an instance of ${t.name}`), e = t.upcast(e), t = t.baseClass;
      return e;
    }
    function yn(e, t) {
      if (t === null)
        return this.isReference && M(`null is not a valid ${this.name}`), 0;
      t.$$ || M(`Cannot pass "${st(t)}" as a ${this.name}`), t.$$.ptr || M(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var r = t.$$.ptrType.registeredClass, n = it(t.$$.ptr, r, this.registeredClass);
      return n;
    }
    function wn(e, t) {
      var r;
      if (t === null)
        return this.isReference && M(`null is not a valid ${this.name}`), this.isSmartPointer ? (r = this.rawConstructor(), e !== null && e.push(this.rawDestructor, r), r) : 0;
      t.$$ || M(`Cannot pass "${st(t)}" as a ${this.name}`), t.$$.ptr || M(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && t.$$.ptrType.isConst && M(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
      var n = t.$$.ptrType.registeredClass;
      if (r = it(t.$$.ptr, n, this.registeredClass), this.isSmartPointer)
        switch (t.$$.smartPtr === void 0 && M("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            t.$$.smartPtrType === this ? r = t.$$.smartPtr : M(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            r = t.$$.smartPtr;
            break;
          case 2:
            if (t.$$.smartPtrType === this)
              r = t.$$.smartPtr;
            else {
              var a = t.clone();
              r = this.rawShare(r, Ie.toHandle(function() {
                a.delete();
              })), e !== null && e.push(this.rawDestructor, r);
            }
            break;
          default:
            M("Unsupporting sharing policy");
        }
      return r;
    }
    function _n(e, t) {
      if (t === null)
        return this.isReference && M(`null is not a valid ${this.name}`), 0;
      t.$$ || M(`Cannot pass "${st(t)}" as a ${this.name}`), t.$$.ptr || M(`Cannot pass deleted object as a pointer of type ${this.name}`), t.$$.ptrType.isConst && M(`Cannot convert argument of type ${t.$$.ptrType.name} to parameter type ${this.name}`);
      var r = t.$$.ptrType.registeredClass, n = it(t.$$.ptr, r, this.registeredClass);
      return n;
    }
    function Oe(e) {
      return this.fromWireType(U[e >> 2]);
    }
    function En(e) {
      return this.rawGetPointee && (e = this.rawGetPointee(e)), e;
    }
    function bn(e) {
      this.rawDestructor && this.rawDestructor(e);
    }
    function kn(e) {
      e !== null && e.delete();
    }
    function $n() {
      ie.prototype.getPointee = En, ie.prototype.destructor = bn, ie.prototype.argPackAdvance = 8, ie.prototype.readValueFromPointer = Oe, ie.prototype.deleteObject = kn, ie.prototype.fromWireType = ln;
    }
    function ie(e, t, r, n, a, l, d, c, g, p, $) {
      this.name = e, this.registeredClass = t, this.isReference = r, this.isConst = n, this.isSmartPointer = a, this.pointeeType = l, this.sharingPolicy = d, this.rawGetPointee = c, this.rawConstructor = g, this.rawShare = p, this.rawDestructor = $, !a && t.baseClass === void 0 ? n ? (this.toWireType = yn, this.destructorFunction = null) : (this.toWireType = _n, this.destructorFunction = null) : this.toWireType = wn;
    }
    function Pn(e, t, r) {
      i.hasOwnProperty(e) || Ue("Replacing nonexistant public symbol"), i[e].overloadTable !== void 0 && r !== void 0 ? i[e].overloadTable[r] = t : (i[e] = t, i[e].argCount = r);
    }
    var Sn = (e, t, r) => {
      var n = i["dynCall_" + e];
      return r && r.length ? n.apply(null, [t].concat(r)) : n.call(null, t);
    }, Le = [], zt = (e) => {
      var t = Le[e];
      return t || (e >= Le.length && (Le.length = e + 1), Le[e] = t = bt.get(e)), t;
    }, Cn = (e, t, r) => {
      if (e.includes("j"))
        return Sn(e, t, r);
      var n = zt(t).apply(null, r);
      return n;
    }, An = (e, t) => {
      var r = [];
      return function() {
        return r.length = 0, Object.assign(r, arguments), Cn(e, t, r);
      };
    };
    function be(e, t) {
      e = Z(e);
      function r() {
        return e.includes("j") ? An(e, t) : zt(t);
      }
      var n = r();
      return typeof n != "function" && M(`unknown function pointer with signature ${e}: ${t}`), n;
    }
    function Tn(e, t) {
      var r = nt(t, function(n) {
        this.name = t, this.message = n;
        var a = new Error(n).stack;
        a !== void 0 && (this.stack = this.toString() + `
` + a.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return r.prototype = Object.create(e.prototype), r.prototype.constructor = r, r.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, r;
    }
    var Ht = void 0;
    function Nt(e) {
      var t = Qt(e), r = Z(t);
      return oe(t), r;
    }
    function ot(e, t) {
      var r = [], n = {};
      function a(l) {
        if (!n[l] && !ve[l]) {
          if (Re[l]) {
            Re[l].forEach(a);
            return;
          }
          r.push(l), n[l] = !0;
        }
      }
      throw t.forEach(a), new Ht(`${e}: ` + r.map(Nt).join([", "]));
    }
    function Dn(e, t, r, n, a, l, d, c, g, p, $, S, P) {
      $ = Z($), l = be(a, l), c && (c = be(d, c)), p && (p = be(g, p)), P = be(S, P);
      var k = Be($);
      mn(k, function() {
        ot(`Cannot construct ${$} due to unbound types`, [n]);
      }), Pe([e, t, r], n ? [n] : [], function(A) {
        A = A[0];
        var I, z;
        n ? (I = A.registeredClass, z = I.instancePrototype) : z = de.prototype;
        var q = nt(k, function() {
          if (Object.getPrototypeOf(this) !== J)
            throw new Ee("Use 'new' to construct " + $);
          if (H.constructor_body === void 0)
            throw new Ee($ + " has no accessible constructor");
          var X = H.constructor_body[arguments.length];
          if (X === void 0)
            throw new Ee(`Tried to invoke ctor of ${$} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(H.constructor_body).toString()}) parameters instead!`);
          return X.apply(this, arguments);
        }), J = Object.create(z, { constructor: { value: q } });
        q.prototype = J;
        var H = new gn($, q, J, P, I, l, c, p);
        H.baseClass && (H.baseClass.__derivedClasses === void 0 && (H.baseClass.__derivedClasses = []), H.baseClass.__derivedClasses.push(H));
        var me = new ie($, H, !0, !1, !1), Q = new ie($ + "*", H, !1, !1, !1), se = new ie($ + " const*", H, !1, !0, !1);
        return It[e] = { pointerType: Q, constPointerType: se }, Pn(k, q), [me, Q, se];
      });
    }
    function Vt(e, t) {
      for (var r = [], n = 0; n < e; n++)
        r.push(B[t + n * 4 >> 2]);
      return r;
    }
    function xn(e) {
      for (; e.length; ) {
        var t = e.pop(), r = e.pop();
        r(t);
      }
    }
    function Wt(e, t) {
      if (!(e instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof e} which is not a function`);
      var r = nt(e.name || "unknownFunctionName", function() {
      });
      r.prototype = e.prototype;
      var n = new r(), a = e.apply(n, t);
      return a instanceof Object ? a : n;
    }
    function qt(e, t, r, n, a, l) {
      var d = t.length;
      d < 2 && M("argTypes array size mismatch! Must at least get return value and 'this' types!");
      for (var c = t[1] !== null && r !== null, g = !1, p = 1; p < t.length; ++p)
        if (t[p] !== null && t[p].destructorFunction === void 0) {
          g = !0;
          break;
        }
      for (var $ = t[0].name !== "void", S = "", P = "", p = 0; p < d - 2; ++p)
        S += (p !== 0 ? ", " : "") + "arg" + p, P += (p !== 0 ? ", " : "") + "arg" + p + "Wired";
      var k = `
        return function ${Be(e)}(${S}) {
        if (arguments.length !== ${d - 2}) {
          throwBindingError('function ${e} called with ${arguments.length} arguments, expected ${d - 2} args!');
        }`;
      g && (k += `var destructors = [];
`);
      var A = g ? "destructors" : "null", I = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"], z = [M, n, a, xn, t[0], t[1]];
      c && (k += "var thisWired = classParam.toWireType(" + A + `, this);
`);
      for (var p = 0; p < d - 2; ++p)
        k += "var arg" + p + "Wired = argType" + p + ".toWireType(" + A + ", arg" + p + "); // " + t[p + 2].name + `
`, I.push("argType" + p), z.push(t[p + 2]);
      if (c && (P = "thisWired" + (P.length > 0 ? ", " : "") + P), k += ($ || l ? "var rv = " : "") + "invoker(fn" + (P.length > 0 ? ", " : "") + P + `);
`, g)
        k += `runDestructors(destructors);
`;
      else
        for (var p = c ? 1 : 2; p < t.length; ++p) {
          var q = p === 1 ? "thisWired" : "arg" + (p - 2) + "Wired";
          t[p].destructorFunction !== null && (k += q + "_dtor(" + q + "); // " + t[p].name + `
`, I.push(q + "_dtor"), z.push(t[p].destructorFunction));
        }
      return $ && (k += `var ret = retType.fromWireType(rv);
return ret;
`), k += `}
`, I.push(k), Wt(Function, I).apply(null, z);
    }
    function Fn(e, t, r, n, a, l) {
      var d = Vt(t, r);
      a = be(n, a), Pe([], [e], function(c) {
        c = c[0];
        var g = `constructor ${c.name}`;
        if (c.registeredClass.constructor_body === void 0 && (c.registeredClass.constructor_body = []), c.registeredClass.constructor_body[t - 1] !== void 0)
          throw new Ee(`Cannot register multiple constructors with identical number of parameters (${t - 1}) for class '${c.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return c.registeredClass.constructor_body[t - 1] = () => {
          ot(`Cannot construct ${c.name} due to unbound types`, d);
        }, Pe([], d, function(p) {
          return p.splice(1, 0, null), c.registeredClass.constructor_body[t - 1] = qt(g, p, null, a, l), [];
        }), [];
      });
    }
    function Rn(e, t, r, n, a, l, d, c, g) {
      var p = Vt(r, n);
      t = Z(t), l = be(a, l), Pe([], [e], function($) {
        $ = $[0];
        var S = `${$.name}.${t}`;
        t.startsWith("@@") && (t = Symbol[t.substring(2)]), c && $.registeredClass.pureVirtualFunctions.push(t);
        function P() {
          ot(`Cannot call ${S} due to unbound types`, p);
        }
        var k = $.registeredClass.instancePrototype, A = k[t];
        return A === void 0 || A.overloadTable === void 0 && A.className !== $.name && A.argCount === r - 2 ? (P.argCount = r - 2, P.className = $.name, k[t] = P) : (jt(k, t, S), k[t].overloadTable[r - 2] = P), Pe([], p, function(I) {
          var z = qt(S, I, $, l, d, g);
          return k[t].overloadTable === void 0 ? (z.argCount = r - 2, k[t] = z) : k[t].overloadTable[r - 2] = z, [];
        }), [];
      });
    }
    function Un() {
      Object.assign(Xt.prototype, { get(e) {
        return this.allocated[e];
      }, has(e) {
        return this.allocated[e] !== void 0;
      }, allocate(e) {
        var t = this.freelist.pop() || this.allocated.length;
        return this.allocated[t] = e, t;
      }, free(e) {
        this.allocated[e] = void 0, this.freelist.push(e);
      } });
    }
    function Xt() {
      this.allocated = [void 0], this.freelist = [];
    }
    var te = new Xt();
    function Gt(e) {
      e >= te.reserved && --te.get(e).refcount === 0 && te.free(e);
    }
    function Mn() {
      for (var e = 0, t = te.reserved; t < te.allocated.length; ++t)
        te.allocated[t] !== void 0 && ++e;
      return e;
    }
    function Bn() {
      te.allocated.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 }), te.reserved = te.allocated.length, i.count_emval_handles = Mn;
    }
    var Ie = { toValue: (e) => (e || M("Cannot use deleted val. handle = " + e), te.get(e).value), toHandle: (e) => {
      switch (e) {
        case void 0:
          return 1;
        case null:
          return 2;
        case !0:
          return 3;
        case !1:
          return 4;
        default:
          return te.allocate({ refcount: 1, value: e });
      }
    } };
    function On(e, t) {
      t = Z(t), ne(e, { name: t, fromWireType: function(r) {
        var n = Ie.toValue(r);
        return Gt(r), n;
      }, toWireType: function(r, n) {
        return Ie.toHandle(n);
      }, argPackAdvance: 8, readValueFromPointer: Oe, destructorFunction: null });
    }
    function st(e) {
      if (e === null)
        return "null";
      var t = typeof e;
      return t === "object" || t === "array" || t === "function" ? e.toString() : "" + e;
    }
    function Ln(e, t) {
      switch (t) {
        case 2:
          return function(r) {
            return this.fromWireType(_t[r >> 2]);
          };
        case 3:
          return function(r) {
            return this.fromWireType(Et[r >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + e);
      }
    }
    function In(e, t, r) {
      var n = Qe(r);
      t = Z(t), ne(e, { name: t, fromWireType: function(a) {
        return a;
      }, toWireType: function(a, l) {
        return l;
      }, argPackAdvance: 8, readValueFromPointer: Ln(t, n), destructorFunction: null });
    }
    function jn(e, t, r) {
      switch (t) {
        case 0:
          return r ? function(a) {
            return W[a];
          } : function(a) {
            return Y[a];
          };
        case 1:
          return r ? function(a) {
            return ce[a >> 1];
          } : function(a) {
            return xe[a >> 1];
          };
        case 2:
          return r ? function(a) {
            return U[a >> 2];
          } : function(a) {
            return B[a >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + e);
      }
    }
    function zn(e, t, r, n, a) {
      t = Z(t);
      var l = Qe(r), d = (S) => S;
      if (n === 0) {
        var c = 32 - 8 * r;
        d = (S) => S << c >>> c;
      }
      var g = t.includes("unsigned"), p = (S, P) => {
      }, $;
      g ? $ = function(S, P) {
        return p(P, this.name), P >>> 0;
      } : $ = function(S, P) {
        return p(P, this.name), P;
      }, ne(e, { name: t, fromWireType: d, toWireType: $, argPackAdvance: 8, readValueFromPointer: jn(t, l, n !== 0), destructorFunction: null });
    }
    function Hn(e, t, r) {
      var n = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], a = n[t];
      function l(d) {
        d = d >> 2;
        var c = B, g = c[d], p = c[d + 1];
        return new a(c.buffer, p, g);
      }
      r = Z(r), ne(e, { name: r, fromWireType: l, argPackAdvance: 8, readValueFromPointer: l }, { ignoreDuplicateRegistrations: !0 });
    }
    var Nn = (e, t, r) => Ye(e, Y, t, r);
    function Vn(e, t) {
      t = Z(t);
      var r = t === "std::string";
      ne(e, { name: t, fromWireType: function(n) {
        var a = B[n >> 2], l = n + 4, d;
        if (r)
          for (var c = l, g = 0; g <= a; ++g) {
            var p = l + g;
            if (g == a || Y[p] == 0) {
              var $ = p - c, S = Rt(c, $);
              d === void 0 ? d = S : (d += String.fromCharCode(0), d += S), c = p + 1;
            }
          }
        else {
          for (var P = new Array(a), g = 0; g < a; ++g)
            P[g] = String.fromCharCode(Y[l + g]);
          d = P.join("");
        }
        return oe(n), d;
      }, toWireType: function(n, a) {
        a instanceof ArrayBuffer && (a = new Uint8Array(a));
        var l, d = typeof a == "string";
        d || a instanceof Uint8Array || a instanceof Uint8ClampedArray || a instanceof Int8Array || M("Cannot pass non-string to std::string"), r && d ? l = Ke(a) : l = a.length;
        var c = ut(4 + l + 1), g = c + 4;
        if (B[c >> 2] = l, r && d)
          Nn(a, g, l + 1);
        else if (d)
          for (var p = 0; p < l; ++p) {
            var $ = a.charCodeAt(p);
            $ > 255 && (oe(g), M("String has UTF-16 code units that do not fit in 8 bits")), Y[g + p] = $;
          }
        else
          for (var p = 0; p < l; ++p)
            Y[g + p] = a[p];
        return n !== null && n.push(oe, c), c;
      }, argPackAdvance: 8, readValueFromPointer: Oe, destructorFunction: function(n) {
        oe(n);
      } });
    }
    var Kt = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, Wn = (e, t) => {
      for (var r = e, n = r >> 1, a = n + t / 2; !(n >= a) && xe[n]; )
        ++n;
      if (r = n << 1, r - e > 32 && Kt)
        return Kt.decode(Y.subarray(e, r));
      for (var l = "", d = 0; !(d >= t / 2); ++d) {
        var c = ce[e + d * 2 >> 1];
        if (c == 0)
          break;
        l += String.fromCharCode(c);
      }
      return l;
    }, qn = (e, t, r) => {
      if (r === void 0 && (r = 2147483647), r < 2)
        return 0;
      r -= 2;
      for (var n = t, a = r < e.length * 2 ? r / 2 : e.length, l = 0; l < a; ++l) {
        var d = e.charCodeAt(l);
        ce[t >> 1] = d, t += 2;
      }
      return ce[t >> 1] = 0, t - n;
    }, Xn = (e) => e.length * 2, Gn = (e, t) => {
      for (var r = 0, n = ""; !(r >= t / 4); ) {
        var a = U[e + r * 4 >> 2];
        if (a == 0)
          break;
        if (++r, a >= 65536) {
          var l = a - 65536;
          n += String.fromCharCode(55296 | l >> 10, 56320 | l & 1023);
        } else
          n += String.fromCharCode(a);
      }
      return n;
    }, Kn = (e, t, r) => {
      if (r === void 0 && (r = 2147483647), r < 4)
        return 0;
      for (var n = t, a = n + r - 4, l = 0; l < e.length; ++l) {
        var d = e.charCodeAt(l);
        if (d >= 55296 && d <= 57343) {
          var c = e.charCodeAt(++l);
          d = 65536 + ((d & 1023) << 10) | c & 1023;
        }
        if (U[t >> 2] = d, t += 4, t + 4 > a)
          break;
      }
      return U[t >> 2] = 0, t - n;
    }, Yn = (e) => {
      for (var t = 0, r = 0; r < e.length; ++r) {
        var n = e.charCodeAt(r);
        n >= 55296 && n <= 57343 && ++r, t += 4;
      }
      return t;
    }, Jn = function(e, t, r) {
      r = Z(r);
      var n, a, l, d, c;
      t === 2 ? (n = Wn, a = qn, d = Xn, l = () => xe, c = 1) : t === 4 && (n = Gn, a = Kn, d = Yn, l = () => B, c = 2), ne(e, { name: r, fromWireType: function(g) {
        for (var p = B[g >> 2], $ = l(), S, P = g + 4, k = 0; k <= p; ++k) {
          var A = g + 4 + k * t;
          if (k == p || $[A >> c] == 0) {
            var I = A - P, z = n(P, I);
            S === void 0 ? S = z : (S += String.fromCharCode(0), S += z), P = A + t;
          }
        }
        return oe(g), S;
      }, toWireType: function(g, p) {
        typeof p != "string" && M(`Cannot pass non-string to C++ string type ${r}`);
        var $ = d(p), S = ut(4 + $ + t);
        return B[S >> 2] = $ >> c, a(p, S + 4, $ + t), g !== null && g.push(oe, S), S;
      }, argPackAdvance: 8, readValueFromPointer: Oe, destructorFunction: function(g) {
        oe(g);
      } });
    };
    function Zn(e, t) {
      t = Z(t), ne(e, { isVoid: !0, name: t, argPackAdvance: 0, fromWireType: function() {
      }, toWireType: function(r, n) {
      } });
    }
    var Qn = {};
    function ei(e) {
      var t = Qn[e];
      return t === void 0 ? Z(e) : t;
    }
    var at = [];
    function ti(e, t, r, n) {
      e = at[e], t = Ie.toValue(t), r = ei(r), e(t, r, null, n);
    }
    function ri(e) {
      var t = at.length;
      return at.push(e), t;
    }
    function ni(e, t) {
      var r = ve[e];
      return r === void 0 && M(t + " has unknown type " + Nt(e)), r;
    }
    function ii(e, t) {
      for (var r = new Array(e), n = 0; n < e; ++n)
        r[n] = ni(B[t + n * 4 >> 2], "parameter " + n);
      return r;
    }
    var Yt = [];
    function oi(e, t) {
      var r = ii(e, t), n = r[0], a = n.name + "_$" + r.slice(1).map(function(A) {
        return A.name;
      }).join("_") + "$", l = Yt[a];
      if (l !== void 0)
        return l;
      for (var d = ["retType"], c = [n], g = "", p = 0; p < e - 1; ++p)
        g += (p !== 0 ? ", " : "") + "arg" + p, d.push("argType" + p), c.push(r[1 + p]);
      for (var $ = Be("methodCaller_" + a), S = "return function " + $ + `(handle, name, destructors, args) {
`, P = 0, p = 0; p < e - 1; ++p)
        S += "    var arg" + p + " = argType" + p + ".readValueFromPointer(args" + (P ? "+" + P : "") + `);
`, P += r[p + 1].argPackAdvance;
      S += "    var rv = handle[name](" + g + `);
`;
      for (var p = 0; p < e - 1; ++p)
        r[p + 1].deleteObject && (S += "    argType" + p + ".deleteObject(arg" + p + `);
`);
      n.isVoid || (S += `    return retType.toWireType(destructors, rv);
`), S += `};
`, d.push(S);
      var k = Wt(Function, d).apply(null, c);
      return l = ri(k), Yt[a] = l, l;
    }
    function si(e, t) {
      return t + 2097152 >>> 0 < 4194305 - !!e ? (e >>> 0) + t * 4294967296 : NaN;
    }
    var ai = () => {
      he("");
    };
    function li() {
      return Date.now();
    }
    var ui = () => Y.length, ci = () => ui(), di = (e, t, r) => Y.copyWithin(e, t, t + r), fi = (e) => {
      he("OOM");
    }, hi = (e) => {
      Y.length, fi();
    }, lt = {}, pi = () => w || "./this.program", De = () => {
      if (!De.strings) {
        var e = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", t = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: e, _: pi() };
        for (var r in lt)
          lt[r] === void 0 ? delete t[r] : t[r] = lt[r];
        var n = [];
        for (var r in t)
          n.push(`${r}=${t[r]}`);
        De.strings = n;
      }
      return De.strings;
    }, vi = (e, t) => {
      for (var r = 0; r < e.length; ++r)
        W[t++ >> 0] = e.charCodeAt(r);
      W[t >> 0] = 0;
    }, mi = (e, t) => {
      var r = 0;
      return De().forEach(function(n, a) {
        var l = t + r;
        B[e + a * 4 >> 2] = l, vi(n, l), r += n.length + 1;
      }), 0;
    }, gi = (e, t) => {
      var r = De();
      B[e >> 2] = r.length;
      var n = 0;
      return r.forEach(function(a) {
        n += a.length + 1;
      }), B[t >> 2] = n, 0;
    };
    function yi(e) {
      try {
        var t = G.getStreamFromFD(e);
        return o.close(t), 0;
      } catch (r) {
        if (typeof o > "u" || r.name !== "ErrnoError")
          throw r;
        return r.errno;
      }
    }
    function wi(e, t) {
      try {
        var r = 0, n = 0, a = 0, l = G.getStreamFromFD(e), d = l.tty ? 2 : o.isDir(l.mode) ? 3 : o.isLink(l.mode) ? 7 : 4;
        return W[t >> 0] = d, ce[t + 2 >> 1] = a, j = [r >>> 0, (T = r, +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[t + 8 >> 2] = j[0], U[t + 12 >> 2] = j[1], j = [n >>> 0, (T = n, +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[t + 16 >> 2] = j[0], U[t + 20 >> 2] = j[1], 0;
      } catch (c) {
        if (typeof o > "u" || c.name !== "ErrnoError")
          throw c;
        return c.errno;
      }
    }
    var _i = (e, t, r, n) => {
      for (var a = 0, l = 0; l < r; l++) {
        var d = B[t >> 2], c = B[t + 4 >> 2];
        t += 8;
        var g = o.read(e, W, d, c, n);
        if (g < 0)
          return -1;
        if (a += g, g < c)
          break;
        typeof n < "u" && (n += g);
      }
      return a;
    };
    function Ei(e, t, r, n) {
      try {
        var a = G.getStreamFromFD(e), l = _i(a, t, r);
        return B[n >> 2] = l, 0;
      } catch (d) {
        if (typeof o > "u" || d.name !== "ErrnoError")
          throw d;
        return d.errno;
      }
    }
    function bi(e, t, r, n, a) {
      var l = si(t, r);
      try {
        if (isNaN(l))
          return 61;
        var d = G.getStreamFromFD(e);
        return o.llseek(d, l, n), j = [d.position >>> 0, (T = d.position, +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[a >> 2] = j[0], U[a + 4 >> 2] = j[1], d.getdents && l === 0 && n === 0 && (d.getdents = null), 0;
      } catch (c) {
        if (typeof o > "u" || c.name !== "ErrnoError")
          throw c;
        return c.errno;
      }
    }
    var ki = (e, t, r, n) => {
      for (var a = 0, l = 0; l < r; l++) {
        var d = B[t >> 2], c = B[t + 4 >> 2];
        t += 8;
        var g = o.write(e, W, d, c, n);
        if (g < 0)
          return -1;
        a += g, typeof n < "u" && (n += g);
      }
      return a;
    };
    function $i(e, t, r, n) {
      try {
        var a = G.getStreamFromFD(e), l = ki(a, t, r);
        return B[n >> 2] = l, 0;
      } catch (d) {
        if (typeof o > "u" || d.name !== "ErrnoError")
          throw d;
        return d.errno;
      }
    }
    var Jt = function(e, t, r, n) {
      e || (e = this), this.parent = e, this.mount = e.mount, this.mounted = null, this.id = o.nextInode++, this.name = t, this.mode = r, this.node_ops = {}, this.stream_ops = {}, this.rdev = n;
    }, je = 365, ze = 146;
    Object.defineProperties(Jt.prototype, { read: { get: function() {
      return (this.mode & je) === je;
    }, set: function(e) {
      e ? this.mode |= je : this.mode &= ~je;
    } }, write: { get: function() {
      return (this.mode & ze) === ze;
    }, set: function(e) {
      e ? this.mode |= ze : this.mode &= ~ze;
    } }, isFolder: { get: function() {
      return o.isDir(this.mode);
    } }, isDevice: { get: function() {
      return o.isChrdev(this.mode);
    } } }), o.FSNode = Jt, o.createPreloadedFile = Vr, o.staticInit(), Kr(), Ee = i.BindingError = class extends Error {
      constructor(t) {
        super(t), this.name = "BindingError";
      }
    }, Mt = i.InternalError = class extends Error {
      constructor(t) {
        super(t), this.name = "InternalError";
      }
    }, hn(), on(), $n(), Ht = i.UnboundTypeError = Tn(Error, "UnboundTypeError"), Un(), Bn();
    var Pi = { p: Or, C: qr, w: Xr, t: Gr, n: Jr, r: Dn, q: Fn, d: Rn, D: On, k: In, c: zn, b: Hn, j: Vn, f: Jn, o: Zn, g: ti, m: Gt, l: oi, a: ai, e: li, v: ci, A: di, u: hi, y: mi, z: gi, i: yi, x: wi, B: Ei, s: bi, h: $i };
    Mr();
    var ut = (e) => (ut = V.G)(e), oe = (e) => (oe = V.I)(e), Zt = () => (Zt = V.J)(), Qt = (e) => (Qt = V.K)(e);
    i.__embind_initialize_bindings = () => (i.__embind_initialize_bindings = V.L)();
    var er = (e) => (er = V.M)(e);
    i.dynCall_jiji = (e, t, r, n, a) => (i.dynCall_jiji = V.N)(e, t, r, n, a), i._ff_h264_cabac_tables = 67061;
    var He;
    $e = function e() {
      He || tr(), He || ($e = e);
    };
    function tr() {
      if (fe > 0 || (Sr(), fe > 0))
        return;
      function e() {
        He || (He = !0, i.calledRun = !0, !L && (Cr(), f(i), i.onRuntimeInitialized && i.onRuntimeInitialized(), Ar()));
      }
      i.setStatus ? (i.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          i.setStatus("");
        }, 1), e();
      }, 1)) : e();
    }
    if (i.preInit)
      for (typeof i.preInit == "function" && (i.preInit = [i.preInit]); i.preInit.length > 0; )
        i.preInit.pop()();
    return tr(), s.ready;
  };
})();
var os = (() => {
  var y = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
  return function(s = {}) {
    var i = s, f, u;
    i.ready = new Promise((e, t) => {
      f = e, u = t;
    });
    var m = Object.assign({}, i), w = "./this.program", b = typeof window == "object", v = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && process.versions.node;
    var h = "";
    function E(e) {
      return i.locateFile ? i.locateFile(e, h) : h + e;
    }
    var _, D, F;
    (b || v) && (v ? h = self.location.href : typeof document < "u" && document.currentScript && (h = document.currentScript.src), y && (h = y), h.indexOf("blob:") !== 0 ? h = h.substr(0, h.replace(/[?#].*/, "").lastIndexOf("/") + 1) : h = "", _ = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.send(null), t.responseText;
    }, v && (F = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
    }), D = (e, t, r) => {
      var n = new XMLHttpRequest();
      n.open("GET", e, !0), n.responseType = "arraybuffer", n.onload = () => {
        if (n.status == 200 || n.status == 0 && n.response) {
          t(n.response);
          return;
        }
        r();
      }, n.onerror = r, n.send(null);
    });
    var x = i.print || console.log.bind(console), N = i.printErr || console.error.bind(console);
    Object.assign(i, m), m = null, i.arguments && i.arguments, i.thisProgram && (w = i.thisProgram), i.quit && i.quit;
    var C;
    i.wasmBinary && (C = i.wasmBinary), i.noExitRuntime, typeof WebAssembly != "object" && he("no native wasm support detected");
    var K, V, L = !1;
    function ke(e, t) {
      e || he(t);
    }
    var W, Y, ce, xe, U, B, _t, Et;
    function Pr() {
      var e = K.buffer;
      i.HEAP8 = W = new Int8Array(e), i.HEAP16 = ce = new Int16Array(e), i.HEAP32 = U = new Int32Array(e), i.HEAPU8 = Y = new Uint8Array(e), i.HEAPU16 = xe = new Uint16Array(e), i.HEAPU32 = B = new Uint32Array(e), i.HEAPF32 = _t = new Float32Array(e), i.HEAPF64 = Et = new Float64Array(e);
    }
    var bt, kt = [], $t = [], Pt = [];
    function Sr() {
      if (i.preRun)
        for (typeof i.preRun == "function" && (i.preRun = [i.preRun]); i.preRun.length; )
          Tr(i.preRun.shift());
      Xe(kt);
    }
    function Cr() {
      !i.noFSInit && !o.init.initialized && o.init(), o.ignorePermissions = !1, Xe($t);
    }
    function Ar() {
      if (i.postRun)
        for (typeof i.postRun == "function" && (i.postRun = [i.postRun]); i.postRun.length; )
          xr(i.postRun.shift());
      Xe(Pt);
    }
    function Tr(e) {
      kt.unshift(e);
    }
    function Dr(e) {
      $t.unshift(e);
    }
    function xr(e) {
      Pt.unshift(e);
    }
    var fe = 0, $e = null;
    function lo(e) {
      return e;
    }
    function qe(e) {
      fe++, i.monitorRunDependencies && i.monitorRunDependencies(fe);
    }
    function Fe(e) {
      if (fe--, i.monitorRunDependencies && i.monitorRunDependencies(fe), fe == 0 && $e) {
        var t = $e;
        $e = null, t();
      }
    }
    function he(e) {
      i.onAbort && i.onAbort(e), e = "Aborted(" + e + ")", N(e), L = !0, e += ". Build with -sASSERTIONS for more info.";
      var t = new WebAssembly.RuntimeError(e);
      throw u(t), t;
    }
    var Fr = "data:application/octet-stream;base64,";
    function St(e) {
      return e.startsWith(Fr);
    }
    var ye;
    ye = "audiodec.wasm", St(ye) || (ye = E(ye));
    function Ct(e) {
      if (e == ye && C)
        return new Uint8Array(C);
      if (F)
        return F(e);
      throw "both async and sync fetching of the wasm failed";
    }
    function Rr(e) {
      return !C && (b || v) && typeof fetch == "function" ? fetch(e, { credentials: "same-origin" }).then((t) => {
        if (!t.ok)
          throw "failed to load wasm binary file at '" + e + "'";
        return t.arrayBuffer();
      }).catch(() => Ct(e)) : Promise.resolve().then(() => Ct(e));
    }
    function At(e, t, r) {
      return Rr(e).then((n) => WebAssembly.instantiate(n, t)).then((n) => n).then(r, (n) => {
        N("failed to asynchronously prepare wasm: " + n), he(n);
      });
    }
    function Ur(e, t, r, n) {
      return !e && typeof WebAssembly.instantiateStreaming == "function" && !St(t) && typeof fetch == "function" ? fetch(t, { credentials: "same-origin" }).then((a) => {
        var l = WebAssembly.instantiateStreaming(a, r);
        return l.then(n, function(d) {
          return N("wasm streaming compile failed: " + d), N("falling back to ArrayBuffer instantiation"), At(t, r, n);
        });
      }) : At(t, r, n);
    }
    function Mr() {
      var e = { a: Pi };
      function t(n, a) {
        var l = n.exports;
        return V = l, K = V.E, Pr(), bt = V.H, Dr(V.F), Fe(), l;
      }
      qe();
      function r(n) {
        t(n.instance);
      }
      if (i.instantiateWasm)
        try {
          return i.instantiateWasm(e, t);
        } catch (n) {
          N("Module.instantiateWasm callback failed with error: " + n), u(n);
        }
      return Ur(C, ye, e, r).catch(u), {};
    }
    var T, j, Xe = (e) => {
      for (; e.length > 0; )
        e.shift()(i);
    };
    function Br(e) {
      this.excPtr = e, this.ptr = e - 24, this.set_type = function(t) {
        B[this.ptr + 4 >> 2] = t;
      }, this.get_type = function() {
        return B[this.ptr + 4 >> 2];
      }, this.set_destructor = function(t) {
        B[this.ptr + 8 >> 2] = t;
      }, this.get_destructor = function() {
        return B[this.ptr + 8 >> 2];
      }, this.set_caught = function(t) {
        t = t ? 1 : 0, W[this.ptr + 12 >> 0] = t;
      }, this.get_caught = function() {
        return W[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(t) {
        t = t ? 1 : 0, W[this.ptr + 13 >> 0] = t;
      }, this.get_rethrown = function() {
        return W[this.ptr + 13 >> 0] != 0;
      }, this.init = function(t, r) {
        this.set_adjusted_ptr(0), this.set_type(t), this.set_destructor(r);
      }, this.set_adjusted_ptr = function(t) {
        B[this.ptr + 16 >> 2] = t;
      }, this.get_adjusted_ptr = function() {
        return B[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var t = er(this.get_type());
        if (t)
          return B[this.excPtr >> 2];
        var r = this.get_adjusted_ptr();
        return r !== 0 ? r : this.excPtr;
      };
    }
    var Tt = 0;
    function Or(e, t, r) {
      var n = new Br(e);
      throw n.init(t, r), Tt = e, Tt;
    }
    var Lr = (e) => (U[Zt() >> 2] = e, e), O = { isAbs: (e) => e.charAt(0) === "/", splitPath: (e) => {
      var t = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
      return t.exec(e).slice(1);
    }, normalizeArray: (e, t) => {
      for (var r = 0, n = e.length - 1; n >= 0; n--) {
        var a = e[n];
        a === "." ? e.splice(n, 1) : a === ".." ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--);
      }
      if (t)
        for (; r; r--)
          e.unshift("..");
      return e;
    }, normalize: (e) => {
      var t = O.isAbs(e), r = e.substr(-1) === "/";
      return e = O.normalizeArray(e.split("/").filter((n) => !!n), !t).join("/"), !e && !t && (e = "."), e && r && (e += "/"), (t ? "/" : "") + e;
    }, dirname: (e) => {
      var t = O.splitPath(e), r = t[0], n = t[1];
      return !r && !n ? "." : (n && (n = n.substr(0, n.length - 1)), r + n);
    }, basename: (e) => {
      if (e === "/")
        return "/";
      e = O.normalize(e), e = e.replace(/\/$/, "");
      var t = e.lastIndexOf("/");
      return t === -1 ? e : e.substr(t + 1);
    }, join: function() {
      var e = Array.prototype.slice.call(arguments);
      return O.normalize(e.join("/"));
    }, join2: (e, t) => O.normalize(e + "/" + t) }, Ir = () => {
      if (typeof crypto == "object" && typeof crypto.getRandomValues == "function")
        return (e) => crypto.getRandomValues(e);
      he("initRandomDevice");
    }, Dt = (e) => (Dt = Ir())(e), re = { resolve: function() {
      for (var e = "", t = !1, r = arguments.length - 1; r >= -1 && !t; r--) {
        var n = r >= 0 ? arguments[r] : o.cwd();
        if (typeof n != "string")
          throw new TypeError("Arguments to path.resolve must be strings");
        if (!n)
          return "";
        e = n + "/" + e, t = O.isAbs(n);
      }
      return e = O.normalizeArray(e.split("/").filter((a) => !!a), !t).join("/"), (t ? "/" : "") + e || ".";
    }, relative: (e, t) => {
      e = re.resolve(e).substr(1), t = re.resolve(t).substr(1);
      function r(p) {
        for (var $ = 0; $ < p.length && p[$] === ""; $++)
          ;
        for (var S = p.length - 1; S >= 0 && p[S] === ""; S--)
          ;
        return $ > S ? [] : p.slice($, S - $ + 1);
      }
      for (var n = r(e.split("/")), a = r(t.split("/")), l = Math.min(n.length, a.length), d = l, c = 0; c < l; c++)
        if (n[c] !== a[c]) {
          d = c;
          break;
        }
      for (var g = [], c = d; c < n.length; c++)
        g.push("..");
      return g = g.concat(a.slice(d)), g.join("/");
    } }, xt = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, we = (e, t, r) => {
      for (var n = t + r, a = t; e[a] && !(a >= n); )
        ++a;
      if (a - t > 16 && e.buffer && xt)
        return xt.decode(e.subarray(t, a));
      for (var l = ""; t < a; ) {
        var d = e[t++];
        if (!(d & 128)) {
          l += String.fromCharCode(d);
          continue;
        }
        var c = e[t++] & 63;
        if ((d & 224) == 192) {
          l += String.fromCharCode((d & 31) << 6 | c);
          continue;
        }
        var g = e[t++] & 63;
        if ((d & 240) == 224 ? d = (d & 15) << 12 | c << 6 | g : d = (d & 7) << 18 | c << 12 | g << 6 | e[t++] & 63, d < 65536)
          l += String.fromCharCode(d);
        else {
          var p = d - 65536;
          l += String.fromCharCode(55296 | p >> 10, 56320 | p & 1023);
        }
      }
      return l;
    }, Ge = [], Ke = (e) => {
      for (var t = 0, r = 0; r < e.length; ++r) {
        var n = e.charCodeAt(r);
        n <= 127 ? t++ : n <= 2047 ? t += 2 : n >= 55296 && n <= 57343 ? (t += 4, ++r) : t += 3;
      }
      return t;
    }, Ye = (e, t, r, n) => {
      if (!(n > 0))
        return 0;
      for (var a = r, l = r + n - 1, d = 0; d < e.length; ++d) {
        var c = e.charCodeAt(d);
        if (c >= 55296 && c <= 57343) {
          var g = e.charCodeAt(++d);
          c = 65536 + ((c & 1023) << 10) | g & 1023;
        }
        if (c <= 127) {
          if (r >= l)
            break;
          t[r++] = c;
        } else if (c <= 2047) {
          if (r + 1 >= l)
            break;
          t[r++] = 192 | c >> 6, t[r++] = 128 | c & 63;
        } else if (c <= 65535) {
          if (r + 2 >= l)
            break;
          t[r++] = 224 | c >> 12, t[r++] = 128 | c >> 6 & 63, t[r++] = 128 | c & 63;
        } else {
          if (r + 3 >= l)
            break;
          t[r++] = 240 | c >> 18, t[r++] = 128 | c >> 12 & 63, t[r++] = 128 | c >> 6 & 63, t[r++] = 128 | c & 63;
        }
      }
      return t[r] = 0, r - a;
    };
    function Je(e, t, r) {
      var n = r > 0 ? r : Ke(e) + 1, a = new Array(n), l = Ye(e, a, 0, a.length);
      return t && (a.length = l), a;
    }
    var jr = () => {
      if (!Ge.length) {
        var e = null;
        if (typeof window < "u" && typeof window.prompt == "function" ? (e = window.prompt("Input: "), e !== null && (e += `
`)) : typeof readline == "function" && (e = readline(), e !== null && (e += `
`)), !e)
          return null;
        Ge = Je(e, !0);
      }
      return Ge.shift();
    }, pe = { ttys: [], init: function() {
    }, shutdown: function() {
    }, register: function(e, t) {
      pe.ttys[e] = { input: [], output: [], ops: t }, o.registerDevice(e, pe.stream_ops);
    }, stream_ops: { open: function(e) {
      var t = pe.ttys[e.node.rdev];
      if (!t)
        throw new o.ErrnoError(43);
      e.tty = t, e.seekable = !1;
    }, close: function(e) {
      e.tty.ops.fsync(e.tty);
    }, fsync: function(e) {
      e.tty.ops.fsync(e.tty);
    }, read: function(e, t, r, n, a) {
      if (!e.tty || !e.tty.ops.get_char)
        throw new o.ErrnoError(60);
      for (var l = 0, d = 0; d < n; d++) {
        var c;
        try {
          c = e.tty.ops.get_char(e.tty);
        } catch {
          throw new o.ErrnoError(29);
        }
        if (c === void 0 && l === 0)
          throw new o.ErrnoError(6);
        if (c == null)
          break;
        l++, t[r + d] = c;
      }
      return l && (e.node.timestamp = Date.now()), l;
    }, write: function(e, t, r, n, a) {
      if (!e.tty || !e.tty.ops.put_char)
        throw new o.ErrnoError(60);
      try {
        for (var l = 0; l < n; l++)
          e.tty.ops.put_char(e.tty, t[r + l]);
      } catch {
        throw new o.ErrnoError(29);
      }
      return n && (e.node.timestamp = Date.now()), l;
    } }, default_tty_ops: { get_char: function(e) {
      return jr();
    }, put_char: function(e, t) {
      t === null || t === 10 ? (x(we(e.output, 0)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync: function(e) {
      e.output && e.output.length > 0 && (x(we(e.output, 0)), e.output = []);
    }, ioctl_tcgets: function(e) {
      return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    }, ioctl_tcsets: function(e, t, r) {
      return 0;
    }, ioctl_tiocgwinsz: function(e) {
      return [24, 80];
    } }, default_tty1_ops: { put_char: function(e, t) {
      t === null || t === 10 ? (N(we(e.output, 0)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync: function(e) {
      e.output && e.output.length > 0 && (N(we(e.output, 0)), e.output = []);
    } } }, Ft = (e) => {
      he();
    }, R = { ops_table: null, mount(e) {
      return R.createNode(null, "/", 16895, 0);
    }, createNode(e, t, r, n) {
      if (o.isBlkdev(r) || o.isFIFO(r))
        throw new o.ErrnoError(63);
      R.ops_table || (R.ops_table = { dir: { node: { getattr: R.node_ops.getattr, setattr: R.node_ops.setattr, lookup: R.node_ops.lookup, mknod: R.node_ops.mknod, rename: R.node_ops.rename, unlink: R.node_ops.unlink, rmdir: R.node_ops.rmdir, readdir: R.node_ops.readdir, symlink: R.node_ops.symlink }, stream: { llseek: R.stream_ops.llseek } }, file: { node: { getattr: R.node_ops.getattr, setattr: R.node_ops.setattr }, stream: { llseek: R.stream_ops.llseek, read: R.stream_ops.read, write: R.stream_ops.write, allocate: R.stream_ops.allocate, mmap: R.stream_ops.mmap, msync: R.stream_ops.msync } }, link: { node: { getattr: R.node_ops.getattr, setattr: R.node_ops.setattr, readlink: R.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: R.node_ops.getattr, setattr: R.node_ops.setattr }, stream: o.chrdev_stream_ops } });
      var a = o.createNode(e, t, r, n);
      return o.isDir(a.mode) ? (a.node_ops = R.ops_table.dir.node, a.stream_ops = R.ops_table.dir.stream, a.contents = {}) : o.isFile(a.mode) ? (a.node_ops = R.ops_table.file.node, a.stream_ops = R.ops_table.file.stream, a.usedBytes = 0, a.contents = null) : o.isLink(a.mode) ? (a.node_ops = R.ops_table.link.node, a.stream_ops = R.ops_table.link.stream) : o.isChrdev(a.mode) && (a.node_ops = R.ops_table.chrdev.node, a.stream_ops = R.ops_table.chrdev.stream), a.timestamp = Date.now(), e && (e.contents[t] = a, e.timestamp = a.timestamp), a;
    }, getFileDataAsTypedArray(e) {
      return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
    }, expandFileStorage(e, t) {
      var r = e.contents ? e.contents.length : 0;
      if (!(r >= t)) {
        var n = 1024 * 1024;
        t = Math.max(t, r * (r < n ? 2 : 1.125) >>> 0), r != 0 && (t = Math.max(t, 256));
        var a = e.contents;
        e.contents = new Uint8Array(t), e.usedBytes > 0 && e.contents.set(a.subarray(0, e.usedBytes), 0);
      }
    }, resizeFileStorage(e, t) {
      if (e.usedBytes != t)
        if (t == 0)
          e.contents = null, e.usedBytes = 0;
        else {
          var r = e.contents;
          e.contents = new Uint8Array(t), r && e.contents.set(r.subarray(0, Math.min(t, e.usedBytes))), e.usedBytes = t;
        }
    }, node_ops: { getattr(e) {
      var t = {};
      return t.dev = o.isChrdev(e.mode) ? e.id : 1, t.ino = e.id, t.mode = e.mode, t.nlink = 1, t.uid = 0, t.gid = 0, t.rdev = e.rdev, o.isDir(e.mode) ? t.size = 4096 : o.isFile(e.mode) ? t.size = e.usedBytes : o.isLink(e.mode) ? t.size = e.link.length : t.size = 0, t.atime = new Date(e.timestamp), t.mtime = new Date(e.timestamp), t.ctime = new Date(e.timestamp), t.blksize = 4096, t.blocks = Math.ceil(t.size / t.blksize), t;
    }, setattr(e, t) {
      t.mode !== void 0 && (e.mode = t.mode), t.timestamp !== void 0 && (e.timestamp = t.timestamp), t.size !== void 0 && R.resizeFileStorage(e, t.size);
    }, lookup(e, t) {
      throw o.genericErrors[44];
    }, mknod(e, t, r, n) {
      return R.createNode(e, t, r, n);
    }, rename(e, t, r) {
      if (o.isDir(e.mode)) {
        var n;
        try {
          n = o.lookupNode(t, r);
        } catch {
        }
        if (n)
          for (var a in n.contents)
            throw new o.ErrnoError(55);
      }
      delete e.parent.contents[e.name], e.parent.timestamp = Date.now(), e.name = r, t.contents[r] = e, t.timestamp = e.parent.timestamp, e.parent = t;
    }, unlink(e, t) {
      delete e.contents[t], e.timestamp = Date.now();
    }, rmdir(e, t) {
      var r = o.lookupNode(e, t);
      for (var n in r.contents)
        throw new o.ErrnoError(55);
      delete e.contents[t], e.timestamp = Date.now();
    }, readdir(e) {
      var t = [".", ".."];
      for (var r in e.contents)
        e.contents.hasOwnProperty(r) && t.push(r);
      return t;
    }, symlink(e, t, r) {
      var n = R.createNode(e, t, 41471, 0);
      return n.link = r, n;
    }, readlink(e) {
      if (!o.isLink(e.mode))
        throw new o.ErrnoError(28);
      return e.link;
    } }, stream_ops: { read(e, t, r, n, a) {
      var l = e.node.contents;
      if (a >= e.node.usedBytes)
        return 0;
      var d = Math.min(e.node.usedBytes - a, n);
      if (d > 8 && l.subarray)
        t.set(l.subarray(a, a + d), r);
      else
        for (var c = 0; c < d; c++)
          t[r + c] = l[a + c];
      return d;
    }, write(e, t, r, n, a, l) {
      if (!n)
        return 0;
      var d = e.node;
      if (d.timestamp = Date.now(), t.subarray && (!d.contents || d.contents.subarray)) {
        if (l)
          return d.contents = t.subarray(r, r + n), d.usedBytes = n, n;
        if (d.usedBytes === 0 && a === 0)
          return d.contents = t.slice(r, r + n), d.usedBytes = n, n;
        if (a + n <= d.usedBytes)
          return d.contents.set(t.subarray(r, r + n), a), n;
      }
      if (R.expandFileStorage(d, a + n), d.contents.subarray && t.subarray)
        d.contents.set(t.subarray(r, r + n), a);
      else
        for (var c = 0; c < n; c++)
          d.contents[a + c] = t[r + c];
      return d.usedBytes = Math.max(d.usedBytes, a + n), n;
    }, llseek(e, t, r) {
      var n = t;
      if (r === 1 ? n += e.position : r === 2 && o.isFile(e.node.mode) && (n += e.node.usedBytes), n < 0)
        throw new o.ErrnoError(28);
      return n;
    }, allocate(e, t, r) {
      R.expandFileStorage(e.node, t + r), e.node.usedBytes = Math.max(e.node.usedBytes, t + r);
    }, mmap(e, t, r, n, a) {
      if (!o.isFile(e.node.mode))
        throw new o.ErrnoError(43);
      var l, d, c = e.node.contents;
      if (!(a & 2) && c.buffer === W.buffer)
        d = !1, l = c.byteOffset;
      else {
        if ((r > 0 || r + t < c.length) && (c.subarray ? c = c.subarray(r, r + t) : c = Array.prototype.slice.call(c, r, r + t)), d = !0, l = Ft(), !l)
          throw new o.ErrnoError(48);
        W.set(c, l);
      }
      return { ptr: l, allocated: d };
    }, msync(e, t, r, n, a) {
      return R.stream_ops.write(e, t, 0, n, r, !1), 0;
    } } }, zr = (e, t, r, n) => {
      var a = n ? "" : `al ${e}`;
      D(e, (l) => {
        ke(l, `Loading data file "${e}" failed (no arrayBuffer).`), t(new Uint8Array(l)), a && Fe();
      }, (l) => {
        if (r)
          r();
        else
          throw `Loading data file "${e}" failed.`;
      }), a && qe();
    }, Hr = i.preloadPlugins || [];
    function Nr(e, t, r, n) {
      typeof Browser < "u" && Browser.init();
      var a = !1;
      return Hr.forEach(function(l) {
        a || l.canHandle(t) && (l.handle(e, t, r, n), a = !0);
      }), a;
    }
    function Vr(e, t, r, n, a, l, d, c, g, p) {
      var $ = t ? re.resolve(O.join2(e, t)) : e;
      function S(P) {
        function k(A) {
          p && p(), c || o.createDataFile(e, t, A, n, a, g), l && l(), Fe();
        }
        Nr(P, $, k, () => {
          d && d(), Fe();
        }) || k(P);
      }
      qe(), typeof r == "string" ? zr(r, (P) => S(P), d) : S(r);
    }
    function Wr(e) {
      var t = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }, r = t[e];
      if (typeof r > "u")
        throw new Error(`Unknown file open mode: ${e}`);
      return r;
    }
    function Ze(e, t) {
      var r = 0;
      return e && (r |= 365), t && (r |= 146), r;
    }
    var o = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: !1, ignorePermissions: !0, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, lookupPath: (e, t = {}) => {
      if (e = re.resolve(e), !e)
        return { path: "", node: null };
      var r = { follow_mount: !0, recurse_count: 0 };
      if (t = Object.assign(r, t), t.recurse_count > 8)
        throw new o.ErrnoError(32);
      for (var n = e.split("/").filter((S) => !!S), a = o.root, l = "/", d = 0; d < n.length; d++) {
        var c = d === n.length - 1;
        if (c && t.parent)
          break;
        if (a = o.lookupNode(a, n[d]), l = O.join2(l, n[d]), o.isMountpoint(a) && (!c || c && t.follow_mount) && (a = a.mounted.root), !c || t.follow)
          for (var g = 0; o.isLink(a.mode); ) {
            var p = o.readlink(l);
            l = re.resolve(O.dirname(l), p);
            var $ = o.lookupPath(l, { recurse_count: t.recurse_count + 1 });
            if (a = $.node, g++ > 40)
              throw new o.ErrnoError(32);
          }
      }
      return { path: l, node: a };
    }, getPath: (e) => {
      for (var t; ; ) {
        if (o.isRoot(e)) {
          var r = e.mount.mountpoint;
          return t ? r[r.length - 1] !== "/" ? `${r}/${t}` : r + t : r;
        }
        t = t ? `${e.name}/${t}` : e.name, e = e.parent;
      }
    }, hashName: (e, t) => {
      for (var r = 0, n = 0; n < t.length; n++)
        r = (r << 5) - r + t.charCodeAt(n) | 0;
      return (e + r >>> 0) % o.nameTable.length;
    }, hashAddNode: (e) => {
      var t = o.hashName(e.parent.id, e.name);
      e.name_next = o.nameTable[t], o.nameTable[t] = e;
    }, hashRemoveNode: (e) => {
      var t = o.hashName(e.parent.id, e.name);
      if (o.nameTable[t] === e)
        o.nameTable[t] = e.name_next;
      else
        for (var r = o.nameTable[t]; r; ) {
          if (r.name_next === e) {
            r.name_next = e.name_next;
            break;
          }
          r = r.name_next;
        }
    }, lookupNode: (e, t) => {
      var r = o.mayLookup(e);
      if (r)
        throw new o.ErrnoError(r, e);
      for (var n = o.hashName(e.id, t), a = o.nameTable[n]; a; a = a.name_next) {
        var l = a.name;
        if (a.parent.id === e.id && l === t)
          return a;
      }
      return o.lookup(e, t);
    }, createNode: (e, t, r, n) => {
      var a = new o.FSNode(e, t, r, n);
      return o.hashAddNode(a), a;
    }, destroyNode: (e) => {
      o.hashRemoveNode(e);
    }, isRoot: (e) => e === e.parent, isMountpoint: (e) => !!e.mounted, isFile: (e) => (e & 61440) === 32768, isDir: (e) => (e & 61440) === 16384, isLink: (e) => (e & 61440) === 40960, isChrdev: (e) => (e & 61440) === 8192, isBlkdev: (e) => (e & 61440) === 24576, isFIFO: (e) => (e & 61440) === 4096, isSocket: (e) => (e & 49152) === 49152, flagsToPermissionString: (e) => {
      var t = ["r", "w", "rw"][e & 3];
      return e & 512 && (t += "w"), t;
    }, nodePermissions: (e, t) => o.ignorePermissions ? 0 : t.includes("r") && !(e.mode & 292) || t.includes("w") && !(e.mode & 146) || t.includes("x") && !(e.mode & 73) ? 2 : 0, mayLookup: (e) => {
      var t = o.nodePermissions(e, "x");
      return t || (e.node_ops.lookup ? 0 : 2);
    }, mayCreate: (e, t) => {
      try {
        var r = o.lookupNode(e, t);
        return 20;
      } catch {
      }
      return o.nodePermissions(e, "wx");
    }, mayDelete: (e, t, r) => {
      var n;
      try {
        n = o.lookupNode(e, t);
      } catch (l) {
        return l.errno;
      }
      var a = o.nodePermissions(e, "wx");
      if (a)
        return a;
      if (r) {
        if (!o.isDir(n.mode))
          return 54;
        if (o.isRoot(n) || o.getPath(n) === o.cwd())
          return 10;
      } else if (o.isDir(n.mode))
        return 31;
      return 0;
    }, mayOpen: (e, t) => e ? o.isLink(e.mode) ? 32 : o.isDir(e.mode) && (o.flagsToPermissionString(t) !== "r" || t & 512) ? 31 : o.nodePermissions(e, o.flagsToPermissionString(t)) : 44, MAX_OPEN_FDS: 4096, nextfd: () => {
      for (var e = 0; e <= o.MAX_OPEN_FDS; e++)
        if (!o.streams[e])
          return e;
      throw new o.ErrnoError(33);
    }, getStreamChecked: (e) => {
      var t = o.getStream(e);
      if (!t)
        throw new o.ErrnoError(8);
      return t;
    }, getStream: (e) => o.streams[e], createStream: (e, t = -1) => (o.FSStream || (o.FSStream = function() {
      this.shared = {};
    }, o.FSStream.prototype = {}, Object.defineProperties(o.FSStream.prototype, { object: { get() {
      return this.node;
    }, set(r) {
      this.node = r;
    } }, isRead: { get() {
      return (this.flags & 2097155) !== 1;
    } }, isWrite: { get() {
      return (this.flags & 2097155) !== 0;
    } }, isAppend: { get() {
      return this.flags & 1024;
    } }, flags: { get() {
      return this.shared.flags;
    }, set(r) {
      this.shared.flags = r;
    } }, position: { get() {
      return this.shared.position;
    }, set(r) {
      this.shared.position = r;
    } } })), e = Object.assign(new o.FSStream(), e), t == -1 && (t = o.nextfd()), e.fd = t, o.streams[t] = e, e), closeStream: (e) => {
      o.streams[e] = null;
    }, chrdev_stream_ops: { open: (e) => {
      var t = o.getDevice(e.node.rdev);
      e.stream_ops = t.stream_ops, e.stream_ops.open && e.stream_ops.open(e);
    }, llseek: () => {
      throw new o.ErrnoError(70);
    } }, major: (e) => e >> 8, minor: (e) => e & 255, makedev: (e, t) => e << 8 | t, registerDevice: (e, t) => {
      o.devices[e] = { stream_ops: t };
    }, getDevice: (e) => o.devices[e], getMounts: (e) => {
      for (var t = [], r = [e]; r.length; ) {
        var n = r.pop();
        t.push(n), r.push.apply(r, n.mounts);
      }
      return t;
    }, syncfs: (e, t) => {
      typeof e == "function" && (t = e, e = !1), o.syncFSRequests++, o.syncFSRequests > 1 && N(`warning: ${o.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
      var r = o.getMounts(o.root.mount), n = 0;
      function a(d) {
        return o.syncFSRequests--, t(d);
      }
      function l(d) {
        if (d)
          return l.errored ? void 0 : (l.errored = !0, a(d));
        ++n >= r.length && a(null);
      }
      r.forEach((d) => {
        if (!d.type.syncfs)
          return l(null);
        d.type.syncfs(d, e, l);
      });
    }, mount: (e, t, r) => {
      var n = r === "/", a = !r, l;
      if (n && o.root)
        throw new o.ErrnoError(10);
      if (!n && !a) {
        var d = o.lookupPath(r, { follow_mount: !1 });
        if (r = d.path, l = d.node, o.isMountpoint(l))
          throw new o.ErrnoError(10);
        if (!o.isDir(l.mode))
          throw new o.ErrnoError(54);
      }
      var c = { type: e, opts: t, mountpoint: r, mounts: [] }, g = e.mount(c);
      return g.mount = c, c.root = g, n ? o.root = g : l && (l.mounted = c, l.mount && l.mount.mounts.push(c)), g;
    }, unmount: (e) => {
      var t = o.lookupPath(e, { follow_mount: !1 });
      if (!o.isMountpoint(t.node))
        throw new o.ErrnoError(28);
      var r = t.node, n = r.mounted, a = o.getMounts(n);
      Object.keys(o.nameTable).forEach((d) => {
        for (var c = o.nameTable[d]; c; ) {
          var g = c.name_next;
          a.includes(c.mount) && o.destroyNode(c), c = g;
        }
      }), r.mounted = null;
      var l = r.mount.mounts.indexOf(n);
      r.mount.mounts.splice(l, 1);
    }, lookup: (e, t) => e.node_ops.lookup(e, t), mknod: (e, t, r) => {
      var n = o.lookupPath(e, { parent: !0 }), a = n.node, l = O.basename(e);
      if (!l || l === "." || l === "..")
        throw new o.ErrnoError(28);
      var d = o.mayCreate(a, l);
      if (d)
        throw new o.ErrnoError(d);
      if (!a.node_ops.mknod)
        throw new o.ErrnoError(63);
      return a.node_ops.mknod(a, l, t, r);
    }, create: (e, t) => (t = t !== void 0 ? t : 438, t &= 4095, t |= 32768, o.mknod(e, t, 0)), mkdir: (e, t) => (t = t !== void 0 ? t : 511, t &= 1023, t |= 16384, o.mknod(e, t, 0)), mkdirTree: (e, t) => {
      for (var r = e.split("/"), n = "", a = 0; a < r.length; ++a)
        if (r[a]) {
          n += "/" + r[a];
          try {
            o.mkdir(n, t);
          } catch (l) {
            if (l.errno != 20)
              throw l;
          }
        }
    }, mkdev: (e, t, r) => (typeof r > "u" && (r = t, t = 438), t |= 8192, o.mknod(e, t, r)), symlink: (e, t) => {
      if (!re.resolve(e))
        throw new o.ErrnoError(44);
      var r = o.lookupPath(t, { parent: !0 }), n = r.node;
      if (!n)
        throw new o.ErrnoError(44);
      var a = O.basename(t), l = o.mayCreate(n, a);
      if (l)
        throw new o.ErrnoError(l);
      if (!n.node_ops.symlink)
        throw new o.ErrnoError(63);
      return n.node_ops.symlink(n, a, e);
    }, rename: (e, t) => {
      var r = O.dirname(e), n = O.dirname(t), a = O.basename(e), l = O.basename(t), d, c, g;
      if (d = o.lookupPath(e, { parent: !0 }), c = d.node, d = o.lookupPath(t, { parent: !0 }), g = d.node, !c || !g)
        throw new o.ErrnoError(44);
      if (c.mount !== g.mount)
        throw new o.ErrnoError(75);
      var p = o.lookupNode(c, a), $ = re.relative(e, n);
      if ($.charAt(0) !== ".")
        throw new o.ErrnoError(28);
      if ($ = re.relative(t, r), $.charAt(0) !== ".")
        throw new o.ErrnoError(55);
      var S;
      try {
        S = o.lookupNode(g, l);
      } catch {
      }
      if (p !== S) {
        var P = o.isDir(p.mode), k = o.mayDelete(c, a, P);
        if (k)
          throw new o.ErrnoError(k);
        if (k = S ? o.mayDelete(g, l, P) : o.mayCreate(g, l), k)
          throw new o.ErrnoError(k);
        if (!c.node_ops.rename)
          throw new o.ErrnoError(63);
        if (o.isMountpoint(p) || S && o.isMountpoint(S))
          throw new o.ErrnoError(10);
        if (g !== c && (k = o.nodePermissions(c, "w"), k))
          throw new o.ErrnoError(k);
        o.hashRemoveNode(p);
        try {
          c.node_ops.rename(p, g, l);
        } catch (A) {
          throw A;
        } finally {
          o.hashAddNode(p);
        }
      }
    }, rmdir: (e) => {
      var t = o.lookupPath(e, { parent: !0 }), r = t.node, n = O.basename(e), a = o.lookupNode(r, n), l = o.mayDelete(r, n, !0);
      if (l)
        throw new o.ErrnoError(l);
      if (!r.node_ops.rmdir)
        throw new o.ErrnoError(63);
      if (o.isMountpoint(a))
        throw new o.ErrnoError(10);
      r.node_ops.rmdir(r, n), o.destroyNode(a);
    }, readdir: (e) => {
      var t = o.lookupPath(e, { follow: !0 }), r = t.node;
      if (!r.node_ops.readdir)
        throw new o.ErrnoError(54);
      return r.node_ops.readdir(r);
    }, unlink: (e) => {
      var t = o.lookupPath(e, { parent: !0 }), r = t.node;
      if (!r)
        throw new o.ErrnoError(44);
      var n = O.basename(e), a = o.lookupNode(r, n), l = o.mayDelete(r, n, !1);
      if (l)
        throw new o.ErrnoError(l);
      if (!r.node_ops.unlink)
        throw new o.ErrnoError(63);
      if (o.isMountpoint(a))
        throw new o.ErrnoError(10);
      r.node_ops.unlink(r, n), o.destroyNode(a);
    }, readlink: (e) => {
      var t = o.lookupPath(e), r = t.node;
      if (!r)
        throw new o.ErrnoError(44);
      if (!r.node_ops.readlink)
        throw new o.ErrnoError(28);
      return re.resolve(o.getPath(r.parent), r.node_ops.readlink(r));
    }, stat: (e, t) => {
      var r = o.lookupPath(e, { follow: !t }), n = r.node;
      if (!n)
        throw new o.ErrnoError(44);
      if (!n.node_ops.getattr)
        throw new o.ErrnoError(63);
      return n.node_ops.getattr(n);
    }, lstat: (e) => o.stat(e, !0), chmod: (e, t, r) => {
      var n;
      if (typeof e == "string") {
        var a = o.lookupPath(e, { follow: !r });
        n = a.node;
      } else
        n = e;
      if (!n.node_ops.setattr)
        throw new o.ErrnoError(63);
      n.node_ops.setattr(n, { mode: t & 4095 | n.mode & -4096, timestamp: Date.now() });
    }, lchmod: (e, t) => {
      o.chmod(e, t, !0);
    }, fchmod: (e, t) => {
      var r = o.getStreamChecked(e);
      o.chmod(r.node, t);
    }, chown: (e, t, r, n) => {
      var a;
      if (typeof e == "string") {
        var l = o.lookupPath(e, { follow: !n });
        a = l.node;
      } else
        a = e;
      if (!a.node_ops.setattr)
        throw new o.ErrnoError(63);
      a.node_ops.setattr(a, { timestamp: Date.now() });
    }, lchown: (e, t, r) => {
      o.chown(e, t, r, !0);
    }, fchown: (e, t, r) => {
      var n = o.getStreamChecked(e);
      o.chown(n.node, t, r);
    }, truncate: (e, t) => {
      if (t < 0)
        throw new o.ErrnoError(28);
      var r;
      if (typeof e == "string") {
        var n = o.lookupPath(e, { follow: !0 });
        r = n.node;
      } else
        r = e;
      if (!r.node_ops.setattr)
        throw new o.ErrnoError(63);
      if (o.isDir(r.mode))
        throw new o.ErrnoError(31);
      if (!o.isFile(r.mode))
        throw new o.ErrnoError(28);
      var a = o.nodePermissions(r, "w");
      if (a)
        throw new o.ErrnoError(a);
      r.node_ops.setattr(r, { size: t, timestamp: Date.now() });
    }, ftruncate: (e, t) => {
      var r = o.getStreamChecked(e);
      if (!(r.flags & 2097155))
        throw new o.ErrnoError(28);
      o.truncate(r.node, t);
    }, utime: (e, t, r) => {
      var n = o.lookupPath(e, { follow: !0 }), a = n.node;
      a.node_ops.setattr(a, { timestamp: Math.max(t, r) });
    }, open: (e, t, r) => {
      if (e === "")
        throw new o.ErrnoError(44);
      t = typeof t == "string" ? Wr(t) : t, r = typeof r > "u" ? 438 : r, t & 64 ? r = r & 4095 | 32768 : r = 0;
      var n;
      if (typeof e == "object")
        n = e;
      else {
        e = O.normalize(e);
        try {
          var a = o.lookupPath(e, { follow: !(t & 131072) });
          n = a.node;
        } catch {
        }
      }
      var l = !1;
      if (t & 64)
        if (n) {
          if (t & 128)
            throw new o.ErrnoError(20);
        } else
          n = o.mknod(e, r, 0), l = !0;
      if (!n)
        throw new o.ErrnoError(44);
      if (o.isChrdev(n.mode) && (t &= -513), t & 65536 && !o.isDir(n.mode))
        throw new o.ErrnoError(54);
      if (!l) {
        var d = o.mayOpen(n, t);
        if (d)
          throw new o.ErrnoError(d);
      }
      t & 512 && !l && o.truncate(n, 0), t &= -131713;
      var c = o.createStream({ node: n, path: o.getPath(n), flags: t, seekable: !0, position: 0, stream_ops: n.stream_ops, ungotten: [], error: !1 });
      return c.stream_ops.open && c.stream_ops.open(c), i.logReadFiles && !(t & 1) && (o.readFiles || (o.readFiles = {}), e in o.readFiles || (o.readFiles[e] = 1)), c;
    }, close: (e) => {
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      e.getdents && (e.getdents = null);
      try {
        e.stream_ops.close && e.stream_ops.close(e);
      } catch (t) {
        throw t;
      } finally {
        o.closeStream(e.fd);
      }
      e.fd = null;
    }, isClosed: (e) => e.fd === null, llseek: (e, t, r) => {
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if (!e.seekable || !e.stream_ops.llseek)
        throw new o.ErrnoError(70);
      if (r != 0 && r != 1 && r != 2)
        throw new o.ErrnoError(28);
      return e.position = e.stream_ops.llseek(e, t, r), e.ungotten = [], e.position;
    }, read: (e, t, r, n, a) => {
      if (n < 0 || a < 0)
        throw new o.ErrnoError(28);
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if ((e.flags & 2097155) === 1)
        throw new o.ErrnoError(8);
      if (o.isDir(e.node.mode))
        throw new o.ErrnoError(31);
      if (!e.stream_ops.read)
        throw new o.ErrnoError(28);
      var l = typeof a < "u";
      if (!l)
        a = e.position;
      else if (!e.seekable)
        throw new o.ErrnoError(70);
      var d = e.stream_ops.read(e, t, r, n, a);
      return l || (e.position += d), d;
    }, write: (e, t, r, n, a, l) => {
      if (n < 0 || a < 0)
        throw new o.ErrnoError(28);
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if (!(e.flags & 2097155))
        throw new o.ErrnoError(8);
      if (o.isDir(e.node.mode))
        throw new o.ErrnoError(31);
      if (!e.stream_ops.write)
        throw new o.ErrnoError(28);
      e.seekable && e.flags & 1024 && o.llseek(e, 0, 2);
      var d = typeof a < "u";
      if (!d)
        a = e.position;
      else if (!e.seekable)
        throw new o.ErrnoError(70);
      var c = e.stream_ops.write(e, t, r, n, a, l);
      return d || (e.position += c), c;
    }, allocate: (e, t, r) => {
      if (o.isClosed(e))
        throw new o.ErrnoError(8);
      if (t < 0 || r <= 0)
        throw new o.ErrnoError(28);
      if (!(e.flags & 2097155))
        throw new o.ErrnoError(8);
      if (!o.isFile(e.node.mode) && !o.isDir(e.node.mode))
        throw new o.ErrnoError(43);
      if (!e.stream_ops.allocate)
        throw new o.ErrnoError(138);
      e.stream_ops.allocate(e, t, r);
    }, mmap: (e, t, r, n, a) => {
      if (n & 2 && !(a & 2) && (e.flags & 2097155) !== 2)
        throw new o.ErrnoError(2);
      if ((e.flags & 2097155) === 1)
        throw new o.ErrnoError(2);
      if (!e.stream_ops.mmap)
        throw new o.ErrnoError(43);
      return e.stream_ops.mmap(e, t, r, n, a);
    }, msync: (e, t, r, n, a) => e.stream_ops.msync ? e.stream_ops.msync(e, t, r, n, a) : 0, munmap: (e) => 0, ioctl: (e, t, r) => {
      if (!e.stream_ops.ioctl)
        throw new o.ErrnoError(59);
      return e.stream_ops.ioctl(e, t, r);
    }, readFile: (e, t = {}) => {
      if (t.flags = t.flags || 0, t.encoding = t.encoding || "binary", t.encoding !== "utf8" && t.encoding !== "binary")
        throw new Error(`Invalid encoding type "${t.encoding}"`);
      var r, n = o.open(e, t.flags), a = o.stat(e), l = a.size, d = new Uint8Array(l);
      return o.read(n, d, 0, l, 0), t.encoding === "utf8" ? r = we(d, 0) : t.encoding === "binary" && (r = d), o.close(n), r;
    }, writeFile: (e, t, r = {}) => {
      r.flags = r.flags || 577;
      var n = o.open(e, r.flags, r.mode);
      if (typeof t == "string") {
        var a = new Uint8Array(Ke(t) + 1), l = Ye(t, a, 0, a.length);
        o.write(n, a, 0, l, void 0, r.canOwn);
      } else if (ArrayBuffer.isView(t))
        o.write(n, t, 0, t.byteLength, void 0, r.canOwn);
      else
        throw new Error("Unsupported data type");
      o.close(n);
    }, cwd: () => o.currentPath, chdir: (e) => {
      var t = o.lookupPath(e, { follow: !0 });
      if (t.node === null)
        throw new o.ErrnoError(44);
      if (!o.isDir(t.node.mode))
        throw new o.ErrnoError(54);
      var r = o.nodePermissions(t.node, "x");
      if (r)
        throw new o.ErrnoError(r);
      o.currentPath = t.path;
    }, createDefaultDirectories: () => {
      o.mkdir("/tmp"), o.mkdir("/home"), o.mkdir("/home/web_user");
    }, createDefaultDevices: () => {
      o.mkdir("/dev"), o.registerDevice(o.makedev(1, 3), { read: () => 0, write: (n, a, l, d, c) => d }), o.mkdev("/dev/null", o.makedev(1, 3)), pe.register(o.makedev(5, 0), pe.default_tty_ops), pe.register(o.makedev(6, 0), pe.default_tty1_ops), o.mkdev("/dev/tty", o.makedev(5, 0)), o.mkdev("/dev/tty1", o.makedev(6, 0));
      var e = new Uint8Array(1024), t = 0, r = () => (t === 0 && (t = Dt(e).byteLength), e[--t]);
      o.createDevice("/dev", "random", r), o.createDevice("/dev", "urandom", r), o.mkdir("/dev/shm"), o.mkdir("/dev/shm/tmp");
    }, createSpecialDirectories: () => {
      o.mkdir("/proc");
      var e = o.mkdir("/proc/self");
      o.mkdir("/proc/self/fd"), o.mount({ mount: () => {
        var t = o.createNode(e, "fd", 16895, 73);
        return t.node_ops = { lookup: (r, n) => {
          var a = +n, l = o.getStreamChecked(a), d = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => l.path } };
          return d.parent = d, d;
        } }, t;
      } }, {}, "/proc/self/fd");
    }, createStandardStreams: () => {
      i.stdin ? o.createDevice("/dev", "stdin", i.stdin) : o.symlink("/dev/tty", "/dev/stdin"), i.stdout ? o.createDevice("/dev", "stdout", null, i.stdout) : o.symlink("/dev/tty", "/dev/stdout"), i.stderr ? o.createDevice("/dev", "stderr", null, i.stderr) : o.symlink("/dev/tty1", "/dev/stderr"), o.open("/dev/stdin", 0), o.open("/dev/stdout", 1), o.open("/dev/stderr", 1);
    }, ensureErrnoError: () => {
      o.ErrnoError || (o.ErrnoError = function(t, r) {
        this.name = "ErrnoError", this.node = r, this.setErrno = function(n) {
          this.errno = n;
        }, this.setErrno(t), this.message = "FS error";
      }, o.ErrnoError.prototype = new Error(), o.ErrnoError.prototype.constructor = o.ErrnoError, [44].forEach((e) => {
        o.genericErrors[e] = new o.ErrnoError(e), o.genericErrors[e].stack = "<generic error, no stack>";
      }));
    }, staticInit: () => {
      o.ensureErrnoError(), o.nameTable = new Array(4096), o.mount(R, {}, "/"), o.createDefaultDirectories(), o.createDefaultDevices(), o.createSpecialDirectories(), o.filesystems = { MEMFS: R };
    }, init: (e, t, r) => {
      o.init.initialized = !0, o.ensureErrnoError(), i.stdin = e || i.stdin, i.stdout = t || i.stdout, i.stderr = r || i.stderr, o.createStandardStreams();
    }, quit: () => {
      o.init.initialized = !1;
      for (var e = 0; e < o.streams.length; e++) {
        var t = o.streams[e];
        t && o.close(t);
      }
    }, findObject: (e, t) => {
      var r = o.analyzePath(e, t);
      return r.exists ? r.object : null;
    }, analyzePath: (e, t) => {
      try {
        var r = o.lookupPath(e, { follow: !t });
        e = r.path;
      } catch {
      }
      var n = { isRoot: !1, exists: !1, error: 0, name: null, path: null, object: null, parentExists: !1, parentPath: null, parentObject: null };
      try {
        var r = o.lookupPath(e, { parent: !0 });
        n.parentExists = !0, n.parentPath = r.path, n.parentObject = r.node, n.name = O.basename(e), r = o.lookupPath(e, { follow: !t }), n.exists = !0, n.path = r.path, n.object = r.node, n.name = r.node.name, n.isRoot = r.path === "/";
      } catch (a) {
        n.error = a.errno;
      }
      return n;
    }, createPath: (e, t, r, n) => {
      e = typeof e == "string" ? e : o.getPath(e);
      for (var a = t.split("/").reverse(); a.length; ) {
        var l = a.pop();
        if (l) {
          var d = O.join2(e, l);
          try {
            o.mkdir(d);
          } catch {
          }
          e = d;
        }
      }
      return d;
    }, createFile: (e, t, r, n, a) => {
      var l = O.join2(typeof e == "string" ? e : o.getPath(e), t), d = Ze(n, a);
      return o.create(l, d);
    }, createDataFile: (e, t, r, n, a, l) => {
      var d = t;
      e && (e = typeof e == "string" ? e : o.getPath(e), d = t ? O.join2(e, t) : e);
      var c = Ze(n, a), g = o.create(d, c);
      if (r) {
        if (typeof r == "string") {
          for (var p = new Array(r.length), $ = 0, S = r.length; $ < S; ++$)
            p[$] = r.charCodeAt($);
          r = p;
        }
        o.chmod(g, c | 146);
        var P = o.open(g, 577);
        o.write(P, r, 0, r.length, 0, l), o.close(P), o.chmod(g, c);
      }
      return g;
    }, createDevice: (e, t, r, n) => {
      var a = O.join2(typeof e == "string" ? e : o.getPath(e), t), l = Ze(!!r, !!n);
      o.createDevice.major || (o.createDevice.major = 64);
      var d = o.makedev(o.createDevice.major++, 0);
      return o.registerDevice(d, { open: (c) => {
        c.seekable = !1;
      }, close: (c) => {
        n && n.buffer && n.buffer.length && n(10);
      }, read: (c, g, p, $, S) => {
        for (var P = 0, k = 0; k < $; k++) {
          var A;
          try {
            A = r();
          } catch {
            throw new o.ErrnoError(29);
          }
          if (A === void 0 && P === 0)
            throw new o.ErrnoError(6);
          if (A == null)
            break;
          P++, g[p + k] = A;
        }
        return P && (c.node.timestamp = Date.now()), P;
      }, write: (c, g, p, $, S) => {
        for (var P = 0; P < $; P++)
          try {
            n(g[p + P]);
          } catch {
            throw new o.ErrnoError(29);
          }
        return $ && (c.node.timestamp = Date.now()), P;
      } }), o.mkdev(a, l, d);
    }, forceLoadFile: (e) => {
      if (e.isDevice || e.isFolder || e.link || e.contents)
        return !0;
      if (typeof XMLHttpRequest < "u")
        throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
      if (_)
        try {
          e.contents = Je(_(e.url), !0), e.usedBytes = e.contents.length;
        } catch {
          throw new o.ErrnoError(29);
        }
      else
        throw new Error("Cannot load without read() or XMLHttpRequest.");
    }, createLazyFile: (e, t, r, n, a) => {
      function l() {
        this.lengthKnown = !1, this.chunks = [];
      }
      if (l.prototype.get = function(k) {
        if (!(k > this.length - 1 || k < 0)) {
          var A = k % this.chunkSize, I = k / this.chunkSize | 0;
          return this.getter(I)[A];
        }
      }, l.prototype.setDataGetter = function(k) {
        this.getter = k;
      }, l.prototype.cacheLength = function() {
        var k = new XMLHttpRequest();
        if (k.open("HEAD", r, !1), k.send(null), !(k.status >= 200 && k.status < 300 || k.status === 304))
          throw new Error("Couldn't load " + r + ". Status: " + k.status);
        var A = Number(k.getResponseHeader("Content-length")), I, z = (I = k.getResponseHeader("Accept-Ranges")) && I === "bytes", q = (I = k.getResponseHeader("Content-Encoding")) && I === "gzip", J = 1024 * 1024;
        z || (J = A);
        var H = (Q, se) => {
          if (Q > se)
            throw new Error("invalid range (" + Q + ", " + se + ") or no bytes requested!");
          if (se > A - 1)
            throw new Error("only " + A + " bytes available! programmer error!");
          var X = new XMLHttpRequest();
          if (X.open("GET", r, !1), A !== J && X.setRequestHeader("Range", "bytes=" + Q + "-" + se), X.responseType = "arraybuffer", X.overrideMimeType && X.overrideMimeType("text/plain; charset=x-user-defined"), X.send(null), !(X.status >= 200 && X.status < 300 || X.status === 304))
            throw new Error("Couldn't load " + r + ". Status: " + X.status);
          return X.response !== void 0 ? new Uint8Array(X.response || []) : Je(X.responseText || "", !0);
        }, me = this;
        me.setDataGetter((Q) => {
          var se = Q * J, X = (Q + 1) * J - 1;
          if (X = Math.min(X, A - 1), typeof me.chunks[Q] > "u" && (me.chunks[Q] = H(se, X)), typeof me.chunks[Q] > "u")
            throw new Error("doXHR failed!");
          return me.chunks[Q];
        }), (q || !A) && (J = A = 1, A = this.getter(0).length, J = A, x("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = A, this._chunkSize = J, this.lengthKnown = !0;
      }, typeof XMLHttpRequest < "u") {
        if (!v)
          throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
        var d = new l();
        Object.defineProperties(d, { length: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._length;
        } }, chunkSize: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._chunkSize;
        } } });
        var c = { isDevice: !1, contents: d };
      } else
        var c = { isDevice: !1, url: r };
      var g = o.createFile(e, t, c, n, a);
      c.contents ? g.contents = c.contents : c.url && (g.contents = null, g.url = c.url), Object.defineProperties(g, { usedBytes: { get: function() {
        return this.contents.length;
      } } });
      var p = {}, $ = Object.keys(g.stream_ops);
      $.forEach((P) => {
        var k = g.stream_ops[P];
        p[P] = function() {
          return o.forceLoadFile(g), k.apply(null, arguments);
        };
      });
      function S(P, k, A, I, z) {
        var q = P.node.contents;
        if (z >= q.length)
          return 0;
        var J = Math.min(q.length - z, I);
        if (q.slice)
          for (var H = 0; H < J; H++)
            k[A + H] = q[z + H];
        else
          for (var H = 0; H < J; H++)
            k[A + H] = q.get(z + H);
        return J;
      }
      return p.read = (P, k, A, I, z) => (o.forceLoadFile(g), S(P, k, A, I, z)), p.mmap = (P, k, A, I, z) => {
        o.forceLoadFile(g);
        var q = Ft();
        if (!q)
          throw new o.ErrnoError(48);
        return S(P, W, q, k, A), { ptr: q, allocated: !0 };
      }, g.stream_ops = p, g;
    } }, Rt = (e, t) => e ? we(Y, e, t) : "", G = { DEFAULT_POLLMASK: 5, calculateAt: function(e, t, r) {
      if (O.isAbs(t))
        return t;
      var n;
      if (e === -100)
        n = o.cwd();
      else {
        var a = G.getStreamFromFD(e);
        n = a.path;
      }
      if (t.length == 0) {
        if (!r)
          throw new o.ErrnoError(44);
        return n;
      }
      return O.join2(n, t);
    }, doStat: function(e, t, r) {
      try {
        var n = e(t);
      } catch (c) {
        if (c && c.node && O.normalize(t) !== O.normalize(o.getPath(c.node)))
          return -54;
        throw c;
      }
      U[r >> 2] = n.dev, U[r + 4 >> 2] = n.mode, B[r + 8 >> 2] = n.nlink, U[r + 12 >> 2] = n.uid, U[r + 16 >> 2] = n.gid, U[r + 20 >> 2] = n.rdev, j = [n.size >>> 0, (T = n.size, +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[r + 24 >> 2] = j[0], U[r + 28 >> 2] = j[1], U[r + 32 >> 2] = 4096, U[r + 36 >> 2] = n.blocks;
      var a = n.atime.getTime(), l = n.mtime.getTime(), d = n.ctime.getTime();
      return j = [Math.floor(a / 1e3) >>> 0, (T = Math.floor(a / 1e3), +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[r + 40 >> 2] = j[0], U[r + 44 >> 2] = j[1], B[r + 48 >> 2] = a % 1e3 * 1e3, j = [Math.floor(l / 1e3) >>> 0, (T = Math.floor(l / 1e3), +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[r + 56 >> 2] = j[0], U[r + 60 >> 2] = j[1], B[r + 64 >> 2] = l % 1e3 * 1e3, j = [Math.floor(d / 1e3) >>> 0, (T = Math.floor(d / 1e3), +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[r + 72 >> 2] = j[0], U[r + 76 >> 2] = j[1], B[r + 80 >> 2] = d % 1e3 * 1e3, j = [n.ino >>> 0, (T = n.ino, +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[r + 88 >> 2] = j[0], U[r + 92 >> 2] = j[1], 0;
    }, doMsync: function(e, t, r, n, a) {
      if (!o.isFile(t.node.mode))
        throw new o.ErrnoError(43);
      if (n & 2)
        return 0;
      var l = Y.slice(e, e + r);
      o.msync(t, l, a, r, n);
    }, varargs: void 0, get() {
      G.varargs += 4;
      var e = U[G.varargs - 4 >> 2];
      return e;
    }, getStr(e) {
      var t = Rt(e);
      return t;
    }, getStreamFromFD: function(e) {
      var t = o.getStreamChecked(e);
      return t;
    } };
    function qr(e, t, r) {
      G.varargs = r;
      try {
        var n = G.getStreamFromFD(e);
        switch (t) {
          case 0: {
            var a = G.get();
            if (a < 0)
              return -28;
            var l;
            return l = o.createStream(n, a), l.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return n.flags;
          case 4: {
            var a = G.get();
            return n.flags |= a, 0;
          }
          case 5: {
            var a = G.get(), d = 0;
            return ce[a + d >> 1] = 2, 0;
          }
          case 6:
          case 7:
            return 0;
          case 16:
          case 8:
            return -28;
          case 9:
            return Lr(28), -1;
          default:
            return -28;
        }
      } catch (c) {
        if (typeof o > "u" || c.name !== "ErrnoError")
          throw c;
        return -c.errno;
      }
    }
    function Xr(e, t, r, n) {
      G.varargs = n;
      try {
        t = G.getStr(t), t = G.calculateAt(e, t);
        var a = n ? G.get() : 0;
        return o.open(t, r, a).fd;
      } catch (l) {
        if (typeof o > "u" || l.name !== "ErrnoError")
          throw l;
        return -l.errno;
      }
    }
    function Gr(e, t, r, n, a) {
    }
    function Qe(e) {
      switch (e) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError(`Unknown type size: ${e}`);
      }
    }
    function Kr() {
      for (var e = new Array(256), t = 0; t < 256; ++t)
        e[t] = String.fromCharCode(t);
      Ut = e;
    }
    var Ut = void 0;
    function Z(e) {
      for (var t = "", r = e; Y[r]; )
        t += Ut[Y[r++]];
      return t;
    }
    var _e = {}, ve = {}, Re = {}, Ee = void 0;
    function M(e) {
      throw new Ee(e);
    }
    var Mt = void 0;
    function Ue(e) {
      throw new Mt(e);
    }
    function Pe(e, t, r) {
      e.forEach(function(c) {
        Re[c] = t;
      });
      function n(c) {
        var g = r(c);
        g.length !== e.length && Ue("Mismatched type converter count");
        for (var p = 0; p < e.length; ++p)
          ne(e[p], g[p]);
      }
      var a = new Array(t.length), l = [], d = 0;
      t.forEach((c, g) => {
        ve.hasOwnProperty(c) ? a[g] = ve[c] : (l.push(c), _e.hasOwnProperty(c) || (_e[c] = []), _e[c].push(() => {
          a[g] = ve[c], ++d, d === l.length && n(a);
        }));
      }), l.length === 0 && n(a);
    }
    function Yr(e, t, r = {}) {
      var n = t.name;
      if (e || M(`type "${n}" must have a positive integer typeid pointer`), ve.hasOwnProperty(e)) {
        if (r.ignoreDuplicateRegistrations)
          return;
        M(`Cannot register type '${n}' twice`);
      }
      if (ve[e] = t, delete Re[e], _e.hasOwnProperty(e)) {
        var a = _e[e];
        delete _e[e], a.forEach((l) => l());
      }
    }
    function ne(e, t, r = {}) {
      if (!("argPackAdvance" in t))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      return Yr(e, t, r);
    }
    function Jr(e, t, r, n, a) {
      var l = Qe(r);
      t = Z(t), ne(e, { name: t, fromWireType: function(d) {
        return !!d;
      }, toWireType: function(d, c) {
        return c ? n : a;
      }, argPackAdvance: 8, readValueFromPointer: function(d) {
        var c;
        if (r === 1)
          c = W;
        else if (r === 2)
          c = ce;
        else if (r === 4)
          c = U;
        else
          throw new TypeError("Unknown boolean type size: " + t);
        return this.fromWireType(c[d >> l]);
      }, destructorFunction: null });
    }
    function Zr(e) {
      if (!(this instanceof de) || !(e instanceof de))
        return !1;
      for (var t = this.$$.ptrType.registeredClass, r = this.$$.ptr, n = e.$$.ptrType.registeredClass, a = e.$$.ptr; t.baseClass; )
        r = t.upcast(r), t = t.baseClass;
      for (; n.baseClass; )
        a = n.upcast(a), n = n.baseClass;
      return t === n && r === a;
    }
    function Qr(e) {
      return { count: e.count, deleteScheduled: e.deleteScheduled, preservePointerOnDelete: e.preservePointerOnDelete, ptr: e.ptr, ptrType: e.ptrType, smartPtr: e.smartPtr, smartPtrType: e.smartPtrType };
    }
    function et(e) {
      function t(r) {
        return r.$$.ptrType.registeredClass.name;
      }
      M(t(e) + " instance already deleted");
    }
    var tt = !1;
    function Bt(e) {
    }
    function en(e) {
      e.smartPtr ? e.smartPtrType.rawDestructor(e.smartPtr) : e.ptrType.registeredClass.rawDestructor(e.ptr);
    }
    function Ot(e) {
      e.count.value -= 1;
      var t = e.count.value === 0;
      t && en(e);
    }
    function Lt(e, t, r) {
      if (t === r)
        return e;
      if (r.baseClass === void 0)
        return null;
      var n = Lt(e, t, r.baseClass);
      return n === null ? null : r.downcast(n);
    }
    var It = {};
    function tn() {
      return Object.keys(Ae).length;
    }
    function rn() {
      var e = [];
      for (var t in Ae)
        Ae.hasOwnProperty(t) && e.push(Ae[t]);
      return e;
    }
    var Se = [];
    function rt() {
      for (; Se.length; ) {
        var e = Se.pop();
        e.$$.deleteScheduled = !1, e.delete();
      }
    }
    var Ce = void 0;
    function nn(e) {
      Ce = e, Se.length && Ce && Ce(rt);
    }
    function on() {
      i.getInheritedInstanceCount = tn, i.getLiveInheritedInstances = rn, i.flushPendingDeletes = rt, i.setDelayFunction = nn;
    }
    var Ae = {};
    function sn(e, t) {
      for (t === void 0 && M("ptr should not be undefined"); e.baseClass; )
        t = e.upcast(t), e = e.baseClass;
      return t;
    }
    function an(e, t) {
      return t = sn(e, t), Ae[t];
    }
    function Me(e, t) {
      (!t.ptrType || !t.ptr) && Ue("makeClassHandle requires ptr and ptrType");
      var r = !!t.smartPtrType, n = !!t.smartPtr;
      return r !== n && Ue("Both smartPtrType and smartPtr must be specified"), t.count = { value: 1 }, Te(Object.create(e, { $$: { value: t } }));
    }
    function ln(e) {
      var t = this.getPointee(e);
      if (!t)
        return this.destructor(e), null;
      var r = an(this.registeredClass, t);
      if (r !== void 0) {
        if (r.$$.count.value === 0)
          return r.$$.ptr = t, r.$$.smartPtr = e, r.clone();
        var n = r.clone();
        return this.destructor(e), n;
      }
      function a() {
        return this.isSmartPointer ? Me(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: t, smartPtrType: this, smartPtr: e }) : Me(this.registeredClass.instancePrototype, { ptrType: this, ptr: e });
      }
      var l = this.registeredClass.getActualType(t), d = It[l];
      if (!d)
        return a.call(this);
      var c;
      this.isConst ? c = d.constPointerType : c = d.pointerType;
      var g = Lt(t, this.registeredClass, c.registeredClass);
      return g === null ? a.call(this) : this.isSmartPointer ? Me(c.registeredClass.instancePrototype, { ptrType: c, ptr: g, smartPtrType: this, smartPtr: e }) : Me(c.registeredClass.instancePrototype, { ptrType: c, ptr: g });
    }
    var Te = function(e) {
      return typeof FinalizationRegistry > "u" ? (Te = (t) => t, e) : (tt = new FinalizationRegistry((t) => {
        Ot(t.$$);
      }), Te = (t) => {
        var r = t.$$, n = !!r.smartPtr;
        if (n) {
          var a = { $$: r };
          tt.register(t, a, t);
        }
        return t;
      }, Bt = (t) => tt.unregister(t), Te(e));
    };
    function un() {
      if (this.$$.ptr || et(this), this.$$.preservePointerOnDelete)
        return this.$$.count.value += 1, this;
      var e = Te(Object.create(Object.getPrototypeOf(this), { $$: { value: Qr(this.$$) } }));
      return e.$$.count.value += 1, e.$$.deleteScheduled = !1, e;
    }
    function cn() {
      this.$$.ptr || et(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && M("Object already scheduled for deletion"), Bt(this), Ot(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
    }
    function dn() {
      return !this.$$.ptr;
    }
    function fn() {
      return this.$$.ptr || et(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && M("Object already scheduled for deletion"), Se.push(this), Se.length === 1 && Ce && Ce(rt), this.$$.deleteScheduled = !0, this;
    }
    function hn() {
      de.prototype.isAliasOf = Zr, de.prototype.clone = un, de.prototype.delete = cn, de.prototype.isDeleted = dn, de.prototype.deleteLater = fn;
    }
    function de() {
    }
    var pn = 48, vn = 57;
    function Be(e) {
      if (e === void 0)
        return "_unknown";
      e = e.replace(/[^a-zA-Z0-9_]/g, "$");
      var t = e.charCodeAt(0);
      return t >= pn && t <= vn ? `_${e}` : e;
    }
    function nt(e, t) {
      return e = Be(e), { [e]: function() {
        return t.apply(this, arguments);
      } }[e];
    }
    function jt(e, t, r) {
      if (e[t].overloadTable === void 0) {
        var n = e[t];
        e[t] = function() {
          return e[t].overloadTable.hasOwnProperty(arguments.length) || M(`Function '${r}' called with an invalid number of arguments (${arguments.length}) - expects one of (${e[t].overloadTable})!`), e[t].overloadTable[arguments.length].apply(this, arguments);
        }, e[t].overloadTable = [], e[t].overloadTable[n.argCount] = n;
      }
    }
    function mn(e, t, r) {
      i.hasOwnProperty(e) ? ((r === void 0 || i[e].overloadTable !== void 0 && i[e].overloadTable[r] !== void 0) && M(`Cannot register public name '${e}' twice`), jt(i, e, e), i.hasOwnProperty(r) && M(`Cannot register multiple overloads of a function with the same number of arguments (${r})!`), i[e].overloadTable[r] = t) : (i[e] = t, r !== void 0 && (i[e].numArguments = r));
    }
    function gn(e, t, r, n, a, l, d, c) {
      this.name = e, this.constructor = t, this.instancePrototype = r, this.rawDestructor = n, this.baseClass = a, this.getActualType = l, this.upcast = d, this.downcast = c, this.pureVirtualFunctions = [];
    }
    function it(e, t, r) {
      for (; t !== r; )
        t.upcast || M(`Expected null or instance of ${r.name}, got an instance of ${t.name}`), e = t.upcast(e), t = t.baseClass;
      return e;
    }
    function yn(e, t) {
      if (t === null)
        return this.isReference && M(`null is not a valid ${this.name}`), 0;
      t.$$ || M(`Cannot pass "${st(t)}" as a ${this.name}`), t.$$.ptr || M(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var r = t.$$.ptrType.registeredClass, n = it(t.$$.ptr, r, this.registeredClass);
      return n;
    }
    function wn(e, t) {
      var r;
      if (t === null)
        return this.isReference && M(`null is not a valid ${this.name}`), this.isSmartPointer ? (r = this.rawConstructor(), e !== null && e.push(this.rawDestructor, r), r) : 0;
      t.$$ || M(`Cannot pass "${st(t)}" as a ${this.name}`), t.$$.ptr || M(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && t.$$.ptrType.isConst && M(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
      var n = t.$$.ptrType.registeredClass;
      if (r = it(t.$$.ptr, n, this.registeredClass), this.isSmartPointer)
        switch (t.$$.smartPtr === void 0 && M("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            t.$$.smartPtrType === this ? r = t.$$.smartPtr : M(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            r = t.$$.smartPtr;
            break;
          case 2:
            if (t.$$.smartPtrType === this)
              r = t.$$.smartPtr;
            else {
              var a = t.clone();
              r = this.rawShare(r, Ie.toHandle(function() {
                a.delete();
              })), e !== null && e.push(this.rawDestructor, r);
            }
            break;
          default:
            M("Unsupporting sharing policy");
        }
      return r;
    }
    function _n(e, t) {
      if (t === null)
        return this.isReference && M(`null is not a valid ${this.name}`), 0;
      t.$$ || M(`Cannot pass "${st(t)}" as a ${this.name}`), t.$$.ptr || M(`Cannot pass deleted object as a pointer of type ${this.name}`), t.$$.ptrType.isConst && M(`Cannot convert argument of type ${t.$$.ptrType.name} to parameter type ${this.name}`);
      var r = t.$$.ptrType.registeredClass, n = it(t.$$.ptr, r, this.registeredClass);
      return n;
    }
    function Oe(e) {
      return this.fromWireType(U[e >> 2]);
    }
    function En(e) {
      return this.rawGetPointee && (e = this.rawGetPointee(e)), e;
    }
    function bn(e) {
      this.rawDestructor && this.rawDestructor(e);
    }
    function kn(e) {
      e !== null && e.delete();
    }
    function $n() {
      ie.prototype.getPointee = En, ie.prototype.destructor = bn, ie.prototype.argPackAdvance = 8, ie.prototype.readValueFromPointer = Oe, ie.prototype.deleteObject = kn, ie.prototype.fromWireType = ln;
    }
    function ie(e, t, r, n, a, l, d, c, g, p, $) {
      this.name = e, this.registeredClass = t, this.isReference = r, this.isConst = n, this.isSmartPointer = a, this.pointeeType = l, this.sharingPolicy = d, this.rawGetPointee = c, this.rawConstructor = g, this.rawShare = p, this.rawDestructor = $, !a && t.baseClass === void 0 ? n ? (this.toWireType = yn, this.destructorFunction = null) : (this.toWireType = _n, this.destructorFunction = null) : this.toWireType = wn;
    }
    function Pn(e, t, r) {
      i.hasOwnProperty(e) || Ue("Replacing nonexistant public symbol"), i[e].overloadTable !== void 0 && r !== void 0 ? i[e].overloadTable[r] = t : (i[e] = t, i[e].argCount = r);
    }
    var Sn = (e, t, r) => {
      var n = i["dynCall_" + e];
      return r && r.length ? n.apply(null, [t].concat(r)) : n.call(null, t);
    }, Le = [], zt = (e) => {
      var t = Le[e];
      return t || (e >= Le.length && (Le.length = e + 1), Le[e] = t = bt.get(e)), t;
    }, Cn = (e, t, r) => {
      if (e.includes("j"))
        return Sn(e, t, r);
      var n = zt(t).apply(null, r);
      return n;
    }, An = (e, t) => {
      var r = [];
      return function() {
        return r.length = 0, Object.assign(r, arguments), Cn(e, t, r);
      };
    };
    function be(e, t) {
      e = Z(e);
      function r() {
        return e.includes("j") ? An(e, t) : zt(t);
      }
      var n = r();
      return typeof n != "function" && M(`unknown function pointer with signature ${e}: ${t}`), n;
    }
    function Tn(e, t) {
      var r = nt(t, function(n) {
        this.name = t, this.message = n;
        var a = new Error(n).stack;
        a !== void 0 && (this.stack = this.toString() + `
` + a.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return r.prototype = Object.create(e.prototype), r.prototype.constructor = r, r.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, r;
    }
    var Ht = void 0;
    function Nt(e) {
      var t = Qt(e), r = Z(t);
      return oe(t), r;
    }
    function ot(e, t) {
      var r = [], n = {};
      function a(l) {
        if (!n[l] && !ve[l]) {
          if (Re[l]) {
            Re[l].forEach(a);
            return;
          }
          r.push(l), n[l] = !0;
        }
      }
      throw t.forEach(a), new Ht(`${e}: ` + r.map(Nt).join([", "]));
    }
    function Dn(e, t, r, n, a, l, d, c, g, p, $, S, P) {
      $ = Z($), l = be(a, l), c && (c = be(d, c)), p && (p = be(g, p)), P = be(S, P);
      var k = Be($);
      mn(k, function() {
        ot(`Cannot construct ${$} due to unbound types`, [n]);
      }), Pe([e, t, r], n ? [n] : [], function(A) {
        A = A[0];
        var I, z;
        n ? (I = A.registeredClass, z = I.instancePrototype) : z = de.prototype;
        var q = nt(k, function() {
          if (Object.getPrototypeOf(this) !== J)
            throw new Ee("Use 'new' to construct " + $);
          if (H.constructor_body === void 0)
            throw new Ee($ + " has no accessible constructor");
          var X = H.constructor_body[arguments.length];
          if (X === void 0)
            throw new Ee(`Tried to invoke ctor of ${$} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(H.constructor_body).toString()}) parameters instead!`);
          return X.apply(this, arguments);
        }), J = Object.create(z, { constructor: { value: q } });
        q.prototype = J;
        var H = new gn($, q, J, P, I, l, c, p);
        H.baseClass && (H.baseClass.__derivedClasses === void 0 && (H.baseClass.__derivedClasses = []), H.baseClass.__derivedClasses.push(H));
        var me = new ie($, H, !0, !1, !1), Q = new ie($ + "*", H, !1, !1, !1), se = new ie($ + " const*", H, !1, !0, !1);
        return It[e] = { pointerType: Q, constPointerType: se }, Pn(k, q), [me, Q, se];
      });
    }
    function Vt(e, t) {
      for (var r = [], n = 0; n < e; n++)
        r.push(B[t + n * 4 >> 2]);
      return r;
    }
    function xn(e) {
      for (; e.length; ) {
        var t = e.pop(), r = e.pop();
        r(t);
      }
    }
    function Wt(e, t) {
      if (!(e instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof e} which is not a function`);
      var r = nt(e.name || "unknownFunctionName", function() {
      });
      r.prototype = e.prototype;
      var n = new r(), a = e.apply(n, t);
      return a instanceof Object ? a : n;
    }
    function qt(e, t, r, n, a, l) {
      var d = t.length;
      d < 2 && M("argTypes array size mismatch! Must at least get return value and 'this' types!");
      for (var c = t[1] !== null && r !== null, g = !1, p = 1; p < t.length; ++p)
        if (t[p] !== null && t[p].destructorFunction === void 0) {
          g = !0;
          break;
        }
      for (var $ = t[0].name !== "void", S = "", P = "", p = 0; p < d - 2; ++p)
        S += (p !== 0 ? ", " : "") + "arg" + p, P += (p !== 0 ? ", " : "") + "arg" + p + "Wired";
      var k = `
        return function ${Be(e)}(${S}) {
        if (arguments.length !== ${d - 2}) {
          throwBindingError('function ${e} called with ${arguments.length} arguments, expected ${d - 2} args!');
        }`;
      g && (k += `var destructors = [];
`);
      var A = g ? "destructors" : "null", I = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"], z = [M, n, a, xn, t[0], t[1]];
      c && (k += "var thisWired = classParam.toWireType(" + A + `, this);
`);
      for (var p = 0; p < d - 2; ++p)
        k += "var arg" + p + "Wired = argType" + p + ".toWireType(" + A + ", arg" + p + "); // " + t[p + 2].name + `
`, I.push("argType" + p), z.push(t[p + 2]);
      if (c && (P = "thisWired" + (P.length > 0 ? ", " : "") + P), k += ($ || l ? "var rv = " : "") + "invoker(fn" + (P.length > 0 ? ", " : "") + P + `);
`, g)
        k += `runDestructors(destructors);
`;
      else
        for (var p = c ? 1 : 2; p < t.length; ++p) {
          var q = p === 1 ? "thisWired" : "arg" + (p - 2) + "Wired";
          t[p].destructorFunction !== null && (k += q + "_dtor(" + q + "); // " + t[p].name + `
`, I.push(q + "_dtor"), z.push(t[p].destructorFunction));
        }
      return $ && (k += `var ret = retType.fromWireType(rv);
return ret;
`), k += `}
`, I.push(k), Wt(Function, I).apply(null, z);
    }
    function Fn(e, t, r, n, a, l) {
      var d = Vt(t, r);
      a = be(n, a), Pe([], [e], function(c) {
        c = c[0];
        var g = `constructor ${c.name}`;
        if (c.registeredClass.constructor_body === void 0 && (c.registeredClass.constructor_body = []), c.registeredClass.constructor_body[t - 1] !== void 0)
          throw new Ee(`Cannot register multiple constructors with identical number of parameters (${t - 1}) for class '${c.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return c.registeredClass.constructor_body[t - 1] = () => {
          ot(`Cannot construct ${c.name} due to unbound types`, d);
        }, Pe([], d, function(p) {
          return p.splice(1, 0, null), c.registeredClass.constructor_body[t - 1] = qt(g, p, null, a, l), [];
        }), [];
      });
    }
    function Rn(e, t, r, n, a, l, d, c, g) {
      var p = Vt(r, n);
      t = Z(t), l = be(a, l), Pe([], [e], function($) {
        $ = $[0];
        var S = `${$.name}.${t}`;
        t.startsWith("@@") && (t = Symbol[t.substring(2)]), c && $.registeredClass.pureVirtualFunctions.push(t);
        function P() {
          ot(`Cannot call ${S} due to unbound types`, p);
        }
        var k = $.registeredClass.instancePrototype, A = k[t];
        return A === void 0 || A.overloadTable === void 0 && A.className !== $.name && A.argCount === r - 2 ? (P.argCount = r - 2, P.className = $.name, k[t] = P) : (jt(k, t, S), k[t].overloadTable[r - 2] = P), Pe([], p, function(I) {
          var z = qt(S, I, $, l, d, g);
          return k[t].overloadTable === void 0 ? (z.argCount = r - 2, k[t] = z) : k[t].overloadTable[r - 2] = z, [];
        }), [];
      });
    }
    function Un() {
      Object.assign(Xt.prototype, { get(e) {
        return this.allocated[e];
      }, has(e) {
        return this.allocated[e] !== void 0;
      }, allocate(e) {
        var t = this.freelist.pop() || this.allocated.length;
        return this.allocated[t] = e, t;
      }, free(e) {
        this.allocated[e] = void 0, this.freelist.push(e);
      } });
    }
    function Xt() {
      this.allocated = [void 0], this.freelist = [];
    }
    var te = new Xt();
    function Gt(e) {
      e >= te.reserved && --te.get(e).refcount === 0 && te.free(e);
    }
    function Mn() {
      for (var e = 0, t = te.reserved; t < te.allocated.length; ++t)
        te.allocated[t] !== void 0 && ++e;
      return e;
    }
    function Bn() {
      te.allocated.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 }), te.reserved = te.allocated.length, i.count_emval_handles = Mn;
    }
    var Ie = { toValue: (e) => (e || M("Cannot use deleted val. handle = " + e), te.get(e).value), toHandle: (e) => {
      switch (e) {
        case void 0:
          return 1;
        case null:
          return 2;
        case !0:
          return 3;
        case !1:
          return 4;
        default:
          return te.allocate({ refcount: 1, value: e });
      }
    } };
    function On(e, t) {
      t = Z(t), ne(e, { name: t, fromWireType: function(r) {
        var n = Ie.toValue(r);
        return Gt(r), n;
      }, toWireType: function(r, n) {
        return Ie.toHandle(n);
      }, argPackAdvance: 8, readValueFromPointer: Oe, destructorFunction: null });
    }
    function st(e) {
      if (e === null)
        return "null";
      var t = typeof e;
      return t === "object" || t === "array" || t === "function" ? e.toString() : "" + e;
    }
    function Ln(e, t) {
      switch (t) {
        case 2:
          return function(r) {
            return this.fromWireType(_t[r >> 2]);
          };
        case 3:
          return function(r) {
            return this.fromWireType(Et[r >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + e);
      }
    }
    function In(e, t, r) {
      var n = Qe(r);
      t = Z(t), ne(e, { name: t, fromWireType: function(a) {
        return a;
      }, toWireType: function(a, l) {
        return l;
      }, argPackAdvance: 8, readValueFromPointer: Ln(t, n), destructorFunction: null });
    }
    function jn(e, t, r) {
      switch (t) {
        case 0:
          return r ? function(a) {
            return W[a];
          } : function(a) {
            return Y[a];
          };
        case 1:
          return r ? function(a) {
            return ce[a >> 1];
          } : function(a) {
            return xe[a >> 1];
          };
        case 2:
          return r ? function(a) {
            return U[a >> 2];
          } : function(a) {
            return B[a >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + e);
      }
    }
    function zn(e, t, r, n, a) {
      t = Z(t);
      var l = Qe(r), d = (S) => S;
      if (n === 0) {
        var c = 32 - 8 * r;
        d = (S) => S << c >>> c;
      }
      var g = t.includes("unsigned"), p = (S, P) => {
      }, $;
      g ? $ = function(S, P) {
        return p(P, this.name), P >>> 0;
      } : $ = function(S, P) {
        return p(P, this.name), P;
      }, ne(e, { name: t, fromWireType: d, toWireType: $, argPackAdvance: 8, readValueFromPointer: jn(t, l, n !== 0), destructorFunction: null });
    }
    function Hn(e, t, r) {
      var n = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], a = n[t];
      function l(d) {
        d = d >> 2;
        var c = B, g = c[d], p = c[d + 1];
        return new a(c.buffer, p, g);
      }
      r = Z(r), ne(e, { name: r, fromWireType: l, argPackAdvance: 8, readValueFromPointer: l }, { ignoreDuplicateRegistrations: !0 });
    }
    var Nn = (e, t, r) => Ye(e, Y, t, r);
    function Vn(e, t) {
      t = Z(t);
      var r = t === "std::string";
      ne(e, { name: t, fromWireType: function(n) {
        var a = B[n >> 2], l = n + 4, d;
        if (r)
          for (var c = l, g = 0; g <= a; ++g) {
            var p = l + g;
            if (g == a || Y[p] == 0) {
              var $ = p - c, S = Rt(c, $);
              d === void 0 ? d = S : (d += String.fromCharCode(0), d += S), c = p + 1;
            }
          }
        else {
          for (var P = new Array(a), g = 0; g < a; ++g)
            P[g] = String.fromCharCode(Y[l + g]);
          d = P.join("");
        }
        return oe(n), d;
      }, toWireType: function(n, a) {
        a instanceof ArrayBuffer && (a = new Uint8Array(a));
        var l, d = typeof a == "string";
        d || a instanceof Uint8Array || a instanceof Uint8ClampedArray || a instanceof Int8Array || M("Cannot pass non-string to std::string"), r && d ? l = Ke(a) : l = a.length;
        var c = ut(4 + l + 1), g = c + 4;
        if (B[c >> 2] = l, r && d)
          Nn(a, g, l + 1);
        else if (d)
          for (var p = 0; p < l; ++p) {
            var $ = a.charCodeAt(p);
            $ > 255 && (oe(g), M("String has UTF-16 code units that do not fit in 8 bits")), Y[g + p] = $;
          }
        else
          for (var p = 0; p < l; ++p)
            Y[g + p] = a[p];
        return n !== null && n.push(oe, c), c;
      }, argPackAdvance: 8, readValueFromPointer: Oe, destructorFunction: function(n) {
        oe(n);
      } });
    }
    var Kt = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, Wn = (e, t) => {
      for (var r = e, n = r >> 1, a = n + t / 2; !(n >= a) && xe[n]; )
        ++n;
      if (r = n << 1, r - e > 32 && Kt)
        return Kt.decode(Y.subarray(e, r));
      for (var l = "", d = 0; !(d >= t / 2); ++d) {
        var c = ce[e + d * 2 >> 1];
        if (c == 0)
          break;
        l += String.fromCharCode(c);
      }
      return l;
    }, qn = (e, t, r) => {
      if (r === void 0 && (r = 2147483647), r < 2)
        return 0;
      r -= 2;
      for (var n = t, a = r < e.length * 2 ? r / 2 : e.length, l = 0; l < a; ++l) {
        var d = e.charCodeAt(l);
        ce[t >> 1] = d, t += 2;
      }
      return ce[t >> 1] = 0, t - n;
    }, Xn = (e) => e.length * 2, Gn = (e, t) => {
      for (var r = 0, n = ""; !(r >= t / 4); ) {
        var a = U[e + r * 4 >> 2];
        if (a == 0)
          break;
        if (++r, a >= 65536) {
          var l = a - 65536;
          n += String.fromCharCode(55296 | l >> 10, 56320 | l & 1023);
        } else
          n += String.fromCharCode(a);
      }
      return n;
    }, Kn = (e, t, r) => {
      if (r === void 0 && (r = 2147483647), r < 4)
        return 0;
      for (var n = t, a = n + r - 4, l = 0; l < e.length; ++l) {
        var d = e.charCodeAt(l);
        if (d >= 55296 && d <= 57343) {
          var c = e.charCodeAt(++l);
          d = 65536 + ((d & 1023) << 10) | c & 1023;
        }
        if (U[t >> 2] = d, t += 4, t + 4 > a)
          break;
      }
      return U[t >> 2] = 0, t - n;
    }, Yn = (e) => {
      for (var t = 0, r = 0; r < e.length; ++r) {
        var n = e.charCodeAt(r);
        n >= 55296 && n <= 57343 && ++r, t += 4;
      }
      return t;
    }, Jn = function(e, t, r) {
      r = Z(r);
      var n, a, l, d, c;
      t === 2 ? (n = Wn, a = qn, d = Xn, l = () => xe, c = 1) : t === 4 && (n = Gn, a = Kn, d = Yn, l = () => B, c = 2), ne(e, { name: r, fromWireType: function(g) {
        for (var p = B[g >> 2], $ = l(), S, P = g + 4, k = 0; k <= p; ++k) {
          var A = g + 4 + k * t;
          if (k == p || $[A >> c] == 0) {
            var I = A - P, z = n(P, I);
            S === void 0 ? S = z : (S += String.fromCharCode(0), S += z), P = A + t;
          }
        }
        return oe(g), S;
      }, toWireType: function(g, p) {
        typeof p != "string" && M(`Cannot pass non-string to C++ string type ${r}`);
        var $ = d(p), S = ut(4 + $ + t);
        return B[S >> 2] = $ >> c, a(p, S + 4, $ + t), g !== null && g.push(oe, S), S;
      }, argPackAdvance: 8, readValueFromPointer: Oe, destructorFunction: function(g) {
        oe(g);
      } });
    };
    function Zn(e, t) {
      t = Z(t), ne(e, { isVoid: !0, name: t, argPackAdvance: 0, fromWireType: function() {
      }, toWireType: function(r, n) {
      } });
    }
    var Qn = {};
    function ei(e) {
      var t = Qn[e];
      return t === void 0 ? Z(e) : t;
    }
    var at = [];
    function ti(e, t, r, n) {
      e = at[e], t = Ie.toValue(t), r = ei(r), e(t, r, null, n);
    }
    function ri(e) {
      var t = at.length;
      return at.push(e), t;
    }
    function ni(e, t) {
      var r = ve[e];
      return r === void 0 && M(t + " has unknown type " + Nt(e)), r;
    }
    function ii(e, t) {
      for (var r = new Array(e), n = 0; n < e; ++n)
        r[n] = ni(B[t + n * 4 >> 2], "parameter " + n);
      return r;
    }
    var Yt = [];
    function oi(e, t) {
      var r = ii(e, t), n = r[0], a = n.name + "_$" + r.slice(1).map(function(A) {
        return A.name;
      }).join("_") + "$", l = Yt[a];
      if (l !== void 0)
        return l;
      for (var d = ["retType"], c = [n], g = "", p = 0; p < e - 1; ++p)
        g += (p !== 0 ? ", " : "") + "arg" + p, d.push("argType" + p), c.push(r[1 + p]);
      for (var $ = Be("methodCaller_" + a), S = "return function " + $ + `(handle, name, destructors, args) {
`, P = 0, p = 0; p < e - 1; ++p)
        S += "    var arg" + p + " = argType" + p + ".readValueFromPointer(args" + (P ? "+" + P : "") + `);
`, P += r[p + 1].argPackAdvance;
      S += "    var rv = handle[name](" + g + `);
`;
      for (var p = 0; p < e - 1; ++p)
        r[p + 1].deleteObject && (S += "    argType" + p + ".deleteObject(arg" + p + `);
`);
      n.isVoid || (S += `    return retType.toWireType(destructors, rv);
`), S += `};
`, d.push(S);
      var k = Wt(Function, d).apply(null, c);
      return l = ri(k), Yt[a] = l, l;
    }
    function si(e, t) {
      return t + 2097152 >>> 0 < 4194305 - !!e ? (e >>> 0) + t * 4294967296 : NaN;
    }
    var ai = () => {
      he("");
    };
    function li() {
      return Date.now();
    }
    var ui = () => Y.length, ci = () => ui(), di = (e, t, r) => Y.copyWithin(e, t, t + r), fi = (e) => {
      he("OOM");
    }, hi = (e) => {
      Y.length, fi();
    }, lt = {}, pi = () => w || "./this.program", De = () => {
      if (!De.strings) {
        var e = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", t = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: e, _: pi() };
        for (var r in lt)
          lt[r] === void 0 ? delete t[r] : t[r] = lt[r];
        var n = [];
        for (var r in t)
          n.push(`${r}=${t[r]}`);
        De.strings = n;
      }
      return De.strings;
    }, vi = (e, t) => {
      for (var r = 0; r < e.length; ++r)
        W[t++ >> 0] = e.charCodeAt(r);
      W[t >> 0] = 0;
    }, mi = (e, t) => {
      var r = 0;
      return De().forEach(function(n, a) {
        var l = t + r;
        B[e + a * 4 >> 2] = l, vi(n, l), r += n.length + 1;
      }), 0;
    }, gi = (e, t) => {
      var r = De();
      B[e >> 2] = r.length;
      var n = 0;
      return r.forEach(function(a) {
        n += a.length + 1;
      }), B[t >> 2] = n, 0;
    };
    function yi(e) {
      try {
        var t = G.getStreamFromFD(e);
        return o.close(t), 0;
      } catch (r) {
        if (typeof o > "u" || r.name !== "ErrnoError")
          throw r;
        return r.errno;
      }
    }
    function wi(e, t) {
      try {
        var r = 0, n = 0, a = 0, l = G.getStreamFromFD(e), d = l.tty ? 2 : o.isDir(l.mode) ? 3 : o.isLink(l.mode) ? 7 : 4;
        return W[t >> 0] = d, ce[t + 2 >> 1] = a, j = [r >>> 0, (T = r, +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[t + 8 >> 2] = j[0], U[t + 12 >> 2] = j[1], j = [n >>> 0, (T = n, +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[t + 16 >> 2] = j[0], U[t + 20 >> 2] = j[1], 0;
      } catch (c) {
        if (typeof o > "u" || c.name !== "ErrnoError")
          throw c;
        return c.errno;
      }
    }
    var _i = (e, t, r, n) => {
      for (var a = 0, l = 0; l < r; l++) {
        var d = B[t >> 2], c = B[t + 4 >> 2];
        t += 8;
        var g = o.read(e, W, d, c, n);
        if (g < 0)
          return -1;
        if (a += g, g < c)
          break;
        typeof n < "u" && (n += g);
      }
      return a;
    };
    function Ei(e, t, r, n) {
      try {
        var a = G.getStreamFromFD(e), l = _i(a, t, r);
        return B[n >> 2] = l, 0;
      } catch (d) {
        if (typeof o > "u" || d.name !== "ErrnoError")
          throw d;
        return d.errno;
      }
    }
    function bi(e, t, r, n, a) {
      var l = si(t, r);
      try {
        if (isNaN(l))
          return 61;
        var d = G.getStreamFromFD(e);
        return o.llseek(d, l, n), j = [d.position >>> 0, (T = d.position, +Math.abs(T) >= 1 ? T > 0 ? +Math.floor(T / 4294967296) >>> 0 : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0 : 0)], U[a >> 2] = j[0], U[a + 4 >> 2] = j[1], d.getdents && l === 0 && n === 0 && (d.getdents = null), 0;
      } catch (c) {
        if (typeof o > "u" || c.name !== "ErrnoError")
          throw c;
        return c.errno;
      }
    }
    var ki = (e, t, r, n) => {
      for (var a = 0, l = 0; l < r; l++) {
        var d = B[t >> 2], c = B[t + 4 >> 2];
        t += 8;
        var g = o.write(e, W, d, c, n);
        if (g < 0)
          return -1;
        a += g, typeof n < "u" && (n += g);
      }
      return a;
    };
    function $i(e, t, r, n) {
      try {
        var a = G.getStreamFromFD(e), l = ki(a, t, r);
        return B[n >> 2] = l, 0;
      } catch (d) {
        if (typeof o > "u" || d.name !== "ErrnoError")
          throw d;
        return d.errno;
      }
    }
    var Jt = function(e, t, r, n) {
      e || (e = this), this.parent = e, this.mount = e.mount, this.mounted = null, this.id = o.nextInode++, this.name = t, this.mode = r, this.node_ops = {}, this.stream_ops = {}, this.rdev = n;
    }, je = 365, ze = 146;
    Object.defineProperties(Jt.prototype, { read: { get: function() {
      return (this.mode & je) === je;
    }, set: function(e) {
      e ? this.mode |= je : this.mode &= ~je;
    } }, write: { get: function() {
      return (this.mode & ze) === ze;
    }, set: function(e) {
      e ? this.mode |= ze : this.mode &= ~ze;
    } }, isFolder: { get: function() {
      return o.isDir(this.mode);
    } }, isDevice: { get: function() {
      return o.isChrdev(this.mode);
    } } }), o.FSNode = Jt, o.createPreloadedFile = Vr, o.staticInit(), Kr(), Ee = i.BindingError = class extends Error {
      constructor(t) {
        super(t), this.name = "BindingError";
      }
    }, Mt = i.InternalError = class extends Error {
      constructor(t) {
        super(t), this.name = "InternalError";
      }
    }, hn(), on(), $n(), Ht = i.UnboundTypeError = Tn(Error, "UnboundTypeError"), Un(), Bn();
    var Pi = { p: Or, C: qr, w: Xr, t: Gr, n: Jr, r: Dn, q: Fn, d: Rn, D: On, k: In, c: zn, b: Hn, j: Vn, f: Jn, o: Zn, g: ti, m: Gt, l: oi, a: ai, e: li, v: ci, A: di, u: hi, y: mi, z: gi, i: yi, x: wi, B: Ei, s: bi, h: $i };
    Mr();
    var ut = (e) => (ut = V.G)(e), oe = (e) => (oe = V.I)(e), Zt = () => (Zt = V.J)(), Qt = (e) => (Qt = V.K)(e);
    i.__embind_initialize_bindings = () => (i.__embind_initialize_bindings = V.L)();
    var er = (e) => (er = V.M)(e);
    i.dynCall_viiijj = (e, t, r, n, a, l, d, c) => (i.dynCall_viiijj = V.N)(e, t, r, n, a, l, d, c), i.dynCall_jij = (e, t, r, n) => (i.dynCall_jij = V.O)(e, t, r, n), i.dynCall_jii = (e, t, r) => (i.dynCall_jii = V.P)(e, t, r), i.dynCall_jiji = (e, t, r, n, a) => (i.dynCall_jiji = V.Q)(e, t, r, n, a);
    var He;
    $e = function e() {
      He || tr(), He || ($e = e);
    };
    function tr() {
      if (fe > 0 || (Sr(), fe > 0))
        return;
      function e() {
        He || (He = !0, i.calledRun = !0, !L && (Cr(), f(i), i.onRuntimeInitialized && i.onRuntimeInitialized(), Ar()));
      }
      i.setStatus ? (i.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          i.setStatus("");
        }, 1), e();
      }, 1)) : e();
    }
    if (i.preInit)
      for (typeof i.preInit == "function" && (i.preInit = [i.preInit]); i.preInit.length > 0; )
        i.preInit.pop()();
    return tr(), s.ready;
  };
})(), ss = Object.defineProperty, as = Object.getOwnPropertyDescriptor, dr = (y, s, i, f) => {
  for (var u = f > 1 ? void 0 : f ? as(s, i) : s, m = y.length - 1, w; m >= 0; m--)
    (w = y[m]) && (u = (f ? w(s, i, u) : w(u)) || u);
  return f && u && ss(s, i, u), u;
};
class fr extends ee {
  constructor() {
    super(...arguments), this.sampleRate = 0, this.channels = 0;
  }
  initialize() {
    return new Promise((s) => {
      const i = {};
      i.print = (f) => console.log(f), i.printErr = (f) => console.log(`[JS] ERROR: ${f}`), i.onAbort = () => console.log("[JS] FATAL: WASM ABORTED"), i.postRun = (f) => {
        this.module = f, this.decoder = new this.module.AudioDecoder(this), s();
      }, console.log("audio soft decoder initialize call"), os(i);
    });
  }
  configure(s) {
    this.config = s, this.decoder.setCodec(this.config.codec, this.config.description ?? "");
  }
  decode(s) {
    this.decoder.decode(s.data, s.timestamp);
  }
  flush() {
  }
  reset() {
    this.config = void 0, this.decoder && this.decoder.clear();
  }
  close() {
    this.removeAllListeners(), this.decoder && (this.decoder.clear(), this.decoder.delete());
  }
  // wasm callback function
  audioInfo(s, i) {
    this.sampleRate = s, this.channels = i;
    let f = {
      sampleRate: s,
      channels: i,
      depth: 16
    };
    this.emit(yr.AudioCodecInfo, f);
  }
  pcmData(s, i, f) {
    if (!this.module)
      return;
    let u = [], m = 0, w = 0;
    for (let v = 0; v < this.channels; v++) {
      let h = this.module.HEAPU32[(s >> 2) + v] >> 2;
      const E = this.module.HEAPF32.subarray(h, h + i);
      u.push(E), m += E.length;
    }
    const b = new Float32Array(m);
    this.emit(yr.AudioFrame, new AudioData({
      format: "f32-planar",
      sampleRate: this.sampleRate,
      numberOfChannels: this.channels,
      timestamp: f,
      numberOfFrames: i,
      data: u.reduce((v, h) => (v.subarray(w).set(h), w += h.length, v), b)
    }));
  }
  errorInfo(s) {
    let i = {
      errMsg: s
    };
    this.emit(yr.Error, i);
  }
}
dr([
  We(ee.INIT, "initialized")
], fr.prototype, "initialize", 1);
dr([
  We("initialized", "configured", { sync: !0 })
], fr.prototype, "configure", 1);
dr([
  es("configured")
], fr.prototype, "decode", 1);
dr([
  We("configured", "initialized", { sync: !0 })
], fr.prototype, "reset", 1);
dr([
  We([], "closed", { sync: !0 })
], fr.prototype, "close", 1);
class ls extends Oi {
  constructor(s, i) {
    super(), this.index = s, this.state = "init", this.fmp4Parser = new Yo(!1), this.tracks = [], this.loadingProgress = { loaded: 0, total: 0, percent: 0 }, this.url = i.url, this.duration = i.duration, this.virtualStartTime = 0, this.virtualEndTime = 0, this.physicalTime = i.physicalTime;
  }
  async fetchWithProgress(s) {
    const i = await fetch(s), f = i.body.getReader(), u = +i.headers.get("Content-Length");
    let m = 0;
    const w = [];
    for (; ; ) {
      const { done: h, value: E } = await f.read();
      if (h)
        break;
      w.push(E), m += E.length, this.loadingProgress = {
        loaded: m,
        total: u,
        percent: u ? m / u * 100 : 0
      }, this.emit("progress", this.loadingProgress);
    }
    const b = new Uint8Array(m);
    let v = 0;
    for (const h of w)
      b.set(h, v), v += h.length;
    return b.buffer;
  }
  async load(s) {
    this.state = "loading", this.data || (this.data = this.fetchWithProgress(this.url));
    const i = await this.data;
    if (this.tracks.length === 0 && (this.tracks = this.fmp4Parser.parse(i)), !s.initialized) {
      const f = `video/mp4; codecs="${this.tracks.map((u) => u.codec).join(", ")}"`;
      if (MediaSource.isTypeSupported(f))
        s.init(f);
      else
        throw new Error(`Unsupported codec: ${f}`);
    }
    this.state === "loading" && (this.state = "buffering", await s.appendBuffer({ data: i, tracks: this.tracks }), this.state = "buffered");
  }
  unBuffer() {
    this.state !== "init" && (delete this.ready, this.state = "loaded");
  }
}
const us = /#EXTINF:(\d+\.\d+),(.*?)\s*$/;
function cs(y, s) {
  const i = y.split(`
`), f = [];
  let u = 0, m = 0, w = 0, b = null;
  for (let v = 0; v < i.length; v++) {
    const h = i[v].trim();
    if (h.startsWith("#EXTINF:")) {
      const E = h.match(us);
      if (E) {
        w = parseFloat(E[1]);
        const _ = E[2] ? E[2].trim() : "";
        try {
          _ ? b = new Date(_) : b = null;
        } catch {
          b = null;
        }
      }
    } else if (!h.startsWith("#") && h !== "") {
      const E = new URL(h, s), _ = u, D = u + w, F = new ls(m, {
        url: E.toString(),
        duration: w,
        physicalTime: b
      });
      F.virtualStartTime = _, F.virtualEndTime = D, f.push(F), u += w, m++, b = null;
    }
  }
  return { segments: f, totalDuration: u };
}
class ds {
  constructor(s) {
    this.mediaSource = s, this.queue = [], this.removeQueue = [], this.currentError = console.log;
  }
  get initialized() {
    return !!this.sourceBuffer;
  }
  init(s) {
    console.log("init", s), this.sourceBuffer = this.mediaSource.addSourceBuffer(s), this.sourceBuffer.mode = "sequence", this.sourceBuffer.addEventListener("updateend", () => {
      if (this.currentWaiting?.(), this.removeQueue.length > 0) {
        const { start: i, end: f, resolve: u, reject: m } = this.removeQueue.shift();
        this.sourceBuffer.remove(i, f), this.currentWaiting = u, this.currentError = m;
      } else if (this.queue.length > 0) {
        const { data: i, resolve: f, reject: u } = this.queue.shift();
        this.sourceBuffer.appendBuffer(i), this.currentWaiting = f, this.currentError = u;
      } else
        delete this.currentWaiting;
    }), this.sourceBuffer.addEventListener("error", (i) => {
      this.currentError(i);
    });
  }
  appendBuffer(s) {
    return this.currentWaiting ? new Promise((i, f) => {
      this.queue.push({ data: s.data, resolve: i, reject: f });
    }) : (this.sourceBuffer.appendBuffer(s.data), new Promise((i, f) => {
      this.currentWaiting = i, this.currentError = f;
    }));
  }
  remove(s, i) {
    return this.currentWaiting ? new Promise((f, u) => {
      this.removeQueue.push({ start: s, end: i, resolve: f, reject: u });
    }) : (this.sourceBuffer.remove(s, i), new Promise((f, u) => {
      this.currentWaiting = f, this.currentError = u;
    }));
  }
  destroy() {
    if (this.sourceBuffer) {
      try {
        this.mediaSource.removeSourceBuffer(this.sourceBuffer);
      } catch {
      }
      this.sourceBuffer = void 0;
    }
    this.queue = [], this.removeQueue = [], delete this.currentWaiting, this.currentError = () => {
    };
  }
}
class fs extends Oi {
  constructor(s = { debug: !1 }) {
    super(), this.mediaSource = new MediaSource(), this.sourceBufferProxy = new ds(this.mediaSource), this.urlSource = URL.createObjectURL(this.mediaSource), this.debug = !1, this.ready = this.init(), this.debug = s.debug;
  }
  async appendSegment(s) {
    if (!this.sourceBufferProxy)
      throw new Error("SourceBufferProxy not initialized");
    return s.ready ? (await s.ready, !1) : (s.ready = s.load(this.sourceBufferProxy), await s.ready, !0);
  }
  async removeBuffer(s, i) {
    if (!this.sourceBufferProxy)
      throw new Error("SourceBufferProxy not initialized");
    return this.sourceBufferProxy.remove(s, i);
  }
  destroy() {
    this.mediaSource?.readyState === "open" && this.mediaSource.endOfStream(), this.urlSource && URL.revokeObjectURL(this.urlSource), this.sourceBufferProxy?.destroy(), this.emit("destroyed");
  }
  get readyState() {
    return this.mediaSource.readyState;
  }
  endOfStream() {
    this.mediaSource.readyState === "open" && this.mediaSource.endOfStream();
  }
  init() {
    return this.mediaSource.addEventListener("sourceended", () => {
      this.emit("ended");
    }), this.mediaSource.addEventListener("sourceclose", () => {
      this.emit("closed");
    }), new Promise((s, i) => {
      this.mediaSource.addEventListener("sourceopen", () => {
        this.emit("sourceopen"), s();
      });
    });
  }
}
class hs extends Oi {
  constructor(s, i = { debug: !1, autoPlay: !1 }) {
    super(), this.video = s, this.segments = [], this.totalDuration = 0, this.position = 0, this.offset = 0, this.debug = !1, this.autoPlay = !1, this.isPlaying = !1, this.pauseOB = Ci(), this.seekOB = Ci(), this.destroyOB = Ci(), this.debug = i.debug, this.autoPlay = i.autoPlay, this.log("Engine initialized with options:", i);
    let f, u = Promise.resolve(!0);
    hr(this.seekOB, Go((m) => {
      this.log("Seek requested to time:", m), this.position = m;
      const w = this.currentSegment, b = m - w.virtualStartTime;
      return this.log("Offset in segment:", b), s.pause(), async (v) => {
        if (await u, v.disposed || (f || (this.log("Creating new MediaSourceProxy"), f = new fs({
          debug: this.debug
        }), s.src = f.urlSource), await f.ready, v.disposed))
          return;
        const h = this.bufferStart, E = this.bufferEnd;
        this.log("Appending segment:", w);
        const _ = await f.appendSegment(w);
        if (v.disposed)
          return;
        if (_) {
          if (this.log("Segment appended successfully"), this.segments.filter((x) => x.ready && x != w).forEach((x) => {
            this.log("Unbuffering segment:", x), x.unBuffer();
          }), E > h && (this.log("Removing buffer range:", h, "to", E), await f.removeBuffer(h, E), v.disposed))
            return;
          const F = b + E;
          this.offset = m - F, this.log("New offset calculated:", this.offset, "target:", F, "position:", m);
        }
        const D = m - this.offset;
        this.log("Buffer:", `[${this.bufferStart},${this.bufferEnd}]`, "Target:", D), s.currentTime = D, this.log("Set video currentTime to:", s.currentTime), v.next(!0);
      };
    }), pr(this.destroyOB), vr(() => {
      this.isPlaying && (this.log("Resuming playback"), s.play());
    })), hr(Ti(s, "timeupdate"), pr(this.destroyOB), Vo(() => s.currentTime + this.offset), vr((m) => {
      this.position = m;
      const w = this.segments[this.currentSegment.index + 1];
      w && !w.ready && f && (this.log("Loading next segment:", w), u = f.appendSegment(w));
    })), hr(Ti(s, "error"), pr(this.destroyOB), vr(() => {
      s.src = "", f && f.destroy(), f = void 0, this.segments.forEach((m) => m.unBuffer()), this.offset = 0, this.seek(this.position + 1);
    })), hr(Ti(s, "waiting"), pr(this.destroyOB), vr(() => {
      this.totalDuration - this.position < 1 && (s.src = "", f && f.destroy(), f = void 0, this.segments.forEach((m) => m.unBuffer()), this.offset = 0, this.pause(), this.seek(0));
    }));
  }
  log(...s) {
    this.debug && console.log("[Engine]", ...s);
  }
  get currentSegment() {
    return this.segments.find((i) => i.virtualEndTime > this.position);
  }
  get bufferStart() {
    return this.video.buffered.length > 0 ? this.video.buffered.start(0) : 0;
  }
  get bufferEnd() {
    return this.video.buffered.length > 0 ? this.video.buffered.end(this.video.buffered.length - 1) : 0;
  }
  get bufferedLength() {
    const s = this.currentSegment;
    if (!s)
      return 0;
    let i = 0;
    for (let f = s.index; f < this.segments.length; f++)
      this.segments[f].state === "buffered" && (i += this.segments[f].duration);
    return i - (this.position - this.currentSegment.virtualStartTime);
  }
  async load(s) {
    this.log("Loading URL:", s);
    let i;
    try {
      i = new URL(s);
    } catch {
      i = new URL(s, window.location.href);
    }
    switch (i.pathname.split(".").pop()) {
      case "m3u8":
        this.log("Processing M3U8 playlist");
        const f = await fetch(i.toString()).then((m) => m.text()), u = cs(f, i.origin + i.pathname.split("/").slice(0, -1).join("/"));
        this.log("Playlist created:", u), this.segments = u.segments, this.totalDuration = u.totalDuration, this.autoPlay ? (this.log("Auto-play enabled, starting playback"), this.play()) : (this.log("Seeking to start position"), this.seek(0));
        break;
    }
  }
  play() {
    this.log("Play requested"), this.isPlaying = !0, this.seekOB.next(this.position);
  }
  pause() {
    this.log("Pause requested"), this.isPlaying = !1, this.pauseOB.next(!0), this.video.pause();
  }
  seek(s) {
    this.log("Seek requested to:", s), this.seekOB.next(s);
  }
  destroy() {
    this.log("Destroying engine"), this.video.src = "", this.destroyOB.next(!0);
  }
}
class ji extends ir {
  constructor() {
    super(), this.hideControlsTimeoutId = null, this.playbackRates = [0.5, 1, 1.5, 2, 3, 4], this.updateTimelineUI = () => {
      if (!this.engine || !this.progressRef || !this.bufferRef)
        return;
      this.currentPosition = this.engine.position, this.totalDuration !== this.engine.totalDuration && (this.totalDuration = this.engine.totalDuration);
      const s = this.engine.position / this.totalDuration * 100;
      this.progressRef.style.width = `${s}%`;
      const i = this.engine.bufferedLength / this.totalDuration * 100;
      this.bufferRef.style.width = `${i}%`;
    }, this.handleKeyDown = (s) => {
      switch (s.key) {
        case " ":
        case "k":
          this.togglePlay(), s.preventDefault();
          break;
        case "ArrowRight":
          this.seekForward(), s.preventDefault();
          break;
        case "ArrowLeft":
          this.seekBackward(), s.preventDefault();
          break;
        case "f":
          this.toggleFullscreen(), s.preventDefault();
          break;
        case "m":
          this.toggleMute(), s.preventDefault();
          break;
      }
    }, this.handleDrag = (s) => {
      if (!this.isDragging || !this.timelineRef || !this.engine)
        return;
      const i = this.timelineRef.getBoundingClientRect(), f = (s.clientX - i.left) / i.width, u = Math.max(
        0,
        Math.min(f * this.totalDuration, this.totalDuration)
      );
      this.currentPosition = u;
      const m = u / this.totalDuration * 100;
      this.progressRef && (this.progressRef.style.width = `${m}%`);
    }, this.stopDrag = (s) => {
      this.isDragging && (this.handleTimelineClick(s), document.removeEventListener("mousemove", this.handleDrag), document.removeEventListener("mouseup", this.stopDrag), this.isDragging = !1);
    }, this.debug = !1, this.isDragging = !1, this.isHovering = !1, this.playbackRate = 1, this.isPlaying = !1, this.currentPosition = 0, this.totalDuration = 0, this.showControls = !1, this.volume = 1, this.isMuted = !1, this.showPlaybackRateMenu = !1, this.showVolumeSlider = !1, this.isFullscreen = !1, this.isVolumeDragging = !1, this.singleFmp4 = !1, this.isWideScreen = !0, this.isLoading = !1, this.isUserPaused = !1;
  }
  // Getters for DOM references
  get video() {
    return this._video || (this._video = this.renderRoot.querySelector("video")), this._video;
  }
  get timelineRef() {
    return this._timelineRef || (this._timelineRef = this.renderRoot.querySelector(".timeline")), this._timelineRef;
  }
  get progressRef() {
    return this._progressRef || (this._progressRef = this.renderRoot.querySelector(".timeline-progress")), this._progressRef;
  }
  get bufferRef() {
    return this._bufferRef || (this._bufferRef = this.renderRoot.querySelector(".timeline-buffer")), this._bufferRef;
  }
  get playerRef() {
    return this._playerRef || (this._playerRef = this.renderRoot.querySelector(".video-player")), this._playerRef;
  }
  // Lifecycle methods
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("keydown", this.handleKeyDown);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.engine && this.engine.destroy(), this.hideControlsTimeoutId !== null && window.clearTimeout(this.hideControlsTimeoutId), this.video?.removeEventListener("timeupdate", this.updateTimelineUI);
  }
  firstUpdated() {
    this.video && (this.video.addEventListener("timeupdate", this.updateTimelineUI), this.video.addEventListener("play", () => {
      this.isPlaying = !0, this.isUserPaused || (this.isLoading = !1);
    }), this.video.addEventListener("pause", () => {
      this.isPlaying = !1;
    }), this.video.addEventListener("waiting", () => {
      this.isUserPaused || (this.isLoading = !0);
    }), this.video.addEventListener("canplay", () => {
      this.isLoading = !1;
    }), this.video.addEventListener("playing", () => {
      this.isLoading = !1;
    }), this.video.addEventListener("error", (s) => {
      console.error("Video error occurred:", s), this.isLoading = !1;
    }), this.video.volume = this.volume), this.playerRef && (new ResizeObserver(() => {
      this.checkScreenWidth();
    }).observe(this.playerRef), this.checkScreenWidth()), this.src && this.setupEngine();
  }
  updated(s) {
    s.has("src") && this.setupEngine();
  }
  // Helper methods
  formatTime(s) {
    const i = Math.floor(s / 3600), f = Math.floor(s % 3600 / 60), u = Math.floor(s % 60), m = (w) => w.toString().padStart(2, "0");
    return i > 0 ? `${m(i)}:${m(f)}:${m(u)}` : `${m(f)}:${m(u)}`;
  }
  checkScreenWidth() {
    this.playerRef && (this.isWideScreen = this.playerRef.offsetWidth >= 400);
  }
  setupEngine() {
    !this.video || !this.src || (this.engine && this.engine.destroy(), this.isLoading = !0, this.currentPosition = 0, this.totalDuration = 0, this.engine = new hs(this.video, { debug: this.debug, autoPlay: !1 }), this.engine.load(this.src).then(() => {
      this.totalDuration = this.engine.totalDuration, this.isLoading = !1;
    }).catch((s) => {
      console.error("Failed to load video:", s), this.isLoading = !1;
    }));
  }
  handleTimelineClick(s) {
    if (!this.timelineRef || !this.engine)
      return;
    const i = this.timelineRef.getBoundingClientRect(), u = (s.clientX - i.left) / i.width * this.totalDuration;
    this.engine.seek(u), this.currentPosition = u;
  }
  togglePlay() {
    !this.video || !this.engine || (this.engine.isPlaying ? this.engine.pause() : this.engine.play());
  }
  changePlaybackRate(s) {
    !this.video || !this.engine || (this.playbackRate = s, this.video.playbackRate = s, this.showPlaybackRateMenu = !1);
  }
  togglePlaybackRateMenu() {
    this.showPlaybackRateMenu = !this.showPlaybackRateMenu;
  }
  toggleMute() {
    this.video && (this.isMuted = !this.isMuted, this.video.muted = this.isMuted);
  }
  handleVolumeChange(s) {
    if (!this.video)
      return;
    const f = s.currentTarget.getBoundingClientRect();
    this.updateVolumeFromPosition(s.clientY, f);
  }
  updateVolumeFromPosition(s, i) {
    const f = i.height, u = 1 - Math.max(0, Math.min(1, (s - i.top) / f)), m = Math.max(0, Math.min(1, u));
    this.volume = m, this.video && (this.video.volume = m, this.isMuted = m === 0, this.video.muted = m === 0);
  }
  startVolumeDrag(s) {
    s.preventDefault(), this.isVolumeDragging = !0;
    const f = s.currentTarget.getBoundingClientRect();
    this.updateVolumeFromPosition(s.clientY, f);
    const u = (w) => {
      this.isVolumeDragging && this.updateVolumeFromPosition(w.clientY, f);
    };
    document.addEventListener("mousemove", u);
    const m = () => {
      this.isVolumeDragging = !1, document.removeEventListener("mousemove", u), document.removeEventListener("mouseup", m), setTimeout(() => {
        document.querySelector(".volume-control:hover") || (this.showVolumeSlider = !1);
      }, 500);
    };
    document.addEventListener("mouseup", m);
  }
  seekForward() {
    if (!this.engine)
      return;
    const s = Math.min(this.engine.position + 10, this.totalDuration);
    this.engine.seek(s), this.currentPosition = s;
  }
  seekBackward() {
    if (!this.engine)
      return;
    const s = Math.max(this.engine.position - 10, 0);
    this.engine.seek(s), this.currentPosition = s;
  }
  handleMouseEnter() {
    this.showControls = !0, this.hideControlsTimeoutId !== null && (window.clearTimeout(this.hideControlsTimeoutId), this.hideControlsTimeoutId = null);
  }
  handleMouseLeave() {
    this.isDragging || (this.hideControlsTimeoutId = window.setTimeout(() => {
      this.showControls = !1;
    }, 2e3));
  }
  handleMouseMove() {
    this.handleMouseEnter();
  }
  toggleFullscreen() {
    this.playerRef && (document.fullscreenElement ? document.exitFullscreen().then(() => {
      this.isFullscreen = !1;
    }).catch((s) => {
      console.error(`Error attempting to exit fullscreen: ${s.message}`);
    }) : this.playerRef.requestFullscreen().then(() => {
      this.isFullscreen = !0;
    }).catch((s) => {
      console.error(`Error attempting to enable fullscreen: ${s.message}`);
    }));
  }
  onTimelineMouseEnter() {
    this.isHovering = !0;
  }
  onTimelineMouseLeave() {
    this.isHovering = !1;
  }
  // Public methods
  seek(s) {
    this.engine && (this.engine.seek(s), this.currentPosition = s);
  }
  // Render methods
  render() {
    const s = this.formatTime(this.currentPosition), i = this.formatTime(this.totalDuration);
    return ge`
      <div
        class="video-player"
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
        @mousemove=${this.handleMouseMove}
      >
        <!-- Video element -->
        <video @click=${this.togglePlay} .controls=${this.singleFmp4}></video>

        <!-- Loading indicator -->
        ${this.isLoading ? ge`
          <div class="loading-overlay">
            <div class="loading-spinner">
              <div class="spinner"></div>
              <span class="loading-text">加载中...</span>
            </div>
          </div>
        ` : ""}

        <!-- Custom timeline UI -->
        ${this.engine && !this.singleFmp4 ? ge`
          <div
            class="controls-overlay ${this.showControls || this.isDragging ? "show-controls" : ""}"
          >
            <!-- Timeline slider -->
            <div
              class="timeline ${this.isHovering ? "timeline-hover" : ""}"
              @click=${this.handleTimelineClick}
              @mouseenter=${this.onTimelineMouseEnter}
              @mouseleave=${this.onTimelineMouseLeave}
            >
              <div class="timeline-buffer"></div>
              <div class="timeline-progress"></div>
              <div
                class="timeline-handle ${this.isHovering || this.isDragging ? "timeline-handle-hover" : ""}"
                style="left: ${this.currentPosition / (this.totalDuration || 1) * 100}%"
                @mousedown=${(f) => {
      f.stopPropagation(), this.startDrag(f);
    }}
              ></div>
            </div>

            <!-- Controls -->
            <div class="controls-container">
              <!-- Left side controls -->
              <div class="controls-left">
                <!-- Play/Pause Button -->
                <button class="control-button" @click=${this.togglePlay}>
                  ${this.isPlaying ? ge`<i class="icon-pause">▮▮</i>` : ge`<i class="icon-play">▶</i>`}
                </button>

                <!-- Rewind Button - Only visible on wide screens -->
                ${this.isWideScreen ? ge`
                  <button class="control-button" @click=${this.seekBackward}>
                    <i class="icon-backward">◀◀</i>
                  </button>
                ` : ""}

                <!-- Fast Forward Button - Only visible on wide screens -->
                ${this.isWideScreen ? ge`
                  <button class="control-button" @click=${this.seekForward}>
                    <i class="icon-forward">▶▶</i>
                  </button>
                ` : ""}

                <!-- Current time display -->
                <div class="time-display">
                  ${s} / ${i}
                </div>
              </div>

              <!-- Right side controls -->
              <div class="controls-right">
                <!-- Playback rate control -->
                <div class="playback-rate-control">
                  <button
                    class="control-button playback-rate-button"
                    @click=${this.togglePlaybackRateMenu}
                  >
                    <span>${this.playbackRate}x</span>
                  </button>
                  ${this.showPlaybackRateMenu ? ge`
                    <div class="playback-rate-menu">
                      ${this.playbackRates.map((f) => ge`
                        <button
                          @click=${() => this.changePlaybackRate(f)}
                          class="playback-rate-option ${this.playbackRate === f ? "active" : ""}"
                        >
                          ${f}x
                        </button>
                      `)}
                    </div>
                  ` : ""}
                </div>

                <!-- Volume Control -->
                <div
                  class="volume-control"
                  @mouseenter=${() => this.showVolumeSlider = !0}
                  @mouseleave=${() => {
      this.isVolumeDragging || (this.showVolumeSlider = !1);
    }}
                >
                  <button class="control-button" @click=${this.toggleMute}>
                    ${this.isMuted || this.volume === 0 ? ge`<i class="icon-volume-mute"></i>` : this.volume < 0.5 ? ge`<i class="icon-volume-low"></i>` : ge`<i class="icon-volume-high"></i>`}
                  </button>
                  ${this.showVolumeSlider ? ge`
                    <div class="volume-slider-container">
                      <div
                        class="volume-slider"
                        @click=${this.handleVolumeChange}
                        @mousedown=${this.startVolumeDrag}
                      >
                        <div class="volume-slider-track"></div>
                        <div
                          class="volume-slider-fill"
                          style="height: ${this.volume * 100}%"
                        ></div>
                        <div
                          class="volume-slider-thumb"
                          style="bottom: ${this.volume * 100}%"
                        ></div>
                      </div>
                    </div>
                  ` : ""}
                </div>

                <!-- Fullscreen Button -->
                <button class="control-button" @click=${this.toggleFullscreen}>
                  ${this.isFullscreen ? ge`<i class="icon-fullscreen-exit">⤓</i>` : ge`<i class="icon-fullscreen">⤢</i>`}
                </button>
              </div>
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }
  startDrag(s) {
    this.isDragging = !0, this.handleDrag(s), document.addEventListener("mousemove", this.handleDrag), document.addEventListener("mouseup", this.stopDrag);
  }
}
ji.styles = co`
    .video-player {
      position: relative;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 4px;
      background-color: #000;
    }

    video {
      width: 100%;
      display: block;
      cursor: pointer;
    }

    .controls-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px;
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0) 100%
      );
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(100%);
      z-index: 10;
    }

    .show-controls {
      opacity: 1;
      transform: translateY(0);
    }

    .controls-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
      color: white;
    }

    .controls-left,
    .controls-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .control-button {
      background: transparent;
      border: none;
      color: white;
      padding: 5px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      border-radius: 4px;
    }

    .control-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .bili-icon {
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .time-display {
      font-size: 12px;
      color: white;
    }

    .timeline {
      position: relative;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 1.5px;
      cursor: pointer;
      overflow: hidden;
      margin-bottom: 10px;
      transition: height 0.2s ease;
    }

    .timeline-hover {
      height: 5px;
    }

    .timeline-buffer {
      position: absolute;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.5);
      width: 0;
      pointer-events: none;
    }

    .timeline-progress {
      position: absolute;
      height: 100%;
      background-color: #fb7299;
      width: 0;
      pointer-events: none;
    }

    .timeline-handle {
      position: absolute;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      background: #fb7299;
      top: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      pointer-events: none;
      transition: transform 0.2s ease, height 0.2s ease, width 0.2s ease,
        box-shadow 0.2s ease;
    }

    .timeline-handle-hover {
      transform: translate(-50%, -50%) scale(1);
      height: 12px;
      width: 12px;
      box-shadow: 0 0 0 4px rgba(251, 114, 153, 0.2);
      cursor: grab;
      pointer-events: auto;
    }

    /* Playback Rate Control */
    .playback-rate-control {
      position: relative;
    }

    .playback-rate-menu {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 4px;
      padding: 5px;
      margin-bottom: 5px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      z-index: 100;
    }

    .playback-rate-option {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
      color: white;
      transition: all 0.2s;
      width: 100%;
      text-align: center;
    }

    .playback-rate-option:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .playback-rate-option.active {
      background-color: #fb7299;
      color: white;
      border-color: #fb7299;
    }

    /* Volume Control - Fixed vertical implementation */
    .volume-control {
      position: relative;
      z-index: 101; /* Ensure this is above other controls for mouseleave detection */
    }

    .volume-slider-container {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 4px;
      padding: 15px 10px;
      margin-bottom: 5px;
      z-index: 100;
    }

    /* Add a pseudo-element to bridge the gap between button and slider container */
    .volume-control:hover .volume-slider-container::after {
      content: "";
      position: absolute;
      bottom: -15px; /* Match margin-bottom of slider container */
      left: 0;
      width: 100%;
      height: 15px;
      background: transparent;
    }

    .volume-slider {
      position: relative;
      height: 80px;
      width: 10px;
      cursor: pointer;
      user-select: none;
    }

    .volume-slider-track {
      position: absolute;
      height: 100%;
      width: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      left: 3px;
    }

    .volume-slider-fill {
      position: absolute;
      width: 4px;
      background: #fb7299;
      border-radius: 2px;
      left: 3px;
      bottom: 0;
    }

    .volume-slider-thumb {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fb7299;
      left: -1px;
      transform: translateY(50%);
      cursor: pointer;
    }

    .icon-play,
    .icon-pause,
    .icon-forward,
    .icon-backward,
    .icon-volume-high,
    .icon-volume-low,
    .icon-volume-mute,
    .icon-fullscreen,
    .icon-fullscreen-exit {
      font-style: normal;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    /* Volume icon custom styles */
    .icon-volume-mute::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 20px;
      background: white;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z'/%3E%3C/svg%3E") no-repeat 50% 50%;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z'/%3E%3C/svg%3E") no-repeat 50% 50%;
    }

    .icon-volume-low::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 20px;
      background: white;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 9v6h4l5 5V4l-5 5H7z'/%3E%3C/svg%3E") no-repeat 50% 50%;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 9v6h4l5 5V4l-5 5H7z'/%3E%3C/svg%3E") no-repeat 50% 50%;
    }

    .icon-volume-high::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 20px;
      background: white;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E") no-repeat 50% 50%;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E") no-repeat 50% 50%;
    }

    /* Fullscreen styles */
    .video-player:fullscreen {
      width: 100%;
      max-width: none;
    }

    .video-player:fullscreen video {
      height: 100vh;
      object-fit: contain;
    }

    /* Loading overlay styles */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid #ffffff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      color: #ffffff;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
    }
  `;
ji.properties = {
  src: { type: String },
  debug: { type: Boolean },
  isDragging: { type: Boolean },
  isHovering: { type: Boolean },
  playbackRate: { type: Number },
  isPlaying: { type: Boolean },
  currentPosition: { type: Number },
  totalDuration: { type: Number },
  showControls: { type: Boolean },
  volume: { type: Number },
  isMuted: { type: Boolean },
  showPlaybackRateMenu: { type: Boolean },
  showVolumeSlider: { type: Boolean },
  isFullscreen: { type: Boolean },
  isVolumeDragging: { type: Boolean },
  singleFmp4: { type: Boolean },
  isWideScreen: { type: Boolean },
  isLoading: { type: Boolean },
  isUserPaused: { type: Boolean }
};
customElements.define("m7s-vod-player", ji);
export {
  ji as VideoPlayer
};
