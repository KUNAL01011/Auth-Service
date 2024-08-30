# STEPS TO CREATE THIS SERVICE

npm init -y

## Dependency
npm i express mongoose cookie-parser mailtrap bcryptjs dotenv jsonwebtoken crypto

## Dev Dependency 
npm i nodemon -D


1. create the server by the help of express.js
2. make a connection to the database
3. make a default setup of mvc arch

## Authentication

1. create the user model
2. create the signup controller
    1. hashing the password
    2. generate the cookie and set the cookie
    3. sending the mail to activate the account
3. create the logout controller
    - simple delete the jwt cookie form the client
4. create the signin controller
    - take the email and password check if correct then login and if not return error msg
5. create forgot password controller
    - first redirect the forgot page and take the email
    - if email exist than generate the random link by using crypto pakeage
    - and send the link by a mail 
    - if user click on the reset password this will redirect to reset page
    - take the link and match if corrent the generate new password
    - and save that password and return to the user
6. create a get user profile controller
7. create a middleware that check the cookie is valid or not if not then send invalid user

## Note : Sending Mail By Nodemailer 
- we need something called a email address or password 
- steps to generate new password 
    1. login to your email account 
    2. enable the two factor authentication
    3. click on the security button and search the app password
    4. In the drop down menu select the other custom name and give the name nodemailler and click generate
    5. copy the password and paste into your env the password look like this : akds slkd slkd lied
    
## Note 2 : What is nodemailer

nodemailer is a node pakeage that use to send the mail 
- setup the transport that given by the nodemailer 
- transport is a service that use the smtp protocol to send the mail


# STEPS TO CREATE AUTH SERVICE FRONTEND

1. initialize the react app by this commond : npm create vite@latest ./
2. install tailwind css and configure it.
3. React-Router-Dom : for nevigation
4. Framer-motion : Animation
