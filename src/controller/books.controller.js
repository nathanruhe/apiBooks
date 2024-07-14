// const Book = require('../models/book');
const {pool} = require("../database");

// let books = [
//     new Book ( 1, undefined, "El principito", "tapa blanda", "Antoine de Saint.Exupery", 7.95, "https://cdn.kobo.com/book-images/86caf6ab-35d2-4e48-8a0a-d28d4987f7fc/353/569/90/False/el-principito-45.jpg"),

//     new Book ( 2, undefined, "El poder", "tapa blanda", "Pedro Baños", 11.35, "https://m.media-amazon.com/images/I/91eDJrp+KiL._AC_UF894,1000_QL80_.jpg"),

//     new Book ( 3, undefined, "Diario de Ana Frank", "tapa blanda", "Ana Frank", 9.75, "https://m.media-amazon.com/images/I/71dWcI94iPS._AC_UF894,1000_QL80_.jpg"),
// ];

async function getAllBooks(request, response) {
    try {
        let sql;
        let params;

        sql = `SELECT * FROM book WHERE id_user = ?`;
        params = [request.query.id_user];

        let [result] = await pool.query(sql, params);
        
        response.send(result);

    } catch (error) {
        console.log(error);
    };
};

// PARAMS
async function getBook(request, response) {
    try {
        let sql;
        let params;
        let respuesta;

        if (request.params.id_book && request.params.id_book) {
            sql = `SELECT * FROM book WHERE id_user = ? AND id_book = ?`;
            params = [request.params.id_user, request.params.id_book];

            let [result] = await pool.query(sql, params);

            if (result.length > 0) {
                respuesta = ({ error: false, codigo: 200, mensaje: "Libro encontrado", data: result[0] });
            } else {
                respuesta = ({ error: true, codigo: 200, mensaje: "Libro no encontrado" });
            };
        };

        response.send(respuesta);
        
    } catch (error) {
        console.log(error);
    };
};

async function postBook(request, response) {
    try {
        let sql;
        let params;
        let respuesta;

        sql = `SELECT * FROM book WHERE id_book = ?`;
        params = [request.body.id_book];

        let [existe] = await pool.query(sql, params);

        if (existe.length > 0) {
            respuesta = {error: true, codigo: 200, mensaje: "La referencia introducida ya existe"};
        } else {
            sql = `INSERT INTO book (id_book, title, type, author, price, photo, id_user)
                             VALUES (?, ?, ?, ?, ?, ?, ?)`;
            params = [
                request.body.id_book,
                request.body.title,
                request.body.type,
                request.body.author,
                request.body.price,
                request.body.photo,
                request.body.id_user];

            let [result] = await pool.query(sql, params);
            respuesta = {error: false, codigo: 200, mensaje: "Libro añadido", data: result};
        };

        response.send(respuesta);

    } catch (error) {
        console.log(error);
    };   
};

async function putBook(request, response) {
    try {
        let sql;
        let params;
        let respuesta;

        sql = `SELECT * FROM book WHERE id_book = ?`;
        params = [request.body.id_book];

        let [existe] = await pool.query(sql, params);

        if (existe.length === 0) {
            respuesta = {error: true, codigo: 200, mensaje: "La referencia introducida no existe"};
        } else {
            sql = `UPDATE book SET  
                title = COALESCE(?, title), 
                type = COALESCE(?, type), 
                author = COALESCE(?, author), 
                price = COALESCE(?, price),
                photo = COALESCE(?, photo)
            WHERE id_book = ?`;
            params = [
                request.body.title,
                request.body.type,
                request.body.author,
                request.body.price,
                request.body.photo,
                request.body.id_book];

            let [result] = await pool.query(sql, params);
            respuesta = {error: false, codigo: 200, mensaje: "Libro modificado", data: result};
        };
        
        response.send(respuesta);

    } catch(error) {
        console.log(error);
    };
};

async function deleteBook(request, response) {
    try {
        let sql;
        let params;
        let respuesta;

        sql = `DELETE FROM book WHERE id_book = ?`;
        params = [request.body.id_book];

        let [result] = await pool.query(sql, params);

        if (result.affectedRows > 0) {
            respuesta = {error: false, codigo: 200, mensaje: "Libro eliminado"};
        } else {
            respuesta = {error: true, codigo: 200, mensaje: "No se ha podido eliminar el libro"};
        };

        response.send(respuesta);

    } catch (error) {
        console.log(error);
    };
};

module.exports = { getAllBooks, getBook, postBook, putBook, deleteBook };