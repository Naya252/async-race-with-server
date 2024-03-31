import App from '@/app';
import InfoModal from './components/garage/modals/info-modal';

const app = new App();

app.init().catch((error) => {
  if (error instanceof Error && error.message === 'Failed to fetch') {
    const modal = new InfoModal();
    modal.openModal();
  }
});
