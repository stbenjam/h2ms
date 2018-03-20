package edu.harvard.h2ms.repository;

import edu.harvard.h2ms.domain.core.Answer;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface AnswerRepository extends PagingAndSortingRepository<Answer, Long> {}
