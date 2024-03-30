import RightModal from '@/components/shared/base-right-modal/base-right-modal';
import type { Car as CarType } from '@/types/types';
import { updateCar } from '@/repositories/garage-repository';
import BaseComponent from '@/components/shared/base-component';
import BaseInput from '@/components/shared/base-input/base-input';
import ColorPicker from '@/components/shared/color-picker/color-picker';
import isValid from '@/utils/form-validation';
import alerts from '@/components/alert/alert';

export default class ChangeCar extends RightModal {
  private readonly contentModal: BaseComponent;

  private data: CarType | null;

  private readonly onCloseModal: () => void;

  private readonly nameInput: BaseInput;

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
    this.contentModal.append(this.nameInput, this.colorInput);

    this.data = null;
    this.onCloseModal = closeModal;
    this.submitBtn.addListener('click', (e: Event) => {
      this.submitModal(e).catch(() => null);
    });
    this.validateInput();
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
