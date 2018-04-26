package edu.harvard.h2ms.service.utils;

import com.opencsv.CSVWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.List;

/** Utilities for report generation */
public class ReportUtils {
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
}
