package edu.harvard.h2ms.domain.core;

import javax.persistence.*;

/**
 * https://hellokoding.com/registration-and-login-example-with-spring-security-spring-boot-spring-data-jpa-hsql-jsp/
 */
@Entity
@Table(name = "ROLE")
public class Role {

  private Long id;
  private String name;

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
