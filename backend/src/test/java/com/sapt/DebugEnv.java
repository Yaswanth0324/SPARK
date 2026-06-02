package com.sapt;

import io.github.cdimascio.dotenv.Dotenv;

public class DebugEnv {
    public static void main(String[] args) {
        System.out.println("=== DEBUG ENV ===");
        System.out.println("user.dir: " + System.getProperty("user.dir"));
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")
                    .ignoreIfMissing()
                    .load();
            System.out.println("Dotenv entries size: " + dotenv.entries().size());
            dotenv.entries().forEach(entry -> {
                System.out.println(entry.getKey() + " = " + entry.getValue());
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
