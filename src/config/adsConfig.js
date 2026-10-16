
export const ADS_CLIENT_ID = 'ca-pub-1249143170747032';

const slot = (slotId, minHeight) => ({
  enabled: true, // Enable after configuring and verifying your ad units
  clientId: ADS_CLIENT_ID,
  slotId,
  format: 'auto',
  responsive: true,
  minHeight,
});

export const adsConfig = {
  header: slot('2880470238', 90),
  belowGenerator: slot('2880470238', 250),
  footer: slot('2880470238', 90),
};
