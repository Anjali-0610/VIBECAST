console.log('from here i am starting javascript');
let currentSong = new Audio();
let songs;
let currFolder;



//function to convert second to minute
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


//this function is used to fetch songs-url froom the http://127.0.0.1:5500/songs/ and then cleaning it by only selcting the anchor tag tags which contain the songs link only
async function getSongs(folder){
    currFolder = folder;                                 //current folder is updated
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)      
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])       //to just show the name of song//
        }
    }


    
    //to show all the songs list in 
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""                  /*taaaki songs append na ho jis card pe click hai vahi aaye baas*/
    for (const song of songs) { 
        songUL.innerHTML = songUL.innerHTML + `<li>      
                 <img width="34" src="img/music.svg" alt="" class="invert" >
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Anjali</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div></li>`;
    }

    
    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {                                                         //agar click hua to play karna raheag//
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())                       //playmusic call hoga click karne paar

        })
    })
  return songs
}

const playMusic = (track,pause=false) => {
    currentSong.src = `/${currFolder}/`+ track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"                //jab play music call hoga event listener to each song ke through to pause ka sign aa jana chaiye 
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)        //song ki info playbar par lane ke liye aur decode karne ke liye DECODEURI
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"         //kitna time ka song play ho chuka hai jo ki inital mene 00:00 rakha hai


}


     


 async function main(){
    //to get the list of all the songs
    await getSongs("songs/aav");
    playMusic(songs[0], true)
    console.log(songs)

    //  // Display all the albums on the page
    //  await displayAlbums()

     // Attach an event listener to play, next and previous
     play.addEventListener("click", () => {
        if (currentSong.paused) {           //initial state play icon thi jab playmusic call hua to pause icon aaya ,,aur ab aur agar pause hoga to play aur play hoga to pause ho jayega icon click karne par!!
            currentSong.play()
            play.src = "img/pause.svg"         
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

     // Listen for timeupdate event
     currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`   //cuurenttime/duration  song ka time update karne ke liye
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";             //circle to according to timr chalane ke liye
    })

    
    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {                                                                                       
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;                  //jahan click kre wahan se shuru ho jaye
        document.querySelector(".circle").style.left = percent + "%";
      
        currentSong.currentTime = ((currentSong.duration) * percent) / 100                             //jahan click kare wahan ka time aayega
    })

     // Add an event listener for hamburger                                                 
     document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"                                               //jaise hi hamburger pe click hoga left bar bahar aa jayega ktunki left -130 se 0 ho gayi hia*/
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })


      // Add an event listener to previous
      previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {                                                   /*agar  song  first hai to prev kaise jayenge*/
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {                                                 /*agar first last hai to next kaise jayenge*/
            playMusic(songs[index + 1])
        }
    })

     // Add an event to volume
     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

     // Load the playlist whenever card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })

     

  }

  main()