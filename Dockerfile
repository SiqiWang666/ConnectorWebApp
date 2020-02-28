# Specify a base image
FROM node:alpine

WORKDIR /usr/spp
# Install depenendencies
COPY ./package.json ./
RUN npm install
COPY ./ ./
# Default command

CMD ["npm", "run", "dev"]