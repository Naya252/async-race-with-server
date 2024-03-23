import BaseComponent from '@/components/shared/base-component';
import Car from '@/components/garage/car/car';
import store from '@/store/store';

export default class Garage extends BaseComponent {
  private readonly cars: Car[];

  constructor() {
    super('div', ['garage'], { id: 'garage' }, 'GARAGE`S PAGE');

    this.cars = [];
  }

  public createCars(): void {
    const carsData = store.garage.getCars();
    carsData.forEach((el) => {
      const car = new Car(el);
      this.cars.push(car);

      this.append(car);
    });
  }
}
