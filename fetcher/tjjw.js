/* eslint-disable */

const timeClassName = "";
const contentClassName = "";
const pageUrlPrefix = "https://www.tjjw.gov.cn/djcf/list2_40827_1.html";
const pageUrlSuffix = "";
const pageUrlConnector = "";
const siteName = "天津市监察委员会";

/**
 * @description 使用jsonp方法拉取所有文章
 */
const loadPostArr = () =>
  new Promise((r) => {
    const jsonpScript = document.createElement("script");
    jsonpScript.src =
      "https://www.tjjw.gov.cn/mi4-rest-api/pageArticles.js?wbId=20&subjectId=40827&page=1&limit=1000";
    jsonpScript.onload = () => {
      if (window._totalPage !== 1) {
        throw new Error("页数不唯一");
      }
      r(
        window.MI4_PAGE_ARTICLE.map((p) => {
          return {
            title: p.title,
            href: p.url,
            content: p.miContentTxt,
            publishTime: p.pub_date,
          };
        })
      );
    };
    document.body.appendChild(jsonpScript);
  });

/**
 * @description 导出页面所有文章数据
 * @returns {Array<{title:string, href:string,content:string, publishTime:string}>}
 */
const getAllData = async () => {
  return loadPostArr()
};

/**
 * @description 下载数据到电脑
 * @param {Record<string|number,any>} data
 **/
const downloadToLocal = (data) => {
  const aEle = document.createElement("a");
  aEle.href = URL.createObjectURL(new Blob([JSON.stringify(data)]));
  aEle.download = siteName.trim() + ".json";
  document.body.appendChild(aEle);
  aEle.click();
};

let result = null;

getAllData().then((res) => {
  const data = {
    siteName: siteName.trim(),
    siteUrl: pageUrlPrefix + pageUrlSuffix,
    expertTime: new Date().toLocaleString(),
    postArr: res,
  };
  result = data;

  let errorFlag = false;

  res.forEach((info, index) => {
    if (info.content === "抓取失败") {
      console.log(info, index);
      errorFlag = true;
    }
  });

  if (errorFlag) {
    console.log("以上文章数据抓取失败");
  } else {
    console.log(data);
    downloadToLocal(data);
  }
});
