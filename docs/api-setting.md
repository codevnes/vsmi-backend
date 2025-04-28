# API Cài Đặt Hệ Thống (Settings API)

API cài đặt hệ thống cho phép bạn quản lý các thông số cấu hình của website chứng khoán. API này hỗ trợ lưu trữ và truy xuất các cài đặt như logo, thông tin liên hệ, bài viết nổi bật, cài đặt giao diện, và nhiều cài đặt khác.

## Cấu trúc Setting

Mỗi setting có cấu trúc sau:

| Trường | Kiểu dữ liệu | Mô tả |
|--------|--------------|-------|
| id | String (UUID) | Định danh duy nhất của setting |
| key | String | Khóa định danh (không trùng lặp) |
| value | String | Giá trị của setting |
| description | String (optional) | Mô tả về setting |
| type | String | Kiểu dữ liệu ('text', 'number', 'boolean', 'json', 'image') |
| version | Number | Phiên bản (tự động tăng khi cập nhật) |
| createdAt | Date | Thời điểm tạo |
| updatedAt | Date | Thời điểm cập nhật gần nhất |

## Các nhóm cài đặt gợi ý

Đề xuất sử dụng các nhóm cài đặt sau (theo định dạng `group.key`):

### Cài đặt chung (general)

```
general.site_name - Tên website
general.site_title - Tiêu đề website
general.site_description - Mô tả website
general.company_name - Tên công ty
general.company_address - Địa chỉ công ty
general.contact_email - Email liên hệ
general.contact_phone - Số điện thoại liên hệ
general.copyright - Thông tin bản quyền
```

### Cài đặt giao diện (ui)

```
ui.theme - Giao diện mặc định (light/dark)
ui.accent_color - Màu chủ đạo
ui.font_family - Font chữ
ui.logo - URL logo chính
ui.favicon - URL favicon
ui.background_image - URL ảnh nền
```

### Cài đặt mạng xã hội (social)

```
social.facebook - URL Facebook
social.twitter - URL Twitter
social.youtube - URL YouTube
social.linkedin - URL LinkedIn
social.zalo - URL Zalo
```

### Cài đặt trang chủ (homepage)

```
homepage.banner - URL banner trang chủ
homepage.featured_posts - Danh sách ID bài viết nổi bật (JSON)
homepage.featured_stocks - Danh sách mã chứng khoán nổi bật (JSON)
homepage.welcome_message - Thông điệp chào mừng
homepage.market_indices - Danh sách chỉ số thị trường hiển thị (JSON)
```

### Cài đặt thị trường (market)

```
market.default_currency - Tiền tệ mặc định
market.price_decimal_places - Số chữ số thập phân cho giá
market.volume_display - Cách hiển thị khối lượng (original/thousands/millions)
market.default_chart_period - Khoảng thời gian mặc định cho biểu đồ
market.default_indicators - Các chỉ báo kỹ thuật mặc định (JSON)
```

### Cài đặt thông báo (notification)

```
notification.email_template - Mẫu email thông báo (HTML)
notification.price_alert_threshold - Ngưỡng cảnh báo giá (%)
notification.system_announcement - Thông báo hệ thống
notification.maintenance_mode - Chế độ bảo trì (true/false)
```

## Endpoints API

### 1. Lấy tất cả các cài đặt

**Yêu cầu (Request):**

```
GET /api/settings
```

**Quyền:** Admin

**Phản hồi (Response):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "key": "general.site_name",
      "value": "VN Stock Market Analytics",
      "description": "Tên website",
      "type": "text",
      "version": 1,
      "createdAt": "2023-06-01T00:00:00Z",
      "updatedAt": "2023-06-01T00:00:00Z"
    },
    // ...
  ]
}
```

### 2. Lấy cài đặt theo nhóm

**Yêu cầu (Request):**

```
GET /api/settings/group/{group}
```

**Tham số:**
- `group`: Tên nhóm (ví dụ: "general", "ui", "social")

**Quyền:** Đã xác thực

**Phản hồi (Response):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "key": "general.site_name",
      "value": "VN Stock Market Analytics",
      "description": "Tên website",
      "type": "text",
      "version": 1,
      "createdAt": "2023-06-01T00:00:00Z",
      "updatedAt": "2023-06-01T00:00:00Z"
    },
    // ...
  ]
}
```

### 3. Lấy cài đặt theo khóa

**Yêu cầu (Request):**

```
GET /api/settings/{key}
```

**Tham số:**
- `key`: Khóa cài đặt (ví dụ: "general.site_name")

**Quyền:** Đã xác thực

**Phản hồi (Response):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "key": "general.site_name",
    "value": "VN Stock Market Analytics",
    "description": "Tên website",
    "type": "text",
    "version": 1,
    "createdAt": "2023-06-01T00:00:00Z",
    "updatedAt": "2023-06-01T00:00:00Z"
  }
}
```

### 4. Tạo cài đặt mới

**Yêu cầu (Request):**

```
POST /api/settings
```

**Body:**

```json
{
  "key": "general.site_name",
  "value": "VN Stock Market Analytics",
  "description": "Tên website",
  "type": "text"
}
```

**Quyền:** Admin

**Phản hồi (Response):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "key": "general.site_name",
    "value": "VN Stock Market Analytics",
    "description": "Tên website",
    "type": "text",
    "version": 1,
    "createdAt": "2023-06-01T00:00:00Z",
    "updatedAt": "2023-06-01T00:00:00Z"
  }
}
```

### 5. Cập nhật cài đặt

**Yêu cầu (Request):**

```
PUT /api/settings/{key}
```

**Tham số:**
- `key`: Khóa cài đặt (ví dụ: "general.site_name")

**Body:**

```json
{
  "value": "VN Stock Market Analytics Pro",
  "description": "Tên website chính thức",
  "type": "text"
}
```

**Quyền:** Admin

**Phản hồi (Response):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "key": "general.site_name",
    "value": "VN Stock Market Analytics Pro",
    "description": "Tên website chính thức",
    "type": "text",
    "version": 2,
    "createdAt": "2023-06-01T00:00:00Z",
    "updatedAt": "2023-06-02T00:00:00Z"
  }
}
```

### 6. Xóa cài đặt

**Yêu cầu (Request):**

```
DELETE /api/settings/{key}
```

**Tham số:**
- `key`: Khóa cài đặt (ví dụ: "general.site_name")

**Quyền:** Admin

**Phản hồi (Response):**

```json
{
  "success": true,
  "message": "Setting with key 'general.site_name' deleted successfully"
}
```

### 7. Upsert cài đặt (tạo mới hoặc cập nhật nếu đã tồn tại)

**Yêu cầu (Request):**

```
POST /api/settings/upsert
```

**Body:**

```json
{
  "key": "general.site_name",
  "value": "VN Stock Market Analytics",
  "description": "Tên website",
  "type": "text"
}
```

**Quyền:** Admin

**Phản hồi (Response):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "key": "general.site_name",
    "value": "VN Stock Market Analytics",
    "description": "Tên website",
    "type": "text",
    "version": 1,
    "createdAt": "2023-06-01T00:00:00Z",
    "updatedAt": "2023-06-01T00:00:00Z"
  }
}
```

### 8. Bulk Upsert (nhiều cài đặt cùng lúc)

**Yêu cầu (Request):**

```
POST /api/settings/bulk-upsert
```

**Body:**

```json
{
  "settings": [
    {
      "key": "general.site_name",
      "value": "VN Stock Market Analytics",
      "description": "Tên website",
      "type": "text"
    },
    {
      "key": "general.site_description",
      "value": "Phân tích thị trường chứng khoán Việt Nam",
      "description": "Mô tả website",
      "type": "text"
    }
  ]
}
```

**Quyền:** Admin

**Phản hồi (Response):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here-1",
      "key": "general.site_name",
      "value": "VN Stock Market Analytics",
      "description": "Tên website",
      "type": "text",
      "version": 1,
      "createdAt": "2023-06-01T00:00:00Z",
      "updatedAt": "2023-06-01T00:00:00Z"
    },
    {
      "id": "uuid-here-2",
      "key": "general.site_description",
      "value": "Phân tích thị trường chứng khoán Việt Nam",
      "description": "Mô tả website",
      "type": "text",
      "version": 1,
      "createdAt": "2023-06-01T00:00:00Z",
      "updatedAt": "2023-06-01T00:00:00Z"
    }
  ]
}
```

## Kiểu dữ liệu

API hỗ trợ các kiểu dữ liệu sau:

- **text**: Chuỗi văn bản thông thường
- **number**: Giá trị số (được lưu dưới dạng chuỗi nhưng có thể chuyển đổi sang số)
- **boolean**: Giá trị boolean (true/false, được lưu dưới dạng chuỗi "true" hoặc "false")
- **json**: Dữ liệu JSON (được lưu dưới dạng chuỗi JSON)
- **image**: URL hình ảnh

## Mã lỗi

- **400**: Yêu cầu không hợp lệ
- **401**: Chưa xác thực
- **403**: Không có quyền thực hiện
- **404**: Không tìm thấy cài đặt
- **409**: Xung đột (ví dụ: khóa đã tồn tại)
- **500**: Lỗi server 