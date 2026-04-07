# Quantity Measurement App - Frontend

A modern, responsive web application for performing quantity measurements and conversions across multiple unit types (Length, Weight, Volume, Temperature).

---

## 📋 Project Overview

This repository contains the frontend implementation of the Quantity Measurement Application. The application provides an intuitive interface for users to perform various measurement operations including compare, convert, add, subtract, and divide quantities.

**Features:**
- Anonymous calculations without registration
- User authentication (JWT + Google OAuth2)
- Calculation history tracking for registered users
- User profile management
- Dark/Light theme support
- Responsive design for all devices

---

## 🌿 Branch Structure

| Branch | Description | Technology Stack |
|--------|-------------|------------------|
| `main` | Documentation and project overview | - |
| `dev` | Development base branch | - |
| `feature/html-css-js-frontend` | Current production frontend | HTML5, CSS3, Vanilla JavaScript |
| `feature/angular-frontend` | Angular implementation (In Progress) | Angular 17+, TypeScript |

---

## 🚀 Available Implementations

### 1. HTML/CSS/JS Frontend (Current)
**Branch:** `feature/html-css-js-frontend`

A lightweight, vanilla JavaScript implementation with modern UI design.

**Tech Stack:**
- HTML5
- CSS3 (Custom styling with CSS variables)
- Vanilla JavaScript (ES6+)
- Google Fonts (Inter, Poppins)

**Features:**
- No build process required
- Fast loading and performance
- Easy to understand and modify
- Direct browser compatibility

**How to Run:**
```bash
git checkout feature/html-css-js-frontend
# Open html/index.html in your browser
```

---

### 2. Angular Frontend (Coming Soon)
**Branch:** `feature/angular-frontend`

A modern Angular implementation with the same UI design and enhanced features.

**Tech Stack:**
- Angular 17+
- TypeScript
- RxJS
- Angular Material (Optional)

**Features:**
- Component-based architecture
- Type safety with TypeScript
- Reactive programming with RxJS
- Better state management
- Enhanced routing

**How to Run:**
```bash
git checkout feature/angular-frontend
npm install
ng serve
# Navigate to http://localhost:4200
```

---

## 🔗 Backend Repository

The backend API for this application is built with Spring Boot.

**Repository:** [QuantityMeasurmentApp](https://github.com/imbhuvi1/QuantityMeasurmentApp)

**Backend Tech Stack:**
- Java 17
- Spring Boot 3.2.5
- Spring Security (JWT + OAuth2)
- Spring Data JPA
- MySQL Database

**API Base URL:** `http://localhost:8080` (default)

---

## 📁 Project Structure

### HTML/CSS/JS Implementation
```
QuantityMeasurmentApp-Frontend/
├── html/
│   ├── index.html          # Main calculation interface
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   └── about.html          # About page
├── css/
│   └── style.css           # All styles
├── js/
│   ├── api.js              # API configuration
│   ├── auth.js             # Authentication logic
│   └── calculator.js       # Calculation operations
└── images/
    └── BhuvneshProfilePic.jpg
```

### Angular Implementation (Planned)
```
QuantityMeasurmentApp-Frontend/
├── src/
│   ├── app/
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API and auth services
│   │   ├── models/         # TypeScript interfaces
│   │   ├── guards/         # Route guards
│   │   └── interceptors/   # HTTP interceptors
│   ├── assets/             # Static assets
│   └── environments/       # Environment configs
├── angular.json
├── package.json
└── tsconfig.json
```

---

## 🎯 Supported Operations

| Operation | Description | Supported Types |
|-----------|-------------|-----------------|
| **Compare** | Check if two quantities are equal | All types |
| **Convert** | Convert between different units | All types |
| **Add** | Add two quantities | Length, Weight, Volume |
| **Subtract** | Subtract two quantities | Length, Weight, Volume |
| **Divide** | Divide two quantities | Length, Weight, Volume |

### Supported Unit Types

**Length:** FEET, INCHES, YARDS, CENTIMETERS  
**Weight:** MILLIGRAM, GRAM, KILOGRAM, POUND, TONNE  
**Volume:** LITRE, MILLILITRE, GALLON  
**Temperature:** CELSIUS, FAHRENHEIT, KELVIN

---

## 🔧 Setup & Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Backend API running on `http://localhost:8080`
- (For Angular) Node.js 18+ and npm

### HTML/CSS/JS Version
1. Clone the repository:
```bash
git clone https://github.com/imbhuvi1/QuantityMeasurmentApp-Frontend.git
cd QuantityMeasurmentApp-Frontend
```

2. Checkout the HTML/CSS/JS branch:
```bash
git checkout feature/html-css-js-frontend
```

3. Open `html/index.html` in your browser

### Angular Version (When Available)
1. Checkout the Angular branch:
```bash
git checkout feature/angular-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
ng serve
```

4. Navigate to `http://localhost:4200`

---

## 🌐 API Integration

The frontend communicates with the backend REST API:

**Base URL:** `http://localhost:8080/api`

**Key Endpoints:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /quantity/compare` - Compare quantities
- `POST /quantity/convert` - Convert units
- `POST /quantity/add` - Add quantities
- `POST /quantity/subtract` - Subtract quantities
- `POST /quantity/divide` - Divide quantities
- `GET /quantity/history` - Get calculation history
- `DELETE /quantity/history` - Delete all history

---

## 👨💍 Developer

**Bhuvnesh Singh Bhadauriya**  
Full Stack Developer (Student)

- **LinkedIn:** [bhuvnesh1022](https://www.linkedin.com/in/bhuvnesh1022)
- **GitHub:** [imbhuvi1](https://github.com/imbhuvi1)

---

## 📚 Part of BridgeLabz Training

This project is developed as part of the **BridgeLabz Corporate GenAI Fellowship Program** to demonstrate:
- Full-stack development skills
- RESTful API integration
- Modern frontend frameworks
- Authentication & Authorization
- Responsive UI/UX design
- Version control with Git

---

## 📄 License

This project is created for educational purposes as part of the BridgeLabz training program.

---

## 🤝 Contributing

This is a training project. For any suggestions or issues, please contact the developer.

---

**Note:** Make sure the backend API is running before using the frontend application.
