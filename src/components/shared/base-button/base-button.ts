import BaseComponent from '@/components/shared/base-component';
import styles from '@/components/shared/base-button/base-button.module.scss';

type ButtonType = 'submit' | 'reset' | 'button' | 'menu';

export default class BaseButton extends BaseComponent {
  constructor(type: ButtonType, text: string, className: (string | undefined)[], attrs: Record<string, string> = {}) {
    super('button', ['btn', 'btn-primary', styles['btn-pz-primary'], ...className], { ...attrs, type }, text);
  }
}
