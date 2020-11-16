#!/data/data/it.eja.box/files//bin//ash

export HOME=/data/data/it.eja.box/files/
export PS1="$ "

PATH=$HOME/bin:$HOME/usr/bin:$HOME:$PATH

cd $HOME

clear
read -p "password: " -s pass
echo ""

if [ "$pass" = "eja.it" ]; then 
 $HOME/bin/busybox ash -i
fi

exit
