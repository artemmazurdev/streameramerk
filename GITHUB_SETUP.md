# Инструкция по подключению проекта к GitHub

## Шаг 1: Создание репозитория на GitHub

1. Перейдите на https://github.com/new
2. Заполните данные:
   - **Repository name**: `streamyard` (или другое имя по вашему выбору)
   - **Description**: "Full-featured live streaming platform"
   - **Visibility**: Выберите Public или Private
   - **НЕ** создавайте README, .gitignore или лицензию (они уже есть в проекте)
3. Нажмите **"Create repository"**

## Шаг 2: Подключение локального репозитория к GitHub

После создания репозитория на GitHub, выполните следующие команды в терминале:

```powershell
# Перейдите в директорию проекта
cd d:\streamyard

# Добавьте remote репозиторий (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/streamyard.git

# Переименуйте ветку в main (если нужно)
git branch -M main

# Отправьте код на GitHub
git push -u origin main
```

## Альтернативный способ (если используете SSH):

```powershell
git remote add origin git@github.com:YOUR_USERNAME/streamyard.git
git branch -M main
git push -u origin main
```

## Проверка подключения

После выполнения команд проверьте:

```powershell
# Проверить настроенные remote репозитории
git remote -v

# Должно показать:
# origin  https://github.com/YOUR_USERNAME/streamyard.git (fetch)
# origin  https://github.com/YOUR_USERNAME/streamyard.git (push)
```

## Настройка Git (если нужно изменить)

Если нужно изменить имя и email для этого репозитория:

```powershell
git config user.name "Ваше Имя"
git config user.email "ваш.email@example.com"
```

Или глобально для всех репозиториев:

```powershell
git config --global user.name "Ваше Имя"
git config --global user.email "ваш.email@example.com"
```

## Готово! 🎉

Ваш проект теперь подключен к GitHub и находится в отдельной директории `streamyard`.

