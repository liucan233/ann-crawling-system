const getPagePostArr = (targetDocument) => {
  const postArr = Array.from(
    targetDocument.querySelectorAll("#list > ul > li > h1 > a")
  );
  const postInfo = postArr.map((a) => ({
    title: a.innerText.trim(),
    href: a.href,
  }));
  return postInfo;
};

const getPageUrl = () => {
  const pageArr = document.querySelectorAll(".pages > li > a");
  return Array.from(pageArr)
    .map((a) => a.href)
    .slice(1);
};

const getDocument = (url) => {
  if (!url.includes("jjc.cq.gov.cn")) {
    console.info("目标地址跨域：" + url);
    return null;
  }
  return new Promise((r) => {
    const iframeEle = document.createElement("iframe");
    iframeEle.src = url.replace("https", "http");
    iframeEle.onload = () => {
      console.log("文档读取完成：", url);
      r({ document: iframeEle.contentDocument, iframeEle: iframeEle });
    };
    document.body.appendChild(iframeEle);
  });
};

const getPostContentAndTime = async (url) => {
  const targetPage = await getDocument(url);
  if (!targetPage) {
    return { content: "抓取失败", publishTime: null };
  }
  const targetDoc = targetPage.document;
  const content = targetDoc.querySelector(".nr")?.innerText.trim() || "";
  const publishTime =
    targetDoc
      .querySelector(".ls")
      .innerText?.match(/\d+-\d+-\d+ \d+:\d+/)?.[0]
      ?.trim() || "";
  document.body.removeChild(targetPage.iframeEle);
  return {
    content,
    publishTime,
  };
};

const getAllPostInfo = async (postInfo) => {
  const infoArr = await Promise.all(
    postInfo.map(({ href }) => getPostContentAndTime(href))
  );
  return infoArr.map((info, index) => ({ ...postInfo[index], ...info }));
};

const getPostArr = async () => {
  const postArr = [];
  const pageUrlArr = getPageUrl();
  let curPagePostArr = getPagePostArr(document);
  postArr.push(...(await getAllPostInfo(curPagePostArr)));

  for (let i = 0; i < pageUrlArr.length; i++) {
    const postArrPage = await getDocument(pageUrlArr[i]);
    console.log("读取新页面文章列表：", pageUrlArr[i], postArrPage);

    curPagePostArr = await getPagePostArr(postArrPage.document);
    postArr.push(...(await getAllPostInfo(curPagePostArr)));
    document.body.removeChild(postArrPage.iframeEle);
  }
  return postArr;
};

const downloadToLocal = (data) => {
  const aEle = document.createElement("a");
  aEle.href = URL.createObjectURL(new Blob([JSON.stringify(data)]));
  aEle.download = "jjc.cq.gov.cn.json";
  document.body.appendChild(aEle);
  aEle.click();
};

let result = null;

getPostArr().then((res) => {
  const data = {
    siteName: "重庆市监察委员会",
    siteUrl: "http://jjc.cq.gov.cn/html/col610287.htm",
    expertTime: new Date().toLocaleDateString(),
    postArr: res,
  };
  result = data;

  let errorFlag=false;

  res.forEach((info,index)=>{
    if(info.content==='抓取失败'){
        console.log(info,  index);
        errorFlag=true;
    }
  })

  if(!errorFlag){
    downloadToLocal(data);
  }
});
