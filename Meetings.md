###HERE WE WILL DISCUSS OUR MEETINGS
Each Meeting will include:
Date/Time
Participants
Location
Topic of the meeting
Progress until now
Tasks for next time
General notes/issues


##OUR FIRST MEETING:

05/02/2026 Thursday 13:00pm
Participants: Maximos, Rania, Alex, Rudolf, George
Location: Library
Topic: Assign duties to each member and Structure the Layout of the project
Discussions:
The project will have for the Landing Page(html,js,css) and the App page(html,js,css)
1.**Maximos** will start the html and the js of the App page(app.html)
2.**Rudolf** will complete maximos js for the App page(app.html)
3.**Alexandra** will start the html of the landing page(index.html)
4.**Rania** and george will start the css for both of the pages and 
For now we create the layout and later we customize it


##OUR SECOND MEETING:
12/02/2026 Thursday 13:00pm
Participants: Maximos, Rania, Rudolf, George,Alexandra is missing
Location: Library
Topic: App functionality and Design
Discussions:
Maximos suggested the use of buttons instead of radio buttons when answering boolean
or Multiple Choice answers.The reason behind this is to make the app more convenient
to the user since radio buttons would require the user to tap once to select the answer
and tap again to submit it while the button tap will instantly submit the answer.This wil
be convenient to the mobile users who want to use the app with just 1 hand and answer questions
using their thumb.
Another topic discussed was if the share Location button should exist or a pop up
would just appear when the question requiring geolocation loads.In conclusion 
we kept share location as a button for user convenience(for example if the user
accidentally presses deny, page refresh is not a good option, while repressing
the button is more convenient)

##OUR THIRD MEETING:
19/02/2026 Thursday 13:15pm
Participants: Maximos, Rania, Alex, Rudolf, George
Location: Library
Topic: App functionality and Design
Discussions:
1.Right now the app is using a random Player Name to call the API , Alex will have to create a Modal(pop-up text input)
in order for the user to enter a username. The username has to be valid and that is going to be checked by calling the /start API 
and checking just the errorMessages and status.ERROR.
2.Now The core gameplay is complete, all its left is for Rudolf to use the /leaderBoard API and create the leaderBoard
3.**George** will work to create a back to top button on the landing Page and add a back to homepage button on the app page and 
do a small research on the loading animations
4.**Maximos** will work to fix the score bug since the core gameplay is already done and try to improve the question loading 
for example making the input/Choice option disappear when the user presses submit. I will also work on fixing other bugs
involing the submit and skip button.Maximos will also work on applying cookies to our website
5.**Rania** will work on the class worksheet 18 in order to work on making our app downloadable on mobile and pc devices

##OUR FOURTH MEETING:
05/03/2026 Thursday 4:17pm
Participants: Maximos, Rania, Alex, Rudolf, George
Location: Library
Topic: App functionality and Design 
Discussions:
Goals Accomplished from last week:
1.**George** Created logo link buttons at the end of our index.html page, while customizing the start game button
2.**Alex** created and designed a Modal that now lets the user enter a username and that user-name it is used to call the API instead of using
a random one.
3.**Rania** made our app available for download on every device while also contributing to the design of the app.html
4.**Rudolf** completed the leaderboard API call and with Maximos they resolved its issues making it ready to use 
5.**Maximos** created the test.html and added instructions and an example for everyone to read and understand how to conduct testing
thrpough the rest of the functions
Goals for the upcoming Week
1.**George** will work on fixing the back to top button making it easer to access, while fixing the sizes and the placements of the start
and info /buttons both in their regular form and in their burger button form.
2.**Rudolf**  will work on creating a modal for the leaderboard while as well fixing the playerName issue 
3.**Alex** AND **George** will be responsible for Utilizing  the test.html to  test the rest of the js functions using the example 
I already provided them with
4.**Rania** will  work on designing the TreasureHunt lists/Questions/Answers/SKIP/SUBMIT buttons.
5.**Maximos** will work on fixing the MCQ and BOOL question submit buttons, so when spammed they do not exploit the score.Also
I will be adding new content on our social platforms in order to create posts to embed into our index.html

##OUR FIFTH MEETING:
14/03/2026 Friday 1:15pm
Participants: Maximos, Rania, Alex, Rudolf, George, Georgios(communication via Email)
Location: Library
Topic: Application final touches
Goals Accomplished from last weeks
1.**George** fixed the button sizes and designed the buttons of the landing page while also completing the /list testing
2.**Rudolf** Along with in-class guidance from the professor, fixed the leaderboard's name problem making it fully working
3.**Alex** contributed to the test.html completing /start, /question
4.**Maximos** Created social media for the team in Instagram/Facebook/X/YOUTUBE
5.**Rania** made the app downloadable while connecting the social media with the website
`Goals for the upcoming week:`
1.**Alex** will work on making the leaderboard a modal and then designing it
2.**Maximos** will design and  create social posts to be added to the landing page, design and organise the test.html
page, make the location retriever inside the app page to be updating automatically every 30 seconds.
3.**George** Will embed social media created into our landing page and work on providing a visual example of the 
test he made for example /lists by looking at the app.js and calling the API with the same way but using the 
test-api (link inside description on top of test.html).
4.**Rania** AND **Maximos** will make our page accept cookies in order to store the sessionId of the started treasureHunt game and then,
make small adjustments to the app.js to make the game look for the saved SessionId inside the cookie before creating one,
so that later we can save our in-game progress (max 30 minutes after the start of the game) so even when refreshed or 
when the browser is closed, we can continue where we left off.
5.**Georgios Kurtezof** After reading my instructions at the top of the html page and following previous examples
on test.html , will work on creating the test for /answer and /score. Then after looking at the app.js and calling
the API with the same way but using the test-api (link inside description on top of test.html), create the visual examples
of each one.Reminder: Any js will be written inside the <script></script> brackets inside the test.html, not on another
file, look at the previous examples.
6.**Rudolf** will create the visual example of the /leaderboard test inside test.html(the code-part is already done)
by looking at the app.js and calling the API with the same way but using the test-api
(link inside description on top of test.html).

##OUR SIXTH MEETING:
27/03/2026 Friday 1:15pm
Participants: Maximos, Rania, Alex, Rudolf, George,
Location: Uni Cafeteria
Topic: THhe final touches to complete the project
Goals Accomplished from last weeks:
1.**Maximos** Added a QR code scanner to the project, added cookies and a resume session modal
, and added a final leaderboard to the app,overall improved the functionality  and the flow of the
game by applying visibility states to buttons and sections so they appear only when needed.Also added a play again button
2.**Alex** Updated the leaderboard modal
3.**Rania** and  **Alex** and **George**: Reconstructed the css for both the index and app pages
4.**George** ended up completing the rest of the Unit test along with the visual examples
***GOALS TO COMPLETE THE PROJECT***
1.**Maximos** will make the location update every 30 seconds from the start of the TrHunt and also make the status of 
the questions remaining available to the user
2.**Rania** will adjust the about us section inside the landing page to include a list with our names and 
responsibilities for the project, and then keep a small brief description of who we are on top of the list. Additionally,
she will fix the TresureHunt list, so each treasureHunt is displayed one under the other. Also on the leaderboard Modal,
the close button is to dark and not visible, it should be adjusted to become more visible.
3.**George** will have to style  the test.html page divide into 3 sections:
(1) Unit testing section(already done) - table
(2) Nielson's 10 Usability Heuristics for User Interface Design(*Rudolf* will do it)  - table 
(3)User Acceptance(*Alex* will do it) - table 
The page when loaded, should/could Have a TreasureHunt Title testing on top and then under it 3 the Modal sections:
The 3 buttons should always be visible at the top middle under the title, and only one section should be shown 
each time. For example if the user pressed to see the section 1, The section one covers the entire screen(does not need
to be a pop-up window) while the others are not visible.
4.**Alex** after george provides you with your own modal section to work on, you will have to create the User Acceptance
table. The user acceptance table should include least 10 people(friends-family-classmates) who played the app, and each one,
tested a different feature on our app and provided information about their satisfaction(satisfied/dissatisfied).For example
one user should test the submit/ skip buttons, another user has to try the leaderboard modal, another user the back to homepage
button and so on until all features are covered
5.**Rudolf** after george provides you with your own modal section to work on you will have to create a table for Nielsen's
10 Usability Heuristics for the UI. On this link you will find the official ones listed:
https://www.nngroup.com/articles/ten-usability-heuristics/ 
After including each one, then you will just say for each one if is satisfied/dissatisfied by our application.

##OUR SEVENTH-FINAL MEETING:
31/03/2026 Tuesday 2:16pm
Participants: Maximos, Rania, Alex, Rudolf, George,
Location: Online
Topic Submission:
All goals from last weeks have been accomplished, the project is ready for submission and aims for 100% and beyond marking!!
Congrats to all team members!














