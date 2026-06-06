package com.site.env;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SiteEnvApplication {
    public static void main(String[] args) {
        SpringApplication.run(SiteEnvApplication.class, args);
    }
}
