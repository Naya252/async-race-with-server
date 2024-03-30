import BaseComponent from '@/components/shared/base-component';
import '@/components/header/header.scss';
import { APP_NAME, NAV_LINKS } from '@/shared/constants';

const createTitle = (): BaseComponent => {
  const title = new BaseComponent('h1', ['title'], {}, APP_NAME);
  return title;
};

export default class Header extends BaseComponent {
  private readonly onChangeLink: (value: BaseComponent) => void;

  private active: BaseComponent | null;

  constructor(onChangeLink: (value: BaseComponent) => void) {
    super('header', ['header', 'navbar', 'navbar-dark', 'bd-navbar']);
    this.onChangeLink = onChangeLink;

    const container = new BaseComponent('nav', ['container-xxl', 'navbar-dark', 'bd-navbar']);
    const title = createTitle();
    const nav = this.createNav();
    this.active = null;

    container.append(title, nav);
    this.append(container);
  }

  private createNav(): BaseComponent {
    const nav = new BaseComponent('ul', ['navbar-nav', 'flex-row', 'flex-wrap', 'bd-navbar-nav']);

    const links = Object.values(NAV_LINKS);
    links.forEach((el) => {
      const item = new BaseComponent('li', ['nav-item']);
      const link = new BaseComponent('a', ['nav-link'], { href: '#', id: el.toLowerCase() }, el);
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
      this.active.removeClasses(['active']);
    }

    this.active = link;
    link.setClasses(['active']);

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
