package com.cms.repository;

import com.cms.model.IncomingCheque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate; // Added this import
import java.util.List;
import java.util.Optional;

@Repository
public interface IncomingChequeRepository extends JpaRepository<IncomingCheque, Long> {
    List<IncomingCheque> findByCustomerId(Long customerId);

    boolean existsByChequeNumberAndBankName(String chequeNumber, String bankName);

    Optional<IncomingCheque> findByInternalRef(String internalRef);

    List<IncomingCheque> findByStatusAndChequeDateLessThanEqual(com.cms.model.IncomingChequeStatus status,
            LocalDate date);

    // Aggregation for reports
    @org.springframework.data.jpa.repository.Query("SELECT new com.cms.dto.PdcSummaryDTO('Incoming', COUNT(c), SUM(c.amount), CAST(c.status AS string)) FROM IncomingCheque c GROUP BY c.status")
    List<com.cms.dto.PdcSummaryDTO> getIncomingChequeSummary();
}
