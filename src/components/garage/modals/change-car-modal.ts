import RightModal from '@/components/shared/base-right-modal/base-right-modal';
import type { Car as CarType } from '@/types/types';
import { updateCar } from '@/repositories/garage-repository';
import BaseComponent from '@/components/shared/base-component';
import BaseInput from '@/components/shared/base-input/base-input';
import ColorPicker from '@/components/shared/color-picker/color-picker';
import isValid from '@/utils/form-validation';
import alerts from '@/components/alert/alert';
import Car from '@/components/garage/car/car';
import carStyles from '@/components/garage/car/car.module.scss';

export default class ChangeCar extends RightModal {
  private readonly contentModal: BaseComponent;

  private data: CarType | null;

  private readonly onCloseModal: () => void;

  private readonly nameInput: BaseInput;

  private readonly car: Car;

  private readonly colorInput: ColorPicker;

  public isSubmit = false;

  constructor(closeModal: () => void) {
    super();
    this.contentModal = new BaseComponent('form', ['needs-validation'], { novalidate: '', action: '', method: 'post' });
    this.title.setTextContent(`Change car`);
    this.nameInput = new BaseInput('name', 'Name', 'name-text', 'subtext', {
      required: '',
      autocomplete: 'off',
      value: '',
      maxlength: '30',
      minlength: '3',
      pattern: '^[A-Z]{1}[a-z0-9]*-?[A-Za-z0-9]* ?[A-Za-z0-9]*$',
    });

    this.colorInput = new ColorPicker();
    this.data = null;

    this.car = new Car({ id: 0, name: '', color: '#000000' });
    this.car.setClasses([carStyles['width-70']]);
    this.contentModal.append(this.nameInput, this.colorInput, this.car);

    this.onCloseModal = closeModal;
    this.submitBtn.addListener('click', (e: Event) => {
      this.submitModal(e).catch(() => null);
    });

    this.validateInput();
    this.colorInput.addListener('input', (event: Event) => this.inputCarColor(event));
    this.colorInput.addListener('change', (event: Event) => this.changeCarColor(event));
  }

  private inputCarColor(event: Event): void {
    if (event.target !== null && event.target instanceof HTMLInputElement) {
      const picker = event.target.closest('#picker');

      if (picker && picker instanceof HTMLInputElement) {
        this.car.setColor(picker.value);
      }
    }
  }

  private changeCarColor(event: Event): void {
    if (event.target !== null && event.target instanceof HTMLInputElement) {
      const text = event.target.closest('#color');
      if (text && text instanceof HTMLInputElement) {
        this.car.setColor(text.value);
      }
    }
  }

  private fillForm(carData: CarType): void {
    this.nameInput.changeValue(carData.name);
    this.colorInput.changeValue(carData.color);
    this.body.replaceChildren(this.contentModal);
  }

  public openModal(carData: CarType): void {
    this.submitBtn.removeClasses(['disabled']);
    this.data = carData;
    this.nameInput.changeSubText();
    this.colorInput.changeSubText();
    this.car.setColor(carData.color);
    this.fillForm(carData);
    this.isSubmit = false;
    this.contentModal.removeClasses(['was-validated']);
    this.open();
  }

  private changeData(): void {
    if (this.data !== null) {
      this.data.name = this.nameInput.getValue();
      this.data.color = this.colorInput.getValue();
    }
  }

  public async submitModal(e: Event): Promise<void> {
    try {
      if (this.data !== null && this.validateForm(e)) {
        this.changeData();
        this.submitBtn.setClasses(['disabled']);
        await updateCar(this.data);
        this.onCloseModal();
        this.close();
        alerts.addAlert('success', `${this.data.name} updated`);
      }
    } catch (err) {
      alerts.addAlert('warning', `Error with changing car`);
    }
  }

  private validateInput(): void {
    this.nameInput.inputListener('input', () => {
      if (this.isSubmit) {
        isValid(this.contentModal.getElement());
      }
    });
    this.colorInput.colorListener('input', () => {
      if (this.isSubmit) {
        isValid(this.contentModal.getElement());
      }
    });
    this.colorInput.colorPickerListener('change', () => {
      if (this.isSubmit) {
        isValid(this.contentModal.getElement());
      }
    });
  }

  private validateForm(e: Event): boolean {
    this.isSubmit = true;

    const isValidData = isValid(this.contentModal.getElement());

    e.preventDefault();
    e.stopPropagation();

    this.contentModal.setClasses(['was-validated']);
    return isValidData;
  }
}
