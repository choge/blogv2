---
title: VS Code上のRubyのLinter/Formatterを設定してみた
date: '2024-06-23'
tags:
  - ruby
  - vscode
---

LSP
===

Language server protocol。補完するための機能たち。

- [Ruby LSP](https://marketplace.visualstudio.com/items?itemName=Shopify.ruby-lsp)
- [Ruby Solargraph](https://marketplace.visualstudio.com/items?itemName=castwide.solargraph)

の2種類がある模様。

> The Ruby LSP features include
> 
> - Semantic highlighting
> - Symbol search and code outline
> - RuboCop errors and warnings (diagnostics)
> - Format on save (with RuboCop or Syntax Tree)
> - Format on type
> - Debugging support
> - Running and debugging tests through VS Code's UI
> - Go to definition for classes, modules, constants and required files
> - Showing documentaton on hover for classes, modules and constants
> - Completion for classes, modules, constants and require paths
> - Fuzzy search classes, modules and constants anywhere in the project and its dependencies (workspace symbol)

とあるので、Ruby LSPの方でよさそう。

## インストール

### プラグイン自体のインストール

VS CodeでRuby LSPを探してインストールする。
![ruby-lsp](images/ruby-lsp.png)

### プラグインの設定

その後、 `setting.json` を開いてRuby向けの設定を追記する。

```json:setting.json
  "[ruby]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp", // Ruby LSPの機能を使ってコードを整形するぞ、宣言。Ruby LSPは裏でRubocopとかを使うらしいです
    "editor.formatOnSave": true, // 保存時にファイルを整形する
    "editor.tabSize": 2, // インデントはスペース2つ分
    "editor.insertSpaces": true, // インデントはスペースを使う
    "editor.semanticHighlighting.enabled": true, // Semantic highlightingってなんだ？
    "editor.formatOnType": true, // 入力中のフォーマットを有効にする
  },
```

### Rubocopのインストール

各プロジェクトで導入するのがよさそう。

`Gemfile` の `:development` 内に、 `rubocop` を追加する。VS Code側で何かする必要はない。

```ruby:Gemfile
group :development do
  # ...
  gem 'rubocop', require: false
end
```

## 使い方

### 自動補完

"Ruby LSP Start" から補完機能をスタートさせる。ちゃんと効いているか、いまいち怪しい…
![ruby-start-lsp](images/ruby-start-lsp.png)

### Linter

書き方が微妙なところを指摘するやつ。

勝手にRubocopが実行されて、怪しい場所がエディタで見えるようになる。
![ruby-lsp-linter](images/ruby-lsp-linter.png)

### Formatter

↑の設定を入れておくと、保存したときに勝手にコードを整形してくれる。