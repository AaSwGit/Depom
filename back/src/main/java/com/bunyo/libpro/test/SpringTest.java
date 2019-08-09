package com.bunyo.libpro.test;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class SpringTest {
    public static void main(String args[]){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode("pass");
        System.out.println(encodedPassword);
    }
}
