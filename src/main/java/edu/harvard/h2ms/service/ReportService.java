package edu.harvard.h2ms.service;

public interface ReportService {

  /**
   * Generates report
   *
   * @return
   */
  public String createEventReport();

  public String requestReport(String reportType);
}
