import BaseModal from '@/components/shared/base-modal/base-modal';
import type { Car as CarType, CarTemplate } from '@/types/types';
import { createCar } from '@/repositories/garage-repository';
import { getRadomHex, getRandomName } from '../services/garage-service';

export default class CreateRandomCars extends BaseModal {
  private readonly text: string;
  private data: CarType[] = [];
  private readonly onCloseCreateRandomModal: (data: CarType[]) => void;

  constructor(closeModal: (carsData: CarType[]) => void) {
    super();
    this.text = `Are you sure you want to create 100 random cars?`;
    this.body.setTextContent(this.text);

    this.title.setTextContent(`Create 100 cars`);
    this.onCloseCreateRandomModal = closeModal;
    this.submitBtn.addListener('click', () => {
      this.submitModal();
    });
  }

  public openModal(): void {
    this.submitBtn.removeClasses(['disabled']);
    this.data = [];
    this.open();
  }

  public submitModal(): void {
    this.submitBtn.setClasses(['disabled']);
    let i = 0;
    while (i < 100) {
      i += 1;
      this.generateNewCar();
    }
  }

  private generateNewCar(): void {
    const name = getRandomName();
    const color = getRadomHex();

    this.createCar({ name, color }).catch(() => null);
  }

  private async createCar(template: CarTemplate): Promise<void> {
    const newCar = await createCar(template);
    this.data.push(newCar);

    if (this.data.length === 100) {
      this.onCloseCreateRandomModal(this.data);
      this.close();
    }
  }
}
