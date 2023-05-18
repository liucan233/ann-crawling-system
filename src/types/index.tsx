/**数据集 */
export type TDataset = {
  siteName: string;
  siteUrl: string;
  expertTime: string;
  postArr: Array<TPostDetail>;
};
/**文章详情 */
export type TPostDetail = {
  title: string | null;
  publishTime: string | null;
  content: string | null;
  href: string | null;
};
