---
title: 'Add syntax highlighting to the blog'
date: '2023-02-26'
tags: ['Next.js']
---

久しぶりにこのブログもどきを更新したので、Next.jsのバージョンをあげたりなんだりしていた。
特にフロントエンドのこの辺って継続的に時間をかけないとあっという間に浦島太郎状態になるなーと思ったりしている。

ほぼほぼ以下の記事のコピペだけど、Syntax Highlightを入れてみた。

[rehype-highlightでmarkdownにシンタックスハイライトを適用する](https://tamalog.szmd.jp/rehype-highlight/)

#### むかし

- 記事をMarkdownで書く
- [remark](https://github.com/remarkjs/remark) というライブラリで構文解析→HTMLに変換
- 変換したHTMLをボコッと埋め込む

#### いま

- 記事をMarkdownで書く
- [remark](https://github.com/remarkjs/remark) + [rehype](https://github.com/rehypejs/rehype) で変換。Syntax Highlightは [rehype-highlight](https://github.com/rehypejs/rehype-highlight) というのを使う
  - HTMLを生成するところで、いくつかのプラグインを連携させるみたい
- 変換したHTMLをボコッと埋め込む

```js
  const processedPostData = await unified()
    .use(remarkParse)  // MarkdownとしてParseする -> mdastになる
    .use(remarkRehype)  // ↑をHTMLのAST (hast) に変換する
    .use(rehypeHighlight)  // ↑ hastにSyntax Highlightを加える
    .use(rehypeStringify)  // ↑ hastからテキストに戻す
    .process(matterResult.content)
```
