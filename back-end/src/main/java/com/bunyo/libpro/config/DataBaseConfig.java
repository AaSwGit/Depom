package com.bunyo.libpro.config;

import com.bunyo.libpro.app.AppVariables;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

@Configuration
@EnableJpaAuditing
public class DataBaseConfig {
    @Bean(name = "dataSource")
    public DriverManagerDataSource dataSource() {
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        driverManagerDataSource.setUrl("jdbc:mysql://localhost:3306/"+ AppVariables.DATABASE_NAME);
        driverManagerDataSource.setUsername(AppVariables.DATABASE_USERNAME);
        driverManagerDataSource.setPassword(AppVariables.DATABASE_PASSWORD);
        return driverManagerDataSource;
    }
}