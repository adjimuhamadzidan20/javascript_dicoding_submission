const BOOKS = [];
const STORAGE_KEY = 'BOOK_DATA';
const RENDER_EVENT = 'RENDER_BOOKS';
const SAVED_EVENT = 'SUCCESS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        putBookList();
    });

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
        const bookListElement = document.querySelectorAll('h3');

        for (book of bookListElement) {
            if (searchBook != '') {
                console.log(searchBook);
                console.log(book.innerText.toLowerCase());

                console.log(book.innerText.toLowerCase().includes(searchBook));

                if (book.innerText.toLowerCase().includes(searchBook)) {
                    book.parentElement.parentElement.style.display = "block";
                } else {
                    book.parentElement.parentElement.style.display = "none";
                }
            }
            else {
                book.parentElement.parentElement.style.display = "block";
            }
        }
    });

    if (checkForStorage) {
        if (localStorage.getItem(STORAGE_KEY) !== null) {
            getData();
        }
    } else {
        alert('Browser yang Anda gunakan tidak mendukung Web Storage');
    }
});

document.addEventListener( RENDER_EVENT, function() {
    const uncompletedBookRead = document.getElementById('incompleteBookshelfList');
    uncompletedBookRead.innerHTML= '';
   
    const completeBookRead = document.getElementById('completeBookshelfList');
    completeBookRead.innerHTML = '';
   
    for (const bookItem of BOOKS) {
      const elem = setBooklayout(bookItem);

      if (!bookItem.isComplete) {
          uncompletedBookRead.append(elem);
      } else {
          completeBookRead.append(elem);
      }
      }
});

function generateobj(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete
    }
}

// ambil dari localStorage 
function getData() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
 
    if (data !== null) {
        for (const book of data) {
            BOOKS.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

//buat List
function putBookList() {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;
    const inputId = generateId();

    const obj = generateobj(inputId, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    BOOKS.push(obj);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    document.getElementById('inputBookTitle').value = '';
    document.getElementById('inputBookAuthor').value = '';
    document.getElementById('inputBookYear').value = '';
    document.getElementById('inputBookIsComplete').checked = '';
}

//simpan ke local storage
function saveData() {
    if (checkForStorage()) {
        const parsed = JSON.stringify(BOOKS);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function generateId() {
    return +new Date();
}

function setBooklayout(obj) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = obj.title;
 
    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis :' + obj.author;
 
    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun :' + obj.year
 
    const textContainer = document.createElement('div');
    textContainer.classList.add('action');
    textContainer.append(textTitle, textAuthor, textYear);
 
    const container = document.createElement('div')
    container.classList.add('book_item');
    container.append(textContainer);
    container.setAttribute('id', `book-${obj.id}`);
 
    if (obj.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = 'Belum Selesai Dibaca';
 
        undoButton.addEventListener('click', function() {
            undoComplete(obj.id);
        });
      
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus';
 
        deleteButton.addEventListener('click', function () {
            removeBook(obj.id)
        });
 
        textContainer.append(undoButton, deleteButton);
    } else {
        const finishButton = document.createElement('button');
        finishButton.classList.add('green');
        finishButton.innerText = 'Selesai Dibaca';
 
        finishButton.addEventListener('click', function () {
            console.log(obj.id);
            toComplete(obj.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus';
 
        deleteButton.addEventListener('click', function () {
            removeBook(obj.id)
        });
 
        textContainer.append(finishButton, deleteButton);
    }
    
    return container;
}

function checkForStorage() {
    return typeof (Storage) !== 'undefined';
}

function removeBook(bookId) {
    const bookTarget = findIndex(bookId);
 
    if (bookTarget === -1) return;
 
    BOOKS.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findIndex(bookId) {
    for (const index in BOOKS) {
        if (BOOKS[index].id === bookId) {
            return index;
        }
    }
 
    return -1;
}

function toComplete(bookId) {
    const bookTarget = findIndex(bookId);
 
    if (bookTarget == null) return;

    BOOKS[bookTarget].isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoComplete(bookId) {
    const bookTarget = findIndex(bookId);
 
    if (bookTarget == null) return;

    BOOKS[bookTarget].isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}