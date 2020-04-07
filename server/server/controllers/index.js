const indexControllers = {};

indexControllers.getIndex = (req, res, next) => {
  res.send({ Hello: "Nodejs" });
};

export default indexControllers;
