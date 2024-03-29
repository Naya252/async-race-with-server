import BaseComponent from '@/components/shared/base-component';
import store from '@/store/store';
import type { Winner } from '@/types/types';
import Pagination from '@/components/shared/pagination/pagination';
import BaseTable from '@/components/shared/base-table/base-table';
import Car from '@/components/garage/car/car';
import { getWinnersData, changeSort } from './services/winners-service';
import { getCarById } from '../garage/services/garage-service';
import './winners.scss';

const headers = [
  { key: 'order', value: '#', cssClasses: [] },
  { key: 'name', value: 'Name', cssClasses: [] },
  { key: 'car', value: 'Car', cssClasses: [] },
  { key: 'wins', value: 'Wins', isSort: true, cssClasses: ['arrow', 'shadow-icon'] },
  { key: 'time', value: 'Best time (seconds)', isSort: true, cssClasses: ['arrow', 'active'] },
];

export default class Winners extends BaseComponent {
  private readonly winners: BaseTable;
  private readonly winnersWrapper: BaseComponent;
  private readonly pagination: Pagination;

  constructor() {
    super('div', ['winners'], { id: 'winners' });
    this.winnersWrapper = new BaseComponent('div', ['winners-wrapper']);

    this.winners = new BaseTable(headers);
    this.winners.head.addListener('click', (e: Event) => {
      this.sortTabe(e).catch(() => null);
    });

    this.pagination = new Pagination('Winners', store.winners, () => {
      this.changeWinners().catch((err) => {
        console.error(err);
      });
    });

    this.winnersWrapper.append(this.winners);

    this.append(this.pagination, this.winnersWrapper);
  }

  private async sortTabe(e: Event): Promise<void> {
    const winnersData = await changeSort(e);
    this.createWinners(winnersData);
  }

  private async changeWinners(): Promise<void> {
    const data = await getWinnersData();
    this.createWinners(data);
  }

  public createWinners(winnersData: Winner[]): void {
    this.winners.createBody();

    winnersData.forEach((el, i) => {
      const start = store.winners.getStartNumber();
      this.createWinner(el, start + i);
    });
  }

  public createWinner(el: Winner, number: number): void {
    getCarById(el.id)
      .then((carData) => {
        const car = new Car(carData);
        car.setClasses(['table-car']);
        this.winners.createBodyItem({
          number,
          name: carData.name,
          car: car.getElement(),
          wins: el.wins,
          time: el.time,
        });
      })
      .catch(() => null);
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
