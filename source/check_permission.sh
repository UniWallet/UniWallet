#!/bin/bash

components=( react-native-exception-handler react-native-restart react-native-fast-image react-native-fs react-native-device-info react-native-splash-screen react-native-randombytes react-native-orientation react-native-i18n react-native-camera react-native-vector-icons jpush-react-native jcore-react-native react-native react-native-share )

echo " ===== components ===== ${#components[*]}"

for ((i=0; i<${#components[*]}; i++))
do
	echo "$i -> ${components[$i]}"
	manifest_path="./node_modules/${components[$i]}/android/src/main/AndroidManifest.xml"
	if [ -f $manifest_path ]; then
   		#echo "AndroidManifest.xml is found."
		#permissions=`grep "uses-permission" $manifest_path`
		#echo "permissions length = ${#permissions[*]}"
		while IFS='' read -r line || [[ -n "$line" ]]; do
			if [[ $line == *"<uses-permission"* ]]; then
  				echo "$line"
			fi
		done < "$manifest_path"
	else
   		echo "No permission is found."
	fi
done
