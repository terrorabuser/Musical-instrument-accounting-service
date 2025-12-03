import './Statistics.css'

interface StatisticsProps {
  totalValue: number
  averageValue: number
}

function Statistics({ totalValue, averageValue }: StatisticsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('kk-KZ', {
      style: 'currency',
      currency: 'KZT',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="statistics">
      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <div className="stat-label">Общая стоимость</div>
          <div className="stat-value">{formatCurrency(totalValue)}</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <div className="stat-label">Средняя стоимость</div>
          <div className="stat-value">{formatCurrency(averageValue)}</div>
        </div>
      </div>
    </div>
  )
}

export default Statistics




