# Blazex: A Production-Ready TypeScript REST API Boilerplate

![Banner](https://bucolic-banoffee-fcc585.netlify.app/banner-1.png)

Blazex is a robust, scalable, and secure boilerplate designed to streamline the development of REST APIs using TypeScript and Express. It provides a well-structured foundation that allows developers to focus on building features rather than setting up the project. Blazex adheres to industry best practices, ensuring that your project is built on a solid foundation with robust error handling, detailed logging, and comprehensive security measures.

Whether you're building a small application or a large-scale enterprise solution, Blazex offers the tools and structure you need to succeed. With its modular architecture, efficient data management, and extensive feature set, Blazex is an ideal choice for developers looking to create high-quality, maintainable, and scalable APIs.

## Quick Start

Open your terminal and navigate to the directory where you want to create your new project.

### Step 1: Run the Blazex Command

In your terminal, run the following command:

```bash
npx blazex <project-name>
```

Replace `<project-name>` with the desired name for your project. For example:

```bash
npx blazex my-awesome-api
```

### Step 2: Navigate to Your Project Directory

Once the installation is complete, navigate into your newly created project directory:

```bash
cd <project-name>
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root of your project based on the `.env.example` file provided. Update the environment variables with your configuration:

```sh
cp .env.example .env
```

Open the `.env` file and set the all required variables.

### Step 4: Start the Development Server

To start the development server and see your new Blazex powered API in action, run the following command:

```sh
npm run dev
```

This will start the server in development mode on `http://localhost:3000`, and you should see the logs in your terminal.


## Features

- **TypeScript Support**: Ensures type safety and maintainability.
- **Express Framework**: Provides a robust and scalable foundation for building APIs.
- **MongoDB and Mongoose ORM**: Seamless integration for efficient data storage and retrieval.
- **Metric Collection**: Performance monitoring with `Prometheus` and `Grafana`.
- **Authentication**: Prebuilt mechanisms for `email/password` and `Google` OAuth.
- **Error Handling**: Centralized handling with `RFC 9457` compatible response.
- **Logging**: Detailed logging with `Winston` and `Morgan`.
- **Request Validation**: Sanitization and validation using `Zod`.
- **HTTP Header Security**: Enhanced security using `Helmet`.
- **Compression**: `Gzip` compression for optimized response times.
- **Docker Support**: Multi-stage builds for easy containerization and deployment.
- **Git Hooks**: Automated code quality checks with `Husky` and `lint-staged`.
- **Linting**: Consistent code style with ESLint and `eslint-config-love` rules.
- **EditorConfig**: Consistent coding styles across different editors and IDEs.
- **Modular Code**: Maintainable structure for easy scalability.

## Scripts
Blazex provides a set of predefined scripts to streamline your development workflow.

Build the Project
```bash
npm run build
```

Start the Application
```bash
npm start
```

Run in Development Mode
```bash
npm run dev
```

Lint the Codebase
```bash
npm run lint
```

Fix Linting Errors
```bash
npm run lint:fix
```

## Project Structure

The project structure ensures that the codebase is well-organized, making it easy to maintain and scale. Each directory serves a specific purpose, contributing to a modular and efficient development workflow.

```
src
├── configs          # Configuration files for the application
├── controllers      # Controller functions for handling API requests
├── databases        # Database connection and management
├── middlewares      # Middleware functions for request processing
├── models           # Data models for the application
├── remotes          # Remote services and integrations
├── routes           # API route definitions
├── services         # Business logic and service functions
├── utils            # Utility functions and helpers
├── validations      # Request validation schemas
├── app.ts           # Entry point for the Express application
├── index.ts         # Main entry point for the application, initializing the server and connecting to the database
```

## Configuration

The project configuration is stored in the `configs` directory, allowing you to manage environment-specific settings and configurations. The files are structured to provide a clear separation of concerns and easy access to configuration variables.

- `config.ts` - Base configuration file with default settings.
- `logger.ts` - Configuration for the Winston logger.
- `mongo.ts` - Configuration for the MongoDB connection.

## Databases

The `databases` directory contains the database connection and management logic. The `mongo.database.ts` file exports a function that connects to the MongoDB database using the Mongoose ORM. The connection string is read from the environment variables defined in the `.env` file. And a function to close the database connection.

## Middlewares

The `middlewares` directory contains custom middleware and handler functions that process incoming requests before they reach the route handlers.

- `validate.middleware.ts` - Middleware for request validation using Zod schemas.
- `mongo-sanitize.middleware.ts` - Middleware to sanitize user input and prevent NoSQL injection attacks.
- `error.handler.ts` - Error handling handler to catch and process errors in the request pipeline.
- `metrics.middleware.ts` - Middleware for collecting request metrics using Prometheus. Additionally, it provides a handler for `/metrics` endpoint to expose the collected metrics.
- `morgan.middleware.ts` - Middleware for request logging using Morgan.
- `healthcheck.handler.ts` - Handler for the `/healthcheck` endpoint to verify the health of the application.
- `not-found.handler.ts` - Handler for handling requests to non-existent routes.

## Validations

The `validations` directory contains Zod schemas for request validation. Each schema defines the shape of the request body, query parameters, or URL parameters, ensuring that the data is correctly formatted and sanitized before processing.

## Routes

The `routes` directory contains the route definitions for the API endpoints. It contains directories for different versions of the API, each with its own set of routes
defined in separate files for better organization and maintainability and a `index.ts` file to exports all the routes.

## Remotes

The `remotes` directory contains the logic for integrating with external services or APIs. Each file in this directory represents a remote service or integration, encapsulating the communication logic and providing a clean interface for interacting with external systems.

## Models

The `models` directory contains the data models for the application. Each file represents a data entity or resource and defines the schema for storing and retrieving data from the database using Mongoose. Each file exports a Mongoose model that can be used to interact with the corresponding collection in the database and TypeScript interfaces for type checking. Additionally, the `index.ts` file exports all the models for easy access.

## Services

The `services` directory contains the business logic and service functions for the application. Each file represents a specific domain or feature and encapsulates the logic for processing interactions with the database, external services, or other components. The services are designed to be modular and reusable, where each function performs a single specific task or operation and they can throw custom errors
defined in the `utils/errors.util.ts` file. This service layer helps keep the controllers lean and focused on handling the request-response cycle. The `index.ts` file exports all the services for easy access.

## Controllers

The `controllers` directory contains the controller functions for handling API requests. Each file represents a specific resource or feature and defines the request handlers for the corresponding routes. The controller functions are responsible for processing the incoming requests, orchestrating various services, and sending the response back to the client.
Each controller function can also throw custom errors defined in the `utils/errors.util.ts` file. The controllers are designed to be lightweight and focused on handling the request-response cycle, delegating the business logic to the service layer. The `index.ts` file exports all the controllers for easy access.

## Utils

The `utils` directory contains utility functions and helper modules that provide common functionality used throughout the application. These functions are designed to be reusable and modular, providing a clean interface for performing common tasks such as error handling, logging, data manipulation, and more.

- `errors.util.ts` - Custom error classes for consistent error handling and response formatting.
- `api-response.ts` - Exports Class for consistent API response formatting.
- `normalizer.ts` - Functions for normalizing paths and status codes for metrics collection.
- `async-handler.ts` - Utility function for handling all controller functions asynchronously.

## Error Handling

Blazex provides a centralized error handling mechanism that catches and processes errors in the request pipeline. The `error.handler.ts` middleware is responsible for catching errors thrown by the route handlers, services, or other middleware functions and formatting the response according to the `RFC 9457` standard. So we are supposed to throw errors from the services and controllers with the custom error classes defined in the `utils/errors.util.ts` file. The error handler middleware ensures that the error response is consistent and informative, providing details about the error type, message, and status code. Additionally, it logs the error details using the Winston logger for debugging and monitoring purposes.

## Logging

Blazex uses the Winston logger for detailed logging of application events, errors, and requests. The logger configuration is defined in the `configs/logger.ts` file, where you can customize the log levels, formats, transports, and other settings. The logger middleware `morgan.middleware.ts` is responsible for logging incoming requests, including the request method, URL, status code, response time, and other relevant details. The logger middleware ensures that all requests are logged consistently and provides valuable insights into the application's performance and behavior.

## Metrics Collection

Blazex includes support for collecting request metrics using Prometheus and Grafana. The `metrics.middleware.ts` middleware is responsible for collecting metrics such as request duration, response size, and status codes. It uses the `prom-client` library to expose the metrics on the `/metrics` endpoint, which can be scraped by Prometheus for monitoring and alerting. The metrics middleware helps you monitor the performance of your API and identify potential bottlenecks or issues.

## Docker Support

Blazex provides Docker support with multi-stage builds for easy containerization and deployment. The `Dockerfile` defines the build process for the application, including installing dependencies, building the TypeScript code, and running the application. Docker support enables you to package your application into a lightweight and portable container, making it easy to deploy and scale in any environment.

## API Documentation

Checkout: [API Documentation](https://www.apidog.com/apidoc/shared-68ed5ff8-e1f6-4d49-a156-e47c264488f3)


## Authors

- [@deepakgohil9](https://github.com/deepakgohil9)

## License

[MIT](https://github.com/deepakgohil9/blazex/blob/main/LICENSE)
