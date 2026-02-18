package com.cms.controller;

import com.cms.dto.IncomingChequeDTO;
import com.cms.service.IncomingChequeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/incoming-cheques")
@CrossOrigin(origins = "*")
public class IncomingChequeController {

    @Autowired
    private IncomingChequeService incomingChequeService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<IncomingChequeDTO>> getAllIncomingCheques() {
        return ResponseEntity.ok(incomingChequeService.getAllIncomingCheques());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomingChequeDTO> getIncomingChequeById(@PathVariable Long id) {
        return ResponseEntity.ok(incomingChequeService.getIncomingChequeById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IncomingChequeDTO> createIncomingCheque(
            @RequestPart("data") String data,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        IncomingChequeDTO dto = objectMapper.readValue(data, IncomingChequeDTO.class);
        return new ResponseEntity<>(incomingChequeService.createIncomingCheque(dto, file), HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IncomingChequeDTO> updateIncomingCheque(
            @PathVariable Long id,
            @RequestPart("data") String data,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        IncomingChequeDTO dto = objectMapper.readValue(data, IncomingChequeDTO.class);
        return ResponseEntity.ok(incomingChequeService.updateIncomingCheque(id, dto, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncomingCheque(@PathVariable Long id) {
        incomingChequeService.deleteIncomingCheque(id);
        return ResponseEntity.noContent().build();
    }
}
