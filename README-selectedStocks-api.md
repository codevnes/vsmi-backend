# Selected Stocks API Documentation

This document provides details on the Selected Stocks API endpoints available in the VSMI V2 backend.

## Base URL

```
/api/v1/selected-stocks
```

## Endpoints

### Get Selected Stocks List

Retrieves a list of selected stocks with pagination and filtering options.

**URL:** `GET /api/v1/selected-stocks`

**Access:** Public

**Query Parameters:**
- `symbol` (optional): Filter by stock symbol
- `startDate` (optional): Filter entries after this date (ISO format)
- `endDate` (optional): Filter entries before this date (ISO format)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: all)
- `sortDirection` (optional): Sort direction for date field ('asc' or 'desc', default: 'desc')

**Response Example:**
```json
{
  "success": true,
  "message": "Selected stocks retrieved successfully",
  "data": {
    "selectedStocks": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "symbol": "VNM",
        "date": "2025-04-28T00:00:00.000Z",
        "close": 13300,
        "return": 0.06604,
        "qIndex": 1.70884,
        "volume": 28110600,
        "createdAt": "2025-04-30T08:45:45.123Z",
        "updatedAt": "2025-04-30T08:45:45.123Z",
        "stock": {
          "name": "Vinamilk",
          "exchange": "HOSE",
          "industry": "Consumer Goods"
        }
      },
      // More entries...
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Get Selected Stocks by Symbol

Retrieves selected stocks entries for a specific symbol with pagination and date filtering.

**URL:** `GET /api/v1/selected-stocks/symbol/:symbol`

**Access:** Public

**URL Parameters:**
- `symbol`: Stock symbol (e.g., VNM)

**Query Parameters:**
- `startDate` (optional): Filter entries after this date (ISO format)
- `endDate` (optional): Filter entries before this date (ISO format)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: all)
- `sortDirection` (optional): Sort direction for date field ('asc' or 'desc', default: 'desc')

**Response Example:**
```json
{
  "success": true,
  "message": "Selected stocks retrieved successfully",
  "data": {
    "selectedStocks": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "symbol": "VNM",
        "date": "2025-04-28T00:00:00.000Z",
        "close": 13300,
        "return": 0.06604,
        "qIndex": 1.70884,
        "volume": 28110600,
        "createdAt": "2025-04-30T08:45:45.123Z",
        "updatedAt": "2025-04-30T08:45:45.123Z",
        "stock": {
          "name": "Vinamilk",
          "exchange": "HOSE",
          "industry": "Consumer Goods"
        }
      },
      // More entries...
    ],
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Get Selected Stocks by ID

Retrieves a specific selected stocks entry by its ID.

**URL:** `GET /api/v1/selected-stocks/:id`

**Access:** Private (Authentication required)

**URL Parameters:**
- `id`: The UUID of the selected stocks entry

**Response Example:**
```json
{
  "success": true,
  "message": "Selected stocks retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "symbol": "VNM",
    "date": "2025-04-28T00:00:00.000Z",
    "close": 13300,
    "return": 0.06604,
    "qIndex": 1.70884,
    "volume": 28110600,
    "createdAt": "2025-04-30T08:45:45.123Z",
    "updatedAt": "2025-04-30T08:45:45.123Z"
  }
}
```

### Create Selected Stocks Entry

Creates a new selected stocks entry.

**URL:** `POST /api/v1/selected-stocks`

**Access:** Private (Admin only)

**Request Body:**
```json
{
  "symbol": "VNM",
  "date": "2025-04-28",
  "close": 13300,
  "return": 0.06604,
  "qIndex": 1.70884,
  "volume": 28110600
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Selected stocks created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "symbol": "VNM",
    "date": "2025-04-28T00:00:00.000Z",
    "close": 13300,
    "return": 0.06604,
    "qIndex": 1.70884,
    "volume": 28110600,
    "createdAt": "2025-04-30T08:45:45.123Z",
    "updatedAt": "2025-04-30T08:45:45.123Z"
  }
}
```

### Update Selected Stocks Entry

Updates an existing selected stocks entry.

**URL:** `PUT /api/v1/selected-stocks/:id`

**Access:** Private (Admin only)

**URL Parameters:**
- `id`: The UUID of the selected stocks entry to update

**Request Body:**
```json
{
  "close": 13400,
  "return": 0.07,
  "qIndex": 1.8,
  "volume": 29000000
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Selected stocks updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "symbol": "VNM",
    "date": "2025-04-28T00:00:00.000Z",
    "close": 13400,
    "return": 0.07,
    "qIndex": 1.8,
    "volume": 29000000,
    "createdAt": "2025-04-30T08:45:45.123Z",
    "updatedAt": "2025-04-30T08:46:12.456Z"
  }
}
```

### Delete Selected Stocks Entry

Deletes a selected stocks entry.

**URL:** `DELETE /api/v1/selected-stocks/:id`

**Access:** Private (Admin only)

**URL Parameters:**
- `id`: The UUID of the selected stocks entry to delete

**Response Example:**
```json
{
  "success": true,
  "message": "Selected stocks deleted successfully",
  "data": null
}
```

### Bulk Upsert Selected Stocks

Bulk inserts or updates multiple selected stocks entries.

**URL:** `POST /api/v1/selected-stocks/bulk`

**Access:** Private (Admin only)

**Request Body:**
```json
[
  {
    "symbol": "VNM",
    "date": "2025-04-28",
    "close": 13300,
    "return": 0.06604,
    "qIndex": 1.70884,
    "volume": 28110600
  },
  {
    "symbol": "FPT",
    "date": "2025-04-28",
    "close": 85600,
    "return": 0.04521,
    "qIndex": 1.52361,
    "volume": 12356700
  }
]
```

**Response Example:**
```json
{
  "success": true,
  "message": "Successfully processed 2 selected stocks entries",
  "data": {
    "count": 2
  }
}
```

## Error Responses

### Invalid Input

**Status Code:** 400 Bad Request

**Response Example:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "symbol",
      "message": "Symbol is required"
    }
  ]
}
```

### Not Found

**Status Code:** 404 Not Found

**Response Example:**
```json
{
  "success": false,
  "message": "Selected stocks not found"
}
```

### Unauthorized

**Status Code:** 401 Unauthorized

**Response Example:**
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

### Forbidden

**Status Code:** 403 Forbidden

**Response Example:**
```json
{
  "success": false,
  "message": "Not authorized"
}
``` 