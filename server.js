const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

const clientId = 'YOUR_DISCORD_CLIENT_ID'; // Замените на свой Client ID
const clientSecret = 'YOUR_DISCORD_CLIENT_SECRET'; // Замените на свой Client Secret
const redirectUri = 'http://localhost:3000/callback'; // URL для перенаправления после авторизации

// Для сервера, чтобы обслуживать статические файлы
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Страница callback, куда Discord перенаправляет пользователя
app.get('/callback', async (req, res) => {
  const code = req.query.code; // Код авторизации

  if (!code) {
    return res.send('Ошибка авторизации');
  }

  try {
    // Обмен кода на токен
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      scope: 'identify',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Получаем данные о пользователе
    const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;

    // Перенаправляем на главную страницу с данными пользователя
    res.redirect(`/?user=${encodeURIComponent(JSON.stringify(userData))}`);

  } catch (error) {
    console.error(error);
    res.send('Ошибка при получении данных пользователя');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
