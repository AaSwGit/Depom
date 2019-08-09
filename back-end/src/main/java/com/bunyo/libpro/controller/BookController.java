package com.bunyo.libpro.controller;

import com.bunyo.libpro.exception.ResourceNotFoundException;
import com.bunyo.libpro.app.AppVariables;
import com.bunyo.libpro.model.Book;
import com.bunyo.libpro.model.UserBook;
import com.bunyo.libpro.repository.BookRepository;
import com.bunyo.libpro.repository.UserBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
public class BookController {
    @Autowired
    BookRepository bookRepository;

    @Autowired
    UserBookRepository userBookRepository;


    @GetMapping(AppVariables.MAPPING_BOOK)
    public List<Book> getAllBooks() {
        return (List<Book>) bookRepository.findAll();
    }

    @PostMapping(AppVariables.MAPPING_BOOK)
    public Book createBook(@Valid @RequestBody Book book) {
        return bookRepository.save(book);
    }

    @PutMapping(AppVariables.MAPPING_BOOK+"/{id}")
    public Book updateBook(@PathVariable(value = "id") Long bookId, @Valid @RequestBody Book bookDetails) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", bookId));

        book.setBookName(bookDetails.getBookName());
        book.setAuthor(bookDetails.getAuthor());
        book.setPages(bookDetails.getPages());

        Book updatedModel = bookRepository.save(book);
        return updatedModel;
    }

    @DeleteMapping(AppVariables.MAPPING_BOOK+"/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable(value = "id") Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", bookId));
        bookRepository.delete(book);
        delUserBooksById(bookId);
        return ResponseEntity.ok().build();
    }

    public void delUserBooksById(Long bookId){
        List<UserBook> userBooks = userBookRepository.findAll();
        for(int i=0;i<userBooks.size();i++) {
            if (userBooks.get(i).getId().equals(bookId)) {
                userBookRepository.delete(userBooks.get(i));
            }
        }
    }
}
