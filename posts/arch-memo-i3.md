---
title: 'Also try i3 instead of sway'
date: '2022-08-16'
tags: ['Linux', 'Arch Linux']
---

i3も試してみる
============

諸事情でNVIDIAのGraphic Card付きのマシンを使う可能性があり、そのときに備えてSwayの変わりにi3も使えるようにしておきたい。
NVIDIAのProprietaryなDriverは他とは違うAPI (EGLStream API) しか実装していないようで、Swayというかwlroot？が対応していない模様。

* Swayはi3互換を謳っているだけあって操作方法はほぼ同一。
  * ただし移動に使うキーバインドが `HJKL` ではなくて `JKL;` になっているので、これだけは秒で直した。
* Swayの各構成要素はほぼほぼ元になったのがあるので、それを使えばよさげ。そして歴史が長い分より充実してる感じがする。Rofiとかあまりカスタマイズしなくてもいいか、となってる。
  * waybar -> [polybar](https://github.com/polybar/polybar)
  * wofi -> [rofi](https://github.com/davatorium/rofi)
  * (壁紙の設定) -> nitrogen
  * (コンポジタ) -> picom
* 後で [pywal](https://github.com/dylanaraps/pywal) にも手を出してみたい。
* 他にAwesome, Qtileも試してみた。どっかのYoutuberが推してたので。
  * 個人的にはウィンドウの移動とかがいまいちなれなかったので、i3/Swayでいいか、となった。

参考資料
-------

* [Polybar themes](https://github.com/adi1090x/polybar-themes): 後で見る
* [My Experience with Wayland and Nvidia in 2022](https://blog.devgenius.io/wayland-and-nvidia-in-2022-2f0407fb34f4): Sway+NVidiaはまだ茨の道っぽい

その他
-----

* 今日はチック・コリア
* どうでもいいが [r/unixporn](https://www.reddit.com/r/unixporn/) 界隈だと圧倒的にYouTube MusicとかApple Musicより、Spotifyが強いように見える。地域差？そもそもそういうシェア？