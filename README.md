# Liquify

**Link to Live Site:** [Liquify](https://liquify.sokhunseng.com)

**Contributors:**
Sokhun Seng, Setya Seng, Cristine Shipman

**Technologies, Frameworks and Programming Languages:**
MongoDb, Redis, Express, EJS, Javascript, jQuery, HTML5, CSS3

**Overview of Project:**
Everyone has heard the advice, "Drink eight 8-ounce glasses of water a day." Liquify allows users to track their water intake on a daily basis to meet this goal. The user is also given a weekly overview of their progress.

> What gets measured, gets managed.
> - Peter Drucker

![Login](https://github.com/sososeng/Thirst_Keeper/blob/master/public/images/login.png)
![Status](https://github.com/sososeng/Thirst_Keeper/blob/master/public/images/today.png)




**Features:**
* User can track how many 8 oz. glasses of water they drink per day (the goal is to hit 8 glasses).
* Status page that shows a week of user history
- - - -

**Challenges faced & solutions used:**

1. One of the earliest challenges the team faced was connecting the front-end to the backend. We started off using handlebars until we realized we were not able to use the logic we needed. The problem was, if a user drank 3 cups, left the app, and then came back to log in more cups, how do we make sure the cups stay at 3 and do not refresh. We needed to implement if statements in the html. To do this we switched to EJS.

2. Each user has a different time zone. To keep track of the users time zone we implemented JavaScript in the front-end to send the user UTC offset to the server after the user logs in.

3. We had to test multiple libraries to get our graph to show correct information for the status page. We also needed a framework that allowed us to change the background color to match our color scheme. We ended up using Chart JS.

- - - -


**MVP and Stretch Goals:**

**MVP (Minimum Viable Product)**

* Build an application that allows users to track their daily water intake by 8oz glasses.
* Store number of glasses per day for a week so that users can see their weekly progress.

**Stretch Goals**

* Use react to make application more responsive.
* Finish the push notification functionality for sending user reminders to drink water.
* Implement forget password functionality that allows the user to reset password.

**Contribution we'd like to be added**

* Allow users to see their stats for a whole month.
* Allow users to change their daily water intake goal by increasing oz or cups per day.
