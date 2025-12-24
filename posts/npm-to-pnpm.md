---
title: 'Migrate from npm to pnpm'
date: '2025-12-24'
tags: ['JavaScript', 'Node.js', 'pnpm', 'nix']
---

Migrated from npm to pnpm
=========================

最近NodeJSが呪われすぎているので、npmからpnpmに乗り換えることにした。

pnpmには [`minimumReleaseAge`](https://pnpm.io/settings#minimumreleaseage) の設定があるので、汚染されたてのパッケージをインストールするリスクを下げることができる。

入れ方が色々あったので整理

- Corepack経由でインストールする。Node.jsに同梱されているけど、v25以降は含まれなくなるらしい
  - `nix` でいれるとうまく使えなかった
- 別個でpnpmをインストールして、それを使う。一応そっちでNode.js自体のインストールもできるらしい

## `nix` で入れたNodeJSだとCorepackが使えない

例によってNodeJSのフォルダがreadonlyになっているので、 `corepack enable` のようなコマンドが通らない。

```bash
❯ corepack enable
Internal Error: EACCES: permission denied, symlink '../../lgggxsrdzisnbligi7irlh4qmqczs0xk-nodejs-24.11.1/lib/node_modules/corepack/dist/yarn.js' -> '/nix/store/44dvfc8hbhlllky2qwv0cw8a5i0mc02k-home-manager-path/bin/yarn'
    at async Object.symlink (node:internal/fs/promises:1009:10)
    at async EnableCommand.generatePosixLink (/nix/store/lgggxsrdzisnbligi7irlh4qmqczs0xk-nodejs-24.11.1/lib/node_modules/corepack/dist/lib/corepack.cjs:23163:5)
    at async Promise.all (index 2)
    at async EnableCommand.execute (/nix/store/lgggxsrdzisnbligi7irlh4qmqczs0xk-nodejs-24.11.1/lib/node_modules/corepack/dist/lib/corepack.cjs:23146:5)
    at async EnableCommand.validateAndExecute (/nix/store/lgggxsrdzisnbligi7irlh4qmqczs0xk-nodejs-24.11.1/lib/node_modules/corepack/dist/lib/corepack.cjs:20252:22)
    at async _Cli.run (/nix/store/lgggxsrdzisnbligi7irlh4qmqczs0xk-nodejs-24.11.1/lib/node_modules/corepack/dist/lib/corepack.cjs:21189:18)
    at async Object.runMain (/nix/store/lgggxsrdzisnbligi7irlh4qmqczs0xk-nodejs-24.11.1/lib/node_modules/corepack/dist/lib/corepack.cjs:23649:19)
```
