const $siteList = $(".siteList"); //找到包含所有网址的那个元素
const $lastLi = $siteList.find("li.last"); //找到新增网址那个元素
const x = localStorage.getItem("x");
const xObject = JSON.parse(x);
const hashMap = xObject || [
  //用一个哈希表把每个网址元素放进去
  { logo: "A", url: "https://www.acfun.cn" },
  {
    logo: "B",
    url: "https://www.bilibili.com"
  }
];

const simplifyUrl = url => {
  //简化网址名称(URL)
  return url
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .replace(/\/.*/, ""); // 删除 / 开头的内容
};
function render() {
  //然后对哈希表进行渲染(把每个网址元素插入到新增元素之前)
  //渲染前得把除了新增元素的所有元素都给删了，不然就会重复渲染
  $siteList.find("li:not(.last)").remove();
  hashMap.forEach((node, index) => {
    console.log(index);
    const $li = $(`<li>
        <div class="site">
            <div class="logo">${node.logo}</div>
            <div class="link">${simplifyUrl(node.url)}</div>
             <div class="close">
                <svg class="icon">
                    <use xlink:href="#icon-close1"></use>
                </svg>
            </div>
        </div>
    </li>`).insertBefore($lastLi);
    $li.on("click", () => {
      window.open(node.url);
    });
    $li.on("click", ".close", e => {
      console.log("close按钮");
      e.stopPropagation(); //阻止冒泡，点击close按钮时不会被认为点击了整个网址
      hashMap.splice(index, 1);
      render();
    });
  });
}
render();

$(".addButton").on("click", () => {
  let url = window.prompt("请输入你要添加的网址是？");
  if (url.indexOf("http") !== 0) {
    url = "https://" + url;
  }
  console.log(url);

  hashMap.push({
    //创建的那个网址就会被插入到哈希表中
    logo: simplifyUrl(url)[0],
    url: url
  });
  render();
});

window.onbeforeunload = () => {
  //当窗口即将被卸载（关闭）时,会触发该事件.
  console.log("页面要关闭了");
  const string = JSON.stringify(hashMap); //先把哈希表对象转换成字符串
  localStorage.setItem("x", string); //再把哈希表的内容存在localStorage里面，用变量x表示
};

$(document).on("keypress", e => {
  //console.log(e.key);
  const { key } = e;
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url);
    }
  }
});

//阻止input里的输入的键盘触发事件也能打开对应的网址，用到了阻止冒泡
$(document).on("keypress", ".inputComment", e => {
  e.stopPropagation();
});
