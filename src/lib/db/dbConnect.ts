import mongoose from "mongoose"

export default async function dbConnect(){
    return mongoose.connect(process.env.DATABASE_URL!)
}