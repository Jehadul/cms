package com.cms.repository;

import com.cms.model.Cheque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChequeRepository extends JpaRepository<Cheque, Long> {
    List<Cheque> findByChequeBookId(Long chequeBookId);

    List<Cheque> findByChequeBookIdOrderByChequeNumberAsc(Long chequeBookId);

    List<Cheque> findByStatusAndChequeDateLessThanEqual(com.cms.model.ChequeStatus status, java.time.LocalDate date);

    List<Cheque> findByStatusAndChequeDate(com.cms.model.ChequeStatus status, java.time.LocalDate date);

    long countByStatus(com.cms.model.ChequeStatus status);

    // Aggregation for reports
    @org.springframework.data.jpa.repository.Query("SELECT new com.cms.dto.PdcSummaryDTO('Outgoing', COUNT(c), SUM(c.amount), CAST(c.status AS string)) FROM Cheque c WHERE c.status IN ('ISSUED', 'PRINTED', 'DUE', 'CLEARED', 'BOUNCED') GROUP BY c.status")
    List<com.cms.dto.PdcSummaryDTO> getOutgoingChequeSummary();

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Cheque c LEFT JOIN FETCH c.chequeBook cb LEFT JOIN FETCH cb.account a LEFT JOIN FETCH a.branch b LEFT JOIN FETCH b.bank LEFT JOIN FETCH c.vendor WHERE c.status IN ('ISSUED', 'PRINTED', 'DUE') ORDER BY c.chequeDate ASC")
    List<Cheque> findActiveOutgoingCheques();
}
