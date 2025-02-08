# README.md

## About

This repository contains a Node.js application that connects to a MongoDB database and provides an API endpoint to perform vector-based searches on a collection of movies. The application uses Express.js for handling HTTP requests and MongoDB's aggregation framework to execute complex queries. The primary functionality is to search for movies based on plot embeddings and return a list of movies that match the search criteria.

## Features

- **MongoDB Connection**: Establishes a connection to a MongoDB database using credentials from environment variables.
- **Express Server**: Sets up an Express server to handle HTTP requests.
- **Vector Search Endpoint**: Provides an endpoint `/find` to perform vector-based searches on movie plots.
- **Error Handling**: Implements error handling and logging for better debugging and maintenance.
- **Graceful Shutdown**: Ensures the application shuts down gracefully, closing the MongoDB connection and the server.

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```bash
    cd node-empty-proj
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file with your MongoDB credentials:
    ```plaintext
    MONGO_USERNAME=<your-username>
    MONGO_PASSWORD=<your-password>
    MONGO_CLUSTER=<your-cluster>
    ```

## Usage

1. Start the application:
    ```bash
    npm start
    ```
2. The server will run on port 3000. You can perform a vector search by sending a POST request to `http://localhost:3000/find` with the following JSON body:
    ```json
    {
        "plot": [/* array of numbers representing the plot embedding */],
        "candidates": 1536 /*optional*/
    }
    ```

## Endpoint

- **`/find`**: Performs a vector search on the movie collection.
    - **Method**: GET
    - **Request Body**:
        - `plot`: Array of numbers representing the plot embedding.
        - `candidates`: Number of candidate results to consider (default is 1536).
    - **Response**:
        - `status`: "ok"
        - `data`: Array of movie documents matching the search criteria.

## Error Handling

The application includes middleware to handle errors and log them using a custom logger. If an error occurs, a 500 status code is returned with a message to check the logs for more details.

## Logging

The application uses a custom logger to log important events and errors. Logs include error messages and stack traces for easier debugging.

## Graceful Shutdown

The application listens for the `SIGINT` signal to gracefully shut down the server and close the MongoDB connection, ensuring no resources are left open.

---

# GitHub Short Description

Node.js application with an Express server that connects to MongoDB and provides an API endpoint for vector-based movie searches using plot embeddings.
