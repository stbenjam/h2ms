package edu.harvard.h2ms.seeders;

import edu.harvard.h2ms.domain.core.Location;
import edu.harvard.h2ms.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class LocationSeeder {

  private final LocationRepository locationRepository;

  @Autowired
  public LocationSeeder(final LocationRepository locationRepository) {
    this.locationRepository = locationRepository;
  }

  @EventListener
  public void seed(final ContextRefreshedEvent event) {
    seedLocationTable();
  }

  private void seedLocationTable() {
    // Top level locations
    final Location massGeneral =
        saveNewLocation(
            "Hospital",
            "Massachusetts General Hospital",
            "USA",
            "55 Fruit Street Boston, MA",
            "02114");

    final Location cambrideHealth =
        saveNewLocation(
            "Hospital",
            "Cambridge Health Alliance",
            "USA",
            "1493 Cambridge St, Cambridge, MA",
            "02139");

    saveNewLocation(
        "Clinic", "Massachusetts Health Clinic", "USA", "123 Anywhere St, Boston, MA", "02114");

    // Wards
    final Location massGeneralEmergencyRoom =
        addChildLocation("Ward", "Emergency Room", massGeneral);
    addChildLocation("Ward", "Intensive Care Unit", massGeneral);
    addChildLocation("Ward", "Oncology", massGeneral);
    // Emergency room at different hospital.
    addChildLocation("Ward", "Emergency Room", cambrideHealth);

    // Rooms
    addChildLocation("Patient Room", "Room 1", massGeneralEmergencyRoom);
    addChildLocation("Patient Room", "Room 2", massGeneralEmergencyRoom);
  }

  private Location saveNewLocation(
      final String type,
      final String name,
      final String country,
      final String address,
      final String zip) {
    final Location location = new Location();
    location.setType(type);
    location.setName(name);
    location.setCountry(country);
    location.setAddress(address);
    location.setZip(zip);
    return locationRepository.save(location);
  }

  private Location addChildLocation(final String type, final String name, final Location parent) {
    final Location location = new Location();
    location.setType(type);
    location.setName(name);
    location.setCountry(parent.getCountry());
    location.setAddress(parent.getAddress());
    location.setZip(parent.getZip());
    location.setParent(parent);
    return locationRepository.save(location);
  }
}
