package com.coursevibe.instruments.controller;

import com.coursevibe.instruments.dto.CommentDTO;
import com.coursevibe.instruments.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    
    private final CommentService service;
    
    @Autowired
    public CommentController(CommentService service) {
        this.service = service;
    }
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentDTO> create(@Valid @RequestBody CommentDTO dto) {
        CommentDTO created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @GetMapping("/instrument/{instrumentId}")
    public ResponseEntity<List<CommentDTO>> findByInstrumentId(@PathVariable Long instrumentId) {
        List<CommentDTO> comments = service.findByInstrumentId(instrumentId);
        return ResponseEntity.ok(comments);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}




