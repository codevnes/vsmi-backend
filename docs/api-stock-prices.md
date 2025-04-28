# Tài Liệu API Giá Cổ Phiếu

Tài liệu này cung cấp chi tiết về các endpoint API Giá Cổ Phiếu, tham số và định dạng phản hồi.

## URL Cơ Sở

Tất cả các endpoint đều có tiền tố: `/api/v1/stock-prices`

## Xác thực

Hầu hết các endpoint yêu cầu xác thực bằng JWT token. Bao gồm token trong header Authorization:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Các Endpoint

### 1. Lấy Giá Cổ Phiếu Theo Mã

Trả về giá cổ phiếu cho một mã cụ thể với bộ lọc ngày tháng tùy chọn và phân trang.

**URL**: `/symbol/:symbol`  
**Phương thức**: `GET`  
**Yêu cầu xác thực**: Có  
**Quyền yêu cầu**: Không  

**Tham số URL**:  
- `symbol`: Mã cổ phiếu (bắt buộc)

**Tham số truy vấn**:  
- `startDate`: Định dạng ngày ISO (tùy chọn)
- `endDate`: Định dạng ngày ISO (tùy chọn)
- `page`: Số trang (mặc định: 1)
- `limit`: Số mục trên mỗi trang (mặc định: 100, tối đa: 100)
- `sortDirection`: Hướng sắp xếp ('asc' hoặc 'desc', mặc định: 'desc')

**Phản hồi thành công**:
```json
{
  "success": true,
  "message": "Lấy giá cổ phiếu thành công",
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
      // Thêm giá cổ phiếu...
    ],
    "total": 150,
    "page": 1,
    "limit": 100,
    "totalPages": 2
  }
}
```

### 2. Lấy Tất Cả Giá Cổ Phiếu

Trả về tất cả giá cổ phiếu với bộ lọc tùy chọn theo khoảng ngày, mã và phân trang.

**URL**: `/`  
**Phương thức**: `GET`  
**Yêu cầu xác thực**: Có  
**Quyền yêu cầu**: Không  

**Tham số truy vấn**:  
- `symbol`: Lọc theo mã (khớp một phần, tùy chọn)
- `startDate`: Định dạng ngày ISO (tùy chọn)
- `endDate`: Định dạng ngày ISO (tùy chọn)
- `page`: Số trang (mặc định: 1)
- `limit`: Số mục trên mỗi trang (mặc định: 100, tối đa: 100)
- `sortDirection`: Hướng sắp xếp ('asc' hoặc 'desc', mặc định: 'desc')

**Phản hồi thành công**: Cùng định dạng với Lấy Giá Cổ Phiếu Theo Mã.

### 3. Lấy Giá Cổ Phiếu Theo ID

Trả về một giá cổ phiếu duy nhất theo ID.

**URL**: `/:id`  
**Phương thức**: `GET`  
**Yêu cầu xác thực**: Có  
**Quyền yêu cầu**: Không  

**Tham số URL**:  
- `id`: UUID giá cổ phiếu (bắt buộc)

**Phản hồi thành công**:
```json
{
  "success": true,
  "message": "Lấy giá cổ phiếu thành công",
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

### 4. Tạo Giá Cổ Phiếu Mới

Tạo một giá cổ phiếu mới.

**URL**: `/`  
**Phương thức**: `POST`  
**Yêu cầu xác thực**: Có  
**Quyền yêu cầu**: Vai trò Admin  

**Body Yêu cầu**:
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

**Trường bắt buộc**: `symbol`, `date`, `open`, `high`, `low`, `close`  
**Trường tùy chọn**: `volume`, `trendQ`, `fq`, `bandDown`, `bandUp`

**Phản hồi thành công**:
```json
{
  "success": true,
  "message": "Tạo giá cổ phiếu thành công",
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

### 5. Cập Nhật Giá Cổ Phiếu

Cập nhật giá cổ phiếu hiện có.

**URL**: `/:id`  
**Phương thức**: `PUT`  
**Yêu cầu xác thực**: Có  
**Quyền yêu cầu**: Vai trò Admin  

**Tham số URL**:  
- `id`: UUID giá cổ phiếu (bắt buộc)

**Body Yêu cầu**:
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

**Lưu ý**: Tất cả các trường đều là tùy chọn, nhưng phải cung cấp ít nhất một trường.

**Phản hồi thành công**:
```json
{
  "success": true,
  "message": "Cập nhật giá cổ phiếu thành công",
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

### 6. Xóa Giá Cổ Phiếu

Xóa một giá cổ phiếu.

**URL**: `/:id`  
**Phương thức**: `DELETE`  
**Yêu cầu xác thực**: Có  
**Quyền yêu cầu**: Vai trò Admin  

**Tham số URL**:  
- `id`: UUID giá cổ phiếu (bắt buộc)

**Phản hồi thành công**:
```json
{
  "success": true,
  "message": "Xóa giá cổ phiếu thành công",
  "data": null
}
```

### 7. Upsert Hàng Loạt Giá Cổ Phiếu

Tạo hoặc cập nhật nhiều giá cổ phiếu trong một yêu cầu.

**URL**: `/bulk`  
**Phương thức**: `POST`  
**Yêu cầu xác thực**: Có  
**Quyền yêu cầu**: Vai trò Admin  

**Body Yêu cầu**:
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
  // Thêm giá cổ phiếu...
]
```

**Trường bắt buộc cho mỗi mục**: `symbol`, `date`, `open`, `high`, `low`, `close`  
**Trường tùy chọn cho mỗi mục**: `volume`, `trendQ`, `fq`, `bandDown`, `bandUp`

**Phản hồi thành công**:
```json
{
  "success": true,
  "message": "Hoàn tất upsert hàng loạt thành công",
  "data": {
    "count": 2
  }
}
```

**Lưu ý**: Đối với các lô lớn (>10.000 mục), API sẽ trả về ID công việc. Bạn có thể kiểm tra trạng thái công việc bằng endpoint Lấy Trạng Thái Công Việc.

### 8. Tải lên Giá Cổ Phiếu CSV/Excel

Tải lên giá cổ phiếu từ tệp CSV hoặc Excel.

**URL**: `/upload`  
**Phương thức**: `POST`  
**Yêu cầu xác thực**: Có  
**Quyền yêu cầu**: Vai trò Admin  
**Content-Type**: `multipart/form-data`

**Form Data**:
- `file`: Tệp CSV hoặc Excel (bắt buộc)
- `symbol`: Mã cổ phiếu (tùy chọn, sẽ được tự động phát hiện nếu không cung cấp)

**Phản hồi thành công**:
```json
{
  "success": true,
  "message": "Tải lên tệp CSV đã được chấp nhận. Quá trình xử lý sẽ được thực hiện trong nền. Bạn có thể kiểm tra tiến trình bằng ID công việc.",
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

### 9. Lấy Trạng Thái Công Việc

Kiểm tra trạng thái của một công việc nền.

**URL**: `/job/:jobId`  
**Phương thức**: `GET`  
**Yêu cầu xác thực**: Có  
**Quyền yêu cầu**: Vai trò Admin  

**Tham số URL**:  
- `jobId`: ID công việc (bắt buộc)

**Phản hồi thành công**:
```json
{
  "success": true,
  "message": "Lấy trạng thái công việc thành công",
  "data": {
    "status": "completed",
    "progress": 100,
    "totalRecords": 1250,
    "processedRecords": 1250,
    "message": "Đã xử lý thành công 1250 bản ghi",
    "symbol": "AAPL",
    "fileName": "aapl_prices_2023.csv"
  }
}
```

**Các giá trị trạng thái có thể**: `pending` (đang chờ), `processing` (đang xử lý), `completed` (hoàn tất), `failed` (thất bại)

## Phản Hồi Lỗi

Tất cả các endpoint sử dụng mã trạng thái HTTP tiêu chuẩn:

- `400 Bad Request`: Dữ liệu đầu vào hoặc tham số không hợp lệ
- `401 Unauthorized`: Token xác thực bị thiếu hoặc không hợp lệ
- `403 Forbidden`: Người dùng thiếu quyền cần thiết (ví dụ: không phải admin cho các endpoint chỉ dành cho admin)
- `404 Not Found`: Không tìm thấy tài nguyên yêu cầu
- `500 Internal Server Error`: Lỗi phía máy chủ

Định dạng phản hồi lỗi:
```json
{
  "success": false,
  "message": "Mô tả lỗi",
  "error": {
    "code": "MÃ_LỖI",
    "details": "Thông tin chi tiết bổ sung về lỗi (nếu có)"
  }
}
```

## Định Dạng Tải Lên CSV/Excel

Khi tải lên dữ liệu giá cổ phiếu qua CSV hoặc Excel, tệp nên có các cột sau:

| Tên Cột   | Bắt buộc | Mô tả                           |
|-----------|----------|----------------------------------|
| symbol    | Có       | Mã cổ phiếu                     |
| date      | Có       | Ngày ở định dạng ISO (YYYY-MM-DD) |
| open      | Có       | Giá mở cửa                      |
| high      | Có       | Giá cao nhất                    |
| low       | Có       | Giá thấp nhất                   |
| close     | Có       | Giá đóng cửa                    |
| volume    | Không    | Khối lượng giao dịch            |
| trendQ    | Không    | Chỉ số chất lượng xu hướng      |
| fq        | Không    | Chỉ số chất lượng tài chính     |
| bandDown  | Không    | Dải giá dưới                    |
| bandUp    | Không    | Dải giá trên                    |

### Định dạng CSV

Hệ thống hỗ trợ định dạng CSV với các đặc điểm sau:

- Dấu chấm phẩy (;) làm dấu phân cách các trường
- Dấu phẩy (,) làm dấu thập phân (sẽ tự động chuyển đổi thành dấu chấm)
- Dòng đầu tiên chứa tên các cột

Ví dụ CSV:
```
symbol;date;open;high;low;close;volume;trendQ;fq;bandDown;bandUp
AAPL;2023-05-20;175,5;178,2;174,8;177,3;32503400;0,75;0,85;174,0;180,0
AAPL;2023-05-21;177,0;180,5;176,3;179,8;29450600;0,78;0,88;175,0;182,0
```

**Lưu ý**: Nếu cột symbol không có hoặc bạn muốn ghi đè, bạn có thể cung cấp một symbol trong yêu cầu tải lên. 