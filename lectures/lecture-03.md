# 🎓 ЛЕКЦИЯ: МОДУЛЬ 3
## Контент, атрибуты, стили, CSS-переменные из JS

> 🧭 **Цель модуля:** научиться безопасно и предсказуемо манипулировать содержимым элементов, понимать разницу между атрибутами и свойствами, освоить современные паттерны работы с классами и стилями, и интегрировать CSS-переменные в динамические интерфейсы на уровне продакшена.

---

## 🧠 ЧАСТЬ 1: Работа с содержимым — глубокий разбор

### 1.1 Три метода: `textContent` vs `innerHTML` vs `innerText`

| Метод | Что делает | Парсит HTML? | Вызывает reflow? | Безопасность | Когда использовать |
|-------|------------|--------------|------------------|--------------|-------------------|
| `textContent` | Читает/записывает **сырой текст** всех дочерних текстовых узлов | ❌ Нет | ❌ Нет | ✅ Безопасно (XSS невозможен) | ✅ 95% случаев: данные, сообщения, динамический текст |
| `innerHTML` | Читает/записывает **HTML-разметку** дочерних узлов | ✅ Да | ⚠️ Да, при вставке | ⚠️ Опасно с непроверенными данными | ✅ Только для доверенной/статичной разметки |
| `innerText` | Читает/записывает **видимый пользователю текст** (учитывает CSS) | ❌ Нет | ✅ Да, при чтении | ✅ Безопасно | ⚠️ Только если нужно именно «то, что видит пользователь» |

### 1.2 Почему `innerText` — ловушка производительности
```js
// Чтение innerText вызывает синхронный пересчёт layout
const text = element.innerText; // 🐌 Браузер должен:
// 1. Вычислить стили всех дочерних узлов
// 2. Определить, какие узлы видимы (display: none, visibility: hidden)
// 3. Учесть переносы строк, пробелы, CSS-контент (::before/::after)
// 4. Вернуть «видимый» текст
```

🧠 **Ментальная модель:**  
`textContent` работает с **DOM-деревом** (быстро, безопасно).  
`innerText` работает с **рендер-деревом** (медленно, зависит от CSS).

### 1.3 `innerHTML` и безопасность (XSS)
```js
// ❌ Критическая уязвимость
const userInput = '<img src=x onerror="alert(document.cookie)">';
element.innerHTML = userInput; // Выполнится вредоносный JS!

// ✅ Безопасные альтернативы
element.textContent = userInput; // Текст отобразится как есть

// ✅ Если разметка необходима — санитайз
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// ✅ Или создавай узлы явно
const span = document.createElement('span');
span.textContent = userInput;
element.append(span);
```

📖 *OWASP XSS Prevention:* [DOM-based XSS](https://owasp.org/www-community/attacks/xss/)

---

## 🧠 ЧАСТЬ 2: Атрибуты и свойства — фундаментальное различие

### 2.1 Атрибуты (HTML) vs Свойства (DOM)
Это **самая частая причина багов** в работе с формами и динамическим контентом.

| Аспект | Атрибут (`getAttribute`) | Свойство (`.property`) |
|--------|-------------------------|------------------------|
| **Источник** | Исходный HTML-код | Текущее состояние DOM-объекта |
| **Тип данных** | Всегда строка | Любой тип (строка, число, булево, объект) |
| **Синхронизация** | Не всегда синхронизировано | Всегда актуально |
| **Пример** | `<input value="123">` → `getAttribute('value')` = `"123"` | После ввода пользователем: `.value` = `"123456"` |

### 2.2 Практические примеры
```html
<input id="num" type="number" value="10" min="0" max="100">
```

```js
const input = document.getElementById('num');

// Атрибуты (изначальная разметка)
input.getAttribute('value'); // "10" (не меняется при вводе!)
input.getAttribute('min');   // "0"

// Свойства (текущее состояние)
input.value;  // "10" → меняется при вводе пользователя
input.min;    // "0"
input.max;    // "100"
input.disabled; // false/true (булево, а не строка!)

// ✅ Правило: читай/пиши состояние через свойства
input.value = '42'; // Обновит и свойство, и атрибут

// ✅ Атрибуты используй для:
// - data-* (через dataset, см. ниже)
// - кастомных метаданных
// - initial configuration, который не меняется
```

### 2.3 `dataset` — безопасный доступ к `data-*` атрибутам
```html
<li class="item" data-id="42" data-status="active">Товар</li>
```

```js
const item = document.querySelector('.item');

// ❌ Старый способ (работает, но многословно)
item.getAttribute('data-id'); // "42"

// ✅ Современный способ (автоматическое преобразование)
item.dataset.id;     // "42" (строка)
item.dataset.status; // "active"

// ✅ Запись (автоматически обновляет атрибут в HTML)
item.dataset.status = 'inactive'; // <li data-status="inactive">

// 🧠 Ментальная модель: dataset — это «мост» между HTML-разметкой и JS-логикой
// Используй для: ID, статусов, конфигурации компонента, аналитики
```

📖 *Спецификация:* [HTML Dataset API](https://html.spec.whatwg.org/multipage/dom.html#dom-dataset)

---

## 🧠 ЧАСТЬ 3: Классы и стили — современные паттерны

### 3.1 `classList` API (забудь про `className`)
```js
const el = document.querySelector('.card');

// ✅ Добавление/удаление
el.classList.add('active');
el.classList.remove('hidden');

// ✅ Переключение (toggle)
el.classList.toggle('expanded'); // добавил, если не было / убрал, если было
el.classList.toggle('expanded', true); // принудительно добавить

// ✅ Замена
el.classList.replace('old-theme', 'new-theme');

// ✅ Проверка
el.classList.contains('active'); // true/false

// ✅ Работа с несколькими классами
el.classList.add('theme-dark', 'compact');

// ❌ Антипаттерн (перезаписывает все классы!)
el.className = 'active'; // Потеряны все остальные классы!
```

🧠 **Почему `classList` лучше:**
- Не перезаписывает всю строку классов
- Поддерживает цепочки методов
- Читаемее и предсказуемее
- Стандарт де-факто в современном коде

### 3.2 Работа со стилями: три подхода

| Подход | Синтаксис | Когда использовать | Предупреждение |
|--------|-----------|-------------------|----------------|
| **`.style`** | `el.style.color = 'red'` | Точечные, динамические изменения | Пишет **инлайн-стили** (высокий приоритет, сложно переопределить) |
| **Классы** | `el.classList.add('error')` | Состояния, темы, анимации | ✅ Рекомендуемый паттерн: логика в JS, визуал в CSS |
| **CSS-переменные** | `el.style.setProperty('--color', 'red')` | Глобальные темы, динамические значения | ✅ Гибко, каскадно, легко переопределить |

### 3.3 CSS-переменные (Custom Properties) из JS
```css
:root {
  --primary-color: #3498db;
  --spacing-unit: 8px;
  --transition-speed: 0.3s;
}

.card {
  background: var(--primary-color);
  padding: calc(var(--spacing-unit) * 2);
  transition: transform var(--transition-speed);
}
```

```js
// ✅ Чтение вычисленного значения (включая наследование)
const root = document.documentElement;
const color = getComputedStyle(root).getPropertyValue('--primary-color').trim();

// ✅ Запись (мгновенно применяется ко всем элементам, использующим переменную)
root.style.setProperty('--primary-color', '#e74c3c');

// ✅ Локальное переопределение (только для конкретного элемента и его потомков)
const card = document.querySelector('.card');
card.style.setProperty('--spacing-unit', '16px');

// ✅ Удаление переменной (вернётся значение из каскада)
card.style.removeProperty('--spacing-unit');
```

🧠 **Ментальная модель:**  
CSS-переменные — это «глобальные переменные» в каскадной таблице стилей. Изменил в `:root` → обновилось во всём приложении. Изменил на элементе → переопределил локально.

📖 *MDN:* [Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

## 🔍 ЧАСТЬ 4: Производительность и отладка

### 4.1 Reflow и Repaint: когда браузер пересчитывает макет
| Действие | Вызывает reflow? | Вызывает repaint? |
|----------|-----------------|-------------------|
| Изменение `textContent` | ❌ Нет | ✅ Да (если текст виден) |
| Изменение `innerHTML` | ✅ Да (перестроение дерева) | ✅ Да |
| Добавление/удаление класса | ⚠️ Зависит от CSS (если меняется геометрия — да) | ✅ Да |
| Изменение `style.width` | ✅ Да | ✅ Да |
| Изменение `style.color` | ❌ Нет | ✅ Да |
| Изменение CSS-переменной, влияющей на layout | ✅ Да | ✅ Да |

✅ **Правило:**  
- Группируй изменения стилей → минимизируй reflow
- Используй классы для состояний → браузер оптимизирует пересчёт
- Для анимаций геометрии используй `transform` и `opacity` (не вызывают reflow)

### 4.2 DevTools: отладка стилей и атрибутов
- **Elements → Styles**: видит инлайн-стили, классы, вычисленные значения, CSS-переменные
- **Computed**: показывает финальные значения после каскада
- **Break on → attribute modifications**: пауза при изменении атрибутов/классов
- **Console**: `getComputedStyle(el)` для чтения финальных значений

---

## 🧩 МЕНТАЛЬНЫЕ МОДЕЛИ И ПРАВИЛА

1. **Текст → `textContent`. Разметка → `createElement` + `append`. Чужой HTML → санитайз.**
2. **Атрибут ≠ Свойство.** Атрибут — изначальная разметка. Свойство — текущее состояние. Для форм всегда используй свойства (`.value`, `.checked`).
3. **`dataset` — мост между HTML и логикой.** Храни там ID, статусы, конфигурацию компонента.
4. **Классы для состояний, инлайн-стили — только для динамических значений.**
5. **CSS-переменные — для тем и глобальных настроек.** Меняй в `:root` для глобального эффекта.
6. **Группируй изменения стилей.** Один reflow лучше десяти.

---

## 📚 ИСТОЧНИКИ
- [DOM Standard: textContent](https://dom.spec.whatwg.org/#dom-node-textcontent)
- [HTML Standard: content attributes vs IDL attributes](https://html.spec.whatwg.org/multipage/dom.html#attributes)
- [MDN: Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
- [MDN: CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Google Developers: Rendering Performance](https://developers.google.com/web/fundamentals/performance/rendering)

---

## 🛠 ПРАКТИКА

### Задание: Динамическая карточка товара с переключением темы

1. Создай `index.html` и `script.js`.
2. `index.html`:
   ```html
   <!DOCTYPE html>
   <html lang="ru">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>DOM Step 3</title>
     <style>
       :root {
         --bg-primary: #ffffff;
         --text-primary: #1a1a1a;
         --accent: #3498db;
         --spacing: 16px;
       }
       [data-theme="dark"] {
         --bg-primary: #1a1a1a;
         --text-primary: #f5f5f5;
         --accent: #e74c3c;
       }
       body {
         background: var(--bg-primary);
         color: var(--text-primary);
         font-family: system-ui, sans-serif;
         transition: background 0.3s, color 0.3s;
       }
       .card {
         border: 2px solid var(--accent);
         border-radius: 8px;
         padding: calc(var(--spacing) * 2);
         margin: var(--spacing);
         max-width: 400px;
       }
       .card__title { margin: 0 0 var(--spacing); }
       .card__price { font-size: 1.5em; font-weight: bold; color: var(--accent); }
       .card--featured { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
       .hidden { display: none; }
       .btn {
         background: var(--accent);
         color: white;
         border: none;
         padding: 8px 16px;
         border-radius: 4px;
         cursor: pointer;
         margin: 4px;
       }
     </style>
   </head>
   <body>
     <article class="card" data-id="42" data-status="available">
       <h2 class="card__title">Товар #42</h2>
       <p class="card__desc">Описание товара</p>
       <p class="card__price" data-price="2990">2 990 ₽</p>
       <button class="btn btn--toggle">Переключить статус</button>
       <button class="btn btn--theme">Сменить тему</button>
       <button class="btn btn--hide">Скрыть описание</button>
     </article>
     <script src="script.js" defer></script>
   </body>
   </html>
   ```

3. В `script.js` реализуй:
   - Найди карточку, закэшируй в `const card`
   - Прочитай `data-id` и `data-status` через `dataset`, выведи в консоль
   - Обработай клик на `.btn--toggle`:
     - Если `data-status === 'available'` → поменяй на `'sold'`, добавь класс `card--featured`
     - Иначе → поменяй на `'available'`, убери класс `card--featured`
     - Обнови текст цены: если `'sold'` → добавь зачёркивание через `textContent` (не `innerHTML`!)
   - Обработай клик на `.btn--theme`:
     - Переключи атрибут `data-theme` на `<html>` между `dark` и отсутствием
     - Используй `document.documentElement` и `setAttribute` / `removeAttribute`
   - Обработай клик на `.btn--hide`:
     - Переключи класс `hidden` у `.card__desc` через `classList.toggle`
   - Добавь кнопку «Сброс», которая:
     - Возвращает `data-status` в `'available'`
     - Убирает `card--featured`
     - Убирает `hidden` у описания
     - Сбрасывает тему (удаляет `data-theme` с `<html>`)
   - Везде используй `textContent` для текста, `dataset` для данных, `classList` для классов
   - Добавь комментарии: почему для цены используешь `textContent`, а не `innerHTML`?

### ✅ Чек-лист самопроверки
- [ ] Все элементы найдены и закэшированы в `const`
- [ ] `dataset` используется для чтения/записи `data-*` атрибутов
- [ ] `classList` используется для манипуляции классами (не `className`)
- [ ] Текст обновляется через `textContent` (нигде нет `innerHTML` с динамическими данными)
- [ ] Тема переключается через `data-theme` на `<html>` и CSS-переменные
- [ ] Состояние карточки синхронизировано: `data-status` ↔ класс `card--featured` ↔ текст цены
- [ ] Кнопка «Сброс» возвращает все состояния в исходные
- [ ] В консоли нет ошибок, в DevTools видно изменение атрибутов/классов

---

## ❓ КОНТРОЛЬНЫЕ ВОПРОСЫ
1. Почему `input.value` меняется при вводе пользователя, а `input.getAttribute('value')` — нет?
2. В чём риск использования `innerHTML = userInput`? Как безопасно вставить пользовательский текст с разметкой?
3. Почему `classList.add()` предпочтительнее, чем `className += ' new-class'`?
4. Как прочитать вычисленное значение CSS-переменной `--spacing` из JS? А как изменить её глобально?

---

## 📤 ШАБЛОН ОТВЁТА (скопируй и заполни)
```markdown
### 📦 Модуль 3: Отчёт
**1. Код `script.js`:**
```js
// вставь полный код
```

**2. Вывод консоли (dataset, статусы):**
```
// что вывелось при загрузке и после кликов
```

**3. Ответы на контрольные вопросы:**
1. 
2. 
3. 
4. 

**4. Вопросы / сложности / моменты неуверенности:**
- 
- 

**5. Статус:** [ ] Разобрался, готов к следующему модулю / [ ] Есть вопросы, нужно разобрать
```

---
