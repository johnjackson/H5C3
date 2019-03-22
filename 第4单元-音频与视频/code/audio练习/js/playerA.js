let myAudio = document.getElementById('audio');
let play_btn = document.getElementById('play_btn');
let volume = find('#volume');
let current_idx = 0;
let updateCurrentTime;
let mp3_list = ['Take Me To Your Heart', 'Butter-Fly', '圣斗士'];

let li_html = '';
mp3_list.map(function(item, i) {
    li_html += `<li data-idx="${i}" onClick="clickLi(this)">${item}</li>`
});

find('#mp3_list_box').innerHTML = li_html;

selectMusic(current_idx);


myAudio.onloadedmetadata = function() {
    let duration = myAudio.duration;
    document.getElementById('duration').innerText = formatTime(duration);
};

play_btn.onclick = function() {
    if (myAudio.paused) {
        myAudio.play();
        this.classList.add('pause_btn');
        this.classList.remove('play_btn');

        function _updateTime() {
            document.querySelector('#current_time').innerText = formatTime(myAudio.currentTime);
            let progress = parseInt(myAudio.currentTime / myAudio.duration * 100);
            find('#progress').value = progress;
        }
        _updateTime();
        updateCurrentTime = setInterval(_updateTime, 1000);
    } else {
        myAudio.pause();
        this.classList.remove('pause_btn');
        this.classList.add('play_btn');

        clearInterval(updateCurrentTime);
        updateCurrentTime = null;
    }
};

volume.onclick = function() {
    let volume = this.value;
    myAudio.volume = volume;
}
find('#progress').onchange = function() {
    let progress = this.value;
    myAudio.currentTime = myAudio.duration * progress / 100;
};

//选择一个歌曲
function selectMusic(idx) {
    current_idx = idx;
    myAudio.src = `./music/${mp3_list[idx]}.mp3`;
    let active_li = find('#mp3_list_box li.active');
    if (active_li) {
        active_li.classList.remove('active');
    }
    findAll('#mp3_list_box li')[idx].classList.add('active');
    stop();
}

function clickLi(el) {
    let idx = el.getAttribute('data-idx');
    selectMusic(idx);
}

function stop() {
    myAudio.pause();
    let btn = find('#player #play_btn');
    btn.classList.add('play_btn');
    btn.classList.remove('pause_btn');
    clearInterval(updateCurrentTime);
    updateCurrentTime = null;
    find('#progress').value = 0;
}

// 格式化时间
function formatTime(time) {
    let mins = parseInt(time / 60);
    let secs = parseInt(time % 60);
    return mins + ':' + (secs > 9 ? secs : '0' + secs);
}

function find(selector) {
    return document.querySelector(selector);
}

function findAll(selector) {
    return document.querySelectorAll(selector);
}