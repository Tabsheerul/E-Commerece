package com.luxecart.ecommerce_backend.controller;

import com.luxecart.ecommerce_backend.entity.Product;
import com.luxecart.ecommerce_backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(wishlistService.getWishlist(email));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> addProductToWishlist(Authentication authentication, @PathVariable Long productId) {
        String email = authentication.getName();
        wishlistService.addProductToWishlist(email, productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeProductFromWishlist(Authentication authentication, @PathVariable Long productId) {
        String email = authentication.getName();
        wishlistService.removeProductFromWishlist(email, productId);
        return ResponseEntity.ok().build();
    }
}
