(function () {

    //单选全选功能
    select_all = function (qx, dxs) {
        //qx参数=全选按钮，类型：字符串（标签选择器）
        //dxs=全部单选，类型：字符串（标签选择器）
        var qx = document.querySelector(qx);//全选
        var dxs = document.querySelectorAll(dxs);//单选
        var i = 0//计数器
        qx.onclick = function () {
            if (this.checked) {//如果全选为true
                dxs.forEach(function (item) {
                    item.checked = true//全部单选为选中
                })
            } else {//否则全部单选未选中
                dxs.forEach(function (item) {
                    item.checked = false
                })
            }
        }
        dxs.forEach(function (item) {
            item.onclick = function () {
                if (item.checked == false) {//如果有一个dx为false
                    qx.checked = false//全选就未选中
                } else {
                    dxs.forEach(function (item) {
                        if (item.checked) {
                            i++//如果有一个单选为true就+1
                        } else {
                            i--//否则就减1
                        }
                    })
                    //如果计数器等于dx总数全选为选中
                    if (i == dxs.length) {
                        qx.checked = true
                    }
                    i = 0//清空计数器
                }
            }
        })
    }
    //倒计时
    countdown = function (date) {
        //计算两个Date对象和当前系统时间的Date对象相差的毫秒数，
        //通过相差的毫秒数，获取*天*小时*分钟
        //计算当前系统时间距离2018年圣诞节还有好久
        //两个date对象距离计算机元年的毫秒数相减
        var d1 = new Date(date)//指定时间
        var d2 = new Date()//当前系统时间
        //console.log(d1.getTime()-d2.getTime())
        //两个对象相减
        var d = d1 - d2
        d = Math.floor(d / 1000)
        //相差的秒数除以每天的秒数
        var day = d / (24 * 60 * 60)
        //向下确整
        day = Math.floor(day)
        //相差的小时 不满24的秒数
        //和24取余
        var hour = d % (24 * 60 * 60)
        hour = hour / (60 * 60)
        //对小时向下取整
        hour = Math.floor(hour);
        var m = d % (60 * 60);
        m = m / 60;
        m = Math.floor(m)
        var s = d % 60
        return day + '天' + hour + '小时' + m + '分钟' + s + '秒'
    }
    //手风琴
    accordion = function (item, down) {
        var iList = document.querySelectorAll(item), //整个item点击事件
            dList = document.querySelectorAll(down), //下拉框
            lastIndex = 0; //设置变量用来保存上一次的下标
        for (var i = 0; i < dList.length; i++) {//给下拉框加溢出隐藏样式
            dList[i].style.overflow = "hidden";
        }
        for (var i = 0; i < iList.length; i++) {
            iList[i].index = i; //自定义属性保存下标
            iList[i].initHeight = dList[i].clientHeight; //自动获取元素高度
            iList[i].isClick = false; //没有被点击
            dList[i].style.height = "0"; //给元素设置默认隐藏
            iList[i].addEventListener("click", function () {
                if (this.isClick) {
                    //如果被点击了
                    dList[this.index].style.height = "0"; //设置高度
                    this.isClick = false;//点击后设置为未点击
                } else {
                    dList[lastIndex].style.height = "0"; //清空上一次下标样式
                    dList[this.index].style.height = this.initHeight + "px"; //使元素显示
                    iList[lastIndex].isClick = false;//把上一次设置为未点击
                    lastIndex = this.index; //执行完后把下标保存到上一次下标中
                    this.isClick = true;
                }
            });
        }
    }
    //距离发布过了多久
    getDateDiff = function (date) {
        // 拿到当前时间戳和发布时的时间戳，然后得出时间戳差
        var curTime = new Date();
        var postTime = new Date(date);

        //部分浏览器不兼容此转换建议所以对此进行补充（指定调用自己定义的函数进行生成发布时间的时间戳）
        var timeDiff = curTime.getTime() - postTime.getTime();
        //上面一行代码可以换成以下（兼容性的解决）
        // var timeDiff = curTime.getTime() - getTs(date);
        // 单位换算
        var min = 60 * 1000;
        var hour = min * 60;
        var day = hour * 24;
        var week = day * 7;
        var month = week * 4;
        var year = 60 * 1000 * 60 * 24 * 365;
        // 计算发布时间距离当前时间的周、天、时、分
        var exceedyear = Math.floor(timeDiff / year);
        var exceedmonth = Math.floor(timeDiff / month);
        var exceedWeek = Math.floor(timeDiff / week);
        var exceedDay = Math.floor(timeDiff / day);
        var exceedHour = Math.floor(timeDiff / hour);
        var exceedMin = Math.floor(timeDiff / min);
        // 最后判断时间差到底是属于哪个区间，然后return
        if (curTime > postTime) {//如果时间还未到
            if (exceedyear < 100 && exceedyear > 0) {
                return exceedyear + '年前';
            } else {
                if (exceedmonth < 12 && exceedmonth > 0) {
                    return exceedmonth + '月前';
                } else {
                    if (exceedWeek < 4 && exceedWeek > 0) {
                        return exceedWeek + '星期前';
                    } else {
                        if (exceedDay < 7 && exceedDay > 0) {
                            return exceedDay + '天前';
                        } else {
                            if (exceedHour < 24 && exceedHour > 0) {
                                return exceedHour + '小时前';
                            } else {
                                if (exceedMin == 0) {
                                    return '刚刚';
                                } else {
                                    return exceedMin + '分钟前';
                                }
                            }
                        }
                    }
                }
            }
        } else {
            return "时间还未到"
        }
    }

    //农历
    calendar = {
        lunarInfo: [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,//1900-1909
            0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,//1910-1919
            0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,//1920-1929
            0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,//1930-1939
            0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,//1940-1949
            0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,//1950-1959
            0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,//1960-1969
            0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,//1970-1979
            0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,//1980-1989
            0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,//1990-1999
            0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,//2000-2009
            0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,//2010-2019
            0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,//2020-2029
            0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,//2030-2039
            0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,//2040-2049
            /**Add By JJonline@JJonline.Cn**/
            0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
            0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
            0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
            0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
            0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,//2090-2099
            0x0d520],//2100

        /**
          * 公历每个月份的天数普通表
          * @Array Of Property
          * @return Number 
          */
        solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

        /**
          * 天干地支之天干速查表
          * @Array Of Property trans["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]
          * @return Cn string 
          */
        Gan: ["\u7532", "\u4e59", "\u4e19", "\u4e01", "\u620a", "\u5df1", "\u5e9a", "\u8f9b", "\u58ec", "\u7678"],

        /**
          * 天干地支之地支速查表
          * @Array Of Property 
          * @trans["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]
          * @return Cn string 
          */
        Zhi: ["\u5b50", "\u4e11", "\u5bc5", "\u536f", "\u8fb0", "\u5df3", "\u5348", "\u672a", "\u7533", "\u9149", "\u620c", "\u4ea5"],

        /**
          * 天干地支之地支速查表<=>生肖
          * @Array Of Property 
          * @trans["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]
          * @return Cn string 
          */
        Animals: ["\u9f20", "\u725b", "\u864e", "\u5154", "\u9f99", "\u86c7", "\u9a6c", "\u7f8a", "\u7334", "\u9e21", "\u72d7", "\u732a"],

        /**
          * 24节气速查表
          * @Array Of Property 
          * @trans["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"]
          * @return Cn string 
          */
        solarTerm: ["\u5c0f\u5bd2", "\u5927\u5bd2", "\u7acb\u6625", "\u96e8\u6c34", "\u60ca\u86f0", "\u6625\u5206", "\u6e05\u660e", "\u8c37\u96e8", "\u7acb\u590f", "\u5c0f\u6ee1", "\u8292\u79cd", "\u590f\u81f3", "\u5c0f\u6691", "\u5927\u6691", "\u7acb\u79cb", "\u5904\u6691", "\u767d\u9732", "\u79cb\u5206", "\u5bd2\u9732", "\u971c\u964d", "\u7acb\u51ac", "\u5c0f\u96ea", "\u5927\u96ea", "\u51ac\u81f3"],

        /**
          * 1900-2100各年的24节气日期速查表
          * @Array Of Property 
          * @return 0x string For splice
          */
        sTermInfo: ['9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f',
            '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
            '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f',
            'b027097bd097c36b0b6fc9274c91aa', '9778397bd19801ec9210c965cc920e', '97b6b97bd19801ec95f8c965cc920f',
            '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd197c36c9210c9274c91aa',
            '97b6b97bd19801ec95f8c965cc920e', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bcf97c3598082c95f8e1cfcc920f',
            '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e',
            '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f',
            '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
            '97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd07f595b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9210c8dc2', '9778397bd19801ec9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f',
            '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
            '97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bd07f1487f595b0b0bc920fb0722',
            '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
            '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
            '97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
            '97b6b97bd19801ec9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
            '9778397bd097c36b0b6fc9210c91aa', '97b6b97bd197c36c9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
            '97b6b7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
            '9778397bd097c36b0b70c9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
            '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
            '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
            '97b6b7f0e47f531b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
            '9778397bd097c36b0b6fc9210c91aa', '97b6b7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '977837f0e37f149b0723b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c35b0b6fc9210c8dc2',
            '977837f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
            '7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
            '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd',
            '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
            '977837f0e37f14998082b0723b06bd', '7f07e7f0e37f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5',
            '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f531b0b0bb0b6fb0722',
            '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35',
            '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
            '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721',
            '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd',
            '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35',
            '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e37f14998083b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
            '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14898082b0723b02d5', '7f07e7f0e37f14998082b0787b0721',
            '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66aa89801e9808297c35', '665f67f0e37f14898082b0723b02d5',
            '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66a449801e9808297c35',
            '665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
            '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
            '7f07e7f0e47f531b0723b0b6fb0721', '7f0e26665b66a449801e9808297c35', '665f67f0e37f1489801eb072297c35',
            '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722'],

        /**
          * 数字转中文速查表
          * @Array Of Property 
          * @trans ['日','一','二','三','四','五','六','七','八','九','十']
          * @return Cn string 
          */
        nStr1: ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341"],

        /**
          * 日期转农历称呼速查表
          * @Array Of Property 
          * @trans ['初','十','廿','卅']
          * @return Cn string 
          */
        nStr2: ["\u521d", "\u5341", "\u5eff", "\u5345"],

        /**
          * 月份转农历称呼速查表
          * @Array Of Property 
          * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
          * @return Cn string 
          */
        nStr3: ["\u6b63", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341", "\u51ac", "\u814a"],

        /**
          * 返回农历y年一整年的总天数
          * @param lunar Year
          * @return Number
          * @eg:var count = calendar.lYearDays(1987) ;//count=387
          */
        lYearDays: function (y) {
            var i, sum = 348;
            for (i = 0x8000; i > 0x8; i >>= 1) { sum += (calendar.lunarInfo[y - 1900] & i) ? 1 : 0; }
            return (sum + calendar.leapDays(y));
        },

        /**
          * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
          * @param lunar Year
          * @return Number (0-12)
          * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
          */
        leapMonth: function (y) { //闰字编码 \u95f0
            return (calendar.lunarInfo[y - 1900] & 0xf);
        },

        /**
          * 返回农历y年闰月的天数 若该年没有闰月则返回0
          * @param lunar Year
          * @return Number (0、29、30)
          * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
          */
        leapDays: function (y) {
            if (calendar.leapMonth(y)) {
                return ((calendar.lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
            }
            return (0);
        },

        /**
          * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
          * @param lunar Year
          * @return Number (-1、29、30)
          * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
          */
        monthDays: function (y, m) {
            if (m > 12 || m < 1) { return -1 }//月份参数从1至12，参数错误返回-1
            return ((calendar.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
        },

        /**
          * 返回公历(!)y年m月的天数
          * @param solar Year
          * @return Number (-1、28、29、30、31)
          * @eg:var solarMonthDay = calendar.leapDays(1987) ;//solarMonthDay=30
          */
        solarDays: function (y, m) {
            if (m > 12 || m < 1) { return -1 } //若参数错误 返回-1
            var ms = m - 1;
            if (ms == 1) { //2月份的闰平规律测算后确认返回28或29
                return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
            } else {
                return (calendar.solarMonth[ms]);
            }
        },

        /**
         * 农历年份转换为干支纪年
         * @param  lYear 农历年的年份数
         * @return Cn string
         */
        toGanZhiYear: function (lYear) {
            var ganKey = (lYear - 3) % 10;
            var zhiKey = (lYear - 3) % 12;
            if (ganKey == 0) ganKey = 10;//如果余数为0则为最后一个天干
            if (zhiKey == 0) zhiKey = 12;//如果余数为0则为最后一个地支
            return calendar.Gan[ganKey - 1] + calendar.Zhi[zhiKey - 1];

        },

        /**
         * 公历月、日判断所属星座
         * @param  cMonth [description]
         * @param  cDay [description]
         * @return Cn string
         */
        toAstro: function (cMonth, cDay) {
            var s = "\u9b54\u7faf\u6c34\u74f6\u53cc\u9c7c\u767d\u7f8a\u91d1\u725b\u53cc\u5b50\u5de8\u87f9\u72ee\u5b50\u5904\u5973\u5929\u79e4\u5929\u874e\u5c04\u624b\u9b54\u7faf";
            var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
            return s.substr(cMonth * 2 - (cDay < arr[cMonth - 1] ? 2 : 0), 2) + "\u5ea7";//座
        },

        /**
          * 传入offset偏移量返回干支
          * @param offset 相对甲子的偏移量
          * @return Cn string
          */
        toGanZhi: function (offset) {
            return calendar.Gan[offset % 10] + calendar.Zhi[offset % 12];
        },

        /**
          * 传入公历(!)y年获得该年第n个节气的公历日期
          * @param y公历年(1900-2100)；n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起 
          * @return day Number
          * @eg:var _24 = calendar.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
          */
        getTerm: function (y, n) {
            if (y < 1900 || y > 2100) { return -1; }
            if (n < 1 || n > 24) { return -1; }
            var _table = calendar.sTermInfo[y - 1900];
            var _info = [
                parseInt('0x' + _table.substr(0, 5)).toString(),
                parseInt('0x' + _table.substr(5, 5)).toString(),
                parseInt('0x' + _table.substr(10, 5)).toString(),
                parseInt('0x' + _table.substr(15, 5)).toString(),
                parseInt('0x' + _table.substr(20, 5)).toString(),
                parseInt('0x' + _table.substr(25, 5)).toString()
            ];
            var _calday = [
                _info[0].substr(0, 1),
                _info[0].substr(1, 2),
                _info[0].substr(3, 1),
                _info[0].substr(4, 2),

                _info[1].substr(0, 1),
                _info[1].substr(1, 2),
                _info[1].substr(3, 1),
                _info[1].substr(4, 2),

                _info[2].substr(0, 1),
                _info[2].substr(1, 2),
                _info[2].substr(3, 1),
                _info[2].substr(4, 2),

                _info[3].substr(0, 1),
                _info[3].substr(1, 2),
                _info[3].substr(3, 1),
                _info[3].substr(4, 2),

                _info[4].substr(0, 1),
                _info[4].substr(1, 2),
                _info[4].substr(3, 1),
                _info[4].substr(4, 2),

                _info[5].substr(0, 1),
                _info[5].substr(1, 2),
                _info[5].substr(3, 1),
                _info[5].substr(4, 2),
            ];
            return parseInt(_calday[n - 1]);
        },

        /**
          * 传入农历数字月份返回汉语通俗表示法
          * @param lunar month
          * @return Cn string
          * @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
          */
        toChinaMonth: function (m) { // 月 => \u6708
            if (m > 12 || m < 1) { return -1 } //若参数错误 返回-1
            var s = calendar.nStr3[m - 1];
            s += "\u6708";//加上月字
            return s;
        },

        /**
          * 传入农历日期数字返回汉字表示法
          * @param lunar day
          * @return Cn string
          * @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
          */
        toChinaDay: function (d) { //日 => \u65e5
            var s;
            switch (d) {
                case 10:
                    s = '\u521d\u5341'; break;
                case 20:
                    s = '\u4e8c\u5341'; break;
                    break;
                case 30:
                    s = '\u4e09\u5341'; break;
                    break;
                default:
                    s = calendar.nStr2[Math.floor(d / 10)];
                    s += calendar.nStr1[d % 10];
            }
            return (s);
        },

        /**
          * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
          * @param y year
          * @return Cn string
          * @eg:var animal = calendar.getAnimal(1987) ;//animal='兔'
          */
        getAnimal: function (y) {
            return calendar.Animals[(y - 4) % 12]
        },

        /**
          * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
          * @param y  solar year
          * @param m  solar month
          * @param d  solar day
          * @return JSON object
          * @eg:console.log(calendar.solar2lunar(1987,11,01));
          */
        solar2lunar: function (y, m, d) { //参数区间1900.1.31~2100.12.31
            //年份限定、上限
            if (y < 1900 || y > 2100) {
                return -1;// undefined转换为数字变为NaN
            }
            //公历传参最下限
            if (y == 1900 && m == 1 && d < 31) {
                return -1;
            }
            //未传参  获得当天
            if (!y) {
                var objDate = new Date();
            } else {
                var objDate = new Date(y, parseInt(m) - 1, d)
            }
            var i, leap = 0, temp = 0;
            //修正ymd参数
            var y = objDate.getFullYear(),
                m = objDate.getMonth() + 1,
                d = objDate.getDate();
            var offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
            for (i = 1900; i < 2101 && offset > 0; i++) {
                temp = calendar.lYearDays(i);
                offset -= temp;
            }
            if (offset < 0) {
                offset += temp; i--;
            }

            //是否今天
            var isTodayObj = new Date(),
                isToday = false;
            if (isTodayObj.getFullYear() == y && isTodayObj.getMonth() + 1 == m && isTodayObj.getDate() == d) {
                isToday = true;
            }
            //星期几
            var nWeek = objDate.getDay(),
                cWeek = calendar.nStr1[nWeek];
            //数字表示周几顺应天朝周一开始的惯例
            if (nWeek == 0) {
                nWeek = 7;
            }
            //农历年
            var year = i;
            var leap = calendar.leapMonth(i); //闰哪个月
            var isLeap = false;

            //效验闰月
            for (i = 1; i < 13 && offset > 0; i++) {
                //闰月
                if (leap > 0 && i == (leap + 1) && isLeap == false) {
                    --i;
                    isLeap = true; temp = calendar.leapDays(year); //计算农历闰月天数
                }
                else {
                    temp = calendar.monthDays(year, i);//计算农历普通月天数
                }
                //解除闰月
                if (isLeap == true && i == (leap + 1)) { isLeap = false; }
                offset -= temp;
            }
            // 闰月导致数组下标重叠取反
            if (offset == 0 && leap > 0 && i == leap + 1) {
                if (isLeap) {
                    isLeap = false;
                } else {
                    isLeap = true; --i;
                }
            }
            if (offset < 0) {
                offset += temp; --i;
            }
            //农历月
            var month = i;
            //农历日
            var day = offset + 1;
            //天干地支处理
            var sm = m - 1;
            var gzY = calendar.toGanZhiYear(year);

            // 当月的两个节气
            // bugfix-2017-7-24 11:03:38 use lunar Year Param `y` Not `year`
            var firstNode = calendar.getTerm(y, (m * 2 - 1));//返回当月「节」为几日开始
            var secondNode = calendar.getTerm(y, (m * 2));//返回当月「节」为几日开始

            // 依据12节气修正干支月
            var gzM = calendar.toGanZhi((y - 1900) * 12 + m + 11);
            if (d >= firstNode) {
                gzM = calendar.toGanZhi((y - 1900) * 12 + m + 12);
            }

            //传入的日期的节气与否
            var isTerm = false;
            var Term = null;
            if (firstNode == d) {
                isTerm = true;
                Term = calendar.solarTerm[m * 2 - 2];
            }
            if (secondNode == d) {
                isTerm = true;
                Term = calendar.solarTerm[m * 2 - 1];
            }
            //日柱 当月一日与 1900/1/1 相差天数
            var dayCyclical = Date.UTC(y, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
            var gzD = calendar.toGanZhi(dayCyclical + d - 1);
            //该日期所属的星座
            var astro = calendar.toAstro(m, d);

            return { 'lYear': year, 'lMonth': month, 'lDay': day, 'Animal': calendar.getAnimal(year), 'IMonthCn': (isLeap ? "\u95f0" : '') + calendar.toChinaMonth(month), 'IDayCn': calendar.toChinaDay(day), 'cYear': y, 'cMonth': m, 'cDay': d, 'gzYear': gzY, 'gzMonth': gzM, 'gzDay': gzD, 'isToday': isToday, 'isLeap': isLeap, 'nWeek': nWeek, 'ncWeek': "\u661f\u671f" + cWeek, 'isTerm': isTerm, 'Term': Term, 'astro': astro };
        },

        /**
          * 传入农历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
          * @param y  lunar year
          * @param m  lunar month
          * @param d  lunar day
          * @param isLeapMonth  lunar month is leap or not.[如果是农历闰月第四个参数赋值true即可]
          * @return JSON object
          * @eg:console.log(calendar.lunar2solar(1987,9,10));
          */
        lunar2solar: function (y, m, d, isLeapMonth) {   //参数区间1900.1.31~2100.12.1
            var isLeapMonth = !!isLeapMonth;
            var leapOffset = 0;
            var leapMonth = calendar.leapMonth(y);
            var leapDay = calendar.leapDays(y);
            if (isLeapMonth && (leapMonth != m)) { return -1; }//传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
            if (y == 2100 && m == 12 && d > 1 || y == 1900 && m == 1 && d < 31) { return -1; }//超出了最大极限值 
            var day = calendar.monthDays(y, m);
            var _day = day;
            //bugFix 2016-9-25 
            //if month is leap, _day use leapDays method 
            if (isLeapMonth) {
                _day = calendar.leapDays(y, m);
            }
            if (y < 1900 || y > 2100 || d > _day) { return -1; }//参数合法性效验

            //计算农历的时间差
            var offset = 0;
            for (var i = 1900; i < y; i++) {
                offset += calendar.lYearDays(i);
            }
            var leap = 0, isAdd = false;
            for (var i = 1; i < m; i++) {
                leap = calendar.leapMonth(y);
                if (!isAdd) {//处理闰月
                    if (leap <= i && leap > 0) {
                        offset += calendar.leapDays(y); isAdd = true;
                    }
                }
                offset += calendar.monthDays(y, i);
            }
            //转换闰月农历 需补充该年闰月的前一个月的时差
            if (isLeapMonth) { offset += day; }
            //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
            var stmap = Date.UTC(1900, 1, 30, 0, 0, 0);
            var calObj = new Date((offset + d - 31) * 86400000 + stmap);
            var cY = calObj.getUTCFullYear();
            var cM = calObj.getUTCMonth() + 1;
            var cD = calObj.getUTCDate();

            return calendar.solar2lunar(cY, cM, cD);
        }
    };





    //图片压缩和base54转图片对象
    var f_data = {};
    function canvas_zip(data) {//构造函数}
        var el = this;
        //没传配置项自己丢错
        if (data) {
            el = Object.assign(el, f_data, data);//把options和参数对象d_object合并
        }
    };
    canvas_zip.prototype = {//构造函数的原型对象
        //图片压缩
        dealImage(path, obj, callback) {
            var img = new Image();
            img.src = path;
            img.onload = function () {
                var that = this;
                // 默认按比例压缩
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w = obj.width || w;
                h = obj.height || (w / scale);
                var quality = 0.95; // 默认图片质量为0.7
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                var anw = document.createAttribute("width");
                anw.nodeValue = w;
                var anh = document.createAttribute("height");
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.drawImage(that, 0, 0, w, h);
                // 图像质量
                if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
                    quality = obj.quality;
                }
                // quality值越小，所绘制出的图像越模糊
                var base64 = canvas.toDataURL('image/jpeg', quality);
                // 回调函数返回base64的值
                callback(base64);
            }
        },
        //调用方法
        // dealImage("base64url", {
        // 	// 注意：在pc端可以用绝对路径或相对路径，移动端最好用绝对路径（因为用take photo后的图片路径，我没有试成功（如果有人试成功了可以分享一下经验））
        // 	width: 1000,
        // }, function(base) {
        // 	//直接将获取到的base64的字符串，放到一个image标签中就可看到测试后的压缩之后的样式图了
        // 	//  document.getElementById("transform").src = base;
        // 	showImgDetail(base)
        // })


        //将base64图片转为文件
        dataURLtoFile(dataurl, filename = 'file') {
            console.log(111111)
            let arr = dataurl.split(',')
            let mime = arr[0].match(/:(.*?);/)[1]
            let suffix = mime.split('/')[1]
            let bstr = atob(arr[1])
            let n = bstr.length
            let u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new File([u8arr], `${filename}.${suffix}`, {
                type: mime
            })
        },

        //调用方法
        // var imgFile = dataURLtoFile(base);
        // console.log(imgFile.size)
    }
    number_format = function (number, decimals, dec_point, thousands_sep) {
        /*
         * 参数说明：
         * number：要格式化的数字
         * decimals：保留几位小数
         * dec_point：小数点符号
         * thousands_sep：千分位符号
         * */
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.ceil(n * k) / k;
            };

        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        var re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, "$1" + sep + "$2");
        }

        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }
    window.select_all = select_all//单选全选
    window.countdown = countdown//倒计时
    window.accordion = accordion//手风琴
    window.getDateDiff = getDateDiff//距离发布时间过了多久
    window.calendar = calendar//农历
    window.canvas_zip = canvas_zip//图片压缩和base64转图片
    window.number_format = number_format//金额数字格式   2,111.00

})()