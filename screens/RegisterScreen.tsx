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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { Colors } from '../constants/Colors';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import { sanitizeString, validateEmail, validatePassword } from '../lib/validation';
import { registerRequest } from '../services/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidCPF = (cpfValue: string) => {
    const cleanCPF = cpfValue.replace(/[^\d]/g, '');
    return cleanCPF.length === 11;
  };

  const handleRegister = async () => {
    const cleanName = sanitizeString(name).trim();
    const cleanCPF = sanitizeString(cpf);
    const cleanPhone = sanitizeString(phone);
    const cleanEmail = sanitizeString(email).trim().toLowerCase();
    const cleanPassword = sanitizeString(password);
    const cleanConfirm = sanitizeString(confirmPassword);

    // Validações básicas
    if (!cleanName || !cleanCPF || !cleanPhone || !cleanEmail || !cleanPassword || !cleanConfirm) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!isValidCPF(cleanCPF)) {
      Alert.alert('CPF inválido', 'Por favor, insira um CPF válido com 11 dígitos.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      Alert.alert('E-mail inválido', 'Insira um endereço de e-mail válido.');
      return;
    }

    if (!validatePassword(cleanPassword)) {
      Alert.alert(
        'Senha fraca',
        'A senha deve conter pelo menos 8 caracteres, um número e uma letra maiúscula.'
      );
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      Alert.alert('Senhas diferentes', 'As senhas informadas não coincidem.');
      return;
    }

    try {
      setLoading(true);
      console.log('Tentando cadastro com:', { cleanName, cleanCPF, cleanPhone, cleanEmail });

      // Chamada simulada de registro (ajuste com seu endpoint real)
      const response = await registerRequest({
        name: cleanName,
        cpf: cleanCPF,
        phone: cleanPhone,
        email: cleanEmail,
        password: cleanPassword,
      });

      if (response.success) {
        Alert.alert('Sucesso!', 'Sua conta foi criada com sucesso.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro no cadastro', response.message || 'Tente novamente mais tarde.');
      }
    } catch (err: any) {
      console.error('Erro ao registrar:', err);
      Alert.alert('Erro', 'Não foi possível concluir o cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Image
              source={require('../assets/images/fyora-register.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Fyora</Text>
          </View>

          <View style={styles.card}>
            <AppTextInput
              label="Seu Nome"
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome completo"
            />
            <AppTextInput
              label="Seu CPF"
              value={cpf}
              onChangeText={setCpf}
              placeholder="000.000.000-00"
              keyboardType="numeric"
            />
            <AppTextInput
              label="Seu Telefone"
              value={phone}
              onChangeText={setPhone}
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
            />
            <AppTextInput
              label="Seu E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AppTextInput
              label="Sua Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="Crie uma senha forte"
              secureTextEntry
            />
            <AppTextInput
              label="Confirme sua Senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repita a senha"
              secureTextEntry
            />

            <View style={{ marginTop: 16 }}>
              <AppButton title={loading ? 'Cadastrando...' : 'Cadastrar-se'} onPress={handleRegister} disabled={loading} />
            </View>
          </View>

          <TouchableOpacity style={styles.footer} onPress={() => navigation.goBack()}>
            <Text style={styles.footerText}>Já tem uma conta? Faça o login</Text>
          </TouchableOpacity>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: -10,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
  },
  footer: {
    marginTop: 24,
  },
  footerText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RegisterScreen;
