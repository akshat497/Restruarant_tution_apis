const Customer = require("../../modals/Customer");
const Order = require("../../modals/Order");
const Items = require("../../modals/items");

const handleResponse = require("../services/handleResponse");

const orderController = {
  createOrder: async (req, res) => {
    try {
      const { userID, items, name, phone, email, isActive, message } = req.body;
      console.log(items);
      const customer = await Customer.create({
        userID,
        name,
        phone,
        email,
      });

      const order = await Order.create({
        userID,
        customerID: customer._id,
        isActive,
        message,
      });

    //   for (const item of items) {
    //     const newItem = await Items.create({
    //       orderID: order._id,
    //       productID: item.productID,
    //       Quantity: item.quantity
    //     });
    //   }
      









for (const item of items) {
    const items=await Items.create({
        orderID:order._id,
        productID:item.productID,
        Quantity:item.quantity
    })
    
}

      
    
      return handleResponse(
        res,
        200,
        "order created successfully",
        null,
        null,
        true
      );
    } catch (error) {
      return handleResponse(res, 500, "failed", error, null, false);
    }
  },
  //   getOrders: async (req, res) => {
  //     try {

  //       const { userID } = req.body;
  //       const customers = await Customer.find({ userID }).lean(); // Convert to plain JS objects

  //       const orders = await Order.find({ userID });

  //       const customersOrders = customers.map((customer) => {
  //         const customerOrders = orders.filter(
  //           (order) => order.customerID.toString() === customer._id.toString()
  //         );
  //         return { ...customer, orders: customerOrders };
  //       });

  //       return handleResponse(
  //         res,
  //         200,
  //         "orders fetched successfully",
  //         null,
  //         customersOrders,
  //         true
  //       );
  //     } catch (error) {
  //       return handleResponse(res, 500, "failed", error, null, false);
  //     }
  //   },
  getOrders: async (req, res) => { // Define an asynchronous function called getOrders, taking request and response objects as parameters
    try { // Begin a try block to handle potential errors
      const customers = await Customer.find({ userID: req.user._id }).lean(); // Retrieve customers associated with the current user ID
      const orders = await Order.find({ userID: req.user._id }); // Retrieve orders associated with the current user ID
  
      const customerData = []; // Initialize an array to store customer data
      for (const customer of customers) { // Iterate through each customer
        const customerOrders = orders.filter(order => // Filter orders to find those belonging to the current customer
          order.customerID.equals(customer._id)
        );
  
        const orderData = []; // Initialize an array to store order data
        for (const order of customerOrders) { // Iterate through each order belonging to the current customer
          const items = await Items.find({ orderID: order._id }); // Retrieve items associated with the current order
          orderData.push({ ...order.toObject(), items }); // Add order data, including associated items, to the orderData array
        }
  
        customerData.push({ ...customer, orders: orderData }); // Add customer data, including associated orders, to the customerData array
      }
  
      // Send a successful response with the fetched data using the handleResponse function
      handleResponse(res, 200, "Fetched successfully", null, customerData, true);
    } catch (error) { // Catch any potential errors that occur within the try block
      // Send an error response with the error message using the handleResponse function
      handleResponse(res, 500, "Failed", error.message, null, false);
    }
  }
  
  
  
  
  
};
module.exports = orderController;
