import { Log, LogLevel, LogStats } from "../types/logsType";

export function parseLogsFromCsv(csvString: string): Log[] {
  const lines = csvString.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];

  // const headers = lines[0].split(",");

  return lines.slice(1).reduce<Log[]>((acc, line) => {
    try {
      const values = line.split(",");
      if (values.length < 7) return acc;

      const log: Log = {
        LineId: parseInt(values[0]) || 0,
        Date: values[1] || "",
        Time: values[2] || "",
        Level: (values[3] as LogLevel) || LogLevel.INFO,
        Component: values[4] || "",
        Content: values[5] ? values[5].replace(/^"|"$/g, "") : "",
        EventId: values[6] || "",
      };

      // Validate required fields
      if (!log.Date || !log.Time || !log.Level || !log.Component) {
        return acc;
      }

      acc.push(log);
    } catch (error) {
      console.error("Error parsing line:", line, error);
    }
    return acc;
  }, []);
}

export function getLogStats(logs: Log[]): LogStats {
  const stats: LogStats = {
    total: logs.length,
    byLevel: {
      [LogLevel.INFO]: 0,
      [LogLevel.WARN]: 0,
      [LogLevel.ERROR]: 0,
      [LogLevel.DEBUG]: 0,
    },
    byComponent: {},
    byHour: {},
    byDate: {},
  };

  logs.forEach((log) => {
    try {
      // Count by level
      stats.byLevel[log.Level]++;

      // Count by component
      if (log.Component) {
        stats.byComponent[log.Component] =
          (stats.byComponent[log.Component] || 0) + 1;
      }

      // Count by hour
      if (log.Time) {
        const hour = log.Time.slice(0, 2);
        if (!stats.byHour[hour]) {
          stats.byHour[hour] = {
            [LogLevel.INFO]: 0,
            [LogLevel.WARN]: 0,
            [LogLevel.ERROR]: 0,
            [LogLevel.DEBUG]: 0,
          };
        }
        stats.byHour[hour][log.Level]++;
      }

      // Count by date
      if (log.Date) {
        stats.byDate[log.Date] = (stats.byDate[log.Date] || 0) + 1;
      }
    } catch (error) {
      console.error("Error processing log:", log, error);
    }
  });

  return stats;
}
