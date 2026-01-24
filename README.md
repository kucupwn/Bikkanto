# Bikkanto

This webapp's primary purpose is creating workouts, based on the exercises uploaded by user. Every user has their own exercises tables, tailored to their own levels.

## How to use

At first, the user must create an account.

Once done, on Exercises page categories must be created, like push up, pull up, handstand etc. After this, new exercises can be added on the same page, like diamond push up, archer push up etc. Added exercises can be modified or deleted too (be careful with both addition and deletion, since exercise name cannot be modified after created, and deleted exercise's rows is ereased from history table, if already exists).

Workout can be created on Roll page. Input exercise count, and pick exercise repetition count difficulty (difficulty intervals based on exercises table repetiton counts). The user need to pick category and difficulty for each row, based on their current needs. Random exercises will be rolled from exercises table, based on input category and difficulty. Get button shows a summary table of the workout, which the user can accept or restart the roll. If user logs out, or navigates to other page, the applied workout can be called back for save. After the workout is done, the user can input the finished cycles count.

Finished workouts are saved to history table, which is located on History page.

## Unfinished features

- Help page
- Forgot password
- History statistics
- Deploy on home server
- Code comments
- Code tests

## Developer notes

This is clearly an unfinished project, yet at this stage it can do everything I wanted.

Beside its functionalities, I wanted a project that helps me come back to Typescript. While I was in the middle of the development, I started to learn React. It was the point where I lost most of my motivation to finish this project, since I realized how hard it is to create frontend with vanilla Typescript compared to React.

Some day I might come back to this project to rework the frontend part with React, but right now I am happy that it works, despite the code is inconsistent and requires refactor on most parts.
