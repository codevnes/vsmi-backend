# Backend Dự án Website Thị trường Chứng khoán

Đây là phần backend cho dự án website cung cấp thông tin và dịch vụ liên quan đến thị trường chứng khoán.

## Công nghệ sử dụng

*   **Node.js:** Nền tảng runtime JavaScript.
*   **Express.js:** Web framework cho Node.js.
*   **Prisma:** ORM cho Node.js và TypeScript, dùng để tương tác với cơ sở dữ liệu.
*   **PostgreSQL:** Hệ quản trị cơ sở dữ liệu quan hệ.
*   **Nodemon:** Công cụ theo dõi thay đổi trong quá trình phát triển.

## Phát triển

Để bắt đầu phát triển, sử dụng các lệnh sau:

```bash
# Khởi chạy ứng dụng (chạy một lần)
pnpm dev

# Khởi chạy ứng dụng với nodemon (tự động khởi động lại khi có thay đổi)
pnpm dev:watch
```

Nodemon sẽ theo dõi các thay đổi trong thư mục `src` với các file có phần mở rộng `.ts` và `.json`, sau đó tự động khởi động lại ứng dụng khi phát hiện thay đổi.

## Mô tả

Backend này chịu trách nhiệm xử lý logic nghiệp vụ, quản lý dữ liệu người dùng, thông tin cổ phiếu, tin tức, giao dịch, gói đăng ký và các chức năng khác của website.

## Cơ sở dữ liệu

Cấu trúc cơ sở dữ liệu được định nghĩa bằng Prisma schema. Chi tiết về các model và mối quan hệ có thể xem tại file `schema.md`.

Các model chính bao gồm:

*   `User`: Thông tin người dùng và quyền hạn.
*   `Stock`: Thông tin về các mã cổ phiếu.
*   `Category`: Phân loại tin tức/bài viết.
*   `Post`: Bài viết, tin tức.
*   `StockPrice`, `CurrencyPrice`: Dữ liệu giá lịch sử.
*   `EpsRecord`, `PeRecord`, `RoaRoeRecord`, `FinancialRatioRecord`: Các chỉ số tài chính của cổ phiếu.
*   `SubscriptionPlan`, `Subscription`: Quản lý gói đăng ký và người dùng đăng ký.
*   `Watchlist`: Danh sách cổ phiếu theo dõi của người dùng.
*   `Transaction`: Lịch sử giao dịch (mô phỏng hoặc thực tế).
*   `Image`: Quản lý hình ảnh.
*   `Setting`: Cấu hình hệ thống.

## Cấu trúc dự án

backend/
├── src/                           # Mã nguồn chính
│   ├── config/                    # Cấu hình ứng dụng
│   │   ├── database.ts            # Cấu hình Prisma Client
│   │   ├── env.ts                 # Tải biến môi trường từ .env
│   │   ├── redis.ts               # Cấu hình Redis (cho bộ nhớ đệm)
│   │   └── index.ts               # Xuất tất cả cấu hình
│   ├── controllers/               # Xử lý logic HTTP
│   │   ├── auth.controller.ts     # Đăng nhập, đăng ký, xác thực
│   │   ├── user.controller.ts     # Quản lý người dùng
│   │   ├── stock.controller.ts    # Quản lý cổ phiếu
│   │   ├── stockPrice.controller.ts # Quản lý giá cổ phiếu
│   │   ├── currency.controller.ts # Quản lý tiền tệ
│   │   ├── transaction.controller.ts # Quản lý giao dịch
│   │   ├── subscription.controller.ts # Quản lý gói đăng ký
│   │   ├── post.controller.ts     # Quản lý bài viết
│   │   ├── category.controller.ts # Quản lý danh mục
│   │   ├── watchlist.controller.ts # Quản lý danh sách theo dõi
│   │   ├── setting.controller.ts  # Quản lý cài đặt
│   │   ├── image.controller.ts    # Quản lý hình ảnh
│   │   └── index.ts               # Xuất tất cả controller
│   ├── middlewares/               # Middleware Express
│   │   ├── auth.middleware.ts     # Kiểm tra JWT và phân quyền
│   │   ├── error.middleware.ts    # Xử lý lỗi toàn cục
│   │   ├── validation.middleware.ts # Xác thực dữ liệu đầu vào
│   │   ├── rateLimit.middleware.ts # Giới hạn tốc độ yêu cầu
│   │   └── index.ts               # Xuất tất cả middleware
│   ├── models/                    # Định nghĩa model (tích hợp Prisma)
│   │   └── prisma/                # Schema Prisma
│   │       └── schema.prisma      # Schema từ bạn cung cấp
│   ├── routes/                    # Định nghĩa API routes
│   │   ├── auth.routes.ts         # Tuyến API đăng nhập, đăng ký
│   │   ├── user.routes.ts         # Tuyến API người dùng
│   │   ├── stock.routes.ts        # Tuyến API cổ phiếu
│   │   ├── stockPrice.routes.ts   # Tuyến API giá cổ phiếu
│   │   ├── currency.routes.ts     # Tuyến API tiền tệ
│   │   ├── transaction.routes.ts  # Tuyến API giao dịch
│   │   ├── subscription.routes.ts # Tuyến API gói đăng ký
│   │   ├── post.routes.ts         # Tuyến API bài viết
│   │   ├── category.routes.ts     # Tuyến API danh mục
│   │   ├── watchlist.routes.ts    # Tuyến API danh sách theo dõi
│   │   ├── setting.routes.ts      # Tuyến API cài đặt
│   │   ├── image.routes.ts        # Tuyến API hình ảnh
│   │   └── index.ts               # Tổng hợp tất cả tuyến
│   ├── services/                  # Logic nghiệp vụ
│   │   ├── auth.service.ts        # Logic xác thực
│   │   ├── user.service.ts        # Logic quản lý người dùng
│   │   ├── stock.service.ts       # Logic quản lý cổ phiếu
│   │   ├── stockPrice.service.ts  # Logic quản lý giá cổ phiếu
│   │   ├── currency.service.ts    # Logic quản lý tiền tệ
│   │   ├── transaction.service.ts # Logic quản lý giao dịch
│   │   ├── subscription.service.ts # Logic quản lý gói đăng ký
│   │   ├── post.service.ts        # Logic quản lý bài viết
│   │   ├── category.service.ts    # Logic quản lý danh mục
│   │   ├── watchlist.service.ts   # Logic quản lý danh sách theo dõi
│   │   ├── setting.service.ts     # Logic quản lý cài đặt
│   │   ├── image.service.ts       # Logic quản lý hình ảnh
│   │   └── index.ts               # Xuất tất cả service
│   ├── utils/                     # Tiện ích chung
│   │   ├── logger.ts              # Ghi log (winston/pino)
│   │   ├── response.ts            # Chuẩn hóa phản hồi API
│   │   ├── error.ts               # Định nghĩa lỗi tùy chỉnh
│   │   ├── crypto.ts              # Mã hóa (bcrypt, mã hóa phone)
│   │   ├── redis.ts               # Tiện ích Redis (bộ nhớ đệm)
│   │   └── index.ts               # Xuất tất cả util
│   ├── types/                     # Định nghĩa kiểu TypeScript
│   │   ├── auth.types.ts          # Kiểu cho xác thực
│   │   ├── user.types.ts          # Kiểu cho người dùng
│   │   ├── stock.types.ts         # Kiểu cho cổ phiếu
│   │   ├── transaction.types.ts   # Kiểu cho giao dịch
│   │   ├── image.types.ts         # Kiểu cho hình ảnh
│   │   └── index.ts               # Xuất tất cả kiểu
│   ├── app.ts                     # Khởi tạo ứng dụng Express
│   └── index.ts                   # Entry point (server khởi động)
├── prisma/                        # Quản lý Prisma
│   ├── migrations/                # Tệp di chuyển cơ sở dữ liệu
│   └── schema.prisma             # Schema Prisma bạn cung cấp
├── tests/                         # Tệp kiểm thử
│   ├── unit/                      # Kiểm thử đơn vị
│   │   ├── services/              # Kiểm thử service
│   │   └── controllers/           # Kiểm thử controller
│   ├── integration/               # Kiểm thử tích hợp
│   │   ├── auth.test.ts           # Kiểm thử API xác thực
│   │   ├── user.test.ts           # Kiểm thử API người dùng
│   │   ├── stock.test.ts          # Kiểm thử API cổ phiếu
│   │   └── image.test.ts          # Kiểm thử API hình ảnh
│   └── setup.ts                   # Cấu hình kiểm thử
├── docs/                          # Tài liệu API
│   └── swagger.yaml               # Định nghĩa OpenAPI/Swagger
├── .env                           # Biến môi trường
├── .env.example                   # Mẫu biến môi trường
├── .gitignore                     # Tệp bỏ qua Git
├── package.json                   # Quản lý phụ thuộc
├── tsconfig.json                  # Cấu hình TypeScript
└── README.md                      # Tài liệu dự án# vsmi-backend
