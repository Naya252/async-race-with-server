import { type Winner } from '@/types/types';
import { ITEMS_PER_PAGE } from '@/shared/api-constants';

export default class Winers {
  private winners: Winner[];
  private currentPage: number;
  private allPages: number;
  private allWinnersCount: number;

  constructor(winnersData: Winner[]) {
    this.winners = winnersData;
    this.currentPage = 1;
    this.allPages = 1;
    this.allWinnersCount = 0;
  }

  public getWinners(): Winner[] {
    return this.winners;
  }

  public setWinners(winners: Winner[]): void {
    this.winners = winners;
  }

  public getAllWinnersCount(): number {
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

  public changeAllPages(): void {
    this.allPages = Math.ceil(this.allWinnersCount / ITEMS_PER_PAGE.winners);
  }

  public changeCurrentPage(value: number): void {
    this.currentPage = value;
  }

  public getWinnersForShow(): number[] {
    const current = this.currentPage;
    const end = current * ITEMS_PER_PAGE.winners;
    return [end - ITEMS_PER_PAGE.winners, end - 1];
  }
}
