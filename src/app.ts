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

    this.header = new Header((value: BaseComponent) => {
      this.navigate(value);
    });
    this.main = new BaseComponent('div', ['content', 'container']);

    this.garage = new Garage(() => {
      this.changeWinnersPage();
    });
    this.winners = new Winners();
    this.winners.changeWinnersPage();

    this.footer = new Footer();

    this.appContainer.append(this.header, this.main, this.footer, alerts);
    this.header.initActive();
  }

  public async init(): Promise<void> {
    const { body } = document;
    this.appContainer.appendToParent(body);

    const data = await getCarsData();

    this.garage.createCars(data);
    this.garage.createPagination();
  }

  private navigate(value: BaseComponent): void {
    const id = value.getId();

    this.main.replaceChildren(id === NAV_LINKS.garage.toLowerCase() ? this.garage : this.winners);

    if (id === NAV_LINKS.winners.toLowerCase()) {
      this.garage.hideRightModal();
    }
    if (id === NAV_LINKS.garage.toLowerCase()) {
      this.garage.showRightModal();
    }
  }

  private changeWinnersPage(): void {
    this.winners.changeWinnersPage();
  }
}
