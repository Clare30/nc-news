# Northcoders News API

## Intro 

This project was created using express & PostgreSQL to provide access to articles, users and comments, hosted on Heroku here: https://git.heroku.com/nc-news-cm.git


## Setup

To clone this project, type the following command into your terminal: git clone https://github.com/Clare30/nc-news.git

After cloning, run npm install to install the dependancies

To set up the environment variables, create 2 .env files: .env.test & .env.development. Inside these files, add the correct database name to each file. 
* Test db: PGDATABASE=nc_news_test 
* Development db: PGDATABASE=nc_news


## Endpoints available: 

- /api - see example results for each api using this path or viewing the endpoints.json file
- /api/topics
- /api/articles
- /api/articles/:article_id
- /api/users
- /api/articles/:article_id/comments
- /api/articles/:article_id
- /api/articles/:article_id/comments
- /api/comments/:comment_id

## Requirements

* Node v16.13.2
* Postgres 12.9