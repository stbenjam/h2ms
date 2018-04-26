package edu.harvard.h2ms.service;

public interface ReportService {

  /**
   * Generates report
   *
   * @param reportType
   * @return report in string
   */
  public String requestReport(String reportType);
}
