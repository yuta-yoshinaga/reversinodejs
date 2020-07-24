const express = require('express');
const app = express();
const port = 3000;

const ReversiPlay = require('./ReversiPlay');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/FrontController', (req, res) => {
    var rvPlay = new ReversiPlay();
    console.log(req.body.func);
    res.send('Hello node.js World!')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));