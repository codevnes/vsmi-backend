# API Tiền Tệ

API này cung cấp các endpoint để quản lý tiền tệ trong hệ thống.

## Base URL

```
/api/v1/currencies
```

## Các endpoint

### 1. Lấy danh sách tiền tệ

Lấy danh sách tất cả các tiền tệ có trong hệ thống, hỗ trợ phân trang và tìm kiếm.

**Endpoint**: `GET /api/v1/currencies`

**Query Parameters**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả                                 |
|---------|--------------|----------|--------------------------------------|
| search  | string       | Không    | Tìm kiếm theo mã hoặc tên tiền tệ    |
| limit   | number       | Không    | Số lượng bản ghi tối đa (mặc định: 10) |
| offset  | number       | Không    | Vị trí bắt đầu (mặc định: 0)         |

**Phản hồi thành công**:

```json
{
  "success": true,
  "data": [
    {
      "code": "USD",
      "name": "Đô la Mỹ",
      "createdAt": "2023-06-15T07:00:00.000Z",
      "updatedAt": "2023-06-15T07:00:00.000Z"
    },
    {
      "code": "EUR",
      "name": "Euro",
      "createdAt": "2023-06-15T07:00:00.000Z",
      "updatedAt": "2023-06-15T07:00:00.000Z"
    }
  ],
  "total": 2,
  "message": "Currencies retrieved successfully"
}
```

**Mã lỗi**:
- `500`: Lỗi server

### 2. Lấy thông tin tiền tệ theo mã

Lấy thông tin chi tiết của một tiền tệ dựa trên mã tiền tệ.

**Endpoint**: `GET /api/v1/currencies/:code`

**URL Parameters**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả          |
|---------|--------------|----------|---------------|
| code    | string       | Có       | Mã tiền tệ    |

**Phản hồi thành công**:

```json
{
  "success": true,
  "data": {
    "code": "USD",
    "name": "Đô la Mỹ",
    "createdAt": "2023-06-15T07:00:00.000Z",
    "updatedAt": "2023-06-15T07:00:00.000Z"
  },
  "message": "Currency retrieved successfully"
}
```

**Mã lỗi**:
- `404`: Không tìm thấy tiền tệ với mã được cung cấp
- `500`: Lỗi server

### 3. Tạo mới tiền tệ

Tạo mới một tiền tệ trong hệ thống.

**Endpoint**: `POST /api/v1/currencies`

**Body Parameters**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả           |
|---------|--------------|----------|-----------------|
| code    | string       | Có       | Mã tiền tệ      |
| name    | string       | Có       | Tên tiền tệ     |

**Phản hồi thành công**:

```json
{
  "success": true,
  "data": {
    "code": "USD",
    "name": "Đô la Mỹ",
    "createdAt": "2023-06-15T07:00:00.000Z",
    "updatedAt": "2023-06-15T07:00:00.000Z"
  },
  "message": "Currency created successfully"
}
```

**Mã lỗi**:
- `409`: Tiền tệ với mã này đã tồn tại
- `500`: Lỗi server

### 4. Cập nhật tiền tệ

Cập nhật thông tin của một tiền tệ dựa trên mã tiền tệ.

**Endpoint**: `PUT /api/v1/currencies/:code`

**URL Parameters**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả          |
|---------|--------------|----------|---------------|
| code    | string       | Có       | Mã tiền tệ    |

**Body Parameters**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả           |
|---------|--------------|----------|-----------------|
| name    | string       | Không    | Tên tiền tệ mới |

**Phản hồi thành công**:

```json
{
  "success": true,
  "data": {
    "code": "USD",
    "name": "Đô la Mỹ (cập nhật)",
    "createdAt": "2023-06-15T07:00:00.000Z",
    "updatedAt": "2023-06-15T08:00:00.000Z"
  },
  "message": "Currency updated successfully"
}
```

**Mã lỗi**:
- `404`: Không tìm thấy tiền tệ với mã được cung cấp
- `500`: Lỗi server

### 5. Xóa tiền tệ

Xóa một tiền tệ dựa trên mã tiền tệ.

**Endpoint**: `DELETE /api/v1/currencies/:code`

**URL Parameters**:

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả          |
|---------|--------------|----------|---------------|
| code    | string       | Có       | Mã tiền tệ    |

**Phản hồi thành công**:

```json
{
  "success": true,
  "message": "Currency deleted successfully"
}
```

**Mã lỗi**:
- `404`: Không tìm thấy tiền tệ với mã được cung cấp
- `500`: Lỗi server

### 6. Nhập tiền tệ từ tệp

Nhập danh sách tiền tệ từ tệp CSV hoặc Excel.

**Endpoint**: `POST /api/v1/currencies/import`

**Headers**:

```
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**Body Parameters**:

| Tham số | Kiểu    | Bắt buộc | Mô tả                           |
|---------|---------|----------|--------------------------------|
| file    | File    | Có       | Tệp CSV hoặc Excel (XLSX/XLS)   |

#### Định dạng tệp

Tệp phải có các cột sau:
- `code` hoặc `currency_code`: Mã tiền tệ (ví dụ: USD, EUR, VND)
- `name` hoặc `currency_name`: Tên tiền tệ

**Phản hồi thành công**:

```json
{
  "success": true,
  "message": "Successfully imported 5 currencies",
  "data": {
    "processed": 7,
    "imported": 5
  }
}
```

**Mã lỗi**:
- `400`: Lỗi dữ liệu tệp tin
- `401`: Không có quyền truy cập
- `500`: Lỗi server

Chi tiết thêm về API này, vui lòng xem tại [Tài liệu API Nhập Dữ Liệu Tiền Tệ](api/currency-import-vi.md).

### 7. Nhập tiền tệ từ JSON

Nhập danh sách tiền tệ từ dữ liệu JSON.

**Endpoint**: `POST /api/v1/currencies/import/json`

**Headers**:

```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body**:

```json
{
  "currencies": [
    {
      "code": "USD",
      "name": "US Dollar"
    },
    {
      "code": "EUR",
      "name": "Euro"
    },
    {
      "code": "VND",
      "name": "Vietnamese Dong"
    }
  ]
}
```

**Phản hồi thành công**:

```json
{
  "success": true,
  "message": "Successfully imported 3 currencies",
  "data": {
    "processed": 3,
    "imported": 3,
    "errors": null
  }
}
```

**Mã lỗi**:
- `400`: Dữ liệu không hợp lệ
- `401`: Không có quyền truy cập
- `500`: Lỗi server

Chi tiết thêm về API này, vui lòng xem tại [Tài liệu API Nhập Dữ Liệu Tiền Tệ](api/currency-import-vi.md). 