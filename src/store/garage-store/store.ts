import { type Car } from '@/types/types';
import { ITEMS_PER_PAGE } from '@/shared/api-constants';

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

  public getAllItemsCount(): number {
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

  public setCurrentPage(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  }

  public changeAllPages(): void {
    this.allPages = Math.ceil(this.allCarsCount / ITEMS_PER_PAGE.garage);
  }

  public changeCurrentPage(value: number): void {
    this.currentPage = value;
  }

  public getStartNumber(): number {
    const current = this.currentPage;
    const end = current * ITEMS_PER_PAGE.garage;
    return end - ITEMS_PER_PAGE.garage;
  }
}
