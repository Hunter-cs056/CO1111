Testing Page
Rules :First testing is conducted,if a bug/problem occurs perform debugging ,then test again to make sure the problem is solved

Testing efforts:

1.After completing the main core gameplay/API calls,I  performed testing to make sure everything works as expected. Using the black box texting aproach I found out that the submit/skip button can be abused/spammed to alter the score of the player. In order to solve this problem, I added helper functions that disable the submit/skip buttons after an answer is submitted/skipped so the user cannot exploit the score system.
