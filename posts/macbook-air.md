---
title: 'Macbook Airを購入'
date: '2026-01-10'
tags: ['mac', 'nix']
---

色々あってラップトップを更新した。元々MacBook Pro M1 16インチだったけど、持て余し気味だったのとやっぱり単純に重すぎるので、MacBook Airにした。

色々セットアップをしていくのだけど、以前Nix/Home-managerをセットアップしたので概ねそれで終わってしまった

- [Xcode Command Line Tools](https://developer.apple.com/documentation/xcode/installing-the-command-line-tools/) のインストール
- [nix](https://nixos.org/download/) のインストール
- `~/.config/nix/nix.conf` の更新

```bash
$ mkdir -p ~/.config/nix
$ echo "experimental-features = nix-command flakes"
```

- home-managerで必要なソフトウェアをインストール

```bash
$ nix-shell -p home-manager
$ home-manager switch --flake ~/path/to/config#host
```

GUI的なアプリはそれぞれインストールした。

- 1Password
- VS Code
- Zed
- Ghostty
- Obsidian

あたり。

なんかセットアップがすぐ終わりすぎて味気ないな...

