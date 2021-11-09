const WarehouseWorker = require("../models/warehouseWorker");

const authenticate = async (req, res) => {
  const user = req.body.data;
  // console.log(user);

  const users = await WarehouseWorker.find();
  // console.log(users[0]._doc.email);
  const userFound = users.find((userX) => userX._doc.email === user.email);
  
  if (userFound  && user.password === userFound.password) {
    res.send(userFound);
  }
  res.status(404).send('Credenciales incorrectas');
}

module.exports = {
  authenticate
}