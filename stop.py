import os
import subprocess
import time

mongodb_path = "C:\\Git\Software\\mongodb-win32-x86_64-2.4.4";
nginx_path = "C:\\Git\Software\\nginx-1.5.0";
dataapp_path = "C:\\Git\\DB";
php_path = "C:\\Git\\software\\php-5.4.16-nts-Win32-VC9-x86";

if False:
	mongodb_path = "E:\\Study\\Web\\mongodb-win32-i386-2.4.3";
	nginx_path = "E:\\Study\\Web\\nginx-1.4.1";
	dataapp_path = "E:\\Study\\Web\\Root\\DB";
	php_path = "E:\\Study\\Web\\php-5.4.16-nts-Win32-VC9-x86";

#shut down nignx
nginxstar_cmd = "" + nginx_path + "\\nginx.exe -s quit -p " + nginx_path;
print("stop nginx... "+ nginxstar_cmd);
os.system(nginxstar_cmd);
time.sleep(2)
