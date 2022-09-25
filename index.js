const app = Vue.createApp({
    created(){
        this.import();
        this.musicTimeUpdate();
    },
    data(){
        return {
            songs: [],
            error: {
                active: false,
                message: ''
            },
            music_length: 0,
            now_playing: {
                audio: null,
                playing_id: null,
                is_play: false,
                minutes: "0:00",
                width: 0,
                repeat_type: 'repeat',
                show_music_list: ''
            },
            
        }
    },
    methods: {
        import(){
            axios.get('http://laravel9-music-api.test/api/music')
                .then(responce => {
                    if (responce.data.data.length) {
                        this.error.active = false;
                        this.songs = responce.data.data;
                        this.now_playing.playing_id = 0;
                        var audio = new Audio(responce.data.data[0].path);
                        this.now_playing.audio = audio;
                        this.music_length = responce.data.data.length - 1;
                    } else {
                        this.error.active = true;
                        this.error.message =  "Aucun songs n'a été trouver";
                    }
                })
                .catch(() => {
                    this.error.active = true;
                    this.error.message =  "Une erreur est survenue";
                })
        },
        playSong() {
            this.now_playing.is_play = true;
            this.now_playing.audio.play();
        },
        pauseSong() {
            this.now_playing.is_play = false;
            this.now_playing.audio.pause();
        },
        prevMusic(){
            let playing_id = this.now_playing.playing_id;
            let id = (playing_id == 0) ? this.music_length : playing_id - 1;
            this.playingSong(id);
        },
        nextMusic(){
            let playing_id = this.now_playing.playing_id;
            let id = (playing_id == this.music_length) ? 0 : playing_id + 1;
            this.playingSong(id);
        },
        formatDuration(seconds){
            let minutes = Math.floor(seconds / 60);
            let extraSeconds = Math.floor(seconds % 60);
            extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;
            return `${minutes}:${extraSeconds}`;
        },
        playingSong(idSong){
            this.pauseSong();
            this.now_playing.audio = null;
            this.now_playing.playing_id = idSong;
            this.now_playing.audio = new Audio(this.songs[idSong].path);
            this.now_playing.minutes = "0:00";
            this.now_playing.width = 0;
            this.playSong();
        },
        musicTimeUpdate(){
            setInterval(() => {
                if (this.now_playing.is_play) {
                    this.now_playing.minutes = this.formatDuration(this.now_playing.audio.currentTime);
                    this.now_playing.width = (100 * this.now_playing.audio.currentTime) / this.now_playing.audio.duration;
                }

                if (this.now_playing.audio.ended) {
                    let type = this.now_playing.repeat_type; 
                    switch (type) {
                        case 'repeat':
                            this.nextMusic();
                            break;
                        case 'repeat_one':
                            this.now_playing.audio.currentTime = 0;
                            this.playSong();
                            break;
                        case 'shuffle':
                            let randIndex = Math.floor((Math.random() * this.music_length) + 1);
                            do {
                                randIndex = Math.floor((Math.random() * this.music_length) + 1);
                            } while (this.now_playing.playing_id == randIndex);
                            this.playingSong(randIndex);
                            break;
                    }
                }

                if (this.now_playing.audio.paused) {
                    this.now_playing.is_play = false;
                }

                if (!this.now_playing.audio.paused) {
                    this.now_playing.is_play = true;
                }
            }, 750);
        },
        anvancerSong(event){
            const progressArea = document.querySelector(".wrapper .progress-area");
            this.now_playing.audio.currentTime = (event.offsetX / progressArea.clientWidth) * this.now_playing.audio.duration;
            this.playSong();
        },
        changeRepeatType(){
            let type = this.now_playing.repeat_type; 
            switch (type) {
                case 'repeat':
                    this.now_playing.repeat_type = 'repeat_one';
                    break;
                case 'repeat_one':
                    this.now_playing.repeat_type = 'shuffle';
                    break;
                case 'shuffle':
                    this.now_playing.repeat_type = 'repeat';
                    break;
            }
        },
        showMusicList(){
            this.now_playing.show_music_list = 'show'
        },
        hideMusicList(){
            this.now_playing.show_music_list = ''
        }
    }
});

const vm = app.mount("#app");