console.log("fail ühendatud");

// Entry klass, Siia lisatud juurde priority ja formatDate
class Entry {
    constructor(title, description, date, priority = "Medium") {
        this.title = title;
        this.description = description;
        this.date = this.formatDate(date);
        this.priority = priority;
        this.done = false;
    }

    // Vormindab kuupäeva DD.MM.YYYY kujule, kombineeritud: ChatGPT prompt: javascript for date format from yy-mm-dd to dd-mm-yy.
    // ja link: https://stackoverflow.com/questions/2086744/javascript-function-to-convert-date-yyyy-mm-dd-to-dd-mm-yy
    formatDate(date) {
        if (!date) return "";
        const [year, month, day] = date.split("-");
        return `${day}.${month}.${year}`;
    }

    // Tagastab kuupäeva formaadis, mida saab sorteerida // chatGPT prompt: Write a JavaScript function getSortableDate() that converts a DD.MM.YYYY date string into a timestamp using the Date object
    getSortableDate() {
        const [day, month, year] = this.date.split(".");
        return new Date(`${year}-${month}-${day}`).getTime();
    }
}

// Luuakse taskide prioriteedi valiku dropdown, link: https://medium.com/@mauryaishika100/task-manager-app-a170c0b40327
const prioritySelector = document.createElement("select");
prioritySelector.id = "priority";
prioritySelector.innerHTML = `
    <option value="High">High</option>
    <option value="Medium" selected>Medium</option>
    <option value="Low">Low</option>
`;
document.querySelector("#inputContainer").appendChild(prioritySelector);

// ToDo rakenduse klass, juurde lisatud entry.date 
class Todo {
    constructor() {
        this.entries = JSON.parse(localStorage.getItem("entries")) || [];
        this.entries.forEach(entry => 
            entry.date = new Entry("", "", entry.date).formatDate(entry.date)
        );
        this.editIndex = null;
        document.querySelector("#addButton").addEventListener("click", () => this.addOrUpdateEntry());
        this.render();
    }

    // Lisab uue taski või uuendab olemasolevat (edit), chatGPT prompt: Write a JavaScript function for a ToDo app that allows adding and updating tasks, including title, description, date, and priority. 
    // If a task is being edited, update its values; otherwise, add a new task
    addOrUpdateEntry() {
        const title = document.querySelector("#title").value;
        const description = document.querySelector("#description").value;
        const date = document.querySelector("#date").value;
        const priority = document.querySelector("#priority").value;
        const formattedDate = new Entry("", "", date).formatDate(date);

        // chatGPT prompt: Write a JavaScript function that handles adding or editing entries in an array. If an entry is being edited, 
        // update the existing entry with new values for title, description, date, and priority. If it's a new entry, push a new object into the array. 
        // After saving, clear the form fields (title, description, date, and priority)

        if (this.editIndex !== null) {
            this.entries[this.editIndex].title = title;
            this.entries[this.editIndex].description = description;
            this.entries[this.editIndex].date = formattedDate;
            this.entries[this.editIndex].priority = priority;
            this.editIndex = null;
        } else {
            this.entries.push(new Entry(title, description, date, priority));
        }
        
        this.save();
        document.querySelector("#title").value = "";
        document.querySelector("#description").value = "";
        document.querySelector("#date").value = "";
        document.querySelector("#priority").value = "Medium";
    }

    // Salvestab kirjed localStorage'isse ja uuendab vaadet
    save() {
        localStorage.setItem("entries", JSON.stringify(this.entries));
        this.render();
    }

    // Todo listi ülesehitus lehel
    render() {
        let tasklist = document.querySelector("#taskList");
        tasklist.innerHTML = "";

        const ul = document.createElement("ul");
        const doneUl = document.createElement("ul");
        ul.className = "todo-list";
        doneUl.className = "todo-list";
        const taskHeading = document.createElement("h2");
        const doneHeading = document.createElement("h2");
        taskHeading.innerText = "Todo";
        doneHeading.innerText = "Done tasks";

        // Sorteerib lisatud taskid kuupäeva järgi link: https://stackoverflow.com/questions/23084782/how-sort-array-date-javascript-dd-mm-yyyy
        this.entries.sort((a, b) => {
            const dateA = new Date(a.date.split(".").reverse().join("-")).getTime();
            const dateB = new Date(b.date.split(".").reverse().join("-")).getTime();
            return dateA - dateB;
        });

        // Loob iga taski jaoks HTML elemendid // juurde lisatud editButton ja selle icon
        this.entries.forEach((entryValue, entryIndex) => {
            const li = document.createElement("li");
            const div = document.createElement("div");
            const buttonDiv = document.createElement("div");
            buttonDiv.className = "button-container";
            const deleteButton = document.createElement("button");
            const doneButton = document.createElement("button");
            const editButton = document.createElement("button");
            doneButton.innerText = "✓";
            deleteButton.innerText = "☓";
            editButton.innerText = " ✎";
            deleteButton.className = "delete";
            doneButton.className = "done";
            editButton.className = "edit";

            // Kustutab taski 
            deleteButton.addEventListener("click", () => {
                this.entries.splice(entryIndex, 1);
                this.save();
            });

            // Muudab taski oleku tehtuks (done) 
            doneButton.addEventListener("click", () => {
                this.entries[entryIndex].done = !this.entries[entryIndex].done;
                this.save();
            });

            // Redigeerib muudetud taski // chatgpt prompt: JavaScript ToDo list edit button prefill form fields before updating task
            editButton.addEventListener("click", () => {
                document.querySelector("#title").value = this.entries[entryIndex].title;
                document.querySelector("#description").value = this.entries[entryIndex].description;
                document.querySelector("#date").value = this.entries[entryIndex].date.split(".").reverse().join("-");
                document.querySelector("#priority").value = this.entries[entryIndex].priority;
                this.editIndex = entryIndex;
            });

            // lisatud juurde entryValue.priority
            div.className = "task";
            div.innerHTML = `<div>${entryValue.title}</div><div>${entryValue.description}</div>
                <div>${entryValue.date}</div><div>Priority: ${entryValue.priority}</div>`;

            if (this.entries[entryIndex].done) {
                doneButton.classList.add("done-task");
                doneUl.appendChild(li);
            } else {
                ul.appendChild(li);
            }

            // juurde lisatud editButton
            li.appendChild(div);
            li.appendChild(buttonDiv);
            buttonDiv.appendChild(deleteButton);
            buttonDiv.appendChild(doneButton);
            buttonDiv.appendChild(editButton);
        });

        tasklist.appendChild(taskHeading);
        tasklist.appendChild(ul);
        tasklist.appendChild(doneHeading);
        tasklist.appendChild(doneUl);
    }
}


const todo = new Todo();

