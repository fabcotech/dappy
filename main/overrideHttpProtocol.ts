import { Session } from 'electron';

export const overrideHttpProtocol = ({ session }: { session: Session }) => {
  if (process.env.PRODUCTION) {
    session.protocol.interceptHttpProtocol
    return session.protocol.interceptStreamProtocol('http', (request, callback) => {
      console.log(`[http] unauthorized`);
      callback({});
      return;
    });
  }
};
