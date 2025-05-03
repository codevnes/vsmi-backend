# API Quản lý Hình Ảnh (Image Management API)

API quản lý hình ảnh cung cấp các điểm cuối (endpoints) để thực hiện các thao tác tải lên, xử lý và quản lý hình ảnh trong hệ thống.

## 1. Tải lên một hình ảnh

### Yêu cầu

```http
POST /api/v1/images/upload
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |
| Content-Type  | multipart/form-data                 |

### Tham số Form Data

| Tên         | Kiểu dữ liệu  | Mô tả                                 | Bắt buộc |
|-------------|---------------|---------------------------------------|----------|
| image       | file          | File hình ảnh cần tải lên             | Có       |
| resize      | boolean       | Có thay đổi kích thước hay không      | Không    |
| maxWidth    | integer       | Chiều rộng tối đa sau khi thay đổi    | Không    |
| maxHeight   | integer       | Chiều cao tối đa sau khi thay đổi     | Không    |
| quality     | integer (1-100)| Chất lượng hình ảnh (1-100)          | Không    |
| generateThumbnail | boolean  | Có tạo hình thu nhỏ hay không        | Không    |
| thumbnailWidth | integer    | Chiều rộng của hình thu nhỏ           | Không    |
| thumbnailHeight | integer   | Chiều cao của hình thu nhỏ            | Không    |

### Phản hồi

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "image": {
      "id": 1,
      "filename": "123e4567-e89b-12d3-a456-426614174000_example.jpg",
      "originalFilename": "example.jpg",
      "mimeType": "image/jpeg",
      "size": 256000,
      "path": "/uploads/processed/123e4567-e89b-12d3-a456-426614174000_example.jpg",
      "width": 800,
      "height": 600,
      "altText": null,
      "thumbnailPath": "/uploads/processed/123e4567-e89b-12d3-a456-426614174000_example_thumb.jpg",
      "thumbnailWidth": 200,
      "thumbnailHeight": 150,
      "createdAt": "2023-07-05T09:45:00.000Z",
      "updatedAt": "2023-07-05T09:45:00.000Z"
    }
  }
}
```

## 2. Tải lên nhiều hình ảnh

### Yêu cầu

```http
POST /api/v1/images/upload-multiple
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |
| Content-Type  | multipart/form-data                 |

### Tham số Form Data

| Tên         | Kiểu dữ liệu  | Mô tả                                 | Bắt buộc |
|-------------|---------------|---------------------------------------|----------|
| images      | file[]        | Mảng các file hình ảnh cần tải lên    | Có       |
| resize      | boolean       | Có thay đổi kích thước hay không      | Không    |
| maxWidth    | integer       | Chiều rộng tối đa sau khi thay đổi    | Không    |
| maxHeight   | integer       | Chiều cao tối đa sau khi thay đổi     | Không    |
| quality     | integer (1-100)| Chất lượng hình ảnh (1-100)          | Không    |
| generateThumbnail | boolean  | Có tạo hình thu nhỏ hay không        | Không    |
| thumbnailWidth | integer    | Chiều rộng của hình thu nhỏ           | Không    |
| thumbnailHeight | integer   | Chiều cao của hình thu nhỏ            | Không    |

> **LƯU Ý QUAN TRỌNG**: 
> - Tên trường cho file hình ảnh phải là `images`. Các tên trường khác được hỗ trợ bao gồm: `files`, `image`, `file`, hoặc `uploads`.
> - Tải lên tối đa 10 hình ảnh trong một yêu cầu.
> - Định dạng được hỗ trợ: JPEG, PNG, GIF, WebP, SVG.
> - Kích thước tối đa mỗi file: 5MB.

### Phản hồi

```json
{
  "success": true,
  "message": "All 3 images uploaded successfully",
  "data": {
    "successful": [
      {
        "id": 1,
        "filename": "123e4567-e89b-12d3-a456-426614174000_example1.jpg",
        "originalFilename": "example1.jpg",
        "mimeType": "image/jpeg",
        "size": 256000,
        "path": "/uploads/processed/123e4567-e89b-12d3-a456-426614174000_example1.jpg",
        "width": 800,
        "height": 600,
        "altText": null,
        "thumbnailPath": "/uploads/processed/123e4567-e89b-12d3-a456-426614174000_example1_thumb.jpg",
        "thumbnailWidth": 200,
        "thumbnailHeight": 150,
        "createdAt": "2023-07-05T09:45:00.000Z",
        "updatedAt": "2023-07-05T09:45:00.000Z"
      },
      {
        "id": 2,
        "filename": "123e4567-e89b-12d3-a456-426614174001_example2.jpg",
        "originalFilename": "example2.jpg",
        "mimeType": "image/jpeg",
        "size": 312000,
        "path": "/uploads/processed/123e4567-e89b-12d3-a456-426614174001_example2.jpg",
        "width": 1024,
        "height": 768,
        "altText": null,
        "thumbnailPath": "/uploads/processed/123e4567-e89b-12d3-a456-426614174001_example2_thumb.jpg",
        "thumbnailWidth": 200,
        "thumbnailHeight": 150,
        "createdAt": "2023-07-05T09:45:00.000Z",
        "updatedAt": "2023-07-05T09:45:00.000Z"
      },
      {
        "id": 3,
        "filename": "123e4567-e89b-12d3-a456-426614174002_example3.png",
        "originalFilename": "example3.png",
        "mimeType": "image/png",
        "size": 425000,
        "path": "/uploads/processed/123e4567-e89b-12d3-a456-426614174002_example3.png",
        "width": 1200,
        "height": 900,
        "altText": null,
        "thumbnailPath": "/uploads/processed/123e4567-e89b-12d3-a456-426614174002_example3_thumb.png",
        "thumbnailWidth": 200,
        "thumbnailHeight": 150,
        "createdAt": "2023-07-05T09:45:00.000Z",
        "updatedAt": "2023-07-05T09:45:00.000Z"
      }
    ],
    "failed": []
  }
}
```

## 3. Tạo hình thu nhỏ từ hình ảnh hiện có

### Yêu cầu

```http
POST /api/v1/images/:id/thumbnail
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |
| Content-Type  | application/json                    |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu | Mô tả         | Bắt buộc |
|-----|--------------|---------------|----------|
| id  | integer      | ID của hình ảnh| Có      |

### Tham số dữ liệu

| Tên     | Kiểu dữ liệu     | Mô tả                      | Bắt buộc |
|---------|------------------|----------------------------|----------|
| width   | integer (50-500) | Chiều rộng của hình thu nhỏ| Có       |
| height  | integer (50-500) | Chiều cao của hình thu nhỏ | Có       |
| quality | integer (1-100)  | Chất lượng (1-100)         | Không    |

### Phản hồi

```json
{
  "success": true,
  "message": "Thumbnail created successfully",
  "data": {
    "thumbnail": {
      "id": 1,
      "filename": "123e4567-e89b-12d3-a456-426614174000_example.jpg",
      "thumbnailPath": "/uploads/processed/123e4567-e89b-12d3-a456-426614174000_example_thumb.jpg",
      "thumbnailWidth": 200,
      "thumbnailHeight": 150,
      "updatedAt": "2023-07-05T10:15:00.000Z"
    }
  }
}
```

## 4. Lấy danh sách hình ảnh (với phân trang)

### Yêu cầu

```http
GET /api/v1/images
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số truy vấn

| Tên           | Kiểu dữ liệu | Mô tả                                  | Bắt buộc | Mặc định    |
|---------------|--------------|----------------------------------------|----------|-------------|
| page          | integer      | Số trang                               | Không    | 1           |
| limit         | integer      | Số lượng mỗi trang (tối đa 100)         | Không    | 20          |
| search        | string       | Tìm kiếm theo tên file                 | Không    | ""          |
| sortBy        | string       | Sắp xếp theo trường ('createdAt', 'filename') | Không | "createdAt" |
| sortDirection | string       | Hướng sắp xếp ('asc', 'desc')          | Không    | "desc"      |

### Phản hồi

```json
{
  "success": true,
  "message": "Images retrieved successfully",
  "data": {
    "images": [
      {
        "id": 1,
        "filename": "123e4567-e89b-12d3-a456-426614174000_example.jpg",
        "originalFilename": "example.jpg",
        "mimeType": "image/jpeg",
        "size": 256000,
        "path": "/uploads/processed/123e4567-e89b-12d3-a456-426614174000_example.jpg",
        "width": 800,
        "height": 600,
        "altText": null,
        "thumbnailPath": "/uploads/processed/123e4567-e89b-12d3-a456-426614174000_example_thumb.jpg",
        "thumbnailWidth": 200,
        "thumbnailHeight": 150,
        "createdAt": "2023-07-05T09:45:00.000Z",
        "updatedAt": "2023-07-05T09:45:00.000Z"
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

## 5. Lấy hình ảnh theo ID

### Yêu cầu

```http
GET /api/v1/images/:id
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu | Mô tả         | Bắt buộc |
|-----|--------------|---------------|----------|
| id  | integer      | ID của hình ảnh| Có      |

### Phản hồi

```json
{
  "success": true,
  "message": "Image retrieved successfully",
  "data": {
    "id": 1,
    "filename": "123e4567-e89b-12d3-a456-426614174000_example.jpg",
    "originalFilename": "example.jpg",
    "mimeType": "image/jpeg",
    "size": 256000,
    "path": "/uploads/processed/123e4567-e89b-12d3-a456-426614174000_example.jpg",
    "width": 800,
    "height": 600,
    "altText": "Example image",
    "thumbnailPath": "/uploads/processed/123e4567-e89b-12d3-a456-426614174000_example_thumb.jpg",
    "thumbnailWidth": 200,
    "thumbnailHeight": 150,
    "createdAt": "2023-07-05T09:45:00.000Z",
    "updatedAt": "2023-07-05T09:45:00.000Z"
  }
}
```

## 6. Cập nhật thông tin hình ảnh

### Yêu cầu

```http
PUT /api/v1/images/:id
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |
| Content-Type  | application/json                    |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu | Mô tả         | Bắt buộc |
|-----|--------------|---------------|----------|
| id  | integer      | ID của hình ảnh| Có      |

### Tham số dữ liệu

| Tên     | Kiểu dữ liệu | Mô tả           | Bắt buộc |
|---------|--------------|-----------------|----------|
| altText | string       | Văn bản thay thế| Không    |

### Phản hồi

```json
{
  "success": true,
  "message": "Image updated successfully",
  "data": {
    "id": 1,
    "filename": "123e4567-e89b-12d3-a456-426614174000_example.jpg",
    "originalFilename": "example.jpg",
    "mimeType": "image/jpeg",
    "size": 256000,
    "path": "/uploads/processed/123e4567-e89b-12d3-a456-426614174000_example.jpg",
    "width": 800,
    "height": 600,
    "altText": "Hình ảnh ví dụ đã cập nhật",
    "thumbnailPath": "/uploads/processed/123e4567-e89b-12d3-a456-426614174000_example_thumb.jpg",
    "thumbnailWidth": 200,
    "thumbnailHeight": 150,
    "createdAt": "2023-07-05T09:45:00.000Z",
    "updatedAt": "2023-07-05T10:30:00.000Z"
  }
}
```

## 7. Xóa hình ảnh

### Yêu cầu

```http
DELETE /api/v1/images/:id
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu | Mô tả         | Bắt buộc |
|-----|--------------|---------------|----------|
| id  | integer      | ID của hình ảnh| Có      |

### Phản hồi

```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": null
}
```

## Mã lỗi và phản hồi

| Mã HTTP | Mô tả                            | Ví dụ phản hồi                                                  |
|---------|----------------------------------|------------------------------------------------------------------|
| 400     | Không có file được cung cấp      | `{"success": false, "message": "No image file provided"}`       |
| 400     | Loại file không hợp lệ          | `{"success": false, "message": "Unsupported file type. Allowed types: image/jpeg, image/png, image/gif, image/webp, image/svg+xml"}` |
| 400     | Kích thước file vượt quá giới hạn| `{"success": false, "message": "File too large"}`                |
| 400     | Trường field form không đúng     | `{"success": false, "message": "Unexpected field"}`              |
| 401     | Không được xác thực              | `{"success": false, "message": "Unauthorized access"}`           |
| 404     | Không tìm thấy hình ảnh          | `{"success": false, "message": "Image not found"}`               |
| 500     | Lỗi máy chủ nội bộ               | `{"success": false, "message": "Internal server error"}`         |

## Lưu ý quan trọng

1. **Tên trường upload**:
   - Khi tải một hình ảnh, sử dụng trường `image`
   - Khi tải nhiều hình ảnh, sử dụng trường `images`
   - Các tên trường khác được hỗ trợ: `files`, `file`, `uploads`

2. **Giới hạn kích thước và số lượng**:
   - Kích thước tối đa mỗi file là 5MB
   - Tải tối đa 10 hình ảnh trong một yêu cầu

3. **Định dạng hỗ trợ**:
   - JPEG (.jpg, .jpeg)
   - PNG (.png)
   - GIF (.gif)
   - WebP (.webp)
   - SVG (.svg)

4. **Xử lý hình ảnh**:
   - Có thể thay đổi kích thước (resize) và tạo hình thu nhỏ (thumbnail)
   - Chiều rộng/cao của hình thu nhỏ nên từ 50-500 pixels
   - Chất lượng nén (quality) từ 1-100, với 100 là chất lượng cao nhất

5. **Cấu trúc thư mục lưu trữ**:
   - Hình ảnh gốc: `/uploads/original/`
   - Hình ảnh đã xử lý: `/uploads/processed/` 