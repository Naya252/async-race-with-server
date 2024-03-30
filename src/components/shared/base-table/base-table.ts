import BaseComponent from '@/components/shared/base-component';
import '@/components/shared/base-table/base-table.scss';
import type { TableTitle } from '@/types/types';

export default class BaseTable extends BaseComponent {
  public readonly head: BaseComponent;

  private readonly tr: BaseComponent;

  private readonly body: BaseComponent;

  private readonly titles: TableTitle[];

  private rows: BaseComponent[];

  constructor(titles: TableTitle[]) {
    super('table', ['table', 'table-striped']);
    this.titles = titles;

    this.head = new BaseComponent('thead');
    this.tr = new BaseComponent('tr');
    this.head.append(this.tr);
    this.body = new BaseComponent('tbody');
    this.rows = [];

    this.createHeaderItems();
    this.append(this.head, this.body);
  }

  private createHeaderItems(): void {
    this.titles.forEach((el) => {
      const th = new BaseComponent('th', [...el.cssClasses, 'table-title'], { scope: 'col', id: el.key }, el.value);
      this.tr.append(th);

      if (el.isSort === true) {
        th.addListener('click', () => {
          const elements = this.tr.getChildren();
          const element = th.getElement();
          const id = element.getAttribute('id');

          elements.forEach((elem) => {
            if (elem instanceof HTMLElement) {
              const elId = elem.getAttribute('id');
              if (id !== elId) {
                elem.classList.add('shadow-icon');
                elem.classList.remove('active');
                elem.classList.remove('desc');
              }
            }
          });

          if (element.classList.contains('shadow-icon')) {
            element.classList.remove('shadow-icon');
            element.classList.add('active');
            return;
          }
          if (element.classList.contains('desc')) {
            element.classList.remove('desc');
            return;
          }
          if (element.classList.contains('active')) {
            element.classList.add('desc');
          }
        });
      }
    });
  }

  public clearItems(): void {
    this.rows = [];
  }

  public changeTable(): void {
    this.body.replaceChildren(...this.rows);
  }

  public createBodyItem(item: Record<string, string | number | HTMLElement>): void {
    const fields = Object.values(item);
    const tr = new BaseComponent('tr');
    const th = new BaseComponent('th', [], {}, String(fields[0]));
    tr.append(th);

    let i = 1;
    while (i < this.titles.length) {
      let td;
      const data = fields[i];
      if (typeof data === 'undefined') {
        throw new Error('undefined');
      }
      if (data instanceof HTMLElement) {
        td = new BaseComponent('td');
        td.append(data);
      } else {
        td = new BaseComponent('td', [], {}, String(data));
      }

      tr.append(td);
      i += 1;
    }

    this.rows.push(tr);
  }
}
