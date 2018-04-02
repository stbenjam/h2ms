package edu.harvard.h2ms.domain.core;

import static org.hamcrest.core.IsNull.nullValue;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

import static java.util.Arrays.asList;
import javax.validation.ConstraintViolationException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Unit tests for Answer entity. Ensures blank values are ignored, and default values are set.
 *
 */
@RunWith(SpringRunner.class)
@DataJpaTest
public class AnswerTest {
	@Autowired
	private TestEntityManager entityManager;

	private EventTemplate eventTemplate;
	private Question question;

	@Before
	public void setUp() {
		entityManager.clear();
		eventTemplate = new EventTemplate("Test Template");
		entityManager.persistAndFlush(eventTemplate);
		
		question = new Question(
				"How much wood could a woodchuck chuck?",
				"options",
				asList("Not much", "A lot"),
				true,
				1,
				eventTemplate, 
				null
				);
		
		entityManager.persistAndFlush(question);
	}

	@Test
	public void testDefaultAnswerValueIsSet() {
		question.setDefaultValue("A lot");
		
		Answer answer = new Answer();
		answer.setQuestion(question);
		assertThat(answer.getValue(), is("A lot"));
	}
	
	@Test
	public void testBlankValueIgnored() {
		Answer answer = new Answer(question, "");
		assertThat(answer.getValue(), is(nullValue()));
	}

	@Test
	public void testBlankSetsDefault() {
		question.setDefaultValue("A lot");
		
		Answer answer = new Answer(question, "");
		assertThat(answer.getValue(), is("A lot"));
	}
}
