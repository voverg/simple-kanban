// Get html elements
const columnsElem = document.querySelector('.columns');
const columnElemList = document.querySelectorAll('.column');
const newColumnElem = document.querySelector('[data-action-addColumn]');

// Varables
let columnIdCounter = 4;
let noteIdCounter = 8;

// Create a new column
function createColumn() {
    const columnElement = `
                        <div class="column" data-column-id="${columnIdCounter}" draggable="true">
                            <p class="column-header" tabindex="-1" contenteditable="true"></p>
                            <span class="close">x</span>
                            <div data-notes></div>
                            <p class="column-footer">
                                 <span data-action-addNote class="action">+ Добавить карточку</span>
                            </p>
                        </div>
                        `;
    columnsElem.insertAdjacentHTML('beforeend', columnElement);
    columnIdCounter++;
    // Edit title of the column
    const columnHeaderElem = columnsElem.lastElementChild.querySelector('.column-header');
    columnHeaderElem.focus();
    editNote(columnHeaderElem);
    // Add the new card to the new column
    createCard(columnsElem.lastElementChild);
    // Delete the column
    const closeButton = columnsElem.lastElementChild.querySelector('.close');
    closeButton.addEventListener('click', () => {
        removeElem(columnsElem.lastElementChild);
    })
}

// Create a new card
function createCard(columnElement) {
    const newCard = columnElement.querySelector('[data-action-addNote]');
    newCard.addEventListener('click', function () {
        const dataNotes = columnElement.querySelector('[data-notes]'); // Card container
        const noteElement = `
                            <div class="note" data-note-id="${noteIdCounter}" draggable="true" contenteditable="true"></div>
                            `;
        dataNotes.insertAdjacentHTML('beforeend', noteElement);
        dataNotes.lastElementChild.focus();
        noteIdCounter++; 
        // Edit text to the new card
        editNote(dataNotes.lastElementChild);
    });
}

// Edit card or column note
function editNote(noteElement) {
    noteElement.addEventListener('click', function () {
        noteElement.setAttribute('contenteditable', 'true');
        noteElement.removeAttribute('draggable');
        noteElement.closest('.column').removeAttribute('draggable');
        noteElement.focus();
        if (noteElement.textContent.trim() === 'Новая колонка') {
            noteElement.textContent = '';
        }
    });

    noteElement.addEventListener('blur', unfocusElem);
    noteElement.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            noteElement.blur();
        }
    })

    function unfocusElem () {
        noteElement.removeAttribute('contenteditable');
        noteElement.setAttribute('draggable', 'true');
        noteElement.closest('.column').setAttribute('draggable', 'true');
        if (!noteElement.textContent.trim().length) {
            if (noteElement.classList.contains('column-header')) {
                noteElement.textContent = 'Новая колонка';
            } else {
                noteElement.remove();
            }
        }
    }
}

// Delete column
function removeElem(elem) {
    const headerText = elem.querySelector('.column-header').textContent;
    const res = confirm(`Точно хочешь удалить колонку ${headerText.toUpperCase()}?`);
    if (res) {
        elem.remove();
    }
}


// Add a new card to existing columns in the start
columnElemList.forEach(createCard);
// Delete existing columns
columnElemList.forEach(elem => {
    const closeBtn = elem.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        removeElem(elem);
    });
});
// Create a new column
newColumnElem.addEventListener('click', createColumn);



// ----------------------Delete when the app will be ready ----------------------------------------
// Edit existing cards in the start
const noteElemList = document.querySelectorAll('.note');
noteElemList.forEach(editNote);