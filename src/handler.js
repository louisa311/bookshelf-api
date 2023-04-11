/* eslint-disable eqeqeq */
const { nanoid } = require('nanoid');
const books = require('./books');
const validation = require('./validation');

const saveBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const requestValidation = {
    name, readPage, pageCount,
  };

  const validationMessage = validation.saveBookValidation(requestValidation);

  if (validationMessage != null) {
    const response = h.response({
      status: 'fail',
      message: validationMessage,
    }).code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  let bookList = books;
  if (request.query.reading) {
    const reading = request.query.reading == 1;
    bookList = books.filter((book) => book.reading === reading);
  } if (request.query.finished) {
    const finished = request.query.finished == 1;
    bookList = books.filter((book) => book.finished === finished);
  } if (request.query.name) {
    bookList = books.filter(
      (book) => book.name.toLowerCase().includes(request.query.name.toLowerCase()),
    );
  }
  const response = h.response({
    status: 'success',
    data: {
      books: bookList.map((book) => (
        {
          id: book.id, name: book.name, publisher: book.publisher,
        })),
    },
  }).code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const requestValidation = {
    name, readPage, pageCount,
  };

  const validationMessage = validation.updateBookValidation(requestValidation);

  if (validationMessage != null) {
    const response = h.response({
      status: 'fail',
      message: validationMessage,
    }).code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
  return response;
};

module.exports = {
  saveBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  deleteBookByIdHandler,
  editBookByIdHandler,
};
