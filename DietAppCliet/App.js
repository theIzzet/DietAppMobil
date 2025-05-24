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
import AcceptedPatientsScreen from './screens/AcceptedPatientsScreen';
import LogoutScreen from './screens/LogoutScreen';
import FillFormsScreen from './screens/FillFormsScreen';
import CheckFormsScreen from './screens/CheckFormsScreen';
import DietitianDetailScreen from './screens/DietitianDetailScreen';
import DemandsScreen from './screens/DemandsScreen';
import DietPlanEditor from './screens/DietPlanEditor';
import ShowDiet from './screens/ShowDiet';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DietitianDrawer = () => (
  <Drawer.Navigator initialRouteName="DietitianPanel">
    <Drawer.Screen
      name="DietitianPanel"
      component={DietitianPanel}
      options={{ title: 'Ana Panel' }}
    />
    <Drawer.Screen
      name="EditDietitianProfile"
      component={EditDietitianProfile}
      options={{ title: 'Profil Düzenle' }}
    />
    <Drawer.Screen
      name="DemandsScreen"
      component={DemandsScreen}
      options={{ title: 'Gelen Talepler' }}
    />
    <Drawer.Screen
      name="AcceptedPatients"
      component={AcceptedPatientsScreen}
      options={{ title: 'Danışanlarım' }}
    />
    <Drawer.Screen
      name="Logout"
      component={LogoutScreen}
      options={{ title: 'Çıkış Yap' }}
    />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Giriş' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Danışan Kayıt' }}
        />
        <Stack.Screen
          name="RegisterDietitian"
          component={RegisterDietitianScreen}
          options={{ title: 'Diyetisyen Kayıt' }}
        />
        <Stack.Screen
          name="CheckForms"
          component={CheckFormsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FillForms"
          component={FillFormsScreen}
          options={{ title: 'Form Doldur' }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Danışan Paneli' }}
        />
        <Stack.Screen
          name="DietitianDrawer"
          component={DietitianDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditDietitianProfile"
          component={EditDietitianProfile}
          options={{ title: 'Profil Düzenle' }}
        />
        <Stack.Screen
          name="DietitianDetail"
          component={DietitianDetailScreen}
          options={{ title: 'Diyetisyen Detay', headerShown: false }}
        />
        <Stack.Screen
          name="DietPlanEditor"
          component={DietPlanEditor}
          options={{ title: 'Diyet Planı Oluştur' }}
        />
        <Stack.Screen
          name="ShowDiet"
          component={ShowDiet}
          options={{ title: 'Diyet Planım', headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}