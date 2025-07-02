package com.productapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@EnableJpaRepositories
public class ProductOrchestrationApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductOrchestrationApiApplication.class, args);
    }
}
