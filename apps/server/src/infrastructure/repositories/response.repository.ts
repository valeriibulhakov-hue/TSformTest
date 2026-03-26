import { Response } from '@shared/types';

export class ResponseRepository {
  private responses: Response[] = [];

  getByFormId(formId: string) {
    return this.responses.filter(r => r.formId === formId);
  }

  create(response: Response) {
    this.responses.push(response);
    return response;
  }
}