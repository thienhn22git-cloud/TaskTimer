import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function TimerDisplay({ secondsLeft }) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  return (
    <Text style={styles.timerText}>
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </Text>
  );
}

const styles = StyleSheet.create({
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
  },
});
