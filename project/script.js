/*
==========================================================
LIFE PLANNER AI
SCRIPT.JS
PART 1
==========================================================
*/

"use strict";

/*
==========================================================
APPLICATION
==========================================================
*/

const App = {

    name: "Life Planner AI",

    version: "1.0.0",

    initialized: false,

    currentPage: "dashboard",

    loading: true,

    darkMode: true

};

/*
==========================================================
APPLICATION DATA
==========================================================
*/

const Database = {

    tasks: [],

    goals: [],

    habits: [],

    projects: [],

    notes: [],

    journal: [],

    memories: [],

    calendar: [],

    finance: [],

    health: [],

    learning: [],

    documents: [],

    notifications: []

};

/*
==========================================================
DOM
==========================================================
*/

const DOM = {

    sidebar: document.getElementById("sidebar"),

    menuButton: document.getElementById("menuToggle"),

    pageTitle: document.getElementById("currentPageTitle"),

    loadingScreen: document.getElementById("loadingScreen"),

    floatingButton: document.getElementById("floatingActionButton"),

    quickMenu: document.getElementById("quickCreateMenu"),

    notificationCenter: document.getElementById("notificationCenter"),

    commandPalette: document.getElementById("commandPalette"),

    commandSearch: document.getElementById("commandSearch")

};

/*
==========================================================
HELPERS
==========================================================
*/

function $(selector){

    return document.querySelector(selector);

}

function $$(selector){

    return document.querySelectorAll(selector);

}

function createElement(tag){

    return document.createElement(tag);

}

function randomID(){

    return Math.random().toString(36).substring(2,12);

}

function currentDate(){

    return new Date();

}

/*
==========================================================
LOCAL STORAGE
==========================================================
*/

function saveDatabase(){

    localStorage.setItem(

        "lifePlanner",

        JSON.stringify(Database)

    );

}

function loadDatabase(){

    const data = localStorage.getItem("lifePlanner");

    if(data){

        Object.assign(

            Database,

            JSON.parse(data)

        );

    }

}

/*
==========================================================
NAVIGATION
==========================================================
*/

function hideAllPages(){

    $$(".application-page").forEach(page=>{

        page.style.display="none";

    });

}

function showPage(pageID){

    hideAllPages();

    const page=document.getElementById(pageID);

    if(page){

        page.style.display="block";

    }

    App.currentPage=pageID;

}

function activateNavigation(){

    const items=$$("#mainNavigation li");

    items.forEach(item=>{

        item.addEventListener("click",()=>{

            items.forEach(i=>{

                i.classList.remove("active");

            });

            item.classList.add("active");

            const page=item.dataset.page;

            if(page){

                showPage(page+"Page");

            }

        });

    });

}

/*
==========================================================
LOADING
==========================================================
*/

function finishLoading(){

    if(!DOM.loadingScreen) return;

    DOM.loadingScreen.style.opacity="0";

    DOM.loadingScreen.style.visibility="hidden";

    App.loading=false;

}

/*
==========================================================
INITIALIZE
==========================================================
*/

function initialize(){

    loadDatabase();

    activateNavigation();

    showPage("dashboard");

    setTimeout(()=>{

        finishLoading();

    },1000);

    App.initialized=true;

}

/*
==========================================================
START
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    initialize

);
/*
==========================================================
SIDEBAR
==========================================================
*/

function toggleSidebar(){

    if(!DOM.sidebar) return;

    DOM.sidebar.classList.toggle("active");

}

if(DOM.menuButton){

    DOM.menuButton.addEventListener(

        "click",

        toggleSidebar

    );

}

/*
==========================================================
FLOATING MENU
==========================================================
*/

function openQuickMenu(){

    if(!DOM.quickMenu) return;

    DOM.quickMenu.style.display="flex";

}

function closeQuickMenu(){

    if(!DOM.quickMenu) return;

    DOM.quickMenu.style.display="none";

}

function toggleQuickMenu(){

    if(!DOM.quickMenu) return;

    if(DOM.quickMenu.style.display==="flex"){

        closeQuickMenu();

    }else{

        openQuickMenu();

    }

}

if(DOM.floatingButton){

    DOM.floatingButton.addEventListener(

        "click",

        toggleQuickMenu

    );

}

/*
==========================================================
NOTIFICATIONS
==========================================================
*/

function notification(

    title,

    message,

    type="info"

){

    if(!DOM.notificationCenter) return;

    const card=createElement("div");

    card.className="notification-item";

    card.innerHTML=`

        <div class="notification-icon"></div>

        <div class="notification-content">

            <h4>${title}</h4>

            <p>${message}</p>

        </div>

    `;

    if(type==="success"){

        card.style.borderLeftColor="#22c55e";

    }

    if(type==="warning"){

        card.style.borderLeftColor="#f59e0b";

    }

    if(type==="error"){

        card.style.borderLeftColor="#ef4444";

    }

    DOM.notificationCenter.appendChild(card);

    Database.notifications.push({

        id:randomID(),

        title,

        message,

        type,

        date:currentDate()

    });

    saveDatabase();

    setTimeout(()=>{

        card.remove();

    },5000);

}

/*
==========================================================
TOASTS
==========================================================
*/

function toast(message){

    const container=document.getElementById("toastContainer");

    if(!container) return;

    const item=createElement("div");

    item.className="toast";

    item.innerText=message;

    container.appendChild(item);

    setTimeout(()=>{

        item.remove();

    },3500);

}

/*
==========================================================
COMMAND PALETTE
==========================================================
*/

function openCommandPalette(){

    if(!DOM.commandPalette) return;

    DOM.commandPalette.style.display="block";

    if(DOM.commandSearch){

        DOM.commandSearch.focus();

    }

}

function closeCommandPalette(){

    if(!DOM.commandPalette) return;

    DOM.commandPalette.style.display="none";

}

document.addEventListener(

    "keydown",

    event=>{

        if(event.ctrlKey && event.key==="k"){

            event.preventDefault();

            openCommandPalette();

        }

        if(event.key==="Escape"){

            closeCommandPalette();

            closeQuickMenu();

        }

    }

);

/*
==========================================================
PAGE TITLE
==========================================================
*/

function setPageTitle(title){

    if(DOM.pageTitle){

        DOM.pageTitle.innerText=title;

    }

    document.title=

        title+

        " | "+

        App.name;

}

/*
==========================================================
PAGE OBSERVER
==========================================================
*/

function updateCurrentPage(page){

    const titles={

        dashboard:"Dashboard",

        tasks:"Tasks",

        calendar:"Calendar",

        goals:"Goals",

        habits:"Habits",

        journal:"Journal",

        notes:"Notes",

        projects:"Projects",

        learning:"Learning",

        health:"Health",

        finance:"Finance",

        documents:"Documents",

        ai:"AI Assistant",

        settings:"Settings"

    };

    if(titles[page]){

        setPageTitle(

            titles[page]

        );

    }

}
/*
==========================================================
TASK MANAGER
==========================================================
*/

function createTask(

    title,

    description="",

    priority="Medium"

){

    const task={

        id:randomID(),

        title,

        description,

        priority,

        completed:false,

        created:currentDate()

    };

    Database.tasks.push(task);

    saveDatabase();

    renderTasks();

    notification(

        "Task Created",

        title,

        "success"

    );

}

function deleteTask(id){

    Database.tasks=

        Database.tasks.filter(

            task=>task.id!==id

        );

    saveDatabase();

    renderTasks();

}

function toggleTask(id){

    const task=

        Database.tasks.find(

            task=>task.id===id

        );

    if(!task) return;

    task.completed=

        !task.completed;

    saveDatabase();

    renderTasks();

}

function renderTasks(){

    const container=

        document.getElementById(

            "taskList"

        );

    if(!container) return;

    container.innerHTML="";

    Database.tasks.forEach(task=>{

        const card=createElement("article");

        card.className="task-item";

        card.innerHTML=`

            <div class="task-checkbox">

                <input

                    type="checkbox"

                    ${task.completed?"checked":""}

                >

            </div>

            <div class="task-content">

                <h3>${task.title}</h3>

                <p>${task.description}</p>

            </div>

            <div class="task-priority">

                ${task.priority}

            </div>

        `;

        const checkbox=

            card.querySelector(

                "input"

            );

        checkbox.addEventListener(

            "change",

            ()=>{

                toggleTask(task.id);

            }

        );

        container.appendChild(card);

    });

}

/*
==========================================================
QUICK TASK FORM
==========================================================
*/

function initializeQuickTask(){

    const form=

        document.getElementById(

            "quickTaskForm"

        );

    if(!form) return;

    form.addEventListener(

        "submit",

        event=>{

            event.preventDefault();

            const title=

                document.getElementById(

                    "quickTaskTitle"

                ).value.trim();

            const priority=

                document.getElementById(

                    "quickTaskPriority"

                ).value;

            if(title===""){

                toast(

                    "Enter a task title."

                );

                return;

            }

            createTask(

                title,

                "",

                priority

            );

            form.reset();

        }

    );

}

/*
==========================================================
TASK COUNTERS
==========================================================
*/

function updateTaskCounters(){

    const total=

        document.getElementById(

            "taskTotalCount"

        );

    const today=

        document.getElementById(

            "tasksToday"

        );

    const completed=

        document.getElementById(

            "tasksCompleted"

        );

    if(total){

        total.innerText=

            Database.tasks.length;

    }

    if(completed){

        completed.innerText=

            Database.tasks.filter(

                task=>task.completed

            ).length;

    }

    if(today){

        today.innerText=

            Database.tasks.filter(

                task=>!task.completed

            ).length;

    }

}

/*
==========================================================
AUTO REFRESH
==========================================================
*/

setInterval(()=>{

    updateTaskCounters();

},1000);

/*
==========================================================
INITIALIZE TASKS
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeQuickTask();

        renderTasks();

        updateTaskCounters();

    }

);
/*
==========================================================
GOALS
==========================================================
*/

function createGoal(

    title,

    description = ""

){

    const goal = {

        id: randomID(),

        title,

        description,

        progress: 0,

        completed: false,

        created: currentDate()

    };

    Database.goals.push(goal);

    saveDatabase();

    renderGoals();

}

function updateGoalProgress(

    id,

    progress

){

    const goal = Database.goals.find(

        g => g.id === id

    );

    if(!goal) return;

    goal.progress = progress;

    if(progress >= 100){

        goal.completed = true;

    }

    saveDatabase();

    renderGoals();

}

function deleteGoal(id){

    Database.goals = Database.goals.filter(

        goal => goal.id !== id

    );

    saveDatabase();

    renderGoals();

}

function renderGoals(){

    const container =

        document.getElementById(

            "goalGrid"

        );

    if(!container) return;

    container.innerHTML = "";

    Database.goals.forEach(goal=>{

        const card = createElement("article");

        card.className = "goal-card";

        card.innerHTML = `

            <h3>

                ${goal.title}

            </h3>

            <p>

                ${goal.description}

            </p>

            <progress

                value="${goal.progress}"

                max="100">

            </progress>

            <p>

                ${goal.progress}%

            </p>

        `;

        container.appendChild(card);

    });

}

/*
==========================================================
GOAL COUNTERS
==========================================================
*/

function updateGoalCounters(){

    const active =

        document.getElementById(

            "activeGoalCount"

        );

    const completed =

        document.getElementById(

            "completedGoalCount"

        );

    if(active){

        active.innerText =

            Database.goals.filter(

                g=>!g.completed

            ).length;

    }

    if(completed){

        completed.innerText =

            Database.goals.filter(

                g=>g.completed

            ).length;

    }

}

/*
==========================================================
GOAL FORM
==========================================================
*/

function initializeGoals(){

    const button =

        document.getElementById(

            "createGoal"

        );

    if(!button) return;

    button.addEventListener(

        "click",

        ()=>{

            const title = prompt(

                "Goal title"

            );

            if(!title) return;

            createGoal(title);

            notification(

                "Goal Created",

                title,

                "success"

            );

        }

    );

}

/*
==========================================================
AUTO UPDATE
==========================================================
*/

setInterval(()=>{

    updateGoalCounters();

},1000);

/*
==========================================================
START GOALS
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeGoals();

        renderGoals();

        updateGoalCounters();

    }

);
/*
==========================================================
HABITS
==========================================================
*/

function createHabit(

    title,

    frequency="Daily"

){

    const habit={

        id:randomID(),

        title,

        frequency,

        streak:0,

        completed:false,

        history:[],

        created:currentDate()

    };

    Database.habits.push(habit);

    saveDatabase();

    renderHabits();

    notification(

        "Habit Created",

        title,

        "success"

    );

}

function toggleHabit(id){

    const habit=

        Database.habits.find(

            h=>h.id===id

        );

    if(!habit) return;

    habit.completed=!habit.completed;

    if(habit.completed){

        habit.streak++;

    }else{

        habit.streak=Math.max(

            0,

            habit.streak-1

        );

    }

    habit.history.push({

        date:currentDate(),

        completed:habit.completed

    });

    saveDatabase();

    renderHabits();

}

function deleteHabit(id){

    Database.habits=

        Database.habits.filter(

            h=>h.id!==id

        );

    saveDatabase();

    renderHabits();

}

function renderHabits(){

    const container=

        document.getElementById(

            "todayHabitList"

        );

    if(!container) return;

    container.innerHTML="";

    Database.habits.forEach(habit=>{

        const card=createElement("article");

        card.className="habit-item";

        card.innerHTML=`

            <input

                type="checkbox"

                ${habit.completed?"checked":""}

            >

            <div>

                <h3>

                    ${habit.title}

                </h3>

                <p>

                    ${habit.frequency}

                </p>

            </div>

            <strong>

                ${habit.streak} 🔥

            </strong>

        `;

        card.querySelector("input")

        .addEventListener(

            "change",

            ()=>{

                toggleHabit(

                    habit.id

                );

            }

        );

        container.appendChild(card);

    });

}

/*
==========================================================
HABIT COUNTERS
==========================================================
*/

function updateHabitCounters(){

    const total=

        document.getElementById(

            "activeHabitCount"

        );

    const completed=

        document.getElementById(

            "completedHabitsToday"

        );

    const streak=

        document.getElementById(

            "currentHabitStreak"

        );

    if(total){

        total.innerText=

            Database.habits.length;

    }

    if(completed){

        completed.innerText=

            Database.habits.filter(

                h=>h.completed

            ).length;

    }

    if(streak){

        let max=0;

        Database.habits.forEach(h=>{

            if(h.streak>max){

                max=h.streak;

            }

        });

        streak.innerText=max;

    }

}

/*
==========================================================
CREATE HABIT BUTTON
==========================================================
*/

function initializeHabits(){

    const button=

        document.getElementById(

            "newHabitButton"

        );

    if(!button) return;

    button.addEventListener(

        "click",

        ()=>{

            const title=

                prompt(

                    "Habit name"

                );

            if(!title) return;

            createHabit(title);

        }

    );

}

/*
==========================================================
AUTO UPDATE
==========================================================
*/

setInterval(()=>{

    updateHabitCounters();

},1000);

/*
==========================================================
START HABITS
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeHabits();

        renderHabits();

        updateHabitCounters();

    }

);
/*
==========================================================
NOTES
==========================================================
*/

function createNote(

    title,

    content=""

){

    const note={

        id:randomID(),

        title,

        content,

        favorite:false,

        created:currentDate(),

        updated:currentDate()

    };

    Database.notes.push(note);

    saveDatabase();

    renderNotes();

    notification(

        "Note Created",

        title,

        "success"

    );

}

function deleteNote(id){

    Database.notes=

        Database.notes.filter(

            note=>note.id!==id

        );

    saveDatabase();

    renderNotes();

}

function favoriteNote(id){

    const note=

        Database.notes.find(

            n=>n.id===id

        );

    if(!note) return;

    note.favorite=

        !note.favorite;

    saveDatabase();

    renderNotes();

}

function renderNotes(){

    const container=

        document.getElementById(

            "noteLibrary"

        );

    if(!container) return;

    container.innerHTML="";

    Database.notes.forEach(note=>{

        const card=createElement("article");

        card.className="note-card";

        card.innerHTML=`

            <h3>

                ${note.title}

            </h3>

            <p>

                ${note.content}

            </p>

            <div class="space-between mt-2">

                <button class="favoriteButton">

                    ${note.favorite ? "★" : "☆"}

                </button>

                <button class="deleteButton">

                    Delete

                </button>

            </div>

        `;

        card.querySelector(

            ".favoriteButton"

        ).addEventListener(

            "click",

            ()=>{

                favoriteNote(

                    note.id

                );

            }

        );

        card.querySelector(

            ".deleteButton"

        ).addEventListener(

            "click",

            ()=>{

                deleteNote(

                    note.id

                );

            }

        );

        container.appendChild(card);

    });

}

/*
==========================================================
QUICK NOTE
==========================================================
*/

function initializeNotes(){

    const form=

        document.getElementById(

            "quickNoteForm"

        );

    if(!form) return;

    form.addEventListener(

        "submit",

        event=>{

            event.preventDefault();

            const title=

                document.getElementById(

                    "quickNoteTitle"

                ).value.trim();

            const content=

                document.getElementById(

                    "quickNoteContent"

                ).value.trim();

            if(title===""){

                toast(

                    "Enter a note title."

                );

                return;

            }

            createNote(

                title,

                content

            );

            form.reset();

        }

    );

}

/*
==========================================================
NOTE COUNTERS
==========================================================
*/

function updateNoteCounters(){

    const total=

        document.getElementById(

            "totalNotes"

        );

    const favorite=

        document.getElementById(

            "favoriteNotes"

        );

    if(total){

        total.innerText=

            Database.notes.length;

    }

    if(favorite){

        favorite.innerText=

            Database.notes.filter(

                note=>note.favorite

            ).length;

    }

}

/*
==========================================================
AUTO UPDATE
==========================================================
*/

setInterval(()=>{

    updateNoteCounters();

},1000);

/*
==========================================================
START NOTES
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeNotes();

        renderNotes();

        updateNoteCounters();

    }

);
/*
==========================================================
JOURNAL
==========================================================
*/

function createJournalEntry(

    title,

    content,

    mood="🙂"

){

    const entry={

        id:randomID(),

        title,

        content,

        mood,

        created:currentDate()

    };

    Database.journal.push(entry);

    saveDatabase();

    renderJournal();

    notification(

        "Journal Saved",

        title,

        "success"

    );

}

function deleteJournalEntry(id){

    Database.journal=

        Database.journal.filter(

            entry=>entry.id!==id

        );

    saveDatabase();

    renderJournal();

}

function renderJournal(){

    const container=

        document.getElementById(

            "journalTimeline"

        );

    if(!container) return;

    container.innerHTML="";

    Database.journal.forEach(entry=>{

        const card=createElement("article");

        card.className="journal-card";

        card.innerHTML=`

            <h3>

                ${entry.mood} ${entry.title}

            </h3>

            <p>

                ${entry.content}

            </p>

            <small>

                ${new Date(

                    entry.created

                ).toLocaleString()}

            </small>

            <div class="mt-2">

                <button class="deleteJournal">

                    Delete

                </button>

            </div>

        `;

        card.querySelector(

            ".deleteJournal"

        ).addEventListener(

            "click",

            ()=>{

                deleteJournalEntry(

                    entry.id

                );

            }

        );

        container.appendChild(card);

    });

}

/*
==========================================================
QUICK JOURNAL
==========================================================
*/

function initializeJournal(){

    const form=

        document.getElementById(

            "quickJournalForm"

        );

    if(!form) return;

    form.addEventListener(

        "submit",

        event=>{

            event.preventDefault();

            const title=

                document.getElementById(

                    "journalTitle"

                ).value.trim();

            const content=

                document.getElementById(

                    "journalContent"

                ).value.trim();

            if(title===""){

                toast(

                    "Enter a journal title."

                );

                return;

            }

            createJournalEntry(

                title,

                content

            );

            form.reset();

        }

    );

}

/*
==========================================================
MOOD BUTTONS
==========================================================
*/

let selectedMood="🙂";

function initializeMoodTracker(){

    const buttons=

        document.querySelectorAll(

            "#moodTracker button"

        );

    buttons.forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                selectedMood=

                    button.innerText;

                buttons.forEach(

                    b=>{

                        b.style.opacity=".5";

                    }

                );

                button.style.opacity="1";

            }

        );

    });

}

/*
==========================================================
JOURNAL COUNTERS
==========================================================
*/

function updateJournalCounters(){

    const total=

        document.getElementById(

            "journalEntryCount"

        );

    if(total){

        total.innerText=

            Database.journal.length;

    }

}

/*
==========================================================
START JOURNAL
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeJournal();

        initializeMoodTracker();

        renderJournal();

        updateJournalCounters();

    }

);
/*
==========================================================
CALENDAR
==========================================================
*/

function createEvent(

    title,

    date,

    time=""

){

    const event={

        id:randomID(),

        title,

        date,

        time,

        created:currentDate()

    };

    Database.calendar.push(event);

    saveDatabase();

    renderCalendarEvents();

    notification(

        "Event Created",

        title,

        "success"

    );

}

function deleteEvent(id){

    Database.calendar=

        Database.calendar.filter(

            event=>event.id!==id

        );

    saveDatabase();

    renderCalendarEvents();

}

function renderCalendarEvents(){

    const agenda=

        document.getElementById(

            "todayAgenda"

        );

    const upcoming=

        document.getElementById(

            "upcomingEvents"

        );

    if(agenda){

        agenda.innerHTML="";

    }

    if(upcoming){

        upcoming.innerHTML="";

    }

    Database.calendar.forEach(event=>{

        const card=createElement("article");

        card.className="event-card";

        card.innerHTML=`

            <h3>

                ${event.title}

            </h3>

            <p>

                ${event.date}

                ${event.time}

            </p>

            <button class="deleteEvent">

                Delete

            </button>

        `;

        card.querySelector(

            ".deleteEvent"

        ).addEventListener(

            "click",

            ()=>{

                deleteEvent(

                    event.id

                );

            }

        );

        if(agenda){

            agenda.appendChild(

                card.cloneNode(true)

            );

        }

        if(upcoming){

            upcoming.appendChild(

                card

            );

        }

    });

}

/*
==========================================================
CALENDAR GRID
==========================================================
*/

function renderCalendarGrid(){

    const grid=

        document.getElementById(

            "calendarGrid"

        );

    if(!grid) return;

    grid.innerHTML="";

    for(

        let day=1;

        day<=31;

        day++

    ){

        const cell=

            createElement("div");

        cell.className=

            "calendar-day";

        cell.innerHTML=`

            <strong>

                ${day}

            </strong>

        `;

        grid.appendChild(cell);

    }

}

/*
==========================================================
TODAY BUTTON
==========================================================
*/

function initializeCalendar(){

    const button=

        document.getElementById(

            "todayButton"

        );

    if(button){

        button.addEventListener(

            "click",

            ()=>{

                notification(

                    "Calendar",

                    "Jumped to today."

                );

            }

        );

    }

    const newEvent=

        document.getElementById(

            "newEventButton"

        );

    if(newEvent){

        newEvent.addEventListener(

            "click",

            ()=>{

                const title=

                    prompt(

                        "Event title"

                    );

                if(!title) return;

                const date=

                    prompt(

                        "Date (YYYY-MM-DD)"

                    );

                if(!date) return;

                createEvent(

                    title,

                    date

                );

            }

        );

    }

}

/*
==========================================================
START CALENDAR
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        renderCalendarGrid();

        renderCalendarEvents();

        initializeCalendar();

    }

);
/*
==========================================================
PROJECTS
==========================================================
*/

function createProject(

    title,

    description=""

){

    const project={

        id:randomID(),

        title,

        description,

        progress:0,

        status:"Planning",

        tasks:[],

        created:currentDate()

    };

    Database.projects.push(project);

    saveDatabase();

    renderProjects();

    notification(

        "Project Created",

        title,

        "success"

    );

}

function deleteProject(id){

    Database.projects=

        Database.projects.filter(

            project=>project.id!==id

        );

    saveDatabase();

    renderProjects();

}

function updateProjectProgress(

    id,

    progress

){

    const project=

        Database.projects.find(

            project=>project.id===id

        );

    if(!project) return;

    project.progress=progress;

    saveDatabase();

    renderProjects();

}

function renderProjects(){

    const container=

        document.getElementById(

            "projectGrid"

        );

    if(!container) return;

    container.innerHTML="";

    Database.projects.forEach(project=>{

        const card=createElement("article");

        card.className="project-card";

        card.innerHTML=`

            <h3>

                ${project.title}

            </h3>

            <p>

                ${project.description}

            </p>

            <progress

                value="${project.progress}"

                max="100">

            </progress>

            <div class="space-between mt-2">

                <span>

                    ${project.progress}%

                </span>

                <button class="deleteProject">

                    Delete

                </button>

            </div>

        `;

        card.querySelector(

            ".deleteProject"

        ).addEventListener(

            "click",

            ()=>{

                deleteProject(

                    project.id

                );

            }

        );

        container.appendChild(card);

    });

}

/*
==========================================================
PROJECT COUNTERS
==========================================================
*/

function updateProjectCounters(){

    const active=

        document.getElementById(

            "activeProjectCount"

        );

    const completed=

        document.getElementById(

            "completedProjectCount"

        );

    if(active){

        active.innerText=

            Database.projects.length;

    }

    if(completed){

        completed.innerText=

            Database.projects.filter(

                project=>project.progress>=100

            ).length;

    }

}

/*
==========================================================
PROJECT BUTTON
==========================================================
*/

function initializeProjects(){

    const button=

        document.getElementById(

            "createProject"

        );

    if(!button) return;

    button.addEventListener(

        "click",

        ()=>{

            const title=

                prompt(

                    "Project name"

                );

            if(!title) return;

            createProject(title);

        }

    );

}

/*
==========================================================
START PROJECTS
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeProjects();

        renderProjects();

        updateProjectCounters();

    }

);
/*
==========================================================
LIFE MEMORY
==========================================================
*/

function createMemory(

    title,

    content,

    category="Personal"

){

    const memory={

        id:randomID(),

        title,

        content,

        category,

        favorite:false,

        created:currentDate(),

        updated:currentDate()

    };

    Database.memories.push(memory);

    saveDatabase();

    renderMemories();

    notification(

        "Memory Saved",

        title,

        "success"

    );

}

function deleteMemory(id){

    Database.memories=

        Database.memories.filter(

            memory=>memory.id!==id

        );

    saveDatabase();

    renderMemories();

}

function favoriteMemory(id){

    const memory=

        Database.memories.find(

            memory=>memory.id===id

        );

    if(!memory) return;

    memory.favorite=

        !memory.favorite;

    saveDatabase();

    renderMemories();

}

function renderMemories(){

    const container=

        document.getElementById(

            "recentMemoryGrid"

        );

    if(!container) return;

    container.innerHTML="";

    Database.memories.forEach(memory=>{

        const card=createElement("article");

        card.className="memory-entry";

        card.innerHTML=`

            <header>

                <h3>

                    ${memory.title}

                </h3>

                <small>

                    ${new Date(memory.created)

                        .toLocaleDateString()}

                </small>

            </header>

            <p>

                ${memory.content}

            </p>

            <div class="space-between mt-2">

                <button class="favoriteMemory">

                    ${memory.favorite?"★":"☆"}

                </button>

                <button class="deleteMemory">

                    Delete

                </button>

            </div>

        `;

        card.querySelector(

            ".favoriteMemory"

        ).addEventListener(

            "click",

            ()=>{

                favoriteMemory(

                    memory.id

                );

            }

        );

        card.querySelector(

            ".deleteMemory"

        ).addEventListener(

            "click",

            ()=>{

                deleteMemory(

                    memory.id

                );

            }

        );

        container.appendChild(card);

    });

}

/*
==========================================================
MEMORY SEARCH
==========================================================
*/

function initializeMemorySearch(){

    const input=

        document.getElementById(

            "memorySearch"

        );

    if(!input) return;

    input.addEventListener(

        "input",

        ()=>{

            const query=

                input.value

                .toLowerCase();

            const cards=

                document.querySelectorAll(

                    ".memory-entry"

                );

            cards.forEach(card=>{

                const text=

                    card.innerText

                    .toLowerCase();

                card.style.display=

                    text.includes(query)

                    ? ""

                    : "none";

            });

        }

    );

}

/*
==========================================================
MEMORY COUNTERS
==========================================================
*/

function updateMemoryCounters(){

    const total=

        document.getElementById(

            "memoryTotal"

        );

    if(total){

        total.innerText=

            Database.memories.length;

    }

}

/*
==========================================================
START MEMORY
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        renderMemories();

        initializeMemorySearch();

        updateMemoryCounters();

    }

);
/*
==========================================================
FINANCE
==========================================================
*/

function createTransaction(

    title,

    amount,

    type="expense"

){

    const transaction={

        id:randomID(),

        title,

        amount:Number(amount),

        type,

        created:currentDate()

    };

    Database.finance.push(transaction);

    saveDatabase();

    renderTransactions();

    updateFinanceDashboard();

    notification(

        "Transaction Added",

        title,

        "success"

    );

}

function deleteTransaction(id){

    Database.finance=

        Database.finance.filter(

            transaction=>transaction.id!==id

        );

    saveDatabase();

    renderTransactions();

    updateFinanceDashboard();

}

function renderTransactions(){

    const container=

        document.getElementById(

            "transactionList"

        );

    if(!container) return;

    container.innerHTML="";

    Database.finance.forEach(transaction=>{

        const card=createElement("article");

        card.className="transaction-card";

        card.innerHTML=`

            <div class="space-between">

                <h3>

                    ${transaction.title}

                </h3>

                <strong>

                    ${transaction.type==="income" ? "+" : "-"}

                    $${transaction.amount.toFixed(2)}

                </strong>

            </div>

            <small>

                ${new Date(transaction.created)

                    .toLocaleString()}

            </small>

            <button class="deleteTransaction">

                Delete

            </button>

        `;

        card.querySelector(

            ".deleteTransaction"

        ).addEventListener(

            "click",

            ()=>{

                deleteTransaction(

                    transaction.id

                );

            }

        );

        container.appendChild(card);

    });

}

/*
==========================================================
FINANCE DASHBOARD
==========================================================
*/

function updateFinanceDashboard(){

    let income=0;

    let expenses=0;

    Database.finance.forEach(item=>{

        if(item.type==="income"){

            income+=item.amount;

        }else{

            expenses+=item.amount;

        }

    });

    const balance=

        income-expenses;

    const balanceElement=

        document.getElementById(

            "financeTotalBalance"

        );

    const incomeElement=

        document.getElementById(

            "financeMonthlyIncome"

        );

    const expenseElement=

        document.getElementById(

            "financeMonthlyExpenses"

        );

    const savingsElement=

        document.getElementById(

            "financeSavings"

        );

    if(balanceElement){

        balanceElement.innerText=

            "$"+balance.toFixed(2);

    }

    if(incomeElement){

        incomeElement.innerText=

            "$"+income.toFixed(2);

    }

    if(expenseElement){

        expenseElement.innerText=

            "$"+expenses.toFixed(2);

    }

    if(savingsElement){

        savingsElement.innerText=

            "$"+balance.toFixed(2);

    }

}

/*
==========================================================
QUICK TRANSACTION
==========================================================
*/

function initializeFinance(){

    const button=

        document.getElementById(

            "newTransactionButton"

        );

    if(!button) return;

    button.addEventListener(

        "click",

        ()=>{

            const title=

                prompt(

                    "Transaction title"

                );

            if(!title) return;

            const amount=

                prompt(

                    "Amount"

                );

            if(!amount) return;

            const type=

                confirm(

                    "Press OK for Income\nPress Cancel for Expense"

                )

                ? "income"

                : "expense";

            createTransaction(

                title,

                amount,

                type

            );

        }

    );

}

/*
==========================================================
START FINANCE
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeFinance();

        renderTransactions();

        updateFinanceDashboard();

    }

);
/*
==========================================================
HEALTH
==========================================================
*/

function createHealthRecord(

    type,

    value,

    notes=""

){

    const record={

        id:randomID(),

        type,

        value,

        notes,

        created:currentDate()

    };

    Database.health.push(record);

    saveDatabase();

    renderHealthRecords();

    updateHealthDashboard();

    notification(

        "Health Record Saved",

        type,

        "success"

    );

}

function deleteHealthRecord(id){

    Database.health=

        Database.health.filter(

            record=>record.id!==id

        );

    saveDatabase();

    renderHealthRecords();

    updateHealthDashboard();

}

function renderHealthRecords(){

    const container=

        document.getElementById(

            "dailyHealthSummary"

        );

    if(!container) return;

    container.innerHTML="";

    Database.health.forEach(record=>{

        const card=createElement("article");

        card.className="health-card";

        card.innerHTML=`

            <h3>

                ${record.type}

            </h3>

            <h2>

                ${record.value}

            </h2>

            <p>

                ${record.notes}

            </p>

            <small>

                ${new Date(record.created)

                    .toLocaleString()}

            </small>

            <button class="deleteHealthRecord">

                Delete

            </button>

        `;

        card.querySelector(

            ".deleteHealthRecord"

        ).addEventListener(

            "click",

            ()=>{

                deleteHealthRecord(

                    record.id

                );

            }

        );

        container.appendChild(card);

    });

}

/*
==========================================================
HEALTH DASHBOARD
==========================================================
*/

function updateHealthDashboard(){

    const score=

        document.getElementById(

            "healthScore"

        );

    if(score){

        let value=

            Math.min(

                Database.health.length*10,

                100

            );

        score.innerText=value;

    }

}

/*
==========================================================
NEW HEALTH RECORD
==========================================================
*/

function initializeHealth(){

    const button=

        document.getElementById(

            "newHealthRecord"

        );

    if(!button) return;

    button.addEventListener(

        "click",

        ()=>{

            const type=

                prompt(

                    "Health record type"

                );

            if(!type) return;

            const value=

                prompt(

                    "Value"

                );

            if(!value) return;

            const notes=

                prompt(

                    "Notes"

                ) || "";

            createHealthRecord(

                type,

                value,

                notes

            );

        }

    );

}

/*
==========================================================
HEALTH SEARCH
==========================================================
*/

function searchHealthRecords(query){

    return Database.health.filter(

        record=>

            record.type

            .toLowerCase()

            .includes(

                query.toLowerCase()

            ) ||

            record.notes

            .toLowerCase()

            .includes(

                query.toLowerCase()

            )

    );

}

/*
==========================================================
START HEALTH
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeHealth();

        renderHealthRecords();

        updateHealthDashboard();

    }

);
/*
==========================================================
LEARNING
==========================================================
*/

function createCourse(

    title,

    description=""

){

    const course={

        id:randomID(),

        title,

        description,

        progress:0,

        lessons:[],

        completed:false,

        created:currentDate()

    };

    Database.learning.push(course);

    saveDatabase();

    renderCourses();

    notification(

        "Course Added",

        title,

        "success"

    );

}

function deleteCourse(id){

    Database.learning=

        Database.learning.filter(

            course=>course.id!==id

        );

    saveDatabase();

    renderCourses();

}

function updateCourseProgress(

    id,

    progress

){

    const course=

        Database.learning.find(

            course=>course.id===id

        );

    if(!course) return;

    course.progress=progress;

    if(progress>=100){

        course.completed=true;

    }

    saveDatabase();

    renderCourses();

}

function renderCourses(){

    const container=

        document.getElementById(

            "courseLibrary"

        );

    if(!container) return;

    container.innerHTML="";

    Database.learning.forEach(course=>{

        const card=createElement("article");

        card.className="course-card";

        card.innerHTML=`

            <h3>

                ${course.title}

            </h3>

            <p>

                ${course.description}

            </p>

            <progress

                value="${course.progress}"

                max="100">

            </progress>

            <p>

                ${course.progress}%

            </p>

            <button class="deleteCourse">

                Delete

            </button>

        `;

        card.querySelector(

            ".deleteCourse"

        ).addEventListener(

            "click",

            ()=>{

                deleteCourse(

                    course.id

                );

            }

        );

        container.appendChild(card);

    });

}

/*
==========================================================
LEARNING COUNTERS
==========================================================
*/

function updateLearningDashboard(){

    const active=

        document.getElementById(

            "activeCourseCount"

        );

    const skills=

        document.getElementById(

            "skillCount"

        );

    const certificates=

        document.getElementById(

            "certificateCount"

        );

    if(active){

        active.innerText=

            Database.learning.length;

    }

    if(skills){

        skills.innerText=

            Database.learning.length;

    }

    if(certificates){

        certificates.innerText=

            Database.learning.filter(

                course=>course.completed

            ).length;

    }

}

/*
==========================================================
COURSE BUTTON
==========================================================
*/

function initializeLearning(){

    const button=

        document.getElementById(

            "newCourseButton"

        );

    if(!button) return;

    button.addEventListener(

        "click",

        ()=>{

            const title=

                prompt(

                    "Course title"

                );

            if(!title) return;

            const description=

                prompt(

                    "Description"

                ) || "";

            createCourse(

                title,

                description

            );

        }

    );

}

/*
==========================================================
START LEARNING
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeLearning();

        renderCourses();

        updateLearningDashboard();

    }

);
/*
==========================================================
DOCUMENTS
==========================================================
*/

function uploadDocument(

    name,

    type="Unknown",

    size="0 KB"

){

    const documentFile={

        id:randomID(),

        name,

        type,

        size,

        favorite:false,

        uploaded:currentDate()

    };

    Database.documents.push(documentFile);

    saveDatabase();

    renderDocuments();

    notification(

        "Document Uploaded",

        name,

        "success"

    );

}

function deleteDocument(id){

    Database.documents=

        Database.documents.filter(

            file=>file.id!==id

        );

    saveDatabase();

    renderDocuments();

}

function favoriteDocument(id){

    const file=

        Database.documents.find(

            document=>document.id===id

        );

    if(!file) return;

    file.favorite=

        !file.favorite;

    saveDatabase();

    renderDocuments();

}

function renderDocuments(){

    const container=

        document.getElementById(

            "documentLibrary"

        );

    if(!container) return;

    container.innerHTML="";

    Database.documents.forEach(file=>{

        const card=createElement("article");

        card.className="document-card";

        card.innerHTML=`

            <h3>

                ${file.name}

            </h3>

            <p>

                ${file.type}

            </p>

            <small>

                ${file.size}

            </small>

            <div class="space-between mt-2">

                <button class="favoriteDocument">

                    ${file.favorite?"★":"☆"}

                </button>

                <button class="deleteDocument">

                    Delete

                </button>

            </div>

        `;

        card.querySelector(

            ".favoriteDocument"

        ).addEventListener(

            "click",

            ()=>{

                favoriteDocument(

                    file.id

                );

            }

        );

        card.querySelector(

            ".deleteDocument"

        ).addEventListener(

            "click",

            ()=>{

                deleteDocument(

                    file.id

                );

            }

        );

        container.appendChild(card);

    });

}

/*
==========================================================
DOCUMENT SEARCH
==========================================================
*/

function searchDocuments(query){

    return Database.documents.filter(

        file=>

            file.name

                .toLowerCase()

                .includes(

                    query.toLowerCase()

                ) ||

            file.type

                .toLowerCase()

                .includes(

                    query.toLowerCase()

                )

    );

}

/*
==========================================================
UPLOAD BUTTON
==========================================================
*/

function initializeDocuments(){

    const button=

        document.getElementById(

            "uploadDocumentButton"

        );

    if(!button) return;

    button.addEventListener(

        "click",

        ()=>{

            const name=

                prompt(

                    "Document name"

                );

            if(!name) return;

            const type=

                prompt(

                    "File type"

                ) || "Unknown";

            const size=

                prompt(

                    "File size"

                ) || "0 KB";

            uploadDocument(

                name,

                type,

                size

            );

        }

    );

}

/*
==========================================================
START DOCUMENTS
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeDocuments();

        renderDocuments();

    }

);
/*
==========================================================
AI ASSISTANT
==========================================================
*/

const AI={

    history:[],

    typing:false,

    online:true

};

function addAIMessage(

    sender,

    message

){

    const container=

        document.getElementById(

            "chatContainer"

        );

    if(!container) return;

    const card=createElement("div");

    card.className=

        sender==="AI"

        ? "ai-message"

        : "user-message";

    card.innerHTML=`

        <strong>

            ${sender}

        </strong>

        <p>

            ${message}

        </p>

    `;

    container.appendChild(card);

    container.scrollTop=

        container.scrollHeight;

    AI.history.push({

        sender,

        message,

        date:currentDate()

    });

}

function generateAIResponse(message){

    const text=

        message.toLowerCase();

    if(text.includes("task")){

        return "I recommend reviewing today's tasks and completing the highest priority item first.";

    }

    if(text.includes("goal")){

        return "Your goals are easier to achieve when broken into smaller milestones.";

    }

    if(text.includes("habit")){

        return "Consistency beats intensity. Focus on maintaining your streak.";

    }

    if(text.includes("calendar")){

        return "You still have available focus time today according to your schedule.";

    }

    if(text.includes("finance")){

        return "Review your recent expenses before creating a new monthly budget.";

    }

    if(text.includes("health")){

        return "Don't forget to stay hydrated and take regular breaks.";

    }

    return "I understand. As we continue developing this application, my responses will become much more intelligent.";

}

function sendAIMessage(){

    const input=

        document.getElementById(

            "chatInput"

        );

    if(!input) return;

    const message=

        input.value.trim();

    if(message==="") return;

    addAIMessage(

        "You",

        message

    );

    input.value="";

    AI.typing=true;

    setTimeout(()=>{

        AI.typing=false;

        addAIMessage(

            "AI",

            generateAIResponse(

                message

            )

        );

    },600);

}

function initializeAI(){

    const button=

        document.getElementById(

            "sendMessage"

        );

    if(button){

        button.addEventListener(

            "click",

            sendAIMessage

        );

    }

    const input=

        document.getElementById(

            "chatInput"

        );

    if(input){

        input.addEventListener(

            "keydown",

            event=>{

                if(

                    event.key==="Enter"

                    &&

                    !event.shiftKey

                ){

                    event.preventDefault();

                    sendAIMessage();

                }

            }

        );

    }

}

/*
==========================================================
AI MEMORY SEARCH
==========================================================
*/

function searchEverything(query){

    query=query.toLowerCase();

    return{

        tasks:

            Database.tasks.filter(

                task=>

                    task.title

                    .toLowerCase()

                    .includes(query)

            ),

        notes:

            Database.notes.filter(

                note=>

                    note.title

                    .toLowerCase()

                    .includes(query)

            ),

        memories:

            Database.memories.filter(

                memory=>

                    memory.title

                    .toLowerCase()

                    .includes(query)

            ),

        goals:

            Database.goals.filter(

                goal=>

                    goal.title

                    .toLowerCase()

                    .includes(query)

            )

    };

}

/*
==========================================================
START AI
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeAI();

    }

);
/*
==========================================================
SEARCH ENGINE
==========================================================
*/

function globalSearch(query){

    query=query.trim().toLowerCase();

    if(query==="") return;

    const results=[];

    Object.keys(Database).forEach(collection=>{

        Database[collection].forEach(item=>{

            const values=JSON.stringify(item)

                .toLowerCase();

            if(values.includes(query)){

                results.push({

                    collection,

                    item

                });

            }

        });

    });

    displaySearchResults(results);

}

function displaySearchResults(results){

    const container=

        document.getElementById(

            "commandResults"

        );

    if(!container) return;

    container.innerHTML="";

    if(results.length===0){

        container.innerHTML=`

            <div class="command-item">

                No Results Found

            </div>

        `;

        return;

    }

    results.forEach(result=>{

        const item=createElement("div");

        item.className="command-item";

        item.innerHTML=`

            <strong>

                ${result.collection.toUpperCase()}

            </strong>

            <br>

            ${result.item.title ||

              result.item.name ||

              "Untitled"}

        `;

        container.appendChild(item);

    });

}

/*
==========================================================
GLOBAL SEARCH BAR
==========================================================
*/

function initializeGlobalSearch(){

    const input=

        document.getElementById(

            "globalSearch"

        );

    const button=

        document.getElementById(

            "searchButton"

        );

    if(input){

        input.addEventListener(

            "keydown",

            event=>{

                if(event.key==="Enter"){

                    globalSearch(

                        input.value

                    );

                }

            }

        );

    }

    if(button){

        button.addEventListener(

            "click",

            ()=>{

                globalSearch(

                    input.value

                );

            }

        );

    }

}

/*
==========================================================
COMMAND PALETTE SEARCH
==========================================================
*/

if(DOM.commandSearch){

    DOM.commandSearch.addEventListener(

        "input",

        ()=>{

            globalSearch(

                DOM.commandSearch.value

            );

        }

    );

}

/*
==========================================================
DASHBOARD
==========================================================
*/

function refreshDashboard(){

    updateTaskCounters();

    updateGoalCounters();

    updateHabitCounters();

    updateNoteCounters();

    updateJournalCounters();

    updateProjectCounters();

    updateLearningDashboard();

    updateFinanceDashboard();

    updateHealthDashboard();

    updateMemoryCounters();

}

setInterval(

    refreshDashboard,

    2000

);

/*
==========================================================
START SEARCH
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeGlobalSearch();

    }

);
/*
==========================================================
THEME
==========================================================
*/

function enableDarkMode(){

    document.body.classList.remove("light-mode");

    document.body.classList.add("dark-mode");

    App.darkMode=true;

    localStorage.setItem(

        "theme",

        "dark"

    );

}

function enableLightMode(){

    document.body.classList.remove("dark-mode");

    document.body.classList.add("light-mode");

    App.darkMode=false;

    localStorage.setItem(

        "theme",

        "light"

    );

}

function loadTheme(){

    const theme=

        localStorage.getItem(

            "theme"

        );

    if(theme==="light"){

        enableLightMode();

    }else{

        enableDarkMode();

    }

}

function toggleTheme(){

    if(App.darkMode){

        enableLightMode();

        toast(

            "Light mode enabled."

        );

    }else{

        enableDarkMode();

        toast(

            "Dark mode enabled."

        );

    }

}

/*
==========================================================
KEYBOARD SHORTCUTS
==========================================================
*/

document.addEventListener(

    "keydown",

    event=>{

        if(

            event.ctrlKey

            &&

            event.key==="s"

        ){

            event.preventDefault();

            saveDatabase();

            toast(

                "Project Saved"

            );

        }

        if(

            event.ctrlKey

            &&

            event.key==="n"

        ){

            event.preventDefault();

            toggleQuickMenu();

        }

        if(

            event.ctrlKey

            &&

            event.key==="/"

        ){

            event.preventDefault();

            showPage(

                "aiAssistantPage"

            );

            updateCurrentPage(

                "ai"

            );

        }

    }

);

/*
==========================================================
AUTO SAVE
==========================================================
*/

setInterval(

    ()=>{

        saveDatabase();

    },

    30000

);

/*
==========================================================
APPLICATION STATS
==========================================================
*/

function getStatistics(){

    return{

        tasks:

            Database.tasks.length,

        goals:

            Database.goals.length,

        habits:

            Database.habits.length,

        notes:

            Database.notes.length,

        journal:

            Database.journal.length,

        memories:

            Database.memories.length,

        calendar:

            Database.calendar.length,

        projects:

            Database.projects.length,

        learning:

            Database.learning.length,

        finance:

            Database.finance.length,

        health:

            Database.health.length,

        documents:

            Database.documents.length

    };

}

function printStatistics(){

    console.table(

        getStatistics()

    );

}

/*
==========================================================
DEBUG
==========================================================
*/

window.App=App;

window.Database=Database;

window.printStatistics=

    printStatistics;

/*
==========================================================
START SETTINGS
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        loadTheme();

    }

);
/*
==========================================================
EXPORT / IMPORT
==========================================================
*/

function exportDatabase(){

    const data=

        JSON.stringify(

            Database,

            null,

            2

        );

    const blob=

        new Blob(

            [data],

            {

                type:"application/json"

            }

        );

    const url=

        URL.createObjectURL(

            blob

        );

    const link=

        document.createElement(

            "a"

        );

    link.href=url;

    link.download=

        "LifePlannerBackup.json";

    document.body.appendChild(

        link

    );

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    notification(

        "Backup Created",

        "Database exported successfully.",

        "success"

    );

}

function importDatabase(file){

    const reader=

        new FileReader();

    reader.onload=function(event){

        try{

            const data=

                JSON.parse(

                    event.target.result

                );

            Object.assign(

                Database,

                data

            );

            saveDatabase();

            refreshDashboard();

            renderTasks();

            renderGoals();

            renderHabits();

            renderNotes();

            renderJournal();

            renderProjects();

            renderCourses();

            renderTransactions();

            renderHealthRecords();

            renderDocuments();

            renderMemories();

            notification(

                "Import Complete",

                "Backup restored successfully.",

                "success"

            );

        }

        catch(error){

            notification(

                "Import Failed",

                "Invalid backup file.",

                "error"

            );

        }

    };

    reader.readAsText(file);

}

/*
==========================================================
CLEAR DATABASE
==========================================================
*/

function clearDatabase(){

    if(

        !confirm(

            "Delete all saved data?"

        )

    ){

        return;

    }

    Object.keys(Database).forEach(key=>{

        Database[key]=[];

    });

    saveDatabase();

    location.reload();

}

/*
==========================================================
RESET APPLICATION
==========================================================
*/

function resetApplication(){

    localStorage.clear();

    location.reload();

}

/*
==========================================================
BACKUP BUTTONS
==========================================================
*/

function initializeBackupButtons(){

    const exportButton=

        document.getElementById(

            "exportMemoryButton"

        );

    if(exportButton){

        exportButton.addEventListener(

            "click",

            exportDatabase

        );

    }

    const importButton=

        document.getElementById(

            "importMemoryButton"

        );

    if(importButton){

        importButton.addEventListener(

            "click",

            ()=>{

                const input=

                    document.createElement(

                        "input"

                    );

                input.type="file";

                input.accept=".json";

                input.onchange=(event)=>{

                    if(

                        event.target.files.length

                    ){

                        importDatabase(

                            event.target.files[0]

                        );

                    }

                };

                input.click();

            }

        );

    }

}

/*
==========================================================
START BACKUP
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeBackupButtons();

    }

);
/*
==========================================================
APPLICATION SETTINGS
==========================================================
*/

const Settings={

    notifications:true,

    autoSave:true,

    animations:true,

    sounds:false,

    compactMode:false,

    language:"en"

};

function loadSettings(){

    const saved=

        localStorage.getItem(

            "lifePlannerSettings"

        );

    if(saved){

        Object.assign(

            Settings,

            JSON.parse(saved)

        );

    }

}

function saveSettings(){

    localStorage.setItem(

        "lifePlannerSettings",

        JSON.stringify(Settings)

    );

}

function updateSetting(key,value){

    Settings[key]=value;

    saveSettings();

}

/*
==========================================================
ONLINE / OFFLINE
==========================================================
*/

function updateConnectionStatus(){

    const banner=

        document.getElementById(

            "offlineBanner"

        );

    if(!banner) return;

    if(navigator.onLine){

        banner.style.display="none";

    }else{

        banner.style.display="block";

    }

}

window.addEventListener(

    "online",

    ()=>{

        updateConnectionStatus();

        notification(

            "Connection Restored",

            "You're back online.",

            "success"

        );

    }

);

window.addEventListener(

    "offline",

    ()=>{

        updateConnectionStatus();

        notification(

            "Offline",

            "Internet connection lost.",

            "warning"

        );

    }

);

/*
==========================================================
APPLICATION CLOCK
==========================================================
*/

function updateClock(){

    const date=

        document.getElementById(

            "currentDate"

        );

    if(!date) return;

    date.innerText=

        new Date()

        .toLocaleString();

}

setInterval(

    updateClock,

    1000

);

/*
==========================================================
WELCOME MESSAGE
==========================================================
*/

function welcome(){

    notification(

        "Welcome",

        "Life Planner AI is ready.",

        "success"

    );

}

/*
==========================================================
APPLICATION HEALTH CHECK
==========================================================
*/

function healthCheck(){

    console.log(

        "Application:",

        App.name

    );

    console.log(

        "Version:",

        App.version

    );

    console.log(

        "Initialized:",

        App.initialized

    );

    console.log(

        "Database:",

        Database

    );

}

/*
==========================================================
START SETTINGS
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        loadSettings();

        updateClock();

        updateConnectionStatus();

        welcome();

        healthCheck();

    }

);
/*
==========================================================
FINAL INITIALIZATION
==========================================================
*/

function initializeApplication(){

    console.log(
        "========================================"
    );

    console.log(
        App.name
    );

    console.log(
        "Version:",
        App.version
    );

    console.log(
        "Application Started Successfully"
    );

    console.log(
        "========================================"
    );

    refreshDashboard();

    updateClock();

    updateConnectionStatus();

}

/*
==========================================================
WINDOW EVENTS
==========================================================
*/

window.addEventListener(

    "beforeunload",

    ()=>{

        if(Settings.autoSave){

            saveDatabase();

        }

    }

);

window.addEventListener(

    "focus",

    ()=>{

        refreshDashboard();

    }

);

window.addEventListener(

    "resize",

    ()=>{

        if(window.innerWidth>1100){

            if(DOM.sidebar){

                DOM.sidebar.classList.remove("active");

            }

        }

    }

);

/*
==========================================================
ERROR HANDLER
==========================================================
*/

window.addEventListener(

    "error",

    event=>{

        console.error(

            event.message

        );

        if(Settings.notifications){

            notification(

                "Application Error",

                event.message,

                "error"

            );

        }

    }

);

/*
==========================================================
UNHANDLED PROMISES
==========================================================
*/

window.addEventListener(

    "unhandledrejection",

    event=>{

        console.error(

            event.reason

        );

    }

);

/*
==========================================================
DEVELOPER TOOLS
==========================================================
*/

window.LifePlanner={

    App,

    Database,

    Settings,

    saveDatabase,

    loadDatabase,

    exportDatabase,

    importDatabase,

    clearDatabase,

    resetApplication,

    refreshDashboard,

    printStatistics,

    globalSearch

};

/*
==========================================================
APPLICATION STARTUP
==========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeApplication();

    }

);

/*
==========================================================
END OF SCRIPT
==========================================================
*/
