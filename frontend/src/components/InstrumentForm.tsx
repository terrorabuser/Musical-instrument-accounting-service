import { useState, useEffect } from 'react'
import { Instrument } from '../services/api'
import './InstrumentForm.css'

interface InstrumentFormProps {
  instrument: Instrument | null
  onSubmit: (instrument: Omit<Instrument, 'id'>) => void
  onCancel: () => void
}

interface FieldErrors {
  [key: string]: string
}

interface FieldTouched {
  [key: string]: boolean
}

function InstrumentForm({ instrument, onSubmit, onCancel }: InstrumentFormProps) {
  const [formData, setFormData] = useState<Omit<Instrument, 'id'>>({
    name: '',
    type: '',
    brand: '',
    model: '',
    purchasePrice: 0,
    currentValue: 0,
    purchaseDate: '',
    conditionStatus: '',
    description: '',
    serialNumber: '',
    imageBase64: undefined,
    imageContentType: undefined,
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<FieldTouched>({})

  useEffect(() => {
    if (instrument) {
      setFormData({
        name: instrument.name || '',
        type: instrument.type || '',
        brand: instrument.brand || '',
        model: instrument.model || '',
        purchasePrice: instrument.purchasePrice || 0,
        currentValue: instrument.currentValue || 0,
        purchaseDate: instrument.purchaseDate || '',
        conditionStatus: instrument.conditionStatus || '',
        description: instrument.description || '',
        serialNumber: instrument.serialNumber || '',
        imageBase64: instrument.imageBase64,
        imageContentType: instrument.imageContentType,
      })
      if (instrument.imageBase64) {
        setImagePreview(instrument.imageBase64)
      }
      // Помечаем все поля как touched для существующего инструмента
      const allFields = ['name', 'type', 'brand', 'model', 'purchasePrice', 'currentValue', 'purchaseDate']
      const newTouched: FieldTouched = {}
      allFields.forEach(field => {
        newTouched[field] = true
      })
      setTouched(newTouched)
      setErrors({})
    } else {
      // Сброс формы при создании нового инструмента
      setFormData({
        name: '',
        type: '',
        brand: '',
        model: '',
        purchasePrice: 0,
        currentValue: 0,
        purchaseDate: '',
        conditionStatus: '',
        description: '',
        serialNumber: '',
        imageBase64: undefined,
        imageContentType: undefined,
      })
      setImagePreview(null)
      setErrors({})
      setTouched({})
    }
  }, [instrument])

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'name':
        if (!value || value.trim().length === 0) {
          return 'Название обязательно для заполнения'
        }
        if (value.trim().length < 2) {
          return 'Название должно содержать минимум 2 символа'
        }
        if (value.length > 255) {
          return 'Название не должно превышать 255 символов'
        }
        return ''
      
      case 'type':
        if (!value || value.trim().length === 0) {
          return 'Тип обязателен для заполнения'
        }
        if (value.trim().length < 2) {
          return 'Тип должен содержать минимум 2 символа'
        }
        return ''
      
      case 'brand':
        if (!value || value.trim().length === 0) {
          return 'Бренд обязателен для заполнения'
        }
        if (value.trim().length < 2) {
          return 'Бренд должен содержать минимум 2 символа'
        }
        return ''
      
      case 'model':
        if (!value || value.trim().length === 0) {
          return 'Модель обязательна для заполнения'
        }
        if (value.trim().length < 2) {
          return 'Модель должна содержать минимум 2 символа'
        }
        return ''
      
      case 'purchasePrice':
        const price = parseFloat(value)
        if (isNaN(price) || price <= 0) {
          return 'Цена покупки должна быть больше 0'
        }
        if (price > 99999999.99) {
          return 'Цена покупки не должна превышать 99 999 999.99 ₸'
        }
        return ''
      
      case 'currentValue':
        const currentPrice = parseFloat(value)
        if (isNaN(currentPrice) || currentPrice < 0) {
          return 'Текущая стоимость должна быть больше или равна 0'
        }
        if (currentPrice > 99999999.99) {
          return 'Текущая стоимость не должна превышать 99 999 999.99 ₸'
        }
        return ''
      
      case 'purchaseDate':
        if (!value) {
          return 'Дата покупки обязательна для заполнения'
        }
        const date = new Date(value)
        const today = new Date()
        today.setHours(23, 59, 59, 999)
        if (date > today) {
          return 'Дата покупки не может быть в будущем'
        }
        return ''
      
      case 'serialNumber':
        if (value && value.trim().length > 0 && value.trim().length < 3) {
          return 'Серийный номер должен содержать минимум 3 символа'
        }
        return ''
      
      case 'description':
        if (value && value.length > 1000) {
          return 'Описание не должно превышать 1000 символов'
        }
        return ''
      
      default:
        return ''
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FieldErrors = {}
    const fieldsToValidate = ['name', 'type', 'brand', 'model', 'purchasePrice', 'currentValue', 'purchaseDate', 'serialNumber', 'description']
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData])
      if (error) {
        newErrors[field] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newValue = name === 'purchasePrice' || name === 'currentValue' ? parseFloat(value) || 0 : value
    
    setFormData(prev => ({ ...prev, [name]: newValue }))
    
    // Валидация при изменении поля
    if (touched[name]) {
      const error = validateField(name, newValue)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Проверка типа файла
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Разрешены только изображения формата JPEG, PNG или GIF'
        }))
        e.target.value = ''
        return
      }
      
      // Проверка размера файла
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Размер изображения не должен превышать 5MB'
        }))
        e.target.value = ''
        return
      }

      // Очистка ошибки при успешной загрузке
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.image
        return newErrors
      })

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setFormData(prev => ({
          ...prev,
          imageBase64: result,
          imageContentType: file.type,
        }))
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageBase64: undefined,
      imageContentType: undefined,
    }))
    setImagePreview(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Помечаем все поля как touched для показа всех ошибок
    const allFields = ['name', 'type', 'brand', 'model', 'purchasePrice', 'currentValue', 'purchaseDate']
    const newTouched: FieldTouched = {}
    allFields.forEach(field => {
      newTouched[field] = true
    })
    setTouched(newTouched)
    
    // Валидация формы
    if (!validateForm()) {
      return
    }

    onSubmit(formData)
  }

  const getFieldValidationClass = (fieldName: string): string => {
    if (!touched[fieldName]) return ''
    if (errors[fieldName]) return 'error'
    if (formData[fieldName as keyof typeof formData]) {
      const value = formData[fieldName as keyof typeof formData]
      if (typeof value === 'string' && value.trim() !== '' || typeof value === 'number' && value > 0 || fieldName === 'currentValue' && value >= 0) {
        return 'valid'
      }
    }
    return ''
  }

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>{instrument ? 'Редактировать инструмент' : 'Добавить инструмент'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Название *</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldValidationClass('name')}
                  required
                />
                {touched.name && !errors.name && formData.name && (
                  <span className="validation-icon valid-icon">✓</span>
                )}
                {touched.name && errors.name && (
                  <span className="validation-icon error-icon">✕</span>
                )}
              </div>
              {touched.name && errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="type">Тип *</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldValidationClass('type')}
                  required
                />
                {touched.type && !errors.type && formData.type && (
                  <span className="validation-icon valid-icon">✓</span>
                )}
                {touched.type && errors.type && (
                  <span className="validation-icon error-icon">✕</span>
                )}
              </div>
              {touched.type && errors.type && (
                <span className="error-message">{errors.type}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="brand">Бренд *</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldValidationClass('brand')}
                  required
                />
                {touched.brand && !errors.brand && formData.brand && (
                  <span className="validation-icon valid-icon">✓</span>
                )}
                {touched.brand && errors.brand && (
                  <span className="validation-icon error-icon">✕</span>
                )}
              </div>
              {touched.brand && errors.brand && (
                <span className="error-message">{errors.brand}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="model">Модель *</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldValidationClass('model')}
                  required
                />
                {touched.model && !errors.model && formData.model && (
                  <span className="validation-icon valid-icon">✓</span>
                )}
                {touched.model && errors.model && (
                  <span className="validation-icon error-icon">✕</span>
                )}
              </div>
              {touched.model && errors.model && (
                <span className="error-message">{errors.model}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="purchasePrice">Цена покупки (₸) *</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0.01"
                  step="0.01"
                  max="99999999.99"
                  className={getFieldValidationClass('purchasePrice')}
                  required
                />
                {touched.purchasePrice && !errors.purchasePrice && formData.purchasePrice > 0 && (
                  <span className="validation-icon valid-icon">✓</span>
                )}
                {touched.purchasePrice && errors.purchasePrice && (
                  <span className="validation-icon error-icon">✕</span>
                )}
              </div>
              {touched.purchasePrice && errors.purchasePrice && (
                <span className="error-message">{errors.purchasePrice}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="currentValue">Текущая стоимость (₸) *</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="currentValue"
                  name="currentValue"
                  value={formData.currentValue || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0"
                  step="0.01"
                  max="99999999.99"
                  className={getFieldValidationClass('currentValue')}
                  required
                />
                {touched.currentValue && !errors.currentValue && formData.currentValue >= 0 && (
                  <span className="validation-icon valid-icon">✓</span>
                )}
                {touched.currentValue && errors.currentValue && (
                  <span className="validation-icon error-icon">✕</span>
                )}
              </div>
              {touched.currentValue && errors.currentValue && (
                <span className="error-message">{errors.currentValue}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="purchaseDate">Дата покупки *</label>
              <div className="input-wrapper">
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  max={new Date().toISOString().split('T')[0]}
                  className={getFieldValidationClass('purchaseDate')}
                  required
                />
                {touched.purchaseDate && !errors.purchaseDate && formData.purchaseDate && (
                  <span className="validation-icon valid-icon">✓</span>
                )}
                {touched.purchaseDate && errors.purchaseDate && (
                  <span className="validation-icon error-icon">✕</span>
                )}
              </div>
              {touched.purchaseDate && errors.purchaseDate && (
                <span className="error-message">{errors.purchaseDate}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="conditionStatus">Состояние</label>
              <div className="input-wrapper">
                <select
                  id="conditionStatus"
                  name="conditionStatus"
                  value={formData.conditionStatus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={formData.conditionStatus ? 'valid' : ''}
                >
                  <option value="">Выберите состояние</option>
                  <option value="Отличное">Отличное</option>
                  <option value="Хорошее">Хорошее</option>
                  <option value="Удовлетворительное">Удовлетворительное</option>
                  <option value="Требует ремонта">Требует ремонта</option>
                </select>
                {formData.conditionStatus && (
                  <span className="validation-icon valid-icon">✓</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="serialNumber">Серийный номер</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldValidationClass('serialNumber')}
                />
                {touched.serialNumber && !errors.serialNumber && formData.serialNumber && formData.serialNumber.length >= 3 && (
                  <span className="validation-icon valid-icon">✓</span>
                )}
                {touched.serialNumber && errors.serialNumber && (
                  <span className="validation-icon error-icon">✕</span>
                )}
              </div>
              {touched.serialNumber && errors.serialNumber && (
                <span className="error-message">{errors.serialNumber}</span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Описание</label>
              <div className="input-wrapper">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  maxLength={1000}
                  className={getFieldValidationClass('description')}
                />
                {touched.description && !errors.description && formData.description && (
                  <span className="validation-icon valid-icon">✓</span>
                )}
                {touched.description && errors.description && (
                  <span className="validation-icon error-icon">✕</span>
                )}
              </div>
              <div className="field-footer">
                {touched.description && errors.description && (
                  <span className="error-message">{errors.description}</span>
                )}
                {formData.description && (
                  <span className="char-count">{formData.description.length}/1000</span>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="image">Фотография</label>
              <div className="input-wrapper">
                <input
                  type="file"
                  id="image"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageChange}
                  className={errors.image ? 'error' : imagePreview ? 'valid' : ''}
                />
                {imagePreview && !errors.image && (
                  <span className="validation-icon valid-icon">✓</span>
                )}
                {errors.image && (
                  <span className="validation-icon error-icon">✕</span>
                )}
              </div>
              {errors.image && (
                <span className="error-message">{errors.image}</span>
              )}
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button type="button" className="btn btn-danger" onClick={handleRemoveImage}>
                    Удалить изображение
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {instrument ? 'Сохранить изменения' : 'Создать'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InstrumentForm




