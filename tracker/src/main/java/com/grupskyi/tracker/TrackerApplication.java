package com.grupskyi.tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point. Components are discovered by scan under {@code com.grupskyi.tracker} (web / app /
 * infra / domain). Constructor injection only — no field {@code @Autowired}.
 */
@SpringBootApplication
public class TrackerApplication {

  public static void main(String[] args) {
    SpringApplication.run(TrackerApplication.class, args);
  }
}
