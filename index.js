document.addEventListener('DOMContentLoaded', () => [
  Bellhop,
  BellPoint,
  BellRoute,
].forEach(c => customElements.define(c._tag, c)));

class BellElem extends HTMLElement {

  static get observedAttributes() {
    return this._attrs;
  };

  /**
   * @type {string[]}
   * @protected
  */
  static _attrs = [];
  /**
   * @type {string}
   * @protected
  */
  static _tag;

  constructor() {
    super();
  };

  [Symbol.toPrimitive](hint) {
    switch (hint) {
      default: {
        return `${this.constructor}${this.name ? this.classList[0] ? `.${this.classList[0]}` : `[name=${this.name}]` : ''}`
      };
    };
  };

  static [Symbol.toPrimitive](hint) {
    switch (hint) {
      default: return this._tag;
    };
  };

};
class BellPoint extends BellElem {

  static _tag = 'bell-point';

  static _attrs = [
    'name',
    'root',
    'prev',
    'active',
  ];

  get name() {
    return this.getAttribute('name');
  };
  get root() {
    return this.hasAttribute('root');
  };
  get prev() {
    return this.hasAttribute('prev');
  };
  get active() {
    return this.hasAttribute('active');
  };

  set name(x) {
    this.setAttribute('name', x);
  };
  set root(x) {
    x ? this.setAttribute('root', '') : this.removeAttribute('root');
  };
  set prev(x) {
    x ? this.setAttribute('prev', '') : this.removeAttribute('prev');
  };
  set active(x) {
    x ? this.setAttribute('active', '') : this.removeAttribute('active');
  };

  activate() {
    this.getHop().activatePoint(this);
    return this;
  };

  /**
   * @returns {Bellhop?}
  */
  getHop() {
    return this.closest(Bellhop);
  };
  /**
   * @returns {HTMLElement?}
  */
  getLoc() {
    return this.getHop().getLoc();
  };
  /**
   * @returns {BellRoute?}
  */
  getRoute() {
    return document.querySelector(`${BellRoute}[bind=${this.getHop().name}][point=${this.name}]`);
  };
  /**
   * @returns {BellPoint?}
  */
  getPrevPoint() {
    return this.parentElement instanceof BellPoint ? this.parentElement : null;
  };
  /**
   * @returns {BellPoint[]}
  */
  getNextPoints() {
    return Array.from(this.children).filter(c => c instanceof BellPoint);
  };
  /**
   * @returns {BellPoint[]}
  */
  getNearPoints() {
    return Array.from(this.parentElement.children).filter(c => c !== this);
  };
  /**
   * @returns {BellPoint[]}
  */
  getStepPoints() {
    return [
      this.getPrevPoint(),
      ...this.getNearPoints(),
      ...this.getNextPoints(),
    ].filter(p => p);
  };

  /**
   * @returns {BellPoint[]}
   */
  getPath() {
    let point = this;
    const result = [];
    
    while (point instanceof BellPoint) {
      result.push(point);
      point = point.parentElement;
    };

    return result.reverse();
  };

};
class BellRoute extends BellElem {
  
  static _tag = 'bell-route';
  
  static _attrs = ['bind', 'point'];

  static {
    document.addEventListener('DOMContentLoaded', () => {
      Array.from(document.querySelectorAll(this)).forEach(route => {
        Array.from(route.children).forEach(child => child.setAttribute(BellRoute, `${route.bind}`));
      });
    });
  };

  get bind() {
    return this.getAttribute('bind');
  };
  get point() {
    return this.getAttribute('point');
  };

  set bind(bind) {
    this.setAttribute('bind', bind);
  };
  set point(point) {
    this.setAttribute('point', point);
  };

  _transit() {

  };
  step() {

  };
  goto() {

  };

  /**
   * @returns {Bellhop?}
  */
  getHop() {
    return document.querySelector(`${Bellhop}[name=${this.bind}]`);
  };
  /**
   * @returns {BellPoint?}
  */
  getPoint() {
    return this.getHop()?.querySelector?.(`${BellPoint}[name=${this.point}]`);
  };

};
class Bellhop extends BellElem {

  static _tag = 'bell-hop';

  static _attrs = ['name', 'loc'];

  static {
    document.addEventListener('DOMContentLoaded', () => {
      Array.from(document.querySelectorAll(Bellhop)).forEach(bellhop => bellhop.activatePoint(bellhop.getActivePoint()));
      
      Array.from(document.querySelectorAll('button[bell-step]')).forEach(button => button.addEventListener('click', () => {

        const attr = button.getAttribute('bell-step');
        const route = Bellhop.get(button.closest(`*[${BellRoute}]`).getAttribute(BellRoute)).getRoute(attr);

        if (!route) return;
        
        route.step();

      }));
    });
  };

  /**
   * @arg {string} name
   * @returns {Bellhop?}
  */
  static get(name) {
    return document.querySelector(`${this}.${name}`) ?? document.querySelector(`${this}[name=${name}]`) ?? null;
  };

  get loc() {
    return this.getAttribute('loc');
  }
  get name() {
    return this.getAttribute('name');
  };

  set loc(x) {
    this.setAttribute('loc', x);
  };
  set name(x) {
    this.setAttribute('name', x);
  };

  /**
   * @arg {BellPoint} point
  */
  _transit(point) {
    this.activatePoint(point);
  };
  /**
   * @arg {BellPoint|string}
  */
  step(point) {

    if (typeof point === 'string') point = document.querySelector(point);

    /** @type {Bellhop} */
    const bellhop = point?.getHop?.();
    /** @type {BellPoint} */
    const activePoint = bellhop?.getActivePoint?.();

    if (!activePoint) return this;

    if (
      activePoint.getPrevPoint() !== point &&
      !activePoint.getNearPoints().find(p => p === point) &&
      !activePoint.getNextPoints().find(p => p === point)
    ) return this;

    this._transit(point);

    return this;
  };
  /**
   * @arg {BellPoint|string}
  */
  goto(point) {
    return this;
  };

  /**
   * @returns {HTMLElement?}
  */
  getLoc() {
    if (!this.loc) throw new Error();
    return document.querySelector(this.loc);
  };
  /**
   * @arg {string} name
   * @returns {BellPoint?}
  */
  getPoint(name) {
    return this.querySelector(`${BellPoint}[name=${name}]`);
  };
  /**
   * @returns {BellRoute}
  */
  getRoute(name) {
    return this.getPoint(name)?.getRoute();
  };
  /**
   * @returns {BellPoint[]}
  */
  getPoints() {
    return Array.from(this.querySelectorAll(BellPoint));
  };
  /**
   * @returns {BellPoint?}
  */
  getRootPoint() {
    return this.querySelector(`${BellPoint}[root]`);
  };
  /**
   * @returns {BellPoint?}
  */
  getPrevPoint() {
    return this.querySelector(`${BellPoint}[prev]`);
  };
  /**
   * @returns {BellPoint?}
  */
  getActivePoint() {
    return this.querySelector(`${BellPoint}[active]`);
  };

  /**
   * @arg {BellPoint|string} point
  */
  activatePoint(point) {
    if (!point) return this;

    const prevPoint = this.getPrevPoint();

    if (prevPoint) prevPoint.prev = 0;

    const activePoint = this.getActivePoint();

    activePoint.active = 0;
    activePoint.prev = 1;

    if (typeof point === 'string') point = this.getPoint(point);
    
    point.active = 1;
    point.prev = 0;

    Array.from(this.getLoc().children).forEach(child => (child.hasAttribute(BellRoute) && Bellhop.get(child.getAttribute(BellRoute)).getPrevPoint().getRoute().append(child)));
    point.getLoc().append(...Array.from(point.getRoute()?.children ?? []));
    
    return this;
  };

};

(() => {

  const style = document.createElement('style');

  style.innerHTML = `
  
  ${Bellhop},
  ${BellPoint},
  ${BellRoute} {
    display: none;
  }

  `;

  document.head.append(style);

})();