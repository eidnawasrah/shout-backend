# Shout Backend

Complete production-ready backend for the Shout social media platform.

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file** (copy from `.env.example` and fill in your values):
```bash
MONGO_URI=mongodb+srv://eidnawasrah:PASSWORD@cluster0.xxxxx.mongodb.net/shout
JWT_SECRET=your-super-secret-key-change-this
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=shout-media-uploads
NODE_ENV=production
PORT=5000
```

3. **Run locally:**
```bash
npm start
```

Server will start on `http://localhost:5000`

## Deployment to Railway

1. Push to GitHub
2. Connect GitHub repo to Railway
3. Set environment variables in Railway dashboard
4. Deploy!

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Posts (Shouts)
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Get feed
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/echo` - Echo (repost)
- `POST /api/posts/:id/report` - Report post

### Replies (Yells)
- `POST /api/yells/:parentId` - Reply to post
- `GET /api/yells/:parentId` - Get replies
- `DELETE /api/yells/:yellId` - Delete reply
- `POST /api/yells/:yellId/like` - Like reply

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/profile/:username` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/:userId/follow` - Follow user

### Media
- `POST /api/media/upload-url` - Get presigned S3 URL

### Search
- `GET /api/search/posts?q=query` - Search posts
- `GET /api/search/users?q=query` - Search users
- `GET /api/search/discover` - Discover posts

### Moderation
- `POST /api/moderation/report` - Report content
- `POST /api/moderation/appeal` - Appeal moderation
- `GET /api/moderation/logs` - Get moderation logs
