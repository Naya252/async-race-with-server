import BaseComponent from '@/components/shared/base-component';
import '@/components/header/header.module.scss';
import { APP_NAME, NAV_LINKS } from '@/shared/constants';

const createTitle = (): BaseComponent => {
  const title = new BaseComponent('h1', ['title'], {}, APP_NAME);
  return title;
};

export default class Header extends BaseComponent {
  private readonly onChangeLink: (value: string) => void;

  constructor(onChangeLink: (value: string) => void) {
    super('header', ['header', 'navbar', 'navbar-dark', 'bd-navbar']);
    this.onChangeLink = onChangeLink;

    const container = new BaseComponent('nav', ['container-xxl', 'navbar-dark', 'bd-navbar']);
    const title = createTitle();
    const nav = this.createNav();

    container.append(title, nav);
    this.append(container);
  }

  private createNav(): BaseComponent {
    const nav = new BaseComponent('ul', ['navbar-nav', 'flex-row', 'flex-wrap', 'bd-navbar-nav']);
    NAV_LINKS.forEach((el) => {
      const item = new BaseComponent('li', ['nav-item']);
      const link = new BaseComponent('a', ['nav-link'], { href: '#' }, el);
      link.appendToParent(item);
      link.addListener('click', () => {
        this.onChangeLink(el);
      });
      item.appendToParent(nav);
    });
    return nav;
  }
}
