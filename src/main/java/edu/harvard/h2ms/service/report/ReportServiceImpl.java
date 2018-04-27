package edu.harvard.h2ms.service.report;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

/** Loads and caches all report workers, as well as retrieve workers using report type names */
@Component
@Service("reportService")
public class ReportServiceImpl implements ReportService {

  final Logger log = LoggerFactory.getLogger(ReportServiceImpl.class);

  /* this is where all the reportWorkers are loaded */
  @Autowired private List<ReportWorker> reportWorkers;

  private static final Map<String, ReportWorker> reportWorkerCache = new HashMap<>();

  /** Initialize report worker cache */
  @PostConstruct
  public void initReportWorkerCache() {
    for (ReportWorker reportWorker : reportWorkers) {
      log.info("*********** cache init on" + reportWorker.getType());
      reportWorkerCache.put(reportWorker.getType(), reportWorker);
    }
  }

  public static ReportWorker getReportWorker(String reportType) {
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

    log.info("***** answer" + ans);
    return ans;
  }
}
