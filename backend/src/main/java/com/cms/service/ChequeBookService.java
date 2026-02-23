package com.cms.service;

import com.cms.dto.ChequeBookDTO;
import com.cms.dto.ChequeDTO;
import com.cms.model.BankAccount;
import com.cms.model.Cheque;
import com.cms.model.ChequeBook;
import com.cms.model.ChequeStatus;
import com.cms.model.ChequeWorkflowStatus;
import com.cms.repository.BankAccountRepository;
import com.cms.repository.ChequeBookRepository;
import com.cms.repository.ChequeRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChequeBookService {

    @Autowired
    private ChequeBookRepository chequeBookRepository;

    @Autowired
    private ChequeRepository chequeRepository;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private com.cms.repository.VendorRepository vendorRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<ChequeBookDTO> getChequeBooksByAccount(Long accountId) {
        return chequeBookRepository.findByAccountId(accountId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ChequeBookDTO getChequeBookById(Long id) {
        ChequeBook chequeBook = chequeBookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cheque Book not found"));
        return convertToDTO(chequeBook);
    }

    public List<ChequeDTO> getChequesByBook(Long bookId) {
        return chequeRepository.findByChequeBookIdOrderByChequeNumberAsc(bookId).stream()
                .map(this::convertChequeToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChequeBookDTO createChequeBook(ChequeBookDTO dto) {
        // 1. Validate Account
        BankAccount account = bankAccountRepository.findById(dto.getAccountId())
                .orElseThrow(() -> new RuntimeException("Bank Account not found"));

        // 2. Validate Overlap
        boolean overlap = chequeBookRepository.existsOverlappingChequeBook(dto.getAccountId(), dto.getStartNumber(),
                dto.getEndNumber());
        if (overlap) {
            throw new RuntimeException("Cheque number range overlaps with an existing cheque book for this account.");
        }

        if (dto.getStartNumber() > dto.getEndNumber()) {
            throw new RuntimeException("Start number cannot be greater than end number.");
        }

        // 3. Create Book
        ChequeBook book = new ChequeBook();
        book.setAccount(account);
        book.setSeriesIdentifier(dto.getSeriesIdentifier());
        book.setStartNumber(dto.getStartNumber());
        book.setEndNumber(dto.getEndNumber());
        book.setCurrentNumber(dto.getStartNumber());
        book.setIssuedDate(dto.getIssuedDate());
        book.setActive(true);

        book = chequeBookRepository.save(book);

        // 4. Pre-generate Cheques
        List<Cheque> cheques = new ArrayList<>();
        for (long num = book.getStartNumber(); num <= book.getEndNumber(); num++) {
            Cheque cheque = new Cheque();
            cheque.setChequeBook(book);
            cheque.setChequeNumber(num);
            cheque.setStatus(ChequeStatus.UNUSED);
            cheques.add(cheque);
        }
        chequeRepository.saveAll(cheques);

        return convertToDTO(book);
    }

    @Transactional
    public ChequeDTO updateChequeStatus(Long chequeId, ChequeStatus status, String remarks) {
        Cheque cheque = chequeRepository.findById(chequeId)
                .orElseThrow(() -> new RuntimeException("Cheque not found"));

        // Basic validation logic can go here (e.g., can't un-void if auditing is
        // strict)
        ChequeStatus oldStatus = cheque.getStatus();

        cheque.setStatus(status);
        if (remarks != null) {
            cheque.setRemarks(remarks);
        }

        cheque = chequeRepository.save(cheque);

        auditLogService.logAction("Cheque", cheque.getId(), status.name(), oldStatus.name(), status.name());

        return convertChequeToDTO(cheque);
    }

    @Transactional
    public ChequeDTO createOutgoingCheque(ChequeDTO dto) {
        // 1. Find next UNUSED cheque for the account (via ChequeBook)
        // Note: DTO should come with AccountID preferably, or we auto-select book?
        // Let's assume the user passes chequeBookId or accountId.
        // Or simpler: User picks a specific Cheque Number from UI (which shows
        // available ones).
        // Let's assume DTO has chequeId if picking specific, or we find next.

        Cheque cheque;
        if (dto.getId() != null) {
            cheque = chequeRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Cheque not found"));
        } else if (dto.getChequeBookId() != null) {
            // Find first Unused
            List<Cheque> unused = chequeRepository.findByChequeBookIdOrderByChequeNumberAsc(dto.getChequeBookId())
                    .stream().filter(c -> c.getStatus() == ChequeStatus.UNUSED).collect(Collectors.toList());
            if (unused.isEmpty()) {
                throw new RuntimeException("No unused cheques in this book.");
            }
            cheque = unused.get(0);
        } else {
            throw new RuntimeException("Cheque Book ID required.");
        }

        if (cheque.getStatus() != ChequeStatus.UNUSED && cheque.getStatus() != ChequeStatus.ISSUED) { // Allow editing
                                                                                                      // ISSUED if in
                                                                                                      // Draft?
            // Actually, if it's already used, we should be careful.
            if (cheque.getStatus() != ChequeStatus.UNUSED && dto.getWorkflowStatus() == ChequeWorkflowStatus.DRAFT) {
                // Editing draft is fine?
                // We need to clarify state machine.
            }
        }

        cheque.setAmount(dto.getAmount());
        cheque.setPayeeName(dto.getPayeeName());
        cheque.setChequeDate(dto.getChequeDate());
        cheque.setWorkflowStatus(
                dto.getWorkflowStatus() != null ? dto.getWorkflowStatus() : ChequeWorkflowStatus.DRAFT);

        if (dto.getStatus() != null) {
            cheque.setStatus(dto.getStatus());
        } else if (dto.getWorkflowStatus() == ChequeWorkflowStatus.APPROVED
                || dto.getWorkflowStatus() == ChequeWorkflowStatus.PRINTED) {
            cheque.setStatus(ChequeStatus.ISSUED);
        }

        // Link Vendor
        if (dto.getVendorId() != null) {
            com.cms.model.Vendor vendor = vendorRepository.findById(dto.getVendorId())
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));
            cheque.setVendor(vendor);
        } else {
            cheque.setVendor(null); // Clear if user unlinked
        }

        String action = (dto.getId() == null) ? "CREATE" : "UPDATE";
        String oldStatus = cheque.getStatus() != null ? cheque.getStatus().name() : "";
        cheque = chequeRepository.save(cheque);
        String newStatus = cheque.getStatus() != null ? cheque.getStatus().name() : "";

        auditLogService.logAction("Cheque", cheque.getId(), action, oldStatus, newStatus);

        return convertChequeToDTO(cheque);
    }

    private ChequeBookDTO convertToDTO(ChequeBook book) {
        ChequeBookDTO dto = new ChequeBookDTO();
        BeanUtils.copyProperties(book, dto);
        dto.setAccountId(book.getAccount().getId());
        dto.setBankName(book.getAccount().getBranch().getBank().getName());
        dto.setAccountNumber(book.getAccount().getAccountNumber());

        dto.setTotalLeaves((int) (book.getEndNumber() - book.getStartNumber() + 1));
        // Simple heuristic for used leaves, or query count of !UNUSED
        // For now, let's leave usedLeaves as 0 or calculate if needed potentially
        // expensive
        return dto;
    }

    private ChequeDTO convertChequeToDTO(Cheque cheque) {
        ChequeDTO dto = new ChequeDTO();
        BeanUtils.copyProperties(cheque, dto);
        dto.setChequeBookId(cheque.getChequeBook().getId());
        if (cheque.getVendor() != null) {
            dto.setVendorId(cheque.getVendor().getId());
            dto.setVendorName(cheque.getVendor().getName());
        }
        return dto;
    }

    @Transactional
    public void executeApprovedChequeIssue(Long chequeId, String payloadJson) {
        Cheque cheque = chequeRepository.findById(chequeId).orElseThrow(() -> new RuntimeException("Cheque not found"));
        ChequeStatus oldStatus = cheque.getStatus();

        cheque.setWorkflowStatus(ChequeWorkflowStatus.APPROVED);
        cheque.setStatus(ChequeStatus.ISSUED);
        cheque = chequeRepository.save(cheque);

        auditLogService.logAction("Cheque", cheque.getId(), "ISSUE_APPROVED", oldStatus.name(),
                ChequeStatus.ISSUED.name());
    }

    @Transactional
    public void executeRejectedChequeIssue(Long chequeId) {
        Cheque cheque = chequeRepository.findById(chequeId).orElseThrow(() -> new RuntimeException("Cheque not found"));

        cheque.setWorkflowStatus(ChequeWorkflowStatus.REJECTED);
        // Revert to UNUSED and clear payee fields so it can be re-issued
        cheque.setStatus(ChequeStatus.UNUSED);
        cheque.setPayeeName(null);
        cheque.setAmount(null);
        cheque.setVendor(null);
        cheque.setChequeDate(null);

        cheque = chequeRepository.save(cheque);

        auditLogService.logAction("Cheque", cheque.getId(), "ISSUE_REJECTED", "PENDING_APPROVAL",
                "REJECTED (Reverted to UNUSED)");
    }
}
