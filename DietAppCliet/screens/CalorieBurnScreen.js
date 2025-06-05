import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, PermissionsAndroid, Platform, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { initDB, insertOrUpdateStepData } from '../utils/database';
import * as SQLite from 'expo-sqlite';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BleManager } from "react-native-ble-plx";
import base64 from "react-native-base64";


const manager = new BleManager();

const CalorieBurnScreen = () => {
  const [stepCount, setStepCount] = useState(0);
  const [calories, setCalories] = useState(0);
  const [log, setLog] = useState([]);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [syncedFromWatch, setSyncedFromWatch] = useState(false);

  const lastStepTime = useRef(0);
  const minStepInterval = 250;
  const peakThreshold = 0.6;
  const lastAcceleration = useRef(0);


  useEffect(() => {
      if (Platform.OS === "android") {
        requestPermissions();
      }
      return () => {
        manager.destroy();
      };
  }, []);

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

  const requestPermissions = async () => {
    if (Platform.Version >= 31) {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    } else {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    }
  };

  const scannedDevices = new Map();

  const scanDevices = () => {
    setDevices([]);
    scannedDevices.clear();

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Tarama hatası:", error);
        return;
      }

      if (device?.name && !scannedDevices.has(device.id)) {
        scannedDevices.set(device.id, device);
        setDevices((prev) => [...prev, device]);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000); // 10 saniye tarama süresi
  };

  const connectToDevice = async (device) => {
    try {
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);
      Alert.alert("Bağlantı Sağlandı:", connected.name);
    } catch (err) {
      Alert.alert("Bağlantı hatası:", err);
    }
  };

  const readStepCount = async () => {

    if (!connectedDevice) {
      Alert.alert("Cihaz bağlı değil");
      return;
    }

    if (syncedFromWatch) {
      Alert.alert("Zaten senkronize edildi");
      return;
    }

    try {
      await connectedDevice.discoverAllServicesAndCharacteristics();
      const services = await connectedDevice.services();

      for (const service of services) {
        const characteristics = await service.characteristics();

        for (const char of characteristics) {

          if (char.uuid === "0000fea1-0000-1000-8000-00805f9b34fb") {
            if (char.isReadable) {
              const data = await char.read();
              const decoded = base64.decode(data.value);
              const bytes = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
              const fetchedStepCount = bytes[1] + (bytes[2] << 8);
              
              setStepCount(prev => {
                const combined = prev + fetchedStepCount;
                const kcal = (combined * 0.04).toFixed(2);
                setCalories(kcal);
                return combined;
              });

              setSyncedFromWatch(true);
            }
          }
        }
      }
    } catch (error) {
      console.error("readStepCount Hatası:", error);
    }
  };

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

      <TouchableOpacity style={styles.buttonContainer} onPress={scanDevices} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Yakındaki Cihazları bul</Text>
      </TouchableOpacity>

      { devices && (
        <View style={styles.card}>
          {devices.map((item) => (
            <View
              key={item.id}
              style={{
                padding: 10,
                marginVertical: 5,
                borderWidth: 1,
                borderRadius: 5,
              }}
            >
              <TouchableOpacity onPress={() => connectToDevice(item)}>
                <Text>
                  {item.name} ({item.id})
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.buttonContainer} onPress={readStepCount} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Adımları Senkronize Et</Text>
      </TouchableOpacity>
      
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
  },
  buttonContainer: {
    backgroundColor: '#6A42C2',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, 
    marginVertical: 10,
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
