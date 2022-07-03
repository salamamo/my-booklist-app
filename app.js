// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
    }
    
    // UI Class: Handle UI Tasks    
    class UI {
    static displayBooks() {
        var books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        var list = document.querySelector('#book-list');

        var row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

        list.appendChild(row);
    }

    static deleteBook(target) {
        if(target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        } 
    }

    static showAlert(message, className) {
        var div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        var container = document.querySelector('.container');
        var form = document.querySelector('#book-form');
        container.insertBefore(div, form)

        // vanishe in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
}
    static addBook(book) {
        var books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        var books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}
// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form'). addEventListener('submit', (e) => {
    
    // Prevent actual submit
    e.preventDefault();

    //Get Form Values
    var title = document.querySelector('#title').value;
    var author = document.querySelector('#author').value;
    var isbn = document.querySelector('#isbn').value;

    //Validate
    if(title == '' || author == '' || isbn == '') {
        UI.showAlert('please fill in all fields', 'danger');
    } else {
    // Instantiate book
    var book = new Book(title, author, isbn);

    // Add Book to UI
    UI.addBookToList(book);

    //Add Book to Store
    Store.addBook(book);

    //show success message
    UI.showAlert('Book Added', 'success');

    //clear fields methode
    UI.clearFields();   
    }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    
    //remove book from UI
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show success message
    UI.showAlert('Book Removed', 'success');
});