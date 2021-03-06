package edu.harvard.pallmall.repository;

import java.util.List;

import edu.harvard.pallmall.domain.core.Location;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(collectionResourceRel = "locations", path = "locations")
public interface LocationRepository extends PagingAndSortingRepository<Location, Long> {
	List<Location> findByHospitalName(@Param("hospitalName") String hospitalName);
	List<Location> findByWardName(@Param("hardName") String wardName);
}

