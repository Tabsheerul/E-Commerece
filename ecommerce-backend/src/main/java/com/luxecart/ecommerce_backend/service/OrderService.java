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
}
