import os

mongodb_path = "E:\Study\Web\mongodb-win32-i386-2.4.3";
nginx_path = "E:\Study\Web\nginx-1.4.1";
dataapp_path = "E:\Study\Web\Root\DB";
php_path = "E:\Study\Web\php-5.5.0-nts-Win32-VC11-x86";

mongodbstar_cmd = mongodb_path + "\\bin\\mongod --dbpath " + dataapp_path + "\\data"
print("star mongodb... " + mongodbstar_cmd);
os.startfile(mongodbstar_cmd);
phpstar_cmd = php_path + "\\php-cgi -b 127.0.0.1:9000 -c " + php_path + "php.ini";
print("star php... " + phpstar_cmd);
os.startfile( phpstar_cmd );
nginxstar_cmd = nginx_path , "/nginx.exe "
print("star nginx");
os.startfile( nginxstar_cmd );