import BaseComponent from '@/components/shared/base-component';
import '@/components/shared/base-button/base-button.scss';

type ButtonType = 'submit' | 'reset' | 'button' | 'menu';

export default class BaseButton extends BaseComponent {
  constructor(type: ButtonType, text: string, className: string[], attrs: Record<string, string> = {}) {
    super('button', ['btn', 'btn-primary', 'btn-pz-primary', ...className], { ...attrs, type }, text);
  }
}
