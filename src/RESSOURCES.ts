import { CssLibraries, JsLibraries } from './models';

export const RESSOURCES: {
  js: {
    id: JsLibraries;
    from: string;
  }[];
  css: {
    id: CssLibraries;
    from: string;
  }[];
} = {
  js: [
    {
      id: 'jquery@1.9.1',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js',
    },
    {
      id: 'jquery@2.2.4',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js',
    },
    {
      id: 'jquery@3.3.1',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    },
    {
      id: 'react-dom@16.9.0',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.9.0/umd/react-dom.production.min.js',
    },
    {
      id: 'react@16.9.0',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/react/16.9.0/umd/react.production.min.js',
    },
    {
      id: 'redux@4.0.4',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/redux/4.0.4/redux.js',
    },
    {
      id: 'react-redux@7.1.1',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/react-redux/7.1.1/react-redux.js',
    },
    {
      id: 'bootstrap@4.3.1',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.js',
    },
    {
      id: 'semantic-ui@2.4.1',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.js',
    },
    {
      id: 'vuex@3.1.1',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.1/vuex.esm.browser.js'
    },
        {
      id: 'vue@2.6.10',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.esm.browser.js'
    }
  ],
  css: [
    {
      id: 'bootstrap@4.x',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css',
    },
    {
      id: 'bulma@0.x',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css',
    },
    {
      id: 'semantic-ui@2.x',
      from: 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css',
    },
  ],
};
