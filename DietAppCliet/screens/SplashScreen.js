import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { getToken } from '../utils/storage';
import { getRoleFromToken } from '../utils/auth';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLogin = async () => {
      const token = await getToken();
      console.log("TOKEN:", token);

      if (token) {
        const role = getRoleFromToken(token);
        if (role === 'Danisan') {
          navigation.replace('Dashboard');
        } else if (role === 'Diyetisyen') {
          navigation.replace('DietitianPanel');
        } else {
          navigation.replace('Login');
        }
      } else {
        navigation.replace('Login');
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={{ marginTop: 12, color: '#64748b' }}>Giriş kontrol ediliyor...</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
