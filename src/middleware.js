import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(zh|ms|th|vi|id|ko|ja|hi|ar|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
