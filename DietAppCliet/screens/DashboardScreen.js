import React from 'react';
import { View, Text, Button } from 'react-native';
import { removeToken } from '../utils/storage';

const DashboardScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await removeToken();
    navigation.replace('Login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>📊 Dashboard</Text>
      <Button title="Çıkış Yap" onPress={handleLogout} />
    </View>
  );
};

export default DashboardScreen;
