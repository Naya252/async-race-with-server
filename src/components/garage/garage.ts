import BaseComponent from '@/components/shared/base-component';
import Item from '@/components/garage/car-row/item';
import store from '@/store/store';
import type { Car as CarType } from '@/types/types';
import RemoveCar from './modals/remove-car-modal';
import ChangeCar from './modals/change-car-modal';
import CreateCar from './modals/create-car-modal';
import WinnerModal from './modals/winner-modal';
import BaseButton from '../shared/base-button/base-button';
import CreateRandomCars from './modals/create-random-cars';
import Pagination from '../shared/pagination/pagination';
import { getCarsData } from './services/garage-service';
import './garage.scss';

export default class Garage extends BaseComponent {
  private cars: Item[];
  private readonly carsWrapper: BaseComponent;
  private readonly createCarBtn: BaseButton;
  private readonly create100CarsBtn: BaseButton;
  private readonly raceCarsBtn: BaseButton;
  private readonly returnCarsBtn: BaseButton;
  private readonly removeCarModal: RemoveCar;
  private readonly changeCarModal: ChangeCar;
  private readonly createCarModal: CreateCar;
  private readonly winnerModal: WinnerModal;
  private readonly create100CarsModal: CreateRandomCars;
  private readonly pagination: Pagination;
  private hasWin: boolean;
  private isRace: boolean;
  private countRaceCars: number;

  constructor() {
    super('div', ['garage'], { id: 'garage' });
    this.hasWin = false;
    this.isRace = false;
    this.countRaceCars = 0;
    this.cars = [];
    this.carsWrapper = new BaseComponent('div', ['cars-wrapper']);
    const buttonWrapper = new BaseComponent('div', ['btns-wrapper']);
    this.createCarBtn = this.initCreateCarBtn();
    this.create100CarsBtn = this.initCreateRandomCarsBtn();
    this.raceCarsBtn = this.initRaceBtn();
    this.returnCarsBtn = this.initReturnCarsBtn();
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
    this.winnerModal = new WinnerModal();

    this.pagination = new Pagination(() => {
      this.changeCars().catch((err) => {
        console.error(err);
      });
    });

    buttonWrapper.append(this.createCarBtn, this.create100CarsBtn, this.raceCarsBtn, this.returnCarsBtn);
    this.append(this.pagination, buttonWrapper, this.carsWrapper);
  }

  private initCreateCarBtn(): BaseButton {
    const btn = new BaseButton('button', 'add new car', ['outlined', 'create-car-btn', 'btn-sm']);
    btn.addListener('click', () => {
      this.openCreateModal();
    });
    return btn;
  }

  private initCreateRandomCarsBtn(): BaseButton {
    const btn = new BaseButton('button', 'add random cars', ['outlined', 'create-car-btn', 'btn-sm']);
    btn.addListener('click', () => {
      this.openCreateRandomModal();
    });
    return btn;
  }

  private initRaceBtn(): BaseButton {
    const btn = new BaseButton('button', 'RACE', ['outlined', 'create-car-btn', 'btn-sm']);
    btn.addListener('click', () => {
      this.raceCars();
    });
    return btn;
  }

  private initReturnCarsBtn(): BaseButton {
    const btn = new BaseButton('button', 'RETURN', ['outlined', 'create-car-btn', 'btn-sm', 'disabled']);
    btn.addListener('click', () => {
      this.returnCars();
    });
    return btn;
  }

  private changeWin(carData: CarType, time: number): void {
    if (!this.hasWin && this.isRace) {
      this.hasWin = true;
      console.log(`${carData.name} (${time}ms) - WINNER`);
      this.openWinnerModal(carData, time);
    }
  }

  private raceCars(): void {
    this.isRace = true;
    this.raceCarsBtn.setClasses(['disabled']);
    this.returnCarsBtn.removeClasses(['disabled']);
    this.cars.forEach((el) => {
      el.startRace();
    });
  }

  private returnCars(): void {
    this.returnCarsBtn.setClasses(['disabled']);
    this.raceCarsBtn.removeClasses(['disabled']);
    this.cars.forEach((el) => {
      el.returnCar();
    });

    this.isRace = false;
    this.hasWin = false;
    // this.countRaceCars = 0;
    // this.calculateCarsInRace(0);
  }

  public createCars(carsData: CarType[]): void {
    this.cars = [];
    this.carsWrapper.setHTML('');

    carsData.forEach((el) => {
      this.createCar(el);
    });

    this.carsWrapper.replaceChildren(...this.cars);
  }

  public createPagination(): void {
    this.pagination.createAllPages();
    this.pagination.chageTitle();
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
      (carData: CarType, time: number) => {
        this.changeWin(carData, time);
      },
      (value: number) => {
        this.calculateCarsInRace(value);
      },
    );
    this.cars.push(item);
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
      this.changeGarage();
    }
  }

  private changeGarage(): void {
    this.changeCars()
      .then(() => {
        this.createPagination();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  private async changeCars(): Promise<void> {
    const curPage = store.garage.getCurrentPage();
    const data = await getCarsData(String(curPage));
    this.createCars(data);
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
    console.log(carData);
    this.changeGarage();
  }

  private openCreateRandomModal(): void {
    this.create100CarsModal.openModal();
  }

  private submitCreateRandomModal(carsData: CarType[]): void {
    console.log(carsData);
    this.changeGarage();
  }

  private openWinnerModal(carData: CarType, time: number): void {
    console.log(`show winner`, carData, time, this.hasWin);
    // this.winnerModal.openModal(carData, time);
  }

  private calculateCarsInRace(value: number): void {
    console.log(value);
    this.countRaceCars += value;
    this.checkCarsInRace();
  }

  private checkCarsInRace(): void {
    console.log(this.countRaceCars);
    if (this.countRaceCars > 0) {
      this.raceCarsBtn.setClasses(['disabled']);
      if (!this.isRace) {
        this.returnCarsBtn.removeClasses(['disabled']);
      }
      if (this.isRace && this.countRaceCars < this.cars.length) {
        this.returnCarsBtn.setClasses(['disabled']);
      }
      if (this.isRace && this.countRaceCars === this.cars.length) {
        this.returnCarsBtn.removeClasses(['disabled']);
      }
    }
    if (this.countRaceCars === 0) {
      this.raceCarsBtn.removeClasses(['disabled']);
      this.returnCarsBtn.setClasses(['disabled']);
    }
  }
}
