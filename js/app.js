const placeholderList = document.querySelectorAll('.placeholder');
const addBtnList = document.querySelector('#add-btn-list');

let currentCard = null;
let data = getDataFromLocalStorage();

render();

// LocalStorage
function getDataFromLocalStorage() {
  const tmpData = localStorage.getItem('appData');
  if (tmpData) {
    const appData = JSON.parse(tmpData);

    return appData;
  } else {
    return {
      '0': [
        {text: 'Схватите карточку курсором мыши, кликнув по ней. И не отпуская клик, перетащите в нужный столбец или на нужную карточку. Отпустите клик мыши, карточка переместится в нужный столбец, либо на место другой карточки.'},
      ],
      '1': [
        {text: 'Чтобы отредактировать карточку, дважды кликните по ней'},
        {text: 'Чтобы зарешить редактирование, нажмите Ctrl+Enter (или просто кликните по другой карточки или любому свободному месту'},
      ],
      '2': [
        {text: 'Чтобы удалить карточку, перетащите её за пределы колонок'}
      ]
    };
  }
}

function setDataToLocalStorage() {
  localStorage.setItem('appData', JSON.stringify(data));
}

// Render block
function render() {
  clearPlaceholders();

  Object.keys(data).forEach((colId) => {
    const cardList = data[colId];
    cardList.forEach((cardData, rowId) => {
      addCard(cardData, colId, rowId);
    });
  });
}

function clearPlaceholders() {
  placeholderList.forEach((placeholder) => {
    placeholder.innerHTML = '';
  });
}

// Работа с массивом data
function setCard({col, row, text}, edit = false) {
  const card = {text};
  const colLen = getPlaceholderById(col).children.length;

  if ((+row === colLen - 1) && !edit) {
    data[col].push(card);
  } else if (edit) {
    data[col].splice(row, 1, card);
  } else {
    data[col].splice(row, 0, card);
  }

  setDataToLocalStorage();
  render();
}

function deleteCurrentCard() {
  const {col, row} = getCardData(currentCard);
  data[col].splice(row, 1);

  setDataToLocalStorage();
  render();
}

function setData({currentCol, currentRow, nextCol, nextRow}) {
  if (currentCol === nextCol && currentRow === nextRow) {
    return;
  } else {
    const cardData = {col: nextCol, row: nextRow, text: currentCard.textContent};
    deleteCurrentCard();
    setCard(cardData);
  }

  setDataToLocalStorage()
  render()
}

// Listeners
document.addEventListener('dragstart', dragstart);
document.addEventListener('dragend', dragend);
document.addEventListener('dragover', dragover);
document.addEventListener('dragenter', dragenter);
document.addEventListener('dragleave', dragleave);
document.addEventListener('drop', dragDrop);

document.addEventListener('dblclick', editCard);
addBtnList.addEventListener('click', prepareNewCard);

// Реализация dran-n-drop
function dragstart(event) {
  const target = event.target;
  if (!isCard(target)) return;

  target.classList.add('hold');
  setTimeout(() => target.classList.add('hide'), 0);
  currentCard = target;
}

function dragend(event) {
  const target = event.target;
  if (!isCard(target)) return;

  target.classList.remove('hold', 'hide');
  currentCard = target;
}

function dragover(event) {
  event.preventDefault();
}

function dragenter(event) {
  event.preventDefault();
  const target = event.target;
  if (isPlaceholder(target)) {
    target.classList.add('hovered');
  } else if (isCard(target)) {
    if (target === currentCard) return;

    target.classList.add('hovered');
  }
}

function dragleave(event) {
  const target = event.target;
  if (isPlaceholder(target)) {
    target.classList.remove('hovered');
  } else if (isCard(target)) {
    target.classList.remove('hovered');
  }
}

function dragDrop(event) {
  const target = event.target;
  if (isPlaceholder(target)) {
    const parentEl = target;
    const childEl = target.children[target.children.length - 1];

    target.classList.remove('hovered');
    setData(getColsAndRows(parentEl, childEl));
  } else if (isCard(target)) {
    const parentEl = target.closest('.placeholder');
    const childEl = target;

    target.classList.remove('hovered');
    setData(getColsAndRows(parentEl, childEl));
  } else if (target.dataset.trash) {
    deleteCurrentCard();
  }
}


// Подготовка данные для добавления новой карточки через кнопку Добавить
function prepareNewCard(event) {
  const target = event.target;
  if (!target.classList.contains('add-card')) return;

  const placeholderId = target.dataset.id;
  const placeholderEl = getPlaceholderById(placeholderId);

  const col = placeholderEl.dataset.id;
  const row = placeholderEl.children.length.toString();
  const text = 'Новая заметка';

  const cardData = {col, row, text};
  setCard(cardData);
}

// -------------- Работа с DOM-элементами -----------------------------
// Добавление карточки в placeholder по полученным данным из любого места
function addCard(cardData, colId, rowId) {
  const cardEl = createCard(cardData, colId, rowId);
  const placeholderEl = getPlaceholderById(colId);
  placeholderEl.append(cardEl);
}

function createCard({text}, colId, rowId) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('draggable', 'true');
  // card.setAttribute('tabindex', '0');
  card.dataset.col = colId;
  card.dataset.row = rowId;
  card.textContent = text;

  return card;
}

// Редактирование карточки
function editCard(event) {
  const card = event.target;
  if (!isCard(card)) return;

  card.setAttribute('contenteditable', true);
  card.focus();

  card.addEventListener('focusout', stopEditCard);
  card.addEventListener('keydown', keyHandler);

  function keyHandler(event) {
    if (event.key === 'Enter' && event.ctrlKey === true) {
      card.removeEventListener('focusout', stopEditCard);
      event.preventDefault();
      stopEditCard(event);
      card.removeEventListener('keydown', keyHandler);
    }
  }
}

function stopEditCard(event) {
  const card = event.target;
  card.blur();
  card.removeAttribute('contenteditable');

  const cardData = getCardData(card);
  setCard(cardData, edit = true);
}

// ---------------- Вспомогательные функции-утилиты ------------------
function isPlaceholder(target) {
  if (target.classList.contains('placeholder')) {
    return true;
  }
}

function isCard(target) {
  if (target.classList.contains('card')) {
    return true;
  }
}

function getPlaceholderById(placeholderId) {
  return document.querySelector(`.placeholder[data-id="${placeholderId}"]`);
}

function getCardData(card) {
  const {col, row} = card.dataset;
  const text = card.textContent;

  return {col, row, text};
}

function getColsAndRows(parentEl, childEl) {
  const currentCol = currentCard.dataset.col;
  const currentRow = currentCard.dataset.row;
  const nextCol = parentEl.dataset.id;
  const nextRow = childEl ? childEl.dataset.row : '0';

  return {currentCol, currentRow, nextCol, nextRow};
}
