package h2ms.spring.mvc.service;

import h2ms.spring.mvc.domain.Doctor;
import java.util.List;

public interface DoctorService {

    // Finds all Doctors
    List<Doctor> findAll();

}
