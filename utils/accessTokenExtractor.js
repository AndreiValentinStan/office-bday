export const runtime = "nodejs";

const accessToken = {
  valid: false,
  testing: true,
  value: "access token de test",
};

export default async function extractAccesToken(fn) {
  return fn(req, accessToken);
}
