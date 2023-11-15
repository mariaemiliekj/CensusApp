# Census Application Installation and Usage Instructions

### This guide provides step-by-step instructions on how to set up and run the Census application. Follow these steps to get it up and running on your local machine for development and testing purposes.


### Installation
Follow these steps to set up the Census application:

1. **Clone the Repository**
   - Clone the project repository to your local machine by running:
     ```
     git clone <https://github.com/mariaemiliekj/CensusApp.git>
     ```
   - Alternatively, download the zip file from the repository.

2. **Install Dependencies**
   - Navigate to the project directory in your terminal and run:
     ```
     npm install
     ```

3. **Configure Environment Variables**
   - Create a `.env` file in the root directory of the project. Add the necessary environment variables as shown in the `.env example` section.

### Running the Application
- Start the server by running:
     ```
     npm start
     ```

- Access the server at the link provided by Cyclic.sh.
- You can also try the application locally with postman.


# hosted app on Cyclic.sh
https://odd-jade-pig-robe.cyclic.app/

# Environment Variables
The following environment variables are required for the application to run properly, set in a `.env` file in the project's root directory.

```ini
.env

CYCLIC_DB= "odd-jade-pig-robeCyclicDB"
AWS_REGION="eu-north-1"
AWS_ACCESS_KEY_ID="ASIAUPH2OSAEAD75KVWI"
AWS_SECRET_ACCESS_KEY="qNXR2MQ6WbCIkXn+7TnO22x345+FRGQyFbwVpqJB"
AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEC8aCXVzLWVhc3QtMiJHMEUCIQCX/De40pyXQ0Ch01SD16Pt0X3r5Gtj5NIdsV/ejUm6/QIgPA2oXOVzaQt3W6YreJVmWln6qY27z4//hcd4kyMVEJgqqwIIeRAAGgwzMDc2MTU0MDQwNDAiDKAsrvJzHGC/VoK81CqIAjt97gta/uMUo+WYMNSy7amqor3+yxzN5OUuu+Xwc7VPHEPg6Ml57XaqffRSQVgg7znRoNiH+CdQ3YWx6q8domwuAu2OD3UV1rV1NQ8dAbvTI7cz9A1EUdUS9zc9UhNBbt5xDs/Wiy5lgiDd4FHXSlhn0hqLcOgdLnWUGnFoeFekea4CBnIdqJFQV/dS0VhUlDLHt0tsuPYEfxfkRqBRckcX7UBcvfFmCE1wP17G8OVAdSy9vjJBoNKiTYEnJCOkzG301BGX1U1kkTpPp4umI8pWOk6lfLtdUXvwiSchUiRvOrPMhARBpn7Uh9y1gqDGCjOSR2X6kZlgrQjupDF8/PMUVkZjoavliDD8xdOqBjqdAa6sC1qCpNqiEZvuaE2pu0E0XQFJYp/Kz1uCxmHbhXnQfiCqVLOB2Coc695ISIOv1mD5pWP5nayBv6+4+K9QN0wbKpzNi6J+Jij6S90cd+2+27kj2CVXe2M81FcNWn2raDcMl4BLflfxYqO85wvgW7UpSfWIDJyiopy/76bnXOEbqFqvnoDfRPVFF2k5XYGDtRuIMT2BHf1amkgCSAA="
```


# Additional Libraries/Packages
No additional libraries or packages are necessary. Use `npm install` to install dependencies.


