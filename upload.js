const app = Vue.createApp({
    data(){
        return {
            musics: null,
            music_lenth: 0,
            loader: false,
            errs: {
                active: false,
                message: '',
                data: null,
            },
            show_sumit: false,
        }
    },
    methods: {
        uploadFile(evnt){
            const fileMusic = evnt.target.files;
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            if (fileMusic.length >= 2 && fileMusic.length <= 20) {
                var data = new FormData();
                for (let i = 0; i < fileMusic.length - 1; i++) {
                    data.append('songs[]', fileMusic[i]);
                }
                this.musics = data;
                if(fileMusic.length > 0) {
                    this.show_sumit = true
                }
            } else {
                Toast.fire({
                    icon: 'warning',
                    title: "vous devez uploader au moins 2 fichiers et au plus 20"
                })
            }
        },
        async sendFiles(){
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
            this.loader = true;
            this.show_sumit =  false;

                axios({
                    method: 'post',
                    url: 'http://laravel9-music-api.test/api/music',
                    data: this.musics
                })
                .then(function(responce) {
                    if (responce.data.success == true && responce.status == 200) {
                        Toast.fire({
                            icon: 'warning',
                            title: response.data.message
                        })
                    }
                    this.loader = false;

                })
                .catch(function(error) {
                    if (error.response.data.success == false && error.response.status== 404) {
                        var err = error.response.data;
                        this.loader = false;
                        Toast.fire({
                            icon: 'warning',
                            title: error.response.data.message
                        })
                        if (typeof err.message !== 'undefined' && typeof err.data !== 'undefined') {
                            this.errs.message = err.message;
                            this.errs.data = err.data;
                            this.errs.active = true;
                        }  
                    }
                })
        },
        CloseAlert(){
            this.errs.active = false
        }
    }
});

const vm = app.mount("#app");