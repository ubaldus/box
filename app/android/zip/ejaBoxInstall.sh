#!/system/bin/sh

p="/data/data/it.eja.box/files/"

cd $p

if [ ! -e "${p}/bin" ]; then
 arch="aarch64"
 chmod 755 tmp/zip/bin/$arch/busybox && tmp/zip/bin/$arch/busybox tar x -f tmp/zip/ejaBox.tar && cp tmp/zip/bin/$arch/busybox bin/busybox && cp tmp/zip/bin/$arch/eja usr/bin/eja 
fi;

if [ ! -e "${p}/bin" ]; then
 arch="arm"
 chmod 755 tmp/zip/bin/$arch/busybox && tmp/zip/bin/$arch/busybox tar x -f tmp/zip/ejaBox.tar && cp tmp/zip/bin/$arch/busybox bin/busybox && cp tmp/zip/bin/$arch/eja usr/bin/eja 
fi;

if [ ! -e "${p}/bin" ]; then
 arch="i686"
 chmod 755 tmp/zip/bin/$arch/busybox && tmp/zip/bin/$arch/busybox tar x -f tmp/zip/ejaBox.tar && cp tmp/zip/bin/$arch/busybox bin/busybox && cp tmp/zip/bin/$arch/eja usr/bin/eja 
fi;

if [ ! -e "${p}/bin" ]; then
 arch="x86_64"
 chmod 755 tmp/zip/bin/$arch/busybox && tmp/zip/bin/$arch/busybox tar x -f tmp/zip/ejaBox.tar && cp tmp/zip/bin/$arch/busybox bin/busybox && cp tmp/zip/bin/$arch/eja usr/bin/eja 
fi;

chmod 755 usr/bin/eja

rm -rf tmp/*
