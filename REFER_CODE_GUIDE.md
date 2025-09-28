# Hướng dẫn sử dụng chức năng ReferCode

## Tổng quan

Chức năng ReferCode cho phép người dùng sử dụng mã giới thiệu để kích hoạt free trial 7 ngày khi đăng nhập vào hệ thống.

## Cách hoạt động

### 1. URL với ReferCode

Người dùng truy cập vào URL có chứa tham số `ref`:

```
http://localhost:3000/login?ref=invite-free-trial-ao-2025
```

### 2. Lưu trữ ReferCode

- ReferCode được tự động lưu vào localStorage khi người dùng truy cập trang login
- ReferCode được lưu với key `referCode` trong localStorage

### 3. Xử lý sau khi đăng nhập

- Khi người dùng đăng nhập thành công, hệ thống sẽ tự động kiểm tra localStorage
- Nếu có referCode, hệ thống sẽ gọi API để kích hoạt free trial
- ReferCode được xóa khỏi localStorage sau khi xử lý thành công

## API Endpoints

### POST /api/auth/process-refer-code

Xử lý referCode và kích hoạt free trial cho user đã đăng nhập.

**Request Body:**

```json
{
  "referCode": "invite-free-trial-ao-2025"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Free trial activated successfully",
  "trialEndDate": "2025-01-15T10:30:00.000Z",
  "referCode": "invite-free-trial-ao-2025"
}
```

### POST /api/emai-campaigns/handle-free-trial

Cập nhật thông tin trial cho user và email campaign.

**Request Body:**

```json
{
  "user_id": "user-uuid",
  "code": "invite-free-trial-ao-2025"
}
```

## Cập nhật Database

### Bảng `accounts`

- `trial_end_date`: Ngày kết thúc trial (7 ngày từ ngày kích hoạt)
- `subscription_tier`: "trial"
- `subscription_status`: "trial"
- `last_subscription_update`: Thời gian cập nhật cuối

### Bảng `user_email_campaign`

- `status`: "free_trial"
- `trial_started_at`: Thời gian bắt đầu trial
- `meta.refer_code`: Mã referCode đã sử dụng
- `meta.trial_activated_at`: Thời gian kích hoạt trial

## Các trường hợp xử lý

### 1. User chưa có subscription

- ✅ Kích hoạt free trial thành công
- ✅ Cập nhật status trong user_email_campaign

### 2. User đã có subscription active

- ❌ Trả về lỗi "User already has an active subscription"
- ✅ Xóa referCode khỏi localStorage

### 3. User đã sử dụng trial trước đó

- ❌ Trả về lỗi "User already used a trial"
- ✅ Xóa referCode khỏi localStorage

### 4. ReferCode không hợp lệ

- ❌ Trả về lỗi "ReferCode is required"
- ✅ Không xóa referCode khỏi localStorage

## Testing

### 1. Test URL với ReferCode

```
http://localhost:3000/login?ref=invite-free-trial-ao-2025
```

### 2. Test trang demo

```
http://localhost:3000/test-refer-code
```

### 3. Kiểm tra localStorage

Mở Developer Tools > Application > Local Storage để xem referCode được lưu.

### 4. Kiểm tra Database

Kiểm tra các bảng `accounts` và `user_email_campaign` để xem dữ liệu được cập nhật.

## Files đã tạo/cập nhật

### Files mới:

- `src/lib/utils/referCode.ts` - Utility functions
- `src/component/hook/useReferCode.ts` - Hook xử lý referCode
- `src/component/provider/ReferCodeProvider.tsx` - Provider component
- `src/component/common/ReferCodeDemo.tsx` - Demo component
- `src/app/api/auth/process-refer-code/route.ts` - API endpoint
- `src/app/test-refer-code/page.tsx` - Test page

### Files đã cập nhật:

- `src/component/common/SignIn.tsx` - Thêm xử lý referCode từ URL
- `src/app/layout.tsx` - Thêm ReferCodeProvider
- `src/app/api/emai-campaigns/handle-free-trial/route.ts` - Cập nhật logic

## Lưu ý quan trọng

1. **Bảo mật**: ReferCode được lưu trong localStorage, không nên chứa thông tin nhạy cảm
2. **Validation**: Cần thêm validation phức tạp hơn cho referCode nếu cần
3. **Logging**: Có thể thêm logging để track việc sử dụng referCode
4. **Rate limiting**: Có thể thêm rate limiting cho API endpoints
5. **Error handling**: Cần cải thiện error handling và user feedback
