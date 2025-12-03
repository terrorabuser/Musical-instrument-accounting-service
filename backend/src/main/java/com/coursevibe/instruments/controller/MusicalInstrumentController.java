package com.coursevibe.instruments.controller;

import com.coursevibe.instruments.dto.MusicalInstrumentDTO;
import com.coursevibe.instruments.service.MusicalInstrumentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/instruments")
public class MusicalInstrumentController {
    
    private final MusicalInstrumentService service;
    
    @Autowired
    public MusicalInstrumentController(MusicalInstrumentService service) {
        this.service = service;
    }
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MusicalInstrumentDTO> create(@Valid @RequestBody MusicalInstrumentDTO dto) {
        MusicalInstrumentDTO created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MusicalInstrumentDTO> update(@PathVariable Long id, @Valid @RequestBody MusicalInstrumentDTO dto) {
        MusicalInstrumentDTO updated = service.update(id, dto);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MusicalInstrumentDTO> findById(@PathVariable Long id) {
        MusicalInstrumentDTO dto = service.findById(id);
        return ResponseEntity.ok(dto);
    }
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> findAll(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String conditionStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Page<MusicalInstrumentDTO> pageResult = service.findAll(
            type, brand, name, minPrice, maxPrice, startDate, endDate, conditionStatus,
            page, size, sortBy, sortDir
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", pageResult.getContent());
        response.put("currentPage", pageResult.getNumber());
        response.put("totalItems", pageResult.getTotalElements());
        response.put("totalPages", pageResult.getTotalPages());
        response.put("pageSize", pageResult.getSize());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/types")
    public ResponseEntity<List<String>> getAllTypes() {
        return ResponseEntity.ok(service.findAllTypes());
    }
    
    @GetMapping("/brands")
    public ResponseEntity<List<String>> getAllBrands() {
        return ResponseEntity.ok(service.findAllBrands());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/statistics/total-value")
    public ResponseEntity<Map<String, BigDecimal>> getTotalValue() {
        BigDecimal total = service.getTotalValue();
        Map<String, BigDecimal> response = new HashMap<>();
        response.put("totalValue", total);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/statistics/average-value")
    public ResponseEntity<Map<String, BigDecimal>> getAverageValue() {
        BigDecimal average = service.getAverageValue();
        Map<String, BigDecimal> response = new HashMap<>();
        response.put("averageValue", average);
        return ResponseEntity.ok(response);
    }
}


