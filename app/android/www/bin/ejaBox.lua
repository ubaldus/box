-- Copyright (C) 2016 by Ubaldo Porcheddu <ubaldo@eja.it>


if not ejaFileStat(eja.pathBin..'ejaBox.sh') then
 ejaFileWrite(eja.pathBin..'ejaBox.sh',ejaSprintf('#!%s/ash\nexport HOME=%s\nPATH=$HOME/bin:$HOME/usr/bin:$HOME:$PATH\nexport PS1="$ "\ncd $HOME; clear; read -p "password: " -s pass; echo ""; if [ "$pass" = "eja.it" ]; then $HOME/bin/busybox ash -i; fi; exit;\n',eja.pathBin,eja.path))
 ejaUntar(eja.pathBin..'ejaBox.tar',eja.path)
 ejaExecute('chmod 755 %s/*',eja.pathBin)
end

ejaExecute('%s/busybox telnetd -l %s/ejaBox.sh -p 35223',eja.pathBin,eja.pathBin)


-- ejaWebTelnet
eja.pathBin=eja.path..'/usr/bin/'
eja.pathEtc=eja.path..'/etc/eja/'
eja.pathLib=eja.path..'/usr/lib/eja/'
eja.pathVar=eja.path..'/var/eja/'

dofile(eja.pathLib..'ejaSocketProxy.lua')

local sessionCount=5
local localHost='0.0.0.0'
local localPort=35200
local remoteHost='127.0.0.1'
local remotePort=35223

for i=0,sessionCount do
 eja.pid.webTelnet=ejaFork()
 if eja.pid.webTelnet and eja.pid.webTelnet == 0 then
  ejaSocketProxy(localHost,localPort+i,remoteHost,remotePort,'hex','hex',1,1)
  os.exit()
 else
  ejaPidWrite(ejaSprintf('webTelnet_%d',localPort+i),eja.pid.webTelnet)
 end
end

ejaWebStart()

