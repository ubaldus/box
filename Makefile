#
# Copyright (C) 2007-2016 by Ubaldo Porcheddu <ubaldo@eja.it>
#
 

ejaBuildRootTar=buildroot-2016.02.tar.gz


all: arm mips i386 x86_64 rpi1 rpi2 android

update: arm.update mips.update i386.update x86_64.update rpi1.update rpi2.update android.update

clean: arm.clean mips.clean i386.clean x86_64.clean rpi1.clean rpi2.clean android.clean
	-rmdir target
	-rmdir output
	
dl:
	mkdir dl
	wget -O dl/$(ejaBuildRootTar) https://buildroot.org/downloads/$(ejaBuildRootTar)
	
target: dl
	-mkdir target
	
output: target
	-mkdir output
	
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
	make x86_64.update
x86_64.update:
	make generic.update      arch=x86_64
x86_64.clean:
	make generic.clean       arch=x86_64


android: output
	tar xf dl/$(ejaBuildRootTar) -C target && mv target/buildroot* target/android
	cd target/android && ln -s ../../dl . && cat ../../patch/*.patch | patch -p1
	echo "BR2_arm=y" >> target/android/.config
	sed -i 's/+#define\t_PATH_BSHELL\t"\/bin\/sh"/+#define _PATH_BSHELL "\/system\/bin\/sh"/' target/android/package/uclibc/1.0.12/0001-PATH_BSHELL.patch
	make android.update
android.update:
	cd target/android && yes "" | make config && make PREFIX="/data/data/it.eja.box/files/"
	cp target/android/output/images/rootfs.tar output/ejaBox.android.tar
	cp target/android/output/target/usr/bin/eja output/eja.android
	make android.app
android.app:
	cd app/android && make && cp platforms/android/build/outputs/apk/android-release-unsigned.apk ../../output/ejaBox.android.apk
android.clean: 
	-rm -rf target/android
	-rm -rf app/android/platforms
	-rm output/ejaBox.android.*
	-rm output/eja.android
	
	
rpi1: 	output
	tar xf dl/$(ejaBuildRootTar) -C target && mv target/buildroot* target/rpi1
	cd target/rpi1 && ln -s ../../dl . && cat ../../patch/*.patch | patch -p1
	echo "BR2_arm=y" >> target/rpi1/.config
	echo "BR2_arm1176jzf_s=y" >> target/rpi1/.config
	echo "BR2_ARM_EABIHF=y" >> target/rpi1/.config
	echo "BR2_TARGET_GENERIC_GETTY_PORT=\"tty1\"" >> target/rpi1/.config
	echo "BR2_PACKAGE_HOST_LINUX_HEADERS_CUSTOM_4_1=y " >> target/rpi1/.config
	echo "BR2_TOOLCHAIN_BUILDROOT_CXX=y" >> target/rpi1/.config
	echo "BR2_LINUX_KERNEL=y" >> target/rpi1/.config
	echo "BR2_LINUX_KERNEL_CUSTOM_GIT=y" >> target/rpi1/.config
	echo "BR2_LINUX_KERNEL_CUSTOM_REPO_URL=\"https://github.com/raspberrypi/linux.git\"" >> target/rpi1/.config
	echo "BR2_LINUX_KERNEL_CUSTOM_REPO_VERSION=\"d33d0293e245badc4ca6ede3984d8bb8ea63cb1a\"" >> target/rpi1/.config
	echo "BR2_LINUX_KERNEL_DEFCONFIG=\"bcmrpi\"" >> target/rpi1/.config
	echo "BR2_LINUX_KERNEL_ZIMAGE=y" >> target/rpi1/.config
	echo "BR2_LINUX_KERNEL_DTS_SUPPORT=y" >> target/rpi1/.config
	echo "BR2_LINUX_KERNEL_INTREE_DTS_NAME=\"bcm2708-rpi-b bcm2708-rpi-b-plus bcm2708-rpi-cm\"" >> target/rpi1/.config
	echo "BR2_PACKAGE_RPI_FIRMWARE=y" >> target/rpi1/.config
	echo "BR2_TARGET_ROOTFS_CPIO=y" >> target/rpi1/.config  
	echo "BR2_TARGET_ROOTFS_CPIO_NONE=y" >> target/rpi1/.config  
	echo "BR2_TARGET_ROOTFS_INITRAMFS=y" >> target/rpi1/.config  
	make rpi1.update
rpi1.update:
	cd target/rpi1 && yes "" | make config && make PREFIX="/" 
	cp target/rpi1/output/target/usr/bin/eja output/eja.rpi1
	- rm -rf output/ejaBox.rpi1
	mkdir output/ejaBox.rpi1 
	-cp target/rpi1/output/images/*.dtb target/rpi1/output/images/zImage target/rpi1/output/images/rpi-firmware/* output/ejaBox.rpi1
	target/rpi1/output/host/usr/bin/mkknlimg target/rpi1/output/images/zImage output/ejaBox.rpi1/zImage
	cd output/ejaBox.rpi1 && tar cRv * > ../ejaBox.rpi1.tar
	rm -rf output/ejaBox.rpi1
rpi1.clean: 
	-rm -rf target/rpi1
	-rm output/ejaBox.rpi1.* output/eja.rpi1


rpi2: 	output
	tar xf dl/$(ejaBuildRootTar) -C target && mv target/buildroot* target/rpi2
	cd target/rpi2 && ln -s ../../dl . && cat ../../patch/*.patch | patch -p1
	echo "BR2_arm=y" >>  target/rpi2/.config
	echo "BR2_cortex_a7=y" >>  target/rpi2/.config
	echo "BR2_ARM_EABIHF=y" >>  target/rpi2/.config
	echo "BR2_ARM_FPU_NEON_VFPV4=y" >>  target/rpi2/.config
	echo "BR2_TOOLCHAIN_BUILDROOT_CXX=y" >>  target/rpi2/.config
	echo "BR2_TARGET_GENERIC_GETTY_PORT=\"tty1\"" >>  target/rpi2/.config
	echo "BR2_KERNEL_HEADERS_VERSION=y" >>  target/rpi2/.config
	echo "BR2_DEFAULT_KERNEL_VERSION=\"4.1.5\"" >>  target/rpi2/.config
	echo "BR2_PACKAGE_HOST_LINUX_HEADERS_CUSTOM_4_1=y" >>  target/rpi2/.config
	echo "BR2_LINUX_KERNEL=y" >>  target/rpi2/.config
	echo "BR2_LINUX_KERNEL_CUSTOM_GIT=y" >>  target/rpi2/.config
	echo "BR2_LINUX_KERNEL_CUSTOM_REPO_URL=\"https://github.com/raspberrypi/linux.git\"" >>  target/rpi2/.config
	echo "BR2_LINUX_KERNEL_CUSTOM_REPO_VERSION=\"20fe468af4bb40fec0f81753da4b20a8bfc259c9\"" >>  target/rpi2/.config
	echo "BR2_LINUX_KERNEL_DEFCONFIG=\"bcm2709\"" >>  target/rpi2/.config
	echo "BR2_LINUX_KERNEL_ZIMAGE=y" >>  target/rpi2/.config
	echo "BR2_LINUX_KERNEL_DTS_SUPPORT=y" >>  target/rpi2/.config
	echo "BR2_LINUX_KERNEL_INTREE_DTS_NAME=\"bcm2709-rpi-2-b bcm2710-rpi-3-b\"" >>  target/rpi2/.config
	echo "BR2_PACKAGE_RPI_FIRMWARE=y" >>  target/rpi2/.config
	echo "BR2_TARGET_ROOTFS_CPIO=y" >> target/rpi2/.config  
	echo "BR2_TARGET_ROOTFS_CPIO_NONE=y" >> target/rpi2/.config  
	echo "BR2_TARGET_ROOTFS_INITRAMFS=y" >> target/rpi2/.config  
	make rpi2.update
rpi2.update:
	cd target/rpi2 && yes "" | make config && make PREFIX="/" 
	cp target/rpi2/output/target/usr/bin/eja output/eja.rpi2
	- rm -rf output/ejaBox.rpi2
	mkdir output/ejaBox.rpi2 
	-cp target/rpi2/output/images/*.dtb target/rpi2/output/images/zImage target/rpi2/output/images/rpi-firmware/* output/ejaBox.rpi2
	target/rpi2/output/host/usr/bin/mkknlimg target/rpi2/output/images/zImage output/ejaBox.rpi2/zImage
	cd output/ejaBox.rpi2 && tar cRv * > ../ejaBox.rpi2.tar
	rm -rf output/ejaBox.rpi2
rpi2.clean: 
	-rm -rf target/rpi2
	-rm output/ejaBox.rpi2.* output/eja.rpi2


