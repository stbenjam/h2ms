package edu.harvard.h2ms.service;

import org.springframework.stereotype.Component;

@Component
public class ReportWorkerEvent implements ReportWorker {

  @Override
  public String getType() {
    return "eventReport";
  }

  @Override
  public String createReport() {
    return "hi";
  }

  @Override
  public boolean isTriggered() {
    return true;
  }
}
