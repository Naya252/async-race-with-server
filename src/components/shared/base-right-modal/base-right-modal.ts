import BaseComponent from '@/components/shared/base-component';
import BaseButton from '../base-button/base-button';
import '@/components/shared/base-right-modal/right-modal.module.scss';

export default class BaseRightModal extends BaseComponent {
  private readonly backdrop: BaseComponent;

  private readonly dialog: BaseComponent;

  protected readonly title: BaseComponent;

  private readonly content: BaseComponent;

  protected readonly body: BaseComponent;

  protected readonly footer: BaseComponent;

  protected readonly submitBtn: BaseButton;

  protected readonly cancelBtn: BaseButton;

  private readonly documentBody: HTMLElement;

  private readonly container: BaseComponent;

  constructor() {
    super('div', ['modal', 'fade-right'], {
      'data-bs-keyboard': 'false',
      tabindex: '-1',
      'aria-modal': 'true',
      role: 'dialog',
      'data-bs-dismiss': 'modal',
      'aria-label': 'close',
    });

    this.dialog = new BaseComponent('div', ['modal-dialog', 'modal-dialog-right']);
    this.content = new BaseComponent('div', ['modal-content']);
    this.documentBody = document.body;

    const header = new BaseComponent('div', ['modal-header']);
    this.body = new BaseComponent('div', ['modal-body']);
    this.footer = new BaseComponent('div', ['modal-footer']);

    this.title = new BaseComponent('h1', ['modal-title', 'fs-5']);
    const headerBtn = new BaseComponent('button', ['btn-close', 'cls']);
    headerBtn.addListener('click', () => {
      this.close();
    });
    header.append(this.title, headerBtn);

    this.submitBtn = new BaseButton('button', 'Ok', ['btn', 'btn-pz-primary']);
    this.cancelBtn = new BaseButton('button', 'Cancel', ['btn', 'btn-pz-primary', 'outlined', 'cls']);
    this.cancelBtn.addListener('click', () => {
      this.close();
    });
    this.footer.append(this.submitBtn, this.cancelBtn);

    this.content.append(header, this.body, this.footer);
    this.dialog.append(this.content);
    this.append(this.dialog);
    this.backdrop = new BaseComponent('div', ['modal-backdrop', 'modal-backdrop-under', 'fade']);

    this.container = new BaseComponent('div', ['modal-container']);
    this.container.append(this.backdrop, this);
  }

  public setTitle(title: string): void {
    this.title.setTextContent(title);
  }

  public setContent(content: HTMLElement): void {
    this.body.replaceChildren(content);
  }

  protected close(): void {
    this.removeClasses(['show']);
    this.backdrop.removeClasses(['show']);

    setTimeout(() => {
      this.toggleBodyClass(false);
      this.toggleInert(false);

      this.removeClasses(['block']);

      this.container.append(this, this.backdrop);
    }, 300);
  }

  protected open(): void {
    this.documentBody.append(this.backdrop.getElement());
    this.documentBody.append(this.getElement());
    this.setClasses(['block']);

    setTimeout(() => {
      this.toggleBodyClass(true);
      this.toggleInert(true);

      this.setClasses(['show']);
      this.backdrop.setClasses(['show']);
    }, 300);
  }

  private toggleBodyClass(isShow: boolean): void {
    if (isShow) {
      this.documentBody.classList.add('modal-open');
    } else {
      this.documentBody.classList.remove('modal-open');
    }
  }

  private toggleInert(isShow: boolean): void {
    const children = this.documentBody.childNodes[1]?.childNodes;
    if (typeof children === 'undefined') {
      throw new Error('app undefined');
    }
    const content = children[1];
    const footer = children[2];

    if (content !== null && content instanceof HTMLElement && footer !== null && footer instanceof HTMLElement) {
      if (isShow) {
        content.setAttribute('inert', 'true');
        footer.setAttribute('inert', 'true');
      } else {
        content.removeAttribute('inert');
        footer.removeAttribute('inert');
      }
    }
  }

  public hideModal(): void {
    const element = this.getElement();
    if (element.classList.contains('show')) {
      this.setClasses(['hide-modal']);
      this.backdrop.setClasses(['hide-modal']);
      this.toggleBodyClass(true);
      this.toggleInert(true);
    }
  }

  public showModal(): void {
    const element = this.getElement();
    if (element.classList.contains('show')) {
      this.toggleBodyClass(false);
      this.toggleInert(false);
      this.removeClasses(['hide-modal']);
      this.backdrop.removeClasses(['hide-modal']);
    }
  }
}
