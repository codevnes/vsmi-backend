# API Nhập Dữ Liệu Tiền Tệ và Giá Tiền Tệ

API này cho phép nhập dữ liệu tiền tệ và giá tiền tệ từ các tệp CSV, XLSX hoặc thông qua dữ liệu JSON trực tiếp.

## 1. Nhập Tiền Tệ từ Tệp

Nhập danh sách tiền tệ từ tệp CSV hoặc Excel.

### Request

```
POST /api/v1/currencies/import
```

### Headers

```
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

### Body Parameters

| Tham số | Kiểu    | Bắt buộc | Mô tả                           |
|---------|---------|----------|--------------------------------|
| file    | File    | Có       | Tệp CSV hoặc Excel (XLSX/XLS)   |

#### Định dạng tệp

Tệp phải có các cột sau:
- `code` hoặc `currency_code`: Mã tiền tệ (ví dụ: USD, EUR, VND)
- `name` hoặc `currency_name`: Tên tiền tệ

### Responses

#### Thành công (200 OK)

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

#### Lỗi tệp (400 Bad Request)

```json
{
  "success": false,
  "message": "No valid currency data found in the file"
}
```

#### Lỗi xác thực (401 Unauthorized)

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

#### Lỗi máy chủ (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Failed to import currencies",
  "error": "Error message details"
}
```

## 2. Nhập Tiền Tệ từ JSON

Nhập danh sách tiền tệ từ dữ liệu JSON.

### Request

```
POST /api/v1/currencies/import/json
```

### Headers

```
Content-Type: application/json
Authorization: Bearer {token}
```

### Body

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

### Responses

#### Thành công (200 OK)

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

#### Lỗi dữ liệu (400 Bad Request)

```json
{
  "success": false,
  "message": "Invalid or empty currency data"
}
```

#### Lỗi xác thực (401 Unauthorized)

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## 3. Nhập Giá Tiền Tệ từ Tệp

Nhập dữ liệu giá tiền tệ từ tệp CSV hoặc Excel.

### Request

```
POST /api/v1/currencies/prices/import
```

### Headers

```
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

### Body Parameters

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
- `volume`: Khối lượng giao dịch (không bắt buộc)
- `currencyCode` hoặc `currency_code` hoặc `currency`: Mã tiền tệ (bắt buộc nếu không cung cấp tham số `currencyCode`)

### Responses

#### Thành công (200 OK)

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

#### Lỗi tiền tệ không tồn tại (404 Not Found)

```json
{
  "success": false,
  "message": "Currency with code XYZ not found"
}
```

#### Lỗi tệp (400 Bad Request)

```json
{
  "success": false,
  "message": "No valid currency price data found in the file"
}
```

## 4. Nhập Giá Tiền Tệ từ JSON

Nhập dữ liệu giá tiền tệ từ dữ liệu JSON.

### Request

```
POST /api/v1/currencies/prices/import/json
```

### Headers

```
Content-Type: application/json
Authorization: Bearer {token}
```

### Body

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
      "volume": 1000000
    },
    {
      "currencyCode": "USD",
      "date": "2023-01-02",
      "open": 23050,
      "high": 23200,
      "low": 23000,
      "close": 23150,
      "volume": 1200000
    }
  ]
}
```

### Responses

#### Thành công (200 OK)

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

#### Lỗi dữ liệu (400 Bad Request)

```json
{
  "success": false,
  "message": "Invalid or empty currency price data"
}
```

### Lưu ý

- Hệ thống hỗ trợ cả dấu chấm (.) và dấu phẩy (,) làm dấu thập phân cho giá trị số.
- Nếu tệp CSV sử dụng dấu chấm phẩy (;) làm dấu phân cách, hệ thống sẽ tự động phát hiện.
- Ngày có thể được định dạng theo tiêu chuẩn MM/DD/YYYY hoặc DD/MM/YYYY.
- Dữ liệu trùng lặp (cùng mã tiền tệ và ngày) sẽ được bỏ qua để tránh lỗi. 