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
 * Bellhop nav button class.
 * @class
*/
class BellButton extends BellhopElement {
  static _tag = 'bell-button';
  constructor() {
    super();
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
  };
};

/**
 * Bellhop element class.
 * @class
*/
class Bellhop extends BellhopElement {
  static _tag = 'bell-hop';
  
  static {
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