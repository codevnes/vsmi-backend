# Tài liệu API Cổ phiếu Đã Chọn (Selected Stocks)

Tài liệu này cung cấp chi tiết về các endpoint API Cổ phiếu Đã Chọn có sẵn trong VSMI V2 backend.

## URL Cơ bản

```
/api/v1/selected-stocks
```

## Các Endpoint

### Lấy Danh sách Cổ phiếu Đã Chọn

Truy xuất danh sách cổ phiếu đã chọn với các tùy chọn phân trang và lọc.

**URL:** `GET /api/v1/selected-stocks`

**Quyền truy cập:** Công khai

**Tham số Truy vấn:**
- `symbol` (tùy chọn): Lọc theo mã cổ phiếu
- `startDate` (tùy chọn): Lọc các mục sau ngày này (định dạng ISO)
- `endDate` (tùy chọn): Lọc các mục trước ngày này (định dạng ISO)
- `page` (tùy chọn): Số trang cho phân trang (mặc định: 1)
- `limit` (tùy chọn): Số mục trên mỗi trang (mặc định: tất cả)
- `sortDirection` (tùy chọn): Hướng sắp xếp cho trường ngày ('asc' hoặc 'desc', mặc định: 'desc')

**Ví dụ Phản hồi:**
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
      // Thêm mục...
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Lấy Cổ phiếu Đã Chọn theo Mã Cổ phiếu

Truy xuất các mục cổ phiếu đã chọn cho một mã cổ phiếu cụ thể với phân trang và lọc theo ngày.

**URL:** `GET /api/v1/selected-stocks/symbol/:symbol`

**Quyền truy cập:** Công khai

**Tham số URL:**
- `symbol`: Mã cổ phiếu (ví dụ: VNM)

**Tham số Truy vấn:**
- `startDate` (tùy chọn): Lọc các mục sau ngày này (định dạng ISO)
- `endDate` (tùy chọn): Lọc các mục trước ngày này (định dạng ISO)
- `page` (tùy chọn): Số trang cho phân trang (mặc định: 1)
- `limit` (tùy chọn): Số mục trên mỗi trang (mặc định: tất cả)
- `sortDirection` (tùy chọn): Hướng sắp xếp cho trường ngày ('asc' hoặc 'desc', mặc định: 'desc')

**Ví dụ Phản hồi:**
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
      // Thêm mục...
    ],
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Lấy Cổ phiếu Đã Chọn theo ID

Truy xuất một mục cổ phiếu đã chọn cụ thể theo ID của nó.

**URL:** `GET /api/v1/selected-stocks/:id`

**Quyền truy cập:** Riêng tư (Yêu cầu xác thực)

**Tham số URL:**
- `id`: UUID của mục cổ phiếu đã chọn

**Ví dụ Phản hồi:**
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

### Tạo Mục Cổ phiếu Đã Chọn

Tạo một mục cổ phiếu đã chọn mới.

**URL:** `POST /api/v1/selected-stocks`

**Quyền truy cập:** Riêng tư (Chỉ Admin)

**Nội dung Yêu cầu:**
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

**Ví dụ Phản hồi:**
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

### Cập nhật Mục Cổ phiếu Đã Chọn

Cập nhật một mục cổ phiếu đã chọn hiện có.

**URL:** `PUT /api/v1/selected-stocks/:id`

**Quyền truy cập:** Riêng tư (Chỉ Admin)

**Tham số URL:**
- `id`: UUID của mục cổ phiếu đã chọn cần cập nhật

**Nội dung Yêu cầu:**
```json
{
  "close": 13400,
  "return": 0.07,
  "qIndex": 1.8,
  "volume": 29000000
}
```

**Ví dụ Phản hồi:**
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

### Xóa Mục Cổ phiếu Đã Chọn

Xóa một mục cổ phiếu đã chọn.

**URL:** `DELETE /api/v1/selected-stocks/:id`

**Quyền truy cập:** Riêng tư (Chỉ Admin)

**Tham số URL:**
- `id`: UUID của mục cổ phiếu đã chọn cần xóa

**Ví dụ Phản hồi:**
```json
{
  "success": true,
  "message": "Selected stocks deleted successfully",
  "data": null
}
```

### Upsert Nhiều Cổ phiếu Đã Chọn

Bulk chèn hoặc cập nhật nhiều mục cổ phiếu đã chọn.

**URL:** `POST /api/v1/selected-stocks/bulk`

**Quyền truy cập:** Riêng tư (Chỉ Admin)

**Nội dung Yêu cầu:**
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

**Ví dụ Phản hồi:**
```json
{
  "success": true,
  "message": "Successfully processed 2 selected stocks entries",
  "data": {
    "count": 2
  }
}
```

## Phản hồi Lỗi

### Đầu vào Không hợp lệ

**Mã Trạng thái:** 400 Bad Request

**Ví dụ Phản hồi:**
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

### Không Tìm thấy

**Mã Trạng thái:** 404 Not Found

**Ví dụ Phản hồi:**
```json
{
  "success": false,
  "message": "Selected stocks not found"
}
```

### Chưa Xác thực

**Mã Trạng thái:** 401 Unauthorized

**Ví dụ Phản hồi:**
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

### Cấm

**Mã Trạng thái:** 403 Forbidden

**Ví dụ Phản hồi:**
```json
{
  "success": false,
  "message": "Not authorized"
}
```

## Mô hình Dữ liệu

### SelectedStocks

| Trường    | Kiểu    | Mô tả                                  |
|-----------|---------|----------------------------------------|
| id        | String  | UUID unique định danh mục              |
| symbol    | String  | Mã cổ phiếu (VD: VNM)                 |
| date      | Date    | Ngày giao dịch (VD: 2025-04-28)        |
| close     | Float   | Giá đóng cửa (VD: 13300 VND)           |
| return    | Float   | Tỷ suất lợi nhuận (VD: 0.06604 = 6.604%) |
| qIndex    | Float   | Chỉ số chất lượng (VD: 1.70884)        |
| volume    | Float   | Khối lượng giao dịch (VD: 28110600)    |
| createdAt | DateTime| Thời gian tạo mục                      |
| updatedAt | DateTime| Thời gian cập nhật mục cuối cùng       | 