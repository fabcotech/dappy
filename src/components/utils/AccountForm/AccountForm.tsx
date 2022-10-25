import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { ec as Ec } from 'elliptic';

import { BlockchainAccount } from '/models';
import { encrypt, decrypt, passwordFromStringToBytes } from '/utils/crypto';
import './AccountForm.scss';
import { rchainWallet, evmWallet } from '/utils/wallets';

const ecSecp256k1 = new Ec('secp256k1');

const platforms = [
  { key: 'evm', name: 'Ethereum / EVM' },
  { key: 'rchain', name: 'Rchain' },
  { key: 'certificate', name: 'TLS certificate' },
] as const;

type Platform = typeof platforms[number];
type PlatformKey = Platform['key'];

interface AccountFormProps {
  names: string[];
  fillAccount: (a: undefined | BlockchainAccount) => void;
}

const PASSWORD_REGEXP_UPPER = /^(?=.*?[A-Z])/;
const PASSWORD_REGEXP_LOWER = /^(?=.*?[a-z])/;
const PASSWORD_REGEXP_NUMBER = /^(?=.*?[0-9])/;
const PASSWORD_REGEXP_SPECIAL = /^(?=.*?[#?!@$%^&*-])/;

const onGeneratePrivateKey = (setFieldValue: (a: string, b: string) => void) => {
  // if (mode === 'secp256k1') {
  const key = ecSecp256k1.genKeyPair();
  const privateKey = key.getPrivate().toString(16);
  setFieldValue('privatekey', privateKey);
  // } else {
  //   window.generateCertificateAndKey([]).then(({ key, certificate }) => {
  //     setFieldValue('privatekey', key);

  //     // console.log(certificate);
  //     // debugger;
  //   });
  //   const key = ecSecp256r1.genKeyPair();
  //   const privateKey = key.getPrivate().toString(16);
  //   // pem.createEcparam('prime256v1', 'explicit', false, (err, data) => {
  //   console.log(privateKey);
  //   debugger;
  //   // });
  //   // setFieldValue('privatekey');
  // }
};

function BlockchainAccountForm(props: AccountFormProps & { platform: PlatformKey }) {
  let publicKey = '';
  let address = '';
  let passwordWarnings: string[] = [];
  let error: string | undefined;

  return (
    <Formik
      onSubmit={() => undefined}
      initialValues={
        {
          platform: props.platform,
          name: '',
          privatekey: '',
          password: '',
        } as Partial<BlockchainAccount> & {
          privatekey: string;
          password: string;
        }
      }
      validate={(values) => {
        passwordWarnings = [];
        const errors: {
          name?: string;
          privatekey?: string;
          password?: string;
        } = {};

        if (!values.name) {
          errors.name = t('field required');
        } else if (props.names.find((n) => n === values.name)) {
          errors.name = t('name taken');
        }

        if (!values.password) {
          errors.password = t('field required');
        } else if (values.password.length < 8) {
          errors.password = t('password length');
        }
        console.log('PLATFORM', values.platform);

        if (!values.privatekey) {
          errors.privatekey = t('field required');
        } else {
          try {
            const keyPair = ecSecp256k1.keyFromPrivate(values.privatekey);
            publicKey = keyPair.getPublic().encode('hex', false) as string;
            switch (values.platform) {
              case 'rchain':
                address = rchainWallet.addressFromPublicKey(publicKey);
                break;
              case 'evm':
                address = evmWallet.addressFromPublicKey(publicKey);
                break;
              default:
                throw new Error('unknown platform');
            }
          } catch (err) {
            console.log(err);
            errors.privatekey = t('private key invalid');
          }
        }

        // const passwordWarnings = [];
        if (!PASSWORD_REGEXP_UPPER.test(values.password)) {
          passwordWarnings.push(t('at least one upper'));
        }
        if (!PASSWORD_REGEXP_LOWER.test(values.password)) {
          passwordWarnings.push(t('at least one lower'));
        }
        if (!PASSWORD_REGEXP_NUMBER.test(values.password)) {
          passwordWarnings.push(t('at least one number'));
        }
        if (!PASSWORD_REGEXP_SPECIAL.test(values.password)) {
          passwordWarnings.push(t('at least one special'));
        }
        passwordWarnings = ([] as string[]).concat(passwordWarnings);

        if (Object.keys(errors).length) {
          props.fillAccount(undefined);
        } else {
          try {
            const passwordBytes = passwordFromStringToBytes(values.password);
            const encrypted = encrypt(values.privatekey, passwordBytes);
            const decrypted = decrypt(encrypted, passwordBytes);

            if (decrypted !== values.privatekey) {
              throw new Error('unable to create a valid encrypted string');
            }

            props.fillAccount({
              platform: values.platform!,
              name: values.name!,
              publicKey,
              address,
              encrypted,
              main: false,
              balance: 0,
              boxes: [],
              whitelist: [{ host: '*', blitz: true, transactions: true }],
            });
            error = undefined;
          } catch (err) {
            console.error(err);
            error = `Something went wrong when encrypting private key : ${err}`;
          }
        }

        return errors;
      }}
      render={({ errors, touched, handleSubmit, setFieldValue, values }) => {
        return (
          <>
            <div className="field is-horizontal">
              <label className="label">Name*</label>
              <div className="control is-medium">
                <Field
                  className="input is-medium"
                  type="text"
                  name="name"
                  placeholder="Account name"
                />
              </div>
            </div>
            {touched.name && errors.name && <p className="text-danger">{(errors as any).name}</p>}

            <div className="field is-horizontal">
              <label className="label">{t('private key')}*</label>
              <div className="control">
                <Field
                  className="input is-medium"
                  type="password"
                  name="privatekey"
                  placeholder={t('private key')}
                />
                <button
                  type="button"
                  className="button is-link is-small generate-private-key"
                  onClick={() => onGeneratePrivateKey(setFieldValue)}
                >
                  {t('generate private key')}
                </button>
              </div>
            </div>
            {touched.privatekey && errors.privatekey && (
              <p className="text-danger">{(errors as any).privatekey}</p>
            )}
            <div className="field is-horizontal">
              <label className="label">{t('public key')}*</label>
              <div className="control is-medium">
                <span className="public-key ">{publicKey || t('public key derived')}</span>
              </div>
            </div>
            <div className="field is-horizontal">
              <label className="label">{t('address')}*</label>
              <div className="control">
                <span className="address">{address || t('address derived')}</span>
              </div>
            </div>
            <div className="field is-horizontal">
              <label className="label">{t('password')}*</label>
              <div className="control">
                <Field
                  className="input is-medium"
                  type="password"
                  name="password"
                  placeholder={t('password')}
                />
              </div>
            </div>
            {touched.password && errors.password && (
              <p className="text-danger">{(errors as any).password}</p>
            )}
            {touched.password && passwordWarnings.length
              ? passwordWarnings.map((p, i) => (
                  <p key={i} className="text-danger">
                    {p}
                  </p>
                ))
              : undefined}
            {error && <p className="text-danger">{error}</p>}
          </>
        );
      }}
    />
  );
}

export function AccountForm(props: AccountFormProps) {
  const [plaformKey, setPlatformKey] = useState<PlatformKey>('evm');

  return (
    <form className="account-form">
      <div className="field is-horizontal">
        <label className="label">{t('blockchain type')}*</label>
        <div className="control is-medium">
          <div className="select is-medium">
            <select onChange={(v) => setPlatformKey(v.target.value as PlatformKey)}>
              {platforms.map(({ key, name }) => (
                <option value={key} key={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {plaformKey !== 'certificate' && <BlockchainAccountForm {...props} platform={plaformKey} />}
    </form>
  );
}
