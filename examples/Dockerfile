FROM ubuntu
MAINTAINER Yosuke FURUKAWA

# make apt-get latest and install curl and git
RUN apt-get update
RUN apt-get install -y --force-yes curl git

# install nodebrew
RUN curl -L git.io/nodebrew | perl - setup
ENV PATH $HOME/.nodebrew/current/bin:$PATH
RUN nodebrew install-binary latest
RUN nodebrew use latest
RUN node -v

# ADD src
ADD . /src

RUN cd /src; npm install

EXPOSE 3000

CMD ["node", "--harmony", "/src/app.js"]

