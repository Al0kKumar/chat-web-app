import express from 'express';
import cors from 'cors'
import chatroutes from './routes/chatRoute'
import searchroutes from './routes/searchRoute'
import userauthRoutes from './routes/userauthRoutes'; // Make sure this path is correct


const app = express();

app.use(cors());

require('dotenv').config();

app.use(express.json());


app.use('/api/v1',userauthRoutes); // done 
app.use('/api/v1',chatroutes);
app.use('/api/v1', searchroutes)


app.listen(process.env.PORT1, () => {
    console.log(`server is running on port ${process.env.PORT1}`);
     
})