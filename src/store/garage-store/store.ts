import { type Car } from '@/types/types';

export default class Garage {
  private cars: Car[];

  constructor(carsData: Car[]) {
    this.cars = carsData;
  }

  public getCars(): Car[] {
    return this.cars;
  }

  public addCar(car: Car): void {
    this.cars.push(car);
  }

  public removeCar(car: Car): void {
    this.cars = this.cars.filter((el) => el !== car);
  }

  public changeCarColor(car: Car): void {
    const item = this.cars.find((el) => el.id === car.id);
    if (item !== null && typeof item !== 'undefined') {
      item.color = car.color;
    }
  }
}
