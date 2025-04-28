# Tài liệu API Financial Metrics

API Financial Metrics cung cấp khả năng truy cập và quản lý dữ liệu chỉ số tài chính của các mã cổ phiếu. API này cho phép bạn truy vấn, tạo mới, cập nhật và xóa các bản ghi chỉ số tài chính.

## Base URL

```
/api/v1/financial-metrics
```

## Xác thực

Tất cả các endpoint yêu cầu xác thực bằng JWT token. Token phải được gửi trong header Authorization dưới dạng Bearer token.

```
Authorization: Bearer <your_token>
```

## Các Endpoint

### 1. Lấy danh sách chỉ số tài chính

Trả về danh sách các chỉ số tài chính với phân trang và lọc tùy chọn.

**Endpoint**: `GET /api/v1/financial-metrics`

**Quyền truy cập**: Yêu cầu xác thực

**Tham số truy vấn**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả |
|---------|------------|----------|------|
| page | Integer | Không | Số trang, mặc định là 1 |
| limit | Integer | Không | Số lượng bản ghi trên mỗi trang, mặc định là 20, tối đa là 100 |
| symbol | String | Không | Lọc theo mã cổ phiếu |
| year | Integer | Không | Lọc theo năm |
| quarter | Integer | Không | Lọc theo quý (1-4) |

**Phản hồi thành công**:

```json
{
  "success": true,
  "message": "Financial metrics retrieved successfully",
  "data": {
    "records": [
      {
        "id": "uuid",
        "symbol": "VNM",
        "year": 2023,
        "quarter": 4,
        "eps": 1500,
        "epsIndustry": 1200,
        "pe": 15.2,
        "peIndustry": 16.5,
        "roa": 12.3,
        "roe": 18.7,
        "roaIndustry": 10.2,
        "roeIndustry": 15.8,
        "revenue": 15000000000,
        "margin": 25.5,
        "totalDebtToEquity": 0.45,
        "totalAssetsToEquity": 1.8,
        "createdAt": "2023-01-15T00:00:00.000Z",
        "updatedAt": "2023-01-15T00:00:00.000Z",
        "stock": {
          "name": "Công ty Cổ phần Sữa Việt Nam",
          "exchange": "HOSE",
          "industry": "Thực phẩm & Đồ uống"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### 2. Lấy chỉ số tài chính theo ID

Trả về một bản ghi chỉ số tài chính cụ thể theo ID.

**Endpoint**: `GET /api/v1/financial-metrics/:id`

**Quyền truy cập**: Yêu cầu xác thực

**Tham số đường dẫn**:

| Tham số | Kiểu dữ liệu | Mô tả |
|---------|------------|------|
| id | UUID | ID của bản ghi chỉ số tài chính |

**Phản hồi thành công**:

```json
{
  "success": true,
  "message": "Financial metrics retrieved successfully",
  "data": {
    "id": "uuid",
    "symbol": "VNM",
    "year": 2023,
    "quarter": 4,
    "eps": 1500,
    "epsIndustry": 1200,
    "pe": 15.2,
    "peIndustry": 16.5,
    "roa": 12.3,
    "roe": 18.7,
    "roaIndustry": 10.2,
    "roeIndustry": 15.8,
    "revenue": 15000000000,
    "margin": 25.5,
    "totalDebtToEquity": 0.45,
    "totalAssetsToEquity": 1.8,
    "createdAt": "2023-01-15T00:00:00.000Z",
    "updatedAt": "2023-01-15T00:00:00.000Z",
    "stock": {
      "name": "Công ty Cổ phần Sữa Việt Nam",
      "exchange": "HOSE",
      "industry": "Thực phẩm & Đồ uống"
    }
  }
}
```

### 3. Lấy chỉ số tài chính theo mã cổ phiếu

Trả về danh sách chỉ số tài chính cho một mã cổ phiếu cụ thể.

**Endpoint**: `GET /api/v1/financial-metrics/stock/:symbol`

**Quyền truy cập**: Yêu cầu xác thực

**Tham số đường dẫn**:

| Tham số | Kiểu dữ liệu | Mô tả |
|---------|------------|------|
| symbol | String | Mã cổ phiếu |

**Tham số truy vấn**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả |
|---------|------------|----------|------|
| page | Integer | Không | Số trang, mặc định là 1 |
| limit | Integer | Không | Số lượng bản ghi trên mỗi trang, mặc định là 20, tối đa là 100 |
| year | Integer | Không | Lọc theo năm |
| quarter | Integer | Không | Lọc theo quý (1-4) |

**Phản hồi thành công**:

```json
{
  "success": true,
  "message": "Financial metrics retrieved successfully",
  "data": {
    "symbol": "VNM",
    "stockName": "Công ty Cổ phần Sữa Việt Nam",
    "records": [
      {
        "id": "uuid",
        "symbol": "VNM",
        "year": 2023,
        "quarter": 4,
        "eps": 1500,
        "epsIndustry": 1200,
        "pe": 15.2,
        "peIndustry": 16.5,
        "roa": 12.3,
        "roe": 18.7,
        "roaIndustry": 10.2,
        "roeIndustry": 15.8,
        "revenue": 15000000000,
        "margin": 25.5,
        "totalDebtToEquity": 0.45,
        "totalAssetsToEquity": 1.8,
        "createdAt": "2023-01-15T00:00:00.000Z",
        "updatedAt": "2023-01-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 8,
      "pages": 1
    }
  }
}
```

### 4. Tạo mới chỉ số tài chính

Tạo một bản ghi chỉ số tài chính mới.

**Endpoint**: `POST /api/v1/financial-metrics`

**Quyền truy cập**: Yêu cầu xác thực và quyền ADMIN

**Body**:

```json
{
  "symbol": "VNM",
  "year": 2023,
  "quarter": 4,
  "eps": 1500,
  "epsIndustry": 1200,
  "pe": 15.2,
  "peIndustry": 16.5,
  "roa": 12.3,
  "roe": 18.7,
  "roaIndustry": 10.2,
  "roeIndustry": 15.8,
  "revenue": 15000000000,
  "margin": 25.5,
  "totalDebtToEquity": 0.45,
  "totalAssetsToEquity": 1.8
}
```

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
|---------|------------|----------|------|
| symbol | String | Có | Mã cổ phiếu |
| year | Integer | Có | Năm của dữ liệu |
| quarter | Integer | Không | Quý (1-4), có thể null nếu là dữ liệu năm |
| eps | Float | Không | Lợi nhuận trên một cổ phiếu |
| epsIndustry | Float | Không | Lợi nhuận trên một cổ phiếu trung bình ngành |
| pe | Float | Không | Tỷ lệ giá trên lợi nhuận |
| peIndustry | Float | Không | Tỷ lệ giá trên lợi nhuận trung bình ngành |
| roa | Float | Không | Tỷ suất lợi nhuận trên tổng tài sản |
| roe | Float | Không | Tỷ suất lợi nhuận trên vốn chủ sở hữu |
| roaIndustry | Float | Không | ROA trung bình ngành |
| roeIndustry | Float | Không | ROE trung bình ngành |
| revenue | Float | Không | Doanh thu |
| margin | Float | Không | Biên lợi nhuận |
| totalDebtToEquity | Float | Không | Tỷ lệ nợ trên vốn chủ sở hữu |
| totalAssetsToEquity | Float | Không | Tỷ lệ tổng tài sản trên vốn chủ sở hữu |

**Phản hồi thành công**:

```json
{
  "success": true,
  "message": "Financial metrics created successfully",
  "data": {
    "id": "uuid",
    "symbol": "VNM",
    "year": 2023,
    "quarter": 4,
    "eps": 1500,
    "epsIndustry": 1200,
    "pe": 15.2,
    "peIndustry": 16.5,
    "roa": 12.3,
    "roe": 18.7,
    "roaIndustry": 10.2,
    "roeIndustry": 15.8,
    "revenue": 15000000000,
    "margin": 25.5,
    "totalDebtToEquity": 0.45,
    "totalAssetsToEquity": 1.8,
    "createdAt": "2023-01-15T00:00:00.000Z",
    "updatedAt": "2023-01-15T00:00:00.000Z",
    "stock": {
      "name": "Công ty Cổ phần Sữa Việt Nam",
      "exchange": "HOSE",
      "industry": "Thực phẩm & Đồ uống"
    }
  }
}
```

### 5. Cập nhật chỉ số tài chính

Cập nhật một bản ghi chỉ số tài chính hiện có.

**Endpoint**: `PUT /api/v1/financial-metrics/:id`

**Quyền truy cập**: Yêu cầu xác thực và quyền ADMIN

**Tham số đường dẫn**:

| Tham số | Kiểu dữ liệu | Mô tả |
|---------|------------|------|
| id | UUID | ID của bản ghi chỉ số tài chính |

**Body** (tất cả các trường đều là tùy chọn):

```json
{
  "eps": 1550,
  "epsIndustry": 1250,
  "pe": 15.5,
  "peIndustry": 16.8,
  "roa": 12.5,
  "roe": 19.0,
  "roaIndustry": 10.5,
  "roeIndustry": 16.0,
  "revenue": 15500000000,
  "margin": 26.0,
  "totalDebtToEquity": 0.48,
  "totalAssetsToEquity": 1.85
}
```

**Phản hồi thành công**:

```json
{
  "success": true,
  "message": "Financial metrics updated successfully",
  "data": {
    "id": "uuid",
    "symbol": "VNM",
    "year": 2023,
    "quarter": 4,
    "eps": 1550,
    "epsIndustry": 1250,
    "pe": 15.5,
    "peIndustry": 16.8,
    "roa": 12.5,
    "roe": 19.0,
    "roaIndustry": 10.5,
    "roeIndustry": 16.0,
    "revenue": 15500000000,
    "margin": 26.0,
    "totalDebtToEquity": 0.48,
    "totalAssetsToEquity": 1.85,
    "createdAt": "2023-01-15T00:00:00.000Z",
    "updatedAt": "2023-01-15T00:00:00.000Z",
    "stock": {
      "name": "Công ty Cổ phần Sữa Việt Nam",
      "exchange": "HOSE",
      "industry": "Thực phẩm & Đồ uống"
    }
  }
}
```

### 6. Xóa chỉ số tài chính

Xóa một bản ghi chỉ số tài chính.

**Endpoint**: `DELETE /api/v1/financial-metrics/:id`

**Quyền truy cập**: Yêu cầu xác thực và quyền ADMIN

**Tham số đường dẫn**:

| Tham số | Kiểu dữ liệu | Mô tả |
|---------|------------|------|
| id | UUID | ID của bản ghi chỉ số tài chính |

**Phản hồi thành công**:

```json
{
  "success": true,
  "message": "Financial metrics deleted successfully",
  "data": {
    "id": "uuid"
  }
}
```

### 7. Nhập dữ liệu chỉ số tài chính từ file

Nhập dữ liệu chỉ số tài chính từ file CSV hoặc Excel.

**Endpoint**: `POST /api/v1/financial-metrics/import`

**Quyền truy cập**: Yêu cầu xác thực và quyền ADMIN

**Content-Type**: `multipart/form-data`

**Body**:

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
|---------|------------|----------|------|
| file | File | Có | File CSV hoặc Excel (.csv, .xlsx) |

**Cấu trúc file**:
File phải có các cột sau (tên cột phải chính xác):
- symbol
- year
- quarter (có thể để trống)
- eps (có thể để trống)
- epsIndustry (có thể để trống)
- pe (có thể để trống)
- peIndustry (có thể để trống)
- roa (có thể để trống)
- roe (có thể để trống)
- roaIndustry (có thể để trống)
- roeIndustry (có thể để trống)
- revenue (có thể để trống)
- margin (có thể để trống)
- totalDebtToEquity (có thể để trống)
- totalAssetsToEquity (có thể để trống)

**Phản hồi thành công**:

```json
{
  "success": true,
  "message": "Financial metrics imported successfully",
  "data": {
    "created": 15,
    "skipped": 3,
    "errors": [
      {
        "symbol": "AAA",
        "year": 2023,
        "quarter": 1,
        "error": "Stock with symbol AAA not found"
      }
    ]
  }
}
```

### 8. Lấy báo cáo tài chính theo năm hoặc quý

Lấy dữ liệu chỉ số tài chính của một mã cổ phiếu theo năm hoặc quý.

**Endpoint**: `GET /api/v1/financial-metrics/stock/:symbol/reports`

**Quyền truy cập**: Yêu cầu xác thực

**Tham số đường dẫn**:

| Tham số | Kiểu dữ liệu | Mô tả |
|---------|------------|------|
| symbol | String | Mã cổ phiếu |

**Tham số truy vấn**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả |
|---------|------------|----------|------|
| type | String | Có | Loại báo cáo: "year" hoặc "quarter" |
| page | Integer | Không | Số trang, mặc định là 1 |
| limit | Integer | Không | Số lượng bản ghi trên mỗi trang, mặc định là 20, tối đa là 100 |

**Phản hồi thành công (báo cáo theo năm - type=year)**:

```json
{
  "success": true,
  "message": "Financial metrics yearly reports retrieved successfully",
  "data": {
    "symbol": "VNM",
    "stockName": "Công ty Cổ phần Sữa Việt Nam",
    "type": "year",
    "records": [
      {
        "id": "uuid",
        "symbol": "VNM",
        "year": 2023,
        "quarter": null,
        "eps": 4500,
        "epsIndustry": 3800,
        "pe": 15.2,
        "peIndustry": 16.5,
        "roa": 12.3,
        "roe": 18.7,
        "roaIndustry": 10.2,
        "roeIndustry": 15.8,
        "revenue": 60000000000,
        "margin": 25.5,
        "totalDebtToEquity": 0.45,
        "totalAssetsToEquity": 1.8,
        "createdAt": "2024-01-15T00:00:00.000Z",
        "updatedAt": "2024-01-15T00:00:00.000Z"
      },
      {
        "id": "uuid",
        "symbol": "VNM",
        "year": 2022,
        "quarter": null,
        "eps": 4200,
        "epsIndustry": 3600,
        "pe": 14.8,
        "peIndustry": 16.0,
        "roa": 11.9,
        "roe": 18.1,
        "roaIndustry": 10.0,
        "roeIndustry": 15.5,
        "revenue": 55000000000,
        "margin": 24.8,
        "totalDebtToEquity": 0.43,
        "totalAssetsToEquity": 1.75,
        "createdAt": "2023-01-20T00:00:00.000Z",
        "updatedAt": "2023-01-20T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

**Phản hồi thành công (báo cáo theo quý - type=quarter)**:

```json
{
  "success": true,
  "message": "Financial metrics quarterly reports retrieved successfully",
  "data": {
    "symbol": "VNM",
    "stockName": "Công ty Cổ phần Sữa Việt Nam",
    "type": "quarter",
    "records": [
      {
        "id": "uuid",
        "symbol": "VNM",
        "year": 2023,
        "quarter": 4,
        "eps": 1500,
        "epsIndustry": 1200,
        "pe": 15.2,
        "peIndustry": 16.5,
        "roa": 12.3,
        "roe": 18.7,
        "roaIndustry": 10.2,
        "roeIndustry": 15.8,
        "revenue": 15000000000,
        "margin": 25.5,
        "totalDebtToEquity": 0.45,
        "totalAssetsToEquity": 1.8,
        "createdAt": "2024-01-15T00:00:00.000Z",
        "updatedAt": "2024-01-15T00:00:00.000Z"
      },
      {
        "id": "uuid",
        "symbol": "VNM",
        "year": 2023,
        "quarter": 3,
        "eps": 1200,
        "epsIndustry": 1100,
        "pe": 14.8,
        "peIndustry": 16.0,
        "roa": 11.9,
        "roe": 18.1,
        "roaIndustry": 10.0,
        "roeIndustry": 15.5,
        "revenue": 14500000000,
        "margin": 24.8,
        "totalDebtToEquity": 0.43,
        "totalAssetsToEquity": 1.75,
        "createdAt": "2023-10-15T00:00:00.000Z",
        "updatedAt": "2023-10-15T00:00:00.000Z"
      },
      {
        "id": "uuid",
        "symbol": "VNM",
        "year": 2023,
        "quarter": 2,
        "eps": 1300,
        "epsIndustry": 1150,
        "pe": 15.0,
        "peIndustry": 16.2,
        "roa": 12.0,
        "roe": 18.3,
        "roaIndustry": 10.1,
        "roeIndustry": 15.6,
        "revenue": 14800000000,
        "margin": 25.0,
        "totalDebtToEquity": 0.44,
        "totalAssetsToEquity": 1.78,
        "createdAt": "2023-07-15T00:00:00.000Z",
        "updatedAt": "2023-07-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "pages": 1
    }
  }
}
```

## Mô tả các trường dữ liệu

| Trường | Mô tả |
|---------|------|
| id | ID duy nhất của bản ghi |
| symbol | Mã cổ phiếu |
| year | Năm của dữ liệu |
| quarter | Quý (1-4), có thể null nếu là dữ liệu năm |
| eps | Lợi nhuận trên một cổ phiếu (Earnings Per Share) |
| epsIndustry | Lợi nhuận trên một cổ phiếu trung bình ngành |
| pe | Tỷ lệ giá trên lợi nhuận (Price to Earnings) |
| peIndustry | Tỷ lệ giá trên lợi nhuận trung bình ngành |
| roa | Tỷ suất lợi nhuận trên tổng tài sản (Return on Assets) |
| roe | Tỷ suất lợi nhuận trên vốn chủ sở hữu (Return on Equity) |
| roaIndustry | ROA trung bình ngành |
| roeIndustry | ROE trung bình ngành |
| revenue | Doanh thu |
| margin | Biên lợi nhuận |
| totalDebtToEquity | Tỷ lệ nợ trên vốn chủ sở hữu |
| totalAssetsToEquity | Tỷ lệ tổng tài sản trên vốn chủ sở hữu |
| createdAt | Thời gian tạo bản ghi |
| updatedAt | Thời gian cập nhật bản ghi gần nhất |

## Mã lỗi

| Mã lỗi | Mô tả |
|---------|------|
| 400 | Bad Request - Yêu cầu không hợp lệ |
| 401 | Unauthorized - Không được phép truy cập (thiếu token hoặc token không hợp lệ) |
| 403 | Forbidden - Không có quyền thực hiện hành động này |
| 404 | Not Found - Không tìm thấy tài nguyên |
| 409 | Conflict - Xung đột (ví dụ: bản ghi đã tồn tại) |
| 500 | Internal Server Error - Lỗi máy chủ | 