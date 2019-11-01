常用的方法
1、单选和全选
   select_all(qx,dxs)  两个必填参数 类型：string  
   例：select_all("#qx",".dx")
      全选：<input type="checkbox" id="qx"><br>
      单选：<input type="checkbox" class="dx"><br>
      单选：<input type="checkbox" class="dx"><br>
      单选：<input type="checkbox" class="dx"><br>


2、倒计时
   countdown(date)   一个必填参数 类型：string
   例：格式为：countdown("2020/1/2 16:00:00")
               countdown("2020-1-2 16:00:00")
               countdown("2020/1/2")
               countdown("2020-1-2")

3、手风琴
   accordion(item,down)   两个参数  类型：string
   第一个为全部点击事件选择器
   第二个为点击事件对应的下拉框选择器
   例：accordion(".item",".item_down")      
     <li>
         <div class="item">点击事件</div>
         <div class="item_down">下拉框</div>
      </li>
      <li>
         <div class="item">点击事件</div>
         <div class="item_down">下拉框</div>
      </li>
      <li>
         <div class="item">点击事件</div>
         <div class="item_down">下拉框</div>
      </li>


4、距离发布过了多久
   getDateDiff(date)  一个必填参数  类型：string
   例：格式为：getDateDiff("2020/1/2 16:00:00")
               getDateDiff("2020-1-2 16:00:00")
               getDateDiff("2020/1/2")
               getDateDiff("2020-1-2")


5、农历
   例：calendar.solar2lunar(year,month,date)//返回农历（1900-2100）三个参数（年，月，日）类型：number
    calendar.lYearDays(2020)//返回当前年的阴历总天数  参数（公历年）
    calendar.leapMonth(2020)//返回农历y年闰月是哪个月；若y年没有闰月 则返回0   参数（公历年）
    calendar.leapDays(2020)//返回农历y年闰月的天数 若该年没有闰月则返回0  参数（公历年）
    calendar.solarDays(2020,5)//返回公历(!)y年m月的天数  参数（公历年,月份）
    calendar.toGanZhiYear(2012)//农历年份转换为干支纪年   参数（农历年）
    calendar.toAstro(5,21)//公历月、日判断所属星座 //参数（农历月，农历月）
    calendar.toChinaMonth(12)//传入农历数字月份返回汉语通俗表示法  参数（农历月）//腊月
    calendar.toChinaDay(21)//传入农历数字月份返回汉语通俗表示法  参数（农历日）//廿一
    calendar.getAnimal(21)//年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”  参数（年）//免
    calendar.solar2lunar(1999,9,9)//传入阳历年月日获得详细的公历、农历object信息  参数（阳历年，月，日）
    calendar.lunar2solar(1999,9,9)//传入农历年月日以及传入的月份是否闰月获得详细的公历、农历object信息   参数（农历年，月，日）


6、图片压缩和base64转图片
var zip=new canvas_zip();//可以写参数{a:1,b:2,c:3}
        //参数path图片路径，{}参数，function回调函数
        zip.dealImage("path", {
            quality: 0.9,//压缩的质量0-1之间
            width: 1000,//压缩后的图片宽度，不写高等比例
        }, function (base) {//直接将获取到的base64的字符串
              console.log(base)
        })
base64转图片对象
var zip=new canvas_zip();
var imgFile = zip.dataURLtoFile(base);//参数为base64编码

7、金额千分位格式,
number_format(number, decimals, dec_point, thousands_sep)
　/*
　　 * 参数说明：
　　 * number：要格式化的数字
　　 * decimals：保留几位小数
　　 * dec_point：小数点符号
　　 * thousands_sep：千分位符号
　　 * */
console.log(number_format(111111000.123, 2));