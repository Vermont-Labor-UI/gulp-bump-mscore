# GulpBumps
Gulp file that will help with the pre bump and the release bump for Microsoft .NET Core projects.


This uses the gulp-bump package but allows for some additional task.

Any prerelease tag will be stripped off if needed.  Going from 'bump-build' to to 'bump-pre' will strip the -b, and visa-versa.
This will prevent "nested" prereleases (ie. -b1-pre1-b2-pre2...)

```bash
# Looks for the Environment Variable "BUilD_BUILDNUMBER" (TFS way) 
# and will append the buildnumber -b<number> to the build.
gulp bump-build
```

```bash
# Adds a -pre<number> to the version.
# Version will be incremented each execution
gulp bump-pre
```

```bash
# Go to the next prerelease patch number
# 1.0.0-pre1 -> 1.0.1-pre1
gulp bump-nextpre
```

```bash
#Remove any prerelease version
gulp release
```


Standard gulp bump tasks
All Patch/Minor/Major bumps will append a "-*" to the version.

```bash
# Patch Bump
gulp bump

# Minor bump
gulp bump-minor

# Major Bump
gulp bump-major
```
