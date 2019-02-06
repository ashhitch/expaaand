/**
 * Checks if class exists on element
 *
 * @param {HTMLElement} elm
 * @param {string} className
 * @returns {boolean}
 */
export const hasClass = (elm: HTMLElement, className: string): boolean => {
  if (typeof className !== 'string') {
    throw new TypeError('Expected a string as second argument');
  }

  // New browsers
  if (elm.classList) {
    return elm.classList.contains(className);
  }

  // Older Browsers
  return new RegExp('(^| )' + className + '( |$)', 'gi').test(elm.className);
};

export const debounced = (fn: Function, delay: number = 150) => {
  let timerId: any;
  return function(...args: any[]) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
};
