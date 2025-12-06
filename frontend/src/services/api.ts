import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export interface Instrument {
  id?: number
  name: string
  type: string
  brand: string
  model: string
  purchasePrice: number
  currentValue: number
  purchaseDate: string
  conditionStatus?: string
  description?: string
  serialNumber?: string
  imageBase64?: string
  imageContentType?: string
  ownerId?: number
  ownerNickname?: string
}

export interface Comment {
  id?: number
  text: string
  createdAt?: string
  authorId?: number
  authorNickname?: string
  instrumentId: number
}

export interface AuthResponse {
  token: string
  username: string
  nickname: string
  userId: number
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

export interface PaginatedResponse<T> {
  content: T[]
  currentPage: number
  totalItems: number
  totalPages: number
  pageSize: number
}

export interface FilterParams {
  type?: string
  brand?: string
  name?: string
  minPrice?: number
  maxPrice?: number
  startDate?: string
  endDate?: string
  conditionStatus?: string
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export const getInstruments = async (filters?: FilterParams): Promise<PaginatedResponse<Instrument>> => {
  const params = new URLSearchParams()
  if (filters?.type) params.append('type', filters.type)
  if (filters?.brand) params.append('brand', filters.brand)
  if (filters?.name) params.append('name', filters.name)
  if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString())
  if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString())
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)
  if (filters?.conditionStatus) params.append('conditionStatus', filters.conditionStatus)
  params.append('page', (filters?.page || 0).toString())
  params.append('size', (filters?.size || 12).toString())
  params.append('sortBy', filters?.sortBy || 'id')
  params.append('sortDir', filters?.sortDir || 'asc')
  
  const response = await api.get<PaginatedResponse<Instrument>>(`/instruments?${params.toString()}`)
  return response.data
}

export const getAllTypes = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/instruments/types')
  return response.data
}

export const getAllBrands = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/instruments/brands')
  return response.data
}

export const getInstrument = async (id: number): Promise<Instrument> => {
  const response = await api.get<Instrument>(`/instruments/${id}`)
  return response.data
}

export const createInstrument = async (instrument: Omit<Instrument, 'id'>): Promise<Instrument> => {
  const response = await api.post<Instrument>('/instruments', instrument)
  return response.data
}

export const updateInstrument = async (id: number, instrument: Omit<Instrument, 'id'>): Promise<Instrument> => {
  const response = await api.put<Instrument>(`/instruments/${id}`, instrument)
  return response.data
}

export const deleteInstrument = async (id: number): Promise<void> => {
  await api.delete(`/instruments/${id}`)
}

export const getTotalValue = async (): Promise<number> => {
  const response = await api.get<{ totalValue: number }>('/instruments/statistics/total-value')
  return response.data.totalValue
}

export const getAverageValue = async (): Promise<number> => {
  const response = await api.get<{ averageValue: number }>('/instruments/statistics/average-value')
  return response.data.averageValue
}

export const getInstrumentsOld = async (type?: string, brand?: string): Promise<Instrument[]> => {
  const params = new URLSearchParams()
  if (type) params.append('type', type)
  if (brand) params.append('brand', brand)
  
  const response = await api.get<Instrument[]>(`/instruments${params.toString() ? '?' + params.toString() : ''}`)
  return response.data
}

// Auth functions
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', { username, password })
  return response.data
}

export const register = async (username: string, password: string, nickname: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', { username, password, nickname })
  return response.data
}

// Comment functions
export const getComments = async (instrumentId: number): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(`/comments/instrument/${instrumentId}`)
  return response.data
}

export const createComment = async (comment: Omit<Comment, 'id' | 'createdAt' | 'authorId' | 'authorNickname'>): Promise<Comment> => {
  const response = await api.post<Comment>('/comments', comment)
  return response.data
}

export const updateComment = async (id: number, text: string): Promise<Comment> => {
  const response = await api.put<Comment>(`/comments/${id}`, { text, instrumentId: 0 })
  return response.data
}

export const deleteComment = async (id: number): Promise<void> => {
  await api.delete(`/comments/${id}`)
}

