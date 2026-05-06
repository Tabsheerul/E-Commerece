package com.luxecart.ecommerce_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // We save the product details at the time of purchase
    // just in case the main product price changes later!
    private Long productId;
    private String productName;
    private int quantity;
    private BigDecimal price;
}