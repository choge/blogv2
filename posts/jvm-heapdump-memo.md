---
title: 'Heapdump解析の復習'
date: '2022-08-23'
tags: ['Java', 'Performance']
---

Heapdump解析
===========

諸事情によりHeapdumpの解析をしなくてはいけなくなってる。

むかーしに一通りさらったものの、だいぶ忘れているので復習をしていく。

memo: 起きている事象
------------------

* Container Insightsの `pod_memory_utilization` がお昼すぎになると85％超まで跳ね上がり、そのまま夜中くらいまで継続する
  * コンテナに割り当てているメモリは4GB
* Heapdumpを取ると、メモリトータルで150MBくらいしか使っていない。なんで？

Heap以前にメモリ管理全般
---------------------

### `ps` とかで出てくる内容

* `VSZ`: Virtual Set Size. プロセスが確保している仮想メモリのサイズ
* `RSS`: Resident Set Size. プロセスが確保している物理メモリサイズ

### Java側のメモリ管理

大きく3つ：

* Java Heap
* C Heap
* Thread stack

```
+-----------------------------+--------+--------+
|        Java Heap            |        |        |
+------+------------+---------+        |        |
|      | Survivor-0 |         | Thread | C Heap |
| Eden +------------+ Tenured | Stack  |        |
|      | Survivor-1 |         |        |        |
+------+------------+---------+--------+--------+
```


Heapの構成
---------

* 世代別の管理がなされている
  * New領域
  * Tenured領域。Tenureってあんまり見ないけど、大学の教授の終身在職権とかで使うのでそういうニュアンスかな
* New領域は、更にEden, Survivorに分割されている
  * Edenは短期的なオブジェクト
  * Survivorはその名の通りそこそこの期間生き残っているオブジェクト

### Heapの解析

`jstat` でその時のスナップショットが取れる。(cf. [jstatコマンド](https://docs.oracle.com/javase/jp/13/docs/specs/man/jstat.html))

以下の例だと、PID 46番のプロセスのヒープの断面が見られる。出ている数字はKB単位。

* `S0C`/`S1C`がSurvivor領域で、それぞれ7MBくらいがトータルの容量として確保されている
* `S0U`/`S1U`がSurvivor領域で使用中のもの。Survivor0の方は全く使われていない？？
* `EC`/`EU`がそれぞれEden領域の容量、使用中のボリューム。こっちは1GB中321MBなのでそこそこ。
* `OC`/`OU`はOld領域。こちらも800MB中408MB使われている

その他、若干マイナーなものたち：

* `MC`/`MU`: [メタスペース](https://software.fujitsu.com/jp/manual/manualfiles/m170006/b1ws1303/01z200/b1303-00-11-01-06.html)のメモリ。Javaのクラス、メソッドなどが置かれている。
* `CCSC`/`CCSU`: 圧縮されたクラス領域。あんまり理解してない。
* `YGC`/`YGCT`: Young世代（Survivor+Eden）のガーベジコレクションのイベント数、かかった時間。
* `FGC`/`FGCT`: フルGCのイベント数、ガベージコレクションの時間。

```
$ jstat -gc 46
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT    CGC    CGCT     GCT   
 0.0   7168.0  0.0   7168.0 1285120.0 321536.0  804864.0   408303.5  267520.0 145904.4 39936.0 14701.9    824   28.107   0      0.000  410    12.191   40.298
```

### C Heap

上記の通り、Java側が確保しているHeapは大した事なさそう。+αでC Heap?も見てみる。

* `pmap` コマンドなどで見られるっぽい
* こちらも実メモリで800MBくらい使っているので、こっちに原因があるかもしれない
  * この辺に来ると定石がなさそうなので、今日は一旦ここまで。

### いくつか考察

* Heapの容量はそこそこあるが、アラートが上がるほどではない
* むしろ、それ以外の領域のほうが怪しい

References
----------

* [プロセスのVSZ,RSSとfree,meminfoの関係を実機で確認する](https://nopipi.hatenablog.com/entry/2017/11/11/213214)
* [Javaはどのように動くのか～図解でわかるJVMの仕組み](https://gihyo.jp/list/group/Java%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E5%8B%95%E3%81%8F%E3%81%AE%E3%81%8B%EF%BD%9E%E5%9B%B3%E8%A7%A3%E3%81%A7%E3%82%8F%E3%81%8B%E3%82%8BJVM%E3%81%AE%E4%BB%95%E7%B5%84%E3%81%BF#rt:/dev/serial/01/jvm-arc/0001)
  * [JVMはどのようにメモリ空間を利用するのか](https://gihyo.jp/dev/serial/01/jvm-arc/0001)
  * [HotSpot JVMのヒープ構造の仕組みを把握する](https://gihyo.jp/dev/serial/01/jvm-arc/0006)
    * 最近のgihyo.jp、デザインかっこよくなってる
* [JavaVMのメモリ管理に関するまとめ（Javaヒープ、GC、ダンプ等）](https://tanakakns.hatenablog.com/entry/20120508/1336467306)
* [恐怖のJVM大量メモリ消費！メモリリークの謎を追え！](https://blog.cybozu.io/entry/8218)

その他
-----

* [Eden - マハラージャン](https://music.youtube.com/watch?v=Bd2ZhiKz3fk&list=RDAMVMBd2ZhiKz3fk)