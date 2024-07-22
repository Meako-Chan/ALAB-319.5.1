import { MongoClient } from "mongodb";
import mongoose from 'mongoose';
import dotenv from "dotenv"

dotenv.config();

const uri = process.env.ATLAS_URI 

mongoose.connect(uri);

let db = mongoose.connection


export default db;
