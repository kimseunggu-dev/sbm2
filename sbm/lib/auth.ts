import NextAuth, { AuthError, type User } from "next-auth";
import credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import z from "zod";
import { findMemberByEmail } from "@/app/sign/sign.action";
import prisma from "./db";

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
        passwd: {},
      },
      async authorize(credentials) {
        console.log(credentials);
        const { email, passwd } = credentials;

        const validator = z
          .object({
            email: z.email("잘못된 이메일 형식입니다."),
            passwd: z.string().min(6, "More than 6 characters!"),
          })
          .safeParse({ email, passwd });

        if (!validator.success) {
          console.log("Error", validator.error);
          throw new AuthError(validator.error.message);
        }

        return { email, passwd } as User;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      const isCredential = account?.provider === "credentials";
      console.log(user);
      console.log(profile);
      console.log(isCredential);
      const { email, name: nickname, image } = user;
      if (!email) return false;

      const mbr = await findMemberByEmail(email, isCredential);
      if (mbr?.emailcheck) {
        return `/sign/error?error=CheckEmail&email=${email}`;
      }
      if (isCredential) {
        if (!mbr) throw new AuthError("NotExistsMember");
        // 암호 비교(compare) ==> 실패하면 오류, 성공하면 로그인
      } else {
        // SNS 자동 가입
        if (!mbr && nickname) {
          await prisma.member.create({
            data: { email, nickname, image },
          });
        }
      }

      return true;
    },
    async jwt({ token, user, trigger, account, session }) {
      console.log(account);
      const userData = trigger === "update" ? session : user;
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
    error: "/sign/error",
  },
  session: {
    strategy: "jwt",
  },
});
