package com.bunyo.libpro.controller;

import com.bunyo.libpro.app.AppVariables;
import com.bunyo.libpro.model.User;
import com.bunyo.libpro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

@RestController
public class UserController {
    @Autowired
    UserRepository userRepository;


    @PostMapping(AppVariables.MAPPING_USER)
    public User createUser(@Valid @RequestBody User user) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    @GetMapping(AppVariables.MAPPING_USER + "/{userName}")
    public Long getUser(Principal auth,@PathVariable(value = "userName") String userName) {
        String authName = auth.getName();
        Long returnId = 0l;
       if(authName.equals(userName)) {
            userName = userName.toLowerCase();
            List<User> users = (List<User>) userRepository.findAll();
            for (int i = 0; i < users.size(); i++) {
                if (users.get(i).getUserName().toLowerCase().equals(userName)) {
                    returnId = users.get(i).getId();
                }
            }
        }
        return returnId;
    }

    @GetMapping("/isthereuser"+"/{userName}")
    public Boolean getIsThereUser(@PathVariable(value = "userName") String userName) {
        userName = userName.toLowerCase();
        List<User> users = (List<User>) userRepository.findAll();
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getUserName().toLowerCase().equals(userName)) {
                return true;
            }
        }
        return false;
    }

    @GetMapping("/login")
    public boolean login(Principal auth) {
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println(sdf.format(cal.getTime())+" -> "+auth.getName()+" giriş yaptı");
        if(auth.getName().equals("ADMIN") || auth.getName().equals("BUNYO")){
           return true;
       }
       else{
           return false;
       }

    }
}
