import React from 'react';
import { connect } from 'react-redux';
import { openExternal } from '/interProcess';

import { loadResourceAction, LoadResourcePayload } from '/store/dapps';
import { getNamesBlockchain } from '/store/settings';
import { State } from '/store';
import { Blockchain } from '/models';
import { searchToAddress } from '/utils/searchToAddress';

import './Hint.scss';

interface HintProps {
  title: string;
  link: string | undefined;
  displayTerm?: boolean;
}

export const makeHintComponent =
  (open: (link: string) => void) =>
  ({ title, link, displayTerm }: HintProps) =>
    (
      <a className="hint" title={title} onClick={() => link && open(link)}>
        {displayTerm && <span className="has-text-weight-bold">{title}</span>}
        <i className="fa fa-sm fa-info-circle ml-2" />
      </a>
    );

// export const Hint = HintComponent(openExternal);

const glossary = {
  'what is rev ?': '#what_is_rev',
  'what is multi-requests ?': '#multi-requests',
  'what is ip app ?': '#ip-app',
  'what is dapp ?': '#dapp',
  'what is a box ?': '#what_is_a_box',
  'what is a FT contract ?': '#what_is_a_ft_contract',
  'what is a NFT contract ?': '#what_is_a_nft_contract',
  'what is a dappy network ?': '#what_is_a_dappy_network',
};

const getHelpLink = (namesBlockChain: Blockchain | undefined, path: string) =>
  namesBlockChain ? searchToAddress('dappy/help', namesBlockChain.chainName, path) : undefined;

interface GlossaryHintProps {
  term: keyof typeof glossary;
  displayTerm?: boolean;
  namesBlockChain: Blockchain | undefined;
  loadResource: (address: string) => void;
}

export const GlossaryHintComponent = ({ term, displayTerm, namesBlockChain, loadResource }: GlossaryHintProps) => {
  const Hint = makeHintComponent(loadResource);
  return <Hint title={t(term)} link={getHelpLink(namesBlockChain, glossary[term])} displayTerm={!!displayTerm} />;
};

export const GlossaryHint = connect(
  (state: State) => ({
    namesBlockChain: getNamesBlockchain(state),
  }),
  (dispatch) => ({
    loadResource: (address: string) =>
      dispatch(
        loadResourceAction({
          address,
        })
      ),
  })
)(GlossaryHintComponent);
