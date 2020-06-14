# Choretastic API

## Summary

Shopily is a web app that allows users to input their shopping list and arranges all shopping list items so as to provide the most efficient shopping route.

## Base URL

The base url to access our API is [https://secret-thicket-83423.herokuapp.com/](https://secret-thicket-83423.herokuapp.com/)

## Authentication

In order to access most you'll need a valid user token passed through Header.

You can demo test with the following token:
`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1OTIwOTE3ODEsInN1YiI6ImpkQGNob3JldGFzdGljLmNvbSJ9.Coc0yyE7SUEOAnV1SAl2_g5-2g40OiYuCfjSAWsiMwU`


## Endpoints

### /api/users

Use this endpoint to interact with the users table.

#### POST /api/users/sign-up

Add new user without a specific supermarket assigned to them. No `Authorization` header required.

Body request example:
```javascript
{
	"first_name": "Tests",
	"last_name": "Smith",
	"password": "MyNewPassword321!",
	"email": "jd@gmail4.com"
}
```

`first_name`, `last_name`, `password`, and `email` are required.

Response example:
```javascript
{
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyOSwiaWF0IjoxNTg3NTc0NzI1LCJzdWIiOiJqZEBnbWFpbDQuY29tIn0.iALNvQvomAwiI5PIukCaGWlQwNmYSawggewR7vriiYw"
}
```

#### GET /api/users/own

Get user object associated with authToken.

Sample request url:
`GET /api/users/own`

Successful response:

```javascript
{
    "id": 1,
    "first_name": "Juan",
    "last_name": "Nunez",
    "email": "jd@choretastic.com",
    "password": "$2a$12$Gyv4dTZ5Gm3W7sSmGqjRC.dT681fbCnv3HvrtuX8eYQast4iSOL16",
    "city": "Quito",
    "supermarket_id": 1,
    "date_created": "2020-06-10T17:17:11.369Z"
}
```

#### PATCH /api/users/own

Edit user object associated with authToken.

Sample request url:
`PATCH /api/users/own`

Body request example:
```javascript
{
    "supermarket_id": "1",
    "city": "Quito"
}
```

Successful response:

```javascript
"OK"
```

### /api/supermarkets

Use this endpoint to interact with the supermarkets table.

#### GET /api/supermarkets/

Gets all supermarket objects in the database.

Response example:

```javascript
[
    {
        "id": 1,
        "supermarket_name": "Megamaxi (6 de Diciembre)",
        "supermarket_city": "Quito",
        "date_created": "2020-06-10T17:17:11.369Z"
    }
]
```

#### POST /api/supermarkets/

Add new supermarket to database.

Body request example:
```javascript
{
	"supermarket_name": "Supermaxi El Jardin",
	"supermarket_city": "Quito"
}
```

`supermarket_name`, `supermarket_city` are required.

Response example:
```javascript
{
    "id": 2,
    "supermarket_name": "Supermaxi El Jardin",
    "supermarket_city": "Quito",
    "date_created": "2020-06-14T00:18:08.516Z"
}
```

#### GET /api/supermarkets/:id

Get specific supermarket. You need an authToken to access this endpoint.

Sample request url:
`GET /api/supermarkets/1`

Response example:
```javascript
{
    "id": 1,
    "supermarket_name": "Megamaxi (6 de Diciembre)",
    "supermarket_city": "Quito",
    "date_created": "2020-06-10T17:17:11.369Z"
}
```

#### PATCH /api/supermarkets/:id

Edit a specific supermarket attribute. You'll need an authToken.

Sample request url:
`PATCH /api/supermarkets/2`

Sample body request:
```javascript
{
	"supermarket_city": "Ambato"
}
```

Successful response:
```javascript
{
    "id": 1,
    "supermarket_name": "Megamaxi (6 de Diciembre)",
    "supermarket_city": "Ambato",
    "date_created": "2020-06-10T17:17:11.369Z"
}
```


### /api/item-list

Use this endpoint to interact with the item-list table. It contains all products saved on the app database. An authTokem is needed to access any of these endpoints

#### GET /api/item-list/

Gets all item objects in the database.

Response example:

```javascript
[
    {
        "id": 1,
        "product_name": "Sausages",
        "code": "MEGA0001",
        "aisle": 2,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 2,
        "product_name": "Fruit Loops",
        "code": "MEGA0002",
        "aisle": 10,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 3,
        "product_name": "Whiskas",
        "code": "MEGA0003",
        "aisle": 5,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 4,
        "product_name": "Oranges",
        "code": "MEGA0004",
        "aisle": 4,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 5,
        "product_name": "Apples",
        "code": "MEGA0005",
        "aisle": 4,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 6,
        "product_name": "Ham",
        "code": "MEGA0006",
        "aisle": 2,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 7,
        "product_name": "Shampoo",
        "code": "MEGA0007",
        "aisle": 6,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 8,
        "product_name": "Flour",
        "code": "MEGA0008",
        "aisle": 7,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 9,
        "product_name": "Beer",
        "code": "MEGA0009",
        "aisle": 8,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 10,
        "product_name": "Ice Cream",
        "code": "MEGA0010",
        "aisle": 1,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 11,
        "product_name": "Ground Beef",
        "code": "MEGA0011",
        "aisle": 9,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 12,
        "product_name": "Chicken Drums",
        "code": "MEGA0012",
        "aisle": 9,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 13,
        "product_name": "Frozen Chicken Fingers",
        "code": "MEGA0013",
        "aisle": 1,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 14,
        "product_name": "Red Wine",
        "code": "MEGA0014",
        "aisle": 8,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    }
]
```

#### POST /api/item-list/

Add new item to database.

Body request example:
```javascript
{
	"product_name": "Cheese",
	"code": "MEGA1001",
    "aisle": 5,
    "supermarket_id": 1
}
```

`product_name`, `code`, `aisle`, `supermarket_id` are required.

Response example:
```javascript
{
    "id": 15,
    "product_name": "Cheese",
    "code": "MEGA1001",
    "aisle": 5,
    "supermarket_id": 1,
    "date_created": "2020-06-14T00:29:49.807Z"
}
```

#### GET /api/item-list/:id

Get specific item.

Sample request url:
`GET /api/item-list/1`

Response example:
```javascript
{
    "id": 1,
    "product_name": "Sausages",
    "code": "MEGA0001",
    "aisle": 2,
    "supermarket_id": 1,
    "date_created": "2020-06-10T17:17:11.369Z"
}
```

#### PATCH /api/item-list/:id

Edit a specific item's attribute. 

Sample request url:
`PATCH /api/item-list/1`

Sample body request:
```javascript
{
	"aisle": "3"
}
```

Successful response:
```javascript
{
    "id": 1,
    "product_name": "Sausages",
    "code": "MEGA0001",
    "aisle": 3,
    "supermarket_id": 1,
    "date_created": "2020-06-10T17:17:11.369Z"
}
```

### /api/auth

Authenticate existing user and get a valid token.

#### POST /api/auth/login

Sample body request:

```javascript
{
    "email": "jd@choretastic.com",
    "password": "jd-password"
}
```

Both email and password are required.

Sample response:

```javascript
{
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1OTIwOTQ5NjIsInN1YiI6ImpkQGNob3JldGFzdGljLmNvbSJ9.0O2qz5UVYhDgXYetPPzDQIldqQXFeAgqiuM42exbJ80"
}
```

### /api/shopping-list

Interact with the shopping-list table which links the users table with the items table.

#### GET /api/shopping-list/:userId

Gets all items in a user's shopping list.

Sample request url:
`GET /api/shopping-list/1`

Response example:

```javascript
[
    {
        "id": 6,
        "product_name": "Ham",
        "code": "MEGA0006",
        "aisle": 2,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 2,
        "product_name": "Fruit Loops",
        "code": "MEGA0002",
        "aisle": 10,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 4,
        "product_name": "Oranges",
        "code": "MEGA0004",
        "aisle": 4,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 3,
        "product_name": "Whiskas",
        "code": "MEGA0003",
        "aisle": 5,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 11,
        "product_name": "Ground Beef",
        "code": "MEGA0011",
        "aisle": 9,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 7,
        "product_name": "Shampoo",
        "code": "MEGA0007",
        "aisle": 6,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 8,
        "product_name": "Flour",
        "code": "MEGA0008",
        "aisle": 7,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 10,
        "product_name": "Ice Cream",
        "code": "MEGA0010",
        "aisle": 1,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    },
    {
        "id": 1,
        "product_name": "Sausages",
        "code": "MEGA0001",
        "aisle": 3,
        "supermarket_id": 1,
        "date_created": "2020-06-10T17:17:11.369Z"
    }
]
```

#### POST /api/shopping-list/:userId

Add an item to a specific user's shopping list.

Sample request url:
`POST /api/shopping-list/1`

Body request example:
```javascript
{
	"item_id": 5,
}
```

`item_id` is required.

Response example:
```javascript
{
    "id": 5,
    "code": "MEGA0005",
    "product_name": "Apples",
    "aisle": 4,
    "supermarket_id": 1,
    "date_created": "2020-06-10T17:17:11.369Z"
}
```

#### DELETE /api/shopping-list/:userId/:itemId

Delete a specific item from a user's shopping list.

Sample request url:
`DELETE /api/supermarkets/1/5`

Response example:
```javascript
"OK"
```

#### PATCH /api/shopping-list/:userId/:itemId

Edit a specific item from the shopping list.

Sample request url:
`PATCH /api/supermarkets/1/1`

Sample body request:
```javascript
{
	"status": "complete"
}
```

Successful response:
```javascript
{
    "user_id": 1,
    "item_id": 1,
    "date_added": "2020-06-13T22:58:25.181Z",
    "status": "complete"
}
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.