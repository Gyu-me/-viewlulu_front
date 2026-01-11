/**
 * SignupScreen
 * ----------------------------
 * - 회원가입 화면
 * - 이름 / 이메일 / 비밀번호 입력
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

export default function SignupScreen() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // 👉 나중에 서버 연동 예정
    console.log({ name, email, password });
  };

  return (
    <View style={styles.container}>
      {/* 타이틀 */}
      <Text style={styles.logo}>뷰루루</Text>
      <Text style={styles.subtitle}>
        시각장애인을 위한 뷰티 도우미
      </Text>

      {/* 입력 필드 */}
      <TextInput
        style={styles.input}
        placeholder="이름"
        placeholderTextColor="#777"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="이메일"
        placeholderTextColor="#777"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        placeholderTextColor="#777"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* 회원가입 버튼 */}
      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignup}
      >
        <Text style={styles.signupText}>회원가입</Text>
      </TouchableOpacity>

      {/* 로그인으로 이동 */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.linkText}>
          이미 계정이 있으신가요? 로그인
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  logo: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 40,
  },

  input: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },

  signupButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },

  signupText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },

  linkText: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
