console.log('Lets go');
let currentSong = new Audio();
let songs = []; // Initialized as an empty array
let currentFolder;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const paddedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return `${minutes}:${paddedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
 


    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Harry</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `https://raw.githubusercontent.com/yavishsahrawat40/yavishsahrawat40.github.io/main/songs/${currentFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    try {
        let response = await fetch(`https://api.github.com/repos/yavishsahrawat40/yavishsahrawat40.github.io/contents/songs`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        let cardContainer = document.querySelector(".cardContainer");

        for (let item of data) {
            if (item.type === "dir") {
                let folder = item.name;
                let metaResponse = await fetch(`https://raw.githubusercontent.com/yavishsahrawat40/yavishsahrawat40.github.io/main/songs/${folder}/info.json`);
                if (!metaResponse.ok) {
                    console.error(`Failed to fetch metadata for folder: ${folder}`);
                    continue;
                }
                let metadata = await metaResponse.json();
                cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <circle cx="12" cy="12" r="12" fill="green" />
                            <path
                            d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                stroke="#000000" stroke-width="1.5" stroke-linejoin="round" fill="none" />
                        </svg>
                    </div>
                    <img src="https://raw.githubusercontent.com/yavishsahrawat40/yavishsahrawat40.github.io/main/songs/${folder}/cover.jpeg" alt="">
                    <h2>${metadata.title}</h2>
                    <p>${metadata.description}</p>
                </div>`;
            }
        }

        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                console.log("Card clicked", item.currentTarget.dataset.folder);
                await getSongs(item.currentTarget.dataset.folder);
                if (songs.length > 0) {
                    playMusic(songs[0], true);
                } else {
                    console.error("No songs found in the folder");
                }
            });
        });
    } catch (error) {
        console.error("Failed to fetch albums:", error);
    }
}

async function main() {
    await getSongs("ncs");
    playMusic(songs[0], true);

    // Display all the albums
    displayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "5px";
        document.querySelector(".left").style.width = "390px";
        document.querySelector(".left").style.transition = "ease 1s";
        document.querySelector(".header").style.zIndex = "0";
    });

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
        document.querySelector(".header").style.zIndex = "1";
    });

    previous.addEventListener("click", () => {
        console.log("previous clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        } else {
            console.error("No previous song found");
        }
    });

    next.addEventListener("click", () => {
        console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        } else {
            console.error("No next song found");
        }
    });
}

main();
