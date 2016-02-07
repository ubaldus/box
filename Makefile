#
# Copyright (C) 2007-2016 by Ubaldo Porcheddu <ubaldo@eja.it>
#
 

ejaBuildRootTar=buildroot-2015.11.1.tar.gz

bkp/$(ejaBuildRootTar):
	wget -qO bkp/$(ejaBuildRootTar) https://buildroot.org/downloads/$(ejaBuildRootTar)
target:	bkp/$(ejaBuildRootTar)
	-mkdir target
output:	target
	-mkdir output

arm: 	output
	tar xf bkp/$(ejaBuildRootTar) -C target && mv target/buildroot* target/arm
	cd target/arm && patch -p1 < ../../bkp/ejaBuildRoot.patch
	echo "BR2_arm=y" >> target/arm/.config	
	make arm.update
arm.update:
	cd target/arm && yes "" | make config && make PREFIX="/" && cp output/images/rootfs.tar ../../output/ejaBox.arm.tar
arm.clean: 
	-rm -rf target/arm
	-rm output/ejaBox.arm.*


mips: 	output
	tar xf bkp/$(ejaBuildRootTar) -C target && mv target/buildroot* target/mips
	cd target/mips && patch -p1 < ../../bkp/ejaBuildRoot.patch
	echo "BR2_mips=y" >> target/mips/.config
	make mips.update
mips.update:
	cd target/mips && yes "" | make config && make PREFIX="/" && cp output/images/rootfs.tar ../../output/ejaBox.mips.tar
mips.clean: 
	-rm -rf target/mips
	-rm output/ejaBox.mips.*
	

i32:	output
	tar xf bkp/$(ejaBuildRootTar) -C target && mv target/buildroot* target/i32
	cd target/i32 && patch -p1 < ../../bkp/ejaBuildRoot.patch
	echo "BR2_i386=y" >> target/i32/.config	
	make i32.update
i32.update:
	cd target/i32 && yes "" | make config && make PREFIX="/" && cp output/images/rootfs.tar ../../output/ejaBox.i32.tar
i32.clean: 
	-rm -rf target/i32 && rm output/ejaBox.i32.*
	
	
i64:	output
	tar xf bkp/$(ejaBuildRootTar) -C target && mv target/buildroot* target/i64
	cd target/i64 && patch -p1 < ../../bkp/ejaBuildRoot.patch
	echo "BR2_x86_64=y" >> target/i64/.config	
	make i64.update
i64.update:
	cd target/i64 && yes "" | make config && make PREFIX="/" && cp output/images/rootfs.tar ../../output/ejaBox.i64.tar
i64.clean: 
	-rm -rf target/i64 && rm output/ejaBox.i64.*
	
	
android: output
	tar xf bkp/$(ejaBuildRootTar) -C target && mv target/buildroot* target/android
	cd target/android && patch -p1 < ../../bkp/ejaBuildRoot.patch
	echo "BR2_arm=y" >> target/android/.config
	sed -i 's/+#define\t_PATH_BSHELL\t"\/bin\/sh"/+#define _PATH_BSHELL "\/system\/bin\/sh"/' target/android/package/uclibc/1.0.9/0001-PATH_BSHELL.patch
	make android.update
android.update:
	cd target/android && yes "" | make config && make PREFIX="/data/data/it.eja.box/files/" && cp output/images/rootfs.tar ../../output/ejaBox.android.tar
	make android.app
android.app:
	cd app/android && make && cp platforms/android/build/outputs/apk/android-debug.apk ../../output/ejaBox.android.apk
android.clean: 
	-rm -rf target/android
	-rm -rf app/android/platforms
	-rm output/ejaBox.android.*
	

all: arm mips i32 i64 android

update: arm.update mips.update i32.update i64.update android.update

clean: arm.clean mips.clean i32.clean i64.clean android.clean
	rmdir target
	rmdir output

