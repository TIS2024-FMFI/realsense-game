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

A demo game using RealSense depth camera d455

# Wallhit Application Solution

## Projects
- **Wallhit_Calibration**: A calibration application.
- **Wallhit_Detection**: An application that generates data about the ball's contact with the wall using a virtual keyboard.

---

## Data Format
#255,300,0.18343,-1.4345,1.90548,-0.00004*

### Meaning of Each Part
- `#`: Start of the transmission.
- **1st argument**: X-coordinate.
- **2nd argument**: Y-coordinate.
- **3rd argument**: Speed.
- **4th-6th arguments**: Parameters `a`, `b`, and `c` of the parabola calculated from the y and z axes.
- **7th argument**: Offset on the X-coordinate (indicates the ball's direction to the right/left before impact).
- `*`: End of the transmission.

---

## Prerequisites
Before running the project, configure the required libraries and set the paths to `.dll`, `.libs`, and include files.

### Required Libraries
- **NlohmannJSON**: Available on [GitHub](https://github.com/nlohmann/json).
- **OpenCV**: Available online. [OpenCV](https://opencv.org/releases/).
- **RealSense**: Camera API available on the manufacturer's website. [Intel Realsense](https://www.intelrealsense.com/sdk-2/).
- **gldw**: OpenGL library, available online. [GLDW](https://www.glfw.org)

---

## Configuration Options

### Option 1: Using `.props` Files
- Locate the `.props` file in the projects where library paths are set.
- Download and install the necessary files.
- Update the `$(KVANT_DEPENDENCIES_DIR)` variable to the actual path on your computer.
- **Note**: The pre-configured `.props` file may be outdated.

### Option 2: Manual Configuration
- Open the solution in your IDE.
- In the **Properties** of each project, manually set the paths to the required files.
- After configuration, the project should build successfully.

---

## Paths for Prerequisites

### **Wallhit_Calibration**

#### C++ Include Paths
- `\opencv\build\include`
- `\opencv\build\include\opencv2`
- `\Intel_RealSense_SDK_2.0\include`
- `\json\include`

#### Linker Paths
- `\opencv\build\x64\vc16\lib`
- `\Intel_RealSense_SDK_2.0\lib\x64`

---

### **Wallhit_Detection**

#### C++ Include Paths
- `\json\include`
- `\Intel_RealSense_SDK_2.0\include`
- `\opencv\build\include\opencv2`
- `\opencv\build\include`

#### Linker Paths
- `\Intel_RealSense_SDK_2.0\lib\x64`
- `\opencv\build\x64\vc16\lib`



# Authors

This project was created in collaboration with KVANT and a team of students. 
