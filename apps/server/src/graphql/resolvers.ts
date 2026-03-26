import { v4 as uuid } from 'uuid';
import { FormRepository } from '../infrastructure/repositories/form.repository';
import { ResponseRepository } from '../infrastructure/repositories/response.repository';
import { FormService } from '../application/form.service';
import { ResponseService } from '../application/response.service';

const formService = new FormService(new FormRepository());
const responseService = new ResponseService(new ResponseRepository());

export const resolvers = {
  Query: {
    forms: () => formService.getForms(),
    form: (_: any, { id }: { id: string }) => formService.getForm(id),
    responses: (_: any, { formId }: { formId: string }) =>
      responseService.getByFormId(formId),
  },

  Mutation: {
    createForm: (_: any, args: any) => {
      return formService.createForm({
        title: args.title,
        description: args.description,
        questions: args.questions.map((q: any) => ({
          ...q,
          id: uuid(),
        })),
      });
    },

    submitResponse: (_: any, { formId, answers }: any) => {
      return responseService.submit(formId, answers);
    },

    deleteForm: (_: any, { id }: { id: string }) => {
    return formService.deleteForm(id)
  },
  
  },
};