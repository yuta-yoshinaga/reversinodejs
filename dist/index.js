const express = require('express');
const app = express();
const port = 3000;
const ReversiPlay = require('./ReversiPlay');
app.use(express.static('public'));
app.post('/FrontController', (req, res) => {
    var rvPlay = new ReversiPlay();
    console.dir(req, { depth: 3 });
    res.send('Hello node.js World!');
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//# sourceMappingURL=index.js.map