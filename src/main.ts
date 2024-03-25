import App from '@/app';

const app = new App();

app.init().catch((error: Error) => {
  console.error(error);
});
