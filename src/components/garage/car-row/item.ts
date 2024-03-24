import BaseComponent from '@/components/shared/base-component';
import Car from '@/components/garage/car/car';
import type { Car as CarType } from '@/types/types';
import BaseButton from '@/components/shared/base-button/base.button';

export default class Item extends BaseComponent {
  private readonly car: Car;
  private readonly editBtn: BaseButton;
  private readonly removeBtn: BaseButton;
  private readonly onOpenRemoveModal: (data: CarType) => void;
  private readonly onOpenChangeModal: (data: CarType) => void;

  constructor(data: CarType, openRemoveModal: (carData: CarType) => void, openChangeModal: (carData: CarType) => void) {
    super('div', ['item'], { id: `item-${data.id}` });

    this.onOpenRemoveModal = openRemoveModal;
    this.onOpenChangeModal = openChangeModal;

    this.car = new Car(data);
    this.editBtn = new BaseButton('button', '', ['btn', 'btn-pz-primary', 'icon', 'edit']);
    this.removeBtn = new BaseButton('button', '', ['btn', 'btn-pz-primary', 'icon', 'remove']);
    this.append(this.editBtn, this.removeBtn, this.car);

    this.removeBtn.addListener('click', () => {
      this.onOpenRemoveModal(data);
    });
    this.editBtn.addListener('click', () => {
      this.onOpenChangeModal(data);
    });
  }

  public getCarId(): number {
    return this.car.getCarId();
  }

  public changeCar(data: CarType): void {
    this.car.setCar(data);
  }
}
