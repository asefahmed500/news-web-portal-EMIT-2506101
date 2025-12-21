# News Web Portal - API Documentation

## 🚀 Getting Started

### Start the Server
```bash
npm run api
```
This starts json-server on `http://localhost:3000`

---

## 📋 API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get single user |
| GET | `/news` | Get all news |
| GET | `/news/:id` | Get single news |
| POST | `/news` | Create new news |
| PATCH | `/news/:id` | Update news |
| DELETE | `/news/:id` | Delete news |

---

## 👥 USERS API

### 1. Get All Users

**Request:**
```
GET http://localhost:3000/users
```

**Example Response:**
```json
[
  {
    "id": "1",
    "name": "Alice Rahman",
    "email": "alice@example.com"
  },
  {
    "id": "2",
    "name": "Karim Hossain",
    "email": "karim@example.com"
  },
  {
    "id": "3",
    "name": "Nusrat Jahan",
    "email": "nusrat@example.com"
  }
]
```

---

### 2. Get Single User by ID

**Request:**
```
GET http://localhost:3000/users/1
```

**Example Response:**
```json
{
  "id": "1",
  "name": "Alice Rahman",
  "email": "alice@example.com"
}
```

---

## 📰 NEWS API

### 3. Get All News

**Request:**
```
GET http://localhost:3000/news
```

**Example Response:**
```json
[
  {
    "id": "1",
    "title": "Govt Announces New Tech Park",
    "body": "A new state-of-the-art tech park will be established in Dhaka...",
    "author_id": 1,
    "comments": [
      {
        "id": 1,
        "text": "Great initiative!",
        "user_id": 2,
        "timestamp": "2025-12-04T10:30:00Z"
      }
    ]
  },
  {
    "id": "2",
    "title": "Local Startup Wins Innovation Award",
    "body": "A Dhaka-based startup has won an international innovation award...",
    "author_id": 2,
    "comments": []
  }
]
```

---

### 4. Get Single News by ID

**Request:**
```
GET http://localhost:3000/news/1
```

**Example Response:**
```json
{
  "id": "1",
  "title": "Govt Announces New Tech Park",
  "body": "A new state-of-the-art tech park will be established in Dhaka...",
  "author_id": 1,
  "comments": [
    {
      "id": 1,
      "text": "Great initiative!",
      "user_id": 2,
      "timestamp": "2025-12-04T10:30:00Z"
    }
  ]
}
```

---

### 5. Create New News (POST)

**Request:**
```
POST http://localhost:3000/news
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Hospital Opens in Chittagong",
  "body": "A modern 500-bed hospital has opened in Chittagong city center, providing advanced healthcare facilities to the local community.",
  "author_id": 1,
  "comments": []
}
```

**Example Response (201 Created):**
```json
{
  "id": "4",
  "title": "New Hospital Opens in Chittagong",
  "body": "A modern 500-bed hospital has opened in Chittagong city center, providing advanced healthcare facilities to the local community.",
  "author_id": 1,
  "comments": []
}
```

---

### 6. Update News (PATCH)

**Request:**
```
PATCH http://localhost:3000/news/1
Content-Type: application/json
```

**Request Body (only fields you want to update):**
```json
{
  "title": "UPDATED: Govt Announces New Tech Park"
}
```

**Example Response (200 OK):**
```json
{
  "id": "1",
  "title": "UPDATED: Govt Announces New Tech Park",
  "body": "A new state-of-the-art tech park will be established in Dhaka...",
  "author_id": 1,
  "comments": [...]
}
```

**Another Example - Update body:**
```json
{
  "body": "This is the updated body content for the news article."
}
```

---

### 7. Delete News

**Request:**
```
DELETE http://localhost:3000/news/1
```

**Example Response (200 OK):**
```json
{}
```

---

## 🧪 Testing with Postman

### Step-by-Step Setup

#### Step 1: Create New Collection
1. Open Postman
2. Click **Collections** → **New Collection**
3. Name it: `News Portal API`

#### Step 2: Add GET All Users Request
1. Click **Add Request**
2. Name: `Get All Users`
3. Method: `GET`
4. URL: `http://localhost:3000/users`
5. Click **Save** then **Send**

#### Step 3: Add GET All News Request
1. Click **Add Request**
2. Name: `Get All News`
3. Method: `GET`
4. URL: `http://localhost:3000/news`
5. Click **Save** then **Send**

#### Step 4: Add GET Single News Request
1. Click **Add Request**
2. Name: `Get News by ID`
3. Method: `GET`
4. URL: `http://localhost:3000/news/1`
5. Click **Save** then **Send**

#### Step 5: Add POST Create News Request
1. Click **Add Request**
2. Name: `Create News`
3. Method: `POST`
4. URL: `http://localhost:3000/news`
5. Go to **Headers** tab:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to **Body** tab:
   - Select **raw**
   - Select **JSON** from dropdown
   - Paste this:
   ```json
   {
     "title": "Test News Article",
     "body": "This is the body of my test news article with enough content.",
     "author_id": 1,
     "comments": []
   }
   ```
7. Click **Save** then **Send**

#### Step 6: Add PATCH Update News Request
1. Click **Add Request**
2. Name: `Update News`
3. Method: `PATCH`
4. URL: `http://localhost:3000/news/1`
5. Go to **Headers** tab:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to **Body** tab:
   - Select **raw**
   - Select **JSON** from dropdown
   - Paste this:
   ```json
   {
     "title": "My Updated Title"
   }
   ```
7. Click **Save** then **Send**

#### Step 7: Add DELETE News Request
1. Click **Add Request**
2. Name: `Delete News`
3. Method: `DELETE`
4. URL: `http://localhost:3000/news/3`
5. Click **Save** then **Send**

---

## 🔧 Testing with cURL (Command Line)

### Get All Users
```bash
curl http://localhost:3000/users
```

### Get All News
```bash
curl http://localhost:3000/news
```

### Get Single News
```bash
curl http://localhost:3000/news/1
```

### Create News
```bash
curl -X POST http://localhost:3000/news -H "Content-Type: application/json" -d "{\"title\":\"New Article\",\"body\":\"This is the content of the article.\",\"author_id\":1,\"comments\":[]}"
```

### Update News
```bash
curl -X PATCH http://localhost:3000/news/1 -H "Content-Type: application/json" -d "{\"title\":\"Updated Title\"}"
```

### Delete News
```bash
curl -X DELETE http://localhost:3000/news/1
```

---

## ⚠️ Common Errors

### 404 Not Found
```json
{
  "error": "Not found"
}
```
**Cause:** The news ID doesn't exist.
**Solution:** Check the ID and try again.

### Cannot connect to server
**Cause:** json-server is not running.
**Solution:** Run `npm run api` first.

---

## 📊 Data Structure

### User Object
```json
{
  "id": "1",
  "name": "Alice Rahman",
  "email": "alice@example.com"
}
```

### News Object
```json
{
  "id": "1",
  "title": "News Title (required, min 5 chars)",
  "body": "News body content (required, min 20 chars)",
  "author_id": 1,
  "comments": [
    {
      "id": 1,
      "text": "Comment text",
      "user_id": 2,
      "timestamp": "2025-12-04T10:30:00Z"
    }
  ]
}
```

---

## ✅ Quick Test Checklist

- [ ] Server running on port 3000
- [ ] GET /users returns user list
- [ ] GET /news returns news list
- [ ] GET /news/1 returns single news
- [ ] POST /news creates new news
- [ ] PATCH /news/1 updates news
- [ ] DELETE /news/3 removes news

---

## 🎯 Postman Import (Optional)

You can import this collection directly. Create a file called `postman_collection.json` with the endpoints, or manually add them as shown above.

Happy Testing! 🚀
