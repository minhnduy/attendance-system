
# Test Read&Write Repository
## Mode: FTP_PASSIVE
- docker pull fauria/vsftpd
- docker run -d -v /my/data/directory:/home/vsftpd \
    -p 20:20 -p 21:21 -p 21100-21110:21100-21110 \
    -e FTP_USER=datlv -e FTP_PASS=datlv123456 \
    -e PASV_ADDRESS=127.0.0.1 -e PASV_MIN_PORT=21100 -e PASV_MAX_PORT=21110 \
    -e PASV_PROMISCUOUS=YES -e PORT_PROMISCUOUS=YES \
    --name vsftpd --restart=always fauria/vsftpd
-  run : ts-node .\test\ftp\testftppassive.ts
## Mode: FTP_ACTIVE
- docker-compose -f docker-ftp.yml up -d
- run : ts-node .\test\ftp\testftpactive.ts

## Mode: FTPS
- docker pull fauria/vsftpd
- docker run -d -v /my/data/directory:/home/vsftpd \
    -p 20:20 -p 21:21 -p 21100-21110:21100-21110 \
    -e FTP_USER=datlv -e FTP_PASS=datlv123456 \
    -e PASV_ADDRESS=127.0.0.1 -e PASV_MIN_PORT=21100 -e PASV_MAX_PORT=21110 \
    -e PASV_PROMISCUOUS=YES -e PORT_PROMISCUOUS=YES \
    --name vsftpd --restart=always fauria/vsftpd
-  run : ts-node .\test\ftp\testftps.ts

## Mode: SFTP
- use PuTTY Key Generator to generate PuTTY key
- docker run \
    -v <host-dir>/ssh_key.pub:/home/foo/.ssh/keys/ssh_key.pub:ro\
    -p 2222:22\
    -d atmoz/sftp foo::::upload
- change value of puttyContent in source (note: the format of the key file)
-  run : ts-node .\test\ftp\testftsftp.ts  
