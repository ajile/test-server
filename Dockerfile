FROM node:7.4.0

WORKDIR /usr/src/app

# Installing Yarn
RUN apt-get update && apt-get install apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install yarn

# Installing global Node dependencies
RUN npm i --silent -g babel-cli && \
    npm i --silent -g forever

# Installing project's Node dependencies
COPY package.json /usr/src/app
RUN yarn

# Installing project's Bower dependencies
COPY bower.json /usr/src/app
RUN bower i --allow-root

# Getting project files
COPY . /usr/src/app

# Running tests
CMD npm start
