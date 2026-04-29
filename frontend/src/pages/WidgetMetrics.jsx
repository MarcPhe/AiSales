import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/WidgetMetrics.css';

export default function WidgetMetrics({ user, onBack }) {
  const [metrics, setMetrics] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      const [metricsRes, timeseriesRes] = await Promise.all([
        axios.get('/api/widget-metrics', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/widget-metrics-timeseries', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setMetrics(metricsRes.data);
      setTimeseries(timeseriesRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, unit = '', icon = '📊', trend = null }) => (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <p className="metric-label">{title}</p>
        <div className="metric-value">
          <span>{value}</span>
          {unit && <span className="metric-unit">{unit}</span>}
        </div>
        {trend && (
          <span className={`trend ${trend > 0 ? 'positive' : 'neutral'}`}>
            {trend > 0 ? '↑' : '→'} {Math.abs(trend)}% from last period
          </span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="widget-metrics-page">
        <div className="metrics-header">
          <div className="metrics-header-top">
            <button onClick={onBack} className="back-btn">
              ← Back
            </button>
          </div>
          <h2>Widget Analytics</h2>
        </div>
        <div className="loading">Loading metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="widget-metrics-page">
        <div className="metrics-header">
          <div className="metrics-header-top">
            <button onClick={onBack} className="back-btn">
              ← Back
            </button>
          </div>
          <h2>Widget Analytics</h2>
        </div>
        <div className="error-message">{error}</div>
        <button onClick={fetchMetrics} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="widget-metrics-page">
      <div className="metrics-header">
        <div className="metrics-header-top">
          <button onClick={onBack} className="back-btn">
            ← Back
          </button>
          <button onClick={fetchMetrics} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
        <h2>Widget Analytics</h2>
        <p className="metrics-subtitle">
          Track how your embedded chatbot is performing on external websites
        </p>
      </div>

      {/* Main Metrics Grid */}
      <div className="metrics-grid">
        <MetricCard
          icon="👥"
          title="Visitors (Last 7 Days)"
          value={metrics?.visitorsLast7Days || 0}
          unit="unique visitors"
        />
        <MetricCard
          icon="💬"
          title="Total Conversations"
          value={metrics?.totalConversations || 0}
          unit="all-time"
        />
        <MetricCard
          icon="🤖"
          title="Avg AI Messages/Conversation"
          value={metrics?.avgAiMessagesPerConversation || 0}
          unit="messages"
        />
        <MetricCard
          icon="📈"
          title="AI Response Percentage"
          value={metrics?.aiResponsePercentage || 0}
          unit="%"
        />
        <MetricCard
          icon="💌"
          title="Messages (Last 30 Days)"
          value={metrics?.messagesLast30Days || 0}
          unit="messages"
        />
        <MetricCard
          icon="⚡"
          title="Messages (Last 7 Days)"
          value={metrics?.messagesLast7Days || 0}
          unit="messages"
        />
        <MetricCard
          icon="📊"
          title="Total All-Time Messages"
          value={metrics?.totalAllMessages || 0}
          unit="messages"
        />
        <MetricCard
          icon="🔥"
          title="Engagement Rate"
          value={metrics?.engagementRate || 0}
          unit="%"
        />
      </div>

      {/* 7-Day Activity Chart */}
      {timeseries && timeseries.length > 0 && (
        <div className="chart-section">
          <h3>7-Day Activity</h3>
          <div className="chart-container">
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-box" style={{ backgroundColor: '#667eea' }}></span>
                <span>Conversations</span>
              </div>
              <div className="legend-item">
                <span className="legend-box" style={{ backgroundColor: '#764ba2' }}></span>
                <span>Messages</span>
              </div>
              <div className="legend-item">
                <span className="legend-box" style={{ backgroundColor: '#44a849' }}></span>
                <span>AI Messages</span>
              </div>
            </div>

            <div className="bar-chart">
              {timeseries.map((day, idx) => {
                const maxValue = Math.max(
                  ...timeseries.map((d) =>
                    Math.max(d.conversations, d.messages, d.aiMessages)
                  )
                );

                return (
                  <div key={idx} className="bar-group">
                    <div className="bar-set">
                      <div
                        className="bar conversations"
                        style={{
                          height: `${
                            maxValue > 0 ? (day.conversations / maxValue) * 100 : 0
                          }%`
                        }}
                        title={`${day.conversations} conversations`}
                      ></div>
                      <div
                        className="bar messages"
                        style={{
                          height: `${maxValue > 0 ? (day.messages / maxValue) * 100 : 0}%`
                        }}
                        title={`${day.messages} messages`}
                      ></div>
                      <div
                        className="bar ai-messages"
                        style={{
                          height: `${maxValue > 0 ? (day.aiMessages / maxValue) * 100 : 0}%`
                        }}
                        title={`${day.aiMessages} AI messages`}
                      ></div>
                    </div>
                    <label className="bar-label">{day.date.slice(-2)}</label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="summary-section">
        <h3>Quick Summary</h3>
        <div className="summary-stats">
          <div className="summary-stat">
            <strong>Monthly Messages Rate:</strong>
            <span>{metrics?.messagesPerMonth || 0} messages/month</span>
          </div>
          <div className="summary-stat">
            <strong>Messages This Week:</strong>
            <span>{metrics?.messagesLast7Days || 0} messages</span>
          </div>
          <div className="summary-stat">
            <strong>Conversation to Visitor Ratio:</strong>
            <span>
              {metrics?.totalConversations > 0 && metrics?.visitorsLast7Days > 0
                ? (metrics.totalConversations / metrics.visitorsLast7Days).toFixed(2)
                : '0'}{' '}
              conversations per visitor
            </span>
          </div>
          <div className="summary-stat">
            <strong>AI Messages Distribution:</strong>
            <span>
              {Math.round(
                (metrics?.totalAllMessages - metrics?.totalAllMessages * (1 - metrics?.aiResponsePercentage / 100)) || 0
              )}{' '}
              AI messages out of {metrics?.totalAllMessages || 0} total
            </span>
          </div>
        </div>
      </div>

      {/* No Data Message */}
      {(!metrics ||
        (metrics.visitorsLast7Days === 0 && metrics.totalConversations === 0)) && (
        <div className="no-data-message">
          <p>📭 No widget data yet</p>
          <p>
            Once you embed the chat widget on your website and visitors start using it, their
            conversations will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
