import BaseComponent from '@/components/shared/base-component';
import Car from '@/components/garage/car/car';
import type { Car as CarType, CarRaceData } from '@/types/types';
import BaseButton from '@/components/shared/base-button/base-button';
import { changeEngine, changeDriveMode } from '@/components/garage/services/garage-service';

export default class Item extends BaseComponent {
  private readonly car: Car;
  private readonly editBtn: BaseButton;
  private readonly removeBtn: BaseButton;
  private readonly startBtn: BaseButton;
  private readonly returnBtn: BaseButton;
  private readonly carName: BaseComponent;
  private readonly onOpenRemoveModal: (data: CarType) => void;
  private readonly onOpenChangeModal: (data: CarType) => void;
  private readonly onChangeWinner: (data: CarType, time: number) => void;
  private carAnimtion: Animation | null = null;
  private time: number;
  private carData: CarType;

  constructor(
    data: CarType,
    openRemoveModal: (carData: CarType) => void,
    openChangeModal: (carData: CarType) => void,
    changeWinner: (carData: CarType, time: number) => void,
  ) {
    super('div', ['item'], { id: `item-${data.id}` });
    this.onOpenRemoveModal = openRemoveModal;
    this.onOpenChangeModal = openChangeModal;
    this.onChangeWinner = changeWinner;
    this.time = 0;
    this.carData = data;
    this.car = new Car(data);
    this.editBtn = new BaseButton('button', '', ['btn', 'btn-pz-primary', 'icon', 'edit']);
    this.removeBtn = new BaseButton('button', '', ['btn', 'btn-pz-primary', 'icon', 'remove']);
    this.startBtn = new BaseButton('button', '', ['btn', 'btn-pz-primary', 'icon', 'start']);
    this.returnBtn = new BaseButton('button', '', ['btn', 'btn-pz-primary', 'icon', 'return', 'disabled']);
    this.carName = new BaseComponent('p', ['car-title'], {}, data.name);
    const btnWrapper = new BaseComponent('div', ['car-btns']);
    btnWrapper.append(this.removeBtn, this.editBtn, this.startBtn, this.returnBtn, this.carName);
    this.append(btnWrapper, this.car);
    this.removeBtn.addListener('click', () => {
      this.onOpenRemoveModal(data);
    });
    this.editBtn.addListener('click', () => {
      this.onOpenChangeModal(data);
    });

    this.handleStart();
    this.returnBtn.addListener('click', () => {
      this.returnBtn.setClasses(['disabled']);
      this.startBtn.removeClasses(['disabled']);
      this.car.removeClasses(['fast', 'wrench']);
      const car = this.car.getElement();
      car.style.transform = `translateX(0)`;
      if (this.carAnimtion !== null) {
        this.carAnimtion.cancel();
      }
    });
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
      btn.click();
    }
  }

  public returnCar(): void {
    const btn = this.returnBtn.getElement();
    if (btn !== null) {
      btn.click();
    }
  }

  private handleStart(): void {
    this.startBtn.addListener('click', () => {
      const id = this.car.getCarId();
      changeEngine(id)
        .then((engineData: CarRaceData) => {
          this.returnBtn.removeClasses(['disabled']);
          this.startBtn.setClasses(['disabled']);
          this.animate(engineData);
          changeDriveMode(id)
            .then(() => {
              this.car.removeClasses(['fast']);
              this.onChangeWinner(this.carData, this.time);
            })
            .catch(() => {
              this.car.removeClasses(['fast']);
              this.car.setClasses(['wrench']);
              this.stopAnimate();
            });
        })
        .catch(() => null);
    });
  }

  private animate(engineData: CarRaceData): void {
    this.time = Math.round(engineData.distance / engineData.velocity);
    const road = this.getElement();
    const roadWidth = road.clientWidth * 0.9;

    const carTranslating = [{ transform: 'translateX(0)' }, { transform: `translateX(${roadWidth}px)` }];

    const carTiming = {
      duration: this.time,
      iterations: 1,
    };

    const car = this.car.getElement();
    this.carAnimtion = car.animate(carTranslating, carTiming);
    this.car.setClasses(['fast']);

    this.carAnimtion.onfinish = () => {
      car.style.transform = `translateX(${roadWidth}px)`;
    };
  }

  private stopAnimate(): void {
    if (this.carAnimtion !== null) {
      this.carAnimtion.pause();
    }
  }
}
