# 🍅 TaskTimer - Pomodoro App (React Native + Expo)

## 📖 Giới thiệu
**TaskTimer** là một ứng dụng Pomodoro cơ bản được xây dựng bằng **React Native (Expo)**.  
Ứng dụng giúp bạn quản lý thời gian làm việc và nghỉ ngơi hiệu quả, đồng thời lưu lại lịch sử các phiên để theo dõi năng suất cá nhân.

---

## 🚀 Tính năng chính
- ⏱️ **3 chế độ thời gian:**
  - Pomodoro (25 phút)
  - Short Break (5 phút)
  - Long Break (15 phút)
- 📝 **Đặt tên phiên làm việc** trước khi bắt đầu.
- 🔔 **Thông báo và rung nhẹ** khi kết thúc phiên.
- 💾 **Lưu lịch sử phiên** (tên, chế độ, thời gian kết thúc) vào **AsyncStorage**.
- 🔄 **Kết thúc phiên thủ công** và lưu lại kết quả.
- 🕓 **Giữ màn hình luôn sáng** trong khi đếm giờ (expo-keep-awake).

---

## 🧩 Công nghệ & Thư viện sử dụng
- [React Native (Expo)](https://expo.dev/)
- `expo-notifications` - gửi thông báo khi kết thúc phiên  
- `expo-haptics` - phản hồi rung  
- `expo-keep-awake` - giữ màn hình sáng  
- `@react-native-async-storage/async-storage` - lưu lịch sử phiên làm việc