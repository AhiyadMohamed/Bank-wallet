import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBankAccount, NewBankAccount } from '../bank-account.model';

export type PartialUpdateBankAccount = Partial<IBankAccount> & Pick<IBankAccount, 'id'>;

type RestOf<T extends IBankAccount | NewBankAccount> = Omit<T, 'created'> & {
  created?: string | null;
};

export type RestBankAccount = RestOf<IBankAccount>;

export type NewRestBankAccount = RestOf<NewBankAccount>;

export type PartialUpdateRestBankAccount = RestOf<PartialUpdateBankAccount>;

export type EntityResponseType = HttpResponse<IBankAccount>;
export type EntityArrayResponseType = HttpResponse<IBankAccount[]>;

@Injectable({ providedIn: 'root' })
export class BankAccountService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bank-accounts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bankAccount: NewBankAccount): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bankAccount);
    return this.http
      .post<RestBankAccount>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(bankAccount: IBankAccount): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bankAccount);
    return this.http
      .put<RestBankAccount>(`${this.resourceUrl}/${this.getBankAccountIdentifier(bankAccount)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(bankAccount: PartialUpdateBankAccount): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bankAccount);
    return this.http
      .patch<RestBankAccount>(`${this.resourceUrl}/${this.getBankAccountIdentifier(bankAccount)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestBankAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBankAccount[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBankAccountIdentifier(bankAccount: Pick<IBankAccount, 'id'>): string {
    return bankAccount.id;
  }

  compareBankAccount(o1: Pick<IBankAccount, 'id'> | null, o2: Pick<IBankAccount, 'id'> | null): boolean {
    return o1 && o2 ? this.getBankAccountIdentifier(o1) === this.getBankAccountIdentifier(o2) : o1 === o2;
  }

  addBankAccountToCollectionIfMissing<Type extends Pick<IBankAccount, 'id'>>(
    bankAccountCollection: Type[],
    ...bankAccountsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bankAccounts: Type[] = bankAccountsToCheck.filter(isPresent);
    if (bankAccounts.length > 0) {
      const bankAccountCollectionIdentifiers = bankAccountCollection.map(
        bankAccountItem => this.getBankAccountIdentifier(bankAccountItem)!
      );
      const bankAccountsToAdd = bankAccounts.filter(bankAccountItem => {
        const bankAccountIdentifier = this.getBankAccountIdentifier(bankAccountItem);
        if (bankAccountCollectionIdentifiers.includes(bankAccountIdentifier)) {
          return false;
        }
        bankAccountCollectionIdentifiers.push(bankAccountIdentifier);
        return true;
      });
      return [...bankAccountsToAdd, ...bankAccountCollection];
    }
    return bankAccountCollection;
  }

  protected convertDateFromClient<T extends IBankAccount | NewBankAccount | PartialUpdateBankAccount>(bankAccount: T): RestOf<T> {
    return {
      ...bankAccount,
      created: bankAccount.created?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restBankAccount: RestBankAccount): IBankAccount {
    return {
      ...restBankAccount,
      created: restBankAccount.created ? dayjs(restBankAccount.created) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBankAccount>): HttpResponse<IBankAccount> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBankAccount[]>): HttpResponse<IBankAccount[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
