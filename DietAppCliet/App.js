import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RegisterDietitianScreen from './screens/RegisterDietitianScreen';
import DashboardScreen from './screens/DashboardScreen';
import DietitianPanel from './screens/DietitianPanel';
import EditDietitianProfile from './screens/EditDietitianProfile';
import PatientsScreen from './screens/PatientsScreen'; // 💡 yeni eklenecek
import LogoutScreen from './screens/LogoutScreen';     // 💡 yeni eklenecek

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DietitianDrawer = () => (
  <Drawer.Navigator initialRouteName="DietitianPanel">
    <Drawer.Screen name="DietitianPanel" component={DietitianPanel} options={{ title: 'Ana Panel' }} />
    <Drawer.Screen name="EditDietitianProfile" component={EditDietitianProfile} options={{ title: 'Profil Düzenle' }} />
    <Drawer.Screen name="Patients" component={PatientsScreen} options={{ title: 'Danışanlar' }} />
    <Drawer.Screen name="Logout" component={LogoutScreen} options={{ title: 'Çıkış Yap' }} />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Giriş' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Danışan Kayıt' }} />
        <Stack.Screen name="RegisterDietitian" component={RegisterDietitianScreen} options={{ title: 'Diyetisyen Kayıt' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Danışan Paneli' }} />
        <Stack.Screen name="DietitianDrawer" component={DietitianDrawer} options={{ headerShown: false }} />
          <Stack.Screen name="EditDietitianProfile" component={EditDietitianProfile} options={{ title: 'Profil Düzenle' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
