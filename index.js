const express = require('express')
const cors = require('cors');
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