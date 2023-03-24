package com.wallet.sid.service.impl;

import com.wallet.sid.domain.BankAccount;
import com.wallet.sid.repository.BankAccountRepository;
import com.wallet.sid.service.BankAccountService;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link BankAccount}.
 */
@Service
@Transactional
public class BankAccountServiceImpl implements BankAccountService {

    private final Logger log = LoggerFactory.getLogger(BankAccountServiceImpl.class);

    private final BankAccountRepository bankAccountRepository;

    public BankAccountServiceImpl(BankAccountRepository bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }

    @Override
    public BankAccount save(BankAccount bankAccount) {
        log.debug("Request to save BankAccount : {}", bankAccount);
        return bankAccountRepository.save(bankAccount);
    }

    @Override
    public BankAccount update(BankAccount bankAccount) {
        log.debug("Request to update BankAccount : {}", bankAccount);
        return bankAccountRepository.save(bankAccount);
    }

    @Override
    public Optional<BankAccount> partialUpdate(BankAccount bankAccount) {
        log.debug("Request to partially update BankAccount : {}", bankAccount);

        return bankAccountRepository
            .findById(bankAccount.getId())
            .map(existingBankAccount -> {
                if (bankAccount.getCreated() != null) {
                    existingBankAccount.setCreated(bankAccount.getCreated());
                }
                if (bankAccount.getBalance() != null) {
                    existingBankAccount.setBalance(bankAccount.getBalance());
                }
                if (bankAccount.getStatus() != null) {
                    existingBankAccount.setStatus(bankAccount.getStatus());
                }

                return existingBankAccount;
            })
            .map(bankAccountRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BankAccount> findAll(Pageable pageable) {
        log.debug("Request to get all BankAccounts");
        return bankAccountRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<BankAccount> findOne(UUID id) {
        log.debug("Request to get BankAccount : {}", id);
        return bankAccountRepository.findById(id);
    }

    @Override
    public void delete(UUID id) {
        log.debug("Request to delete BankAccount : {}", id);
        bankAccountRepository.deleteById(id);
    }
}
