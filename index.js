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

    this[key] = attr;

    return this;
  };

};

/**
 * Bellhop nav button class.
 * @class
*/
class BellButton extends BellhopElement {

  static _tag = 'bell-button';

  /**
   * @type {string?}
  */
  to = null;
  /**
   * @type {string?}
  */
  next = null;


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

      const to = this.getAttribute('to');

      to ? this.getPoint().to(this) : this.getPoint().step(this);

    });

  };

  get to() {
    return this.getAttribute('to');
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

    return this._checkSetStrAttr('to', to);
  };

  /**
   * @arg {string} step
  */
  set step(step) {

    if (this.to) {
      throw new Error('The `step` parameter cannot be specified for bell-point, because it already has `to` installed.');
    };

    return this._checkSetStrAttr('step', step);
  };

  /**
   * Getting parent endpoint.
   * @returns {BellPoint}
  */
  getPoint() {
    return this.parentElement;
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
  
  /**
   * @type {string}
  */
  name;

  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: 'open',
    });

    const slot = document.createElement('slot');
    shadow.append(slot);
  };

  get name() {
    return this.getAttribute('name');
  };

  get root() {
    return !!this.getAttribute('root');
  };

  /**
   * @arg {string} name
  */
  set name(name) {
    return this._checkSetStrAttr('name', name);
  };

  /**
   * Jump to the specified end point if possible.
   * @arg {BellButton|BellPoint|string} to
  */
  to(to) {

    const bellhop = this.getBellhop();

    if (to instanceof BellButton) to = to.getAttribute('to');
    if (typeof to === 'string') to = bellhop.getPoint(to);

    this.getBellhop().activatePoint(to);

    return this;
  };

  /**
   * Take a step to the specified end point, if possible.
   * @arg {BellButton|BellPoint|string} step
  */
  step(step) {

    const bellhop = this.getBellhop();
    const parentPoint = this.parentElement;

    if (step instanceof BellButton) step = step.getAttribute('step');
    if (typeof step === 'string') step = bellhop.getPoint(step);

    if (parentPoint instanceof BellPoint && parentPoint === step) {
      bellhop.activatePoint(parentPoint);
      return this;
    };

    /** @type {BellPoint?} */
    const neighbourPoint = Array.from(this.parentElement.children).find(point => point=== step);

    if (neighbourPoint) {
      bellhop.activatePoint(neighbourPoint);
      return this;
    };

    const innerPoint = Array.from(this.children).find(point => point instanceof BellPoint && point === step);

    if (innerPoint) {
      bellhop.activatePoint(innerPoint);
    };

    return this;
  };

  /**
   * Endpoint activation.
  */
  activate() {
    this.setAttribute('active', '');
    return this;
  };
  /**
   * Endpoint deactivation.
  */
  deactivate() {
    this.removeAttribute('active');
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
  
  static {

    // Creating a stylistic library block.
    const style = document.createElement('style');
    document.head.append(style);
    style.innerHTML = `
      ${BellPoint._tag} {
        &[active] {
          & > ${BellPoint._tag} {
            display: none;
          }
        }
        &:not([active], :has([active])) {
          display: none;
        }
        &:not([active]):has([active]) {
          & > :not(${BellPoint._tag}) {
            display: none;
          }
        }
      }

      ${Bellhop._tag},
      ${Bellhop._tag} ${BellPoint._tag} {
        & {
          width: 100%;
          height: 100%;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
        }
      }
    `;
  };

  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: 'open',
    });

    const slot = document.createElement('slot');
    shadow.append(slot);
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
    return this._getUniquePoint(`name=${name}`);
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

  _getUniquePoint(attr) {
    return this.querySelector(`${BellPoint._tag}[${attr}]:not(${Bellhop._tag} ${Bellhop._tag} ${BellPoint._tag}[${attr}])`);
  };

};

// Define bellhop tag's.
[
  Bellhop,
  BellPoint,
  BellButton,
].forEach(c => customElements.define(c._tag, c));

/**
 * @file Bellhop library index file.
 * @copyright Yahin Nikita Artemovich 2024
*/