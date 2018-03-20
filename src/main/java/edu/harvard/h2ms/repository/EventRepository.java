package edu.harvard.h2ms.repository;

import edu.harvard.h2ms.domain.core.Event;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface EventRepository extends PagingAndSortingRepository<Event, Long> {}
