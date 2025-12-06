import { useState, useEffect } from 'react'
import { Search, RotateCcw } from 'lucide-react'
import { FilterParams, getAllTypes, getAllBrands } from '../services/api'
import './FilterPanel.css'

interface FilterPanelProps {
  filters: FilterParams
  onFilterChange: (filters: FilterParams) => void
}

function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [types, setTypes] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    try {
      const [typesData, brandsData] = await Promise.all([
        getAllTypes(),
        getAllBrands()
      ])
      setTypes(typesData)
      setBrands(brandsData)
    } catch (error) {
      console.error('Ошибка загрузки фильтров:', error)
    }
  }

  const handleChange = (key: keyof FilterParams, value: string | number | undefined) => {
    onFilterChange({
      ...filters,
      [key]: value,
      page: 0
    })
  }

  const handleReset = () => {
    onFilterChange({
      page: 0,
      size: filters.size || 12,
      sortBy: 'id',
      sortDir: 'asc'
    })
  }

  return (
    <div className="filter-panel">
      <div className="filter-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3><Search size={20} /> Фильтры</h3>
        <span className={`filter-toggle ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>
      
      {isExpanded && (
        <div className="filter-content">
          <div className="filter-row">
            <div className="filter-group">
              <label>Название</label>
              <input
                type="text"
                placeholder="Поиск по названию..."
                value={filters.name || ''}
                onChange={(e) => handleChange('name', e.target.value || undefined)}
              />
            </div>

            <div className="filter-group">
              <label>Тип</label>
              <select
                value={filters.type || ''}
                onChange={(e) => handleChange('type', e.target.value || undefined)}
              >
                <option value="">Все типы</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Бренд</label>
              <select
                value={filters.brand || ''}
                onChange={(e) => handleChange('brand', e.target.value || undefined)}
              >
                <option value="">Все бренды</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Мин. цена (₸)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            <div className="filter-group">
              <label>Макс. цена (₸)</label>
              <input
                type="number"
                placeholder="Без ограничений"
                value={filters.maxPrice || ''}
                onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            <div className="filter-group">
              <label>Состояние</label>
              <select
                value={filters.conditionStatus || ''}
                onChange={(e) => handleChange('conditionStatus', e.target.value || undefined)}
              >
                <option value="">Все состояния</option>
                <option value="Отличное">Отличное</option>
                <option value="Хорошее">Хорошее</option>
                <option value="Удовлетворительное">Удовлетворительное</option>
                <option value="Требует ремонта">Требует ремонта</option>
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Дата покупки от</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleChange('startDate', e.target.value || undefined)}
              />
            </div>

            <div className="filter-group">
              <label>Дата покупки до</label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleChange('endDate', e.target.value || undefined)}
              />
            </div>

            <div className="filter-group">
              <label>Сортировка</label>
              <select
                value={`${filters.sortBy || 'id'}_${filters.sortDir || 'asc'}`}
                onChange={(e) => {
                  const [sortBy, sortDir] = e.target.value.split('_')
                  handleChange('sortBy', sortBy)
                  handleChange('sortDir', sortDir as 'asc' | 'desc')
                }}
              >
                <option value="id_asc">По ID (возр.)</option>
                <option value="id_desc">По ID (убыв.)</option>
                <option value="name_asc">По названию (А-Я)</option>
                <option value="name_desc">По названию (Я-А)</option>
                <option value="currentValue_asc">По цене (возр.)</option>
                <option value="currentValue_desc">По цене (убыв.)</option>
                <option value="purchaseDate_desc">По дате (новые)</option>
                <option value="purchaseDate_asc">По дате (старые)</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn btn-secondary" onClick={handleReset}>
              <RotateCcw size={18} /> Сбросить фильтры
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel
