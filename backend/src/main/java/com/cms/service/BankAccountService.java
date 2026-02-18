package com.cms.service;

import com.cms.dto.BankAccountDTO;
import com.cms.model.BankAccount;
import com.cms.model.Branch;
import com.cms.model.ChequeTemplate;
import com.cms.model.Company;
import com.cms.repository.BankAccountRepository;
import com.cms.repository.BranchRepository;
import com.cms.repository.ChequeTemplateRepository;
import com.cms.repository.CompanyRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BankAccountService {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private ChequeTemplateRepository chequeTemplateRepository;

    public List<BankAccountDTO> getAccountsByCompany(Long companyId) {
        return bankAccountRepository.findByCompanyId(companyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BankAccountDTO getAccountById(Long id) {
        BankAccount account = bankAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank Account not found"));
        return convertToDTO(account);
    }

    @Transactional
    public BankAccountDTO createAccount(BankAccountDTO dto) {
        BankAccount account = convertToEntity(dto);

        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));
        account.setCompany(company);

        Branch branch = branchRepository.findById(dto.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        account.setBranch(branch);

        if (dto.getDefaultTemplateId() != null) {
            ChequeTemplate template = chequeTemplateRepository.findById(dto.getDefaultTemplateId())
                    .orElse(null);
            account.setDefaultTemplate(template);
        }

        account = bankAccountRepository.save(account);
        return convertToDTO(account);
    }

    @Transactional
    public BankAccountDTO updateAccount(Long id, BankAccountDTO dto) {
        BankAccount existingAccount = bankAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank Account not found"));

        existingAccount.setAccountNumber(dto.getAccountNumber());
        existingAccount.setAccountType(dto.getAccountType());
        existingAccount.setCurrency(dto.getCurrency());
        existingAccount.setBalance(dto.getBalance());
        existingAccount.setActive(dto.isActive());

        // Allow updating branch if needed
        if (dto.getBranchId() != null && !dto.getBranchId().equals(existingAccount.getBranch().getId())) {
            Branch branch = branchRepository.findById(dto.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found"));
            existingAccount.setBranch(branch);
        }

        if (dto.getDefaultTemplateId() != null) {
            ChequeTemplate template = chequeTemplateRepository.findById(dto.getDefaultTemplateId())
                    .orElse(null);
            existingAccount.setDefaultTemplate(template);
        } else {
            existingAccount.setDefaultTemplate(null);
        }

        existingAccount = bankAccountRepository.save(existingAccount);
        return convertToDTO(existingAccount);
    }

    public void deleteAccount(Long id) {
        bankAccountRepository.deleteById(id);
    }

    private BankAccountDTO convertToDTO(BankAccount account) {
        BankAccountDTO dto = new BankAccountDTO();
        BeanUtils.copyProperties(account, dto);
        dto.setCompanyId(account.getCompany().getId());
        dto.setCompanyName(account.getCompany().getName());
        dto.setBranchId(account.getBranch().getId());
        dto.setBranchName(account.getBranch().getName());
        dto.setBankName(account.getBranch().getBank().getName());

        if (account.getDefaultTemplate() != null) {
            dto.setDefaultTemplateId(account.getDefaultTemplate().getId());
            dto.setDefaultTemplateName(account.getDefaultTemplate().getName());
        }
        return dto;
    }

    private BankAccount convertToEntity(BankAccountDTO dto) {
        BankAccount account = new BankAccount();
        BeanUtils.copyProperties(dto, account);
        // Relationships set in create/update
        return account;
    }
}
