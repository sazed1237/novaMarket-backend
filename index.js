const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
const path = require('path');


// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p5uwskw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();
    const userCollection = client.db("novaMarket").collection("users");
    const productCollection = client.db("novaMarket").collection("products");
    const categoriesCollection = client.db("novaMarket").collection("categories");
    const highlightsProductsCollection = client.db("novaMarket").collection("highlightsProducts");
    const blogCollection = client.db("novaMarket").collection("blogs");
    const cartCollection = client.db("novaMarket").collection("cart");
    const orderCollection = client.db("novaMarket").collection("orders");


    app.get('/categories', async (req, res) => {
      const category = await categoriesCollection.find().toArray()
      // console.log(category)
      res.send(category)
    })

    app.get('/categories/:id', async (req, res) => {
      const id = req.params.id
      const query = { _base: id }

      const matchedProducts = await productCollection.find(query).toArray()
      // console.log(matchedProducts)

      if (!matchedProducts || matchedProducts.length === 0) {
        return res.status(404).json({ message: "No products matched with this category" })
      }
      
      res.send(matchedProducts)
    })


    app.get('/highlights', async (req, res) => {
      const highlights = await highlightsProductsCollection.find().toArray()
      res.send(highlights)
    })

    app.get('/blogs', async (req, res) => {
      const blogs = await blogCollection.find().toArray()
      res.send(blogs)
    })


    // products 
    app.get('/products', async (req, res) => {
      const products = await productCollection.find().toArray()
      res.send(products)
    })

    app.get('/products/:id', async (req, res) => {
      const productId = req.params.id
      const query = { _id: new ObjectId(productId) }
      const result = await productCollection.findOne(query)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})