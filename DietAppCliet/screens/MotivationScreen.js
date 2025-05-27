import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CalorieBurnScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>💪 motivastion Özelliği Burada Gösterilecek</Text>
    </View>
  );
};

export default CalorieBurnScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
