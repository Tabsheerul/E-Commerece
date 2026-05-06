package com.luxecart.ecommerce_backend.controller;

import com.luxecart.ecommerce_backend.entity.Product;
import com.luxecart.ecommerce_backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173") // Allows your React Vite app to connect!
public class ProductController {

    @Autowired
    private ProductService productService;

    // Endpoint to get all products: GET /api/products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Endpoint to create a product: POST /api/products
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    // Endpoint to get a single product: GET /api/products/{id}
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // Endpoint to delete a product: DELETE /api/products/{id}
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    // Endpoint to update a product: PUT /api/products/{id}
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    // Endpoint to search/filter: GET /api/products/search?category=Bags&keyword=canvas
    @GetMapping("/search")
    public Page<Product> searchProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean isNew,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,  // <-- Default to Page 0 (the first page)
            @RequestParam(defaultValue = "10") int size) // <-- Default to 10 items per page
    {
        return productService.searchProducts(category, keyword, minPrice, maxPrice, isNew, sortBy, page, size);
    }
}