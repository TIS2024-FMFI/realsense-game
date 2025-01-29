For purpose for everyone editing this code...


The program originally worked only emulating windows click mouse on a place where ball hit the wall.
There are still commented pieces of code form previous version also described so it can be easily rollbacked.
In Project Wallhit_detection file Source.cpp there is changed one line of code which calls not InputHandler but creates BallHit object which after calls KeyboardInputHandler. Everything new is in these 2 files ballhit.cpp and keyboardinputhandler.cpp

