# Todo List REST API

A simple RESTful API for managing a Todo List, built with Node.js, Express, MongoDB and TypeScript.

---

## ✨ Features

- ✅ User authentication (register, login)
- 📋 CRUD operations for todos
- 🔐 JWT-based authentication
- 🗃️ MongoDB integration
- 🧪 integration tests with Jest and Supertest
- 🛠️ TypeScript support for safer development

---

## 🏗️ Project Structure

```

├── src
│ ├── controllers       # Request handlers
│ ├── cron              # Scheduled/cron jobs
│ ├── interfaces        # TypeScript interfaces and types
│ ├── middlewares       # Custom middleware (e.g. auth)
│ ├── models            # Mongoose schemas
│ ├── routes            # API routes
│ ├── utils             # Utility functions
│ ├── validators        # Request validation logic
│ └── index.ts          # Entry point, starts the server
│ └── app.ts            # Express app setup
├── tests               # Test cases
├── dist                # Compiled JavaScript
├── package.json        # include package dependencies
├── tsconfig.json       # typescript configuration
├── tsconfig.test.json  # typescript configuration for testcases
├── jest.config.js      # jest configuration for testcases
├── eslint.config.mjs   # configuration for linting
├── nodemon.json        # configuration for nodemon
├── .prettierrc         # configuration for code format
└── README.md

```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v23 or higher)
- npm
- MongoDB instance (local or cloud, e.g. MongoDB Atlas)

---

### Installation

#### 1. Clone the repository:

```bash
git clone https://github.com/Jasmeen1347/todo-list-rest-api.git
cd todo-list-rest-api
```

#### 2. Install dependencies:

```bash
npm install
```

#### 3. Create a `.env` file in the root of your project:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

#### 4. Start the development server:

```bash
npm run dev
```

> The API will be running at `http://localhost:5000`

---

## 🧪 Running Tests

Before running tests, create a separate **.env.test** file in the root of your project, for example:

```
.env.test
```

```env
PORT=5001
MONGO_URI=your_test_mongodb_uri
JWT_SECRET=your_test_jwt_secret_key
```

Then run:

```bash
npm run test
```

---

## 📚 API Endpoints

### Auth Routes

- `POST /api/auth/signup` – Register a new user
- `POST /api/auth/login` – Authenticate and receive a JWT token

### Todo Routes (Require authentication)

- `GET /api/todos` – Get all todos
- `GET /api/todos/:id` – Get a single todo
- `POST /api/todos` – Create a new todo
- `PUT /api/todos/:id` – Update a todo
- `DELETE /api/todos/:id` – Delete a todo

---

## 🛡️ Environment Variables

| Variable     | Description                |
| ------------ | -------------------------- |
| `PORT`       | Server port number         |
| `MONGO_URI`  | MongoDB connection string  |
| `JWT_SECRET` | Secret key for JWT signing |

---

## 🧑‍💻 Available Scripts

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `npm run dev`        | Start server with nodemon     |
| `npm run build`      | Compile TypeScript to JS      |
| `npm start`          | Run compiled production code  |
| `npm run lint`       | Check code for lint errors    |
| `npm run lint:fix`   | Fix lint errors automatically |
| `npm run format`     | Format code with Prettier     |
| `npm run test`       | Run tests with Jest           |
| `npm run test:watch` | Run tests in watch mode       |
