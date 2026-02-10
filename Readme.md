# Sales Leaderboard Backend

A Node.js + MongoDB backend system that records sales data and generates a ranked sales leaderboard.

## Features

- JWT-based authentication
- Secure agent assignment
- Aggregated leaderboard using MongoDB pipeline
- Tie-aware ranking logic
- Scalable & real-world design

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication

## API Endpoints

### Create Sale (Agent only)

POST /api/sales  
Authorization: Bearer <token>

Body:
{
"amountSold": 200000
}

### Get Leaderboard

GET /api/leaderboard

## Ranking Logic

Agents are ranked by total sales amount in descending order.
Agents with equal sales share the same rank.

## Deployment
