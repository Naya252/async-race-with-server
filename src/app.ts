import '@/styles/core.scss';
import BaseComponent from '@/components/shared/base-component';
import Header from './components/header/header-component';
import Footer from './components/footer/footer-component';

export default class App {
  private readonly appContainer: BaseComponent;
  private readonly header: Header;
  private readonly main: BaseComponent;
  private readonly footer: Footer;

  constructor() {
    this.appContainer = new BaseComponent('div', ['app']);

    this.header = new Header();
    this.main = new BaseComponent('div', ['content', 'container']);
    this.footer = new Footer();

    this.appContainer.append(this.header, this.main, this.footer);
  }

  public init(): void {
    const { body } = document;
    this.appContainer.appendToParent(body);
  }
}
