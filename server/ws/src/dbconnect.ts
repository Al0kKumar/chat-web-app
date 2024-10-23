import mongoose from "mongoose";

const dbconnect = async () => {

    try {
        await  mongoose.connect(process.env.MONGO_URL as string);

        console.log('Mongodb connected ');
        
    } catch (error) {
        console.error('Error occured during mongo connection', error);
        
    }

}

export default dbconnect;