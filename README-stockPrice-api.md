# Stock Price API Documentation

This document provides details about the Stock Price API endpoints, their parameters, and response formats.

## Base URL

All endpoints are prefixed with: `/api/v1/stock-prices`

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### 1. Get Stock Prices by Symbol

Returns stock prices for a specific symbol with optional date filtering and pagination.

**URL**: `/symbol/:symbol`  
**Method**: `GET`  
**Auth required**: Yes  
**Permissions required**: None  

**URL Parameters**:  
- `symbol`: The stock symbol (required)

**Query Parameters**:  
- `startDate`: ISO date format (optional)
- `endDate`: ISO date format (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 100, max: 100)
- `sortDirection`: Sort direction ('asc' or 'desc', default: 'desc')

**Success Response**:
```json
{
  "success": true,
  "message": "Stock prices retrieved successfully",
  "data": {
    "stockPrices": [
      {
        "id": "uuid",
        "symbol": "AAPL",
        "date": "2023-05-20T00:00:00.000Z",
        "open": 175.5,
        "high": 178.2,
        "low": 174.8,
        "close": 177.3,
        "volume": 32503400,
        "trendQ": 0.75,
        "fq": 0.85,
        "bandDown": 174.0,
        "bandUp": 180.0,
        "createdAt": "2023-05-21T08:30:45.123Z",
        "updatedAt": "2023-05-21T08:30:45.123Z"
      },
      // More stock prices...
    ],
    "total": 150,
    "page": 1,
    "limit": 100,
    "totalPages": 2
  }
}
```

### 2. Get All Stock Prices

Returns all stock prices with optional filtering by date range, symbol, and pagination.

**URL**: `/`  
**Method**: `GET`  
**Auth required**: Yes  
**Permissions required**: None  

**Query Parameters**:  
- `symbol`: Filter by symbol (partial match, optional)
- `startDate`: ISO date format (optional)
- `endDate`: ISO date format (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 100, max: 100)
- `sortDirection`: Sort direction ('asc' or 'desc', default: 'desc')

**Success Response**: Same format as Get Stock Prices by Symbol.

### 3. Get Stock Price by ID

Returns a single stock price by its ID.

**URL**: `/:id`  
**Method**: `GET`  
**Auth required**: Yes  
**Permissions required**: None  

**URL Parameters**:  
- `id`: Stock price UUID (required)

**Success Response**:
```json
{
  "success": true,
  "message": "Stock price retrieved successfully",
  "data": {
    "id": "uuid",
    "symbol": "AAPL",
    "date": "2023-05-20T00:00:00.000Z",
    "open": 175.5,
    "high": 178.2,
    "low": 174.8,
    "close": 177.3,
    "volume": 32503400,
    "trendQ": 0.75,
    "fq": 0.85,
    "bandDown": 174.0,
    "bandUp": 180.0,
    "createdAt": "2023-05-21T08:30:45.123Z",
    "updatedAt": "2023-05-21T08:30:45.123Z"
  }
}
```

### 4. Create Stock Price

Creates a new stock price.

**URL**: `/`  
**Method**: `POST`  
**Auth required**: Yes  
**Permissions required**: Admin role  

**Request Body**:
```json
{
  "symbol": "AAPL",
  "date": "2023-05-20T00:00:00.000Z",
  "open": 175.5,
  "high": 178.2,
  "low": 174.8,
  "close": 177.3,
  "volume": 32503400,
  "trendQ": 0.75,
  "fq": 0.85,
  "bandDown": 174.0,
  "bandUp": 180.0
}
```

**Required fields**: `symbol`, `date`, `open`, `high`, `low`, `close`  
**Optional fields**: `volume`, `trendQ`, `fq`, `bandDown`, `bandUp`

**Success Response**:
```json
{
  "success": true,
  "message": "Stock price created successfully",
  "data": {
    "id": "uuid",
    "symbol": "AAPL",
    "date": "2023-05-20T00:00:00.000Z",
    "open": 175.5,
    "high": 178.2,
    "low": 174.8,
    "close": 177.3,
    "volume": 32503400,
    "trendQ": 0.75,
    "fq": 0.85,
    "bandDown": 174.0,
    "bandUp": 180.0,
    "createdAt": "2023-05-21T08:30:45.123Z",
    "updatedAt": "2023-05-21T08:30:45.123Z"
  }
}
```

### 5. Update Stock Price

Updates an existing stock price.

**URL**: `/:id`  
**Method**: `PUT`  
**Auth required**: Yes  
**Permissions required**: Admin role  

**URL Parameters**:  
- `id`: Stock price UUID (required)

**Request Body**:
```json
{
  "open": 176.0,
  "high": 179.0,
  "low": 175.0,
  "close": 178.0,
  "volume": 32600000,
  "trendQ": 0.8,
  "fq": 0.9,
  "bandDown": 175.0,
  "bandUp": 181.0
}
```

**Note**: All fields are optional, but at least one must be provided.

**Success Response**:
```json
{
  "success": true,
  "message": "Stock price updated successfully",
  "data": {
    "id": "uuid",
    "symbol": "AAPL",
    "date": "2023-05-20T00:00:00.000Z",
    "open": 176.0,
    "high": 179.0,
    "low": 175.0,
    "close": 178.0,
    "volume": 32600000,
    "trendQ": 0.8,
    "fq": 0.9,
    "bandDown": 175.0,
    "bandUp": 181.0,
    "createdAt": "2023-05-21T08:30:45.123Z",
    "updatedAt": "2023-05-21T10:15:30.456Z"
  }
}
```

### 6. Delete Stock Price

Deletes a stock price.

**URL**: `/:id`  
**Method**: `DELETE`  
**Auth required**: Yes  
**Permissions required**: Admin role  

**URL Parameters**:  
- `id`: Stock price UUID (required)

**Success Response**:
```json
{
  "success": true,
  "message": "Stock price deleted successfully",
  "data": null
}
```

### 7. Bulk Upsert Stock Prices

Creates or updates multiple stock prices in a single request.

**URL**: `/bulk`  
**Method**: `POST`  
**Auth required**: Yes  
**Permissions required**: Admin role  

**Request Body**:
```json
[
  {
    "symbol": "AAPL",
    "date": "2023-05-20T00:00:00.000Z",
    "open": 175.5,
    "high": 178.2,
    "low": 174.8,
    "close": 177.3,
    "volume": 32503400,
    "trendQ": 0.75,
    "fq": 0.85,
    "bandDown": 174.0,
    "bandUp": 180.0
  },
  {
    "symbol": "AAPL",
    "date": "2023-05-21T00:00:00.000Z",
    "open": 177.0,
    "high": 180.5,
    "low": 176.3,
    "close": 179.8,
    "volume": 29450600,
    "trendQ": 0.78,
    "fq": 0.88,
    "bandDown": 175.0,
    "bandUp": 182.0
  }
  // More stock prices...
]
```

**Required fields for each item**: `symbol`, `date`, `open`, `high`, `low`, `close`  
**Optional fields for each item**: `volume`, `trendQ`, `fq`, `bandDown`, `bandUp`

**Success Response**:
```json
{
  "success": true,
  "message": "Bulk upsert completed successfully",
  "data": {
    "count": 2
  }
}
```

**Note**: For large batches (>10,000 items), this will return a job ID. You can check the job status using the Get Job Status endpoint.

### 8. Upload Stock Prices CSV/Excel

Uploads stock prices from a CSV or Excel file.

**URL**: `/upload`  
**Method**: `POST`  
**Auth required**: Yes  
**Permissions required**: Admin role  
**Content-Type**: `multipart/form-data`

**Form Data**:
- `file`: CSV or Excel file (required)
- `symbol`: Stock symbol (optional, will be auto-detected if not provided)

**Success Response**:
```json
{
  "success": true,
  "message": "CSV file upload accepted. Processing will be done in the background. You can check the progress with the job ID.",
  "data": {
    "jobId": "sp-file-job-1684652345678-123",
    "symbol": "AAPL",
    "fileName": "aapl_prices_2023.csv",
    "fileType": "CSV",
    "status": "queued",
    "progress": 0
  }
}
```

### 9. Get Job Status

Checks the status of a background job.

**URL**: `/job/:jobId`  
**Method**: `GET`  
**Auth required**: Yes  
**Permissions required**: Admin role  

**URL Parameters**:  
- `jobId`: Job ID (required)

**Success Response**:
```json
{
  "success": true,
  "message": "Job status retrieved successfully",
  "data": {
    "status": "completed",
    "progress": 100,
    "totalRecords": 1250,
    "processedRecords": 1250,
    "message": "Processed 1250 records successfully",
    "symbol": "AAPL",
    "fileName": "aapl_prices_2023.csv"
  }
}
```

**Possible status values**: `pending`, `processing`, `completed`, `failed`

## Error Responses

All endpoints use standard HTTP status codes:

- `400 Bad Request`: Invalid input data or parameters
- `401 Unauthorized`: Authentication token missing or invalid
- `403 Forbidden`: User lacks necessary permissions (e.g., non-admin for admin-only endpoints)
- `404 Not Found`: Requested resource not found
- `500 Internal Server Error`: Server-side error

Error Response Format:
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional details about the error (if available)"
  }
}
```

## CSV/Excel Upload Format

When uploading stock price data via CSV or Excel, the file should have the following columns:

| Column Name | Required | Description |
|-------------|----------|-------------|
| symbol      | Yes      | Stock symbol |
| date        | Yes      | Date in ISO format (YYYY-MM-DD) |
| open        | Yes      | Opening price |
| high        | Yes      | Highest price |
| low         | Yes      | Lowest price |
| close       | Yes      | Closing price |
| volume      | No       | Trading volume |
| trendQ      | No       | Trend quality indicator |
| fq          | No       | Financial quality indicator |
| bandDown    | No       | Lower price band |
| bandUp      | No       | Upper price band |

Example CSV:
```
symbol,date,open,high,low,close,volume,trendQ,fq,bandDown,bandUp
AAPL,2023-05-20,175.5,178.2,174.8,177.3,32503400,0.75,0.85,174.0,180.0
AAPL,2023-05-21,177.0,180.5,176.3,179.8,29450600,0.78,0.88,175.0,182.0
```

**Note**: If the symbol column is absent or you want to override it, you can provide a symbol in the upload request. 