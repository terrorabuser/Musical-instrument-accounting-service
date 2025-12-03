# API Документация - Система учета музыкальных инструментов

## Базовый URL
```
http://localhost:8080/api/instruments
```

## Формат данных

Все запросы и ответы используют формат JSON.

### Структура MusicalInstrumentDTO

```json
{
  "id": 1,
  "name": "Fender Stratocaster",
  "type": "Гитара",
  "brand": "Fender",
  "model": "Stratocaster Standard",
  "purchasePrice": 45000.00,
  "currentValue": 42000.00,
  "purchaseDate": "2022-03-15",
  "conditionStatus": "Отличное",
  "description": "Классическая электрогитара, цвет sunburst",
  "serialNumber": "FND-STR-2022-001",
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
  "imageContentType": "image/jpeg"
}
```

### Обязательные поля при создании:
- `name` (String, не пустое)
- `type` (String, не пустое)
- `brand` (String, не пустое)
- `model` (String, не пустое)
- `purchasePrice` (BigDecimal, > 0)
- `currentValue` (BigDecimal, >= 0)
- `purchaseDate` (LocalDate, формат: YYYY-MM-DD)

### Опциональные поля:
- `conditionStatus` (String)
- `description` (String, до 1000 символов)
- `serialNumber` (String, уникальное значение)
- `imageBase64` (String) - Изображение в формате base64 с префиксом data URI (например: "data:image/jpeg;base64,...")
- `imageContentType` (String) - MIME тип изображения (например: "image/jpeg", "image/png", "image/gif")

---

## Эндпоинты

### 1. Создание нового инструмента

**POST** `/api/instruments`

Создает новый музыкальный инструмент в системе.

#### Запрос:
```http
POST /api/instruments
Content-Type: application/json

{
  "name": "Fender Stratocaster",
  "type": "Гитара",
  "brand": "Fender",
  "model": "Stratocaster Standard",
  "purchasePrice": 45000.00,
  "currentValue": 42000.00,
  "purchaseDate": "2022-03-15",
  "conditionStatus": "Отличное",
  "description": "Классическая электрогитара, цвет sunburst",
  "serialNumber": "FND-STR-2022-001",
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
  "imageContentType": "image/jpeg"
}
```

**Примечание по изображениям:**
- Изображение передается в формате base64 с префиксом data URI
- Поддерживаемые форматы: JPEG, PNG, GIF
- Рекомендуемый максимальный размер: 5MB
- Формат: `data:image/{тип};base64,{base64_данные}`
- Если изображение не указано, поле можно не передавать или передать `null`

#### Успешный ответ (201 Created):
```json
{
  "id": 1,
  "name": "Fender Stratocaster",
  "type": "Гитара",
  "brand": "Fender",
  "model": "Stratocaster Standard",
  "purchasePrice": 45000.00,
  "currentValue": 42000.00,
  "purchaseDate": "2022-03-15",
  "conditionStatus": "Отличное",
  "description": "Классическая электрогитара, цвет sunburst",
  "serialNumber": "FND-STR-2022-001",
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
  "imageContentType": "image/jpeg"
}
```

#### Ошибки:
- **400 Bad Request** - Ошибки валидации или дублирующийся серийный номер
```json
{
  "name": "Name is required",
  "purchasePrice": "Purchase price must be greater than 0"
}
```

#### Пример с curl:
```bash
curl -X POST http://localhost:8080/api/instruments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Yamaha C3",
    "type": "Фортепиано",
    "brand": "Yamaha",
    "model": "C3 Grand Piano",
    "purchasePrice": 850000.00,
    "currentValue": 800000.00,
    "purchaseDate": "2021-06-20",
    "conditionStatus": "Отличное",
    "description": "Концертный рояль, черный глянец",
    "serialNumber": "YMH-C3-2021-045",
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
    "imageContentType": "image/jpeg"
  }'
```

**Пример загрузки изображения из файла (bash):**
```bash
IMAGE_BASE64=$(base64 -w 0 image.jpg)
curl -X POST http://localhost:8080/api/instruments \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Yamaha C3\",
    \"type\": \"Фортепиано\",
    \"brand\": \"Yamaha\",
    \"model\": \"C3 Grand Piano\",
    \"purchasePrice\": 850000.00,
    \"currentValue\": 800000.00,
    \"purchaseDate\": \"2021-06-20\",
    \"conditionStatus\": \"Отличное\",
    \"description\": \"Концертный рояль, черный глянец\",
    \"serialNumber\": \"YMH-C3-2021-045\",
    \"imageBase64\": \"data:image/jpeg;base64,$IMAGE_BASE64\",
    \"imageContentType\": \"image/jpeg\"
  }"
```

---

### 2. Получение всех инструментов

**GET** `/api/instruments`

Возвращает список всех музыкальных инструментов.

#### Запрос:
```http
GET /api/instruments
```

#### Успешный ответ (200 OK):
```json
[
  {
    "id": 1,
    "name": "Fender Stratocaster",
    "type": "Гитара",
    "brand": "Fender",
    "model": "Stratocaster Standard",
    "purchasePrice": 45000.00,
    "currentValue": 42000.00,
    "purchaseDate": "2022-03-15",
    "conditionStatus": "Отличное",
    "description": "Классическая электрогитара, цвет sunburst",
    "serialNumber": "FND-STR-2022-001"
  },
  {
    "id": 2,
    "name": "Yamaha C3",
    "type": "Фортепиано",
    "brand": "Yamaha",
    "model": "C3 Grand Piano",
    "purchasePrice": 850000.00,
    "currentValue": 800000.00,
    "purchaseDate": "2021-06-20",
    "conditionStatus": "Отличное",
    "description": "Концертный рояль, черный глянец",
    "serialNumber": "YMH-C3-2021-045"
  }
]
```

#### Пример с curl:
```bash
curl -X GET http://localhost:8080/api/instruments
```

---

### 3. Получение инструментов по типу

**GET** `/api/instruments?type={type}`

Возвращает список инструментов определенного типа.

#### Параметры запроса:
- `type` (String, опционально) - Тип инструмента

#### Запрос:
```http
GET /api/instruments?type=Гитара
```

#### Успешный ответ (200 OK):
```json
[
  {
    "id": 1,
    "name": "Fender Stratocaster",
    "type": "Гитара",
    "brand": "Fender",
    "model": "Stratocaster Standard",
    "purchasePrice": 45000.00,
    "currentValue": 42000.00,
    "purchaseDate": "2022-03-15",
    "conditionStatus": "Отличное",
    "description": "Классическая электрогитара, цвет sunburst",
    "serialNumber": "FND-STR-2022-001"
  }
]
```

#### Пример с curl:
```bash
curl -X GET "http://localhost:8080/api/instruments?type=Гитара"
```

---

### 4. Получение инструментов по бренду

**GET** `/api/instruments?brand={brand}`

Возвращает список инструментов определенного бренда.

#### Параметры запроса:
- `brand` (String, опционально) - Бренд инструмента

#### Запрос:
```http
GET /api/instruments?brand=Fender
```

#### Успешный ответ (200 OK):
```json
[
  {
    "id": 1,
    "name": "Fender Stratocaster",
    "type": "Гитара",
    "brand": "Fender",
    "model": "Stratocaster Standard",
    "purchasePrice": 45000.00,
    "currentValue": 42000.00,
    "purchaseDate": "2022-03-15",
    "conditionStatus": "Отличное",
    "description": "Классическая электрогитара, цвет sunburst",
    "serialNumber": "FND-STR-2022-001"
  }
]
```

#### Пример с curl:
```bash
curl -X GET "http://localhost:8080/api/instruments?brand=Fender"
```

---

### 5. Получение инструмента по ID

**GET** `/api/instruments/{id}`

Возвращает информацию о конкретном инструменте по его идентификатору.

#### Параметры пути:
- `id` (Long, обязательный) - Идентификатор инструмента

#### Запрос:
```http
GET /api/instruments/1
```

#### Успешный ответ (200 OK):
```json
{
  "id": 1,
  "name": "Fender Stratocaster",
  "type": "Гитара",
  "brand": "Fender",
  "model": "Stratocaster Standard",
  "purchasePrice": 45000.00,
  "currentValue": 42000.00,
  "purchaseDate": "2022-03-15",
  "conditionStatus": "Отличное",
  "description": "Классическая электрогитара, цвет sunburst",
  "serialNumber": "FND-STR-2022-001"
}
```

#### Ошибки:
- **400 Bad Request** - Инструмент не найден
```json
{
  "error": "Instrument not found with id: 999"
}
```

#### Пример с curl:
```bash
curl -X GET http://localhost:8080/api/instruments/1
```

---

### 6. Обновление инструмента

**PUT** `/api/instruments/{id}`

Обновляет информацию о существующем инструменте.

#### Параметры пути:
- `id` (Long, обязательный) - Идентификатор инструмента

#### Запрос:
```http
PUT /api/instruments/1
Content-Type: application/json

{
  "name": "Fender Stratocaster",
  "type": "Гитара",
  "brand": "Fender",
  "model": "Stratocaster Standard",
  "purchasePrice": 45000.00,
  "currentValue": 40000.00,
  "purchaseDate": "2022-03-15",
  "conditionStatus": "Хорошее",
  "description": "Классическая электрогитара, цвет sunburst",
  "serialNumber": "FND-STR-2022-001",
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
  "imageContentType": "image/jpeg"
}
```

**Примечание:** Для удаления изображения передайте `null` в поле `imageBase64` или не передавайте поле вообще.

#### Успешный ответ (200 OK):
```json
{
  "id": 1,
  "name": "Fender Stratocaster",
  "type": "Гитара",
  "brand": "Fender",
  "model": "Stratocaster Standard",
  "purchasePrice": 45000.00,
  "currentValue": 40000.00,
  "purchaseDate": "2022-03-15",
  "conditionStatus": "Хорошее",
  "description": "Классическая электрогитара, цвет sunburst",
  "serialNumber": "FND-STR-2022-001"
}
```

#### Ошибки:
- **400 Bad Request** - Инструмент не найден или ошибки валидации
```json
{
  "error": "Instrument not found with id: 999"
}
```

#### Пример с curl:
```bash
curl -X PUT http://localhost:8080/api/instruments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fender Stratocaster",
    "type": "Гитара",
    "brand": "Fender",
    "model": "Stratocaster Standard",
    "purchasePrice": 45000.00,
    "currentValue": 40000.00,
    "purchaseDate": "2022-03-15",
    "conditionStatus": "Хорошее",
    "description": "Классическая электрогитара, цвет sunburst",
    "serialNumber": "FND-STR-2022-001"
  }'
```

---

### 7. Удаление инструмента

**DELETE** `/api/instruments/{id}`

Удаляет инструмент из системы.

#### Параметры пути:
- `id` (Long, обязательный) - Идентификатор инструмента

#### Запрос:
```http
DELETE /api/instruments/1
```

#### Успешный ответ (204 No Content):
Тело ответа пустое.

#### Ошибки:
- **400 Bad Request** - Инструмент не найден
```json
{
  "error": "Instrument not found with id: 999"
}
```

#### Пример с curl:
```bash
curl -X DELETE http://localhost:8080/api/instruments/1
```

---

### 8. Получение общей стоимости всех инструментов

**GET** `/api/instruments/statistics/total-value`

Возвращает общую стоимость всех инструментов в системе.

#### Запрос:
```http
GET /api/instruments/statistics/total-value
```

#### Успешный ответ (200 OK):
```json
{
  "totalValue": 5235000.00
}
```

#### Пример с curl:
```bash
curl -X GET http://localhost:8080/api/instruments/statistics/total-value
```

---

### 9. Получение средней стоимости инструментов

**GET** `/api/instruments/statistics/average-value`

Возвращает среднюю стоимость инструментов в системе.

#### Запрос:
```http
GET /api/instruments/statistics/average-value
```

#### Успешный ответ (200 OK):
```json
{
  "averageValue": 523500.00
}
```

#### Пример с curl:
```bash
curl -X GET http://localhost:8080/api/instruments/statistics/average-value
```

---

## Коды состояния HTTP

- **200 OK** - Успешный запрос
- **201 Created** - Ресурс успешно создан
- **204 No Content** - Успешное удаление (тело ответа пустое)
- **400 Bad Request** - Ошибка валидации или бизнес-логики
- **500 Internal Server Error** - Внутренняя ошибка сервера

## Обработка ошибок

Все ошибки возвращаются в формате JSON:

### Ошибки валидации:
```json
{
  "name": "Name is required",
  "purchasePrice": "Purchase price must be greater than 0",
  "currentValue": "Current value must be greater than or equal to 0"
}
```

### Бизнес-ошибки:
```json
{
  "error": "Instrument not found with id: 999"
}
```

```json
{
  "error": "Instrument with serial number FND-STR-2022-001 already exists"
}
```

---

## Примеры использования

### Создание и получение инструмента:
```bash
# Создание
curl -X POST http://localhost:8080/api/instruments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gibson Les Paul",
    "type": "Гитара",
    "brand": "Gibson",
    "model": "Les Paul Standard",
    "purchasePrice": 65000.00,
    "currentValue": 60000.00,
    "purchaseDate": "2023-01-10",
    "conditionStatus": "Хорошее",
    "description": "Электрогитара, цвет cherry sunburst",
    "serialNumber": "GBN-LP-2023-012"
  }'

# Получение всех
curl -X GET http://localhost:8080/api/instruments

# Получение по ID
curl -X GET http://localhost:8080/api/instruments/1

# Обновление
curl -X PUT http://localhost:8080/api/instruments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gibson Les Paul",
    "type": "Гитара",
    "brand": "Gibson",
    "model": "Les Paul Standard",
    "purchasePrice": 65000.00,
    "currentValue": 58000.00,
    "purchaseDate": "2023-01-10",
    "conditionStatus": "Хорошее",
    "description": "Электрогитара, цвет cherry sunburst",
    "serialNumber": "GBN-LP-2023-012"
  }'

# Удаление
curl -X DELETE http://localhost:8080/api/instruments/1

# Статистика
curl -X GET http://localhost:8080/api/instruments/statistics/total-value
curl -X GET http://localhost:8080/api/instruments/statistics/average-value
```

---

## Примечания

1. Все даты должны быть в формате ISO 8601: `YYYY-MM-DD`
2. Все денежные значения должны быть в формате числа с двумя знаками после запятой
3. Серийный номер должен быть уникальным в системе
4. При фильтрации по типу или бренду используется точное совпадение (case-sensitive)
5. При обновлении инструмента необходимо передавать все поля, включая те, которые не изменяются

## Работа с изображениями

### Формат изображений

Изображения хранятся в базе данных в бинарном формате (BYTEA) и передаются через API в формате base64 с префиксом data URI.

### Поддерживаемые форматы
- JPEG (image/jpeg) - рекомендуется
- PNG (image/png)
- GIF (image/gif)

### Ограничения
- Максимальный размер изображения: рекомендуется до 5MB
- Формат передачи: `data:image/{тип};base64,{base64_данные}`
- Пример: `"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."`

### Добавление изображения

При создании или обновлении инструмента передайте поле `imageBase64` с полным data URI:
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
  "imageContentType": "image/jpeg"
}
```

### Удаление изображения

Для удаления изображения при обновлении инструмента:
- Передайте `null` в поле `imageBase64`
- Или не передавайте поле `imageBase64` вообще (изображение останется без изменений)

### Получение изображения

При получении инструмента (GET запросы) изображение возвращается в поле `imageBase64` в формате data URI, готовом для использования в HTML:
```html
<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..." />
```

### Примеры работы с изображениями

**JavaScript (браузер):**
```javascript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const reader = new FileReader();

reader.onload = function(e) {
  const base64 = e.target.result;
  const instrument = {
    name: "Fender Stratocaster",
    // ... другие поля
    imageBase64: base64,
    imageContentType: file.type
  };
  
  fetch('/api/instruments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(instrument)
  });
};

reader.readAsDataURL(file);
```

**Python:**
```python
import base64
import requests

with open('guitar.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode('utf-8')
    image_base64 = f"data:image/jpeg;base64,{image_data}"

instrument = {
    "name": "Fender Stratocaster",
    # ... другие поля
    "imageBase64": image_base64,
    "imageContentType": "image/jpeg"
}

response = requests.post('http://localhost:8080/api/instruments', json=instrument)
```

