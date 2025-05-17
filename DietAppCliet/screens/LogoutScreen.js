import React, { useEffect } from 'react';
import { removeToken } from '../utils/storage';

const LogoutScreen = ({ navigation }) => {
  useEffect(() => {
    removeToken().then(() => {
      navigation.replace('Login');
    });
  }, []);

  return null;
};

export default LogoutScreen;
