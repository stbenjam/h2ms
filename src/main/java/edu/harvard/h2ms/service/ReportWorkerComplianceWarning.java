package edu.harvard.h2ms.service;

import com.opencsv.CSVWriter;
import edu.harvard.h2ms.domain.core.Event;
import edu.harvard.h2ms.domain.core.Question;
import edu.harvard.h2ms.domain.core.User;
import edu.harvard.h2ms.exception.InvalidAnswerTypeException;
import edu.harvard.h2ms.repository.EventRepository;
import edu.harvard.h2ms.repository.QuestionRepository;
import edu.harvard.h2ms.repository.UserRepository;
import edu.harvard.h2ms.service.utils.H2msRestUtils;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
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

  /**
   * Writes Report using list of list of strings
   *
   * @param data [[string,string,],[....]]
   * @return CSV text
   */
  private Writer stringWriterReport(List<List<String>> data) {

    Writer writer = new StringWriter();
    CSVWriter csvWriter =
        new CSVWriter(
            writer,
            CSVWriter.DEFAULT_SEPARATOR,
            CSVWriter.DEFAULT_QUOTE_CHARACTER,
            CSVWriter.DEFAULT_ESCAPE_CHARACTER,
            CSVWriter.DEFAULT_LINE_END);

    data.forEach((ls) -> csvWriter.writeNext(ls.toArray(new String[0])));
    try {
      csvWriter.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
    return writer;
  }

  public String createReport() {
    List<Event> events = new ArrayList<>();

    // for all questions:
    Map<Question, Map<User, Double>> allComplianceResult = new HashMap<>();
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

        allComplianceResult.put(question, complianceResult);

      } catch (InvalidAnswerTypeException e) {
        /// e.printStackTrace();
        log.debug("*********skipping");
      }
    }
    //    List<List<String>> data = new ArrayList<>();
    //    Map<Question, Map<User, Double>> allComplianceResult = new HashMap<>();
    List<List<String>> data = new ArrayList<List<String>>();
    List<String> row = new ArrayList<String>();
    for (Question question : allComplianceResult.keySet()) {
      String questionString = question.getQuestion();
      Map<User, Double> complianceMap = allComplianceResult.get(question);
      for (User user : complianceMap.keySet()) {
        String userEmail = user.getEmail();
        String complianceRate = complianceMap.get(user).toString();
        row.add(questionString);
        row.add(userEmail);
        row.add(complianceRate);
        data.add(row);
      }
    }

    Writer writer = stringWriterReport(data);

    try {
      writer.flush();
    } catch (IOException e) {
      e.printStackTrace();
    }

    return writer.toString();
  }

  public boolean isTriggered() {

    log.info("complianceWarningreport is requested " + questionRepository);

    List<Event> events = new ArrayList<>();

    // for all questions:
    for (Question question : questionRepository.findAll()) {

      if (question.getAnswerType().equals("boolean")) {
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
          //    			 e.printStackTrace();
          log.info("****skipping***");
        }
      }

      Map<String, Set<Event>> values = new HashMap<>();
    }

    return true;
  }
}
