import BaseModal from '@/components/shared/base-modal/base-modal';
import type { Car as CarType, CarTemplate } from '@/types/types';
import { createCar } from '@/repositories/garage-repository';
import BaseComponent from '@/components/shared/base-component';
import BaseInput from '@/components/shared/base-input/base-input';
import ColorPicker from '@/components/shared/color-picker/color-picker';
import isValid from '@/utils/form-validation';

export default class CreateCar extends BaseModal {
  private readonly contentModal: BaseComponent;
  private data: CarTemplate | null;
  private readonly onCloseModal: (data: CarType) => void;
  private readonly nameInput: BaseInput;
  private readonly colorInput: ColorPicker;
  public isSubmit = false;

  constructor(closeModal: (carData: CarType) => void) {
    super();
    this.contentModal = new BaseComponent('form', ['needs-validation'], { novalidate: '', action: '', method: 'post' });
    this.title.setTextContent(`Add new car`);
    this.nameInput = new BaseInput('name', 'Name', 'name-text', 'subtext', {
      required: '',
      autocomplete: 'off',
      value: '',
      maxlength: '30',
      minlength: '3',
      pattern: '^[A-Z]{1}[a-z]*-?[A-Za-z]*$',
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

  private fillForm(): void {
    if (this.data !== null) {
      this.nameInput.changeValue(this.data.name);
      this.colorInput.changeValue(this.data.color);
      this.body.replaceChildren(this.contentModal);
    }
  }

  public openModal(): void {
    this.data = { name: '', color: '#000000' };
    this.fillForm();
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

        const newCar = await createCar(this.data);
        this.onCloseModal(newCar);
        this.close();
      }
    } catch (err) {
      console.log(err);
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
