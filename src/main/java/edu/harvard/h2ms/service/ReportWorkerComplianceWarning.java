package edu.harvard.h2ms.service;

import edu.harvard.h2ms.domain.core.Event;
import edu.harvard.h2ms.domain.core.Question;
import edu.harvard.h2ms.domain.core.User;
import edu.harvard.h2ms.exception.InvalidAnswerTypeException;
import edu.harvard.h2ms.repository.EventRepository;
import edu.harvard.h2ms.repository.QuestionRepository;
import edu.harvard.h2ms.repository.UserRepository;
import edu.harvard.h2ms.service.utils.H2msRestUtils;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ReportWorkerComplianceWarning implements ReportWorker {

  final Logger log = LoggerFactory.getLogger(ReportWorkerComplianceWarning.class);

  @Autowired private UserService userService;

  @Autowired private EventRepository eventRepository;

  @Autowired private EventService eventService;

  @Autowired private QuestionRepository questionRepository;

  @Autowired private UserRepository userRepository;

  @Override
  public String getType() {
    return "complianceWarning";
  }

  public String createReport() {
    List<Event> events = new ArrayList<>();

    // for all questions:
    Hibernate.initialize(questionRepository);
    for (Question question : questionRepository.findAll()) {
      Map<User, Double> complianceResult = new HashMap<>();

      try {
        events = eventService.findEventsForCompliance(question);
        Map<String, Set<Event>> values = new HashMap<>();

        // for all users:
        for (User user : userRepository.findAll()) {
          complianceResult.put(
              user,
              H2msRestUtils.calculateCompliance(
                  question,
                  events
                      .stream()
                      .filter(event -> event.getSubject().equals(user))
                      .collect(Collectors.toSet())));
        }

      } catch (InvalidAnswerTypeException e) {
        /// e.printStackTrace();
        log.info("*********skipping");
      }
    }
    return "some compliance result";
  }

  public boolean isTriggered() {

    log.info("complianceWarningreport is requested " + questionRepository);

    List<Event> events = new ArrayList<>();

    // for all questions:
    for (Question question : questionRepository.findAll()) {
      Map<User, Double> complianceResult = new HashMap<>();

      try {
        events = eventService.findEventsForCompliance(question);
        // for all users:
        for (User user : userRepository.findAll()) {
          complianceResult.put(
              user,
              H2msRestUtils.calculateCompliance(
                  question,
                  events
                      .stream()
                      .filter(event -> event.getSubject().equals(user))
                      .collect(Collectors.toSet())));
        }

      } catch (InvalidAnswerTypeException e) {
        // e.printStackTrace();
      }

      Map<String, Set<Event>> values = new HashMap<>();
    }

    return true;
  }
}
