// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../api';
import { storeToken } from '../utils/storage';
import { getRoleFromToken } from '../utils/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen e-posta ve şifre giriniz.');
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        Email: email,
        Password: password,
      });

      const token = response.data.token;
      await storeToken(token);

      const role = getRoleFromToken(token);
      console.log('Kullanıcı rolü:', role);

      if (role === 'Danisan') {
        navigation.replace('CheckForms'); // ← Danışan ise form kontrol ekranına
      } else if (role === 'Diyetisyen') {
        navigation.replace('DietitianDrawer');
      } else {
        Alert.alert('Bilinmeyen Rol', 'Giriş başarılı ancak rol tanımlı değil.');
        navigation.replace('Login');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert('Giriş Hatası', 'E-posta veya şifre hatalı olabilir.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <Text style={styles.title}>🩺 DietApp</Text>
        <Text style={styles.subtitle}>Hoş geldiniz! Lütfen giriş yapın.</Text>

        <TextInput
          style={styles.input}
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <Text style={styles.linkText}>Hesabınız yok mu?</Text>

        <TouchableOpacity
          style={styles.altButton}
          onPress={() => navigation.replace('Register')}
        >
          <Text style={styles.altButtonText}>👤 Danışan Kaydı</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.altButton}
          onPress={() => navigation.replace('RegisterDietitian')}
        >
          <Text style={styles.altButtonText}>🧑‍⚕️ Diyetisyen Kaydı</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    textAlign: 'center',
    color: '#444',
    marginBottom: 10,
    fontSize: 15,
  },
  altButton: {
    backgroundColor: '#e2e8f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  altButtonText: {
    color: '#1e293b',
    fontSize: 15,
    fontWeight: '500',
  },
});
