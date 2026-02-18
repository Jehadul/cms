package com.cms.repository;

import com.cms.model.ChequeTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChequeTemplateRepository extends JpaRepository<ChequeTemplate, Long> {
    Optional<ChequeTemplate> findByName(String name);
}
