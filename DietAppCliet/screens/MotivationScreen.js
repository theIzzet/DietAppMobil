import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const OPENROUTER_API_KEY = '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';

const MotivationScreen = () => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMotivation = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content:
                'Write one short and emotionally uplifting motivational sentence in English that inspires people to keep going in life.Then, write one health-related fun fact or general knowledge, such as a calorie burn from a specific activity or a nutritional fact about a healthy food.Keep it concise, fresh, and unique every time.',       
                 },
          ],
          temperature: 0.8,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://expo.dev',
          },
        }
      );

      const text = response.data.choices[0].message.content.trim();
      setMessage({ text, author: 'DietApp Ekibi' });
    } catch (error) {
      console.error('AI Hatası:', error.response?.data || error.message);
      Alert.alert('Hata', 'Motivasyon mesajı alınamadı.');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={['#1e3a8a', '#2563eb']} style={styles.header}>
        <Text style={styles.headerText}>💬 Günün Motivasyon Mesajı</Text>
        
      </LinearGradient>

      <TouchableOpacity style={styles.button} onPress={fetchMotivation} activeOpacity={0.85}>
        <Ionicons name="sparkles" size={20} color="#fff" />
        <Text style={styles.buttonText}>Motivasyonun tek tık uzağında!</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 30 }} />
      )}

      {message && (
        <LinearGradient colors={['#e0f2fe', '#f0f9ff']} style={styles.card}>
          <Text style={styles.quote}>"{message.text}"</Text>
          <Text style={styles.author}>— {message.author}</Text>
        </LinearGradient>
      )}
    </ScrollView>
  );
};

export default MotivationScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f5f9',
    padding: 24,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#dbeafe',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#10b981',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    marginTop: 30,
    padding: 26,
    borderRadius: 18,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#0f172a',
    marginBottom: 14,
    lineHeight: 24,
  },
  author: {
    fontSize: 16,
    textAlign: 'right',
    color: '#475569',
    fontWeight: '600',
  },
});