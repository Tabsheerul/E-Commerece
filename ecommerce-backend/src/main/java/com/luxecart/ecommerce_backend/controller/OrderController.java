package com.luxecart.ecommerce_backend.controller;

import com.luxecart.ecommerce_backend.entity.Order;
import com.luxecart.ecommerce_backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public Order placeOrder(org.springframework.security.core.Authentication authentication, @RequestBody Order order) {
        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            // Overwrite the order email with the authenticated user's email for security
            order.setEmail(authentication.getName());
        }
        return orderService.placeOrder(order);
    }

    @GetMapping
    public java.util.List<Order> getUserOrders(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return orderService.getOrdersByEmail(authentication.getName());
    }

    @GetMapping("/all")
    public java.util.List<Order> getAllOrders() {
        // In a real app, you'd check if authentication has ADMIN role
        return orderService.getAllOrders();
    }

    @PutMapping("/{id}/status")
    public Order updateOrderStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        // In a real app, you'd check if authentication has ADMIN role
        String status = body.get("status");
        return orderService.updateOrderStatus(id, status);
    }
}