import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import * as BooksAPI from './BooksAPI'
import * as BooksApp from './App'


class ListBooks extends Component {

    static propTypes = {
         books: PropTypes.array.isRequired
    }

    state = {
        query: ''
    }

    updateQuery = (query) =>{
        this.setState({query: query.trim()})
    }

    clearQuery = () => {
        this.setState({query: ''})
    }
 
    render(){
        let showingBooks
        if(this.state.query){
            const match = new RegExp(escapeRegExp(this.state.query), 'i')
            showingBooks = this.props.books.filter((book) => match.test(book.title))
        } else {
            showingBooks = this.props.books
        }

        return(
            <div className='search-books-input-wrapper'>
                <input 
                    type="text" 
                    placeholder="Search by title or author" 
                    value={this.state.query}
                    onChange={(event) => this.updateQuery(event.target.value)}/>

                <ol className='book-list'>
                    {showingBooks.map((book)=>(
                        <li key={book.id} className= 'book-list-item'>
                            <div className="book">
                                <div className="book-top">
                                <div className="book-cover" style={{ width: 128, height: 174, backgroundImage:`url(${book.url})`}}></div>
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
                                <div className="book-authors">{book.author}</div>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>            
        )
        
    }
}

export default ListBooks