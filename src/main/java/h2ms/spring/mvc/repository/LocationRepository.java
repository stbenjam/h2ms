package h2ms.spring.mvc.repository;

import java.util.List;
import h2ms.spring.mvc.domain.Location;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface LocationRepository extends PagingAndSortingRepository<Location, Long> {
	List<Location> findByHospitalName(@Param("hospitalName") String hospitalName);
	List<Location> findByWardName(@Param("hardName") String wardName);
}

