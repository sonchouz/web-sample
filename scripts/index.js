const themeBtn = document.getElementById('themechanger');
const body = document.body;
const pizzaList = document.getElementById('pizza-list');
const savedTheme = localStorage.getItem('theme') || 'light-theme';
body.classList.add(savedTheme);


function switchTheme() {
  const newTheme = body.classList.contains('light-theme') ? 'dark-theme' : 'light-theme';
  body.classList.remove('light-theme', 'dark-theme');
  body.classList.add(newTheme);
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
      const pizzaItem = document.createElement('div');
      pizzaItem.className = "pizza-card p-8 bg-white justify-between min-h-[400px] flex flex-col"; 

      pizzaItem.innerHTML = `
        <img src="${pizza.img}" alt="${pizza.name}" class="mx-auto mb-2 rounded-full w-30 h-30 object-cover"> 
        <div class="text-left flex-grow">
          <h3 class="text-lg font-semibold text-gray-800">${pizza.name}</h3>
          <p class="text-gray-600 dark:text-gray-400">${pizza.description}</p>
          <p class="text-xl font-bold mt-2 text-gray-800">от 289 ₽</p>
        </div>
        <button class="mt-4 bg-orange-600 text-white px-20 py-3 rounded-xl block mx-auto text-sm">Выбрать</button>
      `;
      
      pizzaList.appendChild(pizzaItem);
    });
    pizzaList.style.display = 'flex';
    pizzaList.style.flexWrap = 'wrap';
    pizzaList.style.justifyContent = 'start';
  } catch (error) {
    console.error('Ошибка:', error);
    pizzaList.innerHTML = '<p>Ошибка загрузки меню</p>';
  }
}



document.addEventListener('DOMContentLoaded', loadPizzas);
