import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import FilterBar from './components/FilterBar'
import KPICard from './components/KPICard'
import SummaryTable from './components/SummaryTable'
import AlertTable from './components/AlertTable'
import PerformanceChart from './components/PerformanceChart'
import StatusPieChart from './components/StatusPieChart'
import BarChart from './components/BarChart'

const localApiUrl = 'http://localhost:5000'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? localApiUrl : 'https://pulse-board-project01-1.onrender.com')
const buildApiUrl = (path) => `${apiBaseUrl}${path}`

const KPI_CONFIG = [
  {
    key: 'totalApplications',
    label: 'Applications',
    unit: 'apps',
    description: 'Distinct services monitored',
  },
  {
    key: 'averageResponseTime',
    label: 'Response Time',
    unit: 'ms',
    description: 'Average end-user latency',
    statusKey: 'responseStatus',
  },
  {
    key: 'averageCPU',
    label: 'CPU Usage',
    unit: '%',
    description: 'Average compute utilization',
    statusKey: 'cpuStatus',
  },
  {
    key: 'averageMemory',
    label: 'Memory Usage',
    unit: '%',
    description: 'Average memory consumption',
    statusKey: 'memoryStatus',
  },
]

const FALLBACK_OVERVIEW_DATA = {
  metrics: {
    totalApplications: 10,
    totalRecords: 14400,
    averageResponseTime: 360,
    averageCPU: 53,
    averageMemory: 59,
    averageAvailability: 99.7,
    averageErrorRate: 1.3,
    averageThroughput: 9000,
    totalHTTP4XX: 142000,
    totalHTTP5XX: 195000,
    p95Latency: 1260,
  },
  health: {
    cpuStatus: 'Healthy',
    memoryStatus: 'Healthy',
    responseStatus: 'Warning',
    availabilityStatus: 'Healthy',
    errorStatus: 'Warning',
  },
  alerts: [],
  applications: ['Flipkart', 'Swiggy', 'Blinkit', 'Payment Gateway', 'Order Service'],
  applicationMetrics: [
    {
      application: 'Flipkart',
      averageResponseTime: 412,
      averageCPU: 52,
      averageMemory: 58,
      averageAvailability: 99.75,
      averageErrorRate: 1.25,
      averageThroughput: 16926,
      status: 'Warning',
    },
    {
      application: 'Payment Gateway',
      averageResponseTime: 407,
      averageCPU: 53,
      averageMemory: 59,
      averageAvailability: 99.71,
      averageErrorRate: 1.37,
      averageThroughput: 5374,
      status: 'Warning',
    },
    {
      application: 'Order Service',
      averageResponseTime: 373,
      averageCPU: 53,
      averageMemory: 59,
      averageAvailability: 99.75,
      averageErrorRate: 1.31,
      averageThroughput: 7230,
      status: 'Warning',
    },
  ],
  timeSeries: [
    { label: 'T1', response: 366, cpu: 53, memory: 59, availability: 99.72, errors: 1.38 },
    { label: 'T2', response: 346, cpu: 53, memory: 59, availability: 99.76, errors: 1.23 },
    { label: 'T3', response: 370, cpu: 53, memory: 59, availability: 99.73, errors: 1.37 },
  ],
  healthChartData: [
    { name: 'Healthy', value: 0, color: '#10b981' },
    { name: 'Warning', value: 5, color: '#f59e0b' },
    { name: 'Critical', value: 0, color: '#ef4444' },
  ],
}

function App() {
  const [data, setData] = useState(FALLBACK_OVERVIEW_DATA)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [selectedApplication, setSelectedApplication] = useState('All')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [selectedEnvironment, setSelectedEnvironment] = useState('All')
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 30 Days')

  const formatUpdatedAt = (isoString) => {
    if (!isoString) return 'Unknown'
    try {
      return new Date(isoString).toLocaleString()
    } catch (error) {
      return isoString
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadOverview = async () => {
      try {
        setLoading(true)
        setError('')
        setStatusMessage('')

        const response = await fetch(
          buildApiUrl(`/api/overview?application=${encodeURIComponent(selectedApplication)}&region=${encodeURIComponent(selectedRegion)}&environment=${encodeURIComponent(selectedEnvironment)}&timeRange=${encodeURIComponent(selectedTimeRange)}`)
        )

        if (!response.ok) {
          throw new Error('Unable to load dashboard data')
        }

        const payload = await response.json()

        if (isMounted) {
          setData(payload)
          setStatusMessage('')
        }
      } catch (err) {
        if (isMounted) {
          setData(FALLBACK_OVERVIEW_DATA)
          setError(err.message || 'Something went wrong')
          setStatusMessage('Live API unavailable — showing sample dashboard data.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadOverview()

    return () => {
      isMounted = false
    }
  }, [selectedApplication, selectedRegion, selectedEnvironment, selectedTimeRange])

  const summaryRows = useMemo(() => {
    if (!data?.metrics || !data?.health) {
      return []
    }

    return [
      {
        label: 'Availability',
        value: `${data.metrics.averageAvailability}%`,
        status: data.health.availabilityStatus,
      },
      {
        label: 'Error Rate',
        value: `${data.metrics.averageErrorRate}%`,
        status: data.health.errorStatus,
      },
      {
        label: 'Throughput',
        value: `${data.metrics.averageThroughput} rpm`,
        status: 'Healthy',
      },
      {
        label: 'P95 Latency',
        value: `${data.metrics.p95Latency} ms`,
        status: data.health.responseStatus,
      },
      {
        label: 'HTTP 4xx',
        value: data.metrics.totalHTTP4XX.toLocaleString(),
        status: 'Healthy',
      },
      {
        label: 'HTTP 5xx',
        value: data.metrics.totalHTTP5XX.toLocaleString(),
        status: data.health.errorStatus,
      },
    ]
  }, [data])

  const kpiCards = useMemo(() => {
    if (!data?.metrics || !data?.health) {
      return []
    }

    return KPI_CONFIG.map((item) => ({
      ...item,
      value: data.metrics[item.key],
      status: item.statusKey ? data.health[item.statusKey] : 'Healthy',
    }))
  }, [data])

  const chartData = useMemo(() => {
    if (!data?.applicationMetrics?.length) {
      return []
    }

    return data.applicationMetrics.slice(0, 8).map((application) => ({
      application: application.application,
      response: application.averageResponseTime,
      cpu: application.averageCPU,
      memory: application.averageMemory,
      availability: application.averageAvailability,
      errorRate: application.averageErrorRate,
      throughput: application.averageThroughput,
    }))
  }, [data])

  const timeSeriesData = useMemo(() => {
    if (!data?.timeSeries?.length) {
      return []
    }

    return data.timeSeries
  }, [data])

  const activeAlerts = useMemo(() => {
    if (!data?.alerts?.length) return []

    const severityPriority = {
      Critical: 0,
      Warning: 1,
      Unknown: 2,
    }

    return [...data.alerts].sort(
      (a, b) => (severityPriority[a.severity] ?? 3) - (severityPriority[b.severity] ?? 3)
    )
  }, [data])

  const healthChartData = useMemo(() => {
    if (!data?.healthChartData?.length) {
      return []
    }

    return data.healthChartData.map((item) => ({
      ...item,
      value: Number(item.value) || 0,
    }))
  }, [data])

  return (
    <div className="app-shell">
      <Navbar />

      <main className="dashboard">
        <FilterBar
          applications={data?.applications || []}
          regions={data?.regions || []}
          environments={data?.environments || []}
          selectedApplication={selectedApplication}
          selectedRegion={selectedRegion}
          selectedEnvironment={selectedEnvironment}
          selectedTimeRange={selectedTimeRange}
          onApplicationChange={setSelectedApplication}
          onRegionChange={setSelectedRegion}
          onEnvironmentChange={setSelectedEnvironment}
          onTimeRangeChange={setSelectedTimeRange}
        />

        <section className="hero-card">
          <div>
            <h1>PulseBoard APM</h1>
            <p className="hero-copy">Track service health & performance trends</p>
            {statusMessage ? <p className="status-banner">{statusMessage}</p> : null}
          </div>
          <div className="hero-stats">
            <div>
              <span className="stat-label">Total Records</span>
              <strong>{data?.metrics?.totalRecords?.toLocaleString() || '—'}</strong>
            </div>
            <div>
              <span className="stat-label">Current Focus</span>
              <strong>
                {selectedRegion !== 'All' && selectedApplication !== 'All'
                  ? `${selectedApplication} • ${selectedRegion}`
                  : selectedRegion !== 'All'
                  ? selectedRegion
                  : selectedApplication !== 'All'
                  ? selectedApplication
                  : 'All Applications'}
              </strong>
            </div>
            <div>
              <span className="stat-label">Dashboard Timeframe</span>
              <strong>{selectedTimeRange}</strong>
              <p className="muted">Updated {formatUpdatedAt(data?.lastUpdated)}</p>
            </div>
          </div>
        </section>

        <section className="insight-strip">
          <div className="insight-card">
            <span>Availability</span>
            <strong>{data?.metrics?.averageAvailability?.toFixed(2) ?? '—'}%</strong>
            <p>{data?.health?.availabilityStatus || 'Healthy'} delivery across services</p>
          </div>
          <div className="insight-card">
            <span>Latency</span>
            <strong>{data?.metrics?.averageResponseTime ?? '—'} ms</strong>
            <p>{data?.health?.responseStatus || 'Healthy'} response profile</p>
          </div>
          <div className="insight-card">
            <span>Critical Alerts</span>
            <strong>{data?.alerts?.filter((alert) => alert.severity === 'Critical').length ?? 0}</strong>
            <p>Critical incidents requiring immediate action</p>
          </div>
        </section>

        <section className="kpi-grid">
          {loading && <div className="panel state-panel">Loading dashboard…</div>}
          {error && <div className="panel state-panel error">{error}</div>}

          {!loading && !error &&
            kpiCards.map((card) => (
              <KPICard
                key={card.key}
                label={card.label}
                value={card.value}
                unit={card.unit}
                description={card.description}
                status={card.status}
              />
            ))}
        </section>

        <section className="chart-grid two-up">
          <PerformanceChart data={chartData} timeSeries={timeSeriesData} />
          <BarChart data={chartData} />
        </section>

        <section className="content-grid">
          <SummaryTable rows={summaryRows} />
          <AlertTable alerts={activeAlerts} />
        </section>
      </main>
    </div>
  )
}

export default App
