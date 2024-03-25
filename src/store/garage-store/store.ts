import { type Car } from '@/types/types';

export default class Garage {
  private cars: Car[];
  private currentPage: number;
  private allPages: number;
  private allCarsCount: number;

  constructor(carsData: Car[]) {
    this.cars = carsData;
    this.currentPage = 1;
    this.allPages = 1;
    this.allCarsCount = 0;
  }

  public getCars(): Car[] {
    return this.cars;
  }

  public setCars(cars: Car[]): void {
    this.cars = cars;
  }

  public changeCar(car: Car): void {
    const item = this.cars.find((el) => el.id === car.id);
    if (item !== null && typeof item !== 'undefined') {
      item.color = car.color;
      item.name = car.name;
    }
  }

  public getAllCarsCount(): number {
    return this.allCarsCount;
  }

  public setAllCount(count: string): void {
    this.allCarsCount = Number(count);
    this.changeAllPages();
  }

  public getAllPages(): number {
    return this.allPages;
  }

  public getCurrentPage(): number {
    return this.currentPage;
  }

  public changeAllPages(): void {
    this.allPages = Math.ceil(this.allCarsCount / 7);
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
