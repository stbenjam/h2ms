package edu.harvard.h2ms.repository;

import edu.harvard.h2ms.domain.core.User;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public interface UserRepository extends PagingAndSortingRepository<User, Long> {
  User findOneByEmail(@Param("email") String email);

  User findByFirstName(@Param("firstName") String firstName);

  User findByMiddleName(@Param("middleName") String middleName);

  User findByLastName(@Param("lastName") String lastName);

  User findByEmail(@Param("email") String email);

  User findByResetToken(@Param("resetToken") String resetToken);
}
