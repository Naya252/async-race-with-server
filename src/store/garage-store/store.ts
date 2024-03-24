import { type Car } from '@/types/types';

export default class Garage {
  private cars: Car[];

  constructor(carsData: Car[]) {
    this.cars = carsData;
  }

  public getCars(): Car[] {
    return this.cars;
  }

  public setCars(cars: Car[]): void {
    this.cars = cars;
  }

  public addCar(car: Car): void {
    this.cars.push(car);
  }

  public concatCars(cars: Car[]): void {
    this.cars = this.cars.concat(cars);
  }

  public removeCar(car: Car): void {
    this.cars = this.cars.filter((el) => el !== car);
  }

  public changeCar(car: Car): void {
    const item = this.cars.find((el) => el.id === car.id);
    if (item !== null && typeof item !== 'undefined') {
      item.color = car.color;
      item.name = car.name;
    }
  }
}
