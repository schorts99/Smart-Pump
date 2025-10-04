export default function bearerTokenVerifier(req, res, next) {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    res.status(401);

    return res.send([
      {
        status: "401",
        code: "UNAUTHORIZED",
        title: "Unauthorized",
        detail: "You need to login."
      },
    ]);
  }

  next();
}
