import { useState, useEffect } from 'react'
import InstrumentList from './components/InstrumentList'
import InstrumentForm from './components/InstrumentForm'
import Statistics from './components/Statistics'
import FilterPanel from './components/FilterPanel'
import Pagination from './components/Pagination'
import Comments from './components/Comments'
import Login from './components/Login'
import Register from './components/Register'
import { useAuth } from './contexts/AuthContext'
import { Instrument, FilterParams, PaginatedResponse, getInstruments, createInstrument, updateInstrument, deleteInstrument, getTotalValue, getAverageValue } from './services/api'
import './App.css'

function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, user, logout } = useAuth()
  const [totalValue, setTotalValue] = useState<number>(0)
  const [averageValue, setAverageValue] = useState<number>(0)
  const [filters, setFilters] = useState<FilterParams>({
    page: 0,
    size: 12,
    sortBy: 'id',
    sortDir: 'asc'
  })
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 12
  })

  useEffect(() => {
    loadData()
    loadStatistics()
  }, [filters])

  const loadData = async () => {
    try {
      setLoading(true)
      const response: PaginatedResponse<Instrument> = await getInstruments(filters)
      setInstruments(response.content)
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        pageSize: response.pageSize
      })
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
      alert('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const [total, average] = await Promise.all([
        getTotalValue(),
        getAverageValue()
      ])
      setTotalValue(total)
      setAverageValue(average)
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error)
    }
  }

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  const handleCreate = () => {
    if (!isAuthenticated) {
      setShowLogin(true)
      return
    }
    setSelectedInstrument(null)
    setShowForm(true)
    setShowDetails(false)
  }

  const handleEdit = (instrument: Instrument) => {
    setSelectedInstrument(instrument)
    setShowForm(true)
    setShowDetails(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот инструмент?')) {
      return
    }
    try {
      await deleteInstrument(id)
      await loadData()
    } catch (error) {
      console.error('Ошибка удаления:', error)
      alert('Ошибка удаления инструмента')
    }
  }

  const handleSubmit = async (instrument: Omit<Instrument, 'id'>) => {
    try {
      if (selectedInstrument) {
        await updateInstrument(selectedInstrument.id, instrument)
      } else {
        await createInstrument(instrument)
      }
      setShowForm(false)
      setSelectedInstrument(null)
      await loadData()
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      alert('Ошибка сохранения инструмента')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedInstrument(null)
    setShowDetails(false)
  }

  const handleCardClick = (instrument: Instrument) => {
    setSelectedInstrument(instrument)
    setShowDetails(true)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
  }

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎵 Система учета музыкальных инструментов</h1>
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <span className="user-info">👤 {user?.nickname}</span>
              <button className="btn btn-secondary" onClick={logout}>
                Выйти
              </button>
              <button className="btn btn-primary" onClick={handleCreate}>
                + Добавить инструмент
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => setShowLogin(true)}>
                Войти
              </button>
              <button className="btn btn-primary" onClick={() => setShowRegister(true)}>
                Регистрация
              </button>
            </>
          )}
        </div>
      </header>

      <main className="app-main">
        <Statistics totalValue={totalValue} averageValue={averageValue} />

        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

        {showForm && (
          <InstrumentForm
            instrument={selectedInstrument}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : (
          <>
            <InstrumentList
              instruments={instruments}
              onCardClick={handleCardClick}
            />
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {showDetails && selectedInstrument && (
          <div className="modal-overlay" onClick={handleCloseDetails}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-image">
                {selectedInstrument.imageBase64 && (
                  <img src={selectedInstrument.imageBase64} alt={selectedInstrument.name} />
                )}
              </div>
              <div className="modal-body">
                <div className="modal-header">
                  <h2>{selectedInstrument.name}</h2>
                  <div className="modal-actions">
                    {isAuthenticated && user?.userId === selectedInstrument.ownerId && (
                      <>
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            handleEdit(selectedInstrument)
                            setShowDetails(false)
                          }}
                        >
                          ✏️ Редактировать
                        </button>
                        {selectedInstrument.id && (
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              handleDelete(selectedInstrument.id!)
                              setShowDetails(false)
                            }}
                          >
                            🗑️ Удалить
                          </button>
                        )}
                      </>
                    )}
                    <button className="btn btn-secondary" onClick={handleCloseDetails}>
                      ✕ Закрыть
                    </button>
                  </div>
                </div>

                <div className="modal-details">
                  <div><strong>Тип:</strong> {selectedInstrument.type}</div>
                  <div><strong>Бренд:</strong> {selectedInstrument.brand}</div>
                  <div><strong>Модель:</strong> {selectedInstrument.model}</div>
                  {selectedInstrument.serialNumber && (
                    <div><strong>Серийный номер:</strong> {selectedInstrument.serialNumber}</div>
                  )}
                  <div><strong>Цена покупки:</strong> {formatCurrency(selectedInstrument.purchasePrice)}</div>
                  <div><strong>Текущая стоимость:</strong> {formatCurrency(selectedInstrument.currentValue)}</div>
                  <div><strong>Дата покупки:</strong> {formatDate(selectedInstrument.purchaseDate)}</div>
                  {selectedInstrument.conditionStatus && (
                    <div><strong>Состояние:</strong> {selectedInstrument.conditionStatus}</div>
                  )}
                  {selectedInstrument.description && (
                    <div><strong>Описание:</strong> {selectedInstrument.description}</div>
                  )}
                  {selectedInstrument.ownerNickname && (
                    <div><strong>Владелец:</strong> {selectedInstrument.ownerNickname}</div>
                  )}
                </div>
                
                <Comments instrumentId={selectedInstrument.id!} />
              </div>
            </div>
          </div>
        )}

        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            onSwitchToRegister={() => {
              setShowLogin(false)
              setShowRegister(true)
            }}
          />
        )}

        {showRegister && (
          <Register
            onClose={() => setShowRegister(false)}
            onSwitchToLogin={() => {
              setShowRegister(false)
              setShowLogin(true)
            }}
          />
        )}
      </main>
    </div>
  )
}

export default App




