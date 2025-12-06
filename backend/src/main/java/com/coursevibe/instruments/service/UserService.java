package com.coursevibe.instruments.service;

import com.coursevibe.instruments.dto.UserDTO;
import com.coursevibe.instruments.entity.User;
import com.coursevibe.instruments.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {
    
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public UserDTO register(UserDTO dto) {
        if (repository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNickname(dto.getNickname());
        
        User saved = repository.save(user);
        return convertToDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return repository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setNickname(user.getNickname());
        return dto;
    }
}




