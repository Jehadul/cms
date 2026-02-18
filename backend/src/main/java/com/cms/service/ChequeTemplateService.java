package com.cms.service;

import com.cms.model.ChequeTemplate;
import com.cms.repository.ChequeTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChequeTemplateService {

    @Autowired
    private ChequeTemplateRepository chequeTemplateRepository;

    public List<ChequeTemplate> getAllTemplates() {
        return chequeTemplateRepository.findAll();
    }

    public ChequeTemplate getTemplateById(Long id) {
        return chequeTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));
    }

    public ChequeTemplate createTemplate(ChequeTemplate template) {
        return chequeTemplateRepository.save(template);
    }

    public ChequeTemplate updateTemplate(Long id, ChequeTemplate templateDetails) {
        ChequeTemplate template = getTemplateById(id);
        template.setName(templateDetails.getName());
        template.setDescription(templateDetails.getDescription());
        template.setBackgroundPath(templateDetails.getBackgroundPath());
        template.setCanvasConfig(templateDetails.getCanvasConfig());
        template.setActive(templateDetails.isActive());
        return chequeTemplateRepository.save(template);
    }

    public void deleteTemplate(Long id) {
        chequeTemplateRepository.deleteById(id);
    }
}
