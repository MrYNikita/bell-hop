/**
 * Base Bellhop class.
 * @class
*/
class BellhopElement extends HTMLElement {
  /**
   * String defining the tag.
   * @type {string}
   * @protected
  */
  static _tag;
  /**
   * Constructor that initiates the base element.
  */
  constructor() {
    super();
  };

  /**
   * @arg {string} key
   * @arg {string} attr
   * @protected
  */
  _checkSetStrAttr(key, attr) {

    if (!key) {
      throw new Error('Ключ не указан.');
    } else if (typeof key !== 'string') {
      throw new Error('Ключ не является строковым значением.');
    } else if (!attr) {
      throw new TypeError(`Значение аттрибута ${key} не указано.`);
    } else if (typeof attr !== 'string') {
      throw new TypeError(`Значение аттрибута ${key} не является строковым.`);
    };

    this.setAttribute(key, attr);

    return this;
  };

};

class BellWrapper extends BellhopElement {
  
  static _tag = 'bell-wrapper';
  
  constructor() {
    super();
  };
};

class BellEven extends BellhopElement {
  
  static _tag = 'bell-even';

  static get observedAttributes() {
    return ['cond', 'act', 'once', 'delt', 'name'];
  };

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'act': this._act = newValue; break;
      case 'name': this._name = newValue; break;
      case 'cond': this._cond = newValue; break;
      case 'once': this._once = !!newValue; break;
      case 'delt': this._delt = !!newValue; break;
    };
  };
  
  /**
   * @type {import("./type").TBellEven['name']}
   * @protected
  */
  _name;
  /**
   * @type {import("./type").TBellEven['act']}
   * @protected
  */
  _act;
  /**
   * @type {import("./type").TBellEven['cond']}
   * @protected
  */
  _cond;
  /**
   * @type {import("./type").TBellEven['once']}
   * @protected
  */
  _once;
  /**
   * @type {import("./type").TBellEven['delt']}
   * @protected
  */
  _delt;

  constructor() {
    super();
  };

  get act() {
    return new Function('self', this._act);
  };
  get cond() {
    return new Function('self', this._cond);
  };
  get delt() {
    return this._delt;
  };
  get once() {
    return this._once;
  };
  get name() {
    return this._name;
  };

  /**
   * @arg {(self:BellPoint) => void}
  */
  set act(action) {
    this.setAttribute('act', action.toString());
  };
  /**
   * @arg {(self:BellPoint) => void}
  */
  set cond(cond) {
    this.setAttribute('cond', cond.toString());
  };
  /**
   * @arg {string}
  */
  set name(name) {
    this.setAttribute('name', name);
  };
  /**
   * @arg {boolean} isOnce
  */
  set once(isOnce) {
    this._once = !!isOnce;
  };
  /**
   * @arg {boolean} isDelt
  */
  set delt(isDelt) {
    this._delt = !!isDelt;
  };
};

/**
 * Bellhop nav button class.
 * @class
*/
class BellButton extends BellhopElement {

  static _tag = 'bell-button';

  static get observedAttributes() {
    return ['to', 'step', 'ain', 'aex'];
  };

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'to':
      case 'ain':
      case 'aex':
      case 'step': this[`_${name}`] = newValue; break;
    };
  };

  /**
   * @type {string?}
   * @protected
  */
  _ain;
  /**
   * @type {string?}
   * @protected
  */
  _aex;

  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: 'open',
    });

    const slot = document.createElement('slot');
    shadow.append(slot);

    this.addEventListener('click', e => {
      if (this.step && this.to) {
        throw new Error('Invalid configuration for to and step parameters specified.');
      };

      const point = this.getPoint();
      const args = [this, this.ain, this.aex];

      this.to ? point.to(...args) : point.step(...args);
    });

  };

  get to() {
    return this.getAttribute('to');
  };
  get ain() {
    return this._ain;
  };
  get aex() {
    return this._aex;
  };
  get step() {
    return this.getAttribute('step');
  };

  /**
   * @arg {string} to
  */
  set to(to) {

    if (this.getAttribute('step')) {
      throw new Error('The `to` parameter cannot be specified for bell-point, because it already has `step` installed.');
    };

    this._checkSetStrAttr('to', to);
  };
  /**
   * @arg {any} ain
  */
  set ain(ain) {
    this.setAttribute('ain', ain);
  };
  /**
   * @arg {any} aex 
  */
  set aex(aex) {
    this.setAttribute('aex', aex);
  };
  /**
   * @arg {string} step
  */
  set step(step) {

    if (this.to) {
      throw new Error('The `step` parameter cannot be specified for bell-point, because it already has `to` installed.');
    };

    this._checkSetStrAttr('step', step);
  };

  /**
   * Getting parent endpoint.
   * @returns {BellPoint}
  */
  getPoint() {
    return this.closest('bell-point');
  };
  /**
   * @returns {Bellhop}
  */
  getBellhop() {
    return this.closest(Bellhop._tag);
  };

};

/**
 * Bellhop endpoint class.
 * @class
*/
class BellPoint extends BellhopElement {
  static _tag = 'bell-point';

  static get observedAttributes() {
    return ['name', 'prev', 'root', 'active', 'ain', 'aex', 'to', 'time'];
  };

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'ain': this._ain = newValue; break;
      case 'aex': this._aex = newValue; break;
      case 'name': this._name = newValue; break;
      case 'prev': this._prev = !!newValue; break;
      case 'root': this._root = !!newValue; break;
      case 'active': this._active = !!newValue; break;
    };
  };
  
  /**
   * @type {string}
   * @protected
  */
  _name;
  /**
   * @type {boolean}
   * @protected
  */  
  _prev;
  /**
   * @type {boolean}
   * @protected
  */
  _root;
  /**
   * @type {boolean}
   * @protected
  */
  _active;
  /**
   * @type {import("./type").TBellEven[]}
   * @protected
  */
  _evens = [];
  /**
   * Indicates transition state.
   * @type {Promise}
   * @protected
  */
  transit;

  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: 'open',
    });

    const slot = document.createElement('slot');
    shadow.append(slot);

    this.wrapper = document.createElement('bell-wrapper');
    this.append(this.wrapper);
  };

  connectedCallback() {
    const elems = Array.from(this.children).filter(e => !['bell-wrapper', 'bell-point'].includes(e.tagName.toLowerCase())).reverse();
    while(elems.length) {
      const elem = elems.pop();
      this.wrapper.append(elem);
    };
  };

  get to() {
    return this.getAttribute('to');
  };
  get ain() {
    return this.getAttribute('ain');
  };
  get aex() {
    return this.getAttribute('aex');
  };
  get time() {
    return this.getAttribute('time');
  };
  get name() {
    return this._name ?? this.classList[0];
  };
  get root() {
    return this._root;
  };
  get prev() {
    return this._prev;
  };
  get active() {
    return this._active;
  };

  /**
   * @arg {any} to
  */
  set to(to) {
    this.setAttribute('to', to);
  };
  /**
   * @arg {any} ain
  */
  set ain(ain) {
    this.setAttribute('ain', ain);
  };
  /**
   * @arg {any} aex 
  */
  set aex(aex) {
    this.setAttribute('aex', aex);
  };
  /**
   * @arg {any} time 
  */
  set time(time) {
    this.setAttribute('time', time);
  };
  /**
   * @arg {string} name
  */
  set name(name) {
    this._checkSetStrAttr('name', name);
  };
  /**
   * @arg {boolean} prev
  */
  set prev(prev) {
    this.setAttribute('prev', prev ? '' : null);
  };
  /**
   * @arg {boolean} root
  */
  set root(root) {
    this.setAttribute('root', root ? '' : null);
  };
  /**
   * @arg {boolean} active
  */
  set active(active) {
    active ? this.activate() : this.deactivate();
  };

  /**
   * @arg {BellPoint} point
   * @arg {string?} ain
   * @arg {string?} aex
   * @protected
  */
  _transit(point, ain, aex) {

    const bellhop = this.getBellhop();

    ain = ain ? ain : point.ain ? point.ain : bellhop.ain ? bellhop.ain : null;
    aex = aex ? aex : this.aex ? this.aex : bellhop.aex ? bellhop.aex : null;

    [ain ? [point, ain] : null, aex ? [this, aex] : null].filter(e => e).forEach(entry => {
      const [p, a] = entry;
      p.transit = new Promise(resolve => {
        let listener = null;
        p.setAttribute('transit', '');
        p.wrapper.classList.add(a);
        p.wrapper.addEventListener('animationend', listener = () => {
          p.wrapper.classList.remove(a);
          p.wrapper.removeEventListener('animationend', listener);
          p.removeAttribute('transit');
          resolve();
          this.getBellhop().activatePoint(point);
        });
      });
    });

    return this;
  };
  /**
   * Jump to the specified end point if possible.
   * @arg {BellButton|BellPoint|string} to
   * @arg {string?} ain
   * @arg {string?} aex
  */
  to(to, ain, aex) {

    const bellhop = this.getBellhop();

    if (to instanceof BellButton) to = to.getAttribute('to');
    if (typeof to === 'string') to = bellhop.getPoint(to);

    this._transit(to, ain, aex);

    return this;
  };
  /**
   * Take a step to the specified end point, if possible.
   * @arg {BellButton|BellPoint|string} step
   * @arg {string?} ain
   * @arg {string?} aex
  */
  step(step, ain, aex) {

    const parentPoint = this.parentElement;

    if (step instanceof BellButton) step = step.getAttribute('step');
    if (typeof step === 'string') step = this.getBellhop().getPoint(step);

    if (parentPoint instanceof BellPoint && parentPoint === step) {
      this._transit(parentPoint, ain, aex);
      return this;
    };

    /** @type {BellPoint?} */
    const neighbourPoint = Array.from(parentPoint.children).find(point => point=== step);

    if (neighbourPoint) {
      this._transit(neighbourPoint, ain, aex);
      return this;
    };

    const innerPoint = Array.from(this.children).find(point => point instanceof BellPoint && point === step);

    if (innerPoint) {
      this._transit(innerPoint, ain, aex);
    };

    return this;
  };

  /**
   * Adding new events.
   * @arg {...this['_evens'][0]} evens
  */
  addEven(...evens) {
    evens.filter(e => typeof e === 'object' &&  typeof e.act === 'function').forEach(e => this._evens.push(e));
    return this;
  };

  /**
   * Endpoint activation.
  */
  activate() {
    this.removeAttribute('prev');
    this.setAttribute('active', '');

    for (let index = 0; index < this._evens.length; index++) {
      
      const even = this._evens[index];
      
      if (even.delt) {
        this._evens.splice(index, 1);
        continue;
      } else if (typeof even.cond === 'function' && !even.cond(this)) {
        continue;
      };

      even.act();

      if (even.once) this._evens.splice(index, 1);
    };

    const evensInPoint = Array.from(this.children).filter(e => e instanceof BellEven);

    for (const evenElem of evensInPoint) {
      evenElem.act(this);
    };

    const to = this.getAttribute('to');
    const bellhop = this.getBellhop();

    if (this.time && to) {
      setTimeout(() => this.to(bellhop.getPoint(to)), this.time -= 0);
    };
    
    return this;
  };
  /**
   * Endpoint deactivation.
  */
  deactivate() {
    const prevPoint = this.getBellhop().getPrevPoint();
    if (prevPoint) prevPoint.removeAttribute('prev');
    this.removeAttribute('active');
    this.setAttribute('prev', '');
    return this;
  };

  /**
   * Getting a bellhop.
   * @returns {Bellhop}
  */
  getBellhop() {
    return this.closest(Bellhop._tag);
  };
  /**
   * Get all next endpoints.
   * @returns {BellPoint[]}
  */
  getNextPoints() {
    return Array.from(this.children).filter(e => e instanceof BellButton && e.step).map(b => b.getBellhop().getPoint(b.step));
  };
  /**
   * Get all endpoints where it is possible to move through a step.
   * @returns {BellPoint[]}
  */
  getPassablePoints() {
    const result = [];

    if (this.parentElement instanceof BellPoint) result.push(this.parentElement);

    for (const neighbourPoint of this.parentElement.children) if (neighbourPoint instanceof BellPoint) result.push(neighbourPoint);

    for (const childrenPoint of this.children) if (childrenPoint instanceof BellPoint) result.push(childrenPoint);

    return result;
  };

};

/**
 * Bellhop element class.
 * @class
*/
class Bellhop extends BellhopElement {
  static _tag = 'bell-hop';
  
  static get observedAttributes() {
    return ['ain', 'aex'];
  };

  static {

    // Creating a stylistic library block.
    const style = document.createElement('style');
    document.head.append(style);

    style.innerHTML = `

    ${Bellhop._tag},
    ${BellPoint._tag},
    ${BellWrapper._tag} {
      gap: 5px;
      display: flex;
      flex-flow: column;  
      align-items: center;
      justify-content: center;
    }

    ${BellPoint._tag},
    ${BellWrapper._tag} {
      width: 100%;
      height: 100%;
    }

    ${Bellhop._tag} {
      position: relative;
    }

    ${BellPoint._tag} {
      & {
        position: absolute;
      }
      &[transit] {
        pointer-events: none;
      }
      &:not(
        [active],
        [transit],
        :has(
          ${BellPoint._tag}[active],
          ${BellPoint._tag}[transit]
        )
      ) {
        & {
          display: none;
        }
      }
      &:not([transit]):has(
        ${BellPoint._tag}[active],
        ${BellPoint._tag}[transit]
      ) {
        & > ${BellWrapper._tag} {
          display: none;
        }
      }
    }

    `;
  };

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'ain': this._ain = newValue; break;
      case 'aex': this._aex = newValue; break;
    };
  };

  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: 'open',
    });

    const slot = document.createElement('slot');
    shadow.append(slot);
  };

  get ain() {
    return this.getAttribute('ain');
  };
  get aex() {
    return this.getAttribute('aex');
  };

  /**
   * @arg {any} ain
  */
  set ain(ain) {
    this.setAttribute('ain', ain);
  };
  /**
   * @arg {any} aex 
  */
  set aex(aex) {
    this.setAttribute('aex', aex);
  };

  /**
   * Moves from the active end point to the specified one.
   * @arg {BellPoint} to
  */
  stepTo(to) {
    const steps = this.getSteps(null, to);

    if (steps.length) for (let index = 0; index < steps.length; index++) {
      const point = steps[0];
    };

    return this;
  };

  /**
   * @arg {BellPoint} point
  */
  activatePoint(point) {
    this.deactivatePoint(this.getActivePoint());
    point.activate();
    return this;
  };
  /**
   * @arg {BellPoint} point
  */
  deactivatePoint(point) {
    point.deactivate();
    return this;
  };

  /**
   * Getting all possible paths from the root element.
   * @arg {BellPoint} root
   * @arg {BellPoint?} to
  */
  getSteps(root = this.getRootPoint(), to) {
    const rootPoint = root;

    if (!rootPoint) {
      throw new Error(`It is impossible to define a root end point from which paths could be drawn.`);
    };

    const paths = [];
    const nextPaths = [[rootPoint]];

    while (nextPaths.length) {

      const path = nextPaths.pop();
      const lastpoint = path.at(-1);
      const nextPoints = lastpoint.getNextPoints();

      for (const point of nextPoints) {

        if (path.includes(point)) {
          paths.push(path);
          continue;
        };
        nextPaths.push([...path, point]);
      };
    };

    return to ? paths.filter(path => path.includes(to)) : paths;

  };

  /**
   * Getting endpoint by name.
   * @arg {string} name
   * @returns {BellPoint}
  */
  getPoint(name) {
    return this._getUniquePoint(`name=${name}`) ?? this._getUniquePointByCls(name);
  };
  /**
   * Get all possible end points.
   * @returns {BellPoint[]}
  */
  getPoints() {
    return Array.from(this.querySelectorAll(`${BellPoint._tag}:not(${Bellhop._tag} ${Bellhop._tag} ${BellPoint._tag})`));
  };
  /**
   * Getting the root endpoint.
   * @returns {BellPoint}
  */
  getRootPoint() {
    return this._getUniquePoint('root');
  };
  /**
   * Getting the active endpoint.
   * @returns {BellPoint}
  */
  getActivePoint() {
    return this._getUniquePoint('active');
  };
  /**
   * Getting the prev endpoint.
  */
  getPrevPoint() {
    return this._getUniquePoint('prev');
  };

  _getUniquePoint(attr) {
    return this.querySelector(`${BellPoint._tag}[${attr}]:not(${Bellhop._tag} ${Bellhop._tag} ${BellPoint._tag}[${attr}])`);
  };
  _getUniquePointByCls(cls) {
    return this.querySelector(`${BellPoint._tag}.${cls}:not(${Bellhop._tag} ${Bellhop._tag} ${BellPoint._tag}.${cls})`);
  };

};

// Define bellhop tag's.
[
  Bellhop,
  BellEven,
  BellPoint,
  BellButton,
  BellWrapper,
].forEach(c => customElements.define(c._tag, c));

/**
 * @file Bellhop library index file.
 * @copyright Yahin Nikita Artemovich 2024
*/