<div align="center">

# 🛒 ShopSense — AI-Powered MERN E-Commerce Platform

**A production-grade, full-stack e-commerce application with AI-driven image search, natural language product discovery, Razorpay payments, and Cloudinary-powered media management.**

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](https://opensource.org/licenses/ISC)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Data Models](#-data-models)
- [AI & Search Engine](#-ai--search-engine)
- [Payment Workflow](#-payment-workflow)
- [Environment Variables](#️-environment-variables)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Scalability & Performance](#-scalability--performance)
- [Roadmap](#-roadmap)

---

## 🧭 Overview

**ShopSense** is a modern, production-oriented e-commerce platform built on the MERN stack. It goes beyond a typical CRUD application by integrating:

- 🤖 **AI Image Search** — Upload any product photo; the system uses the `CLIP ViT-B/32` vision model to extract embeddings and finds visually similar products using cosine similarity across all stored product vectors.
- 🗣️ **Natural Language Search** — Powered by **Groq's LLaMA 3.3-70B** LLM, users can type queries like *"wireless headphones under 5000"* and the system intelligently parses intent, extracts price constraints, and builds optimized MongoDB queries.
- 🖼️ **AI Description Generation** — Admins can create products without a description; **Groq LLaMA** auto-generates concise, e-commerce-ready product copy.
- 💳 **Razorpay Payments** — Full order lifecycle with HMAC-SHA256 signature verification for tamper-proof transactions.
- ☁️ **Cloudinary Media** — All product images are uploaded, transformed, and served via Cloudinary CDN with `multer-storage-cloudinary`.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                           │
│  React 19 + Vite 8 + TailwindCSS 3 + Lucide Icons + React Router 7 │
└────────────────────────────┬────────────────────────────────────────┘
                             │  HTTP / REST (Axios)
┌────────────────────────────▼────────────────────────────────────────┐
│                    BACKEND (Node.js 20 / Express 5)                 │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │  /api/auth  │  │/api/product │  │  /api/cart  │  │/api/order │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
│  ┌─────────────────────────────┐   ┌───────────────────────────┐   │
│  │       /api/payment          │   │         /api/ai           │   │
│  │  (Razorpay + HMAC verify)   │   │   (image-search + LLM)    │   │
│  └─────────────────────────────┘   └───────────────────────────┘   │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   Auth Middleware │  │ Upload Middleware │  │ Error Middleware  │  │
│  │  (JWT + bcryptjs) │  │   (Multer/Cloud) │  │  (Global handler) │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
└───────────┬──────────────────────────────────┬─────────────────────┘
            │                                  │
┌───────────▼──────────┐          ┌────────────▼────────────────────┐
│  MongoDB Atlas       │          │       AI Services Layer          │
│  ┌────────┐          │          │  ┌──────────────────────────┐   │
│  │ Users  │          │          │  │ Groq API (LLaMA-3.3-70B) │   │
│  │Products│          │          │  │  - Text description gen  │   │
│  │ Carts  │          │          │  │  - NL query parsing      │   │
│  │ Orders │          │          │  │  - Image captioning      │   │
│  └────────┘          │          │  └──────────────────────────┘   │
└──────────────────────┘          │  ┌──────────────────────────┐   │
                                  │  │ @xenova/transformers      │   │
┌─────────────────────┐           │  │  CLIP ViT-B/32 (ONNX)    │   │
│  Cloudinary CDN     │           │  │  - Image embedding gen   │   │
│  (Image storage &   │           │  │  - Cosine similarity     │   │
│   transformation)   │           │  └──────────────────────────┘   │
└─────────────────────┘           └─────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI component framework |
| **Vite** | 8.x | Build tool & dev server |
| **React Router DOM** | 7.x | Client-side routing |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **Axios** | 1.x | HTTP client for REST APIs |
| **Lucide React** | 0.577 | Icon library |
| **React Hot Toast** | 2.x | Toast notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 20.x | JavaScript runtime |
| **Express** | 5.x | HTTP server & REST framework |
| **MongoDB** | Atlas / 7.x | Document database |
| **Mongoose** | 9.x | MongoDB ODM & schema validation |
| **JSON Web Token** | 9.x | Stateless authentication |
| **bcryptjs** | 3.x | Password hashing |
| **Razorpay** | 2.x | Payment gateway (INR) |
| **Multer** | 2.x | Multipart file upload middleware |
| **Cloudinary** | 1.x | Cloud image storage & CDN |
| **multer-storage-cloudinary** | 4.x | Cloudinary-backed Multer storage |
| **Sharp** | 0.34 | Server-side image processing |
| **dotenv** | 17.x | Environment variable management |
| **express-async-handler** | 1.x | Async error propagation |
| **cors** | 2.x | Cross-Origin Resource Sharing |

### AI / ML Layer
| Technology | Version | Purpose |
|---|---|---|
| **Groq SDK** | 1.x | LLM API client (ultra-fast inference) |
| **LLaMA 3.3-70B Versatile** | — | NL query parsing, description generation |
| **Llama-4 Scout 17B** | — | Multimodal image captioning (vision) |
| **@xenova/transformers** | 2.x | ONNX-based CLIP model in Node.js |
| **CLIP ViT-B/32** | — | Image feature extraction & embedding |
| **@huggingface/transformers** | 3.x | Transformers.js v3 (HuggingFace) |

### DevOps & Tooling
| Tool | Purpose |
|---|---|
| **nodemon** | Backend hot-reloading in development |
| **ESLint** | Frontend linting & code quality |
| **PostCSS / Autoprefixer** | CSS transformation pipeline |
| **ESM Modules** | Native ES Modules in Node.js (`"type": "module"`) |

---

## ✨ Features

### 👤 Customer
- **JWT Authentication** — Register, login, and stateless session management with `Bearer` token headers
- **Product Catalog** — Paginated listing (up to 50/page), single product detail view
- **AI Image Search** — Upload a photo → CLIP embedding extraction → cosine similarity ranking → top-8 results returned
- **Natural Language Search** — Groq-powered query parser converts *"Nike shoes under 3000"* → `{ name: /Nike/i, price: { $lte: 3000 } }`
- **Search Autocomplete** — Real-time `$regex` suggestions on product name
- **Cart** — Add, remove, and update item quantities (persisted per user in MongoDB)
- **Collections** — User-curated product groupings (cart-level organization)
- **Checkout** — Razorpay order creation → hosted payment UI → HMAC-SHA256 signature verification → order persistence
- **Order History** — View all placed orders with status tracking (`pending → paid → shipped → delivered → cancelled`)
- **User Profile** — View and manage account information

### 🔑 Admin
- **Protected Admin Route** — Role-based access (`role: "admin"`) checked both on frontend (`AdminRoute`) and backend
- **Product Management** — Create (single or bulk up to 25), update, delete products
- **AI Description Generation** — Skip writing copy; let LLaMA 3.3-70B auto-generate a 40-word product description
- **Cloudinary Upload** — Drag-and-drop image upload with automatic CDN hosting
- **Embedding on Create** — When a product is created with images, CLIP embeddings are computed and stored automatically for future AI image search

### 🤖 AI Engine
- **Dual-mode Image Search** — Primary: CLIP cosine similarity; Fallback: Groq LLaMA-4 Scout vision captioning + keyword regex search
- **Inference Queue** — Concurrent embedding requests are serialized via an in-process queue (`MAX_CONCURRENT_INFERENCE`)
- **Vector Normalization** — All stored and query embeddings are L2-normalized before cosine comparison
- **Graceful Shutdown** — ONNX model is disposed on `SIGTERM`/`SIGINT` to prevent memory leaks
- **Memory Monitoring** — `logMemoryUsage()` logs RSS/heap metrics at startup, each inference step, and on a configurable interval

---

## 📁 Project Structure

```
ecom/
├── Readme.Md
│
├── Backend/                          # Node.js + Express API server
│   ├── server.js                     # Entry point: routes, middleware, graceful shutdown
│   ├── .env                          # Environment variables (not committed)
│   ├── .nvmrc                        # Node version pin (20.x)
│   │
│   ├── config/
│   │   ├── db.js                     # MongoDB connection (Mongoose, connection pool)
│   │   ├── cloudinary.js             # Cloudinary SDK initialization
│   │   └── groqsetup.js              # Groq client singleton
│   │
│   ├── model/
│   │   ├── User.js                   # User schema (name, email, password, role)
│   │   ├── Product.js                # Product schema (name, price, images, embedding[])
│   │   ├── Cart.js                   # Cart schema (user ref, products[])
│   │   └── Order.js                  # Order schema (user, items, status, razorpayOrderId)
│   │
│   ├── controller/
│   │   ├── User.js                   # Auth: register, login, profile
│   │   ├── Product.js                # Product CRUD, search, suggestions, bulk create
│   │   ├── Cart.js                   # Cart add/remove/update/get
│   │   ├── Order.js                  # Order create, list, status update
│   │   ├── ai.controller.js          # Image search: embedding → cosine similarity → fallback
│   │   └── groqParse.js              # NL query → structured MongoDB filter (Groq LLaMA)
│   │
│   ├── middleware/
│   │   ├── auth.js                   # JWT verification + user lookup
│   │   ├── upload.js                 # Multer config (memory & Cloudinary storage)
│   │   └── cloudinary.js             # Cloudinary upload helper
│   │
│   ├── router/
│   │   ├── User.js                   # POST /register, /login; GET /profile
│   │   ├── Product.js                # GET /, /:id, /search; POST /; PUT /:id; DELETE /:id
│   │   ├── Cart.js                   # GET /; POST /add; PUT /update; DELETE /remove
│   │   ├── Order.js                  # POST /create; GET /my-orders; PUT /:id/status
│   │   └── ai.routes.js              # POST /image-search
│   │
│   ├── services/
│   │   ├── ai.service.js             # Groq: generateDesc, getImageCaption, getEmbedding
│   │   ├── transformer.util.js       # CLIP model loader, inference queue, normalizeVector
│   │   └── Payment.js                # Express sub-app: /create-order, /verify-payment
│   │
│   └── scripts/
│       └── generateEmbeddings.js     # One-off script: backfill CLIP embeddings for all products
│
└── frontend/                         # React 19 + Vite SPA
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    │
    └── src/
        ├── main.jsx                  # ReactDOM.createRoot entry
        ├── App.jsx                   # Route definitions + layout wiring
        │
        ├── admin/
        │   └── CreateProduct.jsx     # Admin: create product form with Cloudinary upload
        │
        ├── components/
        │   ├── Navbar.jsx            # Global nav with cart badge, auth state
        │   ├── Layout.jsx            # Outlet wrapper with Navbar
        │   ├── ProductCard.jsx       # Reusable product tile
        │   ├── SearchBar.jsx         # Search input with autocomplete dropdown
        │   ├── CollectionModal.jsx   # Modal for managing product collections
        │   ├── ProtectedRoute.jsx    # Redirects unauthenticated users to /login
        │   └── AdminRoute.jsx        # Redirects non-admin users
        │
        ├── pages/
        │   ├── Home.jsx              # Product listing with pagination & search
        │   ├── ProductDetails.jsx    # Single product with add-to-cart
        │   ├── AISearch.jsx          # Drag-and-drop image upload + results
        │   ├── Cart.jsx              # Cart view with quantity controls + checkout
        │   ├── Orders.jsx            # Order history list
        │   ├── Collections.jsx       # User collections management
        │   ├── Profile.jsx           # User profile view
        │   ├── Login.jsx             # Login form
        │   ├── Register.jsx          # Registration form
        │   ├── SuccessPayment.jsx    # Post-payment confirmation
        │   └── CancelPayment.jsx     # Payment cancelled/failed screen
        │
        ├── hooks/
        │   ├── useAuth.js            # Auth state: user, token, login/logout helpers
        │   ├── useCart.js            # Cart state management
        │   └── useTheme.js           # Dark/light theme toggle
        │
        ├── context/
        │   └── ThemeContext.jsx      # React Context for theme
        │
        ├── services/
        │   └── api.js                # Axios instance with base URL & auth interceptors
        │
        └── utils/
            └── currency.js           # INR formatting utility
```

---

## 📡 API Reference

### Authentication — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Create a new user account |
| `POST` | `/login` | ❌ | Authenticate and receive JWT |
| `GET` | `/profile` | ✅ | Get current user profile |

### Products — `/api/product`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ❌ | List products (paginated, `?page=&limit=`) |
| `GET` | `/:id` | ❌ | Get single product by MongoDB ID |
| `GET` | `/search?query=` | ❌ | AI-enhanced NL search with price filters |
| `GET` | `/suggest?query=` | ❌ | Autocomplete suggestions (top 5) |
| `POST` | `/` | ✅ Admin | Create single or bulk (array) products |
| `PUT` | `/:id` | ✅ Admin | Update product fields |
| `DELETE` | `/:id` | ✅ Admin | Delete a product |

### Cart — `/api/cart`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ✅ | Get user's cart |
| `POST` | `/add` | ✅ | Add item to cart |
| `PUT` | `/update` | ✅ | Update item quantity |
| `DELETE` | `/remove` | ✅ | Remove item from cart |

### Orders — `/api/order`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/create` | ✅ | Create a new order |
| `GET` | `/my-orders` | ✅ | Get all orders for current user |
| `PUT` | `/:id/status` | ✅ Admin | Update order status |

### Payment — `/api/payment`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/create-order` | ✅ | Create Razorpay order (returns `orderId`, `amount`) |
| `POST` | `/verify-payment` | ✅ | HMAC-SHA256 signature verification |

### AI — `/api/ai`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/image-search` | ❌ | Upload image → cosine similarity search → top products |

---

## 🗃️ Data Models

### User
```js
{
  name:       String,
  email:      String (unique),
  password:   String (bcrypt hashed),
  role:       "user" | "admin",
  profilePic: String (URL),
  timestamps: true
}
```

### Product
```js
{
  name:          String (required),
  desc:          String,
  brand:         String,
  price:         Number (required),
  discountPrice: Number,
  images:        [{ url: String, public_id: String }],
  stock:         Number (default: 0),
  ratings:       Number (default: 0),
  embedding:     [Number], // CLIP ViT-B/32 vector, select: false
  timestamps:    true
  // Text index on: name, desc
}
```

### Order
```js
{
  user:           ObjectId → Users,
  products:       [{ product: ObjectId, name, price, image, quantity }],
  totalPrice:     Number,
  status:         "pending" | "paid" | "shipped" | "delivered" | "cancelled",
  razorpayOrderId: String,
  timestamps:     true
}
```

---

## 🤖 AI & Search Engine

### Image Search Pipeline

```
User uploads image
        │
        ▼
Multer (memory storage) → req.file.buffer
        │
        ▼
CLIP ViT-B/32 (Xenova/transformers, ONNX)
→ getImageEmbeddingFromBuffer(buffer)
→ Inference Queue (serialized, max 1 concurrent)
→ L2-normalized float[] vector
        │
        ├─── Success ───────────────────────────────────────────────────┐
        │                                                               │
        ▼                                                               ▼
MongoDB cursor: all products with non-empty embedding          Fallback: getImageCaption()
        │                                                         (Groq Llama-4 Scout Vision)
cosineSimilarity(queryEmbedding, productEmbedding)                      │
        │                                                       Keyword extraction + $regex
Top-K results (RESPONSE_LIMIT=8) sorted by score               MongoDB text search
        │
Score thresholds:
  bestScore < 0.25 → fallback
  similarScore ≥ 0.35 → include in results
        │
        ▼
JSON: { identifiedProduct, similarProducts[] }
```

### Natural Language Search Pipeline

```
User query: "wireless headphones under 5000"
        │
        ▼
Groq LLaMA-3.3-70B-Versatile
System: "Parse query → { keywords, maxPrice }"
        │
        ▼
{ keywords: "wireless headphones", maxPrice: 5000 }
        │
        ▼
buildMongoQuery():
{
  $and: [
    { $or: [{ name: /wireless/i }, { brand: /wireless/i }, { desc: /wireless/i }] },
    { $or: [{ name: /headphones/i }, { brand: /headphones/i }, { desc: /headphones/i }] }
  ],
  price: { $lte: 5000 }
}
        │
        ▼
Product.find(query).limit(50)
```

---

## 💳 Payment Workflow

```
1. Customer clicks "Checkout"
         │
         ▼
2. POST /api/payment/create-order
   { amount, currency: "INR" }
         │
         ▼
3. Razorpay.orders.create()
   Returns: { orderId, amount, currency }
         │
         ▼
4. Razorpay checkout modal opens in browser
   (hosted by Razorpay JS SDK)
         │
         ▼
5. User completes payment → Razorpay callback
   { razorpay_order_id, razorpay_payment_id, razorpay_signature }
         │
         ▼
6. POST /api/payment/verify-payment
   HMAC-SHA256(order_id|payment_id, KEY_SECRET) === razorpay_signature
         │
         ▼
7. Order saved to MongoDB with status "paid"
         │
         ▼
8. User redirected to /success
```

---

## ⚙️ Environment Variables

### Backend (`Backend/.env`)

```env
# Server
PORT=5000
CORS_ORIGIN=http://localhost:5173
JSON_BODY_LIMIT=1mb
URLENCODED_BODY_LIMIT=1mb

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ecom
MONGO_MAX_POOL_SIZE=5
MONGO_SERVER_SELECTION_TIMEOUT_MS=10000

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Payment
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI / Groq
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
GROQ_TEXT_MODEL=llama-3.3-70b-versatile
GROQ_VISION_MODEL=meta-llama/llama-4-scout-17b-16e-instruct

# AI / Transformers (CLIP)
IMAGE_EMBEDDING_MODEL=Xenova/clip-vit-base-patch32
AI_QUANTIZED=true
AI_MAX_CONCURRENT_INFERENCE=1
AI_IMAGE_MAX_BYTES=5242880
AI_IMAGE_FETCH_TIMEOUT_MS=15000
TRANSFORMERS_ALLOW_REMOTE=true
TRANSFORMERS_ALLOW_LOCAL=false
ORT_NUM_THREADS=1
ORT_WASM_SIMD=true

# Image Search Tuning
IMAGE_SEARCH_LIMIT=8
IMAGE_SEARCH_MIN_BEST_SCORE=0.25
IMAGE_SEARCH_MIN_SIMILAR_SCORE=0.35
IMAGE_SEARCH_BATCH_SIZE=25

# Product
PRODUCT_PAGE_LIMIT=20
PRODUCT_MAX_BULK_CREATE=25

# Monitoring
MEMORY_LOG_INTERVAL_MS=60000
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x ([nvm](https://github.com/nvm-sh/nvm) recommended — `.nvmrc` is provided)
- **MongoDB Atlas** account or local MongoDB
- **Groq API Key** — [console.groq.com](https://console.groq.com)
- **Cloudinary** account — [cloudinary.com](https://cloudinary.com)
- **Razorpay** account — [razorpay.com](https://razorpay.com) (test mode available)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/shopsense.git
cd shopsense
```

### 2. Backend Setup

```bash
cd Backend
cp .env.example .env   # Fill in your credentials
npm install
npm run dev            # Starts on PORT=5000 with nodemon
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env   # Set VITE_API_BASE_URL
npm install
npm run dev            # Starts Vite dev server on :5173
```

### 4. (Optional) Backfill Product Embeddings

If you have existing products without CLIP embeddings:

```bash
cd Backend
npm run generate:embeddings
```

This runs `scripts/generateEmbeddings.js` which processes all products with image URLs and stores their CLIP vectors in MongoDB.

---

## 🌐 Deployment

| Layer | Recommended Platform | Notes |
|---|---|---|
| **Frontend** | [Vercel](https://vercel.com) | Auto-deploys from Git; set `VITE_*` env vars in dashboard |
| **Backend** | [Render](https://render.com) / [Railway](https://railway.app) | Set all env vars; use `npm start` as start command |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Free tier available; whitelist Render/Railway IPs |
| **Images** | [Cloudinary](https://cloudinary.com) | Free tier: 25 GB storage |
| **AI Inference** | [Groq](https://console.groq.com) | Free tier: generous rate limits for LLaMA 3.3 |

> [!IMPORTANT]
> The CLIP image embedding model (`Xenova/clip-vit-base-patch32`) is downloaded at runtime from HuggingFace Hub on first use. Ensure your backend deployment has outbound internet access and sufficient RAM (≥ 512 MB).

> [!TIP]
> On Render's free tier, the server sleeps after inactivity. The first image search after wake-up will load the CLIP model (~100-300ms download + ONNX init). Use a paid plan or a keep-alive ping for production.

---

## 📈 Scalability & Performance

| Concern | Implementation |
|---|---|
| **Stateless Auth** | JWT — no server-side sessions, horizontally scalable |
| **Database Pool** | Mongoose `maxPoolSize=5`, configurable via env |
| **Embedding I/O** | In-process inference queue prevents OOM from concurrent requests |
| **Cursor Streaming** | `Product.find().cursor({ batchSize: 25 })` for memory-efficient vector scan |
| **Embedding Isolation** | `embedding` field has `select: false` — never leaked in public API responses |
| **Error Boundaries** | Global Express error handler; AI fallback on embedding failure |
| **Graceful Shutdown** | `SIGTERM`/`SIGINT` handlers dispose ONNX model and drain connections |
| **Memory Monitoring** | Periodic heap/RSS logging via `logMemoryUsage()` |
| **MVC Pattern** | Clean separation: routes → controllers → services → models |

---

## 📌 Roadmap

- [ ] Product Reviews & Star Ratings
- [ ] Wishlist / Saved Items
- [ ] Server-side Pagination with cursor-based navigation
- [ ] Email Notifications (Order confirmation via Nodemailer/SendGrid)
- [ ] Razorpay Webhook for asynchronous payment confirmation
- [ ] Redis caching for product listings and search results
- [ ] Pinecone / Qdrant vector database for scalable similarity search
- [ ] Admin Dashboard with analytics (sales, top products, user activity)
- [ ] React Native mobile app (shared API)
- [ ] Docker Compose setup for local development

---

## 👨‍💻 Author

**Mouneesh**
Full Stack Developer — MERN · Java · React Native

---

## 📄 License

This project is licensed under the **ISC License**.
