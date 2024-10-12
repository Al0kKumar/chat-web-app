import express from 'express';
import userauthroutes from './routes/userauth'
import chatroutes from './routes/chat'
const app = express();

require('dotenv').config();

app.use(express.json());

app.use('/api/v1',userauthroutes);

app.use('/api/v1',chatroutes);





app.listen(3000, () => {
    console.log("server is running on port 3000");
     
})