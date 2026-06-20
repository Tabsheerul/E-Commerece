package com.luxecart.ecommerce_backend.service;

import com.luxecart.ecommerce_backend.entity.Product;
import com.luxecart.ecommerce_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Fetch all products from the database
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Save a brand-new product
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Get one product by its ID, returns null if not found
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // Remove a product by ID
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Update every field of an existing product
    public Product updateProduct(Long id, Product productDetails) {
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct != null) {
            existingProduct.setName(productDetails.getName());
            existingProduct.setCategory(productDetails.getCategory());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setImage(productDetails.getImage());
            existingProduct.setIsNew(productDetails.getIsNew());
            existingProduct.setDevice(productDetails.getDevice()); // ← NEW: save device field
            return productRepository.save(existingProduct);
        }
        return null;
    }

    // Search + filter + sort + PAGINATE products
    public Page<Product> searchProducts(String category, String keyword,
                                        BigDecimal minPrice, BigDecimal maxPrice,
                                        Boolean isNew, String sortBy, int page, int size) {

        // 1. Determine how MySQL should sort the data BEFORE paginating it
        Sort sort = Sort.by(Sort.Direction.DESC, "id"); // Default: Newest first

        if ("price_asc".equals(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price_desc".equals(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "price");
        }

        // 2. Create the Pagination Request (Note: Spring Boot pages are 0-indexed!)
        Pageable pageable = PageRequest.of(page, size, sort);

        // 3. Ask the database for exactly this page of sorted data
        return productRepository.searchAndFilterProducts(
                category, keyword, minPrice, maxPrice, isNew, pageable);
    }
}