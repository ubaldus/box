-- Copyright (C) 2016 by Ubaldo Porcheddu <ubaldo@eja.it>


if not ejaFileStat(eja.pathBin..'ejaBox.sh') then
 ejaFileWrite(eja.pathBin..'ejaBox.sh',sf('#!%s/ash\nexport HOME=%s\nPATH=$HOME/bin:$PATH\nexport PS1="$ "\ncd $HOME; read -p "password: " -s pass; echo ""; if [ "$pass" = "eja.it" ]; then $HOME/bin/busybox ash -i; fi; exit;\n',eja.pathBin,eja.path))
 ejaUntar(eja.pathBin..'ejaBox.tar',eja.path)
 ejaExecute('chmod 755 %s/*',eja.pathBin)
end

ejaExecute('%s/busybox telnetd -l %s/ejaBox.sh -p 35223',eja.pathBin,eja.pathBin)

-- ejaWebTelnet

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
  ejaPidWrite(sf('webTelnet_%d',localPort+i),eja.pid.webTelnet)
 end
end

ejaWebStart()
