package com.grupskyi.tracker;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

/** Flyway applies V1__init cleanly on boot against Testcontainers Postgres. */
class MigrationTest extends AbstractIntegrationTest {

  @Autowired JdbcTemplate jdbc;

  @Test
  void schemaObjectsExist() {
    List<String> tables =
        jdbc.queryForList(
            "select table_name from information_schema.tables where table_schema = 'public'",
            String.class);
    assertThat(tables).contains("recruiter_link", "visit_event");
  }

  @Test
  void visitEventInsertsAndReads() {
    jdbc.update("insert into visit_event (kind) values ('view')");
    Integer count = jdbc.queryForObject("select count(*) from visit_event", Integer.class);
    assertThat(count).isEqualTo(1);
  }
}
