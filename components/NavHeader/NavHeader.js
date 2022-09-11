Component({
    //组件的属性列表，由组件外部传入的数据，等同于Vue中的Props
    properties: {
        title:{
            type:String,
            value:'我是title默认值'
        },
        nav:{
            type:String,
            value:'我是nav默认值'
        }
    },
    data: {},
    methods: {}
});
