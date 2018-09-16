const router = express.Router();

app.put('/', (req, res) => {
    console.log(req.body)
    db.get('users')
    .find({ id: 'dhaval' })
    .assign({ category: req.body.category })
    .assign({ genre: req.body.genre })
    .write();
    res.send('Your preferences have been successfully updated.');
});
