/* eslint-disable */

const listClassName='default_pgContainer .newsList'
const timeClassName = ".date";
const contentClassName = "#ivs_content";
const pageUrlPrefix='https://www.shjcw.gov.cn/2015jjw/djzwcf/djzwcf.html'
const pageUrlSuffix=''
const pageUrlConnector=''
const siteName='上海市监察委员会'

/**
 * @description 获取targetDocument页面的文章列表
 * @param {Document} targetDocument
 * @returns {Array<{title:string, href:string}>}
 */
const getPagePostArr = (targetDocument) => {
  const postArr = Array.from(
    targetDocument.querySelectorAll(`.${listClassName} > li > a`)
  );
  const postInfo = postArr.map((a) => ({
    title: a.innerText.trim(),
    href: a.href,
  }));
  return postInfo;
};

/**
 * @description 根据url获取页面document对象
 * @param {string} url
 * @returns {Promise<{document:Document, iframeEle: HTMLIFrameElement}>|null}
 */
const getDocument = (url) => {
  // 跨域检查，跨域iframe无法被操作dom等
  if (!url.startsWith(location.origin)) {
    console.info("目标地址跨域：" + url);
    return null;
  }
  return new Promise((r) => {
    const iframeEle = document.createElement("iframe");
    iframeEle.src = url;
    iframeEle.sandbox = "allow-same-origin";
    iframeEle.onload = () => {
      // console.log("文档读取完成：", url);
      if (iframeEle.contentDocument) {
        r({ document: iframeEle.contentDocument, iframeEle: iframeEle });
      } else {
        r(null);
      }
    };
    document.body.appendChild(iframeEle);
  });
};

/**
 * @description 根据文章url获取发布时间和正文
 * @param {string} url
 * @returns {{content:string, publishTime:string}}
 */
const getPostContentAndTime = async (url) => {
  const targetPage = await getDocument(url);
  if (!targetPage) {
    return { content: "", publishTime: '' };
  }
  const targetDoc = targetPage.document;
  const content = targetDoc.querySelector(contentClassName)?.innerText.trim() || "";
  const publishTime =
    targetDoc
      .querySelector(timeClassName)
      .innerText?.match(/\d+年\d+月\d+/)?.[0]
      ?.trim().replace(/年|月/g,'-') || "";
  document.body.removeChild(targetPage.iframeEle);
  return {
    content,
    publishTime,
  };
};

/**
 * @description 翻页
 */
const goToPageNum=(pageNum)=>new Promise(r=>{
  const targetPageText=String(pageNum)
  const pageArr= Array.from(document.querySelectorAll('#pagination-digg > li'))
  for(const li of pageArr){
    const text=li.innerText;
    if(text.includes(targetPageText)){
      if(li.classList.contains('active')){
        r();
      } else {
        li.childNodes[0].click();
        setTimeout(r,1000)
      }
      return;
    }
  }
  throw new Error(`找不到第${pageNum}页`)
})

/**
 * @description 根据文章链接获取文章正文等
 * @param {Array<{title:string, href:string}>} postInfo
 * @returns {Promise<Array<{title:string, href:string,content:string, publishTime:string}>>}
 */
const getAllPostInfo = async (postInfo) => {
  const infoArr = await Promise.all(
    postInfo.map(({ href }) => getPostContentAndTime(href))
  );
  return infoArr.map((info, index) => ({ ...postInfo[index], ...info }));
};

/**
 * @description 导出页面所有文章数据
 * @returns {Array<{title:string, href:string,content:string, publishTime:string}>}
 */
const getAllData = async () => {
  const postArr = [];
  let curPagePostArr = null;

  for (let i = 0; i < 3; i++) {
    await goToPageNum(i+1)
    curPagePostArr = getPagePostArr(document);
    console.log(`第${i + 1}页，${curPagePostArr.length}篇`);
    console.log(curPagePostArr);
    if(curPagePostArr.length<1){
      throw new Error(`抓取${pageUrlArr[i]}出错`)
    }
    postArr.push(...(await getAllPostInfo(curPagePostArr)));
  }
  return postArr;
};

/**
 * @description 下载数据到电脑
 * @param {Record<string|number,any>} data
 **/
const downloadToLocal = (data) => {
  const aEle = document.createElement("a");
  aEle.href = URL.createObjectURL(new Blob([JSON.stringify(data)]));
  aEle.download = siteName.trim()+".json";
  document.body.appendChild(aEle);
  aEle.click();
};

let result = null;

getAllData().then((res) => {
  const data = {
    siteName: siteName.trim(),
    siteUrl: pageUrlPrefix+pageUrlSuffix,
    expertTime: new Date().toLocaleString(),
    postArr: res,
  };
  result = data;

  let errorFlag = false;

  res.forEach((info, index) => {
    if (!info.content || !info.publishTime || !info.title || !info.href) {
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
