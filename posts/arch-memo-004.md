---
title: 'Installation on Virtualbox'
date: '2023-04-09'
tags: ['Linux', 'Arch Linux']
---

Installation on Virtualbox
==========================

Nothing special, but I got a bit confused when installing the bootloader.

Since VirtualBox does not offer EFI by default (one needs to enable manually),
there's no meaning for creating an EFI partition and install grub for EFI.

Instead, I simply allocated the whole disk (`/dev/sda`) and install grub for
`i386-pc`. [This gist](https://gist.github.com/thomasheller/5b9b18917bbaabceb4f629b793428ee2) 
was really helpful!

