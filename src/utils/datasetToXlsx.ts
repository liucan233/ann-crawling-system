import { TDataset } from "../types";
import { utils, writeFileXLSX } from 'xlsx'

/**导出数据集到excel */
export const datasetToXlsx = (d: TDataset['postArr'], fileName?: string) => {
    const xlsx = utils.book_new();
    const rowArr = [['标题', '时间', '链接', '正文']]
    for (const { title, content, href, publishTime } of d) {
        rowArr.push([title || '', publishTime || '', href || '', content || '']);
    }
    const worksheet = utils.aoa_to_sheet(rowArr);
    utils.book_append_sheet(xlsx, worksheet, '公告列表');
    writeFileXLSX(xlsx, (fileName || '公告列表') + `_${Date.now()}.xlsx`)
}