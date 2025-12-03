package com.coursevibe.instruments.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class CommentDTO {
    
    private Long id;
    
    @NotBlank(message = "Comment text is required")
    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String text;
    
    private LocalDateTime createdAt;
    private Long authorId;
    private String authorNickname;
    private Long instrumentId;
    
    public CommentDTO() {
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Long getAuthorId() {
        return authorId;
    }
    
    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }
    
    public String getAuthorNickname() {
        return authorNickname;
    }
    
    public void setAuthorNickname(String authorNickname) {
        this.authorNickname = authorNickname;
    }
    
    public Long getInstrumentId() {
        return instrumentId;
    }
    
    public void setInstrumentId(Long instrumentId) {
        this.instrumentId = instrumentId;
    }
}




