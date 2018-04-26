package edu.harvard.h2ms.service;

import edu.harvard.h2ms.repository.EventRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@Service("reportService")
public class ReportServiceImpl implements ReportService {

  final Logger log = LoggerFactory.getLogger(ReportServiceImpl.class);

  @Autowired private EventRepository eventRepository;

  /** Creates event dump */
  @Override
  public String createEventReport() {
    //    // Fetches all events from the H2MS database
    //    List<Event> events = Lists.newArrayList(eventRepository.findAll());
    //
    //    List<List<String>> data = new ArrayList<List<String>>();
    //
    //    // Doesn't assume all events have same answers
    //    // get all the questions in events
    //    Set<String> questionKeys = new HashSet<String>();
    //    for (Event event : events) {
    //      for (Answer answer : event.getAnswers()) {
    //        questionKeys.add(answer.getQuestion().getQuestion());
    //      }
    //    }
    //
    //    Boolean isHeaderRow = true;
    //    for (Event event : events) {
    //
    //      if (isHeaderRow == true) {
    //        List<String> headerRow = new ArrayList<String>();
    //        headerRow.add("eventId");
    //        headerRow.add("time");
    //        headerRow.add("location");
    //        headerRow.add("observer_id");
    //        headerRow.add("observer_type");
    //        headerRow.add("subject_id");
    //        headerRow.add("subject_type");
    //
    //        // create event question columns
    //        for (String question : questionKeys) {
    //          headerRow.add("q_" + question);
    //        }
    //
    //        data.add(headerRow);
    //
    //        isHeaderRow = false;
    //      }
    //      List<String> row = new ArrayList<String>();
    //
    //      row.add(event.getId().toString());
    //      row.add(event.getTimestamp().toString());
    //      row.add(event.getLocation().toString());
    //      row.add(event.getObserver().getEmail().toString());
    //      row.add(event.getObserver().getType().toString());
    //      row.add(event.getSubject().getEmail().toString());
    //      row.add(event.getSubject().getType().toString());
    //
    //      Map<String, String> answerMap = new HashMap<>();
    //      for (Answer answer : event.getAnswers()) {
    //        String q = answer.getQuestion().getQuestion();
    //        String a = answer.getValue();
    //        answerMap.put(q, a);
    //      }
    //
    //      for (String key : questionKeys) {
    //        if (answerMap.containsKey(key)) {
    //          row.add(answerMap.get(key));
    //        } else {
    //          row.add("");
    //        }
    //      }
    //
    //      data.add(row);
    //    }
    //
    //    return ReportUtils.writeCsvString(data);

    ReportWorker reportWorker = getReportWorker("eventDump");
    return reportWorker.createReport();
  }

  @Autowired private List<ReportWorker> reportWorkers;

  private static final Map<String, ReportWorker> reportWorkerCache = new HashMap<>();

  @PostConstruct
  public void initReportWorkerCache() {
    for (ReportWorker reportWorker : reportWorkers) {
      log.info("*********** cache init on" + reportWorker.getType());
      reportWorkerCache.put(reportWorker.getType(), reportWorker);
    }
  }

  public static ReportWorker getReportWorker(String reportType) {
    //    log.info("***** cache count" + reportWorkerCache.size());
    ReportWorker reportWorker = reportWorkerCache.get(reportType);
    if (reportWorker == null) throw new RuntimeException(reportType);
    return reportWorker;
  }

  @Override
  public String requestReport(String reportType) {
    log.info("report requested.  report type: " + reportType);
    log.debug("***** cache count" + reportWorkerCache.size());
    ReportWorker reportWorker = getReportWorker(reportType);

    String ans = reportWorker.createReport();

    // TODO: add compliance result text
    log.info("***** answer" + ans);
    return ans;
  }
}
