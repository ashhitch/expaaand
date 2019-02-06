import { hasClass, debounced } from './utils';
export interface IBreakPoint {
  [key: string]: {
    active: boolean;
    size: number;
  };
}

export interface IOptions {
  targetElm?: HTMLElement;
  group?: string;
  bodyClass?: string;
  closeElm?: HTMLElement;
  activeClass?: string;
  initClass?: string;
  enableToggle?: boolean;
  breakpoints?: IBreakPoint[];
}

export interface IOptionsDefaults {
  targetElm?: HTMLElement;
  group: string;
  bodyClass: string;
  closeElm?: HTMLElement;
  activeClass: string;
  initClass: string;
  enableToggle: boolean;
  breakpoints: IBreakPoint[];
}

export class Expaaand {
  public isActive: boolean;
  public isInitialised: boolean;
  public triggerElm: HTMLElement;
  public closeElm: HTMLElement | undefined;
  public targetElm: HTMLElement | undefined;
  public options: IOptionsDefaults;
  public group: string;
  public bodyClass: string;
  public enableToggle: boolean;
  private activeBreakpoint: IBreakPoint;

  private defaults: IOptionsDefaults = {
    activeClass: 'is-active',
    bodyClass: 'data-expaaand-active',
    breakpoints: [
      {
        xl: {
          active: true,
          size: 1200,
        },
      },
      {
        lg: {
          active: true,
          size: 992,
        },
      },
      {
        md: {
          active: true,
          size: 768,
        },
      },
      {
        sm: {
          active: true,
          size: 480,
        },
      },
      {
        xs: {
          active: true,
          size: 0,
        },
      },
    ],
    enableToggle: false,
    group: 'data-expaaand-group',
    initClass: 'is-expaaand-init',
  };

  constructor(elm: HTMLElement, opts: IOptions) {
    // Options
    this.options = { ...this.defaults, ...opts };

    // Trigger element
    this.triggerElm = elm;

    // Target element`
    this.targetElm = this.getOption('data-expaaand', this.options.targetElm);

    // Status
    this.isActive = false;
    this.isInitialised = false;

    this.group = this.checkAttribute(this.options.group)
      ? (this.checkAttribute(this.options.group) as string)
      : 'global';

    this.bodyClass = this.checkAttribute(this.options.bodyClass)
      ? (this.checkAttribute(this.options.bodyClass) as string)
      : `expaaand-active-${this.group}`;

    this.enableToggle = this.checkAttribute('data-expaaand-toggle') === 'true' ? true : this.options.enableToggle;

    this.closeElm = this.getOption('data-expaaand-close', this.options.closeElm);

    this.activeBreakpoint = this.options.breakpoints[0];

    this.init();
  }

  public get breakpoint(): IBreakPoint {
    return this.activeBreakpoint;
  }

  public set breakpoint(breakpoint: IBreakPoint) {
    if (breakpoint && this.breakpoint !== breakpoint) {
      this.activeBreakpoint = breakpoint;
    }
  }

  public debouncedOnResize = debounced(() => this.resize(), 150);

  /**
   * Initialise plugin
   *
   *
   * @memberOf Expaaand
   */
  public init() {
    if (this.targetElm) {
      this.checkResponsive();
      this.events();
      this.isInitialised = true;
    } else {
      console.warn('Expaaand Target Element not found');
    }
  }

  /**
   * Start the show or ide process
   *
   * @param {Event} evt
   *
   * @memberOf Expaaand
   */
  public expand(evt: Event) {
    if (evt) {
      evt.preventDefault();
    }

    this.fireEvent('expaaand:start');

    // Show or toggle
    if (!this.isActive) {
      this.show();
    } else if (this.enableToggle) {
      this.hide();
    }

    this.fireEvent('expaaand:end');
  }

  /**
   * Check if any should be open on start
   *
   * @returns {boolean}
   *
   * @memberOf Expaaand
   */
  public checkActive(): boolean {
    if (hasClass(this.triggerElm, this.options.activeClass) && this.checkResponsive()) {
      this.show();
      return true;
    }
    return false;
  }

  public checkResponsive(): boolean {
    const windowWidth = window.innerWidth;
    const active = this.options.breakpoints.find(
      breakpoint => windowWidth >= breakpoint[Object.keys(breakpoint)[0]].size,
    ) as IBreakPoint;

    if (active) {
      this.breakpoint = active;
    }

    const key = Object.keys(this.breakpoint as IBreakPoint)[0];

    return this.breakpoint[key].active;
  }

  /**
   * Adds active classes AKA hides element
   *
   * @param {Event} [evt]
   * @returns
   *
   * @memberOf Expaaand
   */
  public show(evt?: Event) {
    if (evt) {
      evt.preventDefault();
    }

    if (!this.targetElm) {
      return;
    }

    this.triggerElm.classList.add(this.options.activeClass);
    this.targetElm.classList.add(this.options.activeClass);
    document.body.classList.add(this.options.bodyClass);
    this.triggerElm.setAttribute('aria-expanded', 'true');
    this.isActive = true;
  }

  /**
   * Removes active classes AKA hides element
   *
   * @param {Event} [evt]
   * @returns {void}
   *
   * @memberOf Expaaand
   */
  public hide(evt?: Event): void {
    if (evt) {
      evt.preventDefault();
    }

    if (!this.targetElm) {
      return;
    }

    this.triggerElm.classList.remove(this.options.activeClass);
    this.targetElm.classList.remove(this.options.activeClass);
    document.body.classList.remove(this.options.bodyClass);
    this.triggerElm.setAttribute('aria-expanded', 'false');
    this.isActive = false;

    this.fireEvent('expaaand:hidden');
  }

  /**
   * takes custom event and decides if to hide
   *
   * @param {CustomEvent} evt
   *
   * @memberOf Expaaand
   */
  public broadcast(evt: CustomEvent): void {
    if (this.isActive && this.triggerElm !== evt.detail.triggerElm && this.group === evt.detail.group) {
      this.hide();
    }
  }

  /**
   * Check need to auto hide on snap points
   *
   *
   * @memberOf Expaaand
   */
  public resize(): void {
    if (!this.checkResponsive() && this.isActive) {
      this.hide();
    }
  }

  /**
   * Fire browser event
   *
   * @private
   * @param {string} eventName
   * @param {object} [data]
   *
   * @memberOf Expaaand
   */
  private fireEvent(eventName: string, data?: object) {
    const defaultEventData = {
      group: this.group,
      isActive: this.isActive,
      targetElm: this.targetElm,
      triggerElm: this.triggerElm,
    };

    // Merge defaults and overrides
    const detail = {
      ...defaultEventData,
      ...data,
    };

    const event = new CustomEvent(eventName, {
      detail,
    });

    document.body.dispatchEvent(event);
  }

  /**
   * Returns value of data attribute
   *
   * @private
   * @param {string} attribute
   * @returns {*}
   *
   * @memberOf Expaaand
   */
  private checkAttribute(attribute: string): any {
    return this.triggerElm.getAttribute(attribute);
  }

  /**
   * Get element based on passed options
   *
   * @private
   * @param {string} attribute
   * @param {HTMLElement} [element]
   * @returns {(HTMLElement | undefined)}
   *
   * @memberOf Expaaand
   */
  private getOption(attribute: string, element?: HTMLElement): HTMLElement | undefined {
    const checkAttr = this.checkAttribute(attribute);
    if (checkAttr && document.querySelector(checkAttr)) {
      return document.querySelector(checkAttr) as HTMLElement;
    } else if (element) {
      return element as HTMLElement;
    }

    return;
  }

  /**
   * Event Listeners
   *
   * @private
   *
   * @memberOf Expaaand
   */
  private events(): void {
    // Click to toggle
    this.triggerElm.addEventListener('click', evt => this.expand(evt));

    // Check id to hide on resize
    window.addEventListener('resize', e => this.debouncedOnResize(e));

    // Listen for other expanders opening
    document.body.addEventListener('expaaand:start', evt => this.broadcast(evt as CustomEvent));

    // IF we have a close element bind it
    if (this.closeElm) {
      this.closeElm.addEventListener('click', evt => this.hide(evt));
    }
  }
}
