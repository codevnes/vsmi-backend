# API Tìm kiếm cổ phiếu (Stock)

## Tổng quan

API Tìm kiếm cổ phiếu cho phép bạn tìm kiếm thông tin về các cổ phiếu dựa trên nhiều tiêu chí khác nhau như mã cổ phiếu, tên công ty, sàn giao dịch, ngành nghề, v.v.

Tất cả các endpoint đều có tiền tố: `/api/v1/stocks`

## Xác thực

Hầu hết các API yêu cầu xác thực. Đảm bảo gửi token xác thực trong header:

```
Authorization: Bearer your_token_here
```

## API Endpoints

### 1. Tìm kiếm cổ phiếu

#### Request

```
GET /api/v1/stocks
```

#### Tham số truy vấn

| Tham số | Kiểu dữ liệu | Mô tả | Ví dụ |
|---------|--------------|-------|-------|
| search | string | Từ khóa tìm kiếm (sẽ tìm trong mã cổ phiếu, tên công ty, và mô tả) | `search=VIC` |
| exchange | string | Lọc theo sàn giao dịch | `exchange=HOSE` |
| industry | string | Lọc theo ngành nghề | `industry=Bất động sản` |
| page | number | Số trang (bắt đầu từ 1) | `page=1` |
| limit | number | Số lượng kết quả trên mỗi trang (tối đa 100) | `limit=20` |
| sortBy | string | Sắp xếp theo trường (`symbol`, `name`, `createdAt`) | `sortBy=symbol` |
| sortDirection | string | Hướng sắp xếp (`asc` hoặc `desc`) | `sortDirection=asc` |

#### Response

```json
{
  "status": "success",
  "data": {
    "stocks": [
      {
        "id": "uuid",
        "symbol": "VIC",
        "name": "Tập đoàn Vingroup",
        "exchange": "HOSE",
        "industry": "Bất động sản",
        "description": "Tập đoàn Vingroup...",
        "createdAt": "2023-01-01T00:00:00Z",
        "updatedAt": "2023-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  },
  "message": "Stocks retrieved successfully"
}
```

### 2. Lấy danh sách sàn giao dịch

#### Request

```
GET /api/v1/stocks/exchanges
```

#### Response

```json
{
  "status": "success",
  "data": [
    "HOSE",
    "HNX",
    "UPCOM"
  ],
  "message": "Exchanges retrieved successfully"
}
```

### 3. Lấy danh sách ngành nghề

#### Request

```
GET /api/v1/stocks/industries
```

#### Response

```json
{
  "status": "success",
  "data": [
    "Bất động sản",
    "Ngân hàng",
    "Năng lượng",
    "Công nghệ"
  ],
  "message": "Industries retrieved successfully"
}
```

### 4. Tra cứu cổ phiếu theo mã

#### Request

```
GET /api/v1/stocks/symbol/:symbol
```

#### Response

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "symbol": "VIC",
    "name": "Tập đoàn Vingroup",
    "exchange": "HOSE",
    "industry": "Bất động sản",
    "description": "Tập đoàn Vingroup...",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  },
  "message": "Stock retrieved successfully"
}
```

### 5. Lấy cổ phiếu theo ID

#### Request

```
GET /api/v1/stocks/:id
```

#### Response

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "symbol": "VIC",
    "name": "Tập đoàn Vingroup",
    "exchange": "HOSE",
    "industry": "Bất động sản",
    "description": "Tập đoàn Vingroup...",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  },
  "message": "Stock retrieved successfully"
}
```

### 6. Lấy giá của một cổ phiếu cụ thể

Để lấy giá của một cổ phiếu cụ thể, sử dụng API giá cổ phiếu với endpoint sau:

#### Request

```
GET /api/v1/stock-prices/symbol/:symbol
```

Ví dụ: `GET /api/v1/stock-prices/symbol/VIC`

#### Tham số truy vấn

| Tham số | Kiểu dữ liệu | Mô tả | Ví dụ |
|---------|--------------|-------|-------|
| startDate | string | Ngày bắt đầu (định dạng ISO) | `startDate=2023-01-01` |
| endDate | string | Ngày kết thúc (định dạng ISO) | `endDate=2023-12-31` |
| page | number | Số trang (mặc định: 1) | `page=1` |
| limit | number | Số lượng kết quả trên mỗi trang (mặc định: 100, tối đa: 100). Nếu không truyền hoặc truyền rỗng, sẽ trả về tất cả dữ liệu không giới hạn | `limit=50` hoặc để trống để lấy tất cả |
| sortDirection | string | Hướng sắp xếp (`asc` hoặc `desc`, mặc định: `desc`) | `sortDirection=asc` |

#### Response

```json
{
  "status": "success",
  "data": {
    "stockPrices": [
      {
        "id": "uuid",
        "symbol": "VIC",
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
      // Thêm giá cổ phiếu...
    ],
    "total": 150,
    "page": 1,
    "limit": 100,
    "totalPages": 2
  },
  "message": "Stock prices retrieved successfully"
}
```

#### Ví dụ sử dụng

1. Lấy giá cổ phiếu VIC trong khoảng thời gian từ 01/01/2023 đến 31/01/2023:

```
GET /api/v1/stock-prices/symbol/VIC?startDate=2023-01-01&endDate=2023-01-31
```

2. Lấy 20 giá gần nhất của cổ phiếu VIC:

```
GET /api/v1/stock-prices/symbol/VIC?limit=20&sortDirection=desc
```

3. Lấy giá cổ phiếu VIC theo thứ tự tăng dần về thời gian:

```
GET /api/v1/stock-prices/symbol/VIC?sortDirection=asc
```

4. Lấy tất cả giá của cổ phiếu VIC không giới hạn số lượng:

```
GET /api/v1/stock-prices/symbol/VIC
```

hoặc

```
GET /api/v1/stock-prices/symbol/VIC?limit=
```

## Ví dụ sử dụng

### Tìm kiếm cơ bản

```
GET /api/v1/stocks?search=VNM
```

Tìm kiếm cổ phiếu có chứa "VNM" trong mã, tên hoặc mô tả.

### Lọc theo sàn và sắp xếp

```
GET /api/v1/stocks?exchange=HOSE&sortBy=symbol&sortDirection=asc
```

Lấy danh sách cổ phiếu trên sàn HOSE, sắp xếp theo mã cổ phiếu tăng dần.

### Tìm kiếm phức hợp với phân trang

```
GET /api/v1/stocks?search=Vingroup&industry=Bất động sản&page=1&limit=10
```

Tìm kiếm cổ phiếu có liên quan đến "Vingroup" thuộc ngành bất động sản, hiển thị 10 kết quả đầu tiên.

## Mã lỗi phổ biến

- **400 Bad Request**: Tham số không hợp lệ
- **401 Unauthorized**: Chưa xác thực
- **403 Forbidden**: Không có quyền truy cập
- **404 Not Found**: Không tìm thấy cổ phiếu
- **500 Internal Server Error**: Lỗi máy chủ 