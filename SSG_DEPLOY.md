# Инструкция по Static Site Generation (SSG)

## Что такое SSG?

Static Site Generation - это подход, при котором все страницы сайта генерируются заранее во время сборки. В вашем случае будет сгенерировано ~11,000 статических HTML страниц для всех комбинаций рынков и регионов.

## Преимущества для вашего проекта

✅ **Производительность**: Молниеносная загрузка страниц (просто статический HTML)
✅ **SEO**: Идеально для поисковой оптимизации - весь контент доступен сразу
✅ **Надежность**: Нет зависимости от сервера или базы данных
✅ **Экономия**: Можно разместить на бесплатном хостинге (GitHub Pages, Netlify, Vercel)
✅ **Безопасность**: Нет серверной части = нет уязвимостей

## Команды для работы

### Разработка
```bash
npm run dev
```

### Генерация статического сайта
```bash
npm run generate
```

Эта команда:
1. Прочитает все JSON файлы из `/public/data/`
2. Сгенерирует маршруты для всех комбинаций рынков и регионов
3. Создаст статические HTML файлы в `.output/public/`

### Предварительный просмотр сгенерированного сайта
```bash
npm run preview
```

## Процесс обновления контента (раз в месяц)

1. **Обновите JSON файлы** в `/public/data/`:
   - `search.json` - данные рынков и регионов
   - `markets.json` - список рынков с ID
   - `{marketId}_*.json` - данные по каждому рынку

2. **Пересоберите сайт**:
   ```bash
   npm run generate
   ```

3. **Задеплойте** новую версию (см. раздел ниже)

## Варианты деплоя

### 1. Netlify (Рекомендуется)

**Преимущества**: Бесплатно, автоматический деплой, CDN

```bash
# Установите Netlify CLI
npm install -g netlify-cli

# Деплой
netlify deploy --prod --dir=.output/public
```

Или подключите GitHub репозиторий к Netlify - будет автоматически деплоить при каждом пуше.

**Настройки в Netlify:**
- Build command: `npm run generate`
- Publish directory: `.output/public`

### 2. Vercel

```bash
# Установите Vercel CLI
npm install -g vercel

# Деплой
vercel --prod
```

**Настройки в Vercel:**
- Build command: `npm run generate`
- Output directory: `.output/public`

### 3. GitHub Pages

```bash
# Пересоберите сайт
npm run generate

# Опубликуйте содержимое .output/public в ветку gh-pages
```

### 4. Любой статический хостинг

После `npm run generate` весь сайт находится в `.output/public/`.
Просто загрузите эту папку на любой хостинг:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Своя ВМ с nginx

## Структура сгенерированных файлов

```
.output/public/
├── index.html                    # Главная страница
├── 1/
│   ├── index.html               # Рынок 1 - Вся Россия
│   ├── 77/
│   │   └── index.html           # Рынок 1 - Москва
│   └── 78/
│       └── index.html           # Рынок 1 - СПб
├── 2/
│   ├── index.html               # Рынок 2 - Вся Россия
│   └── ...
├── data/                         # JSON файлы
├── css/                          # Стили
├── js/                           # JavaScript
└── fonts/                        # Шрифты
```

## Мониторинг размера

После генерации проверьте размер:
```bash
du -sh .output/public
```

Ожидаемый размер для ~11,000 страниц: 500-1500 MB

## CI/CD для автоматизации

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci
      - run: npm run generate

      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=.output/public
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

## Устранение проблем

### Слишком долгая генерация
- Уменьшите количество маршрутов для тестирования
- Проверьте, что нет дублирующихся маршрутов

### Ошибки при генерации
```bash
# Запустите с подробным выводом
DEBUG=nuxt:* npm run generate
```

### Проверка конкретного маршрута
```bash
# Откройте сгенерированный файл
open .output/public/1/77/index.html
```

## Заметки

- Все изменения в JSON файлах требуют пересборки сайта
- Для внутренних ссылок используйте `<NuxtLink>` - они будут работать как SPA
- Статические ассеты (изображения, шрифты) кладите в `/public/`
- При обновлении раз в месяц - весь процесс займет 5-10 минут
