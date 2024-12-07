// Проверка, залогинен ли пользователь через Discord
let isLoggedIn = false; // Установим флаг в false (по умолчанию)
let userData = null; // Переменная для хранения данных пользователя

// Функция для симуляции авторизации через Discord
function checkDiscordLogin() {
  const token = localStorage.getItem('discordToken'); // Получаем токен из LocalStorage

  if (token) {
    isLoggedIn = true;
    userData = {
      username: 'Имя пользователя',  // Здесь будет имя пользователя
      avatarUrl: 'https://cdn.discordapp.com/avatars/123456789012345678/abcdefg.png', // Пример URL аватарки
    };
    document.getElementById('discord-login').style.display = 'none'; // Скрыть кнопку входа
    document.getElementById('calendar').style.display = 'block'; // Показать календарь
    document.getElementById('user-card').style.display = 'flex'; // Показать карточку пользователя
    displayUserCard(); // Отобразить карточку пользователя
  } else {
    isLoggedIn = false;
    document.getElementById('login-message').style.display = 'block'; // Показать сообщение о необходимости логина
    document.getElementById('discord-login').style.display = 'block'; // Показать кнопку логина
    document.getElementById('user-card').style.display = 'none'; // Скрыть карточку пользователя
  }
}


// Обработка авторизации через Discord
const discordBtn = document.getElementById('discord-login-btn');
const discordLogin = document.getElementById('discord-login');

discordBtn.addEventListener('click', function() {
  // Симуляция логина, можно добавить настоящую OAuth2 авторизацию
  localStorage.setItem('discordToken', 'mocked-token'); // Пример хранения токена
  checkDiscordLogin();
});

// Функция для отображения карточки пользователя
function displayUserCard() {
  const userCard = document.getElementById('user-card');
  const usernameElem = userCard.querySelector('.username');
  const avatarElem = userCard.querySelector('.avatar');
  const greetingElem = userCard.querySelector('.greeting');

  if (userData) {
    // Устанавливаем имя пользователя и аватар
    usernameElem.textContent = `Привет, ${userData.username}!`;
    avatarElem.src = userData.avatarUrl;
    avatarElem.alt = userData.username;

    // Пожелание с Новым годом
    greetingElem.textContent = 'С Новым годом! Пусть 2024 год принесет счастье и успех! 🎉';
  }
}

// Обработка открытия календаря
const days = document.querySelectorAll('.day');
const modal = document.getElementById('modal');
const giftText = document.getElementById('gift-text');
const giftSound = document.getElementById('gift-sound');
const lockedMessage = document.querySelector('.locked-message');
const loginMessage = document.querySelector('.login-message');

days.forEach(day => {
  day.addEventListener('click', () => {
    if (!isLoggedIn) {
      loginMessage.style.display = 'block';
      setTimeout(() => {
        loginMessage.style.opacity = 0;
      }, 2000);
      return; // Не даем открывать день, если не залогинен
    }

    if (day.classList.contains('opened')) {
      return;
    }

    const dayNumber = day.dataset.day;
    const currentDate = new Date().getDate();

    if (dayNumber <= currentDate) {
      day.classList.add('opened');
      giftText.textContent = `Вы открыли подарок за день ${dayNumber}! 🎉`;
      giftSound.play();
      modal.style.display = 'flex';
    } else {
      lockedMessage.style.display = 'block';
      lockedMessage.style.opacity = 1;
      setTimeout(() => {
        lockedMessage.style.opacity = 0;
      }, 2000);
    }
  });
});

// Закрытие модального окна
const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Генерация снежинок
function generateSnowflakes() {
  const snowflake = document.createElement('div');
  snowflake.classList.add('snowflake');
  snowflake.textContent = '❄️';
  document.body.appendChild(snowflake);

  const leftPosition = Math.random() * window.innerWidth;
  snowflake.style.left = `${leftPosition}px`;

  setTimeout(() => {
    snowflake.remove();
  }, 5000);
}

// Генерация снежинок каждую секунду
setInterval(generateSnowflakes, 1000);

// Проверка авторизации при загрузке страницы
checkDiscordLogin();
