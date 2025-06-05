// screens/CheckFormsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import api from '../api';

const CheckFormsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  // Derin objeleri bile kontrol eden fonksiyon
  const hasAnyValue = (obj) => {
    if (!obj || typeof obj !== 'object') return false;
    return Object.values(obj).some((value) => {
      if (value === null || value === '') return false;
      if (typeof value === 'object') return hasAnyValue(value); // nested obj varsa kontrol et
      return true;
    });
  };

  useEffect(() => {
    const checkForms = async () => {
      try {
        const res = await api.get('/patient/all');
        const data = res.data;

        const requiredSections = [
          'personalInfo',
          'physicalActivity',
          'lifestyle',
          'foodHabit',
          'goal',
          'medicalHistory'
        ];

        console.log('🔎 Gelen veri:', JSON.stringify(data, null, 2));
        requiredSections.forEach(section => {
          console.log(`${section} boş mu?`, !hasAnyValue(data?.[section]));
        });

        const isEmpty = requiredSections.every(section => !hasAnyValue(data?.[section]));

        if (isEmpty) {
          console.log('⛔ Form boş, FillForms sayfasına yönlendiriliyor...');
          navigation.replace('FillForms');
        } else {
          console.log('✅ Form dolu, Dashboard sayfasına yönlendiriliyor...');
          navigation.replace('Dashboard');
        }
      } catch (err) {
        console.error('❌ Form kontrol hatası:', err);
        Alert.alert('Hata', 'Form kontrolü sırasında bir hata oluştu.');
        navigation.replace('Dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkForms();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={styles.text}>Form durumu kontrol ediliyor...</Text>
    </View>
  );
};

export default CheckFormsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#334155',
  },
});
