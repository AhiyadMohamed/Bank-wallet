import { ICustomer, NewCustomer } from './customer.model';

export const sampleWithRequiredData: ICustomer = {
  id: 24379,
};

export const sampleWithPartialData: ICustomer = {
  id: 53950,
  email: 'Flavie_Wilderman@gmail.com',
};

export const sampleWithFullData: ICustomer = {
  id: 44567,
  name: 'scalable',
  email: 'Josue_Morar85@yahoo.com',
};

export const sampleWithNewData: NewCustomer = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
