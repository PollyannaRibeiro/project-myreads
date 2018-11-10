import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import * as BooksApp from './App'
import * as BooksAPI from './BooksAPI'



class ListBooks extends Component {

    static propTypes = {
         books: PropTypes.array.isRequired
    }

    state = {
        query: '',
        searchBooks:[]
    }
    
    time;
    
    updateQuery = (query) =>{
        this.setState({query: query.trim(), searchBooks:[]})
        clearInterval(this.time)
        this.searchingBook(query)
        

    }

    
    searchingBook(query){
        this.time = setTimeout(()=>{
            BooksAPI.search(this.state.query).then((result) => {
                this.state.searchBooks = result
                this.setState(this.state)
            });
        }, 500) 
    }

    // keyPress(event){
    //     if(event.keyCode == 13){
    //         searchingBook(this.state.query)
    //     }
    // }
 
    render(){
        // let showingBooks
        // if(this.state.query){
        //     const match = new RegExp(escapeRegExp(this.state.query), 'i')
        //     showingBooks = this.state.searchBooks.filter((book) => match.test(book.title))
        // } else {
        //     showingBooks = this.state.searchBooks
        // }
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
                <div className="search-books-results">
                    <ol className='books-grid'>
                        {showingBooks.map((book)=>(
                            <li key={book.id}>
                                <div className="book">
                                    <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 174, backgroundImage:`url(${book.imageLinks.smallThumbnail})`}}></div>
                                    <div className="book-shelf-changer">
                                        <select>
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