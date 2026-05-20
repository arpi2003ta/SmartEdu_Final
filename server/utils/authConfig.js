let warnedAboutFallbackSecret = false;

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.SECRET_KEY;

  if (secret) return secret;

  if (process.env.NODE_ENV !== "production" && !warnedAboutFallbackSecret) {
    warnedAboutFallbackSecret = true;
    console.warn(
      "JWT_SECRET is not set. Using an insecure local development fallback."
    );
  }

  return "local-development-jwt-secret";
};
