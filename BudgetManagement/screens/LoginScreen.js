import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const navigation = useNavigation();

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Redirecting to reset password...');
  };

  const handleRegister = () => {
    if (navigation) {
        navigation.navigate('Register');
      } else {
        Alert.alert('Navigation', 'Cannot navigate to the registration page.');
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên tài khoản"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={() => login(username, password)}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.register}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  forgotPassword: {
    color: '#007BFF',
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  register: {
    color: '#007BFF',
  },
});

export default LoginScreen;
