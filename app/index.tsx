import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput } from "react-native";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Cấu hình Notifications (Expo SDK 51+)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Index() {
  useKeepAwake();

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("pomodoro");
  const [history, setHistory] = useState<{ name: string; mode: string; date: string; status: string }[]>([]);
  const [sessionName, setSessionName] = useState("");
  const intervalRef = useRef<any>(null);

  // 🕒 Khi đổi chế độ → reset thời gian
  useEffect(() => {
    if (mode === "pomodoro") setSecondsLeft(25 * 60);
    else if (mode === "short") setSecondsLeft(5 * 60);
    else if (mode === "long") setSecondsLeft(15 * 60);
    setIsRunning(false);
  }, [mode]);

  // 📜 Tải lịch sử từ AsyncStorage
  useEffect(() => {
    loadHistory();
  }, []);

  // ⏱️ Bộ đếm thời gian
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            onTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // 🔔 Khi kết thúc phiên (hết giờ)
  const onTimerEnd = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Hết thời gian!",
        body:
          mode === "pomodoro"
            ? "Đã hết phiên làm việc. Nghỉ ngơi đi nào!"
            : "Hết giờ nghỉ, quay lại làm việc nhé!",
      },
      trigger: null,
    });

    await saveHistory(true);
    Alert.alert("Hoàn thành!", "Phiên " + (sessionName || mode) + " đã kết thúc!");
    setIsRunning(false);
  };

  // 🛑 Kết thúc phiên thủ công
  const endSessionManually = async () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      await saveHistory(false);
      Alert.alert("Kết thúc", "Phiên đã được lưu vào lịch sử!");
    } else {
      Alert.alert("Không có phiên đang chạy", "Hãy bắt đầu một phiên trước.");
    }
  };

  // 💾 Lưu lịch sử phiên
  const saveHistory = async (autoEnded: boolean): Promise<void> => {
    const newItem: { name: string; mode: string; date: string; status: string } = {
      name: sessionName || "Không tên",
      mode,
      date: new Date().toLocaleString(),
      status: autoEnded ? "Tự động kết thúc" : "Kết thúc thủ công",
    };
    const updated = [newItem, ...history];
    setHistory(updated);
    await AsyncStorage.setItem("pomodoroHistory", JSON.stringify(updated));
  };

  const loadHistory = async () => {
    const data = await AsyncStorage.getItem("pomodoroHistory");
    if (data) setHistory(JSON.parse(data));
  };

  // 🕓 Định dạng hiển thị thời gian
  const formatTime = (sec: number): string => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍅 Pomodoro Timer</Text>

      {/* Nhập tên phiên */}
      <TextInput
        placeholder="Nhập tên phiên (tuỳ chọn)..."
        placeholderTextColor="#aaa"
        style={styles.input}
        value={sessionName}
        onChangeText={setSessionName}
      />

      {/* Các nút chọn chế độ */}
      <View style={styles.modeButtons}>
        <TouchableOpacity
          style={[styles.modeButton, mode === "pomodoro" && styles.activeButton]}
          onPress={() => setMode("pomodoro")}
        >
          <Text style={styles.buttonText}>Pomodoro (25’)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === "short" && styles.activeButton]}
          onPress={() => setMode("short")}
        >
          <Text style={styles.buttonText}>Short Break (5’)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === "long" && styles.activeButton]}
          onPress={() => setMode("long")}
        >
          <Text style={styles.buttonText}>Long Break (15’)</Text>
        </TouchableOpacity>
      </View>

      {/* Bộ đếm */}
      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>

      {/* Nút Start / Pause */}
      <TouchableOpacity
        style={[styles.button, isRunning ? styles.stopButton : styles.startButton]}
        onPress={() => setIsRunning(!isRunning)}
      >
        <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
      </TouchableOpacity>

      {/* Nút End Session */}
      <TouchableOpacity style={[styles.button, styles.endButton]} onPress={endSessionManually}>
        <Text style={styles.buttonText}>End Session</Text>
      </TouchableOpacity>

      {/* Lịch sử phiên */}
      <Text style={styles.historyTitle}>📖 Lịch sử phiên</Text>
      <FlatList
        data={history}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>{item.name}</Text>
            <Text style={{ color: "#ccc" }}>
              {item.mode} • {item.date}
            </Text>
            <Text style={{ color: "#999", fontSize: 12 }}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: "90%",
    marginBottom: 15,
  },
  modeButtons: {
    flexDirection: "row",
    marginBottom: 20,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  modeButton: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    margin: 5,
  },
  activeButton: {
    backgroundColor: "#d84315",
  },
  timer: {
    color: "white",
    fontSize: 60,
    fontVariant: ["tabular-nums"],
    marginVertical: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#E53935",
  },
  endButton: {
    backgroundColor: "#1976D2",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  historyTitle: {
    color: "#aaa",
    fontSize: 18,
    marginTop: 15,
    marginBottom: 8,
  },
  historyItem: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    width: 300,
  },
});
