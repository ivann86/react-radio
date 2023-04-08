# React Radio

[https://radio.ivanoff.dev](https://radio.ivanoff.dev)\
React Radio is a course project for SoftUnu ReactJS - Febuary 2023 edition.

## Description

The app aims to be a completely functional online radio player similar to the popular TuneIn service with a catalog of more than 30000 radio station from all over the world provided by [Radio Browser API](https://www.radio-browser.info). The stations can be browsed by music genres, news, sports and countries.
A registered user can create their own library of favorite radio station - these could be stations from the catalog or manually added if not found in the catalog.

## Now Playing Information

The app can read ICY metadata (if broadcasted by the station) and then match the currently playing song against iTunes database using the official iTunes API to display rich song information to the user, including album artwork and direct links to the song on popular streaming platforms (currently only Apple Music and YouTube). Registered users can find a list of the last 100 songs they listened to.

## Used technologies

<a href="https://www.typescriptlang.org/" title="Typescript"><img src="https://github.com/get-icon/geticon/raw/master/icons/typescript-icon.svg" alt="Typescript" width="21px" height="21px"></a>
<a href="https://www.w3.org/TR/html5/" title="HTML5"><img src="https://github.com/get-icon/geticon/raw/master/icons/html-5.svg" alt="HTML5" width="21px" height="21px"></a>
<a href="https://www.w3.org/TR/CSS/" title="CSS3"><img src="https://github.com/get-icon/geticon/raw/master/icons/css-3.svg" alt="CSS3" width="21px" height="21px"></a>
<a href="https://reactjs.org/" title="React"><img src="https://github.com/get-icon/geticon/raw/master/icons/react.svg" alt="React" width="21px" height="21px"></a>

The app uses [Supabase](https://supabase.com) for its backend and is deployed on Netlify. A Netlify Edge function is used to read the ICY metadata (because it rarely can be successfull in the browser because of CORS) which the player polls on regular interval while playing. The Supabase connection details and the address to the metadata endpoint are hardcoded so all you need to run it locally is `npm start`

## Available Scripts (as generated by Create React App)

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
