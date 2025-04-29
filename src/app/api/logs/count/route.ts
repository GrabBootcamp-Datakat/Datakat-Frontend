import { NextResponse } from "next/server";
import { parseLogsFromCsv } from "@/utils/parser";
import { LogCountDto } from "@/types/logsType";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "Spark_2k.log_structured.csv"
    );
    const csvText = fs.readFileSync(filePath, "utf-8");
    const logs = parseLogsFromCsv(csvText);

    // Get default date range from logs
    const dates = logs
      .map((log) => {
        const dateStr = `${log.Date} ${log.Time}`;
        return dayjs(dateStr, "YYYY-MM-DD HH:mm:ss");
      })
      .filter((date) => date.isValid());

    const defaultStartDate =
      dates.length > 0
        ? dates.reduce(
            (min, date) => (date.isBefore(min) ? date : min),
            dates[0]
          )
        : dayjs();
    const defaultEndDate =
      dates.length > 0
        ? dates.reduce(
            (max, date) => (date.isAfter(max) ? date : max),
            dates[0]
          )
        : dayjs();

    // Filter logs based on date range if provided
    const filteredLogs =
      startDate && endDate
        ? logs.filter((log) => {
            const logDate = dayjs(
              `${log.Date} ${log.Time}`,
              "YYYY-MM-DD HH:mm:ss"
            );
            return (
              logDate.isValid() &&
              logDate.isAfter(dayjs(startDate)) &&
              logDate.isBefore(dayjs(endDate).add(1, "day"))
            );
          })
        : logs;

    const counts: LogCountDto = {
      total: filteredLogs.length,
      INFO: 0,
      WARN: 0,
      ERROR: 0,
      DEBUG: 0,
      defaultDateRange: {
        startDate: defaultStartDate.format("YYYY-MM-DD"),
        endDate: defaultEndDate.format("YYYY-MM-DD"),
      },
    };

    filteredLogs.forEach((log) => {
      const level = log.Level as keyof Omit<LogCountDto, "defaultDateRange">;
      counts[level] = (counts[level] || 0) + 1;
    });

    return NextResponse.json(counts);
  } catch (error) {
    console.error("Error processing logs:", error);
    return NextResponse.json(
      { error: "Failed to process logs" },
      { status: 500 }
    );
  }
}
