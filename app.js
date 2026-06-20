// ======================
// KOMANDO HARIAN v1
// ======================

const routines = [
    "Sholat Subuh",
    "Sholat Dzuhur",
    "Sholat Ashar",
    "Sholat Maghrib",
    "Sholat Isya",
    "Tilawah Al-Qur'an",
    "Dzikir Pagi",
    "Dzikir Sore",
    "Belajar Bahasa Inggris",
    "Olahraga Ringan",
    "Quality Time Keluarga"
];

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let condition = JSON.parse(localStorage.getItem("condition")) || {};

document.addEventListener("DOMContentLoaded", () => {
    loadRoutines();
    renderTasks();
    renderPriorities();
    calculateScore();
});

// ======================
// KEGIATAN RUTIN
// ======================

function loadRoutines() {

    const routineList = document.getElementById("routineList");

    routineList.innerHTML = "";

    routines.forEach(item => {

        const div = document.createElement("div");

        div.className = "routine-item";

        div.innerHTML = `
            <input type="checkbox">
            <span>${item}</span>
        `;

        routineList.appendChild(div);

    });
}

// ======================
// SIMPAN KONDISI HARI INI
// ======================

function saveCondition() {

    const energy =
        document.getElementById("energy").value;

    const time =
        document.getElementById("time").value;

    condition = {
        energy,
        time
    };

    localStorage.setItem(
        "condition",
        JSON.stringify(condition)
    );

    alert("Kondisi hari ini berhasil disimpan");
}

// ======================
// TAMBAH KEGIATAN
// ======================

function addTask() {

    const name =
        document.getElementById("taskInput").value;

    const impact =
        parseInt(
            document.getElementById("impact").value
        );

    const deadline =
        parseInt(
            document.getElementById("deadline").value
        );

    if (!name.trim()) {
        alert("Masukkan kegiatan terlebih dahulu");
        return;
    }

    const task = {
        id: Date.now(),
        name,
        impact,
        deadline,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    document.getElementById("taskInput").value = "";

    renderTasks();
    renderPriorities();
}

// ======================
// HITUNG PRIORITAS
// ======================

function calculatePriority(task) {

    let score = 0;

    score += task.impact * 40;

    score += task.deadline * 30;

    if (
        task.name.toLowerCase().includes("jual") ||
        task.name.toLowerCase().includes("closing") ||
        task.name.toLowerCase().includes("follow up") ||
        task.name.toLowerCase().includes("prospek")
    ) {
        score += 100;
    }

    if (
        condition.energy === "rendah" &&
        task.name.toLowerCase().includes("meeting")
    ) {
        score -= 50;
    }

    return score;
}

// ======================
// TAMPILKAN SEMUA TASK
// ======================

function renderTasks() {

    const taskList =
        document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const div = document.createElement("div");

        div.className =
            "task-item " +
            (task.completed ? "completed" : "");

        div.innerHTML = `
            <strong>${task.name}</strong>
            <br>
            Dampak: ${task.impact}
            |
            Deadline: ${task.deadline}
            <br><br>

            <button onclick="toggleTask(${task.id})">
                ${
                    task.completed
                    ? "Batalkan"
                    : "Selesai"
                }
            </button>

            <br><br>

            <button onclick="deleteTask(${task.id})">
                Hapus
            </button>
        `;

        taskList.appendChild(div);

    });
}

// ======================
// PRIORITAS UTAMA
// ======================

function renderPriorities() {

    const priorityList =
        document.getElementById("priorityList");

    priorityList.innerHTML = "";

    const sorted = [...tasks]
        .filter(t => !t.completed)
        .sort(
            (a, b) =>
            calculatePriority(b) -
            calculatePriority(a)
        )
        .slice(0, 3);

    sorted.forEach((task, index) => {

        const div = document.createElement("div");

        div.className = "priority-item";

        div.innerHTML = `
            <strong>
            #${index + 1}
            ${task.name}
            </strong>
        `;

        priorityList.appendChild(div);

    });
}

// ======================
// SELESAIKAN TASK
// ======================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed =
                !task.completed;
        }

        return task;
    });

    saveTasks();

    renderTasks();
    renderPriorities();
    calculateScore();
}

// ======================
// HAPUS TASK
// ======================

function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );

    saveTasks();

    renderTasks();
    renderPriorities();
    calculateScore();
}

// ======================
// SKOR PRODUKTIVITAS
// ======================

function calculateScore() {

    const scoreElement =
        document.getElementById(
            "productivityScore"
        );

    if (tasks.length === 0) {

        scoreElement.innerText = "0%";

        return;
    }

    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    const score =
        Math.round(
            (completed / tasks.length) * 100
        );

    scoreElement.innerText =
        score + "%";
}

// ======================
// SIMPAN DATA
// ======================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}
