# Bookit (SVU BPR601)

Bookit is a MERN social + literary community for readers and writers. It includes profiles, posts, book reviews, social interactions, a cultural marketplace, and an admin dashboard.

## Tech Stack
- Frontend: React (Vite), React Router, Context API, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT + bcrypt
- Styling: Custom CSS

## Project Structure
```
.
??? client
?   ??? index.html
?   ??? package.json
?   ??? src
??? server
?   ??? package.json
?   ??? src
??? render.yaml
??? package.json
```

## Setup
### 1) Install dependencies
```bash
npm install
npm run install:all
```

### 2) Environment variables
Copy and edit the examples:
- `server/.env.example` -> `server/.env`
- `client/.env.example` -> `client/.env`

### 3) Run locally
Start both client and server from the root:
```bash
npm run dev
```
- Server: `http://localhost:5000`
- Client: `http://localhost:5173`

### 4) Seed demo data
```bash
cd server
npm run seed
```
Seed credentials:
- Admin: `admin@bookit.local` / `password123`
- Users: `lina@bookit.local`, `omar@bookit.local`, `rana@bookit.local` / `password123`

## Deployment (Render)
This repo includes a `render.yaml` with a web service for the API and a static site for the client.

Steps:
1. Push the repo to GitHub.
2. In Render, create a new Blueprint deployment and point it to your repo.
3. Set environment variables:
   - `MONGODB_URI` (server)
   - `JWT_SECRET` (server)
   - `CORS_ORIGIN` (server) -> set to your deployed client URL
   - `VITE_API_URL` (client) -> set to your deployed server URL + `/api`
4. Deploy.

## API Documentation (Summary)
All responses use the shape:
```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

### Auth
- `POST /api/auth/register`
```json
{
  "username": "lina_reader",
  "email": "lina@bookit.local",
  "password": "password123"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "token": "jwt",
    "user": { "username": "lina_reader", "email": "lina@bookit.local" }
  }
}
```
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Users
- `GET /api/users/:id`
- `PUT /api/users/me`
- `POST /api/users/:id/follow`
- `POST /api/users/:id/unfollow`
- `POST /api/users/:id/report`
- `GET /api/users/:id/posts`
- `GET /api/users/:id/reviews`
- `GET /api/users/:id/products`
- `GET /api/users/me/saved`

### Posts
- `POST /api/posts`
- `GET /api/posts?sort=latest|top&page=1&limit=10`
- `GET /api/posts/:id`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/posts/:id/like`
- `POST /api/posts/:id/unlike`
- `POST /api/posts/:id/save`
- `POST /api/posts/:id/unsave`
- `POST /api/posts/:id/report`

Example create post:
```json
{
  "content": "I just finished a classic!",
  "images": ["https://example.com/img.jpg"]
}
```

### Reviews
- `POST /api/reviews`
- `GET /api/reviews?sort=latest|top&page=1&limit=10`
- `GET /api/reviews/:id`
- `PUT /api/reviews/:id`
- `DELETE /api/reviews/:id`
- `POST /api/reviews/:id/like`
- `POST /api/reviews/:id/unlike`
- `POST /api/reviews/:id/report`

### Comments
- `POST /api/comments`
- `GET /api/comments?parentType=post&parentId=...`
- `PUT /api/comments/:id`
- `DELETE /api/comments/:id`
- `POST /api/comments/:id/like`
- `POST /api/comments/:id/unlike`
- `POST /api/comments/:id/report`

### Marketplace Products
- `POST /api/products`
- `GET /api/products?category=book&q=arabic&page=1&limit=10`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/products/:id/reviews`
- `POST /api/products/:id/report`

Example create product:
```json
{
  "title": "Damascus Notebook",
  "description": "Handmade notebook",
  "price": 12,
  "category": "notebook",
  "images": ["https://example.com/note.jpg"],
  "stock": 20
}
```

### Orders
- `POST /api/orders`
```json
{
  "items": [{ "productId": "...", "quantity": 2 }]
}
```
- `GET /api/orders/my`
- `GET /api/orders/seller`
- `PUT /api/orders/:id/status`

### Reports (Admin)
- `GET /api/reports?status=open`
- `PUT /api/reports/:id/resolve`
```json
{
  "action": "deleted",
  "status": "resolved",
  "adminNote": "Removed for policy violation"
}
```

### Admin
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/ban`
- `GET /api/admin/analytics`
- `DELETE /api/admin/posts/:id`
- `DELETE /api/admin/reviews/:id`
- `DELETE /api/admin/comments/:id`
- `DELETE /api/admin/products/:id`

## MongoDB Schemas
The Mongoose schemas live in `server/src/models`:
- `User.js`
- `Post.js`
- `Review.js`
- `Comment.js`
- `Product.js`
- `Order.js`
- `Report.js`

## Notes
- This project uses JWT access tokens only.
- Image fields accept URLs.
