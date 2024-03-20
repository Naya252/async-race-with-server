export default class BaseComponent {
  protected readonly element: HTMLElement;

  constructor(tag = 'div', classNames: string[] = [], attributes: Record<string, string> = {}, textContent = '') {
    this.element = document.createElement(tag);
    this.setClasses(classNames);
    this.setAttributes(attributes);
    this.setTextContent(textContent);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setClasses(classNames: string[]): void {
    if (classNames.length > 0) {
      classNames.forEach((className) => {
        this.element.classList.add(className);
      });
    }
  }

  public removeClasses(classNames: string[]): void {
    if (classNames.length > 0) {
      classNames.forEach((className) => {
        this.element.classList.remove(className);
      });
    }
  }

  public setTextContent(text: string): void {
    if (typeof text === 'string' && text !== '') {
      this.element.textContent = text;
    }
  }

  public setHTML(string: string): void {
    this.element.innerHTML = string;
  }

  public setAttributes(attrs: Record<string, string>): void {
    Object.entries(attrs).forEach(([attrName, attrValue]) => {
      this.element.setAttribute(attrName, attrValue);
    });
  }

  public addListener(eventName: string, listener: EventListenerOrEventListenerObject): void {
    this.element.addEventListener(eventName, listener);
  }

  public removeListener(eventName: string, listener: VoidFunction): void {
    this.element.removeEventListener(eventName, listener);
  }

  public appendToParent(parent: HTMLElement | BaseComponent): void {
    if (parent instanceof HTMLElement || parent instanceof BaseComponent) {
      parent.append(this.element);
    }
  }

  public append(...children: Array<HTMLElement | BaseComponent>): void {
    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        this.element.append(child);
      } else if (child instanceof BaseComponent) {
        this.element.append(child.element);
      }
    });
  }

  public getChildren(): NodeListOf<ChildNode> {
    const el = this.getElement();
    const children = el.childNodes;
    return children;
  }

  public getParent(): ParentNode {
    const el = this.getElement();
    const parent = el.parentNode;

    if (parent === null) {
      throw new Error('not parent');
    }

    return parent;
  }

  public replaceChildren(...children: Array<HTMLElement | BaseComponent>): void {
    const elements = children.map((child) => {
      if (child instanceof BaseComponent) {
        return child.element;
      }
      return child;
    });
    this.element.replaceChildren(...elements);
  }

  public remove(): void {
    this.element.remove();
  }
}
