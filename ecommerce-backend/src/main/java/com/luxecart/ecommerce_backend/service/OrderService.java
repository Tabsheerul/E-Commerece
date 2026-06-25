package com.luxecart.ecommerce_backend.service;

import com.luxecart.ecommerce_backend.entity.Order;
import com.luxecart.ecommerce_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order placeOrder(Order order) {
        // Here you can add business logic (e.g. calculate totals, check inventory, etc.)
        // Save the order AND all its items to MySQL
        return orderRepository.save(order);
    }

    public java.util.List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByEmailOrderByOrderDateDesc(email);
    }

    public java.util.List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
