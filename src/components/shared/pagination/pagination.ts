import BaseComponent from '@/components/shared/base-component';
import '@/components/shared/pagination/pagination.module.scss';
import type Garage from '@/store/garage-store/store';
import type Winners from '@/store/winners-store/store';

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
  private readonly titleWrapper: BaseComponent;
  private readonly title: string;
  private readonly store: Garage | Winners;
  private readonly wrapper: BaseComponent;
  private pages: BaseComponent[] = [];
  private readonly prew: BaseComponent;
  private readonly next: BaseComponent;
  private readonly dots: BaseComponent;
  private readonly dots2: BaseComponent;
  private active: HTMLElement | null = null;
  private readonly onReplaceItems: () => void;

  constructor(title: string, store: Garage | Winners, replaceItems: () => void) {
    super('nav', ['nav-pagination']);
    this.store = store;
    this.onReplaceItems = replaceItems;
    this.title = title;
    this.titleWrapper = new BaseComponent('div', ['page-title', 'title'], {}, this.title);
    this.wrapper = new BaseComponent('ul', ['pagination', 'justify-content-end']);
    this.wrapper.addListener('click', (e: Event) => {
      this.changePage(e);
      this.onReplaceItems();
    });
    this.append(this.titleWrapper, this.wrapper);
    this.dots = new BaseComponent('div', ['page-item', 'dots-pagination'], {}, '...');
    this.dots2 = new BaseComponent('div', ['page-item', 'dots-pagination'], {}, '...');
    this.prew = createPrew();
    this.prew.addListener('click', () => {
      const curPage = this.store.getCurrentPage();
      if (curPage > 1) {
        this.store.changeCurrentPage(curPage - 1);
        this.showPages();
        this.changeActive();
      }
    });
    this.next = createNext();
    this.next.addListener('click', () => {
      const curPage = this.store.getCurrentPage();
      const count = this.store.getAllPages();
      if (curPage < count) {
        this.store.changeCurrentPage(curPage + 1);
        this.showPages();
        this.changeActive();
      }
    });
    this.createAllPages();
  }

  public createAllPages(): void {
    this.pages = [];
    const count = this.store.getAllPages();

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

    const curPage = this.store.getCurrentPage();
    const count = this.store.getAllPages();

    if (curPage === 1) {
      this.prew.setClasses(['disabled']);
    } else {
      this.prew.removeClasses(['disabled']);
    }

    if (curPage === count) {
      this.next.setClasses(['disabled']);
    } else {
      this.next.removeClasses(['disabled']);
    }

    this.wrapper.append(this.prew);

    if (this.pages.length <= 7) {
      this.appendPages();
    }
    if (this.pages.length > 7) {
      if (curPage === 1 || curPage === 2 || curPage === count || curPage === count - 1) {
        this.appendPages(0, 3);
        this.wrapper.append(this.dots);
        this.appendPages(this.pages.length - 3, this.pages.length);
      } else {
        this.appendPages(0, 1);
        this.wrapper.append(this.dots);
        this.appendPages(curPage - 2, curPage + 1);
        this.wrapper.append(this.dots2);
        this.appendPages(this.pages.length - 1, this.pages.length);
      }
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
        this.store.changeCurrentPage(Number(value));
        this.showPages();
        this.changeActive();
      }
    }
  }

  public changeActive(): void {
    if (this.active !== null) {
      this.active.classList.remove('active');
    }
    const children = this.wrapper.getChildren();
    const active = this.store.getCurrentPage();
    const arr = Array.from(children);
    const activePage = arr.find((el) => el.textContent === active.toString());
    if (activePage !== undefined && activePage instanceof HTMLElement) {
      activePage.classList.add('active');
      this.active = activePage;
    }
  }

  public chageTitle(): void {
    this.titleWrapper.setTextContent(`${this.title} - count: ${this.store.getAllItemsCount()}`);
  }

  public addDisabled(): void {
    this.wrapper.setClasses(['disabled']);
  }

  public removeDisabled(): void {
    this.wrapper.removeClasses(['disabled']);
  }

  public hide(): void {
    this.wrapper.setClasses(['hide-item']);
  }

  public show(): void {
    this.wrapper.removeClasses(['hide-item']);
  }
}
