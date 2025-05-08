/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ti = window, Si = ti.ShadowRoot && (ti.ShadyCSS === void 0 || ti.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ai = Symbol(), Di = /* @__PURE__ */ new WeakMap();
let Wi = class {
  constructor(s, n, d) {
    if (this._$cssResult$ = !0, d !== Ai)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = s, this.t = n;
  }
  get styleSheet() {
    let s = this.o;
    const n = this.t;
    if (Si && s === void 0) {
      const d = n !== void 0 && n.length === 1;
      d && (s = Di.get(n)), s === void 0 && ((this.o = s = new CSSStyleSheet()).replaceSync(this.cssText), d && Di.set(n, s));
    }
    return s;
  }
  toString() {
    return this.cssText;
  }
};
const Qi = (P) => new Wi(typeof P == "string" ? P : P + "", void 0, Ai), Yi = (P, ...s) => {
  const n = P.length === 1 ? P[0] : s.reduce((d, u, _) => d + ((E) => {
    if (E._$cssResult$ === !0)
      return E.cssText;
    if (typeof E == "number")
      return E;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + E + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(u) + P[_ + 1], P[0]);
  return new Wi(n, P, Ai);
}, Zi = (P, s) => {
  Si ? P.adoptedStyleSheets = s.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet) : s.forEach((n) => {
    const d = document.createElement("style"), u = ti.litNonce;
    u !== void 0 && d.setAttribute("nonce", u), d.textContent = n.cssText, P.appendChild(d);
  });
}, Fi = Si ? (P) => P : (P) => P instanceof CSSStyleSheet ? ((s) => {
  let n = "";
  for (const d of s.cssRules)
    n += d.cssText;
  return Qi(n);
})(P) : P;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var yi;
const ni = window, Ri = ni.trustedTypes, Ji = Ri ? Ri.emptyScript : "", xi = ni.reactiveElementPolyfillSupport, Ti = { toAttribute(P, s) {
  switch (s) {
    case Boolean:
      P = P ? Ji : null;
      break;
    case Object:
    case Array:
      P = P == null ? P : JSON.stringify(P);
  }
  return P;
}, fromAttribute(P, s) {
  let n = P;
  switch (s) {
    case Boolean:
      n = P !== null;
      break;
    case Number:
      n = P === null ? null : Number(P);
      break;
    case Object:
    case Array:
      try {
        n = JSON.parse(P);
      } catch {
        n = null;
      }
  }
  return n;
} }, Vi = (P, s) => s !== P && (s == s || P == P), wi = { attribute: !0, type: String, converter: Ti, reflect: !1, hasChanged: Vi }, Ci = "finalized";
let Hr = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this._$Eu();
  }
  static addInitializer(s) {
    var n;
    this.finalize(), ((n = this.h) !== null && n !== void 0 ? n : this.h = []).push(s);
  }
  static get observedAttributes() {
    this.finalize();
    const s = [];
    return this.elementProperties.forEach((n, d) => {
      const u = this._$Ep(d, n);
      u !== void 0 && (this._$Ev.set(u, d), s.push(u));
    }), s;
  }
  static createProperty(s, n = wi) {
    if (n.state && (n.attribute = !1), this.finalize(), this.elementProperties.set(s, n), !n.noAccessor && !this.prototype.hasOwnProperty(s)) {
      const d = typeof s == "symbol" ? Symbol() : "__" + s, u = this.getPropertyDescriptor(s, d, n);
      u !== void 0 && Object.defineProperty(this.prototype, s, u);
    }
  }
  static getPropertyDescriptor(s, n, d) {
    return { get() {
      return this[n];
    }, set(u) {
      const _ = this[s];
      this[n] = u, this.requestUpdate(s, _, d);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(s) {
    return this.elementProperties.get(s) || wi;
  }
  static finalize() {
    if (this.hasOwnProperty(Ci))
      return !1;
    this[Ci] = !0;
    const s = Object.getPrototypeOf(this);
    if (s.finalize(), s.h !== void 0 && (this.h = [...s.h]), this.elementProperties = new Map(s.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const n = this.properties, d = [...Object.getOwnPropertyNames(n), ...Object.getOwnPropertySymbols(n)];
      for (const u of d)
        this.createProperty(u, n[u]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(s) {
    const n = [];
    if (Array.isArray(s)) {
      const d = new Set(s.flat(1 / 0).reverse());
      for (const u of d)
        n.unshift(Fi(u));
    } else
      s !== void 0 && n.push(Fi(s));
    return n;
  }
  static _$Ep(s, n) {
    const d = n.attribute;
    return d === !1 ? void 0 : typeof d == "string" ? d : typeof s == "string" ? s.toLowerCase() : void 0;
  }
  _$Eu() {
    var s;
    this._$E_ = new Promise((n) => this.enableUpdating = n), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (s = this.constructor.h) === null || s === void 0 || s.forEach((n) => n(this));
  }
  addController(s) {
    var n, d;
    ((n = this._$ES) !== null && n !== void 0 ? n : this._$ES = []).push(s), this.renderRoot !== void 0 && this.isConnected && ((d = s.hostConnected) === null || d === void 0 || d.call(s));
  }
  removeController(s) {
    var n;
    (n = this._$ES) === null || n === void 0 || n.splice(this._$ES.indexOf(s) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((s, n) => {
      this.hasOwnProperty(n) && (this._$Ei.set(n, this[n]), delete this[n]);
    });
  }
  createRenderRoot() {
    var s;
    const n = (s = this.shadowRoot) !== null && s !== void 0 ? s : this.attachShadow(this.constructor.shadowRootOptions);
    return Zi(n, this.constructor.elementStyles), n;
  }
  connectedCallback() {
    var s;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (s = this._$ES) === null || s === void 0 || s.forEach((n) => {
      var d;
      return (d = n.hostConnected) === null || d === void 0 ? void 0 : d.call(n);
    });
  }
  enableUpdating(s) {
  }
  disconnectedCallback() {
    var s;
    (s = this._$ES) === null || s === void 0 || s.forEach((n) => {
      var d;
      return (d = n.hostDisconnected) === null || d === void 0 ? void 0 : d.call(n);
    });
  }
  attributeChangedCallback(s, n, d) {
    this._$AK(s, d);
  }
  _$EO(s, n, d = wi) {
    var u;
    const _ = this.constructor._$Ep(s, d);
    if (_ !== void 0 && d.reflect === !0) {
      const E = (((u = d.converter) === null || u === void 0 ? void 0 : u.toAttribute) !== void 0 ? d.converter : Ti).toAttribute(n, d.type);
      this._$El = s, E == null ? this.removeAttribute(_) : this.setAttribute(_, E), this._$El = null;
    }
  }
  _$AK(s, n) {
    var d;
    const u = this.constructor, _ = u._$Ev.get(s);
    if (_ !== void 0 && this._$El !== _) {
      const E = u.getPropertyOptions(_), $ = typeof E.converter == "function" ? { fromAttribute: E.converter } : ((d = E.converter) === null || d === void 0 ? void 0 : d.fromAttribute) !== void 0 ? E.converter : Ti;
      this._$El = _, this[_] = $.fromAttribute(n, E.type), this._$El = null;
    }
  }
  requestUpdate(s, n, d) {
    let u = !0;
    s !== void 0 && (((d = d || this.constructor.getPropertyOptions(s)).hasChanged || Vi)(this[s], n) ? (this._$AL.has(s) || this._$AL.set(s, n), d.reflect === !0 && this._$El !== s && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(s, d))) : u = !1), !this.isUpdatePending && u && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = !0;
    try {
      await this._$E_;
    } catch (n) {
      Promise.reject(n);
    }
    const s = this.scheduleUpdate();
    return s != null && await s, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((u, _) => this[_] = u), this._$Ei = void 0);
    let n = !1;
    const d = this._$AL;
    try {
      n = this.shouldUpdate(d), n ? (this.willUpdate(d), (s = this._$ES) === null || s === void 0 || s.forEach((u) => {
        var _;
        return (_ = u.hostUpdate) === null || _ === void 0 ? void 0 : _.call(u);
      }), this.update(d)) : this._$Ek();
    } catch (u) {
      throw n = !1, this._$Ek(), u;
    }
    n && this._$AE(d);
  }
  willUpdate(s) {
  }
  _$AE(s) {
    var n;
    (n = this._$ES) === null || n === void 0 || n.forEach((d) => {
      var u;
      return (u = d.hostUpdated) === null || u === void 0 ? void 0 : u.call(d);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(s)), this.updated(s);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(s) {
    return !0;
  }
  update(s) {
    this._$EC !== void 0 && (this._$EC.forEach((n, d) => this._$EO(d, this[d], n)), this._$EC = void 0), this._$Ek();
  }
  updated(s) {
  }
  firstUpdated(s) {
  }
};
Hr[Ci] = !0, Hr.elementProperties = /* @__PURE__ */ new Map(), Hr.elementStyles = [], Hr.shadowRootOptions = { mode: "open" }, xi?.({ ReactiveElement: Hr }), ((yi = ni.reactiveElementVersions) !== null && yi !== void 0 ? yi : ni.reactiveElementVersions = []).push("1.6.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _i;
const ii = window, zr = ii.trustedTypes, Ui = zr ? zr.createPolicy("lit-html", { createHTML: (P) => P }) : void 0, ki = "$lit$", Yt = `lit$${(Math.random() + "").slice(9)}$`, Ni = "?" + Yt, eo = `<${Ni}>`, $r = document, Gn = () => $r.createComment(""), Xn = (P) => P === null || typeof P != "object" && typeof P != "function", qi = Array.isArray, to = (P) => qi(P) || typeof P?.[Symbol.iterator] == "function", Ei = `[ 	
\f\r]`, zn = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Bi = /-->/g, Mi = />/g, Er = RegExp(`>|${Ei}(?:([^\\s"'>=/]+)(${Ei}*=${Ei}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Oi = /'/g, Ii = /"/g, Gi = /^(?:script|style|textarea|title)$/i, ro = (P) => (s, ...n) => ({ _$litType$: P, strings: s, values: n }), Xe = ro(1), Wr = Symbol.for("lit-noChange"), Ae = Symbol.for("lit-nothing"), Li = /* @__PURE__ */ new WeakMap(), br = $r.createTreeWalker($r, 129, null, !1);
function Xi(P, s) {
  if (!Array.isArray(P) || !P.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return Ui !== void 0 ? Ui.createHTML(s) : s;
}
const no = (P, s) => {
  const n = P.length - 1, d = [];
  let u, _ = s === 2 ? "<svg>" : "", E = zn;
  for (let $ = 0; $ < n; $++) {
    const y = P[$];
    let g, S, C = -1, I = 0;
    for (; I < y.length && (E.lastIndex = I, S = E.exec(y), S !== null); )
      I = E.lastIndex, E === zn ? S[1] === "!--" ? E = Bi : S[1] !== void 0 ? E = Mi : S[2] !== void 0 ? (Gi.test(S[2]) && (u = RegExp("</" + S[2], "g")), E = Er) : S[3] !== void 0 && (E = Er) : E === Er ? S[0] === ">" ? (E = u ?? zn, C = -1) : S[1] === void 0 ? C = -2 : (C = E.lastIndex - S[2].length, g = S[1], E = S[3] === void 0 ? Er : S[3] === '"' ? Ii : Oi) : E === Ii || E === Oi ? E = Er : E === Bi || E === Mi ? E = zn : (E = Er, u = void 0);
    const H = E === Er && P[$ + 1].startsWith("/>") ? " " : "";
    _ += E === zn ? y + eo : C >= 0 ? (d.push(g), y.slice(0, C) + ki + y.slice(C) + Yt + H) : y + Yt + (C === -2 ? (d.push(void 0), $) : H);
  }
  return [Xi(P, _ + (P[n] || "<?>") + (s === 2 ? "</svg>" : "")), d];
};
class Kn {
  constructor({ strings: s, _$litType$: n }, d) {
    let u;
    this.parts = [];
    let _ = 0, E = 0;
    const $ = s.length - 1, y = this.parts, [g, S] = no(s, n);
    if (this.el = Kn.createElement(g, d), br.currentNode = this.el.content, n === 2) {
      const C = this.el.content, I = C.firstChild;
      I.remove(), C.append(...I.childNodes);
    }
    for (; (u = br.nextNode()) !== null && y.length < $; ) {
      if (u.nodeType === 1) {
        if (u.hasAttributes()) {
          const C = [];
          for (const I of u.getAttributeNames())
            if (I.endsWith(ki) || I.startsWith(Yt)) {
              const H = S[E++];
              if (C.push(I), H !== void 0) {
                const q = u.getAttribute(H.toLowerCase() + ki).split(Yt), K = /([.?@])?(.*)/.exec(H);
                y.push({ type: 1, index: _, name: K[2], strings: q, ctor: K[1] === "." ? oo : K[1] === "?" ? ao : K[1] === "@" ? lo : oi });
              } else
                y.push({ type: 6, index: _ });
            }
          for (const I of C)
            u.removeAttribute(I);
        }
        if (Gi.test(u.tagName)) {
          const C = u.textContent.split(Yt), I = C.length - 1;
          if (I > 0) {
            u.textContent = zr ? zr.emptyScript : "";
            for (let H = 0; H < I; H++)
              u.append(C[H], Gn()), br.nextNode(), y.push({ type: 2, index: ++_ });
            u.append(C[I], Gn());
          }
        }
      } else if (u.nodeType === 8)
        if (u.data === Ni)
          y.push({ type: 2, index: _ });
        else {
          let C = -1;
          for (; (C = u.data.indexOf(Yt, C + 1)) !== -1; )
            y.push({ type: 7, index: _ }), C += Yt.length - 1;
        }
      _++;
    }
  }
  static createElement(s, n) {
    const d = $r.createElement("template");
    return d.innerHTML = s, d;
  }
}
function Vr(P, s, n = P, d) {
  var u, _, E, $;
  if (s === Wr)
    return s;
  let y = d !== void 0 ? (u = n._$Co) === null || u === void 0 ? void 0 : u[d] : n._$Cl;
  const g = Xn(s) ? void 0 : s._$litDirective$;
  return y?.constructor !== g && ((_ = y?._$AO) === null || _ === void 0 || _.call(y, !1), g === void 0 ? y = void 0 : (y = new g(P), y._$AT(P, n, d)), d !== void 0 ? ((E = ($ = n)._$Co) !== null && E !== void 0 ? E : $._$Co = [])[d] = y : n._$Cl = y), y !== void 0 && (s = Vr(P, y._$AS(P, s.values), y, d)), s;
}
class io {
  constructor(s, n) {
    this._$AV = [], this._$AN = void 0, this._$AD = s, this._$AM = n;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(s) {
    var n;
    const { el: { content: d }, parts: u } = this._$AD, _ = ((n = s?.creationScope) !== null && n !== void 0 ? n : $r).importNode(d, !0);
    br.currentNode = _;
    let E = br.nextNode(), $ = 0, y = 0, g = u[0];
    for (; g !== void 0; ) {
      if ($ === g.index) {
        let S;
        g.type === 2 ? S = new Qn(E, E.nextSibling, this, s) : g.type === 1 ? S = new g.ctor(E, g.name, g.strings, this, s) : g.type === 6 && (S = new uo(E, this, s)), this._$AV.push(S), g = u[++y];
      }
      $ !== g?.index && (E = br.nextNode(), $++);
    }
    return br.currentNode = $r, _;
  }
  v(s) {
    let n = 0;
    for (const d of this._$AV)
      d !== void 0 && (d.strings !== void 0 ? (d._$AI(s, d, n), n += d.strings.length - 2) : d._$AI(s[n])), n++;
  }
}
class Qn {
  constructor(s, n, d, u) {
    var _;
    this.type = 2, this._$AH = Ae, this._$AN = void 0, this._$AA = s, this._$AB = n, this._$AM = d, this.options = u, this._$Cp = (_ = u?.isConnected) === null || _ === void 0 || _;
  }
  get _$AU() {
    var s, n;
    return (n = (s = this._$AM) === null || s === void 0 ? void 0 : s._$AU) !== null && n !== void 0 ? n : this._$Cp;
  }
  get parentNode() {
    let s = this._$AA.parentNode;
    const n = this._$AM;
    return n !== void 0 && s?.nodeType === 11 && (s = n.parentNode), s;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(s, n = this) {
    s = Vr(this, s, n), Xn(s) ? s === Ae || s == null || s === "" ? (this._$AH !== Ae && this._$AR(), this._$AH = Ae) : s !== this._$AH && s !== Wr && this._(s) : s._$litType$ !== void 0 ? this.g(s) : s.nodeType !== void 0 ? this.$(s) : to(s) ? this.T(s) : this._(s);
  }
  k(s) {
    return this._$AA.parentNode.insertBefore(s, this._$AB);
  }
  $(s) {
    this._$AH !== s && (this._$AR(), this._$AH = this.k(s));
  }
  _(s) {
    this._$AH !== Ae && Xn(this._$AH) ? this._$AA.nextSibling.data = s : this.$($r.createTextNode(s)), this._$AH = s;
  }
  g(s) {
    var n;
    const { values: d, _$litType$: u } = s, _ = typeof u == "number" ? this._$AC(s) : (u.el === void 0 && (u.el = Kn.createElement(Xi(u.h, u.h[0]), this.options)), u);
    if (((n = this._$AH) === null || n === void 0 ? void 0 : n._$AD) === _)
      this._$AH.v(d);
    else {
      const E = new io(_, this), $ = E.u(this.options);
      E.v(d), this.$($), this._$AH = E;
    }
  }
  _$AC(s) {
    let n = Li.get(s.strings);
    return n === void 0 && Li.set(s.strings, n = new Kn(s)), n;
  }
  T(s) {
    qi(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let d, u = 0;
    for (const _ of s)
      u === n.length ? n.push(d = new Qn(this.k(Gn()), this.k(Gn()), this, this.options)) : d = n[u], d._$AI(_), u++;
    u < n.length && (this._$AR(d && d._$AB.nextSibling, u), n.length = u);
  }
  _$AR(s = this._$AA.nextSibling, n) {
    var d;
    for ((d = this._$AP) === null || d === void 0 || d.call(this, !1, !0, n); s && s !== this._$AB; ) {
      const u = s.nextSibling;
      s.remove(), s = u;
    }
  }
  setConnected(s) {
    var n;
    this._$AM === void 0 && (this._$Cp = s, (n = this._$AP) === null || n === void 0 || n.call(this, s));
  }
}
class oi {
  constructor(s, n, d, u, _) {
    this.type = 1, this._$AH = Ae, this._$AN = void 0, this.element = s, this.name = n, this._$AM = u, this.options = _, d.length > 2 || d[0] !== "" || d[1] !== "" ? (this._$AH = Array(d.length - 1).fill(new String()), this.strings = d) : this._$AH = Ae;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(s, n = this, d, u) {
    const _ = this.strings;
    let E = !1;
    if (_ === void 0)
      s = Vr(this, s, n, 0), E = !Xn(s) || s !== this._$AH && s !== Wr, E && (this._$AH = s);
    else {
      const $ = s;
      let y, g;
      for (s = _[0], y = 0; y < _.length - 1; y++)
        g = Vr(this, $[d + y], n, y), g === Wr && (g = this._$AH[y]), E || (E = !Xn(g) || g !== this._$AH[y]), g === Ae ? s = Ae : s !== Ae && (s += (g ?? "") + _[y + 1]), this._$AH[y] = g;
    }
    E && !u && this.j(s);
  }
  j(s) {
    s === Ae ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, s ?? "");
  }
}
class oo extends oi {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(s) {
    this.element[this.name] = s === Ae ? void 0 : s;
  }
}
const so = zr ? zr.emptyScript : "";
class ao extends oi {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(s) {
    s && s !== Ae ? this.element.setAttribute(this.name, so) : this.element.removeAttribute(this.name);
  }
}
class lo extends oi {
  constructor(s, n, d, u, _) {
    super(s, n, d, u, _), this.type = 5;
  }
  _$AI(s, n = this) {
    var d;
    if ((s = (d = Vr(this, s, n, 0)) !== null && d !== void 0 ? d : Ae) === Wr)
      return;
    const u = this._$AH, _ = s === Ae && u !== Ae || s.capture !== u.capture || s.once !== u.once || s.passive !== u.passive, E = s !== Ae && (u === Ae || _);
    _ && this.element.removeEventListener(this.name, this, u), E && this.element.addEventListener(this.name, this, s), this._$AH = s;
  }
  handleEvent(s) {
    var n, d;
    typeof this._$AH == "function" ? this._$AH.call((d = (n = this.options) === null || n === void 0 ? void 0 : n.host) !== null && d !== void 0 ? d : this.element, s) : this._$AH.handleEvent(s);
  }
}
class uo {
  constructor(s, n, d) {
    this.element = s, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = d;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(s) {
    Vr(this, s);
  }
}
const ji = ii.litHtmlPolyfillSupport;
ji?.(Kn, Qn), ((_i = ii.litHtmlVersions) !== null && _i !== void 0 ? _i : ii.litHtmlVersions = []).push("2.8.0");
const co = (P, s, n) => {
  var d, u;
  const _ = (d = n?.renderBefore) !== null && d !== void 0 ? d : s;
  let E = _._$litPart$;
  if (E === void 0) {
    const $ = (u = n?.renderBefore) !== null && u !== void 0 ? u : null;
    _._$litPart$ = E = new Qn(s.insertBefore(Gn(), $), $, void 0, n ?? {});
  }
  return E._$AI(P), E;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var bi, $i;
class Wn extends Hr {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var s, n;
    const d = super.createRenderRoot();
    return (s = (n = this.renderOptions).renderBefore) !== null && s !== void 0 || (n.renderBefore = d.firstChild), d;
  }
  update(s) {
    const n = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(s), this._$Do = co(n, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var s;
    super.connectedCallback(), (s = this._$Do) === null || s === void 0 || s.setConnected(!0);
  }
  disconnectedCallback() {
    var s;
    super.disconnectedCallback(), (s = this._$Do) === null || s === void 0 || s.setConnected(!1);
  }
  render() {
    return Wr;
  }
}
Wn.finalized = !0, Wn._$litElement$ = !0, (bi = globalThis.litElementHydrateSupport) === null || bi === void 0 || bi.call(globalThis, { LitElement: Wn });
const Hi = globalThis.litElementPolyfillSupport;
Hi?.({ LitElement: Wn });
(($i = globalThis.litElementVersions) !== null && $i !== void 0 ? $i : globalThis.litElementVersions = []).push("3.3.3");
class fo {
  id;
  type;
  // 'video' or 'audio'
  codec;
  timescale;
  duration;
  width;
  // for video
  height;
  // for video
  channelCount;
  // for audio
  sampleRate;
  // for audio
  language;
  samples;
  codecInfo;
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
    return this.samples.reduce((s, n) => s + (n.duration || 0), 0);
  }
}
class ho {
  debug;
  HEADER_SIZE = 8;
  // box header size in bytes
  sourceUint8Array = null;
  tracks = /* @__PURE__ */ new Map();
  /**
   * Create a new Fmp4Parser instance
   * @param debug Whether to enable debug output
   */
  constructor(s = !1) {
    this.debug = s;
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
    const n = [];
    let d = 0;
    for (; d < s.byteLength; ) {
      const u = this.parseBox(s, d);
      if (!u)
        break;
      n.push(u), d = u.end, this.debug && this.logBox(u);
    }
    return this.processTrackInfo(n), this.processSampleData(n), this.processCodecInfo(n), Array.from(this.tracks.values());
  }
  /**
   * Process track information from moov box
   */
  processTrackInfo(s) {
    const n = s.find((u) => u.type === "moov");
    if (!n?.children)
      return;
    const d = n.children.filter((u) => u.type === "trak");
    for (const u of d) {
      if (!u.children)
        continue;
      const _ = this.findBox(u, "tkhd");
      if (!_?.data)
        continue;
      const E = _.data.trackID, $ = new fo(E), y = this.findBox(u, "mdia");
      if (!y?.children)
        continue;
      const g = this.findBox(y, "hdlr");
      g?.data && ($.type = g.data.handlerType === "vide" ? "video" : g.data.handlerType === "soun" ? "audio" : "unknown");
      const S = this.findBox(y, "mdhd");
      S?.data && ($.timescale = S.data.timescale, $.duration = Number(S.data.duration), $.language = S.data.language);
      const C = this.findBox(u, "stsd");
      if (C?.data?.entries?.[0]) {
        const I = C.data.entries[0];
        I.data && ($.type === "video" ? ($.width = I.data.width, $.height = I.data.height) : $.type === "audio" && ($.channelCount = I.data.channelCount, $.sampleRate = I.data.sampleRate));
      }
      this.tracks.set(E, $);
    }
  }
  /**
   * Process codec information for all tracks
   */
  processCodecInfo(s) {
    const n = this.generateCodecStrings(s);
    for (const d of this.tracks.values()) {
      const u = n.find(
        (_) => d.type === "video" && _.mimeType === "video/mp4" || d.type === "audio" && _.mimeType === "audio/mp4"
      );
      u && (d.codecInfo = u, d.codec = u.codecString);
    }
  }
  /**
   * Find a box of specific type within a parent box
   */
  findBox(s, n) {
    if (s.children)
      return s.children.find((d) => d.type === n);
  }
  /**
   * Process sample data for all trun boxes
   */
  processSampleData(s) {
    for (let n = 0; n < s.length; n++)
      if (s[n].type === "moof" && n + 1 < s.length && s[n + 1].type === "mdat") {
        const d = s[n], u = s[n + 1];
        if (d.children)
          for (const _ of d.children)
            _.type === "traf" && this.processTrafBox(_, d.start, u);
      }
  }
  /**
   * Process a traf box to extract sample data
   */
  processTrafBox(s, n, d) {
    if (!s.children)
      return;
    let u = null, _ = null;
    for (const C of s.children)
      C.type === "tfhd" ? u = C : C.type === "trun" && (_ = C);
    if (!u?.data || !_?.data)
      return;
    const E = u.data.trackID, $ = this.tracks.get(E);
    if (!$)
      return;
    const y = _.data;
    if (!y.samples || y.dataOffset === void 0)
      return;
    const g = n + y.dataOffset;
    if (g < d.start + this.HEADER_SIZE || g >= d.end) {
      this.debug && console.warn(`Data offset ${g} is outside mdat box range`);
      return;
    }
    let S = g;
    for (const C of y.samples) {
      const I = C.size || u.data.defaultSampleSize || 0;
      if (I <= 0)
        continue;
      const H = S, q = H + I;
      q <= d.end && this.sourceUint8Array && (C.dataStart = H, C.dataEnd = q, C.data = this.sourceUint8Array.subarray(H, q), $.addSample(C)), S += I;
    }
  }
  /**
   * Parse a single box from the buffer
   * @param buffer ArrayBuffer containing fmp4 data
   * @param offset Offset to start parsing from
   * @returns Parsed box or null if the buffer is too small
   */
  parseBox(s, n) {
    if (n + this.HEADER_SIZE > s.byteLength)
      return null;
    const u = new DataView(s).getUint32(n, !1), _ = new Uint8Array(s, n + 4, 4), E = String.fromCharCode(..._), $ = n, y = n + u, g = {
      type: E,
      size: u,
      start: $,
      end: y
    };
    return this.isContainerBox(E) ? g.children = this.parseChildren(s, n + this.HEADER_SIZE, y) : g.data = this.parseBoxData(s, E, n + this.HEADER_SIZE, y), g;
  }
  /**
   * Parse children boxes within a container box
   * @param buffer ArrayBuffer containing fmp4 data
   * @param offset Start offset for children
   * @param end End offset for children
   * @returns Array of child boxes
   */
  parseChildren(s, n, d) {
    const u = [];
    let _ = n;
    for (; _ < d; ) {
      const E = this.parseBox(s, _);
      if (!E)
        break;
      u.push(E), _ = E.end;
    }
    return u;
  }
  /**
   * Parse box data based on box type
   */
  parseBoxData(s, n, d, u) {
    if (u - d <= 0)
      return null;
    switch (n) {
      case "ftyp":
        return this.parseFtypBox(s, d, u);
      case "mvhd":
        return this.parseMvhdBox(s, d, u);
      case "mdhd":
        return this.parseMdhdBox(s, d, u);
      case "hdlr":
        return this.parseHdlrBox(s, d, u);
      case "tkhd":
        return this.parseTkhdBox(s, d, u);
      case "elst":
        return this.parseElstBox(s, d, u);
      case "moof":
      case "mfhd":
        return this.parseMfhdBox(s, d, u);
      case "tfhd":
        return this.parseTfhdBox(s, d, u);
      case "tfdt":
        return this.parseTfdtBox(s, d, u);
      case "trun":
        return this.parseTrunBox(s, d, u);
      case "mdat":
        return this.parseMdatBox(s, d, u);
      case "stsd":
        return this.parseStsdBox(s, d, u);
      case "avc1":
      case "avc3":
        return this.parseAvcBox(s, d, u);
      case "hev1":
      case "hvc1":
        return this.parseHevcBox(s, d, u);
      case "mp4a":
        return this.parseMp4aBox(s, d, u);
      case "avcC":
        return this.parseAvcCBox(s, d, u);
      case "hvcC":
        return this.parseHvcCBox(s, d, u);
      case "esds":
        return this.parseEsdsBox(s, d, u);
      default:
        return new Uint8Array(s.slice(d, u));
    }
  }
  /**
   * Parse 'mdat' box data
   */
  parseMdatBox(s, n, d) {
    return {
      dataSize: d - n,
      dataOffset: n
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
  parseFtypBox(s, n, d) {
    const u = new DataView(s), _ = this.readFourCC(s, n), E = u.getUint32(n + 4, !1), $ = [];
    for (let y = n + 8; y < d; y += 4)
      $.push(this.readFourCC(s, y));
    return {
      majorBrand: _,
      minorVersion: E,
      compatibleBrands: $
    };
  }
  /**
   * Parse 'mvhd' box data
   */
  parseMvhdBox(s, n, d) {
    const u = new DataView(s), _ = u.getUint8(n), E = u.getUint8(n + 1) << 16 | u.getUint8(n + 2) << 8 | u.getUint8(n + 3);
    let $, y, g, S;
    return _ === 1 ? ($ = u.getBigUint64(n + 4, !1), y = u.getBigUint64(n + 12, !1), g = u.getUint32(n + 20, !1), S = u.getBigUint64(n + 24, !1)) : ($ = u.getUint32(n + 4, !1), y = u.getUint32(n + 8, !1), g = u.getUint32(n + 12, !1), S = u.getUint32(n + 16, !1)), {
      version: _,
      flags: E,
      creationTime: $,
      modificationTime: y,
      timescale: g,
      duration: S
    };
  }
  /**
   * Parse 'mdhd' box data
   */
  parseMdhdBox(s, n, d) {
    const u = new DataView(s), _ = u.getUint8(n), E = u.getUint8(n + 1) << 16 | u.getUint8(n + 2) << 8 | u.getUint8(n + 3);
    let $, y, g, S, C;
    return _ === 1 ? ($ = u.getBigUint64(n + 4, !1), y = u.getBigUint64(n + 12, !1), g = u.getUint32(n + 20, !1), S = u.getBigUint64(n + 24, !1), C = this.parseLanguage(u.getUint16(n + 32, !1))) : ($ = u.getUint32(n + 4, !1), y = u.getUint32(n + 8, !1), g = u.getUint32(n + 12, !1), S = u.getUint32(n + 16, !1), C = this.parseLanguage(u.getUint16(n + 20, !1))), {
      version: _,
      flags: E,
      creationTime: $,
      modificationTime: y,
      timescale: g,
      duration: S,
      language: C
    };
  }
  /**
   * Parse 'hdlr' box data
   */
  parseHdlrBox(s, n, d) {
    const u = new DataView(s), _ = u.getUint8(n), E = u.getUint8(n + 1) << 16 | u.getUint8(n + 2) << 8 | u.getUint8(n + 3), $ = this.readFourCC(s, n + 8);
    let y = "", g = n + 24;
    for (; g < d; ) {
      const S = u.getUint8(g);
      if (S === 0)
        break;
      y += String.fromCharCode(S), g++;
    }
    return {
      version: _,
      flags: E,
      handlerType: $,
      name: y
    };
  }
  /**
   * Parse 'tkhd' box data
   */
  parseTkhdBox(s, n, d) {
    const u = new DataView(s), _ = u.getUint8(n), E = u.getUint8(n + 1) << 16 | u.getUint8(n + 2) << 8 | u.getUint8(n + 3);
    let $, y, g, S;
    return _ === 1 ? ($ = u.getBigUint64(n + 4, !1), y = u.getBigUint64(n + 12, !1), g = u.getUint32(n + 20, !1), S = u.getBigUint64(n + 28, !1)) : ($ = u.getUint32(n + 4, !1), y = u.getUint32(n + 8, !1), g = u.getUint32(n + 12, !1), S = u.getUint32(n + 20, !1)), {
      version: _,
      flags: E,
      creationTime: $,
      modificationTime: y,
      trackID: g,
      duration: S,
      enabled: (E & 1) !== 0,
      inMovie: (E & 2) !== 0,
      inPreview: (E & 4) !== 0
    };
  }
  /**
   * Parse 'elst' box data
   */
  parseElstBox(s, n, d) {
    const u = new DataView(s), _ = u.getUint8(n), E = u.getUint8(n + 1) << 16 | u.getUint8(n + 2) << 8 | u.getUint8(n + 3), $ = u.getUint32(n + 4, !1), y = [];
    let g = n + 8;
    for (let S = 0; S < $; S++)
      if (_ === 1) {
        const C = u.getBigUint64(g, !1), I = u.getBigInt64(g + 8, !1), H = u.getInt16(g + 16, !1), q = u.getInt16(g + 18, !1);
        y.push({
          segmentDuration: C,
          mediaTime: I,
          mediaRateInteger: H,
          mediaRateFraction: q
        }), g += 20;
      } else {
        const C = u.getUint32(g, !1), I = u.getInt32(g + 4, !1), H = u.getInt16(g + 8, !1), q = u.getInt16(g + 10, !1);
        y.push({
          segmentDuration: C,
          mediaTime: I,
          mediaRateInteger: H,
          mediaRateFraction: q
        }), g += 12;
      }
    return {
      version: _,
      flags: E,
      entries: y
    };
  }
  /**
   * Parse 'mfhd' box data
   */
  parseMfhdBox(s, n, d) {
    const u = new DataView(s), _ = u.getUint8(n), E = u.getUint8(n + 1) << 16 | u.getUint8(n + 2) << 8 | u.getUint8(n + 3), $ = u.getUint32(n + 4, !1);
    return {
      version: _,
      flags: E,
      sequenceNumber: $
    };
  }
  /**
   * Parse 'tfhd' box data
   */
  parseTfhdBox(s, n, d) {
    const u = new DataView(s), _ = u.getUint8(n), E = u.getUint8(n + 1) << 16 | u.getUint8(n + 2) << 8 | u.getUint8(n + 3), $ = u.getUint32(n + 4, !1);
    let y = n + 8;
    const g = {
      version: _,
      flags: E,
      trackID: $
    };
    return E & 1 && (g.baseDataOffset = u.getBigUint64(y, !1), y += 8), E & 2 && (g.sampleDescriptionIndex = u.getUint32(y, !1), y += 4), E & 8 && (g.defaultSampleDuration = u.getUint32(y, !1), y += 4), E & 16 && (g.defaultSampleSize = u.getUint32(y, !1), y += 4), E & 32 && (g.defaultSampleFlags = u.getUint32(y, !1)), g;
  }
  /**
   * Parse 'tfdt' box data
   */
  parseTfdtBox(s, n, d) {
    const u = new DataView(s), _ = u.getUint8(n), E = u.getUint8(n + 1) << 16 | u.getUint8(n + 2) << 8 | u.getUint8(n + 3);
    let $;
    return _ === 1 ? $ = u.getBigUint64(n + 4, !1) : $ = u.getUint32(n + 4, !1), {
      version: _,
      flags: E,
      baseMediaDecodeTime: $
    };
  }
  /**
   * Parse 'trun' box data
   */
  parseTrunBox(s, n, d) {
    const u = new DataView(s), _ = u.getUint8(n), E = u.getUint8(n + 1) << 16 | u.getUint8(n + 2) << 8 | u.getUint8(n + 3), $ = u.getUint32(n + 4, !1);
    let y = n + 8;
    const g = {
      version: _,
      flags: E,
      sampleCount: $,
      samples: []
    };
    E & 1 && (g.dataOffset = u.getInt32(y, !1), y += 4), E & 4 && (g.firstSampleFlags = u.getUint32(y, !1), y += 4);
    const S = [];
    for (let C = 0; C < $; C++) {
      const I = {
        dataStart: 0,
        dataEnd: 0,
        data: new Uint8Array(0),
        // Placeholder, will be set later
        keyFrame: !0
        // Default to true, will be updated based on flags
      };
      if (E & 256 && (I.duration = u.getUint32(y, !1), y += 4), E & 512 && (I.size = u.getUint32(y, !1), y += 4), E & 1024) {
        I.flags = u.getUint32(y, !1);
        const H = I.flags >> 24 & 3;
        I.keyFrame = H === 2, y += 4;
      } else if (C === 0 && g.firstSampleFlags !== void 0) {
        const H = g.firstSampleFlags >> 24 & 3;
        I.keyFrame = H === 2;
      }
      E & 2048 && (_ === 0 ? I.compositionTimeOffset = u.getUint32(y, !1) : I.compositionTimeOffset = u.getInt32(y, !1), y += 4), S.push(I);
    }
    return g.samples = S, g;
  }
  /**
   * Parse language code
   * @param value 16-bit language code
   * @returns ISO language code
   */
  parseLanguage(s) {
    const n = String.fromCharCode((s >> 10 & 31) + 96), d = String.fromCharCode((s >> 5 & 31) + 96), u = String.fromCharCode((s & 31) + 96);
    return n + d + u;
  }
  /**
   * Read a 4-character code from the buffer
   * @param buffer ArrayBuffer containing data
   * @param offset Offset to read from
   * @returns 4-character code as string
   */
  readFourCC(s, n) {
    const d = new Uint8Array(s, n, 4);
    return String.fromCharCode(...d);
  }
  /**
   * Log box information in debug mode
   * @param box Box to log
   * @param depth Nesting depth for indentation
   */
  logBox(s, n = 0) {
    if (!this.debug)
      return;
    const d = "  ".repeat(n);
    if (console.log(`${d}Box: ${s.type}, Size: ${s.size}, Range: ${s.start}-${s.end}`), s.data && console.log(`${d}  Data:`, s.data), s.children && s.children.length > 0) {
      console.log(`${d}  Children (${s.children.length}):`);
      for (const u of s.children)
        this.logBox(u, n + 2);
    }
  }
  /**
   * Utility method to pretty print a box structure
   * @param boxes Parsed box structure
   * @returns Formatted string representation
   */
  printBoxes(s) {
    let n = `FMP4 Structure:
`;
    const d = (u, _ = 0) => {
      const E = "  ".repeat(_);
      if (n += `${E}${u.type} (${u.size} bytes)
`, u.data) {
        const $ = JSON.stringify(u.data, (y, g) => typeof g == "bigint" ? g.toString() : y === "data" && g instanceof Uint8Array ? `Uint8Array(${g.byteLength} bytes)` : g, 2);
        n += `${E}  Data: ${$}
`;
      }
      if (u.children && u.children.length > 0)
        for (const $ of u.children)
          d($, _ + 1);
    };
    for (const u of s)
      d(u);
    return n;
  }
  /**
   * Get all samples for a specific track
   * @param boxes Parsed box structure
   * @param trackId Track ID to find samples for (optional)
   * @returns Array of samples
   */
  getSamples(s, n) {
    const d = [];
    return this.findBoxes(s, "moof").forEach((u) => {
      u.children && u.children.filter((_) => _.type === "traf").forEach((_) => {
        if (!_.children)
          return;
        const E = _.children.find((y) => y.type === "tfhd");
        if (!E || !E.data || n !== void 0 && E.data.trackID !== n)
          return;
        _.children.filter((y) => y.type === "trun").forEach((y) => {
          !y.data || !y.data.samples || y.data.samples.forEach((g) => {
            g.data && g.data.byteLength > 0 && d.push(g);
          });
        });
      });
    }), d;
  }
  /**
   * Find all boxes of a specific type
   * @param boxes Array of boxes to search
   * @param type Box type to find
   * @returns Array of matching boxes
   */
  findBoxes(s, n) {
    const d = [], u = (_) => {
      for (const E of _)
        E.type === n && d.push(E), E.children && E.children.length > 0 && u(E.children);
    };
    return u(s), d;
  }
  /**
   * Parse 'stsd' box data (Sample Description Box)
   */
  parseStsdBox(s, n, d) {
    const u = new DataView(s), _ = u.getUint8(n), E = u.getUint8(n + 1) << 16 | u.getUint8(n + 2) << 8 | u.getUint8(n + 3), $ = u.getUint32(n + 4, !1);
    let y = n + 8;
    const g = [];
    for (let S = 0; S < $ && y < d; S++) {
      const C = u.getUint32(y, !1), I = this.readFourCC(s, y + 4);
      let H;
      switch (I) {
        case "avc1":
        case "avc3":
          if (H = this.parseAvcBox(s, y + 8, y + C), y + C > y + 8 + 78) {
            const q = this.parseBox(s, y + 8 + 78);
            q && q.type === "avcC" && (H.avcC = q.data);
          }
          break;
        case "hev1":
        case "hvc1":
          if (H = this.parseHevcBox(s, y + 8, y + C), y + C > y + 8 + 78) {
            const q = this.parseBox(s, y + 8 + 78);
            q && q.type === "hvcC" && (H.hvcC = q.data);
          }
          break;
        case "mp4a":
          if (H = this.parseMp4aBox(s, y + 8, y + C), y + C > y + 8 + 28) {
            const q = this.parseBox(s, y + 8 + 28);
            q && q.type === "esds" && (H.esds = q.data);
          }
          break;
        default:
          H = new Uint8Array(s.slice(y + 8, y + C));
      }
      g.push({
        size: C,
        type: I,
        data: H
      }), y += C;
    }
    return {
      version: _,
      flags: E,
      entryCount: $,
      entries: g
    };
  }
  /**
   * Parse AVC Sample Entry box (avc1, avc3)
   */
  parseAvcBox(s, n, d) {
    const u = new DataView(s);
    n += 6;
    const _ = u.getUint16(n, !1);
    n += 2, n += 16;
    const E = u.getUint16(n, !1), $ = u.getUint16(n + 2, !1), y = u.getUint32(n + 4, !1), g = u.getUint32(n + 8, !1);
    n += 12, n += 4;
    const S = u.getUint16(n, !1);
    n += 2;
    const C = u.getUint8(n), I = this.readString(s, n + 1, C);
    n += 32;
    const H = u.getUint16(n, !1), q = u.getInt16(n + 2, !1);
    return {
      dataReferenceIndex: _,
      width: E,
      height: $,
      horizresolution: y,
      vertresolution: g,
      frameCount: S,
      compressorName: I,
      depth: H,
      preDefined: q
    };
  }
  /**
   * Parse HEVC Sample Entry box (hev1, hvc1)
   */
  parseHevcBox(s, n, d) {
    return this.parseAvcBox(s, n, d);
  }
  /**
   * Parse MP4 Audio Sample Entry box (mp4a)
   */
  parseMp4aBox(s, n, d) {
    const u = new DataView(s);
    n += 6;
    const _ = u.getUint16(n, !1);
    n += 2, n += 8;
    const E = u.getUint16(n, !1), $ = u.getUint16(n + 2, !1);
    n += 4, n += 4;
    const y = u.getUint32(n, !1) >> 16;
    return {
      dataReferenceIndex: _,
      channelCount: E,
      sampleSize: $,
      sampleRate: y
    };
  }
  /**
   * Read a string from the buffer
   */
  readString(s, n, d) {
    const u = new Uint8Array(s, n, d);
    return String.fromCharCode(...u).replace(/\0+$/, "");
  }
  /**
   * Parse 'avcC' box data
   */
  parseAvcCBox(s, n, d) {
    const u = new DataView(s);
    return {
      data: new Uint8Array(s, n, d - n),
      configurationVersion: u.getUint8(n),
      profileIndication: u.getUint8(n + 1),
      profileCompatibility: u.getUint8(n + 2),
      levelIndication: u.getUint8(n + 3)
      // There are more fields but we only need these for the codec string
    };
  }
  /**
   * Parse 'hvcC' box data
   */
  parseHvcCBox(s, n, d) {
    const u = new DataView(s);
    return {
      data: new Uint8Array(s, n, d - n),
      configurationVersion: u.getUint8(n),
      generalProfileSpace: u.getUint8(n + 1) >> 6 & 3,
      generalTierFlag: u.getUint8(n + 1) >> 5 & 1,
      generalProfileIdc: u.getUint8(n + 1) & 31,
      generalProfileCompatibilityFlags: u.getUint32(n + 2, !1),
      generalConstraintIndicatorFlags: new DataView(s, n + 6, 6),
      generalLevelIdc: u.getUint8(n + 12),
      minSpatialSegmentationIdc: u.getUint16(n + 13, !1) & 4095,
      parallelismType: u.getUint8(n + 15) & 3
      // There are more fields but we only need these for the codec string
    };
  }
  /**
   * Parse 'esds' box data
   */
  parseEsdsBox(s, n, d) {
    const u = new DataView(s);
    if (n += 4, u.getUint8(n) === 3) {
      const _ = this.parseExpandableLength(s, n + 1);
      if (n += 1 + _.bytesRead, n += 3, u.getUint8(n) === 4) {
        const E = this.parseExpandableLength(s, n + 1);
        n += 1 + E.bytesRead;
        const $ = {
          objectTypeIndication: (u.getUint8(n) >> 6) + 1,
          streamType: u.getUint8(n + 1) >> 2 & 63,
          bufferSizeDB: (u.getUint8(n + 1) & 3) << 16 | u.getUint8(n + 2) << 8 | u.getUint8(n + 3),
          maxBitrate: u.getUint32(n + 4, !1),
          avgBitrate: u.getUint32(n + 8, !1)
        };
        if (n += 13, n < d && u.getUint8(n) === 5) {
          const y = this.parseExpandableLength(s, n + 1);
          n += 1 + y.bytesRead;
          const g = new Uint8Array(s, n, y.length);
          return n += y.length, {
            decoderConfig: $,
            specificInfo: g,
            data: g
            // Keep the original data field for compatibility
          };
        }
        return {
          decoderConfig: $,
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
  parseExpandableLength(s, n) {
    const d = new DataView(s);
    let u = 0, _ = 0, E;
    do
      E = d.getUint8(n + _), u = u << 7 | E & 127, _++;
    while (E & 128);
    return { length: u, bytesRead: _ };
  }
  /**
   * Generate codec string for MSE from codec specific box
   * @param boxes Array of parsed boxes
   * @returns Array of codec info objects containing codec strings and MIME types
   */
  generateCodecStrings(s) {
    const n = [], d = this.findBoxes(s, "stsd");
    for (const u of d)
      if (u.data?.entries)
        for (const _ of u.data.entries) {
          const { type: E, data: $ } = _;
          switch (E) {
            case "avc1":
            case "avc3": {
              if ($?.avcC) {
                const { profileIndication: y, profileCompatibility: g, levelIndication: S } = $.avcC, C = `${E}.` + y.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + S.toString(16).padStart(2, "0");
                n.push({
                  codecString: C,
                  mimeType: "video/mp4",
                  extraData: $.avcC.data
                });
              }
              break;
            }
            case "hev1":
            case "hvc1": {
              if ($?.hvcC) {
                const {
                  generalProfileSpace: y,
                  generalProfileIdc: g,
                  generalProfileCompatibilityFlags: S,
                  generalConstraintIndicatorFlags: C,
                  generalLevelIdc: I
                } = $.hvcC, q = (["", "A", "B", "C"][y] || "") + g, K = C.toString(16).padStart(6, "0"), j = I.toString(16).padStart(2, "0"), he = `${E}.${q}.${K}.${j}`;
                n.push({
                  codecString: he,
                  mimeType: "video/mp4",
                  extraData: $.hvcC.data
                });
              }
              break;
            }
            case "mp4a": {
              if ($?.esds?.decoderConfig) {
                const { objectTypeIndication: y } = $.esds.decoderConfig, g = `mp4a.40.${y}`;
                n.push({
                  codecString: g,
                  mimeType: "audio/mp4",
                  extraData: $.esds.data
                });
              }
              break;
            }
          }
        }
    return n;
  }
}
var It = /* @__PURE__ */ ((P) => (P.VideoCodecInfo = "videoCodecInfo", P.VideoFrame = "videoFrame", P.Error = "error", P))(It || {}), Vn = /* @__PURE__ */ ((P) => (P.AudioCodecInfo = "audioCodecInfo", P.AudioFrame = "audioFrame", P.Error = "error", P))(Vn || {});
function po(P) {
  return P && P.__esModule && Object.prototype.hasOwnProperty.call(P, "default") ? P.default : P;
}
var Ki = { exports: {} };
(function(P) {
  var s = Object.prototype.hasOwnProperty, n = "~";
  function d() {
  }
  Object.create && (d.prototype = /* @__PURE__ */ Object.create(null), new d().__proto__ || (n = !1));
  function u(y, g, S) {
    this.fn = y, this.context = g, this.once = S || !1;
  }
  function _(y, g, S, C, I) {
    if (typeof S != "function")
      throw new TypeError("The listener must be a function");
    var H = new u(S, C || y, I), q = n ? n + g : g;
    return y._events[q] ? y._events[q].fn ? y._events[q] = [y._events[q], H] : y._events[q].push(H) : (y._events[q] = H, y._eventsCount++), y;
  }
  function E(y, g) {
    --y._eventsCount === 0 ? y._events = new d() : delete y._events[g];
  }
  function $() {
    this._events = new d(), this._eventsCount = 0;
  }
  $.prototype.eventNames = function() {
    var g = [], S, C;
    if (this._eventsCount === 0)
      return g;
    for (C in S = this._events)
      s.call(S, C) && g.push(n ? C.slice(1) : C);
    return Object.getOwnPropertySymbols ? g.concat(Object.getOwnPropertySymbols(S)) : g;
  }, $.prototype.listeners = function(g) {
    var S = n ? n + g : g, C = this._events[S];
    if (!C)
      return [];
    if (C.fn)
      return [C.fn];
    for (var I = 0, H = C.length, q = new Array(H); I < H; I++)
      q[I] = C[I].fn;
    return q;
  }, $.prototype.listenerCount = function(g) {
    var S = n ? n + g : g, C = this._events[S];
    return C ? C.fn ? 1 : C.length : 0;
  }, $.prototype.emit = function(g, S, C, I, H, q) {
    var K = n ? n + g : g;
    if (!this._events[K])
      return !1;
    var j = this._events[K], he = arguments.length, Q, se;
    if (j.fn) {
      switch (j.once && this.removeListener(g, j.fn, void 0, !0), he) {
        case 1:
          return j.fn.call(j.context), !0;
        case 2:
          return j.fn.call(j.context, S), !0;
        case 3:
          return j.fn.call(j.context, S, C), !0;
        case 4:
          return j.fn.call(j.context, S, C, I), !0;
        case 5:
          return j.fn.call(j.context, S, C, I, H), !0;
        case 6:
          return j.fn.call(j.context, S, C, I, H, q), !0;
      }
      for (se = 1, Q = new Array(he - 1); se < he; se++)
        Q[se - 1] = arguments[se];
      j.fn.apply(j.context, Q);
    } else {
      var We = j.length, re;
      for (se = 0; se < We; se++)
        switch (j[se].once && this.removeListener(g, j[se].fn, void 0, !0), he) {
          case 1:
            j[se].fn.call(j[se].context);
            break;
          case 2:
            j[se].fn.call(j[se].context, S);
            break;
          case 3:
            j[se].fn.call(j[se].context, S, C);
            break;
          case 4:
            j[se].fn.call(j[se].context, S, C, I);
            break;
          default:
            if (!Q)
              for (re = 1, Q = new Array(he - 1); re < he; re++)
                Q[re - 1] = arguments[re];
            j[se].fn.apply(j[se].context, Q);
        }
    }
    return !0;
  }, $.prototype.on = function(g, S, C) {
    return _(this, g, S, C, !1);
  }, $.prototype.once = function(g, S, C) {
    return _(this, g, S, C, !0);
  }, $.prototype.removeListener = function(g, S, C, I) {
    var H = n ? n + g : g;
    if (!this._events[H])
      return this;
    if (!S)
      return E(this, H), this;
    var q = this._events[H];
    if (q.fn)
      q.fn === S && (!I || q.once) && (!C || q.context === C) && E(this, H);
    else {
      for (var K = 0, j = [], he = q.length; K < he; K++)
        (q[K].fn !== S || I && !q[K].once || C && q[K].context !== C) && j.push(q[K]);
      j.length ? this._events[H] = j.length === 1 ? j[0] : j : E(this, H);
    }
    return this;
  }, $.prototype.removeAllListeners = function(g) {
    var S;
    return g ? (S = n ? n + g : g, this._events[S] && E(this, S)) : (this._events = new d(), this._eventsCount = 0), this;
  }, $.prototype.off = $.prototype.removeListener, $.prototype.addListener = $.prototype.on, $.prefixed = n, $.EventEmitter = $, P.exports = $;
})(Ki);
var vo = Ki.exports;
const mo = /* @__PURE__ */ po(vo), zi = Symbol("instance"), ei = Symbol("cacheResult");
class Pi {
  constructor(s, n, d) {
    this.oldState = s, this.newState = n, this.action = d, this.aborted = !1;
  }
  abort(s) {
    this.aborted = !0, qn.call(s, this.oldState, new Error(`action '${this.action}' aborted`));
  }
  toString() {
    return `${this.action}ing`;
  }
}
class ri extends Error {
  /*************  ✨ Codeium Command ⭐  *************/
  /**
     * Create a new instance of FSMError.
     * @param state current state.
     * @param message error message.
     * @param cause original error.
  /******  625fa23f-3ee1-42ac-94bd-4f6ffd4578ff  *******/
  constructor(s, n, d) {
    super(n), this.state = s, this.message = n, this.cause = d;
  }
}
function go(P) {
  return typeof P == "object" && P && "then" in P;
}
const Nn = /* @__PURE__ */ new Map();
function Zt(P, s, n = {}) {
  return (d, u, _) => {
    const E = n.action || u;
    if (!n.context) {
      const y = Nn.get(d) || [];
      Nn.has(d) || Nn.set(d, y), y.push({ from: P, to: s, action: E });
    }
    const $ = _.value;
    _.value = function(...y) {
      let g = this;
      if (n.context && (g = ve.get(typeof n.context == "function" ? n.context.call(this, ...y) : n.context)), g.state === s)
        return n.sync ? g[ei] : Promise.resolve(g[ei]);
      g.state instanceof Pi && g.state.action == n.abortAction && g.state.abort(g);
      let S = null;
      Array.isArray(P) ? P.length == 0 ? g.state instanceof Pi && g.state.abort(g) : (typeof g.state != "string" || !P.includes(g.state)) && (S = new ri(g._state, `${g.name} ${E} to ${s} failed: current state ${g._state} not from ${P.join("|")}`)) : P !== g.state && (S = new ri(g._state, `${g.name} ${E} to ${s} failed: current state ${g._state} not from ${P}`));
      const C = (j) => {
        if (n.fail && n.fail.call(this, j), n.sync) {
          if (n.ignoreError)
            return j;
          throw j;
        } else
          return n.ignoreError ? Promise.resolve(j) : Promise.reject(j);
      };
      if (S)
        return C(S);
      const I = g.state, H = new Pi(I, s, E);
      qn.call(g, H);
      const q = (j) => {
        var he;
        return g[ei] = j, H.aborted || (qn.call(g, s), (he = n.success) === null || he === void 0 || he.call(this, g[ei])), j;
      }, K = (j) => (qn.call(g, I, j), C(j));
      try {
        const j = $.apply(this, y);
        return go(j) ? j.then(q).catch(K) : n.sync ? q(j) : Promise.resolve(q(j));
      } catch (j) {
        return K(new ri(g._state, `${g.name} ${E} from ${P} to ${s} failed: ${j}`, j instanceof Error ? j : new Error(String(j))));
      }
    };
  };
}
function yo(...P) {
  return (s, n, d) => {
    const u = d.value, _ = n;
    d.value = function(...E) {
      if (!P.includes(this.state.toString()))
        throw new ri(this.state, `${this.name} ${_} failed: current state ${this.state} not in ${P}`);
      return u.apply(this, E);
    };
  };
}
const wo = (() => typeof window < "u" && window.__AFSM__ ? (n, d) => {
  window.dispatchEvent(new CustomEvent(n, { detail: d }));
} : typeof importScripts < "u" ? (n, d) => {
  postMessage({ type: n, payload: d });
} : () => {
})();
function qn(P, s) {
  const n = this._state;
  this._state = P;
  const d = P.toString();
  P && this.emit(d, n), this.emit(ve.STATECHANGED, P, n, s), this.updateDevTools({ value: P, old: n, err: s instanceof Error ? s.message : String(s) });
}
class ve extends mo {
  constructor(s, n, d) {
    super(), this.name = s, this.groupName = n, this._state = ve.INIT, s || (s = Date.now().toString(36)), d ? Object.setPrototypeOf(this, d) : d = Object.getPrototypeOf(this), n || (this.groupName = this.constructor.name);
    const u = d[zi];
    u ? this.name = u.name + "-" + u.count++ : d[zi] = { name: this.name, count: 0 }, this.updateDevTools({ diagram: this.stateDiagram });
  }
  get stateDiagram() {
    const s = Object.getPrototypeOf(this), n = Nn.get(s) || [];
    let d = /* @__PURE__ */ new Set(), u = [], _ = [];
    const E = /* @__PURE__ */ new Set(), $ = Object.getPrototypeOf(s);
    Nn.has($) && ($.stateDiagram.forEach((g) => d.add(g)), $.allStates.forEach((g) => E.add(g))), n.forEach(({ from: g, to: S, action: C }) => {
      typeof g == "string" ? u.push({ from: g, to: S, action: C }) : g.length ? g.forEach((I) => {
        u.push({ from: I, to: S, action: C });
      }) : _.push({ to: S, action: C });
    }), u.forEach(({ from: g, to: S, action: C }) => {
      E.add(g), E.add(S), E.add(C + "ing"), d.add(`${g} --> ${C}ing : ${C}`), d.add(`${C}ing --> ${S} : ${C} 🟢`), d.add(`${C}ing --> ${g} : ${C} 🔴`);
    }), _.forEach(({ to: g, action: S }) => {
      d.add(`${S}ing --> ${g} : ${S} 🟢`), E.forEach((C) => {
        C !== g && d.add(`${C} --> ${S}ing : ${S}`);
      });
    });
    const y = [...d];
    return Object.defineProperties(s, {
      stateDiagram: { value: y },
      allStates: { value: E }
    }), y;
  }
  static get(s) {
    let n;
    return typeof s == "string" ? (n = ve.instances.get(s), n || ve.instances.set(s, n = new ve(s, void 0, Object.create(ve.prototype)))) : (n = ve.instances2.get(s), n || ve.instances2.set(s, n = new ve(s.constructor.name, void 0, Object.create(ve.prototype)))), n;
  }
  static getState(s) {
    var n;
    return (n = ve.get(s)) === null || n === void 0 ? void 0 : n.state;
  }
  updateDevTools(s = {}) {
    wo(ve.UPDATEAFSM, Object.assign({ name: this.name, group: this.groupName }, s));
  }
  get state() {
    return this._state;
  }
  set state(s) {
    qn.call(this, s);
  }
}
ve.STATECHANGED = "stateChanged";
ve.UPDATEAFSM = "updateAFSM";
ve.INIT = "[*]";
ve.ON = "on";
ve.OFF = "off";
ve.instances = /* @__PURE__ */ new Map();
ve.instances2 = /* @__PURE__ */ new WeakMap();
var _o = Object.defineProperty, Eo = Object.getOwnPropertyDescriptor, si = (P, s, n, d) => {
  for (var u = d > 1 ? void 0 : d ? Eo(s, n) : s, _ = P.length - 1, E; _ >= 0; _--)
    (E = P[_]) && (u = (d ? E(s, n, u) : E(u)) || u);
  return d && u && _o(s, n, u), u;
};
function bo() {
  var P;
  self.onmessage = (s) => {
    if (s.data.type === "init") {
      const { canvas: n, wasmScript: d, wasmBinary: u } = s.data, _ = n?.getContext("2d");
      let E = 0, $ = 0;
      const y = {
        wasmBinary: u,
        postRun: () => {
          P = new y.VideoDecoder({
            videoInfo(g, S) {
              E = g, $ = S, console.log("video info", g, S);
            },
            yuvData(g, S) {
              const C = E * $, I = C >> 2;
              let H = y.HEAPU32[g >> 2], q = y.HEAPU32[(g >> 2) + 1], K = y.HEAPU32[(g >> 2) + 2], j = y.HEAPU8.subarray(H, H + C), he = y.HEAPU8.subarray(q, q + I), Q = y.HEAPU8.subarray(K, K + I);
              const se = new Uint8Array(C + I + I);
              se.set(j), se.set(he, C), se.set(Q, C + I);
              const We = new VideoFrame(se, {
                codedWidth: E,
                codedHeight: $,
                format: "I420",
                timestamp: S
              });
              n ? (_?.drawImage(We, 0, 0, n.width, n.height), _?.commit()) : self.postMessage({ type: "yuvData", videoFrame: We }, [We]);
            }
          }), self.postMessage({ type: "ready" });
        }
      };
      Function("var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;return " + d)()(y);
    } else if (s.data.type === "decode") {
      const { packet: n } = s.data;
      P?.decode(n.data, n.type == "key", n.timestamp);
    } else if (s.data.type === "setCodec") {
      const { codec: n, format: d, description: u } = s.data;
      P?.setCodec(n, d, u ?? "");
    }
  };
}
class Yn extends ve {
  constructor(s, n, d = !1, u, _ = !1) {
    super(), this.createModule = s, this.wasmBinary = n, this.workerMode = d, this.canvas = u, this.yuvMode = _, this.module = {}, this.width = 0, this.height = 0;
  }
  async initialize(s) {
    if (this.workerMode) {
      const d = /\{(.+)\}/s.exec(bo.toString())[1];
      this.worker = new Worker(URL.createObjectURL(new Blob([d], { type: "text/javascript" })));
      const u = this.canvas?.transferControlToOffscreen(), _ = await this.wasmBinary;
      return console.warn("worker mode", _), this.worker.postMessage({ type: "init", canvas: u, wasmScript: this.createModule.toString(), wasmBinary: _ }, u ? [u, _] : [_]), new Promise((E) => {
        this.worker.onmessage = ($) => {
          if ($.data.type === "ready")
            delete this.wasmBinary, E(), console.warn("worker mode initialize success");
          else if ($.data.type === "yuvData") {
            const { videoFrame: y } = $.data;
            this.emit(It.VideoFrame, y);
          }
        };
      });
    }
    const n = this.module;
    return this.wasmBinary && (n.wasmBinary = await this.wasmBinary), n.print = (d) => console.log(d), n.printErr = (d) => console.log(`[JS] ERROR: ${d}`), n.onAbort = () => console.log("[JS] FATAL: WASM ABORTED"), new Promise((d) => {
      n.postRun = (u) => {
        this.decoder = new this.module.VideoDecoder(this), console.log("video soft decoder initialize success"), d();
      }, s && Object.assign(n, s), this.createModule(n);
    });
  }
  configure(s) {
    this.config = s;
    const n = this.config.codec.startsWith("avc") ? "avc" : "hevc", d = this.config.description ? n == "avc" ? "avcc" : "hvcc" : "annexb";
    this.decoder?.setCodec(n, d, this.config.description ?? ""), this.worker?.postMessage({ type: "setCodec", codec: n, format: d, description: this.config.description });
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
  videoInfo(s, n) {
    this.width = s, this.height = n;
    let d = {
      width: s,
      height: n
    };
    this.emit(It.VideoCodecInfo, d);
  }
  yuvData(s, n) {
    if (!this.module)
      return;
    const d = this.width * this.height, u = d >> 2;
    let _ = this.module.HEAPU32[s >> 2], E = this.module.HEAPU32[(s >> 2) + 1], $ = this.module.HEAPU32[(s >> 2) + 2], y = this.module.HEAPU8.subarray(_, _ + d), g = this.module.HEAPU8.subarray(E, E + u), S = this.module.HEAPU8.subarray($, $ + u);
    if (this.yuvMode) {
      this.emit(It.VideoFrame, [y, g, S]);
      return;
    }
    const C = new Uint8Array(d + u + u);
    C.set(y), C.set(g, d), C.set(S, d + u), this.emit(It.VideoFrame, new VideoFrame(C, {
      codedWidth: this.width,
      codedHeight: this.height,
      format: "I420",
      timestamp: n
    }));
  }
  errorInfo(s) {
    let n = {
      errMsg: s
    };
    this.emit(It.Error, n);
  }
}
si([
  Zt([ve.INIT, "closed"], "initialized")
], Yn.prototype, "initialize", 1);
si([
  Zt("initialized", "configured")
], Yn.prototype, "configure", 1);
si([
  Zt([], ve.INIT)
], Yn.prototype, "reset", 1);
si([
  Zt([], "closed")
], Yn.prototype, "close", 1);
(() => {
  var P = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
  return function(s = {}) {
    var n = s, d, u;
    n.ready = new Promise((h, p) => {
      d = h, u = p;
    });
    var _ = Object.assign({}, n), E = typeof window == "object", $ = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && process.versions.node;
    var y = "";
    function g(h) {
      return n.locateFile ? n.locateFile(h, y) : y + h;
    }
    var S;
    (E || $) && ($ ? y = self.location.href : typeof document < "u" && document.currentScript && (y = document.currentScript.src), P && (y = P), y.indexOf("blob:") !== 0 ? y = y.substr(0, y.replace(/[?#].*/, "").lastIndexOf("/") + 1) : y = "", $ && (S = (h) => {
      var p = new XMLHttpRequest();
      return p.open("GET", h, !1), p.responseType = "arraybuffer", p.send(null), new Uint8Array(p.response);
    }));
    var C = n.print || console.log.bind(console), I = n.printErr || console.error.bind(console);
    Object.assign(n, _), _ = null, n.arguments && n.arguments, n.thisProgram && n.thisProgram, n.quit && n.quit;
    var H;
    n.wasmBinary && (H = n.wasmBinary), n.noExitRuntime, typeof WebAssembly != "object" && $e("no native wasm support detected");
    var q, K, j = !1, he, Q, se, We, re, X, be, tt;
    function z() {
      var h = q.buffer;
      n.HEAP8 = he = new Int8Array(h), n.HEAP16 = se = new Int16Array(h), n.HEAP32 = re = new Int32Array(h), n.HEAPU8 = Q = new Uint8Array(h), n.HEAPU16 = We = new Uint16Array(h), n.HEAPU32 = X = new Uint32Array(h), n.HEAPF32 = be = new Float32Array(h), n.HEAPF64 = tt = new Float64Array(h);
    }
    var G, Lt = [], jt = [], Pr = [];
    function Jt() {
      if (n.preRun)
        for (typeof n.preRun == "function" && (n.preRun = [n.preRun]); n.preRun.length; )
          rr(n.preRun.shift());
      $t(Lt);
    }
    function er() {
      $t(jt);
    }
    function tr() {
      if (n.postRun)
        for (typeof n.postRun == "function" && (n.postRun = [n.postRun]); n.postRun.length; )
          Gr(n.postRun.shift());
      $t(Pr);
    }
    function rr(h) {
      Lt.unshift(h);
    }
    function qr(h) {
      jt.unshift(h);
    }
    function Gr(h) {
      Pr.unshift(h);
    }
    var st = 0, bt = null;
    function Xr(h) {
      st++, n.monitorRunDependencies && n.monitorRunDependencies(st);
    }
    function Kr(h) {
      if (st--, n.monitorRunDependencies && n.monitorRunDependencies(st), st == 0 && bt) {
        var p = bt;
        bt = null, p();
      }
    }
    function $e(h) {
      n.onAbort && n.onAbort(h), h = "Aborted(" + h + ")", I(h), j = !0, h += ". Build with -sASSERTIONS for more info.";
      var p = new WebAssembly.RuntimeError(h);
      throw u(p), p;
    }
    var Ke = "data:application/octet-stream;base64,";
    function Jn(h) {
      return h.startsWith(Ke);
    }
    var Ve;
    Ve = "videodec_simd.wasm", Jn(Ve) || (Ve = g(Ve));
    function rt(h) {
      if (h == Ve && H)
        return new Uint8Array(H);
      if (S)
        return S(h);
      throw "both async and sync fetching of the wasm failed";
    }
    function De(h) {
      return !H && (E || $) && typeof fetch == "function" ? fetch(h, { credentials: "same-origin" }).then((p) => {
        if (!p.ok)
          throw "failed to load wasm binary file at '" + h + "'";
        return p.arrayBuffer();
      }).catch(() => rt(h)) : Promise.resolve().then(() => rt(h));
    }
    function Tr(h, p, v) {
      return De(h).then((b) => WebAssembly.instantiate(b, p)).then((b) => b).then(v, (b) => {
        I("failed to asynchronously prepare wasm: " + b), $e(b);
      });
    }
    function nr(h, p, v, b) {
      return !h && typeof WebAssembly.instantiateStreaming == "function" && !Jn(p) && typeof fetch == "function" ? fetch(p, { credentials: "same-origin" }).then((F) => {
        var U = WebAssembly.instantiateStreaming(F, v);
        return U.then(b, function(M) {
          return I("wasm streaming compile failed: " + M), I("falling back to ArrayBuffer instantiation"), Tr(p, v, b);
        });
      }) : Tr(p, v, b);
    }
    function Oe() {
      var h = { a: Bn };
      function p(b, F) {
        var U = b.exports;
        return K = U, q = K.v, z(), G = K.z, qr(K.w), Kr(), U;
      }
      Xr();
      function v(b) {
        p(b.instance);
      }
      if (n.instantiateWasm)
        try {
          return n.instantiateWasm(h, p);
        } catch (b) {
          I("Module.instantiateWasm callback failed with error: " + b), u(b);
        }
      return nr(H, Ve, h, v).catch(u), {};
    }
    var $t = (h) => {
      for (; h.length > 0; )
        h.shift()(n);
    };
    function Qr(h) {
      this.excPtr = h, this.ptr = h - 24, this.set_type = function(p) {
        X[this.ptr + 4 >> 2] = p;
      }, this.get_type = function() {
        return X[this.ptr + 4 >> 2];
      }, this.set_destructor = function(p) {
        X[this.ptr + 8 >> 2] = p;
      }, this.get_destructor = function() {
        return X[this.ptr + 8 >> 2];
      }, this.set_caught = function(p) {
        p = p ? 1 : 0, he[this.ptr + 12 >> 0] = p;
      }, this.get_caught = function() {
        return he[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(p) {
        p = p ? 1 : 0, he[this.ptr + 13 >> 0] = p;
      }, this.get_rethrown = function() {
        return he[this.ptr + 13 >> 0] != 0;
      }, this.init = function(p, v) {
        this.set_adjusted_ptr(0), this.set_type(p), this.set_destructor(v);
      }, this.set_adjusted_ptr = function(p) {
        X[this.ptr + 16 >> 2] = p;
      }, this.get_adjusted_ptr = function() {
        return X[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var p = Ir(this.get_type());
        if (p)
          return X[this.excPtr >> 2];
        var v = this.get_adjusted_ptr();
        return v !== 0 ? v : this.excPtr;
      };
    }
    var Ht = 0;
    function Yr(h, p, v) {
      var b = new Qr(h);
      throw b.init(p, v), Ht = h, Ht;
    }
    function Zr(h, p, v, b, F) {
    }
    function x(h) {
      switch (h) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError(`Unknown type size: ${h}`);
      }
    }
    function Y() {
      for (var h = new Array(256), p = 0; p < 256; ++p)
        h[p] = String.fromCharCode(p);
      gt = h;
    }
    var gt = void 0;
    function Fe(h) {
      for (var p = "", v = h; Q[v]; )
        p += gt[Q[v++]];
      return p;
    }
    var nt = {}, at = {}, zt = {}, N = void 0;
    function ue(h) {
      throw new N(h);
    }
    var Wt = void 0;
    function ge(h) {
      throw new Wt(h);
    }
    function lt(h, p, v) {
      h.forEach(function(R) {
        zt[R] = p;
      });
      function b(R) {
        var V = v(R);
        V.length !== h.length && ge("Mismatched type converter count");
        for (var O = 0; O < h.length; ++O)
          Re(h[O], V[O]);
      }
      var F = new Array(p.length), U = [], M = 0;
      p.forEach((R, V) => {
        at.hasOwnProperty(R) ? F[V] = at[R] : (U.push(R), nt.hasOwnProperty(R) || (nt[R] = []), nt[R].push(() => {
          F[V] = at[R], ++M, M === U.length && b(F);
        }));
      }), U.length === 0 && b(F);
    }
    function Ie(h, p, v = {}) {
      var b = p.name;
      if (h || ue(`type "${b}" must have a positive integer typeid pointer`), at.hasOwnProperty(h)) {
        if (v.ignoreDuplicateRegistrations)
          return;
        ue(`Cannot register type '${b}' twice`);
      }
      if (at[h] = p, delete zt[h], nt.hasOwnProperty(h)) {
        var F = nt[h];
        delete nt[h], F.forEach((U) => U());
      }
    }
    function Re(h, p, v = {}) {
      if (!("argPackAdvance" in p))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      return Ie(h, p, v);
    }
    function Pt(h, p, v, b, F) {
      var U = x(v);
      p = Fe(p), Re(h, { name: p, fromWireType: function(M) {
        return !!M;
      }, toWireType: function(M, R) {
        return R ? b : F;
      }, argPackAdvance: 8, readValueFromPointer: function(M) {
        var R;
        if (v === 1)
          R = he;
        else if (v === 2)
          R = se;
        else if (v === 4)
          R = re;
        else
          throw new TypeError("Unknown boolean type size: " + p);
        return this.fromWireType(R[M >> U]);
      }, destructorFunction: null });
    }
    function Tt(h) {
      if (!(this instanceof Ne) || !(h instanceof Ne))
        return !1;
      for (var p = this.$$.ptrType.registeredClass, v = this.$$.ptr, b = h.$$.ptrType.registeredClass, F = h.$$.ptr; p.baseClass; )
        v = p.upcast(v), p = p.baseClass;
      for (; b.baseClass; )
        F = b.upcast(F), b = b.baseClass;
      return p === b && v === F;
    }
    function Ct(h) {
      return { count: h.count, deleteScheduled: h.deleteScheduled, preservePointerOnDelete: h.preservePointerOnDelete, ptr: h.ptr, ptrType: h.ptrType, smartPtr: h.smartPtr, smartPtrType: h.smartPtrType };
    }
    function ir(h) {
      function p(v) {
        return v.$$.ptrType.registeredClass.name;
      }
      ue(p(h) + " instance already deleted");
    }
    var Te = !1;
    function Vt(h) {
    }
    function L(h) {
      h.smartPtr ? h.smartPtrType.rawDestructor(h.smartPtr) : h.ptrType.registeredClass.rawDestructor(h.ptr);
    }
    function Cr(h) {
      h.count.value -= 1;
      var p = h.count.value === 0;
      p && L(h);
    }
    function kr(h, p, v) {
      if (p === v)
        return h;
      if (v.baseClass === void 0)
        return null;
      var b = kr(h, p, v.baseClass);
      return b === null ? null : v.downcast(b);
    }
    var Sr = {};
    function Jr() {
      return Object.keys(kt).length;
    }
    function en() {
      var h = [];
      for (var p in kt)
        kt.hasOwnProperty(p) && h.push(kt[p]);
      return h;
    }
    var Qe = [];
    function o() {
      for (; Qe.length; ) {
        var h = Qe.pop();
        h.$$.deleteScheduled = !1, h.delete();
      }
    }
    var ut = void 0;
    function ae(h) {
      ut = h, Qe.length && ut && ut(o);
    }
    function tn() {
      n.getInheritedInstanceCount = Jr, n.getLiveInheritedInstances = en, n.flushPendingDeletes = o, n.setDelayFunction = ae;
    }
    var kt = {};
    function rn(h, p) {
      for (p === void 0 && ue("ptr should not be undefined"); h.baseClass; )
        p = h.upcast(p), h = h.baseClass;
      return p;
    }
    function St(h, p) {
      return p = rn(h, p), kt[p];
    }
    function Nt(h, p) {
      (!p.ptrType || !p.ptr) && ge("makeClassHandle requires ptr and ptrType");
      var v = !!p.smartPtrType, b = !!p.smartPtr;
      return v !== b && ge("Both smartPtrType and smartPtr must be specified"), p.count = { value: 1 }, ce(Object.create(h, { $$: { value: p } }));
    }
    function or(h) {
      var p = this.getPointee(h);
      if (!p)
        return this.destructor(h), null;
      var v = St(this.registeredClass, p);
      if (v !== void 0) {
        if (v.$$.count.value === 0)
          return v.$$.ptr = p, v.$$.smartPtr = h, v.clone();
        var b = v.clone();
        return this.destructor(h), b;
      }
      function F() {
        return this.isSmartPointer ? Nt(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: p, smartPtrType: this, smartPtr: h }) : Nt(this.registeredClass.instancePrototype, { ptrType: this, ptr: h });
      }
      var U = this.registeredClass.getActualType(p), M = Sr[U];
      if (!M)
        return F.call(this);
      var R;
      this.isConst ? R = M.constPointerType : R = M.pointerType;
      var V = kr(p, this.registeredClass, R.registeredClass);
      return V === null ? F.call(this) : this.isSmartPointer ? Nt(R.registeredClass.instancePrototype, { ptrType: R, ptr: V, smartPtrType: this, smartPtr: h }) : Nt(R.registeredClass.instancePrototype, { ptrType: R, ptr: V });
    }
    var ce = function(h) {
      return typeof FinalizationRegistry > "u" ? (ce = (p) => p, h) : (Te = new FinalizationRegistry((p) => {
        Cr(p.$$);
      }), ce = (p) => {
        var v = p.$$, b = !!v.smartPtr;
        if (b) {
          var F = { $$: v };
          Te.register(p, F, p);
        }
        return p;
      }, Vt = (p) => Te.unregister(p), ce(h));
    };
    function Le() {
      if (this.$$.ptr || ir(this), this.$$.preservePointerOnDelete)
        return this.$$.count.value += 1, this;
      var h = ce(Object.create(Object.getPrototypeOf(this), { $$: { value: Ct(this.$$) } }));
      return h.$$.count.value += 1, h.$$.deleteScheduled = !1, h;
    }
    function xe() {
      this.$$.ptr || ir(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && ue("Object already scheduled for deletion"), Vt(this), Cr(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
    }
    function ct() {
      return !this.$$.ptr;
    }
    function je() {
      return this.$$.ptr || ir(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && ue("Object already scheduled for deletion"), Qe.push(this), Qe.length === 1 && ut && ut(o), this.$$.deleteScheduled = !0, this;
    }
    function W() {
      Ne.prototype.isAliasOf = Tt, Ne.prototype.clone = Le, Ne.prototype.delete = xe, Ne.prototype.isDeleted = ct, Ne.prototype.deleteLater = je;
    }
    function Ne() {
    }
    var dt = 48, Ye = 57;
    function qt(h) {
      if (h === void 0)
        return "_unknown";
      h = h.replace(/[^a-zA-Z0-9_]/g, "$");
      var p = h.charCodeAt(0);
      return p >= dt && p <= Ye ? `_${h}` : h;
    }
    function ye(h, p) {
      return h = qt(h), { [h]: function() {
        return p.apply(this, arguments);
      } }[h];
    }
    function Ar(h, p, v) {
      if (h[p].overloadTable === void 0) {
        var b = h[p];
        h[p] = function() {
          return h[p].overloadTable.hasOwnProperty(arguments.length) || ue(`Function '${v}' called with an invalid number of arguments (${arguments.length}) - expects one of (${h[p].overloadTable})!`), h[p].overloadTable[arguments.length].apply(this, arguments);
        }, h[p].overloadTable = [], h[p].overloadTable[b.argCount] = b;
      }
    }
    function nn(h, p, v) {
      n.hasOwnProperty(h) ? ((v === void 0 || n[h].overloadTable !== void 0 && n[h].overloadTable[v] !== void 0) && ue(`Cannot register public name '${h}' twice`), Ar(n, h, h), n.hasOwnProperty(v) && ue(`Cannot register multiple overloads of a function with the same number of arguments (${v})!`), n[h].overloadTable[v] = p) : (n[h] = p, v !== void 0 && (n[h].numArguments = v));
    }
    function on(h, p, v, b, F, U, M, R) {
      this.name = h, this.constructor = p, this.instancePrototype = v, this.rawDestructor = b, this.baseClass = F, this.getActualType = U, this.upcast = M, this.downcast = R, this.pureVirtualFunctions = [];
    }
    function ft(h, p, v) {
      for (; p !== v; )
        p.upcast || ue(`Expected null or instance of ${v.name}, got an instance of ${p.name}`), h = p.upcast(h), p = p.baseClass;
      return h;
    }
    function At(h, p) {
      if (p === null)
        return this.isReference && ue(`null is not a valid ${this.name}`), 0;
      p.$$ || ue(`Cannot pass "${cr(p)}" as a ${this.name}`), p.$$.ptr || ue(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var v = p.$$.ptrType.registeredClass, b = ft(p.$$.ptr, v, this.registeredClass);
      return b;
    }
    function sr(h, p) {
      var v;
      if (p === null)
        return this.isReference && ue(`null is not a valid ${this.name}`), this.isSmartPointer ? (v = this.rawConstructor(), h !== null && h.push(this.rawDestructor, v), v) : 0;
      p.$$ || ue(`Cannot pass "${cr(p)}" as a ${this.name}`), p.$$.ptr || ue(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && p.$$.ptrType.isConst && ue(`Cannot convert argument of type ${p.$$.smartPtrType ? p.$$.smartPtrType.name : p.$$.ptrType.name} to parameter type ${this.name}`);
      var b = p.$$.ptrType.registeredClass;
      if (v = ft(p.$$.ptr, b, this.registeredClass), this.isSmartPointer)
        switch (p.$$.smartPtr === void 0 && ue("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            p.$$.smartPtrType === this ? v = p.$$.smartPtr : ue(`Cannot convert argument of type ${p.$$.smartPtrType ? p.$$.smartPtrType.name : p.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            v = p.$$.smartPtr;
            break;
          case 2:
            if (p.$$.smartPtrType === this)
              v = p.$$.smartPtr;
            else {
              var F = p.clone();
              v = this.rawShare(v, Xt.toHandle(function() {
                F.delete();
              })), h !== null && h.push(this.rawDestructor, v);
            }
            break;
          default:
            ue("Unsupporting sharing policy");
        }
      return v;
    }
    function sn(h, p) {
      if (p === null)
        return this.isReference && ue(`null is not a valid ${this.name}`), 0;
      p.$$ || ue(`Cannot pass "${cr(p)}" as a ${this.name}`), p.$$.ptr || ue(`Cannot pass deleted object as a pointer of type ${this.name}`), p.$$.ptrType.isConst && ue(`Cannot convert argument of type ${p.$$.ptrType.name} to parameter type ${this.name}`);
      var v = p.$$.ptrType.registeredClass, b = ft(p.$$.ptr, v, this.registeredClass);
      return b;
    }
    function yt(h) {
      return this.fromWireType(re[h >> 2]);
    }
    function ar(h) {
      return this.rawGetPointee && (h = this.rawGetPointee(h)), h;
    }
    function lr(h) {
      this.rawDestructor && this.rawDestructor(h);
    }
    function an(h) {
      h !== null && h.delete();
    }
    function ln() {
      we.prototype.getPointee = ar, we.prototype.destructor = lr, we.prototype.argPackAdvance = 8, we.prototype.readValueFromPointer = yt, we.prototype.deleteObject = an, we.prototype.fromWireType = or;
    }
    function we(h, p, v, b, F, U, M, R, V, O, te) {
      this.name = h, this.registeredClass = p, this.isReference = v, this.isConst = b, this.isSmartPointer = F, this.pointeeType = U, this.sharingPolicy = M, this.rawGetPointee = R, this.rawConstructor = V, this.rawShare = O, this.rawDestructor = te, !F && p.baseClass === void 0 ? b ? (this.toWireType = At, this.destructorFunction = null) : (this.toWireType = sn, this.destructorFunction = null) : this.toWireType = sr;
    }
    function Dt(h, p, v) {
      n.hasOwnProperty(h) || ge("Replacing nonexistant public symbol"), n[h].overloadTable !== void 0 && v !== void 0 ? n[h].overloadTable[v] = p : (n[h] = p, n[h].argCount = v);
    }
    var Ze = (h, p, v) => {
      var b = n["dynCall_" + h];
      return v && v.length ? b.apply(null, [p].concat(v)) : b.call(null, p);
    }, Gt = [], Dr = (h) => {
      var p = Gt[h];
      return p || (h >= Gt.length && (Gt.length = h + 1), Gt[h] = p = G.get(h)), p;
    }, Je = (h, p, v) => {
      if (h.includes("j"))
        return Ze(h, p, v);
      var b = Dr(p).apply(null, v);
      return b;
    }, un = (h, p) => {
      var v = [];
      return function() {
        return v.length = 0, Object.assign(v, arguments), Je(h, p, v);
      };
    };
    function wt(h, p) {
      h = Fe(h);
      function v() {
        return h.includes("j") ? un(h, p) : Dr(p);
      }
      var b = v();
      return typeof b != "function" && ue(`unknown function pointer with signature ${h}: ${p}`), b;
    }
    function ht(h, p) {
      var v = ye(p, function(b) {
        this.name = p, this.message = b;
        var F = new Error(b).stack;
        F !== void 0 && (this.stack = this.toString() + `
` + F.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return v.prototype = Object.create(h.prototype), v.prototype.constructor = v, v.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, v;
    }
    var Fr = void 0;
    function qe(h) {
      var p = Or(h), v = Fe(p);
      return et(p), v;
    }
    function ur(h, p) {
      var v = [], b = {};
      function F(U) {
        if (!b[U] && !at[U]) {
          if (zt[U]) {
            zt[U].forEach(F);
            return;
          }
          v.push(U), b[U] = !0;
        }
      }
      throw p.forEach(F), new Fr(`${h}: ` + v.map(qe).join([", "]));
    }
    function cn(h, p, v, b, F, U, M, R, V, O, te, ne, le) {
      te = Fe(te), U = wt(F, U), R && (R = wt(M, R)), O && (O = wt(V, O)), le = wt(ne, le);
      var de = qt(te);
      nn(de, function() {
        ur(`Cannot construct ${te} due to unbound types`, [b]);
      }), lt([h, p, v], b ? [b] : [], function(Ee) {
        Ee = Ee[0];
        var Me, Se;
        b ? (Me = Ee.registeredClass, Se = Me.instancePrototype) : Se = Ne.prototype;
        var ot = ye(de, function() {
          if (Object.getPrototypeOf(this) !== wr)
            throw new N("Use 'new' to construct " + te);
          if (He.constructor_body === void 0)
            throw new N(te + " has no accessible constructor");
          var Ge = He.constructor_body[arguments.length];
          if (Ge === void 0)
            throw new N(`Tried to invoke ctor of ${te} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(He.constructor_body).toString()}) parameters instead!`);
          return Ge.apply(this, arguments);
        }), wr = Object.create(Se, { constructor: { value: ot } });
        ot.prototype = wr;
        var He = new on(te, ot, wr, le, Me, U, R, O);
        He.baseClass && (He.baseClass.__derivedClasses === void 0 && (He.baseClass.__derivedClasses = []), He.baseClass.__derivedClasses.push(He));
        var Mn = new we(te, He, !0, !1, !1), Et = new we(te + "*", He, !1, !1, !1), jr = new we(te + " const*", He, !1, !0, !1);
        return Sr[h] = { pointerType: Et, constPointerType: jr }, Dt(de, ot), [Mn, Et, jr];
      });
    }
    function Rr(h, p) {
      for (var v = [], b = 0; b < h; b++)
        v.push(X[p + b * 4 >> 2]);
      return v;
    }
    function dn(h) {
      for (; h.length; ) {
        var p = h.pop(), v = h.pop();
        v(p);
      }
    }
    function xr(h, p) {
      if (!(h instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof h} which is not a function`);
      var v = ye(h.name || "unknownFunctionName", function() {
      });
      v.prototype = h.prototype;
      var b = new v(), F = h.apply(b, p);
      return F instanceof Object ? F : b;
    }
    function Pe(h, p, v, b, F, U) {
      var M = p.length;
      M < 2 && ue("argTypes array size mismatch! Must at least get return value and 'this' types!");
      for (var R = p[1] !== null && v !== null, V = !1, O = 1; O < p.length; ++O)
        if (p[O] !== null && p[O].destructorFunction === void 0) {
          V = !0;
          break;
        }
      for (var te = p[0].name !== "void", ne = "", le = "", O = 0; O < M - 2; ++O)
        ne += (O !== 0 ? ", " : "") + "arg" + O, le += (O !== 0 ? ", " : "") + "arg" + O + "Wired";
      var de = `
        return function ${qt(h)}(${ne}) {
        if (arguments.length !== ${M - 2}) {
          throwBindingError('function ${h} called with ${arguments.length} arguments, expected ${M - 2} args!');
        }`;
      V && (de += `var destructors = [];
`);
      var Ee = V ? "destructors" : "null", Me = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"], Se = [ue, b, F, dn, p[0], p[1]];
      R && (de += "var thisWired = classParam.toWireType(" + Ee + `, this);
`);
      for (var O = 0; O < M - 2; ++O)
        de += "var arg" + O + "Wired = argType" + O + ".toWireType(" + Ee + ", arg" + O + "); // " + p[O + 2].name + `
`, Me.push("argType" + O), Se.push(p[O + 2]);
      if (R && (le = "thisWired" + (le.length > 0 ? ", " : "") + le), de += (te || U ? "var rv = " : "") + "invoker(fn" + (le.length > 0 ? ", " : "") + le + `);
`, V)
        de += `runDestructors(destructors);
`;
      else
        for (var O = R ? 1 : 2; O < p.length; ++O) {
          var ot = O === 1 ? "thisWired" : "arg" + (O - 2) + "Wired";
          p[O].destructorFunction !== null && (de += ot + "_dtor(" + ot + "); // " + p[O].name + `
`, Me.push(ot + "_dtor"), Se.push(p[O].destructorFunction));
        }
      return te && (de += `var ret = retType.fromWireType(rv);
return ret;
`), de += `}
`, Me.push(de), xr(Function, Me).apply(null, Se);
    }
    function fn(h, p, v, b, F, U) {
      var M = Rr(p, v);
      F = wt(b, F), lt([], [h], function(R) {
        R = R[0];
        var V = `constructor ${R.name}`;
        if (R.registeredClass.constructor_body === void 0 && (R.registeredClass.constructor_body = []), R.registeredClass.constructor_body[p - 1] !== void 0)
          throw new N(`Cannot register multiple constructors with identical number of parameters (${p - 1}) for class '${R.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return R.registeredClass.constructor_body[p - 1] = () => {
          ur(`Cannot construct ${R.name} due to unbound types`, M);
        }, lt([], M, function(O) {
          return O.splice(1, 0, null), R.registeredClass.constructor_body[p - 1] = Pe(V, O, null, F, U), [];
        }), [];
      });
    }
    function hn(h, p, v, b, F, U, M, R, V) {
      var O = Rr(v, b);
      p = Fe(p), U = wt(F, U), lt([], [h], function(te) {
        te = te[0];
        var ne = `${te.name}.${p}`;
        p.startsWith("@@") && (p = Symbol[p.substring(2)]), R && te.registeredClass.pureVirtualFunctions.push(p);
        function le() {
          ur(`Cannot call ${ne} due to unbound types`, O);
        }
        var de = te.registeredClass.instancePrototype, Ee = de[p];
        return Ee === void 0 || Ee.overloadTable === void 0 && Ee.className !== te.name && Ee.argCount === v - 2 ? (le.argCount = v - 2, le.className = te.name, de[p] = le) : (Ar(de, p, ne), de[p].overloadTable[v - 2] = le), lt([], O, function(Me) {
          var Se = Pe(ne, Me, te, U, M, V);
          return de[p].overloadTable === void 0 ? (Se.argCount = v - 2, de[p] = Se) : de[p].overloadTable[v - 2] = Se, [];
        }), [];
      });
    }
    function pt() {
      Object.assign(_t.prototype, { get(h) {
        return this.allocated[h];
      }, has(h) {
        return this.allocated[h] !== void 0;
      }, allocate(h) {
        var p = this.freelist.pop() || this.allocated.length;
        return this.allocated[p] = h, p;
      }, free(h) {
        this.allocated[h] = void 0, this.freelist.push(h);
      } });
    }
    function _t() {
      this.allocated = [void 0], this.freelist = [];
    }
    var Ue = new _t();
    function Ur(h) {
      h >= Ue.reserved && --Ue.get(h).refcount === 0 && Ue.free(h);
    }
    function pn() {
      for (var h = 0, p = Ue.reserved; p < Ue.allocated.length; ++p)
        Ue.allocated[p] !== void 0 && ++h;
      return h;
    }
    function Ft() {
      Ue.allocated.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 }), Ue.reserved = Ue.allocated.length, n.count_emval_handles = pn;
    }
    var Xt = { toValue: (h) => (h || ue("Cannot use deleted val. handle = " + h), Ue.get(h).value), toHandle: (h) => {
      switch (h) {
        case void 0:
          return 1;
        case null:
          return 2;
        case !0:
          return 3;
        case !1:
          return 4;
        default:
          return Ue.allocate({ refcount: 1, value: h });
      }
    } };
    function vn(h, p) {
      p = Fe(p), Re(h, { name: p, fromWireType: function(v) {
        var b = Xt.toValue(v);
        return Ur(v), b;
      }, toWireType: function(v, b) {
        return Xt.toHandle(b);
      }, argPackAdvance: 8, readValueFromPointer: yt, destructorFunction: null });
    }
    function cr(h) {
      if (h === null)
        return "null";
      var p = typeof h;
      return p === "object" || p === "array" || p === "function" ? h.toString() : "" + h;
    }
    function vt(h, p) {
      switch (p) {
        case 2:
          return function(v) {
            return this.fromWireType(be[v >> 2]);
          };
        case 3:
          return function(v) {
            return this.fromWireType(tt[v >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + h);
      }
    }
    function mn(h, p, v) {
      var b = x(v);
      p = Fe(p), Re(h, { name: p, fromWireType: function(F) {
        return F;
      }, toWireType: function(F, U) {
        return U;
      }, argPackAdvance: 8, readValueFromPointer: vt(p, b), destructorFunction: null });
    }
    function gn(h, p, v) {
      switch (p) {
        case 0:
          return v ? function(F) {
            return he[F];
          } : function(F) {
            return Q[F];
          };
        case 1:
          return v ? function(F) {
            return se[F >> 1];
          } : function(F) {
            return We[F >> 1];
          };
        case 2:
          return v ? function(F) {
            return re[F >> 2];
          } : function(F) {
            return X[F >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + h);
      }
    }
    function yn(h, p, v, b, F) {
      p = Fe(p);
      var U = x(v), M = (ne) => ne;
      if (b === 0) {
        var R = 32 - 8 * v;
        M = (ne) => ne << R >>> R;
      }
      var V = p.includes("unsigned"), O = (ne, le) => {
      }, te;
      V ? te = function(ne, le) {
        return O(le, this.name), le >>> 0;
      } : te = function(ne, le) {
        return O(le, this.name), le;
      }, Re(h, { name: p, fromWireType: M, toWireType: te, argPackAdvance: 8, readValueFromPointer: gn(p, U, b !== 0), destructorFunction: null });
    }
    function wn(h, p, v) {
      var b = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], F = b[p];
      function U(M) {
        M = M >> 2;
        var R = X, V = R[M], O = R[M + 1];
        return new F(R.buffer, O, V);
      }
      v = Fe(v), Re(h, { name: v, fromWireType: U, argPackAdvance: 8, readValueFromPointer: U }, { ignoreDuplicateRegistrations: !0 });
    }
    var _e = (h, p, v, b) => {
      if (!(b > 0))
        return 0;
      for (var F = v, U = v + b - 1, M = 0; M < h.length; ++M) {
        var R = h.charCodeAt(M);
        if (R >= 55296 && R <= 57343) {
          var V = h.charCodeAt(++M);
          R = 65536 + ((R & 1023) << 10) | V & 1023;
        }
        if (R <= 127) {
          if (v >= U)
            break;
          p[v++] = R;
        } else if (R <= 2047) {
          if (v + 1 >= U)
            break;
          p[v++] = 192 | R >> 6, p[v++] = 128 | R & 63;
        } else if (R <= 65535) {
          if (v + 2 >= U)
            break;
          p[v++] = 224 | R >> 12, p[v++] = 128 | R >> 6 & 63, p[v++] = 128 | R & 63;
        } else {
          if (v + 3 >= U)
            break;
          p[v++] = 240 | R >> 18, p[v++] = 128 | R >> 12 & 63, p[v++] = 128 | R >> 6 & 63, p[v++] = 128 | R & 63;
        }
      }
      return p[v] = 0, v - F;
    }, _n = (h, p, v) => _e(h, Q, p, v), En = (h) => {
      for (var p = 0, v = 0; v < h.length; ++v) {
        var b = h.charCodeAt(v);
        b <= 127 ? p++ : b <= 2047 ? p += 2 : b >= 55296 && b <= 57343 ? (p += 4, ++v) : p += 3;
      }
      return p;
    }, it = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, Kt = (h, p, v) => {
      for (var b = p + v, F = p; h[F] && !(F >= b); )
        ++F;
      if (F - p > 16 && h.buffer && it)
        return it.decode(h.subarray(p, F));
      for (var U = ""; p < F; ) {
        var M = h[p++];
        if (!(M & 128)) {
          U += String.fromCharCode(M);
          continue;
        }
        var R = h[p++] & 63;
        if ((M & 224) == 192) {
          U += String.fromCharCode((M & 31) << 6 | R);
          continue;
        }
        var V = h[p++] & 63;
        if ((M & 240) == 224 ? M = (M & 15) << 12 | R << 6 | V : M = (M & 7) << 18 | R << 12 | V << 6 | h[p++] & 63, M < 65536)
          U += String.fromCharCode(M);
        else {
          var O = M - 65536;
          U += String.fromCharCode(55296 | O >> 10, 56320 | O & 1023);
        }
      }
      return U;
    }, bn = (h, p) => h ? Kt(Q, h, p) : "";
    function $n(h, p) {
      p = Fe(p);
      var v = p === "std::string";
      Re(h, { name: p, fromWireType: function(b) {
        var F = X[b >> 2], U = b + 4, M;
        if (v)
          for (var R = U, V = 0; V <= F; ++V) {
            var O = U + V;
            if (V == F || Q[O] == 0) {
              var te = O - R, ne = bn(R, te);
              M === void 0 ? M = ne : (M += String.fromCharCode(0), M += ne), R = O + 1;
            }
          }
        else {
          for (var le = new Array(F), V = 0; V < F; ++V)
            le[V] = String.fromCharCode(Q[U + V]);
          M = le.join("");
        }
        return et(b), M;
      }, toWireType: function(b, F) {
        F instanceof ArrayBuffer && (F = new Uint8Array(F));
        var U, M = typeof F == "string";
        M || F instanceof Uint8Array || F instanceof Uint8ClampedArray || F instanceof Int8Array || ue("Cannot pass non-string to std::string"), v && M ? U = En(F) : U = F.length;
        var R = Ut(4 + U + 1), V = R + 4;
        if (X[R >> 2] = U, v && M)
          _n(F, V, U + 1);
        else if (M)
          for (var O = 0; O < U; ++O) {
            var te = F.charCodeAt(O);
            te > 255 && (et(V), ue("String has UTF-16 code units that do not fit in 8 bits")), Q[V + O] = te;
          }
        else
          for (var O = 0; O < U; ++O)
            Q[V + O] = F[O];
        return b !== null && b.push(et, R), R;
      }, argPackAdvance: 8, readValueFromPointer: yt, destructorFunction: function(b) {
        et(b);
      } });
    }
    var Be = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, Pn = (h, p) => {
      for (var v = h, b = v >> 1, F = b + p / 2; !(b >= F) && We[b]; )
        ++b;
      if (v = b << 1, v - h > 32 && Be)
        return Be.decode(Q.subarray(h, v));
      for (var U = "", M = 0; !(M >= p / 2); ++M) {
        var R = se[h + M * 2 >> 1];
        if (R == 0)
          break;
        U += String.fromCharCode(R);
      }
      return U;
    }, dr = (h, p, v) => {
      if (v === void 0 && (v = 2147483647), v < 2)
        return 0;
      v -= 2;
      for (var b = p, F = v < h.length * 2 ? v / 2 : h.length, U = 0; U < F; ++U) {
        var M = h.charCodeAt(U);
        se[p >> 1] = M, p += 2;
      }
      return se[p >> 1] = 0, p - b;
    }, fr = (h) => h.length * 2, Rt = (h, p) => {
      for (var v = 0, b = ""; !(v >= p / 4); ) {
        var F = re[h + v * 4 >> 2];
        if (F == 0)
          break;
        if (++v, F >= 65536) {
          var U = F - 65536;
          b += String.fromCharCode(55296 | U >> 10, 56320 | U & 1023);
        } else
          b += String.fromCharCode(F);
      }
      return b;
    }, Tn = (h, p, v) => {
      if (v === void 0 && (v = 2147483647), v < 4)
        return 0;
      for (var b = p, F = b + v - 4, U = 0; U < h.length; ++U) {
        var M = h.charCodeAt(U);
        if (M >= 55296 && M <= 57343) {
          var R = h.charCodeAt(++U);
          M = 65536 + ((M & 1023) << 10) | R & 1023;
        }
        if (re[p >> 2] = M, p += 4, p + 4 > F)
          break;
      }
      return re[p >> 2] = 0, p - b;
    }, hr = (h) => {
      for (var p = 0, v = 0; v < h.length; ++v) {
        var b = h.charCodeAt(v);
        b >= 55296 && b <= 57343 && ++v, p += 4;
      }
      return p;
    }, Cn = function(h, p, v) {
      v = Fe(v);
      var b, F, U, M, R;
      p === 2 ? (b = Pn, F = dr, M = fr, U = () => We, R = 1) : p === 4 && (b = Rt, F = Tn, M = hr, U = () => X, R = 2), Re(h, { name: v, fromWireType: function(V) {
        for (var O = X[V >> 2], te = U(), ne, le = V + 4, de = 0; de <= O; ++de) {
          var Ee = V + 4 + de * p;
          if (de == O || te[Ee >> R] == 0) {
            var Me = Ee - le, Se = b(le, Me);
            ne === void 0 ? ne = Se : (ne += String.fromCharCode(0), ne += Se), le = Ee + p;
          }
        }
        return et(V), ne;
      }, toWireType: function(V, O) {
        typeof O != "string" && ue(`Cannot pass non-string to C++ string type ${v}`);
        var te = M(O), ne = Ut(4 + te + p);
        return X[ne >> 2] = te >> R, F(O, ne + 4, te + p), V !== null && V.push(et, ne), ne;
      }, argPackAdvance: 8, readValueFromPointer: yt, destructorFunction: function(V) {
        et(V);
      } });
    };
    function pr(h, p) {
      p = Fe(p), Re(h, { isVoid: !0, name: p, argPackAdvance: 0, fromWireType: function() {
      }, toWireType: function(v, b) {
      } });
    }
    var vr = {};
    function kn(h) {
      var p = vr[h];
      return p === void 0 ? Fe(h) : p;
    }
    var mr = [];
    function Sn(h, p, v, b) {
      h = mr[h], p = Xt.toValue(p), v = kn(v), h(p, v, null, b);
    }
    function gr(h) {
      var p = mr.length;
      return mr.push(h), p;
    }
    function me(h, p) {
      var v = at[h];
      return v === void 0 && ue(p + " has unknown type " + qe(h)), v;
    }
    function yr(h, p) {
      for (var v = new Array(h), b = 0; b < h; ++b)
        v[b] = me(X[p + b * 4 >> 2], "parameter " + b);
      return v;
    }
    var Br = [];
    function An(h, p) {
      var v = yr(h, p), b = v[0], F = b.name + "_$" + v.slice(1).map(function(Ee) {
        return Ee.name;
      }).join("_") + "$", U = Br[F];
      if (U !== void 0)
        return U;
      for (var M = ["retType"], R = [b], V = "", O = 0; O < h - 1; ++O)
        V += (O !== 0 ? ", " : "") + "arg" + O, M.push("argType" + O), R.push(v[1 + O]);
      for (var te = qt("methodCaller_" + F), ne = "return function " + te + `(handle, name, destructors, args) {
`, le = 0, O = 0; O < h - 1; ++O)
        ne += "    var arg" + O + " = argType" + O + ".readValueFromPointer(args" + (le ? "+" + le : "") + `);
`, le += v[O + 1].argPackAdvance;
      ne += "    var rv = handle[name](" + V + `);
`;
      for (var O = 0; O < h - 1; ++O)
        v[O + 1].deleteObject && (ne += "    argType" + O + ".deleteObject(arg" + O + `);
`);
      b.isVoid || (ne += `    return retType.toWireType(destructors, rv);
`), ne += `};
`, M.push(ne);
      var de = xr(Function, M).apply(null, R);
      return U = gr(de), Br[F] = U, U;
    }
    var mt = () => {
      $e("");
    }, Mr;
    Mr = () => performance.now();
    var xt = (h, p, v) => Q.copyWithin(h, p, p + v), Dn = (h) => {
      $e("OOM");
    }, Fn = (h) => {
      Q.length, Dn();
    }, Rn = [null, [], []], xn = (h, p) => {
      var v = Rn[h];
      p === 0 || p === 10 ? ((h === 1 ? C : I)(Kt(v, 0)), v.length = 0) : v.push(p);
    }, Un = (h, p, v, b) => {
      for (var F = 0, U = 0; U < v; U++) {
        var M = X[p >> 2], R = X[p + 4 >> 2];
        p += 8;
        for (var V = 0; V < R; V++)
          xn(h, Q[M + V]);
        F += R;
      }
      return X[b >> 2] = F, 0;
    };
    Y(), N = n.BindingError = class extends Error {
      constructor(p) {
        super(p), this.name = "BindingError";
      }
    }, Wt = n.InternalError = class extends Error {
      constructor(p) {
        super(p), this.name = "InternalError";
      }
    }, W(), tn(), ln(), Fr = n.UnboundTypeError = ht(Error, "UnboundTypeError"), pt(), Ft();
    var Bn = { o: Yr, r: Zr, m: Pt, q: cn, p: fn, d: hn, u: vn, k: mn, b: yn, a: wn, j: $n, g: Cn, n: pr, e: Sn, l: Ur, h: An, f: mt, c: Mr, t: xt, s: Fn, i: Un };
    Oe();
    var et = (h) => (et = K.x)(h), Ut = (h) => (Ut = K.y)(h), Or = (h) => (Or = K.A)(h);
    n.__embind_initialize_bindings = () => (n.__embind_initialize_bindings = K.B)();
    var Ir = (h) => (Ir = K.C)(h);
    n.dynCall_jiji = (h, p, v, b, F) => (n.dynCall_jiji = K.D)(h, p, v, b, F);
    var Qt;
    bt = function h() {
      Qt || Lr(), Qt || (bt = h);
    };
    function Lr() {
      if (st > 0 || (Jt(), st > 0))
        return;
      function h() {
        Qt || (Qt = !0, n.calledRun = !0, !j && (er(), d(n), n.onRuntimeInitialized && n.onRuntimeInitialized(), tr()));
      }
      n.setStatus ? (n.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          n.setStatus("");
        }, 1), h();
      }, 1)) : h();
    }
    if (n.preInit)
      for (typeof n.preInit == "function" && (n.preInit = [n.preInit]); n.preInit.length > 0; )
        n.preInit.pop()();
    return Lr(), s.ready;
  };
})();
var $o = (() => {
  var P = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
  return function(s = {}) {
    var n = s, d, u;
    n.ready = new Promise((e, t) => {
      d = e, u = t;
    });
    var _ = Object.assign({}, n), E = "./this.program", $ = typeof window == "object", y = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && process.versions.node;
    var g = "";
    function S(e) {
      return n.locateFile ? n.locateFile(e, g) : g + e;
    }
    var C, I, H;
    ($ || y) && (y ? g = self.location.href : typeof document < "u" && document.currentScript && (g = document.currentScript.src), P && (g = P), g.indexOf("blob:") !== 0 ? g = g.substr(0, g.replace(/[?#].*/, "").lastIndexOf("/") + 1) : g = "", C = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.send(null), t.responseText;
    }, y && (H = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
    }), I = (e, t, r) => {
      var i = new XMLHttpRequest();
      i.open("GET", e, !0), i.responseType = "arraybuffer", i.onload = () => {
        if (i.status == 200 || i.status == 0 && i.response) {
          t(i.response);
          return;
        }
        r();
      }, i.onerror = r, i.send(null);
    });
    var q = n.print || console.log.bind(console), K = n.printErr || console.error.bind(console);
    Object.assign(n, _), _ = null, n.arguments && n.arguments, n.thisProgram && (E = n.thisProgram), n.quit && n.quit;
    var j;
    n.wasmBinary && (j = n.wasmBinary), n.noExitRuntime, typeof WebAssembly != "object" && De("no native wasm support detected");
    var he, Q, se = !1;
    function We(e, t) {
      e || De(t);
    }
    var re, X, be, tt, z, G, Lt, jt;
    function Pr() {
      var e = he.buffer;
      n.HEAP8 = re = new Int8Array(e), n.HEAP16 = be = new Int16Array(e), n.HEAP32 = z = new Int32Array(e), n.HEAPU8 = X = new Uint8Array(e), n.HEAPU16 = tt = new Uint16Array(e), n.HEAPU32 = G = new Uint32Array(e), n.HEAPF32 = Lt = new Float32Array(e), n.HEAPF64 = jt = new Float64Array(e);
    }
    var Jt, er = [], tr = [], rr = [];
    function qr() {
      if (n.preRun)
        for (typeof n.preRun == "function" && (n.preRun = [n.preRun]); n.preRun.length; )
          bt(n.preRun.shift());
      gt(er);
    }
    function Gr() {
      !n.noFSInit && !o.init.initialized && o.init(), o.ignorePermissions = !1, gt(tr);
    }
    function st() {
      if (n.postRun)
        for (typeof n.postRun == "function" && (n.postRun = [n.postRun]); n.postRun.length; )
          Kr(n.postRun.shift());
      gt(rr);
    }
    function bt(e) {
      er.unshift(e);
    }
    function Xr(e) {
      tr.unshift(e);
    }
    function Kr(e) {
      rr.unshift(e);
    }
    var $e = 0, Ke = null;
    function Jn(e) {
      return e;
    }
    function Ve(e) {
      $e++, n.monitorRunDependencies && n.monitorRunDependencies($e);
    }
    function rt(e) {
      if ($e--, n.monitorRunDependencies && n.monitorRunDependencies($e), $e == 0 && Ke) {
        var t = Ke;
        Ke = null, t();
      }
    }
    function De(e) {
      n.onAbort && n.onAbort(e), e = "Aborted(" + e + ")", K(e), se = !0, e += ". Build with -sASSERTIONS for more info.";
      var t = new WebAssembly.RuntimeError(e);
      throw u(t), t;
    }
    var Tr = "data:application/octet-stream;base64,";
    function nr(e) {
      return e.startsWith(Tr);
    }
    var Oe;
    Oe = "videodec.wasm", nr(Oe) || (Oe = S(Oe));
    function $t(e) {
      if (e == Oe && j)
        return new Uint8Array(j);
      if (H)
        return H(e);
      throw "both async and sync fetching of the wasm failed";
    }
    function Qr(e) {
      return !j && ($ || y) && typeof fetch == "function" ? fetch(e, { credentials: "same-origin" }).then((t) => {
        if (!t.ok)
          throw "failed to load wasm binary file at '" + e + "'";
        return t.arrayBuffer();
      }).catch(() => $t(e)) : Promise.resolve().then(() => $t(e));
    }
    function Ht(e, t, r) {
      return Qr(e).then((i) => WebAssembly.instantiate(i, t)).then((i) => i).then(r, (i) => {
        K("failed to asynchronously prepare wasm: " + i), De(i);
      });
    }
    function Yr(e, t, r, i) {
      return !e && typeof WebAssembly.instantiateStreaming == "function" && !nr(t) && typeof fetch == "function" ? fetch(t, { credentials: "same-origin" }).then((a) => {
        var l = WebAssembly.instantiateStreaming(a, r);
        return l.then(i, function(f) {
          return K("wasm streaming compile failed: " + f), K("falling back to ArrayBuffer instantiation"), Ht(t, r, i);
        });
      }) : Ht(t, r, i);
    }
    function Zr() {
      var e = { a: gi };
      function t(i, a) {
        var l = i.exports;
        return Q = l, he = Q.E, Pr(), Jt = Q.H, Xr(Q.F), rt(), l;
      }
      Ve();
      function r(i) {
        t(i.instance);
      }
      if (n.instantiateWasm)
        try {
          return n.instantiateWasm(e, t);
        } catch (i) {
          K("Module.instantiateWasm callback failed with error: " + i), u(i);
        }
      return Yr(j, Oe, e, r).catch(u), {};
    }
    var x, Y, gt = (e) => {
      for (; e.length > 0; )
        e.shift()(n);
    };
    function Fe(e) {
      this.excPtr = e, this.ptr = e - 24, this.set_type = function(t) {
        G[this.ptr + 4 >> 2] = t;
      }, this.get_type = function() {
        return G[this.ptr + 4 >> 2];
      }, this.set_destructor = function(t) {
        G[this.ptr + 8 >> 2] = t;
      }, this.get_destructor = function() {
        return G[this.ptr + 8 >> 2];
      }, this.set_caught = function(t) {
        t = t ? 1 : 0, re[this.ptr + 12 >> 0] = t;
      }, this.get_caught = function() {
        return re[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(t) {
        t = t ? 1 : 0, re[this.ptr + 13 >> 0] = t;
      }, this.get_rethrown = function() {
        return re[this.ptr + 13 >> 0] != 0;
      }, this.init = function(t, r) {
        this.set_adjusted_ptr(0), this.set_type(t), this.set_destructor(r);
      }, this.set_adjusted_ptr = function(t) {
        G[this.ptr + 16 >> 2] = t;
      }, this.get_adjusted_ptr = function() {
        return G[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var t = jn(this.get_type());
        if (t)
          return G[this.excPtr >> 2];
        var r = this.get_adjusted_ptr();
        return r !== 0 ? r : this.excPtr;
      };
    }
    var nt = 0;
    function at(e, t, r) {
      var i = new Fe(e);
      throw i.init(t, r), nt = e, nt;
    }
    var zt = (e) => (z[In() >> 2] = e, e), N = { isAbs: (e) => e.charAt(0) === "/", splitPath: (e) => {
      var t = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
      return t.exec(e).slice(1);
    }, normalizeArray: (e, t) => {
      for (var r = 0, i = e.length - 1; i >= 0; i--) {
        var a = e[i];
        a === "." ? e.splice(i, 1) : a === ".." ? (e.splice(i, 1), r++) : r && (e.splice(i, 1), r--);
      }
      if (t)
        for (; r; r--)
          e.unshift("..");
      return e;
    }, normalize: (e) => {
      var t = N.isAbs(e), r = e.substr(-1) === "/";
      return e = N.normalizeArray(e.split("/").filter((i) => !!i), !t).join("/"), !e && !t && (e = "."), e && r && (e += "/"), (t ? "/" : "") + e;
    }, dirname: (e) => {
      var t = N.splitPath(e), r = t[0], i = t[1];
      return !r && !i ? "." : (i && (i = i.substr(0, i.length - 1)), r + i);
    }, basename: (e) => {
      if (e === "/")
        return "/";
      e = N.normalize(e), e = e.replace(/\/$/, "");
      var t = e.lastIndexOf("/");
      return t === -1 ? e : e.substr(t + 1);
    }, join: function() {
      var e = Array.prototype.slice.call(arguments);
      return N.normalize(e.join("/"));
    }, join2: (e, t) => N.normalize(e + "/" + t) }, ue = () => {
      if (typeof crypto == "object" && typeof crypto.getRandomValues == "function")
        return (e) => crypto.getRandomValues(e);
      De("initRandomDevice");
    }, Wt = (e) => (Wt = ue())(e), ge = { resolve: function() {
      for (var e = "", t = !1, r = arguments.length - 1; r >= -1 && !t; r--) {
        var i = r >= 0 ? arguments[r] : o.cwd();
        if (typeof i != "string")
          throw new TypeError("Arguments to path.resolve must be strings");
        if (!i)
          return "";
        e = i + "/" + e, t = N.isAbs(i);
      }
      return e = N.normalizeArray(e.split("/").filter((a) => !!a), !t).join("/"), (t ? "/" : "") + e || ".";
    }, relative: (e, t) => {
      e = ge.resolve(e).substr(1), t = ge.resolve(t).substr(1);
      function r(m) {
        for (var k = 0; k < m.length && m[k] === ""; k++)
          ;
        for (var D = m.length - 1; D >= 0 && m[D] === ""; D--)
          ;
        return k > D ? [] : m.slice(k, D - k + 1);
      }
      for (var i = r(e.split("/")), a = r(t.split("/")), l = Math.min(i.length, a.length), f = l, c = 0; c < l; c++)
        if (i[c] !== a[c]) {
          f = c;
          break;
        }
      for (var w = [], c = f; c < i.length; c++)
        w.push("..");
      return w = w.concat(a.slice(f)), w.join("/");
    } }, lt = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, Ie = (e, t, r) => {
      for (var i = t + r, a = t; e[a] && !(a >= i); )
        ++a;
      if (a - t > 16 && e.buffer && lt)
        return lt.decode(e.subarray(t, a));
      for (var l = ""; t < a; ) {
        var f = e[t++];
        if (!(f & 128)) {
          l += String.fromCharCode(f);
          continue;
        }
        var c = e[t++] & 63;
        if ((f & 224) == 192) {
          l += String.fromCharCode((f & 31) << 6 | c);
          continue;
        }
        var w = e[t++] & 63;
        if ((f & 240) == 224 ? f = (f & 15) << 12 | c << 6 | w : f = (f & 7) << 18 | c << 12 | w << 6 | e[t++] & 63, f < 65536)
          l += String.fromCharCode(f);
        else {
          var m = f - 65536;
          l += String.fromCharCode(55296 | m >> 10, 56320 | m & 1023);
        }
      }
      return l;
    }, Re = [], Pt = (e) => {
      for (var t = 0, r = 0; r < e.length; ++r) {
        var i = e.charCodeAt(r);
        i <= 127 ? t++ : i <= 2047 ? t += 2 : i >= 55296 && i <= 57343 ? (t += 4, ++r) : t += 3;
      }
      return t;
    }, Tt = (e, t, r, i) => {
      if (!(i > 0))
        return 0;
      for (var a = r, l = r + i - 1, f = 0; f < e.length; ++f) {
        var c = e.charCodeAt(f);
        if (c >= 55296 && c <= 57343) {
          var w = e.charCodeAt(++f);
          c = 65536 + ((c & 1023) << 10) | w & 1023;
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
    function Ct(e, t, r) {
      var i = r > 0 ? r : Pt(e) + 1, a = new Array(i), l = Tt(e, a, 0, a.length);
      return t && (a.length = l), a;
    }
    var ir = () => {
      if (!Re.length) {
        var e = null;
        if (typeof window < "u" && typeof window.prompt == "function" ? (e = window.prompt("Input: "), e !== null && (e += `
`)) : typeof readline == "function" && (e = readline(), e !== null && (e += `
`)), !e)
          return null;
        Re = Ct(e, !0);
      }
      return Re.shift();
    }, Te = { ttys: [], init: function() {
    }, shutdown: function() {
    }, register: function(e, t) {
      Te.ttys[e] = { input: [], output: [], ops: t }, o.registerDevice(e, Te.stream_ops);
    }, stream_ops: { open: function(e) {
      var t = Te.ttys[e.node.rdev];
      if (!t)
        throw new o.ErrnoError(43);
      e.tty = t, e.seekable = !1;
    }, close: function(e) {
      e.tty.ops.fsync(e.tty);
    }, fsync: function(e) {
      e.tty.ops.fsync(e.tty);
    }, read: function(e, t, r, i, a) {
      if (!e.tty || !e.tty.ops.get_char)
        throw new o.ErrnoError(60);
      for (var l = 0, f = 0; f < i; f++) {
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
        l++, t[r + f] = c;
      }
      return l && (e.node.timestamp = Date.now()), l;
    }, write: function(e, t, r, i, a) {
      if (!e.tty || !e.tty.ops.put_char)
        throw new o.ErrnoError(60);
      try {
        for (var l = 0; l < i; l++)
          e.tty.ops.put_char(e.tty, t[r + l]);
      } catch {
        throw new o.ErrnoError(29);
      }
      return i && (e.node.timestamp = Date.now()), l;
    } }, default_tty_ops: { get_char: function(e) {
      return ir();
    }, put_char: function(e, t) {
      t === null || t === 10 ? (q(Ie(e.output, 0)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync: function(e) {
      e.output && e.output.length > 0 && (q(Ie(e.output, 0)), e.output = []);
    }, ioctl_tcgets: function(e) {
      return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    }, ioctl_tcsets: function(e, t, r) {
      return 0;
    }, ioctl_tiocgwinsz: function(e) {
      return [24, 80];
    } }, default_tty1_ops: { put_char: function(e, t) {
      t === null || t === 10 ? (K(Ie(e.output, 0)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync: function(e) {
      e.output && e.output.length > 0 && (K(Ie(e.output, 0)), e.output = []);
    } } }, Vt = (e) => {
      De();
    }, L = { ops_table: null, mount(e) {
      return L.createNode(null, "/", 16895, 0);
    }, createNode(e, t, r, i) {
      if (o.isBlkdev(r) || o.isFIFO(r))
        throw new o.ErrnoError(63);
      L.ops_table || (L.ops_table = { dir: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr, lookup: L.node_ops.lookup, mknod: L.node_ops.mknod, rename: L.node_ops.rename, unlink: L.node_ops.unlink, rmdir: L.node_ops.rmdir, readdir: L.node_ops.readdir, symlink: L.node_ops.symlink }, stream: { llseek: L.stream_ops.llseek } }, file: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr }, stream: { llseek: L.stream_ops.llseek, read: L.stream_ops.read, write: L.stream_ops.write, allocate: L.stream_ops.allocate, mmap: L.stream_ops.mmap, msync: L.stream_ops.msync } }, link: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr, readlink: L.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr }, stream: o.chrdev_stream_ops } });
      var a = o.createNode(e, t, r, i);
      return o.isDir(a.mode) ? (a.node_ops = L.ops_table.dir.node, a.stream_ops = L.ops_table.dir.stream, a.contents = {}) : o.isFile(a.mode) ? (a.node_ops = L.ops_table.file.node, a.stream_ops = L.ops_table.file.stream, a.usedBytes = 0, a.contents = null) : o.isLink(a.mode) ? (a.node_ops = L.ops_table.link.node, a.stream_ops = L.ops_table.link.stream) : o.isChrdev(a.mode) && (a.node_ops = L.ops_table.chrdev.node, a.stream_ops = L.ops_table.chrdev.stream), a.timestamp = Date.now(), e && (e.contents[t] = a, e.timestamp = a.timestamp), a;
    }, getFileDataAsTypedArray(e) {
      return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
    }, expandFileStorage(e, t) {
      var r = e.contents ? e.contents.length : 0;
      if (!(r >= t)) {
        var i = 1024 * 1024;
        t = Math.max(t, r * (r < i ? 2 : 1.125) >>> 0), r != 0 && (t = Math.max(t, 256));
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
      t.mode !== void 0 && (e.mode = t.mode), t.timestamp !== void 0 && (e.timestamp = t.timestamp), t.size !== void 0 && L.resizeFileStorage(e, t.size);
    }, lookup(e, t) {
      throw o.genericErrors[44];
    }, mknod(e, t, r, i) {
      return L.createNode(e, t, r, i);
    }, rename(e, t, r) {
      if (o.isDir(e.mode)) {
        var i;
        try {
          i = o.lookupNode(t, r);
        } catch {
        }
        if (i)
          for (var a in i.contents)
            throw new o.ErrnoError(55);
      }
      delete e.parent.contents[e.name], e.parent.timestamp = Date.now(), e.name = r, t.contents[r] = e, t.timestamp = e.parent.timestamp, e.parent = t;
    }, unlink(e, t) {
      delete e.contents[t], e.timestamp = Date.now();
    }, rmdir(e, t) {
      var r = o.lookupNode(e, t);
      for (var i in r.contents)
        throw new o.ErrnoError(55);
      delete e.contents[t], e.timestamp = Date.now();
    }, readdir(e) {
      var t = [".", ".."];
      for (var r in e.contents)
        e.contents.hasOwnProperty(r) && t.push(r);
      return t;
    }, symlink(e, t, r) {
      var i = L.createNode(e, t, 41471, 0);
      return i.link = r, i;
    }, readlink(e) {
      if (!o.isLink(e.mode))
        throw new o.ErrnoError(28);
      return e.link;
    } }, stream_ops: { read(e, t, r, i, a) {
      var l = e.node.contents;
      if (a >= e.node.usedBytes)
        return 0;
      var f = Math.min(e.node.usedBytes - a, i);
      if (f > 8 && l.subarray)
        t.set(l.subarray(a, a + f), r);
      else
        for (var c = 0; c < f; c++)
          t[r + c] = l[a + c];
      return f;
    }, write(e, t, r, i, a, l) {
      if (!i)
        return 0;
      var f = e.node;
      if (f.timestamp = Date.now(), t.subarray && (!f.contents || f.contents.subarray)) {
        if (l)
          return f.contents = t.subarray(r, r + i), f.usedBytes = i, i;
        if (f.usedBytes === 0 && a === 0)
          return f.contents = t.slice(r, r + i), f.usedBytes = i, i;
        if (a + i <= f.usedBytes)
          return f.contents.set(t.subarray(r, r + i), a), i;
      }
      if (L.expandFileStorage(f, a + i), f.contents.subarray && t.subarray)
        f.contents.set(t.subarray(r, r + i), a);
      else
        for (var c = 0; c < i; c++)
          f.contents[a + c] = t[r + c];
      return f.usedBytes = Math.max(f.usedBytes, a + i), i;
    }, llseek(e, t, r) {
      var i = t;
      if (r === 1 ? i += e.position : r === 2 && o.isFile(e.node.mode) && (i += e.node.usedBytes), i < 0)
        throw new o.ErrnoError(28);
      return i;
    }, allocate(e, t, r) {
      L.expandFileStorage(e.node, t + r), e.node.usedBytes = Math.max(e.node.usedBytes, t + r);
    }, mmap(e, t, r, i, a) {
      if (!o.isFile(e.node.mode))
        throw new o.ErrnoError(43);
      var l, f, c = e.node.contents;
      if (!(a & 2) && c.buffer === re.buffer)
        f = !1, l = c.byteOffset;
      else {
        if ((r > 0 || r + t < c.length) && (c.subarray ? c = c.subarray(r, r + t) : c = Array.prototype.slice.call(c, r, r + t)), f = !0, l = Vt(), !l)
          throw new o.ErrnoError(48);
        re.set(c, l);
      }
      return { ptr: l, allocated: f };
    }, msync(e, t, r, i, a) {
      return L.stream_ops.write(e, t, 0, i, r, !1), 0;
    } } }, Cr = (e, t, r, i) => {
      var a = i ? "" : `al ${e}`;
      I(e, (l) => {
        We(l, `Loading data file "${e}" failed (no arrayBuffer).`), t(new Uint8Array(l)), a && rt();
      }, (l) => {
        if (r)
          r();
        else
          throw `Loading data file "${e}" failed.`;
      }), a && Ve();
    }, kr = n.preloadPlugins || [];
    function Sr(e, t, r, i) {
      typeof Browser < "u" && Browser.init();
      var a = !1;
      return kr.forEach(function(l) {
        a || l.canHandle(t) && (l.handle(e, t, r, i), a = !0);
      }), a;
    }
    function Jr(e, t, r, i, a, l, f, c, w, m) {
      var k = t ? ge.resolve(N.join2(e, t)) : e;
      function D(A) {
        function T(B) {
          m && m(), c || o.createDataFile(e, t, B, i, a, w), l && l(), rt();
        }
        Sr(A, k, T, () => {
          f && f(), rt();
        }) || T(A);
      }
      Ve(), typeof r == "string" ? Cr(r, (A) => D(A), f) : D(r);
    }
    function en(e) {
      var t = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }, r = t[e];
      if (typeof r > "u")
        throw new Error(`Unknown file open mode: ${e}`);
      return r;
    }
    function Qe(e, t) {
      var r = 0;
      return e && (r |= 365), t && (r |= 146), r;
    }
    var o = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: !1, ignorePermissions: !0, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, lookupPath: (e, t = {}) => {
      if (e = ge.resolve(e), !e)
        return { path: "", node: null };
      var r = { follow_mount: !0, recurse_count: 0 };
      if (t = Object.assign(r, t), t.recurse_count > 8)
        throw new o.ErrnoError(32);
      for (var i = e.split("/").filter((D) => !!D), a = o.root, l = "/", f = 0; f < i.length; f++) {
        var c = f === i.length - 1;
        if (c && t.parent)
          break;
        if (a = o.lookupNode(a, i[f]), l = N.join2(l, i[f]), o.isMountpoint(a) && (!c || c && t.follow_mount) && (a = a.mounted.root), !c || t.follow)
          for (var w = 0; o.isLink(a.mode); ) {
            var m = o.readlink(l);
            l = ge.resolve(N.dirname(l), m);
            var k = o.lookupPath(l, { recurse_count: t.recurse_count + 1 });
            if (a = k.node, w++ > 40)
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
      for (var r = 0, i = 0; i < t.length; i++)
        r = (r << 5) - r + t.charCodeAt(i) | 0;
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
      for (var i = o.hashName(e.id, t), a = o.nameTable[i]; a; a = a.name_next) {
        var l = a.name;
        if (a.parent.id === e.id && l === t)
          return a;
      }
      return o.lookup(e, t);
    }, createNode: (e, t, r, i) => {
      var a = new o.FSNode(e, t, r, i);
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
      var i;
      try {
        i = o.lookupNode(e, t);
      } catch (l) {
        return l.errno;
      }
      var a = o.nodePermissions(e, "wx");
      if (a)
        return a;
      if (r) {
        if (!o.isDir(i.mode))
          return 54;
        if (o.isRoot(i) || o.getPath(i) === o.cwd())
          return 10;
      } else if (o.isDir(i.mode))
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
        var i = r.pop();
        t.push(i), r.push.apply(r, i.mounts);
      }
      return t;
    }, syncfs: (e, t) => {
      typeof e == "function" && (t = e, e = !1), o.syncFSRequests++, o.syncFSRequests > 1 && K(`warning: ${o.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
      var r = o.getMounts(o.root.mount), i = 0;
      function a(f) {
        return o.syncFSRequests--, t(f);
      }
      function l(f) {
        if (f)
          return l.errored ? void 0 : (l.errored = !0, a(f));
        ++i >= r.length && a(null);
      }
      r.forEach((f) => {
        if (!f.type.syncfs)
          return l(null);
        f.type.syncfs(f, e, l);
      });
    }, mount: (e, t, r) => {
      var i = r === "/", a = !r, l;
      if (i && o.root)
        throw new o.ErrnoError(10);
      if (!i && !a) {
        var f = o.lookupPath(r, { follow_mount: !1 });
        if (r = f.path, l = f.node, o.isMountpoint(l))
          throw new o.ErrnoError(10);
        if (!o.isDir(l.mode))
          throw new o.ErrnoError(54);
      }
      var c = { type: e, opts: t, mountpoint: r, mounts: [] }, w = e.mount(c);
      return w.mount = c, c.root = w, i ? o.root = w : l && (l.mounted = c, l.mount && l.mount.mounts.push(c)), w;
    }, unmount: (e) => {
      var t = o.lookupPath(e, { follow_mount: !1 });
      if (!o.isMountpoint(t.node))
        throw new o.ErrnoError(28);
      var r = t.node, i = r.mounted, a = o.getMounts(i);
      Object.keys(o.nameTable).forEach((f) => {
        for (var c = o.nameTable[f]; c; ) {
          var w = c.name_next;
          a.includes(c.mount) && o.destroyNode(c), c = w;
        }
      }), r.mounted = null;
      var l = r.mount.mounts.indexOf(i);
      r.mount.mounts.splice(l, 1);
    }, lookup: (e, t) => e.node_ops.lookup(e, t), mknod: (e, t, r) => {
      var i = o.lookupPath(e, { parent: !0 }), a = i.node, l = N.basename(e);
      if (!l || l === "." || l === "..")
        throw new o.ErrnoError(28);
      var f = o.mayCreate(a, l);
      if (f)
        throw new o.ErrnoError(f);
      if (!a.node_ops.mknod)
        throw new o.ErrnoError(63);
      return a.node_ops.mknod(a, l, t, r);
    }, create: (e, t) => (t = t !== void 0 ? t : 438, t &= 4095, t |= 32768, o.mknod(e, t, 0)), mkdir: (e, t) => (t = t !== void 0 ? t : 511, t &= 1023, t |= 16384, o.mknod(e, t, 0)), mkdirTree: (e, t) => {
      for (var r = e.split("/"), i = "", a = 0; a < r.length; ++a)
        if (r[a]) {
          i += "/" + r[a];
          try {
            o.mkdir(i, t);
          } catch (l) {
            if (l.errno != 20)
              throw l;
          }
        }
    }, mkdev: (e, t, r) => (typeof r > "u" && (r = t, t = 438), t |= 8192, o.mknod(e, t, r)), symlink: (e, t) => {
      if (!ge.resolve(e))
        throw new o.ErrnoError(44);
      var r = o.lookupPath(t, { parent: !0 }), i = r.node;
      if (!i)
        throw new o.ErrnoError(44);
      var a = N.basename(t), l = o.mayCreate(i, a);
      if (l)
        throw new o.ErrnoError(l);
      if (!i.node_ops.symlink)
        throw new o.ErrnoError(63);
      return i.node_ops.symlink(i, a, e);
    }, rename: (e, t) => {
      var r = N.dirname(e), i = N.dirname(t), a = N.basename(e), l = N.basename(t), f, c, w;
      if (f = o.lookupPath(e, { parent: !0 }), c = f.node, f = o.lookupPath(t, { parent: !0 }), w = f.node, !c || !w)
        throw new o.ErrnoError(44);
      if (c.mount !== w.mount)
        throw new o.ErrnoError(75);
      var m = o.lookupNode(c, a), k = ge.relative(e, i);
      if (k.charAt(0) !== ".")
        throw new o.ErrnoError(28);
      if (k = ge.relative(t, r), k.charAt(0) !== ".")
        throw new o.ErrnoError(55);
      var D;
      try {
        D = o.lookupNode(w, l);
      } catch {
      }
      if (m !== D) {
        var A = o.isDir(m.mode), T = o.mayDelete(c, a, A);
        if (T)
          throw new o.ErrnoError(T);
        if (T = D ? o.mayDelete(w, l, A) : o.mayCreate(w, l), T)
          throw new o.ErrnoError(T);
        if (!c.node_ops.rename)
          throw new o.ErrnoError(63);
        if (o.isMountpoint(m) || D && o.isMountpoint(D))
          throw new o.ErrnoError(10);
        if (w !== c && (T = o.nodePermissions(c, "w"), T))
          throw new o.ErrnoError(T);
        o.hashRemoveNode(m);
        try {
          c.node_ops.rename(m, w, l);
        } catch (B) {
          throw B;
        } finally {
          o.hashAddNode(m);
        }
      }
    }, rmdir: (e) => {
      var t = o.lookupPath(e, { parent: !0 }), r = t.node, i = N.basename(e), a = o.lookupNode(r, i), l = o.mayDelete(r, i, !0);
      if (l)
        throw new o.ErrnoError(l);
      if (!r.node_ops.rmdir)
        throw new o.ErrnoError(63);
      if (o.isMountpoint(a))
        throw new o.ErrnoError(10);
      r.node_ops.rmdir(r, i), o.destroyNode(a);
    }, readdir: (e) => {
      var t = o.lookupPath(e, { follow: !0 }), r = t.node;
      if (!r.node_ops.readdir)
        throw new o.ErrnoError(54);
      return r.node_ops.readdir(r);
    }, unlink: (e) => {
      var t = o.lookupPath(e, { parent: !0 }), r = t.node;
      if (!r)
        throw new o.ErrnoError(44);
      var i = N.basename(e), a = o.lookupNode(r, i), l = o.mayDelete(r, i, !1);
      if (l)
        throw new o.ErrnoError(l);
      if (!r.node_ops.unlink)
        throw new o.ErrnoError(63);
      if (o.isMountpoint(a))
        throw new o.ErrnoError(10);
      r.node_ops.unlink(r, i), o.destroyNode(a);
    }, readlink: (e) => {
      var t = o.lookupPath(e), r = t.node;
      if (!r)
        throw new o.ErrnoError(44);
      if (!r.node_ops.readlink)
        throw new o.ErrnoError(28);
      return ge.resolve(o.getPath(r.parent), r.node_ops.readlink(r));
    }, stat: (e, t) => {
      var r = o.lookupPath(e, { follow: !t }), i = r.node;
      if (!i)
        throw new o.ErrnoError(44);
      if (!i.node_ops.getattr)
        throw new o.ErrnoError(63);
      return i.node_ops.getattr(i);
    }, lstat: (e) => o.stat(e, !0), chmod: (e, t, r) => {
      var i;
      if (typeof e == "string") {
        var a = o.lookupPath(e, { follow: !r });
        i = a.node;
      } else
        i = e;
      if (!i.node_ops.setattr)
        throw new o.ErrnoError(63);
      i.node_ops.setattr(i, { mode: t & 4095 | i.mode & -4096, timestamp: Date.now() });
    }, lchmod: (e, t) => {
      o.chmod(e, t, !0);
    }, fchmod: (e, t) => {
      var r = o.getStreamChecked(e);
      o.chmod(r.node, t);
    }, chown: (e, t, r, i) => {
      var a;
      if (typeof e == "string") {
        var l = o.lookupPath(e, { follow: !i });
        a = l.node;
      } else
        a = e;
      if (!a.node_ops.setattr)
        throw new o.ErrnoError(63);
      a.node_ops.setattr(a, { timestamp: Date.now() });
    }, lchown: (e, t, r) => {
      o.chown(e, t, r, !0);
    }, fchown: (e, t, r) => {
      var i = o.getStreamChecked(e);
      o.chown(i.node, t, r);
    }, truncate: (e, t) => {
      if (t < 0)
        throw new o.ErrnoError(28);
      var r;
      if (typeof e == "string") {
        var i = o.lookupPath(e, { follow: !0 });
        r = i.node;
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
      var i = o.lookupPath(e, { follow: !0 }), a = i.node;
      a.node_ops.setattr(a, { timestamp: Math.max(t, r) });
    }, open: (e, t, r) => {
      if (e === "")
        throw new o.ErrnoError(44);
      t = typeof t == "string" ? en(t) : t, r = typeof r > "u" ? 438 : r, t & 64 ? r = r & 4095 | 32768 : r = 0;
      var i;
      if (typeof e == "object")
        i = e;
      else {
        e = N.normalize(e);
        try {
          var a = o.lookupPath(e, { follow: !(t & 131072) });
          i = a.node;
        } catch {
        }
      }
      var l = !1;
      if (t & 64)
        if (i) {
          if (t & 128)
            throw new o.ErrnoError(20);
        } else
          i = o.mknod(e, r, 0), l = !0;
      if (!i)
        throw new o.ErrnoError(44);
      if (o.isChrdev(i.mode) && (t &= -513), t & 65536 && !o.isDir(i.mode))
        throw new o.ErrnoError(54);
      if (!l) {
        var f = o.mayOpen(i, t);
        if (f)
          throw new o.ErrnoError(f);
      }
      t & 512 && !l && o.truncate(i, 0), t &= -131713;
      var c = o.createStream({ node: i, path: o.getPath(i), flags: t, seekable: !0, position: 0, stream_ops: i.stream_ops, ungotten: [], error: !1 });
      return c.stream_ops.open && c.stream_ops.open(c), n.logReadFiles && !(t & 1) && (o.readFiles || (o.readFiles = {}), e in o.readFiles || (o.readFiles[e] = 1)), c;
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
    }, read: (e, t, r, i, a) => {
      if (i < 0 || a < 0)
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
      var f = e.stream_ops.read(e, t, r, i, a);
      return l || (e.position += f), f;
    }, write: (e, t, r, i, a, l) => {
      if (i < 0 || a < 0)
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
      var f = typeof a < "u";
      if (!f)
        a = e.position;
      else if (!e.seekable)
        throw new o.ErrnoError(70);
      var c = e.stream_ops.write(e, t, r, i, a, l);
      return f || (e.position += c), c;
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
    }, mmap: (e, t, r, i, a) => {
      if (i & 2 && !(a & 2) && (e.flags & 2097155) !== 2)
        throw new o.ErrnoError(2);
      if ((e.flags & 2097155) === 1)
        throw new o.ErrnoError(2);
      if (!e.stream_ops.mmap)
        throw new o.ErrnoError(43);
      return e.stream_ops.mmap(e, t, r, i, a);
    }, msync: (e, t, r, i, a) => e.stream_ops.msync ? e.stream_ops.msync(e, t, r, i, a) : 0, munmap: (e) => 0, ioctl: (e, t, r) => {
      if (!e.stream_ops.ioctl)
        throw new o.ErrnoError(59);
      return e.stream_ops.ioctl(e, t, r);
    }, readFile: (e, t = {}) => {
      if (t.flags = t.flags || 0, t.encoding = t.encoding || "binary", t.encoding !== "utf8" && t.encoding !== "binary")
        throw new Error(`Invalid encoding type "${t.encoding}"`);
      var r, i = o.open(e, t.flags), a = o.stat(e), l = a.size, f = new Uint8Array(l);
      return o.read(i, f, 0, l, 0), t.encoding === "utf8" ? r = Ie(f, 0) : t.encoding === "binary" && (r = f), o.close(i), r;
    }, writeFile: (e, t, r = {}) => {
      r.flags = r.flags || 577;
      var i = o.open(e, r.flags, r.mode);
      if (typeof t == "string") {
        var a = new Uint8Array(Pt(t) + 1), l = Tt(t, a, 0, a.length);
        o.write(i, a, 0, l, void 0, r.canOwn);
      } else if (ArrayBuffer.isView(t))
        o.write(i, t, 0, t.byteLength, void 0, r.canOwn);
      else
        throw new Error("Unsupported data type");
      o.close(i);
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
      o.mkdir("/dev"), o.registerDevice(o.makedev(1, 3), { read: () => 0, write: (i, a, l, f, c) => f }), o.mkdev("/dev/null", o.makedev(1, 3)), Te.register(o.makedev(5, 0), Te.default_tty_ops), Te.register(o.makedev(6, 0), Te.default_tty1_ops), o.mkdev("/dev/tty", o.makedev(5, 0)), o.mkdev("/dev/tty1", o.makedev(6, 0));
      var e = new Uint8Array(1024), t = 0, r = () => (t === 0 && (t = Wt(e).byteLength), e[--t]);
      o.createDevice("/dev", "random", r), o.createDevice("/dev", "urandom", r), o.mkdir("/dev/shm"), o.mkdir("/dev/shm/tmp");
    }, createSpecialDirectories: () => {
      o.mkdir("/proc");
      var e = o.mkdir("/proc/self");
      o.mkdir("/proc/self/fd"), o.mount({ mount: () => {
        var t = o.createNode(e, "fd", 16895, 73);
        return t.node_ops = { lookup: (r, i) => {
          var a = +i, l = o.getStreamChecked(a), f = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => l.path } };
          return f.parent = f, f;
        } }, t;
      } }, {}, "/proc/self/fd");
    }, createStandardStreams: () => {
      n.stdin ? o.createDevice("/dev", "stdin", n.stdin) : o.symlink("/dev/tty", "/dev/stdin"), n.stdout ? o.createDevice("/dev", "stdout", null, n.stdout) : o.symlink("/dev/tty", "/dev/stdout"), n.stderr ? o.createDevice("/dev", "stderr", null, n.stderr) : o.symlink("/dev/tty1", "/dev/stderr"), o.open("/dev/stdin", 0), o.open("/dev/stdout", 1), o.open("/dev/stderr", 1);
    }, ensureErrnoError: () => {
      o.ErrnoError || (o.ErrnoError = function(t, r) {
        this.name = "ErrnoError", this.node = r, this.setErrno = function(i) {
          this.errno = i;
        }, this.setErrno(t), this.message = "FS error";
      }, o.ErrnoError.prototype = new Error(), o.ErrnoError.prototype.constructor = o.ErrnoError, [44].forEach((e) => {
        o.genericErrors[e] = new o.ErrnoError(e), o.genericErrors[e].stack = "<generic error, no stack>";
      }));
    }, staticInit: () => {
      o.ensureErrnoError(), o.nameTable = new Array(4096), o.mount(L, {}, "/"), o.createDefaultDirectories(), o.createDefaultDevices(), o.createSpecialDirectories(), o.filesystems = { MEMFS: L };
    }, init: (e, t, r) => {
      o.init.initialized = !0, o.ensureErrnoError(), n.stdin = e || n.stdin, n.stdout = t || n.stdout, n.stderr = r || n.stderr, o.createStandardStreams();
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
      var i = { isRoot: !1, exists: !1, error: 0, name: null, path: null, object: null, parentExists: !1, parentPath: null, parentObject: null };
      try {
        var r = o.lookupPath(e, { parent: !0 });
        i.parentExists = !0, i.parentPath = r.path, i.parentObject = r.node, i.name = N.basename(e), r = o.lookupPath(e, { follow: !t }), i.exists = !0, i.path = r.path, i.object = r.node, i.name = r.node.name, i.isRoot = r.path === "/";
      } catch (a) {
        i.error = a.errno;
      }
      return i;
    }, createPath: (e, t, r, i) => {
      e = typeof e == "string" ? e : o.getPath(e);
      for (var a = t.split("/").reverse(); a.length; ) {
        var l = a.pop();
        if (l) {
          var f = N.join2(e, l);
          try {
            o.mkdir(f);
          } catch {
          }
          e = f;
        }
      }
      return f;
    }, createFile: (e, t, r, i, a) => {
      var l = N.join2(typeof e == "string" ? e : o.getPath(e), t), f = Qe(i, a);
      return o.create(l, f);
    }, createDataFile: (e, t, r, i, a, l) => {
      var f = t;
      e && (e = typeof e == "string" ? e : o.getPath(e), f = t ? N.join2(e, t) : e);
      var c = Qe(i, a), w = o.create(f, c);
      if (r) {
        if (typeof r == "string") {
          for (var m = new Array(r.length), k = 0, D = r.length; k < D; ++k)
            m[k] = r.charCodeAt(k);
          r = m;
        }
        o.chmod(w, c | 146);
        var A = o.open(w, 577);
        o.write(A, r, 0, r.length, 0, l), o.close(A), o.chmod(w, c);
      }
      return w;
    }, createDevice: (e, t, r, i) => {
      var a = N.join2(typeof e == "string" ? e : o.getPath(e), t), l = Qe(!!r, !!i);
      o.createDevice.major || (o.createDevice.major = 64);
      var f = o.makedev(o.createDevice.major++, 0);
      return o.registerDevice(f, { open: (c) => {
        c.seekable = !1;
      }, close: (c) => {
        i && i.buffer && i.buffer.length && i(10);
      }, read: (c, w, m, k, D) => {
        for (var A = 0, T = 0; T < k; T++) {
          var B;
          try {
            B = r();
          } catch {
            throw new o.ErrnoError(29);
          }
          if (B === void 0 && A === 0)
            throw new o.ErrnoError(6);
          if (B == null)
            break;
          A++, w[m + T] = B;
        }
        return A && (c.node.timestamp = Date.now()), A;
      }, write: (c, w, m, k, D) => {
        for (var A = 0; A < k; A++)
          try {
            i(w[m + A]);
          } catch {
            throw new o.ErrnoError(29);
          }
        return k && (c.node.timestamp = Date.now()), A;
      } }), o.mkdev(a, l, f);
    }, forceLoadFile: (e) => {
      if (e.isDevice || e.isFolder || e.link || e.contents)
        return !0;
      if (typeof XMLHttpRequest < "u")
        throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
      if (C)
        try {
          e.contents = Ct(C(e.url), !0), e.usedBytes = e.contents.length;
        } catch {
          throw new o.ErrnoError(29);
        }
      else
        throw new Error("Cannot load without read() or XMLHttpRequest.");
    }, createLazyFile: (e, t, r, i, a) => {
      function l() {
        this.lengthKnown = !1, this.chunks = [];
      }
      if (l.prototype.get = function(T) {
        if (!(T > this.length - 1 || T < 0)) {
          var B = T % this.chunkSize, Z = T / this.chunkSize | 0;
          return this.getter(Z)[B];
        }
      }, l.prototype.setDataGetter = function(T) {
        this.getter = T;
      }, l.prototype.cacheLength = function() {
        var T = new XMLHttpRequest();
        if (T.open("HEAD", r, !1), T.send(null), !(T.status >= 200 && T.status < 300 || T.status === 304))
          throw new Error("Couldn't load " + r + ". Status: " + T.status);
        var B = Number(T.getResponseHeader("Content-length")), Z, J = (Z = T.getResponseHeader("Accept-Ranges")) && Z === "bytes", ie = (Z = T.getResponseHeader("Content-Encoding")) && Z === "gzip", fe = 1024 * 1024;
        J || (fe = B);
        var ee = (pe, ke) => {
          if (pe > ke)
            throw new Error("invalid range (" + pe + ", " + ke + ") or no bytes requested!");
          if (ke > B - 1)
            throw new Error("only " + B + " bytes available! programmer error!");
          var oe = new XMLHttpRequest();
          if (oe.open("GET", r, !1), B !== fe && oe.setRequestHeader("Range", "bytes=" + pe + "-" + ke), oe.responseType = "arraybuffer", oe.overrideMimeType && oe.overrideMimeType("text/plain; charset=x-user-defined"), oe.send(null), !(oe.status >= 200 && oe.status < 300 || oe.status === 304))
            throw new Error("Couldn't load " + r + ". Status: " + oe.status);
          return oe.response !== void 0 ? new Uint8Array(oe.response || []) : Ct(oe.responseText || "", !0);
        }, ze = this;
        ze.setDataGetter((pe) => {
          var ke = pe * fe, oe = (pe + 1) * fe - 1;
          if (oe = Math.min(oe, B - 1), typeof ze.chunks[pe] > "u" && (ze.chunks[pe] = ee(ke, oe)), typeof ze.chunks[pe] > "u")
            throw new Error("doXHR failed!");
          return ze.chunks[pe];
        }), (ie || !B) && (fe = B = 1, B = this.getter(0).length, fe = B, q("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = B, this._chunkSize = fe, this.lengthKnown = !0;
      }, typeof XMLHttpRequest < "u") {
        if (!y)
          throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
        var f = new l();
        Object.defineProperties(f, { length: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._length;
        } }, chunkSize: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._chunkSize;
        } } });
        var c = { isDevice: !1, contents: f };
      } else
        var c = { isDevice: !1, url: r };
      var w = o.createFile(e, t, c, i, a);
      c.contents ? w.contents = c.contents : c.url && (w.contents = null, w.url = c.url), Object.defineProperties(w, { usedBytes: { get: function() {
        return this.contents.length;
      } } });
      var m = {}, k = Object.keys(w.stream_ops);
      k.forEach((A) => {
        var T = w.stream_ops[A];
        m[A] = function() {
          return o.forceLoadFile(w), T.apply(null, arguments);
        };
      });
      function D(A, T, B, Z, J) {
        var ie = A.node.contents;
        if (J >= ie.length)
          return 0;
        var fe = Math.min(ie.length - J, Z);
        if (ie.slice)
          for (var ee = 0; ee < fe; ee++)
            T[B + ee] = ie[J + ee];
        else
          for (var ee = 0; ee < fe; ee++)
            T[B + ee] = ie.get(J + ee);
        return fe;
      }
      return m.read = (A, T, B, Z, J) => (o.forceLoadFile(w), D(A, T, B, Z, J)), m.mmap = (A, T, B, Z, J) => {
        o.forceLoadFile(w);
        var ie = Vt();
        if (!ie)
          throw new o.ErrnoError(48);
        return D(A, re, ie, T, B), { ptr: ie, allocated: !0 };
      }, w.stream_ops = m, w;
    } }, ut = (e, t) => e ? Ie(X, e, t) : "", ae = { DEFAULT_POLLMASK: 5, calculateAt: function(e, t, r) {
      if (N.isAbs(t))
        return t;
      var i;
      if (e === -100)
        i = o.cwd();
      else {
        var a = ae.getStreamFromFD(e);
        i = a.path;
      }
      if (t.length == 0) {
        if (!r)
          throw new o.ErrnoError(44);
        return i;
      }
      return N.join2(i, t);
    }, doStat: function(e, t, r) {
      try {
        var i = e(t);
      } catch (c) {
        if (c && c.node && N.normalize(t) !== N.normalize(o.getPath(c.node)))
          return -54;
        throw c;
      }
      z[r >> 2] = i.dev, z[r + 4 >> 2] = i.mode, G[r + 8 >> 2] = i.nlink, z[r + 12 >> 2] = i.uid, z[r + 16 >> 2] = i.gid, z[r + 20 >> 2] = i.rdev, Y = [i.size >>> 0, (x = i.size, +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[r + 24 >> 2] = Y[0], z[r + 28 >> 2] = Y[1], z[r + 32 >> 2] = 4096, z[r + 36 >> 2] = i.blocks;
      var a = i.atime.getTime(), l = i.mtime.getTime(), f = i.ctime.getTime();
      return Y = [Math.floor(a / 1e3) >>> 0, (x = Math.floor(a / 1e3), +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[r + 40 >> 2] = Y[0], z[r + 44 >> 2] = Y[1], G[r + 48 >> 2] = a % 1e3 * 1e3, Y = [Math.floor(l / 1e3) >>> 0, (x = Math.floor(l / 1e3), +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[r + 56 >> 2] = Y[0], z[r + 60 >> 2] = Y[1], G[r + 64 >> 2] = l % 1e3 * 1e3, Y = [Math.floor(f / 1e3) >>> 0, (x = Math.floor(f / 1e3), +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[r + 72 >> 2] = Y[0], z[r + 76 >> 2] = Y[1], G[r + 80 >> 2] = f % 1e3 * 1e3, Y = [i.ino >>> 0, (x = i.ino, +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[r + 88 >> 2] = Y[0], z[r + 92 >> 2] = Y[1], 0;
    }, doMsync: function(e, t, r, i, a) {
      if (!o.isFile(t.node.mode))
        throw new o.ErrnoError(43);
      if (i & 2)
        return 0;
      var l = X.slice(e, e + r);
      o.msync(t, l, a, r, i);
    }, varargs: void 0, get() {
      ae.varargs += 4;
      var e = z[ae.varargs - 4 >> 2];
      return e;
    }, getStr(e) {
      var t = ut(e);
      return t;
    }, getStreamFromFD: function(e) {
      var t = o.getStreamChecked(e);
      return t;
    } };
    function tn(e, t, r) {
      ae.varargs = r;
      try {
        var i = ae.getStreamFromFD(e);
        switch (t) {
          case 0: {
            var a = ae.get();
            if (a < 0)
              return -28;
            var l;
            return l = o.createStream(i, a), l.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return i.flags;
          case 4: {
            var a = ae.get();
            return i.flags |= a, 0;
          }
          case 5: {
            var a = ae.get(), f = 0;
            return be[a + f >> 1] = 2, 0;
          }
          case 6:
          case 7:
            return 0;
          case 16:
          case 8:
            return -28;
          case 9:
            return zt(28), -1;
          default:
            return -28;
        }
      } catch (c) {
        if (typeof o > "u" || c.name !== "ErrnoError")
          throw c;
        return -c.errno;
      }
    }
    function kt(e, t, r, i) {
      ae.varargs = i;
      try {
        t = ae.getStr(t), t = ae.calculateAt(e, t);
        var a = i ? ae.get() : 0;
        return o.open(t, r, a).fd;
      } catch (l) {
        if (typeof o > "u" || l.name !== "ErrnoError")
          throw l;
        return -l.errno;
      }
    }
    function rn(e, t, r, i, a) {
    }
    function St(e) {
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
    function Nt() {
      for (var e = new Array(256), t = 0; t < 256; ++t)
        e[t] = String.fromCharCode(t);
      or = e;
    }
    var or = void 0;
    function ce(e) {
      for (var t = "", r = e; X[r]; )
        t += or[X[r++]];
      return t;
    }
    var Le = {}, xe = {}, ct = {}, je = void 0;
    function W(e) {
      throw new je(e);
    }
    var Ne = void 0;
    function dt(e) {
      throw new Ne(e);
    }
    function Ye(e, t, r) {
      e.forEach(function(c) {
        ct[c] = t;
      });
      function i(c) {
        var w = r(c);
        w.length !== e.length && dt("Mismatched type converter count");
        for (var m = 0; m < e.length; ++m)
          ye(e[m], w[m]);
      }
      var a = new Array(t.length), l = [], f = 0;
      t.forEach((c, w) => {
        xe.hasOwnProperty(c) ? a[w] = xe[c] : (l.push(c), Le.hasOwnProperty(c) || (Le[c] = []), Le[c].push(() => {
          a[w] = xe[c], ++f, f === l.length && i(a);
        }));
      }), l.length === 0 && i(a);
    }
    function qt(e, t, r = {}) {
      var i = t.name;
      if (e || W(`type "${i}" must have a positive integer typeid pointer`), xe.hasOwnProperty(e)) {
        if (r.ignoreDuplicateRegistrations)
          return;
        W(`Cannot register type '${i}' twice`);
      }
      if (xe[e] = t, delete ct[e], Le.hasOwnProperty(e)) {
        var a = Le[e];
        delete Le[e], a.forEach((l) => l());
      }
    }
    function ye(e, t, r = {}) {
      if (!("argPackAdvance" in t))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      return qt(e, t, r);
    }
    function Ar(e, t, r, i, a) {
      var l = St(r);
      t = ce(t), ye(e, { name: t, fromWireType: function(f) {
        return !!f;
      }, toWireType: function(f, c) {
        return c ? i : a;
      }, argPackAdvance: 8, readValueFromPointer: function(f) {
        var c;
        if (r === 1)
          c = re;
        else if (r === 2)
          c = be;
        else if (r === 4)
          c = z;
        else
          throw new TypeError("Unknown boolean type size: " + t);
        return this.fromWireType(c[f >> l]);
      }, destructorFunction: null });
    }
    function nn(e) {
      if (!(this instanceof Pe) || !(e instanceof Pe))
        return !1;
      for (var t = this.$$.ptrType.registeredClass, r = this.$$.ptr, i = e.$$.ptrType.registeredClass, a = e.$$.ptr; t.baseClass; )
        r = t.upcast(r), t = t.baseClass;
      for (; i.baseClass; )
        a = i.upcast(a), i = i.baseClass;
      return t === i && r === a;
    }
    function on(e) {
      return { count: e.count, deleteScheduled: e.deleteScheduled, preservePointerOnDelete: e.preservePointerOnDelete, ptr: e.ptr, ptrType: e.ptrType, smartPtr: e.smartPtr, smartPtrType: e.smartPtrType };
    }
    function ft(e) {
      function t(r) {
        return r.$$.ptrType.registeredClass.name;
      }
      W(t(e) + " instance already deleted");
    }
    var At = !1;
    function sr(e) {
    }
    function sn(e) {
      e.smartPtr ? e.smartPtrType.rawDestructor(e.smartPtr) : e.ptrType.registeredClass.rawDestructor(e.ptr);
    }
    function yt(e) {
      e.count.value -= 1;
      var t = e.count.value === 0;
      t && sn(e);
    }
    function ar(e, t, r) {
      if (t === r)
        return e;
      if (r.baseClass === void 0)
        return null;
      var i = ar(e, t, r.baseClass);
      return i === null ? null : r.downcast(i);
    }
    var lr = {};
    function an() {
      return Object.keys(Je).length;
    }
    function ln() {
      var e = [];
      for (var t in Je)
        Je.hasOwnProperty(t) && e.push(Je[t]);
      return e;
    }
    var we = [];
    function Dt() {
      for (; we.length; ) {
        var e = we.pop();
        e.$$.deleteScheduled = !1, e.delete();
      }
    }
    var Ze = void 0;
    function Gt(e) {
      Ze = e, we.length && Ze && Ze(Dt);
    }
    function Dr() {
      n.getInheritedInstanceCount = an, n.getLiveInheritedInstances = ln, n.flushPendingDeletes = Dt, n.setDelayFunction = Gt;
    }
    var Je = {};
    function un(e, t) {
      for (t === void 0 && W("ptr should not be undefined"); e.baseClass; )
        t = e.upcast(t), e = e.baseClass;
      return t;
    }
    function wt(e, t) {
      return t = un(e, t), Je[t];
    }
    function ht(e, t) {
      (!t.ptrType || !t.ptr) && dt("makeClassHandle requires ptr and ptrType");
      var r = !!t.smartPtrType, i = !!t.smartPtr;
      return r !== i && dt("Both smartPtrType and smartPtr must be specified"), t.count = { value: 1 }, qe(Object.create(e, { $$: { value: t } }));
    }
    function Fr(e) {
      var t = this.getPointee(e);
      if (!t)
        return this.destructor(e), null;
      var r = wt(this.registeredClass, t);
      if (r !== void 0) {
        if (r.$$.count.value === 0)
          return r.$$.ptr = t, r.$$.smartPtr = e, r.clone();
        var i = r.clone();
        return this.destructor(e), i;
      }
      function a() {
        return this.isSmartPointer ? ht(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: t, smartPtrType: this, smartPtr: e }) : ht(this.registeredClass.instancePrototype, { ptrType: this, ptr: e });
      }
      var l = this.registeredClass.getActualType(t), f = lr[l];
      if (!f)
        return a.call(this);
      var c;
      this.isConst ? c = f.constPointerType : c = f.pointerType;
      var w = ar(t, this.registeredClass, c.registeredClass);
      return w === null ? a.call(this) : this.isSmartPointer ? ht(c.registeredClass.instancePrototype, { ptrType: c, ptr: w, smartPtrType: this, smartPtr: e }) : ht(c.registeredClass.instancePrototype, { ptrType: c, ptr: w });
    }
    var qe = function(e) {
      return typeof FinalizationRegistry > "u" ? (qe = (t) => t, e) : (At = new FinalizationRegistry((t) => {
        yt(t.$$);
      }), qe = (t) => {
        var r = t.$$, i = !!r.smartPtr;
        if (i) {
          var a = { $$: r };
          At.register(t, a, t);
        }
        return t;
      }, sr = (t) => At.unregister(t), qe(e));
    };
    function ur() {
      if (this.$$.ptr || ft(this), this.$$.preservePointerOnDelete)
        return this.$$.count.value += 1, this;
      var e = qe(Object.create(Object.getPrototypeOf(this), { $$: { value: on(this.$$) } }));
      return e.$$.count.value += 1, e.$$.deleteScheduled = !1, e;
    }
    function cn() {
      this.$$.ptr || ft(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && W("Object already scheduled for deletion"), sr(this), yt(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
    }
    function Rr() {
      return !this.$$.ptr;
    }
    function dn() {
      return this.$$.ptr || ft(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && W("Object already scheduled for deletion"), we.push(this), we.length === 1 && Ze && Ze(Dt), this.$$.deleteScheduled = !0, this;
    }
    function xr() {
      Pe.prototype.isAliasOf = nn, Pe.prototype.clone = ur, Pe.prototype.delete = cn, Pe.prototype.isDeleted = Rr, Pe.prototype.deleteLater = dn;
    }
    function Pe() {
    }
    var fn = 48, hn = 57;
    function pt(e) {
      if (e === void 0)
        return "_unknown";
      e = e.replace(/[^a-zA-Z0-9_]/g, "$");
      var t = e.charCodeAt(0);
      return t >= fn && t <= hn ? `_${e}` : e;
    }
    function _t(e, t) {
      return e = pt(e), { [e]: function() {
        return t.apply(this, arguments);
      } }[e];
    }
    function Ue(e, t, r) {
      if (e[t].overloadTable === void 0) {
        var i = e[t];
        e[t] = function() {
          return e[t].overloadTable.hasOwnProperty(arguments.length) || W(`Function '${r}' called with an invalid number of arguments (${arguments.length}) - expects one of (${e[t].overloadTable})!`), e[t].overloadTable[arguments.length].apply(this, arguments);
        }, e[t].overloadTable = [], e[t].overloadTable[i.argCount] = i;
      }
    }
    function Ur(e, t, r) {
      n.hasOwnProperty(e) ? ((r === void 0 || n[e].overloadTable !== void 0 && n[e].overloadTable[r] !== void 0) && W(`Cannot register public name '${e}' twice`), Ue(n, e, e), n.hasOwnProperty(r) && W(`Cannot register multiple overloads of a function with the same number of arguments (${r})!`), n[e].overloadTable[r] = t) : (n[e] = t, r !== void 0 && (n[e].numArguments = r));
    }
    function pn(e, t, r, i, a, l, f, c) {
      this.name = e, this.constructor = t, this.instancePrototype = r, this.rawDestructor = i, this.baseClass = a, this.getActualType = l, this.upcast = f, this.downcast = c, this.pureVirtualFunctions = [];
    }
    function Ft(e, t, r) {
      for (; t !== r; )
        t.upcast || W(`Expected null or instance of ${r.name}, got an instance of ${t.name}`), e = t.upcast(e), t = t.baseClass;
      return e;
    }
    function Xt(e, t) {
      if (t === null)
        return this.isReference && W(`null is not a valid ${this.name}`), 0;
      t.$$ || W(`Cannot pass "${xt(t)}" as a ${this.name}`), t.$$.ptr || W(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var r = t.$$.ptrType.registeredClass, i = Ft(t.$$.ptr, r, this.registeredClass);
      return i;
    }
    function vn(e, t) {
      var r;
      if (t === null)
        return this.isReference && W(`null is not a valid ${this.name}`), this.isSmartPointer ? (r = this.rawConstructor(), e !== null && e.push(this.rawDestructor, r), r) : 0;
      t.$$ || W(`Cannot pass "${xt(t)}" as a ${this.name}`), t.$$.ptr || W(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && t.$$.ptrType.isConst && W(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
      var i = t.$$.ptrType.registeredClass;
      if (r = Ft(t.$$.ptr, i, this.registeredClass), this.isSmartPointer)
        switch (t.$$.smartPtr === void 0 && W("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            t.$$.smartPtrType === this ? r = t.$$.smartPtr : W(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            r = t.$$.smartPtr;
            break;
          case 2:
            if (t.$$.smartPtrType === this)
              r = t.$$.smartPtr;
            else {
              var a = t.clone();
              r = this.rawShare(r, mt.toHandle(function() {
                a.delete();
              })), e !== null && e.push(this.rawDestructor, r);
            }
            break;
          default:
            W("Unsupporting sharing policy");
        }
      return r;
    }
    function cr(e, t) {
      if (t === null)
        return this.isReference && W(`null is not a valid ${this.name}`), 0;
      t.$$ || W(`Cannot pass "${xt(t)}" as a ${this.name}`), t.$$.ptr || W(`Cannot pass deleted object as a pointer of type ${this.name}`), t.$$.ptrType.isConst && W(`Cannot convert argument of type ${t.$$.ptrType.name} to parameter type ${this.name}`);
      var r = t.$$.ptrType.registeredClass, i = Ft(t.$$.ptr, r, this.registeredClass);
      return i;
    }
    function vt(e) {
      return this.fromWireType(z[e >> 2]);
    }
    function mn(e) {
      return this.rawGetPointee && (e = this.rawGetPointee(e)), e;
    }
    function gn(e) {
      this.rawDestructor && this.rawDestructor(e);
    }
    function yn(e) {
      e !== null && e.delete();
    }
    function wn() {
      _e.prototype.getPointee = mn, _e.prototype.destructor = gn, _e.prototype.argPackAdvance = 8, _e.prototype.readValueFromPointer = vt, _e.prototype.deleteObject = yn, _e.prototype.fromWireType = Fr;
    }
    function _e(e, t, r, i, a, l, f, c, w, m, k) {
      this.name = e, this.registeredClass = t, this.isReference = r, this.isConst = i, this.isSmartPointer = a, this.pointeeType = l, this.sharingPolicy = f, this.rawGetPointee = c, this.rawConstructor = w, this.rawShare = m, this.rawDestructor = k, !a && t.baseClass === void 0 ? i ? (this.toWireType = Xt, this.destructorFunction = null) : (this.toWireType = cr, this.destructorFunction = null) : this.toWireType = vn;
    }
    function _n(e, t, r) {
      n.hasOwnProperty(e) || dt("Replacing nonexistant public symbol"), n[e].overloadTable !== void 0 && r !== void 0 ? n[e].overloadTable[r] = t : (n[e] = t, n[e].argCount = r);
    }
    var En = (e, t, r) => {
      var i = n["dynCall_" + e];
      return r && r.length ? i.apply(null, [t].concat(r)) : i.call(null, t);
    }, it = [], Kt = (e) => {
      var t = it[e];
      return t || (e >= it.length && (it.length = e + 1), it[e] = t = Jt.get(e)), t;
    }, bn = (e, t, r) => {
      if (e.includes("j"))
        return En(e, t, r);
      var i = Kt(t).apply(null, r);
      return i;
    }, $n = (e, t) => {
      var r = [];
      return function() {
        return r.length = 0, Object.assign(r, arguments), bn(e, t, r);
      };
    };
    function Be(e, t) {
      e = ce(e);
      function r() {
        return e.includes("j") ? $n(e, t) : Kt(t);
      }
      var i = r();
      return typeof i != "function" && W(`unknown function pointer with signature ${e}: ${t}`), i;
    }
    function Pn(e, t) {
      var r = _t(t, function(i) {
        this.name = t, this.message = i;
        var a = new Error(i).stack;
        a !== void 0 && (this.stack = this.toString() + `
` + a.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return r.prototype = Object.create(e.prototype), r.prototype.constructor = r, r.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, r;
    }
    var dr = void 0;
    function fr(e) {
      var t = Ln(e), r = ce(t);
      return Ce(t), r;
    }
    function Rt(e, t) {
      var r = [], i = {};
      function a(l) {
        if (!i[l] && !xe[l]) {
          if (ct[l]) {
            ct[l].forEach(a);
            return;
          }
          r.push(l), i[l] = !0;
        }
      }
      throw t.forEach(a), new dr(`${e}: ` + r.map(fr).join([", "]));
    }
    function Tn(e, t, r, i, a, l, f, c, w, m, k, D, A) {
      k = ce(k), l = Be(a, l), c && (c = Be(f, c)), m && (m = Be(w, m)), A = Be(D, A);
      var T = pt(k);
      Ur(T, function() {
        Rt(`Cannot construct ${k} due to unbound types`, [i]);
      }), Ye([e, t, r], i ? [i] : [], function(B) {
        B = B[0];
        var Z, J;
        i ? (Z = B.registeredClass, J = Z.instancePrototype) : J = Pe.prototype;
        var ie = _t(T, function() {
          if (Object.getPrototypeOf(this) !== fe)
            throw new je("Use 'new' to construct " + k);
          if (ee.constructor_body === void 0)
            throw new je(k + " has no accessible constructor");
          var oe = ee.constructor_body[arguments.length];
          if (oe === void 0)
            throw new je(`Tried to invoke ctor of ${k} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(ee.constructor_body).toString()}) parameters instead!`);
          return oe.apply(this, arguments);
        }), fe = Object.create(J, { constructor: { value: ie } });
        ie.prototype = fe;
        var ee = new pn(k, ie, fe, A, Z, l, c, m);
        ee.baseClass && (ee.baseClass.__derivedClasses === void 0 && (ee.baseClass.__derivedClasses = []), ee.baseClass.__derivedClasses.push(ee));
        var ze = new _e(k, ee, !0, !1, !1), pe = new _e(k + "*", ee, !1, !1, !1), ke = new _e(k + " const*", ee, !1, !0, !1);
        return lr[e] = { pointerType: pe, constPointerType: ke }, _n(T, ie), [ze, pe, ke];
      });
    }
    function hr(e, t) {
      for (var r = [], i = 0; i < e; i++)
        r.push(G[t + i * 4 >> 2]);
      return r;
    }
    function Cn(e) {
      for (; e.length; ) {
        var t = e.pop(), r = e.pop();
        r(t);
      }
    }
    function pr(e, t) {
      if (!(e instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof e} which is not a function`);
      var r = _t(e.name || "unknownFunctionName", function() {
      });
      r.prototype = e.prototype;
      var i = new r(), a = e.apply(i, t);
      return a instanceof Object ? a : i;
    }
    function vr(e, t, r, i, a, l) {
      var f = t.length;
      f < 2 && W("argTypes array size mismatch! Must at least get return value and 'this' types!");
      for (var c = t[1] !== null && r !== null, w = !1, m = 1; m < t.length; ++m)
        if (t[m] !== null && t[m].destructorFunction === void 0) {
          w = !0;
          break;
        }
      for (var k = t[0].name !== "void", D = "", A = "", m = 0; m < f - 2; ++m)
        D += (m !== 0 ? ", " : "") + "arg" + m, A += (m !== 0 ? ", " : "") + "arg" + m + "Wired";
      var T = `
        return function ${pt(e)}(${D}) {
        if (arguments.length !== ${f - 2}) {
          throwBindingError('function ${e} called with ${arguments.length} arguments, expected ${f - 2} args!');
        }`;
      w && (T += `var destructors = [];
`);
      var B = w ? "destructors" : "null", Z = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"], J = [W, i, a, Cn, t[0], t[1]];
      c && (T += "var thisWired = classParam.toWireType(" + B + `, this);
`);
      for (var m = 0; m < f - 2; ++m)
        T += "var arg" + m + "Wired = argType" + m + ".toWireType(" + B + ", arg" + m + "); // " + t[m + 2].name + `
`, Z.push("argType" + m), J.push(t[m + 2]);
      if (c && (A = "thisWired" + (A.length > 0 ? ", " : "") + A), T += (k || l ? "var rv = " : "") + "invoker(fn" + (A.length > 0 ? ", " : "") + A + `);
`, w)
        T += `runDestructors(destructors);
`;
      else
        for (var m = c ? 1 : 2; m < t.length; ++m) {
          var ie = m === 1 ? "thisWired" : "arg" + (m - 2) + "Wired";
          t[m].destructorFunction !== null && (T += ie + "_dtor(" + ie + "); // " + t[m].name + `
`, Z.push(ie + "_dtor"), J.push(t[m].destructorFunction));
        }
      return k && (T += `var ret = retType.fromWireType(rv);
return ret;
`), T += `}
`, Z.push(T), pr(Function, Z).apply(null, J);
    }
    function kn(e, t, r, i, a, l) {
      var f = hr(t, r);
      a = Be(i, a), Ye([], [e], function(c) {
        c = c[0];
        var w = `constructor ${c.name}`;
        if (c.registeredClass.constructor_body === void 0 && (c.registeredClass.constructor_body = []), c.registeredClass.constructor_body[t - 1] !== void 0)
          throw new je(`Cannot register multiple constructors with identical number of parameters (${t - 1}) for class '${c.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return c.registeredClass.constructor_body[t - 1] = () => {
          Rt(`Cannot construct ${c.name} due to unbound types`, f);
        }, Ye([], f, function(m) {
          return m.splice(1, 0, null), c.registeredClass.constructor_body[t - 1] = vr(w, m, null, a, l), [];
        }), [];
      });
    }
    function mr(e, t, r, i, a, l, f, c, w) {
      var m = hr(r, i);
      t = ce(t), l = Be(a, l), Ye([], [e], function(k) {
        k = k[0];
        var D = `${k.name}.${t}`;
        t.startsWith("@@") && (t = Symbol[t.substring(2)]), c && k.registeredClass.pureVirtualFunctions.push(t);
        function A() {
          Rt(`Cannot call ${D} due to unbound types`, m);
        }
        var T = k.registeredClass.instancePrototype, B = T[t];
        return B === void 0 || B.overloadTable === void 0 && B.className !== k.name && B.argCount === r - 2 ? (A.argCount = r - 2, A.className = k.name, T[t] = A) : (Ue(T, t, D), T[t].overloadTable[r - 2] = A), Ye([], m, function(Z) {
          var J = vr(D, Z, k, l, f, w);
          return T[t].overloadTable === void 0 ? (J.argCount = r - 2, T[t] = J) : T[t].overloadTable[r - 2] = J, [];
        }), [];
      });
    }
    function Sn() {
      Object.assign(gr.prototype, { get(e) {
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
    function gr() {
      this.allocated = [void 0], this.freelist = [];
    }
    var me = new gr();
    function yr(e) {
      e >= me.reserved && --me.get(e).refcount === 0 && me.free(e);
    }
    function Br() {
      for (var e = 0, t = me.reserved; t < me.allocated.length; ++t)
        me.allocated[t] !== void 0 && ++e;
      return e;
    }
    function An() {
      me.allocated.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 }), me.reserved = me.allocated.length, n.count_emval_handles = Br;
    }
    var mt = { toValue: (e) => (e || W("Cannot use deleted val. handle = " + e), me.get(e).value), toHandle: (e) => {
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
          return me.allocate({ refcount: 1, value: e });
      }
    } };
    function Mr(e, t) {
      t = ce(t), ye(e, { name: t, fromWireType: function(r) {
        var i = mt.toValue(r);
        return yr(r), i;
      }, toWireType: function(r, i) {
        return mt.toHandle(i);
      }, argPackAdvance: 8, readValueFromPointer: vt, destructorFunction: null });
    }
    function xt(e) {
      if (e === null)
        return "null";
      var t = typeof e;
      return t === "object" || t === "array" || t === "function" ? e.toString() : "" + e;
    }
    function Dn(e, t) {
      switch (t) {
        case 2:
          return function(r) {
            return this.fromWireType(Lt[r >> 2]);
          };
        case 3:
          return function(r) {
            return this.fromWireType(jt[r >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + e);
      }
    }
    function Fn(e, t, r) {
      var i = St(r);
      t = ce(t), ye(e, { name: t, fromWireType: function(a) {
        return a;
      }, toWireType: function(a, l) {
        return l;
      }, argPackAdvance: 8, readValueFromPointer: Dn(t, i), destructorFunction: null });
    }
    function Rn(e, t, r) {
      switch (t) {
        case 0:
          return r ? function(a) {
            return re[a];
          } : function(a) {
            return X[a];
          };
        case 1:
          return r ? function(a) {
            return be[a >> 1];
          } : function(a) {
            return tt[a >> 1];
          };
        case 2:
          return r ? function(a) {
            return z[a >> 2];
          } : function(a) {
            return G[a >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + e);
      }
    }
    function xn(e, t, r, i, a) {
      t = ce(t);
      var l = St(r), f = (D) => D;
      if (i === 0) {
        var c = 32 - 8 * r;
        f = (D) => D << c >>> c;
      }
      var w = t.includes("unsigned"), m = (D, A) => {
      }, k;
      w ? k = function(D, A) {
        return m(A, this.name), A >>> 0;
      } : k = function(D, A) {
        return m(A, this.name), A;
      }, ye(e, { name: t, fromWireType: f, toWireType: k, argPackAdvance: 8, readValueFromPointer: Rn(t, l, i !== 0), destructorFunction: null });
    }
    function Un(e, t, r) {
      var i = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], a = i[t];
      function l(f) {
        f = f >> 2;
        var c = G, w = c[f], m = c[f + 1];
        return new a(c.buffer, m, w);
      }
      r = ce(r), ye(e, { name: r, fromWireType: l, argPackAdvance: 8, readValueFromPointer: l }, { ignoreDuplicateRegistrations: !0 });
    }
    var Bn = (e, t, r) => Tt(e, X, t, r);
    function et(e, t) {
      t = ce(t);
      var r = t === "std::string";
      ye(e, { name: t, fromWireType: function(i) {
        var a = G[i >> 2], l = i + 4, f;
        if (r)
          for (var c = l, w = 0; w <= a; ++w) {
            var m = l + w;
            if (w == a || X[m] == 0) {
              var k = m - c, D = ut(c, k);
              f === void 0 ? f = D : (f += String.fromCharCode(0), f += D), c = m + 1;
            }
          }
        else {
          for (var A = new Array(a), w = 0; w < a; ++w)
            A[w] = String.fromCharCode(X[l + w]);
          f = A.join("");
        }
        return Ce(i), f;
      }, toWireType: function(i, a) {
        a instanceof ArrayBuffer && (a = new Uint8Array(a));
        var l, f = typeof a == "string";
        f || a instanceof Uint8Array || a instanceof Uint8ClampedArray || a instanceof Int8Array || W("Cannot pass non-string to std::string"), r && f ? l = Pt(a) : l = a.length;
        var c = _r(4 + l + 1), w = c + 4;
        if (G[c >> 2] = l, r && f)
          Bn(a, w, l + 1);
        else if (f)
          for (var m = 0; m < l; ++m) {
            var k = a.charCodeAt(m);
            k > 255 && (Ce(w), W("String has UTF-16 code units that do not fit in 8 bits")), X[w + m] = k;
          }
        else
          for (var m = 0; m < l; ++m)
            X[w + m] = a[m];
        return i !== null && i.push(Ce, c), c;
      }, argPackAdvance: 8, readValueFromPointer: vt, destructorFunction: function(i) {
        Ce(i);
      } });
    }
    var Ut = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, Or = (e, t) => {
      for (var r = e, i = r >> 1, a = i + t / 2; !(i >= a) && tt[i]; )
        ++i;
      if (r = i << 1, r - e > 32 && Ut)
        return Ut.decode(X.subarray(e, r));
      for (var l = "", f = 0; !(f >= t / 2); ++f) {
        var c = be[e + f * 2 >> 1];
        if (c == 0)
          break;
        l += String.fromCharCode(c);
      }
      return l;
    }, Ir = (e, t, r) => {
      if (r === void 0 && (r = 2147483647), r < 2)
        return 0;
      r -= 2;
      for (var i = t, a = r < e.length * 2 ? r / 2 : e.length, l = 0; l < a; ++l) {
        var f = e.charCodeAt(l);
        be[t >> 1] = f, t += 2;
      }
      return be[t >> 1] = 0, t - i;
    }, Qt = (e) => e.length * 2, Lr = (e, t) => {
      for (var r = 0, i = ""; !(r >= t / 4); ) {
        var a = z[e + r * 4 >> 2];
        if (a == 0)
          break;
        if (++r, a >= 65536) {
          var l = a - 65536;
          i += String.fromCharCode(55296 | l >> 10, 56320 | l & 1023);
        } else
          i += String.fromCharCode(a);
      }
      return i;
    }, h = (e, t, r) => {
      if (r === void 0 && (r = 2147483647), r < 4)
        return 0;
      for (var i = t, a = i + r - 4, l = 0; l < e.length; ++l) {
        var f = e.charCodeAt(l);
        if (f >= 55296 && f <= 57343) {
          var c = e.charCodeAt(++l);
          f = 65536 + ((f & 1023) << 10) | c & 1023;
        }
        if (z[t >> 2] = f, t += 4, t + 4 > a)
          break;
      }
      return z[t >> 2] = 0, t - i;
    }, p = (e) => {
      for (var t = 0, r = 0; r < e.length; ++r) {
        var i = e.charCodeAt(r);
        i >= 55296 && i <= 57343 && ++r, t += 4;
      }
      return t;
    }, v = function(e, t, r) {
      r = ce(r);
      var i, a, l, f, c;
      t === 2 ? (i = Or, a = Ir, f = Qt, l = () => tt, c = 1) : t === 4 && (i = Lr, a = h, f = p, l = () => G, c = 2), ye(e, { name: r, fromWireType: function(w) {
        for (var m = G[w >> 2], k = l(), D, A = w + 4, T = 0; T <= m; ++T) {
          var B = w + 4 + T * t;
          if (T == m || k[B >> c] == 0) {
            var Z = B - A, J = i(A, Z);
            D === void 0 ? D = J : (D += String.fromCharCode(0), D += J), A = B + t;
          }
        }
        return Ce(w), D;
      }, toWireType: function(w, m) {
        typeof m != "string" && W(`Cannot pass non-string to C++ string type ${r}`);
        var k = f(m), D = _r(4 + k + t);
        return G[D >> 2] = k >> c, a(m, D + 4, k + t), w !== null && w.push(Ce, D), D;
      }, argPackAdvance: 8, readValueFromPointer: vt, destructorFunction: function(w) {
        Ce(w);
      } });
    };
    function b(e, t) {
      t = ce(t), ye(e, { isVoid: !0, name: t, argPackAdvance: 0, fromWireType: function() {
      }, toWireType: function(r, i) {
      } });
    }
    var F = {};
    function U(e) {
      var t = F[e];
      return t === void 0 ? ce(e) : t;
    }
    var M = [];
    function R(e, t, r, i) {
      e = M[e], t = mt.toValue(t), r = U(r), e(t, r, null, i);
    }
    function V(e) {
      var t = M.length;
      return M.push(e), t;
    }
    function O(e, t) {
      var r = xe[e];
      return r === void 0 && W(t + " has unknown type " + fr(e)), r;
    }
    function te(e, t) {
      for (var r = new Array(e), i = 0; i < e; ++i)
        r[i] = O(G[t + i * 4 >> 2], "parameter " + i);
      return r;
    }
    var ne = [];
    function le(e, t) {
      var r = te(e, t), i = r[0], a = i.name + "_$" + r.slice(1).map(function(B) {
        return B.name;
      }).join("_") + "$", l = ne[a];
      if (l !== void 0)
        return l;
      for (var f = ["retType"], c = [i], w = "", m = 0; m < e - 1; ++m)
        w += (m !== 0 ? ", " : "") + "arg" + m, f.push("argType" + m), c.push(r[1 + m]);
      for (var k = pt("methodCaller_" + a), D = "return function " + k + `(handle, name, destructors, args) {
`, A = 0, m = 0; m < e - 1; ++m)
        D += "    var arg" + m + " = argType" + m + ".readValueFromPointer(args" + (A ? "+" + A : "") + `);
`, A += r[m + 1].argPackAdvance;
      D += "    var rv = handle[name](" + w + `);
`;
      for (var m = 0; m < e - 1; ++m)
        r[m + 1].deleteObject && (D += "    argType" + m + ".deleteObject(arg" + m + `);
`);
      i.isVoid || (D += `    return retType.toWireType(destructors, rv);
`), D += `};
`, f.push(D);
      var T = pr(Function, f).apply(null, c);
      return l = V(T), ne[a] = l, l;
    }
    function de(e, t) {
      return t + 2097152 >>> 0 < 4194305 - !!e ? (e >>> 0) + t * 4294967296 : NaN;
    }
    var Ee = () => {
      De("");
    };
    function Me() {
      return Date.now();
    }
    var Se = () => X.length, ot = () => Se(), wr = (e, t, r) => X.copyWithin(e, t, t + r), He = (e) => {
      De("OOM");
    }, Mn = (e) => {
      X.length, He();
    }, Et = {}, jr = () => E || "./this.program", Ge = () => {
      if (!Ge.strings) {
        var e = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", t = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: e, _: jr() };
        for (var r in Et)
          Et[r] === void 0 ? delete t[r] : t[r] = Et[r];
        var i = [];
        for (var r in t)
          i.push(`${r}=${t[r]}`);
        Ge.strings = i;
      }
      return Ge.strings;
    }, ai = (e, t) => {
      for (var r = 0; r < e.length; ++r)
        re[t++ >> 0] = e.charCodeAt(r);
      re[t >> 0] = 0;
    }, li = (e, t) => {
      var r = 0;
      return Ge().forEach(function(i, a) {
        var l = t + r;
        G[e + a * 4 >> 2] = l, ai(i, l), r += i.length + 1;
      }), 0;
    }, ui = (e, t) => {
      var r = Ge();
      G[e >> 2] = r.length;
      var i = 0;
      return r.forEach(function(a) {
        i += a.length + 1;
      }), G[t >> 2] = i, 0;
    };
    function ci(e) {
      try {
        var t = ae.getStreamFromFD(e);
        return o.close(t), 0;
      } catch (r) {
        if (typeof o > "u" || r.name !== "ErrnoError")
          throw r;
        return r.errno;
      }
    }
    function di(e, t) {
      try {
        var r = 0, i = 0, a = 0, l = ae.getStreamFromFD(e), f = l.tty ? 2 : o.isDir(l.mode) ? 3 : o.isLink(l.mode) ? 7 : 4;
        return re[t >> 0] = f, be[t + 2 >> 1] = a, Y = [r >>> 0, (x = r, +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[t + 8 >> 2] = Y[0], z[t + 12 >> 2] = Y[1], Y = [i >>> 0, (x = i, +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[t + 16 >> 2] = Y[0], z[t + 20 >> 2] = Y[1], 0;
      } catch (c) {
        if (typeof o > "u" || c.name !== "ErrnoError")
          throw c;
        return c.errno;
      }
    }
    var fi = (e, t, r, i) => {
      for (var a = 0, l = 0; l < r; l++) {
        var f = G[t >> 2], c = G[t + 4 >> 2];
        t += 8;
        var w = o.read(e, re, f, c, i);
        if (w < 0)
          return -1;
        if (a += w, w < c)
          break;
        typeof i < "u" && (i += w);
      }
      return a;
    };
    function hi(e, t, r, i) {
      try {
        var a = ae.getStreamFromFD(e), l = fi(a, t, r);
        return G[i >> 2] = l, 0;
      } catch (f) {
        if (typeof o > "u" || f.name !== "ErrnoError")
          throw f;
        return f.errno;
      }
    }
    function pi(e, t, r, i, a) {
      var l = de(t, r);
      try {
        if (isNaN(l))
          return 61;
        var f = ae.getStreamFromFD(e);
        return o.llseek(f, l, i), Y = [f.position >>> 0, (x = f.position, +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[a >> 2] = Y[0], z[a + 4 >> 2] = Y[1], f.getdents && l === 0 && i === 0 && (f.getdents = null), 0;
      } catch (c) {
        if (typeof o > "u" || c.name !== "ErrnoError")
          throw c;
        return c.errno;
      }
    }
    var vi = (e, t, r, i) => {
      for (var a = 0, l = 0; l < r; l++) {
        var f = G[t >> 2], c = G[t + 4 >> 2];
        t += 8;
        var w = o.write(e, re, f, c, i);
        if (w < 0)
          return -1;
        a += w, typeof i < "u" && (i += w);
      }
      return a;
    };
    function mi(e, t, r, i) {
      try {
        var a = ae.getStreamFromFD(e), l = vi(a, t, r);
        return G[i >> 2] = l, 0;
      } catch (f) {
        if (typeof o > "u" || f.name !== "ErrnoError")
          throw f;
        return f.errno;
      }
    }
    var On = function(e, t, r, i) {
      e || (e = this), this.parent = e, this.mount = e.mount, this.mounted = null, this.id = o.nextInode++, this.name = t, this.mode = r, this.node_ops = {}, this.stream_ops = {}, this.rdev = i;
    }, Bt = 365, Mt = 146;
    Object.defineProperties(On.prototype, { read: { get: function() {
      return (this.mode & Bt) === Bt;
    }, set: function(e) {
      e ? this.mode |= Bt : this.mode &= ~Bt;
    } }, write: { get: function() {
      return (this.mode & Mt) === Mt;
    }, set: function(e) {
      e ? this.mode |= Mt : this.mode &= ~Mt;
    } }, isFolder: { get: function() {
      return o.isDir(this.mode);
    } }, isDevice: { get: function() {
      return o.isChrdev(this.mode);
    } } }), o.FSNode = On, o.createPreloadedFile = Jr, o.staticInit(), Nt(), je = n.BindingError = class extends Error {
      constructor(t) {
        super(t), this.name = "BindingError";
      }
    }, Ne = n.InternalError = class extends Error {
      constructor(t) {
        super(t), this.name = "InternalError";
      }
    }, xr(), Dr(), wn(), dr = n.UnboundTypeError = Pn(Error, "UnboundTypeError"), Sn(), An();
    var gi = { p: at, C: tn, w: kt, t: rn, n: Ar, r: Tn, q: kn, d: mr, D: Mr, k: Fn, c: xn, b: Un, j: et, f: v, o: b, g: R, m: yr, l: le, a: Ee, e: Me, v: ot, A: wr, u: Mn, y: li, z: ui, i: ci, x: di, B: hi, s: pi, h: mi };
    Zr();
    var _r = (e) => (_r = Q.G)(e), Ce = (e) => (Ce = Q.I)(e), In = () => (In = Q.J)(), Ln = (e) => (Ln = Q.K)(e);
    n.__embind_initialize_bindings = () => (n.__embind_initialize_bindings = Q.L)();
    var jn = (e) => (jn = Q.M)(e);
    n.dynCall_jiji = (e, t, r, i, a) => (n.dynCall_jiji = Q.N)(e, t, r, i, a), n._ff_h264_cabac_tables = 67061;
    var Ot;
    Ke = function e() {
      Ot || Hn(), Ot || (Ke = e);
    };
    function Hn() {
      if ($e > 0 || (qr(), $e > 0))
        return;
      function e() {
        Ot || (Ot = !0, n.calledRun = !0, !se && (Gr(), d(n), n.onRuntimeInitialized && n.onRuntimeInitialized(), st()));
      }
      n.setStatus ? (n.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          n.setStatus("");
        }, 1), e();
      }, 1)) : e();
    }
    if (n.preInit)
      for (typeof n.preInit == "function" && (n.preInit = [n.preInit]); n.preInit.length > 0; )
        n.preInit.pop()();
    return Hn(), s.ready;
  };
})();
class Po extends Yn {
  constructor(s) {
    super($o, s?.wasmPath ? fetch(s?.wasmPath).then((n) => n.arrayBuffer()) : void 0, s?.workerMode, s?.canvas, s?.yuvMode);
  }
}
var To = (() => {
  var P = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
  return function(s = {}) {
    var n = s, d, u;
    n.ready = new Promise((e, t) => {
      d = e, u = t;
    });
    var _ = Object.assign({}, n), E = "./this.program", $ = typeof window == "object", y = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && process.versions.node;
    var g = "";
    function S(e) {
      return n.locateFile ? n.locateFile(e, g) : g + e;
    }
    var C, I, H;
    ($ || y) && (y ? g = self.location.href : typeof document < "u" && document.currentScript && (g = document.currentScript.src), P && (g = P), g.indexOf("blob:") !== 0 ? g = g.substr(0, g.replace(/[?#].*/, "").lastIndexOf("/") + 1) : g = "", C = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.send(null), t.responseText;
    }, y && (H = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
    }), I = (e, t, r) => {
      var i = new XMLHttpRequest();
      i.open("GET", e, !0), i.responseType = "arraybuffer", i.onload = () => {
        if (i.status == 200 || i.status == 0 && i.response) {
          t(i.response);
          return;
        }
        r();
      }, i.onerror = r, i.send(null);
    });
    var q = n.print || console.log.bind(console), K = n.printErr || console.error.bind(console);
    Object.assign(n, _), _ = null, n.arguments && n.arguments, n.thisProgram && (E = n.thisProgram), n.quit && n.quit;
    var j;
    n.wasmBinary && (j = n.wasmBinary), n.noExitRuntime, typeof WebAssembly != "object" && De("no native wasm support detected");
    var he, Q, se = !1;
    function We(e, t) {
      e || De(t);
    }
    var re, X, be, tt, z, G, Lt, jt;
    function Pr() {
      var e = he.buffer;
      n.HEAP8 = re = new Int8Array(e), n.HEAP16 = be = new Int16Array(e), n.HEAP32 = z = new Int32Array(e), n.HEAPU8 = X = new Uint8Array(e), n.HEAPU16 = tt = new Uint16Array(e), n.HEAPU32 = G = new Uint32Array(e), n.HEAPF32 = Lt = new Float32Array(e), n.HEAPF64 = jt = new Float64Array(e);
    }
    var Jt, er = [], tr = [], rr = [];
    function qr() {
      if (n.preRun)
        for (typeof n.preRun == "function" && (n.preRun = [n.preRun]); n.preRun.length; )
          bt(n.preRun.shift());
      gt(er);
    }
    function Gr() {
      !n.noFSInit && !o.init.initialized && o.init(), o.ignorePermissions = !1, gt(tr);
    }
    function st() {
      if (n.postRun)
        for (typeof n.postRun == "function" && (n.postRun = [n.postRun]); n.postRun.length; )
          Kr(n.postRun.shift());
      gt(rr);
    }
    function bt(e) {
      er.unshift(e);
    }
    function Xr(e) {
      tr.unshift(e);
    }
    function Kr(e) {
      rr.unshift(e);
    }
    var $e = 0, Ke = null;
    function Jn(e) {
      return e;
    }
    function Ve(e) {
      $e++, n.monitorRunDependencies && n.monitorRunDependencies($e);
    }
    function rt(e) {
      if ($e--, n.monitorRunDependencies && n.monitorRunDependencies($e), $e == 0 && Ke) {
        var t = Ke;
        Ke = null, t();
      }
    }
    function De(e) {
      n.onAbort && n.onAbort(e), e = "Aborted(" + e + ")", K(e), se = !0, e += ". Build with -sASSERTIONS for more info.";
      var t = new WebAssembly.RuntimeError(e);
      throw u(t), t;
    }
    var Tr = "data:application/octet-stream;base64,";
    function nr(e) {
      return e.startsWith(Tr);
    }
    var Oe;
    Oe = "audiodec.wasm", nr(Oe) || (Oe = S(Oe));
    function $t(e) {
      if (e == Oe && j)
        return new Uint8Array(j);
      if (H)
        return H(e);
      throw "both async and sync fetching of the wasm failed";
    }
    function Qr(e) {
      return !j && ($ || y) && typeof fetch == "function" ? fetch(e, { credentials: "same-origin" }).then((t) => {
        if (!t.ok)
          throw "failed to load wasm binary file at '" + e + "'";
        return t.arrayBuffer();
      }).catch(() => $t(e)) : Promise.resolve().then(() => $t(e));
    }
    function Ht(e, t, r) {
      return Qr(e).then((i) => WebAssembly.instantiate(i, t)).then((i) => i).then(r, (i) => {
        K("failed to asynchronously prepare wasm: " + i), De(i);
      });
    }
    function Yr(e, t, r, i) {
      return !e && typeof WebAssembly.instantiateStreaming == "function" && !nr(t) && typeof fetch == "function" ? fetch(t, { credentials: "same-origin" }).then((a) => {
        var l = WebAssembly.instantiateStreaming(a, r);
        return l.then(i, function(f) {
          return K("wasm streaming compile failed: " + f), K("falling back to ArrayBuffer instantiation"), Ht(t, r, i);
        });
      }) : Ht(t, r, i);
    }
    function Zr() {
      var e = { a: gi };
      function t(i, a) {
        var l = i.exports;
        return Q = l, he = Q.E, Pr(), Jt = Q.H, Xr(Q.F), rt(), l;
      }
      Ve();
      function r(i) {
        t(i.instance);
      }
      if (n.instantiateWasm)
        try {
          return n.instantiateWasm(e, t);
        } catch (i) {
          K("Module.instantiateWasm callback failed with error: " + i), u(i);
        }
      return Yr(j, Oe, e, r).catch(u), {};
    }
    var x, Y, gt = (e) => {
      for (; e.length > 0; )
        e.shift()(n);
    };
    function Fe(e) {
      this.excPtr = e, this.ptr = e - 24, this.set_type = function(t) {
        G[this.ptr + 4 >> 2] = t;
      }, this.get_type = function() {
        return G[this.ptr + 4 >> 2];
      }, this.set_destructor = function(t) {
        G[this.ptr + 8 >> 2] = t;
      }, this.get_destructor = function() {
        return G[this.ptr + 8 >> 2];
      }, this.set_caught = function(t) {
        t = t ? 1 : 0, re[this.ptr + 12 >> 0] = t;
      }, this.get_caught = function() {
        return re[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(t) {
        t = t ? 1 : 0, re[this.ptr + 13 >> 0] = t;
      }, this.get_rethrown = function() {
        return re[this.ptr + 13 >> 0] != 0;
      }, this.init = function(t, r) {
        this.set_adjusted_ptr(0), this.set_type(t), this.set_destructor(r);
      }, this.set_adjusted_ptr = function(t) {
        G[this.ptr + 16 >> 2] = t;
      }, this.get_adjusted_ptr = function() {
        return G[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var t = jn(this.get_type());
        if (t)
          return G[this.excPtr >> 2];
        var r = this.get_adjusted_ptr();
        return r !== 0 ? r : this.excPtr;
      };
    }
    var nt = 0;
    function at(e, t, r) {
      var i = new Fe(e);
      throw i.init(t, r), nt = e, nt;
    }
    var zt = (e) => (z[In() >> 2] = e, e), N = { isAbs: (e) => e.charAt(0) === "/", splitPath: (e) => {
      var t = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
      return t.exec(e).slice(1);
    }, normalizeArray: (e, t) => {
      for (var r = 0, i = e.length - 1; i >= 0; i--) {
        var a = e[i];
        a === "." ? e.splice(i, 1) : a === ".." ? (e.splice(i, 1), r++) : r && (e.splice(i, 1), r--);
      }
      if (t)
        for (; r; r--)
          e.unshift("..");
      return e;
    }, normalize: (e) => {
      var t = N.isAbs(e), r = e.substr(-1) === "/";
      return e = N.normalizeArray(e.split("/").filter((i) => !!i), !t).join("/"), !e && !t && (e = "."), e && r && (e += "/"), (t ? "/" : "") + e;
    }, dirname: (e) => {
      var t = N.splitPath(e), r = t[0], i = t[1];
      return !r && !i ? "." : (i && (i = i.substr(0, i.length - 1)), r + i);
    }, basename: (e) => {
      if (e === "/")
        return "/";
      e = N.normalize(e), e = e.replace(/\/$/, "");
      var t = e.lastIndexOf("/");
      return t === -1 ? e : e.substr(t + 1);
    }, join: function() {
      var e = Array.prototype.slice.call(arguments);
      return N.normalize(e.join("/"));
    }, join2: (e, t) => N.normalize(e + "/" + t) }, ue = () => {
      if (typeof crypto == "object" && typeof crypto.getRandomValues == "function")
        return (e) => crypto.getRandomValues(e);
      De("initRandomDevice");
    }, Wt = (e) => (Wt = ue())(e), ge = { resolve: function() {
      for (var e = "", t = !1, r = arguments.length - 1; r >= -1 && !t; r--) {
        var i = r >= 0 ? arguments[r] : o.cwd();
        if (typeof i != "string")
          throw new TypeError("Arguments to path.resolve must be strings");
        if (!i)
          return "";
        e = i + "/" + e, t = N.isAbs(i);
      }
      return e = N.normalizeArray(e.split("/").filter((a) => !!a), !t).join("/"), (t ? "/" : "") + e || ".";
    }, relative: (e, t) => {
      e = ge.resolve(e).substr(1), t = ge.resolve(t).substr(1);
      function r(m) {
        for (var k = 0; k < m.length && m[k] === ""; k++)
          ;
        for (var D = m.length - 1; D >= 0 && m[D] === ""; D--)
          ;
        return k > D ? [] : m.slice(k, D - k + 1);
      }
      for (var i = r(e.split("/")), a = r(t.split("/")), l = Math.min(i.length, a.length), f = l, c = 0; c < l; c++)
        if (i[c] !== a[c]) {
          f = c;
          break;
        }
      for (var w = [], c = f; c < i.length; c++)
        w.push("..");
      return w = w.concat(a.slice(f)), w.join("/");
    } }, lt = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, Ie = (e, t, r) => {
      for (var i = t + r, a = t; e[a] && !(a >= i); )
        ++a;
      if (a - t > 16 && e.buffer && lt)
        return lt.decode(e.subarray(t, a));
      for (var l = ""; t < a; ) {
        var f = e[t++];
        if (!(f & 128)) {
          l += String.fromCharCode(f);
          continue;
        }
        var c = e[t++] & 63;
        if ((f & 224) == 192) {
          l += String.fromCharCode((f & 31) << 6 | c);
          continue;
        }
        var w = e[t++] & 63;
        if ((f & 240) == 224 ? f = (f & 15) << 12 | c << 6 | w : f = (f & 7) << 18 | c << 12 | w << 6 | e[t++] & 63, f < 65536)
          l += String.fromCharCode(f);
        else {
          var m = f - 65536;
          l += String.fromCharCode(55296 | m >> 10, 56320 | m & 1023);
        }
      }
      return l;
    }, Re = [], Pt = (e) => {
      for (var t = 0, r = 0; r < e.length; ++r) {
        var i = e.charCodeAt(r);
        i <= 127 ? t++ : i <= 2047 ? t += 2 : i >= 55296 && i <= 57343 ? (t += 4, ++r) : t += 3;
      }
      return t;
    }, Tt = (e, t, r, i) => {
      if (!(i > 0))
        return 0;
      for (var a = r, l = r + i - 1, f = 0; f < e.length; ++f) {
        var c = e.charCodeAt(f);
        if (c >= 55296 && c <= 57343) {
          var w = e.charCodeAt(++f);
          c = 65536 + ((c & 1023) << 10) | w & 1023;
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
    function Ct(e, t, r) {
      var i = r > 0 ? r : Pt(e) + 1, a = new Array(i), l = Tt(e, a, 0, a.length);
      return t && (a.length = l), a;
    }
    var ir = () => {
      if (!Re.length) {
        var e = null;
        if (typeof window < "u" && typeof window.prompt == "function" ? (e = window.prompt("Input: "), e !== null && (e += `
`)) : typeof readline == "function" && (e = readline(), e !== null && (e += `
`)), !e)
          return null;
        Re = Ct(e, !0);
      }
      return Re.shift();
    }, Te = { ttys: [], init: function() {
    }, shutdown: function() {
    }, register: function(e, t) {
      Te.ttys[e] = { input: [], output: [], ops: t }, o.registerDevice(e, Te.stream_ops);
    }, stream_ops: { open: function(e) {
      var t = Te.ttys[e.node.rdev];
      if (!t)
        throw new o.ErrnoError(43);
      e.tty = t, e.seekable = !1;
    }, close: function(e) {
      e.tty.ops.fsync(e.tty);
    }, fsync: function(e) {
      e.tty.ops.fsync(e.tty);
    }, read: function(e, t, r, i, a) {
      if (!e.tty || !e.tty.ops.get_char)
        throw new o.ErrnoError(60);
      for (var l = 0, f = 0; f < i; f++) {
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
        l++, t[r + f] = c;
      }
      return l && (e.node.timestamp = Date.now()), l;
    }, write: function(e, t, r, i, a) {
      if (!e.tty || !e.tty.ops.put_char)
        throw new o.ErrnoError(60);
      try {
        for (var l = 0; l < i; l++)
          e.tty.ops.put_char(e.tty, t[r + l]);
      } catch {
        throw new o.ErrnoError(29);
      }
      return i && (e.node.timestamp = Date.now()), l;
    } }, default_tty_ops: { get_char: function(e) {
      return ir();
    }, put_char: function(e, t) {
      t === null || t === 10 ? (q(Ie(e.output, 0)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync: function(e) {
      e.output && e.output.length > 0 && (q(Ie(e.output, 0)), e.output = []);
    }, ioctl_tcgets: function(e) {
      return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    }, ioctl_tcsets: function(e, t, r) {
      return 0;
    }, ioctl_tiocgwinsz: function(e) {
      return [24, 80];
    } }, default_tty1_ops: { put_char: function(e, t) {
      t === null || t === 10 ? (K(Ie(e.output, 0)), e.output = []) : t != 0 && e.output.push(t);
    }, fsync: function(e) {
      e.output && e.output.length > 0 && (K(Ie(e.output, 0)), e.output = []);
    } } }, Vt = (e) => {
      De();
    }, L = { ops_table: null, mount(e) {
      return L.createNode(null, "/", 16895, 0);
    }, createNode(e, t, r, i) {
      if (o.isBlkdev(r) || o.isFIFO(r))
        throw new o.ErrnoError(63);
      L.ops_table || (L.ops_table = { dir: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr, lookup: L.node_ops.lookup, mknod: L.node_ops.mknod, rename: L.node_ops.rename, unlink: L.node_ops.unlink, rmdir: L.node_ops.rmdir, readdir: L.node_ops.readdir, symlink: L.node_ops.symlink }, stream: { llseek: L.stream_ops.llseek } }, file: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr }, stream: { llseek: L.stream_ops.llseek, read: L.stream_ops.read, write: L.stream_ops.write, allocate: L.stream_ops.allocate, mmap: L.stream_ops.mmap, msync: L.stream_ops.msync } }, link: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr, readlink: L.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr }, stream: o.chrdev_stream_ops } });
      var a = o.createNode(e, t, r, i);
      return o.isDir(a.mode) ? (a.node_ops = L.ops_table.dir.node, a.stream_ops = L.ops_table.dir.stream, a.contents = {}) : o.isFile(a.mode) ? (a.node_ops = L.ops_table.file.node, a.stream_ops = L.ops_table.file.stream, a.usedBytes = 0, a.contents = null) : o.isLink(a.mode) ? (a.node_ops = L.ops_table.link.node, a.stream_ops = L.ops_table.link.stream) : o.isChrdev(a.mode) && (a.node_ops = L.ops_table.chrdev.node, a.stream_ops = L.ops_table.chrdev.stream), a.timestamp = Date.now(), e && (e.contents[t] = a, e.timestamp = a.timestamp), a;
    }, getFileDataAsTypedArray(e) {
      return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
    }, expandFileStorage(e, t) {
      var r = e.contents ? e.contents.length : 0;
      if (!(r >= t)) {
        var i = 1024 * 1024;
        t = Math.max(t, r * (r < i ? 2 : 1.125) >>> 0), r != 0 && (t = Math.max(t, 256));
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
      t.mode !== void 0 && (e.mode = t.mode), t.timestamp !== void 0 && (e.timestamp = t.timestamp), t.size !== void 0 && L.resizeFileStorage(e, t.size);
    }, lookup(e, t) {
      throw o.genericErrors[44];
    }, mknod(e, t, r, i) {
      return L.createNode(e, t, r, i);
    }, rename(e, t, r) {
      if (o.isDir(e.mode)) {
        var i;
        try {
          i = o.lookupNode(t, r);
        } catch {
        }
        if (i)
          for (var a in i.contents)
            throw new o.ErrnoError(55);
      }
      delete e.parent.contents[e.name], e.parent.timestamp = Date.now(), e.name = r, t.contents[r] = e, t.timestamp = e.parent.timestamp, e.parent = t;
    }, unlink(e, t) {
      delete e.contents[t], e.timestamp = Date.now();
    }, rmdir(e, t) {
      var r = o.lookupNode(e, t);
      for (var i in r.contents)
        throw new o.ErrnoError(55);
      delete e.contents[t], e.timestamp = Date.now();
    }, readdir(e) {
      var t = [".", ".."];
      for (var r in e.contents)
        e.contents.hasOwnProperty(r) && t.push(r);
      return t;
    }, symlink(e, t, r) {
      var i = L.createNode(e, t, 41471, 0);
      return i.link = r, i;
    }, readlink(e) {
      if (!o.isLink(e.mode))
        throw new o.ErrnoError(28);
      return e.link;
    } }, stream_ops: { read(e, t, r, i, a) {
      var l = e.node.contents;
      if (a >= e.node.usedBytes)
        return 0;
      var f = Math.min(e.node.usedBytes - a, i);
      if (f > 8 && l.subarray)
        t.set(l.subarray(a, a + f), r);
      else
        for (var c = 0; c < f; c++)
          t[r + c] = l[a + c];
      return f;
    }, write(e, t, r, i, a, l) {
      if (!i)
        return 0;
      var f = e.node;
      if (f.timestamp = Date.now(), t.subarray && (!f.contents || f.contents.subarray)) {
        if (l)
          return f.contents = t.subarray(r, r + i), f.usedBytes = i, i;
        if (f.usedBytes === 0 && a === 0)
          return f.contents = t.slice(r, r + i), f.usedBytes = i, i;
        if (a + i <= f.usedBytes)
          return f.contents.set(t.subarray(r, r + i), a), i;
      }
      if (L.expandFileStorage(f, a + i), f.contents.subarray && t.subarray)
        f.contents.set(t.subarray(r, r + i), a);
      else
        for (var c = 0; c < i; c++)
          f.contents[a + c] = t[r + c];
      return f.usedBytes = Math.max(f.usedBytes, a + i), i;
    }, llseek(e, t, r) {
      var i = t;
      if (r === 1 ? i += e.position : r === 2 && o.isFile(e.node.mode) && (i += e.node.usedBytes), i < 0)
        throw new o.ErrnoError(28);
      return i;
    }, allocate(e, t, r) {
      L.expandFileStorage(e.node, t + r), e.node.usedBytes = Math.max(e.node.usedBytes, t + r);
    }, mmap(e, t, r, i, a) {
      if (!o.isFile(e.node.mode))
        throw new o.ErrnoError(43);
      var l, f, c = e.node.contents;
      if (!(a & 2) && c.buffer === re.buffer)
        f = !1, l = c.byteOffset;
      else {
        if ((r > 0 || r + t < c.length) && (c.subarray ? c = c.subarray(r, r + t) : c = Array.prototype.slice.call(c, r, r + t)), f = !0, l = Vt(), !l)
          throw new o.ErrnoError(48);
        re.set(c, l);
      }
      return { ptr: l, allocated: f };
    }, msync(e, t, r, i, a) {
      return L.stream_ops.write(e, t, 0, i, r, !1), 0;
    } } }, Cr = (e, t, r, i) => {
      var a = i ? "" : `al ${e}`;
      I(e, (l) => {
        We(l, `Loading data file "${e}" failed (no arrayBuffer).`), t(new Uint8Array(l)), a && rt();
      }, (l) => {
        if (r)
          r();
        else
          throw `Loading data file "${e}" failed.`;
      }), a && Ve();
    }, kr = n.preloadPlugins || [];
    function Sr(e, t, r, i) {
      typeof Browser < "u" && Browser.init();
      var a = !1;
      return kr.forEach(function(l) {
        a || l.canHandle(t) && (l.handle(e, t, r, i), a = !0);
      }), a;
    }
    function Jr(e, t, r, i, a, l, f, c, w, m) {
      var k = t ? ge.resolve(N.join2(e, t)) : e;
      function D(A) {
        function T(B) {
          m && m(), c || o.createDataFile(e, t, B, i, a, w), l && l(), rt();
        }
        Sr(A, k, T, () => {
          f && f(), rt();
        }) || T(A);
      }
      Ve(), typeof r == "string" ? Cr(r, (A) => D(A), f) : D(r);
    }
    function en(e) {
      var t = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }, r = t[e];
      if (typeof r > "u")
        throw new Error(`Unknown file open mode: ${e}`);
      return r;
    }
    function Qe(e, t) {
      var r = 0;
      return e && (r |= 365), t && (r |= 146), r;
    }
    var o = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: !1, ignorePermissions: !0, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, lookupPath: (e, t = {}) => {
      if (e = ge.resolve(e), !e)
        return { path: "", node: null };
      var r = { follow_mount: !0, recurse_count: 0 };
      if (t = Object.assign(r, t), t.recurse_count > 8)
        throw new o.ErrnoError(32);
      for (var i = e.split("/").filter((D) => !!D), a = o.root, l = "/", f = 0; f < i.length; f++) {
        var c = f === i.length - 1;
        if (c && t.parent)
          break;
        if (a = o.lookupNode(a, i[f]), l = N.join2(l, i[f]), o.isMountpoint(a) && (!c || c && t.follow_mount) && (a = a.mounted.root), !c || t.follow)
          for (var w = 0; o.isLink(a.mode); ) {
            var m = o.readlink(l);
            l = ge.resolve(N.dirname(l), m);
            var k = o.lookupPath(l, { recurse_count: t.recurse_count + 1 });
            if (a = k.node, w++ > 40)
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
      for (var r = 0, i = 0; i < t.length; i++)
        r = (r << 5) - r + t.charCodeAt(i) | 0;
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
      for (var i = o.hashName(e.id, t), a = o.nameTable[i]; a; a = a.name_next) {
        var l = a.name;
        if (a.parent.id === e.id && l === t)
          return a;
      }
      return o.lookup(e, t);
    }, createNode: (e, t, r, i) => {
      var a = new o.FSNode(e, t, r, i);
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
      var i;
      try {
        i = o.lookupNode(e, t);
      } catch (l) {
        return l.errno;
      }
      var a = o.nodePermissions(e, "wx");
      if (a)
        return a;
      if (r) {
        if (!o.isDir(i.mode))
          return 54;
        if (o.isRoot(i) || o.getPath(i) === o.cwd())
          return 10;
      } else if (o.isDir(i.mode))
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
        var i = r.pop();
        t.push(i), r.push.apply(r, i.mounts);
      }
      return t;
    }, syncfs: (e, t) => {
      typeof e == "function" && (t = e, e = !1), o.syncFSRequests++, o.syncFSRequests > 1 && K(`warning: ${o.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
      var r = o.getMounts(o.root.mount), i = 0;
      function a(f) {
        return o.syncFSRequests--, t(f);
      }
      function l(f) {
        if (f)
          return l.errored ? void 0 : (l.errored = !0, a(f));
        ++i >= r.length && a(null);
      }
      r.forEach((f) => {
        if (!f.type.syncfs)
          return l(null);
        f.type.syncfs(f, e, l);
      });
    }, mount: (e, t, r) => {
      var i = r === "/", a = !r, l;
      if (i && o.root)
        throw new o.ErrnoError(10);
      if (!i && !a) {
        var f = o.lookupPath(r, { follow_mount: !1 });
        if (r = f.path, l = f.node, o.isMountpoint(l))
          throw new o.ErrnoError(10);
        if (!o.isDir(l.mode))
          throw new o.ErrnoError(54);
      }
      var c = { type: e, opts: t, mountpoint: r, mounts: [] }, w = e.mount(c);
      return w.mount = c, c.root = w, i ? o.root = w : l && (l.mounted = c, l.mount && l.mount.mounts.push(c)), w;
    }, unmount: (e) => {
      var t = o.lookupPath(e, { follow_mount: !1 });
      if (!o.isMountpoint(t.node))
        throw new o.ErrnoError(28);
      var r = t.node, i = r.mounted, a = o.getMounts(i);
      Object.keys(o.nameTable).forEach((f) => {
        for (var c = o.nameTable[f]; c; ) {
          var w = c.name_next;
          a.includes(c.mount) && o.destroyNode(c), c = w;
        }
      }), r.mounted = null;
      var l = r.mount.mounts.indexOf(i);
      r.mount.mounts.splice(l, 1);
    }, lookup: (e, t) => e.node_ops.lookup(e, t), mknod: (e, t, r) => {
      var i = o.lookupPath(e, { parent: !0 }), a = i.node, l = N.basename(e);
      if (!l || l === "." || l === "..")
        throw new o.ErrnoError(28);
      var f = o.mayCreate(a, l);
      if (f)
        throw new o.ErrnoError(f);
      if (!a.node_ops.mknod)
        throw new o.ErrnoError(63);
      return a.node_ops.mknod(a, l, t, r);
    }, create: (e, t) => (t = t !== void 0 ? t : 438, t &= 4095, t |= 32768, o.mknod(e, t, 0)), mkdir: (e, t) => (t = t !== void 0 ? t : 511, t &= 1023, t |= 16384, o.mknod(e, t, 0)), mkdirTree: (e, t) => {
      for (var r = e.split("/"), i = "", a = 0; a < r.length; ++a)
        if (r[a]) {
          i += "/" + r[a];
          try {
            o.mkdir(i, t);
          } catch (l) {
            if (l.errno != 20)
              throw l;
          }
        }
    }, mkdev: (e, t, r) => (typeof r > "u" && (r = t, t = 438), t |= 8192, o.mknod(e, t, r)), symlink: (e, t) => {
      if (!ge.resolve(e))
        throw new o.ErrnoError(44);
      var r = o.lookupPath(t, { parent: !0 }), i = r.node;
      if (!i)
        throw new o.ErrnoError(44);
      var a = N.basename(t), l = o.mayCreate(i, a);
      if (l)
        throw new o.ErrnoError(l);
      if (!i.node_ops.symlink)
        throw new o.ErrnoError(63);
      return i.node_ops.symlink(i, a, e);
    }, rename: (e, t) => {
      var r = N.dirname(e), i = N.dirname(t), a = N.basename(e), l = N.basename(t), f, c, w;
      if (f = o.lookupPath(e, { parent: !0 }), c = f.node, f = o.lookupPath(t, { parent: !0 }), w = f.node, !c || !w)
        throw new o.ErrnoError(44);
      if (c.mount !== w.mount)
        throw new o.ErrnoError(75);
      var m = o.lookupNode(c, a), k = ge.relative(e, i);
      if (k.charAt(0) !== ".")
        throw new o.ErrnoError(28);
      if (k = ge.relative(t, r), k.charAt(0) !== ".")
        throw new o.ErrnoError(55);
      var D;
      try {
        D = o.lookupNode(w, l);
      } catch {
      }
      if (m !== D) {
        var A = o.isDir(m.mode), T = o.mayDelete(c, a, A);
        if (T)
          throw new o.ErrnoError(T);
        if (T = D ? o.mayDelete(w, l, A) : o.mayCreate(w, l), T)
          throw new o.ErrnoError(T);
        if (!c.node_ops.rename)
          throw new o.ErrnoError(63);
        if (o.isMountpoint(m) || D && o.isMountpoint(D))
          throw new o.ErrnoError(10);
        if (w !== c && (T = o.nodePermissions(c, "w"), T))
          throw new o.ErrnoError(T);
        o.hashRemoveNode(m);
        try {
          c.node_ops.rename(m, w, l);
        } catch (B) {
          throw B;
        } finally {
          o.hashAddNode(m);
        }
      }
    }, rmdir: (e) => {
      var t = o.lookupPath(e, { parent: !0 }), r = t.node, i = N.basename(e), a = o.lookupNode(r, i), l = o.mayDelete(r, i, !0);
      if (l)
        throw new o.ErrnoError(l);
      if (!r.node_ops.rmdir)
        throw new o.ErrnoError(63);
      if (o.isMountpoint(a))
        throw new o.ErrnoError(10);
      r.node_ops.rmdir(r, i), o.destroyNode(a);
    }, readdir: (e) => {
      var t = o.lookupPath(e, { follow: !0 }), r = t.node;
      if (!r.node_ops.readdir)
        throw new o.ErrnoError(54);
      return r.node_ops.readdir(r);
    }, unlink: (e) => {
      var t = o.lookupPath(e, { parent: !0 }), r = t.node;
      if (!r)
        throw new o.ErrnoError(44);
      var i = N.basename(e), a = o.lookupNode(r, i), l = o.mayDelete(r, i, !1);
      if (l)
        throw new o.ErrnoError(l);
      if (!r.node_ops.unlink)
        throw new o.ErrnoError(63);
      if (o.isMountpoint(a))
        throw new o.ErrnoError(10);
      r.node_ops.unlink(r, i), o.destroyNode(a);
    }, readlink: (e) => {
      var t = o.lookupPath(e), r = t.node;
      if (!r)
        throw new o.ErrnoError(44);
      if (!r.node_ops.readlink)
        throw new o.ErrnoError(28);
      return ge.resolve(o.getPath(r.parent), r.node_ops.readlink(r));
    }, stat: (e, t) => {
      var r = o.lookupPath(e, { follow: !t }), i = r.node;
      if (!i)
        throw new o.ErrnoError(44);
      if (!i.node_ops.getattr)
        throw new o.ErrnoError(63);
      return i.node_ops.getattr(i);
    }, lstat: (e) => o.stat(e, !0), chmod: (e, t, r) => {
      var i;
      if (typeof e == "string") {
        var a = o.lookupPath(e, { follow: !r });
        i = a.node;
      } else
        i = e;
      if (!i.node_ops.setattr)
        throw new o.ErrnoError(63);
      i.node_ops.setattr(i, { mode: t & 4095 | i.mode & -4096, timestamp: Date.now() });
    }, lchmod: (e, t) => {
      o.chmod(e, t, !0);
    }, fchmod: (e, t) => {
      var r = o.getStreamChecked(e);
      o.chmod(r.node, t);
    }, chown: (e, t, r, i) => {
      var a;
      if (typeof e == "string") {
        var l = o.lookupPath(e, { follow: !i });
        a = l.node;
      } else
        a = e;
      if (!a.node_ops.setattr)
        throw new o.ErrnoError(63);
      a.node_ops.setattr(a, { timestamp: Date.now() });
    }, lchown: (e, t, r) => {
      o.chown(e, t, r, !0);
    }, fchown: (e, t, r) => {
      var i = o.getStreamChecked(e);
      o.chown(i.node, t, r);
    }, truncate: (e, t) => {
      if (t < 0)
        throw new o.ErrnoError(28);
      var r;
      if (typeof e == "string") {
        var i = o.lookupPath(e, { follow: !0 });
        r = i.node;
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
      var i = o.lookupPath(e, { follow: !0 }), a = i.node;
      a.node_ops.setattr(a, { timestamp: Math.max(t, r) });
    }, open: (e, t, r) => {
      if (e === "")
        throw new o.ErrnoError(44);
      t = typeof t == "string" ? en(t) : t, r = typeof r > "u" ? 438 : r, t & 64 ? r = r & 4095 | 32768 : r = 0;
      var i;
      if (typeof e == "object")
        i = e;
      else {
        e = N.normalize(e);
        try {
          var a = o.lookupPath(e, { follow: !(t & 131072) });
          i = a.node;
        } catch {
        }
      }
      var l = !1;
      if (t & 64)
        if (i) {
          if (t & 128)
            throw new o.ErrnoError(20);
        } else
          i = o.mknod(e, r, 0), l = !0;
      if (!i)
        throw new o.ErrnoError(44);
      if (o.isChrdev(i.mode) && (t &= -513), t & 65536 && !o.isDir(i.mode))
        throw new o.ErrnoError(54);
      if (!l) {
        var f = o.mayOpen(i, t);
        if (f)
          throw new o.ErrnoError(f);
      }
      t & 512 && !l && o.truncate(i, 0), t &= -131713;
      var c = o.createStream({ node: i, path: o.getPath(i), flags: t, seekable: !0, position: 0, stream_ops: i.stream_ops, ungotten: [], error: !1 });
      return c.stream_ops.open && c.stream_ops.open(c), n.logReadFiles && !(t & 1) && (o.readFiles || (o.readFiles = {}), e in o.readFiles || (o.readFiles[e] = 1)), c;
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
    }, read: (e, t, r, i, a) => {
      if (i < 0 || a < 0)
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
      var f = e.stream_ops.read(e, t, r, i, a);
      return l || (e.position += f), f;
    }, write: (e, t, r, i, a, l) => {
      if (i < 0 || a < 0)
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
      var f = typeof a < "u";
      if (!f)
        a = e.position;
      else if (!e.seekable)
        throw new o.ErrnoError(70);
      var c = e.stream_ops.write(e, t, r, i, a, l);
      return f || (e.position += c), c;
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
    }, mmap: (e, t, r, i, a) => {
      if (i & 2 && !(a & 2) && (e.flags & 2097155) !== 2)
        throw new o.ErrnoError(2);
      if ((e.flags & 2097155) === 1)
        throw new o.ErrnoError(2);
      if (!e.stream_ops.mmap)
        throw new o.ErrnoError(43);
      return e.stream_ops.mmap(e, t, r, i, a);
    }, msync: (e, t, r, i, a) => e.stream_ops.msync ? e.stream_ops.msync(e, t, r, i, a) : 0, munmap: (e) => 0, ioctl: (e, t, r) => {
      if (!e.stream_ops.ioctl)
        throw new o.ErrnoError(59);
      return e.stream_ops.ioctl(e, t, r);
    }, readFile: (e, t = {}) => {
      if (t.flags = t.flags || 0, t.encoding = t.encoding || "binary", t.encoding !== "utf8" && t.encoding !== "binary")
        throw new Error(`Invalid encoding type "${t.encoding}"`);
      var r, i = o.open(e, t.flags), a = o.stat(e), l = a.size, f = new Uint8Array(l);
      return o.read(i, f, 0, l, 0), t.encoding === "utf8" ? r = Ie(f, 0) : t.encoding === "binary" && (r = f), o.close(i), r;
    }, writeFile: (e, t, r = {}) => {
      r.flags = r.flags || 577;
      var i = o.open(e, r.flags, r.mode);
      if (typeof t == "string") {
        var a = new Uint8Array(Pt(t) + 1), l = Tt(t, a, 0, a.length);
        o.write(i, a, 0, l, void 0, r.canOwn);
      } else if (ArrayBuffer.isView(t))
        o.write(i, t, 0, t.byteLength, void 0, r.canOwn);
      else
        throw new Error("Unsupported data type");
      o.close(i);
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
      o.mkdir("/dev"), o.registerDevice(o.makedev(1, 3), { read: () => 0, write: (i, a, l, f, c) => f }), o.mkdev("/dev/null", o.makedev(1, 3)), Te.register(o.makedev(5, 0), Te.default_tty_ops), Te.register(o.makedev(6, 0), Te.default_tty1_ops), o.mkdev("/dev/tty", o.makedev(5, 0)), o.mkdev("/dev/tty1", o.makedev(6, 0));
      var e = new Uint8Array(1024), t = 0, r = () => (t === 0 && (t = Wt(e).byteLength), e[--t]);
      o.createDevice("/dev", "random", r), o.createDevice("/dev", "urandom", r), o.mkdir("/dev/shm"), o.mkdir("/dev/shm/tmp");
    }, createSpecialDirectories: () => {
      o.mkdir("/proc");
      var e = o.mkdir("/proc/self");
      o.mkdir("/proc/self/fd"), o.mount({ mount: () => {
        var t = o.createNode(e, "fd", 16895, 73);
        return t.node_ops = { lookup: (r, i) => {
          var a = +i, l = o.getStreamChecked(a), f = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => l.path } };
          return f.parent = f, f;
        } }, t;
      } }, {}, "/proc/self/fd");
    }, createStandardStreams: () => {
      n.stdin ? o.createDevice("/dev", "stdin", n.stdin) : o.symlink("/dev/tty", "/dev/stdin"), n.stdout ? o.createDevice("/dev", "stdout", null, n.stdout) : o.symlink("/dev/tty", "/dev/stdout"), n.stderr ? o.createDevice("/dev", "stderr", null, n.stderr) : o.symlink("/dev/tty1", "/dev/stderr"), o.open("/dev/stdin", 0), o.open("/dev/stdout", 1), o.open("/dev/stderr", 1);
    }, ensureErrnoError: () => {
      o.ErrnoError || (o.ErrnoError = function(t, r) {
        this.name = "ErrnoError", this.node = r, this.setErrno = function(i) {
          this.errno = i;
        }, this.setErrno(t), this.message = "FS error";
      }, o.ErrnoError.prototype = new Error(), o.ErrnoError.prototype.constructor = o.ErrnoError, [44].forEach((e) => {
        o.genericErrors[e] = new o.ErrnoError(e), o.genericErrors[e].stack = "<generic error, no stack>";
      }));
    }, staticInit: () => {
      o.ensureErrnoError(), o.nameTable = new Array(4096), o.mount(L, {}, "/"), o.createDefaultDirectories(), o.createDefaultDevices(), o.createSpecialDirectories(), o.filesystems = { MEMFS: L };
    }, init: (e, t, r) => {
      o.init.initialized = !0, o.ensureErrnoError(), n.stdin = e || n.stdin, n.stdout = t || n.stdout, n.stderr = r || n.stderr, o.createStandardStreams();
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
      var i = { isRoot: !1, exists: !1, error: 0, name: null, path: null, object: null, parentExists: !1, parentPath: null, parentObject: null };
      try {
        var r = o.lookupPath(e, { parent: !0 });
        i.parentExists = !0, i.parentPath = r.path, i.parentObject = r.node, i.name = N.basename(e), r = o.lookupPath(e, { follow: !t }), i.exists = !0, i.path = r.path, i.object = r.node, i.name = r.node.name, i.isRoot = r.path === "/";
      } catch (a) {
        i.error = a.errno;
      }
      return i;
    }, createPath: (e, t, r, i) => {
      e = typeof e == "string" ? e : o.getPath(e);
      for (var a = t.split("/").reverse(); a.length; ) {
        var l = a.pop();
        if (l) {
          var f = N.join2(e, l);
          try {
            o.mkdir(f);
          } catch {
          }
          e = f;
        }
      }
      return f;
    }, createFile: (e, t, r, i, a) => {
      var l = N.join2(typeof e == "string" ? e : o.getPath(e), t), f = Qe(i, a);
      return o.create(l, f);
    }, createDataFile: (e, t, r, i, a, l) => {
      var f = t;
      e && (e = typeof e == "string" ? e : o.getPath(e), f = t ? N.join2(e, t) : e);
      var c = Qe(i, a), w = o.create(f, c);
      if (r) {
        if (typeof r == "string") {
          for (var m = new Array(r.length), k = 0, D = r.length; k < D; ++k)
            m[k] = r.charCodeAt(k);
          r = m;
        }
        o.chmod(w, c | 146);
        var A = o.open(w, 577);
        o.write(A, r, 0, r.length, 0, l), o.close(A), o.chmod(w, c);
      }
      return w;
    }, createDevice: (e, t, r, i) => {
      var a = N.join2(typeof e == "string" ? e : o.getPath(e), t), l = Qe(!!r, !!i);
      o.createDevice.major || (o.createDevice.major = 64);
      var f = o.makedev(o.createDevice.major++, 0);
      return o.registerDevice(f, { open: (c) => {
        c.seekable = !1;
      }, close: (c) => {
        i && i.buffer && i.buffer.length && i(10);
      }, read: (c, w, m, k, D) => {
        for (var A = 0, T = 0; T < k; T++) {
          var B;
          try {
            B = r();
          } catch {
            throw new o.ErrnoError(29);
          }
          if (B === void 0 && A === 0)
            throw new o.ErrnoError(6);
          if (B == null)
            break;
          A++, w[m + T] = B;
        }
        return A && (c.node.timestamp = Date.now()), A;
      }, write: (c, w, m, k, D) => {
        for (var A = 0; A < k; A++)
          try {
            i(w[m + A]);
          } catch {
            throw new o.ErrnoError(29);
          }
        return k && (c.node.timestamp = Date.now()), A;
      } }), o.mkdev(a, l, f);
    }, forceLoadFile: (e) => {
      if (e.isDevice || e.isFolder || e.link || e.contents)
        return !0;
      if (typeof XMLHttpRequest < "u")
        throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
      if (C)
        try {
          e.contents = Ct(C(e.url), !0), e.usedBytes = e.contents.length;
        } catch {
          throw new o.ErrnoError(29);
        }
      else
        throw new Error("Cannot load without read() or XMLHttpRequest.");
    }, createLazyFile: (e, t, r, i, a) => {
      function l() {
        this.lengthKnown = !1, this.chunks = [];
      }
      if (l.prototype.get = function(T) {
        if (!(T > this.length - 1 || T < 0)) {
          var B = T % this.chunkSize, Z = T / this.chunkSize | 0;
          return this.getter(Z)[B];
        }
      }, l.prototype.setDataGetter = function(T) {
        this.getter = T;
      }, l.prototype.cacheLength = function() {
        var T = new XMLHttpRequest();
        if (T.open("HEAD", r, !1), T.send(null), !(T.status >= 200 && T.status < 300 || T.status === 304))
          throw new Error("Couldn't load " + r + ". Status: " + T.status);
        var B = Number(T.getResponseHeader("Content-length")), Z, J = (Z = T.getResponseHeader("Accept-Ranges")) && Z === "bytes", ie = (Z = T.getResponseHeader("Content-Encoding")) && Z === "gzip", fe = 1024 * 1024;
        J || (fe = B);
        var ee = (pe, ke) => {
          if (pe > ke)
            throw new Error("invalid range (" + pe + ", " + ke + ") or no bytes requested!");
          if (ke > B - 1)
            throw new Error("only " + B + " bytes available! programmer error!");
          var oe = new XMLHttpRequest();
          if (oe.open("GET", r, !1), B !== fe && oe.setRequestHeader("Range", "bytes=" + pe + "-" + ke), oe.responseType = "arraybuffer", oe.overrideMimeType && oe.overrideMimeType("text/plain; charset=x-user-defined"), oe.send(null), !(oe.status >= 200 && oe.status < 300 || oe.status === 304))
            throw new Error("Couldn't load " + r + ". Status: " + oe.status);
          return oe.response !== void 0 ? new Uint8Array(oe.response || []) : Ct(oe.responseText || "", !0);
        }, ze = this;
        ze.setDataGetter((pe) => {
          var ke = pe * fe, oe = (pe + 1) * fe - 1;
          if (oe = Math.min(oe, B - 1), typeof ze.chunks[pe] > "u" && (ze.chunks[pe] = ee(ke, oe)), typeof ze.chunks[pe] > "u")
            throw new Error("doXHR failed!");
          return ze.chunks[pe];
        }), (ie || !B) && (fe = B = 1, B = this.getter(0).length, fe = B, q("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = B, this._chunkSize = fe, this.lengthKnown = !0;
      }, typeof XMLHttpRequest < "u") {
        if (!y)
          throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
        var f = new l();
        Object.defineProperties(f, { length: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._length;
        } }, chunkSize: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._chunkSize;
        } } });
        var c = { isDevice: !1, contents: f };
      } else
        var c = { isDevice: !1, url: r };
      var w = o.createFile(e, t, c, i, a);
      c.contents ? w.contents = c.contents : c.url && (w.contents = null, w.url = c.url), Object.defineProperties(w, { usedBytes: { get: function() {
        return this.contents.length;
      } } });
      var m = {}, k = Object.keys(w.stream_ops);
      k.forEach((A) => {
        var T = w.stream_ops[A];
        m[A] = function() {
          return o.forceLoadFile(w), T.apply(null, arguments);
        };
      });
      function D(A, T, B, Z, J) {
        var ie = A.node.contents;
        if (J >= ie.length)
          return 0;
        var fe = Math.min(ie.length - J, Z);
        if (ie.slice)
          for (var ee = 0; ee < fe; ee++)
            T[B + ee] = ie[J + ee];
        else
          for (var ee = 0; ee < fe; ee++)
            T[B + ee] = ie.get(J + ee);
        return fe;
      }
      return m.read = (A, T, B, Z, J) => (o.forceLoadFile(w), D(A, T, B, Z, J)), m.mmap = (A, T, B, Z, J) => {
        o.forceLoadFile(w);
        var ie = Vt();
        if (!ie)
          throw new o.ErrnoError(48);
        return D(A, re, ie, T, B), { ptr: ie, allocated: !0 };
      }, w.stream_ops = m, w;
    } }, ut = (e, t) => e ? Ie(X, e, t) : "", ae = { DEFAULT_POLLMASK: 5, calculateAt: function(e, t, r) {
      if (N.isAbs(t))
        return t;
      var i;
      if (e === -100)
        i = o.cwd();
      else {
        var a = ae.getStreamFromFD(e);
        i = a.path;
      }
      if (t.length == 0) {
        if (!r)
          throw new o.ErrnoError(44);
        return i;
      }
      return N.join2(i, t);
    }, doStat: function(e, t, r) {
      try {
        var i = e(t);
      } catch (c) {
        if (c && c.node && N.normalize(t) !== N.normalize(o.getPath(c.node)))
          return -54;
        throw c;
      }
      z[r >> 2] = i.dev, z[r + 4 >> 2] = i.mode, G[r + 8 >> 2] = i.nlink, z[r + 12 >> 2] = i.uid, z[r + 16 >> 2] = i.gid, z[r + 20 >> 2] = i.rdev, Y = [i.size >>> 0, (x = i.size, +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[r + 24 >> 2] = Y[0], z[r + 28 >> 2] = Y[1], z[r + 32 >> 2] = 4096, z[r + 36 >> 2] = i.blocks;
      var a = i.atime.getTime(), l = i.mtime.getTime(), f = i.ctime.getTime();
      return Y = [Math.floor(a / 1e3) >>> 0, (x = Math.floor(a / 1e3), +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[r + 40 >> 2] = Y[0], z[r + 44 >> 2] = Y[1], G[r + 48 >> 2] = a % 1e3 * 1e3, Y = [Math.floor(l / 1e3) >>> 0, (x = Math.floor(l / 1e3), +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[r + 56 >> 2] = Y[0], z[r + 60 >> 2] = Y[1], G[r + 64 >> 2] = l % 1e3 * 1e3, Y = [Math.floor(f / 1e3) >>> 0, (x = Math.floor(f / 1e3), +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[r + 72 >> 2] = Y[0], z[r + 76 >> 2] = Y[1], G[r + 80 >> 2] = f % 1e3 * 1e3, Y = [i.ino >>> 0, (x = i.ino, +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[r + 88 >> 2] = Y[0], z[r + 92 >> 2] = Y[1], 0;
    }, doMsync: function(e, t, r, i, a) {
      if (!o.isFile(t.node.mode))
        throw new o.ErrnoError(43);
      if (i & 2)
        return 0;
      var l = X.slice(e, e + r);
      o.msync(t, l, a, r, i);
    }, varargs: void 0, get() {
      ae.varargs += 4;
      var e = z[ae.varargs - 4 >> 2];
      return e;
    }, getStr(e) {
      var t = ut(e);
      return t;
    }, getStreamFromFD: function(e) {
      var t = o.getStreamChecked(e);
      return t;
    } };
    function tn(e, t, r) {
      ae.varargs = r;
      try {
        var i = ae.getStreamFromFD(e);
        switch (t) {
          case 0: {
            var a = ae.get();
            if (a < 0)
              return -28;
            var l;
            return l = o.createStream(i, a), l.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return i.flags;
          case 4: {
            var a = ae.get();
            return i.flags |= a, 0;
          }
          case 5: {
            var a = ae.get(), f = 0;
            return be[a + f >> 1] = 2, 0;
          }
          case 6:
          case 7:
            return 0;
          case 16:
          case 8:
            return -28;
          case 9:
            return zt(28), -1;
          default:
            return -28;
        }
      } catch (c) {
        if (typeof o > "u" || c.name !== "ErrnoError")
          throw c;
        return -c.errno;
      }
    }
    function kt(e, t, r, i) {
      ae.varargs = i;
      try {
        t = ae.getStr(t), t = ae.calculateAt(e, t);
        var a = i ? ae.get() : 0;
        return o.open(t, r, a).fd;
      } catch (l) {
        if (typeof o > "u" || l.name !== "ErrnoError")
          throw l;
        return -l.errno;
      }
    }
    function rn(e, t, r, i, a) {
    }
    function St(e) {
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
    function Nt() {
      for (var e = new Array(256), t = 0; t < 256; ++t)
        e[t] = String.fromCharCode(t);
      or = e;
    }
    var or = void 0;
    function ce(e) {
      for (var t = "", r = e; X[r]; )
        t += or[X[r++]];
      return t;
    }
    var Le = {}, xe = {}, ct = {}, je = void 0;
    function W(e) {
      throw new je(e);
    }
    var Ne = void 0;
    function dt(e) {
      throw new Ne(e);
    }
    function Ye(e, t, r) {
      e.forEach(function(c) {
        ct[c] = t;
      });
      function i(c) {
        var w = r(c);
        w.length !== e.length && dt("Mismatched type converter count");
        for (var m = 0; m < e.length; ++m)
          ye(e[m], w[m]);
      }
      var a = new Array(t.length), l = [], f = 0;
      t.forEach((c, w) => {
        xe.hasOwnProperty(c) ? a[w] = xe[c] : (l.push(c), Le.hasOwnProperty(c) || (Le[c] = []), Le[c].push(() => {
          a[w] = xe[c], ++f, f === l.length && i(a);
        }));
      }), l.length === 0 && i(a);
    }
    function qt(e, t, r = {}) {
      var i = t.name;
      if (e || W(`type "${i}" must have a positive integer typeid pointer`), xe.hasOwnProperty(e)) {
        if (r.ignoreDuplicateRegistrations)
          return;
        W(`Cannot register type '${i}' twice`);
      }
      if (xe[e] = t, delete ct[e], Le.hasOwnProperty(e)) {
        var a = Le[e];
        delete Le[e], a.forEach((l) => l());
      }
    }
    function ye(e, t, r = {}) {
      if (!("argPackAdvance" in t))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      return qt(e, t, r);
    }
    function Ar(e, t, r, i, a) {
      var l = St(r);
      t = ce(t), ye(e, { name: t, fromWireType: function(f) {
        return !!f;
      }, toWireType: function(f, c) {
        return c ? i : a;
      }, argPackAdvance: 8, readValueFromPointer: function(f) {
        var c;
        if (r === 1)
          c = re;
        else if (r === 2)
          c = be;
        else if (r === 4)
          c = z;
        else
          throw new TypeError("Unknown boolean type size: " + t);
        return this.fromWireType(c[f >> l]);
      }, destructorFunction: null });
    }
    function nn(e) {
      if (!(this instanceof Pe) || !(e instanceof Pe))
        return !1;
      for (var t = this.$$.ptrType.registeredClass, r = this.$$.ptr, i = e.$$.ptrType.registeredClass, a = e.$$.ptr; t.baseClass; )
        r = t.upcast(r), t = t.baseClass;
      for (; i.baseClass; )
        a = i.upcast(a), i = i.baseClass;
      return t === i && r === a;
    }
    function on(e) {
      return { count: e.count, deleteScheduled: e.deleteScheduled, preservePointerOnDelete: e.preservePointerOnDelete, ptr: e.ptr, ptrType: e.ptrType, smartPtr: e.smartPtr, smartPtrType: e.smartPtrType };
    }
    function ft(e) {
      function t(r) {
        return r.$$.ptrType.registeredClass.name;
      }
      W(t(e) + " instance already deleted");
    }
    var At = !1;
    function sr(e) {
    }
    function sn(e) {
      e.smartPtr ? e.smartPtrType.rawDestructor(e.smartPtr) : e.ptrType.registeredClass.rawDestructor(e.ptr);
    }
    function yt(e) {
      e.count.value -= 1;
      var t = e.count.value === 0;
      t && sn(e);
    }
    function ar(e, t, r) {
      if (t === r)
        return e;
      if (r.baseClass === void 0)
        return null;
      var i = ar(e, t, r.baseClass);
      return i === null ? null : r.downcast(i);
    }
    var lr = {};
    function an() {
      return Object.keys(Je).length;
    }
    function ln() {
      var e = [];
      for (var t in Je)
        Je.hasOwnProperty(t) && e.push(Je[t]);
      return e;
    }
    var we = [];
    function Dt() {
      for (; we.length; ) {
        var e = we.pop();
        e.$$.deleteScheduled = !1, e.delete();
      }
    }
    var Ze = void 0;
    function Gt(e) {
      Ze = e, we.length && Ze && Ze(Dt);
    }
    function Dr() {
      n.getInheritedInstanceCount = an, n.getLiveInheritedInstances = ln, n.flushPendingDeletes = Dt, n.setDelayFunction = Gt;
    }
    var Je = {};
    function un(e, t) {
      for (t === void 0 && W("ptr should not be undefined"); e.baseClass; )
        t = e.upcast(t), e = e.baseClass;
      return t;
    }
    function wt(e, t) {
      return t = un(e, t), Je[t];
    }
    function ht(e, t) {
      (!t.ptrType || !t.ptr) && dt("makeClassHandle requires ptr and ptrType");
      var r = !!t.smartPtrType, i = !!t.smartPtr;
      return r !== i && dt("Both smartPtrType and smartPtr must be specified"), t.count = { value: 1 }, qe(Object.create(e, { $$: { value: t } }));
    }
    function Fr(e) {
      var t = this.getPointee(e);
      if (!t)
        return this.destructor(e), null;
      var r = wt(this.registeredClass, t);
      if (r !== void 0) {
        if (r.$$.count.value === 0)
          return r.$$.ptr = t, r.$$.smartPtr = e, r.clone();
        var i = r.clone();
        return this.destructor(e), i;
      }
      function a() {
        return this.isSmartPointer ? ht(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: t, smartPtrType: this, smartPtr: e }) : ht(this.registeredClass.instancePrototype, { ptrType: this, ptr: e });
      }
      var l = this.registeredClass.getActualType(t), f = lr[l];
      if (!f)
        return a.call(this);
      var c;
      this.isConst ? c = f.constPointerType : c = f.pointerType;
      var w = ar(t, this.registeredClass, c.registeredClass);
      return w === null ? a.call(this) : this.isSmartPointer ? ht(c.registeredClass.instancePrototype, { ptrType: c, ptr: w, smartPtrType: this, smartPtr: e }) : ht(c.registeredClass.instancePrototype, { ptrType: c, ptr: w });
    }
    var qe = function(e) {
      return typeof FinalizationRegistry > "u" ? (qe = (t) => t, e) : (At = new FinalizationRegistry((t) => {
        yt(t.$$);
      }), qe = (t) => {
        var r = t.$$, i = !!r.smartPtr;
        if (i) {
          var a = { $$: r };
          At.register(t, a, t);
        }
        return t;
      }, sr = (t) => At.unregister(t), qe(e));
    };
    function ur() {
      if (this.$$.ptr || ft(this), this.$$.preservePointerOnDelete)
        return this.$$.count.value += 1, this;
      var e = qe(Object.create(Object.getPrototypeOf(this), { $$: { value: on(this.$$) } }));
      return e.$$.count.value += 1, e.$$.deleteScheduled = !1, e;
    }
    function cn() {
      this.$$.ptr || ft(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && W("Object already scheduled for deletion"), sr(this), yt(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
    }
    function Rr() {
      return !this.$$.ptr;
    }
    function dn() {
      return this.$$.ptr || ft(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && W("Object already scheduled for deletion"), we.push(this), we.length === 1 && Ze && Ze(Dt), this.$$.deleteScheduled = !0, this;
    }
    function xr() {
      Pe.prototype.isAliasOf = nn, Pe.prototype.clone = ur, Pe.prototype.delete = cn, Pe.prototype.isDeleted = Rr, Pe.prototype.deleteLater = dn;
    }
    function Pe() {
    }
    var fn = 48, hn = 57;
    function pt(e) {
      if (e === void 0)
        return "_unknown";
      e = e.replace(/[^a-zA-Z0-9_]/g, "$");
      var t = e.charCodeAt(0);
      return t >= fn && t <= hn ? `_${e}` : e;
    }
    function _t(e, t) {
      return e = pt(e), { [e]: function() {
        return t.apply(this, arguments);
      } }[e];
    }
    function Ue(e, t, r) {
      if (e[t].overloadTable === void 0) {
        var i = e[t];
        e[t] = function() {
          return e[t].overloadTable.hasOwnProperty(arguments.length) || W(`Function '${r}' called with an invalid number of arguments (${arguments.length}) - expects one of (${e[t].overloadTable})!`), e[t].overloadTable[arguments.length].apply(this, arguments);
        }, e[t].overloadTable = [], e[t].overloadTable[i.argCount] = i;
      }
    }
    function Ur(e, t, r) {
      n.hasOwnProperty(e) ? ((r === void 0 || n[e].overloadTable !== void 0 && n[e].overloadTable[r] !== void 0) && W(`Cannot register public name '${e}' twice`), Ue(n, e, e), n.hasOwnProperty(r) && W(`Cannot register multiple overloads of a function with the same number of arguments (${r})!`), n[e].overloadTable[r] = t) : (n[e] = t, r !== void 0 && (n[e].numArguments = r));
    }
    function pn(e, t, r, i, a, l, f, c) {
      this.name = e, this.constructor = t, this.instancePrototype = r, this.rawDestructor = i, this.baseClass = a, this.getActualType = l, this.upcast = f, this.downcast = c, this.pureVirtualFunctions = [];
    }
    function Ft(e, t, r) {
      for (; t !== r; )
        t.upcast || W(`Expected null or instance of ${r.name}, got an instance of ${t.name}`), e = t.upcast(e), t = t.baseClass;
      return e;
    }
    function Xt(e, t) {
      if (t === null)
        return this.isReference && W(`null is not a valid ${this.name}`), 0;
      t.$$ || W(`Cannot pass "${xt(t)}" as a ${this.name}`), t.$$.ptr || W(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var r = t.$$.ptrType.registeredClass, i = Ft(t.$$.ptr, r, this.registeredClass);
      return i;
    }
    function vn(e, t) {
      var r;
      if (t === null)
        return this.isReference && W(`null is not a valid ${this.name}`), this.isSmartPointer ? (r = this.rawConstructor(), e !== null && e.push(this.rawDestructor, r), r) : 0;
      t.$$ || W(`Cannot pass "${xt(t)}" as a ${this.name}`), t.$$.ptr || W(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && t.$$.ptrType.isConst && W(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
      var i = t.$$.ptrType.registeredClass;
      if (r = Ft(t.$$.ptr, i, this.registeredClass), this.isSmartPointer)
        switch (t.$$.smartPtr === void 0 && W("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            t.$$.smartPtrType === this ? r = t.$$.smartPtr : W(`Cannot convert argument of type ${t.$$.smartPtrType ? t.$$.smartPtrType.name : t.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            r = t.$$.smartPtr;
            break;
          case 2:
            if (t.$$.smartPtrType === this)
              r = t.$$.smartPtr;
            else {
              var a = t.clone();
              r = this.rawShare(r, mt.toHandle(function() {
                a.delete();
              })), e !== null && e.push(this.rawDestructor, r);
            }
            break;
          default:
            W("Unsupporting sharing policy");
        }
      return r;
    }
    function cr(e, t) {
      if (t === null)
        return this.isReference && W(`null is not a valid ${this.name}`), 0;
      t.$$ || W(`Cannot pass "${xt(t)}" as a ${this.name}`), t.$$.ptr || W(`Cannot pass deleted object as a pointer of type ${this.name}`), t.$$.ptrType.isConst && W(`Cannot convert argument of type ${t.$$.ptrType.name} to parameter type ${this.name}`);
      var r = t.$$.ptrType.registeredClass, i = Ft(t.$$.ptr, r, this.registeredClass);
      return i;
    }
    function vt(e) {
      return this.fromWireType(z[e >> 2]);
    }
    function mn(e) {
      return this.rawGetPointee && (e = this.rawGetPointee(e)), e;
    }
    function gn(e) {
      this.rawDestructor && this.rawDestructor(e);
    }
    function yn(e) {
      e !== null && e.delete();
    }
    function wn() {
      _e.prototype.getPointee = mn, _e.prototype.destructor = gn, _e.prototype.argPackAdvance = 8, _e.prototype.readValueFromPointer = vt, _e.prototype.deleteObject = yn, _e.prototype.fromWireType = Fr;
    }
    function _e(e, t, r, i, a, l, f, c, w, m, k) {
      this.name = e, this.registeredClass = t, this.isReference = r, this.isConst = i, this.isSmartPointer = a, this.pointeeType = l, this.sharingPolicy = f, this.rawGetPointee = c, this.rawConstructor = w, this.rawShare = m, this.rawDestructor = k, !a && t.baseClass === void 0 ? i ? (this.toWireType = Xt, this.destructorFunction = null) : (this.toWireType = cr, this.destructorFunction = null) : this.toWireType = vn;
    }
    function _n(e, t, r) {
      n.hasOwnProperty(e) || dt("Replacing nonexistant public symbol"), n[e].overloadTable !== void 0 && r !== void 0 ? n[e].overloadTable[r] = t : (n[e] = t, n[e].argCount = r);
    }
    var En = (e, t, r) => {
      var i = n["dynCall_" + e];
      return r && r.length ? i.apply(null, [t].concat(r)) : i.call(null, t);
    }, it = [], Kt = (e) => {
      var t = it[e];
      return t || (e >= it.length && (it.length = e + 1), it[e] = t = Jt.get(e)), t;
    }, bn = (e, t, r) => {
      if (e.includes("j"))
        return En(e, t, r);
      var i = Kt(t).apply(null, r);
      return i;
    }, $n = (e, t) => {
      var r = [];
      return function() {
        return r.length = 0, Object.assign(r, arguments), bn(e, t, r);
      };
    };
    function Be(e, t) {
      e = ce(e);
      function r() {
        return e.includes("j") ? $n(e, t) : Kt(t);
      }
      var i = r();
      return typeof i != "function" && W(`unknown function pointer with signature ${e}: ${t}`), i;
    }
    function Pn(e, t) {
      var r = _t(t, function(i) {
        this.name = t, this.message = i;
        var a = new Error(i).stack;
        a !== void 0 && (this.stack = this.toString() + `
` + a.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return r.prototype = Object.create(e.prototype), r.prototype.constructor = r, r.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, r;
    }
    var dr = void 0;
    function fr(e) {
      var t = Ln(e), r = ce(t);
      return Ce(t), r;
    }
    function Rt(e, t) {
      var r = [], i = {};
      function a(l) {
        if (!i[l] && !xe[l]) {
          if (ct[l]) {
            ct[l].forEach(a);
            return;
          }
          r.push(l), i[l] = !0;
        }
      }
      throw t.forEach(a), new dr(`${e}: ` + r.map(fr).join([", "]));
    }
    function Tn(e, t, r, i, a, l, f, c, w, m, k, D, A) {
      k = ce(k), l = Be(a, l), c && (c = Be(f, c)), m && (m = Be(w, m)), A = Be(D, A);
      var T = pt(k);
      Ur(T, function() {
        Rt(`Cannot construct ${k} due to unbound types`, [i]);
      }), Ye([e, t, r], i ? [i] : [], function(B) {
        B = B[0];
        var Z, J;
        i ? (Z = B.registeredClass, J = Z.instancePrototype) : J = Pe.prototype;
        var ie = _t(T, function() {
          if (Object.getPrototypeOf(this) !== fe)
            throw new je("Use 'new' to construct " + k);
          if (ee.constructor_body === void 0)
            throw new je(k + " has no accessible constructor");
          var oe = ee.constructor_body[arguments.length];
          if (oe === void 0)
            throw new je(`Tried to invoke ctor of ${k} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(ee.constructor_body).toString()}) parameters instead!`);
          return oe.apply(this, arguments);
        }), fe = Object.create(J, { constructor: { value: ie } });
        ie.prototype = fe;
        var ee = new pn(k, ie, fe, A, Z, l, c, m);
        ee.baseClass && (ee.baseClass.__derivedClasses === void 0 && (ee.baseClass.__derivedClasses = []), ee.baseClass.__derivedClasses.push(ee));
        var ze = new _e(k, ee, !0, !1, !1), pe = new _e(k + "*", ee, !1, !1, !1), ke = new _e(k + " const*", ee, !1, !0, !1);
        return lr[e] = { pointerType: pe, constPointerType: ke }, _n(T, ie), [ze, pe, ke];
      });
    }
    function hr(e, t) {
      for (var r = [], i = 0; i < e; i++)
        r.push(G[t + i * 4 >> 2]);
      return r;
    }
    function Cn(e) {
      for (; e.length; ) {
        var t = e.pop(), r = e.pop();
        r(t);
      }
    }
    function pr(e, t) {
      if (!(e instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof e} which is not a function`);
      var r = _t(e.name || "unknownFunctionName", function() {
      });
      r.prototype = e.prototype;
      var i = new r(), a = e.apply(i, t);
      return a instanceof Object ? a : i;
    }
    function vr(e, t, r, i, a, l) {
      var f = t.length;
      f < 2 && W("argTypes array size mismatch! Must at least get return value and 'this' types!");
      for (var c = t[1] !== null && r !== null, w = !1, m = 1; m < t.length; ++m)
        if (t[m] !== null && t[m].destructorFunction === void 0) {
          w = !0;
          break;
        }
      for (var k = t[0].name !== "void", D = "", A = "", m = 0; m < f - 2; ++m)
        D += (m !== 0 ? ", " : "") + "arg" + m, A += (m !== 0 ? ", " : "") + "arg" + m + "Wired";
      var T = `
        return function ${pt(e)}(${D}) {
        if (arguments.length !== ${f - 2}) {
          throwBindingError('function ${e} called with ${arguments.length} arguments, expected ${f - 2} args!');
        }`;
      w && (T += `var destructors = [];
`);
      var B = w ? "destructors" : "null", Z = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"], J = [W, i, a, Cn, t[0], t[1]];
      c && (T += "var thisWired = classParam.toWireType(" + B + `, this);
`);
      for (var m = 0; m < f - 2; ++m)
        T += "var arg" + m + "Wired = argType" + m + ".toWireType(" + B + ", arg" + m + "); // " + t[m + 2].name + `
`, Z.push("argType" + m), J.push(t[m + 2]);
      if (c && (A = "thisWired" + (A.length > 0 ? ", " : "") + A), T += (k || l ? "var rv = " : "") + "invoker(fn" + (A.length > 0 ? ", " : "") + A + `);
`, w)
        T += `runDestructors(destructors);
`;
      else
        for (var m = c ? 1 : 2; m < t.length; ++m) {
          var ie = m === 1 ? "thisWired" : "arg" + (m - 2) + "Wired";
          t[m].destructorFunction !== null && (T += ie + "_dtor(" + ie + "); // " + t[m].name + `
`, Z.push(ie + "_dtor"), J.push(t[m].destructorFunction));
        }
      return k && (T += `var ret = retType.fromWireType(rv);
return ret;
`), T += `}
`, Z.push(T), pr(Function, Z).apply(null, J);
    }
    function kn(e, t, r, i, a, l) {
      var f = hr(t, r);
      a = Be(i, a), Ye([], [e], function(c) {
        c = c[0];
        var w = `constructor ${c.name}`;
        if (c.registeredClass.constructor_body === void 0 && (c.registeredClass.constructor_body = []), c.registeredClass.constructor_body[t - 1] !== void 0)
          throw new je(`Cannot register multiple constructors with identical number of parameters (${t - 1}) for class '${c.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return c.registeredClass.constructor_body[t - 1] = () => {
          Rt(`Cannot construct ${c.name} due to unbound types`, f);
        }, Ye([], f, function(m) {
          return m.splice(1, 0, null), c.registeredClass.constructor_body[t - 1] = vr(w, m, null, a, l), [];
        }), [];
      });
    }
    function mr(e, t, r, i, a, l, f, c, w) {
      var m = hr(r, i);
      t = ce(t), l = Be(a, l), Ye([], [e], function(k) {
        k = k[0];
        var D = `${k.name}.${t}`;
        t.startsWith("@@") && (t = Symbol[t.substring(2)]), c && k.registeredClass.pureVirtualFunctions.push(t);
        function A() {
          Rt(`Cannot call ${D} due to unbound types`, m);
        }
        var T = k.registeredClass.instancePrototype, B = T[t];
        return B === void 0 || B.overloadTable === void 0 && B.className !== k.name && B.argCount === r - 2 ? (A.argCount = r - 2, A.className = k.name, T[t] = A) : (Ue(T, t, D), T[t].overloadTable[r - 2] = A), Ye([], m, function(Z) {
          var J = vr(D, Z, k, l, f, w);
          return T[t].overloadTable === void 0 ? (J.argCount = r - 2, T[t] = J) : T[t].overloadTable[r - 2] = J, [];
        }), [];
      });
    }
    function Sn() {
      Object.assign(gr.prototype, { get(e) {
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
    function gr() {
      this.allocated = [void 0], this.freelist = [];
    }
    var me = new gr();
    function yr(e) {
      e >= me.reserved && --me.get(e).refcount === 0 && me.free(e);
    }
    function Br() {
      for (var e = 0, t = me.reserved; t < me.allocated.length; ++t)
        me.allocated[t] !== void 0 && ++e;
      return e;
    }
    function An() {
      me.allocated.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 }), me.reserved = me.allocated.length, n.count_emval_handles = Br;
    }
    var mt = { toValue: (e) => (e || W("Cannot use deleted val. handle = " + e), me.get(e).value), toHandle: (e) => {
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
          return me.allocate({ refcount: 1, value: e });
      }
    } };
    function Mr(e, t) {
      t = ce(t), ye(e, { name: t, fromWireType: function(r) {
        var i = mt.toValue(r);
        return yr(r), i;
      }, toWireType: function(r, i) {
        return mt.toHandle(i);
      }, argPackAdvance: 8, readValueFromPointer: vt, destructorFunction: null });
    }
    function xt(e) {
      if (e === null)
        return "null";
      var t = typeof e;
      return t === "object" || t === "array" || t === "function" ? e.toString() : "" + e;
    }
    function Dn(e, t) {
      switch (t) {
        case 2:
          return function(r) {
            return this.fromWireType(Lt[r >> 2]);
          };
        case 3:
          return function(r) {
            return this.fromWireType(jt[r >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + e);
      }
    }
    function Fn(e, t, r) {
      var i = St(r);
      t = ce(t), ye(e, { name: t, fromWireType: function(a) {
        return a;
      }, toWireType: function(a, l) {
        return l;
      }, argPackAdvance: 8, readValueFromPointer: Dn(t, i), destructorFunction: null });
    }
    function Rn(e, t, r) {
      switch (t) {
        case 0:
          return r ? function(a) {
            return re[a];
          } : function(a) {
            return X[a];
          };
        case 1:
          return r ? function(a) {
            return be[a >> 1];
          } : function(a) {
            return tt[a >> 1];
          };
        case 2:
          return r ? function(a) {
            return z[a >> 2];
          } : function(a) {
            return G[a >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + e);
      }
    }
    function xn(e, t, r, i, a) {
      t = ce(t);
      var l = St(r), f = (D) => D;
      if (i === 0) {
        var c = 32 - 8 * r;
        f = (D) => D << c >>> c;
      }
      var w = t.includes("unsigned"), m = (D, A) => {
      }, k;
      w ? k = function(D, A) {
        return m(A, this.name), A >>> 0;
      } : k = function(D, A) {
        return m(A, this.name), A;
      }, ye(e, { name: t, fromWireType: f, toWireType: k, argPackAdvance: 8, readValueFromPointer: Rn(t, l, i !== 0), destructorFunction: null });
    }
    function Un(e, t, r) {
      var i = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], a = i[t];
      function l(f) {
        f = f >> 2;
        var c = G, w = c[f], m = c[f + 1];
        return new a(c.buffer, m, w);
      }
      r = ce(r), ye(e, { name: r, fromWireType: l, argPackAdvance: 8, readValueFromPointer: l }, { ignoreDuplicateRegistrations: !0 });
    }
    var Bn = (e, t, r) => Tt(e, X, t, r);
    function et(e, t) {
      t = ce(t);
      var r = t === "std::string";
      ye(e, { name: t, fromWireType: function(i) {
        var a = G[i >> 2], l = i + 4, f;
        if (r)
          for (var c = l, w = 0; w <= a; ++w) {
            var m = l + w;
            if (w == a || X[m] == 0) {
              var k = m - c, D = ut(c, k);
              f === void 0 ? f = D : (f += String.fromCharCode(0), f += D), c = m + 1;
            }
          }
        else {
          for (var A = new Array(a), w = 0; w < a; ++w)
            A[w] = String.fromCharCode(X[l + w]);
          f = A.join("");
        }
        return Ce(i), f;
      }, toWireType: function(i, a) {
        a instanceof ArrayBuffer && (a = new Uint8Array(a));
        var l, f = typeof a == "string";
        f || a instanceof Uint8Array || a instanceof Uint8ClampedArray || a instanceof Int8Array || W("Cannot pass non-string to std::string"), r && f ? l = Pt(a) : l = a.length;
        var c = _r(4 + l + 1), w = c + 4;
        if (G[c >> 2] = l, r && f)
          Bn(a, w, l + 1);
        else if (f)
          for (var m = 0; m < l; ++m) {
            var k = a.charCodeAt(m);
            k > 255 && (Ce(w), W("String has UTF-16 code units that do not fit in 8 bits")), X[w + m] = k;
          }
        else
          for (var m = 0; m < l; ++m)
            X[w + m] = a[m];
        return i !== null && i.push(Ce, c), c;
      }, argPackAdvance: 8, readValueFromPointer: vt, destructorFunction: function(i) {
        Ce(i);
      } });
    }
    var Ut = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, Or = (e, t) => {
      for (var r = e, i = r >> 1, a = i + t / 2; !(i >= a) && tt[i]; )
        ++i;
      if (r = i << 1, r - e > 32 && Ut)
        return Ut.decode(X.subarray(e, r));
      for (var l = "", f = 0; !(f >= t / 2); ++f) {
        var c = be[e + f * 2 >> 1];
        if (c == 0)
          break;
        l += String.fromCharCode(c);
      }
      return l;
    }, Ir = (e, t, r) => {
      if (r === void 0 && (r = 2147483647), r < 2)
        return 0;
      r -= 2;
      for (var i = t, a = r < e.length * 2 ? r / 2 : e.length, l = 0; l < a; ++l) {
        var f = e.charCodeAt(l);
        be[t >> 1] = f, t += 2;
      }
      return be[t >> 1] = 0, t - i;
    }, Qt = (e) => e.length * 2, Lr = (e, t) => {
      for (var r = 0, i = ""; !(r >= t / 4); ) {
        var a = z[e + r * 4 >> 2];
        if (a == 0)
          break;
        if (++r, a >= 65536) {
          var l = a - 65536;
          i += String.fromCharCode(55296 | l >> 10, 56320 | l & 1023);
        } else
          i += String.fromCharCode(a);
      }
      return i;
    }, h = (e, t, r) => {
      if (r === void 0 && (r = 2147483647), r < 4)
        return 0;
      for (var i = t, a = i + r - 4, l = 0; l < e.length; ++l) {
        var f = e.charCodeAt(l);
        if (f >= 55296 && f <= 57343) {
          var c = e.charCodeAt(++l);
          f = 65536 + ((f & 1023) << 10) | c & 1023;
        }
        if (z[t >> 2] = f, t += 4, t + 4 > a)
          break;
      }
      return z[t >> 2] = 0, t - i;
    }, p = (e) => {
      for (var t = 0, r = 0; r < e.length; ++r) {
        var i = e.charCodeAt(r);
        i >= 55296 && i <= 57343 && ++r, t += 4;
      }
      return t;
    }, v = function(e, t, r) {
      r = ce(r);
      var i, a, l, f, c;
      t === 2 ? (i = Or, a = Ir, f = Qt, l = () => tt, c = 1) : t === 4 && (i = Lr, a = h, f = p, l = () => G, c = 2), ye(e, { name: r, fromWireType: function(w) {
        for (var m = G[w >> 2], k = l(), D, A = w + 4, T = 0; T <= m; ++T) {
          var B = w + 4 + T * t;
          if (T == m || k[B >> c] == 0) {
            var Z = B - A, J = i(A, Z);
            D === void 0 ? D = J : (D += String.fromCharCode(0), D += J), A = B + t;
          }
        }
        return Ce(w), D;
      }, toWireType: function(w, m) {
        typeof m != "string" && W(`Cannot pass non-string to C++ string type ${r}`);
        var k = f(m), D = _r(4 + k + t);
        return G[D >> 2] = k >> c, a(m, D + 4, k + t), w !== null && w.push(Ce, D), D;
      }, argPackAdvance: 8, readValueFromPointer: vt, destructorFunction: function(w) {
        Ce(w);
      } });
    };
    function b(e, t) {
      t = ce(t), ye(e, { isVoid: !0, name: t, argPackAdvance: 0, fromWireType: function() {
      }, toWireType: function(r, i) {
      } });
    }
    var F = {};
    function U(e) {
      var t = F[e];
      return t === void 0 ? ce(e) : t;
    }
    var M = [];
    function R(e, t, r, i) {
      e = M[e], t = mt.toValue(t), r = U(r), e(t, r, null, i);
    }
    function V(e) {
      var t = M.length;
      return M.push(e), t;
    }
    function O(e, t) {
      var r = xe[e];
      return r === void 0 && W(t + " has unknown type " + fr(e)), r;
    }
    function te(e, t) {
      for (var r = new Array(e), i = 0; i < e; ++i)
        r[i] = O(G[t + i * 4 >> 2], "parameter " + i);
      return r;
    }
    var ne = [];
    function le(e, t) {
      var r = te(e, t), i = r[0], a = i.name + "_$" + r.slice(1).map(function(B) {
        return B.name;
      }).join("_") + "$", l = ne[a];
      if (l !== void 0)
        return l;
      for (var f = ["retType"], c = [i], w = "", m = 0; m < e - 1; ++m)
        w += (m !== 0 ? ", " : "") + "arg" + m, f.push("argType" + m), c.push(r[1 + m]);
      for (var k = pt("methodCaller_" + a), D = "return function " + k + `(handle, name, destructors, args) {
`, A = 0, m = 0; m < e - 1; ++m)
        D += "    var arg" + m + " = argType" + m + ".readValueFromPointer(args" + (A ? "+" + A : "") + `);
`, A += r[m + 1].argPackAdvance;
      D += "    var rv = handle[name](" + w + `);
`;
      for (var m = 0; m < e - 1; ++m)
        r[m + 1].deleteObject && (D += "    argType" + m + ".deleteObject(arg" + m + `);
`);
      i.isVoid || (D += `    return retType.toWireType(destructors, rv);
`), D += `};
`, f.push(D);
      var T = pr(Function, f).apply(null, c);
      return l = V(T), ne[a] = l, l;
    }
    function de(e, t) {
      return t + 2097152 >>> 0 < 4194305 - !!e ? (e >>> 0) + t * 4294967296 : NaN;
    }
    var Ee = () => {
      De("");
    };
    function Me() {
      return Date.now();
    }
    var Se = () => X.length, ot = () => Se(), wr = (e, t, r) => X.copyWithin(e, t, t + r), He = (e) => {
      De("OOM");
    }, Mn = (e) => {
      X.length, He();
    }, Et = {}, jr = () => E || "./this.program", Ge = () => {
      if (!Ge.strings) {
        var e = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", t = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: e, _: jr() };
        for (var r in Et)
          Et[r] === void 0 ? delete t[r] : t[r] = Et[r];
        var i = [];
        for (var r in t)
          i.push(`${r}=${t[r]}`);
        Ge.strings = i;
      }
      return Ge.strings;
    }, ai = (e, t) => {
      for (var r = 0; r < e.length; ++r)
        re[t++ >> 0] = e.charCodeAt(r);
      re[t >> 0] = 0;
    }, li = (e, t) => {
      var r = 0;
      return Ge().forEach(function(i, a) {
        var l = t + r;
        G[e + a * 4 >> 2] = l, ai(i, l), r += i.length + 1;
      }), 0;
    }, ui = (e, t) => {
      var r = Ge();
      G[e >> 2] = r.length;
      var i = 0;
      return r.forEach(function(a) {
        i += a.length + 1;
      }), G[t >> 2] = i, 0;
    };
    function ci(e) {
      try {
        var t = ae.getStreamFromFD(e);
        return o.close(t), 0;
      } catch (r) {
        if (typeof o > "u" || r.name !== "ErrnoError")
          throw r;
        return r.errno;
      }
    }
    function di(e, t) {
      try {
        var r = 0, i = 0, a = 0, l = ae.getStreamFromFD(e), f = l.tty ? 2 : o.isDir(l.mode) ? 3 : o.isLink(l.mode) ? 7 : 4;
        return re[t >> 0] = f, be[t + 2 >> 1] = a, Y = [r >>> 0, (x = r, +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[t + 8 >> 2] = Y[0], z[t + 12 >> 2] = Y[1], Y = [i >>> 0, (x = i, +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[t + 16 >> 2] = Y[0], z[t + 20 >> 2] = Y[1], 0;
      } catch (c) {
        if (typeof o > "u" || c.name !== "ErrnoError")
          throw c;
        return c.errno;
      }
    }
    var fi = (e, t, r, i) => {
      for (var a = 0, l = 0; l < r; l++) {
        var f = G[t >> 2], c = G[t + 4 >> 2];
        t += 8;
        var w = o.read(e, re, f, c, i);
        if (w < 0)
          return -1;
        if (a += w, w < c)
          break;
        typeof i < "u" && (i += w);
      }
      return a;
    };
    function hi(e, t, r, i) {
      try {
        var a = ae.getStreamFromFD(e), l = fi(a, t, r);
        return G[i >> 2] = l, 0;
      } catch (f) {
        if (typeof o > "u" || f.name !== "ErrnoError")
          throw f;
        return f.errno;
      }
    }
    function pi(e, t, r, i, a) {
      var l = de(t, r);
      try {
        if (isNaN(l))
          return 61;
        var f = ae.getStreamFromFD(e);
        return o.llseek(f, l, i), Y = [f.position >>> 0, (x = f.position, +Math.abs(x) >= 1 ? x > 0 ? +Math.floor(x / 4294967296) >>> 0 : ~~+Math.ceil((x - +(~~x >>> 0)) / 4294967296) >>> 0 : 0)], z[a >> 2] = Y[0], z[a + 4 >> 2] = Y[1], f.getdents && l === 0 && i === 0 && (f.getdents = null), 0;
      } catch (c) {
        if (typeof o > "u" || c.name !== "ErrnoError")
          throw c;
        return c.errno;
      }
    }
    var vi = (e, t, r, i) => {
      for (var a = 0, l = 0; l < r; l++) {
        var f = G[t >> 2], c = G[t + 4 >> 2];
        t += 8;
        var w = o.write(e, re, f, c, i);
        if (w < 0)
          return -1;
        a += w, typeof i < "u" && (i += w);
      }
      return a;
    };
    function mi(e, t, r, i) {
      try {
        var a = ae.getStreamFromFD(e), l = vi(a, t, r);
        return G[i >> 2] = l, 0;
      } catch (f) {
        if (typeof o > "u" || f.name !== "ErrnoError")
          throw f;
        return f.errno;
      }
    }
    var On = function(e, t, r, i) {
      e || (e = this), this.parent = e, this.mount = e.mount, this.mounted = null, this.id = o.nextInode++, this.name = t, this.mode = r, this.node_ops = {}, this.stream_ops = {}, this.rdev = i;
    }, Bt = 365, Mt = 146;
    Object.defineProperties(On.prototype, { read: { get: function() {
      return (this.mode & Bt) === Bt;
    }, set: function(e) {
      e ? this.mode |= Bt : this.mode &= ~Bt;
    } }, write: { get: function() {
      return (this.mode & Mt) === Mt;
    }, set: function(e) {
      e ? this.mode |= Mt : this.mode &= ~Mt;
    } }, isFolder: { get: function() {
      return o.isDir(this.mode);
    } }, isDevice: { get: function() {
      return o.isChrdev(this.mode);
    } } }), o.FSNode = On, o.createPreloadedFile = Jr, o.staticInit(), Nt(), je = n.BindingError = class extends Error {
      constructor(t) {
        super(t), this.name = "BindingError";
      }
    }, Ne = n.InternalError = class extends Error {
      constructor(t) {
        super(t), this.name = "InternalError";
      }
    }, xr(), Dr(), wn(), dr = n.UnboundTypeError = Pn(Error, "UnboundTypeError"), Sn(), An();
    var gi = { p: at, C: tn, w: kt, t: rn, n: Ar, r: Tn, q: kn, d: mr, D: Mr, k: Fn, c: xn, b: Un, j: et, f: v, o: b, g: R, m: yr, l: le, a: Ee, e: Me, v: ot, A: wr, u: Mn, y: li, z: ui, i: ci, x: di, B: hi, s: pi, h: mi };
    Zr();
    var _r = (e) => (_r = Q.G)(e), Ce = (e) => (Ce = Q.I)(e), In = () => (In = Q.J)(), Ln = (e) => (Ln = Q.K)(e);
    n.__embind_initialize_bindings = () => (n.__embind_initialize_bindings = Q.L)();
    var jn = (e) => (jn = Q.M)(e);
    n.dynCall_viiijj = (e, t, r, i, a, l, f, c) => (n.dynCall_viiijj = Q.N)(e, t, r, i, a, l, f, c), n.dynCall_jij = (e, t, r, i) => (n.dynCall_jij = Q.O)(e, t, r, i), n.dynCall_jii = (e, t, r) => (n.dynCall_jii = Q.P)(e, t, r), n.dynCall_jiji = (e, t, r, i, a) => (n.dynCall_jiji = Q.Q)(e, t, r, i, a);
    var Ot;
    Ke = function e() {
      Ot || Hn(), Ot || (Ke = e);
    };
    function Hn() {
      if ($e > 0 || (qr(), $e > 0))
        return;
      function e() {
        Ot || (Ot = !0, n.calledRun = !0, !se && (Gr(), d(n), n.onRuntimeInitialized && n.onRuntimeInitialized(), st()));
      }
      n.setStatus ? (n.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          n.setStatus("");
        }, 1), e();
      }, 1)) : e();
    }
    if (n.preInit)
      for (typeof n.preInit == "function" && (n.preInit = [n.preInit]); n.preInit.length > 0; )
        n.preInit.pop()();
    return Hn(), s.ready;
  };
})(), Co = Object.defineProperty, ko = Object.getOwnPropertyDescriptor, Zn = (P, s, n, d) => {
  for (var u = d > 1 ? void 0 : d ? ko(s, n) : s, _ = P.length - 1, E; _ >= 0; _--)
    (E = P[_]) && (u = (d ? E(s, n, u) : E(u)) || u);
  return d && u && Co(s, n, u), u;
};
class Nr extends ve {
  constructor() {
    super(...arguments), this.sampleRate = 0, this.channels = 0;
  }
  initialize() {
    return new Promise((s) => {
      const n = {};
      n.print = (d) => console.log(d), n.printErr = (d) => console.log(`[JS] ERROR: ${d}`), n.onAbort = () => console.log("[JS] FATAL: WASM ABORTED"), n.postRun = (d) => {
        this.module = d, this.decoder = new this.module.AudioDecoder(this), s();
      }, console.log("audio soft decoder initialize call"), To(n);
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
  audioInfo(s, n) {
    this.sampleRate = s, this.channels = n;
    let d = {
      sampleRate: s,
      channels: n,
      depth: 16
    };
    this.emit(Vn.AudioCodecInfo, d);
  }
  pcmData(s, n, d) {
    if (!this.module)
      return;
    let u = [], _ = 0, E = 0;
    for (let y = 0; y < this.channels; y++) {
      let g = this.module.HEAPU32[(s >> 2) + y] >> 2;
      const S = this.module.HEAPF32.subarray(g, g + n);
      u.push(S), _ += S.length;
    }
    const $ = new Float32Array(_);
    this.emit(Vn.AudioFrame, new AudioData({
      format: "f32-planar",
      sampleRate: this.sampleRate,
      numberOfChannels: this.channels,
      timestamp: d,
      numberOfFrames: n,
      data: u.reduce((y, g) => (y.subarray(E).set(g), E += g.length, y), $)
    }));
  }
  errorInfo(s) {
    let n = {
      errMsg: s
    };
    this.emit(Vn.Error, n);
  }
}
Zn([
  Zt(ve.INIT, "initialized")
], Nr.prototype, "initialize", 1);
Zn([
  Zt("initialized", "configured", { sync: !0 })
], Nr.prototype, "configure", 1);
Zn([
  yo("configured")
], Nr.prototype, "decode", 1);
Zn([
  Zt("configured", "initialized", { sync: !0 })
], Nr.prototype, "reset", 1);
Zn([
  Zt([], "closed", { sync: !0 })
], Nr.prototype, "close", 1);
class So {
  gl = null;
  program = null;
  yTexture = null;
  uTexture = null;
  vTexture = null;
  positionBuffer = null;
  texCoordBuffer = null;
  width = 0;
  height = 0;
  constructor(s) {
    this.setupWebGL(s);
  }
  setupWebGL(s) {
    try {
      if (this.gl = s.getContext("webgl", { preserveDrawingBuffer: !0 }), !this.gl)
        throw new Error("WebGL not supported");
      const n = this.createShader(this.gl.VERTEX_SHADER, `
        attribute vec4 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        void main() {
          gl_Position = a_position;
          v_texCoord = a_texCoord;
        }
      `), d = this.createShader(this.gl.FRAGMENT_SHADER, `
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
      if (!n || !d)
        throw new Error("Failed to create shaders");
      if (this.program = this.createProgram(n, d), !this.program)
        throw new Error("Failed to create shader program");
      this.createBuffers(), this.yTexture = this.createTexture(), this.uTexture = this.createTexture(), this.vTexture = this.createTexture();
    } catch (n) {
      console.error("Error initializing WebGL:", n), this.gl = null;
    }
  }
  createShader(s, n) {
    if (!this.gl)
      return null;
    const d = this.gl.createShader(s);
    return d ? (this.gl.shaderSource(d, n), this.gl.compileShader(d), this.gl.getShaderParameter(d, this.gl.COMPILE_STATUS) ? d : (console.error("Shader compile error:", this.gl.getShaderInfoLog(d)), this.gl.deleteShader(d), null)) : null;
  }
  createProgram(s, n) {
    if (!this.gl)
      return null;
    const d = this.gl.createProgram();
    return d ? (this.gl.attachShader(d, s), this.gl.attachShader(d, n), this.gl.linkProgram(d), this.gl.getProgramParameter(d, this.gl.LINK_STATUS) ? d : (console.error("Program link error:", this.gl.getProgramInfoLog(d)), this.gl.deleteProgram(d), null)) : null;
  }
  createTexture() {
    if (!this.gl)
      return null;
    const s = this.gl.createTexture();
    return s ? (this.gl.bindTexture(this.gl.TEXTURE_2D, s), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR), s) : null;
  }
  createBuffers() {
    if (!this.gl || !this.program)
      return;
    this.positionBuffer = this.gl.createBuffer(), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    const s = [
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      1
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(s), this.gl.STATIC_DRAW), this.texCoordBuffer = this.gl.createBuffer(), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    const n = [
      0,
      1,
      1,
      1,
      0,
      0,
      1,
      0
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(n), this.gl.STATIC_DRAW);
  }
  // Set dimensions for the renderer
  setDimensions(s, n) {
    this.width = s, this.height = n, this.gl && this.gl.viewport(0, 0, s, n);
  }
  // Render YUV data to the canvas
  render(s, n, d, u, _) {
    if (!this.gl || !this.program || !this.yTexture || !this.uTexture || !this.vTexture) {
      console.error("WebGL not initialized properly");
      return;
    }
    this.gl.useProgram(this.program), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    const E = this.gl.getAttribLocation(this.program, "a_position");
    this.gl.enableVertexAttribArray(E), this.gl.vertexAttribPointer(E, 2, this.gl.FLOAT, !1, 0, 0), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    const $ = this.gl.getAttribLocation(this.program, "a_texCoord");
    this.gl.enableVertexAttribArray($), this.gl.vertexAttribPointer($, 2, this.gl.FLOAT, !1, 0, 0), this.updateTexture(this.yTexture, 0, s, this.width, this.height, u), this.updateTexture(this.uTexture, 1, n, this.width / 2, this.height / 2, _), this.updateTexture(this.vTexture, 2, d, this.width / 2, this.height / 2, _);
    const y = this.gl.getUniformLocation(this.program, "y_texture"), g = this.gl.getUniformLocation(this.program, "u_texture"), S = this.gl.getUniformLocation(this.program, "v_texture");
    this.gl.uniform1i(y, 0), this.gl.uniform1i(g, 1), this.gl.uniform1i(S, 2), this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
  updateTexture(s, n, d, u, _, E) {
    if (this.gl)
      if (this.gl.activeTexture(this.gl.TEXTURE0 + n), this.gl.bindTexture(this.gl.TEXTURE_2D, s), E === u)
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.LUMINANCE,
          u,
          _,
          0,
          this.gl.LUMINANCE,
          this.gl.UNSIGNED_BYTE,
          d
        );
      else {
        const $ = new Uint8Array(u * _);
        for (let y = 0; y < _; y++)
          for (let g = 0; g < u; g++)
            $[y * u + g] = d[y * E + g];
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.LUMINANCE,
          u,
          _,
          0,
          this.gl.LUMINANCE,
          this.gl.UNSIGNED_BYTE,
          $
        );
      }
  }
  // Add a method to render directly from a VideoFrame with YUV format
  renderVideoFrame(s) {
    this.setDimensions(s.codedWidth, s.codedHeight);
    const n = s.codedWidth * s.codedHeight, d = s.codedWidth / 2 * (s.codedHeight / 2), u = new Uint8Array(n), _ = new Uint8Array(d), E = new Uint8Array(d);
    s.copyTo(u, { rect: { x: 0, y: 0, width: s.codedWidth, height: s.codedHeight }, layout: [{ offset: 0, stride: s.codedWidth }] }), s.format === "I420" ? (s.copyTo(_, { rect: { x: 0, y: 0, width: s.codedWidth / 2, height: s.codedHeight / 2 }, layout: [{ offset: n, stride: s.codedWidth / 2 }] }), s.copyTo(E, { rect: { x: 0, y: 0, width: s.codedWidth / 2, height: s.codedHeight / 2 }, layout: [{ offset: n + d, stride: s.codedWidth / 2 }] })) : (s.copyTo(E, { rect: { x: 0, y: 0, width: s.codedWidth / 2, height: s.codedHeight / 2 }, layout: [{ offset: n, stride: s.codedWidth / 2 }] }), s.copyTo(_, { rect: { x: 0, y: 0, width: s.codedWidth / 2, height: s.codedHeight / 2 }, layout: [{ offset: n + d, stride: s.codedWidth / 2 }] })), this.render(u, _, E, s.codedWidth, s.codedWidth / 2);
  }
  // Cleanup resources
  dispose() {
    this.gl && (this.gl.deleteTexture(this.yTexture), this.gl.deleteTexture(this.uTexture), this.gl.deleteTexture(this.vTexture), this.gl.deleteBuffer(this.positionBuffer), this.gl.deleteBuffer(this.texCoordBuffer), this.program && this.gl.deleteProgram(this.program), this.gl = null);
  }
}
class Ao {
  videoDecoder;
  audioDecoder;
  canvas;
  audioContext = null;
  videoBuffer = [];
  audioBuffer = [];
  startTime = 0;
  isPlaying = !1;
  animationFrameId = null;
  maxBufferSize = 1 / 0;
  playbackSpeed = 1;
  keyFrameList = [];
  seekTime = null;
  timeOffset = 0;
  gl = null;
  yuvRenderer = null;
  // Audio playback related properties
  audioQueue = [];
  audioQueueTimestamps = [];
  nextAudioStartTime = 0;
  audioScheduleAheadTime = 0.2;
  // Schedule audio 200ms ahead
  lastAudioScheduleTime = 0;
  audioGain = null;
  pausedAt = null;
  constructor(s, n) {
    this.canvas = document.createElement("canvas"), this.canvas.style.width = "160px", this.canvas.style.height = "120px", document.body.appendChild(this.canvas), n?.yuvMode ? this.yuvRenderer = new So(this.canvas) : this.gl = this.canvas.getContext("2d"), this.videoDecoder = new Po({
      workerMode: !1,
      yuvMode: !!this.yuvRenderer,
      canvas: this.canvas,
      wasmPath: s
    }), this.audioDecoder = new Nr(), this.videoDecoder.on(It.VideoFrame, (d) => {
      if (console.log("videoFrame", d), this.yuvRenderer) {
        const u = d;
        this.yuvRenderer.render(u[0], u[1], u[2], this.canvas.width, this.canvas.width / 2);
      } else
        this.gl && (this.gl.drawImage(d, 0, 0), d.close());
    }), this.videoDecoder.on(It.VideoCodecInfo, (d) => {
      this.canvas.width = d.width, this.canvas.height = d.height, this.yuvRenderer && this.yuvRenderer.setDimensions(d.width, d.height);
    }), this.videoDecoder.on(It.Error, (d) => {
      console.error(d);
    }), this.audioDecoder.on(Vn.AudioFrame, (d) => {
      this.audioContext || this.initAudioContext();
      const u = this.audioContext.createBuffer(
        d.numberOfChannels,
        d.numberOfFrames,
        d.sampleRate
      );
      for (let _ = 0; _ < d.numberOfChannels; _++) {
        const E = new Float32Array(d.numberOfFrames);
        d.copyTo(E, { planeIndex: _ }), u.copyToChannel(E, _);
      }
      this.audioQueue.push(u), this.audioQueueTimestamps.push(d.timestamp), this.scheduleAudioPlayback();
    });
  }
  initAudioContext() {
    this.audioContext = new AudioContext(), this.audioGain = this.audioContext.createGain(), this.audioGain.connect(this.audioContext.destination), this.nextAudioStartTime = this.audioContext.currentTime;
  }
  scheduleAudioPlayback() {
    if (!(!this.isPlaying || !this.audioContext || this.audioQueue.length === 0) && !(this.nextAudioStartTime > this.audioContext.currentTime + this.audioScheduleAheadTime)) {
      for (; this.audioQueue.length > 0; ) {
        const s = this.audioQueue[0], n = this.audioQueueTimestamps[0], d = this.audioContext.createBufferSource();
        d.buffer = s, d.connect(this.audioGain), d.playbackRate.value = this.playbackSpeed;
        const u = performance.now(), _ = n * this.playbackSpeed, E = this.audioContext.currentTime + Math.max(0, (_ - (u - this.startTime)) / 1e3), $ = Math.max(
          this.audioContext.currentTime,
          Math.max(E, this.nextAudioStartTime)
        );
        if (d.start($), this.nextAudioStartTime = $ + s.duration / this.playbackSpeed, this.audioQueue.shift(), this.audioQueueTimestamps.shift(), this.nextAudioStartTime > this.audioContext.currentTime + this.audioScheduleAheadTime)
          break;
      }
      this.lastAudioScheduleTime = this.audioContext.currentTime;
    }
  }
  setPlaybackSpeed(s) {
    if (s <= 0)
      throw new Error("Playback speed must be greater than 0");
    const n = this.getCurrentTime();
    this.startTime = performance.now() - n / s, this.playbackSpeed = s, console.log("playbackSpeed", this.playbackSpeed);
  }
  seek(s) {
    if (!this.isPlaying)
      return;
    const n = this.findNearestKeyFrame(s * 1e3);
    this.videoBuffer = this.videoBuffer.filter((d) => d.timestamp >= n), this.audioBuffer = this.audioBuffer.filter((d) => d.timestamp >= n), this.audioQueue = [], this.audioQueueTimestamps = [], this.audioContext && (this.nextAudioStartTime = this.audioContext.currentTime), this.timeOffset = s * 1e3, this.startTime = performance.now() - s * 1e3, this.seekTime = n;
  }
  findNearestKeyFrame(s) {
    for (let n = this.keyFrameList.length - 1; n >= 0; n--)
      if (this.keyFrameList[n] <= s)
        return this.keyFrameList[n];
    return this.keyFrameList[0] || 0;
  }
  start() {
    this.isPlaying || (this.isPlaying = !0, this.pausedAt !== null ? (this.startTime = performance.now() - this.pausedAt, this.pausedAt = null) : this.startTime = performance.now() - this.timeOffset, this.processNextFrame(), this.audioContext ? this.audioContext.state === "suspended" && this.audioContext.resume() : this.initAudioContext(), this.scheduleAudioPlayback());
  }
  stop() {
    this.isPlaying && (this.isPlaying = !1, this.pausedAt = this.getCurrentTime(), this.animationFrameId !== null && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null), this.audioContext && this.audioContext.state === "running" && this.audioContext.suspend());
  }
  getCurrentTime() {
    return this.pausedAt !== null ? this.pausedAt : (performance.now() - this.startTime + this.timeOffset) * this.playbackSpeed;
  }
  processInitialFrame() {
    if (this.videoBuffer.length > 0) {
      const s = this.videoBuffer.shift();
      s && this.videoDecoder.decode(s);
    }
  }
  processNextFrame = () => {
    if (!this.isPlaying)
      return;
    const s = this.getCurrentTime();
    if (this.videoBuffer.length && console.log(this.videoBuffer.length, this.videoBuffer[this.videoBuffer.length - 1].timestamp, s), this.seekTime !== null) {
      for (; this.videoBuffer.length > 0 && this.videoBuffer[0].timestamp < this.seekTime; )
        this.videoBuffer.shift();
      for (; this.audioBuffer.length > 0 && this.audioBuffer[0].timestamp < this.seekTime; )
        this.audioBuffer.shift();
      this.seekTime = null;
    }
    if (this.videoBuffer.length > 0 && this.videoBuffer[0].timestamp <= s) {
      const n = this.videoBuffer.shift();
      n && this.videoDecoder.decode(n);
    }
    if (this.videoBuffer.length > 0) {
      const n = this.videoBuffer.findIndex(
        (d, u) => u > 0 && d.type === "key"
      );
      n !== -1 && this.videoBuffer.slice(0, n).every((_) => _.timestamp <= s) && this.videoBuffer.splice(0, n);
    }
    if (this.audioBuffer.length > 0 && this.audioBuffer[0].timestamp <= s) {
      const n = this.audioBuffer.shift();
      n && this.audioDecoder.decode(n);
    }
    this.audioContext && this.audioContext.currentTime - this.lastAudioScheduleTime > this.audioScheduleAheadTime / 2 && this.scheduleAudioPlayback(), this.animationFrameId = requestAnimationFrame(this.processNextFrame);
  };
  decodeVideo(s) {
    if (this.videoBuffer.length >= this.maxBufferSize) {
      console.warn("Video buffer full, dropping frame");
      return;
    }
    s.type === "key" && this.keyFrameList.push(s.timestamp), this.videoBuffer.push(s);
  }
  decodeAudio(s) {
    if (this.audioBuffer.length >= this.maxBufferSize) {
      console.warn("Audio buffer full, dropping frame");
      return;
    }
    this.audioBuffer.push(s);
  }
  // Dispose of resources
  dispose() {
    this.stop(), this.videoBuffer = [], this.audioBuffer = [], this.audioQueue = [], this.audioQueueTimestamps = [], this.yuvRenderer && (this.yuvRenderer.dispose(), this.yuvRenderer = null), this.audioContext && (this.audioContext.close(), this.audioContext = null), this.gl = null, this.audioGain = null;
  }
}
const Do = /#EXTINF:(\d+\.\d+),(.*?)\s*$/;
class Fo {
  constructor(s, n) {
    this.index = s, this.url = n.url, this.duration = n.duration, this.virtualStartTime = 0, this.virtualEndTime = 0, this.physicalTime = n.physicalTime;
  }
  url;
  // 片段URL
  duration;
  // 片段实际持续时间
  virtualStartTime;
  // 虚拟时间轴上的开始时间
  virtualEndTime;
  // 虚拟时间轴上的结束时间
  physicalTime;
  // 物理时间（从EXTINF中解析）
  data;
  // 片段的二进制数据
  state = "init";
  fmp4Parser = new ho(!1);
  tracks = [];
  softDecoder;
  async load(s) {
    if (this.state = "loading", !this.data) {
      const d = await fetch(this.url);
      this.data = d.arrayBuffer();
    }
    const n = await this.data;
    if (this.tracks.length === 0) {
      this.tracks = this.fmp4Parser.parse(n);
      const d = `video/mp4; codecs="${this.tracks.map((u) => u.codec).join(", ")}"`;
      if (!s.initialized)
        if (MediaSource.isTypeSupported(d))
          s.init(d);
        else
          throw new Error(`Unsupported codec: ${d}`);
    }
    this.state === "loading" && (this.state = "buffering", await s.appendBuffer({ data: n, tracks: this.tracks }), this.state = "buffered");
  }
  async load2(s) {
    if (this.softDecoder = s, this.state === "init") {
      if (this.state = "loading", !this.data) {
        const _ = await fetch(this.url);
        this.data = _.arrayBuffer();
      }
      const u = await this.data;
      this.tracks = this.fmp4Parser.parse(u), this.state = "buffering";
    }
    const n = this.tracks.filter((u) => u.type === "video"), d = this.tracks.filter((u) => u.type === "audio");
    for (const u of n) {
      s.videoDecoder.state !== "configured" && (await s.videoDecoder.initialize(), await s.videoDecoder.configure({
        codec: u.codec.startsWith("avc1") ? "avc" : "hevc",
        description: u.codecInfo?.extraData
      }), s.canvas.width = u.width ?? 1920, s.canvas.height = u.height ?? 1080);
      let _ = this.virtualStartTime * 1e3;
      u.samples.forEach((E) => {
        s.decodeVideo({
          data: E.data,
          timestamp: _,
          type: E.keyFrame ? "key" : "delta"
        }), _ += E.duration ?? 0;
      });
    }
    for (const u of d) {
      s.audioDecoder.state !== "configured" && (await s.audioDecoder.initialize(), await s.audioDecoder.configure({
        codec: "aac",
        description: u.codecInfo?.extraData,
        numberOfChannels: u.channelCount ?? 2,
        sampleRate: u.sampleRate ?? 44100
      }));
      let _ = this.virtualStartTime * 1e3;
      u.samples.forEach((E) => {
        s.decodeAudio({
          data: E.data,
          timestamp: _,
          type: "key"
        }), _ += E.duration ?? 0;
      });
    }
    this.state = "buffered";
  }
  unBuffer() {
    this.state !== "init" && (this.state = "loaded", this.softDecoder && (this.softDecoder.videoBuffer = this.softDecoder.videoBuffer.filter(
      (s) => s.timestamp < this.virtualStartTime * 1e3 || s.timestamp >= this.virtualEndTime * 1e3
    ), this.softDecoder.audioBuffer = this.softDecoder.audioBuffer.filter(
      (s) => s.timestamp < this.virtualStartTime * 1e3 || s.timestamp >= this.virtualEndTime * 1e3
    )));
  }
}
class Ro {
  constructor(s) {
    this.mediaSource = s;
  }
  queue = [];
  // 排队
  removeQueue = [];
  currentWaiting;
  currentError = () => {
  };
  sourceBuffer;
  get initialized() {
    return !!this.sourceBuffer;
  }
  init(s) {
    console.log("init", s), this.sourceBuffer = this.mediaSource.addSourceBuffer(s), this.sourceBuffer.mode = "sequence", this.sourceBuffer.addEventListener("updateend", () => {
      if (this.currentWaiting?.(), this.removeQueue.length > 0) {
        const { start: n, end: d, resolve: u, reject: _ } = this.removeQueue.shift();
        this.sourceBuffer.remove(n, d), this.currentWaiting = u, this.currentError = _;
      } else if (this.queue.length > 0) {
        const { data: n, resolve: d, reject: u } = this.queue.shift();
        this.sourceBuffer.appendBuffer(n), this.currentWaiting = d, this.currentError = u;
      } else
        delete this.currentWaiting;
    }), this.sourceBuffer.addEventListener("error", (n) => {
      this.currentError(n);
    });
  }
  appendBuffer(s) {
    return this.currentWaiting ? new Promise((n, d) => {
      this.queue.push({ data: s.data, resolve: n, reject: d });
    }) : (this.sourceBuffer.appendBuffer(s.data), new Promise((n, d) => {
      this.currentWaiting = n, this.currentError = d;
    }));
  }
  remove(s, n) {
    return this.currentWaiting ? new Promise((d, u) => {
      this.removeQueue.push({ start: s, end: n, resolve: d, reject: u });
    }) : (this.sourceBuffer.remove(s, n), new Promise((d, u) => {
      this.currentWaiting = d, this.currentError = u;
    }));
  }
}
function xo(P, s) {
  const n = P.split(`
`), d = [];
  let u = 0, _ = 0, E = 0, $ = null;
  for (let y = 0; y < n.length; y++) {
    const g = n[y].trim();
    if (g.startsWith("#EXTINF:")) {
      const S = g.match(Do);
      if (S) {
        E = parseFloat(S[1]);
        const C = S[2] ? S[2].trim() : "";
        try {
          C ? $ = new Date(C) : $ = null;
        } catch {
          $ = null;
        }
      }
    } else if (!g.startsWith("#") && g !== "") {
      const S = new URL(g, s), C = u, I = u + E, H = new Fo(_, {
        url: S.toString(),
        duration: E,
        physicalTime: $
      });
      H.virtualStartTime = C, H.virtualEndTime = I, d.push(H), u += E, _++, $ = null;
    }
  }
  return { segments: d, totalDuration: u };
}
class Uo {
  constructor(s, n = { debug: !1 }) {
    this.video = s, this.debug = n.debug;
  }
  segments = [];
  totalDuration = 0;
  mediaSource = new MediaSource();
  sourceBufferProxy;
  position = 0;
  offset = 0;
  _offset = 0;
  windowSize = 2;
  currentSegment;
  urlSrouce;
  debug = !1;
  singleFmp4 = !1;
  softDecoder;
  updatePosition = () => {
    this.position = this.currentTime + this.offset, this.checkBuffer();
  };
  onWaiting = () => {
    const s = this.video.buffered;
    for (let n = 0; n < s.length; n++) {
      const d = s.start(n);
      this.currentTime >= d || (this.currentTime = d, this.video.play());
    }
  };
  async load(s) {
    console.log("load", s);
    const n = this.mediaSource, d = new URL(s);
    switch (d.pathname.split(".").pop()) {
      case "m3u8":
        this.singleFmp4 = !1;
        const u = await fetch(s).then((E) => E.text()), _ = xo(u, d.origin + d.pathname.split("/").slice(0, -1).join("/"));
        console.log("playlist", _), this.segments = _.segments, this.totalDuration = _.totalDuration, this.urlSrouce = URL.createObjectURL(n), this.video.src = this.urlSrouce, this.currentSegment = this.segments[0], this.sourceBufferProxy = new Ro(n), n.addEventListener("sourceopen", async () => {
          for (let E = 0; E < 2 && E < this.segments.length; E++)
            await this.appendSegment(this.segments[E]);
        }), n.addEventListener("sourceended", () => {
          this.video.pause();
        }), this.video.addEventListener("timeupdate", this.updatePosition), this.video.addEventListener("waiting", this.onWaiting);
        break;
    }
  }
  destroy() {
    this.video.pause(), this.video.src = "", this.video.removeEventListener("timeupdate", this.updatePosition), this.video.removeEventListener("waiting", this.onWaiting), this.mediaSource?.readyState === "open" && this.mediaSource.endOfStream(), this.urlSrouce && URL.revokeObjectURL(this.urlSrouce), this.softDecoder && this.softDecoder.dispose();
  }
  printSegments() {
    this.debug && console.table(this.segments.map((s) => ({
      state: s.state,
      virtualStartTime: s.virtualStartTime,
      virtualEndTime: s.virtualEndTime,
      duration: s.duration
    })));
  }
  checkBuffer() {
    if (!this.currentSegment)
      return;
    let s = "";
    for (let n = 0; n < this.video.buffered.length; n++) {
      const d = this.video.buffered.start(n).toFixed(2), u = this.video.buffered.end(n).toFixed(2);
      s += `[${d}-${u}] `;
    }
    if (this.debug && console.debug(
      `Time: ${this.video.currentTime.toFixed(2)}, Buffered: ${s}，BufferedLength: ${this.bufferedLength.toFixed(2)}`
    ), this.position >= this.currentSegment.virtualEndTime)
      if (this.segments.length > this.currentSegment.index + 1)
        this.bufferNext(), this.printSegments();
      else
        return;
  }
  async appendSegment(s) {
    if (this.softDecoder)
      await s.load2(this.softDecoder), this.printSegments();
    else
      return s.load(this.sourceBufferProxy).then(() => {
        this.printSegments();
      }).catch((n) => (console.error("appendSegment", n), this.softDecoder = new Ao("", { yuvMode: !0 }), this.video.srcObject = this.softDecoder.canvas.captureStream(), this.video.addEventListener("play", () => {
        this.softDecoder?.start();
      }), this.video.addEventListener("pause", () => {
        this.softDecoder?.stop();
      }), this.video.addEventListener("ended", () => {
        this.softDecoder?.stop();
      }), this.appendSegment(s).then(() => {
        this.softDecoder?.processInitialFrame();
      })));
  }
  get bufferedLength() {
    if (!this.currentSegment)
      return 0;
    let s = 0;
    for (let n = this.currentSegment.index; n < this.segments.length; n++)
      this.segments[n].state === "buffered" && (s += this.segments[n].duration);
    return s - (this.position - this.currentSegment.virtualStartTime);
  }
  bufferNext() {
    if (!this.currentSegment)
      return;
    this.currentSegment.unBuffer(), this.currentSegment = this.segments[this.currentSegment.index + 1];
    const s = this.segments[this.currentSegment.index + 1];
    s && this.appendSegment(s);
  }
  set currentTime(s) {
    this.softDecoder ? this._offset = s - this.softDecoder.getCurrentTime() / 1e3 : this.video.currentTime = s;
  }
  get currentTime() {
    return this.softDecoder ? this.softDecoder.getCurrentTime() / 1e3 + this._offset : this.video.currentTime;
  }
  async seek(s) {
    if (!this.currentSegment)
      return;
    const n = this.segments.find((y) => y.virtualEndTime > s);
    if (!n)
      return;
    const d = s - n.virtualStartTime, u = this.currentSegment.virtualEndTime - this.position, _ = this.segments[n.index + 1];
    if (this.softDecoder)
      return this.segments.forEach((y) => {
        y.unBuffer();
      }), this.softDecoder.videoBuffer = [], this.softDecoder.audioBuffer = [], await n.load2(this.softDecoder), _ && await this.appendSegment(_), this.softDecoder.seek(s), this.offset = s - this.currentTime, this.position = s, this.currentSegment = n, this.checkBuffer(), this.video.play();
    if (n.state === "buffered")
      return this.position = s, this.currentTime = s - this.offset, n.index === this.currentSegment.index + 1 && this.bufferNext(), this.video.play();
    this.segments.forEach((y) => {
      y.unBuffer();
    });
    const E = this.video.buffered.start(0), $ = this.video.buffered.end(this.video.buffered.length - 1);
    return await n.load(this.sourceBufferProxy), _ && await this.appendSegment(_), this.printSegments(), this.currentTime += d + u + _.duration, this.offset = s - this.currentTime, this.position = s, await this.sourceBufferProxy.remove(E, $), this.currentSegment = n, this.checkBuffer(), this.video.play();
  }
}
class Bo extends Wn {
  static styles = Yi`
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
  `;
  static properties = {
    src: { type: String },
    debug: { type: Boolean },
    isDragging: { type: Boolean, state: !0 },
    isHovering: { type: Boolean, state: !0 },
    playbackRate: { type: Number, state: !0 },
    isPlaying: { type: Boolean, state: !0 },
    currentPosition: { type: Number, state: !0 },
    totalDuration: { type: Number, state: !0 },
    showControls: { type: Boolean, state: !0 },
    volume: { type: Number, state: !0 },
    isMuted: { type: Boolean, state: !0 },
    showPlaybackRateMenu: { type: Boolean, state: !0 },
    showVolumeSlider: { type: Boolean, state: !0 },
    isFullscreen: { type: Boolean, state: !0 },
    isVolumeDragging: { type: Boolean, state: !0 },
    singleFmp4: { type: Boolean, state: !0 },
    isWideScreen: { type: Boolean, state: !0 }
  };
  constructor() {
    super(), this.src = void 0, this.debug = !1, this.isDragging = !1, this.isHovering = !1, this.playbackRate = 1, this.isPlaying = !1, this.currentPosition = 0, this.totalDuration = 0, this.showControls = !1, this.volume = 1, this.isMuted = !1, this.showPlaybackRateMenu = !1, this.showVolumeSlider = !1, this.isFullscreen = !1, this.isVolumeDragging = !1, this.singleFmp4 = !1, this.isWideScreen = !0;
  }
  // DOM references - using private fields instead of decorators
  _video;
  _timelineRef;
  _progressRef;
  _bufferRef;
  _playerRef;
  // Internal state
  timeline;
  hideControlsTimeoutId = null;
  playbackRates = [0.5, 1, 1.5, 2, 3, 4];
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
    super.disconnectedCallback(), this.removeEventListener("keydown", this.handleKeyDown), this.timeline && this.timeline.destroy(), this.video && (this.video.removeEventListener("timeupdate", this.updateTimelineUI), this.video.removeEventListener("play", () => {
      this.isPlaying = !0;
    }), this.video.removeEventListener("pause", () => {
      this.isPlaying = !1;
    }));
  }
  firstUpdated() {
    this.video && (this.video.addEventListener("timeupdate", this.updateTimelineUI), this.video.addEventListener("play", () => {
      this.isPlaying = !0;
    }), this.video.addEventListener("pause", () => {
      this.isPlaying = !1;
    }), this.video.volume = this.volume), this.playerRef && (new ResizeObserver(() => {
      this.checkScreenWidth();
    }).observe(this.playerRef), this.checkScreenWidth()), this.src && this.setupTimeline();
  }
  updated(s) {
    s.has("src") && this.src && this.setupTimeline();
  }
  // Helper methods
  formatTime(s) {
    const n = Math.floor(s / 3600), d = Math.floor(s % 3600 / 60), u = Math.floor(s % 60);
    return n > 0 ? `${n.toString().padStart(2, "0")}:${d.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}` : `${d.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}`;
  }
  checkScreenWidth() {
    this.playerRef && (this.isWideScreen = this.playerRef.offsetWidth >= 400);
  }
  setupTimeline() {
    if (this.timeline && this.timeline.destroy(), !this.src || !this.video)
      return;
    const s = new Uo(this.video, { debug: this.debug });
    this.timeline = s, this.currentPosition = 0, this.totalDuration = 0, s.load(this.src).then(() => {
      this.singleFmp4 = s.singleFmp4, this.totalDuration = s.totalDuration, this.dispatchEvent(new CustomEvent("segments", {
        detail: s.segments,
        bubbles: !0,
        composed: !0
      }));
    });
  }
  // Event handlers
  updateTimelineUI = () => {
    if (!this.timelineRef || !this.progressRef || !this.bufferRef || !this.timeline)
      return;
    this.currentPosition = this.timeline.position, this.totalDuration !== this.timeline.totalDuration && (this.totalDuration = this.timeline.totalDuration);
    const s = this.timeline.position / this.totalDuration * 100;
    this.progressRef.style.width = `${s}%`;
    const n = (this.timeline.bufferedLength + this.timeline.position) / this.totalDuration * 100;
    this.bufferRef.style.width = `${n}%`, this.dispatchEvent(new CustomEvent("timeupdate", {
      detail: this.timeline.position,
      bubbles: !0,
      composed: !0
    })), this.isPlaying = !this.video?.paused;
  };
  handleTimelineClick(s) {
    if (!this.timelineRef || !this.timeline)
      return;
    const n = this.timelineRef.getBoundingClientRect(), u = (s.clientX - n.left) / n.width * this.totalDuration;
    this.timeline.seek(u), this.currentPosition = u;
  }
  startDrag(s) {
    this.isDragging = !0, this.handleDrag(s), document.addEventListener("mousemove", this.handleDrag), document.addEventListener("mouseup", this.stopDrag);
  }
  handleDrag = (s) => {
    if (!this.isDragging || !this.timelineRef || !this.timeline)
      return;
    const n = this.timelineRef.getBoundingClientRect(), d = (s.clientX - n.left) / n.width, u = Math.max(
      0,
      Math.min(d * this.totalDuration, this.totalDuration)
    );
    this.currentPosition = u;
    const _ = u / this.totalDuration * 100;
    this.progressRef && (this.progressRef.style.width = `${_}%`);
  };
  stopDrag = (s) => {
    this.isDragging && (this.handleTimelineClick(s), document.removeEventListener("mousemove", this.handleDrag), document.removeEventListener("mouseup", this.stopDrag), this.isDragging = !1);
  };
  onTimelineMouseEnter() {
    this.isHovering = !0;
  }
  onTimelineMouseLeave() {
    this.isHovering = !1;
  }
  changePlaybackRate(s) {
    this.video && (this.playbackRate = s, this.video.playbackRate = s, this.showPlaybackRateMenu = !1);
  }
  togglePlaybackRateMenu() {
    this.showPlaybackRateMenu = !this.showPlaybackRateMenu;
  }
  togglePlay() {
    this.video && (this.video.paused ? (this.video.play(), this.isPlaying = !0) : (this.video.pause(), this.isPlaying = !1));
  }
  toggleMute() {
    this.video && (this.isMuted = !this.isMuted, this.video.muted = this.isMuted);
  }
  handleVolumeChange(s) {
    if (!this.video)
      return;
    const d = s.currentTarget.getBoundingClientRect();
    this.updateVolumeFromPosition(s.clientY, d);
  }
  updateVolumeFromPosition(s, n) {
    const d = n.height, u = 1 - Math.max(0, Math.min(1, (s - n.top) / d)), _ = Math.max(0, Math.min(1, u));
    this.volume = _, this.video && (this.video.volume = _, this.isMuted = _ === 0, this.video.muted = _ === 0);
  }
  startVolumeDrag(s) {
    s.preventDefault(), this.isVolumeDragging = !0;
    const d = s.currentTarget.getBoundingClientRect();
    this.updateVolumeFromPosition(s.clientY, d);
    const u = (E) => {
      this.isVolumeDragging && this.updateVolumeFromPosition(E.clientY, d);
    };
    document.addEventListener("mousemove", u);
    const _ = () => {
      this.isVolumeDragging = !1, document.removeEventListener("mousemove", u), document.removeEventListener("mouseup", _), setTimeout(() => {
        document.querySelector(".volume-control:hover") || (this.showVolumeSlider = !1);
      }, 500);
    };
    document.addEventListener("mouseup", _);
  }
  seekForward() {
    if (!this.timeline)
      return;
    const s = Math.min(this.timeline.position + 10, this.totalDuration);
    this.timeline.seek(s), this.currentPosition = s;
  }
  seekBackward() {
    if (!this.timeline)
      return;
    const s = Math.max(this.timeline.position - 10, 0);
    this.timeline.seek(s), this.currentPosition = s;
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
  handleKeyDown = (s) => {
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
  };
  // Public methods
  seek(s) {
    this.timeline && (this.timeline.seek(s), this.currentPosition = s);
  }
  // Render methods
  render() {
    const s = this.formatTime(this.currentPosition), n = this.formatTime(this.totalDuration);
    return Xe`
      <div
        class="video-player"
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
        @mousemove=${this.handleMouseMove}
      >
        <!-- Video element -->
        <video @click=${this.togglePlay} .controls=${this.singleFmp4}></video>

        <!-- Custom timeline UI -->
        ${this.timeline && !this.singleFmp4 ? Xe`
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
                @mousedown=${(d) => {
      d.stopPropagation(), this.startDrag(d);
    }}
              ></div>
            </div>

            <!-- Controls -->
            <div class="controls-container">
              <!-- Left side controls -->
              <div class="controls-left">
                <!-- Play/Pause Button -->
                <button class="control-button" @click=${this.togglePlay}>
                  ${this.isPlaying ? Xe`<i class="icon-pause">▮▮</i>` : Xe`<i class="icon-play">▶</i>`}
                </button>

                <!-- Rewind Button - Only visible on wide screens -->
                ${this.isWideScreen ? Xe`
                  <button class="control-button" @click=${this.seekBackward}>
                    <i class="icon-backward">◀◀</i>
                  </button>
                ` : ""}

                <!-- Fast Forward Button - Only visible on wide screens -->
                ${this.isWideScreen ? Xe`
                  <button class="control-button" @click=${this.seekForward}>
                    <i class="icon-forward">▶▶</i>
                  </button>
                ` : ""}

                <!-- Current time display -->
                <div class="time-display">
                  ${s} / ${n}
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
                  ${this.showPlaybackRateMenu ? Xe`
                    <div class="playback-rate-menu">
                      ${this.playbackRates.map((d) => Xe`
                        <button
                          @click=${() => this.changePlaybackRate(d)}
                          class="playback-rate-option ${this.playbackRate === d ? "active" : ""}"
                        >
                          ${d}x
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
                    ${this.isMuted || this.volume === 0 ? Xe`<i class="icon-volume-mute"></i>` : this.volume < 0.5 ? Xe`<i class="icon-volume-low"></i>` : Xe`<i class="icon-volume-high"></i>`}
                  </button>
                  ${this.showVolumeSlider ? Xe`
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
                  ${this.isFullscreen ? Xe`<i class="icon-fullscreen-exit">⤓</i>` : Xe`<i class="icon-fullscreen">⤢</i>`}
                </button>
              </div>
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }
}
customElements.define("m7s-vod-player", Bo);
export {
  Bo as VideoPlayer
};
