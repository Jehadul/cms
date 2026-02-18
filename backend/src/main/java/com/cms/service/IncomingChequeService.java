package com.cms.service;

import com.cms.dto.IncomingChequeDTO;
import com.cms.model.Customer;
import com.cms.model.IncomingCheque;
import com.cms.repository.CustomerRepository;
import com.cms.repository.IncomingChequeRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class IncomingChequeService {

    @Autowired
    private IncomingChequeRepository incomingChequeRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private final Path fileStorageLocation = Paths.get("uploads/incoming-cheques").toAbsolutePath().normalize();

    public IncomingChequeService() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public List<IncomingChequeDTO> getAllIncomingCheques() {
        return incomingChequeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public IncomingChequeDTO getIncomingChequeById(Long id) {
        IncomingCheque cheque = incomingChequeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cheque not found"));
        return convertToDTO(cheque);
    }

    @Transactional
    public IncomingChequeDTO createIncomingCheque(IncomingChequeDTO dto, MultipartFile file) {
        // Validation
        if (incomingChequeRepository.existsByChequeNumberAndBankName(dto.getChequeNumber(), dto.getBankName())) {
            // Basic duplicate check: Same Cheque No & Same Bank.
            // In real world, might need looser check or check against customer too.
            // For now, strict warning or error? Let's error.
            throw new RuntimeException("Duplicate Cheque detected: Number " + dto.getChequeNumber() + " from "
                    + dto.getBankName() + " already exists.");
        }

        IncomingCheque cheque = convertToEntity(dto);

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        cheque.setCustomer(customer);

        // Generate Internal Ref
        cheque.setInternalRef("INC-" + System.currentTimeMillis()); // Simple unique ref

        // File Upload
        if (file != null && !file.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            try {
                Path targetLocation = this.fileStorageLocation.resolve(fileName);
                Files.copy(file.getInputStream(), targetLocation);
                cheque.setImagePath(fileName);
            } catch (IOException ex) {
                throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
            }
        }

        cheque = incomingChequeRepository.save(cheque);
        return convertToDTO(cheque);
    }

    @Transactional
    public IncomingChequeDTO updateIncomingCheque(Long id, IncomingChequeDTO dto, MultipartFile file) {
        IncomingCheque existingCheque = incomingChequeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cheque not found"));

        // Copy fields
        existingCheque.setChequeNumber(dto.getChequeNumber());
        existingCheque.setChequeDate(dto.getChequeDate());
        existingCheque.setReceivedDate(dto.getReceivedDate());
        existingCheque.setBankName(dto.getBankName());
        existingCheque.setBranchName(dto.getBranchName());
        existingCheque.setAmount(dto.getAmount());
        existingCheque.setRemarks(dto.getRemarks());
        existingCheque.setInvoiceNumber(dto.getInvoiceNumber());
        existingCheque.setStatus(dto.getStatus());

        if (file != null && !file.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            try {
                Path targetLocation = this.fileStorageLocation.resolve(fileName);
                Files.copy(file.getInputStream(), targetLocation);
                existingCheque.setImagePath(fileName);
            } catch (IOException ex) {
                throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
            }
        }

        existingCheque = incomingChequeRepository.save(existingCheque);
        return convertToDTO(existingCheque);
    }

    public void deleteIncomingCheque(Long id) {
        incomingChequeRepository.deleteById(id);
    }

    private IncomingChequeDTO convertToDTO(IncomingCheque cheque) {
        IncomingChequeDTO dto = new IncomingChequeDTO();
        BeanUtils.copyProperties(cheque, dto);
        dto.setCustomerId(cheque.getCustomer().getId());
        dto.setCustomerName(cheque.getCustomer().getName());
        return dto;
    }

    private IncomingCheque convertToEntity(IncomingChequeDTO dto) {
        IncomingCheque cheque = new IncomingCheque();
        BeanUtils.copyProperties(dto, cheque);
        return cheque;
    }
}
