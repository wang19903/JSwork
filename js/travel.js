const jsonUrl = "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
let jsonData = {};
const select = document.getElementById('select');
const list = document.querySelector('.list');
const Zone = document.querySelector('.Zone');

select.addEventListener('change', zonesChange, false);

////////////////////////////////////***
Zone.addEventListener('click', ZoneClick, false);

function zonesChange(e) {
    updateContent(e.target.value, 1);
}

function updateContent(zone, page) {
    const optionZone = document.getElementById('optionZone');
    const zoneName = document.getElementById('zoneName');

    if (zone !== '請選擇上方行政區' && optionZone.getAttribute('disabled') !== 'disabled') {
        optionZone.setAttribute('disabled', 'disabled');
    }

    zoneName.textContent = zone;

    if (zone === '請選擇上方行政區') {
        pagination(jsonData, page);
    } else {
        pagination(jsonData.filter(e => e.Zone === zone), page);
    }
}

function ZoneClick(e) {
    if (e.target.nodeName === 'INPUT') {
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === e.target.value) {
                select.options[i].selected = true;
                updateContent(e.target.value, 1);
                break;
            }
        }
    }
}
//////////////////////////////////

//上方選擇欄
(function Option() {
    let text = '';
    let optionArray = [];
    optionArray = ['--請選擇行政區--', '三民區', '新興區', '鹽埕區', '左營區', '楠梓區', '鼓山區', '旗津區', '苓雅區', '前金區', '前鎮區', '小港區', '鳳山區', '鳥松區', '大社區', '仁武區', '大樹區', '岡山區', '燕巢區', '梓官區', '永安區', '彌陀區', '橋頭區', '田寮區', '茄萣區', '阿蓮區', '路竹區', '湖內區', '那瑪夏區', '桃源區', '茂林區', '六龜區', '美濃區', '旗山區', '甲仙區', '內門區', '杉林區', '林園區', '大寮區'];
    for (let i = 0; i < optionArray.length; i++) {
        text += `<option id="optionZone" value="${optionArray[i]}">${optionArray[i]}</option>`;
    }
    select.innerHTML = text;
})();

//以物件屬性取資料
(function getData() { //Promise語法 == XHR
    fetch(jsonUrl, { method: 'get' })
        .then((response) => {
            return response.json(); //處理 response
        }).then((data) => {
            jsonData = data.result.records;
            pagination(jsonData, 1);
        })
})();

function pagination(jsonData, nowPage) {
    // 取得全部資料長度
    const dataTotal = jsonData.length;

    // 設定要顯示在畫面上的資料數量
    // 預設每一頁只顯示 10 筆資料。
    const perpage = 10;

    // page 按鈕總數量公式 總資料數量 / 每一頁要顯示的資料
    // 這邊要注意，因為有可能會出現餘數，所以要無條件進位。
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

    // 由前面可知 最小數字為 6 ，所以用答案來回推公式。
    const minData = (currentPage * perpage) - perpage + 1;
    const maxData = (currentPage * perpage);

    // 先建立新陣列
    const data = [];
    // 這邊將會使用 ES6 forEach 做資料處理
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

function displayData(data) {
    let str = '';
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

function pageBtn(page) {
    let str = '';
    const total = page.pageTotal;

    if (page.hasPage) {
        str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) - 1}">Previous</a></li>`;
    } else {
        str += `<li class="page-item disabled"><span class="page-link">Previous</span></li>`;
    }


    for (let i = 1; i <= total; i++) {
        if (Number(page.currentPage) === i) {
            str += `<li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        } else {
            str += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
    };

    if (page.hasNext) {
        str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) + 1}">Next</a></li>`;
    } else {
        str += `<li class="page-item disabled"><span class="page-link">Next</span></li>`;
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



$(document).ready(function() {
    $('.goTop a').click(function(event) {
        event.preventDefault();
        $('html').animate({
            scrollTop: 0
        }, 1000);
    });
});




$(function() {
    setText();
    $(window).scroll(setText);

    function setText() {
        let str = $("#test1");
        str.text("");
        let dh = $(document).height();
        let sd = $(window).scrollTop();
        let p13 = $('<p></p>').text(((sd / dh) * 100).toFixed(0) + '%');
        str.append(p13);
    }
});