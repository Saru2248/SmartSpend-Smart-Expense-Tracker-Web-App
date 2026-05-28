# SmartSpend System Architecture Reference

This document outlines the detailed system flows and schema relationships of the SmartSpend Expense Tracker Web App.

## 1. Authentication and Authorization Flow
1. **User Sign Up / Login**: User submits registration or login credentials.
2. **Server Verification**: The backend validates fields, compares passwords using `bcrypt.compare`, and signs a JWT containing the user's document ID.
3. **Session Storage**: The client receives the JWT and user profile data, saving the token to `localStorage`.
4. **API Requests**: Subsequent requests to protected endpoints (e.g., `/api/transactions`) inject the JWT into the request header as a Bearer Token:
   `Authorization: Bearer <JWT_TOKEN>`
5. **Authorization Check**: The backend `protect` middleware decodes the token, verifies the signature, and mounts the user document to `req.user`, allowing the request to proceed to the controller.

## 2. Entity-Relationship (ER) Schema Outline

```
┌──────────────┐             1 : N             ┌─────────────────────┐
│    USER      ├──────────────────────────────►│    TRANSACTION      │
├──────────────┤                               ├─────────────────────┤
│  _id (PK)    │                               │  _id (PK)           │
│  username    │                               │  user (FK)          │
│  email (UQ)  │                               │  type (enum)        │
│  password    │                               │  amount             │
│  createdAt   │                               │  category           │
└──────┬───────┘                               │  date               │
       │                                       │  description        │
       │ 1 : N                                 │  createdAt          │
       ▼                                       └─────────────────────┘
┌──────────────┐
│    BUDGET    │
├──────────────┤
│  _id (PK)    │
│  user (FK)   │
│  category    │
│  limit       │
│  month       │
│  createdAt   │
└──────────────┘
```

## 3. Core Data Processing Flow for Dashboard

```
                  ┌─────────────────────────────┐
                  │ Client requests /summary    │
                  └──────────────┬──────────────┘
                                 │
                                 ▼
                  ┌─────────────────────────────┐
                  │ Fetch User's Transactions   │
                  └──────────────┬──────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  ▼                             ▼
       ┌─────────────────────┐       ┌─────────────────────┐
       │ Compute Balance &   │       │ Group By Category   │
       │ Totals (Income/Exp) │       │ & Month for Charts  │
       └──────────┬──────────┘       └──────────┬──────────┘
                  │                             │
                  └──────────────┬──────────────┘
                                 ▼
                  ┌─────────────────────────────┐
                  │ Return JSON response packet │
                  └─────────────────────────────┘
```
