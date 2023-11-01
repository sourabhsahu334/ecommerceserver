const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;
const db = process.env.DATABASE_URL
// Connect MongoDB at default port 27017.

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   

   
}).then(()=>{
    console.log('connection succes');
}).catch((e)=>{
    console.log('no connect'+e);
});


