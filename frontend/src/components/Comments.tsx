import { useState, useEffect } from 'react'
import { Comment, getComments, createComment, deleteComment } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Comments.css'

interface CommentsProps {
  instrumentId: number
}

export default function Comments({ instrumentId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    loadComments()
  }, [instrumentId])

  const loadComments = async () => {
    try {
      const data = await getComments(instrumentId)
      setComments(data)
    } catch (err) {
      console.error('Ошибка загрузки комментариев:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setError('')
    setLoading(true)

    try {
      await createComment({
        text: newComment.trim(),
        instrumentId
      })
      setNewComment('')
      await loadComments()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка добавления комментария')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      return
    }

    try {
      await deleteComment(id)
      await loadComments()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления комментария')
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="comments-section">
      <h3>Комментарии ({comments.length})</h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="comment-form">
          {error && <div className="error-message">{error}</div>}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Оставьте свой комментарий..."
            rows={3}
            maxLength={1000}
            disabled={loading}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !newComment.trim()}>
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      ) : (
        <p className="auth-prompt">Войдите, чтобы оставить комментарий</p>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">Пока нет комментариев. Будьте первым!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.authorNickname || 'Пользователь'}</span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              <div className="comment-text">{comment.text}</div>
              {isAuthenticated && user?.userId === comment.authorId && (
                <button
                  className="btn-delete-comment"
                  onClick={() => comment.id && handleDelete(comment.id)}
                >
                  Удалить
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}




