# 🍔 Food Delivery Order Manager

A full-stack application that manages food delivery orders and automatically assigns delivery to the nearest unpaid order.

---

## 📁 Project Structure

```
food-delivery/
├── backend/                        ← Spring Boot (Java 17)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/fooddelivery/
│       │   ├── FoodDeliveryApplication.java   ← Entry point
│       │   ├── DataInitializer.java           ← Pre-loads 6 sample orders
│       │   ├── model/
│       │   │   └── Order.java                 ← JPA Entity
│       │   ├── repository/
│       │   │   └── OrderRepository.java       ← Spring Data JPA queries
│       │   ├── service/
│       │   │   └── OrderService.java          ← Business logic + AssignDelivery
│       │   └── controller/
│       │       └── OrderController.java       ← REST endpoints
│       └── resources/
│           └── application.properties         ← H2 DB + config
│
└── frontend/                       ← React.js (Create React App)
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js                ← React entry
        ├── App.js                  ← Root component + tab nav
        ├── App.css                 ← Global styles
        ├── api.js                  ← Axios API service layer
        └── components/
            ├── AddOrder.js         ← Add Order form
            ├── OrdersList.js       ← View All Orders table
            └── FilterAndAssign.js  ← Filter + Assign Delivery + Output panel
```

---

## ⚡ How to Run

### 1. Backend (Spring Boot)

**Requirements:** JDK 17+, Maven

```bash
cd backend
mvn spring-boot:run
```

Server starts at → **http://localhost:8080**

H2 console available at → http://localhost:8080/h2-console (user: `sa`, no password)

---

### 2. Frontend (React)

**Requirements:** Node.js 16+, npm

```bash
cd frontend
npm install
npm start
```

App opens at → **http://localhost:3000**

---

## 🗃️ Data Model

| Field            | Type    | Description                      |
|------------------|---------|----------------------------------|
| orderId          | Long    | Auto-generated unique ID         |
| restaurantName   | String  | Name of the restaurant           |
| itemCount        | int     | Number of items in the order     |
| isPaid           | boolean | true = paid/assigned             |
| deliveryDistance  | double  | Distance in kilometres           |

---

## 🔌 API Endpoints

| Method | Endpoint                | Description                                    |
|--------|-------------------------|------------------------------------------------|
| POST   | /api/orders             | Add a new order                                |
| GET    | /api/orders             | Get all orders                                 |
| GET    | /api/orders/{id}        | Get a single order                             |
| GET    | /api/orders/filter      | Filter by `?isPaid=true/false&maxDistance=10`   |
| POST   | /api/orders/assign      | Assign delivery — body: `{"maxDistance": 10}`  |
| DELETE | /api/orders/{id}        | Delete an order                                |

---

## 🧠 AssignDelivery Algorithm

```
AssignDelivery(maxDistance):
  1. Query all orders WHERE isPaid = false AND deliveryDistance ≤ maxDistance
  2. Order results by deliveryDistance ASC
  3. Pick the FIRST result  →  that's the nearest unpaid order
  4. Mark it as isPaid = true  →  save to DB
  5. Return the assigned order
  6. If no candidates exist  →  return "No order available"
```

--

## 📦 Sample Data (auto-loaded on startup)

| Restaurant   | Items | Paid  | Distance |
|--------------|-------|-------|----------|
| Pizza Palace | 3     | No    | 2.5 km   |
| Burger Barn  | 5     | No    | 7.2 km   |
| Sushi Stop   | 2     | Yes   | 4.1 km   |
| Taco Town    | 4     | No    | 11.0 km  |
| Noodle Nest  | 1     | No    | 5.8 km   |
| Salad Garden | 2     | Yes   | 3.3 km   |

--

## 🛠️ Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Java 17, Spring Boot 3.2, JPA       |
| Database | H2 (in-memory, zero config)         |
| Frontend | React 18, Axios                     |
| Styling  | Plain CSS (no framework)            |
```
