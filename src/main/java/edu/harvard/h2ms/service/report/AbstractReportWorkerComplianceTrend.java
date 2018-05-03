package edu.harvard.h2ms.service.report;

import static java.util.Arrays.asList;

import com.google.common.collect.Lists;
import edu.harvard.h2ms.domain.core.Event;
import edu.harvard.h2ms.domain.core.Question;
import edu.harvard.h2ms.domain.core.User;
import edu.harvard.h2ms.exception.InvalidAnswerTypeException;
import edu.harvard.h2ms.repository.QuestionRepository;
import edu.harvard.h2ms.repository.UserRepository;
import edu.harvard.h2ms.service.EventService;
import edu.harvard.h2ms.service.utils.H2msRestUtils;
import edu.harvard.h2ms.service.utils.ReportUtils;
import edu.harvard.h2ms.service.utils.ReportUtils.NotificationFrequency;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

/**
 * Basis of trend notification emails change REPORTINGINTERVAL to change the reporting scope
 * Override getType() to change the name of the report type
 */
public abstract class AbstractReportWorkerComplianceTrend implements ReportWorker {

  final Logger log = LoggerFactory.getLogger(AbstractReportWorkerComplianceTrend.class);

  @Autowired private EventService eventService;

  @Autowired private QuestionRepository questionRepository;

  @Autowired private UserRepository userRepository;

  long REPORTINGINTERVAL = NotificationFrequency.WEEKLY.seconds;

  @Override
  public String getType() {
    return "abstractComplianceTrend";
  }

  @Override
  @Transactional
  public String createReport() {
    // Compare compliance:
    // 	now-2*interval -> now-interval, and now-interval -> now
    Date now = new Date();
    Date oldStart = new Date((now.getTime() - 2 * REPORTINGINTERVAL));
    Date curStart = new Date((now.getTime() - REPORTINGINTERVAL));

    List<User> users = Lists.newArrayList(userRepository.findAll());
    List<Question> questionsForCompliance =
        Lists.newArrayList(questionRepository.findAllByAnswerType("boolean"));

    // Create data for CSV-like string output
    List<List<String>> data = new ArrayList<>();

    for (Question question : questionsForCompliance) {
      try {
        List<Event> oldPeriodEvents =
            eventService.findEventsForComplianceByDateRange(question, oldStart, curStart);
        List<Event> curPeriodEvents =
            eventService.findEventsForComplianceByDateRange(question, curStart, now);

        for (User user : users) {
          Double previousComplianceResult =
              H2msRestUtils.calculateCompliance(
                  question,
                  oldPeriodEvents
                      .stream()
                      .filter(event -> event.getSubject().equals(user))
                      .collect(Collectors.toSet()));

          Double currentComplianceResult =
              H2msRestUtils.calculateCompliance(
                  question,
                  curPeriodEvents
                      .stream()
                      .filter(event -> event.getSubject().equals(user))
                      .collect(Collectors.toSet()));

          Double change;
          if (previousComplianceResult > currentComplianceResult)
            change =
                -(previousComplianceResult
                    - (previousComplianceResult / (currentComplianceResult)));
          else
            change =
                (currentComplianceResult - (currentComplianceResult / previousComplianceResult));

          // Row Example:
          //   doctor@h2ms.org,"Washed?",65.0,60.0,-5.0

          data.add(
              asList(
                  user.getEmail(),
                  question.getQuestion(),
                  previousComplianceResult.toString(),
                  currentComplianceResult.toString(),
                  change.toString()));
        }
      } catch (InvalidAnswerTypeException answerType) {
        throw new RuntimeException(answerType.getMessage());
      }
    }

    return ReportUtils.writeCsvString(data);
  }
}
