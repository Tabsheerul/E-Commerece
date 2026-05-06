package com.luxecart.ecommerce_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data             // Lombok: auto-generates getters, setters, toString
@NoArgsConstructor // Lombok: empty constructor required by JPA
@AllArgsConstructor // Lombok: constructor with ALL fields (used in DataSeeder)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Name of the product e.g. "Matte Black Skin for iPhone 15"
    @Column(nullable = false)
    private String name;

    // Brand-based category e.g. "Apple", "Samsung", "Google"
    @Column(nullable = false)
    private String category;

    // BigDecimal prevents floating-point rounding errors for prices
    @Column(nullable = false)
    private BigDecimal price;

    // Longer description of the product
    @Column(length = 1000)
    private String description;

    // URL to the product image
    @Column(name = "image_url")
    private String image;

    // Marks if this is a new arrival (shows a "New" badge on the card)
    @Column(name = "is_new")
    private Boolean isNew;

    // NEW FIELD: which phone model this skin/cover fits
    // e.g. "iPhone 15 Pro", "Galaxy S24 Ultra"
    @Column(name = "device")
    private String device;
}