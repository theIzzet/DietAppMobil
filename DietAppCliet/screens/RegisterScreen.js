import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView
} from 'react-native';
import api from '../api';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor.");
      return;
    }

    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Surname', surname);
    formData.append('Username', username);
    formData.append('Email', email);
    formData.append('Password', password);
    formData.append('ConfirmPassword', confirmPassword);

    try {
      const res = await api.post('/auth/register/danisan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Alert.alert("✅ Kayıt Başarılı", "Şimdi giriş yapabilirsiniz.");
      navigation.replace('Login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      const msg = err.response?.data?.errors?.ConfirmPassword?.join('\n') ||
                  err.response?.data?.message ||
                  "Kayıt sırasında bir hata oluştu.";
      Alert.alert("Kayıt Hatası", msg);
    }
  };

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 Danışan Kayıt</Text>

      <TextInput style={styles.input} placeholder="Ad" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Soyad" value={surname} onChangeText={setSurname} />
      <TextInput style={styles.input} placeholder="Kullanıcı Adı" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="E-posta" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Şifre" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Şifre Tekrar" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
        <Text style={styles.submitButtonText}>Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.replace('Login')}>
        <Text style={styles.linkButtonText}>← Giriş Ekranına Dön</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    padding: 24,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#64748b',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
