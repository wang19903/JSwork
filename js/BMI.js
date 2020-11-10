let btn = document.querySelector('.btn');
const list = document.querySelector('.list');
let data = JSON.parse(localStorage.getItem('bmiData')) || [];
const ClearData = document.querySelector('.ClearData');
const del = document.querySelector('ul');
const btnArea = document.querySelector('.btnArea');

//時間
let date = new Date();
const yy = date.getFullYear();
const mm = date.getMonth() + 1;
const dd = date.getDate();
time = dd + '/' + mm + '/' + yy;

//監聽
btn.addEventListener('click', bmi, false);
ClearData.addEventListener('click', removedata, false);
updata(data);

//BMI算式
function bmi() {
    let cm = document.querySelector('.height').value;
    let kg = document.querySelector('.kg').value;
    let lightbar = "";
    let status = "";
    let m = cm / 100;
    let bmi = kg / (m * m).toFixed(2);

    if (bmi == "NaN" || cm == '' || kg == '') {
        return;
    };

    switch (true) {
        case bmi < 18.5:
            status = '過瘦';
            lightbar = 'underweight';
            break;
        case 18.5 <= bmi && bmi < 24:
            status = '正常';
            lightbar = 'Normal ';
            break;
        case 24 <= bmi && bmi < 27:
            status = '過重';
            lightbar = 'Overweight';
            break;
        case 27 <= bmi && bmi < 30:
            status = '輕度肥胖';
            lightbar = 'Obese ';
            break;
        case 30 <= bmi && bmi < 35:
            status = '中度肥胖';
            lightbar = 'Obese ';
            break;
        case 35 <= bmi:
            status = '重度肥胖';
            lightbar = 'SeverelyObese';
            break;
    };

    //資料庫
    let bmiAll = {
        lightbar: lightbar,
        status: status,
        height: cm,
        weight: kg,
        BMI: bmi,
        time: time
    };

    data.splice(0, 0, bmiAll);
    updata(data);
    localStorage.setItem('bmiData', JSON.stringify(data));
    bmiText(data); //跟updata一樣

}

function bmiText(item) {
    let text = '';
    text = `<div class="circle">
                    <div class=" btnBorder-${item[0].lightbar}">
                    <h2 class="p-${item[0].lightbar}">${item[0].BMI.toFixed(2)}</h2>
                    <p class="p-${item[0].lightbar}">BMI</p>
                    </div>
                    <input type="button" class="icon bg-${item[0].lightbar} clear" >
                </div>
                <h3 class="p-${item[0].lightbar}">${item[0].status}</h3>`;
    btnArea.innerHTML = text;  

    let clear = document.querySelector('.clear');
    clear.addEventListener('click', reset, false)
}

function reset() {  
    document.querySelector('.data').reset();
    btnArea.innerHTML = `<input type="submit" class="btn" value="看結果" id="">`;   
    let btn = document.querySelector('.btn');
    btn.addEventListener('click', bmi, false);
}


    
//印出
function updata(item) {
    let len = item.length;
    let str = '';
    for (let i = 0; i < len; i++) {
        str += `<li>
        <table>
            <tr>
                <td class="lightbar ${item[i].lightbar}">${item[i].status}:</td>
                <td>BMI: ${item[i].BMI.toFixed(2)}</td>
                <td><span>身高:</span> ${item[i].height}<span> cm</span></td>
                <td><span>體重:</span> ${item[i].weight}<span> kg</span></td>
                <td><span>${item[i].time}</span></td>
                <td class="del" ><a href="#" data-index="${i}">刪除</a></td>
            </tr>
        </table>
    </li>`
    }
    list.innerHTML = str;
}

//全部刪除
function removedata() {
    localStorage.removeItem('bmiData');
    data = [];
    updata(data);
    localStorage.setItem('bmiData', JSON.stringify(data));
}
//指定刪除

del.addEventListener('click', function(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') { return };
    let index = e.target.dataset.index;
    data.splice(index, 1);
    updata(data);
    localStorage.setItem('bmiData', JSON.stringify(data));
})