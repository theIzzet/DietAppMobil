import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import api from '../api';

const RegisterDietitianScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [graduation, setGraduation] = useState(null);
  const [transcript, setTranscript] = useState(null);

  const pickDocument = async (setter) => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.assets && result.assets.length > 0) {
      setter(result.assets[0]);
    }
  };

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
    formData.append('PhoneNumber', phoneNumber);
    formData.append('Password', password);
    formData.append('ConfirmPassword', confirmPassword);

    if (graduation) {
      formData.append('GraduationCertificate', {
        uri: graduation.uri,
        name: graduation.name,
        type: graduation.mimeType || 'application/pdf'
      });
    }

    if (transcript) {
      formData.append('Transkript', {
        uri: transcript.uri,
        name: transcript.name,
        type: transcript.mimeType || 'application/pdf'
      });
    }

    try {
      await api.post('/auth/register/diyetisyen', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Alert.alert('Kayıt Başarılı', 'Şimdi giriş yapabilirsiniz.');
      navigation.replace('Login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      const msg = err.response?.data?.message || "Kayıt sırasında bir hata oluştu.";
      Alert.alert("Kayıt Hatası", msg);
    }
  };

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧑‍⚕️ Diyetisyen Kayıt</Text>

      <TextInput style={styles.input} placeholder="Ad" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Soyad" value={surname} onChangeText={setSurname} />
      <TextInput style={styles.input} placeholder="Kullanıcı Adı" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="E-posta" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Telefon" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Şifre" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Şifre Tekrar" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.fileButton} onPress={() => pickDocument(setGraduation)}>
        <Text style={styles.fileButtonText}>📄 Mezuniyet Belgesi Seç</Text>
      </TouchableOpacity>
      {graduation && <Text style={styles.fileName}>{graduation.name}</Text>}

      <TouchableOpacity style={styles.fileButton} onPress={() => pickDocument(setTranscript)}>
        <Text style={styles.fileButtonText}>📄 Transkript Belgesi Seç</Text>
      </TouchableOpacity>
      {transcript && <Text style={styles.fileName}>{transcript.name}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
        <Text style={styles.submitButtonText}>Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.replace('Login')}>
        <Text style={styles.backButtonText}>← Giriş Ekranına Dön</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterDietitianScreen;

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
  fileButton: {
    backgroundColor: '#e0f2fe',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 6,
  },
  fileButtonText: {
    color: '#0369a1',
    fontWeight: '500',
  },
  fileName: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 10,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#64748b',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
