import axios from "axios";
import {AGORA_ROUTES, baseUrl} from "./config";

const contextBody = (auth) => ({context: {auth}});

export const getRTMToken = (auth, account) => axios.post(baseUrl() + AGORA_ROUTES.getRTMToken + `?account=${account}`, contextBody(auth));

export const getRTCToken = (auth, account, channelName) => axios.post(baseUrl() + AGORA_ROUTES.getRTCToken + `?account=${account}&channelName=${channelName}`, contextBody(auth));

export const createRoom = (auth) => axios.post(baseUrl() + AGORA_ROUTES.createRoom, contextBody(auth));

export const getRoomToken = (auth, isInstructor, roomId) => axios.post(baseUrl() + AGORA_ROUTES.getRoomToken, {...contextBody(auth), isInstructor, roomId});

export const getTaskToken = (auth, uuid) => axios.post(baseUrl() + AGORA_ROUTES.getTaskToken, {...contextBody(auth), uuid});

export const uploadFileToS3 = (auth, formData) => {
  // formData.append('context', {auth});
  return axios.post(baseUrl() + AGORA_ROUTES.uploadFileToS3, formData);
};

export const fileConversionAgora = (auth, url) => axios.post(baseUrl() + AGORA_ROUTES.fileConversionAgora, {...contextBody(auth), url});
