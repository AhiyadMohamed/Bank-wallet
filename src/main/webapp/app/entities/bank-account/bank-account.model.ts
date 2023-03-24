import dayjs from 'dayjs/esm';
import { ICustomer } from 'app/entities/customer/customer.model';
import { AccountStatus } from 'app/entities/enumerations/account-status.model';

export interface IBankAccount {
  id: string;
  created?: dayjs.Dayjs | null;
  balance?: number | null;
  status?: AccountStatus | null;
  customer?: Pick<ICustomer, 'id'> | null;
}

export type NewBankAccount = Omit<IBankAccount, 'id'> & { id: null };
