const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()

// middle ware 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rrj86.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanic');
        const servicesCollection = database.collection("services");
        console.log('conected to database');

        //Get API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //Get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('getting specific service',id)
            const query = { _id: ObjectId(id) }
            const services = await servicesCollection.findOne(query);
            res.json(services);
        })
        //  POST API 
        app.post('/services', async (req, res) => {
            const services = req.body;
            console.log('hit the post', services)
            const result = await servicesCollection.insertOne(services);
            console.log(result)
            res.json(result)
        })
        // // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })


    }

    finally {
        // await client.close()
    }

}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Running genius car')
})
app.listen(port, () => {
    console.log('Running genius server', port)
})