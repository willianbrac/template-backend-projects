docker-compose up -d
docker pull redis 
docker run --name myrediscache -p 6379:6379 -d redis
docker exec -it myrediscache redis-cli