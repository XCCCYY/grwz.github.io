/*
 * Snowy
 * 
 * @version: 1.0
 */

(function() {
    this.Snowy = (function() {
        //构造函数
        function Snowy(container, count, move) {
            // 设置默认位置
            this.mouseX = 0;
            this.mouseY = 0;
            // 获取当前实例
            var self = this;
            // 设置容器
            this.container = $(container);
            // 创建粒子数组
            this.particles = [];
            // 创建粒子图像
            this.particleImage = new Image();
            // 设置粒子图像为一个简单的白色圆点（代表雪花）
            this.particleImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAVFBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////+UMeA9AAAAHHRSTlMBBAkUJQ5rTTswGOm81s2zopmRgXNeSCsd3olS4sNQLwAAAKVJREFUGNN1kUkWgyAQRIMg0Mg8q/e/Z5CY+LLo2vG7Hj3U6ysydT8etkz9VQZcKVWK0nV5+AU7awCN9avwo4qBrEJUCUzdnJBBpSg8Z16EHJyQaaZMnjzFEGLip2R0mXjtIPjhndbOH1xAX8ltLslra4zVPpVpv3CrPDq7b9tuXeS1fbACkYM225DRIQtQCEY/QVoiAyLrIMsjp0IOi8SAhIZE/AYm2Q1NKwkxLAAAAABJRU5ErkJggg==';
            // 窗口大小调整时触发
            $(window).resize(function() {
                self.onResize();
            }).trigger("resize");
            // 创建相机
            this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 10000);
            // 设置相机Z轴位置
            this.camera.position.z = 1000;
            // 创建场景
            this.scene = new THREE.Scene();
            // 添加相机到场景中
            this.scene.add(this.camera);
            // 创建渲染器
            this.renderer = new THREE.CanvasRenderer();
            // 设置渲染器尺寸
            this.renderer.setSize(this.width, this.height);
            // 创建材质
            this.material = new THREE.ParticleBasicMaterial({
                map: new THREE.Texture(this.particleImage)
            });
            //检查是否定义了粒子数量
            if (typeof count === 'undefined') {
                count = 250;
            }
            //检查是否启用移动交互
            if (typeof move === 'undefined') {
                move = false;
            }
            //创建粒子变量
            var particle = null;
            //添加粒子
            for (var i = 0; i < count; i++) {
                particle = new Snowflake(this.material);
                particle.position.x = Math.random() * 2000 - 1000;
                particle.position.y = Math.random() * 2000 - 1000;
                particle.position.z = Math.random() * 2000 - 1000;
                particle.scale.x = particle.scale.y = 1;
                this.scene.add(particle);
                this.particles.push(particle);
            }
            //将渲染器添加到容器中
            this.container.append(this.renderer.domElement);
            //Check for move
            if (move) {
                //On mouse move
                $(document).on('mousemove', function(e) {
                    self.onMouseMove(e);
                });
                //On touch start
                $(document).on('touchstart', function(e) {
                    self.onTouchStart(e);
                });
                //On touch start
                $(document).on('touchmove', function(e) {
                    self.onTouchMove(e);
                });
            }
            //开始主循环
            setInterval(function() {
                self.loop();
            }, 1000 / 25);
        }

        //On resize event
        Snowy.prototype.onResize = function() {
            //Set dimentsions
            this.width = this.container.outerWidth();
            this.height = this.container.outerHeight();
            this.windowHalfX = $(window).innerWidth() / 2;
            this.windowHalfY = $(window).innerHeight() / 2;
            //Set camera aspect
            if (this.camera) {
                this.camera.aspect = this.width / this.height;
            }
            //Set renderer size
            if (this.renderer) {
                this.renderer.setSize(this.width, this.height);
            }
        };

        //On mouse move
        Snowy.prototype.onMouseMove = function(event) {
            this.mouseX = event.clientX - this.windowHalfX;
            this.mouseY = event.clientY - this.windowHalfY;
        };

        //On touch start
        Snowy.prototype.onTouchStart = function(event) {
            if (event.touches.length == 1) {
                event.preventDefault();

                this.mouseX = event.touches[0].pageX - this.windowHalfX;
                this.mouseY = event.touches[0].pageY - this.windowHalfY;
            }
        };

        //On touch move
        Snowy.prototype.onTouchMove = function(event) {
            if (event.touches.length == 1) {
                event.preventDefault();

                this.mouseX = event.touches[0].pageX - this.windowHalfX;
                this.mouseY = event.touches[0].pageY - this.windowHalfY;
            }
        };

        //Main loop
        Snowy.prototype.loop = function() {
            for (var i = 0; i < this.particles.length; i++) {
                var particle = this.particles[i];
                particle.updatePhysics();

                with(particle.position) {
                    if (y < -1000) y += 2000;
                    if (x > 1000) x -= 2000;
                    else if (x < -1000) x += 2000;
                    if (z > 1000) z -= 2000;
                    else if (z < -1000) z += 2000;
                }
            }

            this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.1;
            this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.1;
            this.camera.lookAt(this.scene.position);
            this.renderer.render(this.scene, this.camera);
        };

        return Snowy;

    })();

}).call(this);

//Add as jQuery plugin
$.fn.snowy = function(count, move) {
    //Return new snowy
    return new Snowy(this, count, move);
};

/**
 * Snowflake
 **/

//Variables
var TO_RADIANS = Math.PI / 180;

//Constructor
var Snowflake = function(material) {
    //call particle constructor
    THREE.Particle.call(this, material);
    //define properties
    this.velocity = new THREE.Vector3(0, -8, 0);
    this.velocity.rotateX(randomRange(-45, 45));
    this.velocity.rotateY(randomRange(0, 360));
    this.gravity = new THREE.Vector3(0, 0, 0);
    this.drag = 1;
};

//Create prototype
Snowflake.prototype = new THREE.Particle();
Snowflake.prototype.constructor = Snowflake;

//Update physics
Snowflake.prototype.updatePhysics = function() {
    this.velocity.multiplyScalar(this.drag);
    this.velocity.addSelf(this.gravity);
    this.position.addSelf(this.velocity);
}

//Add rotate Y vector function
THREE.Vector3.prototype.rotateY = function(angle) {
    cosRY = Math.cos(angle * TO_RADIANS);
    sinRY = Math.sin(angle * TO_RADIANS);

    var tempz = this.z;;
    var tempx = this.x;

    this.x = (tempx * cosRY) + (tempz * sinRY);
    this.z = (tempx * -sinRY) + (tempz * cosRY);
}

//Add rotate X vector function
THREE.Vector3.prototype.rotateX = function(angle) {
    cosRY = Math.cos(angle * TO_RADIANS);
    sinRY = Math.sin(angle * TO_RADIANS);

    var tempz = this.z;;
    var tempy = this.y;

    this.y = (tempy * cosRY) + (tempz * sinRY);
    this.z = (tempy * -sinRY) + (tempz * cosRY);
}

//Add rotate Z vector function
THREE.Vector3.prototype.rotateZ = function(angle) {
    cosRY = Math.cos(angle * TO_RADIANS);
    sinRY = Math.sin(angle * TO_RADIANS);

    var tempx = this.x;;
    var tempy = this.y;

    this.y = (tempy * cosRY) + (tempx * sinRY);
    this.x = (tempy * -sinRY) + (tempx * cosRY);
}

//returns a random number
function randomRange(min, max) {
    return ((Math.random() * (max - min)) + min);
}