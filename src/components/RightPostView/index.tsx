import { FC } from "react";
import { TDataset } from "../../types";
import css from "./index.module.css";

export const RightPostView: FC<{ post: TDataset["postArr"][0] | null }> = ({
  post,
}) => {
  if (!post) {
    return null;
  }
  return (
    <div className={css.wrap}>
      <h3>{post.title}</h3>
      <div className={css.info}>
        <span>{post.publishTime}</span>
        <span>
          <a href={post.href || ""} target="_blank" rel="noopener noreferrer">
            查看原文
          </a>
        </span>
      </div>
      <p className={css.content}>{post.content}</p>
    </div>
  );
};
