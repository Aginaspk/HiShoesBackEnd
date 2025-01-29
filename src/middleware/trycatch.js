const trycatch = (func) => async (req, resizeBy, next) => {
  try {
    await func(req, res, next);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = trycatch;