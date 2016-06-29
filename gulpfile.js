/// <binding />
"use strict";

var baseProjectClass = "./application/src/";

var gulp = require("gulp"),
	bump = require("gulp-bump"),
    jeditor = require("gulp-json-editor"),
    gutil = require('gulp-util'),
    debug = require('gulp-debug');

// Remove any prelease version numbers
gulp.task('release', function() {
	gulp.src(baseProjectClass + "**/project.json")
	.pipe(jeditor(function(json) {
		json.version = stripStar(json.version);
        return json;
	}))
	.pipe(gulp.dest(baseProjectClass));
	
});

gulp.task('bump', function () {
    gulp.src(baseProjectClass + "**/project.json")
	.pipe(bump({ type: 'patch' }))
	.pipe(jeditor(function(json) {
		json.version = addStar(json.version);
        return json;
	}))
	.pipe(gulp.dest(baseProjectClass));
});


gulp.task('bump-pre', function (LOCAL_PUBLISH) {
    gulp.src(baseProjectClass + "**/project.json")
        .pipe(debug())
        .pipe(jeditor(function (json) {
            json.version = stripStar(json.version);
            json.version = resetPre(json.version);

            return json;
        }))
        .pipe(bump({ type: 'prerelease', preid: 'pre' }))
        .pipe(jeditor(function (json) {
            // Gulp prerelease will add a "." in the -pre version.  
            // Microsoft does not recognize it as a valid number, so we remove it and concatinate the 'pre' and the number
            json.version = json.version.replace('pre.', 'pre');
            return json;
        }))
        .pipe(gulp.dest(baseProjectClass));
});


gulp.task('bump-minor', function () {
    gulp.src(baseProjectClass + "**/project.json")
    .pipe(bump({ type: 'minor' }))
    .pipe(jeditor(function(json) {
        json.version = addStar(json.version);
        return json;
    }))
    .pipe(gulp.dest(baseProjectClass));
});

gulp.task('bump-major', function () {
    gulp.src(baseProjectClass + "**/project.json")
    .pipe(bump({ type: 'major' }))
    .pipe(jeditor(function(json) {
        json.version = addStar(json.version);
        return json;
    }))
    .pipe(gulp.dest(baseProjectClass));
});

gulp.task('bump-build', function () {
    gulp.src(baseProjectClass + "**/project.json")
        .pipe(jeditor(function (json) {
            var buildNumber = "-b";
            // This is the environment variable set in TFS
           if(process.env.BUILD_BUILDNUMBER !== undefined)
           {
                buildNumber += process.env.BUILD_BUILDNUMBER;
            }
            else
            {
                throw new gutil.PluginError({
                    plugin: "bump-build",
                    message: "Build number not set as environment vairable.  It must be either BUILD_BUILDNUMBER or BUILD_NUMBER"
                });
            }

            // Microsoft does not recognize any "." in the prerelease but hte build number will have a "." in it.
            buildNumber = buildNumber.replace(".", "-");

            // strip any prerelease versions or any -* and append the build number
            var updatedVersion = json.version.replace(/-.*/i, "") + buildNumber;

            json.version = updatedVersion;
            return json;
        }))
        .pipe(gulp.dest(baseProjectClass));
});

gulp.task('bump-nextpre', function() {
    gulp.src(baseProjectClass + "**/project.json")
         .pipe(jeditor(function (json) {
            json.version = stripStar(json.version);
            json.version = stripPre(json.version);
            return json;
         }))
        .pipe(bump({ type: 'prerelease', preid: 'pre' }))
        .pipe(gulp.dest(baseProjectClass));
});


// Remove the -* from the version
function stripStar(version)
{
    var starIndex = version.indexOf("-*");
    if(starIndex > 0)
    {
        version = version.substring(0, starIndex);
        gutil.log(version);

    }
    return version
}

// Remove the -pre prerelease from the version
function stripPre(version)
{
    var preIndex = version.indexOf('pre');
    if (preIndex > 0) {
        version = version.substring(0, preIndex - 1);
    }
    return version;
}

// Because Microsoft does not recognize any periods after the prerelease "-" as a valid version number
// we must handle that case.
// This will put the "." back in the prerelease so that the gulp bump-pre will increment the number correctly.
function resetPre(version)
{
    var preIndex = version.indexOf('pre');
    if (preIndex > 0) {
        var baseVersion = version.substring(0, preIndex - 1);
        var prebuildNumber = Number(version.substring(preIndex).replace('pre', ''));
        version = baseVersion + '-pre.' + prebuildNumber;
    }
    return version;
}

// Add a -* to the version
function addStar(version)
{
	var starIndex = version.indexOf("-*");
	if(starIndex <= 0)
	{
		version = version + "-*";
	}
	return version;
}
