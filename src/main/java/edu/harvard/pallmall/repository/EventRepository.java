package edu.harvard.pallmall.repository;

import edu.harvard.pallmall.domain.core.Event;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface EventRepository extends PagingAndSortingRepository<Event, Long> {

}