import { convexAuthNextjsMiddleware
  , createRouteMatcher
  , nextjsMiddlewareRedirect
  , isAuthenticatedNextjs} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isPublic = isPublicPage(request);
  const isAuthenticated = await convexAuth.isAuthenticated(); 

  if (!isPublic && !isAuthenticated) {
      return nextjsMiddlewareRedirect(request, '/auth');
  }
  if (isPublic && isAuthenticated) {
      return nextjsMiddlewareRedirect(request, '/');
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};