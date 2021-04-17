cd /home/ec2-user/Praise-Server/server
git pull origin develop
sudo npm install
sudo pm2 start ./bin/www