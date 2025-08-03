# Product API Challenge

This project is a NestJS-based backend service that fetches 'Product' entries from Contentful every hour, stores them in a PostgreSQL database, and exposes both public and private REST API modules. The public API supports paginated, filterable product listing and product deletion. The private API provides statistical reports, protected by JWT authentication.

---

## Features

- **Scheduled Contentful Sync**: Fetches latest products every hour and updates the database.
- **REST API Endpoints**:
  - **Public**: Paginated and filterable product listing (max 5 per page), product deletion (persistent), Swagger docs at `/api/docs`.
  - **Private**: Statistical reports (JWT-protected).
- **Reports**:
  1. Percentage of deleted products.
  2. Percentage of non-deleted products (with/without price, custom date range).
  3. [Custom Report]: Most recent products.
- **Database**: PostgreSQL (via TypeORM).
- **Tests**: At least 30% coverage, CI/CD via GitHub Actions.
- **Dockerized**: Runs with `docker-compose` (includes server and db).

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)
- (Optional) [Node.js (LTS)](https://nodejs.org/) for local dev

### Environment Variables

Copy `.env.example` to `.env` and fill in values as needed (see [Environment Variables](#environment-variables) below).

### Running the App

1. **Clone the repo**
   ```sh
   git clone <this-repo-url>
   cd <repo-folder>
   ```

2. **Setting up environment**
   ```sh
  npm install
   ```
   dd
   ```sh
   docker-compose up --build
   ```

   - The server will be available at `http://localhost:3000/api/v1`
   - Swagger docs: `http://localhost:3000/api/docs`
   - Postman collection is also available in the project 

3. **Initial Data Population**

   The app will auto-fetch products from Contentful within the first hour of startup then It will keep refreshing every hour.
   
   You can also manually trigger a refresh:
   ```sh
   curl -X POST http://localhost:3000/api/v1/products/
   ```

---

## Usage

### Public Endpoints

Products
- `GET /products`
  - Pagination: `?page=1`
  - Filtering: `?name=abc&category=xyz&minPrice=10&maxPrice=100`
- `DELETE /products/:id`

Contentful
- `GET /contenful/products`

### Private Endpoints (JWT required in `Authorization: Bearer <token>`)

- `GET /reports/deleted-percentage`
- `GET /reports/non-deleted-percentage?withPrice=true&from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /reports/recent-products`

See `/api/docs` for complete API details.

---

## Reports

- **Percentage of deleted products**
- **Percentage of non-deleted products with/without price and within a date range**
- **Most recent added roducts** (custom report)

---

## Authentication

For private endpoints, use JWT. To obtain a token for demo, see `/auth/login` in Swagger docs (with dummy credentials).

---

## Testing and Linting

- **Tests**: Run `npm run test:cov`
- **Lint**: Run `npm run lint`
- **CI/CD**: All tests and linters run automatically on GitHub Actions.

---

## Environment Variables

```
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_ENVIRONMENT=
CONTENTFUL_CONTENT_TYPE=

DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

JWT_SECRET=
JWT_EXPIRES_IN=
```

---

## Assumptions & Choices

- Deleted products are tracked in the DB and will not reappear after a refresh.
- Product attributes for filtering: `name`, `category`, `minPrice`, `maxPrice`.
- All times are UTC.
- JWT authentication is basic for demo purposes (sample user provided).
- TypeScript is used throughout.

---

## Forcing Data Refresh

To sync immediately with Contentful, use:
```
POST /products
```
This is a non-auth public endpoint.

---

## Project Structure

- `src/app.module.ts` - Main module
- `src/domain/products/` - Product logic (entity, controller, service, scheduled tasks)
- `src/domain/reports/` - Private reports module
- `src/shared/services/auth/` - JWT authentication
- `src/shared/services/contentful/` - Contenful API Integration
- `test/` - Unit/integration tests

---

## Contact

For any questions, see the code comments, the Swagger docs, or contact the maintainer.