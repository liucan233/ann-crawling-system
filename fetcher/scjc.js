/* eslint-disable */

/**
 * @description 获取targetDocument页面的文章列表
 * @param {Document} targetDocument
 * @returns {Array<{title:string, href:string}>}
 */
const getPagePostArr = (targetDocument) => {
  const postArr = Array.from(
    targetDocument.querySelectorAll(".data-list > h4 a")
  );
  const postInfo = postArr.map((a) => ({
    title: a.innerText.trim(),
    href: a.href,
  }));
  return postInfo;
};

/**
 * @description 获取所有翻页的url
 * @returns {Array<string>}
 */
const getPageUrl = () => {
  return new Array(50).fill("").map((_, i) => {
    if (i === 0) {
      return "http://www.scjc.gov.cn/scjc/scdc/scdc.shtml";
    }
    return `http://www.scjc.gov.cn/scjc/scdc/scdc_${i + 1}.shtml`;
  });
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
      console.log("文档读取完成：", url);
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
    return { content: "抓取失败", publishTime: null };
  }
  const targetDoc = targetPage.document;
  const content =
    targetDoc.querySelector(".cont > .info")?.innerText.trim() || "";
  const publishTime =
    targetDoc
      .querySelector(".cont > .time")
      .innerText?.match(/\d+-\d+-\d+/)?.[0]
      ?.trim() || "";
  document.body.removeChild(targetPage.iframeEle);
  return {
    content,
    publishTime,
  };
};

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
  const pageUrlArr = getPageUrl();
  let curPagePostArr = null;

  for (let i = 0; i < pageUrlArr.length; i++) {
    const postArrPage = await getDocument(pageUrlArr[i]);
    // console.log("读取新页面文章列表：", pageUrlArr[i], postArrPage);

    curPagePostArr = getPagePostArr(postArrPage.document);
    postArr.push(...(await getAllPostInfo(curPagePostArr)));
    document.body.removeChild(postArrPage.iframeEle);
    console.info(`第${i + 1}页数据抓取完成`);
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
  aEle.download = "www.scjc.gov.cn.json";
  document.body.appendChild(aEle);
  aEle.click();
};

let result = null;

getAllData().then((res) => {
  const data = {
    siteName: "四川省监察委员会",
    siteUrl: "http://www.scjc.gov.cn/scjc/scdc/scdc.shtml",
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
