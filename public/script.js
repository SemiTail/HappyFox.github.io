// Настройки для OAuth2
const clientId = '1314768632667963502'; // Замените на свой Client ID
const redirectUri = 'https://discord.com/oauth2/authorize?client_id=1314768632667963502&response_type=code&redirect_uri=https%3A%2F%2Fsemitail.github.io%2FHappyFox.github.io%2F&scope=identify'; // URL перенаправления после авторизации

// Функция для отправки пользователя на страницу авторизации Discord
function loginWithDiscord() {
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;
  window.location.href = discordAuthUrl; // Перенаправляем пользователя на Discord
}

// Обработка данных пользователя после авторизации
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const userData = urlParams.get('user');
  if (userData) {
    const user = JSON.parse(decodeURIComponent(userData));
    document.getElementById('user-card').style.display = 'block';
    document.getElementById('discord-login').style.display = 'none';
    document.getElementById('username').textContent = `Привет, ${user.username}!`;
    document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    document.getElementById('greeting').textContent = 'С Новым годом!';
  } else {
    document.getElementById('discord-login').style.display = 'block';
  }

  // Слушаем нажатие на кнопку логина через Discord
  document.getElementById('discord-login-btn').addEventListener('click', loginWithDiscord);
};
