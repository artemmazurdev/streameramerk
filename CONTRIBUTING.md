# 🤝 Contributing to StreamYard Clone

Спасибо за интерес к проекту! Мы рады любым вкладам.

## Как внести свой вклад

### Reporting Bugs

Если вы нашли баг:

1. Проверьте [Issues](https://github.com/yourusername/streamyard-clone/issues), возможно баг уже известен
2. Если нет, создайте новый issue с:
   - Четким описанием проблемы
   - Шагами для воспроизведения
   - Ожидаемым и фактическим поведением
   - Версией Node.js, OS и браузера
   - Скриншотами (если применимо)

### Suggesting Features

Хотите предложить новую функцию?

1. Создайте issue с тегом `enhancement`
2. Опишите:
   - Какую проблему решает фича
   - Предлагаемое решение
   - Альтернативные варианты
   - Примеры использования

### Pull Requests

1. **Fork репозитория**
```bash
git clone https://github.com/yourusername/streamyard-clone.git
cd streamyard-clone
git checkout -b feature/my-feature
```

2. **Сделайте изменения**
   - Следуйте code style проекта
   - Добавьте тесты
   - Обновите документацию

3. **Commit changes**
```bash
git add .
git commit -m "feat: add new feature"
```

Используйте [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - новая функция
- `fix:` - исправление бага
- `docs:` - изменения в документации
- `style:` - форматирование кода
- `refactor:` - рефакторинг
- `test:` - добавление тестов
- `chore:` - другие изменения

4. **Push и создание PR**
```bash
git push origin feature/my-feature
```

Затем создайте Pull Request на GitHub.

## Development Guidelines

### Code Style

**TypeScript/JavaScript:**
- Используйте TypeScript где возможно
- ESLint для линтинга
- Prettier для форматирования
- 2 spaces для отступов

**React:**
- Функциональные компоненты с hooks
- TypeScript для props
- Логика в custom hooks

### Testing

```bash
# Запуск тестов
npm run test

# С coverage
npm run test:coverage
```

Покрытие тестами:
- Unit tests для бизнес-логики
- Integration tests для API
- E2E tests для критических потоков

### Commit Messages

```
feat(frontend): add virtual background support
fix(backend): resolve JWT expiration issue
docs(readme): update installation instructions
```

### Branch Naming

- `feature/feature-name` - новая функция
- `fix/bug-description` - исправление бага
- `docs/what-changed` - документация
- `refactor/what-refactored` - рефакторинг

## Project Structure

```
streamyard/
├── frontend/          # React приложение
├── backend/           # API сервер
├── signaling-server/  # WebSocket сервер
├── media-server/      # Mediasoup SFU
├── rtmp-relay/        # RTMP сервер
├── compositor/        # FFmpeg композитинг
└── shared/            # Общие типы
```

## Development Workflow

1. Создайте issue для обсуждения
2. Fork и clone репозиторий
3. Создайте feature branch
4. Внесите изменения
5. Добавьте тесты
6. Убедитесь что все тесты проходят
7. Создайте Pull Request
8. Дождитесь code review
9. Внесите правки если нужно
10. PR будет смержен!

## Questions?

Если у вас есть вопросы:
- Создайте issue с тегом `question`
- Напишите в Discord
- Email: dev@yourdomain.com

Спасибо за вклад в проект! ❤️



