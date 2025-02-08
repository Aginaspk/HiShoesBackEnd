import CustomError from "../utils/customError.js";

const manageError = (err, req, res, next) => {
  console.log(err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode || 404).json({
      status: "fail",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "fail",
    message: err.message || "internal Server Error",
  });
};

export default manageError;