const jsonUrl = "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
let jsonData = {};
const select = document.getElementById('select');
const list = document.querySelector('.list');
const Zone = document.querySelector('.Zone');

select.addEventListener('change', zonesChange, false);
Zone.addEventListener('click', ZoneClick, false);

function zonesChange(e) {
    updateContent(e.target.value, 1);
}

//以物件屬性取資料
(function getData() { //Promise語法 == XHR
    fetch(jsonUrl, { method: 'get' })
        .then((response) => {
            return response.json(); //處理 response
        }).then((data) => {
            jsonData = data.result.records;
            pagination(jsonData, 1);//頁
        })
})();

//上方選擇欄
(function Option() {
    const optionZone = document.getElementById('optionZone');
    let text = '';
    let optionArray = [];
    optionArray = ['--請選擇行政區--', '三民區', '新興區', '鹽埕區', '左營區', '楠梓區', '鼓山區', '旗津區', '苓雅區', '前金區', '前鎮區', '小港區', '鳳山區', '鳥松區', '大社區', '仁武區', '大樹區', '岡山區', '燕巢區', '梓官區', '永安區', '彌陀區', '橋頭區', '田寮區', '茄萣區', '阿蓮區', '路竹區', '湖內區', '那瑪夏區', '桃源區', '茂林區', '六龜區', '美濃區', '旗山區', '甲仙區', '內門區', '杉林區', '林園區', '大寮區'];
    for (let i = 0; i < optionArray.length; i++) {
        text += `<option  value="${optionArray[i]}">${optionArray[i]}</option>`;
    }
    select.innerHTML = text;
})();
//改區域刷新列表
function updateContent(zone, page) {
    const zoneName = document.getElementById('zoneName');
    zoneName.textContent = zone;

    if (zone === '--請選擇行政區--') {
        pagination(jsonData, page);
    } else {
        pagination(jsonData.filter(e => e.Zone === zone), page);
    }

    $("select option:first").attr("disabled", "ture"); //禁用change1
}
//按鈕
function ZoneClick(e) {
    if (e.target.nodeName === 'INPUT') {
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === e.target.value) {
                select.options[i].selected = true;
                updateContent(e.target.value, 1);//頁
                break;
            }
        }
    }
}
//分頁
function pagination(jsonData, nowPage) {
    // 取得全部資料長度
    const dataTotal = jsonData.length;
    // 設定要顯示在畫面上的資料每一頁只顯示 10 筆
    const perpage = 10;

    // page 按鈕總數量公式 總資料數量 / 每一頁要顯示的資料
    // 出現餘數要無條件進位。ceil
    const pageTotal = Math.ceil(dataTotal / perpage);

    // 當前頁數，對應現在當前頁數
    let currentPage = nowPage;

    // 因為要避免當前頁數筆總頁數還要多，假設今天總頁數是 3 筆，就不可能是 4 或 5
    // 所以要在寫入一個判斷避免這種狀況。
    // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"
    // 注意這一行在最前面並不是透過 nowPage 傳入賦予與 currentPage！
    if (currentPage > pageTotal) {
        currentPage = pageTotal;
    }

    // 由前面可知EX當前=2，最小數字為 11 ，所以用答案來回推公式。
    const minData = (currentPage * perpage) - perpage + 1;
    const maxData = (currentPage * perpage);

    // 先建立新陣列
    const data = [];
    // 首先必須使用索引來判斷資料位子，所以要使用 index
    jsonData.forEach((item, index) => {
            // 獲取陣列索引，但因為索引是從 0 開始所以要 +1。
            const num = index + 1;
            // 這邊判斷式會稍微複雜一點
            // 當 num 比 minData 大且又小於 maxData 就push進去新陣列。
            if (num >= minData && num <= maxData) {
                data.push(item);
            }
        })
        // 用物件方式來傳遞資料
    const page = {
        pageTotal,
        currentPage,
        hasPage: currentPage > 1,
        hasNext: currentPage < pageTotal,
    }
    displayData(data);
    pageBtn(page);
}
//寫入資料
function displayData(data) {
    let str = '';
    if (data.length <= 0) {
        str = `<div class="nowhere col-md-12 pt-0">
        <P class="marquee">這區好像沒有地方玩喔，換個地方走走吧 :)</p>
        </div>`;
    }
    //跑馬燈
    var btn2 = document.getElementsByClassName('nowhere');
    btn2.onclick = function() {
        document.body.style.color = bg2();
    };

    function bg2() {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    }
    //  
    data.forEach((item) => {
        str += `<div class="col-md-6 py-1 px-1">
          <div class="card">
            <div class="card bg-dark text-white text-left">
              <img class="card-img-top bg-cover" height="155px" src="${item.Picture1}">
              <div class="card-img-overlay d-flex justify-content-between align-items-end p-0 px-3" style="background-color: rgba(0, 0, 0, .2)">
               <h5 class="card-img-title-lg">${item.Name}</h5><h5 class="card-img-title-sm">${item.Zone}</h5>
             </div>
            </div>
            <div class="card-body text-left pb-1">
                <p class="card-p-text"><i class="far fa-clock"></i> ${item.Opentime}</p>
                <p class="card-p-text"><i class="fa fa-map-marker" aria-hidden="true"></i> ${item.Add}</p>
              <div class="d-flex justify-content-between align-items-end">
                <p class="card-p-text"><i class="fa fa-phone" aria-hidden="true"></i> ${item.Tel}</p>
                <p class="card-p-text"><i class="fas fa-tags text-info "></i> ${item.Ticketinfo}</p>
              </div>
            </div>
          </div>
        </div>`;

    });
    content.innerHTML = str;
}
//分頁按鈕
function pageBtn(page) {
    let str = '';
    const total = page.pageTotal;

    if (page.hasPage) {
        str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) - 1}">«</a></li>`;
    // } else {
    //     str += `<li class="page-item disabled"><span class="page-link">«</span></li>`;
     }

    for (let i = 1; i <= total; i++) {
        if (Number(page.currentPage) === i) {
            str += `<li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        } else {
            str += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
    };

    if (page.hasNext) {
        str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) + 1}">»</a></li>`;
    // } else {
    //     str += `<li class="page-item disabled"><span class="page-link">»</span></li>`;
    }

    pageid.innerHTML = str;
}

function switchPage(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') return;
    const page = e.target.dataset.page;
    pagination(jsonData, page);
}

pageid.addEventListener('click', switchPage);
//向上動畫
$(document).ready(function() {
    $('.goTop a').click(function(event) {
        event.preventDefault();
        $('html').animate({
            scrollTop: 0
        }, 1000);
    });
});
//下拉50XP出現按鈕和距離body頂端%數
$(window).scroll(function() {
    if ($(window).scrollTop() >= 50) {
        $(".goTop").css('display', 'flex'); //show 固定為display:block，改為設定CSS
    }
    let str = $("#percent");
    str.text("");
    let nowH = $(window).scrollTop() + $(window).height();
    let bodyH = $("body").height();
    if (nowH > bodyH){
        nowH = bodyH;
    }
    let distance = $('<p></p>').text(((nowH / bodyH) * 100).toFixed(0) + '%');
    str.append(distance);
});
