���õķ���
1����ѡ��ȫѡ
   select_all(qx,dxs)  ����������� ���ͣ�string  
   ����select_all("#qx",".dx")
      ȫѡ��<input type="checkbox" id="qx"><br>
      ��ѡ��<input type="checkbox" class="dx"><br>
      ��ѡ��<input type="checkbox" class="dx"><br>
      ��ѡ��<input type="checkbox" class="dx"><br>


2������ʱ
   countdown(date)   һ��������� ���ͣ�string
   ������ʽΪ��countdown("2020/1/2 16:00:00")
               countdown("2020-1-2 16:00:00")
               countdown("2020/1/2")
               countdown("2020-1-2")

3���ַ���
   accordion(item,down)   ��������  ���ͣ�string
   ��һ��Ϊȫ������¼�ѡ����
   �ڶ���Ϊ����¼���Ӧ��������ѡ����
   ����accordion(".item",".item_down")      
     <li>
         <div class="item">����¼�</div>
         <div class="item_down">������</div>
      </li>
      <li>
         <div class="item">����¼�</div>
         <div class="item_down">������</div>
      </li>
      <li>
         <div class="item">����¼�</div>
         <div class="item_down">������</div>
      </li>


4�����뷢�����˶��
   getDateDiff(date)  һ���������  ���ͣ�string
   ������ʽΪ��getDateDiff("2020/1/2 16:00:00")
               getDateDiff("2020-1-2 16:00:00")
               getDateDiff("2020/1/2")
               getDateDiff("2020-1-2")


5��ũ��
   ����calendar.solar2lunar(year,month,date)//����ũ����1900-2100�������������꣬�£��գ����ͣ�number
    calendar.lYearDays(2020)//���ص�ǰ�������������  �����������꣩
    calendar.leapMonth(2020)//����ũ��y���������ĸ��£���y��û������ �򷵻�0   �����������꣩
    calendar.leapDays(2020)//����ũ��y�����µ����� ������û�������򷵻�0  �����������꣩
    calendar.solarDays(2020,5)//���ع���(!)y��m�µ�����  ������������,�·ݣ�
    calendar.toGanZhiYear(2012)//ũ�����ת��Ϊ��֧����   ������ũ���꣩
    calendar.toAstro(5,21)//�����¡����ж��������� //������ũ���£�ũ���£�
    calendar.toChinaMonth(12)//����ũ�������·ݷ��غ���ͨ�ױ�ʾ��  ������ũ���£�//����
    calendar.toChinaDay(21)//����ũ�������·ݷ��غ���ͨ�ױ�ʾ��  ������ũ���գ�//إһ
    calendar.getAnimal(21)//���ת��Ф[!���ܴ���ת��] => ��ȷ������Ф�ֽ����ǡ�������  �������꣩//��
    calendar.solar2lunar(1999,9,9)//�������������ջ����ϸ�Ĺ�����ũ��object��Ϣ  �����������꣬�£��գ�
    calendar.lunar2solar(1999,9,9)//����ũ���������Լ�������·��Ƿ����»����ϸ�Ĺ�����ũ��object��Ϣ   ������ũ���꣬�£��գ�


6��ͼƬѹ����base64תͼƬ
var zip=new canvas_zip();//����д����{a:1,b:2,c:3}
        //����pathͼƬ·����{}������function�ص�����
        zip.dealImage("path", {
            quality: 0.9,//ѹ��������0-1֮��
            width: 1000,//ѹ�����ͼƬ��ȣ���д�ߵȱ���
        }, function (base) {//ֱ�ӽ���ȡ����base64���ַ���
              console.log(base)
        })
base64תͼƬ����
var zip=new canvas_zip();
var imgFile = zip.dataURLtoFile(base);//����Ϊbase64����

7�����ǧ��λ��ʽ,
number_format(number, decimals, dec_point, thousands_sep)
��/*
���� * ����˵����
���� * number��Ҫ��ʽ��������
���� * decimals��������λС��
���� * dec_point��С�������
���� * thousands_sep��ǧ��λ����
���� * */
console.log(number_format(111111000.123, 2));