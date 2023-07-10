import { NextRequest, NextResponse } from "next/server";

let locales = ["en", "id"];

// Get the preferred locale, similar to above or using a library
function getLocale(request: NextRequest) {
  const locale = request.nextUrl.pathname.split("/")[1];
  return locales.includes(locale) ? locale : locales[0];
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  if (pathname.includes("images") || pathname.includes("favicon") || pathname.includes("manifest") || pathname.includes("robots") || pathname.includes("sitemap") || pathname.includes("service-worker") || pathname.includes("sw")) {
    return NextResponse.next();
  }
  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
