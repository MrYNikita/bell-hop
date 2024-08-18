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
};

/**
 * Bellhop element class.
 * @class
*/
class Bellhop extends BellhopElement {
  static _tag = 'bell-hop';
  constructor() {
    super();  
  };
};

/**
 * Bellhop endpoint class.
 * @class
*/
class BellPoint extends HTMLElement {
  static _tag = 'bell-point';
  constructor() {
    super();
  };
};

/**
 * Bellhop nav button class.
 * @class
*/
class BellButton extends HTMLElement {
  static _tag = 'bell-button';
  constructor() {
    super();
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