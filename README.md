<div align="center">
  <h1>SkinVault</h1>
  <p>A Premium E-Commerce Web App for Device Skins</p>

  <!-- Badges -->
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="https://spring.io/projects/spring-boot"><img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" alt="Spring Boot"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"></a>
</div>

<br/>

## 📖 Overview

**SkinVault** is a cutting-edge full-stack e-commerce web application designed for premium device skins. It delivers an immersive shopping experience with 3D parallax scrolling, cinematic video backgrounds, and a highly responsive modern UI. The robust Spring Boot backend ensures a seamless and secure REST API for efficient product and database management.

## ✨ Features

- **Immersive UI/UX**: Cinematic video backgrounds and Framer Motion powered 3D parallax scrolling.
- **Modern Storefront**: Built with React 19, Tailwind CSS v4, and dynamic components.
- **Robust Backend API**: Powered by Spring Boot 4, featuring RESTful endpoints for products, users, and orders.
- **Secure Data Management**: Fully integrated with MySQL using Spring Data JPA.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Routing**: React Router DOM v7

### Backend
- **Framework**: Spring Boot 4.0.3 (Java 21)
- **Database**: MySQL
- **ORM**: Spring Data JPA / Hibernate
- **Tools**: Lombok, Maven

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 21
- MySQL Server
- Maven

### 1. Clone the Repository
```bash
git clone https://github.com/Tabsheerul/E-Commerece-.git
cd E-Commerece-
```

### 2. Setup the Backend (Spring Boot)
```bash
cd ecommerce-backend
# Ensure your MySQL database is running and update src/main/resources/application.properties with your DB credentials.
./mvnw spring-boot:run
```

### 3. Setup the Frontend (React + Vite)
```bash
cd ecommerce-frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:8080`.

## 📁 Project Structure

```text
E-Commerce-Project/
├── ecommerce-frontend/    # React frontend application
│   ├── src/               # React components, pages, and assets
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
└── ecommerce-backend/     # Spring Boot backend application
    ├── src/main/java/     # Java source code
    ├── src/main/resources/# Application properties & static files
    └── pom.xml            # Maven dependencies
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

