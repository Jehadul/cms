package com.cms.service;

import com.cms.dto.BranchDTO;
import com.cms.model.Bank;
import com.cms.model.Branch;
import com.cms.repository.BankRepository;
import com.cms.repository.BranchRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BranchService {

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private BankRepository bankRepository;

    public List<BranchDTO> getBranchesByBank(Long bankId) {
        return branchRepository.findByBankId(bankId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BranchDTO getBranchById(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        return convertToDTO(branch);
    }

    @Transactional
    public BranchDTO createBranch(BranchDTO branchDTO) {
        Branch branch = convertToEntity(branchDTO);

        Bank bank = bankRepository.findById(branchDTO.getBankId())
                .orElseThrow(() -> new RuntimeException("Bank not found"));
        branch.setBank(bank);

        branch = branchRepository.save(branch);
        return convertToDTO(branch);
    }

    @Transactional
    public BranchDTO updateBranch(Long id, BranchDTO branchDTO) {
        Branch existingBranch = branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        BeanUtils.copyProperties(branchDTO, existingBranch, "id", "bankId");

        existingBranch = branchRepository.save(existingBranch);
        return convertToDTO(existingBranch);
    }

    public void deleteBranch(Long id) {
        branchRepository.deleteById(id);
    }

    private BranchDTO convertToDTO(Branch branch) {
        BranchDTO dto = new BranchDTO();
        BeanUtils.copyProperties(branch, dto);
        dto.setBankId(branch.getBank().getId());
        dto.setBankName(branch.getBank().getName());
        return dto;
    }

    private Branch convertToEntity(BranchDTO dto) {
        Branch branch = new Branch();
        BeanUtils.copyProperties(dto, branch);
        return branch;
    }
}
