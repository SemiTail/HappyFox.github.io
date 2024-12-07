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
const clientId = '1314768632667963502'; // Укажите ваш CLIENT ID
const redirectUri = 'https://semitail.github.io/HappyFox.github.io/'; // Укажите ваш Redirect URI
const scope = 'identify';

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

// Создание авторизационной ссылки
loginButton.addEventListener('click', () => {
  const authUrl = `${discordAuthUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=token&scope=${scope}`;
  window.location.href = authUrl;
});

// Проверка токена
const hash = window.location.hash.substring(1);
const hashParams = new URLSearchParams(hash);
const token = hashParams.get('access_token');

if (token) {
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
