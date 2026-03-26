import { v4 as uuid } from 'uuid';
import { Form } from '@shared/types';
import { FormRepository } from '../infrastructure/repositories/form.repository';

export class FormService {
  constructor(private repo: FormRepository) {}

  createForm(input: Omit<Form, 'id'>): Form {
    const form: Form = {
      ...input,
      id: uuid(),
    };

    return this.repo.create(form);
  }

  getForms() {
    return this.repo.getAll();
  }

  getForm(id: string) {
    return this.repo.getById(id);
  }

  deleteForm(id: string): boolean {
    return this.repo.delete(id)
  }
  
}