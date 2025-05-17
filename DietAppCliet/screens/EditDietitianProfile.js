import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import { BASE_URL } from '../src/constants';

const EditDietitianProfile = ({ navigation }) => {
  const [about, setAbout] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [serviceDiets, setServiceDiets] = useState('');
  const [image, setImage] = useState(null);
  const [dietTypes, setDietTypes] = useState([]);
  const [selectedDietTypes, setSelectedDietTypes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [existingProfile, setExistingProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, dietTypesRes, certificatesRes] = await Promise.all([
          api.get('/dietitian/profile'),
          api.get('/diettypemanagement/diet-types'),
          api.get('/dietitian/certificates'),
        ]);

        const data = profileRes.data;
        setExistingProfile(data);
        setAbout(data.about || '');
        setClinicName(data.clinicName || '');
        setWorkHours(data.workHours || '');
        setSpecialties(Array.isArray(data.specialties) ? data.specialties.join(', ') : '');
        setServiceDiets(Array.isArray(data.serviceDiets) ? data.serviceDiets.join(', ') : '');
        setSelectedDietTypes(data.dietTypes?.map(dt => dt.id) || []);
        setDietTypes(dietTypesRes.data);
        setCertificates(certificatesRes.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        Alert.alert('Hata', 'Veriler alınamadı.');
      }
    };
    fetchData();
  }, []);

  const toggleDietType = (id) => {
    setSelectedDietTypes(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('İzin Gerekli', 'Fotoğraf yüklemek için izin vermelisiniz.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('about', about);
    formData.append('specialties', specialties);
    formData.append('workHours', workHours);
    formData.append('clinicName', clinicName);
    formData.append('serviceDiets', serviceDiets);
    selectedDietTypes.forEach(id => {
      formData.append('dietTypeIds', id);
    });
    if (image) {
      formData.append('profilePhoto', {
        uri: image.uri,
        name: image.fileName || 'profile.jpg',
        type: image.mimeType || 'image/jpeg',
      });
    }
    try {
      if (existingProfile) {
        await api.put('/dietitian/profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Alert.alert('Başarılı', 'Profil güncellendi.');
      } else {
        await api.post('/dietitian/profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Alert.alert('Başarılı', 'Profil oluşturuldu.');
      }
      navigation.replace('DietitianDrawer');
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert('Hata', 'Profil kaydedilirken bir sorun oluştu.');
    }
  };

  const deleteCertificate = async (id) => {
    try {
      await api.delete(`/dietitian/certificates/${id}`);
      setCertificates(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      Alert.alert('Hata', 'Sertifika silinemedi.');
    }
  };

  const uploadCertificate = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.canceled || !result.assets.length) return;

    const file = result.assets[0];
    const formData = new FormData();
    formData.append('certificateName', file.name);
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || 'application/pdf',
    });

    // Gerekli zorunlu alanlara boş olmayan değer ver
    formData.append('dateReceived', new Date().toISOString());
    formData.append('qualificationUrl', 'https://example.com');
    formData.append('issuer', 'Bilinmiyor');

    const res = await api.post('/dietitian/certificates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const newCert = res.data;
    setCertificates(prev => [...prev, { id: newCert.id, certificateName: file.name }]);
    Alert.alert('Başarılı', 'Sertifika yüklendi.');
  } catch (err) {
    console.error(err.response?.data || err.message);
    Alert.alert('Hata', 'Sertifika yüklenemedi.');
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#2563eb" />
      </TouchableOpacity>
      <Text style={styles.title}>🗒️ Profil Bilgileri</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image || existingProfile?.profilePhotoPath ? (
          <Image source={{ uri: image ? image.uri : `${BASE_URL}/${existingProfile?.profilePhotoPath}` }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>📷 Fotoğraf Seç</Text>
        )}
      </TouchableOpacity>
      <TextInput style={styles.input} placeholder="🏥 Klinik Adı" value={clinicName} onChangeText={setClinicName} />
      <TextInput style={styles.input} placeholder="🕒 Çalışma Saatleri" value={workHours} onChangeText={setWorkHours} />
      <TextInput style={styles.input} placeholder="🎓 Uzmanlıklar (virgülle ayır)" value={specialties} onChangeText={setSpecialties} />
      <TextInput style={styles.input} placeholder="🥗 Verilen Diyet Türleri (virgülle ayır)" value={serviceDiets} onChangeText={setServiceDiets} />
      <TextInput style={[styles.input, { height: 100 }]} placeholder="📾 Hakkınızda" value={about} onChangeText={setAbout} multiline />

      <Text style={styles.label}>📋 Uzman Olduğunuz Diyet Tipleri</Text>
      {dietTypes.map(dt => (
        <TouchableOpacity
          key={dt.id}
          style={[styles.checkbox, selectedDietTypes.includes(dt.id) && styles.checkboxSelected]}
          onPress={() => toggleDietType(dt.id)}>
          <Text style={styles.checkboxLabel}>{dt.title}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>📄 Sertifikalarınız</Text>
      {certificates.map(item => (
        <View key={item.id} style={styles.certItem}>
          <Text>{item.certificateName}</Text>
          <TouchableOpacity onPress={() => deleteCertificate(item.id)}>
            <Ionicons name="trash" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={[styles.saveButton, { backgroundColor: '#10b981' }]} onPress={uploadCertificate}>
        <Text style={styles.saveButtonText}>📤 Sertifika Yükle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>💾 Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditDietitianProfile;

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#f8fafc' },
  backButton: { marginBottom: 10, alignSelf: 'flex-start' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#1e293b' },
  input: { backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderWidth: 1, padding: 12, borderRadius: 10, marginBottom: 16, fontSize: 15 },
  imagePicker: { height: 180, backgroundColor: '#e2e8f0', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  image: { width: '100%', height: '100%', borderRadius: 12 },
  imageText: { color: '#475569', fontSize: 16 },
  saveButton: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#1e293b' },
  checkbox: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#94a3b8', marginBottom: 8 },
  checkboxSelected: { backgroundColor: '#dbeafe', borderColor: '#2563eb' },
  checkboxLabel: { color: '#334155' },
  certItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 8 },
});
