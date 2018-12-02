# Matcha

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/806e5df34d2c4ca6bac52a06b0b54bbd)](https://app.codacy.com/app/gde-pass/Matcha?utm_source=github.com&utm_medium=referral&utm_content=gde-pass/Matcha&utm_campaign=Badge_Grade_Dashboard)

## Introduction

This project is about creating a dating website.
You will need to create an app allowing two potential lovers to meet, from the registration to the final encounter.

A user will then be able to register, connect, fill his/her profile, search and look into
the profile of other users, like them, chat with those that “liked” back.

## General Instructions

* For this project you are free to use the language you want.

* You can use micro-frameworks, and all the libraries in the world for this project.

* We will consider that a “micro-framework” has a router, and eventually templating,
but no ORM, validators or User Accounts Manager.
As long as you respect these constraints you are free to use what you like.

* If you need some inspirations, we will suggest as main languages:
  * Sinatra for Ruby.
  * Express for Node (yes, we consider this to be micro framwork).
  * Flask for Python.
  * Scalatra for Scala.
  * Slim for PHP (Silex is not authorized because of doctrine integration).
  * Nickel for Rust.
  * Goji for Golang.
  * Spark for Java.
  * Crow for C++.

* You’re free to use the web server you like most may it be Apache, Nginx or a built-in web server.

* Your whole app must be compatible at least with Firefox (>= 41) and Chrome (>= 46).

* Your website must have a decent layout: at least a header, a main section and a footer.

* Your website must be usable on a mobile phone and keep an acceptable layout on small resolutions

* All your forms must have correct validations and the whole website must be secure.
This part is mandatory and will be checked extensively in defense.
To give you an idea, here are a few elements that are not considered secure:
  * To have a “plain text” password stored in your database.
  * To be able to inject HTML of “user” Javascript code in unprotected variables.
  * To be able to upload unwanted content.
  * To be able to alter a SQL request.


# Mandatory part

You will need to create a Web App with the following features:

##  Registration and Signing-in

The app must allow a user to register asking at least an email address, a username, a last name, a first name and a password that is somehow protected. After the registration, an e-mail with an unique link must be sent to the registered user to verify his account.

The user must then be able to connect with his/her username and password. He/She must be able to receive an email allowing him/her to re-initialize his/her password should the first one be forgotten and disconnect with 1 click from any pages on the site.

## User profile

* Once connected, a user must fill his or her profile, adding the following information:
  * The gender.
  * Sexual preferences.
  * A biography.
  * A list of interests with tags (ex: #vegan, #geek, #piercing etc...). These tags must be reusable.
  * Pictures, max 5, including 1 as profile picture.
  * At any time, the user must be able to modify these information, as well as the last name, first name and email address.
  * The user must be able to check who looked at his/her profile as well as who “liked”
him/her.
  * The user must have a public “fame rating”.
  * The user must be located using GPS positionning, up to his/her neighborhood. If the user does not want to be positionned, you must find a way to locate him/her even without his/her knowledge. The user must be able to modify his/her GPS
position in his/her profile.


## Browsing

The user must be able to easily get a list of suggestions that match his/her profile.

* You will only propose “interesting” profiles for example, only men for a heterosexual girls. You must manage bisexuality. If the orientation isn’t specified, the user will
be considered bi-sexual.

* You must cleverly match3 profiles:
  * Same geographic area as the user.
  * With a maximum of common tags.
  * With a maximum “fame rating”.
* You must show in priority people from the same geographical area.
* The list must be sortable by age, location, “fame rating” and common tags.
* The list must be filterable by age, location, “fame rating” and common tags.

## Research

The user must be able to run an advanced research selecting one or a few critters as such as:

* A age gap.
* A “fame rating” gap.
* A location.
* One or multiple interests tags.

As per the suggestion list, the resulting list must be sortable and filterable by age, location, “fame rating” and tags.

## Profile of other users

A user must be able to consult the profile of other users. Profiles must contain all the information available about them, except for the email address and the password.
When a user consults a profile, it must appear in his/her visit history.

The user must also be able to:

* If he has at least one picture “like” another user. When two people “like” each other, we will say that they are “connected” and are now able to chat. If the current user
does not have a picture, he/she cannot complete this action.

* Check the “fame rating”.
* See if the user is online, and if not see the date and time of the last connection.
* Report the user as a “fake account”.
* Block the user. A blocked user won’t appear anymore in the research results and won’t generate additional notifications.
A user can clearly see if the consulted profile is connected or “like” his/her profile and
must be able to “unlike” or be disconnected from that profile.

## Chat

When two users are connected, they must be able to “chat” in real time. How you will implement the chat is totally up to you. The user must be able to see from any page if
a new message is received.

## Notifications

A user must be notified in real time6 of the following events:

* The user received a “like”.
* The user’s profile has been checked.
* The user received a message.
* A “liked” user “liked” back.
* A connected user “unliked” you.

A user must be able to see, from any page that a notification hasn’t been read.

## Bonus part

We will look at your bonus part if and only if your mandatory part is EXCELLENT.
This means that your must complete the mandatory part, beginning to end, and your error management needs to be flawless, even in cases of twisted or bad usage. If that’s
not the case, your bonuses will be totally IGNORED.
They will be evaluated to the discretion of your correctors. You must however respect basic constraints.
If you need inspiration here are some ideas:

* Add Omniauth strategies for the connection.
* Import pictures from Facebook and/or Google+.
* Create an interactive map of the users (which implies a more precise GPS localisation via JavaScript).

### Eliminatory instructions

* Your code cannot produce any errors, warnings or notices either from the server or the client side in the web console.
* Anything not specifically authorized is forbidden.
* Finally, the slightest security breach will give you 0. You must at least manage what is indicated in the general instructions, ie NOT have plain text passwords
stored in your database, be protected against SQL injections, and have a validation
of all the forms and upload.

# Installation

1. Install and update [HomeBrew](https://brew.sh/)
    
    ```bash
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" && brew update
    ```

2. Install [docker](https://www.docker.com/) and [docker-machine](https://docs.docker.com/machine/) via HomeBrew
    
    ```bash
    brew install docker docker-machine
    ```

3. Clone or download/extract the project repository
    
    ```bash
    git clone https://github.com/gde-pass/Matcha.git && cd Matcha/Docker
    ```

4. Create and start a docker-machine
    
    ```bash
    docker-machine create Matcha && docker-machine start Matcha
    ```

5. Link your environment 

    ```bash
    eval $(docker-machine env Matcha)   
    ```

6. Execute the [docker-compose](https://docs.docker.com/compose/) file in the Docker folder
    
    ```bash
    docker-compose up -e COMPOSE_TLS_VERSION=TLSv1_2 --build 
    ```

7. Start the node server locate in `Matcha/app/config/server.js`

    ```bash
    node server.js
    ```

8. Here we go ! You can now visit [Matcha](http://127.0.0.1:8080) !

## Difficulty

This project is evaluated as a **T2**.
