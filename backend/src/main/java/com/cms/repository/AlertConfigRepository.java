package com.cms.repository;

import com.cms.model.AlertConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlertConfigRepository extends JpaRepository<AlertConfig, Long> {
    Optional<AlertConfig> findByCompanyId(Long companyId);
}
