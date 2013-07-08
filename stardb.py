import os
import subprocess
import time

mongodb_path = "C:\\Git\Software\\mongodb-win32-x86_64-2.4.4";
nginx_path = "C:\\Git\Software\\nginx-1.5.0";
dataapp_path = "C:\\Git\\DB";
php_path = "C:\\Git\\software\\php-5.4.16-nts-Win32-VC9-x86";

#shut down nignx
nginxstar_cmd = "" + nginx_path + "\\nginx.exe -s quit";
print("stop nginx... "+ nginxstar_cmd);
os.system(nginxstar_cmd);
time.sleep(2)

#shut down php

mongodbstar_cmd = "" + mongodb_path + "\\bin\\mongod --dbpath " + dataapp_path + "\\data"
print("star mongodb... " + mongodbstar_cmd);
subprocess.Popen(mongodbstar_cmd, shell=True) 
time.sleep(3)
phpstar_cmd = "" + php_path + "\\php-cgi -b 127.0.0.1:9000 -c " + php_path + "\\php.ini";
print("star php... " + phpstar_cmd);
subprocess.Popen(phpstar_cmd, shell=True) 
time.sleep(3)

subprocess.Popen(nginxstar_cmd, shell=True) 