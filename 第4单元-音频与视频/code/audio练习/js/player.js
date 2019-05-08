var player = {
    audio_obj: getById("audio"),
    //audio元素对像

    play_btn: getById("play_btn"),
    //播放按钮
    // play_btn: document.getElementById("play_btn"),
    //播放按钮
    prev_btn: getById("prev_btn"),
    //
    next_btn: getById("next_btn"),
    //
    sound_btn: getById("sound_btn"),
    //
    progress: getById('progress'),

    volume_bar: getById('volume'),

    current_idx: 0,
    //当前正在播放歌曲下标
    updateCurrentTime: null,

    mp3_list: [ //文件名列表
        'Butter-Fly',

        'Take Me To Your Heart',
        '圣斗士'
    ],

    //初始化
    init: function() {
        //绑定播放按钮点击事件
        let that = this;
        this.play_btn.onclick = function() {
            that.handleClickPlayBtn();
        };

        this.prev_btn.onclick = function() {
            that.prev();
        };
        this.next_btn.onclick = function() {
            that.next();
        };
        this.audio_obj.onloadedmetadata = function() {
            that.initDuration();
        };

        this.audio_obj.onended = function() {
            that.pause();
        };

        this.progress.onchange = function() {
            that.changeProgress();
        };

        this.volume_bar.onchange = function() {
            that.changeVolume();
        };
        this.sound_btn.onclick = function() {
            that.toggleMuted();
        };

        //初始化播放列表的html
        this.initPlayList();

        // 默认选择第一首歌
        this.selectMusic(this.current_idx, false);
    },
    initDuration: function() {
        // console.log(this.audio_obj.duration);
        getById('duration').innerText = formatTime(this.audio_obj.duration);
    },

    //初始化播放列表的html
    initPlayList: function() {
        let li_html = '';

        this.mp3_list.map(function(item, i) {
            var str = `<li idx="${i}" onClick="player.handleClickMusic(this)">${item}</li>`;
            li_html += str;
        });

        getById('mp3_list_box').innerHTML = li_html;
    },

    changeProgress: function() {
        this.audio_obj.currentTime = this.audio_obj.duration * this.progress.value / this.progress.max;
    },

    //播放 或 停止
    handleClickPlayBtn: function() {
        // console.log(this);
        //判断当前是否为暂停状态 paused 为true 为暂停 否则为播放
        if (this.audio_obj.paused) {
            this.play();
        } else {
            this.pause();
        }
    },
    //播放
    play: function() {
        this.audio_obj.play();

        //切换按钮图片
        this.play_btn.classList.add('pause_btn');
        // this.play_btn.classList.add('big');
        this.play_btn.classList.remove('play_btn');
        // this.play_btn.classList.remove('normal');



        // //定时更新
        this.updateCurrentTime = setInterval(() => {
            getById('current_time').innerText = formatTime(this.audio_obj.currentTime);

            let progress = parseInt(this.audio_obj.currentTime / this.audio_obj.duration * 100);
            getById('current_time').value = progress;
        }, 1000);
    },
    //暂停
    pause: function() {
        this.audio_obj.pause();

        let btn = this.play_btn;
        btn.classList.add('play_btn');
        btn.classList.remove('pause_btn');
        // this.play_btn.classList.remove('big');

        clearInterval(this.updateCurrentTime);
        this.updateCurrentTime = null;
    },
    //停止
    // stop: function() {
    //     this.pause();
    //     find('#progress').value = 0;
    // },

    //选择一个歌曲
    selectMusic: function(idx, autoplay = true) {
        this.current_idx = idx;

        this.audio_obj.src = `./music/${this.mp3_list[idx]}.mp3`;

        let active_li = find('#mp3_list_box li.active');
        if (active_li) {
            active_li.classList.remove('active');
        }
        findAll('#mp3_list_box li')[idx].classList.add('active');

        if (autoplay) {
            this.play();
        }
    },
    // 上一首
    prev: function() {
        this.current_idx = this.current_idx > 0 ? --this.current_idx : this.mp3_list.length - 1;
        this.selectMusic(this.current_idx);
    },
    // 下一首
    next: function() {
        this.current_idx = this.current_idx < this.mp3_list.length - 1 ? ++this.current_idx : 0;
        this.selectMusic(this.current_idx);
    },

    changeVolume: function() {
        var vol = this.volume_bar.value;
        this.audio_obj.volume = vol;

        if (vol == 0) {
            // 是静音
            this.audio_obj.muted = true;
            this.sound_btn.classList.remove('sound_btn');
            this.sound_btn.classList.add('muted_btn');
        } else {
            // 不是静音
            this.audio_obj.muted = false;
            this.sound_btn.classList.remove('muted_btn');
            this.sound_btn.classList.add('sound_btn');
        }
    },

    toggleMuted: function() {
        this.audio_obj.muted = !this.audio_obj.muted;
        //判断当前播放器是否静音
        if (this.audio_obj.muted) {
            this.sound_btn.classList.remove('sound_btn');
            this.sound_btn.classList.add('muted_btn');
            this.volume_bar.value = 0;
        } else {
            this.sound_btn.classList.remove('muted_btn');
            this.sound_btn.classList.add('sound_btn');
            this.volume_bar.value = this.audio_obj.volume;
        }
    },

    //点击播放列表中的一首歌
    handleClickMusic(el) {
        let idx = el.getAttribute('idx');
        this.selectMusic(idx);
    }
};


player.init();

//工具函数
function getById(id) {
    return document.getElementById(id);
}

function find(selector) {
    return document.querySelector(selector);
}

function findAll(selector) {
    return document.querySelectorAll(selector);
}
// 格式化时间 将秒 转成 分:秒 mm:ss
function formatTime(time) {
    let mins = Math.round(time / 60);
    let secs = Math.round(time % 60);
    return (mins > 9 ? mins : '0' + mins) + ':' + (secs > 9 ? secs : '0' + secs);
}
