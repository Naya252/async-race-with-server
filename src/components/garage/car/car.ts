import BaseComponent from '@/components/shared/base-component';
import type { Car as CarType } from '@/types/types';
import car from '@/assets/img/car';
import './car.scss';

export default class Car extends BaseComponent {
  private readonly id: number;

  private color: string;

  private name: string;

  constructor(data: CarType) {
    super('div', ['car'], { id: `car-${data.id}`, style: `color: ${data.color}` });

    this.setHTML(car);

    this.id = data.id;
    this.color = data.color;
    this.name = data.name;
  }

  protected changeColor(color: string): void {
    this.color = color;
  }

  public setCar(data: CarType): void {
    this.setColor(data.color);
    this.setName(data.name);
  }

  public getColor(): string {
    return this.color;
  }

  public setColor(color: string): void {
    this.color = color;
    this.setAttributes({ style: `color: ${this.color}` });
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getCarId(): number {
    return this.id;
  }

  public remove(): void {
    this.remove();
  }
}
