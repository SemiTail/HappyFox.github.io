// Слушаем клик по кнопке Discord входа
const discordLoginButton = document.getElementById('discord-login');
discordLoginButton.addEventListener('click', () => {
  const clientId = 'YOUR_DISCORD_CLIENT_ID';
  const redirectUri = 'YOUR_REDIRECT_URI';  // Например, http://localhost:3000/callback
  const scope = 'identify';
  const responseType = 'code';
  const state = 'random_state_string';  // Это значение для защиты от CSRF атак
  const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}&state=${state}`;

  window.location.href = oauthUrl;  // Перенаправляем пользователя для авторизации
});

// После того как Discord перенаправит нас с кодом, получаем токен
async function fetchDiscordUserData(code) {
  const clientId = 'YOUR_DISCORD_CLIENT_ID';
  const clientSecret = 'YOUR_DISCORD_CLIENT_SECRET';
  const redirectUri = 'YOUR_REDIRECT_URI';

  const response = await fetch('/callback', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${code}`
    }
  });

  const data = await response.json();
  if (data.access_token) {
    // Обрабатываем данные пользователя и отображаем календарь
    initCalendar(data);
  }
}

// Основная функция для инициализации календаря
function initCalendar(userData) {
  const currentDay = new Date().getDate();
  const days = document.querySelectorAll('.day');

  // Проверка открытых подарков пользователя
  const openedGifts = userData.openedGifts || [];

  days.forEach((day, index) => {
    const dayNumber = index + 1;

    if (openedGifts.includes(dayNumber)) {
      day.classList.add('opened');
    }

    if (dayNumber > currentDay) {
      day.classList.add('locked');
      day.addEventListener('click', () => {
        alert('Этот день ещё не доступен!');
      });
    } else {
      day.addEventListener('click', () => {
        if (openedGifts.includes(dayNumber)) {
          alert('Вы уже открыли этот подарок!');
        } else {
          // Открытие подарка
          alert('Вы открыли подарок!');
          openedGifts.push(dayNumber);  // Добавляем открытый подарок
          // Сохраняем обновленные данные на сервере или в localStorage
        }
      });
    }
  });
}
