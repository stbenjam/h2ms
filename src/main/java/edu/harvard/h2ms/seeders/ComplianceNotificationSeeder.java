package edu.harvard.h2ms.seeders;

import edu.harvard.h2ms.domain.core.Notification;
import edu.harvard.h2ms.repository.NotificationRepository;
import edu.harvard.h2ms.service.report.ReportWorkerComplianceTrendMonthly;
import edu.harvard.h2ms.service.report.ReportWorkerComplianceTrendWeekly;
import edu.harvard.h2ms.service.report.ReportWorkerComplianceWarningMonthly;
import edu.harvard.h2ms.service.report.ReportWorkerComplianceWarningWeekly;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class ComplianceNotificationSeeder {

  private NotificationRepository notificationRepository;

  @Autowired
  public ComplianceNotificationSeeder(NotificationRepository notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  @EventListener
  public void seed(ContextRefreshedEvent event) {
    seedNotificationTable();
  }

  private void seedNotificationTable() {
    Notification notification = new Notification();
    notification.setName("WeeklyComplianceReport");
    notification.setReportType(ReportWorkerComplianceWarningWeekly.REPORT_TYPE);
    notification.setNotificationTitle("Weekly Compliance Notification");
    notification.setNotificationBody("Report:\n");
    this.notificationRepository.save(notification);

    notification = new Notification();
    notification.setName("MonthlyComplianceReport");
    notification.setReportType(ReportWorkerComplianceWarningMonthly.REPORT_TYPE);
    notification.setNotificationTitle("Monthly Compliance Notification");
    notification.setNotificationBody("Report:\n");
    this.notificationRepository.save(notification);

    notification = new Notification();
    notification.setName("MonthlyTrendsReport");
    notification.setReportType(ReportWorkerComplianceTrendMonthly.REPORT_TYPE);
    notification.setNotificationTitle("Monthly Trends Notification");
    notification.setNotificationBody("Report:\n");
    this.notificationRepository.save(notification);

    notification = new Notification();
    notification.setName("WeeklyTrendsReport");
    notification.setReportType(ReportWorkerComplianceTrendWeekly.REPORT_TYPE);
    notification.setNotificationTitle("Weekly Trends Notification");
    notification.setNotificationBody("Report:\n");
    this.notificationRepository.save(notification);
  }
}
