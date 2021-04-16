import mongoose from 'mongoose';

const connectMongo = async () => {
    try {
        if (process.env.MONGO_URI) {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });

            console.log('Connected to the database!');
        } else {
            console.log('No Mongo URI found!');
        }
    } catch (error) {
        console.log(`Error while connecting to MongoDB: ${error.message}`);
    }
}

export default connectMongo;