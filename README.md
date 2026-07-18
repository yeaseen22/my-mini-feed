# MiniFeeds - Social Media Application

> **[Download APK](https://drive.google.com/file/d/1nomIpK-wLa3ylJL-lhS14YjDSKn065Ci/view?usp=sharing)** | **[Live Backend](https://my-mini-feed.onrender.com/api/v1)**

A lightweight social media application built with Node.js/Express backend and React Native/Expo mobile app. Users can post text updates, interact with posts via likes and comments, and receive real-time push notifications.

## Project Structure

```
my-mini-app/
├── mf-api/          # Backend API server
│   ├── src/         # TypeScript source code
│   ├── prisma/      # Database schema
│   └── .env         # Environment variables
└── mf-mobile/       # Mobile application
    ├── src/         # TypeScript source code
    ├── app/         # Expo Router screens
    └── assets/      # Images and fonts
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL (via Neon) |
| ORM | Prisma 6 |
| Auth | JWT (JSON Web Tokens) |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Mobile | React Native 0.83, Expo 55 |
| Navigation | Expo Router (file-based) |
| State | Zustand |

## Getting Started

### Prerequisites

- Node.js >= 20.x
- npm or yarn
- PostgreSQL database (local or Neon cloud)
- Firebase project (for push notifications)

### Backend Setup

```bash
cd mf-api
npm install
```

Create `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_jwt_secret_key
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
SALT_ROUNDS=10
HOST=localhost
PORT=8080
```

Setup database and start server:

```bash
npm run db:setup
npm run dev
```

The API server starts at `http://localhost:8080`.

### Mobile Setup

```bash
cd mf-mobile
npm install
```

Create `.env` file:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Start the app:

```bash
npx expo start -c
```

Press `i` for iOS simulator or `a` for Android emulator.

## API Documentation

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and get JWT token | No |
| GET | `/auth/logout` | Logout | Yes |

**Register** - `POST /auth/register`
```json
// Request
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

// Response (201)
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "accessToken": "jwt_token"
  }
}
```

**Login** - `POST /auth/login`
```json
// Request
{
  "email": "john@example.com",
  "password": "password123"
}

// Response (200)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "accessToken": "jwt_token"
  }
}
```

### Posts

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/posts` | Get all posts (paginated, newest first) | No |
| POST | `/posts` | Create a text-only post | Yes |
| DELETE | `/posts/:id` | Delete a post (author only) | Yes |
| POST | `/posts/:id/like` | Toggle like/unlike | Yes |
| GET | `/posts/:id/comments` | Get comments for a post (paginated) | No |
| POST | `/posts/:id/comment` | Add a comment | Yes |
| DELETE | `/posts/comments/:commentId` | Delete a comment (author only) | Yes |

**Get Posts** - `GET /posts?page=1&limit=10`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "content": "Hello world!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "id": "uuid",
        "fullName": "John Doe",
        "username": "johndoe"
      },
      "_count": { "likes": 5, "comments": 3 }
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Create Post** - `POST /posts`
```json
// Request
{ "content": "My first post!" }

// Response (201)
{
  "success": true,
  "data": { "id": "uuid", "content": "My first post!" }
}
```

**Toggle Like** - `POST /posts/:id/like`
```json
{ "success": true, "liked": true, "message": "Post liked successfully" }
```

**Add Comment** - `POST /posts/:id/comment`
```json
// Request
{ "content": "Great post!" }

// Response (201)
{
  "success": true,
  "data": { "id": "uuid", "content": "Great post!" }
}
```

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/profile` | Get current user profile | Yes |
| POST | `/users/fcm-token` | Register FCM token for push notifications | Yes |
| GET | `/users/notifications` | Get user notifications | Yes |

## Mobile App Features

### Screens

| Screen | Description |
|--------|-------------|
| Login | Email + password authentication |
| Register | Full name, username, email, password |
| Home Feed | Scrollable post list with like/comment buttons + search by username |
| Create Post | Text-only post composer (280 char limit) |
| Notifications | Activity feed (likes, comments) |
| Profile | User stats, avatar, dark mode toggle, logout |

### Key Features

- **Neu Brutalism UI**: Bold borders, hard shadows, flat saturated colors
- **Client-side Feed Filter**: Search posts by username, full name, or email
- **Push Notifications**: Firebase FCM for likes and comments
- **Infinite Scroll**: Paginated feed loading
- **Pull to Refresh**: Swipe down to refresh feed
- **Dark Mode**: Toggle between light and dark themes

## Available Scripts

### mf-api

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run db:setup` | Push schema + generate Prisma client |
| `npm run migrate` | Run Prisma migrations |

### mf-mobile

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS (requires macOS) |
| `npm run android` | Run on Android |

## Download APK

Download the latest Android APK from Google Drive:

[Download APK from Google Drive](https://drive.google.com/file/d/1nomIpK-wLa3ylJL-lhS14YjDSKn065Ci/view?usp=sharing)

1. Download the APK file from the link above
2. Transfer to your Android device
3. Enable "Install from unknown sources" in device settings
4. Open the APK file to install

## License

ISC
