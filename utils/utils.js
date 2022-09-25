
function throttle(fn, delay){
    let valid = true;
    return function(){
        if(valid) {
            fn.apply(this, arguments);
            setTimeout(()=> {
                valid = true;
            }, delay)
            valid = false;
        }
    }
}

function debounce_1(fn,wait){
    let timerId = null;
    return function(){
        let context = this
        let args = arguments
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn.apply(context,args)
        },wait)
    }
}
export default {
    throttle,
    debounce_1
}
