import BaseComponent from '@/components/shared/base-component';
import '@/components/shared/pagination/pagination.module.scss';
import store from '@/store/store';

const createPrew = (): BaseComponent => {
  const item = new BaseComponent('li', ['page-item']);
  const link = new BaseComponent('a', ['page-link'], { href: '#', 'aria-label': 'Previous' });
  const span = new BaseComponent('span', [], { 'aria-hidden': 'true' });
  span.setHTML(`&laquo;`);
  link.append(span);
  item.append(link);
  return item;
};

const createPage = (value: number | string): BaseComponent => {
  const item = new BaseComponent('li', ['page-item', 'page']);
  const link = new BaseComponent('a', ['page-link'], { href: '#' }, `${value}`);
  item.append(link);
  return item;
};

const createNext = (): BaseComponent => {
  const item = new BaseComponent('li', ['page-item']);
  const link = new BaseComponent('a', ['page-link'], { href: '#', 'aria-label': 'Next' });
  const span = new BaseComponent('span', [], { 'aria-hidden': 'true' });
  span.setHTML(`&raquo;`);
  link.append(span);
  item.append(link);
  return item;
};

export default class Pagination extends BaseComponent {
  private readonly wrapper: BaseComponent;
  private pages: BaseComponent[] = [];
  private readonly prew: BaseComponent;
  private readonly next: BaseComponent;
  private readonly dots: BaseComponent;
  private active: HTMLElement | null = null;
  private readonly onReplaceCars: () => void;

  constructor(replaceCars: () => void) {
    super('nav');
    this.onReplaceCars = replaceCars;
    this.wrapper = new BaseComponent('ul', ['pagination', 'justify-content-end']);
    this.wrapper.addListener('click', (e: Event) => {
      this.changePage(e);
      this.onReplaceCars();
    });
    this.append(this.wrapper);
    this.dots = new BaseComponent('div', ['page-item', 'dots-pagination'], {}, '...');
    this.prew = createPrew();
    this.next = createNext();
    this.createAllPages();
  }

  public createAllPages(): void {
    this.pages = [];
    const count = store.garage.getAllPages();

    let i = 0;
    while (i < count) {
      i += 1;
      const page = createPage(i);
      this.pages.push(page);
    }

    this.showPages();
  }

  public showPages(): void {
    this.wrapper.setHTML('');
    this.wrapper.append(this.prew);

    if (this.pages.length <= 7) {
      this.appendPages();
    } else {
      this.appendPages(0, 3);
      this.wrapper.append(this.dots);
      this.appendPages(this.pages.length - 3, this.pages.length);
    }

    this.changeActive();
    this.wrapper.append(this.next);
  }

  private appendPages(start = 0, end = this.pages.length): void {
    let i = start;
    while (i < end) {
      const item = this.pages[i];
      if (typeof item !== 'undefined') {
        this.wrapper.append(item);
      }
      i += 1;
    }
  }

  public changePage(e: Event): void {
    const { target } = e;
    if (target !== null && target instanceof HTMLElement) {
      const item = target.closest('.page');
      const value = item?.textContent;
      if (value !== null && typeof value !== 'undefined') {
        store.garage.changeCurrentPage(+value);
        this.changeActive();
      }
    }
  }

  public changeActive(): void {
    if (this.active !== null) {
      this.active.classList.remove('active');
    }
    const children = this.wrapper.getChildren();
    const active = store.garage.getCurrentPage();
    const activePage = children[active];
    if (activePage !== undefined && activePage instanceof HTMLElement) {
      activePage.classList.add('active');
      this.active = activePage;
    }
  }
}
