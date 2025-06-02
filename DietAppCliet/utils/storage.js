import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (e) {
    console.error('Token saklanamadı:', e);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (e) {
    console.error('Token okunamadı:', e);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (e) {
    console.error('Token silinemedi:', e);
  }
};


export const getUserId = async () => {
  try {
    const token = await getToken();
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded.sub;
  } catch (e) {
    console.error('Kullanıcı ID alınamadı:', e);
    return null;
  }
};