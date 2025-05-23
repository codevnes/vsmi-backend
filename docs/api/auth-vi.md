# Tài Liệu API Xác Thực (Authentication)

Tài liệu này cung cấp chi tiết về các endpoint API liên quan đến xác thực người dùng trong hệ thống.

## URL Cơ Sở

```
/api/v1/auth
```

---

## 1. Đăng Ký Tài Khoản

Đăng ký một tài khoản người dùng mới trong hệ thống.

- **URL:** `/register`
- **Phương Thức:** `POST`
- **Yêu Cầu Xác Thực:** Không

### Yêu Cầu Dữ Liệu

```json
{
  "email": "example@domain.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "fullName": "Nguyễn Văn A",
  "phone": "+84901234567" // Tùy chọn
}
```

### Điều Kiện Hợp Lệ

| Trường | Điều Kiện |
|--------|-----------|
| email | Phải là địa chỉ email hợp lệ |
| password | - Phải có ít nhất 8 ký tự<br>- Phải chứa ít nhất một chữ số<br>- Phải chứa ít nhất một chữ cái viết thường<br>- Phải chứa ít nhất một chữ cái viết hoa |
| confirmPassword | Phải trùng khớp với `password` |
| fullName | Không được để trống |
| phone | Định dạng số điện thoại hợp lệ (tùy chọn) |

### Phản Hồi Thành Công (201 Created)

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "uuid-example",
    "email": "example@domain.com",
    "fullName": "Nguyễn Văn A",
    "phone": "+84901234567",
    "role": "USER",
    "verified": false,
    "thumbnailId": null,
    "createdAt": "2023-05-21T12:00:00.000Z",
    "updatedAt": "2023-05-21T12:00:00.000Z"
  }
}
```

### Phản Hồi Lỗi

#### 400 Bad Request
```json
{
  "status": "error",
  "message": "Passwords do not match",
  "errors": [
    {
      "field": "password",
      "message": "Passwords do not match"
    }
  ]
}
```

#### 409 Conflict
```json
{
  "status": "error",
  "message": "Email already in use",
  "errors": [
    {
      "field": "email",
      "message": "Email already in use"
    }
  ]
}
```

#### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Database connection error. Please try again later."
}
```

---

## 2. Đăng Nhập

Xác thực người dùng và cấp token JWT để sử dụng cho các API khác.

- **URL:** `/login`
- **Phương Thức:** `POST`
- **Yêu Cầu Xác Thực:** Không

### Yêu Cầu Dữ Liệu

```json
{
  "email": "example@domain.com",
  "password": "Password123"
}
```

### Điều Kiện Hợp Lệ

| Trường | Điều Kiện |
|--------|-----------|
| email | Phải là địa chỉ email hợp lệ |
| password | Không được để trống |

### Phản Hồi Thành Công (200 OK)

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-example",
      "email": "example@domain.com",
      "fullName": "Nguyễn Văn A",
      "phone": "+84901234567",
      "role": "USER",
      "verified": false,
      "thumbnailId": null,
      "createdAt": "2023-05-21T12:00:00.000Z",
      "updatedAt": "2023-05-21T12:00:00.000Z"
    }
  }
}
```

### Phản Hồi Lỗi

#### 400 Bad Request
```json
{
  "status": "error",
  "message": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

#### 404 Not Found
```json
{
  "status": "error",
  "message": "User not found"
}
```

#### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

#### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Database connection error. Please try again later."
}
```

---

## 3. Xác Thực Token

Kiểm tra tính hợp lệ của token JWT và trả về thông tin người dùng.

- **URL:** `/validate-token`
- **Phương Thức:** `POST`
- **Yêu Cầu Xác Thực:** Tùy chọn

### Yêu Cầu Dữ Liệu

#### Phương Thức 1: Gửi token trong header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Phương Thức 2: Gửi token trong body
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Phản Hồi Thành Công (200 OK)

```json
{
  "status": "success",
  "message": "Token is valid",
  "data": {
    "id": "uuid-example",
    "email": "example@domain.com",
    "role": "USER"
  }
}
```

### Phản Hồi Lỗi

#### 400 Bad Request
```json
{
  "status": "error",
  "message": "Token is required"
}
```

#### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Invalid token"
}
```

---

## Sử Dụng Token Authentication

Sau khi đăng nhập thành công, bạn sẽ nhận được token JWT. Sử dụng token này trong header của mọi yêu cầu API cần xác thực:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Tất cả các API được bảo vệ sẽ yêu cầu token này để xác thực người dùng. Nếu token hết hạn hoặc không hợp lệ, API sẽ trả về lỗi `401 Unauthorized`.

### Vòng Đời của Token

- Token có thời hạn được cấu hình trong biến môi trường `JWT_EXPIRES_IN`
- Khi token hết hạn, người dùng sẽ cần đăng nhập lại để nhận token mới
- Không có cơ chế refresh token nào được cung cấp trong phiên bản API hiện tại

### Mã Lỗi Xác Thực Phổ Biến

| Mã Lỗi HTTP | Mô Tả |
|-------------|-------|
| 401 Unauthorized | Token không hợp lệ, hết hạn hoặc không được cung cấp |
| 403 Forbidden | Token hợp lệ nhưng không có quyền truy cập vào tài nguyên |

## Quy Trình Xác Thực

1. **Đăng ký tài khoản** sử dụng endpoint `/api/v1/auth/register`
2. **Đăng nhập** sử dụng endpoint `/api/v1/auth/login` để nhận token JWT
3. **Sử dụng token** trong header của các yêu cầu API khác
4. **Kiểm tra tính hợp lệ của token** (tùy chọn) sử dụng endpoint `/api/v1/auth/validate-token` 