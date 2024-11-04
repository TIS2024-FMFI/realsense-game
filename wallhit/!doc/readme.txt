Solution aplikacie obsahuje 2 projekty:	
	- Wallhit_Calibration - kalibracna aplikacia
	- Wallhit_Deteciton - aplikacia ktora po zapnuti simuluje klikane left buttona mysi

Pre build aplikacii je potrebne mat v pc prerekvizity a spravne nastavene cesty k dll, libs a include suborom.
Kazdy projekt obsahuje subor props v ktorom sa nachadzajue props pre jednotlive prerekvizity - po nainstalovani prerekvizit je potrebne zmenit v .props suboroch "$(KVANT_DEPENDENCIES_DIR)" - na realnu cestu vo vasich pocitacoch do daneho suboru.

Prerekvizity: 
- NlohmannJSON - dostupne na gite
- OpenCV_no_openmp - dostupne na internete (mozno nie je potrebne mat OpenCV vybuildene bez OpenMP (je to flag ktory sa nastavuje pre build opencv v CMAKE))
- realsense - api pouzivanej kamery - dostupne na stranke pre kameru
- gldw - opengl - dostupne na internete