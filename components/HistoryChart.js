import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function HistoryChart({ data }) {
  const countsByDate = data.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(countsByDate).slice(-7);
  const values = labels.map((l) => countsByDate[l]);

  if (labels.length === 0) return null;

  return (
    <LineChart
      data={{
        labels,
        datasets: [{ data: values }],
      }}
      width={Dimensions.get('window').width - 40}
      height={220}
      chartConfig={{
        backgroundColor: '#f0f0f0',
        backgroundGradientFrom: '#f0f0f0',
        backgroundGradientTo: '#f0f0f0',
        decimalPlaces: 0,
        color: () => '#007bff',
        labelColor: () => '#333',
      }}
      bezier
      style={{ borderRadius: 16, marginVertical: 20 }}
    />
  );
}
