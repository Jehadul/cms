package com.cms.service;

import com.cms.dto.VendorDTO;
import com.cms.model.Company;
import com.cms.model.Vendor;
import com.cms.repository.CompanyRepository;
import com.cms.repository.VendorRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public List<VendorDTO> getVendorsByCompany(Long companyId) {
        return vendorRepository.findByCompanyId(companyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VendorDTO> getAllVendors() {
        return vendorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public VendorDTO getVendorById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        return convertToDTO(vendor);
    }

    @Transactional
    public VendorDTO createVendor(VendorDTO vendorDTO) {
        Vendor vendor = convertToEntity(vendorDTO);

        Company company = companyRepository.findById(vendorDTO.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));
        vendor.setCompany(company);

        vendor = vendorRepository.save(vendor);
        return convertToDTO(vendor);
    }

    @Transactional
    public VendorDTO updateVendor(Long id, VendorDTO vendorDTO) {
        Vendor existingVendor = vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        BeanUtils.copyProperties(vendorDTO, existingVendor, "id", "companyId");

        // Ensure company is not accidentally changed or handle if it should be
        // For now preventing company change on update or re-fetching if passed
        // existingVendor.setCompany(...)

        existingVendor = vendorRepository.save(existingVendor);
        return convertToDTO(existingVendor);
    }

    public void deleteVendor(Long id) {
        vendorRepository.deleteById(id);
    }

    private VendorDTO convertToDTO(Vendor vendor) {
        VendorDTO dto = new VendorDTO();
        BeanUtils.copyProperties(vendor, dto);
        dto.setCompanyId(vendor.getCompany().getId());
        return dto;
    }

    private Vendor convertToEntity(VendorDTO dto) {
        Vendor vendor = new Vendor();
        BeanUtils.copyProperties(dto, vendor);
        return vendor;
    }
}
