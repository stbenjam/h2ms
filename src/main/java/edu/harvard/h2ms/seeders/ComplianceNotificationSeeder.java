package edu.harvard.h2ms.seeders;

import edu.harvard.h2ms.domain.core.Notification;
import edu.harvard.h2ms.repository.NotificationRepository;
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
    notification.setNotificationBody("note body\n Report:\n");

    this.notificationRepository.save(notification);

    Notification notification2 = new Notification();
    notification2.setName("MonthlyComplianceReport");
    notification2.setReportType(ReportWorkerComplianceWarningMonthly.REPORT_TYPE);
    notification2.setNotificationTitle("Monthly Compliance Notification");
    notification2.setNotificationBody("note body\n Report:\n");

    this.notificationRepository.save(notification2);
  }
}
