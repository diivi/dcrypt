module.exports = function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://* 'unsafe-inline'"
  );
  next();
};
