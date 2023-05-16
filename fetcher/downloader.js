/**
 * @description 将数据下载至用户电脑
 * @param {{
 *   siteName: string,
 *   siteUrl: string,
 *   expertTime: string,
 *   postArr: [{
 *     title: string,
 *     publishTime: string,
 *     content: string,
 *     href: string
 *   }]
 * }} data
 **/
const downloadToLocal = (data) => {
  console.log(data.siteName);
};
