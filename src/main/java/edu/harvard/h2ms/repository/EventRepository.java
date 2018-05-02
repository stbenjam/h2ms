package edu.harvard.h2ms.repository;

import edu.harvard.h2ms.domain.core.Event;
import edu.harvard.h2ms.domain.core.EventTemplate;
import edu.harvard.h2ms.domain.core.User;
import java.util.Date;
import java.util.List;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends PagingAndSortingRepository<Event, Long> {
  List<Event> findByEventTemplate(@Param("eventTemplate") EventTemplate eventTemplate);

  List<Event> findByEventTemplateAndTimestampAfterAndTimestampBefore(
      @Param("eventTemplate") EventTemplate eventTemplate,
      @Param("after") Date after,
      @Param("before") Date before);

  Long countByObserver(@Param("observer") User observer);
}
