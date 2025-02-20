# Timer App Assignment

Steps to run the web application

1. git clone https://github.com/anushka3002/timer-main.git
2. npm i
3. npm run dev

Changes made:

1. Modified UI

2. Updated the app to allow multiple timers to run simultaneously

3. The notification sound will keep playing until the snack bar is dismissed.

4. Resolved the console error that occurs when the snack bar's dismiss button is clicked.

5. Extract the buttons in the Add/Edit Timer Modal as a separate reusable component.

6. Refactored the code to use a single modal component for both adding and editing timers, eliminating duplication.

7. Currently, the Submit button was disabled when the form is invalid. Now I am showing an error snack bar or notification when the form is submitted with invalid data.

8. For desktop devices: Displaying snack bars in the top-right corner.
For mobile devices: Displaying snack bars at the bottom of the screen.

9. Added unit tests for the validation.ts file to ensure all validation rules work as expected.

10. Used localStorage to persist timers across page refreshes.