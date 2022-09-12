let startY = 0  //手指起始的坐标
let moveY = 0  //手指移动的坐标
let moveDistance = 0  //手指移动的距离

Page({
    data: {
        coverTransform:'translateY(0rpx)',
        coverTransition:''
    },
    onLoad: function (options) {

    },
    handleTouchStart(event){
        this.setData({
            coverTransition:''
        })
        startY = event.touches[0].clientY

    },
    handleTouchMove(event){
        moveY = event.touches[0].clientY
        moveDistance = moveY - startY
        if (moveDistance<=0){
            return
        }
        if (moveDistance>=80){
            moveDistance=80
        }
        this.setData({
            coverTransform:`translateY(${moveDistance}rpx)`
        })
    },
    handleTouchEnd(){
        this.setData({
            coverTransform:`translateY(0rpx)`
        })
        this.setData({
            coverTransition:'transform 1s linear'
        })
    }
});
