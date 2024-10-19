---
title: 'XWayland on Sway (もしくはSway上のChromiumで日本語入力)'
date: '2022-08-10'
tags: ['Linux', 'Arch Linux']
---

Sway上でXWaylandを使用する
==========================

XWaylandは、Waylandの上にX Serverを動かす的な仕組み。あんまり細かいところは理解していない。

一部のアプリはWayland上だときちんと動かない(日本語入力が効かない)ので、次善の策としてXWayland上で動かしてみる。


XWayland自体のインストール
--------------------------

```bash
sudo pacman -S xorg-xwayland
```

で終わり。

Sway上でXWaylandを自動的に動かす
--------------------------------

[Sway #XWayland](https://wiki.archlinux.jp/index.php/Sway#XWayland) の記載によると、XWaylandの利用はデフォルトで有効とのこと。

各アプリをX11 Backendで動かす
--------------------------

`GDK_BACKEND=x11` を渡すことでアプリケーションがXWayland上で動くようになる。

CLIから起動するときはそのまま渡せばよいが、Launcherから起動したいときは、 `.desktop` のエントリを修正する必要がある。

1. `/usr/share/applications/hoge.desktop` をコピーして、 `$XDG_DATA_HOME/applications/` 配下に置く
2. 各アプリの `Exec` 部分を `Exec=env GDK_BACKEND=x11 (もとの内容)` に修正
3. これでLauncherからの起動でもX11 Backendで動く＝日本語入力ができるようになる


Reference
---------

### 参考にした

というよりほぼパクった

* [Waylandで動くタイル型ウィンドウマネージャ・Swayを使う](https://zenn.dev/haxibami/articles/wayland-sway-install)
* [swayのすゝめ](https://inthisfucking.world/sway/)

### これなら動く・・・？

* [PC上でWeston + Wayland版Chromium＋Fcitx5での日本語入力環境を構築する](https://www.clear-code.com/blog/2021/11/24/setup-env-for-embedded-jp-software-keyboard-dev.html) があったが、ほぼほぼビルドし直すのはまだ早い気がしている・・・

### 動かなかった

ここまでの設定はできたうえで、X11で動いてるかWaylandで動いているかの違いが重要な模様

* https://qiita.com/matoruru/items/ab8b7beac4312586ac12
* https://www.archlinux.site/2017/11/waylandfcitx.html

残項目
-----

* `greetd` を使えるようにする
  * ここまで来たからには、LightDMとかに頼らずいきたい
* WofiのLauncherが二重に出ることがある。モニターが複数あるのが関係している？
* [swaylock](https://github.com/swaywm/swaylock) あたりを使えるようにしておく
* IntelliJ関連のあれこれ


その他
------

すごく久しぶりにゲスきわ聞いている。人間性はともかく曲はよいよね