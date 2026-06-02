package com.sapt;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ============================================================
 * SAPT - Student Activity Point Tracker
 * Main Application Entry Point
 * ============================================================
 *
 * This is the root Spring Boot application class.
 * Do NOT modify this file unless you know what you are doing.
 *
 * Author: SAPT Dev Team
 * ============================================================
 */
@SpringBootApplication
public class SaptApplication {

    static {
        System.err.println("[DEBUG] STATIC BLOCK OF SaptApplication CALLED");
        System.err.println("[DEBUG] user.dir = " + System.getProperty("user.dir"));
        
        Dotenv dotenv = Dotenv.configure()
                .directory("./")          // looks for .env in backend/ root
                .ignoreIfMissing()        // don't crash if .env is absent
                .load();

        System.err.println("[DEBUG] Dotenv loaded. Number of entries: " + dotenv.entries().size());
        dotenv.entries().forEach(entry -> {
            System.err.println("[DEBUG] Env entry: " + entry.getKey() + " = " + entry.getValue());
            if (System.getProperty(entry.getKey()) == null && System.getenv(entry.getKey()) == null) {
                System.setProperty(entry.getKey(), entry.getValue());
            }
        });
    }

    public static void main(String[] args) {
        SpringApplication.run(SaptApplication.class, args);
    }

}
