import BaseModal from '@/components/shared/base-modal/base-modal';
import type { Car as CarType } from '@/types/types';

export default class WinnerCar extends BaseModal {
  private text: string;

  constructor() {
    super();
    this.text = ``;

    this.title.setTextContent(`Winner`);
    this.submitBtn.addListener('click', () => {
      this.close();
    });
  }

  private changeText(carData: CarType, time: number): void {
    this.text = `${carData.name} (${time} ms)`;
    this.body.setTextContent(this.text);
  }

  public openModal(carData: CarType, time: number): void {
    this.submitBtn.removeClasses(['disabled']);
    this.changeText(carData, time);
    this.open();
  }
}
