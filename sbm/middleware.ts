import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const cookies = req.cookies;
  console.log(cookies);

  const pathname = req.nextUrl.pathname;
  console.log(pathname);

  const session = await auth();

  const didLogin = !!session?.user?.email;
  if (!didLogin) {
    return NextResponse.redirect(new URL(`/sign?redirectTo=${pathname}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  // runtime: "nodejs",
  matcher: [
    '/((?!sign|_next/static|_next/image|api/auth|forgotpasswd|registcheck|favicon.ico|robots.txt|.well-know|$).*)',
    // '/api/:path*',
  ],
};
