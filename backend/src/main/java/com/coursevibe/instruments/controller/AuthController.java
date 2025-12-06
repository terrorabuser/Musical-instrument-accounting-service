package com.coursevibe.instruments.controller;

import com.coursevibe.instruments.config.JwtTokenProvider;
import com.coursevibe.instruments.dto.AuthRequest;
import com.coursevibe.instruments.dto.AuthResponse;
import com.coursevibe.instruments.dto.UserDTO;
import com.coursevibe.instruments.entity.User;
import com.coursevibe.instruments.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public AuthController(UserService userService, JwtTokenProvider tokenProvider,
                         AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserDTO dto) {
        UserDTO registered = userService.register(dto);
        User user = userService.findByUsername(registered.getUsername());
        
        String token = tokenProvider.generateToken(user.getUsername(), user.getId());
        AuthResponse response = new AuthResponse(token, user.getUsername(), user.getNickname(), user.getId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.findByUsername(userDetails.getUsername());
        
        String token = tokenProvider.generateToken(user.getUsername(), user.getId());
        AuthResponse response = new AuthResponse(token, user.getUsername(), user.getNickname(), user.getId());
        
        return ResponseEntity.ok(response);
    }
}




