package com.cms.service;

import com.cms.dto.CustomerDTO;
import com.cms.model.Company;
import com.cms.model.Customer;
import com.cms.repository.CompanyRepository;
import com.cms.repository.CustomerRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public List<CustomerDTO> getCustomersByCompany(Long companyId) {
        return customerRepository.findByCompanyId(companyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return convertToDTO(customer);
    }

    @Transactional
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        Customer customer = convertToEntity(customerDTO);

        Company company = companyRepository.findById(customerDTO.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));
        customer.setCompany(company);

        customer = customerRepository.save(customer);
        return convertToDTO(customer);
    }

    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        BeanUtils.copyProperties(customerDTO, existingCustomer, "id", "companyId");

        existingCustomer = customerRepository.save(existingCustomer);
        return convertToDTO(existingCustomer);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    private CustomerDTO convertToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        BeanUtils.copyProperties(customer, dto);
        dto.setCompanyId(customer.getCompany().getId());
        return dto;
    }

    private Customer convertToEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        BeanUtils.copyProperties(dto, customer);
        return customer;
    }
}
