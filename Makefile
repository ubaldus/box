#
# Copyright (C) 2007-2016 by Ubaldo Porcheddu <ubaldo@eja.it>
#
 

ejaBuildRootTar=buildroot-2015.11.1.tar.gz

bkp/$(ejaBuildRootTar): target
	wget -qO bkp/$(ejaBuildRootTar) https://buildroot.org/downloads/$(ejaBuildRootTar)
target:	bkp/$(ejaBuildRootTar)
	mkdir target
output:	target
	mkdir output

arm: 	output
	tar xf bkp/$(ejaBuildRootTar) -C target && mv target/buildroot* target/arm
	cd target/arm && patch -p1 < ../../bkp/ejaBuildRoot.patch
	echo "BR2_arm=y" >> target/arm/.config	
	cd target/arm && make menuconfig && make && cp output/images/rootfs.tar ../../output/ejaBox.arm.tar
arm.clean: 
	-rm -rf target/arm
	-rm output/ejaBox.arm.*


mips: 	output
	tar xf bkp/$(ejaBuildRootTar) -C target && mv target/buildroot* target/mips
	cd target/mips && patch -p1 < ../../bkp/ejaBuildRoot.patch
	echo "BR2_mips=y" >> target/mips/.config
	cd target/mips && make menuconfig && make && cp output/images/rootfs.tar ../../output/ejaBox.mips.tar
mips.clean: 
	-rm -rf target/mips
	-rm output/ejaBox.mips.*
	

i32:	output
	tar xf bkp/$(ejaBuildRootTar) -C target && mv target/buildroot* target/i32
	cd target/i32 && patch -p1 < ../../bkp/ejaBuildRoot.patch
	echo "BR2_i386=y" >> target/i32/.config	
	cd target/i32 && make menuconfig && make && cp output/images/rootfs.tar ../../output/ejaBox.i32.tar
i32.clean: 
	-rm -rf target/i32 && rm output/ejaBox.i32.*
	
	
i64:	output
	tar xf bkp/$(ejaBuildRootTar) -C target && mv target/buildroot* target/i64
	echo "BR2_x86_64=y" >> target/i64/.config
	cd target/i64 && patch -p1 < ../../bkp/ejaBuildRoot.patch
	cd target/i64 && make menuconfig && make && cp output/images/rootfs.tar ../../output/ejaBox.i64.tar
i64.clean: 
	-rm -rf target/i64 && rm output/ejaBox.i64.*
	
	
android: output
	tar xf bkp/$(ejaBuildRootTar) -C target && mv target/buildroot* target/android
	cd target/android && patch -p1 < ../../bkp/ejaBuildRoot.patch
	echo "BR2_arm=y" >> target/android/.config
	sed -i 's/+#define\t_PATH_BSHELL\t"\/bin\/sh"/+#define _PATH_BSHELL "\/system\/bin\/sh"/' target/android/package/uclibc/1.0.9/0001-PATH_BSHELL.patch
	cd target/android && make menuconfig && make && cp output/images/rootfs.tar ../../output/ejaBox.android.tar
	cd app/android && make && cp platforms/android/build/outputs/apk/android-debug.apk ../../output/ejaBox.android.apk
android.clean: 
	-rm -rf target/android
	-rm -rf app/android/platforms
	-rm output/ejaBox.android.*
	

