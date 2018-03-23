package edu.harvard.h2ms.domain.core;



import edu.harvard.h2ms.repository.AnswerRepository;
import edu.harvard.h2ms.repository.QuestionRepository;

import org.junit.Before;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@DataJpaTest
public class EventTest {
    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private AnswerRepository answerRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
  
    @Before
    public void setUp() {
        
        
    }

}