import React from 'react';
import { connect } from 'react-redux';

import { loadResourceAction } from '/store/dapps';
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
  'what is rev ?': '#whatisrev',
  "why can't I see my balance for ETH and other EVM wallets ?": '#whycantiseebalanceforeth',
  'what is multi-requests ?': '#whatismultirequest',
  'what is ip app ?': '#whatisanipapplicationindappy',
  'what is dapp ?': '#whatisadappindappy',
  'what is a box ?': '#whatisabox',
  'what is a FT contract ?': '#whatisaftcontract',
  'what is a NFT contract ?': '#whatisanftcontract',
  'what is a dappy network ?': '#whatisadappynetwork',
};

const getHelpLink = (namesBlockChain: Blockchain | undefined, path: string) =>
  namesBlockChain ? searchToAddress('dappy/help', namesBlockChain.chainId, path) : undefined;

interface GlossaryHintProps {
  term: keyof typeof glossary;
  displayTerm?: boolean;
  namesBlockChain: Blockchain | undefined;
  loadResource: (url: string) => void;
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
    loadResource: (url: string) =>
      dispatch(
        loadResourceAction({
          url,
        })
      ),
  })
)(GlossaryHintComponent);
