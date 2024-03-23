import { type Winner } from '@/types/types';

export default class Winers {
  private winners: Winner[];

  constructor(winnersData: Winner[]) {
    this.winners = winnersData;
  }

  public getWinners(): Winner[] {
    return this.winners;
  }

  public addWinner(winner: Winner): void {
    this.winners.push(winner);
  }

  public removeWinner(winner: Winner): void {
    this.winners = this.winners.filter((el) => el !== winner);
  }

  public changeWinnerWins(winner: Winner): void {
    const item = this.winners.find((el) => el.id === winner.id);
    if (item !== null && typeof item !== 'undefined') {
      item.wins = winner.wins;
    }
  }

  public changeWinnerTime(winner: Winner): void {
    const item = this.winners.find((el) => el.id === winner.id);
    if (item !== null && typeof item !== 'undefined') {
      if (winner.time < item.time) {
        item.time = winner.time;
      }
    }
  }
}
