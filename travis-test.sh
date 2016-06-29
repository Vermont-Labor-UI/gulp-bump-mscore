#!/bin/sh

mkdir -p application/src/

echo "Writing project.json test file"
echo '{ "version" : "1.0.0" }' > application/src/project.json

echo "Running gulp bump-pre"
gulp bump-pre

VersionCount=$(grep 1.0.1-pre0 application/src/project.json | wc -l)

if [ ! $VersionCount -eq 1 ]; then
	echo "Gulp Bump-pre did not result in expected output.  Should have been 1.0.1-pre0"
	cat application/src/project.json
	exit 1
fi


echo "Running gulp bump-build"
env BUILD_BUILDNUMBER=1 gulp bump-build

VersionCount=$(grep 1.0.1-b1 application/src/project.json | wc -l)

if [ ! $VersionCount -eq 1 ]; then
	echo "Gulp Bump-build did not result in expected output.  Should have been 1.0.1-b1"
	cat application/src/project.json
	exit 1
fi

echo "Running gulp release"
gulp release

VersionCount=$(grep 1.0.1 application/src/project.json | wc -l)

if [ ! $VersionCount -eq 1 ]; then
	echo "Gulp Bump-release did not result in expected output.  Should have been 1.0.1"
	cat application/src/project.json
	exit 1
fi
