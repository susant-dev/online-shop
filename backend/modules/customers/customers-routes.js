const { Router } = require("express");
const createCustomerRules = require("./middlewares/create-customers-rules");
const updateCustomerRules = require("./middlewares/update-customers-rules");

const CustomerModel = require("./customers-model");

const customersRoute = Router();

customersRoute.get("/customers", async (req, res) => {
  const allCustomers = await CustomerModel.find();
  if (!allCustomers) res.send([]);
  res.json(allCustomers);
});

customersRoute.get("/customers/:id", async (req, res) => {
  const customerID = req.params.id;
  const foundCustomer = await CustomerModel.findById(customerID);
  if (!foundCustomer) {
    return res.status(404).send(`Customer with ${customerID} doesn't exist`);
  }
  res.json(foundCustomer);
});

customersRoute.post("/customers", createCustomerRules, async (req, res) => {
  const newCustomer = req.body;
  const existingCustomer = await CustomerModel.findOne({
    email: newCustomer.email,
  });
  if (existingCustomer) {
    return res
      .status(500)
      .send(`Customer with ${newCustomer.email} already exist`);
  }
  const addedCustomer = await CustomerModel.create(newCustomer);
  if (!addedCustomer) {
    return res.status(500).send(`Oops! Customer couldn't be added!`);
  }
  res.json(addedCustomer);
});

customersRoute.put("/customers/:id", updateCustomerRules, async (req, res) => {
  const customerID = req.params.id;
  const newCustomer = req.body;
  const foundCustomer = await CustomerModel.findById(customerID);
  if (!foundCustomer) {
    return res.status(404).send(`Customer with ${customerID} doesn't exist`);
  }
  const updatedCustomer = await CustomerModel.findByIdAndUpdate(
    customerID,
    {
      $set: newCustomer,
    },
    { new: true }
  );

  if (!updatedCustomer) {
    return res.status(500).send(`Oops! Customer couldn't be updated!`);
  }
  res.json(updatedCustomer);
});

customersRoute.delete("/customers/:id", async (req, res) => {
  const customerID = req.params.id;
  const foundCustomer = await CustomerModel.findById(customerID);
  if (!foundCustomer) {
    return res.status(404).send(`Customer with ${customerID} doesn't exist`);
  }
  const deletedCustomer = await CustomerModel.findByIdAndDelete(customerID);
  if (!deletedCustomer) {
    return res.status(500).send(`Oops! Customer couldn't be deleted!`);
  }
  res.json(deletedCustomer);
});

module.exports = { customersRoute };
