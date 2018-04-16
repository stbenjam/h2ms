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
    if (roleRepository.count() == 0) {
      List<List<String>> records = asList(asList("ADMIN"), asList("USER"), asList("OBSERVER"));

      for (List<String> record : records) {
        String name = record.get(0);
        Role role = new Role();
        role.setName(name);

        roleRepository.save(role);
      }
    }
  }
}
