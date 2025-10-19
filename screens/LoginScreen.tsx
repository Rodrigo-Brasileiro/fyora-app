import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Colors } from '../constants/Colors';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { validateEmail, validatePassword, sanitizeString } from '../lib/validation';
import { loginRequest, storeTokens } from '../services/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = sanitizeString(email).trim().toLowerCase();
    const cleanPassword = sanitizeString(password);

    if (!cleanEmail || !cleanPassword) {
      Alert.alert('Campos vazios', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      Alert.alert('E-mail inválido', 'Por favor, insira um endereço de e-mail válido.');
      return;
    }

    if (!validatePassword(cleanPassword)) {
      Alert.alert(
        'Senha inválida',
        'A senha deve ter pelo menos 8 caracteres e conter ao menos um número.'
      );
      return;
    }

    try {
      setLoading(true);
      const { accessToken, refreshToken } = await loginRequest(cleanEmail, cleanPassword);
      await storeTokens(accessToken, refreshToken);

      Alert.alert('Login realizado', 'Bem-vindo(a) de volta!');

      // 🚀 Redireciona para a tela principal da aplicação
      navigation.reset({
        index: 0,
        routes: [{ name: 'TabNavigator' as never }], // <-- substitua 'TabNavigator' pelo nome da sua rota principal
      });
    } catch (err: any) {
      console.error('Erro de login:', err);
      Alert.alert(
        'Erro de autenticação',
        'Não foi possível realizar o login. Verifique suas credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image
              source={require('../assets/images/fyora-login.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Fyora</Text>
            <Text style={styles.subtitle}>Sua jornada recomeça aqui</Text>
          </View>

          <View style={styles.card}>
            <AppTextInput
              label="Seu E-mail"
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AppTextInput
              label="Sua Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <AppButton
                title={loading ? 'Entrando...' : 'Entrar'}
                onPress={handleLogin}
                disabled={loading}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}> Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    paddingBottom: 32,
  },
  forgotPassword: {
    textAlign: 'right',
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  signupLink: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default LoginScreen;
