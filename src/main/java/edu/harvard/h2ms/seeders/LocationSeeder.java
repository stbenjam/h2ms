package edu.harvard.h2ms.seeders;

import edu.harvard.h2ms.domain.core.Location;
import edu.harvard.h2ms.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class LocationSeeder {

  private LocationRepository locationRepository;

  @Autowired
  public LocationSeeder(LocationRepository locationRepository) {
    this.locationRepository = locationRepository;
  }

  @EventListener
  public void seed(ContextRefreshedEvent event) {
    seedLocationTable();
  }

  private void seedLocationTable() {

    Location massGeneral =
        saveNewLocation(
            "Hospital",
            "Massachusetts General Hospital",
            "USA",
            "55 Fruit Street Boston, MA",
            "02114");
    addChildLocation("Ward", "Emergency Room", massGeneral);
    addChildLocation("Ward", "Intensive Care Unit", massGeneral);

    final Location cambrideHealth =
        saveNewLocation(
            "Hospital",
            "Cambridge Health Alliance",
            "USA",
            "1493 Cambridge St, Cambridge, MA",
            "02139");
    addChildLocation("Ward", "Emergency Room", cambrideHealth);
  }

  private Location saveNewLocation(
      String type, String name, String country, String address, String zip) {
    Location location = new Location();
    location.setType(type);
    location.setName(name);
    location.setCountry(country);
    location.setAddress(address);
    location.setZip(zip);
    return locationRepository.save(location);
  }

  private void addChildLocation(String type, String name, Location parent) {
    Location location = new Location();
    location.setType(type);
    location.setName(name);
    location.setParent(parent);
    locationRepository.save(location);
  }
}
