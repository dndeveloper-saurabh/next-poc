const { RtmTokenBuilder, RtmRole } = require("agora-access-token");

export const rtmTokenBuilder = ({ channel }) => {
  const appID = "320f1867bc3d4922b4da5963a9f2b760";
  const appCertificate = "aac0be1b04ec4f60a1a2b7945d8ea958";
  const role = RtmRole.PUBLISHER;

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtmTokenBuilder.buildToken(
    appID,
    appCertificate,
    channel,
    role,
    privilegeExpiredTs
  );

  return token;
};
