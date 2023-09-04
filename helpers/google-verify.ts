import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

// -----------------------------------------------------
export const googleVerify = async ( idToken = '' ) => {

  const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,  
      // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  // cons "name: nombre" se desestructura "name as nombre"
  const token = ticket.getPayload();

  if ( token != undefined ) {
    const { 
      name, 
      email, 
      picture : img } = token;
    return  { name, email, img };
  }

}
// -----------------------------------------------------