# API Quản lý người dùng (User Management)

## Tổng quan

API quản lý người dùng cung cấp các endpoints để quản lý thông tin người dùng, hồ sơ cá nhân và quyền hạn trong hệ thống.

## Base URL

```
/api/v1/users
```

## Xác thực

Hầu hết các API trong phần này yêu cầu xác thực người dùng. Để xác thực, cần gửi token JWT trong header Authorization:

```
Authorization: Bearer {token}
```

---

## 1. Lấy thông tin hồ sơ cá nhân

Lấy thông tin hồ sơ của người dùng đã đăng nhập.

### Endpoint

```
GET /api/v1/users/profile
```

### Headers

| Tên | Giá trị | Mô tả |
|-----|---------|-------|
| Authorization | Bearer {token} | JWT token xác thực |

### Response

#### Success (200)

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "phone": "string | null",
    "profilePictureUrl": "string | null",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### Error (401)

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": {
    "code": "UNAUTHORIZED",
    "message": "You are not authorized to access this resource"
  }
}
```

---

## 2. Cập nhật hồ sơ cá nhân

Cập nhật thông tin hồ sơ cá nhân của người dùng đã đăng nhập.

### Endpoint

```
PUT /api/v1/users/profile
```

### Headers

| Tên | Giá trị | Mô tả |
|-----|---------|-------|
| Authorization | Bearer {token} | JWT token xác thực |
| Content-Type | application/json | Định dạng dữ liệu gửi lên |

### Request Body

```json
{
  "fullName": "string (tùy chọn)",
  "phone": "string (tùy chọn)",
  "thumbnailId": "number | null (tùy chọn)"
}
```

### Validation

- **fullName**: phải có từ 2-100 ký tự
- **phone**: phải có từ 10-15 chữ số

### Response

#### Success (200)

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "phone": "string | null",
    "profilePictureUrl": "string | null",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### Error (400)

```json
{
  "success": false,
  "message": "Validation error",
  "error": {
    "code": "BAD_REQUEST",
    "message": "Full name must be between 2 and 100 characters"
  }
}
```

---

## 3. Đổi mật khẩu

Thay đổi mật khẩu của người dùng đã đăng nhập.

### Endpoint

```
POST /api/v1/users/change-password
```

### Headers

| Tên | Giá trị | Mô tả |
|-----|---------|-------|
| Authorization | Bearer {token} | JWT token xác thực |
| Content-Type | application/json | Định dạng dữ liệu gửi lên |

### Request Body

```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

### Validation

- **currentPassword**: không được để trống
- **newPassword**: 
  - Phải có ít nhất 8 ký tự
  - Phải có ít nhất 1 chữ số
  - Phải có ít nhất 1 chữ cái viết thường
  - Phải có ít nhất 1 chữ cái viết hoa
- **confirmPassword**: phải giống với newPassword

### Response

#### Success (200)

```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

#### Error (400)

```json
{
  "success": false,
  "message": "Validation error",
  "error": {
    "code": "BAD_REQUEST",
    "message": "Current password is incorrect"
  }
}
```

---

## 4. Danh sách người dùng (Chỉ dành cho Admin)

Lấy danh sách người dùng với bộ lọc và phân trang.

### Endpoint

```
GET /api/v1/users/list
```

### Headers

| Tên | Giá trị | Mô tả |
|-----|---------|-------|
| Authorization | Bearer {token} | JWT token xác thực admin |

### Query Parameters

| Tên | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| page | number | Trang hiện tại (mặc định: 1) |
| limit | number | Số lượng bản ghi mỗi trang (mặc định: 10) |
| search | string | Tìm kiếm theo email hoặc tên |
| role | string | Lọc theo vai trò (USER, ADMIN, etc.) |
| verified | boolean | Lọc theo trạng thái xác thực |
| sortBy | string | Sắp xếp theo trường ('createdAt', 'fullName', 'email') |
| sortDirection | string | Hướng sắp xếp ('asc', 'desc') |

### Response

#### Success (200)

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "string",
        "email": "string",
        "fullName": "string",
        "phone": "string | null",
        "role": "string",
        "verified": "boolean",
        "thumbnailId": "number | null",
        "createdAt": "date",
        "updatedAt": "date"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number",
    "pages": "number"
  }
}
```

#### Error (403)

```json
{
  "success": false,
  "message": "Forbidden",
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource"
  }
}
```

---

## 5. Lấy thông tin chi tiết người dùng (Chỉ dành cho Admin)

Lấy thông tin chi tiết của một người dùng theo ID.

### Endpoint

```
GET /api/v1/users/:id
```

### Headers

| Tên | Giá trị | Mô tả |
|-----|---------|-------|
| Authorization | Bearer {token} | JWT token xác thực admin |

### URL Parameters

| Tên | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | string | ID của người dùng cần lấy thông tin |

### Response

#### Success (200)

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "phone": "string | null",
    "role": "string",
    "verified": "boolean",
    "thumbnailId": "number | null",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### Error (404)

```json
{
  "success": false,
  "message": "Not Found",
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

---

## 6. Cập nhật thông tin người dùng (Chỉ dành cho Admin)

Cập nhật thông tin chi tiết của một người dùng theo ID.

### Endpoint

```
PUT /api/v1/users/:id
```

### Headers

| Tên | Giá trị | Mô tả |
|-----|---------|-------|
| Authorization | Bearer {token} | JWT token xác thực admin |
| Content-Type | application/json | Định dạng dữ liệu gửi lên |

### URL Parameters

| Tên | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | string | ID của người dùng cần cập nhật |

### Request Body

```json
{
  "email": "string (tùy chọn)",
  "fullName": "string (tùy chọn)",
  "phone": "string (tùy chọn)",
  "role": "string (tùy chọn)",
  "verified": "boolean (tùy chọn)",
  "thumbnailId": "number | null (tùy chọn)"
}
```

### Validation

- **email**: phải là email hợp lệ
- **fullName**: phải có từ 2-100 ký tự
- **phone**: phải có từ 10-15 chữ số
- **role**: phải là một trong các giá trị hợp lệ (USER, ADMIN, etc.)

### Response

#### Success (200)

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "phone": "string | null",
    "role": "string",
    "verified": "boolean",
    "thumbnailId": "number | null",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### Error (400)

```json
{
  "success": false,
  "message": "Validation error",
  "error": {
    "code": "BAD_REQUEST",
    "message": "Email is invalid"
  }
}
```

#### Error (404)

```json
{
  "success": false,
  "message": "Not Found",
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
``` 