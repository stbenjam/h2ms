package edu.harvard.h2ms.repository;

import edu.harvard.h2ms.domain.core.Role;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface RoleRepository extends PagingAndSortingRepository<Role, Long> {

  Role findByName(@Param("name") String name);
}
