function $(str) {
    return document.getElementById(str);
}

function showLoading() {
    const loading = document.createElement("div");
    loading.id = "loading";
    loading.textContent = "Loading...";
    $("results").innerHTML = "";
    $("results").appendChild(loading);
}

function hideLoading() {
    const loading = $("loading");
    if (loading) {
        loading.remove();
    }
}

function search() {
    const text = $("search-bar").value;
    
    let newText = text.trim();
    newText = newText.replaceAll(' ', "+");

    showLoading();

    fetch(`https://itunes.apple.com/search?term=${newText}&media=music&attribute=artistTerm&limit=100`)
    .then(result => {
        return result.json();
    })
    .then(data => {
        hideLoading();
        console.log(data);
        handleResult(data);
    })
    .catch(error => {
        hideLoading();
        console.error("Error fetching data:", error);
    });
}

function handleResult(data) {
    const table = document.createElement("table");
    const header = document.createElement("tr");
    
    const artist = document.createElement("th");
    artist.textContent = "Előadó";
    header.appendChild(artist);

    const title = document.createElement("th"); 
    title.textContent = "Cím";
    header.appendChild(title);

    const length = document.createElement("th");
    length.textContent = "Hossz";
    header.appendChild(length);

    const releaseYear = document.createElement("th");
    releaseYear.textContent = "Kiadás Éve";
    header.appendChild(releaseYear);

    const audioPlayerOpenerButton = document.createElement("th");
    audioPlayerOpenerButton.textContent = "Lejátszás";
    header.appendChild(audioPlayerOpenerButton);
    
    table.appendChild(header);

    for (const result of data.results) {
        const row = document.createElement("tr");
        
        const artist = document.createElement("td");
        artist.textContent = result.artistName;
        row.appendChild(artist);

        const title = document.createElement("td");
        title.textContent = result.trackName;
        row.appendChild(title);

        const length = document.createElement("td");
        const minutes = Math.floor(result.trackTimeMillis / 60000);
        let seconds = Math.floor((result.trackTimeMillis % 60000) / 1000);
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        length.textContent = `${minutes}:${seconds}`;
        row.appendChild(length);

        const releaseYear = document.createElement("td");
        const releaseDate = new Date(result.releaseDate);
        releaseYear.textContent = releaseDate.getFullYear();
        row.appendChild(releaseYear);

        const audioPlayerOpenerButton = document.createElement("td");
        const button = document.createElement("button");
        button.textContent = "Lejátszás";
        button.addEventListener("click", () => openModal(result.previewUrl));
        audioPlayerOpenerButton.appendChild(button);
        row.appendChild(audioPlayerOpenerButton);

        table.appendChild(row);
    }

    $("results").innerHTML = "";
    $("results").appendChild(table);

    $("results_sum").innerHTML = `Találatok száma: ${data.results.length}`;
}

function openModal(audioUrl) {
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%) scale(0)";
    modal.style.backgroundColor = "white";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    modal.style.zIndex = "1000";
    modal.style.transition = "transform 0.3s ease";

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = audioUrl;
    modal.appendChild(audio);

    const closeButton = document.createElement("button");
    closeButton.textContent = "Bezárás";
    closeButton.addEventListener("click", () => {
        modal.style.transform = "translate(-50%, -50%) scale(0)";
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    modal.appendChild(closeButton);

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.style.transform = "translate(-50%, -50%) scale(1)";
    }, 0);
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

const darkModeSwitch = document.createElement("button");
darkModeSwitch.textContent = "Dark mode";
darkModeSwitch.addEventListener("click", toggleDarkMode);
$("dark-mode-container").appendChild(darkModeSwitch);

$("search").addEventListener("click", search);
$("search-bar").addEventListener("keypress", event => {
    if (event.key === "Enter") {
        search();
    }
});

const style = document.createElement("style");
style.textContent = `
    .dark-mode {
        background-color: #121212;
        color: #ffffff;
    }
    .dark-mode table {
        background-color: #1e1e1e;
    }
    .dark-mode th, .dark-mode td {
        border: 1px solid #ffffff;
        background-color: #1e1e1e;
    }
    .dark-mode button {
        background-color: #333333;
        color: #ffffff;
    }
    
`;
document.head.appendChild(style);
