const ERROR_MESSAGES = {
  required: 'Required',
  pattern: {
    name: `Enter English letters and "-"<br>The first letter is capitalized`,
    color: `Enter HEX color`,
  },
  minLength: `Min length `,
  maxLength: `Max length `,
};

const checkRequired = (el: HTMLInputElement, info: HTMLDivElement): boolean => {
  let result = true;
  const clone = info;

  if (el.required && el.value === '') {
    result = false;
    clone.innerHTML = ERROR_MESSAGES.required;
  }

  return result;
};

const checkPattern = (el: HTMLInputElement, info: HTMLDivElement): boolean => {
  let result = true;
  const clone = info;

  if ('pattern' in el && el.pattern !== '' && typeof el.pattern === 'string') {
    const regex = new RegExp(el.pattern);
    result = regex.test(el.value);

    if (!result) {
      if (el.pattern === '^#[A-Fa-f0-9]{6}$') {
        clone.innerHTML = ERROR_MESSAGES.pattern.color;
      } else {
        clone.innerHTML = ERROR_MESSAGES.pattern.name;
      }
    }
  }
  return result;
};

const checkMinLength = (el: HTMLInputElement, info: HTMLDivElement): boolean => {
  let result = true;
  const clone = info;

  if ('minLength' in el) {
    result = el.value.length >= +el.minLength;

    if (!result) {
      clone.innerHTML = `${ERROR_MESSAGES.minLength} ${el.minLength} `;
    }
  }

  return result;
};

const checkMaxLength = (el: HTMLInputElement, info: HTMLDivElement): boolean => {
  let result = true;
  const clone = info;

  if ('maxLength' in el) {
    result = el.value.length <= +el.maxLength;

    if (!result) {
      clone.innerHTML = `${ERROR_MESSAGES.maxLength}${el.maxLength} `;
    }
  }

  return result;
};

const validation = (e: Event | HTMLElement): boolean => {
  let isValid = true;

  if (e instanceof Event) {
    if (e.target === null) {
      isValid = false;
      throw new Error('null');
    }

    if (e.target instanceof HTMLFormElement) {
      isValid = checkElements(e.target.elements);
    }
  }

  if (e instanceof HTMLElement) {
    let arr = Array.from(e.childNodes);
    arr = arr.map((el) => el.childNodes[1] ?? el);

    isValid = checkElements(arr);
  }

  return isValid;
};

const checkElements = (element: ChildNode[] | HTMLFormControlsCollection): boolean => {
  const formElements = Array.from(element);

  const isValid = new Set();
  isValid.add(true);

  formElements.forEach((el) => {
    if (el instanceof HTMLInputElement) {
      const info = el.nextSibling;
      if (info === null || !(info instanceof HTMLDivElement)) {
        throw new Error('null');
      }

      info.innerHTML = '';
      if (el.getAttribute('maxLegth') !== null) {
        isValid.add(checkMaxLength(el, info));
      }
      if (el.getAttribute('pattern') !== null) {
        isValid.add(checkPattern(el, info));
      }
      if (el.getAttribute('minLegth') !== null) {
        isValid.add(checkMinLength(el, info));
      }

      isValid.add(checkRequired(el, info));
    }
  });

  return !isValid.has(false);
};

export default validation;
