---
title: 'Install Arch Linux on hx90'
date: '2022-08-09'
tags: ['Linux', 'Arch Linux']
---

# Arch Linux

Arch Linuxをインストールしてみた。せっかくなので色々記を残していこうと思う。

## マシン

[hx90](https://store.minisforum.jp/products/minisforum-elitemini-hx90): Amazon Prime dayで安かった。人権マシマシのメモリ32GB!

## インストール

パーティション切ったり大変なので、楽をすべく [Archboot](https://gitlab.archlinux.org/tpowa/archboot/-/wikis/Archboot-Homepage)を使った。
が、公式の手順とそんなに変わらないかも。
なかなか公式サイトがGoogle検索に引っかからないので困った。

一通りやり終えたところで、一応ネットワークにもつながるし（有線）、コンソールでのログインもできるようになった。
ブートローダー周りはいまいち理解していないので、後追いで仕組みを見ておく必要あり。

### パーティション

こうなった。

```bash
lsblk
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:0    0 476.9G  0 disk 
├─nvme0n1p1 259:1    0     2M  0 part 
├─nvme0n1p2 259:2    0   512M  0 part 
├─nvme0n1p3 259:3    0     8G  0 part [SWAP]
└─nvme0n1p4 259:4    0 468.4G  0 part /home
                                      /
```

### インストール後

もうほぼほぼ [一般的な推奨事項](https://wiki.archlinux.jp/index.php/%E4%B8%80%E8%88%AC%E7%9A%84%E3%81%AA%E6%8E%A8%E5%A5%A8%E4%BA%8B%E9%A0%85) に書いてあるまんまだが、、、

* 一般ユーザーを追加
  * ひとまず `wheel` グループにも追加
* `sudo` とかも入ってなかったので `pacman -S sudo` した（入れたパッケージは別途まとめる）。
* とりあえずウィンドウマネジャーはインストール。せっかくなのでタイル型・Wayland向けの [Sway](https://swaywm.org/) にしてみた。
  * 前世でトライしたときのConfigが残っていたので、基本的な設定は多分OK
  * インストール直後のシェルだと、 `$XDG_RUNTIME_DIR` が設定できていなかった。ので、再起動後にリトライしたら問題なくなった。
* 入力系、自時刻まわりはほぼ問題なし

### 入れたパッケージたち

#### wm一味

* `sway`
  * `swaybg` 入れないと背景画像表示されない。逆に背景表示してればそれだけでぽく見える。
* `waybar`
* `wofi`
* `greetd`: まだ使いこなせていない。。。
  * これだけAURからインストールした

#### CLI周り

* `vi`: これはArchbootが入れた
* `nano`: 同上
* `git`
* `jq`
* `neovim`
* `jq`
* `bat`
* `lsd`
* `starship`
* `ripgrep`
* `tealdeer`

#### 雑多なツール類

* `alsa-utils`: 入れないとミュート解除できない
* `pulseaudio`: 同上？
* `imagemagic`: `kitty +kitten icat` したかった
* `inetutils`: `hostname` なかったので
* `man-db`, `man-pages`: これも入ってないのか・・・
* `sudo`: 同上
* `polkit`: イマイチわかってない
* `fcitx5-mozc`, `fcitx-configtool`: 日本語入力

#### GUIツール類

* `kitty`: 現状これが最強な気がしている
* `firefox`
* `code`: VS Codeね
* `chromium`: FirefoxでConfluenceのページ開いたら落ちたので

## まだできてないこと

* `greetd` が動いてない
* X11アプリは動かしていないはず
  * `xorg-` で始まるパッケージはそこそこある
* Can't input Japanese using `fcitx5` in some apps
  * VS Code and Chromium
* Some items do not show up in waybar
* Need to learn how to capture the screen