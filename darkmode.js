// Dark mode

let settings = window.localStorage.getItem("rpu-settings");
if (settings) {
    renderSettings();
} else {
    // Default
    window.localStorage.setItem("rpu-settings", JSON.stringify({
        dark: false,
    }))
}

function renderSettings() {
    let settings = JSON.parse(window.localStorage.getItem("rpu-settings"));
    let classes = document.querySelector("html").classList;
    if (settings.dark) {
        if (!classes.contains("dark")) {
            classes.add("dark");
        }
        document.getElementById("input-dark").checked = true;
    } else {
        if (classes.contains("dark")) {
            classes.remove("dark");
        }
        document.getElementById("input-dark").checked = false;
    }
    document.querySelector("html").classList = classes;
}

function toggleDarkMode() {
    let settings = JSON.parse(window.localStorage.getItem("rpu-settings"));
    settings.dark = !settings.dark;
    window.localStorage.setItem("rpu-settings", JSON.stringify(settings));

    renderSettings();
}