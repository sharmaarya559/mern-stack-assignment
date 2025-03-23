const errorMiddleware = (err, req, res, next) => {
  if (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      statusCode: statusCode,
      message: err.message,
    });
  }
  next();
};

export default errorMiddleware;
