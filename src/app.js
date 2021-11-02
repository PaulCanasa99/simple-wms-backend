const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());

// connecting to db
const dbURI = 'mongodb://admin:admin@cluster0-shard-00-01.uxkzx.mongodb.net:27017/simple_wms?authSource=admin&replicaSet=atlas-63e2vz-shard-0&readPreference=primary&appname=MongoDB%20Compass&retryWrites=false&directConnection=true&ssl=true';

mongoose.connect(dbURI)
    .then(() => console.log("Database Connected"))
	.catch((err) => console.log(err));

mongoose.Promise = global.Promise;

// importing routes
const productsRoutes = require('./routes/products.routes');
const inboundOrdersRoutes = require('./routes/inboundOrders.routes');
const outboundOrdersRoutes = require('./routes/outboundOrders.routes');
const handlingUnitsRoutes = require('./routes/handlingUnits.routes');
const ordersRoutes = require('./routes/orders.routes');
const locationsRoutes = require('./routes/locations.routes');
const transportOrdersRoutes = require('./routes/transportOrders.routes');


// settings
app.set('port', process.env.PORT || 3001)

// middlewares
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())
app.use(morgan('dev'));

//routes
app.use('/products', productsRoutes);
app.use('/inboundOrders', inboundOrdersRoutes);
app.use('/outboundOrders', outboundOrdersRoutes);
app.use('/handlingUnits', handlingUnitsRoutes);
app.use('/orders', ordersRoutes);
app.use('/locations', locationsRoutes);
app.use('/transportOrders', transportOrdersRoutes);

// starting server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});