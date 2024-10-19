---
title: 'greetdでログインマネージャ'
date: '2022-08-11'
tags: ['Linux', 'Arch Linux']
---

ディスプレイマネージャ
===================

GDMみたいなイカした見た目の [ディスプレイマネージャ](https://wiki.archlinux.jp/index.php/%E3%83%87%E3%82%A3%E3%82%B9%E3%83%97%E3%83%AC%E3%82%A4%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3)（起動時にログイン情報入力するやつ）を導入したい。


ディスプレイマネージャの選択
------------------------

Arch wiki([Wayland#ディスプレイマネージャ](https://wiki.archlinux.jp/index.php/Wayland#.E3.83.87.E3.82.A3.E3.82.B9.E3.83.97.E3.83.AC.E3.82.A4.E3.83.9E.E3.83.8D.E3.83.BC.E3.82.B8.E3.83.A3))を参考に適当に選んでみる。Waylandをサポートしてるっぽい [Greetd](https://wiki.archlinux.jp/index.php/Greetd) + wlgreetにしてみる。


```bash
yay -S greetd wlgreet
```

ディスプレイマネージャの起動
-----------------------

### greetdの有効化

systemdでgreetdを有効化する（もともとは有効になってなかった）

```bash
sudo systemctl enable greetd
```

### greetdの設定をおいていく

Greetdは実際にはSwayを起動してその上でログイン画面を描画するっぽい。
ので、画面の見た目とかは多分Sway側のConfigである程度制御できる。

`/etc/greetd` にSwayのConfigも含めて、↓のようなGreetd向けのConfigをおいておく。 `include $(hostname).config` で環境違いの設定を読み込めるはず。

```
exec "wlgreet --command sway; swaymsg exit"

bindsym Mod4+shift+e exec swaynag \
	-t warning \
	-m 'What do you want to do?' \
	-b 'Poweroff' 'systemctl poweroff' \
	-b 'Reboot' 'systemctl reboot'

include /etc/sway/config.d/*
include $(hostname).config
```

References
----------

* [greetd wiki](https://man.sr.ht/~kennylevinsen/greetd/)

その他
------

今日はマハラージャン
