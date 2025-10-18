import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@pomodoro_history';

export async function saveSession(mode) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const session = { mode, date: today, time: now.toLocaleTimeString() };

  const old = await AsyncStorage.getItem(KEY);
  const list = old ? JSON.parse(old) : [];
  list.push(session);

  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function getSessionHistory() {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}
