// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        angle: 0,
        radius: 190,
        unitAngle: 0.07,
        centerY: -350,
        rewind: false,
        pause: false
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    resetPostion: function(){
        // console.log(this)
        // console.log(this.node)
        this.red = this.node.children[0]
        this.blue = this.node.children[1]

        //位置设定
        this.red.x = this.node.x - this.radius
        this.blue.x = this.node.x + this.radius
        this.red.y = this.centerY
        this.blue.y = this.centerY
        this.angle = 0
    },

    rotateControl: function(){
        let self = this

        //键盘监听事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event){
            switch(event.keyCode) {
                case cc.KEY.a:
                    self.roRight = false;
                    self.roLeft = true;
                    break;
                case cc.KEY.d:
                    self.roLeft = false;
                    self.roRight = true;
                    break;
            }
        });

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event){
            switch(event.keyCode) {
                case cc.KEY.a:
                    self.roLeft = false;
                    self.roRight = false;                    
                    break;
                case cc.KEY.d:
                    self.roLeft = false;    
                    self.roRight = false;
                    break;
            }
        });

        //触摸事件
        this.node.on('touchstart',function(event){
            if(event.getLocationX() < self.absolute_centerX){
                self.roRight = false;
                self.roLeft = true;
            }
            else {
                self.roLeft = false;
                self.roRight = true;
            }
        });

        this.node.on('touchend',function(event){
            if(event.getLocationX() < self.absolute_centerX){
                self.roLeft = false;
                self.roRight = false;
            }
            else {
                self.roLeft = false;
                self.roRight = false;
            }
        });
    },

    drawCenterCircle: function(){
        //绘制中心的圆
        let ctx = this.addComponent(cc.Graphics)

        ctx.lineWidth = 4
        ctx.strokeColor = cc.hexToColor('#555555')
        ctx.strokeColor.a = 150
        ctx.circle(this.node.width/2, this.node.height/2 + this.centerY, this.radius)
        ctx.stroke()
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //重制位置
        this.resetPostion()
        this.roLeft = false
        this.roRight = false
        this.absolute_centerX = this.node.width/2

        //加入旋转
        this.rotateControl()

        //绘制图形
        this.drawCenterCircle()

        // this.node.on('Collision', function (event) {
            //撞击之后的事件
            // console.log('circle game got message')
            // this.rewind = true
            // if (this.rewind) return
            // this.pause = true
            // this.rewindMark = 0
            // this.rewindAnlge = 0
            // console.log(event)
            // event.stopPropagation();
        // }, this);
    },

    //start函数在onload之后调用
    start () {

    },

    updateDotPos: function(){
        let posx = Math.cos(this.angle) * this.radius
        let posy = Math.sin(this.angle) * this.radius
        this.blue.x = posx
        this.blue.y = posy + this.centerY
        this.red.x = -posx
        this.red.y = -posy + this.centerY
    },

    update (dt) {
        if (this.pause) {
            // if (this.rewindMark >= 30) {
            //     this.pause = false
            //     this.rewindMark = 0
            //     this.rewind = true
            // }
            // else if (this.rewindAnlge === 0){
            //     let tempAngle = this.angle % Math.PI
            //     if (tempAngle > Math.PI / 2) this.rewindAnlge = tempAngle - Math.PI
            //     else this.rewindAnlge = tempAngle
            // }
            // else {
            //     this.rewindMark++
            // }
        }
        else if (this.rewind){
            //死亡，回到原点
            if (this.rewindMark < 60){
                this.angle -= (this.rewindAnlge + 2 * Math.PI) / 60
                this.updateDotPos()
                this.rewindMark++
            }
            else {
                this.rewind = false
                this.rewindAnlge = 0
                this.node.dispatchEvent(new cc.Event.EventCustom('CollisionRelive', true))
            }
        }
        else {
            //正常情况，接受用户交互
            if (this.roLeft){
                this.angle += this.unitAngle
            }
            else if (this.roRight){
                this.angle -= this.unitAngle
            }
            //计算新的位置
            this.updateDotPos()
        }
    },
});
