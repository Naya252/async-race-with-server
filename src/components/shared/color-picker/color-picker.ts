import BaseInput from '@/components/shared/base-input/base-input';
import BaseComponent from '@/components/shared/base-component';
import '@/components/shared/color-picker/base-color-picker.module.scss';

export default class ColorPicker extends BaseComponent {
  private readonly textInput: BaseInput;

  private readonly colorInput: BaseInput;

  constructor() {
    super('div', ['color-picker']);

    this.colorInput = new BaseInput(
      'picker',
      '',
      '',
      '',
      {
        required: '',
        autocomplete: 'off',
        value: '',
        maxlength: '7',
        minlength: '7',
        pattern: '^#[A-Fa-f0-9]{6}$',
      },
      'color',
    );

    this.textInput = new BaseInput('color', 'Color', 'color-text', 'subtext', {
      required: '',
      autocomplete: 'off',
      value: '',
      maxlength: '7',
      minlength: '7',
      pattern: '^#[A-Fa-f0-9]{6}$',
    });

    this.append(this.textInput, this.colorInput);

    this.textInput.addListener('change', () => {
      this.changeColor();
    });
    this.colorInput.addListener('change', () => {
      this.changeText();
    });
  }

  public changeValue(color: string): void {
    this.colorInput.changeValue(color);
    this.textInput.changeValue(color);
  }

  private changeColor(): void {
    const textValue = this.textInput.getValue();
    this.colorInput.changeValue(textValue);
  }

  private changeText(): void {
    const colorValue = this.colorInput.getValue();
    this.textInput.changeValue(colorValue);
  }

  public getValue(): string {
    return this.colorInput.getValue();
  }

  public colorListener(eventName: string, listener: EventListenerOrEventListenerObject): void {
    this.textInput.addListener(eventName, listener);
  }

  public colorPickerListener(eventName: string, listener: EventListenerOrEventListenerObject): void {
    this.colorInput.addListener(eventName, listener);
  }

  public changeSubText(): void {
    this.textInput.changeSubText();
  }
}
