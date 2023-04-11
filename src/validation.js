const saveBookValidation = (requestValidation) => {
  const {
    name, pageCount, readPage,
  } = requestValidation;

  if (!name || name.trim() === '') {
    return 'Gagal menambahkan buku. Mohon isi nama buku';
  }

  if (readPage > pageCount) {
    return 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
  }
  return null;
};

const updateBookValidation = (requestValidation) => {
  const {
    name, pageCount, readPage,
  } = requestValidation;

  if (!name || name.trim() === '') {
    return 'Gagal memperbarui buku. Mohon isi nama buku';
  }

  if (readPage > pageCount) {
    return 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount';
  }
  return null;
};

module.exports = {
  saveBookValidation, updateBookValidation,
};
