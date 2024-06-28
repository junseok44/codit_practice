FROM mongo:4.4

# keyfile 생성 및 권한 설정
RUN mkdir -p /etc/secrets \
    && echo "$(head -c 32 /dev/urandom | base64)" > /etc/secrets/mongo-keyfile \
    && chmod 400 /etc/secrets/mongo-keyfile \
    && chown mongodb:mongodb /etc/secrets/mongo-keyfile

# MongoDB 실행
CMD ["mongod", "--replSet", "rs0", "--keyFile", "/etc/secrets/mongo-keyfile"]
