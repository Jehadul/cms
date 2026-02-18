package com.cms.service;

import com.cms.dto.BankDTO;
import com.cms.model.Bank;
import com.cms.model.ChequeTemplate;
import com.cms.repository.BankRepository;
import com.cms.repository.ChequeTemplateRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BankService {

    @Autowired
    private BankRepository bankRepository;

    @Autowired
    private ChequeTemplateRepository chequeTemplateRepository;

    public List<BankDTO> getAllBanks() {
        return bankRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BankDTO getBankById(Long id) {
        Bank bank = bankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank not found"));
        return convertToDTO(bank);
    }

    @Transactional
    public BankDTO createBank(BankDTO bankDTO) {
        Bank bank = convertToEntity(bankDTO);
        bank = bankRepository.save(bank);
        return convertToDTO(bank);
    }

    @Transactional
    public BankDTO updateBank(Long id, BankDTO bankDTO) {
        Bank existingBank = bankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank not found"));

        existingBank.setName(bankDTO.getName());
        existingBank.setCode(bankDTO.getCode());
        existingBank.setBranchCode(bankDTO.getBranchCode());
        existingBank.setRoutingNumber(bankDTO.getRoutingNumber());
        existingBank.setSwiftCode(bankDTO.getSwiftCode());
        existingBank.setActive(bankDTO.isActive());

        if (bankDTO.getDefaultTemplateId() != null) {
            ChequeTemplate template = chequeTemplateRepository.findById(bankDTO.getDefaultTemplateId())
                    .orElse(null);
            existingBank.setDefaultTemplate(template);
        } else {
            existingBank.setDefaultTemplate(null);
        }

        existingBank = bankRepository.save(existingBank);
        return convertToDTO(existingBank);
    }

    public void deleteBank(Long id) {
        bankRepository.deleteById(id);
    }

    private BankDTO convertToDTO(Bank bank) {
        BankDTO dto = new BankDTO();
        BeanUtils.copyProperties(bank, dto);
        if (bank.getDefaultTemplate() != null) {
            dto.setDefaultTemplateId(bank.getDefaultTemplate().getId());
            dto.setDefaultTemplateName(bank.getDefaultTemplate().getName());
        }
        return dto;
    }

    private Bank convertToEntity(BankDTO dto) {
        Bank bank = new Bank();
        BeanUtils.copyProperties(dto, bank);
        if (dto.getDefaultTemplateId() != null) {
            ChequeTemplate template = chequeTemplateRepository.findById(dto.getDefaultTemplateId())
                    .orElse(null);
            bank.setDefaultTemplate(template);
        }
        return bank;
    }
}
