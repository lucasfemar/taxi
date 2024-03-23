import express from 'express';

const app = express();
app.use(express.static('public'));

app.listen(8080, () => {
    console.log('\x1b[36m%s\x1b[0m', 'Server running at http://localhost:8080');
});
