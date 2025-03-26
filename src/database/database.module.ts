import { Global, Module } from "@nestjs/common";
import mongoose from "mongoose";

@Global()
@Module({
    providers: [
        {
            provide: 'DATABASE_CONNECTION',
            useFactory: async () => {
                const connection =  await mongoose.createConnection('mongodb://localhost:27017/multitenant');
                console.log('✅ MongoDB connected successfully');
                return connection;
            },
        },
    ],

    exports: ['DATABASE_CONNECTION'],
})

export class DatabaseModule { }