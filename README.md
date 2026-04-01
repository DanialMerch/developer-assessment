## Frontend Assessment

This shows how to run the project, why I did what I did and what I could have done if I had more time.

## Setup Instructions

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The link to the live deployment is:


## Architectual Decisions

I went with a modern style layout for the Dashboard KPIs as well as a list form as in my opinion I wanted the data to not feel overwhelming and easy on the eye at first glance. I also wanted the UX to feel userfriendly with the sidebar. I am happy with the color scheme and my decision for light and dark mode. and the mobile mode feels user friendly and responsive. I added as many subtle animations as I could think of on the spot.

## If I had more time

If I had more time I would have liked to fine tune the charts a bit to feel more alive and interesting. I would have done that by adding more animations on clicks etc. I would also have implemented caching based on the size of the database so that it does not refetch on every page load. I would have a manual refresh button and a timed refresh (every minute or so) so that data is reletively fresh but not overwhelmed especially when there are a large amount of users active on the dashboard. Since this is mock data most of the server side fetching and client side serving does not really matter here but hooks like use memo, use state and use effect would be effecient for reducing fetch load and improve quality of the user experiance. I would also improve the date filter for desktop and mobile. I would also make the sidebar collapsable so that the whole screen can just show the specific page.