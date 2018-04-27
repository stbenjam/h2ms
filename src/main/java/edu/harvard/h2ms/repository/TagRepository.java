package edu.harvard.h2ms.repository;

import edu.harvard.h2ms.domain.core.Tag;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "tags", path = "tags")
public interface TagRepository extends PagingAndSortingRepository<Tag, Long> {}
