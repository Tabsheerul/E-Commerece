package com.luxecart.ecommerce_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders") // "Order" is a reserved word in SQL, so we name the table "orders"
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    private String customerName;
    private String email;
    private String address;
    private String city;
    private String zip;

    private BigDecimal totalAmount;
    private LocalDateTime orderDate = LocalDateTime.now();
    private String status = "PENDING"; // Can be PENDING, SHIPPED, DELIVERED

    // This tells MySQL: "One order contains a list of items. If I save the order, save the items too!"
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items;
}