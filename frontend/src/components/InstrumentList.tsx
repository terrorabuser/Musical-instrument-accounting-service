import { Music } from 'lucide-react'
import { Instrument } from '../services/api'
import './InstrumentList.css'

interface InstrumentListProps {
  instruments: Instrument[]
  onCardClick: (instrument: Instrument) => void
}

function InstrumentList({ instruments, onCardClick }: InstrumentListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('kk-KZ', {
      style: 'currency',
      currency: 'KZT',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  if (instruments.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Music size={64} />
        </div>
        <h2>Нет инструментов</h2>
        <p>Добавьте первый музыкальный инструмент в систему</p>
      </div>
    )
  }

  return (
    <div className="instrument-list">
      {instruments.map((instrument) => (
        <div
          key={instrument.id}
          className="instrument-card"
          onClick={() => onCardClick(instrument)}
        >
          {instrument.imageBase64 && (
            <div className="instrument-image">
              <img src={instrument.imageBase64} alt={instrument.name} />
            </div>
          )}
          <div className="instrument-content">
            <div className="instrument-header">
              <h3>{instrument.name}</h3>
            </div>
            <div className="instrument-details">
              <div className="detail-row">
                <span className="detail-label">Тип:</span>
                <span className="detail-value">{instrument.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Бренд:</span>
                <span className="detail-value">{instrument.brand}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Модель:</span>
                <span className="detail-value">{instrument.model}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Цена покупки:</span>
                <span className="detail-value price">{formatCurrency(instrument.purchasePrice)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Текущая стоимость:</span>
                <span className="detail-value price current">{formatCurrency(instrument.currentValue)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Дата покупки:</span>
                <span className="detail-value">{formatDate(instrument.purchaseDate)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default InstrumentList
