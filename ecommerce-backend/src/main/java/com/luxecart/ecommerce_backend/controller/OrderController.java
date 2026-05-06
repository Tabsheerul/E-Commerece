package com.luxecart.ecommerce_backend.controller;

import com.luxecart.ecommerce_backend.entity.Order;
import com.luxecart.ecommerce_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    public Order placeOrder(@RequestBody Order order) {
        // Save the order AND all its items to MySQL instantly
        return orderRepository.save(order);
    }
}