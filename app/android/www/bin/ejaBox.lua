-- Copyright (C) 2016 by Ubaldo Porcheddu <ubaldo@eja.it>

eja.path='/data/user/0/it.eja.box/files/'
eja.pathBin=eja.path..'/bin/'

if not ejaFileStat(eja.pathBin..'ejaBox.sh') then
 ejaFileWrite(eja.pathBin..'ejaBox.sh',sf('#!%s/ash\nexport HOME=%s\nPATH=$HOME/bin:$PATH\nexport PS1="$ "\ncd $HOME\n$HOME/bin/busybox ash -i\n',eja.pathBin,eja.path))
 ejaUntar(eja.pathBin..'ejaBox.tar',eja.path)
 ejaExecute('%s/busybox --install -s %s',eja.pathBin,eja.pathBin)
 ejaExecute('chmod 755 %s/*',eja.pathBin)
end

ejaExecute('%s/busybox telnetd -l %s/ejaBox.sh -p 35223',eja.pathBin,eja.pathBin)

-- ejaWebTelnet

dofile(eja.path..'/lib/ejaSocketProxy.lua')

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

eja.opt.webPath=eja.path..'/var/web/'
ejaWebStart()
