# API Hồ sơ cổ phiếu (Stock Profile)

## Tổng quan

API Hồ sơ cổ phiếu cung cấp thông tin tóm tắt về các chỉ số quan trọng của cổ phiếu như giá hiện tại, lợi nhuận, khối lượng giao dịch, P/E, EPS, ROA, ROE.

Tất cả các endpoint đều có tiền tố: `/api/v1/stock-profiles`

## Xác thực

Một số API yêu cầu xác thực với quyền ADMIN. Đảm bảo gửi token xác thực trong header:

```
Authorization: Bearer your_token_here
```

## API Endpoints

### 1. Lấy tất cả hồ sơ cổ phiếu

#### Request

```
GET /api/v1/stock-profiles
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "symbol": "VIC",
      "price": 75.5,
      "profit": 1500000000000,
      "volume": 1245678,
      "pe": 15.3,
      "eps": 4.95,
      "roa": 8.4,
      "roe": 12.7,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    },
    // Thêm các hồ sơ cổ phiếu khác...
  ]
}
```

### 2. Lấy hồ sơ cổ phiếu theo ID

#### Request

```
GET /api/v1/stock-profiles/id/:id
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "symbol": "VIC",
    "price": 75.5,
    "profit": 1500000000000,
    "volume": 1245678,
    "pe": 15.3,
    "eps": 4.95,
    "roa": 8.4,
    "roe": 12.7,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### 3. Lấy hồ sơ cổ phiếu theo mã cổ phiếu

#### Request

```
GET /api/v1/stock-profiles/symbol/:symbol
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "symbol": "VIC",
    "price": 75.5,
    "profit": 1500000000000,
    "volume": 1245678,
    "pe": 15.3,
    "eps": 4.95,
    "roa": 8.4,
    "roe": 12.7,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### 4. Tạo hồ sơ cổ phiếu mới (Yêu cầu quyền ADMIN)

#### Request

```
POST /api/v1/stock-profiles
```

#### Headers

```
Authorization: Bearer your_token_here
Content-Type: application/json
```

#### Body

```json
{
  "symbol": "VIC",
  "price": 75.5,
  "profit": 1500000000000,
  "volume": 1245678,
  "pe": 15.3,
  "eps": 4.95,
  "roa": 8.4,
  "roe": 12.7
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "symbol": "VIC",
    "price": 75.5,
    "profit": 1500000000000,
    "volume": 1245678,
    "pe": 15.3,
    "eps": 4.95,
    "roa": 8.4,
    "roe": 12.7,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### 5. Cập nhật hồ sơ cổ phiếu (Yêu cầu quyền ADMIN)

#### Request

```
PUT /api/v1/stock-profiles/:id
```

#### Headers

```
Authorization: Bearer your_token_here
Content-Type: application/json
```

#### Body

```json
{
  "price": 78.2,
  "profit": 1550000000000,
  "volume": 1345678,
  "pe": 15.5,
  "eps": 5.05,
  "roa": 8.6,
  "roe": 12.9
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "symbol": "VIC",
    "price": 78.2,
    "profit": 1550000000000,
    "volume": 1345678,
    "pe": 15.5,
    "eps": 5.05,
    "roa": 8.6,
    "roe": 12.9,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### 6. Xóa hồ sơ cổ phiếu (Yêu cầu quyền ADMIN)

#### Request

```
DELETE /api/v1/stock-profiles/:id
```

#### Headers

```
Authorization: Bearer your_token_here
```

#### Response

```json
{
  "success": true,
  "message": "Stock profile deleted successfully"
}
```

### 7. Cập nhật hoặc Tạo mới hồ sơ cổ phiếu theo mã (Yêu cầu quyền ADMIN)

#### Request

```
POST /api/v1/stock-profiles/upsert/:symbol
```

#### Headers

```
Authorization: Bearer your_token_here
Content-Type: application/json
```

#### Body

```json
{
  "price": 78.2,
  "profit": 1550000000000,
  "volume": 1345678,
  "pe": 15.5,
  "eps": 5.05,
  "roa": 8.6,
  "roe": 12.9
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "symbol": "VIC",
    "price": 78.2,
    "profit": 1550000000000,
    "volume": 1345678,
    "pe": 15.5,
    "eps": 5.05,
    "roa": 8.6,
    "roe": 12.9,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### 8. Lấy nhiều hồ sơ cổ phiếu theo danh sách mã

#### Request

```
GET /api/v1/stock-profiles/batch?symbols[]=VIC&symbols[]=VNM&symbols[]=FPT
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "symbol": "VIC",
      "price": 78.2,
      "profit": 1550000000000,
      "volume": 1345678,
      "pe": 15.5,
      "eps": 5.05,
      "roa": 8.6,
      "roe": 12.9,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    },
    {
      "id": "uuid-2",
      "symbol": "VNM",
      "price": 82.5,
      "profit": 1200000000000,
      "volume": 987654,
      "pe": 16.2,
      "eps": 5.10,
      "roa": 9.2,
      "roe": 13.5,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    },
    {
      "id": "uuid-3",
      "symbol": "FPT",
      "price": 95.8,
      "profit": 850000000000,
      "volume": 756432,
      "pe": 17.5,
      "eps": 5.48,
      "roa": 9.8,
      "roe": 14.2,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### 9. Import nhiều hồ sơ cổ phiếu từ file CSV hoặc Excel (Yêu cầu quyền ADMIN)

#### Request

```
POST /api/v1/stock-profiles/import
```

#### Headers

```
Authorization: Bearer your_token_here
Content-Type: multipart/form-data
```

#### Form Data

| Tham số | Kiểu dữ liệu | Mô tả |
|---------|--------------|-------|
| file | File | File CSV hoặc Excel chứa dữ liệu hồ sơ cổ phiếu |

#### Định dạng file CSV/Excel

File CSV hoặc Excel phải có hàng đầu tiên là tiêu đề và các cột sau:

| Tên cột | Mô tả | Bắt buộc |
|---------|-------|----------|
| symbol | Mã cổ phiếu | Có |
| price | Giá cổ phiếu | Không |
| profit | Lợi nhuận | Không |
| volume | Khối lượng giao dịch | Không |
| pe | Tỷ lệ P/E | Không |
| eps | Thu nhập trên mỗi cổ phiếu | Không |
| roa | Tỷ suất lợi nhuận trên tài sản | Không |
| roe | Tỷ suất lợi nhuận trên vốn chủ sở hữu | Không |

Ví dụ CSV:
```
symbol,price,profit,volume,pe,eps,roa,roe
VIC,75.5,1500000000000,1245678,15.3,4.95,8.4,12.7
VNM,82.5,1200000000000,987654,16.2,5.10,9.2,13.5
FPT,95.8,850000000000,756432,17.5,5.48,9.8,14.2
```

#### Response

```json
{
  "success": true,
  "data": {
    "total": 3,
    "imported": 3,
    "failed": 0,
    "results": [
      {
        "symbol": "VIC",
        "status": "success",
        "message": "Imported successfully",
        "row": 2
      },
      {
        "symbol": "VNM",
        "status": "success",
        "message": "Imported successfully",
        "row": 3
      },
      {
        "symbol": "FPT",
        "status": "success",
        "message": "Imported successfully",
        "row": 4
      }
    ]
  },
  "message": "Stock profiles imported successfully"
}
```

#### Lỗi có thể xảy ra

Nếu một hoặc nhiều hồ sơ không thể được import, API vẫn sẽ tiếp tục với các hồ sơ khác và trả về thông tin chi tiết về những hồ sơ thất bại:

```json
{
  "success": true,
  "data": {
    "total": 3,
    "imported": 2,
    "failed": 1,
    "results": [
      {
        "symbol": "VIC",
        "status": "success",
        "message": "Imported successfully",
        "row": 2
      },
      {
        "symbol": "VNM",
        "status": "failed",
        "message": "Symbol already exists",
        "row": 3
      },
      {
        "symbol": "FPT",
        "status": "success",
        "message": "Imported successfully",
        "row": 4
      }
    ]
  },
  "message": "Some stock profiles could not be imported"
}
```

### 10. Lấy đầy đủ thông tin cổ phiếu kết hợp với hồ sơ cổ phiếu

#### Request

```
GET /api/v1/stock-profiles/full
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "symbol": "VIC",
      "name": "Tập đoàn Vingroup",
      "exchange": "HOSE",
      "industry": "Bất động sản",
      "description": "Tập đoàn Vingroup là tập đoàn kinh tế tư nhân lớn nhất Việt Nam...",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z",
      "profile": {
        "id": "uuid-profile-1",
        "price": 75.5,
        "profit": 1500000000000,
        "volume": 1245678,
        "pe": 15.3,
        "eps": 4.95,
        "roa": 8.4,
        "roe": 12.7,
        "createdAt": "2023-01-01T00:00:00Z",
        "updatedAt": "2023-01-01T00:00:00Z"
      }
    },
    {
      "id": "uuid-2",
      "symbol": "VNM",
      "name": "Công ty Cổ phần Sữa Việt Nam",
      "exchange": "HOSE",
      "industry": "Thực phẩm",
      "description": "Công ty Cổ phần Sữa Việt Nam là công ty chuyên sản xuất các sản phẩm sữa...",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z",
      "profile": {
        "id": "uuid-profile-2",
        "price": 82.5,
        "profit": 1200000000000,
        "volume": 987654,
        "pe": 16.2,
        "eps": 5.10,
        "roa": 9.2,
        "roe": 13.5,
        "createdAt": "2023-01-01T00:00:00Z",
        "updatedAt": "2023-01-01T00:00:00Z"
      }
    }
  ]
}
```

### 11. Lấy đầy đủ thông tin cổ phiếu kết hợp với hồ sơ cổ phiếu theo mã

#### Request

```
GET /api/v1/stock-profiles/full/symbol/:symbol
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "symbol": "VIC",
    "name": "Tập đoàn Vingroup",
    "exchange": "HOSE",
    "industry": "Bất động sản",
    "description": "Tập đoàn Vingroup là tập đoàn kinh tế tư nhân lớn nhất Việt Nam...",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z",
    "profile": {
      "id": "uuid-profile-1",
      "price": 75.5,
      "profit": 1500000000000,
      "volume": 1245678,
      "pe": 15.3,
      "eps": 4.95,
      "roa": 8.4,
      "roe": 12.7,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  }
}
```

## Mô tả chi tiết các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả |
|--------|--------------|-------|
| id | string | ID duy nhất của hồ sơ cổ phiếu |
| symbol | string | Mã cổ phiếu |
| price | number | Giá cổ phiếu (VD: giá đóng cửa gần nhất) |
| profit | number | Lợi nhuận ròng (VD: lợi nhuận mới nhất) |
| volume | number | Khối lượng giao dịch (VD: khối lượng trung bình hoặc mới nhất) |
| pe | number | Tỷ lệ Price/Earnings (P/E) |
| eps | number | Thu nhập trên mỗi cổ phiếu (Earnings Per Share) |
| roa | number | Tỷ suất lợi nhuận trên tài sản (Return On Assets) |
| roe | number | Tỷ suất lợi nhuận trên vốn chủ sở hữu (Return On Equity) |
| createdAt | string | Thời gian tạo |
| updatedAt | string | Thời gian cập nhật gần nhất |

## Mã lỗi

| Mã lỗi | Mô tả |
|--------|-------|
| 400 | Yêu cầu không hợp lệ |
| 401 | Chưa xác thực |
| 403 | Không có quyền truy cập |
| 404 | Không tìm thấy hồ sơ cổ phiếu |
| 409 | Hồ sơ cổ phiếu với mã này đã tồn tại |
| 500 | Lỗi máy chủ nội bộ |

## Ví dụ sử dụng (sử dụng curl)

### Lấy tất cả hồ sơ cổ phiếu

```bash
curl -X GET "http://your-api-domain/api/v1/stock-profiles"
```

### Lấy hồ sơ cổ phiếu theo mã

```bash
curl -X GET "http://your-api-domain/api/v1/stock-profiles/symbol/VIC"
```

### Tạo mới hồ sơ cổ phiếu (yêu cầu xác thực với quyền ADMIN)

```bash
curl -X POST "http://your-api-domain/api/v1/stock-profiles" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "VIC",
    "price": 75.5,
    "profit": 1500000000000,
    "volume": 1245678,
    "pe": 15.3,
    "eps": 4.95,
    "roa": 8.4,
    "roe": 12.7
  }'
```

### Import hồ sơ cổ phiếu từ file (yêu cầu xác thực với quyền ADMIN)

```bash
curl -X POST "http://your-api-domain/api/v1/stock-profiles/import" \
  -H "Authorization: Bearer your_token_here" \
  -F "file=@/path/to/your/file.csv"
```

### Lấy đầy đủ thông tin cổ phiếu kết hợp với hồ sơ cổ phiếu

```bash
curl -X GET "http://your-api-domain/api/v1/stock-profiles/full"
```

### Lấy đầy đủ thông tin cổ phiếu kết hợp với hồ sơ cổ phiếu theo mã

```bash
curl -X GET "http://your-api-domain/api/v1/stock-profiles/full/symbol/VIC"
``` 