import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api';
import { BASE_URL } from '../src/constants';
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const DietitianPanel = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        setLoading(true);
        try {
          const res = await api.get('/dietitian/profile');
           console.log("Gelen profil:", res.data);
          setProfile(res.data);
        } catch (err) {
          if (err.response?.status === 404) {
            setProfile(null);
          } else {
            console.error(err.response?.data || err.message);
          }
        } finally {
          setLoading(false);
        }
      };

      loadProfile();

      const backAction = () => {
        navigation.replace('Login');
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      async function prepare() {

        if (Device.isDevice) {
          const { status } = await Notifications.requestPermissionsAsync();

          if (status === "granted") {
            
            const result = await Notifications.getExpoPushTokenAsync();
            
            // console.log("Expo Push Token: ", result.data);

            await api.post('/notification/register-token', {
              expoPushToken: result.data
            });

            
          } else {
            Alert.alert("Bildirim özelliği için lütfen bildirimlere izin verin");
          }
        } else {
          Alert.alert("Bildirim özelliği için lütfen fiziksel cihaz kullanın");
        }
      }

      prepare();

      return () => backHandler.remove();
    }, [])
  );

  if (!loading && profile === null) {
    navigation.replace('EditDietitianProfile');
    return null;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Profil bilgileri getiriliyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🩺 Diyetisyen Paneli</Text>

      {profile?.profilePhotoPath && (
        <Image
          source={{ uri: `${BASE_URL}/${profile.profilePhotoPath}` }}
          style={styles.profileImage}
        />
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🏥 Klinik Bilgisi</Text>
        <View style={styles.line} />
        <Text style={styles.cardText}>🏛️ Klinik Adı: {profile.clinicName || '-'}</Text>
        <Text style={styles.cardText}>⏰ Çalışma Saatleri: {profile.workHours || '-'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎓 Uzmanlıklar</Text>
        <View style={styles.line} />
        <Text style={styles.cardText}>
          {Array.isArray(profile.specialties) ? profile.specialties.join(', ') : '-'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🥗 Verilen Diyet Türleri</Text>
        <View style={styles.line} />
        <Text style={styles.cardText}>
          {Array.isArray(profile.serviceDiets) ? profile.serviceDiets.join(', ') : '-'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 Uzman Olduğu Diyet Tipleri</Text>
        <View style={styles.line} />
        <Text style={styles.cardText}>
          {Array.isArray(profile.dietTypes) ? profile.dietTypes.map(d => d.title).join(', ') : '-'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📝 Hakkımda</Text>
        <View style={styles.line} />
        <Text style={styles.cardText}>{profile.about || '-'}</Text>
      </View>
      <View style={styles.card}>
  <Text style={styles.cardTitle}>📄 Sertifikalar</Text>
  <View style={styles.line} />
  {profile.certificates && profile.certificates.length > 0 ? (
    profile.certificates.map(cert => (
      <View key={cert.id} style={{ marginBottom: 6 }}>
        <Text style={styles.cardText}>- {cert.certificateName}</Text>
      </View>
    ))
  ) : (
    <Text style={styles.cardText}>Sertifika bulunamadı.</Text>
  )}
</View>
    </ScrollView>

    
  );
};

export default DietitianPanel;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 20,
  },
  profileImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
    resizeMode: 'cover',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 6,
  },
  line: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
});
