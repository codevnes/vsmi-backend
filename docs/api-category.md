# API Quản lý Danh mục (Categories Management API)

API quản lý danh mục cung cấp các điểm cuối (endpoints) để thực hiện các thao tác CRUD (Tạo, Đọc, Cập nhật, Xóa) đối với danh mục trong hệ thống. API này cho phép tạo cấu trúc danh mục phân cấp, với mối quan hệ cha-con giữa các danh mục.

## 1. Lấy danh sách danh mục (với phân trang)

### Yêu cầu

```http
GET /api/v1/categories
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số truy vấn

| Tên             | Kiểu dữ liệu | Mô tả                                           | Bắt buộc | Mặc định   |
|-----------------|--------------|------------------------------------------------|----------|------------|
| page            | integer      | Số trang                                       | Không    | 1          |
| limit           | integer      | Số lượng danh mục mỗi trang (tối đa 100)       | Không    | 20         |
| search          | string       | Tìm kiếm theo tiêu đề hoặc mô tả               | Không    | ""         |
| parentId        | string (UUID)| Lọc theo danh mục cha (null = danh mục gốc)    | Không    | undefined  |
| includeDeleted  | boolean      | Bao gồm các danh mục đã xóa mềm                | Không    | false      |
| sortBy          | string       | Sắp xếp theo trường ('title', 'createdAt')     | Không    | "createdAt"|
| sortDirection   | string       | Hướng sắp xếp ('asc', 'desc')                  | Không    | "desc"     |

### Phản hồi

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Phân tích cơ bản",
        "slug": "phan-tich-co-ban",
        "description": "Phân tích thông tin cơ bản của doanh nghiệp",
        "thumbnailId": 1,
        "parentId": null,
        "createdAt": "2023-05-10T07:30:00.000Z",
        "updatedAt": "2023-05-10T07:30:00.000Z",
        "deletedAt": null,
        "parent": null,
        "children": [
          {
            "id": "123e4567-e89b-12d3-a456-426614174001",
            "title": "Báo cáo tài chính",
            "slug": "bao-cao-tai-chinh",
            "description": "Phân tích báo cáo tài chính doanh nghiệp",
            "thumbnailId": 2,
            "parentId": "123e4567-e89b-12d3-a456-426614174000",
            "createdAt": "2023-05-11T09:20:00.000Z",
            "updatedAt": "2023-05-11T09:20:00.000Z",
            "deletedAt": null
          }
        ]
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

## 2. Lấy cây danh mục

Truy xuất cấu trúc phân cấp danh mục dạng cây, bắt đầu từ các danh mục gốc.

### Yêu cầu

```http
GET /api/v1/categories/tree
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Phản hồi

```json
{
  "success": true,
  "message": "Category tree retrieved successfully",
  "data": {
    "categories": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Phân tích cơ bản",
        "slug": "phan-tich-co-ban",
        "description": "Phân tích thông tin cơ bản của doanh nghiệp",
        "thumbnailId": 1,
        "parentId": null,
        "createdAt": "2023-05-10T07:30:00.000Z",
        "updatedAt": "2023-05-10T07:30:00.000Z",
        "deletedAt": null,
        "children": [
          {
            "id": "123e4567-e89b-12d3-a456-426614174001",
            "title": "Báo cáo tài chính",
            "slug": "bao-cao-tai-chinh",
            "description": "Phân tích báo cáo tài chính doanh nghiệp",
            "thumbnailId": 2,
            "parentId": "123e4567-e89b-12d3-a456-426614174000",
            "createdAt": "2023-05-11T09:20:00.000Z",
            "updatedAt": "2023-05-11T09:20:00.000Z",
            "deletedAt": null,
            "children": []
          }
        ]
      },
      {
        "id": "123e4567-e89b-12d3-a456-426614174002",
        "title": "Phân tích kỹ thuật",
        "slug": "phan-tich-ky-thuat",
        "description": "Phân tích biểu đồ kỹ thuật",
        "thumbnailId": 3,
        "parentId": null,
        "createdAt": "2023-05-12T10:15:00.000Z",
        "updatedAt": "2023-05-12T10:15:00.000Z",
        "deletedAt": null,
        "children": []
      }
    ],
    "total": 2
  }
}
```

## 3. Lấy danh mục theo ID

### Yêu cầu

```http
GET /api/v1/categories/:id
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu | Mô tả         | Bắt buộc |
|-----|--------------|---------------|----------|
| id  | string (UUID)| ID của danh mục| Có      |

### Tham số truy vấn

| Tên            | Kiểu dữ liệu | Mô tả                          | Bắt buộc | Mặc định |
|----------------|--------------|--------------------------------|----------|----------|
| includeDeleted | boolean      | Bao gồm danh mục đã xóa mềm    | Không    | false    |

### Phản hồi

```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Phân tích cơ bản",
    "slug": "phan-tich-co-ban",
    "description": "Phân tích thông tin cơ bản của doanh nghiệp",
    "thumbnailId": 1,
    "parentId": null,
    "createdAt": "2023-05-10T07:30:00.000Z",
    "updatedAt": "2023-05-10T07:30:00.000Z",
    "deletedAt": null,
    "parent": null,
    "children": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "title": "Báo cáo tài chính",
        "slug": "bao-cao-tai-chinh",
        "description": "Phân tích báo cáo tài chính doanh nghiệp",
        "thumbnailId": 2,
        "parentId": "123e4567-e89b-12d3-a456-426614174000",
        "createdAt": "2023-05-11T09:20:00.000Z",
        "updatedAt": "2023-05-11T09:20:00.000Z",
        "deletedAt": null
      }
    ]
  }
}
```

## 4. Lấy danh mục theo Slug

### Yêu cầu

```http
GET /api/v1/categories/slug/:slug
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số đường dẫn

| Tên  | Kiểu dữ liệu | Mô tả              | Bắt buộc |
|------|--------------|---------------------|----------|
| slug | string       | Slug của danh mục   | Có      |

### Tham số truy vấn

| Tên            | Kiểu dữ liệu | Mô tả                          | Bắt buộc | Mặc định |
|----------------|--------------|--------------------------------|----------|----------|
| includeDeleted | boolean      | Bao gồm danh mục đã xóa mềm    | Không    | false    |

### Phản hồi

```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Phân tích cơ bản",
    "slug": "phan-tich-co-ban",
    "description": "Phân tích thông tin cơ bản của doanh nghiệp",
    "thumbnailId": 1,
    "parentId": null,
    "createdAt": "2023-05-10T07:30:00.000Z",
    "updatedAt": "2023-05-10T07:30:00.000Z",
    "deletedAt": null,
    "parent": null,
    "children": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "title": "Báo cáo tài chính",
        "slug": "bao-cao-tai-chinh",
        "description": "Phân tích báo cáo tài chính doanh nghiệp",
        "thumbnailId": 2,
        "parentId": "123e4567-e89b-12d3-a456-426614174000",
        "createdAt": "2023-05-11T09:20:00.000Z",
        "updatedAt": "2023-05-11T09:20:00.000Z",
        "deletedAt": null
      }
    ]
  }
}
```

## 5. Tạo danh mục mới

### Yêu cầu

```http
POST /api/v1/categories
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |
| Content-Type  | application/json                    |

### Dữ liệu gửi đi

| Tên         | Kiểu dữ liệu  | Mô tả                                | Bắt buộc |
|-------------|---------------|--------------------------------------|----------|
| title       | string        | Tiêu đề của danh mục                 | Có       |
| slug        | string        | Slug của danh mục (tự động tạo nếu không cung cấp) | Không    |
| thumbnailId | integer       | ID của ảnh đại diện                  | Không    |
| description | string        | Mô tả chi tiết về danh mục           | Không    |
| parentId    | string (UUID) | ID của danh mục cha (null = danh mục gốc) | Không    |

### Ví dụ dữ liệu gửi đi

```json
{
  "title": "Phân tích dòng tiền",
  "description": "Phân tích báo cáo dòng tiền của doanh nghiệp",
  "thumbnailId": 4,
  "parentId": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Phản hồi

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "title": "Phân tích dòng tiền",
    "slug": "phan-tich-dong-tien",
    "description": "Phân tích báo cáo dòng tiền của doanh nghiệp",
    "thumbnailId": 4,
    "parentId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2023-05-15T08:45:00.000Z",
    "updatedAt": "2023-05-15T08:45:00.000Z",
    "deletedAt": null,
    "parent": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Phân tích cơ bản",
      "slug": "phan-tich-co-ban",
      "description": "Phân tích thông tin cơ bản của doanh nghiệp",
      "thumbnailId": 1,
      "parentId": null,
      "createdAt": "2023-05-10T07:30:00.000Z",
      "updatedAt": "2023-05-10T07:30:00.000Z",
      "deletedAt": null
    },
    "children": []
  }
}
```

## 6. Cập nhật danh mục

### Yêu cầu

```http
PUT /api/v1/categories/:id
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |
| Content-Type  | application/json                    |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu | Mô tả         | Bắt buộc |
|-----|--------------|---------------|----------|
| id  | string (UUID)| ID của danh mục| Có      |

### Dữ liệu gửi đi

| Tên         | Kiểu dữ liệu  | Mô tả                                | Bắt buộc |
|-------------|---------------|--------------------------------------|----------|
| title       | string        | Tiêu đề của danh mục                 | Không    |
| slug        | string        | Slug của danh mục                    | Không    |
| thumbnailId | integer       | ID của ảnh đại diện                  | Không    |
| description | string        | Mô tả chi tiết về danh mục           | Không    |
| parentId    | string (UUID) | ID của danh mục cha (null = danh mục gốc) | Không    |

### Ví dụ dữ liệu gửi đi

```json
{
  "title": "Phân tích báo cáo dòng tiền",
  "description": "Phân tích chuyên sâu báo cáo dòng tiền của doanh nghiệp"
}
```

### Phản hồi

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "title": "Phân tích báo cáo dòng tiền",
    "slug": "phan-tich-dong-tien",
    "description": "Phân tích chuyên sâu báo cáo dòng tiền của doanh nghiệp",
    "thumbnailId": 4,
    "parentId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2023-05-15T08:45:00.000Z",
    "updatedAt": "2023-05-15T09:30:00.000Z",
    "deletedAt": null,
    "parent": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Phân tích cơ bản",
      "slug": "phan-tich-co-ban",
      "description": "Phân tích thông tin cơ bản của doanh nghiệp",
      "thumbnailId": 1,
      "parentId": null,
      "createdAt": "2023-05-10T07:30:00.000Z",
      "updatedAt": "2023-05-10T07:30:00.000Z",
      "deletedAt": null
    },
    "children": []
  }
}
```

## 7. Xóa mềm danh mục

Xóa mềm (soft delete) giúp danh mục không còn hiển thị trong các truy vấn mặc định nhưng vẫn lưu trữ trong cơ sở dữ liệu.

### Yêu cầu

```http
DELETE /api/v1/categories/:id
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu | Mô tả         | Bắt buộc |
|-----|--------------|---------------|----------|
| id  | string (UUID)| ID của danh mục| Có      |

### Phản hồi

```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

## 8. Khôi phục danh mục đã xóa mềm

### Yêu cầu

```http
POST /api/v1/categories/:id/restore
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu | Mô tả         | Bắt buộc |
|-----|--------------|---------------|----------|
| id  | string (UUID)| ID của danh mục| Có      |

### Phản hồi

```json
{
  "success": true,
  "message": "Category restored successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "title": "Phân tích báo cáo dòng tiền",
    "slug": "phan-tich-dong-tien",
    "description": "Phân tích chuyên sâu báo cáo dòng tiền của doanh nghiệp",
    "thumbnailId": 4,
    "parentId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2023-05-15T08:45:00.000Z",
    "updatedAt": "2023-05-15T10:15:00.000Z",
    "deletedAt": null,
    "parent": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Phân tích cơ bản",
      "slug": "phan-tich-co-ban",
      "description": "Phân tích thông tin cơ bản của doanh nghiệp",
      "thumbnailId": 1,
      "parentId": null,
      "createdAt": "2023-05-10T07:30:00.000Z",
      "updatedAt": "2023-05-10T07:30:00.000Z",
      "deletedAt": null
    },
    "children": []
  }
}
```

## 9. Xóa vĩnh viễn danh mục

Xóa hoàn toàn danh mục khỏi cơ sở dữ liệu.

### Yêu cầu

```http
DELETE /api/v1/categories/:id/permanent
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu | Mô tả         | Bắt buộc |
|-----|--------------|---------------|----------|
| id  | string (UUID)| ID của danh mục| Có      |

### Phản hồi

```json
{
  "success": true,
  "message": "Category permanently deleted",
  "data": null
}
```

## Mã lỗi và phản hồi

| Mã HTTP | Mô tả                            | Ví dụ phản hồi                                                  |
|---------|----------------------------------|------------------------------------------------------------------|
| 400     | Dữ liệu đầu vào không hợp lệ     | `{"success": false, "message": "A category with slug \"phan-tich-co-ban\" already exists"}` |
| 401     | Không được xác thực              | `{"success": false, "message": "Unauthorized access"}`           |
| 403     | Không có quyền truy cập          | `{"success": false, "message": "Forbidden - Insufficient permissions"}` |
| 404     | Không tìm thấy danh mục          | `{"success": false, "message": "Category not found"}`            |
| 409     | Xung đột khi thao tác với dữ liệu| `{"success": false, "message": "Cannot delete category with children"}` |
| 500     | Lỗi máy chủ nội bộ               | `{"success": false, "message": "Internal server error"}`         |

## Lưu ý quan trọng

1. **Quyền hạn**: 
   - Người dùng phải đăng nhập để truy cập API
   - Các thao tác tạo và cập nhật yêu cầu quyền ADMIN hoặc AUTHOR
   - Các thao tác xóa (mềm/vĩnh viễn) và khôi phục chỉ dành cho ADMIN

2. **Phân cấp danh mục**:
   - Danh mục có thể có cấu trúc phân cấp cha-con không giới hạn chiều sâu
   - Khi xóa một danh mục cha, tất cả danh mục con đều bị xóa (xóa mềm)

3. **Slug**:
   - Slug được tạo tự động từ tiêu đề nếu không được cung cấp
   - Slug phải là duy nhất trong hệ thống
   - Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang

4. **ID**:
   - Hệ thống sử dụng UUID cho ID của danh mục
   - ID phải tuân theo định dạng UUID chuẩn 