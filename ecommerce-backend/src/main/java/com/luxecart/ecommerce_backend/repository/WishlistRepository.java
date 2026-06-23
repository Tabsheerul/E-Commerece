package com.luxecart.ecommerce_backend.repository;

import com.luxecart.ecommerce_backend.entity.User;
import com.luxecart.ecommerce_backend.entity.Product;
import com.luxecart.ecommerce_backend.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);
    Optional<Wishlist> findByUserAndProduct(User user, Product product);
    boolean existsByUserAndProduct(User user, Product product);
}
