Solution aplikácie obsahuje 2 projekty:	
	- Wallhit_Calibration - kalibračná aplikácia
	- Wallhit_Detection - aplikácia ktorá po zapnutí generuje pomocou virtuálnej klávesnice dáta o dotyku lopty o stenu.

Formát: #255,300,0.18343,-1.4345,1.90548,-0,00004*
Význam jednotlivých častí:
# - začiatok prenosu
1.arg - X
2.arg - Y
3.arg - rýchlosť
4.-6.args - parametre a,b,c paraboly vypočítanej z osí y a z.
7.arg - posun na súradnici X(smer loptičky vpravo/vľavo pred dopadom)
* - koniec prenosu



Pred spustením je nutné nastaviť prerekvizity, cesty ku knižniciam(.dll, .libs a include súborom).

Prerekvizity: 
- NlohmannJSON - dostupne na gite
- OpenCV - dostupne na internete
- realsense - api pouzivanej kamery - dostupne na stránke pre kameru
- gldw - opengl - dostupne na internete


Možnosti sú 2:
	1. vyhľadajte v projektoch props súbor, v ktorom sa nastavujú cesty ku knižniciam. Po stiahnutí/inštalácií potrebných súborov, je potrebné zmeniť  "$(KVANT_DEPENDENCIES_DIR)" na reálnu cestu vo vašom počítači do daného súboru.(POZOR prednastavené props už nemusia byť aktuálne!)

	2. otvorte si solution a v 'Properties' jednotlivých projektov nastavíte reálnu cestu k potrebným súborom. Potom sa bude dať projekt zbuildovať. 

Cesty prererekvizít pre jednotlivé projekty:
Wallhit_Calibration
C++  - \opencv\build\include
     - \opencv\build\include\opencv2
     - \Intel_RealSense_SDK_2.0\include
     - \json\include
Linker - \opencv\build\x64\vc16\lib
       - \Intel_RealSense_SDK_2.0\lib\x64
Wallhit_Detection
C++ - \json\include
    - \Intel_RealSense_SDK_2.0\include
    - \opencv\build\include\opencv2
    - \opencv\build\include
Linker - \Intel_RealSense_SDK_2.0\lib\x64
       - \opencv\build\x64\vc16\lib
