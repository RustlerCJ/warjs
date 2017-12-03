# CardGame

## Dependencies
* [Node JS](http://nodejs.org/)
* [Gulp](http://gulpjs.com/)

## Installation
Once you have installed the above dependencies:

1. `cd` into the root of the new project folder and run `npm install` from the command line

## Running
From the root of the project, several commands can be issued from terminal:

1. `gulp`: Runs the default Gulp task. This builds the project with source maps from the `app` folder into the `build` folder, spawns a Node server, opens a new browser with the website at http://localhost:3000, and listens for subsequent changes. When you edit and save a new file, Gulp will recompile accordingly and refresh your browser window with the latest changes automatically.
2. `gulp build`: Builds project from the `app` folder into the `build`, uglifies the JS, and minifies the CSS. This should generally be run prior to committing/pushing your code to the repo.
