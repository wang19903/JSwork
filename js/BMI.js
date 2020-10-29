const btn = document.querySelector('.btn');
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
function bmi(e) {
    let cm = document.querySelector('.height').value;
    let kg = document.querySelector('.kg').value;
    let lightbar = "";
    let status = "";
    let m = cm / 100;
    let bmi = kg / (m * m).toFixed(2);

    if (bmi == "NaN" || cm == '' || kg == '') {
        alert('請輸入正確的數值!')
        return;
    };

    if (bmi < 18.5) {
        status = '過瘦';
        lightbar = 'lv1';
    } else if (18.5 <= bmi && bmi < 24) {
        status = '正常';
        lightbar = 'lv2';
    } else if (24 <= bmi && bmi < 27) {
        status = '過重';
        lightbar = 'lv3';
    } else if (18.5 <= bmi && bmi < 24) {
        status = '輕度肥胖';
        lightbar = 'lv4';
    } else if (27 <= bmi && bmi < 30) {
        status = '中度肥胖';
        lightbar = 'lv5';
    } else if (30 <= bmi) {
        status = '重度肥胖';
        lightbar = 'lv6';
    }

    //資料庫
    let bmiAll = {
        lightbar: lightbar,
        status: status,
        height: cm,
        weight: kg,
        BMI: bmi,
        time: time,
    };

    data.push(bmiAll);
    updata(data);
    localStorage.setItem('bmiData', JSON.stringify(data));

    let bmiText = function() {
        let text = '';
        text = `<div class="circle">
                    <div class=" btnBorder-${lightbar}">
                    <h2 class="p-${lightbar}">${bmi.toFixed(2)}</h2>
                    <p class="p-${lightbar}">BMI</p>
                    </div>
                    <input type="button" class="icon bg-${lightbar} clear" >
                </div>
                <h3 class="p-${lightbar}">${status}</h3>`;
        return text;
    };

    btnArea.innerHTML = bmiText();



    document.querySelector('.clear').onclick = function(e) {
        e.preventDefault();
        window.location.reload();
    }

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
function removedata(e) {
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

document.querySelector('html').addEventListener('click', function(e) {
    console.log(e);
});

        // Example starter JavaScript for disabling form submissions if there are invalid fields
        (function() {
            'use strict';
            window.addEventListener('load', function() {
                // Fetch all the forms we want to apply custom Bootstrap validation styles to
                var forms = document.getElementsByClassName('needs-validation');
                // Loop over them and prevent submission
                var validation = Array.prototype.filter.call(forms, function(form) {
                    form.addEventListener('submit', function(event) {
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add('was-validated');
                    }, false);
                });
            }, false);
        })();
