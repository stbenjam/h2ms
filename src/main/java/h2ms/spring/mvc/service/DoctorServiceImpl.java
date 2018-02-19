package h2ms.spring.mvc.service;

import h2ms.spring.mvc.domain.Doctor;
import h2ms.spring.mvc.repository.DoctorRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.List;

@Service("doctorService")
@Repository
@Transactional
public class DoctorServiceImpl implements DoctorService {

    private DoctorRepository doctorRepository;

    // Finds all Doctors
    @Transactional(readOnly = true)
    public List<Doctor> findAll() {
        List doctorList = Arrays.asList(doctorRepository.findAll());
        return doctorList;
    }
}
