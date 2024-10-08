import BaseComponent from '@/components/shared/base-component';
import Car from '@/components/garage/car/car';
import type { Car as CarType, CarRaceData } from '@/types/types';
import BaseButton from '@/components/shared/base-button/base-button';
import { startEngine, changeDriveMode, stopEngine } from '@/components/garage/services/garage-service';
import { ENGINE_ERROR, NOT_FOUND_ERROR } from '@/repositories/api/api';
import carStyles from '@/components/garage/car/car.module.scss';
import styles from '@/components/garage/garage.module.scss';
import alerts from '@/components/alert/alert';

export default class Item extends BaseComponent {
  private readonly car: Car;

  private readonly editBtn: BaseButton;

  private readonly removeBtn: BaseButton;

  private readonly startBtn: BaseButton;

  private readonly returnBtn: BaseButton;

  private readonly carName: BaseComponent;

  private readonly btnWrapper: BaseComponent;

  private readonly onOpenRemoveModal: (data: CarType) => void;

  private readonly onOpenChangeModal: (data: CarType) => void;

  private readonly onChangeWinner: (data: CarType, time: number) => void;

  private readonly onChangeCountInRace: (value: number) => void;

  private carAnimtion: Animation | null = null;

  private time: number;

  private carData: CarType;

  private controller: AbortController;

  private isRaceDrive: boolean;

  private isDrive: boolean;

  constructor(
    data: CarType,
    openRemoveModal: (carData: CarType) => void,
    openChangeModal: (carData: CarType) => void,
    changeWinner: (carData: CarType, time: number) => void,
    changeCountInRace: (value: number) => void,
  ) {
    super('div', [styles.item], { id: `item-${data.id}` });
    this.onOpenRemoveModal = openRemoveModal;
    this.onOpenChangeModal = openChangeModal;
    this.onChangeWinner = changeWinner;
    this.onChangeCountInRace = changeCountInRace;
    this.time = 0;
    this.carData = data;
    this.car = new Car(data);
    this.editBtn = new BaseButton('button', '', ['btn', 'btn-pz-primary', 'icon', 'edit']);
    this.removeBtn = new BaseButton('button', '', ['btn', 'btn-pz-primary', 'icon', 'remove']);
    this.startBtn = new BaseButton('button', '', ['btn', 'btn-pz-primary', 'icon', 'start']);
    this.returnBtn = new BaseButton('button', '', ['btn', 'btn-pz-primary', 'icon', 'return', 'disabled']);
    this.carName = new BaseComponent('p', [styles['car-title']], {}, data.name);
    this.btnWrapper = new BaseComponent('div', [styles['car-btns']]);
    this.btnWrapper.append(this.removeBtn, this.editBtn, this.startBtn, this.returnBtn, this.carName);
    this.append(this.btnWrapper, this.car);
    this.removeBtn.addListener('click', () => {
      this.onOpenRemoveModal(data);
    });
    this.editBtn.addListener('click', () => {
      this.onOpenChangeModal(data);
    });

    this.controller = new AbortController();
    this.handleStart();
    this.handleReturn();
    this.isRaceDrive = false;
    this.isDrive = false;
  }

  public getCarId(): number {
    return this.car.getCarId();
  }

  public changeCar(data: CarType): void {
    this.car.setCar(data);
    this.carData = data;
    this.changeCarName(data.name);
  }

  private changeCarName(name: string): void {
    this.carName.setTextContent(name);
  }

  public startRace(): void {
    const btn = this.startBtn.getElement();
    if (btn !== null) {
      this.isRaceDrive = true;
      btn.click();
    }
  }

  public returnCar(): void {
    const btn = this.returnBtn.getElement();
    if (btn !== null) {
      this.isRaceDrive = false;
      if (this.isDrive) {
        btn.click();
      }
    }
  }

  private handleReturn(): void {
    this.returnBtn.addListener('click', () => {
      this.stop().catch(() => null);
    });
  }

  private async stop(): Promise<void> {
    this.returnBtn.setClasses(['disabled']);
    if (this.carAnimtion !== null) {
      this.carAnimtion.pause();
    }
    this.controller.abort();
    const id = this.car.getCarId();

    await stopEngine(id);

    this.changeItemToDafault();
    this.onChangeCountInRace(-1);
    this.isDrive = false;
  }

  private changeItemToDafault(): void {
    this.startBtn.removeClasses(['disabled']);
    this.editBtn.removeClasses(['disabled']);
    this.removeBtn.removeClasses(['disabled']);
    this.car.removeClasses([carStyles.fast, carStyles.wrench, carStyles.win, carStyles.glitch, carStyles.sad]);
    const car = this.car.getElement();
    car.style.transform = `translateX(0)`;
    if (this.carAnimtion !== null) {
      this.carAnimtion.cancel();
      this.carName.removeClasses([styles['run-title']]);
      this.btnWrapper.append(this.carName);
    }
  }

  private handleStart(): void {
    this.startBtn.addListener('click', () => {
      this.start().catch(() => null);
    });
  }

  private async start(): Promise<void> {
    this.startBtn.setClasses(['disabled']);
    this.editBtn.setClasses(['disabled']);
    this.removeBtn.setClasses(['disabled']);
    this.onChangeCountInRace(1);
    this.controller = new AbortController();
    const id = this.car.getCarId();

    const engineData = await startEngine(id);
    if (!this.isRaceDrive) {
      this.returnBtn.removeClasses(['disabled']);
    }
    this.animate(engineData);
    this.isDrive = true;

    try {
      await changeDriveMode(id, this.controller);
      this.car.removeClasses([carStyles.fast]);
      this.onChangeWinner(this.carData, this.time);
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw new Error('not error');
      }

      if (error.message === ENGINE_ERROR) {
        this.showWrench();
      }
      if (error.message === NOT_FOUND_ERROR) {
        this.showGlitch();
      }
    }
  }

  private showWrench(): void {
    this.car.removeClasses([carStyles.fast]);
    this.car.setClasses([carStyles.wrench]);
    this.stopAnimate();
  }

  public showWin(): void {
    this.car.setClasses([carStyles.win]);
  }

  private showGlitch(): void {
    this.car.setClasses([carStyles.glitch, carStyles.sad]);
    this.stopAnimate();

    alerts.addAlert('warning', `Glitch! ${this.carData.name} dropped out of the race`);

    setTimeout(() => {
      this.car.removeClasses([carStyles.glitch, carStyles.fast]);
    }, 3000);
  }

  private animate(engineData: CarRaceData): void {
    this.time = Math.round(engineData.distance / engineData.velocity);

    const carTranslating = [{ transform: 'translateX(0)' }, { transform: `translateX(900%)` }];

    const carTiming = {
      duration: this.time,
      iterations: 1,
    };

    const car = this.car.getElement();
    this.carAnimtion = car.animate(carTranslating, carTiming);

    this.car.setClasses([carStyles.fast]);

    this.car.append(this.carName);
    this.carName.setClasses([styles['run-title']]);

    this.carAnimtion.onfinish = (): void => {
      car.style.transform = `translateX(900%)`;
      this.car.removeClasses([carStyles.fast]);
    };
  }

  private stopAnimate(): void {
    if (this.carAnimtion !== null) {
      this.carAnimtion.pause();
    }
  }
}
