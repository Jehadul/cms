package com.cms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_company_roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCompanyRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}
