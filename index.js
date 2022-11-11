const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b699yx9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('dentiCare').collection('services');
        const reviewCollection = client.db('dentiCare').collection('reviews');

        app.post('/jwt', (req, res) =>{
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
            res.send({token})
        })

        app.get('/services', async(req, res)=>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // reviews 
        app.get('/reviews', async(req, res)=>{
            const query = {}
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.post('/reviews', async(req, res)=>{
            console.log('post api called')
            const review = req.body;
            console.log(review)
            const result = await reviewCollection.insertOne(review);
            review._id = result.insertedId;
            res.send(review);
        });

        // add service 
        app.post('/services', async(req, res) =>{
            console.log('service post api called');
            const service = req.body;
            console.log(service)
            const result = await serviceCollection.insertOne(service);
            service._id = result.insertedId;
            res.send(service);
        })
    }
    finally{

    }
}
run().catch(error => console.error(error));


app.get('/', (req, res)=>{
    res.send("DentiCare Server is running");
})

app.listen(port, () =>{
    console.log(`DentiCare server running on port ${port}`);
})