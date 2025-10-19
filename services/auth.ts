// fyora-app/services/auth.ts
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

const API = (process.env.API_URL ?? 'https://api.example.com').replace(/\/$/, '');

type LoginResponse = { accessToken: string; refreshToken?: string };
type RegisterPayload = {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  password: string;
};
type RegisterResponse = { success: boolean; message?: string };

/**
 * Autenticação - Login
 */
export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errBody = await safeJson(res);
    throw new Error(errBody?.message || 'invalid_credentials');
  }

  return res.json();
}

/**
 * Registro de novo usuário
 */
export async function registerRequest(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errBody = await safeJson(res);
    return {
      success: false,
      message: errBody?.message || 'Falha no cadastro. Tente novamente.',
    };
  }

  const body = await safeJson(res);
  return {
    success: true,
    message: body?.message ?? 'Usuário criado com sucesso.',
  };
}

/**
 * Armazenar tokens com segurança
 */
export async function storeTokens(accessToken: string, refreshToken?: string) {
  await SecureStore.setItemAsync('accessToken', accessToken);
  if (refreshToken) await SecureStore.setItemAsync('refreshToken', refreshToken);
}

/**
 * Obter token de acesso (verificando expiração)
 */
export async function getAccessToken(): Promise<string | null> {
  const token = await SecureStore.getItemAsync('accessToken');
  if (!token) return null;
  try {
    const { exp }: any = jwtDecode(token);
    if (Date.now() >= exp * 1000) return null;
  } catch {
    return null;
  }
  return token;
}

/**
 * Renovar token de acesso usando o refresh token
 */
export async function refreshAccessToken(): Promise<string> {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  if (!refreshToken) throw new Error('no_refresh_token');

  const res = await fetch(`${API}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error('refresh_failed');

  const body: LoginResponse = await res.json();
  await storeTokens(body.accessToken, body.refreshToken);
  return body.accessToken;
}

/**
 * Logout seguro
 */
export async function logout() {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}

/**
 * Função auxiliar segura para tentar parsear JSON
 */
async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
