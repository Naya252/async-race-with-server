import '@/styles/core.scss';
import BaseComponent from '@/components/shared/base-component';
import Garage from '@/components/garage/garage';
import Winners from '@/components/winners/winners';
import Header from '@/components/header/header-component';
import Footer from '@/components/footer/footer-component';
import { getCarsData } from '@/components/garage/services/garage-service';
import alerts from '@/components/alert/alert';
import { NAV_LINKS } from './shared/constants';

export default class App {
  private readonly appContainer: BaseComponent;
  private readonly header: Header;
  private readonly main: BaseComponent;
  private readonly footer: Footer;
  private readonly garage: Garage;
  private readonly winners: Winners;

  constructor() {
    this.appContainer = new BaseComponent('div', ['app']);

    this.header = new Header((value: string) => {
      this.navigate(value);
    });
    this.main = new BaseComponent('div', ['content', 'container']);

    this.garage = new Garage(() => {
      this.changeWinnersPage();
    });
    this.winners = new Winners();
    this.main.append(this.garage);

    this.footer = new Footer();

    this.appContainer.append(this.header, this.main, this.footer, alerts);
  }

  public async init(): Promise<void> {
    const { body } = document;
    this.appContainer.appendToParent(body);

    const data = await getCarsData();

    this.garage.createCars(data);
    this.garage.createPagination();
  }

  private navigate(value: string): void {
    const items = this.main.getChildren();
    const item = items[0];

    if (item !== null && item instanceof HTMLElement) {
      if (value.toLocaleUpperCase() !== item.id) {
        this.main.replaceChildren(value === NAV_LINKS[0] ? this.garage : this.winners);
        if (value === NAV_LINKS[1]) {
          this.changeWinnersPage();
        }
      }
    }
  }

  private changeWinnersPage(): void {
    this.winners.changeWinnersPage();
  }
}
