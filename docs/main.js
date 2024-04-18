// import Swal from 'sweetalert2'
// const Swal = require('sweetalert2')
const masukkan = document.getElementById("inputBook");
const ceklis = document.getElementById("inputBookIsComplete");
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK-SHELF-APPS";

// Menyiapkan objek kosong untuk diisi nanti
const buku = [];

document.addEventListener("DOMContentLoaded", () => {
  masukkan.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
    if (ceklis.checked) {
      Swal.fire({
        title: "Berhasil ditambahkan ke Selesai baca",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Berhasil ditambahkan ke Belum selesai baca",
        icon: "success",
      });
    }
  });

  function addBook() {
    // Inisialisasi setiap elemen
    const title = document.getElementById("inputBookTitle").value;
    const year = parseInt(document.getElementById("inputBookYear").value);
    const author = document.getElementById("inputBookAuthor").value;
    const selesaiBaca = document.getElementById("inputBookIsComplete").checked;
    // Untuk membuat id
    const id = +new Date();

    const objek = objekBuku(id, title, author, year, selesaiBaca);

    // menambahakan objek ke variabel buku
    buku.push(objek);

    let form = document.getElementById("inputBook");
    form.reset();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function objekBuku(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

  function makeList(objekBuku) {
    const textTitle = document.createElement("h3");
    textTitle.innerText = objekBuku.title;

    const author = document.createElement("p");
    author.innerText = `Penulis: ${objekBuku.author}`;

    const year = document.createElement("p");
    year.innerText = `Tahun: ${objekBuku.year}`;

    const buttonSection = document.createElement("div");
    buttonSection.classList.add("action");

    const greenButton = document.createElement("button");
    greenButton.classList.add("green");
    const redButton = document.createElement("button");
    redButton.classList.add("red");

    // redButton.innerText = 'Hapus Buku';
    // delete book button
    redButton.innerHTML =
      '<span class="material-symbols-outlined">delete_forever</span>';

    const articleContainer = document.createElement("article");
    articleContainer.classList.add("book_item");
    articleContainer.setAttribute("id", `${objekBuku.id}`);

    articleContainer.append(textTitle, author, year, buttonSection);

    if (objekBuku.isComplete) {
      greenButton.innerText = "Belum Selesai dibaca";
      //   unread button
      greenButton.innerHTML =
        '<span class="material-symbols-outlined">refresh</span>';
      buttonSection.append(greenButton, redButton);

      greenButton.addEventListener("click", () => {
        moveToIncompleteBook(objekBuku.id);
        Swal.fire({
          title: "Belum Selesai dibaca",
          text: `${objekBuku.title} dipindahkan ke Belum selesai dibaca.`,
          icon: "info",
        });
      });

      redButton.addEventListener("click", () => {
        Swal.fire({
          title: `Anda yakin ingin menghapus ${objekBuku.title} dari daftar Selesai dibaca?`,
          text: "Anda tidak akan bisa mengembalikan perubahan ini!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Batal",
          confirmButtonText: "Ya",
        }).then((result) => {
          if (result.isConfirmed) {
            deleteBook(objekBuku.id);
            Swal.fire(
              "Berhasil dihapus!",
              `Buku ${objekBuku.title} berhasil dihapus dari daftar Selesai dibaca`,
              "success"
            );
          }
        });
      });
    } else {
      // readed button
      greenButton.innerHTML =
        '<span class="material-symbols-outlined">done</span>';
      buttonSection.append(greenButton, redButton);

      greenButton.addEventListener("click", () => {
        moveToCompleteBook(objekBuku.id);
        Swal.fire({
          title: "Selesai!",
          text: `${objekBuku.title} Selesai dibaca.`,
          icon: "success",
        });
      });

      redButton.addEventListener("click", () => {
        Swal.fire({
          title: `Anda yakin ingin menghapus ${objekBuku.title} dari daftar Belum selesai dibaca?`,
          text: "Anda tidak akan bisa mengembalikan perubahan ini!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Batal",
          confirmButtonText: "Ya",
        }).then((result) => {
          if (result.isConfirmed) {
            deleteBook(objekBuku.id);
            Swal.fire(
              "Berhasil dihapus!",
              `Buku ${objekBuku.title} berhasil dihapus dari daftar Belum selesai dibaca`,
              "success"
            );
          }
        });
      });
    }

    return articleContainer;
  }

  function findBookId(bookId) {
    for (const bookItem of buku) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  function findBookIndex(bookId) {
    for (index in buku) {
      if (buku[index].id === bookId) {
        return index;
      }
    }

    return -1;
  }

  function moveToIncompleteBook(bookId) {
    const bookTarget = findBookId(bookId);

    if (bookTarget === null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function moveToCompleteBook(bookId) {
    const bookTarget = findBookId(bookId);

    if (bookTarget === null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function deleteBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;

    buku.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function isStorageExist() {
    if (typeof Storage === undefined) {
      alert("Browser tidak mendukung web storage");
      return false;
    }
    return true;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(buku);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  function loadBookFromStorage() {
    const dataFromStorage = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(dataFromStorage);

    if (data !== null) {
      for (const book of data) {
        buku.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  document.addEventListener(RENDER_EVENT, () => {
    const incompleteBookList = document.getElementById(
      "incompleteBookshelfList"
    );
    const completeBookList = document.getElementById("completeBookshelfList");
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    for (item of buku) {
      const elemenBuku = makeList(item);
      if (!item.isComplete) {
        incompleteBookList.append(elemenBuku);
      } else {
        completeBookList.append(elemenBuku);
      }
    }
  });

  // document.addEventListener(SAVED_EVENT, () => {
  //   console.log(localStorage.getItem(STORAGE_KEY));
  // });

  if (isStorageExist()) {
    loadBookFromStorage();
  }
});
