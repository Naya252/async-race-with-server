import BaseComponent from '@/components/shared/base-component';
import '@/components/header/header.module.scss';
import { APP_NAME, NAV_LINKS } from '@/shared/constants';

const createTitle = (): BaseComponent => {
  const title = new BaseComponent('h1', ['title'], {}, APP_NAME);
  return title;
};

const createNav = (): BaseComponent => {
  const nav = new BaseComponent('ul', ['navbar-nav', 'flex-row', 'flex-wrap', 'bd-navbar-nav']);
  NAV_LINKS.forEach((el) => {
    const item = new BaseComponent('li', ['nav-item']);
    const link = new BaseComponent('a', ['nav-link'], { href: '#' }, el);
    link.appendToParent(item);
    item.appendToParent(nav);
  });
  return nav;
};

export default class Header extends BaseComponent {
  constructor() {
    super('header', ['header', 'navbar', 'navbar-dark', 'bd-navbar']);

    const container = new BaseComponent('nav', ['container-xxl', 'navbar-dark', 'bd-navbar']);
    const title = createTitle();
    const nav = createNav();

    container.append(title, nav);
    this.append(container);
  }
}
