package com.sapt;

import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * ============================================================
 * SaptApplicationTests - Application Context Load Test
 * ============================================================
 * Verifies that the Spring application context loads correctly.
 * This test will fail if any bean configuration is broken.
 *
 * TODO (Team):
 *  - Add module-specific unit tests in each module package
 *  - Add integration tests for API endpoints
 *  - Name test files: <ClassName>Test.java
 * ============================================================
 */
@SpringBootTest
@ActiveProfiles("dev")
class SaptApplicationTests {

    static {
        Dotenv dotenv = Dotenv.configure()
                .directory("./")          // looks for .env in backend/ root
                .ignoreIfMissing()        // don't crash if .env is absent
                .load();

        // Push all .env variables into System properties early so Spring picks them up
        // before placeholder resolution
        dotenv.entries().forEach(entry -> {
            if (System.getProperty(entry.getKey()) == null && System.getenv(entry.getKey()) == null) {
                System.setProperty(entry.getKey(), entry.getValue());
            }
        });
    }

    @Test
    void contextLoads() {
        // Verifies that the Spring application context starts successfully.
        // If this test fails, check your bean configurations and .env values.
    }
}
