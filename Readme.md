<div align="center"><h1>Restaurant Admin Dashboard (MERN Stack)</h1></div>

## 🏢 Project Overview


This project is a full-stack Restaurant Admin Dashboard built as part of the Eatoes Intern Technical Assessment. It enables restaurant staff to manage menu items, track inventory availability, and monitor customer orders in real time.

The system is designed using a decoupled architecture, where customer-facing systems place orders through APIs, and this admin dashboard is used to track and manage the order lifecycle.

---
## 🎯 Features
### Menu Management

- Create, view, and delete menu items

- Category and availability filtering

- Search with debouncing for performance

- Optimistic UI updates for availability toggle

- Image preview support

- Form validation at frontend and backend

### Orders Dashboard

- Paginated orders list

- Status filtering

- Order status updates (Pending → Preparing → Ready → Delivered → Cancelled)

- Expandable order details with item breakdown

- Visual status badges

### Backend & Database

- Secure backend-calculated order totals

- MongoDB text indexing for fast search

- Aggregation pipeline for top-selling menu analytics

- Environment-based configuration

- RESTful API architecture
---
## 🧠 System Architecture
```
Customer App / POS / QR Menu
          ↓
   POST /api/orders
          ↓
     Node.js API
 (Validation + Pricing)
          ↓
      MongoDB Atlas
          ↓
 React Admin Dashboard
 (View + Update Orders)
 ```
---
## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Bootstrap 5, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Deployment** | Render (Backend), Netlify (Frontend) |
---
## 📁 Project Structure
```
root/
├── server/
│   ├── config/          # Database connection
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── controllers/   # Business logic
│   ├── scripts/       # Seed script
│   ├── .env           # Environment variables (ignored)
│   └── server.js      # Entry point
└── client/
    ├── src/
    │   ├── components/ # UI components
    │   ├── hooks/      # Custom hooks
    │   ├── pages/      # Page views
    │   ├── api.js     # Axios configuration
    │   └── App.jsx
    └── public/
```
---
## ⚙️ Environment Variables
### Backend (server/.env)
- PORT=5000
- MONGODB_URI=your_mongodb_atlas_connection_string
- NODE_ENV=development

### Frontend (client/.env)
- VITE_API_URL=http://localhost:5000

---
## 🚀 Local Setup
### 1️⃣ Clone Repository
```
 git clone https://github.com/your-username/eatoes-dashboard.git
 cd eatoes-dashboard
```
### 2️⃣ Backend Setup
```
cd server
npm install
npm run dev
```

### Server runs on: http://localhost:5000

### 3️⃣ Frontend Setup
```
cd client
npm install
npm run dev
```
### Frontend runs on: http://localhost:5173
---

## 📡 API Documentation
#### 🔹 Menu APIs
##### Get All Menu Items
    GET /api/menu


##### Query Params:

-     category

-     availability=true|false

#### Search Menu

    GET /api/menu/search?q=pizza


##### Uses MongoDB text indexing on:

-     name

-     ingredients

#### Create Menu Item
    POST /api/menu


#### Request Body:
```
{
  "name": "Veg Burger",
  "description": "Fresh veggie burger",
  "category": "Main Course",
  "price": 199,
  "ingredients": ["Bun", "Patty", "Lettuce"],
  "preparationTime": 10,
  "imageUrl": "https://example.com/image.jpg"
}
```
#### Toggle Availability
    PATCH /api/menu/:id/availability

#### Delete Item
    DELETE /api/menu/:id

#### 🔹 Order APIs
##### Create Order
    POST /api/orders


##### Request Body:
```
{
  "items": [
    { "menuItem": "65abc123", "quantity": 2 }
  ],
  "customerName": "Sanjay",
  "tableNumber": 5
}
```
##### Get Orders (Paginated)
    GET /api/orders?page=1&limit=5

#### Update Status
      PATCH /api/orders/:id/status


#### Request Body:
```
{
  "status": "Preparing"
}
```
#### 🔹 Analytics (Optional)
    GET /api/analytics/top-sellers


- Returns top 5 selling menu items using MongoDB aggregation.

#### 🧪 Seed Data (Optional)

##### Run:
```
cd server
node scripts/seed.js

```
#### Populates:

- 15 menu items

- 10 sample orders

#### 🌍 Deployment
##### Backend (Render)

###### 1. Push project to GitHub

###### 2. Create new Web Service on Render

###### 3. Set:
###### * Build Command: npm install

###### * Start Command: node server.js

###### 4. Add environment variables

###### 5. Deploy

#### Frontend (Netlify)

###### 1. Connect GitHub repo

###### 2. Set:

###### * Build Command: npm run build

###### * Publish Directory: dist

###### 3. Add env variable:

    VITE_API_URL=https://your-backend.onrender.com


###### 4.Deploy
---
## 🧠 Design Decisions

- Backend-calculated pricing prevents tampering and ensures security

- Text indexing improves search performance

- Optimistic UI updates improve user experience

- Pagination ensures scalability for large datasets

- Decoupled architecture allows multiple customer systems to integrate
---
## ⚠️ Challenges Faced

- Handling optimistic UI rollback on API failure

- Implementing MongoDB aggregation for analytics

- Ensuring Bootstrap and React state management worked together without JS conflicts

- Maintaining performance while rendering large datasets
---
## 📸 Screenshots

| Menu Management | Orders Dashboard |
| :---: | :---: |
| ![Menu](https://res.cloudinary.com/dvf7rhe2l/image/upload/v1769917152/Screenshot_2026-02-01_090709_balzax.png) | ![Orders](https://res.cloudinary.com/dvf7rhe2l/image/upload/v1769917153/Screenshot_2026-02-01_090727_oaimnf.png) |
| *Search, Filter, & Add Items* | *Real-time Status Updates* |
---
## 🏁 Submission Checklist

 - GitHub repository

 - Backend deployed on Render

- Frontend deployed on Netlify

- API documentation

- Environment variables example

- Seed script

- Screenshots
---
## 👨‍💻 Author

<div align="center"><h3>Sanjay Thadaka</h3><br/>
B.Tech Computer Science Engineering
Aspiring Full Stack & Backend Engineer</div>