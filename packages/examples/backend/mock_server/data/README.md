## Account

```bash
{
  curl -X GET http://localhost:3333/api/v1/accounts
  curl -X GET http://localhost:3333/api/v1/accounts/1
  curl -X GET http://localhost:3333/api/v1/accounts/2
  curl -X GET http://localhost:3333/api/v1/accounts/3
  curl -X GET http://localhost:3333/api/v1/accounts/4
  curl -X GET http://localhost:3333/api/v1/accounts/5
  curl -X GET http://localhost:3333/api/v1/accounts/6
  curl -X GET http://localhost:3333/api/v1/accounts/7
  curl -X POST -H 'Content-Type:application/json' http://localhost:3333/api/v1/accounts \
    -d $'{"name": "name_8","email": "name_8@example.com","info": { "github":"dhh" }}'
  curl -X PATCH -H 'Content-Type:application/json' http://localhost:3333/api/v1/accounts/1 \
    -d $'{"name": "rename","email": "rename@example.com"}'
  curl -X PUT -H 'Content-Type:application/json' http://localhost:3333/api/v1/accounts/2 \
    -d $'{"name": "rename","email": "rename@example.com"}'
  curl -X DELETE http://localhost:3333/api/v1/accounts/1
}
```

## Task

```bash
{
  curl -X GET http://localhost:3333/api/v1/tasks
  curl -X GET http://localhost:3333/api/v1/tasks/1
  curl -X GET http://localhost:3333/api/v1/tasks/2
  curl -X GET http://localhost:3333/api/v1/tasks/3
  curl -X GET http://localhost:3333/api/v1/tasks/4
  curl -X GET http://localhost:3333/api/v1/tasks\?accountId=1
}
```
