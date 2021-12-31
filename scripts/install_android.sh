#!/bin/bash

set -e
set -x

yarn add react-native-iap@5.2.6

cd android/app

# AndroidManifest
cd src/main
cat <<EOF > /tmp/adalo-sed
/android.permission.INTERNET/a\\
    <uses-permission android:name="com.android.vending.BILLING" />\\
EOF

sed -i.bak "$(cat /tmp/adalo-sed)" AndroidManifest.xml

echo "configured Android settings"
