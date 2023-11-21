# Vehicle-App

This App is based on [CRA](https://create-react-app.dev/).

Scripts:
```
npm install => Installs all Dependencies

npm run start
npm run build {Prod-Build => ./build/ => Upload in S3}
npm run eject

...
```

Upload
```
aws s3 sync ./build s3://{your-bucket}
```