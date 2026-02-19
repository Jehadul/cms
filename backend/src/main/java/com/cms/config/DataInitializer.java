package com.cms.config;

import com.cms.model.Company;
import com.cms.model.Role;
import com.cms.model.User;
import com.cms.model.UserCompanyRole;
import com.cms.repository.CompanyRepository;
import com.cms.repository.UserCompanyRoleRepository;
import com.cms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private UserCompanyRoleRepository userCompanyRoleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.cms.repository.ChequeRepository chequeRepository;

    @Autowired
    private com.cms.repository.BankRepository bankRepository;
    @Autowired
    private com.cms.repository.BranchRepository branchRepository;
    @Autowired
    private com.cms.repository.BankAccountRepository bankAccountRepository;
    @Autowired
    private com.cms.service.ChequeBookService chequeBookService;
    @Autowired
    private com.cms.repository.CustomerRepository customerRepository;
    @Autowired
    private com.cms.repository.VendorRepository vendorRepository;
    @Autowired
    private com.cms.service.IncomingChequeService incomingChequeService;
    @Autowired
    private com.cms.repository.ChequeTemplateRepository chequeTemplateRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create Default Company if not exists
        Company defaultCompany = companyRepository.findByCode("DEF001").orElse(null);
        if (defaultCompany == null) {
            defaultCompany = new Company();
            defaultCompany.setName("Default Company");
            defaultCompany.setCode("DEF001");
            defaultCompany.setAddress("123 Default St, City");
            defaultCompany.setMakerCheckerEnabled(true);
            defaultCompany.setDefaultApprovalLevels(1);
            defaultCompany.setActive(true);
            defaultCompany = companyRepository.save(defaultCompany);
            System.out.println("Default Company created.");
        }

        // 2. Create Admin User if not exists
        User admin = userRepository.findByUsername("admin").orElse(null);
        if (admin == null) {
            admin = new User();
            admin.setUsername("admin");
            admin.setName("System Administrator");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Default password
            admin.setActive(true);
            admin = userRepository.save(admin);
            System.out.println("Admin User created: username=admin, password=admin123");

            // 3. Assign Admin Role to User for Default Company
            UserCompanyRole adminRole = new UserCompanyRole();
            adminRole.setUser(admin);
            adminRole.setCompany(defaultCompany);
            adminRole.setRole(Role.ADMIN);
            userCompanyRoleRepository.save(adminRole);
            System.out.println("Admin Role assigned to Admin User for Default Company.");
        } else {
            System.out.println("Admin User already exists.");
        }

        // 4. Create Master Data (Banks, Branches, Accounts)
        if (bankRepository.count() == 0) {
            com.cms.model.Bank bank = new com.cms.model.Bank();
            bank.setName("HDFC Bank");
            bank.setCode("HDFC");
            bank.setBranchCode("MUM001");
            bank.setActive(true);
            bank = bankRepository.save(bank);

            com.cms.model.Branch branch = new com.cms.model.Branch();
            branch.setBank(bank);
            branch.setName("Mumbai Main Branch");
            branch.setAddress("Mumbai, India");
            branch.setIfscCode("HDFC0001234");
            branch.setActive(true);
            branch = branchRepository.save(branch);

            com.cms.model.BankAccount account = new com.cms.model.BankAccount();
            account.setCompany(defaultCompany);
            account.setBranch(branch);
            account.setAccountNumber("HDFC123456789");
            account.setAccountType("Current");
            account.setCurrency("INR");
            account.setBalance(new java.math.BigDecimal("500000.00"));
            account.setActive(true);
            account = bankAccountRepository.save(account);

            // 5. Create Cheque Book
            com.cms.dto.ChequeBookDTO cbDto = new com.cms.dto.ChequeBookDTO();
            cbDto.setAccountId(account.getId());
            cbDto.setSeriesIdentifier("A");
            cbDto.setStartNumber(100001);
            cbDto.setEndNumber(100050);
            cbDto.setIssuedDate(java.time.LocalDate.now());
            chequeBookService.createChequeBook(cbDto); // This auto-generates 50 unused cheques

            System.out.println("Master Data & Cheque Book created.");
        }

        // 6. Create Parties (Customers, Vendors)
        if (customerRepository.count() == 0) {
            com.cms.model.Customer cust = new com.cms.model.Customer();
            cust.setCompany(defaultCompany);
            cust.setName("Acme Corp");
            cust.setCode("CUST001");
            cust.setEmail("contact@acme.com");
            cust.setPhone("9876543210");
            cust.setActive(true);
            customerRepository.save(cust);

            com.cms.model.Vendor vend = new com.cms.model.Vendor();
            vend.setCompany(defaultCompany);
            vend.setName("Global Supplies Ltd");
            vend.setCode("VEND001");
            vend.setEmail("sales@globalsupplies.com");
            vend.setPhone("1122334455");
            vend.setActive(true);
            vendorRepository.save(vend);
            System.out.println("Parties created.");
        }

        // 7. Create Incoming Cheques (some PDCs)
        if (incomingChequeService.getAllIncomingCheques().isEmpty()) {
            com.cms.model.Customer cust = customerRepository.findAll().get(0);

            // PENDING (Future Date)
            com.cms.dto.IncomingChequeDTO inc1 = new com.cms.dto.IncomingChequeDTO();
            inc1.setCustomerId(cust.getId());
            inc1.setChequeNumber("CHQ998877");
            inc1.setBankName("SBI");
            inc1.setAmount(new java.math.BigDecimal("25000.00"));
            inc1.setChequeDate(java.time.LocalDate.now().plusDays(5)); // PDC
            inc1.setReceivedDate(java.time.LocalDate.now());
            inc1.setStatus(com.cms.model.IncomingChequeStatus.PENDING);
            incomingChequeService.createIncomingCheque(inc1, null);

            // CLEARED (Past Date)
            com.cms.dto.IncomingChequeDTO inc2 = new com.cms.dto.IncomingChequeDTO();
            inc2.setCustomerId(cust.getId());
            inc2.setChequeNumber("CHQ112233");
            inc2.setBankName("ICICI");
            inc2.setAmount(new java.math.BigDecimal("15000.00"));
            inc2.setChequeDate(java.time.LocalDate.now().minusDays(2));
            inc2.setReceivedDate(java.time.LocalDate.now().minusDays(5));
            inc2.setStatus(com.cms.model.IncomingChequeStatus.CLEARED);
            incomingChequeService.createIncomingCheque(inc2, null);

            System.out.println("Incoming Cheques created.");
        }

        // 7.1 Create Outgoing Cheques (PDC / Issued) ONLY if none exist
        if (chequeRepository.countByStatus(com.cms.model.ChequeStatus.ISSUED) == 0
                && chequeRepository.countByStatus(com.cms.model.ChequeStatus.DUE) == 0) {
            // Find all cheques
            java.util.List<com.cms.model.Cheque> allCheques = chequeRepository.findAll();
            // Filter stream for UNUSED
            java.util.List<com.cms.model.Cheque> avail = allCheques.stream()
                    .filter(c -> c.getStatus() == com.cms.model.ChequeStatus.UNUSED).limit(5).toList();

            if (avail.size() >= 3) {
                com.cms.model.Vendor vendor = vendorRepository.findAll().get(0);

                // Cheque 1: Issued to Vendor (PDC)
                com.cms.model.Cheque c1 = avail.get(0);
                c1.setStatus(com.cms.model.ChequeStatus.ISSUED);
                c1.setVendor(vendor);
                c1.setAmount(new java.math.BigDecimal("12500.00"));
                c1.setChequeDate(java.time.LocalDate.now().plusDays(10));
                chequeRepository.save(c1);

                // Cheque 2: Issued to specific Payee (Due Today)
                com.cms.model.Cheque c2 = avail.get(1);
                c2.setStatus(com.cms.model.ChequeStatus.DUE);
                c2.setPayeeName("John Doe Consultant");
                c2.setAmount(new java.math.BigDecimal("5000.00"));
                c2.setChequeDate(java.time.LocalDate.now());
                chequeRepository.save(c2);

                // Cheque 3: Printed (Already processed)
                com.cms.model.Cheque c3 = avail.get(2);
                c3.setStatus(com.cms.model.ChequeStatus.PRINTED);
                c3.setPayeeName("Office Supplies Vendor");
                c3.setAmount(new java.math.BigDecimal("780.00"));
                c3.setChequeDate(java.time.LocalDate.now().minusDays(2));
                chequeRepository.save(c3);

                System.out.println("Outgoing Cheques (Issued/Due/Printed) created from available pool.");
            }
        }

        // 8. Create Default Cheque Template
        if (chequeTemplateRepository.count() == 0) {
            com.cms.model.ChequeTemplate tpl = new com.cms.model.ChequeTemplate();
            tpl.setName("Standard Image Match");
            tpl.setDescription("Layout matching the provided image sample");

            // New Config based on Image Analysis (Top of A4)
            String config = "{" +
                    "\"payee\": {\"x\": 100, \"y\": 720, \"fontSize\": 10}," +
                    "\"date\": {\"x\": 450, \"y\": 780, \"fontSize\": 12, \"charSpacing\": 10}," +
                    "\"amountNumeric\": {\"x\": 450, \"y\": 680, \"fontSize\": 12, \"isBold\": true}," +
                    "\"amountWords\": {\"x\": 140, \"y\": 690, \"fontSize\": 10}," +
                    "\"bankName\": {\"x\": 100, \"y\": 750, \"fontSize\": 10}," +
                    "\"companyName\": {\"x\": 300, \"y\": 640, \"fontSize\": 11, \"isBold\": true}," +
                    "\"acPayee\": {\"x\": 50, \"y\": 800, \"fontSize\": 8, \"rotation\": 45, \"isBold\": true}," +
                    "\"signatureLabel\": {\"x\": 420, \"y\": 600, \"fontSize\": 8}" +
                    "}";

            tpl.setCanvasConfig(config);
            tpl.setActive(true);
            chequeTemplateRepository.save(tpl);
            System.out.println("Default Cheque Template created.");
        }

        System.out.println("------------------------------------------------");
        System.out.println("DATA INITIALIZATION COMPLETED SUCCESSFULLY");
        System.out.println("------------------------------------------------");
    }
}
