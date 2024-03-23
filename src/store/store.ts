import Winners from '@/store/winners-store/store';
import Garage from '@/store/garage-store/store';

class Store {
  public garage: Garage;
  public winners: Winners;

  constructor() {
    this.garage = new Garage([]);
    this.winners = new Winners([]);
  }
}

const store = new Store();

export default store;
