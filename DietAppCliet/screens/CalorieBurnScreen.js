import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { initDB, insertOrUpdateStepData } from '../utils/database';
import * as SQLite from 'expo-sqlite';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const CalorieBurnScreen = () => {
  const [stepCount, setStepCount] = useState(0);
  const [calories, setCalories] = useState(0);
  const [log, setLog] = useState([]);

  const lastStepTime = useRef(0);
  const minStepInterval = 250;
  const peakThreshold = 0.6;
  const lastAcceleration = useRef(0);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        const db = await SQLite.openDatabaseAsync('steps.db');
        const today = new Date().toISOString().split('T')[0];
        const result = await db.getFirstAsync(
          'SELECT steps, calories FROM step_data WHERE date = ?',
          [today]
        );
        if (result) {
          setStepCount(result.steps);
          setCalories(result.calories.toFixed(2));
        }
      } catch (error) {
        console.error('DB Başlatma Hatası:', error);
      }
    };
    setup();
  }, []);

  useEffect(() => {
    const subscription = Accelerometer.addListener(async ({ x, y, z }) => {
      const now = Date.now();
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const delta = Math.abs(magnitude - lastAcceleration.current);
      lastAcceleration.current = magnitude;

      if (delta > peakThreshold && now - lastStepTime.current > minStepInterval) {
        lastStepTime.current = now;
        setStepCount(prev => {
          const newStepCount = prev + 1;
          const kcal = (newStepCount * 0.04).toFixed(2);
          setCalories(kcal);
          const today = new Date().toISOString().split('T')[0];
          insertOrUpdateStepData(today, newStepCount, kcal);
          const entry = `🕒 ${new Date().toLocaleTimeString()} - Adım: ${newStepCount}, Kalori: ${kcal}`;
          setLog(prev => [entry, ...prev]);
          return newStepCount;
        });
      }
    });

    Accelerometer.setUpdateInterval(50);
    return () => subscription.remove();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={['#6366f1', '#3b82f6']} style={styles.header}>
        <Text style={styles.headerTitle}>Adım ve Kalori Takibi</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Ionicons name="walk-outline" size={28} color="#10b981" />
        <Text style={styles.label}>Toplam Adım</Text>
        <Text style={styles.value}>{stepCount}</Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="flame-outline" size={28} color="#ef4444" />
        <Text style={styles.label}>Yakılan Kalori</Text>
        <Text style={styles.value}>{calories} kcal</Text>
      </View>

      
    </ScrollView>
  );
};

export default CalorieBurnScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: '#f1f5f9',
    flexGrow: 1
  },
  header: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold'
  },
  card: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  },
  label: {
    fontSize: 16,
    color: '#334155',
    marginTop: 8
  },
  value: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 4
  },
  logTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
    color: '#475569'
  },
  logEntry: {
    fontSize: 13,
    color: '#64748b',
    marginHorizontal: 16,
    marginBottom: 4
  }
});
