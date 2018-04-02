package edu.harvard.h2ms.domain.core;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static java.util.Arrays.asList;
import javax.validation.ValidationException;

import edu.harvard.h2ms.repository.QuestionRepository;
import javax.validation.ConstraintViolationException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Unit tests for Question entity. Question consist of multiple types, such as 'options' and 'boolean'. For the options case, options must be provided,
 * and if a default value is present it must be one of the options.  Boolean default values must be one of 'true', or 'false'.
 *
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class QuestionTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private QuestionRepository questionRepository;

	private EventTemplate eventTemplate;

	@Before
	public void setUp() {
		entityManager.clear();
		eventTemplate = new EventTemplate("Test Template");
		entityManager.persistAndFlush(eventTemplate);
	}

	@Test(expected = ConstraintViolationException.class)
	public void testQuestionRequired() {
		Question question = new Question(null, "boolean", null, true, 5, eventTemplate, null);
		entityManager.persistAndFlush(question);
	}
	
	@Test(expected = ValidationException.class)
	public void testQuestionNotBlank() {
		Question question = new Question("", "boolean", null, true, 5, eventTemplate, null);
		entityManager.persistAndFlush(question);	
	}

	@Test(expected = ValidationException.class)
	public void testTypeRequired() {
		Question question = new Question("Hello world", null, null, true, 5, eventTemplate, null);
		entityManager.persistAndFlush(question);
	}

	@Test
	public void testBooleanQuestionSuccess() {
		Question question = new Question("Over 18?", "boolean", null, true, 5, eventTemplate, null);
		entityManager.persistAndFlush(question);

		assertThat(questionRepository.findByQuestion("Over 18?"), is(question));
	}

	@Test(expected = ConstraintViolationException.class)
	public void testBooleanDefaultMustBeBoolean() {
		Question question = new Question("Over 18?", "boolean", null, true, 5, eventTemplate, "potato");
		entityManager.persistAndFlush(question);
		entityManager.flush();
	}

	@Test
	public void testOptionsQuestionSuccess() {
		Question question = new Question("Age Range", "boolean", asList("Less than 18", "18-35", "65+"), true, 5,
				eventTemplate, null);

		entityManager.persistAndFlush(question);
		assertThat(questionRepository.findByQuestion("Age Range"), is(question));
	}

	@Test(expected = ConstraintViolationException.class)
	public void testOptionsTypeRequiresOptions() {
		Question question = new Question("Age Range", "options", null, true, 5, eventTemplate, null);
		entityManager.persistAndFlush(question);
	}

	@Test(expected = ValidationException.class)
	public void testDefaultOptionNotInOptions() {
		Question question = new Question("Age Range", "options", asList("Less than 18", "18-35", "65+"), true, 5,
				eventTemplate, "36");
		entityManager.persistAndFlush(question);
	}

	@Test
	public void testDefaultOptionInOptions() {
		Question question = new Question("Age Range", "options", asList("Less than 18", "18-35", "65+"), true, 5,
				eventTemplate, "18-35");
		entityManager.persistAndFlush(question);

		assertThat(questionRepository.findByQuestion("Age Range"), is(question));
		assertThat(questionRepository.findByQuestion("Age Range").getDefaultValue(), is("18-35"));
	}
}
