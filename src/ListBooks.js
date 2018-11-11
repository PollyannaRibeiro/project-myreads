import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import * as BooksApp from './App'
import * as BooksAPI from './BooksAPI'


class ListBooks extends Component {

    static propTypes = {
         books: PropTypes.array.isRequired,
         onMove: PropTypes.func.isRequired
    }

    state = {
        query: '',
        searchBooks:[],
        error: false
    }
    
    time;
    
    updateQuery = (query) =>{
        this.setState({query: query.trim(), searchBooks:[]})
        clearInterval(this.time)
        this.time = setTimeout(()=>{
            this.searchingBook(query)
        }, 500) 
    }
   
    searchingBook(query){
        BooksAPI.search(this.state.query).then((result) => {
            if (Array.isArray(result)){
                result.forEach((book)=>this.checkBooksInApp(book))
                this.state.error = false
                this.state.searchBooks = result
                this.setState(this.state)
                console.log(result)
            } else {
                if(this.state.query.length > 0){
                    this.state.error = true;
                } else {
                    this.state.error = false;
                }
                
                this.setState(this.state)
            }                
        })
    }

    checkBooksInApp(elem){
        console.log(elem.id)
        let filtering = this.props.books.filter((book)=> book.id === elem.id)
        if(filtering.length>0 ){
            elem.shelf = filtering[0].shelf
        }
    }

    updateBook(shelf, book) {

        let filteringElem = this.props.books.filter((bookApp)=> bookApp.id = book.id)
        if(filteringElem.length>0){
            book.shelf = filteringElem[0].shelf;
        }
        if(book.shelf!== 'none'){
            this.props.books.push(book)
        }
        this.props.onMove(shelf, book)
    }

    render(){
    
        let showingBooks = this.state.searchBooks
        
        return(
            <div>
                <div className='search-books-bar'>
                    <Link to='/' className="close-search">Close</Link>
                    <div className='search-books-input-wrapper'>
                        <input 
                        type="text" 
                        placeholder="Search by title or author" 
                        value={this.state.query}
                        onChange={(event) => this.updateQuery(event.target.value)}/>
                    </div>
                </div>  

                {this.state.error === true && 
                    <div className='error-warning'>No Results found</div>
                }
                
                <div className="search-books-results">
                    <ol className='books-grid'>
                        {showingBooks.map((book)=>(
                            <li key={book.id}>
                                <div className="book">
                                    <div className="book-top">
                                    <div className="book-cover" 
                                        style={{ width: 128, height: 174, 
                                        backgroundImage:`url(${(book.imageLinks.smallThumbnail ? book.imageLinks.smallThumbnail : '')})`}}></div>
                                    <div className="book-shelf-changer">
                                        <select value= {(book.shelf ? book.shelf : 'none')} onChange={e=>this.updateBook(e.target.value, book)}>
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
        )
    }
}

export default ListBooks