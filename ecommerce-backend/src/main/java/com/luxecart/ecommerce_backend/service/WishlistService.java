package com.luxecart.ecommerce_backend.service;

import com.luxecart.ecommerce_backend.entity.Product;
import com.luxecart.ecommerce_backend.entity.User;
import com.luxecart.ecommerce_backend.entity.Wishlist;
import com.luxecart.ecommerce_backend.repository.ProductRepository;
import com.luxecart.ecommerce_backend.repository.UserRepository;
import com.luxecart.ecommerce_backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<Product> getWishlist(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return wishlistRepository.findByUser(user)
                .stream()
                .map(Wishlist::getProduct)
                .collect(Collectors.toList());
    }

    public void addProductToWishlist(String email, Long productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!wishlistRepository.existsByUserAndProduct(user, product)) {
            Wishlist wishlist = Wishlist.builder()
                    .user(user)
                    .product(product)
                    .build();
            wishlistRepository.save(wishlist);
        }
    }

    public void removeProductFromWishlist(String email, Long productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<Wishlist> wishlistOpt = wishlistRepository.findByUserAndProduct(user, product);
        wishlistOpt.ifPresent(wishlistRepository::delete);
    }
}
