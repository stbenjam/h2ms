package edu.harvard.h2ms.repository;

import edu.harvard.h2ms.domain.core.Sensor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "sensors", path = "sensors")
public interface SensorRepository extends PagingAndSortingRepository<Sensor, Long> {}
