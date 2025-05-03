"use client"

import { useState } from "react"
import { AlertTriangle, ArrowRight, Brain, Clock, Filter, Search, Settings, TrendingUp, BarChartBig, ToggleRight, ToggleLeft, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

import { AnomalyChart } from "@/components/anomaly-chart"

// Mock data for historical analysis
const weeklyAnomalies = [
  { day: "Mon", count: 5 },
  { day: "Tue", count: 8 },
  { day: "Wed", count: 3 },
  { day: "Thu", count: 12 },
  { day: "Fri", count: 7 },
  { day: "Sat", count: 4 },
  { day: "Sun", count: 6 },
]

const monthlyTrends = [
  { month: "Jan", count: 20 },
  { month: "Feb", count: 25 },
  { month: "Mar", count: 18 },
  { month: "Apr", count: 30 },
  { month: "May", count: 35 },
  { month: "Jun", count: 28 },
]

const topServices = [
  { service: "api-gateway", count: 15, avgDuration: "5.2s" },
  { service: "database-service", count: 10, avgDuration: "3.8s" },
  { service: "auth-service", count: 8, avgDuration: "4.1s" },
]

const anomalies = [
  {
    id: "1",
    timestamp: "2023-04-29T14:35:42Z",
    severity: "high",
    service: "api-gateway",
    metric: "response_time",
    description: "Sudden spike in API response times",
    explanation:
      "The API gateway is experiencing unusually high response times, likely due to increased traffic or a bottleneck in downstream services.",
    recommendation:
      "Check for recent deployments or configuration changes. Scale up the API gateway instances or investigate downstream service performance.",
  },
  {
    id: "2",
    timestamp: "2023-04-29T12:22:15Z",
    severity: "medium",
    service: "database-service",
    metric: "query_time",
    description: "Slow database queries detected",
    explanation:
      "Several database queries are taking significantly longer than usual to execute.",
    recommendation:
      "Review recent schema changes and consider rewriting the problematic queries.",
  },
  {
    id: "3",
    timestamp: "2023-04-29T08:45:30Z",
    severity: "critical",
    service: "auth-service",
    metric: "error_rate",
    description: "Authentication failures spiking",
    explanation:
      "There is an abnormal increase in authentication failures across multiple client applications.",
    recommendation:
      "Implement rate limiting, review security logs, and block suspicious IPs.",
  },
]

export default function AnomaliesPage() {
  const [selectedAnomaly, setSelectedAnomaly] = useState(anomalies[0])
  const [severityFilter, setSeverityFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [autoDetect, setAutoDetect] = useState(true)
  const [notificationToggle, setNotificationToggle] = useState(true)
  const [threshold, setThreshold] = useState([60])

  const filteredAnomalies = anomalies.filter((anomaly) => {
    const matchesSearch =
      anomaly.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anomaly.service.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = severityFilter === "all" || anomaly.severity === severityFilter
    const matchesService = serviceFilter === "all" || anomaly.service === serviceFilter
    return matchesSearch && matchesSeverity && matchesService
  })

  const services = Array.from(new Set(anomalies.map((anomaly) => anomaly.service)))
  const severities = Array.from(new Set(anomalies.map((anomaly) => anomaly.severity)))

  // Calculate average anomaly duration for stats
  const avgDuration = topServices.reduce((sum, svc) => {
    return sum + parseFloat(svc.avgDuration)
  }, 0) / topServices.length

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Anomaly Detection</h2>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <Tabs defaultValue="detected" className="space-y-4">
          <TabsList>
            <TabsTrigger value="detected">Detected Anomalies</TabsTrigger>
            <TabsTrigger value="history">Historical Analysis</TabsTrigger>
            <TabsTrigger value="settings">Detection Settings</TabsTrigger>
          </TabsList>

          {/* Detected Anomalies Tab */}
          <TabsContent value="detected">
            <div className="grid gap-4 md:grid-cols-7">
              <Card className="md:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle>Anomaly Filters</CardTitle>
                  <CardDescription>Filter anomalies by severity, service, or search</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search anomalies..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={severityFilter} onValueChange={setSeverityFilter}>
                        <SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Severities</SelectItem>
                          {severities.map((s) => (
                            <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={serviceFilter} onValueChange={setServiceFilter}>
                        <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Services</SelectItem>
                          {services.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardHeader className="pb-2 pt-0">
                  <div className="flex items-center justify-between">
                    <CardTitle>Detected Anomalies</CardTitle>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredAnomalies.map((anomaly) => (
                      <div
                        key={anomaly.id}
                        className={`flex cursor-pointer items-center space-x-4 rounded-md border p-4 ${
                          selectedAnomaly.id === anomaly.id ? "border-primary bg-muted/50" : ""
                        }`}
                        onClick={() => setSelectedAnomaly(anomaly)}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{anomaly.description}</p>
                          <div className="text-xs text-muted-foreground">{anomaly.service} • {new Date(anomaly.timestamp).toLocaleString()}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-4">
                <CardHeader>
                  <CardTitle>Anomaly Details</CardTitle>
                  <CardDescription>AI-powered analysis and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">{selectedAnomaly.description}</h3>
                    <div className="text-sm text-muted-foreground">{selectedAnomaly.service} • {selectedAnomaly.metric} • {new Date(selectedAnomaly.timestamp).toLocaleString()}</div>
                    <div className="mt-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                      {selectedAnomaly.severity.charAt(0).toUpperCase() + selectedAnomaly.severity.slice(1)} Severity
                    </div>
                  </div>

                  <div className="h-[200px] w-full">
                    <AnomalyChart anomaly={selectedAnomaly} />
                  </div>

                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div>
                      <div className="flex items-center gap-2"><Brain className="h-4 w-4" /> AI Analysis</div>
                      <p className="mt-1">{selectedAnomaly.explanation}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2"><Brain className="h-4 w-4" /> Recommendation</div>
                      <p className="mt-1">{selectedAnomaly.recommendation}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Dismiss</Button>
                  <Button>Take Action</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Historical Analysis Tab */}
          <TabsContent value="history">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Weekly Anomaly Frequency */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Weekly Anomaly Frequency</CardTitle>
                  <CardDescription>Anomalies detected per day over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px] w-full">
                    <div className="flex items-end h-full space-x-2">
                      {weeklyAnomalies.map((day) => (
                        <div key={day.day} className="flex-1 flex flex-col items-center">
                          <div
                            className="bg-blue-500 w-full rounded-t"
                            style={{ height: `${(day.count / Math.max(...weeklyAnomalies.map(d => d.count))) * 80}%` }}
                          />
                          <span className="text-xs text-muted-foreground mt-2">{day.count}</span>
                          <span className="text-xs text-muted-foreground">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Stats */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Summary Stats</CardTitle>
                  <CardDescription>Key metrics from the past 7 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <strong className="block text-lg text-foreground">18</strong>
                    Critical events in the past 7 days
                  </div>
                  <div>
                    <strong className="block text-lg text-foreground">{avgDuration.toFixed(1)}s</strong>
                    Average anomaly duration
                  </div>
                  <div>
                    <strong className="block text-lg text-foreground">{weeklyAnomalies.reduce((sum, day) => sum + day.count, 0)}</strong>
                    Total anomalies this week
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trends */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Anomaly Trends</CardTitle>
                  <CardDescription>Comparison of anomaly frequency over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px] w-full relative">
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        points={monthlyTrends.map((month, i) => {
                          const x = (i / (monthlyTrends.length - 1)) * 380 + 10;
                          const y = 190 - (month.count / Math.max(...monthlyTrends.map(m => m.count))) * 180;
                          return `${x},${y}`;
                        }).join(" ")}
                      />
                      {monthlyTrends.map((month, i) => {
                        const x = (i / (monthlyTrends.length - 1)) * 380 + 10;
                        const y = 190 - (month.count / Math.max(...monthlyTrends.map(m => m.count))) * 180;
                        return (
                          <g key={month.month}>
                            <circle cx={x} cy={y} r="4" fill="#3b82f6" />
                            <text x={x} y="195" fontSize="10" textAnchor="middle" fill="#6b7280">{month.month}</text>
                            <text x={x} y={y - 10} fontSize="10" textAnchor="middle" fill="#6b7280">{month.count}</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </CardContent>
              </Card>

              {/* Top Affected Services */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Top Affected Services</CardTitle>
                  <CardDescription>Services with the most anomalies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topServices.map((svc) => (
                      <div key={svc.service} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">{svc.service}</p>
                          <p className="text-muted-foreground">Avg. Duration: {svc.avgDuration}</p>
                        </div>
                        <div className="text-lg font-medium">{svc.count}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Detection Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle><Settings className="mr-2 inline-block h-5 w-5" /> Detection Settings</CardTitle>
                <CardDescription>Customize thresholds and detection behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enable Auto Detection</span>
                  <Switch checked={autoDetect} onCheckedChange={setAutoDetect} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Send Notification on Anomaly</span>
                  <Switch checked={notificationToggle} onCheckedChange={setNotificationToggle} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Anomaly Threshold (%)</span>
                    <span className="text-sm">{threshold[0]}%</span>
                  </div>
                  <Slider value={threshold} onValueChange={setThreshold} max={100} step={5} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}