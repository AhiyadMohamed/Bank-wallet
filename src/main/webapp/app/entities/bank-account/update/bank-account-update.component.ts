import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BankAccountFormService, BankAccountFormGroup } from './bank-account-form.service';
import { IBankAccount } from '../bank-account.model';
import { BankAccountService } from '../service/bank-account.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { AccountStatus } from 'app/entities/enumerations/account-status.model';

@Component({
  selector: 'jhi-bank-account-update',
  templateUrl: './bank-account-update.component.html',
})
export class BankAccountUpdateComponent implements OnInit {
  isSaving = false;
  bankAccount: IBankAccount | null = null;
  accountStatusValues = Object.keys(AccountStatus);

  customersSharedCollection: ICustomer[] = [];

  editForm: BankAccountFormGroup = this.bankAccountFormService.createBankAccountFormGroup();

  constructor(
    protected bankAccountService: BankAccountService,
    protected bankAccountFormService: BankAccountFormService,
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCustomer = (o1: ICustomer | null, o2: ICustomer | null): boolean => this.customerService.compareCustomer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bankAccount }) => {
      this.bankAccount = bankAccount;
      if (bankAccount) {
        this.updateForm(bankAccount);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bankAccount = this.bankAccountFormService.getBankAccount(this.editForm);
    if (bankAccount.id !== null) {
      this.subscribeToSaveResponse(this.bankAccountService.update(bankAccount));
    } else {
      this.subscribeToSaveResponse(this.bankAccountService.create(bankAccount));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBankAccount>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bankAccount: IBankAccount): void {
    this.bankAccount = bankAccount;
    this.bankAccountFormService.resetForm(this.editForm, bankAccount);

    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing<ICustomer>(
      this.customersSharedCollection,
      bankAccount.customer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing<ICustomer>(customers, this.bankAccount?.customer)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));
  }
}
