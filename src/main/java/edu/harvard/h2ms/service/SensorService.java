package edu.harvard.h2ms.service;

import javax.usb.UsbDevice;
import javax.usb.UsbHub;
import javax.usb.UsbInterface;

public interface SensorService {

  /**
   * Searches through all human interface devices attached to machine in search of specified Sensor
   * provided in parameters.
   *
   * @param usbHub - root hub for the services of the host manager
   * @param vendorIdentifier - vendor ID of the Sensor device
   * @param productIdentifier - product ID of the Sensor device
   * @return
   */
  UsbDevice findAttachedSensorScanner(
      UsbHub usbHub, short vendorIdentifier, short productIdentifier);

  /**
   * Retrieves the communication interface of Sensor scanner
   *
   * @param usbSensorScanner - Sensor scanner
   * @return
   */
  UsbInterface findSensorScannerInterface(UsbDevice usbSensorScanner);
}
