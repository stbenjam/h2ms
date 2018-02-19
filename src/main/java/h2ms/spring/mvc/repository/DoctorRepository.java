package h2ms.spring.mvc.repository;

import java.util.List;

import h2ms.spring.mvc.domain.Doctor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface DoctorRepository extends PagingAndSortingRepository<Doctor, Long> {
    List<Doctor> findByLastName(@Param("lastName") String lastName);
}
