package com.luxecart.ecommerce_backend.repository;

import com.luxecart.ecommerce_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(com.luxecart.ecommerce_backend.entity.User user);
    List<Order> findByEmailOrderByOrderDateDesc(String email);
    List<Order> findAllByOrderByOrderDateDesc();
}