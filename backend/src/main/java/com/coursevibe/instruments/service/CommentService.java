package com.coursevibe.instruments.service;

import com.coursevibe.instruments.config.SecurityUtils;
import com.coursevibe.instruments.dto.CommentDTO;
import com.coursevibe.instruments.entity.Comment;
import com.coursevibe.instruments.entity.MusicalInstrument;
import com.coursevibe.instruments.entity.User;
import com.coursevibe.instruments.repository.CommentRepository;
import com.coursevibe.instruments.repository.MusicalInstrumentRepository;
import com.coursevibe.instruments.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final MusicalInstrumentRepository instrumentRepository;
    
    @Autowired
    public CommentService(CommentRepository commentRepository, UserRepository userRepository,
                          MusicalInstrumentRepository instrumentRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.instrumentRepository = instrumentRepository;
    }
    
    public CommentDTO create(CommentDTO dto) {
        String username = SecurityUtils.getCurrentUsername();
        if (username == null) {
            throw new AccessDeniedException("Authentication required");
        }
        
        User author = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        MusicalInstrument instrument = instrumentRepository.findById(dto.getInstrumentId())
            .orElseThrow(() -> new RuntimeException("Instrument not found with id: " + dto.getInstrumentId()));
        
        Comment comment = new Comment();
        comment.setText(dto.getText());
        comment.setAuthor(author);
        comment.setInstrument(instrument);
        
        Comment saved = commentRepository.save(comment);
        return convertToDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public List<CommentDTO> findByInstrumentId(Long instrumentId) {
        return commentRepository.findByInstrumentIdOrderByCreatedAtDesc(instrumentId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public void delete(Long id) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        
        String username = SecurityUtils.getCurrentUsername();
        if (username == null || !comment.getAuthor().getUsername().equals(username)) {
            throw new AccessDeniedException("Only the author can delete this comment");
        }
        
        commentRepository.deleteById(id);
    }
    
    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setText(comment.getText());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setInstrumentId(comment.getInstrument().getId());
        
        if (comment.getAuthor() != null) {
            dto.setAuthorId(comment.getAuthor().getId());
            dto.setAuthorNickname(comment.getAuthor().getNickname());
        }
        
        return dto;
    }
}




