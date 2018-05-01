package edu.harvard.h2ms.service.report;

import edu.harvard.h2ms.service.utils.ReportUtils.NotificationFrequency;
import org.springframework.stereotype.Component;

@Component
public class ReportWorkerComplianceTrendWeekly extends AbstractReportWorkerComplianceTrend {

  long REPORTINGINTERVAL = NotificationFrequency.WEEKLY.seconds;
  public static final String REPORT_TYPE = "complianceTrendWeekly";

  @Override
  public String getType() {
    return REPORT_TYPE;
  }
}
