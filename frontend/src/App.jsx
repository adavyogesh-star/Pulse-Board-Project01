import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import FilterBar from './components/FilterBar'
import KPICard from './components/KPICard'
import SummaryTable from './components/SummaryTable'
import AlertTable from './components/AlertTable'
import PerformanceChart from './components/PerformanceChart'
import StatusPieChart from './components/StatusPieChart'

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
  alerts: [
    {
      severity: 'Warning',
      metric: 'Error Rate',
      message: 'Error rate has exceeded the acceptable threshold.',
    },
  ],
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
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 30 Days')

  useEffect(() => {
    let isMounted = true

    const loadOverview = async () => {
      try {
        setLoading(true)
        setError('')
        setStatusMessage('')

        const response = await fetch(`/api/overview?application=${encodeURIComponent(selectedApplication)}&timeRange=${encodeURIComponent(selectedTimeRange)}`)

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
  }, [selectedApplication, selectedTimeRange])

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
          selectedApplication={selectedApplication}
          selectedTimeRange={selectedTimeRange}
          onApplicationChange={setSelectedApplication}
          onTimeRangeChange={setSelectedTimeRange}
        />

        <section className="hero-card">
          <div>
            <p className="eyebrow">Live monitoring overview</p>
            <h1>PulseBoard APM</h1>
            <p className="hero-copy">
              Track service health, performance trends, and active incidents with enterprise-grade visibility.
            </p>
            {statusMessage ? <p className="status-banner">{statusMessage}</p> : null}
          </div>
          <div className="hero-stats">
            <div>
              <span className="stat-label">Total Records</span>
              <strong>{data?.metrics?.totalRecords?.toLocaleString() || '—'}</strong>
            </div>
            <div>
              <span className="stat-label">Current Focus</span>
              <strong>{selectedApplication}</strong>
            </div>
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

        <section className="chart-grid">
          <PerformanceChart data={chartData} timeSeries={timeSeriesData} />
          <StatusPieChart data={healthChartData} />
        </section>

        <section className="content-grid">
          <SummaryTable rows={summaryRows} />
          <AlertTable alerts={data?.alerts || []} />
        </section>
      </main>
    </div>
  )
}

export default App
