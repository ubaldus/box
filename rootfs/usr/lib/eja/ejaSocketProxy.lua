-- Copyright (C) 2007-2016 by Ubaldo Porcheddu <ubaldo@eja.it>


function ejaSocketProxy(lHost, lPort, rHost, rPort, inMode, outMode, lTimeout, rTimeout)
 local bSize=8192 
 local lTimeout=lTimeout or 5
 local rTimeout=rTimeout or 100
 local inMode=inMode or '' or 'b64' or 'hex'
 local outMode=outMode or '' or 'b64' or 'hex'
 local lSocket=nil
 local rSocket=nil
 if lHost and lPort and rHost and rPort then
  local res,err=ejaSocketGetAddrInfo(rHost, rPort, {family=AF_INET, socktype=SOCK_STREAM})    
  if res then
   local rSocket=ejaSocketOpen(AF_INET,SOCK_STREAM,0)
   if rSocket and ejaSocketConnect(rSocket,res[1]) then
    ejaSocketOptionSet(rSocket,SOL_SOCKET,SO_RCVTIMEO,lTimeout,0)
    ejaSocketOptionSet(rSocket,SOL_SOCKET,SO_SNDTIMEO,lTimeout,0)
    local s=ejaSocketOpen(AF_INET,SOCK_STREAM,0)
    ejaSocketOptionSet(s,SOL_SOCKET,SO_REUSEADDR,1) 
    ejaSocketBind(s,{ family=AF_INET, addr=lHost, port=lPort },0)
    ejaSocketListen(s,lTimeout) 
    if s then
     while true do
      lSocket,t=ejaSocketAccept(s)
      if lSocket then
       ejaSocketOptionSet(lSocket,SOL_SOCKET,SO_RCVTIMEO,lTimeout,0)
       ejaSocketOptionSet(lSocket,SOL_SOCKET,SO_SNDTIMEO,lTimeout,0)
       local dataIn=ejaSocketRead(lSocket,bSize)
       if dataIn then 
        local query=dataIn:match("^GET /%?([^ ]+) ") 
        if query then
         if inMode=='b64' then 
          local tmp=ejaBase64Decode(query); query=tmp;
         end
         if inMode=='hex' then
          local tmp,_=query:gsub("..",function(x)return string.char(tonumber(x,16)) end); query=tmp; 
         end
         ejaSocketWrite(rSocket,query) 
        end
       end
       local dataOut=ejaSocketRead(rSocket,bSize) or ""
       if outMode=='b64' then local tmp=ejaBase64Encode(dataOut); dataOut=tmp; end
       if outMode=='hex' then local tmp=dataOut:gsub(".",function(x)return string.format("%02X",string.byte(x)) end); dataOut=tmp; end
       ejaSocketWrite(lSocket,'HTTP/1.0 200 OK\r\nDate: '..os.date()..'\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: '..#dataOut..'\r\nConnection: close\r\n\r\n'..dataOut) 
      end
      ejaSocketClose(lSocket)
     end
    end
    ejaSocketClose(rSocket)
   end
  end
 end
end