import BaseComponent from '@/components/shared/base-component';
import Item from '@/components/garage/car-row/item';
import store from '@/store/store';
import type { Car as CarType } from '@/types/types';
import RemoveCar from './modals/remove-car-modal';
import ChangeCar from './modals/change-car-modal';
import CreateCar from './modals/create-car-modal';
import BaseButton from '../shared/base-button/base-button';
import CreateRandomCars from './modals/create-random-cars';
import Pagination from '../shared/pagination/pagination';

export default class Garage extends BaseComponent {
  private readonly cars: Item[];
  private readonly carsWrapper: BaseComponent;
  private readonly createCarBtn: BaseButton;
  private readonly create100CarsBtn: BaseButton;
  private readonly removeCarModal: RemoveCar;
  private readonly changeCarModal: ChangeCar;
  private readonly createCarModal: CreateCar;
  private readonly create100CarsModal: CreateRandomCars;
  private readonly pagination: Pagination;

  constructor() {
    super('div', ['garage'], { id: 'garage' }, 'GARAGE`S PAGE');

    this.cars = [];
    this.carsWrapper = new BaseComponent('div', ['cars-wrapper']);
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

    this.pagination = new Pagination(() => {
      this.changeShowCars();
    });

    this.append(this.pagination, this.createCarBtn, this.create100CarsBtn, this.carsWrapper);
  }

  public createCars(carsData: CarType[]): void {
    carsData.forEach((el) => {
      this.createCar(el);
    });
    this.pagination.createAllPages();
    this.changeShowCars();
  }

  public changeShowCars(): void {
    const indexes = store.garage.getCarsForShow();
    const firstIdx = indexes[0];
    const lastIdx = indexes[1];
    if (firstIdx !== undefined && lastIdx !== undefined) {
      const items = this.cars.filter((el, i) => i >= firstIdx && i <= lastIdx);
      this.carsWrapper.replaceChildren(...items);
    }
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

    // this.append(item);
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
      store.garage.removeCar(carData);
      item.remove();
      this.pagination.changePages();
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
      store.garage.changeCar(carData);
      item.changeCar(carData);
    }
  }

  private openCreateModal(): void {
    this.createCarModal.openModal();
  }

  private submitCreateModal(carData: CarType): void {
    store.garage.addCar(carData);
    this.createCar(carData);
    this.pagination.changePages();
  }

  private openCreateRandomModal(): void {
    this.create100CarsModal.openModal();
  }

  private submitCreateRandomModal(carsData: CarType[]): void {
    store.garage.concatCars(carsData);
    this.createCars(carsData);
    this.pagination.changePages();
  }
}
