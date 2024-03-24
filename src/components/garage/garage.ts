import BaseComponent from '@/components/shared/base-component';
import Item from '@/components/garage/car-row/item';
// import store from '@/store/store';
import type { Car as CarType } from '@/types/types';
import RemoveCar from './modals/remove-car-modal';
import ChangeCar from './modals/change-car-modal';
import CreateCar from './modals/create-car-modal';
import BaseButton from '../shared/base-button/base.button';
import CreateRandomCars from './modals/create-random-cars';

export default class Garage extends BaseComponent {
  private readonly cars: Item[];
  private readonly createCarBtn: BaseButton;
  private readonly create100CarsBtn: BaseButton;
  private readonly removeCarModal: RemoveCar;
  private readonly changeCarModal: ChangeCar;
  private readonly createCarModal: CreateCar;
  private readonly create100CarsModal: CreateRandomCars;

  constructor() {
    super('div', ['garage'], { id: 'garage' }, 'GARAGE`S PAGE');

    this.cars = [];
    this.createCarBtn = new BaseButton('button', 'Add new car', []);
    this.createCarBtn.addListener('click', () => {
      this.openCreateModal();
    });
    this.create100CarsBtn = new BaseButton('button', 'Add random cars', []);
    this.create100CarsBtn.addListener('click', () => {
      this.openCreateRandomModal();
    });
    this.removeCarModal = new RemoveCar((carData: CarType) => {
      this.submitRemoveModal(carData);
    });
    this.changeCarModal = new ChangeCar((carData: CarType) => {
      this.submitChangeModal(carData);
    });
    this.createCarModal = new CreateCar((carData: CarType) => {
      this.submitCreateModal(carData);
    });
    this.create100CarsModal = new CreateRandomCars((carsData: CarType[]) => {
      this.submitCreateRandomModal(carsData);
    });

    this.append(this.createCarBtn, this.create100CarsBtn);
  }

  public createCars(carsData: CarType[]): void {
    carsData.forEach((el) => {
      this.createCar(el);
    });
  }

  public createCar(el: CarType): void {
    const item = new Item(
      el,
      (carData: CarType) => {
        this.openRemoveModal(carData);
      },
      (carData: CarType) => {
        this.openChangeModal(carData);
      },
    );
    this.cars.push(item);

    this.append(item);
  }

  private openRemoveModal(carData: CarType): void {
    this.removeCarModal.openModal(carData);
  }

  private submitRemoveModal(carData: CarType): void {
    const item = this.cars.find((el) => {
      const id = el.getCarId();

      if (id === carData.id) {
        return el;
      }
      return false;
    });

    if (typeof item !== 'undefined') {
      item.remove();
    }
  }

  private openChangeModal(carData: CarType): void {
    this.changeCarModal.openModal(carData);
  }

  private submitChangeModal(carData: CarType): void {
    const item = this.cars.find((el) => {
      const id = el.getCarId();

      if (id === carData.id) {
        return el;
      }
      return false;
    });

    if (typeof item !== 'undefined') {
      item.changeCar(carData);
    }
  }

  private openCreateModal(): void {
    this.createCarModal.openModal();
  }

  private submitCreateModal(carData: CarType): void {
    this.createCar(carData);
  }

  private openCreateRandomModal(): void {
    this.create100CarsModal.openModal();
  }

  private submitCreateRandomModal(carsData: CarType[]): void {
    this.createCars(carsData);
  }
}
