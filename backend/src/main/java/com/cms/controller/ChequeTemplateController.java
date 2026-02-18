package com.cms.controller;

import com.cms.model.ChequeTemplate;
import com.cms.service.ChequeTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = "*")
public class ChequeTemplateController {

    @Autowired
    private ChequeTemplateService chequeTemplateService;

    @GetMapping
    public ResponseEntity<List<ChequeTemplate>> getAllTemplates() {
        return ResponseEntity.ok(chequeTemplateService.getAllTemplates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChequeTemplate> getTemplateById(@PathVariable Long id) {
        return ResponseEntity.ok(chequeTemplateService.getTemplateById(id));
    }

    @PostMapping
    public ResponseEntity<ChequeTemplate> createTemplate(@RequestBody ChequeTemplate template) {
        return ResponseEntity.ok(chequeTemplateService.createTemplate(template));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChequeTemplate> updateTemplate(@PathVariable Long id, @RequestBody ChequeTemplate template) {
        return ResponseEntity.ok(chequeTemplateService.updateTemplate(id, template));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        chequeTemplateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }
}
