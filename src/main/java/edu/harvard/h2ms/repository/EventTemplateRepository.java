package edu.harvard.h2ms.repository;

import edu.harvard.h2ms.domain.core.EventTemplate;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface EventTemplateRepository extends PagingAndSortingRepository<EventTemplate, Long> {
  EventTemplate findByName(@Param("name") String name);
}
