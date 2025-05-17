import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../api';

const FillFormsScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    PersonalInfo: {
      Name: '',
      Surname: '',
      DateOfBirth: new Date(),
      Gender: 'Kadın',
      Height: '',
      Weight: '',
      Occupation: '',
      MaritalStatus: '',
      ChildCount: '',
    },
    PhysicalActivity: {
      RegularPhysicalActivity: '',
      DailyInactivity: '',
      SleepPattern: '',
    },
    Lifestyle: {
      RegularPhysicalActivity: '',
      DailyInactivity: '',
      SleepPattern: '',
      StressLevel: '',
      SmokingHabits: '',
      CaffeineIntake: '',
      MotivationLevel: '',
      SocialSupport: '',
      AlcoholConsumption: '',
    },
    FoodHabit: {
      MealTimes: '',
      ConsumedFoods: '',
      SnackingHabits: '',
      OutsideEatingHabits: '',
      EatingDuration: '',
      SweetConsumption: '',
      CookingMethods: '',
      WaterIntake: '',
    },
    Goal: {
      WeightGoal: '',
      HealthIssuesManagement: '',
      SportsPerformanceGoals: '',
      OtherGoals: '',
    },
    MedicalHistory: {
      MedicationNames: '',
      PersonalDiseases: '',
      HereditaryDiseases: '',
      Allergies: '',
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const validateForm = () => {
    const requiredSections = ['PersonalInfo', 'PhysicalActivity', 'Lifestyle', 'FoodHabit', 'Goal', 'MedicalHistory'];
    for (const section of requiredSections) {
      for (const [key, value] of Object.entries(formData[section])) {
        if (value === '' || value === null || value === undefined) {
          Alert.alert('Uyarı', `${section} bölümünde '${key}' alanı eksik.`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      PersonalInfo: {
        ...formData.PersonalInfo,
        DateOfBirth: formData.PersonalInfo.DateOfBirth.toISOString(),
        Height: parseFloat(formData.PersonalInfo.Height),
        Weight: parseFloat(formData.PersonalInfo.Weight),
        ChildCount: parseInt(formData.PersonalInfo.ChildCount),
      },
      PhysicalActivity: formData.PhysicalActivity,
      Lifestyle: formData.Lifestyle,
      FoodHabit: formData.FoodHabit,
      Goal: formData.Goal,
      MedicalHistory: formData.MedicalHistory,
    };

    try {
      await api.post('/patient/all', payload);
      Alert.alert('Başarılı', 'Form başarıyla kaydedildi.');
      navigation.replace('Dashboard');
    } catch (err) {
      console.error(err);
      Alert.alert('Hata', 'Form gönderilirken bir hata oluştu.');
    }
  };

  const renderInput = (sectionKey, key, value, placeholder, helper = '') => {
    const exampleTexts = {
      AlcoholConsumption: 'Örnek: Haftada bir tüketirim',
      RegularPhysicalActivity: 'Örnek: Haftada 3 gün spor yaparım',
      StressLevel: 'Örnek: Genellikle orta düzeyde stres',
      MealTimes: 'Örnek: Günde 3 ana öğün',
      WeightGoal: 'Örnek: 65',
    };

    if (key === 'DateOfBirth') {
      return (
        <View key={key} style={styles.inputContainer}>
          <Text style={styles.label}>{placeholder}</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text>{value.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={value}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  handleChange(sectionKey, key, selectedDate);
                }
              }}
            />
          )}
        </View>
      );
    }

    if (key === 'Gender') {
      return (
        <View key={key} style={styles.inputContainer}>
          <Text style={styles.label}>{placeholder}</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => handleChange(sectionKey, key, itemValue)}
            >
              <Picker.Item label="Kadın" value="Kadın" />
              <Picker.Item label="Erkek" value="Erkek" />
              <Picker.Item label="Diğer" value="Diğer" />
            </Picker>
          </View>
        </View>
      );
    }

    return (
      <View key={key} style={styles.inputContainer}>
        <Text style={styles.label}>{placeholder}</Text>
        <TextInput
          style={styles.input}
          placeholder={exampleTexts[key] || helper}
          keyboardType={['Height', 'Weight', 'ChildCount', 'WeightGoal'].includes(key) ? 'numeric' : 'default'}
          value={value}
          onChangeText={(text) => handleChange(sectionKey, key, text)}
        />
      </View>
    );
  };

  const renderSection = (sectionKey, fields) => (
    <View style={styles.section} key={sectionKey}>
      <Text style={styles.sectionTitle}>{sectionKey}</Text>
      {Object.entries(fields).map(([key, value]) =>
        renderInput(sectionKey, key, value, key, key === 'DateOfBirth' ? 'örn. 2000-01-01' : '')
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 Kayıt Formu</Text>
      <Text style={styles.subtitle}>Lütfen tüm bilgileri doğru formatta girin.</Text>
      {Object.entries(formData).map(([sectionKey, fields]) => renderSection(sectionKey, fields))}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Kaydet ve Devam Et</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FillFormsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0f172a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#0f172a',
    textTransform: 'capitalize',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 6,
  },
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#475569',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f1f5f9',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  button: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
