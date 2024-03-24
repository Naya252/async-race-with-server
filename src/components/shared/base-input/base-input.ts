import BaseComponent from '@/components/shared/base-component';
import '@/components/shared/base-input/base-input.module.scss';

type InputType =
  | 'text'
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'time'
  | 'url'
  | 'week';

export default class BaseInput extends BaseComponent {
  private readonly input: BaseComponent;
  text: BaseComponent;

  constructor(
    inputId: string,
    labelText: string,
    textId: string,
    subtext: string,
    attr: Record<string, string>,
    inputType: InputType = 'text',
  ) {
    super('div', ['input-wrapper']);

    if (inputType === 'color') {
      this.setClasses(['color-wrapper']);
    }

    const label = new BaseComponent('label', ['form-label'], { for: inputId }, labelText);
    this.input = new BaseComponent('input', ['form-control'], {
      ...attr,
      id: inputId,
      'aria-describedby': textId,
      type: inputType,
    });
    this.text = new BaseComponent('div', ['form-text'], { id: textId, text: subtext });

    this.append(label, this.input, this.text);
  }

  public inputListener(eventName: string, listener: EventListenerOrEventListenerObject): void {
    this.input.addListener(eventName, listener);
  }

  public getValue(): string {
    const el = this.input.getElement();

    if (!('value' in el)) {
      throw new Error('not value');
    }
    if (typeof el.value !== 'string') {
      throw new Error('not string');
    }

    return el.value;
  }

  public changeValue(value: string): void {
    const el = this.input.getElement();

    if (!('value' in el)) {
      throw new Error('not value');
    }
    if (typeof value !== 'string') {
      throw new Error('not string');
    }

    el.value = value;
  }

  public changeSubText(): void {
    this.text.setHTML('');
  }
}
