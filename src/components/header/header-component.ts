import BaseComponent from '@/components/shared/base-component';
import styles from '@/components/header/header.module.scss';
import { APP_NAME, NAV_LINKS } from '@/shared/constants';
import logoImg from '@/assets/logo.svg';

const createTitle = (): BaseComponent => {
  const logo = new BaseComponent('img', ['logo'], { alt: 'logo', src: logoImg });
  const title = new BaseComponent('h1', [styles.title], {}, APP_NAME);
  const container = new BaseComponent('dev', [styles['logo-container']]);
  container.append(logo, title);
  return container;
};

export default class Header extends BaseComponent {
  private readonly onChangeLink: (value: BaseComponent) => void;

  private active: BaseComponent | null;

  constructor(onChangeLink: (value: BaseComponent) => void) {
    super('header', [styles.header, 'navbar', 'navbar-dark', 'bd-navbar']);
    this.onChangeLink = onChangeLink;

    const container = new BaseComponent('nav', ['container-xxl', 'navbar-dark', 'bd-navbar']);
    const title = createTitle();

    const nav = this.createNav();
    this.active = null;

    container.append(title, nav);
    this.append(container);
  }

  private createNav(): BaseComponent {
    const nav = new BaseComponent('ul', [styles['navbar-nav'], 'flex-row', 'flex-wrap', 'bd-navbar-nav']);

    const links = Object.values(NAV_LINKS);
    links.forEach((el) => {
      const item = new BaseComponent('li', ['nav-item']);
      const link = new BaseComponent('a', [styles['nav-link']], { href: '#', id: el.toLowerCase() }, el);
      link.appendToParent(item);

      link.addListener('click', () => {
        this.changeActive(link);
      });

      item.appendToParent(nav);
    });
    return nav;
  }

  private changeActive(link: BaseComponent): void {
    if (this.active !== null && typeof this.active !== 'undefined') {
      this.active.removeClasses([styles['active-nav']]);
    }

    this.active = link;
    link.setClasses([styles['active-nav']]);

    this.onChangeLink(link);
  }

  public initActive(): void {
    const el = this.getElement();
    const link = el.firstChild?.childNodes[1]?.firstChild?.firstChild;
    if (link !== null && typeof link !== 'undefined' && link instanceof HTMLElement) {
      link.click();
    }
  }
}
