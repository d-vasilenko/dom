const message = document.getElementById('message');
const el = document.getElementById('some');

const span = document.createElement('span');
span.textContent = 'Some text';
span.classList.add('some__span');
el.append(span);

message.textContent = 'DOM connected successfully';

message.classList.add('highlight');

console.log(message.tagName,
  message.nodeType,
  message.id,
  message.nodeType === 1 ? 'Element' : 'Other', 
);

// defer гарантирует, что скрипт выполнеться после рендора DOM script в header может выполниться до построения DOM, async тоже не предсказуем, может выполниться до построения DOM.
// 1. Потому, что getElementById может сработать (выполниться) до построения DOM.
// 2. innerText приводит к перередеру DOM textContent нет.
// 3. Создасться 3 node <startTag>, text, <endTag>.
// 4. Break on -> attribute modification.
// 5. Потому, что выполняется строго после построения DOM. 