import BaseModal from '@/components/shared/base-modal/base-modal';

export default class InfoModal extends BaseModal {
  private text: string;

  constructor() {
    super(['info-modal']);
    this.text = `Connect the server and refresh the page`;

    this.title.setTextContent(`Info`);
    this.body.setTextContent(this.text);
    this.submitBtn.setClasses(['hide-item']);
    this.cancelBtn.setClasses(['hide-item']);
    this.footer.setAttributes({ style: 'min-height: 4rem' });
  }

  public openModal(): void {
    this.open();
  }
}
