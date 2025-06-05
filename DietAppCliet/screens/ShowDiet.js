// screens/ShowDiet.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from 'react-native';
import api from '../api';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const ShowDiet = () => {
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDietPlan = async () => {
    try {
      const response = await api.get('/patient/diet_list');
      setDietPlan(response.data);
    } catch (error) {
      console.error('Diyet planı alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietPlan();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Diyet planı getiriliyor...</Text>
      </View>
    );
  }

  if (!dietPlan) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Henüz tanımlı bir diyet planınız yok.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📋 Diyet Planı</Text>
      <Text style={styles.description}>📝 {dietPlan.description}</Text>
      <Text style={styles.date}>
        🗓️ Oluşturulma: {format(new Date(dietPlan.createdAt), 'P', { locale: tr })}
      </Text>

      <FlatList
        data={dietPlan.entries}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.mealBadge}>{item.mealName}</Text>
              <Text style={styles.cardDate}>
                {format(new Date(dietPlan.createdAt), 'dd MMMM yyyy', { locale: tr })}
              </Text>
            </View>
            <Text style={styles.cardContent}>{item.content}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ShowDiet;

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
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 10,
    color: '#475569',
    fontSize: 15,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mealBadge: {
    backgroundColor: '#a5b4fc',
    color: '#1e40af',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardDate: {
    fontSize: 13,
    color: '#64748b',
  },
  cardContent: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
});
