package edu.harvard.h2ms.service;

/*import com.google.common.collect.Lists;
import edu.harvard.h2ms.domain.core.Event;
import edu.harvard.h2ms.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("eventService")
@Repository
@Transactional
public class EventServiceImpl implements EventService {

    private EventRepository eventRepository;

    @Autowired
    public void setEventRepository(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Saves a new event
    public Event save(Event event) {
        return eventRepository.save(event);
    }

    // Find all events
    @Transactional(readOnly=true)
    public List<Event> findAll() {
        return Lists.newArrayList(eventRepository.findAll());
    }

    // Find an event by its ID
    @Transactional(readOnly=true)
    public Event findById(Long id) {
        return eventRepository.findOne(id);
    }


}
*/
