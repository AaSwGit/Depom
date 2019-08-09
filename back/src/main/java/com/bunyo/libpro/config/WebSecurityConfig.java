package com.bunyo.libpro.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import javax.sql.DataSource;
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    DataSource dataSource;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.jdbcAuthentication().dataSource(dataSource)
                .usersByUsernameQuery(
                        "select user_name,password,enabled from users where user_name=?")
                .authoritiesByUsernameQuery(
                        "select user_name,user_role from users where user_name=?").passwordEncoder(new BCryptPasswordEncoder());

    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .httpBasic()
                .and()
                .authorizeRequests()
                .antMatchers(HttpMethod.GET, "/login").hasAnyRole("ADMIN","USER")
                .antMatchers(HttpMethod.GET, "/users/***").hasAnyRole("ADMIN","USER")
                .antMatchers(HttpMethod.GET, "/userbooks/**").hasRole("USER")
                .antMatchers(HttpMethod.POST, "/userbooks").hasRole("USER")
                .antMatchers(HttpMethod.DELETE, "/userbooks/**").hasRole("USER")
                .antMatchers(HttpMethod.GET, "/books").hasAnyRole("ADMIN","USER")
                .antMatchers(HttpMethod.POST, "/books").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/books/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/books/**").hasRole("ADMIN")
                .and()
                .csrf().disable()
                .formLogin().disable();
    }
}