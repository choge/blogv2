---
title: "kittyでフォントを選定する"
date: "2024-10-19"
tags: ["kitty"]
---

# Kittyでフォントをいい感じにする

ターミナルのアプリとしては、数年間ずっとKittyを使っている。
アプリケーションの動きとフォントの柔軟性が抜群で、意外とかゆいところに手が届く。SSHとかはクセがあるっぽいが、時代の趨勢かSSH自体をあまり使わなくなってきたのでそのへんも困ってない。

もともとVariable Fontは完璧には対応してなかったっぽいが、 [v.0.36](https://sw.kovidgoyal.net/kitty/changelog/#variable-font-support-0-36) から結構ガッツリとしたサポートが入ったので、 [Monaspace](https://github.com/githubnext/monaspace) みたいなVariableフォントを使いやすくなった。

## やりかた

```bash
kitten choose-fonts
```

でいい感じにフォントを選べるようになっている。詳しくは [Changing kitty fonts](https://sw.kovidgoyal.net/kitty/kittens/choose-fonts/) を見るのが確実だけど、あまり深く考えなくてもTUIで選べるようになっている。

## 落ち穂拾い: Fine-tuningするときのあれこれ

Fine-tuningでウェイトとかそういうのをいちいち設定できるようになっている。基本的には ちゃんとしたまとめ (e.g., [OpenType Font Variations Overview](https://learn.microsoft.com/en-us/typography/opentype/spec/otvaroverview), [Variable fonts guide @MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide) , ...etc) を読めばよい。

以下は自分用のメモ。

### そもそもVariable fontsとは

- 従来のフォント ... RegularとかBoldとか、特定の幅・太さ・スタイルに応じたファイルがそれぞれ存在していた
- Variable font ... 幅・太さ・スタイルが一つのファイルで柔軟に設定できるようになっている。ファイルサイズも小さくなる

### 属性

各属性は4文字、標準的に使われているのは以下5つ。カスタムの属性も作れるが全部大文字にするらしい（慣習的に？）

- `wght` ... 文字の太さ（Weight）。CSSの [`font-weight`]() と概ね対応しているっぽい。 400で `normal`, 700で `bold` 、のような感じ
- `wdth` ... 文字の幅（Width）。これは100%を基準に何%かを表している（数字が大きいほどデブ）
- `ital` ... イタリック体。斜めになってるやつ。これのみ、ON/OFFの違いだけらしい。ONにするとイタリック用のグリフ（形）が使われるらしい
- `slnt` ... 文字の角度を表す。-90〜90まで角度を指定できるけど、普通は0〜20の範囲らしい

### OpenType Features

典型的にはリガチャなどで使われるっぽい (cf. [Registered Features](https://learn.microsoft.com/en-us/typography/opentype/spec/featurelist), [OpenType font features guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/OpenType_fonts_guide))

- `aalt` ... Access All Alternatesの略称。代替できるものは全部代替版を使うってことかな…？
- `calt` ... Contextual Alternates。文脈に応じて代替のグリフが使われる。 "fi" の "i" みたいなやつ？
- `cv30` ... Character variants。特定の文字のバリエーション。数字部分は文字を示している
- `frac` ... 分数表記を `1/2` から `½` にする。さすがにこれは見づらいことが多いような…
- `liga` ... Ligatures。リガチャを有効にするか否か
- `ordn` ... Ordinals。 `1st` が `1ˢᵗ` になる。ターミナル向けではないな…
- `sinf` ... Scientific Inferiors。科学的な何かにする…？よく分かってない
- `SSxx` ... リガチャの特殊なやつ。 `==` をくっつけた形で表示するか、みたいなやつ
- `subs`, `sups` ... 文字の下付き、上付きを有効にする。全部の文字がそうなるわけではないみたい
