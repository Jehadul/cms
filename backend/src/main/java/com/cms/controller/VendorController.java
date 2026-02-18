package com.cms.controller;

import com.cms.dto.VendorDTO;
import com.cms.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "*")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @GetMapping
    public ResponseEntity<List<VendorDTO>> getVendors(@RequestParam(required = false) Long companyId) {
        if (companyId == null) {
            // Return all vendors for now to aid debugging/listing if context missing
            // Ideally we filter by user's access
            return ResponseEntity.ok(vendorService.getAllVendors());
        }
        return ResponseEntity.ok(vendorService.getVendorsByCompany(companyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorDTO> getVendorById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @PostMapping
    public ResponseEntity<VendorDTO> createVendor(@RequestBody VendorDTO vendorDTO) {
        return new ResponseEntity<>(vendorService.createVendor(vendorDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendorDTO> updateVendor(@PathVariable Long id, @RequestBody VendorDTO vendorDTO) {
        return ResponseEntity.ok(vendorService.updateVendor(id, vendorDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }
}
