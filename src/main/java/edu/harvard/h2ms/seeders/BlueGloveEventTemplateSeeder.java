package edu.harvard.h2ms.seeders;

import static java.util.Arrays.asList;

import com.google.common.collect.ImmutableSet;
import edu.harvard.h2ms.domain.core.EventTemplate;
import edu.harvard.h2ms.domain.core.Question;
import edu.harvard.h2ms.repository.EventTemplateRepository;
import edu.harvard.h2ms.repository.QuestionRepository;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * BlueGloveEventTemplateSeeder. This seeds the basic template for a blue gloves observation event.
 *
 * @author stbenjam
 */
@Component
@Profile("bluegloves")
public class BlueGloveEventTemplateSeeder {
  private EventTemplateRepository eventTemplateRepository;
  private QuestionRepository questionRepository;

  @Autowired
  public BlueGloveEventTemplateSeeder(
      EventTemplateRepository eventTemplateRepository, QuestionRepository questionRepository) {
    this.eventTemplateRepository = eventTemplateRepository;
    this.questionRepository = questionRepository;
  }

  @EventListener
  public void seed(ContextRefreshedEvent event) {
    EventTemplate template = new EventTemplate("Bluegloves Event");
    eventTemplateRepository.save(template);

    Set<Question> questions =
        ImmutableSet.<Question>of(
            new Question(
                "Observation Moment",
                "options",
                asList("leaving room", "inside room", "leaving building"),
                true,
                1,
                template),
            new Question("Gloves removed?", "boolean", null, false, 3, template),
            new Question("Gloves contaminated?", "boolean", null, false, 4, template),
            new Question(
                "Method of contamination",
                "options",
                asList("Surface contact", "Multiple patient use", "Other"),
                false,
                5,
                template));

    questionRepository.save(questions);
  }
}
