
# Unity Help

A brief description of what this project does and who it's for








[![Site Link](https://github.com/Shagnikpaul/unity-help/blob/main/button_visit-the-page.png)](https://care-connect-drov.onrender.com/)



## Run Locally

Clone the project

```bash
  git clone https://github.com/Shagnikpaul/unity-help
```

Go to the project directory

```bash
  cd unity-help
```

Install dependencies

```bash
  npm install
```

Create a `.env` file to store the API keys in the root of the folder.



#### Contents of the `.env` file
Variable names should match the below format
```
VITE_MAIL_API_KEY=



VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

```

#### Get the Brevo mail API key (create a Brevo account first)
https://app.brevo.com/settings/keys/api


#### Get Firebase config here
https://console.firebase.google.com/u/0/


Then paste the respective API Keys and config data in the `.env` file



Now finally start the server

```bash
  npm run dev
```



Now visit the URL shown in the terminal.





