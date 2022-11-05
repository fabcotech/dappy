export const decomposeUrl = (
  url: string
): {
  protocol: string;
  host: string;
  path: string;
} => {
  if (typeof url !== 'string') {
    throw new Error('Invalid url');
  }
  if (
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/.test(
      url
    )
  ) {
    const protocolArray = url.split('//');
    const protocol = protocolArray[0].substr(0, protocolArray[0].length - 1);
    const withoutProtocol = protocolArray.slice(1).join('//');
    const pathArray = withoutProtocol.split('/');
    const host = pathArray.slice(0, 1)[0];
    const path = `/${pathArray.slice(1).join('/')}`;
    return {
      protocol,
      host,
      path,
    };
  }
  throw new Error('Invalid url');
};
