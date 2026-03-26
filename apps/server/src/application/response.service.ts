import { v4 as uuid } from 'uuid';
import { Response } from '@shared/types';
import { ResponseRepository } from '../infrastructure/repositories/response.repository';

export class ResponseService {
  constructor(private repo: ResponseRepository) {}

  submit(formId: string, answers: Response['answers']) {
    const response: Response = {
      id: uuid(),
      formId,
      answers,
    };

    return this.repo.create(response);
  }

  getByFormId(formId: string) {
    return this.repo.getByFormId(formId);
  }
}