import { Input, Select, InputProps, Button } from "antd";
import { FC, ReactNode, useEffect, useState } from "react";
import { TDataset } from "../../types";
import { PostList } from "../PostList";
import css from "./index.module.css";

type TTextFilterItemProps = {
  onChange?: (v: { text: string; include: boolean }) => any;
  onPressEnter?: InputProps["onPressEnter"];
  value: { text: string; include: boolean };
};
const TextFilterItem: FC<TTextFilterItemProps> = ({
  onChange,
  onPressEnter,
  value,
}) => {
  const handleSelect = (v: boolean) => {
    const newValue = { ...value, include: v };
    onChange?.(newValue);
  };
  const handleInput: InputProps["onChange"] = (e) => {
    const newValue = { ...value, text: e.target.value };
    onChange?.(newValue);
  };
  return (
    <div className={css.textFilterWrap}>
      <Input
        placeholder="请输入文字去筛选"
        onChange={handleInput}
        onPressEnter={onPressEnter}
      />
      <Select
        defaultValue={value.include}
        className={css.textFilterSelect}
        onChange={handleSelect}
      >
        <Select.Option value={true}>包括</Select.Option>
        <Select.Option value={false}>不包括</Select.Option>
      </Select>
    </div>
  );
};

const defaultTextFilterArr = [TextFilterItem, TextFilterItem];
const defaultTextFilterValueArr = [
  {
    text: "",
    include: true,
    id: 1,
  },
  {
    text: "",
    include: true,
    id: 2,
  },
];

type TProps = {
  postArr: TDataset["postArr"];
  onManageDataset?: () => any;
  onView: (v: TDataset["postArr"][0]) => any;
};
export const CenterPostFilter: FC<TProps> = ({
  postArr,
  onManageDataset,
  onView,
}) => {
  const [textFilterArr, setTextFilterArr] = useState(defaultTextFilterArr);
  const [textFilterValueArr, setTextFilterValueArr] = useState(
    defaultTextFilterValueArr
  );
  const [filteredPostArr, setFilteredPostArr] = useState<
    Array<TDataset["postArr"][0] & { highlight: ReactNode }>
  >([]);

  const handleTextFilterChange = (
    i: number,
    v: { text: string; include: boolean }
  ) => {
    const newValueArr = [...textFilterValueArr];
    newValueArr[i] = { ...v, id: newValueArr[i].id };
    if (v.text && i + 1 === textFilterValueArr.length) {
      newValueArr.push({
        id: Date.now(),
        text: "",
        include: true,
      });
      setTextFilterArr([...textFilterArr, TextFilterItem]);
    }
    setTextFilterValueArr(newValueArr);
  };

  const handleEnter = () => {
    const result: typeof filteredPostArr = [];
    const valueArr = textFilterValueArr
      .filter((v) => v.text)
      .sort((a, b) => (!a.include || b.include ? -1 : 1));
    for (const p of postArr) {
      const content = p.content?.replace(/\t|\s/g, "");
      if (!content) {
        continue;
      }
      if (valueArr.length === 0) {
        result.push({ ...p, highlight: content.substring(0, 50) });
      }
      for (const { text, include } of valueArr) {
        if (!text) {
          continue;
        }
        if (include) {
          const newPost = {
            ...p,
            highlight: null,
          } as typeof filteredPostArr[0];
          const index = content.indexOf(text);
          if (index === -1) {
            continue;
          }
          const contentLength = content.length;
          const textLength = text.length;
          if (textLength > 49) {
            newPost.highlight = <mark key="h">{text.substring(0, 50)}</mark>;
          } else if (index + textLength > 49) {
            newPost.highlight = [
              content.substring(index - 50, index),
              <mark key="h">{text}</mark>,
            ];
          } else if (index + 50 < contentLength) {
            newPost.highlight = [
              <mark key="h">{text}</mark>,
              content.substring(index + textLength, index + 50 - textLength),
            ];
          } else {
            newPost.highlight = [
              content.substring(0, index),
              <mark key="h">{text}</mark>,
              content.substring(index + textLength),
            ];
          }
          result.push(newPost);
          break;
        } else if (content.includes(text)) {
          break;
        }
      }
    }
    result.sort((a, b) => {
      if (a.publishTime && b.publishTime) {
        return a.publishTime.substring(0, 10) > b.publishTime.substring(0, 10)
          ? -1
          : 1;
      }
      return -1;
    });
    setFilteredPostArr(result);
  };

  const handleClear = () => {
    setTextFilterArr(defaultTextFilterArr);
    setTextFilterValueArr(
      defaultTextFilterValueArr.map((v) => {
        v.id += Date.now();
        return v;
      })
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleEnter, [postArr]);
  return (
    <div className={css.wrap}>
      <div className={css.filterWrap}>
        {textFilterArr.map((Item, index) => {
          return (
            <Item
              key={textFilterValueArr[index].id}
              onChange={handleTextFilterChange.bind(null, index)}
              onPressEnter={handleEnter}
              value={textFilterValueArr[index]}
            />
          );
        })}
      </div>
      <div className={css.btnWrap}>
        <Button onClick={onManageDataset}>管理数据集</Button>
        <Button onClick={handleClear}>清空条件</Button>
        <Button type="primary" onClick={handleEnter}>
          搜索（{filteredPostArr.length}条）
        </Button>
      </div>
      <div className={css.listWrap}>
        <PostList postArr={filteredPostArr} onClickItem={onView} />
      </div>
    </div>
  );
};
