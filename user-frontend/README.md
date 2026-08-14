# **Fixora – Home Services Platform (Frontend)**

## 📌 Project Title

**Fixora**

## 👥 Team Members

* **Mithun Jain**
* **Murali Devadiga**
* **Geethesh**
* **Ashwin**



---

## 🧩 Project Overview

**Fixora** is a web-based home services platform that connects **customers** with **service professionals** such as plumbers, electricians, salon experts, cleaners, and technicians.

The frontend is built using **React (Create React App)** and focuses on:

* Clean UI/UX
* Modular component structure
* Scalable pages for future backend integration

Currently, this repository contains the **frontend only**.

---

## 🏗️ Application Modules

### 1️⃣ User Module (Customer)

Allows users to:

* Browse services
* Search services
* View service categories
* Login / Register (frontend logic only)
* Select location (state, district, address)
* View service details

### 2️⃣ Service Provider Module (Planned)

Allows professionals to:

* Register as a service provider
* Login to provider dashboard
* Manage services & availability
  📌 *UI structure planned, backend not connected yet.*

### 3️⃣ Admin Module (Planned)

Will allow:

* Manage users
* Manage providers
* Approve services
* Monitor platform
  📌 *Not implemented yet.*

---

## 📁 Folder Structure & Purpose

```
fixora-frontend/
│
├── public/
│   └── index.html
│
├── src/
│   │
│   ├── assets/                  # All images & GIFs used in UI
│   │   ├── service images
│   │   ├── banners
│   │   ├── icons & GIFs
│   │
│   ├── components/              # Reusable UI components
│   │   ├── Navbar.jsx           # Top navigation bar
│   │   ├── Hero.jsx             # Hero section with typing effect & GIF grid
│   │   ├── BannerCarousel.jsx   # Auto-sliding image carousel
│   │   ├── SpotlightSection.jsx # Highlighted promotions
│   │   ├── ServiceRow.jsx       # Horizontal service listing section
│   │   ├── ServiceCard.jsx      # Individual service card UI
│   │   ├── PromoBanner.jsx      # Promotional banner 1
│   │   ├── PromoBannerTwo.jsx   # Promotional banner 2
│   │   ├── Footer.jsx           # Website footer
│   │   ├── Loader.jsx           # Loading spinner (future use)
│   │
│   ├── pages/                   # Page-level components
│   │   ├── Home.jsx             # Main landing page
│   │   ├── Login.jsx            # User login (frontend logic only)
│   │   ├── Register.jsx         # User registration with OTP UI
│   │   ├── Services.jsx         # Services listing page
│   │   ├── ServiceDetails.jsx   # Service details page
│   │   └── provider/            # Provider module pages (planned)
│   │
│   ├── App.js                   # Routing & layout
│   ├── App.css                  # Global styles
│   ├── index.js                 # React entry point
│   ├── index.css                # Base CSS
│
├── package.json
├── package-lock.json
└── README.md
```

---

## 🖼️ Assets & Images

* All images are stored in `src/assets/`
* Includes:

  * Service images
  * Salon & grooming images
  * Home repair images
  * GIFs for animated service icons
* Images are **locally imported** (no CDN yet)

---

## 🎨 UI & Styling

* Material UI (MUI)
* React Bootstrap (Carousel)
* Custom gradients & hover effects
* Responsive grid layouts
* Smooth scrolling (minor performance tuning pending)

---

## ✅ Completed Features

✔ Responsive Navbar
✔ Hero section with typing animation
✔ Service categories with GIF icons
✔ Carousel with auto-slide
✔ Multiple service sections
✔ Salon services (men & women)
✔ Promo banners
✔ Footer layout
✔ GitHub collaboration setup

---

## ⏳ Pending / To-Do

### 🔐 Authentication (Frontend Only)

* Password strength indicator
* Show/Hide password
* OTP simulation (console log)
* Google / Facebook login (dummy UI)
* Validation improvements

### 📍 Location

* City / Village selection
* Pincode validation
* Address field improvement
* Close (X) button UI

### 🔍 Search

* Currently redirects to empty page
* Backend integration pending

### 🧑‍🔧 Provider Module

* Provider registration page
* Provider login page
* Provider dashboard (UI)

### 🛠 Admin Module

* Not started (In progress)

### ⚡ Performance

* GIF optimization
* Scroll smoothness improvement

---

## 🚀 Tech Stack

* **React.js**
* **Create React App**
* **Material UI**
* **React Bootstrap**
* **JavaScript (ES6+)**
* **CSS**

---

## 📌 Notes for Evaluators

* Backend integration is intentionally excluded.
* Authentication, OTP, and provider login are simulated.
* Project focuses on **frontend architecture & UI design**.

---

## 📬 Future Enhancements

* Backend (Node.js / Spring Boot)
* Database (MongoDB / MySQL)
* Real OTP & authentication
* Payment gateway
* Admin analytics dashboard

---

## 📄 License

This project is created for **educational purposes**.