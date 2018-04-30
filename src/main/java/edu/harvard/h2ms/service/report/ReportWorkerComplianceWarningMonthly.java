package edu.harvard.h2ms.service.report;

import edu.harvard.h2ms.service.utils.ReportUtils.NotificationFrequency;
import org.springframework.stereotype.Component;

@Component
public class ReportWorkerComplianceWarningMonthly extends AbstractReportWorkerComplianceWarning {

  long REPORTINGINTERVAL = NotificationFrequency.MONTHLY.seconds;
  public static final String REPORT_TYPE = "complianceWarningMonthly";

  @Override
  public String getType() {
    return REPORT_TYPE;
  }
}
