package com.cms.repository;

import com.cms.model.UserCompanyRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCompanyRoleRepository extends JpaRepository<UserCompanyRole, Long> {
    List<UserCompanyRole> findByUser_Username(String username);

    List<UserCompanyRole> findByCompany_Id(Long companyId);
}
