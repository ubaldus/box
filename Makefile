#
# Copyright (C) 2007-2020 by Ubaldo Porcheddu <ubaldo@eja.it>
#
 

ejaBuildRootTar=buildroot-2020.02.7.tar.gz


all: arm mips i386 x86_64 android

update: arm.update mips.update i386.update x86_64.update android.update

clean: arm.clean mips.clean i386.clean x86_64.clean android.clean
	-rmdir target
	-rmdir output
	
dl:
	mkdir dl
	wget -O dl/$(ejaBuildRootTar) https://buildroot.org/downloads/$(ejaBuildRootTar)
	
target: dl
	@-mkdir target
	
output: target
	@-mkdir output
	
generic.prepare: output
	tar xf dl/$(ejaBuildRootTar) -C target && mv target/buildroot* target/${arch}
	cd target/${arch} && ln -s ../../dl . && cat ../../patch/*.patch | patch -p1
	echo "BR2_${arch}=y" >> target/${arch}/.config	
	
generic.config.auto:
	cd target/${arch} && yes "" | make config
	
generic.config.menu:
	cd target/${arch} && make menuconfig
	
generic.update:
	cd target/${arch} && make PREFIX="/"
	cp target/${arch}/output/images/rootfs.tar output/ejaBox.${arch}.tar
	cp target/${arch}/output/target/usr/bin/eja output/eja.${arch}
	
generic.clean: 
	@-rm -rf target/${arch}
	@-rm output/ejaBox.${arch}.* output/eja.${arch}


arm:
	make generic.prepare     arch=arm
	make generic.config.auto arch=arm
	make arm.update
arm.config:
	make generic.prepare     arch=arm
	make generic.config.menu arch=arm
	make arm.update
arm.update:
	make generic.update      arch=arm
arm.clean:
	make generic.clean       arch=arm


mips:
	make generic.prepare     arch=mips
	make generic.config.auto arch=mips
	make mips.update
mips.config:
	make generic.prepare     arch=mips
	make generic.config.menu arch=mips
	make mips.update
mips.update:
	make generic.update      arch=mips
mips.clean:
	make generic.clean       arch=mips


i386:
	make generic.prepare     arch=i386
	make generic.config.auto arch=i386
	make i386.update
i386.config:
	make generic.prepare     arch=i386
	make generic.config.menu arch=i386
	make i386.update
i386.update:
	make generic.update      arch=i386
i386.clean:
	make generic.clean       arch=i386


x86_64:
	make generic.prepare     arch=x86_64
	make generic.config.auto arch=x86_64
	make x86_64.update
x86_64.config:
	make generic.prepare     arch=x86_64
	make generic.config.menu arch=x86_64
	make x86_64.update
x86_64.update:
	make generic.update      arch=x86_64
x86_64.clean:
	make generic.clean       arch=x86_64


android: output
	tar xf dl/$(ejaBuildRootTar) -C target
	mv target/buildroot* target/android
	@cd target/android ; ln -s ../../dl dl ; cat ../../patch/*.patch | patch -p1
	echo "BR2_arm=y" >> target/android/.config
	sed -i 's/+#define\t_PATH_BSHELL\t"\/bin\/sh"/+#define _PATH_BSHELL "\/system\/bin\/sh"/' target/android/package/uclibc/0001-PATH_BSHELL.patch
	sed -i 's/+#define _PATH_RESCONF        "\/etc\/resolv.conf"/+#define _PATH_RESCONF "\/data\/data\/it.eja.box\/files\/etc\/resolv.conf"/' target/android/package/uclibc/0002-PATH_RESCONF.patch
	make android.update
android.update:
	cd target/android && yes "" | make config && make PREFIX="/data/data/it.eja.box/files/" _PATH_BSHELL=/system/bin/sh _PATH_RESCONF=/data/data/it.eja.box/files/etc/resolv.conf
	cp target/android/output/images/rootfs.tar output/ejaBox.android.tar
	cp target/android/output/target/usr/bin/eja output/eja.android
	make android.app
android.app:
	cd app/android && make clean && make debug && cp platforms/android/build/outputs/apk/android-release-unsigned.apk ../../output/ejaBox.android.apk
android.clean: 
	cd app/android && make clean
	-rm -rf target/android
	-rm output/ejaBox.android.*
	-rm output/eja.android
	
	
