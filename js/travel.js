const jsonUrl = "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
let allData = [];
let noRepeatDis;
const option = document.querySelector('.selectID');
const title = document.querySelector('.title');
const content = document.querySelector('.content');
const popmenu = document.querySelector('.popmenu_result');
let selectTouristData = [];
let titleStr = document.querySelector('.title');
const pageSelect = document.querySelector('#pageid');
let selectPage = 1;//目前頁數
const perpage = 8;//一頁呈現頁數


option.addEventListener('change', selectZone);
popmenu.addEventListener('click', selectTopZone);
pageSelect.addEventListener('click', changePage);

fetch(jsonUrl, {method: 'get'})
  .then((response) => {
  return response.json();
}).then((data) => {
  allData = data.result.records;
  updateMenu(allData);
  selectData('all');
});


function updateMenu() {
  // 先抓出全部的 Zone
  const allDataDis = allData.map((item) => {return item.Zone});
  noRepeatDis  = allDataDis.filter(function (element, index, arr) {
    return arr.indexOf(element) === index;
  })

  let str = '';
  str =
  `<option value="all">- - 請選擇行政區 - -</option>`

  noRepeatDis.forEach((zone) => {
    str +=
    `<option value="${zone}">${zone}</option>`
  });

  document.querySelector('.selectID').innerHTML = str;  
}

function updateTitle(e) {
  let select = e.target.value;
  // title 變動
  let titleStr = '';

  noRepeatDis.forEach((zone) =>{
    if (select == zone) {
      titleStr = zone
  }
  })

  titleStr.innerHTML = titleStr;
}

function renderBtnZone() {
  const popBtn = [
    { city: '苓雅區', color: '#8A82CC' },
    { city: '三民區', color: '#FFA782' },
    { city: '新興區', color: '#F5D005' },
    { city: '楠梓區', color: '#559AC8' },
  ]

  let str = '';
  popBtn.forEach((item) =>{
    str += `<li class="pb-2 pt-2  rounded col-5 col-sm-2" style="background:${item.color}">${item.city}</li>`
  })
  popmenu.innerHTML = str;
}

//選值篩資料
function selectZone(e) {
  selectData(e.target.value);
}

function selectTopZone(e) {
  if (e.target.tagName === 'LI') {
    selectData(e.target.innerText);
  }
}

//三元運算式  如果=all true:false  false=>filter篩選資料
function selectData(zone) {
  const filterData = zone === 'all' ? allData : allData.filter(item => item.Zone === zone);
  selectTouristData = filterData;
  titleStr.innerHTML = zone === 'all' ? '全部景點' : zone;

  renderPageNumber(1);
  selectPageData(1)
  selectPage = 1;
}

function displayData(filterData) {
  let str = '';

  if (filterData.length <= 0) {
      str =`<div class="nowhere col-md-12 pb-3">
      <P class="marquee">這區好像沒有地方玩喔，換個地方走走吧!</p>
      </div>`
  }

  filterData.forEach((item) => {
      str += `<div class="col-md-6 py-1 px-1">
        <div class="card">
          <div class="card bg-dark text-white text-left">
            <img class="card-img-top bg-cover" height="155px" src="${item.Picture1}">
            <div class="card-img-overlay d-flex justify-content-between align-items-end p-0 px-3" style="background-color: rgba(0, 0, 0, .2)">
             <h5 class="card-img-title-lg font-weight-bold h5">${item.Name}</h5><h5 class="card-img-title-sm font-weight-bold h5">${item.Zone}</h5>
           </div>
          </div>
          <div class="card-body text-left pb-3">
              <p class="card-p-text mb-3"><i class="far fa-clock"></i> ${item.Opentime}</p>
              <p class="card-p-text mb-3"><i class="fa fa-map-marker" aria-hidden="true"></i> ${item.Add}</p>
            <div class="d-flex justify-content-between align-items-end">
              <p class="card-p-text mb-3"><i class="fa fa-phone" aria-hidden="true"></i> ${item.Tel}</p>
              <p class="card-p-text"><i class="fas fa-tags text-info "></i> ${item.Ticketinfo}</p>
            </div>
          </div>
        </div>
      </div>`

  });
  content.innerHTML = str;
}

function changePage(e) {
  const pageNum = Number(e.target.innerText);//要設在外面否則樣式抓不到e.target
  const totalpage = Math.ceil(selectTouristData.length / perpage);//

  if (selectPage > totalpage) {
    selectPage = totalpage;
  }//避免出現bug

  //選擇有圖案以及頁數，pageNum帶入num所以要用 =把num帶入selectPage，上下頁則是抓取classname因為不是數字
  ////// click page number
  if (e.target.className === "page-number-item nav-link") {
    selectPage = pageNum;
    selectPageData(pageNum);
    renderPageNumber(pageNum);
  }

  ////// click prev page
  if (e.target.className === "page-item prev nav-link" ) {
    const prevPage = selectPage - 1;
    // (selectPage - 1 === 0) ? selectPage : (selectPage - 1);
    selectPage = prevPage;
    selectPageData(prevPage);
    renderPageNumber(prevPage);
  }

  ////// click next page
  if (e.target.className === "page-item next nav-link"   ) {
    const nextPage = selectPage + 1;
    // (selectPage + 1 > totalpage) ? selectPage : (selectPage + 1);
    selectPage = nextPage;
    selectPageData(nextPage);
    renderPageNumber(nextPage);
  }
}

function selectPageData(pageNum) {

  const pageData = selectTouristData.slice((pageNum - 1) * perpage, pageNum * perpage);//*,//*)
  displayData(pageData);
}

//
function renderPageNumber(pageNum) {
  const totalpage = Math.ceil(selectTouristData.length / perpage);//
  let str = '';
  
  if(selectPage > 1){
    str += `<li class="page-item prev nav-link">«</li>`
  }

  for (let i = 1; i <= totalpage; i++) {
    str += (i === pageNum) ?
      `<li class="page-number-item active">${i}</li>`
      :
      `<li class="page-number-item nav-link">${i}</li>`
  }

  if(selectPage < totalpage){
    str += `<li class="page-item next nav-link">»</li>`
  }

  pageSelect.innerHTML = str;
}

//立即跑資料
renderBtnZone();
selectData('all');

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
