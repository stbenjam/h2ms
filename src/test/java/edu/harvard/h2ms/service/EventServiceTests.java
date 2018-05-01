package edu.harvard.h2ms.service;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

import edu.harvard.h2ms.domain.core.Answer;
import edu.harvard.h2ms.domain.core.Event;
import edu.harvard.h2ms.domain.core.EventTemplate;
import edu.harvard.h2ms.domain.core.Question;
import edu.harvard.h2ms.domain.core.User;
import edu.harvard.h2ms.repository.EventRepository;
import edu.harvard.h2ms.repository.EventTemplateRepository;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@DataJpaTest
public class EventServiceTests {
  @Autowired private TestEntityManager entityManager;

  @Autowired private EventRepository eventRepository;

  @Autowired private EventTemplateRepository eventTemplateRepository;

  private User observer;
  private EventTemplate eventTemplate;
  private Date eventDate;
  private Event event;

  @Before
  public void setUp() {
    Question booleanQuestion, optionsQuestion;

    // Sample User Data
    observer = new User("John", "Quincy", "Adams", "jqadams@h2ms.org", "password", "Other");
    User subject = new User("Jane", "Doe", "Sam", "sample@email.com", "password", "Doctor");
    entityManager.persist(observer);
    entityManager.persist(subject);

    // Creates and persists event
    eventTemplate = new EventTemplate("Test Event");
    entityManager.persist(eventTemplate);

    event = new Event();
    eventDate = new Date("28-MAR-2018");

    booleanQuestion = new Question();
    booleanQuestion.setPriority(1);
    booleanQuestion.setRequired(true);
    booleanQuestion.setAnswerType("boolean");
    booleanQuestion.setQuestion("Washed?");
    booleanQuestion.setEventTemplate(eventTemplate);
    entityManager.persist(booleanQuestion);

    Set<Answer> answers = new HashSet<>();
    Answer answer = new Answer();
    answer.setQuestion(booleanQuestion);
    answer.setValue("true");
    answers.add(answer);

    event.setAnswers(answers);
    event.setLocation("Massachusetts General Hospital");
    event.setSubject(subject);
    event.setObserver(observer);
    event.setEventTemplate(eventTemplate);
    event.setObserver(observer);
    event.setTimestamp(eventDate);

    entityManager.persist(event);
  }

  /** Repository finds by event template. */
  @Test
  public void whenFindByEventTemplate_thenReturnEvent() {
    assertThat(eventRepository.findByEventTemplate(eventTemplate), contains(event));
  }

  /** Repository finds count by Observer. */
  @Test
  public void whenCountByObserver_thenReturnCount() {
    assertThat(eventRepository.countByObserver(observer), is(1L));
  }

  /** Repository finds event in Range. */
  @Test
  public void whenfindByEventTemplateAndTimestampAfterAndTimestampBefore_thenReturnEventInRange() {
    Date twoDaysBefore = new Date(eventDate.getTime() - 2 * 60 * 60 * 60 * 24);
    Date oneDayBefore = new Date(eventDate.getTime() - 60 * 60 * 60 * 24);
    Date oneDayAfter = new Date(eventDate.getTime() + 60 * 60 * 60 * 24);

    assertThat(
        eventRepository.findByEventTemplateAndTimestampAfterAndTimestampBefore(
            eventTemplate, oneDayBefore, oneDayAfter),
        contains(event));

    assertThat(
        eventRepository.findByEventTemplateAndTimestampAfterAndTimestampBefore(
            eventTemplate, twoDaysBefore, oneDayBefore),
        not(contains(event)));
  }
}
