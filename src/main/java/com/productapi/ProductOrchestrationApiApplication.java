package com.productapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@SpringBootApplication
@EnableJpaRepositories
public class ProductOrchestrationApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductOrchestrationApiApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer forwardToIndex() {
        return new WebMvcConfigurer() {
            @Override
            public void addViewControllers(ViewControllerRegistry registry) {
                // Forward requests to index.html
                registry.addViewController("/").setViewName("forward:/index.html");
                registry.addViewController("/search").setViewName("forward:/index.html");
                registry.addViewController("/search/**").setViewName("forward:/index.html");
                registry.addViewController("/products/**").setViewName("forward:/index.html");
                registry.addViewController("/categories/**").setViewName("forward:/index.html");
                registry.addViewController("/brands/**").setViewName("forward:/index.html");
            }
        };
    }
}
