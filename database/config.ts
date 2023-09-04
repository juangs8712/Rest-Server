import mongoose, { MongooseOptions } from "mongoose";

// -----------------------------------------------------
export const dbConnection = async () => {
    try {
        await mongoose.connect( process.env.MONGODB_CNN ?? '',
            // {
            //     strictQuery: false
            //     // useNewUrlParser: true,
            //     // useUnifiedTopology: true,
            //     // useCreateIndex: true
            //     // useFindAndModify: false
            // } 
        );
        console.log( 'Base de datos conectada.' )
    } catch (error) {
        console.log( error );
        throw new Error('Error de conexión con la base de datos');
    }
}
// -----------------------------------------------------