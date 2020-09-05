module.exports = function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://* 'unsafe-eval' 'unsafe-inline'"
  );
  next();
};
