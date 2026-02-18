package com.cms.repository;

import com.cms.model.ChequeBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChequeBookRepository extends JpaRepository<ChequeBook, Long> {
    List<ChequeBook> findByAccountId(Long accountId);

    // Logic to check overlapping ranges for the same account
    @Query("SELECT COUNT(cb) > 0 FROM ChequeBook cb WHERE cb.account.id = :accountId AND " +
            "((:startNumber BETWEEN cb.startNumber AND cb.endNumber) OR " +
            "(:endNumber BETWEEN cb.startNumber AND cb.endNumber) OR " +
            "(cb.startNumber BETWEEN :startNumber AND :endNumber))")
    boolean existsOverlappingChequeBook(@Param("accountId") Long accountId,
            @Param("startNumber") long startNumber,
            @Param("endNumber") long endNumber);
}
