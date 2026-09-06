package com.grupskyi.tracker.web;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Liveness probe for Fly.io's http health check (fly.toml → {@code /healthz}). */
@RestController
public class HealthController {

  @GetMapping("/healthz")
  public Map<String, String> healthz() {
    return Map.of("status", "ok");
  }
}
