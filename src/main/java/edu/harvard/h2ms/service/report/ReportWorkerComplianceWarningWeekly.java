package edu.harvard.h2ms.service.report;

import edu.harvard.h2ms.service.utils.ReportUtils.NotificationFrequency;
import org.springframework.stereotype.Component;

@Component
public class ReportWorkerComplianceWarningWeekly extends AbstractReportWorkerComplianceWarning {

  long REPORTINGINTERVAL = NotificationFrequency.WEEKLY.seconds;
  public static final String REPORT_TYPE = "complianceWarningWeekly";

  @Override
  public String getType() {
    return REPORT_TYPE;
  }
}
