const themeBtn = document.getElementById('themechanger');
const body = document.body;
const pizzaList = document.getElementById('pizza-list');
const header = document.querySelector('header');
const savedTheme = localStorage.getItem('theme') || 'light-theme';
body.classList.add(savedTheme);

function switchTheme() {
  const newTheme = body.classList.contains('light-theme') ? 'dark-theme' : 'light-theme';
  body.classList.remove('light-theme', 'dark-theme');
  header.classList.remove('light-theme', 'dark-theme');
  body.classList.add(newTheme);
  header.classList.add(newTheme);
  localStorage.setItem('theme', newTheme);
}

themeBtn.addEventListener('click', switchTheme);

async function loadPizzas() {
  try {
    const response = await fetch('https://shift-intensive.ru/api/pizza/catalog');
    if (!response.ok) throw new Error(`Ошибка загрузки данных: ${response.statusText}`);

    const data = await response.json();
    console.log(data);

    const pizzas = data.catalog;

    if (!pizzas || !Array.isArray(pizzas)) {
      throw new Error('Данные о пиццах не найдены или имеют неправильный формат.');
    }

    pizzaList.innerHTML = '';
    pizzas.forEach(pizza => {
    
      const sizesWithPrices = pizza.sizes.map(size => ({ type: size.type, price: size.price }));
      const minPriceObj = sizesWithPrices.reduce((min, current) => 
        min.price < current.price ? min : current
      );
      const minPrice = minPriceObj.price;
      const minSize = minPriceObj.type;

     
      const toppings = [...new Set(pizza.toppings.map(topping => ({
        type: topping.type,
        price: topping.price,
        img: topping.img
      })))];


      const pizzaData = {
        ...pizza,
        minPrice,
        minSize,
        toppings
      };

      const pizzaItem = document.createElement('div');
      pizzaItem.className = "pizza-card p-4 bg-white justify-between min-h-[270px] flex flex-col";

      pizzaItem.innerHTML = `
        <img src="https://shift-intensive.ru/api${pizza.img}" alt="${pizza.name}" class="mx-auto mb-2 rounded-full w-30 h-30 object-cover">
        <div class="text-left flex-grow">
          <h3 class="text-lg font-semibold text-gray-800">${pizza.name}</h3>
          <p class="text-gray-600 dark:text-gray-400">${pizza.description}</p>
          <p class="text-xl font-bold mt-2 text-gray-800">от ${minPrice} ₽</p>
        </div>
        <button class="bg-orange-600 text-white px-20 py-3 rounded-xl block mx-auto text-sm choose-btn" data-pizza='${JSON.stringify(pizzaData)}'>Выбрать</button>
      `;

      pizzaList.appendChild(pizzaItem);
    });
    pizzaList.style.display = 'flex';
    pizzaList.style.flexWrap = 'wrap';
    pizzaList.style.justifyContent = 'start';

    // Add event listeners to "Выбрать" buttons after they are created
    document.querySelectorAll('.choose-btn').forEach(button => {
      button.addEventListener('click', openModal);
    });
  } catch (error) {
    console.error('Ошибка:', error);
    pizzaList.innerHTML = '<p>Ошибка загрузки меню</p>';
  }
}

function openModal(event) {
  const pizza = JSON.parse(event.target.getAttribute('data-pizza'));
  const modal = document.createElement('div');
  modal.className = 'modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="modal-content bg-white p-6 rounded-lg w-[80%] max-w-lg relative" style="max-height: 100vh; overflow-y: auto;">
      <span class="close-button absolute top-2 right-2 text-2xl cursor-pointer">×</span>
      <h2 class="text-xl font-bold mb-4">${pizza.name}</h2>
      <p class="mb-4">${pizza.description} <br> Размер: ${pizza.minSize.toLowerCase()}</p>
<img src="https://shift-intensive.ru/api${pizza.img}" alt="${pizza.name}" class="mx-auto mb-4 rounded-full w-32 h-32 object-cover">
      <div class="grid grid-cols-3 gap-8 mb-4">
        ${pizza.toppings.map(topping => `
          <div class="flex flex-col items-center rounded-lg shadow">
            <img src="https://shift-intensive.ru/api${topping.img}" alt="${topping.type}" class="w-16 h-16 object-cover mb-2 rounded">
            <button class="p-2 rounded">${topping.type.replace('_', ' ').toLowerCase()}<br>${topping.price} ₽</button>
          </div>
        `).join('')}
      </div>
      <button class="bg-orange-600 text-white px-4 py-2 rounded w-full">Добавить в корзину</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Close modal when "×" is clicked
  modal.querySelector('.close-button').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

document.addEventListener('DOMContentLoaded', loadPizzas);
