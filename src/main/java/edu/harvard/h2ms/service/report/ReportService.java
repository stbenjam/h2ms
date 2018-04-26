package edu.harvard.h2ms.service.report;

public interface ReportService {

  /**
   * Generates report
   *
   * @param reportType
   * @return report in string
   */
  public String requestReport(String reportType);
}
