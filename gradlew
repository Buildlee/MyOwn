#!/usr/bin/env sh
# ##########################################################################
#
# Gradle startup script for POSIX shells
#
# ##########################################################################

APP_BASE_NAME=${0##*/}
APP_HOME=$(cd "$(dirname "$0")"; pwd)

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar

JAVA_EXE=java
if [ -n "$JAVA_HOME" ] ; then
    JAVA_EXE="$JAVA_HOME/bin/java"
fi

exec "$JAVA_EXE" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
