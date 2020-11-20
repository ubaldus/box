all: www/ejaBox.zip
	cordova build --release 
	cp platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ../../output/ejaBox.android.apk

debug: www/ejaBox.zip
	cordova build 
	cp platforms/android/app/build/outputs/apk/debug/app-debug.apk ../../output/ejaBox.android.debug.apk

clean:
	rm -rf node_modules platforms plugins package-lock.json zip/ejaBox.tar www/ejaBox.zip 
	
platforms/android:
	cordova platforms add android
	
www/ejaBox.zip: platforms/android
	cp ../../output/ejaBox.android.tar zip/ejaBox.tar 
	zip -r www/ejaBox.zip zip
	