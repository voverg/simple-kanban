let noteIdCounter = 8;
let columnIdCounter = 4;

// Добавляем новую карточку
document.querySelectorAll('.column').forEach(columnProcess);

// Добавляем новую колонку с карточками
document.querySelector('[data-action-addColumn]').addEventListener('click', function(event) {
        const columnElement = document.createElement('div');
        columnElement.classList.add('column');
        columnElement.setAttribute('draggable', 'true');
        columnElement.setAttribute('data-column-id', columnIdCounter);

        columnElement.innerHTML = 
            `<p class="column-header">Новая колонка</p>
            <div data-notes></div>
            <p class="column-footer">
                <span data-action-addNote class="action">+ Добавить карточку</span>
            </p>`

        columnIdCounter++; // Увеличиваем data-column-id
        document.querySelector('.columns').append(columnElement); // Добавляем новую колонку
        // Добавляем новую карточку в новую созданную колонку
        columnProcess(columnElement);
    });

// Редактируем существующие карточки
document.querySelectorAll('.note').forEach(noteProcess);

// Функция добавления новой карточки в колонке
function columnProcess(columnElement) {
    const spanAction_addNote = columnElement.querySelector('[data-action-addNote]');
    spanAction_addNote.addEventListener('click', function (event) {
        // Создаём новую заметку
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.setAttribute('draggable', 'true');
        noteElement.setAttribute('data-note-id', noteIdCounter);

        noteIdCounter++; // Увеличиваем data-note-id
        columnElement.querySelector('[data-notes').append(noteElement); // Добавляем новую заметку
        // Редактирование новой карточки
        noteProcess(noteElement);

        noteElement.setAttribute('contenteditable', 'true');
        noteElement.focus();
    });
    // Редактирование заголовков карточек
    const headerElement = columnElement.querySelector('.column-header');
    headerElement.addEventListener('dblclick', function(event) {
    headerElement.setAttribute('contenteditable', 'true');
    headerElement.focus();
    });
    headerElement.addEventListener('blur', function(event) {
        headerElement.removeAttribute('contenteditable');
        if (!headerElement.textContent.trim().length) {
            headerElement.textContent = 'Новая колонка';
        }
    });
}
// Функция редактирования карточек
function noteProcess(noteElement) {
    noteElement.addEventListener('dblclick', function(event) {
        noteElement.setAttribute('contenteditable', 'true');
        noteElement.removeAttribute('draggable');
        noteElement.closest('.column').removeAttribute('draggable');
        noteElement.focus();
    });
    noteElement.addEventListener('blur', function(event) {
        noteElement.removeAttribute('contenteditable');
        noteElement.setAttribute('draggable', 'true');
        noteElement.closest('.column').setAttribute('draggable', 'true');
        if (!noteElement.textContent.trim().length) {
            noteElement.remove();
        }
    });
}