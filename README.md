# Task Management API

A robust RESTful API for managing tasks, users, and tags built with TypeScript, Node.js, and Fastify.

## Features

- **User Authentication**: Secure signup and login with JWT authentication
- **Task Management**: Create, read, update, and delete tasks
- **Assignment**: Assign tasks to other users
- **Status Tracking**: Track task progress with customizable statuses
- **Tagging System**: Organize tasks with dynamic tags
- **Filtering & Sorting**: Find tasks by status, tags, due date, or priority

## Tech Stack

- **Runtime**: Node.js 22+
- **Language**: TypeScript
- **Framework**: Fastify
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js 22+ installed
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/task-management-api.git
   cd task-management-api
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   ```

4. Run database migrations
   ```bash
   npm run migrate
   ```

5. Start the server
   ```bash
   npm run dev  # Development mode with hot reloading
   # OR
   npm start    # Production mode
   ```

The API will be available at http://localhost:3000

### Docker Setup (Optional)

If you prefer using Docker:

```bash
# Build and start services
docker-compose up -d

# Run migrations
docker-compose exec api npm run migrate
```

## API Endpoints

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate and get JWT token

### Tasks

- `GET /tasks` - Get all tasks (with filtering options)
- `GET /tasks/:id` - Get a specific task
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `PATCH /tasks/:id/status` - Update task status
- `PATCH /tasks/:id/assign` - Assign task to another user

### Tags

- `GET /tags` - Get all available tags
- `POST /tasks/:id/tags` - Add tags to a task
- `DELETE /tasks/:id/tags` - Remove tags from a task

### Users

- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update user profile
- `PUT /users/me/password` - Change password
- `GET /users` - Get list of users (for task assignment)

## Request Examples

### Create a Task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete API Documentation",
    "description": "Create comprehensive API documentation for the Task Management API",
    "dueDate": "2025-04-25T18:00:00Z",
    "priority": "high",
    "tags": ["documentation", "urgent"]
  }'
```

### Filter Tasks

```bash
curl "http://localhost:3000/tasks?status=in_progress&sortBy=dueDate&order=asc&tag=urgent" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing

Run the test suite:

```bash
npm test
```

Run integration tests only:

```bash
npm run test:integration
```

## Database Schema

The application uses a normalized database schema with the following main tables:

- `users` - User accounts and authentication details
- `tasks` - Task information including status and assignment
- `tags` - Tag definitions
- `task_tags` - Many-to-many relationship between tasks and tags

## API Documentation

For detailed API documentation, import the Postman collection:

```
docs/Task_Management_API.postman_collection.json
```

## Error Handling

All API responses follow a consistent format:

```json
// Success response
{
  "status": "success",
  "data": { ... }
}

// Error response
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Error description"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
