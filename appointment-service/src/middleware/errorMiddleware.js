const errorMiddleware = (error, req, res, next) => {
  if (error.code === 11000) {
    return res.status(409).json({ message: "This doctor slot is already booked" });
  }

  const statusCode = error.statusCode || error.response?.status || 500;
  const message =
    error.response?.data?.message ||
    error.message ||
    "Internal server error";

  return res.status(statusCode).json({ message });
};

module.exports = errorMiddleware;
