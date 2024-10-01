const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const Track = require('./Modal/TrackModal.js')
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.post('/createpost',async(req,res)=>{
    console.log(req.body);
    const { category, amount, info, date } = req.body;

    if (!category || !amount || !date) {
        return res.status(400).json({ error: 'Category, amount, and date are required.' });
    }

    try{
        const allpost = await Track.find();
        let nextind;
        if(allpost.length===0)nextind=0;
        else nextind=allpost[allpost.length-1].id+1;
        const data = await Track.create({
            id:nextind,
            category:req.body.category,
            amount:req.body.amount,
            info:req.body.info,
            date:req.body.date,
        })
        res.status(200).json('it is been submitted')
    }catch(err){
        console.log(err);
        res.json('error is coming')
    }
})
app.get('/getpost', async (req, res) => {
    try {
        const data = await Track.find().sort({date:1});
        console.log(data);
        res.status(200).json(data); // Sending response as JSON
    } catch (err) {
        console.error(err); // Use console.error for errors
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});
app.delete('/deletepost/:id', async (req, res) => {
    console.log('delete');
    try {
        const id = req.params.id;
        const data = await Track.findOneAndDelete({ id: id });

        if (!data) {
            return res.status(404).json({ error: 'Record not found.' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the post.' });
    }
});
mongoose.connect(process.env.database)
.then(()=>{
    console.log('running')
}).catch(err => {
    console.log(err);
  });
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });