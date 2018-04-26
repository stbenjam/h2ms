package edu.harvard.h2ms.service;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

import edu.harvard.h2ms.domain.core.Sensor;
import edu.harvard.h2ms.repository.SensorRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@DataJpaTest
public class SensorServiceTests {

  @Autowired private SensorRepository sensorRepository;

  @Before
  public void setup() {
    Sensor sensor = new Sensor();
    sensor.setBrandName("Generic Brand");
    sensor.setCapacity("100");
    sensor.setChargeTime("2 hours");
    sensor.setId(1L);
    sensor.setModelNumber("12443");
    sensor.setOrderNumber(123451);
    sensor.setVoltage("1010");
    sensorRepository.save(sensor);
  }

  @Test
  public void whenFindById_thenReturnSensor() {
    Sensor found = sensorRepository.findOne(1L);
    assertThat(found, is(found));
  }
}
