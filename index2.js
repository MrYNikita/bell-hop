document.addEventListener('DOMContentLoaded', () => {

    // Define bell-hop tag's.
    [
      Bellhop,
      BellPod,
      BellEven,
      BellPoint,
      BellButton,
      BellWrapper,
    ].forEach(c => customElements.define(c._tag, c));
  
  });
  
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
  
  class BellPod extends BellhopElement {
    
    static _tag = 'bell-pod';
    
    static get observedAttributes() {
      return ['name', 'points'];
    };
  
    /**
     * @type {HTMLElement}
    */
    elem;
    /**
     * @type {HTMLElement?}
     * @protected
    */
    _clone;
  
    constructor() {
      super();
    };
  
    connectedCallback() {
      if (this.children[1]) throw new Error('More than 1 element specified for Bell-pod element.');
      if (this.parentElement.tagName.toLowerCase() !== BellWrapper._tag) return;
      this.elem = this.children[0];
      this.parentElement.append(this.elem);
    };
  
    get name() {
      return this.getAttribute('name');
    };
    /**
     * @returns {string}
    */
    get points() {
      return this.getAttribute('points').split(' ');
    };
  
    /**
     * @arg {string?} name
    */
    set name(name) {
      if (!name) {
        this.removeAttribute('name');
        return;
      } else if (typeof name === 'string') {
        this.setAttribute('name', name);
        return;
      };
  
      throw new TypeError('The name specified for bell-pod are of an invalid type.');
  
    };
    /**
     * @arg {(string|string[])?} points
    */
    set points(points) {
      if (!points) {
        this.removeAttribute('points');
        return;
      } else if (points instanceof Array) {
        this.setAttribute('points', points.join(' '));
        return;
      } else if (typeof points === 'string') {
        this.setAttribute('points', points);
        return;
      };
  
      throw new TypeError('The endpoints specified for bell-pod are of an invalid type.');
  
    };
  
  };
  
  class BellEven extends BellhopElement {
    
    static _tag = 'bell-even';
  
    static get observedAttributes() {
      return ['cond', 'act', 'once', 'delt', 'name'];
    };
    
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
      return this.getAttribute('delt');
    };
    get once() {
      return this.getAttribute('once');
    };
    get name() {
      return this.getAttribute('name');
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
  
  class BellWrapper extends BellhopElement {
    
    static _tag = 'bell-wrapper';
    
    constructor() {
      super();
    };
  };
  
  /**
   * Bellhop nav button class.
   * @class
  */
  class BellButton extends BellhopElement {
  
    static _tag = 'bell-button';
  
    static get observedAttributes() {
      return ['goto', 'step', 'ain', 'aex', 'bind'];
    };
  
    constructor() {
      super();
  
      const shadow = this.attachShadow({
        mode: 'open',
      });
  
      const slot = document.createElement('slot');
      shadow.append(slot);
  
      this.addEventListener('click', e => {
        if (this.step && this.goto) {
          throw new Error('Invalid configuration for to and step parameters specified.');
        };
  
        const point = this.getPoint();
        const args = [this, this.ain, this.aex];
  
        this.goto ? point.goto(...args, this.bind) : point.step(...args);
      });
  
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
    get step() {
      return this.getAttribute('step');
    };
    get bind() {
      return this.getAttribute('bind');
    };
    get goto() {
      return this.getAttribute('goto');
    };
  
    /**
     * @arg {any} goto
    */
    set goto(goto) {
  
      if (this.getAttribute('step')) {
        throw new Error('The `goto` parameter cannot be specified for bell-point, because it already has `step` installed.');
      };
  
      this._checkSetStrAttr('goto', goto);
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
     * @arg {any} bind
    */
    set bind(bind) {
      this.setAttribute('bind', bind);
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
      return this.getAttribute('name') ?? this.classList[0];
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
     * @arg {string?} bind
     * @arg {boolean} isSkip
     * @protected
    */
    _transit(point, ain, aex, bind, isSkip) {
  
      const bellhop = this.getBellhop();
      const bellhopBind = this.getBellhop(bind);
      const isDeep = bellhop !== bellhopBind && bellhop.contains(bellhopBind);
      const endpoint = isDeep ? point : null;
      
      ain = ain ? ain : point.ain ? point.ain : isDeep ? bellhop?.ain : bellhopBind?.ain ?? null;
      aex = aex ? aex : this.aex ? this.aex : isDeep ? bellhop?.aex : bellhopBind?.aex ?? null;
  
      if (isDeep) {
        bellhopBind.activatePoint(point);
        const pointLast = this.getRootBellhop().getPoints().find(p => p.contains(bellhopBind));
        
        /** @type {BellPoint} */
        let pointNow = bellhopBind.closest(BellPoint._tag);
  
        while (pointLast !== pointNow) {
          const bellhop = pointNow.getBellhop();
          bellhop.activatePoint(pointNow);
          pointNow = bellhop.closest(BellPoint._tag);
        };
        
        point = pointNow;
        this.deactivate();
      };
  
      // Transfer Pod's
  
      const transferPoint = endpoint ?? point;
  
      for (const pod of transferPoint.getRootBellhop().querySelectorAll(`bell-pod[points~=${transferPoint.name}]`)) {
        transferPoint.getWrapper().append(pod.elem);
        pod?._clone?.remove?.();
        if (pod.points.includes(this.name)) this.getWrapper().append(pod._clone = pod.elem.cloneNode(true));
      };
  
      if ((ain || aex) && !isSkip) [ain ? [point, ain] : null, aex ? [bind && !isDeep ? this.getBellhop().closest(BellPoint._tag) : this, aex] : null].filter(e => e).forEach(entry => {
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
            bellhopBind.activatePoint(point);
            (isDeep && endpoint.activate());
          });
        });
      });
      else {
        bellhopBind.activatePoint(point);
        (isDeep && endpoint.activate());
      };
  
      return this;
    };
    /**
     * Jump to the specified end point if possible.
     * @arg {BellButton|BellPoint|string} to
     * @arg {string?} ain
     * @arg {string?} aex
     * @arg {boolean?} isSkip
    */
    goto(to, ain, aex, bind, isSkip) {
  
      const bellhop = this.getBellhop(bind);
  
      if (to instanceof BellButton) to = to.getAttribute('goto');
      if (typeof to === 'string') to = bellhop.getPoint(to);
  
      this._transit(to, ain, aex, bind, isSkip);
  
      return this;
    };
    /**
     * Take a step to the specified end point, if possible.
     * @arg {BellButton|BellPoint|string} step
     * @arg {string?} ain
     * @arg {string?} aex
     * @arg {boolean?} isSkip
    */
    step(step, ain, aex, isSkip) {
  
      const parentPoint = this.parentElement;
  
      if (step instanceof BellButton) step = step.getAttribute('step');
      if (typeof step === 'string') step = this.getBellhop().getPoint(step);
  
      if (parentPoint instanceof BellPoint && parentPoint === step) {
        this._transit(parentPoint, ain, aex, null, isSkip);
        return this;
      };
  
      /** @type {BellPoint?} */
      const neighbourPoint = Array.from(parentPoint.children).find(point => point === step);
  
      if (neighbourPoint) {
        this._transit(neighbourPoint, ain, aex, null, isSkip);
        return this;
      };
  
      const innerPoint = Array.from(this.children).find(point => point instanceof BellPoint && point === step);
  
      if (innerPoint) {
        this._transit(innerPoint, ain, aex, null, isSkip);
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
        setTimeout(() => this.goto(bellhop.getPoint(to)), this.time -= 0);
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
     * @arg {string?} bind
     * @returns {Bellhop}
    */
    getBellhop(bind = '') {
  
      if (bind) {
        const bellhop = this.getRootBellhop();
  
        if (bellhop.name === bind) return bellhop;
        
        const bellhopBind = bellhop.querySelector(`${Bellhop._tag}.${bind}`) ?? bellhop.querySelector(`${Bellhop._tag}[name=${bind}]`);
      
        if (bellhopBind) return bellhopBind;
      };
  
      return this.closest(Bellhop._tag);
    };
    /**
     * @returns {BellWrapper}
    */
    getWrapper() {
      return Array.from(this.children).find(c => c instanceof BellWrapper);
    };
    /**
     * Getting a root bellhop.
     * @returns {Bellhop?}
    */
    getRootBellhop() {
      return this.closest(`${Bellhop._tag}:not(${Bellhop._tag} ${Bellhop._tag})`);
    };
    /**
     * Get all next endpoints.
     * @returns {BellPoint[]}
    */
    getNextPoints() {
      return Array.from(this.getWrapper().querySelectorAll(BellButton._tag)).filter(e => e.step).map(b => b.getBellhop().getPoint(b.step));
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
      return ['ain', 'aex', 'name'];
    };
  
    static {
      document.addEventListener('DOMContentLoaded', () => {
        for (const b of document.querySelectorAll(Bellhop._tag)) b._setActivePointByUrl();
      });
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
    get name() {
      return this.getAttribute('name') ?? this.classList[0] ?? null;
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
     * @arg name
    */
    set name(name) {
      this.setAttribute('name', name);
    };
  
    /**
     * Moves from the active end point to the specified one.
     * @arg {BellPoint} to
     * @arg {boolean?} isSkip
    */
    async stepTo(to, isSkip) {
      const paths = this.getSteps(to);
      const path = paths.find(path => path.includes(this.getActivePoint()));
  
      if (!path) {
        throw new Error(`The step To move is not possible because there is no possible path from the current point to the final point.`);
      };
  
      while (path.length !== 1) {
        path.shift().step(path[0], null, null, isSkip);
        if (!isSkip) await path[0].transit;
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
    getSteps(to, root = this.getRootPoint()) {
      const rootPoint = root;
  
      if (!rootPoint) {
        throw new Error(`It is impossible to define a root end point from which paths could be drawn.`);
      };
  
      const paths = [];
      const nextPaths = [[rootPoint]];
  
      while (nextPaths.length) {
  
        const path = nextPaths.pop();
        /** @type {BellPoint} */
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
      return Array.from(this.querySelectorAll(this._getSelector()));
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
  
    /**
     * 
    */
    _setActivePointByUrl() {
      const url = new URL(window.location.href);
      const params = url.searchParams;
  
      const isSkip = !!params.get(`bell-hop-${this.name}-skip`);
  
      const _moveStr = `bell-hop-${this.name}-`;
      const to = params.get(_moveStr + 'goto');
      const step = params.get(_moveStr + 'step');
  
      if (to) this.getActivePoint().goto(to, null, null, null, isSkip);
      else if (step) this.stepTo(this.getPoint(step), isSkip);
  
      return this;
    };
  
    /**
     * @protected
     * @arg {string} insert
    */
    _getSelector(insert = '') {
      const selector = `${Bellhop._tag}${this.getAttribute('name') ? `[name=${this.name}]` : this.classList[0] ? `.${this.classList[0]}` : ''}`;
    
      return `${selector} ${BellPoint._tag}${insert}:not(${selector} ${Bellhop._tag} ${BellPoint._tag})`;
    };
    /**
     * @protected
    */
    _getUniquePoint(attr) {
      return this.querySelector(this._getSelector(`[${attr}]`));
    };
    /**
     * @protected
    */
    _getUniquePointByCls(cls) {
      return this.querySelector(this._getSelector(`.${cls}`));
    };
  
  };
  
  (() => {
  
    // Define bell-hop style's.
    const style = document.createElement('style');
    document.head.append(style);
  
    style.innerHTML = `
  
    ${BellPod._tag} {
      display: none;
    }
  
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
      &:not([active], [transit]):has(
        ${BellPoint._tag}[active],
        ${BellPoint._tag}[transit]
      ) {
        & > ${BellWrapper._tag} {
          display: none;
        }
      }
    }
  
    ${Bellhop._tag} ${BellPoint._tag}:not([active], [transit]):has(
      ${Bellhop._tag} ${BellPoint._tag}[active],
      ${Bellhop._tag} ${BellPoint._tag}[transit]
    ) {
      display: none;
    }
  
    `;
  
  })();
  
  /**
   * @file Bellhop library index file.
   * @copyright Yahin Nikita Artemovich 2024
  */