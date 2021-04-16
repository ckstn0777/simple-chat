import { google } from 'googleapis';

export default async function getGoogleProfile(accessToken: string) {
  const { data } = await google.people('v1').people.get({
    access_token: accessToken,
    resourceName: 'people/me',
    personFields: 'names,emailAddresses,photos',
  });

  return data;
}
