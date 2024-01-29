require('dotenv').config();
const express = require('express');
const fileSystem = require('fs');

const APP = express();
const PORT = process.env.PORT;

APP.set('view engine', 'ejs');
APP.use(express.urlencoded({ extended: true }));
APP.use(express.static('./ejs'));

// Homepage
APP.get('/', (req, res) => {
    res.send('<h1>Assignment 1</h1>')
});

// GET List Books
APP.get('/books', (req, res) => {
    const books = JSON.parse(fileSystem.readFileSync('books.json', 'utf-8'));
    res.send(books)
});

// GET List Books EJS
APP.get('/ejs/books', (req, res) => {
    const books = JSON.parse(fileSystem.readFileSync('books.json', 'utf-8'));
    res.render('bookList', { books: books })
});

// GET Book by ID
APP.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const bookById = JSON.parse(
        fileSystem.readFileSync('books.json', 'utf-8')
    ).find(book => book.id === id);

    if (!bookById) {
        res.send('Error 404: Book not found');
    }
    res.send(bookById);
});

const server = APP.listen(PORT);
process.on("SIGTERM", gracefulShutdown(server));
process.on("SIGINT", gracefulShutdown(server));

// gracefulShutdown
function gracefulShutdown(server) {
    return () => {
        server.close();
        server.closeAllConnections();
        server.closeIdleConnections();
        console.log("gracefully shutdown the server");
    };
};