import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../api';

const DietPlanEditor = () => {
  const { patientId, patientName } = useRoute().params;
  const navigation = useNavigation();

  const [description, setDescription] = useState('');
  const [entries, setEntries] = useState([{ dayOrder: 1, mealName: '', content: '' }]);

  const addEntry = () => {
    setEntries([...entries, { dayOrder: entries.length + 1, mealName: '', content: '' }]);
  };

  const updateEntry = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const savePlan = async () => {
    if (!description.trim()) {
      Alert.alert('Uyarı', 'Lütfen açıklama girin.');
      return;
    }

    try {
      const payload = {
        patientId,
        description,
        entries
      };

      await api.post('/dietitian/diet-plans', payload);
      Alert.alert('Başarılı', 'Diyet planı kaydedildi.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Plan kaydedilemedi.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{patientName} için Diyet Planı</Text>

      <Text style={styles.label}>Açıklama:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Plan açıklaması girin..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Öğünler:</Text>
      {entries.map((entry, index) => (
        <View key={index} style={styles.entry}>
          <TextInput
            style={styles.input}
            placeholder="Öğün adı (örn: Kahvaltı)"
            value={entry.mealName}
            onChangeText={(text) => updateEntry(index, 'mealName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="İçerik (örn: 2 haşlanmış yumurta...)"
            value={entry.content}
            onChangeText={(text) => updateEntry(index, 'content', text)}
          />
        </View>
      ))}

      <TouchableOpacity onPress={addEntry} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Öğün Ekle</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={savePlan} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DietPlanEditor;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e293b',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: '#334155',
  },
  textArea: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    minHeight: 80,
    marginTop: 6,
    textAlignVertical: 'top',
  },
  entry: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#4f46e5',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
