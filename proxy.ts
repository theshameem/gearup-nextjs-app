import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "gearup_token";
const SECRET = process.env.JWT_ACCESS_SECRET ?? process.env.NEXT_PUBLIC_JWT_SECRET ?? "";

const PROTECTED: Array<{ prefix: string; roles: string[]; dashboard: string }> = [
  { prefix: "/dashboard/customer", roles: ["CUSTOMER"], dashboard: "/dashboard/customer" },
  { prefix: "/dashboard/provider", roles: ["PROVIDER"], dashboard: "/dashboard/provider" },
  { prefix: "/dashboard/admin", roles: ["ADMIN"], dashboard: "/dashboard/admin" },
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE)?.value;

  for (const p of PROTECTED) {
    if (pathname.startsWith(p.prefix)) {
      if (!token) {
        const url = new URL("/auth/login", req.url);
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(SECRET),
        );
        const role = String(payload.role ?? "").toUpperCase();
        if (!p.roles.includes(role)) {
          return NextResponse.redirect(new URL(p.dashboard, req.url));
        }
      } catch {
        const url = new URL("/auth/login", req.url);
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  if ((pathname === "/auth/login" || pathname === "/auth/register") && token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(SECRET),
      );
      const role = String(payload.role ?? "").toLowerCase();
      if (role === "customer" || role === "provider" || role === "admin") {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      }
    } catch {
      /* fallthrough */
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
