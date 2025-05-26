/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ri = globalThis, bi = ri.ShadowRoot && (ri.ShadyCSS === void 0 || ri.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $i = Symbol(), Ci = /* @__PURE__ */ new WeakMap();
let Li = class {
  constructor(a, i, h) {
    if (this._$cssResult$ = !0, h !== $i)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = a, this.t = i;
  }
  get styleSheet() {
    let a = this.o;
    const i = this.t;
    if (bi && a === void 0) {
      const h = i !== void 0 && i.length === 1;
      h && (a = Ci.get(i)), a === void 0 && ((this.o = a = new CSSStyleSheet()).replaceSync(this.cssText), h && Ci.set(i, a));
    }
    return a;
  }
  toString() {
    return this.cssText;
  }
};
const qi = (T) => new Li(typeof T == "string" ? T : T + "", void 0, $i), Gi = (T, ...a) => {
  const i = T.length === 1 ? T[0] : a.reduce((h, c, _) => h + ((b) => {
    if (b._$cssResult$ === !0)
      return b.cssText;
    if (typeof b == "number")
      return b;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + b + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(c) + T[_ + 1], T[0]);
  return new Li(i, T, $i);
}, Xi = (T, a) => {
  if (bi)
    T.adoptedStyleSheets = a.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else
    for (const i of a) {
      const h = document.createElement("style"), c = ri.litNonce;
      c !== void 0 && h.setAttribute("nonce", c), h.textContent = i.cssText, T.appendChild(h);
    }
}, Si = bi ? (T) => T : (T) => T instanceof CSSStyleSheet ? ((a) => {
  let i = "";
  for (const h of a.cssRules)
    i += h.cssText;
  return qi(i);
})(T) : T;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ki, defineProperty: Qi, getOwnPropertyDescriptor: Yi, getOwnPropertyNames: Zi, getOwnPropertySymbols: Ji, getPrototypeOf: eo } = Object, oi = globalThis, Ai = oi.trustedTypes, to = Ai ? Ai.emptyScript : "", ro = oi.reactiveElementPolyfillSupport, Wn = (T, a) => T, Ei = { toAttribute(T, a) {
  switch (a) {
    case Boolean:
      T = T ? to : null;
      break;
    case Object:
    case Array:
      T = T == null ? T : JSON.stringify(T);
  }
  return T;
}, fromAttribute(T, a) {
  let i = T;
  switch (a) {
    case Boolean:
      i = T !== null;
      break;
    case Number:
      i = T === null ? null : Number(T);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(T);
      } catch {
        i = null;
      }
  }
  return i;
} }, ji = (T, a) => !Ki(T, a), Di = { attribute: !0, type: String, converter: Ei, reflect: !1, useDefault: !1, hasChanged: ji };
Symbol.metadata ??= Symbol("metadata"), oi.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let zr = class extends HTMLElement {
  static addInitializer(a) {
    this._$Ei(), (this.l ??= []).push(a);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(a, i = Di) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(a) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(a, i), !i.noAccessor) {
      const h = Symbol(), c = this.getPropertyDescriptor(a, h, i);
      c !== void 0 && Qi(this.prototype, a, c);
    }
  }
  static getPropertyDescriptor(a, i, h) {
    const { get: c, set: _ } = Yi(this.prototype, a) ?? { get() {
      return this[i];
    }, set(b) {
      this[i] = b;
    } };
    return { get: c, set(b) {
      const P = c?.call(this);
      _?.call(this, b), this.requestUpdate(a, P, h);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(a) {
    return this.elementProperties.get(a) ?? Di;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Wn("elementProperties")))
      return;
    const a = eo(this);
    a.finalize(), a.l !== void 0 && (this.l = [...a.l]), this.elementProperties = new Map(a.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Wn("finalized")))
      return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Wn("properties"))) {
      const i = this.properties, h = [...Zi(i), ...Ji(i)];
      for (const c of h)
        this.createProperty(c, i[c]);
    }
    const a = this[Symbol.metadata];
    if (a !== null) {
      const i = litPropertyMetadata.get(a);
      if (i !== void 0)
        for (const [h, c] of i)
          this.elementProperties.set(h, c);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, h] of this.elementProperties) {
      const c = this._$Eu(i, h);
      c !== void 0 && this._$Eh.set(c, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(a) {
    const i = [];
    if (Array.isArray(a)) {
      const h = new Set(a.flat(1 / 0).reverse());
      for (const c of h)
        i.unshift(Si(c));
    } else
      a !== void 0 && i.push(Si(a));
    return i;
  }
  static _$Eu(a, i) {
    const h = i.attribute;
    return h === !1 ? void 0 : typeof h == "string" ? h : typeof a == "string" ? a.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((a) => this.enableUpdating = a), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((a) => a(this));
  }
  addController(a) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(a), this.renderRoot !== void 0 && this.isConnected && a.hostConnected?.();
  }
  removeController(a) {
    this._$EO?.delete(a);
  }
  _$E_() {
    const a = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const h of i.keys())
      this.hasOwnProperty(h) && (a.set(h, this[h]), delete this[h]);
    a.size > 0 && (this._$Ep = a);
  }
  createRenderRoot() {
    const a = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Xi(a, this.constructor.elementStyles), a;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((a) => a.hostConnected?.());
  }
  enableUpdating(a) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((a) => a.hostDisconnected?.());
  }
  attributeChangedCallback(a, i, h) {
    this._$AK(a, h);
  }
  _$ET(a, i) {
    const h = this.constructor.elementProperties.get(a), c = this.constructor._$Eu(a, h);
    if (c !== void 0 && h.reflect === !0) {
      const _ = (h.converter?.toAttribute !== void 0 ? h.converter : Ei).toAttribute(i, h.type);
      this._$Em = a, _ == null ? this.removeAttribute(c) : this.setAttribute(c, _), this._$Em = null;
    }
  }
  _$AK(a, i) {
    const h = this.constructor, c = h._$Eh.get(a);
    if (c !== void 0 && this._$Em !== c) {
      const _ = h.getPropertyOptions(c), b = typeof _.converter == "function" ? { fromAttribute: _.converter } : _.converter?.fromAttribute !== void 0 ? _.converter : Ei;
      this._$Em = c, this[c] = b.fromAttribute(i, _.type) ?? this._$Ej?.get(c) ?? null, this._$Em = null;
    }
  }
  requestUpdate(a, i, h) {
    if (a !== void 0) {
      const c = this.constructor, _ = this[a];
      if (h ??= c.getPropertyOptions(a), !((h.hasChanged ?? ji)(_, i) || h.useDefault && h.reflect && _ === this._$Ej?.get(a) && !this.hasAttribute(c._$Eu(a, h))))
        return;
      this.C(a, i, h);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(a, i, { useDefault: h, reflect: c, wrapped: _ }, b) {
    h && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(a) && (this._$Ej.set(a, b ?? i ?? this[a]), _ !== !0 || b !== void 0) || (this._$AL.has(a) || (this.hasUpdated || h || (i = void 0), this._$AL.set(a, i)), c === !0 && this._$Em !== a && (this._$Eq ??= /* @__PURE__ */ new Set()).add(a));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const a = this.scheduleUpdate();
    return a != null && await a, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [c, _] of this._$Ep)
          this[c] = _;
        this._$Ep = void 0;
      }
      const h = this.constructor.elementProperties;
      if (h.size > 0)
        for (const [c, _] of h) {
          const { wrapped: b } = _, P = this[c];
          b !== !0 || this._$AL.has(c) || P === void 0 || this.C(c, void 0, _, P);
        }
    }
    let a = !1;
    const i = this._$AL;
    try {
      a = this.shouldUpdate(i), a ? (this.willUpdate(i), this._$EO?.forEach((h) => h.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (h) {
      throw a = !1, this._$EM(), h;
    }
    a && this._$AE(i);
  }
  willUpdate(a) {
  }
  _$AE(a) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(a)), this.updated(a);
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
  shouldUpdate(a) {
    return !0;
  }
  update(a) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(a) {
  }
  firstUpdated(a) {
  }
};
zr.elementStyles = [], zr.shadowRootOptions = { mode: "open" }, zr[Wn("elementProperties")] = /* @__PURE__ */ new Map(), zr[Wn("finalized")] = /* @__PURE__ */ new Map(), ro?.({ ReactiveElement: zr }), (oi.reactiveElementVersions ??= []).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pi = globalThis, ii = Pi.trustedTypes, Fi = ii ? ii.createPolicy("lit-html", { createHTML: (T) => T }) : void 0, Hi = "$lit$", Zt = `lit$${Math.random().toFixed(9).slice(2)}$`, zi = "?" + Zt, no = `<${zi}>`, Pr = document, Xn = () => Pr.createComment(""), Kn = (T) => T === null || typeof T != "object" && typeof T != "function", Ti = Array.isArray, io = (T) => Ti(T) || typeof T?.[Symbol.iterator] == "function", wi = `[ 	
\f\r]`, zn = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ri = /-->/g, xi = />/g, br = RegExp(`>|${wi}(?:([^\\s"'>=/]+)(${wi}*=${wi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ui = /'/g, Bi = /"/g, Wi = /^(?:script|style|textarea|title)$/i, oo = (T) => (a, ...i) => ({ _$litType$: T, strings: a, values: i }), Ke = oo(1), Wr = Symbol.for("lit-noChange"), De = Symbol.for("lit-nothing"), Mi = /* @__PURE__ */ new WeakMap(), $r = Pr.createTreeWalker(Pr, 129);
function Vi(T, a) {
  if (!Ti(T) || !T.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return Fi !== void 0 ? Fi.createHTML(a) : a;
}
const so = (T, a) => {
  const i = T.length - 1, h = [];
  let c, _ = a === 2 ? "<svg>" : a === 3 ? "<math>" : "", b = zn;
  for (let P = 0; P < i; P++) {
    const y = T[P];
    let E, D, k = -1, j = 0;
    for (; j < y.length && (b.lastIndex = j, D = b.exec(y), D !== null); )
      j = b.lastIndex, b === zn ? D[1] === "!--" ? b = Ri : D[1] !== void 0 ? b = xi : D[2] !== void 0 ? (Wi.test(D[2]) && (c = RegExp("</" + D[2], "g")), b = br) : D[3] !== void 0 && (b = br) : b === br ? D[0] === ">" ? (b = c ?? zn, k = -1) : D[1] === void 0 ? k = -2 : (k = b.lastIndex - D[2].length, E = D[1], b = D[3] === void 0 ? br : D[3] === '"' ? Bi : Ui) : b === Bi || b === Ui ? b = br : b === Ri || b === xi ? b = zn : (b = br, c = void 0);
    const z = b === br && T[P + 1].startsWith("/>") ? " " : "";
    _ += b === zn ? y + no : k >= 0 ? (h.push(E), y.slice(0, k) + Hi + y.slice(k) + Zt + z) : y + Zt + (k === -2 ? P : z);
  }
  return [Vi(T, _ + (T[i] || "<?>") + (a === 2 ? "</svg>" : a === 3 ? "</math>" : "")), h];
};
class Qn {
  constructor({ strings: a, _$litType$: i }, h) {
    let c;
    this.parts = [];
    let _ = 0, b = 0;
    const P = a.length - 1, y = this.parts, [E, D] = so(a, i);
    if (this.el = Qn.createElement(E, h), $r.currentNode = this.el.content, i === 2 || i === 3) {
      const k = this.el.content.firstChild;
      k.replaceWith(...k.childNodes);
    }
    for (; (c = $r.nextNode()) !== null && y.length < P; ) {
      if (c.nodeType === 1) {
        if (c.hasAttributes())
          for (const k of c.getAttributeNames())
            if (k.endsWith(Hi)) {
              const j = D[b++], z = c.getAttribute(k).split(Zt), W = /([.?@])?(.*)/.exec(j);
              y.push({ type: 1, index: _, name: W[2], strings: z, ctor: W[1] === "." ? uo : W[1] === "?" ? lo : W[1] === "@" ? co : si }), c.removeAttribute(k);
            } else
              k.startsWith(Zt) && (y.push({ type: 6, index: _ }), c.removeAttribute(k));
        if (Wi.test(c.tagName)) {
          const k = c.textContent.split(Zt), j = k.length - 1;
          if (j > 0) {
            c.textContent = ii ? ii.emptyScript : "";
            for (let z = 0; z < j; z++)
              c.append(k[z], Xn()), $r.nextNode(), y.push({ type: 2, index: ++_ });
            c.append(k[j], Xn());
          }
        }
      } else if (c.nodeType === 8)
        if (c.data === zi)
          y.push({ type: 2, index: _ });
        else {
          let k = -1;
          for (; (k = c.data.indexOf(Zt, k + 1)) !== -1; )
            y.push({ type: 7, index: _ }), k += Zt.length - 1;
        }
      _++;
    }
  }
  static createElement(a, i) {
    const h = Pr.createElement("template");
    return h.innerHTML = a, h;
  }
}
function Vr(T, a, i = T, h) {
  if (a === Wr)
    return a;
  let c = h !== void 0 ? i._$Co?.[h] : i._$Cl;
  const _ = Kn(a) ? void 0 : a._$litDirective$;
  return c?.constructor !== _ && (c?._$AO?.(!1), _ === void 0 ? c = void 0 : (c = new _(T), c._$AT(T, i, h)), h !== void 0 ? (i._$Co ??= [])[h] = c : i._$Cl = c), c !== void 0 && (a = Vr(T, c._$AS(T, a.values), c, h)), a;
}
class ao {
  constructor(a, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = a, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(a) {
    const { el: { content: i }, parts: h } = this._$AD, c = (a?.creationScope ?? Pr).importNode(i, !0);
    $r.currentNode = c;
    let _ = $r.nextNode(), b = 0, P = 0, y = h[0];
    for (; y !== void 0; ) {
      if (b === y.index) {
        let E;
        y.type === 2 ? E = new Yn(_, _.nextSibling, this, a) : y.type === 1 ? E = new y.ctor(_, y.name, y.strings, this, a) : y.type === 6 && (E = new fo(_, this, a)), this._$AV.push(E), y = h[++P];
      }
      b !== y?.index && (_ = $r.nextNode(), b++);
    }
    return $r.currentNode = Pr, c;
  }
  p(a) {
    let i = 0;
    for (const h of this._$AV)
      h !== void 0 && (h.strings !== void 0 ? (h._$AI(a, h, i), i += h.strings.length - 2) : h._$AI(a[i])), i++;
  }
}
class Yn {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(a, i, h, c) {
    this.type = 2, this._$AH = De, this._$AN = void 0, this._$AA = a, this._$AB = i, this._$AM = h, this.options = c, this._$Cv = c?.isConnected ?? !0;
  }
  get parentNode() {
    let a = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && a?.nodeType === 11 && (a = i.parentNode), a;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(a, i = this) {
    a = Vr(this, a, i), Kn(a) ? a === De || a == null || a === "" ? (this._$AH !== De && this._$AR(), this._$AH = De) : a !== this._$AH && a !== Wr && this._(a) : a._$litType$ !== void 0 ? this.$(a) : a.nodeType !== void 0 ? this.T(a) : io(a) ? this.k(a) : this._(a);
  }
  O(a) {
    return this._$AA.parentNode.insertBefore(a, this._$AB);
  }
  T(a) {
    this._$AH !== a && (this._$AR(), this._$AH = this.O(a));
  }
  _(a) {
    this._$AH !== De && Kn(this._$AH) ? this._$AA.nextSibling.data = a : this.T(Pr.createTextNode(a)), this._$AH = a;
  }
  $(a) {
    const { values: i, _$litType$: h } = a, c = typeof h == "number" ? this._$AC(a) : (h.el === void 0 && (h.el = Qn.createElement(Vi(h.h, h.h[0]), this.options)), h);
    if (this._$AH?._$AD === c)
      this._$AH.p(i);
    else {
      const _ = new ao(c, this), b = _.u(this.options);
      _.p(i), this.T(b), this._$AH = _;
    }
  }
  _$AC(a) {
    let i = Mi.get(a.strings);
    return i === void 0 && Mi.set(a.strings, i = new Qn(a)), i;
  }
  k(a) {
    Ti(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let h, c = 0;
    for (const _ of a)
      c === i.length ? i.push(h = new Yn(this.O(Xn()), this.O(Xn()), this, this.options)) : h = i[c], h._$AI(_), c++;
    c < i.length && (this._$AR(h && h._$AB.nextSibling, c), i.length = c);
  }
  _$AR(a = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); a && a !== this._$AB; ) {
      const h = a.nextSibling;
      a.remove(), a = h;
    }
  }
  setConnected(a) {
    this._$AM === void 0 && (this._$Cv = a, this._$AP?.(a));
  }
}
class si {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(a, i, h, c, _) {
    this.type = 1, this._$AH = De, this._$AN = void 0, this.element = a, this.name = i, this._$AM = c, this.options = _, h.length > 2 || h[0] !== "" || h[1] !== "" ? (this._$AH = Array(h.length - 1).fill(new String()), this.strings = h) : this._$AH = De;
  }
  _$AI(a, i = this, h, c) {
    const _ = this.strings;
    let b = !1;
    if (_ === void 0)
      a = Vr(this, a, i, 0), b = !Kn(a) || a !== this._$AH && a !== Wr, b && (this._$AH = a);
    else {
      const P = a;
      let y, E;
      for (a = _[0], y = 0; y < _.length - 1; y++)
        E = Vr(this, P[h + y], i, y), E === Wr && (E = this._$AH[y]), b ||= !Kn(E) || E !== this._$AH[y], E === De ? a = De : a !== De && (a += (E ?? "") + _[y + 1]), this._$AH[y] = E;
    }
    b && !c && this.j(a);
  }
  j(a) {
    a === De ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, a ?? "");
  }
}
class uo extends si {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(a) {
    this.element[this.name] = a === De ? void 0 : a;
  }
}
class lo extends si {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(a) {
    this.element.toggleAttribute(this.name, !!a && a !== De);
  }
}
class co extends si {
  constructor(a, i, h, c, _) {
    super(a, i, h, c, _), this.type = 5;
  }
  _$AI(a, i = this) {
    if ((a = Vr(this, a, i, 0) ?? De) === Wr)
      return;
    const h = this._$AH, c = a === De && h !== De || a.capture !== h.capture || a.once !== h.once || a.passive !== h.passive, _ = a !== De && (h === De || c);
    c && this.element.removeEventListener(this.name, this, h), _ && this.element.addEventListener(this.name, this, a), this._$AH = a;
  }
  handleEvent(a) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, a) : this._$AH.handleEvent(a);
  }
}
class fo {
  constructor(a, i, h) {
    this.element = a, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = h;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(a) {
    Vr(this, a);
  }
}
const ho = Pi.litHtmlPolyfillSupport;
ho?.(Qn, Yn), (Pi.litHtmlVersions ??= []).push("3.3.0");
const po = (T, a, i) => {
  const h = i?.renderBefore ?? a;
  let c = h._$litPart$;
  if (c === void 0) {
    const _ = i?.renderBefore ?? null;
    h._$litPart$ = c = new Yn(a.insertBefore(Xn(), _), _, void 0, i ?? {});
  }
  return c._$AI(T), c;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ki = globalThis;
class Vn extends zr {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const a = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= a.firstChild, a;
  }
  update(a) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(a), this._$Do = po(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Wr;
  }
}
Vn._$litElement$ = !0, Vn.finalized = !0, ki.litElementHydrateSupport?.({ LitElement: Vn });
const vo = ki.litElementPolyfillSupport;
vo?.({ LitElement: Vn });
(ki.litElementVersions ??= []).push("4.2.0");
class mo {
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
  constructor(a) {
    this.id = a, this.type = "", this.codec = "", this.timescale = 0, this.duration = 0, this.language = "und", this.samples = [];
  }
  addSample(a) {
    this.samples.push(a);
  }
  addSamples(a) {
    this.samples.push(...a);
  }
  getSampleCount() {
    return this.samples.length;
  }
  getTotalDuration() {
    return this.samples.reduce((a, i) => a + (i.duration || 0), 0);
  }
}
class go {
  debug;
  HEADER_SIZE = 8;
  // box header size in bytes
  sourceUint8Array = null;
  tracks = /* @__PURE__ */ new Map();
  /**
   * Create a new Fmp4Parser instance
   * @param debug Whether to enable debug output
   */
  constructor(a = !1) {
    this.debug = a;
  }
  /**
   * Set debug mode
   * @param debug Whether to enable debug output
   */
  setDebug(a) {
    this.debug = a;
  }
  /**
   * Parse an fmp4 buffer
   * @param buffer ArrayBuffer containing fmp4 data
   * @returns Array of tracks
   */
  parse(a) {
    this.sourceUint8Array = new Uint8Array(a), this.tracks.clear();
    const i = [];
    let h = 0;
    for (; h < a.byteLength; ) {
      const c = this.parseBox(a, h);
      if (!c)
        break;
      i.push(c), h = c.end, this.debug && this.logBox(c);
    }
    return this.processTrackInfo(i), this.processSampleData(i), this.processCodecInfo(i), Array.from(this.tracks.values());
  }
  /**
   * Process track information from moov box
   */
  processTrackInfo(a) {
    const i = a.find((c) => c.type === "moov");
    if (!i?.children)
      return;
    const h = i.children.filter((c) => c.type === "trak");
    for (const c of h) {
      if (!c.children)
        continue;
      const _ = this.findBox(c, "tkhd");
      if (!_?.data)
        continue;
      const b = _.data.trackID, P = new mo(b), y = this.findBox(c, "mdia");
      if (!y?.children)
        continue;
      const E = this.findBox(y, "hdlr");
      E?.data && (P.type = E.data.handlerType === "vide" ? "video" : E.data.handlerType === "soun" ? "audio" : "unknown");
      const D = this.findBox(y, "mdhd");
      D?.data && (P.timescale = D.data.timescale, P.duration = Number(D.data.duration), P.language = D.data.language);
      const k = this.findBox(c, "stsd");
      if (k?.data?.entries?.[0]) {
        const j = k.data.entries[0];
        j.data && (P.type === "video" ? (P.width = j.data.width, P.height = j.data.height) : P.type === "audio" && (P.channelCount = j.data.channelCount, P.sampleRate = j.data.sampleRate));
      }
      this.tracks.set(b, P);
    }
  }
  /**
   * Process codec information for all tracks
   */
  processCodecInfo(a) {
    const i = this.generateCodecStrings(a);
    for (const h of this.tracks.values()) {
      const c = i.find(
        (_) => h.type === "video" && _.mimeType === "video/mp4" || h.type === "audio" && _.mimeType === "audio/mp4"
      );
      c && (h.codecInfo = c, h.codec = c.codecString);
    }
  }
  /**
   * Find a box of specific type within a parent box
   */
  findBox(a, i) {
    if (a.children)
      return a.children.find((h) => h.type === i);
  }
  /**
   * Process sample data for all trun boxes
   */
  processSampleData(a) {
    for (let i = 0; i < a.length; i++)
      if (a[i].type === "moof" && i + 1 < a.length && a[i + 1].type === "mdat") {
        const h = a[i], c = a[i + 1];
        if (h.children)
          for (const _ of h.children)
            _.type === "traf" && this.processTrafBox(_, h.start, c);
      }
  }
  /**
   * Process a traf box to extract sample data
   */
  processTrafBox(a, i, h) {
    if (!a.children)
      return;
    let c = null, _ = null;
    for (const k of a.children)
      k.type === "tfhd" ? c = k : k.type === "trun" && (_ = k);
    if (!c?.data || !_?.data)
      return;
    const b = c.data.trackID, P = this.tracks.get(b);
    if (!P)
      return;
    const y = _.data;
    if (!y.samples || y.dataOffset === void 0)
      return;
    const E = i + y.dataOffset;
    if (E < h.start + this.HEADER_SIZE || E >= h.end) {
      this.debug && console.warn(`Data offset ${E} is outside mdat box range`);
      return;
    }
    let D = E;
    for (const k of y.samples) {
      const j = k.size || c.data.defaultSampleSize || 0;
      if (j <= 0)
        continue;
      const z = D, W = z + j;
      W <= h.end && this.sourceUint8Array && (k.dataStart = z, k.dataEnd = W, k.data = this.sourceUint8Array.subarray(z, W), P.addSample(k)), D += j;
    }
  }
  /**
   * Parse a single box from the buffer
   * @param buffer ArrayBuffer containing fmp4 data
   * @param offset Offset to start parsing from
   * @returns Parsed box or null if the buffer is too small
   */
  parseBox(a, i) {
    if (i + this.HEADER_SIZE > a.byteLength)
      return null;
    const c = new DataView(a).getUint32(i, !1), _ = new Uint8Array(a, i + 4, 4), b = String.fromCharCode(..._), P = i, y = i + c, E = {
      type: b,
      size: c,
      start: P,
      end: y
    };
    return this.isContainerBox(b) ? E.children = this.parseChildren(a, i + this.HEADER_SIZE, y) : E.data = this.parseBoxData(a, b, i + this.HEADER_SIZE, y), E;
  }
  /**
   * Parse children boxes within a container box
   * @param buffer ArrayBuffer containing fmp4 data
   * @param offset Start offset for children
   * @param end End offset for children
   * @returns Array of child boxes
   */
  parseChildren(a, i, h) {
    const c = [];
    let _ = i;
    for (; _ < h; ) {
      const b = this.parseBox(a, _);
      if (!b)
        break;
      c.push(b), _ = b.end;
    }
    return c;
  }
  /**
   * Parse box data based on box type
   */
  parseBoxData(a, i, h, c) {
    if (c - h <= 0)
      return null;
    switch (i) {
      case "ftyp":
        return this.parseFtypBox(a, h, c);
      case "mvhd":
        return this.parseMvhdBox(a, h, c);
      case "mdhd":
        return this.parseMdhdBox(a, h, c);
      case "hdlr":
        return this.parseHdlrBox(a, h, c);
      case "tkhd":
        return this.parseTkhdBox(a, h, c);
      case "elst":
        return this.parseElstBox(a, h, c);
      case "moof":
      case "mfhd":
        return this.parseMfhdBox(a, h, c);
      case "tfhd":
        return this.parseTfhdBox(a, h, c);
      case "tfdt":
        return this.parseTfdtBox(a, h, c);
      case "trun":
        return this.parseTrunBox(a, h, c);
      case "mdat":
        return this.parseMdatBox(a, h, c);
      case "stsd":
        return this.parseStsdBox(a, h, c);
      case "avc1":
      case "avc3":
        return this.parseAvcBox(a, h, c);
      case "hev1":
      case "hvc1":
        return this.parseHevcBox(a, h, c);
      case "mp4a":
        return this.parseMp4aBox(a, h, c);
      case "avcC":
        return this.parseAvcCBox(a, h, c);
      case "hvcC":
        return this.parseHvcCBox(a, h, c);
      case "esds":
        return this.parseEsdsBox(a, h, c);
      default:
        return new Uint8Array(a.slice(h, c));
    }
  }
  /**
   * Parse 'mdat' box data
   */
  parseMdatBox(a, i, h) {
    return {
      dataSize: h - i,
      dataOffset: i
    };
  }
  /**
   * Check if a box is a container box
   * @param type Box type
   * @returns True if the box is a container box
   */
  isContainerBox(a) {
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
    ].includes(a);
  }
  /**
   * Parse 'ftyp' box data
   */
  parseFtypBox(a, i, h) {
    const c = new DataView(a), _ = this.readFourCC(a, i), b = c.getUint32(i + 4, !1), P = [];
    for (let y = i + 8; y < h; y += 4)
      P.push(this.readFourCC(a, y));
    return {
      majorBrand: _,
      minorVersion: b,
      compatibleBrands: P
    };
  }
  /**
   * Parse 'mvhd' box data
   */
  parseMvhdBox(a, i, h) {
    const c = new DataView(a), _ = c.getUint8(i), b = c.getUint8(i + 1) << 16 | c.getUint8(i + 2) << 8 | c.getUint8(i + 3);
    let P, y, E, D;
    return _ === 1 ? (P = c.getBigUint64(i + 4, !1), y = c.getBigUint64(i + 12, !1), E = c.getUint32(i + 20, !1), D = c.getBigUint64(i + 24, !1)) : (P = c.getUint32(i + 4, !1), y = c.getUint32(i + 8, !1), E = c.getUint32(i + 12, !1), D = c.getUint32(i + 16, !1)), {
      version: _,
      flags: b,
      creationTime: P,
      modificationTime: y,
      timescale: E,
      duration: D
    };
  }
  /**
   * Parse 'mdhd' box data
   */
  parseMdhdBox(a, i, h) {
    const c = new DataView(a), _ = c.getUint8(i), b = c.getUint8(i + 1) << 16 | c.getUint8(i + 2) << 8 | c.getUint8(i + 3);
    let P, y, E, D, k;
    return _ === 1 ? (P = c.getBigUint64(i + 4, !1), y = c.getBigUint64(i + 12, !1), E = c.getUint32(i + 20, !1), D = c.getBigUint64(i + 24, !1), k = this.parseLanguage(c.getUint16(i + 32, !1))) : (P = c.getUint32(i + 4, !1), y = c.getUint32(i + 8, !1), E = c.getUint32(i + 12, !1), D = c.getUint32(i + 16, !1), k = this.parseLanguage(c.getUint16(i + 20, !1))), {
      version: _,
      flags: b,
      creationTime: P,
      modificationTime: y,
      timescale: E,
      duration: D,
      language: k
    };
  }
  /**
   * Parse 'hdlr' box data
   */
  parseHdlrBox(a, i, h) {
    const c = new DataView(a), _ = c.getUint8(i), b = c.getUint8(i + 1) << 16 | c.getUint8(i + 2) << 8 | c.getUint8(i + 3), P = this.readFourCC(a, i + 8);
    let y = "", E = i + 24;
    for (; E < h; ) {
      const D = c.getUint8(E);
      if (D === 0)
        break;
      y += String.fromCharCode(D), E++;
    }
    return {
      version: _,
      flags: b,
      handlerType: P,
      name: y
    };
  }
  /**
   * Parse 'tkhd' box data
   */
  parseTkhdBox(a, i, h) {
    const c = new DataView(a), _ = c.getUint8(i), b = c.getUint8(i + 1) << 16 | c.getUint8(i + 2) << 8 | c.getUint8(i + 3);
    let P, y, E, D;
    return _ === 1 ? (P = c.getBigUint64(i + 4, !1), y = c.getBigUint64(i + 12, !1), E = c.getUint32(i + 20, !1), D = c.getBigUint64(i + 28, !1)) : (P = c.getUint32(i + 4, !1), y = c.getUint32(i + 8, !1), E = c.getUint32(i + 12, !1), D = c.getUint32(i + 20, !1)), {
      version: _,
      flags: b,
      creationTime: P,
      modificationTime: y,
      trackID: E,
      duration: D,
      enabled: (b & 1) !== 0,
      inMovie: (b & 2) !== 0,
      inPreview: (b & 4) !== 0
    };
  }
  /**
   * Parse 'elst' box data
   */
  parseElstBox(a, i, h) {
    const c = new DataView(a), _ = c.getUint8(i), b = c.getUint8(i + 1) << 16 | c.getUint8(i + 2) << 8 | c.getUint8(i + 3), P = c.getUint32(i + 4, !1), y = [];
    let E = i + 8;
    for (let D = 0; D < P; D++)
      if (_ === 1) {
        const k = c.getBigUint64(E, !1), j = c.getBigInt64(E + 8, !1), z = c.getInt16(E + 16, !1), W = c.getInt16(E + 18, !1);
        y.push({
          segmentDuration: k,
          mediaTime: j,
          mediaRateInteger: z,
          mediaRateFraction: W
        }), E += 20;
      } else {
        const k = c.getUint32(E, !1), j = c.getInt32(E + 4, !1), z = c.getInt16(E + 8, !1), W = c.getInt16(E + 10, !1);
        y.push({
          segmentDuration: k,
          mediaTime: j,
          mediaRateInteger: z,
          mediaRateFraction: W
        }), E += 12;
      }
    return {
      version: _,
      flags: b,
      entries: y
    };
  }
  /**
   * Parse 'mfhd' box data
   */
  parseMfhdBox(a, i, h) {
    const c = new DataView(a), _ = c.getUint8(i), b = c.getUint8(i + 1) << 16 | c.getUint8(i + 2) << 8 | c.getUint8(i + 3), P = c.getUint32(i + 4, !1);
    return {
      version: _,
      flags: b,
      sequenceNumber: P
    };
  }
  /**
   * Parse 'tfhd' box data
   */
  parseTfhdBox(a, i, h) {
    const c = new DataView(a), _ = c.getUint8(i), b = c.getUint8(i + 1) << 16 | c.getUint8(i + 2) << 8 | c.getUint8(i + 3), P = c.getUint32(i + 4, !1);
    let y = i + 8;
    const E = {
      version: _,
      flags: b,
      trackID: P
    };
    return b & 1 && (E.baseDataOffset = c.getBigUint64(y, !1), y += 8), b & 2 && (E.sampleDescriptionIndex = c.getUint32(y, !1), y += 4), b & 8 && (E.defaultSampleDuration = c.getUint32(y, !1), y += 4), b & 16 && (E.defaultSampleSize = c.getUint32(y, !1), y += 4), b & 32 && (E.defaultSampleFlags = c.getUint32(y, !1)), E;
  }
  /**
   * Parse 'tfdt' box data
   */
  parseTfdtBox(a, i, h) {
    const c = new DataView(a), _ = c.getUint8(i), b = c.getUint8(i + 1) << 16 | c.getUint8(i + 2) << 8 | c.getUint8(i + 3);
    let P;
    return _ === 1 ? P = c.getBigUint64(i + 4, !1) : P = c.getUint32(i + 4, !1), {
      version: _,
      flags: b,
      baseMediaDecodeTime: P
    };
  }
  /**
   * Parse 'trun' box data
   */
  parseTrunBox(a, i, h) {
    const c = new DataView(a), _ = c.getUint8(i), b = c.getUint8(i + 1) << 16 | c.getUint8(i + 2) << 8 | c.getUint8(i + 3), P = c.getUint32(i + 4, !1);
    let y = i + 8;
    const E = {
      version: _,
      flags: b,
      sampleCount: P,
      samples: []
    };
    b & 1 && (E.dataOffset = c.getInt32(y, !1), y += 4), b & 4 && (E.firstSampleFlags = c.getUint32(y, !1), y += 4);
    const D = [];
    for (let k = 0; k < P; k++) {
      const j = {
        dataStart: 0,
        dataEnd: 0,
        data: new Uint8Array(0),
        // Placeholder, will be set later
        keyFrame: !0
        // Default to true, will be updated based on flags
      };
      if (b & 256 && (j.duration = c.getUint32(y, !1), y += 4), b & 512 && (j.size = c.getUint32(y, !1), y += 4), b & 1024) {
        j.flags = c.getUint32(y, !1);
        const z = j.flags >> 24 & 3;
        j.keyFrame = z === 2, y += 4;
      } else if (k === 0 && E.firstSampleFlags !== void 0) {
        const z = E.firstSampleFlags >> 24 & 3;
        j.keyFrame = z === 2;
      }
      b & 2048 && (_ === 0 ? j.compositionTimeOffset = c.getUint32(y, !1) : j.compositionTimeOffset = c.getInt32(y, !1), y += 4), D.push(j);
    }
    return E.samples = D, E;
  }
  /**
   * Parse language code
   * @param value 16-bit language code
   * @returns ISO language code
   */
  parseLanguage(a) {
    const i = String.fromCharCode((a >> 10 & 31) + 96), h = String.fromCharCode((a >> 5 & 31) + 96), c = String.fromCharCode((a & 31) + 96);
    return i + h + c;
  }
  /**
   * Read a 4-character code from the buffer
   * @param buffer ArrayBuffer containing data
   * @param offset Offset to read from
   * @returns 4-character code as string
   */
  readFourCC(a, i) {
    const h = new Uint8Array(a, i, 4);
    return String.fromCharCode(...h);
  }
  /**
   * Log box information in debug mode
   * @param box Box to log
   * @param depth Nesting depth for indentation
   */
  logBox(a, i = 0) {
    if (!this.debug)
      return;
    const h = "  ".repeat(i);
    if (console.log(`${h}Box: ${a.type}, Size: ${a.size}, Range: ${a.start}-${a.end}`), a.data && console.log(`${h}  Data:`, a.data), a.children && a.children.length > 0) {
      console.log(`${h}  Children (${a.children.length}):`);
      for (const c of a.children)
        this.logBox(c, i + 2);
    }
  }
  /**
   * Utility method to pretty print a box structure
   * @param boxes Parsed box structure
   * @returns Formatted string representation
   */
  printBoxes(a) {
    let i = `FMP4 Structure:
`;
    const h = (c, _ = 0) => {
      const b = "  ".repeat(_);
      if (i += `${b}${c.type} (${c.size} bytes)
`, c.data) {
        const P = JSON.stringify(c.data, (y, E) => typeof E == "bigint" ? E.toString() : y === "data" && E instanceof Uint8Array ? `Uint8Array(${E.byteLength} bytes)` : E, 2);
        i += `${b}  Data: ${P}
`;
      }
      if (c.children && c.children.length > 0)
        for (const P of c.children)
          h(P, _ + 1);
    };
    for (const c of a)
      h(c);
    return i;
  }
  /**
   * Get all samples for a specific track
   * @param boxes Parsed box structure
   * @param trackId Track ID to find samples for (optional)
   * @returns Array of samples
   */
  getSamples(a, i) {
    const h = [];
    return this.findBoxes(a, "moof").forEach((c) => {
      c.children && c.children.filter((_) => _.type === "traf").forEach((_) => {
        if (!_.children)
          return;
        const b = _.children.find((y) => y.type === "tfhd");
        if (!b || !b.data || i !== void 0 && b.data.trackID !== i)
          return;
        _.children.filter((y) => y.type === "trun").forEach((y) => {
          !y.data || !y.data.samples || y.data.samples.forEach((E) => {
            E.data && E.data.byteLength > 0 && h.push(E);
          });
        });
      });
    }), h;
  }
  /**
   * Find all boxes of a specific type
   * @param boxes Array of boxes to search
   * @param type Box type to find
   * @returns Array of matching boxes
   */
  findBoxes(a, i) {
    const h = [], c = (_) => {
      for (const b of _)
        b.type === i && h.push(b), b.children && b.children.length > 0 && c(b.children);
    };
    return c(a), h;
  }
  /**
   * Parse 'stsd' box data (Sample Description Box)
   */
  parseStsdBox(a, i, h) {
    const c = new DataView(a), _ = c.getUint8(i), b = c.getUint8(i + 1) << 16 | c.getUint8(i + 2) << 8 | c.getUint8(i + 3), P = c.getUint32(i + 4, !1);
    let y = i + 8;
    const E = [];
    for (let D = 0; D < P && y < h; D++) {
      const k = c.getUint32(y, !1), j = this.readFourCC(a, y + 4);
      let z;
      switch (j) {
        case "avc1":
        case "avc3":
          if (z = this.parseAvcBox(a, y + 8, y + k), y + k > y + 8 + 78) {
            const W = this.parseBox(a, y + 8 + 78);
            W && W.type === "avcC" && (z.avcC = W.data);
          }
          break;
        case "hev1":
        case "hvc1":
          if (z = this.parseHevcBox(a, y + 8, y + k), y + k > y + 8 + 78) {
            const W = this.parseBox(a, y + 8 + 78);
            W && W.type === "hvcC" && (z.hvcC = W.data);
          }
          break;
        case "mp4a":
          if (z = this.parseMp4aBox(a, y + 8, y + k), y + k > y + 8 + 28) {
            const W = this.parseBox(a, y + 8 + 28);
            W && W.type === "esds" && (z.esds = W.data);
          }
          break;
        default:
          z = new Uint8Array(a.slice(y + 8, y + k));
      }
      E.push({
        size: k,
        type: j,
        data: z
      }), y += k;
    }
    return {
      version: _,
      flags: b,
      entryCount: P,
      entries: E
    };
  }
  /**
   * Parse AVC Sample Entry box (avc1, avc3)
   */
  parseAvcBox(a, i, h) {
    const c = new DataView(a);
    i += 6;
    const _ = c.getUint16(i, !1);
    i += 2, i += 16;
    const b = c.getUint16(i, !1), P = c.getUint16(i + 2, !1), y = c.getUint32(i + 4, !1), E = c.getUint32(i + 8, !1);
    i += 12, i += 4;
    const D = c.getUint16(i, !1);
    i += 2;
    const k = c.getUint8(i), j = this.readString(a, i + 1, k);
    i += 32;
    const z = c.getUint16(i, !1), W = c.getInt16(i + 2, !1);
    return {
      dataReferenceIndex: _,
      width: b,
      height: P,
      horizresolution: y,
      vertresolution: E,
      frameCount: D,
      compressorName: j,
      depth: z,
      preDefined: W
    };
  }
  /**
   * Parse HEVC Sample Entry box (hev1, hvc1)
   */
  parseHevcBox(a, i, h) {
    return this.parseAvcBox(a, i, h);
  }
  /**
   * Parse MP4 Audio Sample Entry box (mp4a)
   */
  parseMp4aBox(a, i, h) {
    const c = new DataView(a);
    i += 6;
    const _ = c.getUint16(i, !1);
    i += 2, i += 8;
    const b = c.getUint16(i, !1), P = c.getUint16(i + 2, !1);
    i += 4, i += 4;
    const y = c.getUint32(i, !1) >> 16;
    return {
      dataReferenceIndex: _,
      channelCount: b,
      sampleSize: P,
      sampleRate: y
    };
  }
  /**
   * Read a string from the buffer
   */
  readString(a, i, h) {
    const c = new Uint8Array(a, i, h);
    return String.fromCharCode(...c).replace(/\0+$/, "");
  }
  /**
   * Parse 'avcC' box data
   */
  parseAvcCBox(a, i, h) {
    const c = new DataView(a);
    return {
      data: new Uint8Array(a, i, h - i),
      configurationVersion: c.getUint8(i),
      profileIndication: c.getUint8(i + 1),
      profileCompatibility: c.getUint8(i + 2),
      levelIndication: c.getUint8(i + 3)
      // There are more fields but we only need these for the codec string
    };
  }
  /**
   * Parse 'hvcC' box data
   */
  parseHvcCBox(a, i, h) {
    const c = new DataView(a);
    return {
      data: new Uint8Array(a, i, h - i),
      configurationVersion: c.getUint8(i),
      generalProfileSpace: c.getUint8(i + 1) >> 6 & 3,
      generalTierFlag: c.getUint8(i + 1) >> 5 & 1,
      generalProfileIdc: c.getUint8(i + 1) & 31,
      generalProfileCompatibilityFlags: c.getUint32(i + 2, !1),
      generalConstraintIndicatorFlags: new DataView(a, i + 6, 6),
      generalLevelIdc: c.getUint8(i + 12),
      minSpatialSegmentationIdc: c.getUint16(i + 13, !1) & 4095,
      parallelismType: c.getUint8(i + 15) & 3
      // There are more fields but we only need these for the codec string
    };
  }
  /**
   * Parse 'esds' box data
   */
  parseEsdsBox(a, i, h) {
    const c = new DataView(a);
    if (i += 4, c.getUint8(i) === 3) {
      const _ = this.parseExpandableLength(a, i + 1);
      if (i += 1 + _.bytesRead, i += 3, c.getUint8(i) === 4) {
        const b = this.parseExpandableLength(a, i + 1);
        i += 1 + b.bytesRead;
        const P = {
          objectTypeIndication: (c.getUint8(i) >> 6) + 1,
          streamType: c.getUint8(i + 1) >> 2 & 63,
          bufferSizeDB: (c.getUint8(i + 1) & 3) << 16 | c.getUint8(i + 2) << 8 | c.getUint8(i + 3),
          maxBitrate: c.getUint32(i + 4, !1),
          avgBitrate: c.getUint32(i + 8, !1)
        };
        if (i += 13, i < h && c.getUint8(i) === 5) {
          const y = this.parseExpandableLength(a, i + 1);
          i += 1 + y.bytesRead;
          const E = new Uint8Array(a, i, y.length);
          return i += y.length, {
            decoderConfig: P,
            specificInfo: E,
            data: E
            // Keep the original data field for compatibility
          };
        }
        return {
          decoderConfig: P,
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
  parseExpandableLength(a, i) {
    const h = new DataView(a);
    let c = 0, _ = 0, b;
    do
      b = h.getUint8(i + _), c = c << 7 | b & 127, _++;
    while (b & 128);
    return { length: c, bytesRead: _ };
  }
  /**
   * Generate codec string for MSE from codec specific box
   * @param boxes Array of parsed boxes
   * @returns Array of codec info objects containing codec strings and MIME types
   */
  generateCodecStrings(a) {
    const i = [], h = this.findBoxes(a, "stsd");
    for (const c of h)
      if (c.data?.entries)
        for (const _ of c.data.entries) {
          const { type: b, data: P } = _;
          switch (b) {
            case "avc1":
            case "avc3": {
              if (P?.avcC) {
                const { profileIndication: y, profileCompatibility: E, levelIndication: D } = P.avcC, k = `${b}.` + y.toString(16).padStart(2, "0") + E.toString(16).padStart(2, "0") + D.toString(16).padStart(2, "0");
                i.push({
                  codecString: k,
                  mimeType: "video/mp4",
                  extraData: P.avcC.data
                });
              }
              break;
            }
            case "hev1":
            case "hvc1": {
              if (P?.hvcC) {
                const {
                  generalProfileSpace: y,
                  generalProfileIdc: E,
                  generalProfileCompatibilityFlags: D,
                  generalConstraintIndicatorFlags: k,
                  generalLevelIdc: j
                } = P.hvcC, W = (["", "A", "B", "C"][y] || "") + E, te = k.toString(16).padStart(6, "0"), H = j.toString(16).padStart(2, "0"), pe = `${b}.${W}.${te}.${H}`;
                i.push({
                  codecString: pe,
                  mimeType: "video/mp4",
                  extraData: P.hvcC.data
                });
              }
              break;
            }
            case "mp4a": {
              if (P?.esds?.decoderConfig) {
                const { objectTypeIndication: y } = P.esds.decoderConfig, E = `mp4a.40.${y}`;
                i.push({
                  codecString: E,
                  mimeType: "audio/mp4",
                  extraData: P.esds.data
                });
              }
              break;
            }
          }
        }
    return i;
  }
}
var Lt = /* @__PURE__ */ ((T) => (T.VideoCodecInfo = "videoCodecInfo", T.VideoFrame = "videoFrame", T.Error = "error", T))(Lt || {}), Nn = /* @__PURE__ */ ((T) => (T.AudioCodecInfo = "audioCodecInfo", T.AudioFrame = "audioFrame", T.Error = "error", T))(Nn || {});
function yo(T) {
  return T && T.__esModule && Object.prototype.hasOwnProperty.call(T, "default") ? T.default : T;
}
var Ni = { exports: {} };
(function(T) {
  var a = Object.prototype.hasOwnProperty, i = "~";
  function h() {
  }
  Object.create && (h.prototype = /* @__PURE__ */ Object.create(null), new h().__proto__ || (i = !1));
  function c(y, E, D) {
    this.fn = y, this.context = E, this.once = D || !1;
  }
  function _(y, E, D, k, j) {
    if (typeof D != "function")
      throw new TypeError("The listener must be a function");
    var z = new c(D, k || y, j), W = i ? i + E : E;
    return y._events[W] ? y._events[W].fn ? y._events[W] = [y._events[W], z] : y._events[W].push(z) : (y._events[W] = z, y._eventsCount++), y;
  }
  function b(y, E) {
    --y._eventsCount === 0 ? y._events = new h() : delete y._events[E];
  }
  function P() {
    this._events = new h(), this._eventsCount = 0;
  }
  P.prototype.eventNames = function() {
    var E = [], D, k;
    if (this._eventsCount === 0)
      return E;
    for (k in D = this._events)
      a.call(D, k) && E.push(i ? k.slice(1) : k);
    return Object.getOwnPropertySymbols ? E.concat(Object.getOwnPropertySymbols(D)) : E;
  }, P.prototype.listeners = function(E) {
    var D = i ? i + E : E, k = this._events[D];
    if (!k)
      return [];
    if (k.fn)
      return [k.fn];
    for (var j = 0, z = k.length, W = new Array(z); j < z; j++)
      W[j] = k[j].fn;
    return W;
  }, P.prototype.listenerCount = function(E) {
    var D = i ? i + E : E, k = this._events[D];
    return k ? k.fn ? 1 : k.length : 0;
  }, P.prototype.emit = function(E, D, k, j, z, W) {
    var te = i ? i + E : E;
    if (!this._events[te])
      return !1;
    var H = this._events[te], pe = arguments.length, Q, ae;
    if (H.fn) {
      switch (H.once && this.removeListener(E, H.fn, void 0, !0), pe) {
        case 1:
          return H.fn.call(H.context), !0;
        case 2:
          return H.fn.call(H.context, D), !0;
        case 3:
          return H.fn.call(H.context, D, k), !0;
        case 4:
          return H.fn.call(H.context, D, k, j), !0;
        case 5:
          return H.fn.call(H.context, D, k, j, z), !0;
        case 6:
          return H.fn.call(H.context, D, k, j, z, W), !0;
      }
      for (ae = 1, Q = new Array(pe - 1); ae < pe; ae++)
        Q[ae - 1] = arguments[ae];
      H.fn.apply(H.context, Q);
    } else {
      var Ve = H.length, ne;
      for (ae = 0; ae < Ve; ae++)
        switch (H[ae].once && this.removeListener(E, H[ae].fn, void 0, !0), pe) {
          case 1:
            H[ae].fn.call(H[ae].context);
            break;
          case 2:
            H[ae].fn.call(H[ae].context, D);
            break;
          case 3:
            H[ae].fn.call(H[ae].context, D, k);
            break;
          case 4:
            H[ae].fn.call(H[ae].context, D, k, j);
            break;
          default:
            if (!Q)
              for (ne = 1, Q = new Array(pe - 1); ne < pe; ne++)
                Q[ne - 1] = arguments[ne];
            H[ae].fn.apply(H[ae].context, Q);
        }
    }
    return !0;
  }, P.prototype.on = function(E, D, k) {
    return _(this, E, D, k, !1);
  }, P.prototype.once = function(E, D, k) {
    return _(this, E, D, k, !0);
  }, P.prototype.removeListener = function(E, D, k, j) {
    var z = i ? i + E : E;
    if (!this._events[z])
      return this;
    if (!D)
      return b(this, z), this;
    var W = this._events[z];
    if (W.fn)
      W.fn === D && (!j || W.once) && (!k || W.context === k) && b(this, z);
    else {
      for (var te = 0, H = [], pe = W.length; te < pe; te++)
        (W[te].fn !== D || j && !W[te].once || k && W[te].context !== k) && H.push(W[te]);
      H.length ? this._events[z] = H.length === 1 ? H[0] : H : b(this, z);
    }
    return this;
  }, P.prototype.removeAllListeners = function(E) {
    var D;
    return E ? (D = i ? i + E : E, this._events[D] && b(this, D)) : (this._events = new h(), this._eventsCount = 0), this;
  }, P.prototype.off = P.prototype.removeListener, P.prototype.addListener = P.prototype.on, P.prefixed = i, P.EventEmitter = P, T.exports = P;
})(Ni);
var wo = Ni.exports;
const _o = /* @__PURE__ */ yo(wo), Oi = Symbol("instance"), ti = Symbol("cacheResult");
class _i {
  constructor(a, i, h) {
    this.oldState = a, this.newState = i, this.action = h, this.aborted = !1;
  }
  abort(a) {
    this.aborted = !0, Gn.call(a, this.oldState, new Error(`action '${this.action}' aborted`));
  }
  toString() {
    return `${this.action}ing`;
  }
}
class ni extends Error {
  /*************  ✨ Codeium Command ⭐  *************/
  /**
     * Create a new instance of FSMError.
     * @param state current state.
     * @param message error message.
     * @param cause original error.
  /******  625fa23f-3ee1-42ac-94bd-4f6ffd4578ff  *******/
  constructor(a, i, h) {
    super(i), this.state = a, this.message = i, this.cause = h;
  }
}
function Eo(T) {
  return typeof T == "object" && T && "then" in T;
}
const qn = /* @__PURE__ */ new Map();
function Jt(T, a, i = {}) {
  return (h, c, _) => {
    const b = i.action || c;
    if (!i.context) {
      const y = qn.get(h) || [];
      qn.has(h) || qn.set(h, y), y.push({ from: T, to: a, action: b });
    }
    const P = _.value;
    _.value = function(...y) {
      let E = this;
      if (i.context && (E = me.get(typeof i.context == "function" ? i.context.call(this, ...y) : i.context)), E.state === a)
        return i.sync ? E[ti] : Promise.resolve(E[ti]);
      E.state instanceof _i && E.state.action == i.abortAction && E.state.abort(E);
      let D = null;
      Array.isArray(T) ? T.length == 0 ? E.state instanceof _i && E.state.abort(E) : (typeof E.state != "string" || !T.includes(E.state)) && (D = new ni(E._state, `${E.name} ${b} to ${a} failed: current state ${E._state} not from ${T.join("|")}`)) : T !== E.state && (D = new ni(E._state, `${E.name} ${b} to ${a} failed: current state ${E._state} not from ${T}`));
      const k = (H) => {
        if (i.fail && i.fail.call(this, H), i.sync) {
          if (i.ignoreError)
            return H;
          throw H;
        } else
          return i.ignoreError ? Promise.resolve(H) : Promise.reject(H);
      };
      if (D)
        return k(D);
      const j = E.state, z = new _i(j, a, b);
      Gn.call(E, z);
      const W = (H) => {
        var pe;
        return E[ti] = H, z.aborted || (Gn.call(E, a), (pe = i.success) === null || pe === void 0 || pe.call(this, E[ti])), H;
      }, te = (H) => (Gn.call(E, j, H), k(H));
      try {
        const H = P.apply(this, y);
        return Eo(H) ? H.then(W).catch(te) : i.sync ? W(H) : Promise.resolve(W(H));
      } catch (H) {
        return te(new ni(E._state, `${E.name} ${b} from ${T} to ${a} failed: ${H}`, H instanceof Error ? H : new Error(String(H))));
      }
    };
  };
}
function bo(...T) {
  return (a, i, h) => {
    const c = h.value, _ = i;
    h.value = function(...b) {
      if (!T.includes(this.state.toString()))
        throw new ni(this.state, `${this.name} ${_} failed: current state ${this.state} not in ${T}`);
      return c.apply(this, b);
    };
  };
}
const $o = (() => typeof window < "u" && window.__AFSM__ ? (i, h) => {
  window.dispatchEvent(new CustomEvent(i, { detail: h }));
} : typeof importScripts < "u" ? (i, h) => {
  postMessage({ type: i, payload: h });
} : () => {
})();
function Gn(T, a) {
  const i = this._state;
  this._state = T;
  const h = T.toString();
  T && this.emit(h, i), this.emit(me.STATECHANGED, T, i, a), this.updateDevTools({ value: T, old: i, err: a instanceof Error ? a.message : String(a) });
}
class me extends _o {
  constructor(a, i, h) {
    super(), this.name = a, this.groupName = i, this._state = me.INIT, a || (a = Date.now().toString(36)), h ? Object.setPrototypeOf(this, h) : h = Object.getPrototypeOf(this), i || (this.groupName = this.constructor.name);
    const c = h[Oi];
    c ? this.name = c.name + "-" + c.count++ : h[Oi] = { name: this.name, count: 0 }, this.updateDevTools({ diagram: this.stateDiagram });
  }
  get stateDiagram() {
    const a = Object.getPrototypeOf(this), i = qn.get(a) || [];
    let h = /* @__PURE__ */ new Set(), c = [], _ = [];
    const b = /* @__PURE__ */ new Set(), P = Object.getPrototypeOf(a);
    qn.has(P) && (P.stateDiagram.forEach((E) => h.add(E)), P.allStates.forEach((E) => b.add(E))), i.forEach(({ from: E, to: D, action: k }) => {
      typeof E == "string" ? c.push({ from: E, to: D, action: k }) : E.length ? E.forEach((j) => {
        c.push({ from: j, to: D, action: k });
      }) : _.push({ to: D, action: k });
    }), c.forEach(({ from: E, to: D, action: k }) => {
      b.add(E), b.add(D), b.add(k + "ing"), h.add(`${E} --> ${k}ing : ${k}`), h.add(`${k}ing --> ${D} : ${k} 🟢`), h.add(`${k}ing --> ${E} : ${k} 🔴`);
    }), _.forEach(({ to: E, action: D }) => {
      h.add(`${D}ing --> ${E} : ${D} 🟢`), b.forEach((k) => {
        k !== E && h.add(`${k} --> ${D}ing : ${D}`);
      });
    });
    const y = [...h];
    return Object.defineProperties(a, {
      stateDiagram: { value: y },
      allStates: { value: b }
    }), y;
  }
  static get(a) {
    let i;
    return typeof a == "string" ? (i = me.instances.get(a), i || me.instances.set(a, i = new me(a, void 0, Object.create(me.prototype)))) : (i = me.instances2.get(a), i || me.instances2.set(a, i = new me(a.constructor.name, void 0, Object.create(me.prototype)))), i;
  }
  static getState(a) {
    var i;
    return (i = me.get(a)) === null || i === void 0 ? void 0 : i.state;
  }
  updateDevTools(a = {}) {
    $o(me.UPDATEAFSM, Object.assign({ name: this.name, group: this.groupName }, a));
  }
  get state() {
    return this._state;
  }
  set state(a) {
    Gn.call(this, a);
  }
}
me.STATECHANGED = "stateChanged";
me.UPDATEAFSM = "updateAFSM";
me.INIT = "[*]";
me.ON = "on";
me.OFF = "off";
me.instances = /* @__PURE__ */ new Map();
me.instances2 = /* @__PURE__ */ new WeakMap();
var Po = Object.defineProperty, To = Object.getOwnPropertyDescriptor, ai = (T, a, i, h) => {
  for (var c = h > 1 ? void 0 : h ? To(a, i) : a, _ = T.length - 1, b; _ >= 0; _--)
    (b = T[_]) && (c = (h ? b(a, i, c) : b(c)) || c);
  return h && c && Po(a, i, c), c;
};
function ko() {
  var T;
  self.onmessage = (a) => {
    if (a.data.type === "init") {
      const { canvas: i, wasmScript: h, wasmBinary: c } = a.data, _ = i?.getContext("2d");
      let b = 0, P = 0;
      const y = {
        wasmBinary: c,
        postRun: () => {
          T = new y.VideoDecoder({
            videoInfo(E, D) {
              b = E, P = D, console.log("video info", E, D);
            },
            yuvData(E, D) {
              const k = b * P, j = k >> 2;
              let z = y.HEAPU32[E >> 2], W = y.HEAPU32[(E >> 2) + 1], te = y.HEAPU32[(E >> 2) + 2], H = y.HEAPU8.subarray(z, z + k), pe = y.HEAPU8.subarray(W, W + j), Q = y.HEAPU8.subarray(te, te + j);
              const ae = new Uint8Array(k + j + j);
              ae.set(H), ae.set(pe, k), ae.set(Q, k + j);
              const Ve = new VideoFrame(ae, {
                codedWidth: b,
                codedHeight: P,
                format: "I420",
                timestamp: D
              });
              i ? (_?.drawImage(Ve, 0, 0, i.width, i.height), _?.commit()) : self.postMessage({ type: "yuvData", videoFrame: Ve }, [Ve]);
            }
          }), self.postMessage({ type: "ready" });
        }
      };
      Function("var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;return " + h)()(y);
    } else if (a.data.type === "decode") {
      const { packet: i } = a.data;
      T?.decode(i.data, i.type == "key", i.timestamp);
    } else if (a.data.type === "setCodec") {
      const { codec: i, format: h, description: c } = a.data;
      T?.setCodec(i, h, c ?? "");
    }
  };
}
class Zn extends me {
  constructor(a, i, h = !1, c, _ = !1) {
    super(), this.createModule = a, this.wasmBinary = i, this.workerMode = h, this.canvas = c, this.yuvMode = _, this.module = {}, this.width = 0, this.height = 0;
  }
  async initialize(a) {
    if (this.workerMode) {
      const h = /\{(.+)\}/s.exec(ko.toString())[1];
      this.worker = new Worker(URL.createObjectURL(new Blob([h], { type: "text/javascript" })));
      const c = this.canvas?.transferControlToOffscreen(), _ = await this.wasmBinary;
      return console.warn("worker mode", _), this.worker.postMessage({ type: "init", canvas: c, wasmScript: this.createModule.toString(), wasmBinary: _ }, c ? [c, _] : [_]), new Promise((b) => {
        this.worker.onmessage = (P) => {
          if (P.data.type === "ready")
            delete this.wasmBinary, b(), console.warn("worker mode initialize success");
          else if (P.data.type === "yuvData") {
            const { videoFrame: y } = P.data;
            this.emit(Lt.VideoFrame, y);
          }
        };
      });
    }
    const i = this.module;
    return this.wasmBinary && (i.wasmBinary = await this.wasmBinary), i.print = (h) => console.log(h), i.printErr = (h) => console.log(`[JS] ERROR: ${h}`), i.onAbort = () => console.log("[JS] FATAL: WASM ABORTED"), new Promise((h) => {
      i.postRun = (c) => {
        this.decoder = new this.module.VideoDecoder(this), console.log("video soft decoder initialize success"), h();
      }, a && Object.assign(i, a), this.createModule(i);
    });
  }
  configure(a) {
    this.config = a;
    const i = this.config.codec.startsWith("avc") ? "avc" : "hevc", h = this.config.description ? i == "avc" ? "avcc" : "hvcc" : "annexb";
    this.decoder?.setCodec(i, h, this.config.description ?? ""), this.worker?.postMessage({ type: "setCodec", codec: i, format: h, description: this.config.description });
  }
  decode(a) {
    this.decoder?.decode(a.data, a.type == "key", a.timestamp), this.state === "configured" && this.worker?.postMessage({ type: "decode", packet: a });
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
  videoInfo(a, i) {
    this.width = a, this.height = i;
    let h = {
      width: a,
      height: i
    };
    this.emit(Lt.VideoCodecInfo, h);
  }
  yuvData(a, i) {
    if (!this.module)
      return;
    const h = this.width * this.height, c = h >> 2;
    let _ = this.module.HEAPU32[a >> 2], b = this.module.HEAPU32[(a >> 2) + 1], P = this.module.HEAPU32[(a >> 2) + 2], y = this.module.HEAPU8.subarray(_, _ + h), E = this.module.HEAPU8.subarray(b, b + c), D = this.module.HEAPU8.subarray(P, P + c);
    if (this.yuvMode) {
      this.emit(Lt.VideoFrame, { y, u: E, v: D, timestamp: i });
      return;
    }
    const k = new Uint8Array(h + c + c);
    k.set(y), k.set(E, h), k.set(D, h + c), this.emit(Lt.VideoFrame, new VideoFrame(k, {
      codedWidth: this.width,
      codedHeight: this.height,
      format: "I420",
      timestamp: i
    }));
  }
  errorInfo(a) {
    let i = {
      errMsg: a
    };
    this.emit(Lt.Error, i);
  }
}
ai([
  Jt([me.INIT, "closed"], "initialized")
], Zn.prototype, "initialize", 1);
ai([
  Jt("initialized", "configured", { sync: !0 })
], Zn.prototype, "configure", 1);
ai([
  Jt([], me.INIT, { sync: !0 })
], Zn.prototype, "reset", 1);
ai([
  Jt([], "closed", { sync: !0 })
], Zn.prototype, "close", 1);
(() => {
  var T = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
  return function(a = {}) {
    var i = a, h, c;
    i.ready = new Promise((p, v) => {
      h = p, c = v;
    });
    var _ = Object.assign({}, i), b = typeof window == "object", P = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && process.versions.node;
    var y = "";
    function E(p) {
      return i.locateFile ? i.locateFile(p, y) : y + p;
    }
    var D;
    (b || P) && (P ? y = self.location.href : typeof document < "u" && document.currentScript && (y = document.currentScript.src), T && (y = T), y.indexOf("blob:") !== 0 ? y = y.substr(0, y.replace(/[?#].*/, "").lastIndexOf("/") + 1) : y = "", P && (D = (p) => {
      var v = new XMLHttpRequest();
      return v.open("GET", p, !1), v.responseType = "arraybuffer", v.send(null), new Uint8Array(v.response);
    }));
    var k = i.print || console.log.bind(console), j = i.printErr || console.error.bind(console);
    Object.assign(i, _), _ = null, i.arguments && i.arguments, i.thisProgram && i.thisProgram, i.quit && i.quit;
    var z;
    i.wasmBinary && (z = i.wasmBinary), i.noExitRuntime, typeof WebAssembly != "object" && Pe("no native wasm support detected");
    var W, te, H = !1, pe, Q, ae, Ve, ne, K, $e, rt;
    function V() {
      var p = W.buffer;
      i.HEAP8 = pe = new Int8Array(p), i.HEAP16 = ae = new Int16Array(p), i.HEAP32 = ne = new Int32Array(p), i.HEAPU8 = Q = new Uint8Array(p), i.HEAPU16 = Ve = new Uint16Array(p), i.HEAPU32 = K = new Uint32Array(p), i.HEAPF32 = $e = new Float32Array(p), i.HEAPF64 = rt = new Float64Array(p);
    }
    var X, jt = [], Ht = [], Tr = [];
    function er() {
      if (i.preRun)
        for (typeof i.preRun == "function" && (i.preRun = [i.preRun]); i.preRun.length; )
          nr(i.preRun.shift());
      Pt(jt);
    }
    function tr() {
      Pt(Ht);
    }
    function rr() {
      if (i.postRun)
        for (typeof i.postRun == "function" && (i.postRun = [i.postRun]); i.postRun.length; )
          Gr(i.postRun.shift());
      Pt(Tr);
    }
    function nr(p) {
      jt.unshift(p);
    }
    function qr(p) {
      Ht.unshift(p);
    }
    function Gr(p) {
      Tr.unshift(p);
    }
    var at = 0, $t = null;
    function Xr(p) {
      at++, i.monitorRunDependencies && i.monitorRunDependencies(at);
    }
    function Kr(p) {
      if (at--, i.monitorRunDependencies && i.monitorRunDependencies(at), at == 0 && $t) {
        var v = $t;
        $t = null, v();
      }
    }
    function Pe(p) {
      i.onAbort && i.onAbort(p), p = "Aborted(" + p + ")", j(p), H = !0, p += ". Build with -sASSERTIONS for more info.";
      var v = new WebAssembly.RuntimeError(p);
      throw c(v), v;
    }
    var Qe = "data:application/octet-stream;base64,";
    function ei(p) {
      return p.startsWith(Qe);
    }
    var Ne;
    Ne = "videodec_simd.wasm", ei(Ne) || (Ne = E(Ne));
    function nt(p) {
      if (p == Ne && z)
        return new Uint8Array(z);
      if (D)
        return D(p);
      throw "both async and sync fetching of the wasm failed";
    }
    function Fe(p) {
      return !z && (b || P) && typeof fetch == "function" ? fetch(p, { credentials: "same-origin" }).then((v) => {
        if (!v.ok)
          throw "failed to load wasm binary file at '" + p + "'";
        return v.arrayBuffer();
      }).catch(() => nt(p)) : Promise.resolve().then(() => nt(p));
    }
    function kr(p, v, m) {
      return Fe(p).then(($) => WebAssembly.instantiate($, v)).then(($) => $).then(m, ($) => {
        j("failed to asynchronously prepare wasm: " + $), Pe($);
      });
    }
    function ir(p, v, m, $) {
      return !p && typeof WebAssembly.instantiateStreaming == "function" && !ei(v) && typeof fetch == "function" ? fetch(v, { credentials: "same-origin" }).then((R) => {
        var B = WebAssembly.instantiateStreaming(R, m);
        return B.then($, function(O) {
          return j("wasm streaming compile failed: " + O), j("falling back to ArrayBuffer instantiation"), kr(v, m, $);
        });
      }) : kr(v, m, $);
    }
    function Ie() {
      var p = { a: Bn };
      function v($, R) {
        var B = $.exports;
        return te = B, W = te.v, V(), X = te.z, qr(te.w), Kr(), B;
      }
      Xr();
      function m($) {
        v($.instance);
      }
      if (i.instantiateWasm)
        try {
          return i.instantiateWasm(p, v);
        } catch ($) {
          j("Module.instantiateWasm callback failed with error: " + $), c($);
        }
      return ir(z, Ne, p, m).catch(c), {};
    }
    var Pt = (p) => {
      for (; p.length > 0; )
        p.shift()(i);
    };
    function Qr(p) {
      this.excPtr = p, this.ptr = p - 24, this.set_type = function(v) {
        K[this.ptr + 4 >> 2] = v;
      }, this.get_type = function() {
        return K[this.ptr + 4 >> 2];
      }, this.set_destructor = function(v) {
        K[this.ptr + 8 >> 2] = v;
      }, this.get_destructor = function() {
        return K[this.ptr + 8 >> 2];
      }, this.set_caught = function(v) {
        v = v ? 1 : 0, pe[this.ptr + 12 >> 0] = v;
      }, this.get_caught = function() {
        return pe[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(v) {
        v = v ? 1 : 0, pe[this.ptr + 13 >> 0] = v;
      }, this.get_rethrown = function() {
        return pe[this.ptr + 13 >> 0] != 0;
      }, this.init = function(v, m) {
        this.set_adjusted_ptr(0), this.set_type(v), this.set_destructor(m);
      }, this.set_adjusted_ptr = function(v) {
        K[this.ptr + 16 >> 2] = v;
      }, this.get_adjusted_ptr = function() {
        return K[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var v = Lr(this.get_type());
        if (v)
          return K[this.excPtr >> 2];
        var m = this.get_adjusted_ptr();
        return m !== 0 ? m : this.excPtr;
      };
    }
    var zt = 0;
    function Yr(p, v, m) {
      var $ = new Qr(p);
      throw $.init(v, m), zt = p, zt;
    }
    function Zr(p, v, m, $, R) {
    }
    function U(p) {
      switch (p) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError(`Unknown type size: ${p}`);
      }
    }
    function Y() {
      for (var p = new Array(256), v = 0; v < 256; ++v)
        p[v] = String.fromCharCode(v);
      yt = p;
    }
    var yt = void 0;
    function Re(p) {
      for (var v = "", m = p; Q[m]; )
        v += yt[Q[m++]];
      return v;
    }
    var it = {}, ut = {}, Wt = {}, G = void 0;
    function ce(p) {
      throw new G(p);
    }
    var Vt = void 0;
    function ye(p) {
      throw new Vt(p);
    }
    function lt(p, v, m) {
      p.forEach(function(x) {
        Wt[x] = v;
      });
      function $(x) {
        var q = m(x);
        q.length !== p.length && ye("Mismatched type converter count");
        for (var I = 0; I < p.length; ++I)
          xe(p[I], q[I]);
      }
      var R = new Array(v.length), B = [], O = 0;
      v.forEach((x, q) => {
        ut.hasOwnProperty(x) ? R[q] = ut[x] : (B.push(x), it.hasOwnProperty(x) || (it[x] = []), it[x].push(() => {
          R[q] = ut[x], ++O, O === B.length && $(R);
        }));
      }), B.length === 0 && $(R);
    }
    function Le(p, v, m = {}) {
      var $ = v.name;
      if (p || ce(`type "${$}" must have a positive integer typeid pointer`), ut.hasOwnProperty(p)) {
        if (m.ignoreDuplicateRegistrations)
          return;
        ce(`Cannot register type '${$}' twice`);
      }
      if (ut[p] = v, delete Wt[p], it.hasOwnProperty(p)) {
        var R = it[p];
        delete it[p], R.forEach((B) => B());
      }
    }
    function xe(p, v, m = {}) {
      if (!("argPackAdvance" in v))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      return Le(p, v, m);
    }
    function Tt(p, v, m, $, R) {
      var B = U(m);
      v = Re(v), xe(p, { name: v, fromWireType: function(O) {
        return !!O;
      }, toWireType: function(O, x) {
        return x ? $ : R;
      }, argPackAdvance: 8, readValueFromPointer: function(O) {
        var x;
        if (m === 1)
          x = pe;
        else if (m === 2)
          x = ae;
        else if (m === 4)
          x = ne;
        else
          throw new TypeError("Unknown boolean type size: " + v);
        return this.fromWireType(x[O >> B]);
      }, destructorFunction: null });
    }
    function kt(p) {
      if (!(this instanceof qe) || !(p instanceof qe))
        return !1;
      for (var v = this.$$.ptrType.registeredClass, m = this.$$.ptr, $ = p.$$.ptrType.registeredClass, R = p.$$.ptr; v.baseClass; )
        m = v.upcast(m), v = v.baseClass;
      for (; $.baseClass; )
        R = $.upcast(R), $ = $.baseClass;
      return v === $ && m === R;
    }
    function Ct(p) {
      return { count: p.count, deleteScheduled: p.deleteScheduled, preservePointerOnDelete: p.preservePointerOnDelete, ptr: p.ptr, ptrType: p.ptrType, smartPtr: p.smartPtr, smartPtrType: p.smartPtrType };
    }
    function or(p) {
      function v(m) {
        return m.$$.ptrType.registeredClass.name;
      }
      ce(v(p) + " instance already deleted");
    }
    var ke = !1;
    function Nt(p) {
    }
    function L(p) {
      p.smartPtr ? p.smartPtrType.rawDestructor(p.smartPtr) : p.ptrType.registeredClass.rawDestructor(p.ptr);
    }
    function Cr(p) {
      p.count.value -= 1;
      var v = p.count.value === 0;
      v && L(p);
    }
    function Sr(p, v, m) {
      if (v === m)
        return p;
      if (m.baseClass === void 0)
        return null;
      var $ = Sr(p, v, m.baseClass);
      return $ === null ? null : m.downcast($);
    }
    var Ar = {};
    function Jr() {
      return Object.keys(St).length;
    }
    function en() {
      var p = [];
      for (var v in St)
        St.hasOwnProperty(v) && p.push(St[v]);
      return p;
    }
    var Ye = [];
    function s() {
      for (; Ye.length; ) {
        var p = Ye.pop();
        p.$$.deleteScheduled = !1, p.delete();
      }
    }
    var ct = void 0;
    function ue(p) {
      ct = p, Ye.length && ct && ct(s);
    }
    function tn() {
      i.getInheritedInstanceCount = Jr, i.getLiveInheritedInstances = en, i.flushPendingDeletes = s, i.setDelayFunction = ue;
    }
    var St = {};
    function rn(p, v) {
      for (v === void 0 && ce("ptr should not be undefined"); p.baseClass; )
        v = p.upcast(v), p = p.baseClass;
      return v;
    }
    function At(p, v) {
      return v = rn(p, v), St[v];
    }
    function qt(p, v) {
      (!v.ptrType || !v.ptr) && ye("makeClassHandle requires ptr and ptrType");
      var m = !!v.smartPtrType, $ = !!v.smartPtr;
      return m !== $ && ye("Both smartPtrType and smartPtr must be specified"), v.count = { value: 1 }, de(Object.create(p, { $$: { value: v } }));
    }
    function sr(p) {
      var v = this.getPointee(p);
      if (!v)
        return this.destructor(p), null;
      var m = At(this.registeredClass, v);
      if (m !== void 0) {
        if (m.$$.count.value === 0)
          return m.$$.ptr = v, m.$$.smartPtr = p, m.clone();
        var $ = m.clone();
        return this.destructor(p), $;
      }
      function R() {
        return this.isSmartPointer ? qt(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: v, smartPtrType: this, smartPtr: p }) : qt(this.registeredClass.instancePrototype, { ptrType: this, ptr: p });
      }
      var B = this.registeredClass.getActualType(v), O = Ar[B];
      if (!O)
        return R.call(this);
      var x;
      this.isConst ? x = O.constPointerType : x = O.pointerType;
      var q = Sr(v, this.registeredClass, x.registeredClass);
      return q === null ? R.call(this) : this.isSmartPointer ? qt(x.registeredClass.instancePrototype, { ptrType: x, ptr: q, smartPtrType: this, smartPtr: p }) : qt(x.registeredClass.instancePrototype, { ptrType: x, ptr: q });
    }
    var de = function(p) {
      return typeof FinalizationRegistry > "u" ? (de = (v) => v, p) : (ke = new FinalizationRegistry((v) => {
        Cr(v.$$);
      }), de = (v) => {
        var m = v.$$, $ = !!m.smartPtr;
        if ($) {
          var R = { $$: m };
          ke.register(v, R, v);
        }
        return v;
      }, Nt = (v) => ke.unregister(v), de(p));
    };
    function je() {
      if (this.$$.ptr || or(this), this.$$.preservePointerOnDelete)
        return this.$$.count.value += 1, this;
      var p = de(Object.create(Object.getPrototypeOf(this), { $$: { value: Ct(this.$$) } }));
      return p.$$.count.value += 1, p.$$.deleteScheduled = !1, p;
    }
    function Ue() {
      this.$$.ptr || or(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && ce("Object already scheduled for deletion"), Nt(this), Cr(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
    }
    function dt() {
      return !this.$$.ptr;
    }
    function He() {
      return this.$$.ptr || or(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && ce("Object already scheduled for deletion"), Ye.push(this), Ye.length === 1 && ct && ct(s), this.$$.deleteScheduled = !0, this;
    }
    function N() {
      qe.prototype.isAliasOf = kt, qe.prototype.clone = je, qe.prototype.delete = Ue, qe.prototype.isDeleted = dt, qe.prototype.deleteLater = He;
    }
    function qe() {
    }
    var ft = 48, Ze = 57;
    function Gt(p) {
      if (p === void 0)
        return "_unknown";
      p = p.replace(/[^a-zA-Z0-9_]/g, "$");
      var v = p.charCodeAt(0);
      return v >= ft && v <= Ze ? `_${p}` : p;
    }
    function we(p, v) {
      return p = Gt(p), { [p]: function() {
        return v.apply(this, arguments);
      } }[p];
    }
    function Dr(p, v, m) {
      if (p[v].overloadTable === void 0) {
        var $ = p[v];
        p[v] = function() {
          return p[v].overloadTable.hasOwnProperty(arguments.length) || ce(`Function '${m}' called with an invalid number of arguments (${arguments.length}) - expects one of (${p[v].overloadTable})!`), p[v].overloadTable[arguments.length].apply(this, arguments);
        }, p[v].overloadTable = [], p[v].overloadTable[$.argCount] = $;
      }
    }
    function nn(p, v, m) {
      i.hasOwnProperty(p) ? ((m === void 0 || i[p].overloadTable !== void 0 && i[p].overloadTable[m] !== void 0) && ce(`Cannot register public name '${p}' twice`), Dr(i, p, p), i.hasOwnProperty(m) && ce(`Cannot register multiple overloads of a function with the same number of arguments (${m})!`), i[p].overloadTable[m] = v) : (i[p] = v, m !== void 0 && (i[p].numArguments = m));
    }
    function on(p, v, m, $, R, B, O, x) {
      this.name = p, this.constructor = v, this.instancePrototype = m, this.rawDestructor = $, this.baseClass = R, this.getActualType = B, this.upcast = O, this.downcast = x, this.pureVirtualFunctions = [];
    }
    function ht(p, v, m) {
      for (; v !== m; )
        v.upcast || ce(`Expected null or instance of ${m.name}, got an instance of ${v.name}`), p = v.upcast(p), v = v.baseClass;
      return p;
    }
    function Dt(p, v) {
      if (v === null)
        return this.isReference && ce(`null is not a valid ${this.name}`), 0;
      v.$$ || ce(`Cannot pass "${dr(v)}" as a ${this.name}`), v.$$.ptr || ce(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var m = v.$$.ptrType.registeredClass, $ = ht(v.$$.ptr, m, this.registeredClass);
      return $;
    }
    function ar(p, v) {
      var m;
      if (v === null)
        return this.isReference && ce(`null is not a valid ${this.name}`), this.isSmartPointer ? (m = this.rawConstructor(), p !== null && p.push(this.rawDestructor, m), m) : 0;
      v.$$ || ce(`Cannot pass "${dr(v)}" as a ${this.name}`), v.$$.ptr || ce(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && v.$$.ptrType.isConst && ce(`Cannot convert argument of type ${v.$$.smartPtrType ? v.$$.smartPtrType.name : v.$$.ptrType.name} to parameter type ${this.name}`);
      var $ = v.$$.ptrType.registeredClass;
      if (m = ht(v.$$.ptr, $, this.registeredClass), this.isSmartPointer)
        switch (v.$$.smartPtr === void 0 && ce("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            v.$$.smartPtrType === this ? m = v.$$.smartPtr : ce(`Cannot convert argument of type ${v.$$.smartPtrType ? v.$$.smartPtrType.name : v.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            m = v.$$.smartPtr;
            break;
          case 2:
            if (v.$$.smartPtrType === this)
              m = v.$$.smartPtr;
            else {
              var R = v.clone();
              m = this.rawShare(m, Kt.toHandle(function() {
                R.delete();
              })), p !== null && p.push(this.rawDestructor, m);
            }
            break;
          default:
            ce("Unsupporting sharing policy");
        }
      return m;
    }
    function sn(p, v) {
      if (v === null)
        return this.isReference && ce(`null is not a valid ${this.name}`), 0;
      v.$$ || ce(`Cannot pass "${dr(v)}" as a ${this.name}`), v.$$.ptr || ce(`Cannot pass deleted object as a pointer of type ${this.name}`), v.$$.ptrType.isConst && ce(`Cannot convert argument of type ${v.$$.ptrType.name} to parameter type ${this.name}`);
      var m = v.$$.ptrType.registeredClass, $ = ht(v.$$.ptr, m, this.registeredClass);
      return $;
    }
    function wt(p) {
      return this.fromWireType(ne[p >> 2]);
    }
    function ur(p) {
      return this.rawGetPointee && (p = this.rawGetPointee(p)), p;
    }
    function lr(p) {
      this.rawDestructor && this.rawDestructor(p);
    }
    function an(p) {
      p !== null && p.delete();
    }
    function un() {
      _e.prototype.getPointee = ur, _e.prototype.destructor = lr, _e.prototype.argPackAdvance = 8, _e.prototype.readValueFromPointer = wt, _e.prototype.deleteObject = an, _e.prototype.fromWireType = sr;
    }
    function _e(p, v, m, $, R, B, O, x, q, I, re) {
      this.name = p, this.registeredClass = v, this.isReference = m, this.isConst = $, this.isSmartPointer = R, this.pointeeType = B, this.sharingPolicy = O, this.rawGetPointee = x, this.rawConstructor = q, this.rawShare = I, this.rawDestructor = re, !R && v.baseClass === void 0 ? $ ? (this.toWireType = Dt, this.destructorFunction = null) : (this.toWireType = sn, this.destructorFunction = null) : this.toWireType = ar;
    }
    function Ft(p, v, m) {
      i.hasOwnProperty(p) || ye("Replacing nonexistant public symbol"), i[p].overloadTable !== void 0 && m !== void 0 ? i[p].overloadTable[m] = v : (i[p] = v, i[p].argCount = m);
    }
    var Je = (p, v, m) => {
      var $ = i["dynCall_" + p];
      return m && m.length ? $.apply(null, [v].concat(m)) : $.call(null, v);
    }, Xt = [], Fr = (p) => {
      var v = Xt[p];
      return v || (p >= Xt.length && (Xt.length = p + 1), Xt[p] = v = X.get(p)), v;
    }, et = (p, v, m) => {
      if (p.includes("j"))
        return Je(p, v, m);
      var $ = Fr(v).apply(null, m);
      return $;
    }, ln = (p, v) => {
      var m = [];
      return function() {
        return m.length = 0, Object.assign(m, arguments), et(p, v, m);
      };
    };
    function _t(p, v) {
      p = Re(p);
      function m() {
        return p.includes("j") ? ln(p, v) : Fr(v);
      }
      var $ = m();
      return typeof $ != "function" && ce(`unknown function pointer with signature ${p}: ${v}`), $;
    }
    function pt(p, v) {
      var m = we(v, function($) {
        this.name = v, this.message = $;
        var R = new Error($).stack;
        R !== void 0 && (this.stack = this.toString() + `
` + R.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return m.prototype = Object.create(p.prototype), m.prototype.constructor = m, m.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, m;
    }
    var Rr = void 0;
    function Ge(p) {
      var v = Ir(p), m = Re(v);
      return tt(v), m;
    }
    function cr(p, v) {
      var m = [], $ = {};
      function R(B) {
        if (!$[B] && !ut[B]) {
          if (Wt[B]) {
            Wt[B].forEach(R);
            return;
          }
          m.push(B), $[B] = !0;
        }
      }
      throw v.forEach(R), new Rr(`${p}: ` + m.map(Ge).join([", "]));
    }
    function cn(p, v, m, $, R, B, O, x, q, I, re, ie, le) {
      re = Re(re), B = _t(R, B), x && (x = _t(O, x)), I && (I = _t(q, I)), le = _t(ie, le);
      var fe = Gt(re);
      nn(fe, function() {
        cr(`Cannot construct ${re} due to unbound types`, [$]);
      }), lt([p, v, m], $ ? [$] : [], function(be) {
        be = be[0];
        var Oe, Ae;
        $ ? (Oe = be.registeredClass, Ae = Oe.instancePrototype) : Ae = qe.prototype;
        var st = we(fe, function() {
          if (Object.getPrototypeOf(this) !== _r)
            throw new G("Use 'new' to construct " + re);
          if (ze.constructor_body === void 0)
            throw new G(re + " has no accessible constructor");
          var Xe = ze.constructor_body[arguments.length];
          if (Xe === void 0)
            throw new G(`Tried to invoke ctor of ${re} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(ze.constructor_body).toString()}) parameters instead!`);
          return Xe.apply(this, arguments);
        }), _r = Object.create(Ae, { constructor: { value: st } });
        st.prototype = _r;
        var ze = new on(re, st, _r, le, Oe, B, x, I);
        ze.baseClass && (ze.baseClass.__derivedClasses === void 0 && (ze.baseClass.__derivedClasses = []), ze.baseClass.__derivedClasses.push(ze));
        var Mn = new _e(re, ze, !0, !1, !1), bt = new _e(re + "*", ze, !1, !1, !1), Hr = new _e(re + " const*", ze, !1, !0, !1);
        return Ar[p] = { pointerType: bt, constPointerType: Hr }, Ft(fe, st), [Mn, bt, Hr];
      });
    }
    function xr(p, v) {
      for (var m = [], $ = 0; $ < p; $++)
        m.push(K[v + $ * 4 >> 2]);
      return m;
    }
    function dn(p) {
      for (; p.length; ) {
        var v = p.pop(), m = p.pop();
        m(v);
      }
    }
    function Ur(p, v) {
      if (!(p instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof p} which is not a function`);
      var m = we(p.name || "unknownFunctionName", function() {
      });
      m.prototype = p.prototype;
      var $ = new m(), R = p.apply($, v);
      return R instanceof Object ? R : $;
    }
    function Te(p, v, m, $, R, B) {
      var O = v.length;
      O < 2 && ce("argTypes array size mismatch! Must at least get return value and 'this' types!");
      for (var x = v[1] !== null && m !== null, q = !1, I = 1; I < v.length; ++I)
        if (v[I] !== null && v[I].destructorFunction === void 0) {
          q = !0;
          break;
        }
      for (var re = v[0].name !== "void", ie = "", le = "", I = 0; I < O - 2; ++I)
        ie += (I !== 0 ? ", " : "") + "arg" + I, le += (I !== 0 ? ", " : "") + "arg" + I + "Wired";
      var fe = `
        return function ${Gt(p)}(${ie}) {
        if (arguments.length !== ${O - 2}) {
          throwBindingError('function ${p} called with ${arguments.length} arguments, expected ${O - 2} args!');
        }`;
      q && (fe += `var destructors = [];
`);
      var be = q ? "destructors" : "null", Oe = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"], Ae = [ce, $, R, dn, v[0], v[1]];
      x && (fe += "var thisWired = classParam.toWireType(" + be + `, this);
`);
      for (var I = 0; I < O - 2; ++I)
        fe += "var arg" + I + "Wired = argType" + I + ".toWireType(" + be + ", arg" + I + "); // " + v[I + 2].name + `
`, Oe.push("argType" + I), Ae.push(v[I + 2]);
      if (x && (le = "thisWired" + (le.length > 0 ? ", " : "") + le), fe += (re || B ? "var rv = " : "") + "invoker(fn" + (le.length > 0 ? ", " : "") + le + `);
`, q)
        fe += `runDestructors(destructors);
`;
      else
        for (var I = x ? 1 : 2; I < v.length; ++I) {
          var st = I === 1 ? "thisWired" : "arg" + (I - 2) + "Wired";
          v[I].destructorFunction !== null && (fe += st + "_dtor(" + st + "); // " + v[I].name + `
`, Oe.push(st + "_dtor"), Ae.push(v[I].destructorFunction));
        }
      return re && (fe += `var ret = retType.fromWireType(rv);
return ret;
`), fe += `}
`, Oe.push(fe), Ur(Function, Oe).apply(null, Ae);
    }
    function fn(p, v, m, $, R, B) {
      var O = xr(v, m);
      R = _t($, R), lt([], [p], function(x) {
        x = x[0];
        var q = `constructor ${x.name}`;
        if (x.registeredClass.constructor_body === void 0 && (x.registeredClass.constructor_body = []), x.registeredClass.constructor_body[v - 1] !== void 0)
          throw new G(`Cannot register multiple constructors with identical number of parameters (${v - 1}) for class '${x.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return x.registeredClass.constructor_body[v - 1] = () => {
          cr(`Cannot construct ${x.name} due to unbound types`, O);
        }, lt([], O, function(I) {
          return I.splice(1, 0, null), x.registeredClass.constructor_body[v - 1] = Te(q, I, null, R, B), [];
        }), [];
      });
    }
    function hn(p, v, m, $, R, B, O, x, q) {
      var I = xr(m, $);
      v = Re(v), B = _t(R, B), lt([], [p], function(re) {
        re = re[0];
        var ie = `${re.name}.${v}`;
        v.startsWith("@@") && (v = Symbol[v.substring(2)]), x && re.registeredClass.pureVirtualFunctions.push(v);
        function le() {
          cr(`Cannot call ${ie} due to unbound types`, I);
        }
        var fe = re.registeredClass.instancePrototype, be = fe[v];
        return be === void 0 || be.overloadTable === void 0 && be.className !== re.name && be.argCount === m - 2 ? (le.argCount = m - 2, le.className = re.name, fe[v] = le) : (Dr(fe, v, ie), fe[v].overloadTable[m - 2] = le), lt([], I, function(Oe) {
          var Ae = Te(ie, Oe, re, B, O, q);
          return fe[v].overloadTable === void 0 ? (Ae.argCount = m - 2, fe[v] = Ae) : fe[v].overloadTable[m - 2] = Ae, [];
        }), [];
      });
    }
    function vt() {
      Object.assign(Et.prototype, { get(p) {
        return this.allocated[p];
      }, has(p) {
        return this.allocated[p] !== void 0;
      }, allocate(p) {
        var v = this.freelist.pop() || this.allocated.length;
        return this.allocated[v] = p, v;
      }, free(p) {
        this.allocated[p] = void 0, this.freelist.push(p);
      } });
    }
    function Et() {
      this.allocated = [void 0], this.freelist = [];
    }
    var Be = new Et();
    function Br(p) {
      p >= Be.reserved && --Be.get(p).refcount === 0 && Be.free(p);
    }
    function pn() {
      for (var p = 0, v = Be.reserved; v < Be.allocated.length; ++v)
        Be.allocated[v] !== void 0 && ++p;
      return p;
    }
    function Rt() {
      Be.allocated.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 }), Be.reserved = Be.allocated.length, i.count_emval_handles = pn;
    }
    var Kt = { toValue: (p) => (p || ce("Cannot use deleted val. handle = " + p), Be.get(p).value), toHandle: (p) => {
      switch (p) {
        case void 0:
          return 1;
        case null:
          return 2;
        case !0:
          return 3;
        case !1:
          return 4;
        default:
          return Be.allocate({ refcount: 1, value: p });
      }
    } };
    function vn(p, v) {
      v = Re(v), xe(p, { name: v, fromWireType: function(m) {
        var $ = Kt.toValue(m);
        return Br(m), $;
      }, toWireType: function(m, $) {
        return Kt.toHandle($);
      }, argPackAdvance: 8, readValueFromPointer: wt, destructorFunction: null });
    }
    function dr(p) {
      if (p === null)
        return "null";
      var v = typeof p;
      return v === "object" || v === "array" || v === "function" ? p.toString() : "" + p;
    }
    function mt(p, v) {
      switch (v) {
        case 2:
          return function(m) {
            return this.fromWireType($e[m >> 2]);
          };
        case 3:
          return function(m) {
            return this.fromWireType(rt[m >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + p);
      }
    }
    function mn(p, v, m) {
      var $ = U(m);
      v = Re(v), xe(p, { name: v, fromWireType: function(R) {
        return R;
      }, toWireType: function(R, B) {
        return B;
      }, argPackAdvance: 8, readValueFromPointer: mt(v, $), destructorFunction: null });
    }
    function gn(p, v, m) {
      switch (v) {
        case 0:
          return m ? function(R) {
            return pe[R];
          } : function(R) {
            return Q[R];
          };
        case 1:
          return m ? function(R) {
            return ae[R >> 1];
          } : function(R) {
            return Ve[R >> 1];
          };
        case 2:
          return m ? function(R) {
            return ne[R >> 2];
          } : function(R) {
            return K[R >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + p);
      }
    }
    function yn(p, v, m, $, R) {
      v = Re(v);
      var B = U(m), O = (ie) => ie;
      if ($ === 0) {
        var x = 32 - 8 * m;
        O = (ie) => ie << x >>> x;
      }
      var q = v.includes("unsigned"), I = (ie, le) => {
      }, re;
      q ? re = function(ie, le) {
        return I(le, this.name), le >>> 0;
      } : re = function(ie, le) {
        return I(le, this.name), le;
      }, xe(p, { name: v, fromWireType: O, toWireType: re, argPackAdvance: 8, readValueFromPointer: gn(v, B, $ !== 0), destructorFunction: null });
    }
    function wn(p, v, m) {
      var $ = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], R = $[v];
      function B(O) {
        O = O >> 2;
        var x = K, q = x[O], I = x[O + 1];
        return new R(x.buffer, I, q);
      }
      m = Re(m), xe(p, { name: m, fromWireType: B, argPackAdvance: 8, readValueFromPointer: B }, { ignoreDuplicateRegistrations: !0 });
    }
    var Ee = (p, v, m, $) => {
      if (!($ > 0))
        return 0;
      for (var R = m, B = m + $ - 1, O = 0; O < p.length; ++O) {
        var x = p.charCodeAt(O);
        if (x >= 55296 && x <= 57343) {
          var q = p.charCodeAt(++O);
          x = 65536 + ((x & 1023) << 10) | q & 1023;
        }
        if (x <= 127) {
          if (m >= B)
            break;
          v[m++] = x;
        } else if (x <= 2047) {
          if (m + 1 >= B)
            break;
          v[m++] = 192 | x >> 6, v[m++] = 128 | x & 63;
        } else if (x <= 65535) {
          if (m + 2 >= B)
            break;
          v[m++] = 224 | x >> 12, v[m++] = 128 | x >> 6 & 63, v[m++] = 128 | x & 63;
        } else {
          if (m + 3 >= B)
            break;
          v[m++] = 240 | x >> 18, v[m++] = 128 | x >> 12 & 63, v[m++] = 128 | x >> 6 & 63, v[m++] = 128 | x & 63;
        }
      }
      return v[m] = 0, m - R;
    }, _n = (p, v, m) => Ee(p, Q, v, m), En = (p) => {
      for (var v = 0, m = 0; m < p.length; ++m) {
        var $ = p.charCodeAt(m);
        $ <= 127 ? v++ : $ <= 2047 ? v += 2 : $ >= 55296 && $ <= 57343 ? (v += 4, ++m) : v += 3;
      }
      return v;
    }, ot = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, Qt = (p, v, m) => {
      for (var $ = v + m, R = v; p[R] && !(R >= $); )
        ++R;
      if (R - v > 16 && p.buffer && ot)
        return ot.decode(p.subarray(v, R));
      for (var B = ""; v < R; ) {
        var O = p[v++];
        if (!(O & 128)) {
          B += String.fromCharCode(O);
          continue;
        }
        var x = p[v++] & 63;
        if ((O & 224) == 192) {
          B += String.fromCharCode((O & 31) << 6 | x);
          continue;
        }
        var q = p[v++] & 63;
        if ((O & 240) == 224 ? O = (O & 15) << 12 | x << 6 | q : O = (O & 7) << 18 | x << 12 | q << 6 | p[v++] & 63, O < 65536)
          B += String.fromCharCode(O);
        else {
          var I = O - 65536;
          B += String.fromCharCode(55296 | I >> 10, 56320 | I & 1023);
        }
      }
      return B;
    }, bn = (p, v) => p ? Qt(Q, p, v) : "";
    function $n(p, v) {
      v = Re(v);
      var m = v === "std::string";
      xe(p, { name: v, fromWireType: function($) {
        var R = K[$ >> 2], B = $ + 4, O;
        if (m)
          for (var x = B, q = 0; q <= R; ++q) {
            var I = B + q;
            if (q == R || Q[I] == 0) {
              var re = I - x, ie = bn(x, re);
              O === void 0 ? O = ie : (O += String.fromCharCode(0), O += ie), x = I + 1;
            }
          }
        else {
          for (var le = new Array(R), q = 0; q < R; ++q)
            le[q] = String.fromCharCode(Q[B + q]);
          O = le.join("");
        }
        return tt($), O;
      }, toWireType: function($, R) {
        R instanceof ArrayBuffer && (R = new Uint8Array(R));
        var B, O = typeof R == "string";
        O || R instanceof Uint8Array || R instanceof Uint8ClampedArray || R instanceof Int8Array || ce("Cannot pass non-string to std::string"), m && O ? B = En(R) : B = R.length;
        var x = Bt(4 + B + 1), q = x + 4;
        if (K[x >> 2] = B, m && O)
          _n(R, q, B + 1);
        else if (O)
          for (var I = 0; I < B; ++I) {
            var re = R.charCodeAt(I);
            re > 255 && (tt(q), ce("String has UTF-16 code units that do not fit in 8 bits")), Q[q + I] = re;
          }
        else
          for (var I = 0; I < B; ++I)
            Q[q + I] = R[I];
        return $ !== null && $.push(tt, x), x;
      }, argPackAdvance: 8, readValueFromPointer: wt, destructorFunction: function($) {
        tt($);
      } });
    }
    var Me = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, Pn = (p, v) => {
      for (var m = p, $ = m >> 1, R = $ + v / 2; !($ >= R) && Ve[$]; )
        ++$;
      if (m = $ << 1, m - p > 32 && Me)
        return Me.decode(Q.subarray(p, m));
      for (var B = "", O = 0; !(O >= v / 2); ++O) {
        var x = ae[p + O * 2 >> 1];
        if (x == 0)
          break;
        B += String.fromCharCode(x);
      }
      return B;
    }, fr = (p, v, m) => {
      if (m === void 0 && (m = 2147483647), m < 2)
        return 0;
      m -= 2;
      for (var $ = v, R = m < p.length * 2 ? m / 2 : p.length, B = 0; B < R; ++B) {
        var O = p.charCodeAt(B);
        ae[v >> 1] = O, v += 2;
      }
      return ae[v >> 1] = 0, v - $;
    }, hr = (p) => p.length * 2, xt = (p, v) => {
      for (var m = 0, $ = ""; !(m >= v / 4); ) {
        var R = ne[p + m * 4 >> 2];
        if (R == 0)
          break;
        if (++m, R >= 65536) {
          var B = R - 65536;
          $ += String.fromCharCode(55296 | B >> 10, 56320 | B & 1023);
        } else
          $ += String.fromCharCode(R);
      }
      return $;
    }, Tn = (p, v, m) => {
      if (m === void 0 && (m = 2147483647), m < 4)
        return 0;
      for (var $ = v, R = $ + m - 4, B = 0; B < p.length; ++B) {
        var O = p.charCodeAt(B);
        if (O >= 55296 && O <= 57343) {
          var x = p.charCodeAt(++B);
          O = 65536 + ((O & 1023) << 10) | x & 1023;
        }
        if (ne[v >> 2] = O, v += 4, v + 4 > R)
          break;
      }
      return ne[v >> 2] = 0, v - $;
    }, pr = (p) => {
      for (var v = 0, m = 0; m < p.length; ++m) {
        var $ = p.charCodeAt(m);
        $ >= 55296 && $ <= 57343 && ++m, v += 4;
      }
      return v;
    }, kn = function(p, v, m) {
      m = Re(m);
      var $, R, B, O, x;
      v === 2 ? ($ = Pn, R = fr, O = hr, B = () => Ve, x = 1) : v === 4 && ($ = xt, R = Tn, O = pr, B = () => K, x = 2), xe(p, { name: m, fromWireType: function(q) {
        for (var I = K[q >> 2], re = B(), ie, le = q + 4, fe = 0; fe <= I; ++fe) {
          var be = q + 4 + fe * v;
          if (fe == I || re[be >> x] == 0) {
            var Oe = be - le, Ae = $(le, Oe);
            ie === void 0 ? ie = Ae : (ie += String.fromCharCode(0), ie += Ae), le = be + v;
          }
        }
        return tt(q), ie;
      }, toWireType: function(q, I) {
        typeof I != "string" && ce(`Cannot pass non-string to C++ string type ${m}`);
        var re = O(I), ie = Bt(4 + re + v);
        return K[ie >> 2] = re >> x, R(I, ie + 4, re + v), q !== null && q.push(tt, ie), ie;
      }, argPackAdvance: 8, readValueFromPointer: wt, destructorFunction: function(q) {
        tt(q);
      } });
    };
    function vr(p, v) {
      v = Re(v), xe(p, { isVoid: !0, name: v, argPackAdvance: 0, fromWireType: function() {
      }, toWireType: function(m, $) {
      } });
    }
    var mr = {};
    function Cn(p) {
      var v = mr[p];
      return v === void 0 ? Re(p) : v;
    }
    var gr = [];
    function Sn(p, v, m, $) {
      p = gr[p], v = Kt.toValue(v), m = Cn(m), p(v, m, null, $);
    }
    function yr(p) {
      var v = gr.length;
      return gr.push(p), v;
    }
    function ge(p, v) {
      var m = ut[p];
      return m === void 0 && ce(v + " has unknown type " + Ge(p)), m;
    }
    function wr(p, v) {
      for (var m = new Array(p), $ = 0; $ < p; ++$)
        m[$] = ge(K[v + $ * 4 >> 2], "parameter " + $);
      return m;
    }
    var Mr = [];
    function An(p, v) {
      var m = wr(p, v), $ = m[0], R = $.name + "_$" + m.slice(1).map(function(be) {
        return be.name;
      }).join("_") + "$", B = Mr[R];
      if (B !== void 0)
        return B;
      for (var O = ["retType"], x = [$], q = "", I = 0; I < p - 1; ++I)
        q += (I !== 0 ? ", " : "") + "arg" + I, O.push("argType" + I), x.push(m[1 + I]);
      for (var re = Gt("methodCaller_" + R), ie = "return function " + re + `(handle, name, destructors, args) {
`, le = 0, I = 0; I < p - 1; ++I)
        ie += "    var arg" + I + " = argType" + I + ".readValueFromPointer(args" + (le ? "+" + le : "") + `);
`, le += m[I + 1].argPackAdvance;
      ie += "    var rv = handle[name](" + q + `);
`;
      for (var I = 0; I < p - 1; ++I)
        m[I + 1].deleteObject && (ie += "    argType" + I + ".deleteObject(arg" + I + `);
`);
      $.isVoid || (ie += `    return retType.toWireType(destructors, rv);
`), ie += `};
`, O.push(ie);
      var fe = Ur(Function, O).apply(null, x);
      return B = yr(fe), Mr[R] = B, B;
    }
    var gt = () => {
      Pe("");
    }, Or;
    Or = () => performance.now();
    var Ut = (p, v, m) => Q.copyWithin(p, v, v + m), Dn = (p) => {
      Pe("OOM");
    }, Fn = (p) => {
      Q.length, Dn();
    }, Rn = [null, [], []], xn = (p, v) => {
      var m = Rn[p];
      v === 0 || v === 10 ? ((p === 1 ? k : j)(Qt(m, 0)), m.length = 0) : m.push(v);
    }, Un = (p, v, m, $) => {
      for (var R = 0, B = 0; B < m; B++) {
        var O = K[v >> 2], x = K[v + 4 >> 2];
        v += 8;
        for (var q = 0; q < x; q++)
          xn(p, Q[O + q]);
        R += x;
      }
      return K[$ >> 2] = R, 0;
    };
    Y(), G = i.BindingError = class extends Error {
      constructor(v) {
        super(v), this.name = "BindingError";
      }
    }, Vt = i.InternalError = class extends Error {
      constructor(v) {
        super(v), this.name = "InternalError";
      }
    }, N(), tn(), un(), Rr = i.UnboundTypeError = pt(Error, "UnboundTypeError"), vt(), Rt();
    var Bn = { o: Yr, r: Zr, m: Tt, q: cn, p: fn, d: hn, u: vn, k: mn, b: yn, a: wn, j: $n, g: kn, n: vr, e: Sn, l: Br, h: An, f: gt, c: Or, t: Ut, s: Fn, i: Un };
    Ie();
    var tt = (p) => (tt = te.x)(p), Bt = (p) => (Bt = te.y)(p), Ir = (p) => (Ir = te.A)(p);
    i.__embind_initialize_bindings = () => (i.__embind_initialize_bindings = te.B)();
    var Lr = (p) => (Lr = te.C)(p);
    i.dynCall_jiji = (p, v, m, $, R) => (i.dynCall_jiji = te.D)(p, v, m, $, R);
    var Yt;
    $t = function p() {
      Yt || jr(), Yt || ($t = p);
    };
    function jr() {
      if (at > 0 || (er(), at > 0))
        return;
      function p() {
        Yt || (Yt = !0, i.calledRun = !0, !H && (tr(), h(i), i.onRuntimeInitialized && i.onRuntimeInitialized(), rr()));
      }
      i.setStatus ? (i.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          i.setStatus("");
        }, 1), p();
      }, 1)) : p();
    }
    if (i.preInit)
      for (typeof i.preInit == "function" && (i.preInit = [i.preInit]); i.preInit.length > 0; )
        i.preInit.pop()();
    return jr(), a.ready;
  };
})();
var Co = (() => {
  var T = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
  return function(a = {}) {
    var i = a, h, c;
    i.ready = new Promise((t, r) => {
      h = t, c = r;
    });
    var _ = Object.assign({}, i), b = "./this.program", P = typeof window == "object", y = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && process.versions.node;
    var E = "";
    function D(t) {
      return i.locateFile ? i.locateFile(t, E) : E + t;
    }
    var k, j, z;
    (P || y) && (y ? E = self.location.href : typeof document < "u" && document.currentScript && (E = document.currentScript.src), T && (E = T), E.indexOf("blob:") !== 0 ? E = E.substr(0, E.replace(/[?#].*/, "").lastIndexOf("/") + 1) : E = "", k = (t) => {
      var r = new XMLHttpRequest();
      return r.open("GET", t, !1), r.send(null), r.responseText;
    }, y && (z = (t) => {
      var r = new XMLHttpRequest();
      return r.open("GET", t, !1), r.responseType = "arraybuffer", r.send(null), new Uint8Array(r.response);
    }), j = (t, r, n) => {
      var o = new XMLHttpRequest();
      o.open("GET", t, !0), o.responseType = "arraybuffer", o.onload = () => {
        if (o.status == 200 || o.status == 0 && o.response) {
          r(o.response);
          return;
        }
        n();
      }, o.onerror = n, o.send(null);
    });
    var W = i.print || console.log.bind(console), te = i.printErr || console.error.bind(console);
    Object.assign(i, _), _ = null, i.arguments && i.arguments, i.thisProgram && (b = i.thisProgram), i.quit && i.quit;
    var H;
    i.wasmBinary && (H = i.wasmBinary), i.noExitRuntime, typeof WebAssembly != "object" && Fe("no native wasm support detected");
    var pe, Q, ae = !1;
    function Ve(t, r) {
      t || Fe(r);
    }
    var ne, K, $e, rt, V, X, jt, Ht;
    function Tr() {
      var t = pe.buffer;
      i.HEAP8 = ne = new Int8Array(t), i.HEAP16 = $e = new Int16Array(t), i.HEAP32 = V = new Int32Array(t), i.HEAPU8 = K = new Uint8Array(t), i.HEAPU16 = rt = new Uint16Array(t), i.HEAPU32 = X = new Uint32Array(t), i.HEAPF32 = jt = new Float32Array(t), i.HEAPF64 = Ht = new Float64Array(t);
    }
    var er, tr = [], rr = [], nr = [];
    function qr() {
      if (i.preRun)
        for (typeof i.preRun == "function" && (i.preRun = [i.preRun]); i.preRun.length; )
          $t(i.preRun.shift());
      yt(tr);
    }
    function Gr() {
      !i.noFSInit && !s.init.initialized && s.init(), s.ignorePermissions = !1, yt(rr);
    }
    function at() {
      if (i.postRun)
        for (typeof i.postRun == "function" && (i.postRun = [i.postRun]); i.postRun.length; )
          Kr(i.postRun.shift());
      yt(nr);
    }
    function $t(t) {
      tr.unshift(t);
    }
    function Xr(t) {
      rr.unshift(t);
    }
    function Kr(t) {
      nr.unshift(t);
    }
    var Pe = 0, Qe = null;
    function ei(t) {
      return t;
    }
    function Ne(t) {
      Pe++, i.monitorRunDependencies && i.monitorRunDependencies(Pe);
    }
    function nt(t) {
      if (Pe--, i.monitorRunDependencies && i.monitorRunDependencies(Pe), Pe == 0 && Qe) {
        var r = Qe;
        Qe = null, r();
      }
    }
    function Fe(t) {
      i.onAbort && i.onAbort(t), t = "Aborted(" + t + ")", te(t), ae = !0, t += ". Build with -sASSERTIONS for more info.";
      var r = new WebAssembly.RuntimeError(t);
      throw c(r), r;
    }
    var kr = "data:application/octet-stream;base64,";
    function ir(t) {
      return t.startsWith(kr);
    }
    var Ie;
    Ie = "videodec.wasm", ir(Ie) || (Ie = D(Ie));
    function Pt(t) {
      if (t == Ie && H)
        return new Uint8Array(H);
      if (z)
        return z(t);
      throw "both async and sync fetching of the wasm failed";
    }
    function Qr(t) {
      return !H && (P || y) && typeof fetch == "function" ? fetch(t, { credentials: "same-origin" }).then((r) => {
        if (!r.ok)
          throw "failed to load wasm binary file at '" + t + "'";
        return r.arrayBuffer();
      }).catch(() => Pt(t)) : Promise.resolve().then(() => Pt(t));
    }
    function zt(t, r, n) {
      return Qr(t).then((o) => WebAssembly.instantiate(o, r)).then((o) => o).then(n, (o) => {
        te("failed to asynchronously prepare wasm: " + o), Fe(o);
      });
    }
    function Yr(t, r, n, o) {
      return !t && typeof WebAssembly.instantiateStreaming == "function" && !ir(r) && typeof fetch == "function" ? fetch(r, { credentials: "same-origin" }).then((u) => {
        var l = WebAssembly.instantiateStreaming(u, n);
        return l.then(o, function(f) {
          return te("wasm streaming compile failed: " + f), te("falling back to ArrayBuffer instantiation"), zt(r, n, o);
        });
      }) : zt(r, n, o);
    }
    function Zr() {
      var t = { a: yi };
      function r(o, u) {
        var l = o.exports;
        return Q = l, pe = Q.E, Tr(), er = Q.H, Xr(Q.F), nt(), l;
      }
      Ne();
      function n(o) {
        r(o.instance);
      }
      if (i.instantiateWasm)
        try {
          return i.instantiateWasm(t, r);
        } catch (o) {
          te("Module.instantiateWasm callback failed with error: " + o), c(o);
        }
      return Yr(H, Ie, t, n).catch(c), {};
    }
    var U, Y, yt = (t) => {
      for (; t.length > 0; )
        t.shift()(i);
    };
    function Re(t) {
      this.excPtr = t, this.ptr = t - 24, this.set_type = function(r) {
        X[this.ptr + 4 >> 2] = r;
      }, this.get_type = function() {
        return X[this.ptr + 4 >> 2];
      }, this.set_destructor = function(r) {
        X[this.ptr + 8 >> 2] = r;
      }, this.get_destructor = function() {
        return X[this.ptr + 8 >> 2];
      }, this.set_caught = function(r) {
        r = r ? 1 : 0, ne[this.ptr + 12 >> 0] = r;
      }, this.get_caught = function() {
        return ne[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(r) {
        r = r ? 1 : 0, ne[this.ptr + 13 >> 0] = r;
      }, this.get_rethrown = function() {
        return ne[this.ptr + 13 >> 0] != 0;
      }, this.init = function(r, n) {
        this.set_adjusted_ptr(0), this.set_type(r), this.set_destructor(n);
      }, this.set_adjusted_ptr = function(r) {
        X[this.ptr + 16 >> 2] = r;
      }, this.get_adjusted_ptr = function() {
        return X[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var r = jn(this.get_type());
        if (r)
          return X[this.excPtr >> 2];
        var n = this.get_adjusted_ptr();
        return n !== 0 ? n : this.excPtr;
      };
    }
    var it = 0;
    function ut(t, r, n) {
      var o = new Re(t);
      throw o.init(r, n), it = t, it;
    }
    var Wt = (t) => (V[In() >> 2] = t, t), G = { isAbs: (t) => t.charAt(0) === "/", splitPath: (t) => {
      var r = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
      return r.exec(t).slice(1);
    }, normalizeArray: (t, r) => {
      for (var n = 0, o = t.length - 1; o >= 0; o--) {
        var u = t[o];
        u === "." ? t.splice(o, 1) : u === ".." ? (t.splice(o, 1), n++) : n && (t.splice(o, 1), n--);
      }
      if (r)
        for (; n; n--)
          t.unshift("..");
      return t;
    }, normalize: (t) => {
      var r = G.isAbs(t), n = t.substr(-1) === "/";
      return t = G.normalizeArray(t.split("/").filter((o) => !!o), !r).join("/"), !t && !r && (t = "."), t && n && (t += "/"), (r ? "/" : "") + t;
    }, dirname: (t) => {
      var r = G.splitPath(t), n = r[0], o = r[1];
      return !n && !o ? "." : (o && (o = o.substr(0, o.length - 1)), n + o);
    }, basename: (t) => {
      if (t === "/")
        return "/";
      t = G.normalize(t), t = t.replace(/\/$/, "");
      var r = t.lastIndexOf("/");
      return r === -1 ? t : t.substr(r + 1);
    }, join: function() {
      var t = Array.prototype.slice.call(arguments);
      return G.normalize(t.join("/"));
    }, join2: (t, r) => G.normalize(t + "/" + r) }, ce = () => {
      if (typeof crypto == "object" && typeof crypto.getRandomValues == "function")
        return (t) => crypto.getRandomValues(t);
      Fe("initRandomDevice");
    }, Vt = (t) => (Vt = ce())(t), ye = { resolve: function() {
      for (var t = "", r = !1, n = arguments.length - 1; n >= -1 && !r; n--) {
        var o = n >= 0 ? arguments[n] : s.cwd();
        if (typeof o != "string")
          throw new TypeError("Arguments to path.resolve must be strings");
        if (!o)
          return "";
        t = o + "/" + t, r = G.isAbs(o);
      }
      return t = G.normalizeArray(t.split("/").filter((u) => !!u), !r).join("/"), (r ? "/" : "") + t || ".";
    }, relative: (t, r) => {
      t = ye.resolve(t).substr(1), r = ye.resolve(r).substr(1);
      function n(g) {
        for (var S = 0; S < g.length && g[S] === ""; S++)
          ;
        for (var F = g.length - 1; F >= 0 && g[F] === ""; F--)
          ;
        return S > F ? [] : g.slice(S, F - S + 1);
      }
      for (var o = n(t.split("/")), u = n(r.split("/")), l = Math.min(o.length, u.length), f = l, d = 0; d < l; d++)
        if (o[d] !== u[d]) {
          f = d;
          break;
        }
      for (var w = [], d = f; d < o.length; d++)
        w.push("..");
      return w = w.concat(u.slice(f)), w.join("/");
    } }, lt = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, Le = (t, r, n) => {
      for (var o = r + n, u = r; t[u] && !(u >= o); )
        ++u;
      if (u - r > 16 && t.buffer && lt)
        return lt.decode(t.subarray(r, u));
      for (var l = ""; r < u; ) {
        var f = t[r++];
        if (!(f & 128)) {
          l += String.fromCharCode(f);
          continue;
        }
        var d = t[r++] & 63;
        if ((f & 224) == 192) {
          l += String.fromCharCode((f & 31) << 6 | d);
          continue;
        }
        var w = t[r++] & 63;
        if ((f & 240) == 224 ? f = (f & 15) << 12 | d << 6 | w : f = (f & 7) << 18 | d << 12 | w << 6 | t[r++] & 63, f < 65536)
          l += String.fromCharCode(f);
        else {
          var g = f - 65536;
          l += String.fromCharCode(55296 | g >> 10, 56320 | g & 1023);
        }
      }
      return l;
    }, xe = [], Tt = (t) => {
      for (var r = 0, n = 0; n < t.length; ++n) {
        var o = t.charCodeAt(n);
        o <= 127 ? r++ : o <= 2047 ? r += 2 : o >= 55296 && o <= 57343 ? (r += 4, ++n) : r += 3;
      }
      return r;
    }, kt = (t, r, n, o) => {
      if (!(o > 0))
        return 0;
      for (var u = n, l = n + o - 1, f = 0; f < t.length; ++f) {
        var d = t.charCodeAt(f);
        if (d >= 55296 && d <= 57343) {
          var w = t.charCodeAt(++f);
          d = 65536 + ((d & 1023) << 10) | w & 1023;
        }
        if (d <= 127) {
          if (n >= l)
            break;
          r[n++] = d;
        } else if (d <= 2047) {
          if (n + 1 >= l)
            break;
          r[n++] = 192 | d >> 6, r[n++] = 128 | d & 63;
        } else if (d <= 65535) {
          if (n + 2 >= l)
            break;
          r[n++] = 224 | d >> 12, r[n++] = 128 | d >> 6 & 63, r[n++] = 128 | d & 63;
        } else {
          if (n + 3 >= l)
            break;
          r[n++] = 240 | d >> 18, r[n++] = 128 | d >> 12 & 63, r[n++] = 128 | d >> 6 & 63, r[n++] = 128 | d & 63;
        }
      }
      return r[n] = 0, n - u;
    };
    function Ct(t, r, n) {
      var o = n > 0 ? n : Tt(t) + 1, u = new Array(o), l = kt(t, u, 0, u.length);
      return r && (u.length = l), u;
    }
    var or = () => {
      if (!xe.length) {
        var t = null;
        if (typeof window < "u" && typeof window.prompt == "function" ? (t = window.prompt("Input: "), t !== null && (t += `
`)) : typeof readline == "function" && (t = readline(), t !== null && (t += `
`)), !t)
          return null;
        xe = Ct(t, !0);
      }
      return xe.shift();
    }, ke = { ttys: [], init: function() {
    }, shutdown: function() {
    }, register: function(t, r) {
      ke.ttys[t] = { input: [], output: [], ops: r }, s.registerDevice(t, ke.stream_ops);
    }, stream_ops: { open: function(t) {
      var r = ke.ttys[t.node.rdev];
      if (!r)
        throw new s.ErrnoError(43);
      t.tty = r, t.seekable = !1;
    }, close: function(t) {
      t.tty.ops.fsync(t.tty);
    }, fsync: function(t) {
      t.tty.ops.fsync(t.tty);
    }, read: function(t, r, n, o, u) {
      if (!t.tty || !t.tty.ops.get_char)
        throw new s.ErrnoError(60);
      for (var l = 0, f = 0; f < o; f++) {
        var d;
        try {
          d = t.tty.ops.get_char(t.tty);
        } catch {
          throw new s.ErrnoError(29);
        }
        if (d === void 0 && l === 0)
          throw new s.ErrnoError(6);
        if (d == null)
          break;
        l++, r[n + f] = d;
      }
      return l && (t.node.timestamp = Date.now()), l;
    }, write: function(t, r, n, o, u) {
      if (!t.tty || !t.tty.ops.put_char)
        throw new s.ErrnoError(60);
      try {
        for (var l = 0; l < o; l++)
          t.tty.ops.put_char(t.tty, r[n + l]);
      } catch {
        throw new s.ErrnoError(29);
      }
      return o && (t.node.timestamp = Date.now()), l;
    } }, default_tty_ops: { get_char: function(t) {
      return or();
    }, put_char: function(t, r) {
      r === null || r === 10 ? (W(Le(t.output, 0)), t.output = []) : r != 0 && t.output.push(r);
    }, fsync: function(t) {
      t.output && t.output.length > 0 && (W(Le(t.output, 0)), t.output = []);
    }, ioctl_tcgets: function(t) {
      return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    }, ioctl_tcsets: function(t, r, n) {
      return 0;
    }, ioctl_tiocgwinsz: function(t) {
      return [24, 80];
    } }, default_tty1_ops: { put_char: function(t, r) {
      r === null || r === 10 ? (te(Le(t.output, 0)), t.output = []) : r != 0 && t.output.push(r);
    }, fsync: function(t) {
      t.output && t.output.length > 0 && (te(Le(t.output, 0)), t.output = []);
    } } }, Nt = (t) => {
      Fe();
    }, L = { ops_table: null, mount(t) {
      return L.createNode(null, "/", 16895, 0);
    }, createNode(t, r, n, o) {
      if (s.isBlkdev(n) || s.isFIFO(n))
        throw new s.ErrnoError(63);
      L.ops_table || (L.ops_table = { dir: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr, lookup: L.node_ops.lookup, mknod: L.node_ops.mknod, rename: L.node_ops.rename, unlink: L.node_ops.unlink, rmdir: L.node_ops.rmdir, readdir: L.node_ops.readdir, symlink: L.node_ops.symlink }, stream: { llseek: L.stream_ops.llseek } }, file: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr }, stream: { llseek: L.stream_ops.llseek, read: L.stream_ops.read, write: L.stream_ops.write, allocate: L.stream_ops.allocate, mmap: L.stream_ops.mmap, msync: L.stream_ops.msync } }, link: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr, readlink: L.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr }, stream: s.chrdev_stream_ops } });
      var u = s.createNode(t, r, n, o);
      return s.isDir(u.mode) ? (u.node_ops = L.ops_table.dir.node, u.stream_ops = L.ops_table.dir.stream, u.contents = {}) : s.isFile(u.mode) ? (u.node_ops = L.ops_table.file.node, u.stream_ops = L.ops_table.file.stream, u.usedBytes = 0, u.contents = null) : s.isLink(u.mode) ? (u.node_ops = L.ops_table.link.node, u.stream_ops = L.ops_table.link.stream) : s.isChrdev(u.mode) && (u.node_ops = L.ops_table.chrdev.node, u.stream_ops = L.ops_table.chrdev.stream), u.timestamp = Date.now(), t && (t.contents[r] = u, t.timestamp = u.timestamp), u;
    }, getFileDataAsTypedArray(t) {
      return t.contents ? t.contents.subarray ? t.contents.subarray(0, t.usedBytes) : new Uint8Array(t.contents) : new Uint8Array(0);
    }, expandFileStorage(t, r) {
      var n = t.contents ? t.contents.length : 0;
      if (!(n >= r)) {
        var o = 1024 * 1024;
        r = Math.max(r, n * (n < o ? 2 : 1.125) >>> 0), n != 0 && (r = Math.max(r, 256));
        var u = t.contents;
        t.contents = new Uint8Array(r), t.usedBytes > 0 && t.contents.set(u.subarray(0, t.usedBytes), 0);
      }
    }, resizeFileStorage(t, r) {
      if (t.usedBytes != r)
        if (r == 0)
          t.contents = null, t.usedBytes = 0;
        else {
          var n = t.contents;
          t.contents = new Uint8Array(r), n && t.contents.set(n.subarray(0, Math.min(r, t.usedBytes))), t.usedBytes = r;
        }
    }, node_ops: { getattr(t) {
      var r = {};
      return r.dev = s.isChrdev(t.mode) ? t.id : 1, r.ino = t.id, r.mode = t.mode, r.nlink = 1, r.uid = 0, r.gid = 0, r.rdev = t.rdev, s.isDir(t.mode) ? r.size = 4096 : s.isFile(t.mode) ? r.size = t.usedBytes : s.isLink(t.mode) ? r.size = t.link.length : r.size = 0, r.atime = new Date(t.timestamp), r.mtime = new Date(t.timestamp), r.ctime = new Date(t.timestamp), r.blksize = 4096, r.blocks = Math.ceil(r.size / r.blksize), r;
    }, setattr(t, r) {
      r.mode !== void 0 && (t.mode = r.mode), r.timestamp !== void 0 && (t.timestamp = r.timestamp), r.size !== void 0 && L.resizeFileStorage(t, r.size);
    }, lookup(t, r) {
      throw s.genericErrors[44];
    }, mknod(t, r, n, o) {
      return L.createNode(t, r, n, o);
    }, rename(t, r, n) {
      if (s.isDir(t.mode)) {
        var o;
        try {
          o = s.lookupNode(r, n);
        } catch {
        }
        if (o)
          for (var u in o.contents)
            throw new s.ErrnoError(55);
      }
      delete t.parent.contents[t.name], t.parent.timestamp = Date.now(), t.name = n, r.contents[n] = t, r.timestamp = t.parent.timestamp, t.parent = r;
    }, unlink(t, r) {
      delete t.contents[r], t.timestamp = Date.now();
    }, rmdir(t, r) {
      var n = s.lookupNode(t, r);
      for (var o in n.contents)
        throw new s.ErrnoError(55);
      delete t.contents[r], t.timestamp = Date.now();
    }, readdir(t) {
      var r = [".", ".."];
      for (var n in t.contents)
        t.contents.hasOwnProperty(n) && r.push(n);
      return r;
    }, symlink(t, r, n) {
      var o = L.createNode(t, r, 41471, 0);
      return o.link = n, o;
    }, readlink(t) {
      if (!s.isLink(t.mode))
        throw new s.ErrnoError(28);
      return t.link;
    } }, stream_ops: { read(t, r, n, o, u) {
      var l = t.node.contents;
      if (u >= t.node.usedBytes)
        return 0;
      var f = Math.min(t.node.usedBytes - u, o);
      if (f > 8 && l.subarray)
        r.set(l.subarray(u, u + f), n);
      else
        for (var d = 0; d < f; d++)
          r[n + d] = l[u + d];
      return f;
    }, write(t, r, n, o, u, l) {
      if (!o)
        return 0;
      var f = t.node;
      if (f.timestamp = Date.now(), r.subarray && (!f.contents || f.contents.subarray)) {
        if (l)
          return f.contents = r.subarray(n, n + o), f.usedBytes = o, o;
        if (f.usedBytes === 0 && u === 0)
          return f.contents = r.slice(n, n + o), f.usedBytes = o, o;
        if (u + o <= f.usedBytes)
          return f.contents.set(r.subarray(n, n + o), u), o;
      }
      if (L.expandFileStorage(f, u + o), f.contents.subarray && r.subarray)
        f.contents.set(r.subarray(n, n + o), u);
      else
        for (var d = 0; d < o; d++)
          f.contents[u + d] = r[n + d];
      return f.usedBytes = Math.max(f.usedBytes, u + o), o;
    }, llseek(t, r, n) {
      var o = r;
      if (n === 1 ? o += t.position : n === 2 && s.isFile(t.node.mode) && (o += t.node.usedBytes), o < 0)
        throw new s.ErrnoError(28);
      return o;
    }, allocate(t, r, n) {
      L.expandFileStorage(t.node, r + n), t.node.usedBytes = Math.max(t.node.usedBytes, r + n);
    }, mmap(t, r, n, o, u) {
      if (!s.isFile(t.node.mode))
        throw new s.ErrnoError(43);
      var l, f, d = t.node.contents;
      if (!(u & 2) && d.buffer === ne.buffer)
        f = !1, l = d.byteOffset;
      else {
        if ((n > 0 || n + r < d.length) && (d.subarray ? d = d.subarray(n, n + r) : d = Array.prototype.slice.call(d, n, n + r)), f = !0, l = Nt(), !l)
          throw new s.ErrnoError(48);
        ne.set(d, l);
      }
      return { ptr: l, allocated: f };
    }, msync(t, r, n, o, u) {
      return L.stream_ops.write(t, r, 0, o, n, !1), 0;
    } } }, Cr = (t, r, n, o) => {
      var u = o ? "" : `al ${t}`;
      j(t, (l) => {
        Ve(l, `Loading data file "${t}" failed (no arrayBuffer).`), r(new Uint8Array(l)), u && nt();
      }, (l) => {
        if (n)
          n();
        else
          throw `Loading data file "${t}" failed.`;
      }), u && Ne();
    }, Sr = i.preloadPlugins || [];
    function Ar(t, r, n, o) {
      typeof Browser < "u" && Browser.init();
      var u = !1;
      return Sr.forEach(function(l) {
        u || l.canHandle(r) && (l.handle(t, r, n, o), u = !0);
      }), u;
    }
    function Jr(t, r, n, o, u, l, f, d, w, g) {
      var S = r ? ye.resolve(G.join2(t, r)) : t;
      function F(A) {
        function C(M) {
          g && g(), d || s.createDataFile(t, r, M, o, u, w), l && l(), nt();
        }
        Ar(A, S, C, () => {
          f && f(), nt();
        }) || C(A);
      }
      Ne(), typeof n == "string" ? Cr(n, (A) => F(A), f) : F(n);
    }
    function en(t) {
      var r = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }, n = r[t];
      if (typeof n > "u")
        throw new Error(`Unknown file open mode: ${t}`);
      return n;
    }
    function Ye(t, r) {
      var n = 0;
      return t && (n |= 365), r && (n |= 146), n;
    }
    var s = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: !1, ignorePermissions: !0, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, lookupPath: (t, r = {}) => {
      if (t = ye.resolve(t), !t)
        return { path: "", node: null };
      var n = { follow_mount: !0, recurse_count: 0 };
      if (r = Object.assign(n, r), r.recurse_count > 8)
        throw new s.ErrnoError(32);
      for (var o = t.split("/").filter((F) => !!F), u = s.root, l = "/", f = 0; f < o.length; f++) {
        var d = f === o.length - 1;
        if (d && r.parent)
          break;
        if (u = s.lookupNode(u, o[f]), l = G.join2(l, o[f]), s.isMountpoint(u) && (!d || d && r.follow_mount) && (u = u.mounted.root), !d || r.follow)
          for (var w = 0; s.isLink(u.mode); ) {
            var g = s.readlink(l);
            l = ye.resolve(G.dirname(l), g);
            var S = s.lookupPath(l, { recurse_count: r.recurse_count + 1 });
            if (u = S.node, w++ > 40)
              throw new s.ErrnoError(32);
          }
      }
      return { path: l, node: u };
    }, getPath: (t) => {
      for (var r; ; ) {
        if (s.isRoot(t)) {
          var n = t.mount.mountpoint;
          return r ? n[n.length - 1] !== "/" ? `${n}/${r}` : n + r : n;
        }
        r = r ? `${t.name}/${r}` : t.name, t = t.parent;
      }
    }, hashName: (t, r) => {
      for (var n = 0, o = 0; o < r.length; o++)
        n = (n << 5) - n + r.charCodeAt(o) | 0;
      return (t + n >>> 0) % s.nameTable.length;
    }, hashAddNode: (t) => {
      var r = s.hashName(t.parent.id, t.name);
      t.name_next = s.nameTable[r], s.nameTable[r] = t;
    }, hashRemoveNode: (t) => {
      var r = s.hashName(t.parent.id, t.name);
      if (s.nameTable[r] === t)
        s.nameTable[r] = t.name_next;
      else
        for (var n = s.nameTable[r]; n; ) {
          if (n.name_next === t) {
            n.name_next = t.name_next;
            break;
          }
          n = n.name_next;
        }
    }, lookupNode: (t, r) => {
      var n = s.mayLookup(t);
      if (n)
        throw new s.ErrnoError(n, t);
      for (var o = s.hashName(t.id, r), u = s.nameTable[o]; u; u = u.name_next) {
        var l = u.name;
        if (u.parent.id === t.id && l === r)
          return u;
      }
      return s.lookup(t, r);
    }, createNode: (t, r, n, o) => {
      var u = new s.FSNode(t, r, n, o);
      return s.hashAddNode(u), u;
    }, destroyNode: (t) => {
      s.hashRemoveNode(t);
    }, isRoot: (t) => t === t.parent, isMountpoint: (t) => !!t.mounted, isFile: (t) => (t & 61440) === 32768, isDir: (t) => (t & 61440) === 16384, isLink: (t) => (t & 61440) === 40960, isChrdev: (t) => (t & 61440) === 8192, isBlkdev: (t) => (t & 61440) === 24576, isFIFO: (t) => (t & 61440) === 4096, isSocket: (t) => (t & 49152) === 49152, flagsToPermissionString: (t) => {
      var r = ["r", "w", "rw"][t & 3];
      return t & 512 && (r += "w"), r;
    }, nodePermissions: (t, r) => s.ignorePermissions ? 0 : r.includes("r") && !(t.mode & 292) || r.includes("w") && !(t.mode & 146) || r.includes("x") && !(t.mode & 73) ? 2 : 0, mayLookup: (t) => {
      var r = s.nodePermissions(t, "x");
      return r || (t.node_ops.lookup ? 0 : 2);
    }, mayCreate: (t, r) => {
      try {
        var n = s.lookupNode(t, r);
        return 20;
      } catch {
      }
      return s.nodePermissions(t, "wx");
    }, mayDelete: (t, r, n) => {
      var o;
      try {
        o = s.lookupNode(t, r);
      } catch (l) {
        return l.errno;
      }
      var u = s.nodePermissions(t, "wx");
      if (u)
        return u;
      if (n) {
        if (!s.isDir(o.mode))
          return 54;
        if (s.isRoot(o) || s.getPath(o) === s.cwd())
          return 10;
      } else if (s.isDir(o.mode))
        return 31;
      return 0;
    }, mayOpen: (t, r) => t ? s.isLink(t.mode) ? 32 : s.isDir(t.mode) && (s.flagsToPermissionString(r) !== "r" || r & 512) ? 31 : s.nodePermissions(t, s.flagsToPermissionString(r)) : 44, MAX_OPEN_FDS: 4096, nextfd: () => {
      for (var t = 0; t <= s.MAX_OPEN_FDS; t++)
        if (!s.streams[t])
          return t;
      throw new s.ErrnoError(33);
    }, getStreamChecked: (t) => {
      var r = s.getStream(t);
      if (!r)
        throw new s.ErrnoError(8);
      return r;
    }, getStream: (t) => s.streams[t], createStream: (t, r = -1) => (s.FSStream || (s.FSStream = function() {
      this.shared = {};
    }, s.FSStream.prototype = {}, Object.defineProperties(s.FSStream.prototype, { object: { get() {
      return this.node;
    }, set(n) {
      this.node = n;
    } }, isRead: { get() {
      return (this.flags & 2097155) !== 1;
    } }, isWrite: { get() {
      return (this.flags & 2097155) !== 0;
    } }, isAppend: { get() {
      return this.flags & 1024;
    } }, flags: { get() {
      return this.shared.flags;
    }, set(n) {
      this.shared.flags = n;
    } }, position: { get() {
      return this.shared.position;
    }, set(n) {
      this.shared.position = n;
    } } })), t = Object.assign(new s.FSStream(), t), r == -1 && (r = s.nextfd()), t.fd = r, s.streams[r] = t, t), closeStream: (t) => {
      s.streams[t] = null;
    }, chrdev_stream_ops: { open: (t) => {
      var r = s.getDevice(t.node.rdev);
      t.stream_ops = r.stream_ops, t.stream_ops.open && t.stream_ops.open(t);
    }, llseek: () => {
      throw new s.ErrnoError(70);
    } }, major: (t) => t >> 8, minor: (t) => t & 255, makedev: (t, r) => t << 8 | r, registerDevice: (t, r) => {
      s.devices[t] = { stream_ops: r };
    }, getDevice: (t) => s.devices[t], getMounts: (t) => {
      for (var r = [], n = [t]; n.length; ) {
        var o = n.pop();
        r.push(o), n.push.apply(n, o.mounts);
      }
      return r;
    }, syncfs: (t, r) => {
      typeof t == "function" && (r = t, t = !1), s.syncFSRequests++, s.syncFSRequests > 1 && te(`warning: ${s.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
      var n = s.getMounts(s.root.mount), o = 0;
      function u(f) {
        return s.syncFSRequests--, r(f);
      }
      function l(f) {
        if (f)
          return l.errored ? void 0 : (l.errored = !0, u(f));
        ++o >= n.length && u(null);
      }
      n.forEach((f) => {
        if (!f.type.syncfs)
          return l(null);
        f.type.syncfs(f, t, l);
      });
    }, mount: (t, r, n) => {
      var o = n === "/", u = !n, l;
      if (o && s.root)
        throw new s.ErrnoError(10);
      if (!o && !u) {
        var f = s.lookupPath(n, { follow_mount: !1 });
        if (n = f.path, l = f.node, s.isMountpoint(l))
          throw new s.ErrnoError(10);
        if (!s.isDir(l.mode))
          throw new s.ErrnoError(54);
      }
      var d = { type: t, opts: r, mountpoint: n, mounts: [] }, w = t.mount(d);
      return w.mount = d, d.root = w, o ? s.root = w : l && (l.mounted = d, l.mount && l.mount.mounts.push(d)), w;
    }, unmount: (t) => {
      var r = s.lookupPath(t, { follow_mount: !1 });
      if (!s.isMountpoint(r.node))
        throw new s.ErrnoError(28);
      var n = r.node, o = n.mounted, u = s.getMounts(o);
      Object.keys(s.nameTable).forEach((f) => {
        for (var d = s.nameTable[f]; d; ) {
          var w = d.name_next;
          u.includes(d.mount) && s.destroyNode(d), d = w;
        }
      }), n.mounted = null;
      var l = n.mount.mounts.indexOf(o);
      n.mount.mounts.splice(l, 1);
    }, lookup: (t, r) => t.node_ops.lookup(t, r), mknod: (t, r, n) => {
      var o = s.lookupPath(t, { parent: !0 }), u = o.node, l = G.basename(t);
      if (!l || l === "." || l === "..")
        throw new s.ErrnoError(28);
      var f = s.mayCreate(u, l);
      if (f)
        throw new s.ErrnoError(f);
      if (!u.node_ops.mknod)
        throw new s.ErrnoError(63);
      return u.node_ops.mknod(u, l, r, n);
    }, create: (t, r) => (r = r !== void 0 ? r : 438, r &= 4095, r |= 32768, s.mknod(t, r, 0)), mkdir: (t, r) => (r = r !== void 0 ? r : 511, r &= 1023, r |= 16384, s.mknod(t, r, 0)), mkdirTree: (t, r) => {
      for (var n = t.split("/"), o = "", u = 0; u < n.length; ++u)
        if (n[u]) {
          o += "/" + n[u];
          try {
            s.mkdir(o, r);
          } catch (l) {
            if (l.errno != 20)
              throw l;
          }
        }
    }, mkdev: (t, r, n) => (typeof n > "u" && (n = r, r = 438), r |= 8192, s.mknod(t, r, n)), symlink: (t, r) => {
      if (!ye.resolve(t))
        throw new s.ErrnoError(44);
      var n = s.lookupPath(r, { parent: !0 }), o = n.node;
      if (!o)
        throw new s.ErrnoError(44);
      var u = G.basename(r), l = s.mayCreate(o, u);
      if (l)
        throw new s.ErrnoError(l);
      if (!o.node_ops.symlink)
        throw new s.ErrnoError(63);
      return o.node_ops.symlink(o, u, t);
    }, rename: (t, r) => {
      var n = G.dirname(t), o = G.dirname(r), u = G.basename(t), l = G.basename(r), f, d, w;
      if (f = s.lookupPath(t, { parent: !0 }), d = f.node, f = s.lookupPath(r, { parent: !0 }), w = f.node, !d || !w)
        throw new s.ErrnoError(44);
      if (d.mount !== w.mount)
        throw new s.ErrnoError(75);
      var g = s.lookupNode(d, u), S = ye.relative(t, o);
      if (S.charAt(0) !== ".")
        throw new s.ErrnoError(28);
      if (S = ye.relative(r, n), S.charAt(0) !== ".")
        throw new s.ErrnoError(55);
      var F;
      try {
        F = s.lookupNode(w, l);
      } catch {
      }
      if (g !== F) {
        var A = s.isDir(g.mode), C = s.mayDelete(d, u, A);
        if (C)
          throw new s.ErrnoError(C);
        if (C = F ? s.mayDelete(w, l, A) : s.mayCreate(w, l), C)
          throw new s.ErrnoError(C);
        if (!d.node_ops.rename)
          throw new s.ErrnoError(63);
        if (s.isMountpoint(g) || F && s.isMountpoint(F))
          throw new s.ErrnoError(10);
        if (w !== d && (C = s.nodePermissions(d, "w"), C))
          throw new s.ErrnoError(C);
        s.hashRemoveNode(g);
        try {
          d.node_ops.rename(g, w, l);
        } catch (M) {
          throw M;
        } finally {
          s.hashAddNode(g);
        }
      }
    }, rmdir: (t) => {
      var r = s.lookupPath(t, { parent: !0 }), n = r.node, o = G.basename(t), u = s.lookupNode(n, o), l = s.mayDelete(n, o, !0);
      if (l)
        throw new s.ErrnoError(l);
      if (!n.node_ops.rmdir)
        throw new s.ErrnoError(63);
      if (s.isMountpoint(u))
        throw new s.ErrnoError(10);
      n.node_ops.rmdir(n, o), s.destroyNode(u);
    }, readdir: (t) => {
      var r = s.lookupPath(t, { follow: !0 }), n = r.node;
      if (!n.node_ops.readdir)
        throw new s.ErrnoError(54);
      return n.node_ops.readdir(n);
    }, unlink: (t) => {
      var r = s.lookupPath(t, { parent: !0 }), n = r.node;
      if (!n)
        throw new s.ErrnoError(44);
      var o = G.basename(t), u = s.lookupNode(n, o), l = s.mayDelete(n, o, !1);
      if (l)
        throw new s.ErrnoError(l);
      if (!n.node_ops.unlink)
        throw new s.ErrnoError(63);
      if (s.isMountpoint(u))
        throw new s.ErrnoError(10);
      n.node_ops.unlink(n, o), s.destroyNode(u);
    }, readlink: (t) => {
      var r = s.lookupPath(t), n = r.node;
      if (!n)
        throw new s.ErrnoError(44);
      if (!n.node_ops.readlink)
        throw new s.ErrnoError(28);
      return ye.resolve(s.getPath(n.parent), n.node_ops.readlink(n));
    }, stat: (t, r) => {
      var n = s.lookupPath(t, { follow: !r }), o = n.node;
      if (!o)
        throw new s.ErrnoError(44);
      if (!o.node_ops.getattr)
        throw new s.ErrnoError(63);
      return o.node_ops.getattr(o);
    }, lstat: (t) => s.stat(t, !0), chmod: (t, r, n) => {
      var o;
      if (typeof t == "string") {
        var u = s.lookupPath(t, { follow: !n });
        o = u.node;
      } else
        o = t;
      if (!o.node_ops.setattr)
        throw new s.ErrnoError(63);
      o.node_ops.setattr(o, { mode: r & 4095 | o.mode & -4096, timestamp: Date.now() });
    }, lchmod: (t, r) => {
      s.chmod(t, r, !0);
    }, fchmod: (t, r) => {
      var n = s.getStreamChecked(t);
      s.chmod(n.node, r);
    }, chown: (t, r, n, o) => {
      var u;
      if (typeof t == "string") {
        var l = s.lookupPath(t, { follow: !o });
        u = l.node;
      } else
        u = t;
      if (!u.node_ops.setattr)
        throw new s.ErrnoError(63);
      u.node_ops.setattr(u, { timestamp: Date.now() });
    }, lchown: (t, r, n) => {
      s.chown(t, r, n, !0);
    }, fchown: (t, r, n) => {
      var o = s.getStreamChecked(t);
      s.chown(o.node, r, n);
    }, truncate: (t, r) => {
      if (r < 0)
        throw new s.ErrnoError(28);
      var n;
      if (typeof t == "string") {
        var o = s.lookupPath(t, { follow: !0 });
        n = o.node;
      } else
        n = t;
      if (!n.node_ops.setattr)
        throw new s.ErrnoError(63);
      if (s.isDir(n.mode))
        throw new s.ErrnoError(31);
      if (!s.isFile(n.mode))
        throw new s.ErrnoError(28);
      var u = s.nodePermissions(n, "w");
      if (u)
        throw new s.ErrnoError(u);
      n.node_ops.setattr(n, { size: r, timestamp: Date.now() });
    }, ftruncate: (t, r) => {
      var n = s.getStreamChecked(t);
      if (!(n.flags & 2097155))
        throw new s.ErrnoError(28);
      s.truncate(n.node, r);
    }, utime: (t, r, n) => {
      var o = s.lookupPath(t, { follow: !0 }), u = o.node;
      u.node_ops.setattr(u, { timestamp: Math.max(r, n) });
    }, open: (t, r, n) => {
      if (t === "")
        throw new s.ErrnoError(44);
      r = typeof r == "string" ? en(r) : r, n = typeof n > "u" ? 438 : n, r & 64 ? n = n & 4095 | 32768 : n = 0;
      var o;
      if (typeof t == "object")
        o = t;
      else {
        t = G.normalize(t);
        try {
          var u = s.lookupPath(t, { follow: !(r & 131072) });
          o = u.node;
        } catch {
        }
      }
      var l = !1;
      if (r & 64)
        if (o) {
          if (r & 128)
            throw new s.ErrnoError(20);
        } else
          o = s.mknod(t, n, 0), l = !0;
      if (!o)
        throw new s.ErrnoError(44);
      if (s.isChrdev(o.mode) && (r &= -513), r & 65536 && !s.isDir(o.mode))
        throw new s.ErrnoError(54);
      if (!l) {
        var f = s.mayOpen(o, r);
        if (f)
          throw new s.ErrnoError(f);
      }
      r & 512 && !l && s.truncate(o, 0), r &= -131713;
      var d = s.createStream({ node: o, path: s.getPath(o), flags: r, seekable: !0, position: 0, stream_ops: o.stream_ops, ungotten: [], error: !1 });
      return d.stream_ops.open && d.stream_ops.open(d), i.logReadFiles && !(r & 1) && (s.readFiles || (s.readFiles = {}), t in s.readFiles || (s.readFiles[t] = 1)), d;
    }, close: (t) => {
      if (s.isClosed(t))
        throw new s.ErrnoError(8);
      t.getdents && (t.getdents = null);
      try {
        t.stream_ops.close && t.stream_ops.close(t);
      } catch (r) {
        throw r;
      } finally {
        s.closeStream(t.fd);
      }
      t.fd = null;
    }, isClosed: (t) => t.fd === null, llseek: (t, r, n) => {
      if (s.isClosed(t))
        throw new s.ErrnoError(8);
      if (!t.seekable || !t.stream_ops.llseek)
        throw new s.ErrnoError(70);
      if (n != 0 && n != 1 && n != 2)
        throw new s.ErrnoError(28);
      return t.position = t.stream_ops.llseek(t, r, n), t.ungotten = [], t.position;
    }, read: (t, r, n, o, u) => {
      if (o < 0 || u < 0)
        throw new s.ErrnoError(28);
      if (s.isClosed(t))
        throw new s.ErrnoError(8);
      if ((t.flags & 2097155) === 1)
        throw new s.ErrnoError(8);
      if (s.isDir(t.node.mode))
        throw new s.ErrnoError(31);
      if (!t.stream_ops.read)
        throw new s.ErrnoError(28);
      var l = typeof u < "u";
      if (!l)
        u = t.position;
      else if (!t.seekable)
        throw new s.ErrnoError(70);
      var f = t.stream_ops.read(t, r, n, o, u);
      return l || (t.position += f), f;
    }, write: (t, r, n, o, u, l) => {
      if (o < 0 || u < 0)
        throw new s.ErrnoError(28);
      if (s.isClosed(t))
        throw new s.ErrnoError(8);
      if (!(t.flags & 2097155))
        throw new s.ErrnoError(8);
      if (s.isDir(t.node.mode))
        throw new s.ErrnoError(31);
      if (!t.stream_ops.write)
        throw new s.ErrnoError(28);
      t.seekable && t.flags & 1024 && s.llseek(t, 0, 2);
      var f = typeof u < "u";
      if (!f)
        u = t.position;
      else if (!t.seekable)
        throw new s.ErrnoError(70);
      var d = t.stream_ops.write(t, r, n, o, u, l);
      return f || (t.position += d), d;
    }, allocate: (t, r, n) => {
      if (s.isClosed(t))
        throw new s.ErrnoError(8);
      if (r < 0 || n <= 0)
        throw new s.ErrnoError(28);
      if (!(t.flags & 2097155))
        throw new s.ErrnoError(8);
      if (!s.isFile(t.node.mode) && !s.isDir(t.node.mode))
        throw new s.ErrnoError(43);
      if (!t.stream_ops.allocate)
        throw new s.ErrnoError(138);
      t.stream_ops.allocate(t, r, n);
    }, mmap: (t, r, n, o, u) => {
      if (o & 2 && !(u & 2) && (t.flags & 2097155) !== 2)
        throw new s.ErrnoError(2);
      if ((t.flags & 2097155) === 1)
        throw new s.ErrnoError(2);
      if (!t.stream_ops.mmap)
        throw new s.ErrnoError(43);
      return t.stream_ops.mmap(t, r, n, o, u);
    }, msync: (t, r, n, o, u) => t.stream_ops.msync ? t.stream_ops.msync(t, r, n, o, u) : 0, munmap: (t) => 0, ioctl: (t, r, n) => {
      if (!t.stream_ops.ioctl)
        throw new s.ErrnoError(59);
      return t.stream_ops.ioctl(t, r, n);
    }, readFile: (t, r = {}) => {
      if (r.flags = r.flags || 0, r.encoding = r.encoding || "binary", r.encoding !== "utf8" && r.encoding !== "binary")
        throw new Error(`Invalid encoding type "${r.encoding}"`);
      var n, o = s.open(t, r.flags), u = s.stat(t), l = u.size, f = new Uint8Array(l);
      return s.read(o, f, 0, l, 0), r.encoding === "utf8" ? n = Le(f, 0) : r.encoding === "binary" && (n = f), s.close(o), n;
    }, writeFile: (t, r, n = {}) => {
      n.flags = n.flags || 577;
      var o = s.open(t, n.flags, n.mode);
      if (typeof r == "string") {
        var u = new Uint8Array(Tt(r) + 1), l = kt(r, u, 0, u.length);
        s.write(o, u, 0, l, void 0, n.canOwn);
      } else if (ArrayBuffer.isView(r))
        s.write(o, r, 0, r.byteLength, void 0, n.canOwn);
      else
        throw new Error("Unsupported data type");
      s.close(o);
    }, cwd: () => s.currentPath, chdir: (t) => {
      var r = s.lookupPath(t, { follow: !0 });
      if (r.node === null)
        throw new s.ErrnoError(44);
      if (!s.isDir(r.node.mode))
        throw new s.ErrnoError(54);
      var n = s.nodePermissions(r.node, "x");
      if (n)
        throw new s.ErrnoError(n);
      s.currentPath = r.path;
    }, createDefaultDirectories: () => {
      s.mkdir("/tmp"), s.mkdir("/home"), s.mkdir("/home/web_user");
    }, createDefaultDevices: () => {
      s.mkdir("/dev"), s.registerDevice(s.makedev(1, 3), { read: () => 0, write: (o, u, l, f, d) => f }), s.mkdev("/dev/null", s.makedev(1, 3)), ke.register(s.makedev(5, 0), ke.default_tty_ops), ke.register(s.makedev(6, 0), ke.default_tty1_ops), s.mkdev("/dev/tty", s.makedev(5, 0)), s.mkdev("/dev/tty1", s.makedev(6, 0));
      var t = new Uint8Array(1024), r = 0, n = () => (r === 0 && (r = Vt(t).byteLength), t[--r]);
      s.createDevice("/dev", "random", n), s.createDevice("/dev", "urandom", n), s.mkdir("/dev/shm"), s.mkdir("/dev/shm/tmp");
    }, createSpecialDirectories: () => {
      s.mkdir("/proc");
      var t = s.mkdir("/proc/self");
      s.mkdir("/proc/self/fd"), s.mount({ mount: () => {
        var r = s.createNode(t, "fd", 16895, 73);
        return r.node_ops = { lookup: (n, o) => {
          var u = +o, l = s.getStreamChecked(u), f = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => l.path } };
          return f.parent = f, f;
        } }, r;
      } }, {}, "/proc/self/fd");
    }, createStandardStreams: () => {
      i.stdin ? s.createDevice("/dev", "stdin", i.stdin) : s.symlink("/dev/tty", "/dev/stdin"), i.stdout ? s.createDevice("/dev", "stdout", null, i.stdout) : s.symlink("/dev/tty", "/dev/stdout"), i.stderr ? s.createDevice("/dev", "stderr", null, i.stderr) : s.symlink("/dev/tty1", "/dev/stderr"), s.open("/dev/stdin", 0), s.open("/dev/stdout", 1), s.open("/dev/stderr", 1);
    }, ensureErrnoError: () => {
      s.ErrnoError || (s.ErrnoError = function(r, n) {
        this.name = "ErrnoError", this.node = n, this.setErrno = function(o) {
          this.errno = o;
        }, this.setErrno(r), this.message = "FS error";
      }, s.ErrnoError.prototype = new Error(), s.ErrnoError.prototype.constructor = s.ErrnoError, [44].forEach((t) => {
        s.genericErrors[t] = new s.ErrnoError(t), s.genericErrors[t].stack = "<generic error, no stack>";
      }));
    }, staticInit: () => {
      s.ensureErrnoError(), s.nameTable = new Array(4096), s.mount(L, {}, "/"), s.createDefaultDirectories(), s.createDefaultDevices(), s.createSpecialDirectories(), s.filesystems = { MEMFS: L };
    }, init: (t, r, n) => {
      s.init.initialized = !0, s.ensureErrnoError(), i.stdin = t || i.stdin, i.stdout = r || i.stdout, i.stderr = n || i.stderr, s.createStandardStreams();
    }, quit: () => {
      s.init.initialized = !1;
      for (var t = 0; t < s.streams.length; t++) {
        var r = s.streams[t];
        r && s.close(r);
      }
    }, findObject: (t, r) => {
      var n = s.analyzePath(t, r);
      return n.exists ? n.object : null;
    }, analyzePath: (t, r) => {
      try {
        var n = s.lookupPath(t, { follow: !r });
        t = n.path;
      } catch {
      }
      var o = { isRoot: !1, exists: !1, error: 0, name: null, path: null, object: null, parentExists: !1, parentPath: null, parentObject: null };
      try {
        var n = s.lookupPath(t, { parent: !0 });
        o.parentExists = !0, o.parentPath = n.path, o.parentObject = n.node, o.name = G.basename(t), n = s.lookupPath(t, { follow: !r }), o.exists = !0, o.path = n.path, o.object = n.node, o.name = n.node.name, o.isRoot = n.path === "/";
      } catch (u) {
        o.error = u.errno;
      }
      return o;
    }, createPath: (t, r, n, o) => {
      t = typeof t == "string" ? t : s.getPath(t);
      for (var u = r.split("/").reverse(); u.length; ) {
        var l = u.pop();
        if (l) {
          var f = G.join2(t, l);
          try {
            s.mkdir(f);
          } catch {
          }
          t = f;
        }
      }
      return f;
    }, createFile: (t, r, n, o, u) => {
      var l = G.join2(typeof t == "string" ? t : s.getPath(t), r), f = Ye(o, u);
      return s.create(l, f);
    }, createDataFile: (t, r, n, o, u, l) => {
      var f = r;
      t && (t = typeof t == "string" ? t : s.getPath(t), f = r ? G.join2(t, r) : t);
      var d = Ye(o, u), w = s.create(f, d);
      if (n) {
        if (typeof n == "string") {
          for (var g = new Array(n.length), S = 0, F = n.length; S < F; ++S)
            g[S] = n.charCodeAt(S);
          n = g;
        }
        s.chmod(w, d | 146);
        var A = s.open(w, 577);
        s.write(A, n, 0, n.length, 0, l), s.close(A), s.chmod(w, d);
      }
      return w;
    }, createDevice: (t, r, n, o) => {
      var u = G.join2(typeof t == "string" ? t : s.getPath(t), r), l = Ye(!!n, !!o);
      s.createDevice.major || (s.createDevice.major = 64);
      var f = s.makedev(s.createDevice.major++, 0);
      return s.registerDevice(f, { open: (d) => {
        d.seekable = !1;
      }, close: (d) => {
        o && o.buffer && o.buffer.length && o(10);
      }, read: (d, w, g, S, F) => {
        for (var A = 0, C = 0; C < S; C++) {
          var M;
          try {
            M = n();
          } catch {
            throw new s.ErrnoError(29);
          }
          if (M === void 0 && A === 0)
            throw new s.ErrnoError(6);
          if (M == null)
            break;
          A++, w[g + C] = M;
        }
        return A && (d.node.timestamp = Date.now()), A;
      }, write: (d, w, g, S, F) => {
        for (var A = 0; A < S; A++)
          try {
            o(w[g + A]);
          } catch {
            throw new s.ErrnoError(29);
          }
        return S && (d.node.timestamp = Date.now()), A;
      } }), s.mkdev(u, l, f);
    }, forceLoadFile: (t) => {
      if (t.isDevice || t.isFolder || t.link || t.contents)
        return !0;
      if (typeof XMLHttpRequest < "u")
        throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
      if (k)
        try {
          t.contents = Ct(k(t.url), !0), t.usedBytes = t.contents.length;
        } catch {
          throw new s.ErrnoError(29);
        }
      else
        throw new Error("Cannot load without read() or XMLHttpRequest.");
    }, createLazyFile: (t, r, n, o, u) => {
      function l() {
        this.lengthKnown = !1, this.chunks = [];
      }
      if (l.prototype.get = function(C) {
        if (!(C > this.length - 1 || C < 0)) {
          var M = C % this.chunkSize, Z = C / this.chunkSize | 0;
          return this.getter(Z)[M];
        }
      }, l.prototype.setDataGetter = function(C) {
        this.getter = C;
      }, l.prototype.cacheLength = function() {
        var C = new XMLHttpRequest();
        if (C.open("HEAD", n, !1), C.send(null), !(C.status >= 200 && C.status < 300 || C.status === 304))
          throw new Error("Couldn't load " + n + ". Status: " + C.status);
        var M = Number(C.getResponseHeader("Content-length")), Z, J = (Z = C.getResponseHeader("Accept-Ranges")) && Z === "bytes", oe = (Z = C.getResponseHeader("Content-Encoding")) && Z === "gzip", he = 1024 * 1024;
        J || (he = M);
        var ee = (ve, Se) => {
          if (ve > Se)
            throw new Error("invalid range (" + ve + ", " + Se + ") or no bytes requested!");
          if (Se > M - 1)
            throw new Error("only " + M + " bytes available! programmer error!");
          var se = new XMLHttpRequest();
          if (se.open("GET", n, !1), M !== he && se.setRequestHeader("Range", "bytes=" + ve + "-" + Se), se.responseType = "arraybuffer", se.overrideMimeType && se.overrideMimeType("text/plain; charset=x-user-defined"), se.send(null), !(se.status >= 200 && se.status < 300 || se.status === 304))
            throw new Error("Couldn't load " + n + ". Status: " + se.status);
          return se.response !== void 0 ? new Uint8Array(se.response || []) : Ct(se.responseText || "", !0);
        }, We = this;
        We.setDataGetter((ve) => {
          var Se = ve * he, se = (ve + 1) * he - 1;
          if (se = Math.min(se, M - 1), typeof We.chunks[ve] > "u" && (We.chunks[ve] = ee(Se, se)), typeof We.chunks[ve] > "u")
            throw new Error("doXHR failed!");
          return We.chunks[ve];
        }), (oe || !M) && (he = M = 1, M = this.getter(0).length, he = M, W("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = M, this._chunkSize = he, this.lengthKnown = !0;
      }, typeof XMLHttpRequest < "u") {
        if (!y)
          throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
        var f = new l();
        Object.defineProperties(f, { length: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._length;
        } }, chunkSize: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._chunkSize;
        } } });
        var d = { isDevice: !1, contents: f };
      } else
        var d = { isDevice: !1, url: n };
      var w = s.createFile(t, r, d, o, u);
      d.contents ? w.contents = d.contents : d.url && (w.contents = null, w.url = d.url), Object.defineProperties(w, { usedBytes: { get: function() {
        return this.contents.length;
      } } });
      var g = {}, S = Object.keys(w.stream_ops);
      S.forEach((A) => {
        var C = w.stream_ops[A];
        g[A] = function() {
          return s.forceLoadFile(w), C.apply(null, arguments);
        };
      });
      function F(A, C, M, Z, J) {
        var oe = A.node.contents;
        if (J >= oe.length)
          return 0;
        var he = Math.min(oe.length - J, Z);
        if (oe.slice)
          for (var ee = 0; ee < he; ee++)
            C[M + ee] = oe[J + ee];
        else
          for (var ee = 0; ee < he; ee++)
            C[M + ee] = oe.get(J + ee);
        return he;
      }
      return g.read = (A, C, M, Z, J) => (s.forceLoadFile(w), F(A, C, M, Z, J)), g.mmap = (A, C, M, Z, J) => {
        s.forceLoadFile(w);
        var oe = Nt();
        if (!oe)
          throw new s.ErrnoError(48);
        return F(A, ne, oe, C, M), { ptr: oe, allocated: !0 };
      }, w.stream_ops = g, w;
    } }, ct = (t, r) => t ? Le(K, t, r) : "", ue = { DEFAULT_POLLMASK: 5, calculateAt: function(t, r, n) {
      if (G.isAbs(r))
        return r;
      var o;
      if (t === -100)
        o = s.cwd();
      else {
        var u = ue.getStreamFromFD(t);
        o = u.path;
      }
      if (r.length == 0) {
        if (!n)
          throw new s.ErrnoError(44);
        return o;
      }
      return G.join2(o, r);
    }, doStat: function(t, r, n) {
      try {
        var o = t(r);
      } catch (d) {
        if (d && d.node && G.normalize(r) !== G.normalize(s.getPath(d.node)))
          return -54;
        throw d;
      }
      V[n >> 2] = o.dev, V[n + 4 >> 2] = o.mode, X[n + 8 >> 2] = o.nlink, V[n + 12 >> 2] = o.uid, V[n + 16 >> 2] = o.gid, V[n + 20 >> 2] = o.rdev, Y = [o.size >>> 0, (U = o.size, +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[n + 24 >> 2] = Y[0], V[n + 28 >> 2] = Y[1], V[n + 32 >> 2] = 4096, V[n + 36 >> 2] = o.blocks;
      var u = o.atime.getTime(), l = o.mtime.getTime(), f = o.ctime.getTime();
      return Y = [Math.floor(u / 1e3) >>> 0, (U = Math.floor(u / 1e3), +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[n + 40 >> 2] = Y[0], V[n + 44 >> 2] = Y[1], X[n + 48 >> 2] = u % 1e3 * 1e3, Y = [Math.floor(l / 1e3) >>> 0, (U = Math.floor(l / 1e3), +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[n + 56 >> 2] = Y[0], V[n + 60 >> 2] = Y[1], X[n + 64 >> 2] = l % 1e3 * 1e3, Y = [Math.floor(f / 1e3) >>> 0, (U = Math.floor(f / 1e3), +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[n + 72 >> 2] = Y[0], V[n + 76 >> 2] = Y[1], X[n + 80 >> 2] = f % 1e3 * 1e3, Y = [o.ino >>> 0, (U = o.ino, +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[n + 88 >> 2] = Y[0], V[n + 92 >> 2] = Y[1], 0;
    }, doMsync: function(t, r, n, o, u) {
      if (!s.isFile(r.node.mode))
        throw new s.ErrnoError(43);
      if (o & 2)
        return 0;
      var l = K.slice(t, t + n);
      s.msync(r, l, u, n, o);
    }, varargs: void 0, get() {
      ue.varargs += 4;
      var t = V[ue.varargs - 4 >> 2];
      return t;
    }, getStr(t) {
      var r = ct(t);
      return r;
    }, getStreamFromFD: function(t) {
      var r = s.getStreamChecked(t);
      return r;
    } };
    function tn(t, r, n) {
      ue.varargs = n;
      try {
        var o = ue.getStreamFromFD(t);
        switch (r) {
          case 0: {
            var u = ue.get();
            if (u < 0)
              return -28;
            var l;
            return l = s.createStream(o, u), l.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return o.flags;
          case 4: {
            var u = ue.get();
            return o.flags |= u, 0;
          }
          case 5: {
            var u = ue.get(), f = 0;
            return $e[u + f >> 1] = 2, 0;
          }
          case 6:
          case 7:
            return 0;
          case 16:
          case 8:
            return -28;
          case 9:
            return Wt(28), -1;
          default:
            return -28;
        }
      } catch (d) {
        if (typeof s > "u" || d.name !== "ErrnoError")
          throw d;
        return -d.errno;
      }
    }
    function St(t, r, n, o) {
      ue.varargs = o;
      try {
        r = ue.getStr(r), r = ue.calculateAt(t, r);
        var u = o ? ue.get() : 0;
        return s.open(r, n, u).fd;
      } catch (l) {
        if (typeof s > "u" || l.name !== "ErrnoError")
          throw l;
        return -l.errno;
      }
    }
    function rn(t, r, n, o, u) {
    }
    function At(t) {
      switch (t) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError(`Unknown type size: ${t}`);
      }
    }
    function qt() {
      for (var t = new Array(256), r = 0; r < 256; ++r)
        t[r] = String.fromCharCode(r);
      sr = t;
    }
    var sr = void 0;
    function de(t) {
      for (var r = "", n = t; K[n]; )
        r += sr[K[n++]];
      return r;
    }
    var je = {}, Ue = {}, dt = {}, He = void 0;
    function N(t) {
      throw new He(t);
    }
    var qe = void 0;
    function ft(t) {
      throw new qe(t);
    }
    function Ze(t, r, n) {
      t.forEach(function(d) {
        dt[d] = r;
      });
      function o(d) {
        var w = n(d);
        w.length !== t.length && ft("Mismatched type converter count");
        for (var g = 0; g < t.length; ++g)
          we(t[g], w[g]);
      }
      var u = new Array(r.length), l = [], f = 0;
      r.forEach((d, w) => {
        Ue.hasOwnProperty(d) ? u[w] = Ue[d] : (l.push(d), je.hasOwnProperty(d) || (je[d] = []), je[d].push(() => {
          u[w] = Ue[d], ++f, f === l.length && o(u);
        }));
      }), l.length === 0 && o(u);
    }
    function Gt(t, r, n = {}) {
      var o = r.name;
      if (t || N(`type "${o}" must have a positive integer typeid pointer`), Ue.hasOwnProperty(t)) {
        if (n.ignoreDuplicateRegistrations)
          return;
        N(`Cannot register type '${o}' twice`);
      }
      if (Ue[t] = r, delete dt[t], je.hasOwnProperty(t)) {
        var u = je[t];
        delete je[t], u.forEach((l) => l());
      }
    }
    function we(t, r, n = {}) {
      if (!("argPackAdvance" in r))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      return Gt(t, r, n);
    }
    function Dr(t, r, n, o, u) {
      var l = At(n);
      r = de(r), we(t, { name: r, fromWireType: function(f) {
        return !!f;
      }, toWireType: function(f, d) {
        return d ? o : u;
      }, argPackAdvance: 8, readValueFromPointer: function(f) {
        var d;
        if (n === 1)
          d = ne;
        else if (n === 2)
          d = $e;
        else if (n === 4)
          d = V;
        else
          throw new TypeError("Unknown boolean type size: " + r);
        return this.fromWireType(d[f >> l]);
      }, destructorFunction: null });
    }
    function nn(t) {
      if (!(this instanceof Te) || !(t instanceof Te))
        return !1;
      for (var r = this.$$.ptrType.registeredClass, n = this.$$.ptr, o = t.$$.ptrType.registeredClass, u = t.$$.ptr; r.baseClass; )
        n = r.upcast(n), r = r.baseClass;
      for (; o.baseClass; )
        u = o.upcast(u), o = o.baseClass;
      return r === o && n === u;
    }
    function on(t) {
      return { count: t.count, deleteScheduled: t.deleteScheduled, preservePointerOnDelete: t.preservePointerOnDelete, ptr: t.ptr, ptrType: t.ptrType, smartPtr: t.smartPtr, smartPtrType: t.smartPtrType };
    }
    function ht(t) {
      function r(n) {
        return n.$$.ptrType.registeredClass.name;
      }
      N(r(t) + " instance already deleted");
    }
    var Dt = !1;
    function ar(t) {
    }
    function sn(t) {
      t.smartPtr ? t.smartPtrType.rawDestructor(t.smartPtr) : t.ptrType.registeredClass.rawDestructor(t.ptr);
    }
    function wt(t) {
      t.count.value -= 1;
      var r = t.count.value === 0;
      r && sn(t);
    }
    function ur(t, r, n) {
      if (r === n)
        return t;
      if (n.baseClass === void 0)
        return null;
      var o = ur(t, r, n.baseClass);
      return o === null ? null : n.downcast(o);
    }
    var lr = {};
    function an() {
      return Object.keys(et).length;
    }
    function un() {
      var t = [];
      for (var r in et)
        et.hasOwnProperty(r) && t.push(et[r]);
      return t;
    }
    var _e = [];
    function Ft() {
      for (; _e.length; ) {
        var t = _e.pop();
        t.$$.deleteScheduled = !1, t.delete();
      }
    }
    var Je = void 0;
    function Xt(t) {
      Je = t, _e.length && Je && Je(Ft);
    }
    function Fr() {
      i.getInheritedInstanceCount = an, i.getLiveInheritedInstances = un, i.flushPendingDeletes = Ft, i.setDelayFunction = Xt;
    }
    var et = {};
    function ln(t, r) {
      for (r === void 0 && N("ptr should not be undefined"); t.baseClass; )
        r = t.upcast(r), t = t.baseClass;
      return r;
    }
    function _t(t, r) {
      return r = ln(t, r), et[r];
    }
    function pt(t, r) {
      (!r.ptrType || !r.ptr) && ft("makeClassHandle requires ptr and ptrType");
      var n = !!r.smartPtrType, o = !!r.smartPtr;
      return n !== o && ft("Both smartPtrType and smartPtr must be specified"), r.count = { value: 1 }, Ge(Object.create(t, { $$: { value: r } }));
    }
    function Rr(t) {
      var r = this.getPointee(t);
      if (!r)
        return this.destructor(t), null;
      var n = _t(this.registeredClass, r);
      if (n !== void 0) {
        if (n.$$.count.value === 0)
          return n.$$.ptr = r, n.$$.smartPtr = t, n.clone();
        var o = n.clone();
        return this.destructor(t), o;
      }
      function u() {
        return this.isSmartPointer ? pt(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: r, smartPtrType: this, smartPtr: t }) : pt(this.registeredClass.instancePrototype, { ptrType: this, ptr: t });
      }
      var l = this.registeredClass.getActualType(r), f = lr[l];
      if (!f)
        return u.call(this);
      var d;
      this.isConst ? d = f.constPointerType : d = f.pointerType;
      var w = ur(r, this.registeredClass, d.registeredClass);
      return w === null ? u.call(this) : this.isSmartPointer ? pt(d.registeredClass.instancePrototype, { ptrType: d, ptr: w, smartPtrType: this, smartPtr: t }) : pt(d.registeredClass.instancePrototype, { ptrType: d, ptr: w });
    }
    var Ge = function(t) {
      return typeof FinalizationRegistry > "u" ? (Ge = (r) => r, t) : (Dt = new FinalizationRegistry((r) => {
        wt(r.$$);
      }), Ge = (r) => {
        var n = r.$$, o = !!n.smartPtr;
        if (o) {
          var u = { $$: n };
          Dt.register(r, u, r);
        }
        return r;
      }, ar = (r) => Dt.unregister(r), Ge(t));
    };
    function cr() {
      if (this.$$.ptr || ht(this), this.$$.preservePointerOnDelete)
        return this.$$.count.value += 1, this;
      var t = Ge(Object.create(Object.getPrototypeOf(this), { $$: { value: on(this.$$) } }));
      return t.$$.count.value += 1, t.$$.deleteScheduled = !1, t;
    }
    function cn() {
      this.$$.ptr || ht(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && N("Object already scheduled for deletion"), ar(this), wt(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
    }
    function xr() {
      return !this.$$.ptr;
    }
    function dn() {
      return this.$$.ptr || ht(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && N("Object already scheduled for deletion"), _e.push(this), _e.length === 1 && Je && Je(Ft), this.$$.deleteScheduled = !0, this;
    }
    function Ur() {
      Te.prototype.isAliasOf = nn, Te.prototype.clone = cr, Te.prototype.delete = cn, Te.prototype.isDeleted = xr, Te.prototype.deleteLater = dn;
    }
    function Te() {
    }
    var fn = 48, hn = 57;
    function vt(t) {
      if (t === void 0)
        return "_unknown";
      t = t.replace(/[^a-zA-Z0-9_]/g, "$");
      var r = t.charCodeAt(0);
      return r >= fn && r <= hn ? `_${t}` : t;
    }
    function Et(t, r) {
      return t = vt(t), { [t]: function() {
        return r.apply(this, arguments);
      } }[t];
    }
    function Be(t, r, n) {
      if (t[r].overloadTable === void 0) {
        var o = t[r];
        t[r] = function() {
          return t[r].overloadTable.hasOwnProperty(arguments.length) || N(`Function '${n}' called with an invalid number of arguments (${arguments.length}) - expects one of (${t[r].overloadTable})!`), t[r].overloadTable[arguments.length].apply(this, arguments);
        }, t[r].overloadTable = [], t[r].overloadTable[o.argCount] = o;
      }
    }
    function Br(t, r, n) {
      i.hasOwnProperty(t) ? ((n === void 0 || i[t].overloadTable !== void 0 && i[t].overloadTable[n] !== void 0) && N(`Cannot register public name '${t}' twice`), Be(i, t, t), i.hasOwnProperty(n) && N(`Cannot register multiple overloads of a function with the same number of arguments (${n})!`), i[t].overloadTable[n] = r) : (i[t] = r, n !== void 0 && (i[t].numArguments = n));
    }
    function pn(t, r, n, o, u, l, f, d) {
      this.name = t, this.constructor = r, this.instancePrototype = n, this.rawDestructor = o, this.baseClass = u, this.getActualType = l, this.upcast = f, this.downcast = d, this.pureVirtualFunctions = [];
    }
    function Rt(t, r, n) {
      for (; r !== n; )
        r.upcast || N(`Expected null or instance of ${n.name}, got an instance of ${r.name}`), t = r.upcast(t), r = r.baseClass;
      return t;
    }
    function Kt(t, r) {
      if (r === null)
        return this.isReference && N(`null is not a valid ${this.name}`), 0;
      r.$$ || N(`Cannot pass "${Ut(r)}" as a ${this.name}`), r.$$.ptr || N(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var n = r.$$.ptrType.registeredClass, o = Rt(r.$$.ptr, n, this.registeredClass);
      return o;
    }
    function vn(t, r) {
      var n;
      if (r === null)
        return this.isReference && N(`null is not a valid ${this.name}`), this.isSmartPointer ? (n = this.rawConstructor(), t !== null && t.push(this.rawDestructor, n), n) : 0;
      r.$$ || N(`Cannot pass "${Ut(r)}" as a ${this.name}`), r.$$.ptr || N(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && r.$$.ptrType.isConst && N(`Cannot convert argument of type ${r.$$.smartPtrType ? r.$$.smartPtrType.name : r.$$.ptrType.name} to parameter type ${this.name}`);
      var o = r.$$.ptrType.registeredClass;
      if (n = Rt(r.$$.ptr, o, this.registeredClass), this.isSmartPointer)
        switch (r.$$.smartPtr === void 0 && N("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            r.$$.smartPtrType === this ? n = r.$$.smartPtr : N(`Cannot convert argument of type ${r.$$.smartPtrType ? r.$$.smartPtrType.name : r.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            n = r.$$.smartPtr;
            break;
          case 2:
            if (r.$$.smartPtrType === this)
              n = r.$$.smartPtr;
            else {
              var u = r.clone();
              n = this.rawShare(n, gt.toHandle(function() {
                u.delete();
              })), t !== null && t.push(this.rawDestructor, n);
            }
            break;
          default:
            N("Unsupporting sharing policy");
        }
      return n;
    }
    function dr(t, r) {
      if (r === null)
        return this.isReference && N(`null is not a valid ${this.name}`), 0;
      r.$$ || N(`Cannot pass "${Ut(r)}" as a ${this.name}`), r.$$.ptr || N(`Cannot pass deleted object as a pointer of type ${this.name}`), r.$$.ptrType.isConst && N(`Cannot convert argument of type ${r.$$.ptrType.name} to parameter type ${this.name}`);
      var n = r.$$.ptrType.registeredClass, o = Rt(r.$$.ptr, n, this.registeredClass);
      return o;
    }
    function mt(t) {
      return this.fromWireType(V[t >> 2]);
    }
    function mn(t) {
      return this.rawGetPointee && (t = this.rawGetPointee(t)), t;
    }
    function gn(t) {
      this.rawDestructor && this.rawDestructor(t);
    }
    function yn(t) {
      t !== null && t.delete();
    }
    function wn() {
      Ee.prototype.getPointee = mn, Ee.prototype.destructor = gn, Ee.prototype.argPackAdvance = 8, Ee.prototype.readValueFromPointer = mt, Ee.prototype.deleteObject = yn, Ee.prototype.fromWireType = Rr;
    }
    function Ee(t, r, n, o, u, l, f, d, w, g, S) {
      this.name = t, this.registeredClass = r, this.isReference = n, this.isConst = o, this.isSmartPointer = u, this.pointeeType = l, this.sharingPolicy = f, this.rawGetPointee = d, this.rawConstructor = w, this.rawShare = g, this.rawDestructor = S, !u && r.baseClass === void 0 ? o ? (this.toWireType = Kt, this.destructorFunction = null) : (this.toWireType = dr, this.destructorFunction = null) : this.toWireType = vn;
    }
    function _n(t, r, n) {
      i.hasOwnProperty(t) || ft("Replacing nonexistant public symbol"), i[t].overloadTable !== void 0 && n !== void 0 ? i[t].overloadTable[n] = r : (i[t] = r, i[t].argCount = n);
    }
    var En = (t, r, n) => {
      var o = i["dynCall_" + t];
      return n && n.length ? o.apply(null, [r].concat(n)) : o.call(null, r);
    }, ot = [], Qt = (t) => {
      var r = ot[t];
      return r || (t >= ot.length && (ot.length = t + 1), ot[t] = r = er.get(t)), r;
    }, bn = (t, r, n) => {
      if (t.includes("j"))
        return En(t, r, n);
      var o = Qt(r).apply(null, n);
      return o;
    }, $n = (t, r) => {
      var n = [];
      return function() {
        return n.length = 0, Object.assign(n, arguments), bn(t, r, n);
      };
    };
    function Me(t, r) {
      t = de(t);
      function n() {
        return t.includes("j") ? $n(t, r) : Qt(r);
      }
      var o = n();
      return typeof o != "function" && N(`unknown function pointer with signature ${t}: ${r}`), o;
    }
    function Pn(t, r) {
      var n = Et(r, function(o) {
        this.name = r, this.message = o;
        var u = new Error(o).stack;
        u !== void 0 && (this.stack = this.toString() + `
` + u.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return n.prototype = Object.create(t.prototype), n.prototype.constructor = n, n.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, n;
    }
    var fr = void 0;
    function hr(t) {
      var r = Ln(t), n = de(r);
      return Ce(r), n;
    }
    function xt(t, r) {
      var n = [], o = {};
      function u(l) {
        if (!o[l] && !Ue[l]) {
          if (dt[l]) {
            dt[l].forEach(u);
            return;
          }
          n.push(l), o[l] = !0;
        }
      }
      throw r.forEach(u), new fr(`${t}: ` + n.map(hr).join([", "]));
    }
    function Tn(t, r, n, o, u, l, f, d, w, g, S, F, A) {
      S = de(S), l = Me(u, l), d && (d = Me(f, d)), g && (g = Me(w, g)), A = Me(F, A);
      var C = vt(S);
      Br(C, function() {
        xt(`Cannot construct ${S} due to unbound types`, [o]);
      }), Ze([t, r, n], o ? [o] : [], function(M) {
        M = M[0];
        var Z, J;
        o ? (Z = M.registeredClass, J = Z.instancePrototype) : J = Te.prototype;
        var oe = Et(C, function() {
          if (Object.getPrototypeOf(this) !== he)
            throw new He("Use 'new' to construct " + S);
          if (ee.constructor_body === void 0)
            throw new He(S + " has no accessible constructor");
          var se = ee.constructor_body[arguments.length];
          if (se === void 0)
            throw new He(`Tried to invoke ctor of ${S} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(ee.constructor_body).toString()}) parameters instead!`);
          return se.apply(this, arguments);
        }), he = Object.create(J, { constructor: { value: oe } });
        oe.prototype = he;
        var ee = new pn(S, oe, he, A, Z, l, d, g);
        ee.baseClass && (ee.baseClass.__derivedClasses === void 0 && (ee.baseClass.__derivedClasses = []), ee.baseClass.__derivedClasses.push(ee));
        var We = new Ee(S, ee, !0, !1, !1), ve = new Ee(S + "*", ee, !1, !1, !1), Se = new Ee(S + " const*", ee, !1, !0, !1);
        return lr[t] = { pointerType: ve, constPointerType: Se }, _n(C, oe), [We, ve, Se];
      });
    }
    function pr(t, r) {
      for (var n = [], o = 0; o < t; o++)
        n.push(X[r + o * 4 >> 2]);
      return n;
    }
    function kn(t) {
      for (; t.length; ) {
        var r = t.pop(), n = t.pop();
        n(r);
      }
    }
    function vr(t, r) {
      if (!(t instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof t} which is not a function`);
      var n = Et(t.name || "unknownFunctionName", function() {
      });
      n.prototype = t.prototype;
      var o = new n(), u = t.apply(o, r);
      return u instanceof Object ? u : o;
    }
    function mr(t, r, n, o, u, l) {
      var f = r.length;
      f < 2 && N("argTypes array size mismatch! Must at least get return value and 'this' types!");
      for (var d = r[1] !== null && n !== null, w = !1, g = 1; g < r.length; ++g)
        if (r[g] !== null && r[g].destructorFunction === void 0) {
          w = !0;
          break;
        }
      for (var S = r[0].name !== "void", F = "", A = "", g = 0; g < f - 2; ++g)
        F += (g !== 0 ? ", " : "") + "arg" + g, A += (g !== 0 ? ", " : "") + "arg" + g + "Wired";
      var C = `
        return function ${vt(t)}(${F}) {
        if (arguments.length !== ${f - 2}) {
          throwBindingError('function ${t} called with ${arguments.length} arguments, expected ${f - 2} args!');
        }`;
      w && (C += `var destructors = [];
`);
      var M = w ? "destructors" : "null", Z = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"], J = [N, o, u, kn, r[0], r[1]];
      d && (C += "var thisWired = classParam.toWireType(" + M + `, this);
`);
      for (var g = 0; g < f - 2; ++g)
        C += "var arg" + g + "Wired = argType" + g + ".toWireType(" + M + ", arg" + g + "); // " + r[g + 2].name + `
`, Z.push("argType" + g), J.push(r[g + 2]);
      if (d && (A = "thisWired" + (A.length > 0 ? ", " : "") + A), C += (S || l ? "var rv = " : "") + "invoker(fn" + (A.length > 0 ? ", " : "") + A + `);
`, w)
        C += `runDestructors(destructors);
`;
      else
        for (var g = d ? 1 : 2; g < r.length; ++g) {
          var oe = g === 1 ? "thisWired" : "arg" + (g - 2) + "Wired";
          r[g].destructorFunction !== null && (C += oe + "_dtor(" + oe + "); // " + r[g].name + `
`, Z.push(oe + "_dtor"), J.push(r[g].destructorFunction));
        }
      return S && (C += `var ret = retType.fromWireType(rv);
return ret;
`), C += `}
`, Z.push(C), vr(Function, Z).apply(null, J);
    }
    function Cn(t, r, n, o, u, l) {
      var f = pr(r, n);
      u = Me(o, u), Ze([], [t], function(d) {
        d = d[0];
        var w = `constructor ${d.name}`;
        if (d.registeredClass.constructor_body === void 0 && (d.registeredClass.constructor_body = []), d.registeredClass.constructor_body[r - 1] !== void 0)
          throw new He(`Cannot register multiple constructors with identical number of parameters (${r - 1}) for class '${d.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return d.registeredClass.constructor_body[r - 1] = () => {
          xt(`Cannot construct ${d.name} due to unbound types`, f);
        }, Ze([], f, function(g) {
          return g.splice(1, 0, null), d.registeredClass.constructor_body[r - 1] = mr(w, g, null, u, l), [];
        }), [];
      });
    }
    function gr(t, r, n, o, u, l, f, d, w) {
      var g = pr(n, o);
      r = de(r), l = Me(u, l), Ze([], [t], function(S) {
        S = S[0];
        var F = `${S.name}.${r}`;
        r.startsWith("@@") && (r = Symbol[r.substring(2)]), d && S.registeredClass.pureVirtualFunctions.push(r);
        function A() {
          xt(`Cannot call ${F} due to unbound types`, g);
        }
        var C = S.registeredClass.instancePrototype, M = C[r];
        return M === void 0 || M.overloadTable === void 0 && M.className !== S.name && M.argCount === n - 2 ? (A.argCount = n - 2, A.className = S.name, C[r] = A) : (Be(C, r, F), C[r].overloadTable[n - 2] = A), Ze([], g, function(Z) {
          var J = mr(F, Z, S, l, f, w);
          return C[r].overloadTable === void 0 ? (J.argCount = n - 2, C[r] = J) : C[r].overloadTable[n - 2] = J, [];
        }), [];
      });
    }
    function Sn() {
      Object.assign(yr.prototype, { get(t) {
        return this.allocated[t];
      }, has(t) {
        return this.allocated[t] !== void 0;
      }, allocate(t) {
        var r = this.freelist.pop() || this.allocated.length;
        return this.allocated[r] = t, r;
      }, free(t) {
        this.allocated[t] = void 0, this.freelist.push(t);
      } });
    }
    function yr() {
      this.allocated = [void 0], this.freelist = [];
    }
    var ge = new yr();
    function wr(t) {
      t >= ge.reserved && --ge.get(t).refcount === 0 && ge.free(t);
    }
    function Mr() {
      for (var t = 0, r = ge.reserved; r < ge.allocated.length; ++r)
        ge.allocated[r] !== void 0 && ++t;
      return t;
    }
    function An() {
      ge.allocated.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 }), ge.reserved = ge.allocated.length, i.count_emval_handles = Mr;
    }
    var gt = { toValue: (t) => (t || N("Cannot use deleted val. handle = " + t), ge.get(t).value), toHandle: (t) => {
      switch (t) {
        case void 0:
          return 1;
        case null:
          return 2;
        case !0:
          return 3;
        case !1:
          return 4;
        default:
          return ge.allocate({ refcount: 1, value: t });
      }
    } };
    function Or(t, r) {
      r = de(r), we(t, { name: r, fromWireType: function(n) {
        var o = gt.toValue(n);
        return wr(n), o;
      }, toWireType: function(n, o) {
        return gt.toHandle(o);
      }, argPackAdvance: 8, readValueFromPointer: mt, destructorFunction: null });
    }
    function Ut(t) {
      if (t === null)
        return "null";
      var r = typeof t;
      return r === "object" || r === "array" || r === "function" ? t.toString() : "" + t;
    }
    function Dn(t, r) {
      switch (r) {
        case 2:
          return function(n) {
            return this.fromWireType(jt[n >> 2]);
          };
        case 3:
          return function(n) {
            return this.fromWireType(Ht[n >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + t);
      }
    }
    function Fn(t, r, n) {
      var o = At(n);
      r = de(r), we(t, { name: r, fromWireType: function(u) {
        return u;
      }, toWireType: function(u, l) {
        return l;
      }, argPackAdvance: 8, readValueFromPointer: Dn(r, o), destructorFunction: null });
    }
    function Rn(t, r, n) {
      switch (r) {
        case 0:
          return n ? function(u) {
            return ne[u];
          } : function(u) {
            return K[u];
          };
        case 1:
          return n ? function(u) {
            return $e[u >> 1];
          } : function(u) {
            return rt[u >> 1];
          };
        case 2:
          return n ? function(u) {
            return V[u >> 2];
          } : function(u) {
            return X[u >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + t);
      }
    }
    function xn(t, r, n, o, u) {
      r = de(r);
      var l = At(n), f = (F) => F;
      if (o === 0) {
        var d = 32 - 8 * n;
        f = (F) => F << d >>> d;
      }
      var w = r.includes("unsigned"), g = (F, A) => {
      }, S;
      w ? S = function(F, A) {
        return g(A, this.name), A >>> 0;
      } : S = function(F, A) {
        return g(A, this.name), A;
      }, we(t, { name: r, fromWireType: f, toWireType: S, argPackAdvance: 8, readValueFromPointer: Rn(r, l, o !== 0), destructorFunction: null });
    }
    function Un(t, r, n) {
      var o = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], u = o[r];
      function l(f) {
        f = f >> 2;
        var d = X, w = d[f], g = d[f + 1];
        return new u(d.buffer, g, w);
      }
      n = de(n), we(t, { name: n, fromWireType: l, argPackAdvance: 8, readValueFromPointer: l }, { ignoreDuplicateRegistrations: !0 });
    }
    var Bn = (t, r, n) => kt(t, K, r, n);
    function tt(t, r) {
      r = de(r);
      var n = r === "std::string";
      we(t, { name: r, fromWireType: function(o) {
        var u = X[o >> 2], l = o + 4, f;
        if (n)
          for (var d = l, w = 0; w <= u; ++w) {
            var g = l + w;
            if (w == u || K[g] == 0) {
              var S = g - d, F = ct(d, S);
              f === void 0 ? f = F : (f += String.fromCharCode(0), f += F), d = g + 1;
            }
          }
        else {
          for (var A = new Array(u), w = 0; w < u; ++w)
            A[w] = String.fromCharCode(K[l + w]);
          f = A.join("");
        }
        return Ce(o), f;
      }, toWireType: function(o, u) {
        u instanceof ArrayBuffer && (u = new Uint8Array(u));
        var l, f = typeof u == "string";
        f || u instanceof Uint8Array || u instanceof Uint8ClampedArray || u instanceof Int8Array || N("Cannot pass non-string to std::string"), n && f ? l = Tt(u) : l = u.length;
        var d = Er(4 + l + 1), w = d + 4;
        if (X[d >> 2] = l, n && f)
          Bn(u, w, l + 1);
        else if (f)
          for (var g = 0; g < l; ++g) {
            var S = u.charCodeAt(g);
            S > 255 && (Ce(w), N("String has UTF-16 code units that do not fit in 8 bits")), K[w + g] = S;
          }
        else
          for (var g = 0; g < l; ++g)
            K[w + g] = u[g];
        return o !== null && o.push(Ce, d), d;
      }, argPackAdvance: 8, readValueFromPointer: mt, destructorFunction: function(o) {
        Ce(o);
      } });
    }
    var Bt = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, Ir = (t, r) => {
      for (var n = t, o = n >> 1, u = o + r / 2; !(o >= u) && rt[o]; )
        ++o;
      if (n = o << 1, n - t > 32 && Bt)
        return Bt.decode(K.subarray(t, n));
      for (var l = "", f = 0; !(f >= r / 2); ++f) {
        var d = $e[t + f * 2 >> 1];
        if (d == 0)
          break;
        l += String.fromCharCode(d);
      }
      return l;
    }, Lr = (t, r, n) => {
      if (n === void 0 && (n = 2147483647), n < 2)
        return 0;
      n -= 2;
      for (var o = r, u = n < t.length * 2 ? n / 2 : t.length, l = 0; l < u; ++l) {
        var f = t.charCodeAt(l);
        $e[r >> 1] = f, r += 2;
      }
      return $e[r >> 1] = 0, r - o;
    }, Yt = (t) => t.length * 2, jr = (t, r) => {
      for (var n = 0, o = ""; !(n >= r / 4); ) {
        var u = V[t + n * 4 >> 2];
        if (u == 0)
          break;
        if (++n, u >= 65536) {
          var l = u - 65536;
          o += String.fromCharCode(55296 | l >> 10, 56320 | l & 1023);
        } else
          o += String.fromCharCode(u);
      }
      return o;
    }, p = (t, r, n) => {
      if (n === void 0 && (n = 2147483647), n < 4)
        return 0;
      for (var o = r, u = o + n - 4, l = 0; l < t.length; ++l) {
        var f = t.charCodeAt(l);
        if (f >= 55296 && f <= 57343) {
          var d = t.charCodeAt(++l);
          f = 65536 + ((f & 1023) << 10) | d & 1023;
        }
        if (V[r >> 2] = f, r += 4, r + 4 > u)
          break;
      }
      return V[r >> 2] = 0, r - o;
    }, v = (t) => {
      for (var r = 0, n = 0; n < t.length; ++n) {
        var o = t.charCodeAt(n);
        o >= 55296 && o <= 57343 && ++n, r += 4;
      }
      return r;
    }, m = function(t, r, n) {
      n = de(n);
      var o, u, l, f, d;
      r === 2 ? (o = Ir, u = Lr, f = Yt, l = () => rt, d = 1) : r === 4 && (o = jr, u = p, f = v, l = () => X, d = 2), we(t, { name: n, fromWireType: function(w) {
        for (var g = X[w >> 2], S = l(), F, A = w + 4, C = 0; C <= g; ++C) {
          var M = w + 4 + C * r;
          if (C == g || S[M >> d] == 0) {
            var Z = M - A, J = o(A, Z);
            F === void 0 ? F = J : (F += String.fromCharCode(0), F += J), A = M + r;
          }
        }
        return Ce(w), F;
      }, toWireType: function(w, g) {
        typeof g != "string" && N(`Cannot pass non-string to C++ string type ${n}`);
        var S = f(g), F = Er(4 + S + r);
        return X[F >> 2] = S >> d, u(g, F + 4, S + r), w !== null && w.push(Ce, F), F;
      }, argPackAdvance: 8, readValueFromPointer: mt, destructorFunction: function(w) {
        Ce(w);
      } });
    };
    function $(t, r) {
      r = de(r), we(t, { isVoid: !0, name: r, argPackAdvance: 0, fromWireType: function() {
      }, toWireType: function(n, o) {
      } });
    }
    var R = {};
    function B(t) {
      var r = R[t];
      return r === void 0 ? de(t) : r;
    }
    var O = [];
    function x(t, r, n, o) {
      t = O[t], r = gt.toValue(r), n = B(n), t(r, n, null, o);
    }
    function q(t) {
      var r = O.length;
      return O.push(t), r;
    }
    function I(t, r) {
      var n = Ue[t];
      return n === void 0 && N(r + " has unknown type " + hr(t)), n;
    }
    function re(t, r) {
      for (var n = new Array(t), o = 0; o < t; ++o)
        n[o] = I(X[r + o * 4 >> 2], "parameter " + o);
      return n;
    }
    var ie = [];
    function le(t, r) {
      var n = re(t, r), o = n[0], u = o.name + "_$" + n.slice(1).map(function(M) {
        return M.name;
      }).join("_") + "$", l = ie[u];
      if (l !== void 0)
        return l;
      for (var f = ["retType"], d = [o], w = "", g = 0; g < t - 1; ++g)
        w += (g !== 0 ? ", " : "") + "arg" + g, f.push("argType" + g), d.push(n[1 + g]);
      for (var S = vt("methodCaller_" + u), F = "return function " + S + `(handle, name, destructors, args) {
`, A = 0, g = 0; g < t - 1; ++g)
        F += "    var arg" + g + " = argType" + g + ".readValueFromPointer(args" + (A ? "+" + A : "") + `);
`, A += n[g + 1].argPackAdvance;
      F += "    var rv = handle[name](" + w + `);
`;
      for (var g = 0; g < t - 1; ++g)
        n[g + 1].deleteObject && (F += "    argType" + g + ".deleteObject(arg" + g + `);
`);
      o.isVoid || (F += `    return retType.toWireType(destructors, rv);
`), F += `};
`, f.push(F);
      var C = vr(Function, f).apply(null, d);
      return l = q(C), ie[u] = l, l;
    }
    function fe(t, r) {
      return r + 2097152 >>> 0 < 4194305 - !!t ? (t >>> 0) + r * 4294967296 : NaN;
    }
    var be = () => {
      Fe("");
    };
    function Oe() {
      return Date.now();
    }
    var Ae = () => K.length, st = () => Ae(), _r = (t, r, n) => K.copyWithin(t, r, r + n), ze = (t) => {
      Fe("OOM");
    }, Mn = (t) => {
      K.length, ze();
    }, bt = {}, Hr = () => b || "./this.program", Xe = () => {
      if (!Xe.strings) {
        var t = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", r = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: t, _: Hr() };
        for (var n in bt)
          bt[n] === void 0 ? delete r[n] : r[n] = bt[n];
        var o = [];
        for (var n in r)
          o.push(`${n}=${r[n]}`);
        Xe.strings = o;
      }
      return Xe.strings;
    }, ui = (t, r) => {
      for (var n = 0; n < t.length; ++n)
        ne[r++ >> 0] = t.charCodeAt(n);
      ne[r >> 0] = 0;
    }, li = (t, r) => {
      var n = 0;
      return Xe().forEach(function(o, u) {
        var l = r + n;
        X[t + u * 4 >> 2] = l, ui(o, l), n += o.length + 1;
      }), 0;
    }, ci = (t, r) => {
      var n = Xe();
      X[t >> 2] = n.length;
      var o = 0;
      return n.forEach(function(u) {
        o += u.length + 1;
      }), X[r >> 2] = o, 0;
    };
    function di(t) {
      try {
        var r = ue.getStreamFromFD(t);
        return s.close(r), 0;
      } catch (n) {
        if (typeof s > "u" || n.name !== "ErrnoError")
          throw n;
        return n.errno;
      }
    }
    function fi(t, r) {
      try {
        var n = 0, o = 0, u = 0, l = ue.getStreamFromFD(t), f = l.tty ? 2 : s.isDir(l.mode) ? 3 : s.isLink(l.mode) ? 7 : 4;
        return ne[r >> 0] = f, $e[r + 2 >> 1] = u, Y = [n >>> 0, (U = n, +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 8 >> 2] = Y[0], V[r + 12 >> 2] = Y[1], Y = [o >>> 0, (U = o, +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 16 >> 2] = Y[0], V[r + 20 >> 2] = Y[1], 0;
      } catch (d) {
        if (typeof s > "u" || d.name !== "ErrnoError")
          throw d;
        return d.errno;
      }
    }
    var hi = (t, r, n, o) => {
      for (var u = 0, l = 0; l < n; l++) {
        var f = X[r >> 2], d = X[r + 4 >> 2];
        r += 8;
        var w = s.read(t, ne, f, d, o);
        if (w < 0)
          return -1;
        if (u += w, w < d)
          break;
        typeof o < "u" && (o += w);
      }
      return u;
    };
    function pi(t, r, n, o) {
      try {
        var u = ue.getStreamFromFD(t), l = hi(u, r, n);
        return X[o >> 2] = l, 0;
      } catch (f) {
        if (typeof s > "u" || f.name !== "ErrnoError")
          throw f;
        return f.errno;
      }
    }
    function vi(t, r, n, o, u) {
      var l = fe(r, n);
      try {
        if (isNaN(l))
          return 61;
        var f = ue.getStreamFromFD(t);
        return s.llseek(f, l, o), Y = [f.position >>> 0, (U = f.position, +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[u >> 2] = Y[0], V[u + 4 >> 2] = Y[1], f.getdents && l === 0 && o === 0 && (f.getdents = null), 0;
      } catch (d) {
        if (typeof s > "u" || d.name !== "ErrnoError")
          throw d;
        return d.errno;
      }
    }
    var mi = (t, r, n, o) => {
      for (var u = 0, l = 0; l < n; l++) {
        var f = X[r >> 2], d = X[r + 4 >> 2];
        r += 8;
        var w = s.write(t, ne, f, d, o);
        if (w < 0)
          return -1;
        u += w, typeof o < "u" && (o += w);
      }
      return u;
    };
    function gi(t, r, n, o) {
      try {
        var u = ue.getStreamFromFD(t), l = mi(u, r, n);
        return X[o >> 2] = l, 0;
      } catch (f) {
        if (typeof s > "u" || f.name !== "ErrnoError")
          throw f;
        return f.errno;
      }
    }
    var On = function(t, r, n, o) {
      t || (t = this), this.parent = t, this.mount = t.mount, this.mounted = null, this.id = s.nextInode++, this.name = r, this.mode = n, this.node_ops = {}, this.stream_ops = {}, this.rdev = o;
    }, Mt = 365, Ot = 146;
    Object.defineProperties(On.prototype, { read: { get: function() {
      return (this.mode & Mt) === Mt;
    }, set: function(t) {
      t ? this.mode |= Mt : this.mode &= ~Mt;
    } }, write: { get: function() {
      return (this.mode & Ot) === Ot;
    }, set: function(t) {
      t ? this.mode |= Ot : this.mode &= ~Ot;
    } }, isFolder: { get: function() {
      return s.isDir(this.mode);
    } }, isDevice: { get: function() {
      return s.isChrdev(this.mode);
    } } }), s.FSNode = On, s.createPreloadedFile = Jr, s.staticInit(), qt(), He = i.BindingError = class extends Error {
      constructor(r) {
        super(r), this.name = "BindingError";
      }
    }, qe = i.InternalError = class extends Error {
      constructor(r) {
        super(r), this.name = "InternalError";
      }
    }, Ur(), Fr(), wn(), fr = i.UnboundTypeError = Pn(Error, "UnboundTypeError"), Sn(), An();
    var yi = { p: ut, C: tn, w: St, t: rn, n: Dr, r: Tn, q: Cn, d: gr, D: Or, k: Fn, c: xn, b: Un, j: tt, f: m, o: $, g: x, m: wr, l: le, a: be, e: Oe, v: st, A: _r, u: Mn, y: li, z: ci, i: di, x: fi, B: pi, s: vi, h: gi };
    Zr();
    var Er = (t) => (Er = Q.G)(t), Ce = (t) => (Ce = Q.I)(t), In = () => (In = Q.J)(), Ln = (t) => (Ln = Q.K)(t);
    i.__embind_initialize_bindings = () => (i.__embind_initialize_bindings = Q.L)();
    var jn = (t) => (jn = Q.M)(t);
    i.dynCall_jiji = (t, r, n, o, u) => (i.dynCall_jiji = Q.N)(t, r, n, o, u), i._ff_h264_cabac_tables = 67061;
    var It;
    Qe = function t() {
      It || Hn(), It || (Qe = t);
    };
    function Hn() {
      if (Pe > 0 || (qr(), Pe > 0))
        return;
      function t() {
        It || (It = !0, i.calledRun = !0, !ae && (Gr(), h(i), i.onRuntimeInitialized && i.onRuntimeInitialized(), at()));
      }
      i.setStatus ? (i.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          i.setStatus("");
        }, 1), t();
      }, 1)) : t();
    }
    if (i.preInit)
      for (typeof i.preInit == "function" && (i.preInit = [i.preInit]); i.preInit.length > 0; )
        i.preInit.pop()();
    return Hn(), a.ready;
  };
})();
class So extends Zn {
  constructor(a) {
    super(Co, a?.wasmPath ? fetch(a?.wasmPath).then((i) => i.arrayBuffer()) : void 0, a?.workerMode, a?.canvas, a?.yuvMode);
  }
}
var Ao = (() => {
  var T = typeof document < "u" && document.currentScript ? document.currentScript.src : void 0;
  return function(a = {}) {
    var i = a, h, c;
    i.ready = new Promise((t, r) => {
      h = t, c = r;
    });
    var _ = Object.assign({}, i), b = "./this.program", P = typeof window == "object", y = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && process.versions.node;
    var E = "";
    function D(t) {
      return i.locateFile ? i.locateFile(t, E) : E + t;
    }
    var k, j, z;
    (P || y) && (y ? E = self.location.href : typeof document < "u" && document.currentScript && (E = document.currentScript.src), T && (E = T), E.indexOf("blob:") !== 0 ? E = E.substr(0, E.replace(/[?#].*/, "").lastIndexOf("/") + 1) : E = "", k = (t) => {
      var r = new XMLHttpRequest();
      return r.open("GET", t, !1), r.send(null), r.responseText;
    }, y && (z = (t) => {
      var r = new XMLHttpRequest();
      return r.open("GET", t, !1), r.responseType = "arraybuffer", r.send(null), new Uint8Array(r.response);
    }), j = (t, r, n) => {
      var o = new XMLHttpRequest();
      o.open("GET", t, !0), o.responseType = "arraybuffer", o.onload = () => {
        if (o.status == 200 || o.status == 0 && o.response) {
          r(o.response);
          return;
        }
        n();
      }, o.onerror = n, o.send(null);
    });
    var W = i.print || console.log.bind(console), te = i.printErr || console.error.bind(console);
    Object.assign(i, _), _ = null, i.arguments && i.arguments, i.thisProgram && (b = i.thisProgram), i.quit && i.quit;
    var H;
    i.wasmBinary && (H = i.wasmBinary), i.noExitRuntime, typeof WebAssembly != "object" && Fe("no native wasm support detected");
    var pe, Q, ae = !1;
    function Ve(t, r) {
      t || Fe(r);
    }
    var ne, K, $e, rt, V, X, jt, Ht;
    function Tr() {
      var t = pe.buffer;
      i.HEAP8 = ne = new Int8Array(t), i.HEAP16 = $e = new Int16Array(t), i.HEAP32 = V = new Int32Array(t), i.HEAPU8 = K = new Uint8Array(t), i.HEAPU16 = rt = new Uint16Array(t), i.HEAPU32 = X = new Uint32Array(t), i.HEAPF32 = jt = new Float32Array(t), i.HEAPF64 = Ht = new Float64Array(t);
    }
    var er, tr = [], rr = [], nr = [];
    function qr() {
      if (i.preRun)
        for (typeof i.preRun == "function" && (i.preRun = [i.preRun]); i.preRun.length; )
          $t(i.preRun.shift());
      yt(tr);
    }
    function Gr() {
      !i.noFSInit && !s.init.initialized && s.init(), s.ignorePermissions = !1, yt(rr);
    }
    function at() {
      if (i.postRun)
        for (typeof i.postRun == "function" && (i.postRun = [i.postRun]); i.postRun.length; )
          Kr(i.postRun.shift());
      yt(nr);
    }
    function $t(t) {
      tr.unshift(t);
    }
    function Xr(t) {
      rr.unshift(t);
    }
    function Kr(t) {
      nr.unshift(t);
    }
    var Pe = 0, Qe = null;
    function ei(t) {
      return t;
    }
    function Ne(t) {
      Pe++, i.monitorRunDependencies && i.monitorRunDependencies(Pe);
    }
    function nt(t) {
      if (Pe--, i.monitorRunDependencies && i.monitorRunDependencies(Pe), Pe == 0 && Qe) {
        var r = Qe;
        Qe = null, r();
      }
    }
    function Fe(t) {
      i.onAbort && i.onAbort(t), t = "Aborted(" + t + ")", te(t), ae = !0, t += ". Build with -sASSERTIONS for more info.";
      var r = new WebAssembly.RuntimeError(t);
      throw c(r), r;
    }
    var kr = "data:application/octet-stream;base64,";
    function ir(t) {
      return t.startsWith(kr);
    }
    var Ie;
    Ie = "audiodec.wasm", ir(Ie) || (Ie = D(Ie));
    function Pt(t) {
      if (t == Ie && H)
        return new Uint8Array(H);
      if (z)
        return z(t);
      throw "both async and sync fetching of the wasm failed";
    }
    function Qr(t) {
      return !H && (P || y) && typeof fetch == "function" ? fetch(t, { credentials: "same-origin" }).then((r) => {
        if (!r.ok)
          throw "failed to load wasm binary file at '" + t + "'";
        return r.arrayBuffer();
      }).catch(() => Pt(t)) : Promise.resolve().then(() => Pt(t));
    }
    function zt(t, r, n) {
      return Qr(t).then((o) => WebAssembly.instantiate(o, r)).then((o) => o).then(n, (o) => {
        te("failed to asynchronously prepare wasm: " + o), Fe(o);
      });
    }
    function Yr(t, r, n, o) {
      return !t && typeof WebAssembly.instantiateStreaming == "function" && !ir(r) && typeof fetch == "function" ? fetch(r, { credentials: "same-origin" }).then((u) => {
        var l = WebAssembly.instantiateStreaming(u, n);
        return l.then(o, function(f) {
          return te("wasm streaming compile failed: " + f), te("falling back to ArrayBuffer instantiation"), zt(r, n, o);
        });
      }) : zt(r, n, o);
    }
    function Zr() {
      var t = { a: yi };
      function r(o, u) {
        var l = o.exports;
        return Q = l, pe = Q.E, Tr(), er = Q.H, Xr(Q.F), nt(), l;
      }
      Ne();
      function n(o) {
        r(o.instance);
      }
      if (i.instantiateWasm)
        try {
          return i.instantiateWasm(t, r);
        } catch (o) {
          te("Module.instantiateWasm callback failed with error: " + o), c(o);
        }
      return Yr(H, Ie, t, n).catch(c), {};
    }
    var U, Y, yt = (t) => {
      for (; t.length > 0; )
        t.shift()(i);
    };
    function Re(t) {
      this.excPtr = t, this.ptr = t - 24, this.set_type = function(r) {
        X[this.ptr + 4 >> 2] = r;
      }, this.get_type = function() {
        return X[this.ptr + 4 >> 2];
      }, this.set_destructor = function(r) {
        X[this.ptr + 8 >> 2] = r;
      }, this.get_destructor = function() {
        return X[this.ptr + 8 >> 2];
      }, this.set_caught = function(r) {
        r = r ? 1 : 0, ne[this.ptr + 12 >> 0] = r;
      }, this.get_caught = function() {
        return ne[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(r) {
        r = r ? 1 : 0, ne[this.ptr + 13 >> 0] = r;
      }, this.get_rethrown = function() {
        return ne[this.ptr + 13 >> 0] != 0;
      }, this.init = function(r, n) {
        this.set_adjusted_ptr(0), this.set_type(r), this.set_destructor(n);
      }, this.set_adjusted_ptr = function(r) {
        X[this.ptr + 16 >> 2] = r;
      }, this.get_adjusted_ptr = function() {
        return X[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var r = jn(this.get_type());
        if (r)
          return X[this.excPtr >> 2];
        var n = this.get_adjusted_ptr();
        return n !== 0 ? n : this.excPtr;
      };
    }
    var it = 0;
    function ut(t, r, n) {
      var o = new Re(t);
      throw o.init(r, n), it = t, it;
    }
    var Wt = (t) => (V[In() >> 2] = t, t), G = { isAbs: (t) => t.charAt(0) === "/", splitPath: (t) => {
      var r = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
      return r.exec(t).slice(1);
    }, normalizeArray: (t, r) => {
      for (var n = 0, o = t.length - 1; o >= 0; o--) {
        var u = t[o];
        u === "." ? t.splice(o, 1) : u === ".." ? (t.splice(o, 1), n++) : n && (t.splice(o, 1), n--);
      }
      if (r)
        for (; n; n--)
          t.unshift("..");
      return t;
    }, normalize: (t) => {
      var r = G.isAbs(t), n = t.substr(-1) === "/";
      return t = G.normalizeArray(t.split("/").filter((o) => !!o), !r).join("/"), !t && !r && (t = "."), t && n && (t += "/"), (r ? "/" : "") + t;
    }, dirname: (t) => {
      var r = G.splitPath(t), n = r[0], o = r[1];
      return !n && !o ? "." : (o && (o = o.substr(0, o.length - 1)), n + o);
    }, basename: (t) => {
      if (t === "/")
        return "/";
      t = G.normalize(t), t = t.replace(/\/$/, "");
      var r = t.lastIndexOf("/");
      return r === -1 ? t : t.substr(r + 1);
    }, join: function() {
      var t = Array.prototype.slice.call(arguments);
      return G.normalize(t.join("/"));
    }, join2: (t, r) => G.normalize(t + "/" + r) }, ce = () => {
      if (typeof crypto == "object" && typeof crypto.getRandomValues == "function")
        return (t) => crypto.getRandomValues(t);
      Fe("initRandomDevice");
    }, Vt = (t) => (Vt = ce())(t), ye = { resolve: function() {
      for (var t = "", r = !1, n = arguments.length - 1; n >= -1 && !r; n--) {
        var o = n >= 0 ? arguments[n] : s.cwd();
        if (typeof o != "string")
          throw new TypeError("Arguments to path.resolve must be strings");
        if (!o)
          return "";
        t = o + "/" + t, r = G.isAbs(o);
      }
      return t = G.normalizeArray(t.split("/").filter((u) => !!u), !r).join("/"), (r ? "/" : "") + t || ".";
    }, relative: (t, r) => {
      t = ye.resolve(t).substr(1), r = ye.resolve(r).substr(1);
      function n(g) {
        for (var S = 0; S < g.length && g[S] === ""; S++)
          ;
        for (var F = g.length - 1; F >= 0 && g[F] === ""; F--)
          ;
        return S > F ? [] : g.slice(S, F - S + 1);
      }
      for (var o = n(t.split("/")), u = n(r.split("/")), l = Math.min(o.length, u.length), f = l, d = 0; d < l; d++)
        if (o[d] !== u[d]) {
          f = d;
          break;
        }
      for (var w = [], d = f; d < o.length; d++)
        w.push("..");
      return w = w.concat(u.slice(f)), w.join("/");
    } }, lt = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, Le = (t, r, n) => {
      for (var o = r + n, u = r; t[u] && !(u >= o); )
        ++u;
      if (u - r > 16 && t.buffer && lt)
        return lt.decode(t.subarray(r, u));
      for (var l = ""; r < u; ) {
        var f = t[r++];
        if (!(f & 128)) {
          l += String.fromCharCode(f);
          continue;
        }
        var d = t[r++] & 63;
        if ((f & 224) == 192) {
          l += String.fromCharCode((f & 31) << 6 | d);
          continue;
        }
        var w = t[r++] & 63;
        if ((f & 240) == 224 ? f = (f & 15) << 12 | d << 6 | w : f = (f & 7) << 18 | d << 12 | w << 6 | t[r++] & 63, f < 65536)
          l += String.fromCharCode(f);
        else {
          var g = f - 65536;
          l += String.fromCharCode(55296 | g >> 10, 56320 | g & 1023);
        }
      }
      return l;
    }, xe = [], Tt = (t) => {
      for (var r = 0, n = 0; n < t.length; ++n) {
        var o = t.charCodeAt(n);
        o <= 127 ? r++ : o <= 2047 ? r += 2 : o >= 55296 && o <= 57343 ? (r += 4, ++n) : r += 3;
      }
      return r;
    }, kt = (t, r, n, o) => {
      if (!(o > 0))
        return 0;
      for (var u = n, l = n + o - 1, f = 0; f < t.length; ++f) {
        var d = t.charCodeAt(f);
        if (d >= 55296 && d <= 57343) {
          var w = t.charCodeAt(++f);
          d = 65536 + ((d & 1023) << 10) | w & 1023;
        }
        if (d <= 127) {
          if (n >= l)
            break;
          r[n++] = d;
        } else if (d <= 2047) {
          if (n + 1 >= l)
            break;
          r[n++] = 192 | d >> 6, r[n++] = 128 | d & 63;
        } else if (d <= 65535) {
          if (n + 2 >= l)
            break;
          r[n++] = 224 | d >> 12, r[n++] = 128 | d >> 6 & 63, r[n++] = 128 | d & 63;
        } else {
          if (n + 3 >= l)
            break;
          r[n++] = 240 | d >> 18, r[n++] = 128 | d >> 12 & 63, r[n++] = 128 | d >> 6 & 63, r[n++] = 128 | d & 63;
        }
      }
      return r[n] = 0, n - u;
    };
    function Ct(t, r, n) {
      var o = n > 0 ? n : Tt(t) + 1, u = new Array(o), l = kt(t, u, 0, u.length);
      return r && (u.length = l), u;
    }
    var or = () => {
      if (!xe.length) {
        var t = null;
        if (typeof window < "u" && typeof window.prompt == "function" ? (t = window.prompt("Input: "), t !== null && (t += `
`)) : typeof readline == "function" && (t = readline(), t !== null && (t += `
`)), !t)
          return null;
        xe = Ct(t, !0);
      }
      return xe.shift();
    }, ke = { ttys: [], init: function() {
    }, shutdown: function() {
    }, register: function(t, r) {
      ke.ttys[t] = { input: [], output: [], ops: r }, s.registerDevice(t, ke.stream_ops);
    }, stream_ops: { open: function(t) {
      var r = ke.ttys[t.node.rdev];
      if (!r)
        throw new s.ErrnoError(43);
      t.tty = r, t.seekable = !1;
    }, close: function(t) {
      t.tty.ops.fsync(t.tty);
    }, fsync: function(t) {
      t.tty.ops.fsync(t.tty);
    }, read: function(t, r, n, o, u) {
      if (!t.tty || !t.tty.ops.get_char)
        throw new s.ErrnoError(60);
      for (var l = 0, f = 0; f < o; f++) {
        var d;
        try {
          d = t.tty.ops.get_char(t.tty);
        } catch {
          throw new s.ErrnoError(29);
        }
        if (d === void 0 && l === 0)
          throw new s.ErrnoError(6);
        if (d == null)
          break;
        l++, r[n + f] = d;
      }
      return l && (t.node.timestamp = Date.now()), l;
    }, write: function(t, r, n, o, u) {
      if (!t.tty || !t.tty.ops.put_char)
        throw new s.ErrnoError(60);
      try {
        for (var l = 0; l < o; l++)
          t.tty.ops.put_char(t.tty, r[n + l]);
      } catch {
        throw new s.ErrnoError(29);
      }
      return o && (t.node.timestamp = Date.now()), l;
    } }, default_tty_ops: { get_char: function(t) {
      return or();
    }, put_char: function(t, r) {
      r === null || r === 10 ? (W(Le(t.output, 0)), t.output = []) : r != 0 && t.output.push(r);
    }, fsync: function(t) {
      t.output && t.output.length > 0 && (W(Le(t.output, 0)), t.output = []);
    }, ioctl_tcgets: function(t) {
      return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    }, ioctl_tcsets: function(t, r, n) {
      return 0;
    }, ioctl_tiocgwinsz: function(t) {
      return [24, 80];
    } }, default_tty1_ops: { put_char: function(t, r) {
      r === null || r === 10 ? (te(Le(t.output, 0)), t.output = []) : r != 0 && t.output.push(r);
    }, fsync: function(t) {
      t.output && t.output.length > 0 && (te(Le(t.output, 0)), t.output = []);
    } } }, Nt = (t) => {
      Fe();
    }, L = { ops_table: null, mount(t) {
      return L.createNode(null, "/", 16895, 0);
    }, createNode(t, r, n, o) {
      if (s.isBlkdev(n) || s.isFIFO(n))
        throw new s.ErrnoError(63);
      L.ops_table || (L.ops_table = { dir: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr, lookup: L.node_ops.lookup, mknod: L.node_ops.mknod, rename: L.node_ops.rename, unlink: L.node_ops.unlink, rmdir: L.node_ops.rmdir, readdir: L.node_ops.readdir, symlink: L.node_ops.symlink }, stream: { llseek: L.stream_ops.llseek } }, file: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr }, stream: { llseek: L.stream_ops.llseek, read: L.stream_ops.read, write: L.stream_ops.write, allocate: L.stream_ops.allocate, mmap: L.stream_ops.mmap, msync: L.stream_ops.msync } }, link: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr, readlink: L.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: L.node_ops.getattr, setattr: L.node_ops.setattr }, stream: s.chrdev_stream_ops } });
      var u = s.createNode(t, r, n, o);
      return s.isDir(u.mode) ? (u.node_ops = L.ops_table.dir.node, u.stream_ops = L.ops_table.dir.stream, u.contents = {}) : s.isFile(u.mode) ? (u.node_ops = L.ops_table.file.node, u.stream_ops = L.ops_table.file.stream, u.usedBytes = 0, u.contents = null) : s.isLink(u.mode) ? (u.node_ops = L.ops_table.link.node, u.stream_ops = L.ops_table.link.stream) : s.isChrdev(u.mode) && (u.node_ops = L.ops_table.chrdev.node, u.stream_ops = L.ops_table.chrdev.stream), u.timestamp = Date.now(), t && (t.contents[r] = u, t.timestamp = u.timestamp), u;
    }, getFileDataAsTypedArray(t) {
      return t.contents ? t.contents.subarray ? t.contents.subarray(0, t.usedBytes) : new Uint8Array(t.contents) : new Uint8Array(0);
    }, expandFileStorage(t, r) {
      var n = t.contents ? t.contents.length : 0;
      if (!(n >= r)) {
        var o = 1024 * 1024;
        r = Math.max(r, n * (n < o ? 2 : 1.125) >>> 0), n != 0 && (r = Math.max(r, 256));
        var u = t.contents;
        t.contents = new Uint8Array(r), t.usedBytes > 0 && t.contents.set(u.subarray(0, t.usedBytes), 0);
      }
    }, resizeFileStorage(t, r) {
      if (t.usedBytes != r)
        if (r == 0)
          t.contents = null, t.usedBytes = 0;
        else {
          var n = t.contents;
          t.contents = new Uint8Array(r), n && t.contents.set(n.subarray(0, Math.min(r, t.usedBytes))), t.usedBytes = r;
        }
    }, node_ops: { getattr(t) {
      var r = {};
      return r.dev = s.isChrdev(t.mode) ? t.id : 1, r.ino = t.id, r.mode = t.mode, r.nlink = 1, r.uid = 0, r.gid = 0, r.rdev = t.rdev, s.isDir(t.mode) ? r.size = 4096 : s.isFile(t.mode) ? r.size = t.usedBytes : s.isLink(t.mode) ? r.size = t.link.length : r.size = 0, r.atime = new Date(t.timestamp), r.mtime = new Date(t.timestamp), r.ctime = new Date(t.timestamp), r.blksize = 4096, r.blocks = Math.ceil(r.size / r.blksize), r;
    }, setattr(t, r) {
      r.mode !== void 0 && (t.mode = r.mode), r.timestamp !== void 0 && (t.timestamp = r.timestamp), r.size !== void 0 && L.resizeFileStorage(t, r.size);
    }, lookup(t, r) {
      throw s.genericErrors[44];
    }, mknod(t, r, n, o) {
      return L.createNode(t, r, n, o);
    }, rename(t, r, n) {
      if (s.isDir(t.mode)) {
        var o;
        try {
          o = s.lookupNode(r, n);
        } catch {
        }
        if (o)
          for (var u in o.contents)
            throw new s.ErrnoError(55);
      }
      delete t.parent.contents[t.name], t.parent.timestamp = Date.now(), t.name = n, r.contents[n] = t, r.timestamp = t.parent.timestamp, t.parent = r;
    }, unlink(t, r) {
      delete t.contents[r], t.timestamp = Date.now();
    }, rmdir(t, r) {
      var n = s.lookupNode(t, r);
      for (var o in n.contents)
        throw new s.ErrnoError(55);
      delete t.contents[r], t.timestamp = Date.now();
    }, readdir(t) {
      var r = [".", ".."];
      for (var n in t.contents)
        t.contents.hasOwnProperty(n) && r.push(n);
      return r;
    }, symlink(t, r, n) {
      var o = L.createNode(t, r, 41471, 0);
      return o.link = n, o;
    }, readlink(t) {
      if (!s.isLink(t.mode))
        throw new s.ErrnoError(28);
      return t.link;
    } }, stream_ops: { read(t, r, n, o, u) {
      var l = t.node.contents;
      if (u >= t.node.usedBytes)
        return 0;
      var f = Math.min(t.node.usedBytes - u, o);
      if (f > 8 && l.subarray)
        r.set(l.subarray(u, u + f), n);
      else
        for (var d = 0; d < f; d++)
          r[n + d] = l[u + d];
      return f;
    }, write(t, r, n, o, u, l) {
      if (!o)
        return 0;
      var f = t.node;
      if (f.timestamp = Date.now(), r.subarray && (!f.contents || f.contents.subarray)) {
        if (l)
          return f.contents = r.subarray(n, n + o), f.usedBytes = o, o;
        if (f.usedBytes === 0 && u === 0)
          return f.contents = r.slice(n, n + o), f.usedBytes = o, o;
        if (u + o <= f.usedBytes)
          return f.contents.set(r.subarray(n, n + o), u), o;
      }
      if (L.expandFileStorage(f, u + o), f.contents.subarray && r.subarray)
        f.contents.set(r.subarray(n, n + o), u);
      else
        for (var d = 0; d < o; d++)
          f.contents[u + d] = r[n + d];
      return f.usedBytes = Math.max(f.usedBytes, u + o), o;
    }, llseek(t, r, n) {
      var o = r;
      if (n === 1 ? o += t.position : n === 2 && s.isFile(t.node.mode) && (o += t.node.usedBytes), o < 0)
        throw new s.ErrnoError(28);
      return o;
    }, allocate(t, r, n) {
      L.expandFileStorage(t.node, r + n), t.node.usedBytes = Math.max(t.node.usedBytes, r + n);
    }, mmap(t, r, n, o, u) {
      if (!s.isFile(t.node.mode))
        throw new s.ErrnoError(43);
      var l, f, d = t.node.contents;
      if (!(u & 2) && d.buffer === ne.buffer)
        f = !1, l = d.byteOffset;
      else {
        if ((n > 0 || n + r < d.length) && (d.subarray ? d = d.subarray(n, n + r) : d = Array.prototype.slice.call(d, n, n + r)), f = !0, l = Nt(), !l)
          throw new s.ErrnoError(48);
        ne.set(d, l);
      }
      return { ptr: l, allocated: f };
    }, msync(t, r, n, o, u) {
      return L.stream_ops.write(t, r, 0, o, n, !1), 0;
    } } }, Cr = (t, r, n, o) => {
      var u = o ? "" : `al ${t}`;
      j(t, (l) => {
        Ve(l, `Loading data file "${t}" failed (no arrayBuffer).`), r(new Uint8Array(l)), u && nt();
      }, (l) => {
        if (n)
          n();
        else
          throw `Loading data file "${t}" failed.`;
      }), u && Ne();
    }, Sr = i.preloadPlugins || [];
    function Ar(t, r, n, o) {
      typeof Browser < "u" && Browser.init();
      var u = !1;
      return Sr.forEach(function(l) {
        u || l.canHandle(r) && (l.handle(t, r, n, o), u = !0);
      }), u;
    }
    function Jr(t, r, n, o, u, l, f, d, w, g) {
      var S = r ? ye.resolve(G.join2(t, r)) : t;
      function F(A) {
        function C(M) {
          g && g(), d || s.createDataFile(t, r, M, o, u, w), l && l(), nt();
        }
        Ar(A, S, C, () => {
          f && f(), nt();
        }) || C(A);
      }
      Ne(), typeof n == "string" ? Cr(n, (A) => F(A), f) : F(n);
    }
    function en(t) {
      var r = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }, n = r[t];
      if (typeof n > "u")
        throw new Error(`Unknown file open mode: ${t}`);
      return n;
    }
    function Ye(t, r) {
      var n = 0;
      return t && (n |= 365), r && (n |= 146), n;
    }
    var s = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: !1, ignorePermissions: !0, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, lookupPath: (t, r = {}) => {
      if (t = ye.resolve(t), !t)
        return { path: "", node: null };
      var n = { follow_mount: !0, recurse_count: 0 };
      if (r = Object.assign(n, r), r.recurse_count > 8)
        throw new s.ErrnoError(32);
      for (var o = t.split("/").filter((F) => !!F), u = s.root, l = "/", f = 0; f < o.length; f++) {
        var d = f === o.length - 1;
        if (d && r.parent)
          break;
        if (u = s.lookupNode(u, o[f]), l = G.join2(l, o[f]), s.isMountpoint(u) && (!d || d && r.follow_mount) && (u = u.mounted.root), !d || r.follow)
          for (var w = 0; s.isLink(u.mode); ) {
            var g = s.readlink(l);
            l = ye.resolve(G.dirname(l), g);
            var S = s.lookupPath(l, { recurse_count: r.recurse_count + 1 });
            if (u = S.node, w++ > 40)
              throw new s.ErrnoError(32);
          }
      }
      return { path: l, node: u };
    }, getPath: (t) => {
      for (var r; ; ) {
        if (s.isRoot(t)) {
          var n = t.mount.mountpoint;
          return r ? n[n.length - 1] !== "/" ? `${n}/${r}` : n + r : n;
        }
        r = r ? `${t.name}/${r}` : t.name, t = t.parent;
      }
    }, hashName: (t, r) => {
      for (var n = 0, o = 0; o < r.length; o++)
        n = (n << 5) - n + r.charCodeAt(o) | 0;
      return (t + n >>> 0) % s.nameTable.length;
    }, hashAddNode: (t) => {
      var r = s.hashName(t.parent.id, t.name);
      t.name_next = s.nameTable[r], s.nameTable[r] = t;
    }, hashRemoveNode: (t) => {
      var r = s.hashName(t.parent.id, t.name);
      if (s.nameTable[r] === t)
        s.nameTable[r] = t.name_next;
      else
        for (var n = s.nameTable[r]; n; ) {
          if (n.name_next === t) {
            n.name_next = t.name_next;
            break;
          }
          n = n.name_next;
        }
    }, lookupNode: (t, r) => {
      var n = s.mayLookup(t);
      if (n)
        throw new s.ErrnoError(n, t);
      for (var o = s.hashName(t.id, r), u = s.nameTable[o]; u; u = u.name_next) {
        var l = u.name;
        if (u.parent.id === t.id && l === r)
          return u;
      }
      return s.lookup(t, r);
    }, createNode: (t, r, n, o) => {
      var u = new s.FSNode(t, r, n, o);
      return s.hashAddNode(u), u;
    }, destroyNode: (t) => {
      s.hashRemoveNode(t);
    }, isRoot: (t) => t === t.parent, isMountpoint: (t) => !!t.mounted, isFile: (t) => (t & 61440) === 32768, isDir: (t) => (t & 61440) === 16384, isLink: (t) => (t & 61440) === 40960, isChrdev: (t) => (t & 61440) === 8192, isBlkdev: (t) => (t & 61440) === 24576, isFIFO: (t) => (t & 61440) === 4096, isSocket: (t) => (t & 49152) === 49152, flagsToPermissionString: (t) => {
      var r = ["r", "w", "rw"][t & 3];
      return t & 512 && (r += "w"), r;
    }, nodePermissions: (t, r) => s.ignorePermissions ? 0 : r.includes("r") && !(t.mode & 292) || r.includes("w") && !(t.mode & 146) || r.includes("x") && !(t.mode & 73) ? 2 : 0, mayLookup: (t) => {
      var r = s.nodePermissions(t, "x");
      return r || (t.node_ops.lookup ? 0 : 2);
    }, mayCreate: (t, r) => {
      try {
        var n = s.lookupNode(t, r);
        return 20;
      } catch {
      }
      return s.nodePermissions(t, "wx");
    }, mayDelete: (t, r, n) => {
      var o;
      try {
        o = s.lookupNode(t, r);
      } catch (l) {
        return l.errno;
      }
      var u = s.nodePermissions(t, "wx");
      if (u)
        return u;
      if (n) {
        if (!s.isDir(o.mode))
          return 54;
        if (s.isRoot(o) || s.getPath(o) === s.cwd())
          return 10;
      } else if (s.isDir(o.mode))
        return 31;
      return 0;
    }, mayOpen: (t, r) => t ? s.isLink(t.mode) ? 32 : s.isDir(t.mode) && (s.flagsToPermissionString(r) !== "r" || r & 512) ? 31 : s.nodePermissions(t, s.flagsToPermissionString(r)) : 44, MAX_OPEN_FDS: 4096, nextfd: () => {
      for (var t = 0; t <= s.MAX_OPEN_FDS; t++)
        if (!s.streams[t])
          return t;
      throw new s.ErrnoError(33);
    }, getStreamChecked: (t) => {
      var r = s.getStream(t);
      if (!r)
        throw new s.ErrnoError(8);
      return r;
    }, getStream: (t) => s.streams[t], createStream: (t, r = -1) => (s.FSStream || (s.FSStream = function() {
      this.shared = {};
    }, s.FSStream.prototype = {}, Object.defineProperties(s.FSStream.prototype, { object: { get() {
      return this.node;
    }, set(n) {
      this.node = n;
    } }, isRead: { get() {
      return (this.flags & 2097155) !== 1;
    } }, isWrite: { get() {
      return (this.flags & 2097155) !== 0;
    } }, isAppend: { get() {
      return this.flags & 1024;
    } }, flags: { get() {
      return this.shared.flags;
    }, set(n) {
      this.shared.flags = n;
    } }, position: { get() {
      return this.shared.position;
    }, set(n) {
      this.shared.position = n;
    } } })), t = Object.assign(new s.FSStream(), t), r == -1 && (r = s.nextfd()), t.fd = r, s.streams[r] = t, t), closeStream: (t) => {
      s.streams[t] = null;
    }, chrdev_stream_ops: { open: (t) => {
      var r = s.getDevice(t.node.rdev);
      t.stream_ops = r.stream_ops, t.stream_ops.open && t.stream_ops.open(t);
    }, llseek: () => {
      throw new s.ErrnoError(70);
    } }, major: (t) => t >> 8, minor: (t) => t & 255, makedev: (t, r) => t << 8 | r, registerDevice: (t, r) => {
      s.devices[t] = { stream_ops: r };
    }, getDevice: (t) => s.devices[t], getMounts: (t) => {
      for (var r = [], n = [t]; n.length; ) {
        var o = n.pop();
        r.push(o), n.push.apply(n, o.mounts);
      }
      return r;
    }, syncfs: (t, r) => {
      typeof t == "function" && (r = t, t = !1), s.syncFSRequests++, s.syncFSRequests > 1 && te(`warning: ${s.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
      var n = s.getMounts(s.root.mount), o = 0;
      function u(f) {
        return s.syncFSRequests--, r(f);
      }
      function l(f) {
        if (f)
          return l.errored ? void 0 : (l.errored = !0, u(f));
        ++o >= n.length && u(null);
      }
      n.forEach((f) => {
        if (!f.type.syncfs)
          return l(null);
        f.type.syncfs(f, t, l);
      });
    }, mount: (t, r, n) => {
      var o = n === "/", u = !n, l;
      if (o && s.root)
        throw new s.ErrnoError(10);
      if (!o && !u) {
        var f = s.lookupPath(n, { follow_mount: !1 });
        if (n = f.path, l = f.node, s.isMountpoint(l))
          throw new s.ErrnoError(10);
        if (!s.isDir(l.mode))
          throw new s.ErrnoError(54);
      }
      var d = { type: t, opts: r, mountpoint: n, mounts: [] }, w = t.mount(d);
      return w.mount = d, d.root = w, o ? s.root = w : l && (l.mounted = d, l.mount && l.mount.mounts.push(d)), w;
    }, unmount: (t) => {
      var r = s.lookupPath(t, { follow_mount: !1 });
      if (!s.isMountpoint(r.node))
        throw new s.ErrnoError(28);
      var n = r.node, o = n.mounted, u = s.getMounts(o);
      Object.keys(s.nameTable).forEach((f) => {
        for (var d = s.nameTable[f]; d; ) {
          var w = d.name_next;
          u.includes(d.mount) && s.destroyNode(d), d = w;
        }
      }), n.mounted = null;
      var l = n.mount.mounts.indexOf(o);
      n.mount.mounts.splice(l, 1);
    }, lookup: (t, r) => t.node_ops.lookup(t, r), mknod: (t, r, n) => {
      var o = s.lookupPath(t, { parent: !0 }), u = o.node, l = G.basename(t);
      if (!l || l === "." || l === "..")
        throw new s.ErrnoError(28);
      var f = s.mayCreate(u, l);
      if (f)
        throw new s.ErrnoError(f);
      if (!u.node_ops.mknod)
        throw new s.ErrnoError(63);
      return u.node_ops.mknod(u, l, r, n);
    }, create: (t, r) => (r = r !== void 0 ? r : 438, r &= 4095, r |= 32768, s.mknod(t, r, 0)), mkdir: (t, r) => (r = r !== void 0 ? r : 511, r &= 1023, r |= 16384, s.mknod(t, r, 0)), mkdirTree: (t, r) => {
      for (var n = t.split("/"), o = "", u = 0; u < n.length; ++u)
        if (n[u]) {
          o += "/" + n[u];
          try {
            s.mkdir(o, r);
          } catch (l) {
            if (l.errno != 20)
              throw l;
          }
        }
    }, mkdev: (t, r, n) => (typeof n > "u" && (n = r, r = 438), r |= 8192, s.mknod(t, r, n)), symlink: (t, r) => {
      if (!ye.resolve(t))
        throw new s.ErrnoError(44);
      var n = s.lookupPath(r, { parent: !0 }), o = n.node;
      if (!o)
        throw new s.ErrnoError(44);
      var u = G.basename(r), l = s.mayCreate(o, u);
      if (l)
        throw new s.ErrnoError(l);
      if (!o.node_ops.symlink)
        throw new s.ErrnoError(63);
      return o.node_ops.symlink(o, u, t);
    }, rename: (t, r) => {
      var n = G.dirname(t), o = G.dirname(r), u = G.basename(t), l = G.basename(r), f, d, w;
      if (f = s.lookupPath(t, { parent: !0 }), d = f.node, f = s.lookupPath(r, { parent: !0 }), w = f.node, !d || !w)
        throw new s.ErrnoError(44);
      if (d.mount !== w.mount)
        throw new s.ErrnoError(75);
      var g = s.lookupNode(d, u), S = ye.relative(t, o);
      if (S.charAt(0) !== ".")
        throw new s.ErrnoError(28);
      if (S = ye.relative(r, n), S.charAt(0) !== ".")
        throw new s.ErrnoError(55);
      var F;
      try {
        F = s.lookupNode(w, l);
      } catch {
      }
      if (g !== F) {
        var A = s.isDir(g.mode), C = s.mayDelete(d, u, A);
        if (C)
          throw new s.ErrnoError(C);
        if (C = F ? s.mayDelete(w, l, A) : s.mayCreate(w, l), C)
          throw new s.ErrnoError(C);
        if (!d.node_ops.rename)
          throw new s.ErrnoError(63);
        if (s.isMountpoint(g) || F && s.isMountpoint(F))
          throw new s.ErrnoError(10);
        if (w !== d && (C = s.nodePermissions(d, "w"), C))
          throw new s.ErrnoError(C);
        s.hashRemoveNode(g);
        try {
          d.node_ops.rename(g, w, l);
        } catch (M) {
          throw M;
        } finally {
          s.hashAddNode(g);
        }
      }
    }, rmdir: (t) => {
      var r = s.lookupPath(t, { parent: !0 }), n = r.node, o = G.basename(t), u = s.lookupNode(n, o), l = s.mayDelete(n, o, !0);
      if (l)
        throw new s.ErrnoError(l);
      if (!n.node_ops.rmdir)
        throw new s.ErrnoError(63);
      if (s.isMountpoint(u))
        throw new s.ErrnoError(10);
      n.node_ops.rmdir(n, o), s.destroyNode(u);
    }, readdir: (t) => {
      var r = s.lookupPath(t, { follow: !0 }), n = r.node;
      if (!n.node_ops.readdir)
        throw new s.ErrnoError(54);
      return n.node_ops.readdir(n);
    }, unlink: (t) => {
      var r = s.lookupPath(t, { parent: !0 }), n = r.node;
      if (!n)
        throw new s.ErrnoError(44);
      var o = G.basename(t), u = s.lookupNode(n, o), l = s.mayDelete(n, o, !1);
      if (l)
        throw new s.ErrnoError(l);
      if (!n.node_ops.unlink)
        throw new s.ErrnoError(63);
      if (s.isMountpoint(u))
        throw new s.ErrnoError(10);
      n.node_ops.unlink(n, o), s.destroyNode(u);
    }, readlink: (t) => {
      var r = s.lookupPath(t), n = r.node;
      if (!n)
        throw new s.ErrnoError(44);
      if (!n.node_ops.readlink)
        throw new s.ErrnoError(28);
      return ye.resolve(s.getPath(n.parent), n.node_ops.readlink(n));
    }, stat: (t, r) => {
      var n = s.lookupPath(t, { follow: !r }), o = n.node;
      if (!o)
        throw new s.ErrnoError(44);
      if (!o.node_ops.getattr)
        throw new s.ErrnoError(63);
      return o.node_ops.getattr(o);
    }, lstat: (t) => s.stat(t, !0), chmod: (t, r, n) => {
      var o;
      if (typeof t == "string") {
        var u = s.lookupPath(t, { follow: !n });
        o = u.node;
      } else
        o = t;
      if (!o.node_ops.setattr)
        throw new s.ErrnoError(63);
      o.node_ops.setattr(o, { mode: r & 4095 | o.mode & -4096, timestamp: Date.now() });
    }, lchmod: (t, r) => {
      s.chmod(t, r, !0);
    }, fchmod: (t, r) => {
      var n = s.getStreamChecked(t);
      s.chmod(n.node, r);
    }, chown: (t, r, n, o) => {
      var u;
      if (typeof t == "string") {
        var l = s.lookupPath(t, { follow: !o });
        u = l.node;
      } else
        u = t;
      if (!u.node_ops.setattr)
        throw new s.ErrnoError(63);
      u.node_ops.setattr(u, { timestamp: Date.now() });
    }, lchown: (t, r, n) => {
      s.chown(t, r, n, !0);
    }, fchown: (t, r, n) => {
      var o = s.getStreamChecked(t);
      s.chown(o.node, r, n);
    }, truncate: (t, r) => {
      if (r < 0)
        throw new s.ErrnoError(28);
      var n;
      if (typeof t == "string") {
        var o = s.lookupPath(t, { follow: !0 });
        n = o.node;
      } else
        n = t;
      if (!n.node_ops.setattr)
        throw new s.ErrnoError(63);
      if (s.isDir(n.mode))
        throw new s.ErrnoError(31);
      if (!s.isFile(n.mode))
        throw new s.ErrnoError(28);
      var u = s.nodePermissions(n, "w");
      if (u)
        throw new s.ErrnoError(u);
      n.node_ops.setattr(n, { size: r, timestamp: Date.now() });
    }, ftruncate: (t, r) => {
      var n = s.getStreamChecked(t);
      if (!(n.flags & 2097155))
        throw new s.ErrnoError(28);
      s.truncate(n.node, r);
    }, utime: (t, r, n) => {
      var o = s.lookupPath(t, { follow: !0 }), u = o.node;
      u.node_ops.setattr(u, { timestamp: Math.max(r, n) });
    }, open: (t, r, n) => {
      if (t === "")
        throw new s.ErrnoError(44);
      r = typeof r == "string" ? en(r) : r, n = typeof n > "u" ? 438 : n, r & 64 ? n = n & 4095 | 32768 : n = 0;
      var o;
      if (typeof t == "object")
        o = t;
      else {
        t = G.normalize(t);
        try {
          var u = s.lookupPath(t, { follow: !(r & 131072) });
          o = u.node;
        } catch {
        }
      }
      var l = !1;
      if (r & 64)
        if (o) {
          if (r & 128)
            throw new s.ErrnoError(20);
        } else
          o = s.mknod(t, n, 0), l = !0;
      if (!o)
        throw new s.ErrnoError(44);
      if (s.isChrdev(o.mode) && (r &= -513), r & 65536 && !s.isDir(o.mode))
        throw new s.ErrnoError(54);
      if (!l) {
        var f = s.mayOpen(o, r);
        if (f)
          throw new s.ErrnoError(f);
      }
      r & 512 && !l && s.truncate(o, 0), r &= -131713;
      var d = s.createStream({ node: o, path: s.getPath(o), flags: r, seekable: !0, position: 0, stream_ops: o.stream_ops, ungotten: [], error: !1 });
      return d.stream_ops.open && d.stream_ops.open(d), i.logReadFiles && !(r & 1) && (s.readFiles || (s.readFiles = {}), t in s.readFiles || (s.readFiles[t] = 1)), d;
    }, close: (t) => {
      if (s.isClosed(t))
        throw new s.ErrnoError(8);
      t.getdents && (t.getdents = null);
      try {
        t.stream_ops.close && t.stream_ops.close(t);
      } catch (r) {
        throw r;
      } finally {
        s.closeStream(t.fd);
      }
      t.fd = null;
    }, isClosed: (t) => t.fd === null, llseek: (t, r, n) => {
      if (s.isClosed(t))
        throw new s.ErrnoError(8);
      if (!t.seekable || !t.stream_ops.llseek)
        throw new s.ErrnoError(70);
      if (n != 0 && n != 1 && n != 2)
        throw new s.ErrnoError(28);
      return t.position = t.stream_ops.llseek(t, r, n), t.ungotten = [], t.position;
    }, read: (t, r, n, o, u) => {
      if (o < 0 || u < 0)
        throw new s.ErrnoError(28);
      if (s.isClosed(t))
        throw new s.ErrnoError(8);
      if ((t.flags & 2097155) === 1)
        throw new s.ErrnoError(8);
      if (s.isDir(t.node.mode))
        throw new s.ErrnoError(31);
      if (!t.stream_ops.read)
        throw new s.ErrnoError(28);
      var l = typeof u < "u";
      if (!l)
        u = t.position;
      else if (!t.seekable)
        throw new s.ErrnoError(70);
      var f = t.stream_ops.read(t, r, n, o, u);
      return l || (t.position += f), f;
    }, write: (t, r, n, o, u, l) => {
      if (o < 0 || u < 0)
        throw new s.ErrnoError(28);
      if (s.isClosed(t))
        throw new s.ErrnoError(8);
      if (!(t.flags & 2097155))
        throw new s.ErrnoError(8);
      if (s.isDir(t.node.mode))
        throw new s.ErrnoError(31);
      if (!t.stream_ops.write)
        throw new s.ErrnoError(28);
      t.seekable && t.flags & 1024 && s.llseek(t, 0, 2);
      var f = typeof u < "u";
      if (!f)
        u = t.position;
      else if (!t.seekable)
        throw new s.ErrnoError(70);
      var d = t.stream_ops.write(t, r, n, o, u, l);
      return f || (t.position += d), d;
    }, allocate: (t, r, n) => {
      if (s.isClosed(t))
        throw new s.ErrnoError(8);
      if (r < 0 || n <= 0)
        throw new s.ErrnoError(28);
      if (!(t.flags & 2097155))
        throw new s.ErrnoError(8);
      if (!s.isFile(t.node.mode) && !s.isDir(t.node.mode))
        throw new s.ErrnoError(43);
      if (!t.stream_ops.allocate)
        throw new s.ErrnoError(138);
      t.stream_ops.allocate(t, r, n);
    }, mmap: (t, r, n, o, u) => {
      if (o & 2 && !(u & 2) && (t.flags & 2097155) !== 2)
        throw new s.ErrnoError(2);
      if ((t.flags & 2097155) === 1)
        throw new s.ErrnoError(2);
      if (!t.stream_ops.mmap)
        throw new s.ErrnoError(43);
      return t.stream_ops.mmap(t, r, n, o, u);
    }, msync: (t, r, n, o, u) => t.stream_ops.msync ? t.stream_ops.msync(t, r, n, o, u) : 0, munmap: (t) => 0, ioctl: (t, r, n) => {
      if (!t.stream_ops.ioctl)
        throw new s.ErrnoError(59);
      return t.stream_ops.ioctl(t, r, n);
    }, readFile: (t, r = {}) => {
      if (r.flags = r.flags || 0, r.encoding = r.encoding || "binary", r.encoding !== "utf8" && r.encoding !== "binary")
        throw new Error(`Invalid encoding type "${r.encoding}"`);
      var n, o = s.open(t, r.flags), u = s.stat(t), l = u.size, f = new Uint8Array(l);
      return s.read(o, f, 0, l, 0), r.encoding === "utf8" ? n = Le(f, 0) : r.encoding === "binary" && (n = f), s.close(o), n;
    }, writeFile: (t, r, n = {}) => {
      n.flags = n.flags || 577;
      var o = s.open(t, n.flags, n.mode);
      if (typeof r == "string") {
        var u = new Uint8Array(Tt(r) + 1), l = kt(r, u, 0, u.length);
        s.write(o, u, 0, l, void 0, n.canOwn);
      } else if (ArrayBuffer.isView(r))
        s.write(o, r, 0, r.byteLength, void 0, n.canOwn);
      else
        throw new Error("Unsupported data type");
      s.close(o);
    }, cwd: () => s.currentPath, chdir: (t) => {
      var r = s.lookupPath(t, { follow: !0 });
      if (r.node === null)
        throw new s.ErrnoError(44);
      if (!s.isDir(r.node.mode))
        throw new s.ErrnoError(54);
      var n = s.nodePermissions(r.node, "x");
      if (n)
        throw new s.ErrnoError(n);
      s.currentPath = r.path;
    }, createDefaultDirectories: () => {
      s.mkdir("/tmp"), s.mkdir("/home"), s.mkdir("/home/web_user");
    }, createDefaultDevices: () => {
      s.mkdir("/dev"), s.registerDevice(s.makedev(1, 3), { read: () => 0, write: (o, u, l, f, d) => f }), s.mkdev("/dev/null", s.makedev(1, 3)), ke.register(s.makedev(5, 0), ke.default_tty_ops), ke.register(s.makedev(6, 0), ke.default_tty1_ops), s.mkdev("/dev/tty", s.makedev(5, 0)), s.mkdev("/dev/tty1", s.makedev(6, 0));
      var t = new Uint8Array(1024), r = 0, n = () => (r === 0 && (r = Vt(t).byteLength), t[--r]);
      s.createDevice("/dev", "random", n), s.createDevice("/dev", "urandom", n), s.mkdir("/dev/shm"), s.mkdir("/dev/shm/tmp");
    }, createSpecialDirectories: () => {
      s.mkdir("/proc");
      var t = s.mkdir("/proc/self");
      s.mkdir("/proc/self/fd"), s.mount({ mount: () => {
        var r = s.createNode(t, "fd", 16895, 73);
        return r.node_ops = { lookup: (n, o) => {
          var u = +o, l = s.getStreamChecked(u), f = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => l.path } };
          return f.parent = f, f;
        } }, r;
      } }, {}, "/proc/self/fd");
    }, createStandardStreams: () => {
      i.stdin ? s.createDevice("/dev", "stdin", i.stdin) : s.symlink("/dev/tty", "/dev/stdin"), i.stdout ? s.createDevice("/dev", "stdout", null, i.stdout) : s.symlink("/dev/tty", "/dev/stdout"), i.stderr ? s.createDevice("/dev", "stderr", null, i.stderr) : s.symlink("/dev/tty1", "/dev/stderr"), s.open("/dev/stdin", 0), s.open("/dev/stdout", 1), s.open("/dev/stderr", 1);
    }, ensureErrnoError: () => {
      s.ErrnoError || (s.ErrnoError = function(r, n) {
        this.name = "ErrnoError", this.node = n, this.setErrno = function(o) {
          this.errno = o;
        }, this.setErrno(r), this.message = "FS error";
      }, s.ErrnoError.prototype = new Error(), s.ErrnoError.prototype.constructor = s.ErrnoError, [44].forEach((t) => {
        s.genericErrors[t] = new s.ErrnoError(t), s.genericErrors[t].stack = "<generic error, no stack>";
      }));
    }, staticInit: () => {
      s.ensureErrnoError(), s.nameTable = new Array(4096), s.mount(L, {}, "/"), s.createDefaultDirectories(), s.createDefaultDevices(), s.createSpecialDirectories(), s.filesystems = { MEMFS: L };
    }, init: (t, r, n) => {
      s.init.initialized = !0, s.ensureErrnoError(), i.stdin = t || i.stdin, i.stdout = r || i.stdout, i.stderr = n || i.stderr, s.createStandardStreams();
    }, quit: () => {
      s.init.initialized = !1;
      for (var t = 0; t < s.streams.length; t++) {
        var r = s.streams[t];
        r && s.close(r);
      }
    }, findObject: (t, r) => {
      var n = s.analyzePath(t, r);
      return n.exists ? n.object : null;
    }, analyzePath: (t, r) => {
      try {
        var n = s.lookupPath(t, { follow: !r });
        t = n.path;
      } catch {
      }
      var o = { isRoot: !1, exists: !1, error: 0, name: null, path: null, object: null, parentExists: !1, parentPath: null, parentObject: null };
      try {
        var n = s.lookupPath(t, { parent: !0 });
        o.parentExists = !0, o.parentPath = n.path, o.parentObject = n.node, o.name = G.basename(t), n = s.lookupPath(t, { follow: !r }), o.exists = !0, o.path = n.path, o.object = n.node, o.name = n.node.name, o.isRoot = n.path === "/";
      } catch (u) {
        o.error = u.errno;
      }
      return o;
    }, createPath: (t, r, n, o) => {
      t = typeof t == "string" ? t : s.getPath(t);
      for (var u = r.split("/").reverse(); u.length; ) {
        var l = u.pop();
        if (l) {
          var f = G.join2(t, l);
          try {
            s.mkdir(f);
          } catch {
          }
          t = f;
        }
      }
      return f;
    }, createFile: (t, r, n, o, u) => {
      var l = G.join2(typeof t == "string" ? t : s.getPath(t), r), f = Ye(o, u);
      return s.create(l, f);
    }, createDataFile: (t, r, n, o, u, l) => {
      var f = r;
      t && (t = typeof t == "string" ? t : s.getPath(t), f = r ? G.join2(t, r) : t);
      var d = Ye(o, u), w = s.create(f, d);
      if (n) {
        if (typeof n == "string") {
          for (var g = new Array(n.length), S = 0, F = n.length; S < F; ++S)
            g[S] = n.charCodeAt(S);
          n = g;
        }
        s.chmod(w, d | 146);
        var A = s.open(w, 577);
        s.write(A, n, 0, n.length, 0, l), s.close(A), s.chmod(w, d);
      }
      return w;
    }, createDevice: (t, r, n, o) => {
      var u = G.join2(typeof t == "string" ? t : s.getPath(t), r), l = Ye(!!n, !!o);
      s.createDevice.major || (s.createDevice.major = 64);
      var f = s.makedev(s.createDevice.major++, 0);
      return s.registerDevice(f, { open: (d) => {
        d.seekable = !1;
      }, close: (d) => {
        o && o.buffer && o.buffer.length && o(10);
      }, read: (d, w, g, S, F) => {
        for (var A = 0, C = 0; C < S; C++) {
          var M;
          try {
            M = n();
          } catch {
            throw new s.ErrnoError(29);
          }
          if (M === void 0 && A === 0)
            throw new s.ErrnoError(6);
          if (M == null)
            break;
          A++, w[g + C] = M;
        }
        return A && (d.node.timestamp = Date.now()), A;
      }, write: (d, w, g, S, F) => {
        for (var A = 0; A < S; A++)
          try {
            o(w[g + A]);
          } catch {
            throw new s.ErrnoError(29);
          }
        return S && (d.node.timestamp = Date.now()), A;
      } }), s.mkdev(u, l, f);
    }, forceLoadFile: (t) => {
      if (t.isDevice || t.isFolder || t.link || t.contents)
        return !0;
      if (typeof XMLHttpRequest < "u")
        throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
      if (k)
        try {
          t.contents = Ct(k(t.url), !0), t.usedBytes = t.contents.length;
        } catch {
          throw new s.ErrnoError(29);
        }
      else
        throw new Error("Cannot load without read() or XMLHttpRequest.");
    }, createLazyFile: (t, r, n, o, u) => {
      function l() {
        this.lengthKnown = !1, this.chunks = [];
      }
      if (l.prototype.get = function(C) {
        if (!(C > this.length - 1 || C < 0)) {
          var M = C % this.chunkSize, Z = C / this.chunkSize | 0;
          return this.getter(Z)[M];
        }
      }, l.prototype.setDataGetter = function(C) {
        this.getter = C;
      }, l.prototype.cacheLength = function() {
        var C = new XMLHttpRequest();
        if (C.open("HEAD", n, !1), C.send(null), !(C.status >= 200 && C.status < 300 || C.status === 304))
          throw new Error("Couldn't load " + n + ". Status: " + C.status);
        var M = Number(C.getResponseHeader("Content-length")), Z, J = (Z = C.getResponseHeader("Accept-Ranges")) && Z === "bytes", oe = (Z = C.getResponseHeader("Content-Encoding")) && Z === "gzip", he = 1024 * 1024;
        J || (he = M);
        var ee = (ve, Se) => {
          if (ve > Se)
            throw new Error("invalid range (" + ve + ", " + Se + ") or no bytes requested!");
          if (Se > M - 1)
            throw new Error("only " + M + " bytes available! programmer error!");
          var se = new XMLHttpRequest();
          if (se.open("GET", n, !1), M !== he && se.setRequestHeader("Range", "bytes=" + ve + "-" + Se), se.responseType = "arraybuffer", se.overrideMimeType && se.overrideMimeType("text/plain; charset=x-user-defined"), se.send(null), !(se.status >= 200 && se.status < 300 || se.status === 304))
            throw new Error("Couldn't load " + n + ". Status: " + se.status);
          return se.response !== void 0 ? new Uint8Array(se.response || []) : Ct(se.responseText || "", !0);
        }, We = this;
        We.setDataGetter((ve) => {
          var Se = ve * he, se = (ve + 1) * he - 1;
          if (se = Math.min(se, M - 1), typeof We.chunks[ve] > "u" && (We.chunks[ve] = ee(Se, se)), typeof We.chunks[ve] > "u")
            throw new Error("doXHR failed!");
          return We.chunks[ve];
        }), (oe || !M) && (he = M = 1, M = this.getter(0).length, he = M, W("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = M, this._chunkSize = he, this.lengthKnown = !0;
      }, typeof XMLHttpRequest < "u") {
        if (!y)
          throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
        var f = new l();
        Object.defineProperties(f, { length: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._length;
        } }, chunkSize: { get: function() {
          return this.lengthKnown || this.cacheLength(), this._chunkSize;
        } } });
        var d = { isDevice: !1, contents: f };
      } else
        var d = { isDevice: !1, url: n };
      var w = s.createFile(t, r, d, o, u);
      d.contents ? w.contents = d.contents : d.url && (w.contents = null, w.url = d.url), Object.defineProperties(w, { usedBytes: { get: function() {
        return this.contents.length;
      } } });
      var g = {}, S = Object.keys(w.stream_ops);
      S.forEach((A) => {
        var C = w.stream_ops[A];
        g[A] = function() {
          return s.forceLoadFile(w), C.apply(null, arguments);
        };
      });
      function F(A, C, M, Z, J) {
        var oe = A.node.contents;
        if (J >= oe.length)
          return 0;
        var he = Math.min(oe.length - J, Z);
        if (oe.slice)
          for (var ee = 0; ee < he; ee++)
            C[M + ee] = oe[J + ee];
        else
          for (var ee = 0; ee < he; ee++)
            C[M + ee] = oe.get(J + ee);
        return he;
      }
      return g.read = (A, C, M, Z, J) => (s.forceLoadFile(w), F(A, C, M, Z, J)), g.mmap = (A, C, M, Z, J) => {
        s.forceLoadFile(w);
        var oe = Nt();
        if (!oe)
          throw new s.ErrnoError(48);
        return F(A, ne, oe, C, M), { ptr: oe, allocated: !0 };
      }, w.stream_ops = g, w;
    } }, ct = (t, r) => t ? Le(K, t, r) : "", ue = { DEFAULT_POLLMASK: 5, calculateAt: function(t, r, n) {
      if (G.isAbs(r))
        return r;
      var o;
      if (t === -100)
        o = s.cwd();
      else {
        var u = ue.getStreamFromFD(t);
        o = u.path;
      }
      if (r.length == 0) {
        if (!n)
          throw new s.ErrnoError(44);
        return o;
      }
      return G.join2(o, r);
    }, doStat: function(t, r, n) {
      try {
        var o = t(r);
      } catch (d) {
        if (d && d.node && G.normalize(r) !== G.normalize(s.getPath(d.node)))
          return -54;
        throw d;
      }
      V[n >> 2] = o.dev, V[n + 4 >> 2] = o.mode, X[n + 8 >> 2] = o.nlink, V[n + 12 >> 2] = o.uid, V[n + 16 >> 2] = o.gid, V[n + 20 >> 2] = o.rdev, Y = [o.size >>> 0, (U = o.size, +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[n + 24 >> 2] = Y[0], V[n + 28 >> 2] = Y[1], V[n + 32 >> 2] = 4096, V[n + 36 >> 2] = o.blocks;
      var u = o.atime.getTime(), l = o.mtime.getTime(), f = o.ctime.getTime();
      return Y = [Math.floor(u / 1e3) >>> 0, (U = Math.floor(u / 1e3), +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[n + 40 >> 2] = Y[0], V[n + 44 >> 2] = Y[1], X[n + 48 >> 2] = u % 1e3 * 1e3, Y = [Math.floor(l / 1e3) >>> 0, (U = Math.floor(l / 1e3), +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[n + 56 >> 2] = Y[0], V[n + 60 >> 2] = Y[1], X[n + 64 >> 2] = l % 1e3 * 1e3, Y = [Math.floor(f / 1e3) >>> 0, (U = Math.floor(f / 1e3), +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[n + 72 >> 2] = Y[0], V[n + 76 >> 2] = Y[1], X[n + 80 >> 2] = f % 1e3 * 1e3, Y = [o.ino >>> 0, (U = o.ino, +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[n + 88 >> 2] = Y[0], V[n + 92 >> 2] = Y[1], 0;
    }, doMsync: function(t, r, n, o, u) {
      if (!s.isFile(r.node.mode))
        throw new s.ErrnoError(43);
      if (o & 2)
        return 0;
      var l = K.slice(t, t + n);
      s.msync(r, l, u, n, o);
    }, varargs: void 0, get() {
      ue.varargs += 4;
      var t = V[ue.varargs - 4 >> 2];
      return t;
    }, getStr(t) {
      var r = ct(t);
      return r;
    }, getStreamFromFD: function(t) {
      var r = s.getStreamChecked(t);
      return r;
    } };
    function tn(t, r, n) {
      ue.varargs = n;
      try {
        var o = ue.getStreamFromFD(t);
        switch (r) {
          case 0: {
            var u = ue.get();
            if (u < 0)
              return -28;
            var l;
            return l = s.createStream(o, u), l.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return o.flags;
          case 4: {
            var u = ue.get();
            return o.flags |= u, 0;
          }
          case 5: {
            var u = ue.get(), f = 0;
            return $e[u + f >> 1] = 2, 0;
          }
          case 6:
          case 7:
            return 0;
          case 16:
          case 8:
            return -28;
          case 9:
            return Wt(28), -1;
          default:
            return -28;
        }
      } catch (d) {
        if (typeof s > "u" || d.name !== "ErrnoError")
          throw d;
        return -d.errno;
      }
    }
    function St(t, r, n, o) {
      ue.varargs = o;
      try {
        r = ue.getStr(r), r = ue.calculateAt(t, r);
        var u = o ? ue.get() : 0;
        return s.open(r, n, u).fd;
      } catch (l) {
        if (typeof s > "u" || l.name !== "ErrnoError")
          throw l;
        return -l.errno;
      }
    }
    function rn(t, r, n, o, u) {
    }
    function At(t) {
      switch (t) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError(`Unknown type size: ${t}`);
      }
    }
    function qt() {
      for (var t = new Array(256), r = 0; r < 256; ++r)
        t[r] = String.fromCharCode(r);
      sr = t;
    }
    var sr = void 0;
    function de(t) {
      for (var r = "", n = t; K[n]; )
        r += sr[K[n++]];
      return r;
    }
    var je = {}, Ue = {}, dt = {}, He = void 0;
    function N(t) {
      throw new He(t);
    }
    var qe = void 0;
    function ft(t) {
      throw new qe(t);
    }
    function Ze(t, r, n) {
      t.forEach(function(d) {
        dt[d] = r;
      });
      function o(d) {
        var w = n(d);
        w.length !== t.length && ft("Mismatched type converter count");
        for (var g = 0; g < t.length; ++g)
          we(t[g], w[g]);
      }
      var u = new Array(r.length), l = [], f = 0;
      r.forEach((d, w) => {
        Ue.hasOwnProperty(d) ? u[w] = Ue[d] : (l.push(d), je.hasOwnProperty(d) || (je[d] = []), je[d].push(() => {
          u[w] = Ue[d], ++f, f === l.length && o(u);
        }));
      }), l.length === 0 && o(u);
    }
    function Gt(t, r, n = {}) {
      var o = r.name;
      if (t || N(`type "${o}" must have a positive integer typeid pointer`), Ue.hasOwnProperty(t)) {
        if (n.ignoreDuplicateRegistrations)
          return;
        N(`Cannot register type '${o}' twice`);
      }
      if (Ue[t] = r, delete dt[t], je.hasOwnProperty(t)) {
        var u = je[t];
        delete je[t], u.forEach((l) => l());
      }
    }
    function we(t, r, n = {}) {
      if (!("argPackAdvance" in r))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      return Gt(t, r, n);
    }
    function Dr(t, r, n, o, u) {
      var l = At(n);
      r = de(r), we(t, { name: r, fromWireType: function(f) {
        return !!f;
      }, toWireType: function(f, d) {
        return d ? o : u;
      }, argPackAdvance: 8, readValueFromPointer: function(f) {
        var d;
        if (n === 1)
          d = ne;
        else if (n === 2)
          d = $e;
        else if (n === 4)
          d = V;
        else
          throw new TypeError("Unknown boolean type size: " + r);
        return this.fromWireType(d[f >> l]);
      }, destructorFunction: null });
    }
    function nn(t) {
      if (!(this instanceof Te) || !(t instanceof Te))
        return !1;
      for (var r = this.$$.ptrType.registeredClass, n = this.$$.ptr, o = t.$$.ptrType.registeredClass, u = t.$$.ptr; r.baseClass; )
        n = r.upcast(n), r = r.baseClass;
      for (; o.baseClass; )
        u = o.upcast(u), o = o.baseClass;
      return r === o && n === u;
    }
    function on(t) {
      return { count: t.count, deleteScheduled: t.deleteScheduled, preservePointerOnDelete: t.preservePointerOnDelete, ptr: t.ptr, ptrType: t.ptrType, smartPtr: t.smartPtr, smartPtrType: t.smartPtrType };
    }
    function ht(t) {
      function r(n) {
        return n.$$.ptrType.registeredClass.name;
      }
      N(r(t) + " instance already deleted");
    }
    var Dt = !1;
    function ar(t) {
    }
    function sn(t) {
      t.smartPtr ? t.smartPtrType.rawDestructor(t.smartPtr) : t.ptrType.registeredClass.rawDestructor(t.ptr);
    }
    function wt(t) {
      t.count.value -= 1;
      var r = t.count.value === 0;
      r && sn(t);
    }
    function ur(t, r, n) {
      if (r === n)
        return t;
      if (n.baseClass === void 0)
        return null;
      var o = ur(t, r, n.baseClass);
      return o === null ? null : n.downcast(o);
    }
    var lr = {};
    function an() {
      return Object.keys(et).length;
    }
    function un() {
      var t = [];
      for (var r in et)
        et.hasOwnProperty(r) && t.push(et[r]);
      return t;
    }
    var _e = [];
    function Ft() {
      for (; _e.length; ) {
        var t = _e.pop();
        t.$$.deleteScheduled = !1, t.delete();
      }
    }
    var Je = void 0;
    function Xt(t) {
      Je = t, _e.length && Je && Je(Ft);
    }
    function Fr() {
      i.getInheritedInstanceCount = an, i.getLiveInheritedInstances = un, i.flushPendingDeletes = Ft, i.setDelayFunction = Xt;
    }
    var et = {};
    function ln(t, r) {
      for (r === void 0 && N("ptr should not be undefined"); t.baseClass; )
        r = t.upcast(r), t = t.baseClass;
      return r;
    }
    function _t(t, r) {
      return r = ln(t, r), et[r];
    }
    function pt(t, r) {
      (!r.ptrType || !r.ptr) && ft("makeClassHandle requires ptr and ptrType");
      var n = !!r.smartPtrType, o = !!r.smartPtr;
      return n !== o && ft("Both smartPtrType and smartPtr must be specified"), r.count = { value: 1 }, Ge(Object.create(t, { $$: { value: r } }));
    }
    function Rr(t) {
      var r = this.getPointee(t);
      if (!r)
        return this.destructor(t), null;
      var n = _t(this.registeredClass, r);
      if (n !== void 0) {
        if (n.$$.count.value === 0)
          return n.$$.ptr = r, n.$$.smartPtr = t, n.clone();
        var o = n.clone();
        return this.destructor(t), o;
      }
      function u() {
        return this.isSmartPointer ? pt(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: r, smartPtrType: this, smartPtr: t }) : pt(this.registeredClass.instancePrototype, { ptrType: this, ptr: t });
      }
      var l = this.registeredClass.getActualType(r), f = lr[l];
      if (!f)
        return u.call(this);
      var d;
      this.isConst ? d = f.constPointerType : d = f.pointerType;
      var w = ur(r, this.registeredClass, d.registeredClass);
      return w === null ? u.call(this) : this.isSmartPointer ? pt(d.registeredClass.instancePrototype, { ptrType: d, ptr: w, smartPtrType: this, smartPtr: t }) : pt(d.registeredClass.instancePrototype, { ptrType: d, ptr: w });
    }
    var Ge = function(t) {
      return typeof FinalizationRegistry > "u" ? (Ge = (r) => r, t) : (Dt = new FinalizationRegistry((r) => {
        wt(r.$$);
      }), Ge = (r) => {
        var n = r.$$, o = !!n.smartPtr;
        if (o) {
          var u = { $$: n };
          Dt.register(r, u, r);
        }
        return r;
      }, ar = (r) => Dt.unregister(r), Ge(t));
    };
    function cr() {
      if (this.$$.ptr || ht(this), this.$$.preservePointerOnDelete)
        return this.$$.count.value += 1, this;
      var t = Ge(Object.create(Object.getPrototypeOf(this), { $$: { value: on(this.$$) } }));
      return t.$$.count.value += 1, t.$$.deleteScheduled = !1, t;
    }
    function cn() {
      this.$$.ptr || ht(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && N("Object already scheduled for deletion"), ar(this), wt(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
    }
    function xr() {
      return !this.$$.ptr;
    }
    function dn() {
      return this.$$.ptr || ht(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && N("Object already scheduled for deletion"), _e.push(this), _e.length === 1 && Je && Je(Ft), this.$$.deleteScheduled = !0, this;
    }
    function Ur() {
      Te.prototype.isAliasOf = nn, Te.prototype.clone = cr, Te.prototype.delete = cn, Te.prototype.isDeleted = xr, Te.prototype.deleteLater = dn;
    }
    function Te() {
    }
    var fn = 48, hn = 57;
    function vt(t) {
      if (t === void 0)
        return "_unknown";
      t = t.replace(/[^a-zA-Z0-9_]/g, "$");
      var r = t.charCodeAt(0);
      return r >= fn && r <= hn ? `_${t}` : t;
    }
    function Et(t, r) {
      return t = vt(t), { [t]: function() {
        return r.apply(this, arguments);
      } }[t];
    }
    function Be(t, r, n) {
      if (t[r].overloadTable === void 0) {
        var o = t[r];
        t[r] = function() {
          return t[r].overloadTable.hasOwnProperty(arguments.length) || N(`Function '${n}' called with an invalid number of arguments (${arguments.length}) - expects one of (${t[r].overloadTable})!`), t[r].overloadTable[arguments.length].apply(this, arguments);
        }, t[r].overloadTable = [], t[r].overloadTable[o.argCount] = o;
      }
    }
    function Br(t, r, n) {
      i.hasOwnProperty(t) ? ((n === void 0 || i[t].overloadTable !== void 0 && i[t].overloadTable[n] !== void 0) && N(`Cannot register public name '${t}' twice`), Be(i, t, t), i.hasOwnProperty(n) && N(`Cannot register multiple overloads of a function with the same number of arguments (${n})!`), i[t].overloadTable[n] = r) : (i[t] = r, n !== void 0 && (i[t].numArguments = n));
    }
    function pn(t, r, n, o, u, l, f, d) {
      this.name = t, this.constructor = r, this.instancePrototype = n, this.rawDestructor = o, this.baseClass = u, this.getActualType = l, this.upcast = f, this.downcast = d, this.pureVirtualFunctions = [];
    }
    function Rt(t, r, n) {
      for (; r !== n; )
        r.upcast || N(`Expected null or instance of ${n.name}, got an instance of ${r.name}`), t = r.upcast(t), r = r.baseClass;
      return t;
    }
    function Kt(t, r) {
      if (r === null)
        return this.isReference && N(`null is not a valid ${this.name}`), 0;
      r.$$ || N(`Cannot pass "${Ut(r)}" as a ${this.name}`), r.$$.ptr || N(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var n = r.$$.ptrType.registeredClass, o = Rt(r.$$.ptr, n, this.registeredClass);
      return o;
    }
    function vn(t, r) {
      var n;
      if (r === null)
        return this.isReference && N(`null is not a valid ${this.name}`), this.isSmartPointer ? (n = this.rawConstructor(), t !== null && t.push(this.rawDestructor, n), n) : 0;
      r.$$ || N(`Cannot pass "${Ut(r)}" as a ${this.name}`), r.$$.ptr || N(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && r.$$.ptrType.isConst && N(`Cannot convert argument of type ${r.$$.smartPtrType ? r.$$.smartPtrType.name : r.$$.ptrType.name} to parameter type ${this.name}`);
      var o = r.$$.ptrType.registeredClass;
      if (n = Rt(r.$$.ptr, o, this.registeredClass), this.isSmartPointer)
        switch (r.$$.smartPtr === void 0 && N("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            r.$$.smartPtrType === this ? n = r.$$.smartPtr : N(`Cannot convert argument of type ${r.$$.smartPtrType ? r.$$.smartPtrType.name : r.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            n = r.$$.smartPtr;
            break;
          case 2:
            if (r.$$.smartPtrType === this)
              n = r.$$.smartPtr;
            else {
              var u = r.clone();
              n = this.rawShare(n, gt.toHandle(function() {
                u.delete();
              })), t !== null && t.push(this.rawDestructor, n);
            }
            break;
          default:
            N("Unsupporting sharing policy");
        }
      return n;
    }
    function dr(t, r) {
      if (r === null)
        return this.isReference && N(`null is not a valid ${this.name}`), 0;
      r.$$ || N(`Cannot pass "${Ut(r)}" as a ${this.name}`), r.$$.ptr || N(`Cannot pass deleted object as a pointer of type ${this.name}`), r.$$.ptrType.isConst && N(`Cannot convert argument of type ${r.$$.ptrType.name} to parameter type ${this.name}`);
      var n = r.$$.ptrType.registeredClass, o = Rt(r.$$.ptr, n, this.registeredClass);
      return o;
    }
    function mt(t) {
      return this.fromWireType(V[t >> 2]);
    }
    function mn(t) {
      return this.rawGetPointee && (t = this.rawGetPointee(t)), t;
    }
    function gn(t) {
      this.rawDestructor && this.rawDestructor(t);
    }
    function yn(t) {
      t !== null && t.delete();
    }
    function wn() {
      Ee.prototype.getPointee = mn, Ee.prototype.destructor = gn, Ee.prototype.argPackAdvance = 8, Ee.prototype.readValueFromPointer = mt, Ee.prototype.deleteObject = yn, Ee.prototype.fromWireType = Rr;
    }
    function Ee(t, r, n, o, u, l, f, d, w, g, S) {
      this.name = t, this.registeredClass = r, this.isReference = n, this.isConst = o, this.isSmartPointer = u, this.pointeeType = l, this.sharingPolicy = f, this.rawGetPointee = d, this.rawConstructor = w, this.rawShare = g, this.rawDestructor = S, !u && r.baseClass === void 0 ? o ? (this.toWireType = Kt, this.destructorFunction = null) : (this.toWireType = dr, this.destructorFunction = null) : this.toWireType = vn;
    }
    function _n(t, r, n) {
      i.hasOwnProperty(t) || ft("Replacing nonexistant public symbol"), i[t].overloadTable !== void 0 && n !== void 0 ? i[t].overloadTable[n] = r : (i[t] = r, i[t].argCount = n);
    }
    var En = (t, r, n) => {
      var o = i["dynCall_" + t];
      return n && n.length ? o.apply(null, [r].concat(n)) : o.call(null, r);
    }, ot = [], Qt = (t) => {
      var r = ot[t];
      return r || (t >= ot.length && (ot.length = t + 1), ot[t] = r = er.get(t)), r;
    }, bn = (t, r, n) => {
      if (t.includes("j"))
        return En(t, r, n);
      var o = Qt(r).apply(null, n);
      return o;
    }, $n = (t, r) => {
      var n = [];
      return function() {
        return n.length = 0, Object.assign(n, arguments), bn(t, r, n);
      };
    };
    function Me(t, r) {
      t = de(t);
      function n() {
        return t.includes("j") ? $n(t, r) : Qt(r);
      }
      var o = n();
      return typeof o != "function" && N(`unknown function pointer with signature ${t}: ${r}`), o;
    }
    function Pn(t, r) {
      var n = Et(r, function(o) {
        this.name = r, this.message = o;
        var u = new Error(o).stack;
        u !== void 0 && (this.stack = this.toString() + `
` + u.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return n.prototype = Object.create(t.prototype), n.prototype.constructor = n, n.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, n;
    }
    var fr = void 0;
    function hr(t) {
      var r = Ln(t), n = de(r);
      return Ce(r), n;
    }
    function xt(t, r) {
      var n = [], o = {};
      function u(l) {
        if (!o[l] && !Ue[l]) {
          if (dt[l]) {
            dt[l].forEach(u);
            return;
          }
          n.push(l), o[l] = !0;
        }
      }
      throw r.forEach(u), new fr(`${t}: ` + n.map(hr).join([", "]));
    }
    function Tn(t, r, n, o, u, l, f, d, w, g, S, F, A) {
      S = de(S), l = Me(u, l), d && (d = Me(f, d)), g && (g = Me(w, g)), A = Me(F, A);
      var C = vt(S);
      Br(C, function() {
        xt(`Cannot construct ${S} due to unbound types`, [o]);
      }), Ze([t, r, n], o ? [o] : [], function(M) {
        M = M[0];
        var Z, J;
        o ? (Z = M.registeredClass, J = Z.instancePrototype) : J = Te.prototype;
        var oe = Et(C, function() {
          if (Object.getPrototypeOf(this) !== he)
            throw new He("Use 'new' to construct " + S);
          if (ee.constructor_body === void 0)
            throw new He(S + " has no accessible constructor");
          var se = ee.constructor_body[arguments.length];
          if (se === void 0)
            throw new He(`Tried to invoke ctor of ${S} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(ee.constructor_body).toString()}) parameters instead!`);
          return se.apply(this, arguments);
        }), he = Object.create(J, { constructor: { value: oe } });
        oe.prototype = he;
        var ee = new pn(S, oe, he, A, Z, l, d, g);
        ee.baseClass && (ee.baseClass.__derivedClasses === void 0 && (ee.baseClass.__derivedClasses = []), ee.baseClass.__derivedClasses.push(ee));
        var We = new Ee(S, ee, !0, !1, !1), ve = new Ee(S + "*", ee, !1, !1, !1), Se = new Ee(S + " const*", ee, !1, !0, !1);
        return lr[t] = { pointerType: ve, constPointerType: Se }, _n(C, oe), [We, ve, Se];
      });
    }
    function pr(t, r) {
      for (var n = [], o = 0; o < t; o++)
        n.push(X[r + o * 4 >> 2]);
      return n;
    }
    function kn(t) {
      for (; t.length; ) {
        var r = t.pop(), n = t.pop();
        n(r);
      }
    }
    function vr(t, r) {
      if (!(t instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof t} which is not a function`);
      var n = Et(t.name || "unknownFunctionName", function() {
      });
      n.prototype = t.prototype;
      var o = new n(), u = t.apply(o, r);
      return u instanceof Object ? u : o;
    }
    function mr(t, r, n, o, u, l) {
      var f = r.length;
      f < 2 && N("argTypes array size mismatch! Must at least get return value and 'this' types!");
      for (var d = r[1] !== null && n !== null, w = !1, g = 1; g < r.length; ++g)
        if (r[g] !== null && r[g].destructorFunction === void 0) {
          w = !0;
          break;
        }
      for (var S = r[0].name !== "void", F = "", A = "", g = 0; g < f - 2; ++g)
        F += (g !== 0 ? ", " : "") + "arg" + g, A += (g !== 0 ? ", " : "") + "arg" + g + "Wired";
      var C = `
        return function ${vt(t)}(${F}) {
        if (arguments.length !== ${f - 2}) {
          throwBindingError('function ${t} called with ${arguments.length} arguments, expected ${f - 2} args!');
        }`;
      w && (C += `var destructors = [];
`);
      var M = w ? "destructors" : "null", Z = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"], J = [N, o, u, kn, r[0], r[1]];
      d && (C += "var thisWired = classParam.toWireType(" + M + `, this);
`);
      for (var g = 0; g < f - 2; ++g)
        C += "var arg" + g + "Wired = argType" + g + ".toWireType(" + M + ", arg" + g + "); // " + r[g + 2].name + `
`, Z.push("argType" + g), J.push(r[g + 2]);
      if (d && (A = "thisWired" + (A.length > 0 ? ", " : "") + A), C += (S || l ? "var rv = " : "") + "invoker(fn" + (A.length > 0 ? ", " : "") + A + `);
`, w)
        C += `runDestructors(destructors);
`;
      else
        for (var g = d ? 1 : 2; g < r.length; ++g) {
          var oe = g === 1 ? "thisWired" : "arg" + (g - 2) + "Wired";
          r[g].destructorFunction !== null && (C += oe + "_dtor(" + oe + "); // " + r[g].name + `
`, Z.push(oe + "_dtor"), J.push(r[g].destructorFunction));
        }
      return S && (C += `var ret = retType.fromWireType(rv);
return ret;
`), C += `}
`, Z.push(C), vr(Function, Z).apply(null, J);
    }
    function Cn(t, r, n, o, u, l) {
      var f = pr(r, n);
      u = Me(o, u), Ze([], [t], function(d) {
        d = d[0];
        var w = `constructor ${d.name}`;
        if (d.registeredClass.constructor_body === void 0 && (d.registeredClass.constructor_body = []), d.registeredClass.constructor_body[r - 1] !== void 0)
          throw new He(`Cannot register multiple constructors with identical number of parameters (${r - 1}) for class '${d.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return d.registeredClass.constructor_body[r - 1] = () => {
          xt(`Cannot construct ${d.name} due to unbound types`, f);
        }, Ze([], f, function(g) {
          return g.splice(1, 0, null), d.registeredClass.constructor_body[r - 1] = mr(w, g, null, u, l), [];
        }), [];
      });
    }
    function gr(t, r, n, o, u, l, f, d, w) {
      var g = pr(n, o);
      r = de(r), l = Me(u, l), Ze([], [t], function(S) {
        S = S[0];
        var F = `${S.name}.${r}`;
        r.startsWith("@@") && (r = Symbol[r.substring(2)]), d && S.registeredClass.pureVirtualFunctions.push(r);
        function A() {
          xt(`Cannot call ${F} due to unbound types`, g);
        }
        var C = S.registeredClass.instancePrototype, M = C[r];
        return M === void 0 || M.overloadTable === void 0 && M.className !== S.name && M.argCount === n - 2 ? (A.argCount = n - 2, A.className = S.name, C[r] = A) : (Be(C, r, F), C[r].overloadTable[n - 2] = A), Ze([], g, function(Z) {
          var J = mr(F, Z, S, l, f, w);
          return C[r].overloadTable === void 0 ? (J.argCount = n - 2, C[r] = J) : C[r].overloadTable[n - 2] = J, [];
        }), [];
      });
    }
    function Sn() {
      Object.assign(yr.prototype, { get(t) {
        return this.allocated[t];
      }, has(t) {
        return this.allocated[t] !== void 0;
      }, allocate(t) {
        var r = this.freelist.pop() || this.allocated.length;
        return this.allocated[r] = t, r;
      }, free(t) {
        this.allocated[t] = void 0, this.freelist.push(t);
      } });
    }
    function yr() {
      this.allocated = [void 0], this.freelist = [];
    }
    var ge = new yr();
    function wr(t) {
      t >= ge.reserved && --ge.get(t).refcount === 0 && ge.free(t);
    }
    function Mr() {
      for (var t = 0, r = ge.reserved; r < ge.allocated.length; ++r)
        ge.allocated[r] !== void 0 && ++t;
      return t;
    }
    function An() {
      ge.allocated.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 }), ge.reserved = ge.allocated.length, i.count_emval_handles = Mr;
    }
    var gt = { toValue: (t) => (t || N("Cannot use deleted val. handle = " + t), ge.get(t).value), toHandle: (t) => {
      switch (t) {
        case void 0:
          return 1;
        case null:
          return 2;
        case !0:
          return 3;
        case !1:
          return 4;
        default:
          return ge.allocate({ refcount: 1, value: t });
      }
    } };
    function Or(t, r) {
      r = de(r), we(t, { name: r, fromWireType: function(n) {
        var o = gt.toValue(n);
        return wr(n), o;
      }, toWireType: function(n, o) {
        return gt.toHandle(o);
      }, argPackAdvance: 8, readValueFromPointer: mt, destructorFunction: null });
    }
    function Ut(t) {
      if (t === null)
        return "null";
      var r = typeof t;
      return r === "object" || r === "array" || r === "function" ? t.toString() : "" + t;
    }
    function Dn(t, r) {
      switch (r) {
        case 2:
          return function(n) {
            return this.fromWireType(jt[n >> 2]);
          };
        case 3:
          return function(n) {
            return this.fromWireType(Ht[n >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + t);
      }
    }
    function Fn(t, r, n) {
      var o = At(n);
      r = de(r), we(t, { name: r, fromWireType: function(u) {
        return u;
      }, toWireType: function(u, l) {
        return l;
      }, argPackAdvance: 8, readValueFromPointer: Dn(r, o), destructorFunction: null });
    }
    function Rn(t, r, n) {
      switch (r) {
        case 0:
          return n ? function(u) {
            return ne[u];
          } : function(u) {
            return K[u];
          };
        case 1:
          return n ? function(u) {
            return $e[u >> 1];
          } : function(u) {
            return rt[u >> 1];
          };
        case 2:
          return n ? function(u) {
            return V[u >> 2];
          } : function(u) {
            return X[u >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + t);
      }
    }
    function xn(t, r, n, o, u) {
      r = de(r);
      var l = At(n), f = (F) => F;
      if (o === 0) {
        var d = 32 - 8 * n;
        f = (F) => F << d >>> d;
      }
      var w = r.includes("unsigned"), g = (F, A) => {
      }, S;
      w ? S = function(F, A) {
        return g(A, this.name), A >>> 0;
      } : S = function(F, A) {
        return g(A, this.name), A;
      }, we(t, { name: r, fromWireType: f, toWireType: S, argPackAdvance: 8, readValueFromPointer: Rn(r, l, o !== 0), destructorFunction: null });
    }
    function Un(t, r, n) {
      var o = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], u = o[r];
      function l(f) {
        f = f >> 2;
        var d = X, w = d[f], g = d[f + 1];
        return new u(d.buffer, g, w);
      }
      n = de(n), we(t, { name: n, fromWireType: l, argPackAdvance: 8, readValueFromPointer: l }, { ignoreDuplicateRegistrations: !0 });
    }
    var Bn = (t, r, n) => kt(t, K, r, n);
    function tt(t, r) {
      r = de(r);
      var n = r === "std::string";
      we(t, { name: r, fromWireType: function(o) {
        var u = X[o >> 2], l = o + 4, f;
        if (n)
          for (var d = l, w = 0; w <= u; ++w) {
            var g = l + w;
            if (w == u || K[g] == 0) {
              var S = g - d, F = ct(d, S);
              f === void 0 ? f = F : (f += String.fromCharCode(0), f += F), d = g + 1;
            }
          }
        else {
          for (var A = new Array(u), w = 0; w < u; ++w)
            A[w] = String.fromCharCode(K[l + w]);
          f = A.join("");
        }
        return Ce(o), f;
      }, toWireType: function(o, u) {
        u instanceof ArrayBuffer && (u = new Uint8Array(u));
        var l, f = typeof u == "string";
        f || u instanceof Uint8Array || u instanceof Uint8ClampedArray || u instanceof Int8Array || N("Cannot pass non-string to std::string"), n && f ? l = Tt(u) : l = u.length;
        var d = Er(4 + l + 1), w = d + 4;
        if (X[d >> 2] = l, n && f)
          Bn(u, w, l + 1);
        else if (f)
          for (var g = 0; g < l; ++g) {
            var S = u.charCodeAt(g);
            S > 255 && (Ce(w), N("String has UTF-16 code units that do not fit in 8 bits")), K[w + g] = S;
          }
        else
          for (var g = 0; g < l; ++g)
            K[w + g] = u[g];
        return o !== null && o.push(Ce, d), d;
      }, argPackAdvance: 8, readValueFromPointer: mt, destructorFunction: function(o) {
        Ce(o);
      } });
    }
    var Bt = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, Ir = (t, r) => {
      for (var n = t, o = n >> 1, u = o + r / 2; !(o >= u) && rt[o]; )
        ++o;
      if (n = o << 1, n - t > 32 && Bt)
        return Bt.decode(K.subarray(t, n));
      for (var l = "", f = 0; !(f >= r / 2); ++f) {
        var d = $e[t + f * 2 >> 1];
        if (d == 0)
          break;
        l += String.fromCharCode(d);
      }
      return l;
    }, Lr = (t, r, n) => {
      if (n === void 0 && (n = 2147483647), n < 2)
        return 0;
      n -= 2;
      for (var o = r, u = n < t.length * 2 ? n / 2 : t.length, l = 0; l < u; ++l) {
        var f = t.charCodeAt(l);
        $e[r >> 1] = f, r += 2;
      }
      return $e[r >> 1] = 0, r - o;
    }, Yt = (t) => t.length * 2, jr = (t, r) => {
      for (var n = 0, o = ""; !(n >= r / 4); ) {
        var u = V[t + n * 4 >> 2];
        if (u == 0)
          break;
        if (++n, u >= 65536) {
          var l = u - 65536;
          o += String.fromCharCode(55296 | l >> 10, 56320 | l & 1023);
        } else
          o += String.fromCharCode(u);
      }
      return o;
    }, p = (t, r, n) => {
      if (n === void 0 && (n = 2147483647), n < 4)
        return 0;
      for (var o = r, u = o + n - 4, l = 0; l < t.length; ++l) {
        var f = t.charCodeAt(l);
        if (f >= 55296 && f <= 57343) {
          var d = t.charCodeAt(++l);
          f = 65536 + ((f & 1023) << 10) | d & 1023;
        }
        if (V[r >> 2] = f, r += 4, r + 4 > u)
          break;
      }
      return V[r >> 2] = 0, r - o;
    }, v = (t) => {
      for (var r = 0, n = 0; n < t.length; ++n) {
        var o = t.charCodeAt(n);
        o >= 55296 && o <= 57343 && ++n, r += 4;
      }
      return r;
    }, m = function(t, r, n) {
      n = de(n);
      var o, u, l, f, d;
      r === 2 ? (o = Ir, u = Lr, f = Yt, l = () => rt, d = 1) : r === 4 && (o = jr, u = p, f = v, l = () => X, d = 2), we(t, { name: n, fromWireType: function(w) {
        for (var g = X[w >> 2], S = l(), F, A = w + 4, C = 0; C <= g; ++C) {
          var M = w + 4 + C * r;
          if (C == g || S[M >> d] == 0) {
            var Z = M - A, J = o(A, Z);
            F === void 0 ? F = J : (F += String.fromCharCode(0), F += J), A = M + r;
          }
        }
        return Ce(w), F;
      }, toWireType: function(w, g) {
        typeof g != "string" && N(`Cannot pass non-string to C++ string type ${n}`);
        var S = f(g), F = Er(4 + S + r);
        return X[F >> 2] = S >> d, u(g, F + 4, S + r), w !== null && w.push(Ce, F), F;
      }, argPackAdvance: 8, readValueFromPointer: mt, destructorFunction: function(w) {
        Ce(w);
      } });
    };
    function $(t, r) {
      r = de(r), we(t, { isVoid: !0, name: r, argPackAdvance: 0, fromWireType: function() {
      }, toWireType: function(n, o) {
      } });
    }
    var R = {};
    function B(t) {
      var r = R[t];
      return r === void 0 ? de(t) : r;
    }
    var O = [];
    function x(t, r, n, o) {
      t = O[t], r = gt.toValue(r), n = B(n), t(r, n, null, o);
    }
    function q(t) {
      var r = O.length;
      return O.push(t), r;
    }
    function I(t, r) {
      var n = Ue[t];
      return n === void 0 && N(r + " has unknown type " + hr(t)), n;
    }
    function re(t, r) {
      for (var n = new Array(t), o = 0; o < t; ++o)
        n[o] = I(X[r + o * 4 >> 2], "parameter " + o);
      return n;
    }
    var ie = [];
    function le(t, r) {
      var n = re(t, r), o = n[0], u = o.name + "_$" + n.slice(1).map(function(M) {
        return M.name;
      }).join("_") + "$", l = ie[u];
      if (l !== void 0)
        return l;
      for (var f = ["retType"], d = [o], w = "", g = 0; g < t - 1; ++g)
        w += (g !== 0 ? ", " : "") + "arg" + g, f.push("argType" + g), d.push(n[1 + g]);
      for (var S = vt("methodCaller_" + u), F = "return function " + S + `(handle, name, destructors, args) {
`, A = 0, g = 0; g < t - 1; ++g)
        F += "    var arg" + g + " = argType" + g + ".readValueFromPointer(args" + (A ? "+" + A : "") + `);
`, A += n[g + 1].argPackAdvance;
      F += "    var rv = handle[name](" + w + `);
`;
      for (var g = 0; g < t - 1; ++g)
        n[g + 1].deleteObject && (F += "    argType" + g + ".deleteObject(arg" + g + `);
`);
      o.isVoid || (F += `    return retType.toWireType(destructors, rv);
`), F += `};
`, f.push(F);
      var C = vr(Function, f).apply(null, d);
      return l = q(C), ie[u] = l, l;
    }
    function fe(t, r) {
      return r + 2097152 >>> 0 < 4194305 - !!t ? (t >>> 0) + r * 4294967296 : NaN;
    }
    var be = () => {
      Fe("");
    };
    function Oe() {
      return Date.now();
    }
    var Ae = () => K.length, st = () => Ae(), _r = (t, r, n) => K.copyWithin(t, r, r + n), ze = (t) => {
      Fe("OOM");
    }, Mn = (t) => {
      K.length, ze();
    }, bt = {}, Hr = () => b || "./this.program", Xe = () => {
      if (!Xe.strings) {
        var t = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", r = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: t, _: Hr() };
        for (var n in bt)
          bt[n] === void 0 ? delete r[n] : r[n] = bt[n];
        var o = [];
        for (var n in r)
          o.push(`${n}=${r[n]}`);
        Xe.strings = o;
      }
      return Xe.strings;
    }, ui = (t, r) => {
      for (var n = 0; n < t.length; ++n)
        ne[r++ >> 0] = t.charCodeAt(n);
      ne[r >> 0] = 0;
    }, li = (t, r) => {
      var n = 0;
      return Xe().forEach(function(o, u) {
        var l = r + n;
        X[t + u * 4 >> 2] = l, ui(o, l), n += o.length + 1;
      }), 0;
    }, ci = (t, r) => {
      var n = Xe();
      X[t >> 2] = n.length;
      var o = 0;
      return n.forEach(function(u) {
        o += u.length + 1;
      }), X[r >> 2] = o, 0;
    };
    function di(t) {
      try {
        var r = ue.getStreamFromFD(t);
        return s.close(r), 0;
      } catch (n) {
        if (typeof s > "u" || n.name !== "ErrnoError")
          throw n;
        return n.errno;
      }
    }
    function fi(t, r) {
      try {
        var n = 0, o = 0, u = 0, l = ue.getStreamFromFD(t), f = l.tty ? 2 : s.isDir(l.mode) ? 3 : s.isLink(l.mode) ? 7 : 4;
        return ne[r >> 0] = f, $e[r + 2 >> 1] = u, Y = [n >>> 0, (U = n, +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 8 >> 2] = Y[0], V[r + 12 >> 2] = Y[1], Y = [o >>> 0, (U = o, +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[r + 16 >> 2] = Y[0], V[r + 20 >> 2] = Y[1], 0;
      } catch (d) {
        if (typeof s > "u" || d.name !== "ErrnoError")
          throw d;
        return d.errno;
      }
    }
    var hi = (t, r, n, o) => {
      for (var u = 0, l = 0; l < n; l++) {
        var f = X[r >> 2], d = X[r + 4 >> 2];
        r += 8;
        var w = s.read(t, ne, f, d, o);
        if (w < 0)
          return -1;
        if (u += w, w < d)
          break;
        typeof o < "u" && (o += w);
      }
      return u;
    };
    function pi(t, r, n, o) {
      try {
        var u = ue.getStreamFromFD(t), l = hi(u, r, n);
        return X[o >> 2] = l, 0;
      } catch (f) {
        if (typeof s > "u" || f.name !== "ErrnoError")
          throw f;
        return f.errno;
      }
    }
    function vi(t, r, n, o, u) {
      var l = fe(r, n);
      try {
        if (isNaN(l))
          return 61;
        var f = ue.getStreamFromFD(t);
        return s.llseek(f, l, o), Y = [f.position >>> 0, (U = f.position, +Math.abs(U) >= 1 ? U > 0 ? +Math.floor(U / 4294967296) >>> 0 : ~~+Math.ceil((U - +(~~U >>> 0)) / 4294967296) >>> 0 : 0)], V[u >> 2] = Y[0], V[u + 4 >> 2] = Y[1], f.getdents && l === 0 && o === 0 && (f.getdents = null), 0;
      } catch (d) {
        if (typeof s > "u" || d.name !== "ErrnoError")
          throw d;
        return d.errno;
      }
    }
    var mi = (t, r, n, o) => {
      for (var u = 0, l = 0; l < n; l++) {
        var f = X[r >> 2], d = X[r + 4 >> 2];
        r += 8;
        var w = s.write(t, ne, f, d, o);
        if (w < 0)
          return -1;
        u += w, typeof o < "u" && (o += w);
      }
      return u;
    };
    function gi(t, r, n, o) {
      try {
        var u = ue.getStreamFromFD(t), l = mi(u, r, n);
        return X[o >> 2] = l, 0;
      } catch (f) {
        if (typeof s > "u" || f.name !== "ErrnoError")
          throw f;
        return f.errno;
      }
    }
    var On = function(t, r, n, o) {
      t || (t = this), this.parent = t, this.mount = t.mount, this.mounted = null, this.id = s.nextInode++, this.name = r, this.mode = n, this.node_ops = {}, this.stream_ops = {}, this.rdev = o;
    }, Mt = 365, Ot = 146;
    Object.defineProperties(On.prototype, { read: { get: function() {
      return (this.mode & Mt) === Mt;
    }, set: function(t) {
      t ? this.mode |= Mt : this.mode &= ~Mt;
    } }, write: { get: function() {
      return (this.mode & Ot) === Ot;
    }, set: function(t) {
      t ? this.mode |= Ot : this.mode &= ~Ot;
    } }, isFolder: { get: function() {
      return s.isDir(this.mode);
    } }, isDevice: { get: function() {
      return s.isChrdev(this.mode);
    } } }), s.FSNode = On, s.createPreloadedFile = Jr, s.staticInit(), qt(), He = i.BindingError = class extends Error {
      constructor(r) {
        super(r), this.name = "BindingError";
      }
    }, qe = i.InternalError = class extends Error {
      constructor(r) {
        super(r), this.name = "InternalError";
      }
    }, Ur(), Fr(), wn(), fr = i.UnboundTypeError = Pn(Error, "UnboundTypeError"), Sn(), An();
    var yi = { p: ut, C: tn, w: St, t: rn, n: Dr, r: Tn, q: Cn, d: gr, D: Or, k: Fn, c: xn, b: Un, j: tt, f: m, o: $, g: x, m: wr, l: le, a: be, e: Oe, v: st, A: _r, u: Mn, y: li, z: ci, i: di, x: fi, B: pi, s: vi, h: gi };
    Zr();
    var Er = (t) => (Er = Q.G)(t), Ce = (t) => (Ce = Q.I)(t), In = () => (In = Q.J)(), Ln = (t) => (Ln = Q.K)(t);
    i.__embind_initialize_bindings = () => (i.__embind_initialize_bindings = Q.L)();
    var jn = (t) => (jn = Q.M)(t);
    i.dynCall_viiijj = (t, r, n, o, u, l, f, d) => (i.dynCall_viiijj = Q.N)(t, r, n, o, u, l, f, d), i.dynCall_jij = (t, r, n, o) => (i.dynCall_jij = Q.O)(t, r, n, o), i.dynCall_jii = (t, r, n) => (i.dynCall_jii = Q.P)(t, r, n), i.dynCall_jiji = (t, r, n, o, u) => (i.dynCall_jiji = Q.Q)(t, r, n, o, u);
    var It;
    Qe = function t() {
      It || Hn(), It || (Qe = t);
    };
    function Hn() {
      if (Pe > 0 || (qr(), Pe > 0))
        return;
      function t() {
        It || (It = !0, i.calledRun = !0, !ae && (Gr(), h(i), i.onRuntimeInitialized && i.onRuntimeInitialized(), at()));
      }
      i.setStatus ? (i.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          i.setStatus("");
        }, 1), t();
      }, 1)) : t();
    }
    if (i.preInit)
      for (typeof i.preInit == "function" && (i.preInit = [i.preInit]); i.preInit.length > 0; )
        i.preInit.pop()();
    return Hn(), a.ready;
  };
})(), Do = Object.defineProperty, Fo = Object.getOwnPropertyDescriptor, Jn = (T, a, i, h) => {
  for (var c = h > 1 ? void 0 : h ? Fo(a, i) : a, _ = T.length - 1, b; _ >= 0; _--)
    (b = T[_]) && (c = (h ? b(a, i, c) : b(c)) || c);
  return h && c && Do(a, i, c), c;
};
class Nr extends me {
  constructor() {
    super(...arguments), this.sampleRate = 0, this.channels = 0;
  }
  initialize() {
    return new Promise((a) => {
      const i = {};
      i.print = (h) => console.log(h), i.printErr = (h) => console.log(`[JS] ERROR: ${h}`), i.onAbort = () => console.log("[JS] FATAL: WASM ABORTED"), i.postRun = (h) => {
        this.module = h, this.decoder = new this.module.AudioDecoder(this), a();
      }, console.log("audio soft decoder initialize call"), Ao(i);
    });
  }
  configure(a) {
    this.config = a, this.decoder.setCodec(this.config.codec, this.config.description ?? "");
  }
  decode(a) {
    this.decoder.decode(a.data, a.timestamp);
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
  audioInfo(a, i) {
    this.sampleRate = a, this.channels = i;
    let h = {
      sampleRate: a,
      channels: i,
      depth: 16
    };
    this.emit(Nn.AudioCodecInfo, h);
  }
  pcmData(a, i, h) {
    if (!this.module)
      return;
    let c = [], _ = 0, b = 0;
    for (let y = 0; y < this.channels; y++) {
      let E = this.module.HEAPU32[(a >> 2) + y] >> 2;
      const D = this.module.HEAPF32.subarray(E, E + i);
      c.push(D), _ += D.length;
    }
    const P = new Float32Array(_);
    this.emit(Nn.AudioFrame, new AudioData({
      format: "f32-planar",
      sampleRate: this.sampleRate,
      numberOfChannels: this.channels,
      timestamp: h,
      numberOfFrames: i,
      data: c.reduce((y, E) => (y.subarray(b).set(E), b += E.length, y), P)
    }));
  }
  errorInfo(a) {
    let i = {
      errMsg: a
    };
    this.emit(Nn.Error, i);
  }
}
Jn([
  Jt(me.INIT, "initialized")
], Nr.prototype, "initialize", 1);
Jn([
  Jt("initialized", "configured", { sync: !0 })
], Nr.prototype, "configure", 1);
Jn([
  bo("configured")
], Nr.prototype, "decode", 1);
Jn([
  Jt("configured", "initialized", { sync: !0 })
], Nr.prototype, "reset", 1);
Jn([
  Jt([], "closed", { sync: !0 })
], Nr.prototype, "close", 1);
class Ro {
  gl = null;
  program = null;
  yTexture = null;
  uTexture = null;
  vTexture = null;
  positionBuffer = null;
  texCoordBuffer = null;
  width = 0;
  height = 0;
  constructor(a) {
    this.setupWebGL(a);
  }
  setupWebGL(a) {
    try {
      if (this.gl = a.getContext("webgl", { preserveDrawingBuffer: !0 }), !this.gl)
        throw new Error("WebGL not supported");
      const i = this.createShader(this.gl.VERTEX_SHADER, `
        attribute vec4 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        void main() {
          gl_Position = a_position;
          v_texCoord = a_texCoord;
        }
      `), h = this.createShader(this.gl.FRAGMENT_SHADER, `
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
      if (!i || !h)
        throw new Error("Failed to create shaders");
      if (this.program = this.createProgram(i, h), !this.program)
        throw new Error("Failed to create shader program");
      this.createBuffers(), this.yTexture = this.createTexture(), this.uTexture = this.createTexture(), this.vTexture = this.createTexture();
    } catch (i) {
      console.error("Error initializing WebGL:", i), this.gl = null;
    }
  }
  createShader(a, i) {
    if (!this.gl)
      return null;
    const h = this.gl.createShader(a);
    return h ? (this.gl.shaderSource(h, i), this.gl.compileShader(h), this.gl.getShaderParameter(h, this.gl.COMPILE_STATUS) ? h : (console.error("Shader compile error:", this.gl.getShaderInfoLog(h)), this.gl.deleteShader(h), null)) : null;
  }
  createProgram(a, i) {
    if (!this.gl)
      return null;
    const h = this.gl.createProgram();
    return h ? (this.gl.attachShader(h, a), this.gl.attachShader(h, i), this.gl.linkProgram(h), this.gl.getProgramParameter(h, this.gl.LINK_STATUS) ? h : (console.error("Program link error:", this.gl.getProgramInfoLog(h)), this.gl.deleteProgram(h), null)) : null;
  }
  createTexture() {
    if (!this.gl)
      return null;
    const a = this.gl.createTexture();
    return a ? (this.gl.bindTexture(this.gl.TEXTURE_2D, a), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR), a) : null;
  }
  createBuffers() {
    if (!this.gl || !this.program)
      return;
    this.positionBuffer = this.gl.createBuffer(), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    const a = [
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      1
    ];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(a), this.gl.STATIC_DRAW), this.texCoordBuffer = this.gl.createBuffer(), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
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
  setDimensions(a, i) {
    this.width = a, this.height = i, this.gl && this.gl.viewport(0, 0, a, i);
  }
  // Render YUV data to the canvas
  render(a, i, h, c, _) {
    if (!this.gl || !this.program || !this.yTexture || !this.uTexture || !this.vTexture) {
      console.error("WebGL not initialized properly");
      return;
    }
    this.gl.useProgram(this.program), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    const b = this.gl.getAttribLocation(this.program, "a_position");
    this.gl.enableVertexAttribArray(b), this.gl.vertexAttribPointer(b, 2, this.gl.FLOAT, !1, 0, 0), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    const P = this.gl.getAttribLocation(this.program, "a_texCoord");
    this.gl.enableVertexAttribArray(P), this.gl.vertexAttribPointer(P, 2, this.gl.FLOAT, !1, 0, 0), this.updateTexture(this.yTexture, 0, a, this.width, this.height, c), this.updateTexture(this.uTexture, 1, i, this.width / 2, this.height / 2, _), this.updateTexture(this.vTexture, 2, h, this.width / 2, this.height / 2, _);
    const y = this.gl.getUniformLocation(this.program, "y_texture"), E = this.gl.getUniformLocation(this.program, "u_texture"), D = this.gl.getUniformLocation(this.program, "v_texture");
    this.gl.uniform1i(y, 0), this.gl.uniform1i(E, 1), this.gl.uniform1i(D, 2), this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
  updateTexture(a, i, h, c, _, b) {
    if (this.gl)
      if (this.gl.activeTexture(this.gl.TEXTURE0 + i), this.gl.bindTexture(this.gl.TEXTURE_2D, a), b === c)
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.LUMINANCE,
          c,
          _,
          0,
          this.gl.LUMINANCE,
          this.gl.UNSIGNED_BYTE,
          h
        );
      else {
        const P = new Uint8Array(c * _);
        for (let y = 0; y < _; y++)
          for (let E = 0; E < c; E++)
            P[y * c + E] = h[y * b + E];
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.LUMINANCE,
          c,
          _,
          0,
          this.gl.LUMINANCE,
          this.gl.UNSIGNED_BYTE,
          P
        );
      }
  }
  // Add a method to render directly from a VideoFrame with YUV format
  renderVideoFrame(a) {
    this.setDimensions(a.codedWidth, a.codedHeight);
    const i = a.codedWidth * a.codedHeight, h = a.codedWidth / 2 * (a.codedHeight / 2), c = new Uint8Array(i), _ = new Uint8Array(h), b = new Uint8Array(h);
    a.copyTo(c, { rect: { x: 0, y: 0, width: a.codedWidth, height: a.codedHeight }, layout: [{ offset: 0, stride: a.codedWidth }] }), a.format === "I420" ? (a.copyTo(_, { rect: { x: 0, y: 0, width: a.codedWidth / 2, height: a.codedHeight / 2 }, layout: [{ offset: i, stride: a.codedWidth / 2 }] }), a.copyTo(b, { rect: { x: 0, y: 0, width: a.codedWidth / 2, height: a.codedHeight / 2 }, layout: [{ offset: i + h, stride: a.codedWidth / 2 }] })) : (a.copyTo(b, { rect: { x: 0, y: 0, width: a.codedWidth / 2, height: a.codedHeight / 2 }, layout: [{ offset: i, stride: a.codedWidth / 2 }] }), a.copyTo(_, { rect: { x: 0, y: 0, width: a.codedWidth / 2, height: a.codedHeight / 2 }, layout: [{ offset: i + h, stride: a.codedWidth / 2 }] })), this.render(c, _, b, a.codedWidth, a.codedWidth / 2);
  }
  // Cleanup resources
  dispose() {
    this.gl && (this.gl.deleteTexture(this.yTexture), this.gl.deleteTexture(this.uTexture), this.gl.deleteTexture(this.vTexture), this.gl.deleteBuffer(this.positionBuffer), this.gl.deleteBuffer(this.texCoordBuffer), this.program && this.gl.deleteProgram(this.program), this.gl = null);
  }
}
class xo {
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
  constructor(a, i) {
    this.canvas = document.createElement("canvas"), this.canvas.style.width = "160px", this.canvas.style.height = "120px", i?.yuvMode ? this.yuvRenderer = new Ro(this.canvas) : this.gl = this.canvas.getContext("2d"), this.videoDecoder = new So({
      workerMode: !1,
      yuvMode: !!this.yuvRenderer,
      canvas: this.canvas,
      wasmPath: a
    }), this.audioDecoder = new Nr(), this.videoDecoder.on(Lt.VideoFrame, (h) => {
      if (console.log("videoFrame", h), this.yuvRenderer) {
        const c = h;
        this.yuvRenderer.render(c[0], c[1], c[2], this.canvas.width, this.canvas.width / 2);
      } else
        this.gl && (this.gl.drawImage(h, 0, 0), h.close());
    }), this.videoDecoder.on(Lt.VideoCodecInfo, (h) => {
      this.canvas.width = h.width, this.canvas.height = h.height, this.yuvRenderer && this.yuvRenderer.setDimensions(h.width, h.height);
    }), this.videoDecoder.on(Lt.Error, (h) => {
      console.error(h);
    }), this.audioDecoder.on(Nn.AudioFrame, (h) => {
      this.audioContext || this.initAudioContext();
      const c = this.audioContext.createBuffer(
        h.numberOfChannels,
        h.numberOfFrames,
        h.sampleRate
      );
      for (let _ = 0; _ < h.numberOfChannels; _++) {
        const b = new Float32Array(h.numberOfFrames);
        h.copyTo(b, { planeIndex: _ }), c.copyToChannel(b, _);
      }
      this.audioQueue.push(c), this.audioQueueTimestamps.push(h.timestamp), this.scheduleAudioPlayback();
    });
  }
  initAudioContext() {
    this.audioContext = new AudioContext(), this.audioGain = this.audioContext.createGain(), this.audioGain.connect(this.audioContext.destination), this.nextAudioStartTime = this.audioContext.currentTime;
  }
  scheduleAudioPlayback() {
    if (!(!this.isPlaying || !this.audioContext || this.audioQueue.length === 0) && !(this.nextAudioStartTime > this.audioContext.currentTime + this.audioScheduleAheadTime)) {
      for (; this.audioQueue.length > 0; ) {
        const a = this.audioQueue[0], i = this.audioQueueTimestamps[0], h = this.audioContext.createBufferSource();
        h.buffer = a, h.connect(this.audioGain), h.playbackRate.value = this.playbackSpeed;
        const c = performance.now(), _ = i * this.playbackSpeed, b = this.audioContext.currentTime + Math.max(0, (_ - (c - this.startTime)) / 1e3), P = Math.max(
          this.audioContext.currentTime,
          Math.max(b, this.nextAudioStartTime)
        );
        if (h.start(P), this.nextAudioStartTime = P + a.duration / this.playbackSpeed, this.audioQueue.shift(), this.audioQueueTimestamps.shift(), this.nextAudioStartTime > this.audioContext.currentTime + this.audioScheduleAheadTime)
          break;
      }
      this.lastAudioScheduleTime = this.audioContext.currentTime;
    }
  }
  setPlaybackSpeed(a) {
    if (a <= 0)
      throw new Error("Playback speed must be greater than 0");
    const i = this.getCurrentTime();
    this.startTime = performance.now() - i / a, this.playbackSpeed = a, console.log("playbackSpeed", this.playbackSpeed);
  }
  seek(a) {
    if (!this.isPlaying)
      return;
    const i = this.findNearestKeyFrame(a * 1e3);
    this.videoBuffer = this.videoBuffer.filter((h) => h.timestamp >= i), this.audioBuffer = this.audioBuffer.filter((h) => h.timestamp >= i), this.audioQueue = [], this.audioQueueTimestamps = [], this.audioContext && (this.nextAudioStartTime = this.audioContext.currentTime), this.timeOffset = a * 1e3, this.startTime = performance.now() - a * 1e3, this.seekTime = i;
  }
  findNearestKeyFrame(a) {
    for (let i = this.keyFrameList.length - 1; i >= 0; i--)
      if (this.keyFrameList[i] <= a)
        return this.keyFrameList[i];
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
      const a = this.videoBuffer.shift();
      a && this.videoDecoder.decode(a);
    }
  }
  processNextFrame = () => {
    if (!this.isPlaying)
      return;
    const a = this.getCurrentTime();
    if (this.videoBuffer.length && console.log(this.videoBuffer.length, this.videoBuffer[this.videoBuffer.length - 1].timestamp, a), this.seekTime !== null) {
      for (; this.videoBuffer.length > 0 && this.videoBuffer[0].timestamp < this.seekTime; )
        this.videoBuffer.shift();
      for (; this.audioBuffer.length > 0 && this.audioBuffer[0].timestamp < this.seekTime; )
        this.audioBuffer.shift();
      this.seekTime = null;
    }
    if (this.videoBuffer.length > 0 && this.videoBuffer[0].timestamp <= a) {
      const i = this.videoBuffer.shift();
      i && this.videoDecoder.decode(i);
    }
    if (this.videoBuffer.length > 0) {
      const i = this.videoBuffer.findIndex(
        (h, c) => c > 0 && h.type === "key"
      );
      i !== -1 && this.videoBuffer.slice(0, i).every((_) => _.timestamp <= a) && this.videoBuffer.splice(0, i);
    }
    if (this.audioBuffer.length > 0 && this.audioBuffer[0].timestamp <= a) {
      const i = this.audioBuffer.shift();
      i && this.audioDecoder.decode(i);
    }
    this.audioContext && this.audioContext.currentTime - this.lastAudioScheduleTime > this.audioScheduleAheadTime / 2 && this.scheduleAudioPlayback(), this.animationFrameId = requestAnimationFrame(this.processNextFrame);
  };
  decodeVideo(a) {
    if (this.videoBuffer.length >= this.maxBufferSize) {
      console.warn("Video buffer full, dropping frame");
      return;
    }
    a.type === "key" && this.keyFrameList.push(a.timestamp), this.videoBuffer.push(a);
  }
  decodeAudio(a) {
    if (this.audioBuffer.length >= this.maxBufferSize) {
      console.warn("Audio buffer full, dropping frame");
      return;
    }
    this.audioBuffer.push(a);
  }
  // Dispose of resources
  dispose() {
    this.stop(), this.videoBuffer = [], this.audioBuffer = [], this.audioQueue = [], this.audioQueueTimestamps = [], this.yuvRenderer && (this.yuvRenderer.dispose(), this.yuvRenderer = null), this.audioContext && (this.audioContext.close(), this.audioContext = null), this.gl = null, this.audioGain = null;
  }
}
const Uo = /#EXTINF:(\d+\.\d+),(.*?)\s*$/;
class Bo {
  constructor(a, i) {
    this.index = a, this.url = i.url, this.duration = i.duration, this.virtualStartTime = 0, this.virtualEndTime = 0, this.physicalTime = i.physicalTime;
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
  fmp4Parser = new go(!1);
  tracks = [];
  softDecoder;
  async load(a) {
    if (this.state = "loading", !this.data) {
      const h = await fetch(this.url);
      this.data = h.arrayBuffer();
    }
    const i = await this.data;
    if (this.tracks.length === 0 && (this.tracks = this.fmp4Parser.parse(i)), !a.initialized) {
      const h = `video/mp4; codecs="${this.tracks.map((c) => c.codec).join(", ")}"`;
      if (MediaSource.isTypeSupported(h))
        a.init(h);
      else
        throw new Error(`Unsupported codec: ${h}`);
    }
    this.state === "loading" && (this.state = "buffering", await a.appendBuffer({ data: i, tracks: this.tracks }), this.state = "buffered");
  }
  async load2(a) {
    if (this.softDecoder = a, this.state === "init") {
      if (this.state = "loading", !this.data) {
        const _ = await fetch(this.url);
        this.data = _.arrayBuffer();
      }
      const c = await this.data;
      this.tracks = this.fmp4Parser.parse(c), this.state = "buffering";
    }
    const i = this.tracks.filter((c) => c.type === "video"), h = this.tracks.filter((c) => c.type === "audio");
    for (const c of i) {
      a.videoDecoder.state !== "configured" && (await a.videoDecoder.initialize(), await a.videoDecoder.configure({
        codec: c.codec.startsWith("avc1") ? "avc" : "hevc",
        description: c.codecInfo?.extraData
      }), a.canvas.width = c.width ?? 1920, a.canvas.height = c.height ?? 1080);
      let _ = this.virtualStartTime * 1e3;
      c.samples.forEach((b) => {
        a.decodeVideo({
          data: b.data,
          timestamp: _,
          type: b.keyFrame ? "key" : "delta"
        }), _ += b.duration ?? 0;
      });
    }
    for (const c of h) {
      a.audioDecoder.state !== "configured" && (await a.audioDecoder.initialize(), await a.audioDecoder.configure({
        codec: "aac",
        description: c.codecInfo?.extraData,
        numberOfChannels: c.channelCount ?? 2,
        sampleRate: c.sampleRate ?? 44100
      }));
      let _ = this.virtualStartTime * 1e3;
      c.samples.forEach((b) => {
        a.decodeAudio({
          data: b.data,
          timestamp: _,
          type: "key"
        }), _ += b.duration ?? 0;
      });
    }
    this.state = "buffered";
  }
  unBuffer() {
    this.state !== "init" && (this.state = "loaded", this.softDecoder && (this.softDecoder.videoBuffer = this.softDecoder.videoBuffer.filter(
      (a) => a.timestamp < this.virtualStartTime * 1e3 || a.timestamp >= this.virtualEndTime * 1e3
    ), this.softDecoder.audioBuffer = this.softDecoder.audioBuffer.filter(
      (a) => a.timestamp < this.virtualStartTime * 1e3 || a.timestamp >= this.virtualEndTime * 1e3
    )));
  }
}
class Ii {
  constructor(a) {
    this.mediaSource = a;
  }
  queue = [];
  // 排队
  removeQueue = [];
  currentWaiting;
  currentError = () => {
    console.log(e);
  };
  sourceBuffer;
  get initialized() {
    return !!this.sourceBuffer;
  }
  init(a) {
    console.log("init", a), this.sourceBuffer = this.mediaSource.addSourceBuffer(a), this.sourceBuffer.mode = "sequence", this.sourceBuffer.addEventListener("updateend", () => {
      if (this.currentWaiting?.(), this.removeQueue.length > 0) {
        const { start: i, end: h, resolve: c, reject: _ } = this.removeQueue.shift();
        this.sourceBuffer.remove(i, h), this.currentWaiting = c, this.currentError = _;
      } else if (this.queue.length > 0) {
        const { data: i, resolve: h, reject: c } = this.queue.shift();
        this.sourceBuffer.appendBuffer(i), this.currentWaiting = h, this.currentError = c;
      } else
        delete this.currentWaiting;
    }), this.sourceBuffer.addEventListener("error", (i) => {
      this.currentError(i);
    });
  }
  appendBuffer(a) {
    return this.currentWaiting ? new Promise((i, h) => {
      this.queue.push({ data: a.data, resolve: i, reject: h });
    }) : (this.sourceBuffer.appendBuffer(a.data), new Promise((i, h) => {
      this.currentWaiting = i, this.currentError = h;
    }));
  }
  remove(a, i) {
    return this.currentWaiting ? new Promise((h, c) => {
      this.removeQueue.push({ start: a, end: i, resolve: h, reject: c });
    }) : (this.sourceBuffer.remove(a, i), new Promise((h, c) => {
      this.currentWaiting = h, this.currentError = c;
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
function Mo(T, a) {
  const i = T.split(`
`), h = [];
  let c = 0, _ = 0, b = 0, P = null;
  for (let y = 0; y < i.length; y++) {
    const E = i[y].trim();
    if (E.startsWith("#EXTINF:")) {
      const D = E.match(Uo);
      if (D) {
        b = parseFloat(D[1]);
        const k = D[2] ? D[2].trim() : "";
        try {
          k ? P = new Date(k) : P = null;
        } catch {
          P = null;
        }
      }
    } else if (!E.startsWith("#") && E !== "") {
      const D = new URL(E, a), k = c, j = c + b, z = new Bo(_, {
        url: D.toString(),
        duration: b,
        physicalTime: P
      });
      z.virtualStartTime = k, z.virtualEndTime = j, h.push(z), c += b, _++, P = null;
    }
  }
  return { segments: h, totalDuration: c };
}
class Oo {
  constructor(a, i = { debug: !1 }) {
    this.video = a, this.debug = i.debug;
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
    const a = this.video.buffered;
    for (let i = 0; i < a.length; i++) {
      const h = a.start(i);
      this.currentTime >= h || (this.currentTime = h, this.video.play());
    }
  };
  onError = async (a) => {
    console.error("Video error:", a);
    const i = this.position;
    this.video.pause(), this.video.src = "", this.softDecoder && this.softDecoder.dispose(), this.sourceBufferProxy?.destroy(), this.urlSrouce && URL.revokeObjectURL(this.urlSrouce), this.mediaSource = new MediaSource();
    const h = this.mediaSource;
    this.urlSrouce = URL.createObjectURL(h), this.sourceBufferProxy = new Ii(h), h.addEventListener("sourceopen", async () => {
      for (const c of this.segments)
        c.state === "buffered" && await this.appendSegment(c);
      this.seek(i + 1);
    }), h.addEventListener("sourceended", () => {
      this.video.pause();
    }), this.video.src = this.urlSrouce;
  };
  async load(a) {
    console.log("load", a);
    const i = this.mediaSource, h = new URL(a);
    switch (h.pathname.split(".").pop()) {
      case "m3u8":
        this.singleFmp4 = !1;
        const c = await fetch(a).then((b) => b.text()), _ = Mo(c, h.origin + h.pathname.split("/").slice(0, -1).join("/"));
        console.log("playlist", _), this.segments = _.segments, this.totalDuration = _.totalDuration, this.urlSrouce = URL.createObjectURL(i), this.video.src = this.urlSrouce, this.currentSegment = this.segments[0], this.sourceBufferProxy = new Ii(i), i.addEventListener("sourceopen", async () => {
          for (let b = 0; b < 2 && b < this.segments.length; b++)
            await this.appendSegment(this.segments[b]);
        }), i.addEventListener("sourceended", () => {
          this.video.pause();
        }), this.video.addEventListener("timeupdate", this.updatePosition), this.video.addEventListener("waiting", this.onWaiting), this.video.addEventListener("error", this.onError);
        break;
    }
  }
  destroy() {
    this.video.pause(), this.video.src = "", this.video.removeEventListener("timeupdate", this.updatePosition), this.video.removeEventListener("waiting", this.onWaiting), this.video.removeEventListener("error", this.onError), this.mediaSource?.readyState === "open" && this.mediaSource.endOfStream(), this.urlSrouce && URL.revokeObjectURL(this.urlSrouce), this.softDecoder && this.softDecoder.dispose();
  }
  printSegments() {
    this.debug && console.table(this.segments.map((a) => ({
      state: a.state,
      virtualStartTime: a.virtualStartTime,
      virtualEndTime: a.virtualEndTime,
      duration: a.duration
    })));
  }
  checkBuffer() {
    if (!this.currentSegment)
      return;
    let a = "";
    for (let i = 0; i < this.video.buffered.length; i++) {
      const h = this.video.buffered.start(i).toFixed(2), c = this.video.buffered.end(i).toFixed(2);
      a += `[${h}-${c}] `;
    }
    if (this.debug && console.debug(
      `Time: ${this.video.currentTime.toFixed(2)}, Buffered: ${a}，BufferedLength: ${this.bufferedLength.toFixed(2)}`
    ), this.position >= this.currentSegment.virtualEndTime)
      if (this.segments.length > this.currentSegment.index + 1)
        this.bufferNext(), this.printSegments();
      else
        return;
  }
  async appendSegment(a) {
    if (this.softDecoder)
      await a.load2(this.softDecoder), this.printSegments();
    else
      return a.load(this.sourceBufferProxy).then(() => {
        this.printSegments();
      }).catch((i) => (console.error("appendSegment", i), this.softDecoder = new xo("", { yuvMode: !0 }), this.video.srcObject = this.softDecoder.canvas.captureStream(), this.video.addEventListener("play", () => {
        this.softDecoder?.start();
      }), this.video.addEventListener("pause", () => {
        this.softDecoder?.stop();
      }), this.video.addEventListener("ended", () => {
        this.softDecoder?.stop();
      }), this.appendSegment(a).then(() => {
        this.softDecoder?.processInitialFrame();
      })));
  }
  get bufferedLength() {
    if (!this.currentSegment)
      return 0;
    let a = 0;
    for (let i = this.currentSegment.index; i < this.segments.length; i++)
      this.segments[i].state === "buffered" && (a += this.segments[i].duration);
    return a - (this.position - this.currentSegment.virtualStartTime);
  }
  bufferNext() {
    if (!this.currentSegment)
      return;
    this.currentSegment.unBuffer(), this.currentSegment = this.segments[this.currentSegment.index + 1];
    const a = this.segments[this.currentSegment.index + 1];
    a && this.appendSegment(a);
  }
  set currentTime(a) {
    this.softDecoder ? this._offset = a - this.softDecoder.getCurrentTime() / 1e3 : this.video.currentTime = a;
  }
  get currentTime() {
    return this.softDecoder ? this.softDecoder.getCurrentTime() / 1e3 + this._offset : this.video.currentTime;
  }
  async seek(a) {
    if (console.log("seek", a), !this.currentSegment)
      return;
    const i = this.segments.find((y) => y.virtualEndTime > a);
    if (!i)
      return;
    console.log("targetSegment", i);
    const h = a - i.virtualStartTime, c = this.currentSegment.virtualEndTime - this.position, _ = this.segments[i.index + 1];
    if (this.softDecoder)
      return this.segments.forEach((y) => {
        y.unBuffer();
      }), this.softDecoder.videoBuffer = [], this.softDecoder.audioBuffer = [], await i.load2(this.softDecoder), _ && await this.appendSegment(_), this.softDecoder.seek(a), this.offset = a - this.currentTime, this.position = a, this.currentSegment = i, this.checkBuffer(), this.video.play();
    if (i.state === "buffered")
      return this.position = a, this.currentTime = a - this.offset, i.index === this.currentSegment.index + 1 && this.bufferNext(), this.video.play();
    this.segments.forEach((y) => {
      y.unBuffer();
    });
    const b = this.video.buffered.start(0), P = this.video.buffered.end(this.video.buffered.length - 1);
    return await i.load(this.sourceBufferProxy), _ && await this.appendSegment(_), this.printSegments(), this.currentTime += h + c + _.duration, this.offset = a - this.currentTime, this.position = a, await this.sourceBufferProxy.remove(b, P), this.currentSegment = i, this.checkBuffer(), this.video.play();
  }
}
class Io extends Vn {
  static styles = Gi`
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
  updated(a) {
    a.has("src") && this.src && this.setupTimeline();
  }
  // Helper methods
  formatTime(a) {
    const i = Math.floor(a / 3600), h = Math.floor(a % 3600 / 60), c = Math.floor(a % 60);
    return i > 0 ? `${i.toString().padStart(2, "0")}:${h.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}` : `${h.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}`;
  }
  checkScreenWidth() {
    this.playerRef && (this.isWideScreen = this.playerRef.offsetWidth >= 400);
  }
  setupTimeline() {
    if (this.timeline && this.timeline.destroy(), !this.src || !this.video)
      return;
    const a = new Oo(this.video, { debug: this.debug });
    this.timeline = a, this.currentPosition = 0, this.totalDuration = 0, a.load(this.src).then(() => {
      this.singleFmp4 = a.singleFmp4, this.totalDuration = a.totalDuration, this.dispatchEvent(new CustomEvent("segments", {
        detail: a.segments,
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
    const a = this.timeline.position / this.totalDuration * 100;
    this.progressRef.style.width = `${a}%`;
    const i = (this.timeline.bufferedLength + this.timeline.position) / this.totalDuration * 100;
    this.bufferRef.style.width = `${i}%`, this.dispatchEvent(new CustomEvent("timeupdate", {
      detail: this.timeline.position,
      bubbles: !0,
      composed: !0
    })), this.isPlaying = !this.video?.paused;
  };
  handleTimelineClick(a) {
    if (!this.timelineRef || !this.timeline)
      return;
    const i = this.timelineRef.getBoundingClientRect(), c = (a.clientX - i.left) / i.width * this.totalDuration;
    this.timeline.seek(c), this.currentPosition = c;
  }
  startDrag(a) {
    this.isDragging = !0, this.handleDrag(a), document.addEventListener("mousemove", this.handleDrag), document.addEventListener("mouseup", this.stopDrag);
  }
  handleDrag = (a) => {
    if (!this.isDragging || !this.timelineRef || !this.timeline)
      return;
    const i = this.timelineRef.getBoundingClientRect(), h = (a.clientX - i.left) / i.width, c = Math.max(
      0,
      Math.min(h * this.totalDuration, this.totalDuration)
    );
    this.currentPosition = c;
    const _ = c / this.totalDuration * 100;
    this.progressRef && (this.progressRef.style.width = `${_}%`);
  };
  stopDrag = (a) => {
    this.isDragging && (this.handleTimelineClick(a), document.removeEventListener("mousemove", this.handleDrag), document.removeEventListener("mouseup", this.stopDrag), this.isDragging = !1);
  };
  onTimelineMouseEnter() {
    this.isHovering = !0;
  }
  onTimelineMouseLeave() {
    this.isHovering = !1;
  }
  changePlaybackRate(a) {
    this.video && (this.playbackRate = a, this.video.playbackRate = a, this.showPlaybackRateMenu = !1);
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
  handleVolumeChange(a) {
    if (!this.video)
      return;
    const h = a.currentTarget.getBoundingClientRect();
    this.updateVolumeFromPosition(a.clientY, h);
  }
  updateVolumeFromPosition(a, i) {
    const h = i.height, c = 1 - Math.max(0, Math.min(1, (a - i.top) / h)), _ = Math.max(0, Math.min(1, c));
    this.volume = _, this.video && (this.video.volume = _, this.isMuted = _ === 0, this.video.muted = _ === 0);
  }
  startVolumeDrag(a) {
    a.preventDefault(), this.isVolumeDragging = !0;
    const h = a.currentTarget.getBoundingClientRect();
    this.updateVolumeFromPosition(a.clientY, h);
    const c = (b) => {
      this.isVolumeDragging && this.updateVolumeFromPosition(b.clientY, h);
    };
    document.addEventListener("mousemove", c);
    const _ = () => {
      this.isVolumeDragging = !1, document.removeEventListener("mousemove", c), document.removeEventListener("mouseup", _), setTimeout(() => {
        document.querySelector(".volume-control:hover") || (this.showVolumeSlider = !1);
      }, 500);
    };
    document.addEventListener("mouseup", _);
  }
  seekForward() {
    if (!this.timeline)
      return;
    const a = Math.min(this.timeline.position + 10, this.totalDuration);
    this.timeline.seek(a), this.currentPosition = a;
  }
  seekBackward() {
    if (!this.timeline)
      return;
    const a = Math.max(this.timeline.position - 10, 0);
    this.timeline.seek(a), this.currentPosition = a;
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
    }).catch((a) => {
      console.error(`Error attempting to exit fullscreen: ${a.message}`);
    }) : this.playerRef.requestFullscreen().then(() => {
      this.isFullscreen = !0;
    }).catch((a) => {
      console.error(`Error attempting to enable fullscreen: ${a.message}`);
    }));
  }
  handleKeyDown = (a) => {
    switch (a.key) {
      case " ":
      case "k":
        this.togglePlay(), a.preventDefault();
        break;
      case "ArrowRight":
        this.seekForward(), a.preventDefault();
        break;
      case "ArrowLeft":
        this.seekBackward(), a.preventDefault();
        break;
      case "f":
        this.toggleFullscreen(), a.preventDefault();
        break;
      case "m":
        this.toggleMute(), a.preventDefault();
        break;
    }
  };
  // Public methods
  seek(a) {
    this.timeline && (this.timeline.seek(a), this.currentPosition = a);
  }
  // Render methods
  render() {
    const a = this.formatTime(this.currentPosition), i = this.formatTime(this.totalDuration);
    return Ke`
      <div
        class="video-player"
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
        @mousemove=${this.handleMouseMove}
      >
        <!-- Video element -->
        <video @click=${this.togglePlay} .controls=${this.singleFmp4}></video>

        <!-- Custom timeline UI -->
        ${this.timeline && !this.singleFmp4 ? Ke`
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
                @mousedown=${(h) => {
      h.stopPropagation(), this.startDrag(h);
    }}
              ></div>
            </div>

            <!-- Controls -->
            <div class="controls-container">
              <!-- Left side controls -->
              <div class="controls-left">
                <!-- Play/Pause Button -->
                <button class="control-button" @click=${this.togglePlay}>
                  ${this.isPlaying ? Ke`<i class="icon-pause">▮▮</i>` : Ke`<i class="icon-play">▶</i>`}
                </button>

                <!-- Rewind Button - Only visible on wide screens -->
                ${this.isWideScreen ? Ke`
                  <button class="control-button" @click=${this.seekBackward}>
                    <i class="icon-backward">◀◀</i>
                  </button>
                ` : ""}

                <!-- Fast Forward Button - Only visible on wide screens -->
                ${this.isWideScreen ? Ke`
                  <button class="control-button" @click=${this.seekForward}>
                    <i class="icon-forward">▶▶</i>
                  </button>
                ` : ""}

                <!-- Current time display -->
                <div class="time-display">
                  ${a} / ${i}
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
                  ${this.showPlaybackRateMenu ? Ke`
                    <div class="playback-rate-menu">
                      ${this.playbackRates.map((h) => Ke`
                        <button
                          @click=${() => this.changePlaybackRate(h)}
                          class="playback-rate-option ${this.playbackRate === h ? "active" : ""}"
                        >
                          ${h}x
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
                    ${this.isMuted || this.volume === 0 ? Ke`<i class="icon-volume-mute"></i>` : this.volume < 0.5 ? Ke`<i class="icon-volume-low"></i>` : Ke`<i class="icon-volume-high"></i>`}
                  </button>
                  ${this.showVolumeSlider ? Ke`
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
                  ${this.isFullscreen ? Ke`<i class="icon-fullscreen-exit">⤓</i>` : Ke`<i class="icon-fullscreen">⤢</i>`}
                </button>
              </div>
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }
}
customElements.define("m7s-vod-player", Io);
export {
  Io as VideoPlayer
};
