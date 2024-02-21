# Full stack Typescript hiring test

## Setup

```
#Backend
cd ./be
npm install
npm run data:sync
npm run start

#Frontend
cd ./fe
npm install
npm run dev

Open browser on http://localhost:3000/
Enjoy
```

## Approach
### Backend

- Made use of TypeOrm (on sqlite)
- Made use of GraphQl
- Travels query use pagination
- To broadcast changes to travel availability we use grpaqhl subscription on ws
- To avoid overbooking we bind to open and closed carts to compute current available seats before any update on db, this could still lead to overbooking problematics because of missing of atomic operation, in a rel env this could be solved with transaction


### Frontend

- Make use of mitt to push notification between components
- Using plain tailwind except for daisyui used to show travel experience with a circular spinner


### Problem
- Since I was new with nuxt3 i'm not able to make graphql subscription working, I see connection to ws but noway to get update, probably I choose a slight buggy apollo lib
- Project structure in nuxt probably not stick to best practice



