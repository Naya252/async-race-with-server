import { type Winner } from '@/types/types';
import { ITEMS_PER_PAGE, SORT, ORDER } from '@/shared/api-constants';

export default class Winers {
  private winners: Winner[];

  private currentPage: number;

  private allPages: number;

  private allWinnersCount: number;

  private sort: string;

  private order: string;

  constructor(winnersData: Winner[]) {
    this.winners = winnersData;
    this.currentPage = 1;
    this.allPages = 1;
    this.allWinnersCount = 0;
    this.sort = SORT.time;
    this.order = ORDER.more;
  }

  public getWinners(): Winner[] {
    return this.winners;
  }

  public setWinners(winners: Winner[]): void {
    this.winners = winners;
  }

  public getAllItemsCount(): number {
    return this.allWinnersCount;
  }

  public setAllCount(count: string): void {
    this.allWinnersCount = Number(count);
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
    this.allPages = Math.ceil(this.allWinnersCount / ITEMS_PER_PAGE.winners);
  }

  public changeCurrentPage(value: number): void {
    this.currentPage = value;
  }

  public getStartNumber(): number {
    const current = this.currentPage;
    const end = current * ITEMS_PER_PAGE.winners;
    return end - ITEMS_PER_PAGE.winners + 1;
  }

  public getSort(): string {
    return this.sort;
  }

  public setSort(value: string): void {
    this.sort = value;
  }

  public getOrder(): string {
    return this.order;
  }

  public setOrder(value: string): void {
    this.order = value;
  }
}
