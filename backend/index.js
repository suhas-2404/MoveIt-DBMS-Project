import express from "express"

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World! Welcome to Express!');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});