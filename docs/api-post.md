# API Quản lý Bài Viết (Posts Management API)

API quản lý bài viết cung cấp các điểm cuối (endpoints) để thực hiện các thao tác CRUD (Tạo, Đọc, Cập nhật, Xóa) đối với bài viết trong hệ thống. API này cho phép tạo nội dung, gán danh mục, và quản lý trạng thái đăng tải của bài viết.

## 1. Lấy danh sách bài viết (với phân trang)

### Yêu cầu

```http
GET /api/v1/posts
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số truy vấn

| Tên             | Kiểu dữ liệu  | Mô tả                                             | Bắt buộc | Mặc định    |
|-----------------|---------------|---------------------------------------------------|----------|-------------|
| page            | integer       | Số trang                                          | Không    | 1           |
| limit           | integer       | Số lượng bài viết mỗi trang (tối đa 100)          | Không    | 20          |
| search          | string        | Tìm kiếm theo tiêu đề, nội dung hoặc mô tả ngắn   | Không    | ""          |
| categoryId      | string (UUID) | Lọc theo ID của danh mục                         | Không    | undefined   |
| authorId        | string (UUID) | Lọc theo ID của tác giả                          | Không    | undefined   |
| published       | boolean       | Lọc theo trạng thái xuất bản                     | Không    | undefined   |
| includeDeleted  | boolean       | Bao gồm các bài viết đã xóa mềm                  | Không    | false       |
| sortBy          | string        | Sắp xếp theo trường ('title', 'createdAt', 'publishedAt') | Không | "createdAt" |
| sortDirection   | string        | Hướng sắp xếp ('asc', 'desc')                    | Không    | "desc"      |

### Phản hồi

```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": {
    "posts": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Hướng dẫn đầu tư chứng khoán cho người mới bắt đầu",
        "slug": "huong-dan-dau-tu-chung-khoan-cho-nguoi-moi-bat-dau",
        "content": "Nội dung chi tiết về đầu tư chứng khoán...",
        "excerpt": "Bài viết hướng dẫn cơ bản về đầu tư chứng khoán dành cho người mới",
        "thumbnailId": 10,
        "published": true,
        "publishedAt": "2023-06-15T10:30:00.000Z",
        "authorId": "123e4567-e89b-12d3-a456-426614174010",
        "createdAt": "2023-06-10T08:15:00.000Z",
        "updatedAt": "2023-06-15T10:30:00.000Z",
        "deletedAt": null,
        "categories": [
          {
            "postId": "123e4567-e89b-12d3-a456-426614174000",
            "categoryId": "123e4567-e89b-12d3-a456-426614174002",
            "category": {
              "id": "123e4567-e89b-12d3-a456-426614174002",
              "title": "Hướng dẫn đầu tư",
              "slug": "huong-dan-dau-tu"
            }
          }
        ],
        "author": {
          "id": "123e4567-e89b-12d3-a456-426614174010",
          "name": "Nguyễn Văn A",
          "email": "nguyenvana@example.com"
        }
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

## 2. Lấy bài viết theo ID

### Yêu cầu

```http
GET /api/v1/posts/:id
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu  | Mô tả                | Bắt buộc |
|-----|---------------|----------------------|----------|
| id  | string (UUID) | ID của bài viết      | Có       |

### Tham số truy vấn

| Tên            | Kiểu dữ liệu | Mô tả                         | Bắt buộc | Mặc định |
|----------------|--------------|-------------------------------|----------|----------|
| includeDeleted | boolean      | Bao gồm bài viết đã xóa mềm   | Không    | false    |

### Phản hồi

```json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Hướng dẫn đầu tư chứng khoán cho người mới bắt đầu",
    "slug": "huong-dan-dau-tu-chung-khoan-cho-nguoi-moi-bat-dau",
    "content": "Nội dung chi tiết về đầu tư chứng khoán...",
    "excerpt": "Bài viết hướng dẫn cơ bản về đầu tư chứng khoán dành cho người mới",
    "thumbnailId": 10,
    "published": true,
    "publishedAt": "2023-06-15T10:30:00.000Z",
    "authorId": "123e4567-e89b-12d3-a456-426614174010",
    "createdAt": "2023-06-10T08:15:00.000Z",
    "updatedAt": "2023-06-15T10:30:00.000Z",
    "deletedAt": null,
    "categories": [
      {
        "postId": "123e4567-e89b-12d3-a456-426614174000",
        "categoryId": "123e4567-e89b-12d3-a456-426614174002",
        "category": {
          "id": "123e4567-e89b-12d3-a456-426614174002",
          "title": "Hướng dẫn đầu tư",
          "slug": "huong-dan-dau-tu"
        }
      }
    ],
    "author": {
      "id": "123e4567-e89b-12d3-a456-426614174010",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com"
    }
  }
}
```

## 3. Lấy bài viết theo Slug

### Yêu cầu

```http
GET /api/v1/posts/slug/:slug
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số đường dẫn

| Tên  | Kiểu dữ liệu | Mô tả              | Bắt buộc |
|------|--------------|---------------------|----------|
| slug | string       | Slug của bài viết   | Có       |

### Tham số truy vấn

| Tên            | Kiểu dữ liệu | Mô tả                         | Bắt buộc | Mặc định |
|----------------|--------------|-------------------------------|----------|----------|
| includeDeleted | boolean      | Bao gồm bài viết đã xóa mềm   | Không    | false    |

### Phản hồi

```json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Hướng dẫn đầu tư chứng khoán cho người mới bắt đầu",
    "slug": "huong-dan-dau-tu-chung-khoan-cho-nguoi-moi-bat-dau",
    "content": "Nội dung chi tiết về đầu tư chứng khoán...",
    "excerpt": "Bài viết hướng dẫn cơ bản về đầu tư chứng khoán dành cho người mới",
    "thumbnailId": 10,
    "published": true,
    "publishedAt": "2023-06-15T10:30:00.000Z",
    "authorId": "123e4567-e89b-12d3-a456-426614174010",
    "createdAt": "2023-06-10T08:15:00.000Z",
    "updatedAt": "2023-06-15T10:30:00.000Z",
    "deletedAt": null,
    "categories": [
      {
        "postId": "123e4567-e89b-12d3-a456-426614174000",
        "categoryId": "123e4567-e89b-12d3-a456-426614174002",
        "category": {
          "id": "123e4567-e89b-12d3-a456-426614174002",
          "title": "Hướng dẫn đầu tư",
          "slug": "huong-dan-dau-tu"
        }
      }
    ],
    "author": {
      "id": "123e4567-e89b-12d3-a456-426614174010",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com"
    }
  }
}
```

## 4. Tạo bài viết mới

### Yêu cầu

```http
POST /api/v1/posts
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |
| Content-Type  | application/json                    |

### Dữ liệu gửi đi

| Tên         | Kiểu dữ liệu    | Mô tả                                | Bắt buộc |
|-------------|-----------------|--------------------------------------|----------|
| title       | string          | Tiêu đề của bài viết                 | Có       |
| content     | string          | Nội dung chi tiết của bài viết       | Có       |
| slug        | string          | Slug của bài viết (tự động tạo nếu không cung cấp) | Không    |
| excerpt     | string          | Mô tả ngắn về bài viết               | Không    |
| thumbnailId | integer         | ID của ảnh đại diện                  | Không    |
| published   | boolean         | Trạng thái xuất bản của bài viết     | Không    |
| publishedAt | string (date)   | Thời điểm xuất bản bài viết (ISO 8601) | Không  |
| categoryIds | array of UUID   | Danh sách ID của các danh mục        | Có       |

### Ví dụ dữ liệu gửi đi

```json
{
  "title": "5 chiến lược đầu tư chứng khoán hiệu quả năm 2023",
  "content": "Chi tiết về các chiến lược đầu tư chứng khoán hiệu quả...",
  "excerpt": "Những chiến lược đầu tư hiệu quả cho thị trường chứng khoán Việt Nam trong năm 2023",
  "thumbnailId": 15,
  "published": true,
  "categoryIds": ["123e4567-e89b-12d3-a456-426614174002"]
}
```

### Phản hồi

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "title": "5 chiến lược đầu tư chứng khoán hiệu quả năm 2023",
    "slug": "5-chien-luoc-dau-tu-chung-khoan-hieu-qua-nam-2023",
    "content": "Chi tiết về các chiến lược đầu tư chứng khoán hiệu quả...",
    "excerpt": "Những chiến lược đầu tư hiệu quả cho thị trường chứng khoán Việt Nam trong năm 2023",
    "thumbnailId": 15,
    "published": true,
    "publishedAt": "2023-07-05T09:45:00.000Z",
    "authorId": "123e4567-e89b-12d3-a456-426614174010",
    "createdAt": "2023-07-05T09:45:00.000Z",
    "updatedAt": "2023-07-05T09:45:00.000Z",
    "deletedAt": null,
    "categories": [
      {
        "postId": "123e4567-e89b-12d3-a456-426614174001",
        "categoryId": "123e4567-e89b-12d3-a456-426614174002",
        "category": {
          "id": "123e4567-e89b-12d3-a456-426614174002",
          "title": "Hướng dẫn đầu tư",
          "slug": "huong-dan-dau-tu"
        }
      }
    ],
    "author": {
      "id": "123e4567-e89b-12d3-a456-426614174010",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com"
    }
  }
}
```

## 5. Cập nhật bài viết

### Yêu cầu

```http
PUT /api/v1/posts/:id
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |
| Content-Type  | application/json                    |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu  | Mô tả         | Bắt buộc |
|-----|---------------|---------------|----------|
| id  | string (UUID) | ID của bài viết| Có       |

### Dữ liệu gửi đi

| Tên         | Kiểu dữ liệu    | Mô tả                                | Bắt buộc |
|-------------|-----------------|--------------------------------------|----------|
| title       | string          | Tiêu đề của bài viết                 | Không    |
| content     | string          | Nội dung chi tiết của bài viết       | Không    |
| slug        | string          | Slug của bài viết                    | Không    |
| excerpt     | string          | Mô tả ngắn về bài viết               | Không    |
| thumbnailId | integer         | ID của ảnh đại diện                  | Không    |
| published   | boolean         | Trạng thái xuất bản của bài viết     | Không    |
| publishedAt | string (date)   | Thời điểm xuất bản bài viết (ISO 8601) | Không  |
| categoryIds | array of UUID   | Danh sách ID của các danh mục        | Không    |

### Ví dụ dữ liệu gửi đi

```json
{
  "title": "5 chiến lược đầu tư chứng khoán hiệu quả năm 2023 (Cập nhật)",
  "excerpt": "Những chiến lược đầu tư hiệu quả cho thị trường chứng khoán Việt Nam trong năm 2023 - Cập nhật mới nhất",
  "published": true
}
```

### Phản hồi

```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "title": "5 chiến lược đầu tư chứng khoán hiệu quả năm 2023 (Cập nhật)",
    "slug": "5-chien-luoc-dau-tu-chung-khoan-hieu-qua-nam-2023",
    "content": "Chi tiết về các chiến lược đầu tư chứng khoán hiệu quả...",
    "excerpt": "Những chiến lược đầu tư hiệu quả cho thị trường chứng khoán Việt Nam trong năm 2023 - Cập nhật mới nhất",
    "thumbnailId": 15,
    "published": true,
    "publishedAt": "2023-07-05T09:45:00.000Z",
    "authorId": "123e4567-e89b-12d3-a456-426614174010",
    "createdAt": "2023-07-05T09:45:00.000Z",
    "updatedAt": "2023-07-06T14:20:00.000Z",
    "deletedAt": null,
    "categories": [
      {
        "postId": "123e4567-e89b-12d3-a456-426614174001",
        "categoryId": "123e4567-e89b-12d3-a456-426614174002",
        "category": {
          "id": "123e4567-e89b-12d3-a456-426614174002",
          "title": "Hướng dẫn đầu tư",
          "slug": "huong-dan-dau-tu"
        }
      }
    ],
    "author": {
      "id": "123e4567-e89b-12d3-a456-426614174010",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com"
    }
  }
}
```

## 6. Xóa mềm bài viết

Xóa mềm (soft delete) giúp bài viết không còn hiển thị trong các truy vấn mặc định nhưng vẫn lưu trữ trong cơ sở dữ liệu.

### Yêu cầu

```http
DELETE /api/v1/posts/:id
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu  | Mô tả         | Bắt buộc |
|-----|---------------|---------------|----------|
| id  | string (UUID) | ID của bài viết| Có       |

### Phản hồi

```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": null
}
```

## 7. Khôi phục bài viết đã xóa mềm

### Yêu cầu

```http
POST /api/v1/posts/:id/restore
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu  | Mô tả         | Bắt buộc |
|-----|---------------|---------------|----------|
| id  | string (UUID) | ID của bài viết| Có       |

### Phản hồi

```json
{
  "success": true,
  "message": "Post restored successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "title": "5 chiến lược đầu tư chứng khoán hiệu quả năm 2023 (Cập nhật)",
    "slug": "5-chien-luoc-dau-tu-chung-khoan-hieu-qua-nam-2023",
    "content": "Chi tiết về các chiến lược đầu tư chứng khoán hiệu quả...",
    "excerpt": "Những chiến lược đầu tư hiệu quả cho thị trường chứng khoán Việt Nam trong năm 2023 - Cập nhật mới nhất",
    "thumbnailId": 15,
    "published": true,
    "publishedAt": "2023-07-05T09:45:00.000Z",
    "authorId": "123e4567-e89b-12d3-a456-426614174010",
    "createdAt": "2023-07-05T09:45:00.000Z",
    "updatedAt": "2023-07-10T11:25:00.000Z",
    "deletedAt": null,
    "categories": [
      {
        "postId": "123e4567-e89b-12d3-a456-426614174001",
        "categoryId": "123e4567-e89b-12d3-a456-426614174002",
        "category": {
          "id": "123e4567-e89b-12d3-a456-426614174002",
          "title": "Hướng dẫn đầu tư",
          "slug": "huong-dan-dau-tu"
        }
      }
    ],
    "author": {
      "id": "123e4567-e89b-12d3-a456-426614174010",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com"
    }
  }
}
```

## 8. Xóa vĩnh viễn bài viết

Xóa hoàn toàn bài viết khỏi cơ sở dữ liệu.

### Yêu cầu

```http
DELETE /api/v1/posts/:id/permanent
```

### Headers

| Tên           | Mô tả                               |
|---------------|-------------------------------------|
| Authorization | Bearer {token} - Token xác thực JWT |

### Tham số đường dẫn

| Tên | Kiểu dữ liệu  | Mô tả         | Bắt buộc |
|-----|---------------|---------------|----------|
| id  | string (UUID) | ID của bài viết| Có       |

### Phản hồi

```json
{
  "success": true,
  "message": "Post permanently deleted",
  "data": null
}
```

## Mã lỗi và phản hồi

| Mã HTTP | Mô tả                            | Ví dụ phản hồi                                                  |
|---------|----------------------------------|------------------------------------------------------------------|
| 400     | Dữ liệu đầu vào không hợp lệ     | `{"success": false, "message": "A post with slug \"huong-dan-dau-tu\" already exists"}` |
| 400     | Thiếu danh mục                    | `{"success": false, "message": "At least one category ID is required"}` |
| 400     | Danh mục không tồn tại            | `{"success": false, "message": "Category not found"}`           |
| 401     | Không được xác thực              | `{"success": false, "message": "Unauthorized access"}`           |
| 403     | Không có quyền truy cập          | `{"success": false, "message": "Forbidden - Insufficient permissions"}` |
| 403     | Không phải tác giả              | `{"success": false, "message": "You can only update your own posts"}` |
| 404     | Không tìm thấy bài viết          | `{"success": false, "message": "Post not found"}`                |
| 500     | Lỗi máy chủ nội bộ               | `{"success": false, "message": "Internal server error"}`         |

## Lưu ý quan trọng

1. **Quyền hạn**: 
   - Người dùng phải đăng nhập để truy cập API
   - Các thao tác tạo và cập nhật yêu cầu quyền ADMIN hoặc AUTHOR
   - Người dùng với quyền AUTHOR chỉ có thể chỉnh sửa và xóa mềm bài viết của mình
   - Các thao tác khôi phục và xóa vĩnh viễn chỉ dành cho ADMIN

2. **Bài viết và danh mục**:
   - Mỗi bài viết phải thuộc ít nhất một danh mục
   - Có thể gán nhiều danh mục cho một bài viết (quan hệ nhiều-nhiều)

3. **Slug**:
   - Slug được tạo tự động từ tiêu đề nếu không được cung cấp
   - Slug phải là duy nhất trong hệ thống
   - Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang

4. **Trạng thái xuất bản**:
   - Bài viết có thể ở trạng thái nháp (published = false) hoặc đã xuất bản (published = true)
   - Thời gian xuất bản (publishedAt) được tự động cập nhật khi bài viết được xuất bản

5. **ID**:
   - Hệ thống sử dụng UUID cho ID của bài viết
   - ID phải tuân theo định dạng UUID chuẩn
</rewritten_file> 