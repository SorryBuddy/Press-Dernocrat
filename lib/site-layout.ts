/** Shared max-width and horizontal padding for news-style pages (matches wide masthead layouts). */
export const siteContainerClass =
  "mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8 xl:px-12";

export function isRiskTakingPath(pathname: string) {
  return pathname === "/risk-taking" || pathname.startsWith("/risk-taking/");
}
