import React, {Component} from 'react'
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import * as BooksAPI from './BooksAPI'
import ListBooks from './ListBooks'


class App extends Component {
  
  shelves = [
    { 
      title:"Currently Reading", 
      value: "currentlyReading"
    },
    {
      title:"Want to Read", 
      value: "wantToRead" 
    },
    {
      title:"Read", 
      value: "read" 
    }
  ]
  
  state = {
    books: [ ]
  }

  componentDidMount(){
    BooksAPI.getAll().then((books)=>{
      this.setState({books: books})
    });
  }
  
  moveBook(shelf, book){
    book.shelf = shelf;
    BooksAPI.update(book, shelf)
    this.setState(this.state)
  }


  render() {
    
    return (
      <div className="app">
        <Route exact path = '/search' render={({history}) =>(
          <div className="search-books">
              <ListBooks 
                books={this.state.books}
                onMove={(shelf, book) => this.moveBook(shelf, book)}
              />   
          </div>          
        )}/>
        
        <Route exact path = '/' render = {() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                {this.shelves.map((shelf) => (
                  <div className="bookshelf" key={shelf.value}>
                  <h2 className="bookshelf-title">{shelf.title}</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {this.state.books.filter(book=> book.shelf === shelf.value).map((book)=>(
                        <li key={book.id}>
                          <div className="book">
                            <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 174, backgroundImage:`url(${book.imageLinks.smallThumbnail})`}}></div>
                            <div className="book-shelf-changer">
                              <select value= {book.shelf} onChange={e=>this.moveBook(e.target.value, book)}>
                              <option value="move" disabled>Move to...</option>
                              <option value="currentlyReading">Currently Reading</option>
                              <option value="wantToRead">Want to Read</option>
                              <option value="read">Read</option>
                              <option value="none">None</option>
                              </select>
                            </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            <div className="book-authors">{book.authors}</div>
                            <div className="book-category">{book.categories}</div>
                          </div>
                        </li>
                      ))}      
                    </ol>
                  </div>
                  </div>
                ))}               
              </div>
            </div>
            <div className="open-search">
              <Link to='/search'>Add a book</Link>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}

export default App
