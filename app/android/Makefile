all: platforms
	cp ../../target/android/output/target/bin/eja www/bin/eja
	cp ../../output/ejaBox.android.tar www/bin/ejaBox.tar
	cordova build --debug && cp platforms/android/build/outputs/apk/android-debug.apk ../../output/ejaBox.android.apk
clean:
	rm -Rf platforms

platforms:
	cordova platform add android
