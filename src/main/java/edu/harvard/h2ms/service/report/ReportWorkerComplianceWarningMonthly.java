package edu.harvard.h2ms.service.report;

import edu.harvard.h2ms.service.utils.ReportUtils.NotificationFrequency;

public class ReportWorkerComplianceWarningMonthly extends AbstractReportWorkerComplianceWarning{

	long REPORTINGINTERVAL = NotificationFrequency.MONTHLY.seconds;

	@Override
	public String getType() {
		return "complianceWarningMonthly";
	}

}
