'use server';

import { signIn, signOut } from '@/lib/auth';

type Provider = 'google' | 'github' | 'naver' | 'kakao';

export const login = async (provider: Provider, callback?: string) => {
  await signIn(provider, { redirectTo: callback || '/bookcase' });
};

export const loginNaver = async () => login('naver');

export const authorize = async (formData: FormData) => {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const logout = async () => {
  await signOut({ redirectTo: '/sign' }); // QQQ: '/'
};
