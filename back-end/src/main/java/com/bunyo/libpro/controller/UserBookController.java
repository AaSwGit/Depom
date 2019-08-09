package com.bunyo.libpro.controller;

import com.bunyo.libpro.exception.ResourceNotFoundException;
import com.bunyo.libpro.app.AppVariables;
import com.bunyo.libpro.model.UserBook;
import com.bunyo.libpro.repository.UserBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
public class UserBookController {
    @Autowired
    UserBookRepository userBookRepository;

    @GetMapping(AppVariables.MAPPING_USERBOOK)
    public List<UserBook> getAllUserBooks() {
        return (List<UserBook>) userBookRepository.findAll();
    }
    @GetMapping(AppVariables.MAPPING_USERBOOK+"/{id}")
    public List<UserBook> getBooksById(@PathVariable(value = "id") Long modelId) {
        List<UserBook> userBooks = userBookRepository.findAll();
        List<UserBook> returnUserBooks = new ArrayList<UserBook>();
        for(int i=0;i<userBooks.size();i++) {
            if (userBooks.get(i).getUser().getId().equals(modelId)) {
                returnUserBooks.add(userBooks.get(i));
            }
        }
        return returnUserBooks;
    }

    @PostMapping(AppVariables.MAPPING_USERBOOK)
    public UserBook createUserBook(@Valid @RequestBody UserBook userBook) {
        return userBookRepository.save(userBook);
    }

    @DeleteMapping(AppVariables.MAPPING_USERBOOK+"/{id}")
    public ResponseEntity<?> deleteUserBook(@PathVariable(value = "id") Long booklId) {
        UserBook userBook = userBookRepository.findById(booklId)
                .orElseThrow(() -> new ResourceNotFoundException("UserBook", "id", booklId));
        userBookRepository.delete(userBook);
        return ResponseEntity.ok().build();
    }
}
