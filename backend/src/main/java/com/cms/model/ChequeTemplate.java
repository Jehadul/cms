package com.cms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cheque_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChequeTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    // Path to the background image of the cheque
    private String backgroundPath;

    // JSON string storing coordinates and font settings for fields
    // e.g. { "payee": { "x": 100, "y": 50, "width": 200 }, "amount": ... }
    @Column(columnDefinition = "TEXT")
    private String canvasConfig;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;
}
