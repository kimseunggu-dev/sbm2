import NextAuth from 'next-auth';
import credentials from 'next-auth/providers/credentials';
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
    credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      const isCredential = account?.provider === "credentials"
      console.log(user);
      console.log(profile);
      console.log(isCredential);
      // const { email, name, image } = user;
      // if (!email) return false;
      // return false;
      return true;
    },
    async jwt({ token, user, trigger, account, session }) {
      const userData = trigger === "update" ? session : user;
      // jwt 방식
      if (userData) {
        token.id = userData.id;
        token.email = userData.email;
        token.name = userData.name || userData.nickname;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id?.toString() || "";
        session.user.name = token.name;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  trustHost: true,
  jwt: { maxAge: 30 * 60 },
  pages: {
    signIn: `/sign`,
    error: '/sign/error',
  },
  session: {
    strategy: 'jwt'
  },
});
