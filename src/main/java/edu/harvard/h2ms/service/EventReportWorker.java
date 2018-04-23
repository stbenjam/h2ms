package edu.harvard.h2ms.service;

public class EventReportWorker implements ReportWorker {

  @Override
  public String createReport() {
    return "hi";
  }

  @Override
  public boolean isTriggered() {
    return true;
  }
}
