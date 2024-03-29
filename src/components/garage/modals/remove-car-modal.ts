import BaseModal from '@/components/shared/base-modal/base-modal';
import type { Car as CarType } from '@/types/types';
import { deleteCar } from '@/repositories/garage-repository';
import alerts from '@/components/alert/alert';

export default class RemoveCar extends BaseModal {
  private text: string;
  private data: CarType | null;
  private readonly onCloseRemoveModal: (data: CarType) => void;

  constructor(closeRemoveModal: (carData: CarType) => void) {
    super();
    this.text = `Are you sure you want to remove Car?`;

    this.title.setTextContent(`Remove car`);
    this.data = null;
    this.onCloseRemoveModal = closeRemoveModal;
    this.submitBtn.addListener('click', () => {
      this.submitModal().catch(() => null);
    });
  }

  private changeText(carData: CarType): void {
    this.text = `Are you sure you want to remove Car - ${carData.name} (id: ${carData.id})?`;
    this.body.setTextContent(this.text);
  }

  public openModal(carData: CarType): void {
    this.submitBtn.removeClasses(['disabled']);
    this.data = carData;
    this.changeText(carData);
    this.open();
  }

  public async submitModal(): Promise<void> {
    if (this.data !== null) {
      try {
        this.submitBtn.setClasses(['disabled']);
        await deleteCar(this.data.id);

        this.onCloseRemoveModal(this.data);
        this.close();
        alerts.addAlert('success', `${this.data.name} removed`);
      } catch (err) {
        alerts.addAlert('warning', `Error with remove ${this.data.name}`);
      }
    }
  }
}
