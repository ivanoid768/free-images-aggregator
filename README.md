# Free images aggregator

## Node js aggregator app that lets user to search and get images on specific theme via REST API from most popular free image stocks.

# Stocks:

* [Unsplash](https://www.unsplash.com)
* [Pexels](https://www.pexels.com)
* [Pixabay](https://www.pixabay.com)

# Installation

* Git client and Docker must be installed
* Clone the project via git and open terminal in project's main directory
* Create start.sh and compose.sh files
* Edit them add your ENV vars like in example-start.sh and example-compose.sh
* Execute compose.sh
* Send requests to [yourdomain].com:4000

## Usage
* Send POST to http(s)://[yourdomain].com:4000/admin/usertoken to issue token for user's requests. body.password must be equal to ADMIN_PASSWORD env.
* Send GET to http(s)://[yourdomain].com:4000/images?page=1&search=someword to get images. Authentication header must be equal to user's token.
