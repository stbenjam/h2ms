package edu.harvard.h2ms.repository;

import edu.harvard.h2ms.domain.core.Question;
import java.util.Set;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface QuestionRepository extends PagingAndSortingRepository<Question, Long> {
  Question findByQuestion(@Param("name") String name);

  Set<Question> findAllByAnswerType(@Param("answerType") String answerType);
}
