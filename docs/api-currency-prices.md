# API Giá Tiền Tệ

API này cung cấp các endpoint để quản lý dữ liệu giá của các tiền tệ trong hệ thống.

## Base URL

```
/api/v1/currencies
```

## Các endpoint

### 1. Lấy danh sách giá tiền tệ

Lấy danh sách giá tiền tệ với các tùy chọn lọc, phân trang.

**Endpoint**: `GET /api/v1/currencies/prices`

**Query Parameters**:

| Tham số      | Kiểu dữ liệu | Bắt buộc | Mô tả                                     |
|--------------|--------------|----------|-----------------------------------------|
| currencyCode | string       | Không    | Mã tiền tệ cần lọc                       |
| startDate    | string       | Không    | Ngày bắt đầu (định dạng: YYYY-MM-DD)    |
| endDate      | string       | Không    | Ngày kết thúc (định dạng: YYYY-MM-DD)   |
| limit        | number       | Không    | Số lượng bản ghi tối đa (mặc định: 100)  |
| offset       | number       | Không    | Vị trí bắt đầu (mặc định: 0)             |

**Phản hồi thành công**:

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "currencyCode": "USD",
      "date": "2023-06-15T07:00:00.000Z",
      "open": "23500.00",
      "high": "23550.00",
      "low": "23450.00",
      "close": "23520.00",
      "trendQ": "120.50",
      "fq": "250.75",
      "createdAt": "2023-06-15T08:00:00.000Z",
      "updatedAt": "2023-06-15T08:00:00.000Z"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "currencyCode": "EUR",
      "date": "2023-06-15T07:00:00.000Z",
      "open": "25700.00",
      "high": "25750.00",
      "low": "25650.00",
      "close": "25730.00",
      "trendQ": "140.25",
      "fq": "280.60",
      "createdAt": "2023-06-15T08:00:00.000Z",
      "updatedAt": "2023-06-15T08:00:00.000Z"
    }
  ],
  "total": 2,
  "message": "Currency prices retrieved successfully"
}
```

**Mã lỗi**:
- `500`: Lỗi server

### 2. Lấy giá tiền tệ mới nhất

Lấy giá mới nhất của tất cả các tiền tệ hoặc giới hạn số lượng.

**Endpoint**: `GET /api/v1/currencies/prices/latest`

**Query Parameters**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả                                   |
|---------|--------------|----------|----------------------------------------|
| limit   | number       | Không    | Số lượng bản ghi tối đa (mặc định: 20) |

**Phản hồi thành công**:

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "currencyCode": "USD",
      "date": "2023-06-15T07:00:00.000Z",
      "open": "23500.00",
      "high": "23550.00",
      "low": "23450.00",
      "close": "23520.00",
      "trendQ": "120.50",
      "fq": "250.75",
      "createdAt": "2023-06-15T08:00:00.000Z",
      "updatedAt": "2023-06-15T08:00:00.000Z"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "currencyCode": "EUR",
      "date": "2023-06-15T07:00:00.000Z",
      "open": "25700.00",
      "high": "25750.00",
      "low": "25650.00",
      "close": "25730.00",
      "trendQ": "140.25",
      "fq": "280.60",
      "createdAt": "2023-06-15T08:00:00.000Z",
      "updatedAt": "2023-06-15T08:00:00.000Z"
    }
  ],
  "total": 2,
  "message": "Latest currency prices retrieved successfully"
}
```

**Mã lỗi**:
- `500`: Lỗi server

### 3. Lấy giá tiền tệ theo khoảng thời gian

Lấy giá tiền tệ theo mã tiền tệ và khoảng thời gian.

**Endpoint**: `GET /api/v1/currencies/:currencyCode/prices`

**URL Parameters**:

| Tham số      | Kiểu dữ liệu | Bắt buộc | Mô tả           |
|--------------|--------------|----------|----------------|
| currencyCode | string       | Có       | Mã tiền tệ     |

**Query Parameters**:

| Tham số   | Kiểu dữ liệu | Bắt buộc | Mô tả                                   |
|-----------|--------------|----------|----------------------------------------|
| startDate | string       | Có       | Ngày bắt đầu (định dạng: YYYY-MM-DD)   |
| endDate   | string       | Có       | Ngày kết thúc (định dạng: YYYY-MM-DD)  |

**Phản hồi thành công**:

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "currencyCode": "USD",
      "date": "2023-06-15T07:00:00.000Z",
      "open": "23500.00",
      "high": "23550.00",
      "low": "23450.00",
      "close": "23520.00",
      "trendQ": "120.50",
      "fq": "250.75",
      "createdAt": "2023-06-15T08:00:00.000Z",
      "updatedAt": "2023-06-15T08:00:00.000Z"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "currencyCode": "USD",
      "date": "2023-06-16T07:00:00.000Z",
      "open": "23520.00",
      "high": "23600.00",
      "low": "23480.00",
      "close": "23550.00",
      "trendQ": "125.75",
      "fq": "260.30",
      "createdAt": "2023-06-16T08:00:00.000Z",
      "updatedAt": "2023-06-16T08:00:00.000Z"
    }
  ],
  "total": 2,
  "message": "Currency prices by date range retrieved successfully"
}
```

**Mã lỗi**:
- `400`: Thiếu thông tin startDate hoặc endDate
- `404`: Không tìm thấy tiền tệ với mã được cung cấp
- `500`: Lỗi server

### 4. Lấy tất cả giá tiền tệ theo mã không giới hạn

Lấy toàn bộ dữ liệu giá của một tiền tệ cụ thể không giới hạn số lượng.

**Endpoint**: `GET /api/v1/currencies/:currencyCode/prices/all`

**URL Parameters**:

| Tham số      | Kiểu dữ liệu | Bắt buộc | Mô tả           |
|--------------|--------------|----------|----------------|
| currencyCode | string       | Có       | Mã tiền tệ     |

**Phản hồi thành công**:

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "currencyCode": "USD",
      "date": "2023-06-15T07:00:00.000Z",
      "open": "23500.00",
      "high": "23550.00",
      "low": "23450.00",
      "close": "23520.00",
      "trendQ": "120.50",
      "fq": "250.75",
      "createdAt": "2023-06-15T08:00:00.000Z",
      "updatedAt": "2023-06-15T08:00:00.000Z"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "currencyCode": "USD",
      "date": "2023-06-16T07:00:00.000Z",
      "open": "23520.00",
      "high": "23600.00",
      "low": "23480.00",
      "close": "23550.00",
      "trendQ": "125.75",
      "fq": "260.30",
      "createdAt": "2023-06-16T08:00:00.000Z",
      "updatedAt": "2023-06-16T08:00:00.000Z"
    }
    // Tất cả các bản ghi giá của tiền tệ được trả về không giới hạn số lượng
  ],
  "total": 1000,
  "message": "All currency prices retrieved successfully"
}
```

**Mã lỗi**:
- `404`: Không tìm thấy tiền tệ với mã được cung cấp
- `500`: Lỗi server

### 5. Lấy tất cả giá tiền tệ theo mã không giới hạn (cho cặp tiền tệ)

Lấy toàn bộ dữ liệu giá của một tiền tệ cụ thể không giới hạn số lượng, phù hợp cho các cặp tiền tệ có chứa dấu gạch chéo như "AUD/USD".

**Endpoint**: `GET /api/v1/currencies/prices/all`

**Query Parameters**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả           |
|---------|--------------|----------|----------------|
| code    | string       | Có       | Mã tiền tệ     |

**Ví dụ**:
```
GET /api/v1/currencies/prices/all?code=AUD/USD
```

**Phản hồi thành công**:

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "currencyCode": "AUD/USD",
      "date": "2023-06-15T07:00:00.000Z",
      "open": "0.6850",
      "high": "0.6870",
      "low": "0.6830",
      "close": "0.6860",
      "trendQ": "0.35",
      "fq": "0.75",
      "createdAt": "2023-06-15T08:00:00.000Z",
      "updatedAt": "2023-06-15T08:00:00.000Z"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "currencyCode": "AUD/USD",
      "date": "2023-06-16T07:00:00.000Z",
      "open": "0.6860",
      "high": "0.6880",
      "low": "0.6840",
      "close": "0.6870",
      "trendQ": "0.38",
      "fq": "0.78",
      "createdAt": "2023-06-16T08:00:00.000Z",
      "updatedAt": "2023-06-16T08:00:00.000Z"
    }
    // Tất cả các bản ghi giá của tiền tệ được trả về không giới hạn số lượng
  ],
  "total": 1000,
  "message": "All currency prices retrieved successfully"
}
```

**Mã lỗi**:
- `400`: Thiếu tham số code
- `404`: Không tìm thấy tiền tệ với mã được cung cấp
- `500`: Lỗi server

### 6. Lấy giá tiền tệ theo ID

Lấy thông tin chi tiết của một giá tiền tệ dựa trên ID.

**Endpoint**: `GET /api/v1/currencies/prices/:id`

**URL Parameters**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả                 |
|---------|--------------|----------|----------------------|
| id      | string       | Có       | ID của giá tiền tệ   |

**Phản hồi thành công**:

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "currencyCode": "USD",
    "date": "2023-06-15T07:00:00.000Z",
    "open": "23500.00",
    "high": "23550.00",
    "low": "23450.00",
    "close": "23520.00",
    "trendQ": "120.50",
    "fq": "250.75",
    "createdAt": "2023-06-15T08:00:00.000Z",
    "updatedAt": "2023-06-15T08:00:00.000Z"
  },
  "message": "Currency price retrieved successfully"
}
```

**Mã lỗi**:
- `404`: Không tìm thấy giá tiền tệ với ID được cung cấp
- `500`: Lỗi server

### 7. Tạo mới giá tiền tệ

Tạo mới một giá tiền tệ trong hệ thống.

**Endpoint**: `POST /api/v1/currencies/prices`

**Body Parameters**:

| Tham số      | Kiểu dữ liệu | Bắt buộc | Mô tả                                  |
|--------------|--------------|----------|------------------------------------- |
| currencyCode | string       | Có       | Mã tiền tệ                           |
| date         | string       | Có       | Ngày (định dạng: YYYY-MM-DD)         |
| open         | number/string| Có       | Giá mở cửa                           |
| high         | number/string| Có       | Giá cao nhất                         |
| low          | number/string| Có       | Giá thấp nhất                        |
| close        | number/string| Có       | Giá đóng cửa                         |
| trendQ       | number/string| Không    | Chỉ số trendQ                        |
| fq           | number/string| Không    | Chỉ số FQ                           |

**Phản hồi thành công**:

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "currencyCode": "USD",
    "date": "2023-06-15T07:00:00.000Z",
    "open": "23500.00",
    "high": "23550.00",
    "low": "23450.00",
    "close": "23520.00",
    "trendQ": "120.50",
    "fq": "250.75",
    "createdAt": "2023-06-15T08:00:00.000Z",
    "updatedAt": "2023-06-15T08:00:00.000Z"
  },
  "message": "Currency price created successfully"
}
```

**Mã lỗi**:
- `404`: Không tìm thấy tiền tệ với mã được cung cấp
- `500`: Lỗi server

### 8. Tạo nhiều giá tiền tệ cùng lúc

Tạo nhiều bản ghi giá tiền tệ cùng một lúc.

**Endpoint**: `POST /api/v1/currencies/prices/bulk`

**Body Parameters**:
Mảng các đối tượng giá tiền tệ, mỗi đối tượng có cấu trúc giống như trong endpoint tạo mới một giá tiền tệ.

**Phản hồi thành công**:

```json
{
  "success": true,
  "data": {
    "count": 2
  },
  "message": "2 currency prices created successfully"
}
```

**Mã lỗi**:
- `400`: Dữ liệu không hợp lệ
- `404`: Không tìm thấy tiền tệ với mã được cung cấp
- `500`: Lỗi server

### 9. Nhập giá tiền tệ từ tệp

Nhập dữ liệu giá tiền tệ từ tệp CSV hoặc Excel.

**Endpoint**: `POST /api/v1/currencies/prices/import`

**Headers**:

```
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**Body Parameters**:

| Tham số       | Kiểu    | Bắt buộc | Mô tả                                        |
|---------------|---------|----------|---------------------------------------------|
| file          | File    | Có       | Tệp CSV hoặc Excel (XLSX/XLS)                |
| currencyCode  | String  | Không    | Mã tiền tệ nếu không có trong tệp           |

#### Định dạng tệp

Tệp phải có các cột sau:
- `date`: Ngày giao dịch
- `open`: Giá mở cửa
- `high`: Giá cao nhất
- `low`: Giá thấp nhất
- `close`: Giá đóng cửa
- `trendQ`: Chỉ số trendQ (không bắt buộc)
- `fq`: Chỉ số FQ (không bắt buộc)
- `currencyCode` hoặc `currency_code` hoặc `currency`: Mã tiền tệ (bắt buộc nếu không cung cấp tham số `currencyCode`)

**Phản hồi thành công**:

```json
{
  "success": true,
  "message": "Successfully imported 100 currency prices",
  "data": {
    "processed": 120,
    "imported": 100
  }
}
```

**Mã lỗi**:
- `400`: Lỗi dữ liệu tệp tin
- `401`: Không có quyền truy cập
- `404`: Mã tiền tệ không tồn tại
- `500`: Lỗi server

Chi tiết thêm về API này, vui lòng xem tại [Tài liệu API Nhập Dữ Liệu Tiền Tệ](api/currency-import-vi.md).

### 10. Nhập giá tiền tệ từ JSON

Nhập dữ liệu giá tiền tệ từ dữ liệu JSON.

**Endpoint**: `POST /api/v1/currencies/prices/import/json`

**Headers**:

```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body**:

```json
{
  "prices": [
    {
      "currencyCode": "USD",
      "date": "2023-01-01",
      "open": 23000,
      "high": 23100,
      "low": 22900,
      "close": 23050,
      "trendQ": 120.5,
      "fq": 250.75
    },
    {
      "currencyCode": "USD",
      "date": "2023-01-02",
      "open": 23050,
      "high": 23200,
      "low": 23000,
      "close": 23150,
      "trendQ": 125.75,
      "fq": 260.3
    }
  ]
}
```

**Phản hồi thành công**:

```json
{
  "success": true,
  "message": "Successfully imported 2 currency prices",
  "data": {
    "processed": 2,
    "imported": 2,
    "errors": null
  }
}
```

**Mã lỗi**:
- `400`: Dữ liệu không hợp lệ
- `401`: Không có quyền truy cập
- `500`: Lỗi server

Chi tiết thêm về API này, vui lòng xem tại [Tài liệu API Nhập Dữ Liệu Tiền Tệ](api/currency-import-vi.md).

### 11. Cập nhật giá tiền tệ

Cập nhật thông tin của một giá tiền tệ dựa trên ID.

**Endpoint**: `PUT /api/v1/currencies/prices/:id`

**URL Parameters**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả                |
|---------|--------------|----------|---------------------|
| id      | string       | Có       | ID của giá tiền tệ  |

**Body Parameters**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả                        |
|---------|--------------|----------|----------------------------- |
| open    | number/string| Không    | Giá mở cửa mới               |
| high    | number/string| Không    | Giá cao nhất mới             |
| low     | number/string| Không    | Giá thấp nhất mới            |
| close   | number/string| Không    | Giá đóng cửa mới             |
| trendQ  | number/string| Không    | Chỉ số trendQ mới            |
| fq      | number/string| Không    | Chỉ số FQ mới                |

**Phản hồi thành công**:

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "currencyCode": "USD",
    "date": "2023-06-15T07:00:00.000Z",
    "open": "23500.00",
    "high": "23600.00",
    "low": "23450.00",
    "close": "23580.00",
    "trendQ": "125.75",
    "fq": "260.30",
    "createdAt": "2023-06-15T08:00:00.000Z",
    "updatedAt": "2023-06-15T09:00:00.000Z"
  },
  "message": "Currency price updated successfully"
}
```

**Mã lỗi**:
- `404`: Không tìm thấy giá tiền tệ với ID được cung cấp
- `500`: Lỗi server

### 12. Xóa giá tiền tệ

Xóa một giá tiền tệ dựa trên ID.

**Endpoint**: `DELETE /api/v1/currencies/prices/:id`

**URL Parameters**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả                |
|---------|--------------|----------|---------------------|
| id      | string       | Có       | ID của giá tiền tệ  |

**Phản hồi thành công**:

```json
{
  "success": true,
  "message": "Currency price deleted successfully"
}
```

**Mã lỗi**:
- `404`: Không tìm thấy giá tiền tệ với ID được cung cấp
- `500`: Lỗi server 