import BaseComponent from '@/components/shared/base-component';
import Item from '@/components/garage/car-row/item';
import store from '@/store/store';
import type { Car as CarType } from '@/types/types';
import { deleteWinner } from '@/repositories/winners-repository';
import RemoveCar from './modals/remove-car-modal';
import ChangeCar from './modals/change-car-modal';
import CreateCar from './modals/create-car-modal';
import BaseButton from '../shared/base-button/base-button';
import CreateRandomCars from './modals/create-random-cars';
import Pagination from '../shared/pagination/pagination';
import { getCarsData, showWinnerAlert } from './services/garage-service';
import { saveWinner } from '../winners/services/winners-service';
import styles from './garage.module.scss';

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

  private readonly create100CarsModal: CreateRandomCars;

  private readonly pagination: Pagination;

  private hasWin: boolean;

  private isRace: boolean;

  private countRaceCars: number;

  private readonly emptyRow: BaseComponent;

  private readonly onChangeWinners: () => void;

  constructor(changeWinners: () => void) {
    super('div', ['garage'], { id: 'garage' });
    this.onChangeWinners = changeWinners;
    this.hasWin = false;
    this.isRace = false;
    this.countRaceCars = 0;
    this.cars = [];
    this.carsWrapper = new BaseComponent('div', [styles['cars-wrapper']]);
    const buttonWrapper = new BaseComponent('div', [styles['btns-wrapper']]);
    this.createCarBtn = this.initCreateCarBtn();
    this.create100CarsBtn = this.initCreateRandomCarsBtn();
    this.raceCarsBtn = this.initRaceBtn();
    this.returnCarsBtn = this.initReturnCarsBtn();
    this.removeCarModal = new RemoveCar((carData: CarType) => {
      this.submitRemoveModal(carData).catch(() => null);
    });
    this.changeCarModal = new ChangeCar(() => {
      this.submitChangeModal();
    });
    this.createCarModal = new CreateCar(() => {
      this.submitCreateModal();
    });
    this.create100CarsModal = new CreateRandomCars(() => {
      this.submitCreateRandomModal();
    });

    this.emptyRow = new BaseComponent('h2', [], {}, 'The garage is empty');

    this.pagination = new Pagination('Garage', store.garage, () => {
      this.changeCars().catch(() => null);
    });

    buttonWrapper.append(this.createCarBtn, this.create100CarsBtn, this.raceCarsBtn, this.returnCarsBtn);
    this.append(this.pagination, buttonWrapper, this.carsWrapper);
  }

  private initCreateCarBtn(): BaseButton {
    const btn = new BaseButton('button', 'add new car', ['outlined', styles['create-car-btn'], 'btn-sm']);
    btn.addListener('click', () => {
      this.openCreateModal();
    });
    return btn;
  }

  private initCreateRandomCarsBtn(): BaseButton {
    const btn = new BaseButton('button', 'add random cars', ['outlined', styles['create-car-btn'], 'btn-sm']);
    btn.addListener('click', () => {
      this.openCreateRandomModal();
    });
    return btn;
  }

  private initRaceBtn(): BaseButton {
    const btn = new BaseButton('button', 'RACE', ['outlined', styles['create-car-btn'], 'btn-sm']);
    btn.addListener('click', () => {
      this.raceCars();
    });
    return btn;
  }

  private initReturnCarsBtn(): BaseButton {
    const btn = new BaseButton('button', 'RETURN', ['outlined', styles['create-car-btn'], 'btn-sm', 'disabled']);
    btn.addListener('click', () => {
      this.returnCars();
    });
    return btn;
  }

  private changeWin(carData: CarType, time: number): void {
    if (!this.hasWin && this.isRace) {
      this.hasWin = true;
      const seconds = time / 1000;
      showWinnerAlert(carData, seconds);
      saveWinner(carData, seconds)
        .then(() => {
          this.onChangeWinners();
        })
        .catch(() => null);
    }
  }

  private raceCars(): void {
    this.isRace = true;
    this.pagination.addDisabled();
    this.raceCarsBtn.setClasses(['disabled']);
    this.cars.forEach((el) => {
      el.startRace();
    });
  }

  private returnCars(): void {
    this.returnCarsBtn.setClasses(['disabled']);
    this.cars.forEach((el) => {
      el.returnCar();
    });

    this.hasWin = false;
  }

  public createCars(carsData: CarType[]): void {
    this.cars = [];
    this.destroyCars();

    if (carsData.length > 0) {
      carsData.forEach((el) => {
        this.createCar(el);
      });

      this.carsWrapper.replaceChildren(...this.cars);
      this.pagination.show();
      this.raceCarsBtn.removeClasses(['hide-item']);
      this.returnCarsBtn.removeClasses(['hide-item']);
    } else {
      this.pagination.hide();
      this.raceCarsBtn.setClasses(['hide-item']);
      this.returnCarsBtn.setClasses(['hide-item']);
      this.carsWrapper.replaceChildren(this.emptyRow);
    }
  }

  private destroyCars(): void {
    this.cars.forEach((el) => {
      el.remove();
    });
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

  private async submitRemoveModal(carData: CarType): Promise<void> {
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

    await deleteWinner(carData.id);
    this.onChangeWinners();
  }

  private changeGarage(): void {
    this.changeCars()
      .then(() => {
        this.createPagination();
      })
      .catch(() => null);
  }

  private async changeCars(): Promise<void> {
    const curPage = store.garage.getCurrentPage();
    const data = await getCarsData(String(curPage));
    this.createCars(data);
    this.isRace = false;
    this.hasWin = false;
    this.countRaceCars = 0;
    this.checkCarsInRace();
  }

  private openChangeModal(carData: CarType): void {
    this.changeCarModal.openModal(carData);
  }

  private submitChangeModal(): void {
    this.changeGarage();
  }

  private openCreateModal(): void {
    this.createCarModal.openModal();
  }

  private submitCreateModal(): void {
    this.changeGarage();
  }

  private openCreateRandomModal(): void {
    this.create100CarsModal.openModal();
  }

  private submitCreateRandomModal(): void {
    this.changeGarage();
  }

  private calculateCarsInRace(value: number): void {
    this.countRaceCars += value;
    this.checkCarsInRace();
  }

  private checkCarsInRace(): void {
    if (this.countRaceCars > 0) {
      this.raceCarsBtn.setClasses(['disabled']);

      if (this.isRace && this.countRaceCars < this.cars.length) {
        this.returnCarsBtn.setClasses(['disabled']);
      }
      if (this.isRace && this.countRaceCars === this.cars.length) {
        setTimeout(() => {
          this.returnCarsBtn.removeClasses(['disabled']);
        }, 2000);
      }
    }
    if (this.countRaceCars === 0) {
      this.raceCarsBtn.removeClasses(['disabled']);
      this.returnCarsBtn.setClasses(['disabled']);
      this.isRace = false;
      this.pagination.removeDisabled();
    }
  }

  public hideRightModal(): void {
    this.createCarModal.hideModal();
    this.changeCarModal.hideModal();
  }

  public showRightModal(): void {
    this.createCarModal.showModal();
    this.changeCarModal.showModal();
  }
}
