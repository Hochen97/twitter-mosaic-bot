# Twitter Mosaic Bot
A twitter bot with a web-facing user interface that parses the twitter stream for images with a defined query

1. Installation Instructions
    1. Install Node.js & NPM from `https://nodejs.org/en/`.
    2. Clone the repository.
    3. cd into the directory and run `npm install`.
    4. install nodemon globally by running `npm i -g nodemon` (For development purposes).
    5. install PM2 for node application management using `npm i -g pm2`.
    6. install mysql for storage of links to retrieved media. `https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-16-04`
2. DB Setup
    1. Create the database `twitter_bot`
    2. Create the table `tb_twitter_pictures`
        1. The table should have the following columns
            1. TwitterUsername: varchar 255
            2. TwitterPicURL: varchar 255
            3. TweetURL: varchar 255
            4. ApprovedPic: bool default value 0
2. Run instructions
    1. Start the mysql db
    2. Development
        1. run the application from the directory using `nodemon .`.
    3. Production
        1. run the application on the desired server using the command `pm2 start $projectDir/bin/www --name twitter-mosaic`.
