import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useReminder } from '../context/ReminderContext';

const SuHatirlaticiEkrani = () => {
  const { isReminderActive, setIsReminderActive } = useReminder();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💧 Su Hatırlatıcı</Text>

      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: isReminderActive ? '#4CAF50' : '#f44336' },
          ]}
        />
        <Text style={styles.statusText}>
          {isReminderActive ? 'Hatırlatma Aktif 🟢' : 'Hatırlatma Kapalı 🔴'}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isReminderActive ? '#f44336' : '#4CAF50' },
        ]}
        onPress={() => setIsReminderActive(!isReminderActive)}
      >
        <Text style={styles.buttonText}>
          {isReminderActive ? 'Hatırlatmayı Kapat' : 'Hatırlatmayı Aç'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuHatirlaticiEkrani;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  statusText: {
    fontSize: 18,
    color: '#555',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
