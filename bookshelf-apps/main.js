


const penulis = document.getElementById('inputBookAuthor');
const masukkan = document.getElementById('inputBook');
const RENDER_EVENT = 'render-book';

// Menyiapkan objek kosong untuk diisi nanti
const buku = [];

document.addEventListener('DOMContentLoaded', () => {
  masukkan.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });



  function addBook() {
    // Inisialisasi setiap elemen
    const title = document.getElementById('inputBookTitle').value;
    const year = parseInt(document.getElementById('inputBookYear').value);
    const author = document.getElementById('inputBookAuthor').value;
    const selesaiBaca = document.getElementById('inputBookIsComplete').checked;
    // Untuk membuat id 
    const id = +new Date();


    const objek = objekBuku(id, title, author, year, selesaiBaca);

    // menambahakan objek ke variabel buku
    buku.push(objek);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function objekBuku(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete
    }
  }

  function makeList(objekBuku) {

    const textTitle = document.createElement('h3')
    textTitle.innerText = objekBuku.title;

    const author = document.createElement('p')
    author.innerText = `Penulis: ${objekBuku.title}`;

    const year = document.createElement('p')
    year.innerText = `Tahun: ${objekBuku.year}`;

    // sini
    const button1 = document.createElement('button');
    button1.innerText = 'Belum Selesai dibaca';
    button1.classList.add('green');

    const button2 = document.createElement('button');
    button2.innerText = 'Hapus Buku';
    button2.classList.add('red');

    const buttonContainer = document.createElement('div')
    const articleContainer = document.createElement('article');

    // menanmbahkan class
    buttonContainer.classList.add('action');
    articleContainer.classList.add('book_item');

    // menambahkan elemen
    buttonContainer.append(button1, button2);
    articleContainer.append(textTitle, author, year, buttonContainer);

    return articleContainer;

  }

  // Debugging only
  document.addEventListener(RENDER_EVENT, () => {
    console.log(buku);
    const incompleteBookList = document.getElementById('incompleteBookshelfList');
    const completeBookList = document.getElementById('completeBookshelfList');
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    for (item of buku) {
      const elemenBuku = makeList(item);
      if (!buku[0].isComplete) {
        incompleteBookList.append(elemenBuku);
        console.log(`kondisi: ${buku}`);
      } else {
        completeBookList.append(elemenBuku);
        console.log('belum');
      }
    }

  });
});



