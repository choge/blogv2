---
title: 'Starting the blog with Next.js'
date: '2021-04-14T09:00:00,0+07:00'
tags: ['memo', 'JavaScript', 'Next.js' ]
author: 'choge'
---

# My (actual) first page

## ざっくりまとめ

### Next.js とはそもそも何？

ざっくりとは、Reactをベースとした、静的サイトジェネレータとか。
いわゆる [JAMStack](https://jamstack.org) と呼ばれるスタックをサポートするフレームワークの一つ。
Reactをベースとしていながら、静的なHTMLを事前に作成してそれを配信することで、高速化だったり安全性を担保できたりする。

Next.jsがやっているのは、大きく3つ。

* **ルーティング**: デフォルトでファイルベースのルーティングがついている。 `pages` ディレクトリ配下のファイルを、ディレクトリ構造に応じて配信してくれる。
* **レイアウト**: 各ページに共通したレイアウト、スタイルを提供する方法を提供している。
* **プリレンダリング**: 可能な限り、Reactファイルを事前に `render()` してHTMLの状態にしておける。
  * *Static Generation (SGR)*: ビルド時にHTMLを生成して、あとはそれを配信する。よって、リクエストごとに異なる情報を配信するには向いてない。
  * *Server-side rendering (SSR)*: リクエストごとに _サーバーサイドで_ `render()` してHTMLを返す。

### ルーティング

大きく2つ、APIと静的に生成するページ。どちらも、 `pages` ディレクトリ配下のJavaScriptファイルを読み取ってくれる。

#### 静的ページ

* 基本はディレクトリ構成に応じたパスを提供する。 `pages/hoge.js` があると、 `https://example.com/hoge` でページが見える。
  * 各ページ間は、Next.jsが提供する `<Link>` タグで遷移可能。
* 動的なパスも提供できる。 `pages/fuga/[placeholder].js` とすることで、 `https://example.com/fuga/***` の任意のページを提供できる。
  * この場合でも、静的生成は行う。そのため、 `[placeholder].js` で取りうる値の一覧を提供しなくてはならない。 [`getStaticPaths()`](https://nextjs.org/learn/basics/dynamic-routes/page-path-external-data) を実装することで実現可能。
  * 階層を深くすることも可能。 `pages/fuga/[category]/[item].js` のようにして、 `getStaticPaths()` でパスの一覧を渡せばOK。
  * 同様に、 `pages/fuga/[...slug].js` のようなファイルを作ることで、任意の階層に対応することも可能。やり方は上と同じ。

#### API

* こちらは、 `pages/api` ディレクトリ配下に置いたJavaScriptファイルを自動的にAPI用のものとして認識する。
  * パスの構造は同じ。 `pages/api/hello.js` だと、 `https://example.com/api/hello` に相当する。
  * 中身はExpressと同じ感じ？ `(req, res) => { res.status(200).json({ ... })}` みたいな感じ。
    * もしかして↑の内容を `pages/api` の外に書いても動いたりする？？？

### レイアウト

* 複数のページで使いまわすコンポーネントは、 `components` ディレクトリ配下に格納する。ここに格納したコンポーネントを各ページで `import` して使うことができる。
* サイト全体のガワを作りたいときなんかは、 `<Layout>` のようなコンポーネントを作って、各ページをそれにくるめばよい。そうすることで、 `<Layout>` の基本構造の中に各ページを含めることができる。
  * コンポーネントには、 `layout.module.css` のような、 `module.css` で終わるCSSファイルをインポートできる。こうすることで、JSXの中でスタイルシートを適用できる。

```jsx
// 通常のクラスの適用
function Component() {
    return <h1 className="title-text">Some title</h1>
}

// module.cssを使うと
import style from '../styles/styleWithinJSX.module.css'

function StyleWithinJSX() {
    return <h1 className={style.titleText}>Some title</h1>
}
```

* あとは、グローバルに適用したいスタイルは、 `pages/_app.js` に適用することですべてのページに自動的に反映される。
  * 例えば同じクラスに対するスタイルが個々のレイアウトと↑で重複していたらどうなるか？は不明。まぁ基本は重複させるケースはないけども。

### プリレンダリング

HTMLとJavaScriptを配信してクライアント側でDOMを組み立てるのではなく、サーバー側で事前に組み立てておく。

* あるコンポーネントの中に `useEffect()` とかがあると、それはクライアント側でしか動かないみたい。
  * なので、静的に `render()` できる範囲だけプリレンダリングしてるってこと？？？
* あとReact自体も最近 Server-side rendering に対応したと思うけど、それとの違いは？？？

## デプロイ

さすがにVercelのは絶妙に便利で離れられなくなりそう。

* GithubのレポジトリにVercelのアプリ(?)を連携すると、 `main` ブランチへのPushをもとに自動的にデプロイをしてくれる。
  * プリレンダリングして、そいつをCDNで配信
  * APIは別出しして提供。Lambda的な感じでServerless環境で動いているみたい

## 今後やること

* タグとか執筆者ごとのページを作ってみる。基本的に同じ考え方でプリレンダリングの対象にできるはず。
* スタイルを独自性のあるやつにしておく。
* デプロイ周りの調査
  * 自分とこのVPSとかで動かせるか？
  * あるいは、独自ドメインをあてられるか？