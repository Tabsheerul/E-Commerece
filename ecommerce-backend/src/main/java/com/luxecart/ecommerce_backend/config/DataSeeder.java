package com.luxecart.ecommerce_backend.config;

import com.luxecart.ecommerce_backend.entity.Product;
import com.luxecart.ecommerce_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

// This class runs once on startup and fills the DB with sample products
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {

        // Only seed data if the database table is completely empty
        if (productRepository.count() == 0) {

            System.out.println("Database is empty! Seeding mobile skins & covers...");

            // Constructor order: (id, name, category, price, description, image, isNew, device)

            // ── FOMO STORE COLLECTION (LOCAL IMAGES) ──────────────────────────────────────────────

            Product f1 = new Product(null,
                    "BMW M-Power Drift Art Skin",
                    "Automotive", // <-- Updated Category
                    BigDecimal.valueOf(16.99),
                    "High-speed drifting BMW M4 featuring vibrant blue and red M-Power graphics and smoke effects.",
                    "/images/p1.webp",
                    true,
                    "iPhone 15 Pro");

            Product f2 = new Product(null,
                    "Porsche 911 GT3 RS Profile Skin",
                    "Automotive",
                    BigDecimal.valueOf(17.99),
                    "Clean white Porsche 911 GT3 RS side profile with striking red wheel accents.",
                    "/images/p2.webp",
                    false,
                    "Galaxy S24 Ultra");

            Product f3 = new Product(null,
                    "Porsche 911 Teal Watercolor Skin",
                    "Automotive",
                    BigDecimal.valueOf(18.99),
                    "Stunning teal and red abstract watercolor art featuring the aggressive Porsche 911 GT3.",
                    "/images/p3.webp",
                    true,
                    "iPhone 14 Pro Max");

            Product f4 = new Product(null,
                    "Mustang GT Racing Stripes Skin",
                    "Automotive",
                    BigDecimal.valueOf(14.99),
                    "Classic red Ford Mustang GT with bold white racing stripes. For the true muscle car fan.",
                    "/images/p4.webp",
                    false,
                    "Pixel 8 Pro");

            Product f5 = new Product(null,
                    "BMW M4 GT3 Track Skin",
                    "Automotive",
                    BigDecimal.valueOf(16.99),
                    "Aggressive BMW M4 GT3 front fascia illuminated by track lights and iconic M-sport stripes.",
                    "/images/p5.webp",
                    true,
                    "Galaxy S23");

            Product f6 = new Product(null,
                    "Goku Super Saiyan Fire Skin",
                    "Anime", // <-- Updated Category
                    BigDecimal.valueOf(15.99),
                    "Fierce Goku split-face design surrounded by a fiery aura and dark smoke background.",
                    "/images/p6.webp",
                    true,
                    "OnePlus 12");

            Product f7 = new Product(null,
                    "Obito Techwear Crimson Skin",
                    "Anime",
                    BigDecimal.valueOf(14.99),
                    "Obito Uchiha reimagined in modern techwear standing against a striking crimson red background.",
                    "/images/p7.webp",
                    false,
                    "iPhone 15");

            Product f8 = new Product(null,
                    "Demon Slayer Eyes Collage Skin",
                    "Anime",
                    BigDecimal.valueOf(16.99),
                    "Intense cinematic eye close-ups of your favorite Demon Slayer characters and Hashiras.",
                    "/images/p8.webp",
                    true,
                    "Galaxy S24+");

            Product f9 = new Product(null,
                    "Tanjiro Hanafuda Earrings Skin",
                    "Anime",
                    BigDecimal.valueOf(12.99),
                    "Minimalist white skin featuring Tanjiro Kamado's iconic Hanafuda earrings.",
                    "/images/p9.webp",
                    false,
                    "iPhone 13");

            Product f10 = new Product(null,
                    "Argentina Messi #10 Jersey Skin",
                    "Sports", // <-- Updated Category
                    BigDecimal.valueOf(19.99),
                    "AFA Argentina 3-Star World Cup Champion jersey skin featuring the legendary Messi #10.",
                    "/images/p10.webp",
                    true,
                    "iPhone 15 Pro Max");

            Product f11 = new Product(null,
                    "Jordan #23 Legend Skin",
                    "Sports",
                    BigDecimal.valueOf(15.99),
                    "Iconic Chicago red skin featuring Jordan's #23 and the legendary Jumpman silhouette with subtle smoke effects.",
                    "/images/p11.webp",
                    false,
                    "iPhone 15 Pro");

            Product f12 = new Product(null,
                    "Nissan GT-R Fire Drift Skin",
                    "Automotive",
                    BigDecimal.valueOf(16.99),
                    "High-octane Nissan GT-R R35 drifting through flames. Perfect for JDM and car culture enthusiasts.",
                    "/images/p12.webp",
                    true,
                    "Galaxy S24 Ultra");

            Product f13 = new Product(null,
                    "Wakanda King Black Panther Skin",
                    "Superheroes", // <-- Updated Category
                    BigDecimal.valueOf(14.99),
                    "Sleek Black Panther profile in vibranium black and gold over a distressed white backdrop.",
                    "/images/p13.webp",
                    false,
                    "Pixel 8");

            Product f14 = new Product(null,
                    "Deadpool Comic Graffiti Skin",
                    "Superheroes",
                    BigDecimal.valueOf(15.99),
                    "The Merc with a Mouth in full action against a vibrant, chaotic graffiti background.",
                    "/images/p14.webp",
                    true,
                    "OnePlus 11");

            Product f15 = new Product(null,
                    "Avengers Tower Minimalist Skin",
                    "Superheroes",
                    BigDecimal.valueOf(13.99),
                    "Clean black and white silhouette of Avengers Tower featuring tiny silhouettes of Earth's mightiest heroes.",
                    "/images/p15.webp",
                    false,
                    "iPhone 14");

            Product f16 = new Product(null,
                    "FC Barcelona Crest Skin",
                    "Sports",
                    BigDecimal.valueOf(17.99),
                    "Visca el Barça! Premium textured skin featuring the FC Barcelona crest over the classic Blaugrana colors.",
                    "/images/p16.webp",
                    true,
                    "Galaxy S23+");

            Product f17 = new Product(null,
                    "Porsche 911 Typography Skin",
                    "Automotive",
                    BigDecimal.valueOf(16.99),
                    "Bold racing red skin featuring a top-down view of a Porsche 911 wrapped in striking white typography.",
                    "/images/p17.webp",
                    false,
                    "Pixel 7 Pro");

            Product f18 = new Product(null,
                    "Real Madrid Royal Gold Skin",
                    "Sports",
                    BigDecimal.valueOf(17.99),
                    "Hala Madrid! Elegant dark blue textured skin with the Real Madrid crest and premium gold stripes.",
                    "/images/p18.webp",
                    true,
                    "iPhone 15 Plus");

            Product f19 = new Product(null,
                    "'65 Shelby Fastback Classic Skin",
                    "Automotive",
                    BigDecimal.valueOf(15.99),
                    "Vintage automotive perfection. Features the legendary 1965 Shelby Mustang Fastback in classic white with blue racing stripes.",
                    "/images/p19.webp",
                    false,
                    "Galaxy S22");

            Product f20 = new Product(null,
                    "Super Saiyan God Aura Skin",
                    "Anime",
                    BigDecimal.valueOf(16.99),
                    "Goku radiating an intense, fiery red aura. A powerful and striking design for true anime fans.",
                    "/images/p20.webp",
                    true,
                    "OnePlus 12");

            // Save all 20 categorized skins to MySQL
            productRepository.saveAll(List.of(
                    f1, f2, f3, f4, f5, f6, f7, f8, f9, f10,
                    f11, f12, f13, f14, f15, f16, f17, f18, f19, f20
            ));

            System.out.println("✅ 20 mobile skin & cover products successfully seeded to MySQL!");
        }
    }
}