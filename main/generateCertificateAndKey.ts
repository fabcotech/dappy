import forge from 'node-forge';

const { pki } = forge;

const addDays = (date: Date, days: number) => {
  const newDate = new Date(date.valueOf());
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

export function generateCertificateAndKey({
  days,
  selfSigned,
  altNames,
  now,
}: {
  days: number;
  selfSigned: boolean;
  altNames: string[];
  now: Date;
}) {
  const certificate = pki.createCertificate();
  const keys = pki.rsa.generateKeyPair(2048);
  const attrs = [
    {
      name: 'commonName',
      value: 'dappy',
    },
  ];
  certificate.setSubject(attrs);
  certificate.setIssuer(attrs);
  certificate.serialNumber = `00${Math.random().toString(16).replace('.', '')}`.toUpperCase();
  certificate.publicKey = keys.publicKey;
  certificate.validity.notBefore = now;
  certificate.validity.notAfter = addDays(now, days);
  if (altNames.length) {
    certificate.setExtensions([
      {
        name: 'subjectAltName',
        altNames: altNames.map((value) => ({
          type: 6, // URI
          value,
        })),
      },
    ]);
  }

  if (selfSigned) {
    certificate.sign(keys.privateKey);
  }

  return [pki.privateKeyToPem(keys.privateKey), pki.certificateToPem(certificate)];
}
