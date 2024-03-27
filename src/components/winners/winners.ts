import BaseComponent from '@/components/shared/base-component';
import store from '@/store/store';
import type { Winner } from '@/types/types';
import Pagination from '../shared/pagination/pagination';
import { getWinnersData } from './services/winners-service';
import './winners.scss';

export default class Winners extends BaseComponent {
  private winners: BaseComponent[];
  private readonly winnersWrapper: BaseComponent;
  private readonly pagination: Pagination;

  constructor() {
    super('div', ['winners'], { id: 'winners' });
    this.winnersWrapper = new BaseComponent('div', ['winners-wrapper']);

    this.winners = [];

    this.pagination = new Pagination(() => {
      this.changeWinners().catch((err) => {
        console.error(err);
      });
    });

    this.append(this.pagination, this.winnersWrapper);
  }

  private async changeWinners(): Promise<void> {
    const curPage = store.garage.getCurrentPage();
    const data = await getWinnersData(String(curPage));
    this.createWinners(data);
  }

  public createWinners(winnersData: Winner[]): void {
    this.winners = [];
    this.winnersWrapper.setHTML('');

    winnersData.forEach((el) => {
      this.createWinner(el);
    });

    this.winnersWrapper.replaceChildren(...this.winners);
  }

  public createWinner(el: Winner): void {
    const item = new BaseComponent('div', ['winner'], {}, `${el.id}---${el.wins}---${el.time}`);
    this.winners.push(item);
  }

  public createPagination(): void {
    this.pagination.createAllPages();
    this.pagination.chageTitle();
  }

  public changeWinnersPage(): void {
    this.changeWinners()
      .then(() => {
        this.createPagination();
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
