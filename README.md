# Intro
This is a [social website](https://tranquil-oasis-78458.herokuapp.com/) for software engineers to connect with each other.
## Folder Structure
    .
    ├── client                    # Source files of React front-end
    ├── config                    # Config files
    ├── middleware                # Middle authentication
    ├── models                    # Define data models
    ├── routes/api                # Source files of Express back-end
    ├── package.json              # Dependencies for project
    ├── package-lock.json
    ├── server.js
    └── README.md

# Tech Stack
- Front end: React, React-Redux
- Back end: NodeJS, Express
- Database: MongoDB Atlas
- Deployment: Heroku, Docker

# Quick Start
- Check out website 
- Download Docker Image. Note: map local port to container’s port
- If you clone this repo, remember to install all the dependencies `npm install`.

# Functionalities
User profile (create, update, read, delete), Display user github repo(3rd party API), avatar(3rd part API)
Posts, comments, likes
Security, Private Route