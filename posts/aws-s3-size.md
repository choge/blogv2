---
title: 'S3 Bucketのサイズ・オブジェクト数'
date: '2023-02-23'
tags: ['AWS', 'Python']
---

困ったこと
========

AWS Backupの料金が高い。S3のStorageの料金が0.05 USD/月 で、Glacierの10倍くらいする。
特にでかいS3 Bucketがあったりして、どのBucketにどのくらいオブジェクトが溜まっているのか？を知りたくなった。

ただし、今はBackupの対象外にしている超巨大Bucket（数十TB）がいるので、 [Storage Lens](https://aws.amazon.com/jp/blogs/news/s3-storage-lens/) は使えなさそう。こいつはいい感じに容量の推移とかを見せてくれるけど、最大でもTop25位までのデータしか見せてくれない。

やりたいこと
==========

以下が一通りできれば完璧

* 大量のBucket（例えば100個）に対する結果が返ってくる
* Bucket内に大量にオブジェクトがあってもある程度スピーディーに動く
* 時系列での変化も追える

やり方
=====

調べたところいくつかやり方がありそう（e.g. [2009年のStackExchangeのQA](https://serverfault.com/q/84815)）。特にサイズの方がややこしい模様

ボツ案
-----

### S3のコンソールで見る

みたいBucketが数個くらいなら、Managed ConsoleのS3のページから確認できるようになっている。（Metricsのタブ）

→ 100個とかBucketがあるととても見きれないので却下

### コツコツ数える

単純な方法として、 `aws s3 ls --recursive --summarize --humanreadble <bucket_name>` のようにして、単純にBucket内のオブジェクトを全部数えてしまうのも一つの手

ただ、以下の点からあまり現実的ではない

* 全オブジェクトを数えることになるので、細かいファイルが大量にあるようなBucketだと非常に遅い
* また、API Call数に応じたか金額も爆上がりする恐れがある

やろうとしている方法
----------------

CloudWatchに実はMetricsがあるので、それを使ってしまえばよさそう

以下のつらみはある

* S3の [CloudWatchメトリクス](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/metrics-dimensions.html) はStorageTypeごとに分かれているので、Lifecycleなどで複数のStorageTypeを使っている場合は全部足し合わせる必要がある
* CloudWatchのメトリクス取得は [そこそこ複雑](https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/get-metric-data.html) なので、
  Bashでやり切るのは少し大変そう（シェル芸が必要になりそう）
  * Inputを作るのが面倒くさい
  * 足し合わせるのも面倒くさい
  * もっというと、特定のメトリクスだけ `Status: PartialData` で返ってきて、もう一度 `NextToken` と一緒に問い合わせる必要がある

なのでちょっとしたPythonスクリプトを書くことにする。 [Paginatorインターフェース](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/paginators.html) が↑の `NextToken` あたりの面倒くさい部分をいい感じに吸収してくれているはず
