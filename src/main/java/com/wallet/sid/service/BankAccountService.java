package com.wallet.sid.service;

import com.wallet.sid.domain.BankAccount;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link BankAccount}.
 */
public interface BankAccountService {
    /**
     * Save a bankAccount.
     *
     * @param bankAccount the entity to save.
     * @return the persisted entity.
     */
    BankAccount save(BankAccount bankAccount);

    /**
     * Updates a bankAccount.
     *
     * @param bankAccount the entity to update.
     * @return the persisted entity.
     */
    BankAccount update(BankAccount bankAccount);

    /**
     * Partially updates a bankAccount.
     *
     * @param bankAccount the entity to update partially.
     * @return the persisted entity.
     */
    Optional<BankAccount> partialUpdate(BankAccount bankAccount);

    /**
     * Get all the bankAccounts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<BankAccount> findAll(Pageable pageable);

    /**
     * Get the "id" bankAccount.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<BankAccount> findOne(UUID id);

    /**
     * Delete the "id" bankAccount.
     *
     * @param id the id of the entity.
     */
    void delete(UUID id);
}
