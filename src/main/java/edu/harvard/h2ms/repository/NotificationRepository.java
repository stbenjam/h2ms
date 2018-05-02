package edu.harvard.h2ms.repository;

import edu.harvard.h2ms.domain.core.Notification;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "notifications", path = "notifications")
public interface NotificationRepository extends PagingAndSortingRepository<Notification, Long> {
  Notification findOneByName(@Param("name") String name);

  Notification findOneById(@Param("id") Long id);
}
