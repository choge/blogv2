---
title: '急にネットにつながらなくなった'
date: '2022-08-15'
tags: ['Linux', 'Arch Linux']
---

起こった事象
==========

急に `Network unreachable` のエラーが出てウンともスンともいわなくなった

解析
----

`ip link show` をしてみると、デバイスの状態が `DOWN` になっている。当然IPアドレスもついてない。


暫定対応（その１）
---------------

とりあえず手動でIPアドレスを付与してやる。

```
ip link set eno1 up
ip address add 192.168.1.99/24 dev eno1
ip route add 0.0.0.0/0 via 192.168.1.1 dev eno1
```

暫定？恒久？対応
--------------

本来ならこういうのはスタートアップ時に自動的に設定されているべきで、何らかの [ネットワークマネージャ](https://wiki.archlinux.jp/index.php/%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF%E8%A8%AD%E5%AE%9A#.E3.83.8D.E3.83.83.E3.83.88.E3.83.AF.E3.83.BC.E3.82.AF.E3.83.9E.E3.83.8D.E3.83.BC.E3.82.B8.E3.83.A3) が設定しているはず。
どういうわけか、 `systemd-networkd.service` がDisabledになっていたので、 `systemctl enable systemd-networkd.service` で有効にしておいた。

競合するはずの `netctl` もいるので、何かの拍子に上書きされた・・・？

```
 $ ls -l /usr/lib/systemd/system/ | rg net
.rw-r--r-- root root  512 B  Sun Mar  6 19:03:44 2022 netctl-auto@.service
.rw-r--r-- root root  442 B  Sun Mar  6 19:03:44 2022 netctl-ifplugd@.service
.rw-r--r-- root root  284 B  Sun Mar  6 19:03:44 2022 netctl-sleep.service
.rw-r--r-- root root  289 B  Sun Mar  6 19:03:44 2022 netctl-wait-online.service
.rw-r--r-- root root  260 B  Sun Mar  6 19:03:44 2022 netctl.service
.rw-r--r-- root root  316 B  Sun Mar  6 19:03:44 2022 netctl@.service
.rw-r--r-- root root  513 B  Wed Jul 13 23:24:51 2022 network-online.target
.rw-r--r-- root root  520 B  Wed Jul 13 23:24:51 2022 network-pre.target
.rw-r--r-- root root  529 B  Wed Jul 13 23:24:51 2022 network.target
.rw-r--r-- root root  690 B  Wed Jul 13 23:24:51 2022 systemd-network-generator.service
.rw-r--r-- root root  752 B  Wed Jul 13 23:24:51 2022 systemd-networkd-wait-online.service
.rw-r--r-- root root  771 B  Wed Jul 13 23:24:51 2022 systemd-networkd-wait-online@.service
.rw-r--r-- root root  2.3 KB Wed Jul 13 23:24:51 2022 systemd-networkd.service
.rw-r--r-- root root  682 B  Wed Jul 13 23:24:51 2022 systemd-networkd.socket
```

ひとまずこれでつながるようにはなっている。