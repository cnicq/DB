
import os
import subprocess
import time

mongodb_path = "C:\\Git\Software\\mongodb-win32-x86_64-2.4.4";
nginx_path = "C:\\Git\Software\\nginx-1.5.0";
dataapp_path = "C:\\Git\\DBStore";
php_path = "C:\\Git\\software\\php-5.4.16-nts-Win32-VC9-x86";

if True:
	mongodb_path = "E:\\Study\\Web\\mongodb-win32-x86_64-2.4.6";
	nginx_path = "E:\\Study\\Web\\nginx-1.4.1";
	dataapp_path = "E:\\Study\\Web\\Root\\DBStore";
	php_path = "E:\\Study\\Web\\php-5.4.16-nts-Win32-VC9-x86";

mongodbstar_cmd = "" + mongodb_path + "\\bin\\mongod --dbpath " + dataapp_path;
print("star mongodb... " + mongodbstar_cmd);
subprocess.Popen(mongodbstar_cmd, shell=True) 
time.sleep(3)
phpstar_cmd = "" + php_path + "\\php-cgi -b 127.0.0.1:9000 -c " + php_path + "\\php.ini";
print("star php... " + phpstar_cmd);
subprocess.Popen(phpstar_cmd, shell=True) 
time.sleep(3)
nginxstar_cmd = "" + nginx_path + "\\nginx.exe -p " + nginx_path;
print("star nginx... "+ nginxstar_cmd);
subprocess.Popen(nginxstar_cmd, shell=True) 
time.sleep(3)
'''
node_cmd = "node app.js"
print("star node... "+ node_cmd);
subprocess.Popen(node_cmd, shell=True) 
'''