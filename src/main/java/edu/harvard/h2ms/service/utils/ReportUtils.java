package edu.harvard.h2ms.service.utils;

import com.opencsv.CSVWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.List;

/** Utilities for report generation */
public class ReportUtils {

  // this determines how long it takes for next notification
  public enum NotificationFrequency {
    HALFMINUTE("HALFMINUTE", 30L), // for testing
    DAILY("DAILY", 86400L),
    WEEKLY("WEEKLY", 604800L),
    MONTHLY("MONTHLY", 2592000L),
    UNDEFINED("UNDEFINED", 0L);

    public final String stringRepresentation;
    public final long seconds;

    NotificationFrequency(String stringRepresentation, long seconds) {
      this.stringRepresentation = stringRepresentation;
      this.seconds = seconds;
    }

    public static NotificationFrequency getNotificationFrequency(String stringRepresentation) {

      for (NotificationFrequency nf : NotificationFrequency.class.getEnumConstants()) {
        if (nf.stringRepresentation.equals(stringRepresentation)) {
          return nf;
        }
      }
      return UNDEFINED;
    }
  }

  /**
   * Writes Report using list of list of strings
   *
   * @param data [[string,string,],[....]]
   * @return CSV text
   */
  public static Writer stringWriterReport(List<List<String>> data) {

    Writer writer = new StringWriter();
    CSVWriter csvWriter =
        new CSVWriter(
            writer,
            CSVWriter.DEFAULT_SEPARATOR,
            CSVWriter.DEFAULT_QUOTE_CHARACTER,
            CSVWriter.DEFAULT_ESCAPE_CHARACTER,
            CSVWriter.DEFAULT_LINE_END);

    data.forEach((ls) -> csvWriter.writeNext(ls.toArray(new String[0])));
    try {
      csvWriter.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
    return writer;
  }

  public static String writeCsvString(List<List<String>> data) {
    Writer writer = ReportUtils.stringWriterReport(data);
    try {
      writer.flush();
    } catch (IOException e) {
      e.printStackTrace();
    }

    return writer.toString();
  }

  /** @return current unix time */
  public static long getUnixTime() {

    return System.currentTimeMillis() / 1000L;
  }
}
