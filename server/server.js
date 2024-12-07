require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

let usersData = {};  // В этом объекте будем хранить информацию о пользователях

// Страница логина через Discord
app.get('/login', (req, res) => {
  const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${DISCORD_REDIRECT_URI}&response_type=code&scope=identify`;
  res.redirect(oauthUrl);
});

// Страница для обработки callback от Discord
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Получаем токен
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', null, {
      params: {
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Получаем информацию о пользователе
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const user = userResponse.data;

    if (!usersData[user.id]) {
      usersData[user.id] = { username: user.username, openedGifts: [] };
    }

    res.json({ user: usersData[user.id] });

  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка авторизации');
  }
});

// Сервер запускаем на порту 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
