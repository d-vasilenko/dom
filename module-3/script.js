const card = document.querySelector('.card');
const cardPrise = card.querySelector('.card__price');
const cardDesc = card.querySelector('.card__desc');
const html = document.documentElement;

const buttonToggle = document.querySelector('.btn--toggle');

buttonToggle.addEventListener('click', (event) => {
  const isSold = card.dataset.status;
  card.dataset.status = isSold === 'available' ? 'sold' : 'available';
  cardPrise.dataset.status = card.dataset.status;
})

const buttonTheme = card.querySelector('.btn--theme');

buttonTheme.addEventListener('click', () => {
  if (html.hasAttribute('data-theme')) {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', 'dark');
  }
})

const buttonHide = card.querySelector('.btn--hide');

buttonHide.addEventListener('click', (event) => {
  cardDesc.classList.toggle('hidden');
})

const buttonReset = document.createElement('button');
buttonReset.textContent = 'Reset';
buttonReset.classList.add('btn');

buttonReset.addEventListener('click', (event) => {
  card.dataset.status = 'available';
  cardPrise.dataset.status = 'available';
  card.classList.remove('card--featured');
  cardDesc.classList.remove('hidden');
  html.removeAttribute('data-theme');
})

card.append(buttonReset);

/**
 * 1 Потому, aттрибут html value первоначальное значение, а работаем мы с el.value с property.
 * 2 это не безопасно, нужно либо экранировать sanitaizer либо использовать textContent.
 * 3 Потому что не перезаписывает полностью аттрибут.
 * 4 получение:
 * const root = document.documentElement;
 * getComputedStyle(root).getPropertyValue('--spacing').trim();
 * изменение:
 * root.style.setProperty('--spacing', 'newValue');
 */