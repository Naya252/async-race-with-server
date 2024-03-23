import BaseComponent from '@/components/shared/base-component';
import type { Car as CarType } from '@/types/types';

export default class Car extends BaseComponent {
  private readonly id: number;
  private color: string;
  private readonly name: string;

  constructor(data: CarType) {
    super('div', ['car'], { id: `car-${data.id}` }, `id:${data.id} --- name:${data.name} --- color:${data.color}`);

    this.id = data.id;
    this.color = data.color;
    this.name = data.name;
  }

  protected changeColor(color: string): void {
    this.color = color;
  }

  public getColor(): string {
    return this.color;
  }

  public getName(): string {
    return this.name;
  }

  public getCarId(): number {
    return this.id;
  }

  public remove(): void {
    this.remove();
  }
}
