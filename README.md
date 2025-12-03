# Система учета музыкальных инструментов на JAVA

Полнофункциональное веб-приложение для учета и оценки стоимости музыкальных инструментов.

## Структура проекта

```
coursevibe/
├── backend/          # Java Spring Boot приложение
├── frontend/         # React TypeScript приложение
└── docker-compose.yml
```

## Технологии

### Backend
- Java 17
- Spring Boot 3.2.0
- PostgreSQL 15
- Flyway (миграции БД)
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- Axios
- Nginx (для production)

## Запуск проекта

### Требования
- Docker и Docker Compose

### Команды

1. Запуск всех сервисов:
```bash
docker-compose up --build
```

2. Остановка сервисов:
```bash
docker-compose down
```

3. Остановка с удалением volumes (полная очистка БД):
```bash
docker-compose down -v
```

## Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/instruments
- **PostgreSQL**: localhost:5432

## API Документация

Полная документация API находится в файле `API_DOCUMENTATION.md`

## Основные функции

- ✅ Создание, редактирование и удаление инструментов
- ✅ Загрузка фотографий инструментов
- ✅ Фильтрация по типу и бренду
- ✅ Статистика (общая и средняя стоимость)
- ✅ Красивый современный интерфейс
- ✅ Адаптивный дизайн

## Разработка

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Структура базы данных

База данных создается автоматически через Flyway миграции:
- V1: Создание таблицы musical_instruments
- V2: Заполнение начальными данными
- V3: Добавление полей для изображений








