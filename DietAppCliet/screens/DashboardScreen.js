// DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import api from '../api';
import { BASE_URL } from '../src/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const DietTypeCard = ({ dietType, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.dietTypeCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {dietType.picturePath && (
          <Image
            source={{ uri: `${BASE_URL}/${dietType.picturePath}` }}
            style={styles.dietTypeImage}
          />
        )}
        <View style={styles.dietTypeContent}>
          <Text style={styles.dietTypeTitle}>{dietType.title}</Text>
          <Text style={styles.dietTypeDescription} numberOfLines={2}>{dietType.description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.arrowIcon} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const DietitianCard = ({ dietitian, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.dietitianCard}>
    {dietitian.profilePhotoPath && (
      <Image
        source={{ uri: `${BASE_URL}/${dietitian.profilePhotoPath}` }}
        style={styles.dietitianImage}
      />
    )}
    <View style={styles.dietitianInfo}>
      <Text style={styles.dietitianName}>{dietitian.name} {dietitian.surname}</Text>
      <Text style={styles.dietitianClinic}>{dietitian.clinicName || 'Bağımsız Diyetisyen'}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingText}>{dietitian.averageRating?.toFixed(1) || 'Yeni'}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const DashboardScreen = () => {
  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };
  const [dietTypes, setDietTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDietType, setSelectedDietType] = useState(null);
  const [dietitians, setDietitians] = useState([]);
  const [dietitiansLoading, setDietitiansLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchDietTypes = async () => {
      try {
        const res = await api.get('/diettypemanagement/diet-types');
        setDietTypes(res.data);
      } catch (error) {
        console.error('Error fetching diet types:', error);
      } finally {
        setLoading(false);
      }
    };

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

    fetchDietTypes();
  }, []);

  const handleDietTypePress = async (dietType) => {
    setSelectedDietType(dietType);
    setDietitiansLoading(true);
    try {
      const res = await api.get(`/diettypemanagement/diet-types/${dietType.id}/dietitians`);
      setDietitians(res.data);
    } catch (error) {
      console.error('Error fetching dietitians:', error);
    } finally {
      setDietitiansLoading(false);
    }
  };

  const handleDietitianPress = (dietitianId) => {
    navigation.navigate('DietitianDetail', { dietitianId });
  };

  const handleBackToTypes = () => {
    setSelectedDietType(null);
    setDietitians([]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Diyet türleri yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.header}>
        <Text style={styles.headerTitle}>Hizmetlerimiz</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {selectedDietType ? (
        <ScrollView contentContainerStyle={styles.detailContainer}>
          <TouchableOpacity onPress={handleBackToTypes} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#3b82f6" />
            <Text style={styles.backButtonText}>Tüm Diyet Türlerine Dön</Text>
          </TouchableOpacity>

          <View style={styles.dietTypeDetailCard}>
            {selectedDietType.picturePath && (
              <Image
                source={{ uri: `${BASE_URL}/${selectedDietType.picturePath}` }}
                style={styles.detailImage}
              />
            )}
            <Text style={styles.detailTitle}>{selectedDietType.title}</Text>
            <Text style={styles.detailDescription}>{selectedDietType.description}</Text>
            <Text style={styles.detailAbout}>{selectedDietType.about}</Text>
          </View>

          <Text style={styles.sectionTitle}>Bu Diyet Türünü Uygulayan Diyetisyenler</Text>

          {dietitiansLoading ? (
            <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
          ) : dietitians.length > 0 ? (
            <FlatList
              data={dietitians}
              renderItem={({ item }) => (
                <DietitianCard dietitian={item} onPress={() => handleDietitianPress(item.id)} />
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noDietitianText}>Bu diyet türünde hizmet veren diyetisyen bulunamadı.</Text>
          )}
        </ScrollView>
      ) : (
        <FlatList
          data={dietTypes}
          renderItem={({ item }) => (
            <DietTypeCard dietType={item} onPress={() => handleDietTypePress(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={<Text style={styles.listHeader}>Tüm Diyet Programları</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  logoutButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    padding: 5,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#6c757d' },
  listContent: { padding: 15 },
  listHeader: { fontSize: 18, fontWeight: '600', color: '#495057', marginBottom: 15, marginLeft: 5 },
  dietTypeCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dietTypeImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  dietTypeContent: { flex: 1 },
  dietTypeTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  dietTypeDescription: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  arrowIcon: { marginLeft: 10 },
  detailContainer: { padding: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backButtonText: { color: '#3b82f6', marginLeft: 5, fontWeight: '500' },
  dietTypeDetailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  detailImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 15 },
  detailTitle: { fontSize: 22, fontWeight: 'bold', color: '#212529', marginBottom: 10 },
  detailDescription: { fontSize: 16, color: '#495057', marginBottom: 15, fontWeight: '500' },
  detailAbout: { fontSize: 14, color: '#6c757d', lineHeight: 22 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#495057', marginBottom: 15 },
  dietitianCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dietitianImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  dietitianInfo: { flex: 1 },
  dietitianName: { fontSize: 16, fontWeight: '600', color: '#212529', marginBottom: 3 },
  dietitianClinic: { fontSize: 14, color: '#6c757d', marginBottom: 5 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 14, color: '#495057', marginLeft: 5 },
  noDietitianText: { textAlign: 'center', color: '#6c757d', marginTop: 20, fontSize: 16 },
  loader: { marginVertical: 30 },
});

export default DashboardScreen;
