import express from 'express';
import cors from 'cors'
import userauthroutes from './routes/userauthRoutes'
import chatroutes from './routes/chatRoute'
import searchroutes from './routes/searchRoute'



const app = express();

app.use(cors());

require('dotenv').config();

app.use(express.json());


app.use('/api/v1',userauthroutes); // done 
app.use('/api/v1',chatroutes);
app.use('/api/v1', searchroutes)


app.listen(process.env.PORT1, () => {
    console.log("server is running on port 8080");
     
})