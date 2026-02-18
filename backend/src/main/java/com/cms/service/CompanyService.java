package com.cms.service;

import com.cms.dto.CompanyDTO;
import com.cms.model.Company;
import com.cms.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public List<CompanyDTO> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CompanyDTO getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return convertToDTO(company);
    }

    public CompanyDTO createCompany(CompanyDTO companyDTO) throws IOException {
        Company company = convertToEntity(companyDTO);

        if (companyDTO.getLogoFile() != null && !companyDTO.getLogoFile().isEmpty()) {
            String fileName = saveFile(companyDTO.getLogoFile());
            company.setLogoPath(fileName);
        }

        company = companyRepository.save(company);
        return convertToDTO(company);
    }

    public CompanyDTO updateCompany(Long id, CompanyDTO companyDTO) throws IOException {
        Company existingCompany = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        existingCompany.setName(companyDTO.getName());
        existingCompany.setCode(companyDTO.getCode()); // Ideally code might be immutable or check uniqueness
        existingCompany.setAddress(companyDTO.getAddress());
        existingCompany.setActive(companyDTO.isActive());
        existingCompany.setFinancialYearStart(companyDTO.getFinancialYearStart());
        existingCompany.setFinancialYearEnd(companyDTO.getFinancialYearEnd());
        existingCompany.setTimezone(companyDTO.getTimezone());
        existingCompany.setCurrency(companyDTO.getCurrency());
        existingCompany.setMakerCheckerEnabled(companyDTO.isMakerCheckerEnabled());
        existingCompany.setDefaultApprovalLevels(companyDTO.getDefaultApprovalLevels());

        if (companyDTO.getLogoFile() != null && !companyDTO.getLogoFile().isEmpty()) {
            String fileName = saveFile(companyDTO.getLogoFile());
            existingCompany.setLogoPath(fileName);
        }

        existingCompany = companyRepository.save(existingCompany);
        return convertToDTO(existingCompany);
    }

    public void deleteCompany(Long id) {
        companyRepository.deleteById(id);
    }

    private String saveFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFilename;
        Path filePath = uploadPath.resolve(uniqueFileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return uniqueFileName;
    }

    private CompanyDTO convertToDTO(Company company) {
        CompanyDTO dto = new CompanyDTO();
        dto.setId(company.getId());
        dto.setName(company.getName());
        dto.setCode(company.getCode());
        dto.setAddress(company.getAddress());
        dto.setActive(company.isActive());
        dto.setFinancialYearStart(company.getFinancialYearStart());
        dto.setFinancialYearEnd(company.getFinancialYearEnd());
        dto.setTimezone(company.getTimezone());
        dto.setCurrency(company.getCurrency());
        dto.setMakerCheckerEnabled(company.isMakerCheckerEnabled());
        dto.setDefaultApprovalLevels(company.getDefaultApprovalLevels());
        dto.setLogoPath(company.getLogoPath());
        return dto;
    }

    private Company convertToEntity(CompanyDTO dto) {
        Company company = new Company();
        // ID is handled by DB for create
        company.setName(dto.getName());
        company.setCode(dto.getCode());
        company.setAddress(dto.getAddress());
        company.setActive(dto.isActive());
        company.setFinancialYearStart(dto.getFinancialYearStart());
        company.setFinancialYearEnd(dto.getFinancialYearEnd());
        company.setTimezone(dto.getTimezone());
        company.setCurrency(dto.getCurrency());
        company.setMakerCheckerEnabled(dto.isMakerCheckerEnabled());
        company.setDefaultApprovalLevels(dto.getDefaultApprovalLevels());
        return company;
    }
}
