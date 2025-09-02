import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Github,
    Google,
    Kakao,
    Naver,
    Credentials({
      name: 'Email',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'email@bookmark.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'password..'
        },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password)
          return null;

        const user = { id: '1', email: 'aaa@gmail.com', name: 'Hong' };
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      console.log(user);
      console.log(profile);
      return true;
    },
    async jwt({ token, user }) {
      // jwt 방식
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
      }
      return session;
    },
  },

  trustHost: true,
  jwt: { maxAge: 30 * 60 },
  pages: {
    // signIn: `/sign`,
    error: '/sign/error',
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.AUTH_SECRET as string,
});
