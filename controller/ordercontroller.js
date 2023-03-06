
const Order = require("../models/Order");
const Products = require("../models/Products");



// Create new Order
exports.newOrder = (async (req, res, next) => {
 try {
     const {
       shippingInfo,
       orderItems,
       paymentInfo,
       itemsPrice,
       taxPrice,
       shippingPrice,
       totalPrice,
     } = req.body;
   
     const order = await Order.create({
       shippingInfo,
       orderItems,
       paymentInfo,
       itemsPrice,
       taxPrice,
       shippingPrice,
       totalPrice,
       paidAt: Date.now(),
       user: req.user._id,
     });
   
     res.status(201).json({
       success: true,
       order,
     });
 } catch (err) {
  console.log("error in order")
    res.json({
        success:false,
        message:err.message
    })
 }
});

// get Single Order
exports.getSingleOrder = (async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return res.json({
        message:"orderr is is not found",
        statusCode:404
    });
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = (async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders =(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = (async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return  res.json({
        message:"orderr is is not found",
        statusCode:404
    });;
  }

  if (order.orderStatus === "Delivered") {
    return res.json({
        message:"orderr is is not found",
        statusCode:404
    });
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Products.findById(id);

  product.Stock -= quantity;

  await Products.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = (async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.json({
        message:"orderr is is not found",
        statusCode:404
    });
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});


