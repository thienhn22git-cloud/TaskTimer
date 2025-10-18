import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function ControlButtons({ isRunning, start, stop, reset }) {
  return (
    <View style={styles.row}>
      {isRunning ? (
        <Button title="Pause" onPress={stop} color="#dc3545" />
      ) : (
        <Button title="Start" onPress={start} color="#28a745" />
      )}
      <Button title="Reset" onPress={reset} color="#007bff" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginVertical: 10 },
});
