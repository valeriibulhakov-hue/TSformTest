import { Form } from '@shared/types';

export class FormRepository {
  private forms = new Map<string, Form>();

  getAll() {
    return Array.from(this.forms.values());
  }

  getById(id: string) {
    return this.forms.get(id);
  }

  create(form: Form) {
    this.forms.set(form.id, form);
    return form;
  }

  delete(id: string): boolean {
    return this.forms.delete(id)
  }
  
}