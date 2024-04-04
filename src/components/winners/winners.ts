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
  { key: 'name', value: 'Name', cssClasses: ['width-40'] },
  { key: 'car', value: 'Car', cssClasses: [] },
  { key: 'wins', value: 'Wins', isSort: true, cssClasses: ['arrow', 'shadow-icon'] },
  { key: 'time', value: 'Best time (seconds)', isSort: true, cssClasses: ['arrow', 'active'] },
];

export default class Winners extends BaseComponent {
  private readonly winners: BaseTable;

  private readonly winnersWrapper: BaseComponent;

  private readonly emptyRow: BaseComponent;

  private readonly pagination: Pagination;

  constructor() {
    super('div', ['winners'], { id: 'winners' });
    this.winnersWrapper = new BaseComponent('div', ['winners-wrapper']);

    this.emptyRow = new BaseComponent('h2', [], {}, 'The list of winners is empty');

    this.winners = new BaseTable(headers);
    this.winners.head.addListener('click', (e: Event) => {
      this.sortTabe(e).catch(() => null);
    });

    this.pagination = new Pagination('Winners', store.winners, () => {
      this.changeWinners().catch(() => null);
    });

    this.winnersWrapper.append(this.winners, this.emptyRow);

    this.append(this.pagination, this.winnersWrapper);
  }

  private async sortTabe(e: Event): Promise<void> {
    const winnersData = await changeSort(e);
    await this.createWinners(winnersData);
  }

  private async changeWinners(): Promise<void> {
    const data = await getWinnersData();

    if (data.length > 0) {
      await this.createWinners(data);
      this.winners.removeClasses(['hide-item']);
      this.emptyRow.setClasses(['hide-item']);
      this.pagination.show();
    }
    if (data.length === 0) {
      if (store.winners.getCurrentPage() > 1) {
        store.winners.setCurrentPage();
        this.changeWinners().catch(() => null);
      } else {
        this.winners.setClasses(['hide-item']);
        this.emptyRow.removeClasses(['hide-item']);
        this.pagination.hide();
      }
    }
  }

  public async createWinners(winnersData: Winner[]): Promise<void> {
    this.winners.clearItems();

    const start = store.winners.getStartNumber();
    const createWinnerPromises: Array<Promise<boolean>> = [];

    for (let i = 0; i < winnersData.length; i += 1) {
      const el = winnersData[i];
      if (typeof el !== 'undefined') {
        createWinnerPromises.push(this.createWinner(el, start + i));
      }
    }

    await Promise.all(createWinnerPromises);

    this.winners.changeTable();
  }

  public async createWinner(el: Winner, number: number): Promise<boolean> {
    const carData = await getCarById(el.id);

    const car = new Car(carData);
    car.setClasses(['table-car']);
    this.winners.createBodyItem({
      number,
      name: carData.name,
      car: car.getElement(),
      wins: el.wins,
      time: el.time,
    });

    return true;
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
      .catch(() => null);
  }
}
