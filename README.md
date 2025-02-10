# realsense-game
# Project Description

This web application is an educational game focused on waste sorting. It utilizes a RealSense camera and a projector for interactive gameplay. Players throw a ball at projected containers and earn points based on the correctness of their choice.

# Requirements

- Phaser.js (game framework)

- Git (for cloning the repository)

- Web Browser (Chrome or Firefox recommended)

# Installation

Clone the repository:
```sh
git clone <repository_URL>
cd <project_name>
```

Install Phaser.js:
Add this script tag to index.html:
```sh
<script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.2/phaser.min.js"></script>
```
Open index.html in a browser.

# Game Configuration

Before starting the game, players can adjust:

- Game language (e.g., Slovak, English)

- Number of players (1 or 2)

- Difficulty level (easy, medium, hard)

# Game Mechanics

The player throws a ball toward the projected containers.

If they hit the correct container, they earn points:

+10 points for a correct throw

-5 points for an incorrect choice

The game lasts 2 minutes.

At the end, the score is displayed, and in case of two players, the winner is announced.

# Attachments

Images are stored in the /images folder and sounds are stored in /sounds folder.

# Authors

This project was created in collaboration with KVANT and a team of students. 