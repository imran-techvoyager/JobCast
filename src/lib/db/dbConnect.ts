import mongoose from "mongoose"

export default async function dbConnect(){
    console.log("hii");
    return mongoose.connect(process.env.DATABASE_URL!)
}