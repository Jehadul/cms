package com.cms.repository;

import com.cms.model.ApprovalRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalRequestRepository extends JpaRepository<ApprovalRequest, Long> {
    List<ApprovalRequest> findByStatus(String status);

    List<ApprovalRequest> findByRequestedBy(Long requestedBy);
}
