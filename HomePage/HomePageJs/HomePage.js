// 自动锁屏
(function ($) {
    class ResourceManager {
        constructor(lockTime = 300000, loadTime = 302000) {
            this.lockTime = lockTime;
            this.loadTime = loadTime;
            this.inactivityTimeout;
            this.ifShow = false;
            this.$lockScreen = $('.AutomaticLockingScreen');
            this.$box = $('.box');
            $(document).ready(this.init.bind(this));
        }
        init() {
            this.removeElement(this.$lockScreen);
            this.resetInactivityTimeout();
            this.startLoadingAfterDelay();
            // 绑定事件监听器
            $(document).on('mousemove keydown scroll', this.resetInactivityTimeout.bind(this));
        }
        loadResources(resourceList) {
            const promises = resourceList.map(resource => {
                return resource.type === 'js' ? this.loadScript(resource.path) : this.loadStylesheet(resource.path);
            });
            return Promise.all(promises)
                .then(() => console.log('所有资源加载完成'))
                .catch(err => console.error('无法加载资源：', err));
        }
        loadScript(src) {
            return new Promise((resolve, reject) => {
                if (this.isResourceLoaded(src)) {
                    resolve();
                    return;
                }
                $('body').append($('<script>', {
                    src: src,
                    onload: resolve,
                    onerror: reject
                }));
            });
        }
        loadStylesheet(href) {
            return new Promise((resolve, reject) => {
                if (this.isResourceLoaded(href)) {
                    resolve();
                    return;
                }
                $('head').append($('<link>', {
                    rel: 'stylesheet',
                    href: href,
                    onload: resolve,
                    onerror: reject
                }));
            });
        }
        isResourceLoaded(url) {
            if (url.endsWith('.js')) {
                return Array.from($('script')).some(script => script.src === url);
            } else if (url.endsWith('.css')) {
                return Array.from($("link[rel='stylesheet']")).some(link => link.href === url);
            }
            return false;
        }
        showLockScreen() {
            if (this.ifShow) return;
            this.ifShow = true;
            this.addElement(this.$lockScreen);
            this.removeElement(this.$box);
            // 自动播放视频
            this.playVideo();
            // 按回车键解锁
            $(document).one('keydown.unlockScreen', e => {
                if (this.ifShow && e.key === 'Enter') {
                    this.hideLockScreen();
                }
            });
            this.$lockScreen.on('click', () => alert('请按回车键解锁'));
        }
        playVideo() {
            const video = this.$lockScreen.find('video')[0];
            if (video) {
                try {
                    video.play().catch(error => {
                        console.warn('视频播放失败:', error);
                    });
                } catch (error) {
                    console.warn('无法播放视频:', error);
                }
            }
        }
        hideLockScreen() {
            this.ifShow = false;
            this.removeElement(this.$lockScreen);
            this.addElement(this.$box);
            this.resetInactivityTimeout();
        }
        resetInactivityTimeout() {
            clearTimeout(this.inactivityTimeout);
            this.inactivityTimeout = setTimeout(this.showLockScreen.bind(this), this.lockTime);
        }
        startLoadingAfterDelay() {
            setTimeout(() => {
                this.loadResources([
                    { type: 'js', path: 'clock/clock.js' },
                    { type: 'js', path: 'clock/clock(1).js' },
                    { type: 'css', path: 'clock/clock.css' },
                ]);
            }, this.loadTime);
        }
        removeElement($element) {
            $element.detach(); // 使用detach而不是remove，保留事件和数据
        }
        addElement($element) {
            $element.appendTo('body'); // 将元素添加到body中
        }
    }
    // 初始化ResourceManager实例
    new ResourceManager();
})(jQuery); // 将jQuery作为参数传入，确保内部使用的$是jQuery对象
// 音乐播放器
(function ($) {
    function audioAutoPlay(id) {
        var $audio = $('#' + id);

        $audio[0].play().catch(function (error) {
            console.error('播放失败:', error); // 捕获并处理可能的播放错误
        });

        $(document).on("WindowJSBridgeReady", function () {
            $audio[0].pause();
        });
    }
    audioAutoPlay('media');
    $(function () {
        var audia = $('#media');
        audia[0].pause();
        $('#audio_btn').addClass('off');
        $('.rotate').hide();
        $('.rotate').removeClass('');
        $('#audio_btn').bind('click', function () {
            // $(this).hasClass("off") ? 
            $('.rotate').show();
            $(this).hasClass("off") ? ($(this).addClass("play_yinfu").removeClass("off"),
                $("#yinfu").addClass("rotate"),
                $("#media")[0].play()) : ($(this).addClass("off").removeClass("play_yinfu"),
                    $("#yinfu").removeClass("rotate"),
                    $("#media")[0].pause());
        });
    });
}(jQuery));
// 提示
$('.tips').ready(function () {
    $('.hover').click(function () {
        $('.tips').remove();
    });
});
// 主页背景
$(function() {
    //活动雪
    if ($.isFunction($.fn.snowy)) {
        $('.snowy').each(function() {
            //check for data
            if ($(this).is('[data-snowy]')) {
                $(this).snowy($(this).data('snowy'));
            } else {
                $(this).snowy();
            }
        });
    }
});
// 个人中心
// $('#IndividualCenter').remove();
// $(function(){
//     $('#Individual-Center').click(function(){
//         $('#IndividualCenter').appendTo();
//     })
// })