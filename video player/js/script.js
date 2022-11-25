const videoPlayer = document.querySelector('.video-player');
const video = videoPlayer.querySelector('.video');
const sound = videoPlayer.querySelectorAll('.sound');

const buttonsPlay = videoPlayer.querySelectorAll('.js-play');
const buttonsPause = videoPlayer.querySelectorAll('.js-pause');
const buttonsBack = videoPlayer.querySelectorAll('.js-back');
const buttonsForward = videoPlayer.querySelectorAll('.js-forvard');
const buttonsVolumOn = videoPlayer.querySelectorAll('.js-volumOn');
const buttonsMute = videoPlayer.querySelectorAll('.js-mute');
const buttonsFullScreen = videoPlayer.querySelectorAll('.js-full-sceen');
const buttonsFullScreenExit = videoPlayer.querySelectorAll('.js-full-sceen-exit');

const videoProgress = videoPlayer.querySelector('.video__progress');
const soundRanges = videoPlayer.querySelectorAll('.sound__range');
const timePassed = videoPlayer.querySelector('.time-control__time-has-passed');
const controlsPanel = videoPlayer.querySelector('.controls-panel');
const controlsCenter = videoPlayer.querySelector('.controls-center');

let isChangeProgress = true;


//events
//Play and Pause
video.addEventListener('click', playOrPause);
buttonsPlay.forEach((item) => item.addEventListener('click',playOrPause));
buttonsPause.forEach((item) => item.addEventListener('click',playOrPause));

function playOrPause(event){    
    if (video.paused) {
        video.play();
        controlsCenter.style.opacity = 0;        
    }else{
        video.pause();
        controlsCenter.style.opacity = '100%';   
    }      
    buttonsPause.forEach((item) => item.classList.toggle('display_none'));
    buttonsPlay.forEach((item) => item.classList.toggle('display_none'));    
    changedCurrentTime();    
    event.stopPropagation();
}

//Show Controls
controlsCenter.addEventListener('mouseover', ()=>controlsCenter.style.opacity = "100%");
controlsCenter.addEventListener('mouseout', ()=> {if (!video.paused) controlsCenter.style.opacity = 0});
controlsPanel.addEventListener('mouseover', ()=>controlsPanel.style.opacity = "100%");
controlsPanel.addEventListener('mouseout', ()=>controlsPanel.style.opacity = 0);
video.addEventListener('click', showControlsPanel);

[...buttonsPlay].filter((item) => item.classList.contains("button-center"))
                .forEach((item) => item.addEventListener('click',showControlsPanel));

[...buttonsPause].filter((item) => item.classList.contains("button-center"))
                 .forEach((item) => item.addEventListener('click',showControlsPanel));

function showControlsPanel(){
    controlsPanel.style.opacity = '100%';
    setTimeout(() => controlsPanel.style.opacity = 0, 3000)
}

//videoProgress
video.addEventListener('durationchange', (event) => {
    videoProgress.max = video.duration;
    const duration = videoPlayer.querySelector('.time-control__duration');
    duration.innerHTML = secondsToTimeStr(video.duration);     
});

buttonsBack.forEach((item) => item.addEventListener('click',() =>changeCurrentTime(-10)));
buttonsForward.forEach((item) => item.addEventListener('click',() =>changeCurrentTime(25)));
videoProgress.addEventListener('mouseup', changeVideoProgress);
videoProgress.addEventListener('mousedown', () => isChangeProgress = false);

function changeCurrentTime(value){
    video.currentTime = video.currentTime + value;
    videoProgress.value = video.currentTime;
    if (video.paused) timePassed.innerHTML = secondsToTimeStr(video.currentTime);      
}

function changeVideoProgress(){    
    video.currentTime = videoProgress.value;
    videoProgress.value = video.currentTime;
    if (video.paused) timePassed.innerHTML = secondsToTimeStr(video.currentTime);
    isChangeProgress = true; 
}

function changedCurrentTime(){     
    if (video.paused) return;    
    setTimeout(() => {           
        if (isChangeProgress) videoProgress.value = video.currentTime;       
        timePassed.innerHTML = secondsToTimeStr(video.currentTime);
        changedCurrentTime();
    }, 1000);          
}

//Sound
buttonsVolumOn.forEach((item) => item.addEventListener('click',toogleMute));
buttonsMute.forEach((item) => item.addEventListener('click',toogleMute));
sound.forEach((item) => item.addEventListener('mouseover',RangeVolume));
soundRanges.forEach((item) => item.addEventListener('change',changeVolue));

function toogleMute(){   
    video.muted = !video.muted;
    buttonsVolumOn.forEach((item) => item.classList.toggle('display_none'));
    buttonsMute.forEach((item) => item.classList.toggle('display_none'));
}

function RangeVolume(){
    this.addEventListener('mouseover',showRangeVolume);
    this.addEventListener('mouseout',notShowRangeVolume);    
}

function showRangeVolume(){
    const soundRange = this.querySelector('.sound__range');
    if (soundRange.classList.contains('display_none')){
        soundRange.classList.remove('display_none')
    }    
}

function notShowRangeVolume(){    
    const soundRange = this.querySelector('.sound__range');
    if (!soundRange.classList.contains('display_none')){
        soundRange.classList.add('display_none')
    }    
}

function changeVolue(){
    let value = this.value;    
    video.volume = value/100;    
    if (video.muted != (video.volume == 0) ){
        toogleMute();
    }
    soundRanges.forEach((item) => item.value = value);
}

//Fullscreen
buttonsFullScreen.forEach((item) => item.addEventListener('click',openFullScreen));
buttonsFullScreenExit.forEach((item) => item.addEventListener('click',exitFullScreen));

function openFullScreen(){    
    videoPlayer.requestFullscreen();     
    buttonsFullScreen.forEach((item) => item.classList.toggle('display_none'));
    buttonsFullScreenExit.forEach((item) => item.classList.toggle('display_none'));
}

function exitFullScreen() {   
    document.exitFullscreen();   
    buttonsFullScreenExit.forEach((item) => item.classList.toggle('display_none'));
    buttonsFullScreen.forEach((item) => item.classList.toggle('display_none'));
}

//Handler Functions
function secondsToTimeStr(seconds){
    if (isNaN(Number(seconds))) return "00:00:00";

    seconds = Math.floor(seconds);
    let hours = minutes = sec = 0;
    hours = Math.floor(seconds / 3600);    
    seconds = hours > 0 ? seconds - hours * 3600: seconds;    
    minutes = Math.floor(seconds / 60);    
    seconds = minutes > 0 ? seconds - minutes * 60: seconds;     

    hours = hours < 10 ? `0${hours}`: hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours}:${minutes}:${seconds}`
}