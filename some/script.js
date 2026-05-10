const MENU = document.getElementById('menu');
const BUTTON = document.getElementById('btn');
const CLOSE_BUTTON = document.getElementById('close-btn');


MENU.addEventListener('click', (event) => {
  MENU.querySelectorAll('li').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
});

BUTTON.addEventListener('click', () => {
  const subject = document.getElementById('subject').value.toString();
  document.getElementById('result').innerText = subject;
  document.getElementById('message-block').classList.remove('hidden');
});

CLOSE_BUTTON.addEventListener('click', () => {
  document.getElementById('result').innerText = '';
  document.getElementById('message-block').classList.add('hidden')
});
