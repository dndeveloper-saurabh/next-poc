export const RTMConfig = {
  appId: '320f1867bc3d4922b4da5963a9f2b760'
}

export const RTCConfig = {
  appId: '320f1867bc3d4922b4da5963a9f2b760'
}

export const WHITEBOARConfig = {
  appIdentifier: 'VHBvQEEXEeuIHrEufR7KaQ/cMKLzXlzkZaSoQ'
}

export const baseUrl = () => {
  if(process.env.NODE_ENV === "production") return 'https://us-central1-avian-display-193502.cloudfunctions.net'
  // return 'http://localhost:5001/avian-display-193502/us-central1'
  return 'https://us-central1-avian-display-193502.cloudfunctions.net'
}

export const AGORA_ROUTES = {
  getRTMToken: '/getRTMToken',
  getRTCToken: '/getRTCToken',
  createRoom: '/createRoom',
  getRoomToken: '/getRoomToken',
  getTaskToken: '/getTaskToken',
  uploadFileToS3: '/uploadFileToS3',
  fileConversionAgora: '/fileConversionAgora',
}
