import BaseComponent from '@/components/shared/base-component';
import styles from '@/components/footer/footer.module.scss';

export default class Footer extends BaseComponent {
  constructor() {
    super('footer', [styles.footer, 'container']);

    const github = new BaseComponent('a', [styles.github], { href: 'https://github.com/Naya252', target: '_blank' });
    const rss = new BaseComponent('a', [styles['rs-logo']], {
      href: 'https://rs.school/',
      target: '_blank',
    });

    this.append(github, rss);
  }
}
