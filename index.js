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
  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: 'open',
    });

    const slot = document.createElement('slot');
    shadow.append(slot);
  };
};

/**
 * Bellhop endpoint class.
 * @class
*/
class BellPoint extends BellhopElement {
  static _tag = 'bell-point';
  
  constructor() {
    super();

    const shadow = this.attachShadow({
      mode: 'open',
    });

    const slot = document.createElement('slot');
    shadow.append(slot);
  };

  get to() {
    return this.getAttribute('to');
  };

  get name() {
    return this.getAttribute('name');
  };

  get next() {
    return this.getAttribute('next');
  }

  /**
   * @arg {string} to
  */
  set to(to) {

    if (this.getAttribute('next')) {
      throw new Error('Параметр `to` нельзя указать для bell-point, т.к. у него уже установлен `next`.');
    };

    return this._checkSetStrAttr('to', to);
  };

  /**
   * @arg {string} name
  */
  set name(name) {
    return this._checkSetStrAttr('name', name);
  }

  /**
   * @arg {string} next
  */
  set next(next) {

    if (this.to) {
      throw new Error('Параметр `next` нельзя указать для bell-point, т.к. у него уже установлен `to`.');
    };

    return this._checkSetStrAttr('next', next);
  };

  /**
   * 
  */
  activate() {
    this.setAttribute('activate', '');
    return this;
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

  getActivePoint() {
    return this.querySelector(`${BellPoint._tag}[active]`);
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