package edu.harvard.h2ms.service;

import edu.harvard.h2ms.repository.RoleRepository;
import edu.harvard.h2ms.repository.SensorRepository;
import java.util.List;
import javax.usb.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/** The Sensor Scanner Service Implementor is */
public class SensorServiceImpl implements SensorService {

  private static final Logger log = LoggerFactory.getLogger(SensorServiceImpl.class);

  @Autowired private SensorRepository sensorRepository;

  @Autowired private RoleRepository roleRepository;

  /**
   * Searches through all human interface devices attached to machine in search of specified Sensor
   * scanner.
   *
   * @param usbHub - root hub for the services of the host manager
   * @param vendorIdentifier - vendor ID of the Sensor scanner
   * @param productIdentifier - product ID of the Sensor scanner
   * @return
   */
  public UsbDevice findAttachedSensorScanner(
      UsbHub usbHub, short vendorIdentifier, short productIdentifier) {
    List<UsbDevice> usbDevices = usbHub.getAttachedUsbDevices();
    for (UsbDevice device : usbDevices) {
      short deviceProductId = device.getUsbDeviceDescriptor().idProduct();
      short deviceVendorId = device.getUsbDeviceDescriptor().idVendor();

      if (deviceProductId == productIdentifier && deviceVendorId == vendorIdentifier) {
        log.info("RFID Scanner Identified \n" + device.toString());
        return device;
      }

      if (device.isUsbHub()) {
        device = findAttachedSensorScanner((UsbHub) device, vendorIdentifier, productIdentifier);
        if (device != null) {
          log.info("Sensor Scanner Identified \n" + device.toString());
          return device;
        }
      }
    }
    return null;
  }

  /**
   * Retrieves the communication interface of Sensor scanner
   *
   * @param usbSensorScanner - Sensor scanner
   * @return
   */
  public UsbInterface findSensorScannerInterface(UsbDevice usbSensorScanner) {
    UsbConfiguration configuration = usbSensorScanner.getActiveUsbConfiguration();
    UsbInterface rfidScannerInterface = configuration.getUsbInterface((byte) 0x00);
    log.info("RFID Scanner interface found: " + rfidScannerInterface.toString());
    return rfidScannerInterface;
  }
}
