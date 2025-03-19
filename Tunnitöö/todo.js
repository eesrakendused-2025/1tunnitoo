console.log("fail ühendatud")

class Entry{
    constructor(title, description, date, priority){
        this.title = title;
        this.description = description;
        this.date = date;
        this.done = false;
        this.priority = priority;
    }
}

class Todo{
    constructor(){
        this.entries = JSON.parse(localStorage.getItem("entries")) || [];
        document.querySelector("#addButton").addEventListener("click", () => {this.addEntry()});
        this.render(); 
    }

    addEntry(){
        console.log("nupulevajutus tehtud")
        const titleValue = document.querySelector("#title").value;
        const descriptionValue = document.querySelector("#description").value;
        const dateValue = document.querySelector("#date").value;
        const priorityValue = document.querySelector("#priority").value;

        if (!dateValue) return alert("Palun vali kuupäev");

        this.entries.push(new Entry(titleValue, descriptionValue, dateValue, priorityValue));

        console.log(this.entries);

        this.save();
    }

    render(){
        let tasklist = document.querySelector("#taskList");
        if (document.querySelector(".todo-list")){
            document.querySelector('#taskList').removeChild(document.querySelector('.todo-list'));
        }
        tasklist.innerHTML ="";
        const ul = document.createElement("ul");
        const doneul = document.createElement("ul");
        ul.className = "todo-list";
        doneul.className = "todo-list";
        const taskHeading = document.createElement("h2")
        const doneHeading = document.createElement("h2")
        taskHeading.innerText = "TODO";
        doneHeading.innerText = "DONE";

        this.entries.sort((a, b) => new Date(a.date) - new Date(b.date));

        this.entries.forEach((entryValue, entryIndex) => {
            const li = document.createElement("li");
            const div = document.createElement("div");
            const buttonDiv = document.createElement("div");
            buttonDiv.className = "button-container";
            const deleteButton = document.createElement("button");
            const doneButton = document.createElement("button");
            const editButton = document.createElement("button");
            const editSaveButton = document.createElement("button");
            doneButton.innerText = "✓";
            deleteButton.innerText = "X";
            deleteButton.className = "delete";
            doneButton.className="done";
            editButton.innerHTML = "muuda";
            editButton.className="edit";
            editSaveButton.innerHTML ="Salvesta";
            editSaveButton.className = "saveEdit"

            deleteButton.addEventListener("click", ()=>{
                this.entries.splice(entryIndex, 1);
                this.save();
            });
            doneButton.addEventListener("click", ()=>{
                if(this.entries[entryIndex].done){
                    this.entries[entryIndex].done = false;
                }else{
                    this.entries[entryIndex].done = true;   
                }
                this.save();
            });
            editButton.addEventListener("click", ()=>{
                console.log(entryIndex);
                let title = prompt("Pealkiri:",
                    this.entries[entryIndex].title); 
                let description = prompt("Kirjeldus:",
                    this.entries[entryIndex].description);
                let date = prompt("Kuupäev:",
                    this.entries[entryIndex].date);
                this.entries[entryIndex] = {title, description, date}
                localStorage.setItem("entries", JSON.stringify(this.entries));
                this.save();
            });
            div.className="task";
            div.innerHTML = `<div>${entryIndex + 1}</div><div>${entryValue.title}
            </div><div>${entryValue.description}</div><div>${this.formatDate(entryValue.date)}</div><div>${entryValue.priority}</div>`;

            if(this.entries[entryIndex].done){
                doneButton.classList.add("done-task");
                doneul.appendChild(li);
            }else{
                ul.appendChild(li);
            }

            //ul.appendChild(li); see ei lasknud muutuda tehtud task-il DONE alla...
            li.appendChild(div);
            li.appendChild(buttonDiv);
            buttonDiv.appendChild(deleteButton);
            buttonDiv.appendChild(doneButton);
            buttonDiv.appendChild(editButton);
        });

        tasklist.appendChild(taskHeading);
        tasklist.appendChild(ul);
        tasklist.appendChild(doneHeading);
        tasklist.appendChild(doneul);

    }

    save(){
        localStorage.setItem("entries", JSON.stringify(this.entries));
        this.render();
    }
    formatDate(dateString) {
        let [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    }
}

const todo = new Todo;