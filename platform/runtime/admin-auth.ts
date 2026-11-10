async function digestToken(value: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return new Uint8Array(digest);
}

export async function isAuthorizedEventAdmin(request: Request, configuredToken: string | undefined): Promise<boolean> {
  if (!configuredToken) return false;
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return false;

  const presentedToken = authorization.slice("Bearer ".length).trim();
  if (!presentedToken || presentedToken.length > 512) return false;

  const [expected, actual] = await Promise.all([digestToken(configuredToken), digestToken(presentedToken)]);
  if (expected.length !== actual.length) return false;

  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) {
    difference |= expected[index] ^ actual[index];
  }
  return difference === 0;
}
