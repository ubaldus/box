all: www/ejaBox.zip
	cordova build --release 
	cp platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ../../output/ejaBox.android.apk

debug: www/ejaBox.zip
	cordova build 
	cp platforms/android/app/build/outputs/apk/debug/app-debug.apk ../../output/ejaBox.android.debug.apk

clean:
	rm -rf tar www/ejaBox.zip package-lock.json zip/eja zip/ejaBox.tar
	
www/ejaBox.zip:
	cp ../../output/eja.android zip/eja
	cp ../../output/ejaBox.android.tar zip/ejaBox.tar 
	zip -r www/ejaBox.zip zip
	