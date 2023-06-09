import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BankAccountDetailComponent } from './bank-account-detail.component';

describe('BankAccount Management Detail Component', () => {
  let comp: BankAccountDetailComponent;
  let fixture: ComponentFixture<BankAccountDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankAccountDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bankAccount: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
        },
      ],
    })
      .overrideTemplate(BankAccountDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BankAccountDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bankAccount on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bankAccount).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });
});
