// Get html elements
const columnsElem = document.querySelector('.columns');
const columnElemList = document.querySelectorAll('.column');
const newColumnElem = document.querySelector('[data-action-addColumn]');

// Varables
let noteIdCounter = 8; // Get amount existing of cards
let columnIdCounter = 4; // Get amount existing of columns

// Add new cards to the colomn and edit column and cards
function columnProcess(columnElement) {
    const spanAction_addNote = columnElement.querySelector('[data-action-addNote]');
    spanAction_addNote.addEventListener('click', function () {
        const dataNotes = columnElement.querySelector('[data-notes]');
        // Create a new note
        const noteElement = `
                            <div class="note" data-note-id="${noteIdCounter}" draggable="true" contenteditable="true"></div>
                            `;
        dataNotes.insertAdjacentHTML('beforeend', noteElement);
        dataNotes.lastElementChild.focus();
        noteIdCounter++; 
        // Add text to the new card
        noteProcess(dataNotes.lastElementChild);
    });
    // Edit the title of the column
    const headerElement = columnElement.querySelector('.column-header');
    noteProcess(headerElement);
}
// Edit cards
function noteProcess(noteElement) {
    noteElement.addEventListener('dblclick', function () {
        noteElement.setAttribute('contenteditable', 'true');
        noteElement.removeAttribute('draggable');
        noteElement.closest('.column').removeAttribute('draggable');
        noteElement.focus();
        if (noteElement.textContent.trim() === 'Новая колонка') {
            noteElement.textContent = '';
        }
    });

    noteElement.addEventListener('blur', unfocusElem);
    noteElement.addEventListener('keyup', function (event) {
        if (event.ctrlKey && (event.keyCode === 13)) {
            unfocusElem();
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


// Create a new card
columnElemList.forEach(columnProcess);

// Create a new column
newColumnElem.addEventListener('click', function() {
    const columnElement = `
                        <div class="column" data-column-id="${columnIdCounter}" draggable="true">
                            <p class="column-header">Новая колонка</p>
                            <div data-notes></div>
                            <p class="column-footer">
                                 <span data-action-addNote class="action">+ Добавить карточку</span>
                            </p>
                        </div>
                        `;
    columnsElem.insertAdjacentHTML('beforeend', columnElement);
    columnIdCounter++;
    // Add the new card to the new column
    columnProcess(columnsElem.lastElementChild);
});

// Edit existing cards
const noteElemList = document.querySelectorAll('.note');
noteElemList.forEach(noteProcess);