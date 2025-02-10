Wallhit Application Solution

Projects:
- Wallhit_Calibration: A calibration application.
- Wallhit_Detection: An application that generates data about the ball's contact with the wall using a virtual keyboard.

---

Data Format:
#255,300,0.18343,-1.4345,1.90548,-0.00004*

Meaning of Each Part:
- #: Start of the transmission.
- 1st argument: X-coordinate.
- 2nd argument: Y-coordinate.
- 3rd argument: Speed.
- 4th-6th arguments: Parameters a, b, and c of the parabola calculated from the y and z axes.
- 7th argument: Offset on the X-coordinate (indicates the ball's direction to the right/left before impact).
- *: End of the transmission.

---

Prerequisites:
Before running the project, configure the required libraries and set the paths to .dll, .libs, and include files.

Required Libraries:
- NlohmannJSON: Available on GitHub.
- OpenCV: Available online.
- RealSense: Camera API available on the manufacturer's website.
- gldw: OpenGL library, available online.

---

Configuration Options:

Option 1: Using .props Files
- Locate the .props file in the projects where library paths are set.
- Download and install the necessary files.
- Update the $(KVANT_DEPENDENCIES_DIR) variable to the actual path on your computer.
- Note: The pre-configured .props file may be outdated.

Option 2: Manual Configuration
- Open the solution in your IDE.
- In the Properties of each project, manually set the paths to the required files.
- After configuration, the project should build successfully.

---

Paths for Prerequisites:

Wallhit_Calibration:

C++ Include Paths:
- \opencv\build\include
- \opencv\build\include\opencv2
- \Intel_RealSense_SDK_2.0\include
- \json\include

Linker Paths:
- \opencv\build\x64\vc16\lib
- \Intel_RealSense_SDK_2.0\lib\x64

---

Wallhit_Detection:

C++ Include Paths:
- \json\include
- \Intel_RealSense_SDK_2.0\include
- \opencv\build\include\opencv2
- \opencv\build\include

Linker Paths:
- \Intel_RealSense_SDK_2.0\lib\x64
- \opencv\build\x64\vc16\lib
