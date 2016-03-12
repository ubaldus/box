#
# Copyright (C) 2007-2016 by Ubaldo Porcheddu <ubaldo@eja.it>
#
 

ejaBuildRootTar=buildroot-2016.02.tar.gz

dl/$(ejaBuildRootTar):
	mkdir dl
	wget -qO dl/$(ejaBuildRootTar) https://buildroot.org/downloads/$(ejaBuildRootTar)
target:	dl/$(ejaBuildRootTar)
	-mkdir target
output:	target
	-mkdir output


arm: 	output
	tar xf dl/$(ejaBuildRootTar) -C target && mv target/buildroot* target/arm
	cd target/arm && patch -p1 < ../../patch/ejaBuildRoot.patch && ln -s ../../dl .
	echo "BR2_arm=y" >> target/arm/.config	
	make arm.update
arm.update:
	cd target/arm && yes "" | make config && make PREFIX="/" 
	cp target/arm/output/images/rootfs.tar	output/ejaBox.arm.tar
	cp target/arm/output/target/bin/eja	output/eja.arm
arm.clean: 
	-rm -rf target/arm
	-rm output/ejaBox.arm.* output/eja.arm


mips: 	output
	tar xf dl/$(ejaBuildRootTar) -C target && mv target/buildroot* target/mips
	cd target/mips && patch -p1 < ../../patch/ejaBuildRoot.patch && ln -s ../../dl .
	echo "BR2_mips=y" >> target/mips/.config
	make mips.update
mips.update:
	cd target/mips && yes "" | make config && make PREFIX="/" 
	cp target/mips/output/images/rootfs.tar	output/ejaBox.mips.tar
	cp target/mips/output/target/bin/eja	output/eja.mips

mips.clean: 
	-rm -rf target/mips
	-rm output/ejaBox.mips.* output/eja.mips
	

i32:	output
	tar xf dl/$(ejaBuildRootTar) -C target && mv target/buildroot* target/i32
	cd target/i32 && patch -p1 < ../../patch/ejaBuildRoot.patch && ln -s ../../dl .
	echo "BR2_i386=y" >> target/i32/.config	
	make i32.update
i32.update:
	cd target/i32 && yes "" | make config && make PREFIX="/"
	cp target/i32/output/images/rootfs.tar	output/ejaBox.i32.tar
	cp target/i32/output/target/bin/eja	output/eja.i32
	
i32.clean: 
	-rm -rf target/i32
	-rm output/ejaBox.i32.* output/eja.i32
	
	
i64:	output
	tar xf dl/$(ejaBuildRootTar) -C target && mv target/buildroot* target/i64
	cd target/i64 && patch -p1 < ../../patch/ejaBuildRoot.patch && ln -s ../../dl .
	echo "BR2_x86_64=y" >> target/i64/.config	
	make i64.update
i64.update:
	cd target/i64 && yes "" | make config && make PREFIX="/"
	cp target/i64/output/images/rootfs.tar	output/ejaBox.i64.tar
	cp target/i64/output/target/bin/eja	output/eja.i64
	
i64.clean: 
	-rm -rf target/i64 
	-rm output/ejaBox.i64.* output/eja.i64
	
	
android: output
	tar xf dl/$(ejaBuildRootTar) -C target && mv target/buildroot* target/android
	cd target/android && patch -p1 < ../../patch/ejaBuildRoot.patch && ln -s ../../dl .
	echo "BR2_arm=y" >> target/android/.config
	sed -i 's/+#define\t_PATH_BSHELL\t"\/bin\/sh"/+#define _PATH_BSHELL "\/system\/bin\/sh"/' target/android/package/uclibc/1.0.9/0001-PATH_BSHELL.patch
	make android.update
android.update:
	cd target/android && yes "" | make config && make PREFIX="/data/data/it.eja.box/files/"
	cp target/android/output/images/rootfs.tar	output/ejaBox.android.tar
	cp target/android/output/target/bin/eja		output/eja.android
	make android.app
android.app:
	cd app/android && make && cp platforms/android/build/outputs/apk/android-release-unsigned.apk ../../output/ejaBox.android.apk
android.clean: 
	-rm -rf target/android
	-rm -rf app/android/platforms
	-rm output/ejaBox.android.*
	-rm output/eja.android
	
	
rpi: 	output
	tar xf dl/$(ejaBuildRootTar) -C target && mv target/buildroot* target/rpi
	cd target/rpi && patch -p1 < ../../patch/ejaBuildRoot.patch && ln -s ../../dl .
	echo "BR2_arm=y" >>  target/rpi/.config
	echo "BR2_cortex_a7=y" >>  target/rpi/.config
	echo "BR2_ARM_EABIHF=y" >>  target/rpi/.config
	echo "BR2_ARM_FPU_NEON_VFPV4=y" >>  target/rpi/.config
	echo "BR2_TOOLCHAIN_BUILDROOT_CXX=y" >>  target/rpi/.config
	echo "BR2_TARGET_GENERIC_GETTY_PORT=\"tty1\"" >>  target/rpi/.config
	echo "BR2_KERNEL_HEADERS_VERSION=y" >>  target/rpi/.config
	echo "BR2_DEFAULT_KERNEL_VERSION=\"4.1.5\"" >>  target/rpi/.config
	echo "BR2_PACKAGE_HOST_LINUX_HEADERS_CUSTOM_4_1=y" >>  target/rpi/.config
	echo "BR2_LINUX_KERNEL=y" >>  target/rpi/.config
	echo "BR2_LINUX_KERNEL_CUSTOM_GIT=y" >>  target/rpi/.config
	echo "BR2_LINUX_KERNEL_CUSTOM_REPO_URL=\"https://github.com/raspberrypi/linux.git\"" >>  target/rpi/.config
	echo "BR2_LINUX_KERNEL_CUSTOM_REPO_VERSION=\"592503752b6951972f161f04280683c5af38d173\"" >>  target/rpi/.config
	echo "BR2_LINUX_KERNEL_DEFCONFIG=\"bcm2709\"" >>  target/rpi/.config
	echo "BR2_LINUX_KERNEL_ZIMAGE=y" >>  target/rpi/.config
	echo "BR2_LINUX_KERNEL_DTS_SUPPORT=y" >>  target/rpi/.config
	echo "BR2_LINUX_KERNEL_INTREE_DTS_NAME=\"bcm2709-rpi-2-b\"" >>  target/rpi/.config
	echo "BR2_PACKAGE_RPI_FIRMWARE=y" >>  target/rpi/.config
	echo "BR2_TARGET_ROOTFS_CPIO=y" >> target/rpi/.config  
	echo "BR2_TARGET_ROOTFS_CPIO_NONE=y" >> target/rpi/.config  
	echo "BR2_TARGET_ROOTFS_INITRAMFS=y" >> target/rpi/.config  
	make rpi.update
rpi.update:
	cd target/rpi && yes "" | make config && make PREFIX="/" 
	cp target/rpi/output/target/bin/eja	output/eja.rpi
	- rm -rf output/ejaBox.rpi
	mkdir output/ejaBox.rpi 
	-cp target/rpi/output/images/bcm2709-rpi-2-b.dtb target/rpi/output/images/zImage target/rpi/output/images/rpi-firmware/* output/ejaBox.rpi
	target/rpi/output/host/usr/bin/mkknlimg target/rpi/output/images/zImage output/ejaBox.rpi/zImage
	cd output/ejaBox.rpi && tar cRv * > ../ejaBox.rpi.tar
	rm -rf output/ejaBox.rpi
rpi.clean: 
	-rm -rf target/rpi
	-rm output/ejaBox.rpi.* output/eja.rpi


	
	

all: arm mips i32 i64 rpi android

update: arm.update mips.update i32.update i64.update android.update rpi.update

clean: arm.clean mips.clean i32.clean i64.clean android.clean rpi.clean
	-rmdir target
	-rmdir output

