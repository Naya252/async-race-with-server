import { type Car } from '@/types/types';

export default class Garage {
  private cars: Car[];
  private currentPage: number;
  private allPages: number;

  constructor(carsData: Car[]) {
    this.cars = carsData;
    this.currentPage = 1;
    this.allPages = 1;
  }

  public getCars(): Car[] {
    return this.cars;
  }

  public setCars(cars: Car[]): void {
    this.cars = cars;
    this.changeAllPages();
  }

  public addCar(car: Car): void {
    this.cars.push(car);
    this.changeAllPages();
  }

  public concatCars(cars: Car[]): void {
    this.cars = this.cars.concat(cars);
    this.changeAllPages();
  }

  public removeCar(car: Car): void {
    this.cars = this.cars.filter((el) => el !== car);
    this.changeAllPages();
  }

  public changeCar(car: Car): void {
    const item = this.cars.find((el) => el.id === car.id);
    if (item !== null && typeof item !== 'undefined') {
      item.color = car.color;
      item.name = car.name;
    }
  }

  public getAllPages(): number {
    return this.allPages;
  }

  public getCurrentPage(): number {
    return this.currentPage;
  }

  public changeAllPages(): void {
    this.allPages = Math.ceil(this.cars.length / 7);
  }

  public changeCurrentPage(value: number): void {
    this.currentPage = value;
  }

  public getCarsForShow(): number[] {
    const current = this.currentPage;
    const end = current * 7;
    return [end - 7, end - 1];
  }
}
