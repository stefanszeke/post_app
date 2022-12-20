# post_app <img src="https://github.com/stefanszeke/post_app/blob/main/frontend/src/assets/favicon.svg" width="30"/>


    express, mysql, angular, jwt, docker-compose


</br >

### first run the docker container for the database:
to run docker: </br >
run `docker-compose up -d` from root </br >
in subsequent runs just run `docker-compose start` </br >
or `docker-compose stop` to stop the container </br >
(on windows: make sure docker desktop is running)

</br >

### install and run the backend and the fronted:
from ./backand  run: `npm i` and after: `npm run dev` </br >
from ./frontend run: `npm i` and after: `npm start` </br >
go to: http://localhost:4200 to use the app </br >

</br >


### adminer:
to use adminer go to: http://localhost:8098/ </br >
login: </br >
- server: postDB
- username: admin
- password: admin
  - after launching the docker container, wait like a minute before logging in

