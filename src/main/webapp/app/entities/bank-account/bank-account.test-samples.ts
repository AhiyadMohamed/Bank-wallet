import dayjs from 'dayjs/esm';

import { AccountStatus } from 'app/entities/enumerations/account-status.model';

import { IBankAccount, NewBankAccount } from './bank-account.model';

export const sampleWithRequiredData: IBankAccount = {
  id: '118d0d68-5d83-4ab2-9eb4-5f9a318c1c35',
};

export const sampleWithPartialData: IBankAccount = {
  id: 'e9946629-1d45-45a2-9509-6d8369f7a530',
  created: dayjs('2023-03-24'),
};

export const sampleWithFullData: IBankAccount = {
  id: 'c91bd875-dbc0-4063-bdac-b93d7db42273',
  created: dayjs('2023-03-23'),
  balance: 98447,
  status: AccountStatus['SUSPENDED'],
};

export const sampleWithNewData: NewBankAccount = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
