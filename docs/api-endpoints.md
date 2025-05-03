# Tài Liệu API - Bài Viết và Danh Mục (GET Endpoints)

Tài liệu này cung cấp chi tiết về tất cả các endpoint GET API liên quan đến bài viết và danh mục.

## URL Cơ Sở

```
/api/v1
```

## Xác Thực

Tất cả các endpoint đều yêu cầu xác thực thông qua token Bearer trong header Authorization:

```
Authorization: Bearer {your_token}
```

---

## Endpoint Bài Viết

### Lấy Tất Cả Bài Viết

Lấy danh sách bài viết với phân trang, lọc và tùy chọn sắp xếp.

- **URL:** `/posts`
- **Phương Thức:** `GET`
- **Yêu Cầu Xác Thực:** Có
- **Quyền Hạn:** Bất kỳ người dùng đã xác thực nào

**Tham Số Truy Vấn:**

| Tham Số | Kiểu | Mô Tả |
|-----------|------|-------------|
| page | integer | Số trang (mặc định: 1) |
| limit | integer | Số lượng mục trên mỗi trang (mặc định: 10, tối đa: 100) |
| search | string | Cụm từ tìm kiếm cho tiêu đề hoặc nội dung bài viết |
| categoryId | UUID | Lọc theo ID danh mục |
| authorId | UUID | Lọc theo ID tác giả |
| published | boolean | Lọc theo trạng thái xuất bản |
| includeDeleted | boolean | Bao gồm cả bài viết đã xóa mềm (chỉ admin) |
| sortBy | string | Trường để sắp xếp (title, createdAt) |
| sortDirection | string | Hướng sắp xếp (asc, desc) |

**Phản Hồi Thành Công:**

```json
{
  "success": true,
  "message": "Lấy bài viết thành công",
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "Tiêu Đề Bài Viết",
        "content": "Nội dung bài viết...",
        "slug": "tieu-de-bai-viet",
        "excerpt": "Tóm tắt bài viết...",
        "published": true,
        "publishedAt": "2023-01-01T00:00:00Z",
        "createdAt": "2023-01-01T00:00:00Z",
        "updatedAt": "2023-01-01T00:00:00Z",
        "author": {
          "id": "uuid",
          "fullName": "Tên Tác Giả"
        },
        "categories": [
          {
            "id": "uuid",
            "title": "Tên Danh Mục"
          }
        ],
        "thumbnail": {
          "id": 1,
          "url": "https://example.com/image.jpg"
        }
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### Lấy Bài Viết Theo ID

Lấy một bài viết cụ thể theo UUID.

- **URL:** `/posts/:id`
- **Phương Thức:** `GET`
- **Yêu Cầu Xác Thực:** Có
- **Quyền Hạn:** Bất kỳ người dùng đã xác thực nào

**Tham Số URL:**

| Tham Số | Kiểu | Mô Tả |
|-----------|------|-------------|
| id | UUID | ID Bài Viết |

**Tham Số Truy Vấn:**

| Tham Số | Kiểu | Mô Tả |
|-----------|------|-------------|
| includeDeleted | boolean | Bao gồm bài viết đã xóa mềm (chỉ admin) |

**Phản Hồi Thành Công:**

```json
{
  "success": true,
  "message": "Lấy bài viết thành công",
  "data": {
    "id": "uuid",
    "title": "Tiêu Đề Bài Viết",
    "content": "Nội dung bài viết...",
    "slug": "tieu-de-bai-viet",
    "excerpt": "Tóm tắt bài viết...",
    "published": true,
    "publishedAt": "2023-01-01T00:00:00Z",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z",
    "author": {
      "id": "uuid",
      "fullName": "Tên Tác Giả"
    },
    "categories": [
      {
        "id": "uuid",
        "title": "Tên Danh Mục"
      }
    ],
    "thumbnail": {
      "id": 1,
      "url": "https://example.com/image.jpg"
    }
  }
}
```

### Lấy Bài Viết Theo Slug

Lấy một bài viết cụ thể theo slug.

- **URL:** `/posts/slug/:slug`
- **Phương Thức:** `GET`
- **Yêu Cầu Xác Thực:** Có
- **Quyền Hạn:** Bất kỳ người dùng đã xác thực nào

**Tham Số URL:**

| Tham Số | Kiểu | Mô Tả |
|-----------|------|-------------|
| slug | string | Slug của bài viết |

**Tham Số Truy Vấn:**

| Tham Số | Kiểu | Mô Tả |
|-----------|------|-------------|
| includeDeleted | boolean | Bao gồm bài viết đã xóa mềm (chỉ admin) |

**Phản Hồi Thành Công:**

Giống như Lấy Bài Viết Theo ID

---

## Endpoint Danh Mục

### Lấy Tất Cả Danh Mục

Lấy danh sách danh mục với phân trang, lọc và tùy chọn sắp xếp.

- **URL:** `/categories`
- **Phương Thức:** `GET`
- **Yêu Cầu Xác Thực:** Có
- **Quyền Hạn:** Bất kỳ người dùng đã xác thực nào

**Tham Số Truy Vấn:**

| Tham Số | Kiểu | Mô Tả |
|-----------|------|-------------|
| page | integer | Số trang (mặc định: 1) |
| limit | integer | Số lượng mục trên mỗi trang (mặc định: 10, tối đa: 100) |
| search | string | Cụm từ tìm kiếm cho tiêu đề danh mục |
| parentId | UUID | Lọc theo ID danh mục cha |
| includeDeleted | boolean | Bao gồm danh mục đã xóa mềm (chỉ admin) |
| sortBy | string | Trường để sắp xếp (title, createdAt) |
| sortDirection | string | Hướng sắp xếp (asc, desc) |

**Phản Hồi Thành Công:**

```json
{
  "success": true,
  "message": "Lấy danh mục thành công",
  "data": {
    "categories": [
      {
        "id": "uuid",
        "title": "Tiêu Đề Danh Mục",
        "slug": "tieu-de-danh-muc",
        "description": "Mô tả danh mục...",
        "parentId": "uuid",
        "thumbnailId": 1,
        "createdAt": "2023-01-01T00:00:00Z",
        "updatedAt": "2023-01-01T00:00:00Z",
        "thumbnail": {
          "id": 1,
          "url": "https://example.com/image.jpg"
        }
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### Lấy Cây Danh Mục

Lấy cấu trúc cây phân cấp của tất cả các danh mục.

- **URL:** `/categories/tree`
- **Phương Thức:** `GET`
- **Yêu Cầu Xác Thực:** Có
- **Quyền Hạn:** Bất kỳ người dùng đã xác thực nào

**Phản Hồi Thành Công:**

```json
{
  "success": true,
  "message": "Lấy cây danh mục thành công",
  "data": [
    {
      "id": "uuid",
      "title": "Danh Mục Cha",
      "slug": "danh-muc-cha",
      "children": [
        {
          "id": "uuid",
          "title": "Danh Mục Con",
          "slug": "danh-muc-con",
          "children": []
        }
      ]
    }
  ]
}
```

### Lấy Danh Mục Theo ID

Lấy một danh mục cụ thể theo UUID.

- **URL:** `/categories/:id`
- **Phương Thức:** `GET`
- **Yêu Cầu Xác Thực:** Có
- **Quyền Hạn:** Bất kỳ người dùng đã xác thực nào

**Tham Số URL:**

| Tham Số | Kiểu | Mô Tả |
|-----------|------|-------------|
| id | UUID | ID Danh Mục |

**Tham Số Truy Vấn:**

| Tham Số | Kiểu | Mô Tả |
|-----------|------|-------------|
| includeDeleted | boolean | Bao gồm danh mục đã xóa mềm (chỉ admin) |

**Phản Hồi Thành Công:**

```json
{
  "success": true,
  "message": "Lấy danh mục thành công",
  "data": {
    "id": "uuid",
    "title": "Tiêu Đề Danh Mục",
    "slug": "tieu-de-danh-muc",
    "description": "Mô tả danh mục...",
    "parentId": "uuid",
    "thumbnailId": 1,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z",
    "children": [
      {
        "id": "uuid",
        "title": "Danh Mục Con"
      }
    ],
    "parent": {
      "id": "uuid",
      "title": "Danh Mục Cha"
    },
    "thumbnail": {
      "id": 1,
      "url": "https://example.com/image.jpg"
    }
  }
}
```

### Lấy Danh Mục Theo Slug

Lấy một danh mục cụ thể theo slug.

- **URL:** `/categories/slug/:slug`
- **Phương Thức:** `GET`
- **Yêu Cầu Xác Thực:** Có
- **Quyền Hạn:** Bất kỳ người dùng đã xác thực nào

**Tham Số URL:**

| Tham Số | Kiểu | Mô Tả |
|-----------|------|-------------|
| slug | string | Slug của danh mục |

**Tham Số Truy Vấn:**

| Tham Số | Kiểu | Mô Tả |
|-----------|------|-------------|
| includeDeleted | boolean | Bao gồm danh mục đã xóa mềm (chỉ admin) |

**Phản Hồi Thành Công:**

Giống như Lấy Danh Mục Theo ID

## Phản Hồi Lỗi

**Lỗi Xác Thực:**

```json
{
  "success": false,
  "error": {
    "status": 401,
    "message": "Yêu cầu xác thực"
  }
}
```

**Lỗi Phân Quyền:**

```json
{
  "success": false,
  "error": {
    "status": 403,
    "message": "Không đủ quyền hạn"
  }
}
```

**Lỗi Validation:**

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Lỗi validation",
    "details": [
      {
        "field": "title",
        "message": "Tiêu đề là bắt buộc"
      }
    ]
  }
}
```

**Lỗi Không Tìm Thấy:**

```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "Không tìm thấy bài viết"
  }
}
```

**Lỗi Máy Chủ:**

```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Lỗi máy chủ nội bộ"
  }
}
``` 