
const $ = document.querySelector.bind(document)

/*
          * 1. Render songs
          * 2. Scroll top
          * 3. Play/ pause/ seek
          * 4. cd rotate
          * 5. Next / prev
          * 6. Random
          * 7. Next / repeat when ended
          * 8. Active song
          * 9. Scroll active song into view
          * 10. Play song when click
      */

const app = {
    songs: [
        {
            name: 'Bài không tên cuối cùng',
            image: './img/1e806c2bd1cc76922fdd.jpg',
            path: './list/BaiKhongTenCuoiCung-LeQuyen-3652831.mp3',
            singer: 'Lệ Quyên'
        },
        {
            name: 'Đắng cay',
            image: './img/2e0668a1d54672182b57.jpg',
            path: './list/DangCay-LeQuyen_p93z.mp3',
            singer: 'Lệ Quyên'
        },
        {
            name: 'Hoa nở về đêm',
            image: './img/9d5882bc205b8705de4a.jpg',
            path: './list/HoaNoVeDem-LeQuyen-3816892.mp3',
            singer: 'Lệ Quyên'
        },
        {
            name: 'Mật ngọt',
            image: './img/091337ba8a5d2d03744c.jpg',
            path: './list/MatNgot-DungHoangPham-9359370.mp3',
            singer: 'Dung hoàng phạm'
        },
        {
            name: 'Ngọn trúc đào',
            image: './img/bc304ea3f344541a0d55.jpg',
            path: './list/NgonTrucDao-LeQuyen-2449151.mp3',
            singer: 'Lệ Quyên'
        },

        {
            name: 'Riêng một góc trời',
            image: './img/1e806c2bd1cc76922fdd.jpg',
            path: './list/RiengMotGocTroi-TuanNgoc-2804943.mp3',
            singer: 'Tuần Ngọc'
        },
        {
            name: 'Rồi tới luôn',
            image: './img/9d5882bc205b8705de4a.jpg',
            path: './list/RoiToiLuon-Nal-7064237.mp3',
            singer: 'Nal'
        },

        {
            name: 'Dang dở',
            image: './img/f4c7276c9a8b3dd5649a.jpg',
            path: './list/DangDo-Nal-7661960.mp3',
            singer: 'Nal'
        },

        {
            name: 'Luông yêu đời',
            image: './img/1885bfdb103cb762ee2d.jpg',
            path: './list/LuonYeuDoi-Den-8692742.mp3',
            singer: 'Đen'
        },
        {
            name: 'Thương nhau tới bến',
            image: './img/e5dd7fb5d052770c2e43.jpg',
            path: './list/ThuongNhauToiBen-Nal-7079786.mp3',
            singer: 'Nal'
        },

    ],

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isReapeat: false,

    render: () => {
        const htmls = app.songs.map((song, index) => {
            return `
                <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },

    handleEvent: function () {
        const cdWidth = $('.cd').offsetWidth;

        window.onscroll = function () {
            const scroll = window.scrollY;

            const newcdWidth = cdWidth - scroll;

            $('.cd').style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0
            $('.cd').style.opacity = newcdWidth / cdWidth;
        }

        const cdAnnimation = $('.cd').animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnnimation.pause()

        /* Playing handle */
        $('.play').onclick = function () {

            if (app.isPlaying) {
                $('#audio').pause()
            } else {
                $('audio').play()
            }
        }
        /* Listen to events */
        $('#audio').onplay = function () {
            app.isPlaying = true
            $('.player').classList.add('playing')
            cdAnnimation.play()
        }

        $('#audio').onpause = function () {
            app.isPlaying = false
            $('.player').classList.remove('playing')
            cdAnnimation.pause()
        }

        /* seek */

        $('#audio').ontimeupdate = function () {

            $('#progress').value = (Math.floor($('#audio').currentTime) / $('#audio').duration * 100)

        }

        $('#progress').onchange = function (e) {
            const seekTime = $('#audio').duration / 100 * e.target.value
            $('#audio').currentTime = seekTime

        }

        /* Next */ 

        $('.next').onclick = function() {
            if(app.isRandom) {
                app.playRandomSong()
            } else {

                app.nextSong()
                app.render()
            }

            $('#audio').play()
        }

        /* Prev */ 
        $('.prev').onclick = function() {

            if(app.isRandom) {
                app.playRandomSong()

            } else {
                app.prevSong();
            }

            $('#audio').play()
            app.render()
        }

        /* Random active */
        $('.random').onclick = function() {
            app.isRandom = !app.isRandom
            $('.random').classList.toggle('active')
        }

        /* Next song when ended */ 

        $('#audio').onended = function() {
            if(app.isReapeat) {
                $('#audio').play()
            } else {

                $('.next').click()
            }
        }

        /* Reapet song */ 

        $('.repeat').onclick = function() {
            app.isReapeat =! app.isReapeat

            $('.repeat').classList.toggle('active')
        }
        
        /*  */ 

        $('.playlist').onclick = function(e) {
            if(e.target.closest('.song:not(.active)') || e.target.closest('.option')) {
                // 
                if(e.target.closest('.song:not(.active)')) {
                    app.currentIndex = Number(e.target.closest('.song:not(.active)').getAttribute('data-index'))
                    app.loadCurrenSong()
                    $('#audio').play()
                    app.render()
                }

                // 

                if(e.target.closest('.option')) {
                    console.log(e.target)
                }
            }
        }
    },
    
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.currentSong
        app.loadCurrenSong()
        app.render()
    },

    /* Next song */ 
    nextSong: function () {

        app.currentIndex++
        if (app.currentIndex >= this.songs.length) {
            app.currentIndex = 0
        }

        app.loadCurrenSong()
    },

    /* Prev song */ 
    prevSong: function () {

        app.currentIndex--
        if (app.currentIndex < 0) {
            app.currentIndex = this.songs.length-1
        }

        app.loadCurrenSong()
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    loadCurrenSong: function () {
        $('.header h2').textContent = this.currentSong.name
        $('.cd-thumb').style.backgroundImage = `url('${this.currentSong.image}')`
        $('#audio').src = `${this.currentSong.path}`
    },

    start: () => {
        app.defineProperties()
        app.loadCurrenSong()
        app.handleEvent()
        app.render()
    }
}

app.start();