import BaseComponent from '@/components/shared/base-component';
import '@/components/footer/footer.scss';

export default class Footer extends BaseComponent {
  constructor() {
    super('footer', ['footer', 'container']);

    const github = new BaseComponent('a', ['github'], { href: 'https://github.com/Naya252', target: '_blank' });
    const rss = new BaseComponent('a', ['rs-logo'], {
      href: 'https://rs.school/js/',
      target: '_blank',
    });

    this.append(github, rss);
  }
}
