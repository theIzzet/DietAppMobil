import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import api from '../api';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const AcceptedPatientsScreen = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchAcceptedDemands = async () => {
        try {
          const response = await api.get('/demand/received');

          const transformedDemands = response.data.map(d => ({
            patientId: d.senderId,             // senderId → danışanın ID’si
            patientName: d.senderName,         // senderName → adı
            assignedAt: d.sendTime,            // sendTime → atanma zamanı
            state: d.state,                    // state kontrolü için
          }));

          const filtered = transformedDemands.filter(d => d.state === 'Onaylandı');

          const seen = new Set();
          const uniquePatients = [];

          for (const d of filtered) {
            if (!seen.has(d.patientId)) {
              seen.add(d.patientId);
              uniquePatients.push(d);
            }
          }

          setPatients(uniquePatients);
          console.log('📦 Onaylanan hastalar:', uniquePatients);
        } catch (error) {
          console.error('Hata:', error);
          Alert.alert('Hata', 'Danışanlar alınamadı.');
        } finally {
          setLoading(false);
        }
      };

      setLoading(true);
      fetchAcceptedDemands();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Ionicons name="person-circle-outline" size={40} color="#4f46e5" />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.name}>{item.patientName || '-'}</Text>
        <Text style={styles.email}>ID: {item.patientId || '-'}</Text>
        <Text style={styles.date}>
          Atanma tarihi: {format(new Date(item.assignedAt), 'dd MMMM yyyy', {
            locale: tr,
          })}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('DietPlanEditor', {
            patientId: item.patientId,
            patientName: item.patientName,
          })
        }
      >
        <Text style={styles.buttonText}>Diyet Oluştur</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kabul Edilen Danışanlar</Text>
      <FlatList
        data={patients}
        renderItem={renderItem}
        keyExtractor={(item) => item.patientId + item.assignedAt}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

export default AcceptedPatientsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e293b',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  email: {
    fontSize: 14,
    color: '#475569',
  },
  date: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
