#!/system/bin/sh

cd /data/data/it.eja.box/files
chmod 755 tmp/zip/eja
tmp/zip/eja 'ejaUntar("tmp/zip/ejaBox.tar")'
cp tmp/zip/ejaBox.sh bin/ejaBox.sh && chmod 775 bin/ejaBox.sh
cp tmp/zip/eja.init etc/eja/eja.init
rm usr/lib/eja/box.eja
rm -rf tmp/*
