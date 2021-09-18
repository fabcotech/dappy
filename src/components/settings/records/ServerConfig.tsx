import * as React from 'react';

import './ServerConfig.scss';

export const ServerConfig = (props: {
  host: string | undefined;
  kkey: string | undefined;
  certificate: string | undefined;
}) => {
  const [nginx, setNginx] = React.useState(true);

  const Top = () => (
    <>
      <a
        title="Switch between apache2 and nginx config"
        className="underlined-link nginx-or-apache"
        onClick={() => setNginx(!nginx)}>
        <span className={nginx ? 'ip-server-confg-grey' : ''}>NGINX</span>
        &nbsp;/&nbsp;
        <span className={nginx ? '' : 'ip-server-confg-grey'}>Apache</span>
      </a>
      <p>
        The config are appropriate for linux debian/ubuntu, Apache/2.4.41 (Ubuntu) and nginx 1.18.0-0ubuntu1.2 . Please
        be careful to what system and reverse proxy you are using.
      </p>
      <br />
      <br />
    </>
  );
  if (nginx) {
    const pathCrt = `/etc/nginx/conf.d/${props.host || 'myhost'}.crt`;
    const pathKey = `/etc/nginx/conf.d/${props.host || 'myhost'}.key`;
    const pathConf = `/etc/nginx/conf.d/${props.host || 'myhost'}.conf`;
    const conf = `server {
    server_name ${props.host || 'HOST'};
    listen 443 ssl;
    root /www/data;
    location / {
    }
  
    proxy_http_version 1.1;
    proxy_set_header Host $host;
  
    ssl_protocols TLSv1.2 TLSv1.3;
    # https://nginx.org/en/docs/http/ngx_http_ssl_module.html
  
    ssl_certificate ${pathCrt};
    ssl_certificate_key ${pathKey};
  }`;

    const commandConf = `echo "${conf}" > ${pathConf}`;
    const commandCrt = `echo "${props.certificate || ''}" > ${pathCrt}`;
    const commandKey = `echo "${props.kkey || ''}" > ${pathKey}`;

    return (
      <div>
        <Top />
        <b>&nbsp;&nbsp;{pathConf}&nbsp;</b>
        <a className="underlined-link" onClick={() => window.copyToClipboard(conf)}>
          <i className="fa fa-copy fa-before"></i>
          copy text
        </a>{' '}
        <a className="underlined-link" onClick={() => window.copyToClipboard(commandConf)}>
          <i className="fa fa-copy fa-before"></i>
          copy bash command
        </a>
        <br />
        <pre>{conf}</pre>
        <br />
        <b>&nbsp;&nbsp;{pathCrt}&nbsp;</b>
        <>
          <a className="underlined-link" onClick={() => window.copyToClipboard(props.certificate || '')}>
            <i className="fa fa-copy fa-before"></i>
            copy text
          </a>{' '}
          <a className="underlined-link" onClick={() => window.copyToClipboard(commandCrt)}>
            <i className="fa fa-copy fa-before"></i>
            copy bash command
          </a>
        </>
        <br />
        <pre>{props.certificate || 'unknown'}</pre>
        <br />
        <b>&nbsp;&nbsp;{pathKey}&nbsp;</b>
        {props.kkey && (
          <>
            <a className="underlined-link" onClick={() => window.copyToClipboard(props.kkey || '')}>
              <i className="fa fa-copy fa-before"></i>
              copy text
            </a>{' '}
            <a className="underlined-link" onClick={() => window.copyToClipboard(commandKey)}>
              <i className="fa fa-copy fa-before"></i>
              copy bash command
            </a>
          </>
        )}
        <pre>{props.kkey || 'unknown'}</pre>
        <br />
        <a
          className="underlined-link"
          onClick={() =>
            window.copyToClipboard(
              `sudo sh -c '${commandKey} && ${commandCrt} && ${commandConf}'`.replaceAll('$', '\\$')
            )
          }>
          <i className="fa fa-copy fa-before"></i>
          copy all commands (sudo)
        </a>
      </div>
    );
  }

  const h = props.host || 'myhost';
  const pathCrt = `/etc/apache2/sites-enabled/${h}.crt`;
  const pathKey = `/etc/apache2/sites-enabled/${h}.key`;
  const pathConf = `/etc/apache2/sites-enabled/${h}.conf`;
  const conf = `<VirtualHost *:443>
    SSLEngine on
    ServerName ${h}
  
    LogLevel warn
    SSLCertificateFile ${pathCrt}
    SSLCertificateKeyFile ${pathKey}
    SSLProtocol TLSv1.2
    <IfDefine thisIsAComment>
      Comment https://httpd.apache.org/docs/2.4/en/ssl/ssl_howto.html
    </IfDefine>
   
    DocumentRoot "/www/data"
   
    <Directory "/www/data">
      AuthType None
      Require all granted
    </Directory>
   
   </VirtualHost>`;

  const commandConf = `echo "${conf}" > ${pathConf}`;
  const commandCrt = `echo "${props.certificate || ''}" > ${pathCrt}`;
  const commandKey = `echo "${props.kkey || ''}" > ${pathKey}`;

  return (
    <div>
      <Top />
      <b>&nbsp;&nbsp;{pathConf}&nbsp;</b>
      <a className="underlined-link" onClick={() => window.copyToClipboard(conf)}>
        <i className="fa fa-copy fa-before"></i>
        copy text
      </a>{' '}
      <a className="underlined-link" onClick={() => window.copyToClipboard(commandConf)}>
        <i className="fa fa-copy fa-before"></i>
        copy bash command
      </a>
      <br />
      <pre>{conf}</pre>
      <br />
      <b>&nbsp;&nbsp;{pathCrt}&nbsp;</b>
      <>
        <a className="underlined-link" onClick={() => window.copyToClipboard(props.certificate || '')}>
          <i className="fa fa-copy fa-before"></i>
          copy text
        </a>{' '}
        <a className="underlined-link" onClick={() => window.copyToClipboard(commandCrt)}>
          <i className="fa fa-copy fa-before"></i>
          copy bash command
        </a>
      </>
      <br />
      <pre>{props.certificate || 'unknown'}</pre>
      <br />
      <b>&nbsp;&nbsp;{pathKey}&nbsp;</b>
      {props.kkey && (
        <>
          <a className="underlined-link" onClick={() => window.copyToClipboard(props.kkey || '')}>
            <i className="fa fa-copy fa-before"></i>
            copy text
          </a>{' '}
          <a className="underlined-link" onClick={() => window.copyToClipboard(commandKey)}>
            <i className="fa fa-copy fa-before"></i>
            copy bash command
          </a>
        </>
      )}
      <pre>{props.kkey || 'unknown'}</pre>
      <br />
      <a
        className="underlined-link"
        onClick={() => window.copyToClipboard(`sudo sh -c '${commandKey} && ${commandCrt} && ${commandConf}'`)}>
        <i className="fa fa-copy fa-before"></i>
        copy all commands (sudo)
      </a>
    </div>
  );
};
