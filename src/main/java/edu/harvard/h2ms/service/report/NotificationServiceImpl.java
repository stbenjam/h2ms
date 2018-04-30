package edu.harvard.h2ms.service.report;

import edu.harvard.h2ms.domain.core.Notification;
import edu.harvard.h2ms.domain.core.User;
import edu.harvard.h2ms.repository.NotificationRepository;
import edu.harvard.h2ms.service.EmailService;
import edu.harvard.h2ms.service.utils.ReportUtils;
import edu.harvard.h2ms.service.utils.ReportUtils.NotificationFrequency;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@Service("notificationService")
public class NotificationServiceImpl {

  private static final Log log = LogFactory.getLog(NotificationServiceImpl.class);

  @Autowired private NotificationRepository notificationRepository;

  @Autowired private EmailService emailService;

  @Autowired private ReportService reportService;

  /** Polls notifications at set duration (modify fixedRate for polling frequency) */
  @Scheduled(fixedRate = 10000)
  public void pollNotifications() {
    log.debug("****polling notifications");

    for (Notification notification : notificationRepository.findAll()) {

      this.notifyUsers(notification);
    }
  }

  /**
   * Scans subscribers for notification. Users due for notifications are sent notification email
   *
   * @param notification
   */
  private void notifyUsers(Notification notification) {
    log.debug("notification Name: " + notification.getName());
    log.debug("notification subscribers: " + notification.getUser());

    Map<String, Long> lastNotified = notification.getEmailLastNotifiedTimes();
    for (User user : notification.getUser()) {
      if (lastNotified.containsKey(user.getEmail()) && isTimeToNotify(notification, user)) {
        log.info("user " + user.getEmail() + " is ready to be notified");

        // Create email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject(notification.getNotificationTitle());
        String messageText = notification.getNotificationBody();

        // request for report
        String reportString = reportService.requestReport(notification.getReportType());

        message.setText(messageText + reportString);

        // actually send the message
        emailService.sendEmail(message);

        log.debug("email sent " + message);
        log.debug("before reset" + notification.getEmailLastNotifiedTimes().get(user.getEmail()));

        // finally, not the time in which the last email was sent for the user
        resetEmailLastNotifiedTime(notification, user);

        log.debug("after reset" + notification.getEmailLastNotifiedTimes().get(user.getEmail()));

      } else {
        log.debug("user " + user.getEmail() + " is not ready to be notified");
      }
    }
  }

  /**
   * Sets the user notification time to current time
   *
   * @param notification
   * @param user
   */
  private void resetEmailLastNotifiedTime(Notification notification, User user) {

    notification.setEmailLastNotifiedTime(user.getEmail(), ReportUtils.getUnixTime());
    notificationRepository.save(notification);
  }

  /**
   * Remves the user notification time
   *
   * @param notification
   * @param user
   */
  private void removeEmailLastNotifiedTime(Notification notification, User user) {

    notification.getEmailLastNotifiedTimes().remove(user.getEmail());
    notificationRepository.save(notification);
  }

  /**
   * Determines whether user should be notified or not based on requested user notfication interval
   *
   * <p>Formula: dNT = currentTime - lastNotificationtime Business Rule: dNT > interval time =>
   * notify default => do not notify
   *
   * @param notification
   * @param user
   * @return
   */
  private static boolean isTimeToNotify(Notification notification, User user) {
    String userEmail = user.getEmail();
    long lastNotificationTime = notification.getEmailLastNotifiedTimes().get(userEmail);

    // interval interpretation mechanism
    String stringNotificationFrequency = user.getNotificationFrequency();

    NotificationFrequency notificationFrequency =
        NotificationFrequency.getNotificationFrequency(stringNotificationFrequency);

    // if set, get notification's user interal
    Long notificationSpecificInterval = notification.getEmailNotificationIntervals().get(userEmail);

    // define how long to wait for each notification frequency
    if (notificationFrequency == NotificationFrequency.UNDEFINED) {
      notificationFrequency = NotificationFrequency.DAILY;
    }

    long interval = notificationFrequency.seconds;

    // if notfication-specific value is found, use this instead of user default
    if (notificationSpecificInterval != null) {
      interval = notificationSpecificInterval.longValue();
    }

    long currentTime = ReportUtils.getUnixTime();

    long deltaNotificationTime = currentTime - lastNotificationTime;

    log.debug("deltaNotificationTime:" + deltaNotificationTime);
    if (deltaNotificationTime > interval) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Adds user to notification's subscription list
   *
   * @param user
   * @param notification
   */
  public void subscribeUserNotification(User user, Notification notification) {

    notification.addUser(user);
    log.debug("subscribed:" + notification.getUser());
    resetEmailLastNotifiedTime(notification, user);
  }

  /**
   * Adds user to notification's subscription list, with custom interval
   *
   * @param user
   * @param notification
   */
  public void subscribeUserNotification(
      User user, Notification notification, Long notificationInterval) {

    notification.addUser(user);
    notification.setEmailNotificationInterval(user.getEmail(), notificationInterval);

    log.debug("subscribed:" + notification.getUser());
    resetEmailLastNotifiedTime(notification, user);
  }

  /**
   * Removes user from notification's subscription list
   *
   * @param user
   * @param notification
   */
  public void unsubscribeUserNotification(User user, Notification notification) {
    notification.removeUser(user);
    log.debug("unsubscribed:" + notification.getUser());
    resetEmailLastNotifiedTime(notification, user);
    removeEmailLastNotifiedTime(notification, user);
  }
}
