const WarehouseWorker = require("../models/warehouseWorker");

const authenticate = async (req, res) => {
  const user = req.body.data;

  const users = await WarehouseWorker.find();
  const userFound = users.find((userX) => userX._doc.email === user.email);
  
  if (userFound  && user.password === userFound.password) {
    res.send(userFound);
    return;
  }
  res.status(404).send('Credenciales incorrectas');
}

module.exports = {
  authenticate
}