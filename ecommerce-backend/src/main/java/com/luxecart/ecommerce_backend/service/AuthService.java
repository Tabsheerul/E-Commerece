package com.luxecart.ecommerce_backend.service;

import com.luxecart.ecommerce_backend.dto.AuthRequest;
import com.luxecart.ecommerce_backend.dto.AuthResponse;
import com.luxecart.ecommerce_backend.dto.RegisterRequest;
import com.luxecart.ecommerce_backend.entity.User;
import com.luxecart.ecommerce_backend.repository.UserRepository;
import com.luxecart.ecommerce_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public String registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already taken!");
        }

        User.Role role = User.Role.USER;
        if (request.getAdminCode() != null && request.getAdminCode().equals("SECRET_ADMIN_123")) {
            role = User.Role.ADMIN;
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);
        return "User registered successfully";
    }

    public AuthResponse authenticateUser(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String token = jwtUtil.generateToken(request.getEmail());
            User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
            return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole().name());
        } else {
            throw new IllegalArgumentException("Invalid credentials");
        }
    }
}
