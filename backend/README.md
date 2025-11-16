# Lab 3

> Weightage: 2.5  
> Deadline: 12:00 AM (Nov 4).  
> _Submissions after the deadline will receive only **75%** of the points earned._

---

### Overview:

In this lab, you will:

- In this lab, you will design and implement a Cart system using Mongoose and Express.
- You will create schemas, use populate function and middleware hooks to manage cart operations dynamically.

---

### File Instructions

You will work on **3 main files**:

1. `modules/carts/carts-model.js`
2. `modules/carts/carts-routes.js`
3. `server.js`
4. `.env`

---

#### modules/carts/carts-model.js

1. Start by importing Mongoose in your file.
2. Create CartProductSchema

   - This schema will represent each product added to the cart.
   - It should include:
     - item: ObjectId reference to the Product model
     - qty: Number, with a minimum value of 0
     - price: Number, with a minimum value of 0
     - Create CartSchema

3. Create CartSchema:

   - This will represent the main cart which will contain:
     - products: an array of CartProductSchema items
     - subtotal: Number (default 0)
     - hst: Number (default 0)
     - total: Number (default 0)

4. Using a Mongoose pre-save hook, before saving a cart, calculate:

   - subtotal = sum of all product prices
   - hst = 15% of subtotal
   - total = subtotal + hst

5. Create the Cart model and export it.

---

#### modules/carts/carts-routes.js

1. **GET /carts/:cartID**

   - Retrieve a specific cart using the provided cartID.
   - Use Mongoose to find the cart by its ID from the database.
   - Populate the products field in the cart with the CartProduct, also populate its related item field with the Product model.
   - If the cart does not exist, respond with a 404 error message.
   - If found, return the complete cart data as a JSON response.

2. **PUT /carts/:cartID**

   - Request body will include:
     - productId: ID of the product to add or update
     - qty: Quantity of that product
   - Find the cart by cartID from the route parameter; if not found, return a 404 error.
   - Retrieve the product from the Product model using productId.
     - If the product doesn’t exist, respond with a 404 error.
   - Calculate the price (product price \* quantity).
   - Check if the product already exists in the cart:
     - If yes, update its quantity and price
     - If no, add it as a new item in the products array
   - Save the updated cart and re-populate product details before sending the response.
   - Return the updated cart as JSON.

---

#### Environment Variables

1. Create a `.env` file with the following:

   ```env
   DB_URL=your_mongodb_connection_string_here
   ```

2. Replace `your_mongodb_connection_string_here` with your actual MongoDB connection URI.

---

#### Test using postman

1. Create customer by sending request to `POST /customers` route with request body:

   ```
   {
      "name": "Replace with your name",
      "email": "Replace with your email",
      "phone": "Replace with your phone"
   }
   ```

   - Once a new customer is created, a new cart is also automatically created for this customer through Mongoose middleware.
   - In the response the cart ID for this customer is included.

2. Use the cart ID from the customer creation response to test `GET /carts/:cartId` and `PUT /carts/:cartId`

---
