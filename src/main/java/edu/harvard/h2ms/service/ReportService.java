package edu.harvard.h2ms.service;

public interface ReportService {

  /**
   * Generates report
   *
   * @return
   */
  public String createEventReport();

  /** Determines if notification should be triggered to create the report */
  public boolean isTriggered();

  public String requestReport(String reportType);
}
