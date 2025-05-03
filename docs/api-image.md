# Tài liệu API Quản lý Hình ảnh

Tài liệu này cung cấp chi tiết về các endpoint API Quản lý Hình ảnh có sẵn trong VSMI V2 backend.

## URL Cơ bản

```
/api/v1/images
```

## Các Endpoint

### Lấy Danh sách Hình ảnh

Truy xuất danh sách hình ảnh với các tùy chọn phân trang và tìm kiếm.

**URL:** `GET /api/v1/images`

**Quyền truy cập:** Công khai

**Tham số Truy vấn:**
- `page` (tùy chọn): Số trang cho phân trang (mặc định: 1)
- `limit` (tùy chọn): Số mục trên mỗi trang (mặc định: 10, tối đa: 100)
- `search` (tùy chọn): Từ khóa tìm kiếm
- `sortBy` (tùy chọn): Sắp xếp theo trường ('createdAt' hoặc 'filename', mặc định: 'createdAt')
- `sortDirection` (tùy chọn): Hướng sắp xếp ('asc' hoặc 'desc', mặc định: 'desc')

**Ví dụ Phản hồi:**
```json
{
  "success": true,
  "message": "Images retrieved successfully",
  "data": {
    "images": [
      {
        "id": 1,
        "filename": "example.jpg",
        "processedFilename": "processed_example.jpg",
        "path": "/uploads/images/processed_example.jpg",
        "url": "https://vsmi.com/uploads/images/processed_example.jpg",
        "altText": "Mô tả hình ảnh",
        "mimetype": "image/jpeg",
        "size": 102400,
        "width": 800,
        "height": 600,
        "createdAt": "2025-04-30T08:45:45.123Z",
        "updatedAt": "2025-04-30T08:45:45.123Z"
      },
      // Thêm hình ảnh...
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Lấy Hình ảnh theo ID

Truy xuất thông tin chi tiết của một hình ảnh theo ID.

**URL:** `GET /api/v1/images/:id`

**Quyền truy cập:** Riêng tư (Yêu cầu xác thực)

**Tham số URL:**
- `id`: ID của hình ảnh

**Ví dụ Phản hồi:**
```json
{
  "success": true,
  "message": "Image retrieved successfully",
  "data": {
    "id": 1,
    "filename": "example.jpg",
    "processedFilename": "processed_example.jpg",
    "path": "/uploads/images/processed_example.jpg",
    "url": "https://vsmi.com/uploads/images/processed_example.jpg",
    "altText": "Mô tả hình ảnh",
    "mimetype": "image/jpeg",
    "size": 102400,
    "width": 800,
    "height": 600,
    "createdAt": "2025-04-30T08:45:45.123Z",
    "updatedAt": "2025-04-30T08:45:45.123Z"
  }
}
```

### Tải lên Một Hình ảnh

Tải lên một hình ảnh mới với các tùy chọn xử lý.

**URL:** `POST /api/v1/images/upload`

**Quyền truy cập:** Riêng tư (Yêu cầu xác thực)

**Content-Type:** `multipart/form-data`

**Các tham số Form:**
- `image` (bắt buộc): File hình ảnh cần tải lên
- `resize` (tùy chọn): Cờ để điều chỉnh kích thước ảnh (true/false)
- `maxWidth` (tùy chọn): Chiều rộng tối đa sau khi điều chỉnh kích thước (pixel)
- `maxHeight` (tùy chọn): Chiều cao tối đa sau khi điều chỉnh kích thước (pixel)
- `quality` (tùy chọn): Chất lượng hình ảnh sau khi xử lý (1-100)
- `generateThumbnail` (tùy chọn): Cờ để tạo hình thu nhỏ (true/false)
- `thumbnailWidth` (tùy chọn): Chiều rộng hình thu nhỏ (pixel)
- `thumbnailHeight` (tùy chọn): Chiều cao hình thu nhỏ (pixel)
- `altText` (tùy chọn): Văn bản mô tả thay thế cho hình ảnh

**Ví dụ Phản hồi:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "image": {
      "id": 1,
      "filename": "example.jpg",
      "processedFilename": "processed_example.jpg",
      "path": "/uploads/images/processed_example.jpg",
      "url": "https://vsmi.com/uploads/images/processed_example.jpg",
      "altText": "Mô tả hình ảnh",
      "mimetype": "image/jpeg",
      "size": 102400,
      "width": 800,
      "height": 600,
      "createdAt": "2025-04-30T08:45:45.123Z",
      "updatedAt": "2025-04-30T08:45:45.123Z"
    }
  }
}
```

### Tải lên Nhiều Hình ảnh

Tải lên nhiều hình ảnh cùng một lúc.

**URL:** `POST /api/v1/images/upload-multiple`

**Quyền truy cập:** Riêng tư (Yêu cầu xác thực)

**Content-Type:** `multipart/form-data`

**Các tham số Form:**
- `files` (bắt buộc): Mảng các file hình ảnh cần tải lên
- Các tùy chọn xử lý giống như khi tải lên một hình ảnh

**Ví dụ Phản hồi:**
```json
{
  "success": true,
  "message": "All 3 images uploaded successfully",
  "data": {
    "successful": [
      {
        "id": 1,
        "filename": "example1.jpg",
        "processedFilename": "processed_example1.jpg",
        "url": "https://vsmi.com/uploads/images/processed_example1.jpg",
        "altText": null,
        "mimetype": "image/jpeg",
        "size": 102400,
        "width": 800,
        "height": 600,
        "createdAt": "2025-04-30T08:45:45.123Z"
      },
      {
        "id": 2,
        "filename": "example2.jpg",
        "processedFilename": "processed_example2.jpg",
        "url": "https://vsmi.com/uploads/images/processed_example2.jpg",
        "altText": null,
        "mimetype": "image/jpeg",
        "size": 98304,
        "width": 1024,
        "height": 768,
        "createdAt": "2025-04-30T08:45:46.123Z"
      },
      {
        "id": 3,
        "filename": "example3.jpg",
        "processedFilename": "processed_example3.jpg",
        "url": "https://vsmi.com/uploads/images/processed_example3.jpg",
        "altText": null,
        "mimetype": "image/jpeg",
        "size": 81920,
        "width": 640,
        "height": 480,
        "createdAt": "2025-04-30T08:45:47.123Z"
      }
    ],
    "failed": []
  }
}
```

### Tạo Hình Thu Nhỏ từ Hình Ảnh Hiện Có

Tạo hình thu nhỏ từ một hình ảnh đã tồn tại trong hệ thống.

**URL:** `POST /api/v1/images/:id/thumbnail`

**Quyền truy cập:** Riêng tư (Yêu cầu xác thực)

**Tham số URL:**
- `id`: ID của hình ảnh gốc

**Nội dung Yêu cầu:**
```json
{
  "width": 200,
  "height": 150,
  "quality": 80
}
```

**Ví dụ Phản hồi:**
```json
{
  "success": true,
  "message": "Thumbnail created successfully",
  "data": {
    "thumbnail": {
      "id": 4,
      "filename": "thumb_example.jpg",
      "processedFilename": "thumb_example.jpg",
      "path": "/uploads/images/thumbs/thumb_example.jpg",
      "url": "https://vsmi.com/uploads/images/thumbs/thumb_example.jpg",
      "altText": "Thumbnail for example.jpg",
      "mimetype": "image/jpeg",
      "size": 15360,
      "width": 200,
      "height": 150,
      "createdAt": "2025-04-30T08:46:12.456Z",
      "updatedAt": "2025-04-30T08:46:12.456Z"
    }
  }
}
```

### Cập nhật Thông tin Hình ảnh

Cập nhật thông tin mô tả của một hình ảnh.

**URL:** `PUT /api/v1/images/:id`

**Quyền truy cập:** Riêng tư (Yêu cầu xác thực)

**Tham số URL:**
- `id`: ID của hình ảnh cần cập nhật

**Nội dung Yêu cầu:**
```json
{
  "altText": "Mô tả mới cho hình ảnh"
}
```

**Ví dụ Phản hồi:**
```json
{
  "success": true,
  "message": "Image updated successfully",
  "data": {
    "id": 1,
    "filename": "example.jpg",
    "processedFilename": "processed_example.jpg",
    "path": "/uploads/images/processed_example.jpg",
    "url": "https://vsmi.com/uploads/images/processed_example.jpg",
    "altText": "Mô tả mới cho hình ảnh",
    "mimetype": "image/jpeg",
    "size": 102400,
    "width": 800,
    "height": 600,
    "createdAt": "2025-04-30T08:45:45.123Z",
    "updatedAt": "2025-04-30T08:48:22.789Z"
  }
}
```

### Xóa Hình ảnh

Xóa một hình ảnh khỏi hệ thống.

**URL:** `DELETE /api/v1/images/:id`

**Quyền truy cập:** Riêng tư (Yêu cầu xác thực)

**Tham số URL:**
- `id`: ID của hình ảnh cần xóa

**Ví dụ Phản hồi:**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": null
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
      "field": "width",
      "message": "Width must be between 50 and 500 pixels"
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
  "message": "Image not found"
}
```

### Không Có File

**Mã Trạng thái:** 400 Bad Request

**Ví dụ Phản hồi:**
```json
{
  "success": false,
  "message": "No image file provided"
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

### Image

| Trường             | Kiểu    | Mô tả                                        |
|--------------------|---------|----------------------------------------------|
| id                 | Int     | ID tự động tăng định danh hình ảnh           |
| filename           | String  | Tên file gốc                                 |
| processedFilename  | String  | Tên file sau khi xử lý                      |
| path               | String  | Đường dẫn lưu trữ trên server               |
| url                | String  | URL công khai để truy cập hình ảnh           |
| altText            | String? | Văn bản thay thế mô tả hình ảnh              |
| mimetype           | String? | Kiểu MIME của hình ảnh                       |
| size               | Int?    | Kích thước file (bytes)                      |
| width              | Int?    | Chiều rộng của hình ảnh (pixels)             |
| height             | Int?    | Chiều cao của hình ảnh (pixels)              |
| createdAt          | DateTime| Thời gian tạo mục                            |
| updatedAt          | DateTime| Thời gian cập nhật mục cuối cùng             |

## Định dạng File Hỗ trợ

Hệ thống hỗ trợ các định dạng hình ảnh phổ biến sau:

- JPEG/JPG (image/jpeg)
- PNG (image/png)
- GIF (image/gif)
- WebP (image/webp)
- SVG (image/svg+xml)

## Giới hạn

- Kích thước file tối đa: 50MB
- Chiều rộng hình thu nhỏ: 50-500 pixels
- Chiều cao hình thu nhỏ: 50-500 pixels
- Số lượng ảnh tải lên cùng lúc tối đa: 10 ảnh 