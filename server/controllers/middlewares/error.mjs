// 404 핸들러
export function notFound(req, res, next) {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
}

// 에러 핸들러
export function errorHandler(err, req, res, next) {
  console.error("Error:", err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
