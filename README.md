# Node.js Grocery Rest API

This application provides REST APIs for managing grocery items using Node.js, PostgreSQL, and Docker.

## Environment Variables

Before running the application, make sure to set the following environment variables:

- `PORT`: The port on which the server will run (default is 3000).
- `PGHOST`: PostgreSQL host (use 'host.docker.internal' when running with Docker).
- `PGDATABASE`: PostgreSQL database name.
- `PGUSER`: PostgreSQL username.
- `PGPASSWORD`: PostgreSQL password.
- `JWT_SECRET`: Secret key for JSON Web Token (JWT) authentication.

## Prerequisites

Before running the application, make sure you have the following dependencies installed:

- Node.js
- PostgreSQL
- Docker (if running with Docker)

## Setup and Installation

### Method 1: Use sequelize globally

```bash
npm install -g sequelize-cli
sequelize db:migrate

Method 2: Use local sequelize package
node_modules/.bin/sequelize db:migrate

Installation without Docker
1. Clone the repository:
    git clone https://github.com/mehtaharsh929/qp-assessment
2. Install dependencies:
    cd qp-assessment
    npm install
3. Run migrations:
    npx sequelize-cli db:migrate
4. Run migrations:
    npm start

Installation with Docker
1. Clone the repository:
    git clone https://github.com/mehtaharsh929/qp-assessment
2. Build the Docker image:
    docker build -t grocery-app:latest .
3. Run the Docker container:
    docker run -p 3000:3000 -d grocery-app

Usage
    Access the REST APIs at http://localhost:3000/api




