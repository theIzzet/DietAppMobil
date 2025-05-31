// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createDrawerNavigator, DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RegisterDietitianScreen from './screens/RegisterDietitianScreen';
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
import CalorieBurnScreen from './screens/CalorieBurnScreen';
import MotivationScreen from './screens/MotivationScreen';
import DashboardScreen from './screens/DashboardScreen';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './context/ThemeContext';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


const DietitianDrawer = () => (
  <Drawer.Navigator
    initialRouteName="DietitianPanel"
    drawerContent={(props) => (<>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <ThemeToggle />
      </DrawerContentScrollView>
    </>
    )}
  >
    <Drawer.Screen name="DietitianPanel" component={DietitianPanel} options={{ title: 'Dietapp' }} />
    <Drawer.Screen name="EditDietitianProfile" component={EditDietitianProfile} options={{ title: 'Profil Düzenle' }} />
    <Drawer.Screen name="DemandsScreen" component={DemandsScreen} options={{ title: 'Gelen Talepler' }} />
    <Drawer.Screen name="AcceptedPatients" component={AcceptedPatientsScreen} options={{ title: 'Danışanlarım' }} />
    <Drawer.Screen name="Logout" component={LogoutScreen} options={{ title: 'Çıkış Yap' }} />
  </Drawer.Navigator>
);

const DashboardDrawer = () => (
  <Drawer.Navigator
    initialRouteName="DashboardMain"
    drawerContent={(props) => (
      <>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <ThemeToggle />
        </DrawerContentScrollView>
      </>
    )}
  >

    <Drawer.Screen name="DashboardMain" component={DashboardScreen} options={{ title: 'Dietapp' }} />
    <Drawer.Screen name="ShowDiet" component={ShowDiet} options={{ title: 'Diyet Listem' }} />
    <Drawer.Screen name="CalorieBurn" component={CalorieBurnScreen} options={{ title: 'Kalori Yakım' }} />
    <Drawer.Screen name="Motivation" component={MotivationScreen} options={{ title: 'Günün Motivasyonu' }} />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}



function AppContent() {
  const { isDark } = useTheme();

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Giriş' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Danışan Kayıt' }} />
        <Stack.Screen name="RegisterDietitian" component={RegisterDietitianScreen} options={{ title: 'Diyetisyen Kayıt' }} />
        <Stack.Screen name="CheckForms" component={CheckFormsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FillForms" component={FillFormsScreen} options={{ title: 'Form Doldur' }} />
        <Stack.Screen name="Dashboard" component={DashboardDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="DietitianDrawer" component={DietitianDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="EditDietitianProfile" component={EditDietitianProfile} options={{ title: 'Profil Düzenle' }} />
        <Stack.Screen name="DietitianDetail" component={DietitianDetailScreen} options={{ title: 'Diyetisyen Detay', headerShown: false }} />
        <Stack.Screen name="DietPlanEditor" component={DietPlanEditor} options={{ title: 'Diyet Planı Oluştur' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

