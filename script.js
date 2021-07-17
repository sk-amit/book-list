let form = document.querySelector('form');
let bookList = document.querySelector('#book-list');



// oop constructor template
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    };
};


class UI{
    static addToBookList(book){
        let list = document.querySelector('#book-list');
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">x</a></td>
        `
        list.appendChild(row);
    };

    static clearFields(){
        document.querySelector('#title').value= '',
        document.querySelector('#author').value= '',
        document.querySelector('#isbn').value= '';
    };


    static showAlert(message, className){
        let div = document.createElement('div');
        div.className = `alert ${className}`
        div.appendChild(document.createTextNode(message));
        let conatiner = document.querySelector('.container');
        let form = document.querySelector('form');
        conatiner.insertBefore(div, form);

        setTimeout(()=>{
            document.querySelector('.alert').remove();
        }, 2000);
    };

    static deleteFormBook(target){
        if(target.hasAttribute('href')){
            target.parentElement.parentElement.remove();
            Storage.removeBook(target.parentElement.previousElementSibling.textContent.trim());
            UI.showAlert('Remove Book Successfully', 'success');
        }
    }
};


// oop based - local storage data
class Storage{

    //local storage check data
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    };

    // local storage add data
    static addBook(book){
        let books = Storage.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    //  bring data from local storage and display or set with dom element
    static displayBook(){
        let books = Storage.getBooks();
        books.forEach(book=>{
            UI.addToBookList(book);
        });
    }

    static removeBook(isbn){
        let books = Storage.getBooks();

        books.forEach((book, index)=>{
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
};


// add event listener
form.addEventListener('submit', newBook);
bookList.addEventListener('click', removeBook);
document.addEventListener('DOMContentLoaded', Storage.displayBook());




function newBook(e){
    e.preventDefault();
    let title = document.querySelector('#title').value,
    author = document.querySelector('#author').value,
    isbn = document.querySelector('#isbn').value;

    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('please add all the fields', 'error');
    } else{
        let book = new Book(title, author, isbn);
        UI.addToBookList(book);
        UI.clearFields();
        UI.showAlert('Book Added', 'success');

        Storage.addBook(book);
    };
};



function removeBook(e){
    e.preventDefault();
    UI.deleteFormBook(e.target);
}