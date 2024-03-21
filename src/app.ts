import '@/styles/core.scss';
import BaseComponent from '@/components/shared/base-component';
import Header from './components/header/header-component';
import Footer from './components/footer/footer-component';
import { NAV_LINKS } from './shared/constants';

export default class App {
  private readonly appContainer: BaseComponent;
  private readonly header: Header;
  private readonly main: BaseComponent;
  private readonly footer: Footer;
  private readonly garage: BaseComponent;
  private readonly winners: BaseComponent;

  constructor() {
    this.appContainer = new BaseComponent('div', ['app']);

    this.header = new Header((value: string) => {
      this.navigate(value);
    });
    this.main = new BaseComponent('div', ['content', 'container']);

    this.garage = new BaseComponent('div', [], { id: 'garage' }, NAV_LINKS[0]);
    this.winners = new BaseComponent('div', [], { id: 'winners' }, NAV_LINKS[1]);
    this.main.append(this.garage);

    this.footer = new Footer();

    this.appContainer.append(this.header, this.main, this.footer);
  }

  public init(): void {
    const { body } = document;
    this.appContainer.appendToParent(body);
  }

  private navigate(value: string): void {
    const items = this.main.getChildren();
    const item = items[0];

    if (item !== null && item instanceof HTMLElement) {
      if (value.toLocaleUpperCase() !== item.id) {
        this.main.replaceChildren(value === NAV_LINKS[0] ? this.garage : this.winners);
      }
    }
  }
}
