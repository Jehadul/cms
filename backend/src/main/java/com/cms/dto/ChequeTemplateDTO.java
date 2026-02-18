package com.cms.dto;

import lombok.Data;

@Data
public class ChequeTemplateDTO {
    private Long id;
    private String name;
    private String description;
    private String backgroundPath;
    private String canvasConfig;
    private boolean active;
}
