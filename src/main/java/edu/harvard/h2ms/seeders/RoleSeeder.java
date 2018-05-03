package edu.harvard.h2ms.seeders;

import static java.util.Arrays.asList;

import edu.harvard.h2ms.domain.core.Role;
import edu.harvard.h2ms.repository.RoleRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class RoleSeeder {

  private RoleRepository roleRepository;

  @Autowired
  public RoleSeeder(RoleRepository roleRepository) {
    this.roleRepository = roleRepository;
  }

  @EventListener
  public void seed(ContextRefreshedEvent event) {
    seedRoleTable();
  }

  private void seedRoleTable() {
    List<String> records = asList("ROLE_ADMIN", "ROLE_USER", "ROLE_OBSERVER");

    for (String record : records) {
      if (roleRepository.findByName(record) == null) {
        Role role = new Role();
        role.setName(record);
        roleRepository.save(role);
      }
    }
  }
}
