import React, { useEffect } from 'react';
import { Alert } from 'react-native';

const PatientsScreen = ({ navigation }) => {
  useEffect(() => {
    Alert.alert('Yakında!', 'Danışanlar bölümü henüz aktif değil.');
    navigation.goBack();
  }, []);

  return null;
};

export default PatientsScreen;
