const list = document.getElementById('list');
const liveItems = document.getElementsByClassName('item'); // ссылки, живая коллекция
const staticItems = document.querySelectorAll('.item'); // снимок, статическая коллекция

const btn = document.querySelector('.btn');
const btn1 = document.getElementsByClassName('btn');

console.log(`items 1 len - ${liveItems.length}; items 2 len - ${staticItems.length};`);

const new_li = document.createElement('li');
new_li.classList.add('item');
new_li.textContent = 'Fourth';
new_li.setAttribute('data-id', '4');
list.append(new_li);

console.log(`items 1 len - ${liveItems.length}; items 2 len - ${staticItems.length};`);

console.log(btn.closest('.wrapper')); 
console.log([...liveItems][0].matches('.active'));
console.log([...staticItems][0].matches('.active'));

const arrayLiveItems = Array.from(liveItems);
console.log(arrayLiveItems);

arrayLiveItems.forEach((el) => {
  console.log(el.getAttribute('data-id'));
});

/**
 * document.getElementById - возвращает element;
 * document.getElemenstsByClassName - возвращает массивоподобный объект live collection;
 * document.qureySecectorAll - возвращает массивоподобный объект static collection;
 * document.querySecector - возвращает перевый эллемент с переданным css селектором, qureySelectorAll и qureySecector гибче, потому что могут выбирать по любому css селектору, кроме того, могут быть вызваны как на глобальном объекте document так и на любом element.
 * Так как парсинг DOM при поиске селекторов ресурсно дорогая операция эллементы или коллекции присваиваются переменным или константам, что называется кешированием. Если мы знаем что структура DOM не будет меняться мы можем использовать кеширование при статических коллекциях, если будет, как я понимаю нужно использовать живую коллекцию.
 * Live collection это окно в DOM - изменение сразу видны в закешированной переменной или константе. Static collection это снимок статичный, и при изменении DOM переменную или константу нужно снова переопределять , для актуализации с DOM. Я как будто не вижу плюсов в использовании статических коллекций.
 * 
 * На сколько верно мое понимание?
 */

/**
 * 1. Так как , живая коллекция это собственно коллекция ссылок и при удалении из нее ссылок мы мутируем саму коллекцию и уменьшаем ее размер. Для того, что бы не создавать копию коллекции мы можем использовать статическую коллекцию (вот тут понял почему статическая коллекция может быть предпочтительнее).
 * 2. Парсер пойдет вверх по DOM дереву и вернем еллемент ul id="list".
 * 3. Когда DOM меняеться а в переменных и константах ссылки или массивоподобные объекты (коллекции) с ссылками на уже не существующие эллементы.
 * 4. В первом случае мы парсим эллемент с классом .item в эллементе (element), а во втором в глобальном объекте - во всем документе html (document).
 * Как считаешь на сколько я правильно понимаю и как я разобрался?
 */ 