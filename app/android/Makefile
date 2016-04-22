all: platforms
	cp ../../target/android/output/target/usr/bin/eja www/bin/eja
	cp ../../output/ejaBox.android.tar www/bin/ejaBox.tar
	cordova build --release && cp platforms/android/build/outputs/apk/android-release-unsigned.apk ../../output/ejaBox.android.apk
clean:
	rm -Rf platforms

platforms:
	cordova platform add android
