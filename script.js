const days = document.querySelectorAll('.day');
const modal = document.getElementById('modal');
const modalText = document.getElementById('gift-text');
const closeModal = document.querySelector('.close');
const giftSound = document.getElementById('gift-sound');

const loginButton = document.getElementById('login-button');
const userInfo = document.getElementById('user-info');
const userNameSpan = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');

const discordAuthUrl = 'https://discord.com/api/oauth2/authorize';
const clientId = '1314768632667963502'; // Ваш CLIENT ID
const redirectUri = 'https://semitail.github.io/HappyFox.github.io/'; // Ваш Redirect URI
const scope = 'identify';

// Проверка токена из URL
const hash = window.location.hash.substring(1);
const hashParams = new URLSearchParams(hash);
const token = hashParams.get('access_token');

// Если токен отсутствует, перенаправляем на Discord авторизацию
if (!token) {
  const authUrl = `${discordAuthUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=token&scope=${scope}`;
  window.location.href = authUrl;
} else {
  // Получаем информацию о пользователе
  fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      userNameSpan.textContent = data.username;
      userAvatar.src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
      userInfo.style.display = 'block';
      loginButton.style.display = 'none';
    })
    .catch((err) => console.error('Ошибка получения данных пользователя:', err));
}

// Подарки
const gifts = [
  "Шоколад 🍫",
  "Мандарин 🍊",
  "Плюшевый мишка 🧸",
  "Книга 📖",
  "Гирлянда 🎇",
  "Какао ☕",
  "Шапка 🎅",
  "Открытка 🎄",
  "Снежинка ❄️",
  "Игрушка-сюрприз 🎉",
  "Носки 🧦",
  "Свеча 🕯️",
  "Орехи 🌰",
  "Календарь 📅",
  "Фоторамка 🖼️",
  "Кусочек пирога 🍰",
  "Конфеты 🍬",
  "Шарик 🎈",
  "Брелок 🔑",
  "Снежный шар 🌨️",
  "Новогодняя кружка ☕",
  "Маленькая елочка 🌲",
  "Кусочек торта 🍰",
  "Шоколадный батончик 🍫",
  "Киндер Пингви 🍞",
];

// Обработка клика по дням
days.forEach((day, index) => {
  day.addEventListener('click', () => {
    if (!token) {
      alert('Сначала войдите через Discord!');
      return;
    }

    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    if (parseInt(day.dataset.day) > currentDay) {
      alert('Этот день еще не наступил!');
      return;
    }

    giftSound.play();
    modal.style.display = 'flex';
    modalText.textContent = gifts[index];
  });
});

// Закрытие модального окна
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Функция для сохранения состояния закрытых дней
function saveClosedDays() {
  const closedDays = [...document.querySelectorAll('.day.opened')].map(day => day.dataset.day);
  localStorage.setItem('closedDays', JSON.stringify(closedDays));
}

// Функция для загрузки закрытых дней
function loadClosedDays() {
  const closedDays = JSON.parse(localStorage.getItem('closedDays')) || [];
  closedDays.forEach(dayNum => {
    const day = document.querySelector(`.day[data-day="${dayNum}"]`);
    if (day) {
      day.classList.add('opened');
      day.textContent = '🎁';
    }
  });
}

// Загрузка закрытых дней при загрузке страницы
loadClosedDays();

// Обработка клика по дням
days.forEach((day, index) => {
  day.addEventListener('click', () => {
    if (!token) {
      alert('Сначала войдите через Discord!');
      return;
    }

    if (day.classList.contains('opened')) {
      alert('Вы уже открыли этот день!');
      return;
    }

    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    if (parseInt(day.dataset.day) > currentDay) {
      alert('Этот день еще не наступил!');
      return;
    }

    // Показ подарка
    giftSound.play();
    modal.style.display = 'flex';
    modalText.textContent = gifts[index];

    // Закрытие дня
    day.classList.add('opened');
    day.textContent = '🎁'; // Меняем текст на значок
    saveClosedDays();
  });
});

// Закрытие модального окна
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});
