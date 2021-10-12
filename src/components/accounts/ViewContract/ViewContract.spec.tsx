import React from 'react';
import { ViewContractComponent, ViewContractProps } from './ViewContract';
import { render, screen, waitFor } from '@testing-library/react';
import { getFakeAccount, getFakeRChainInfos, getFakeBlockChain, getFakeRChainContractConfig, getFakePurse } from '/fakeData';
import { RChainContractConfig, RChainTokenPurse } from '/models';
import { RequestResult } from '/utils/wsUtils';

const getFakeViewContractsProps = (props: Partial<ViewContractProps> = {}) =>
  ({
    contractId: 'contract1',
    rchainInfos: getFakeRChainInfos(),
    pursesIds: ['purse1', 'purse2'],
    version: 'x.y.z',
    account: getFakeAccount(),
    getPursesAndContractConfig: () => Promise.resolve([]),
    sendRChainTransaction: () => {},
    ...props,
  } as ViewContractProps);

describe('ViewContracts', () => {
  it('should display error if blockchain is not given as props', () => {
    const props = getFakeViewContractsProps();

    render(<ViewContractComponent {...props} />);

    expect(screen.getByTestId('error')).toHaveTextContent('Names blockchain not found');
  });
  it('should display errors on Purse and ContractConfig validation errors', async () => {
    const props = getFakeViewContractsProps({
      namesBlockchain: getFakeBlockChain(),
      getPursesAndContractConfig: () =>
        Promise.resolve([
          {
            validationErrors: [{ dataPath: 'foo/bar', message: 'mismatch' }],
          } as RequestResult<Record<string, RChainTokenPurse>>,
          {
            validationErrors: [{ dataPath: 'baz/bar', message: 'mismatch' }],
          } as RequestResult<RChainContractConfig>,
        ]),
    });

    render(<ViewContractComponent {...props} />);

    await waitFor(() => {
      screen.getByTestId('error');
    });
    expect(screen.getByTestId('error')).toHaveTextContent('error');
  });
  it('should display contract not locked', async () => {
    const props = getFakeViewContractsProps({
      namesBlockchain: getFakeBlockChain(),
      getPursesAndContractConfig: () =>
        Promise.resolve([
          {
            result: { [getFakePurse().id]: getFakePurse() } 
          } as RequestResult<Record<string,RChainTokenPurse>>,
          {
            result: getFakeRChainContractConfig({
              locked: false
            }) 
          } as RequestResult<RChainContractConfig>,
        ]),
    });

    render(<ViewContractComponent {...props} />);
    await waitFor(() => {
      screen.getByText("not locked");
    });
    expect(screen.getByText('not locked')).toHaveClass('has-text-danger');
    expect(screen.getByText('not locked')).toHaveAttribute('title', 'not locked title');
  });

  it('should display contract locked', async () => {
    const props = getFakeViewContractsProps({
      namesBlockchain: getFakeBlockChain(),
      getPursesAndContractConfig: () =>
        Promise.resolve([
          {
            result: { [getFakePurse().id]: getFakePurse() } 
          } as RequestResult<Record<string,RChainTokenPurse>>,
          {
            result: getFakeRChainContractConfig({
              locked: true
            }) 
          } as RequestResult<RChainContractConfig>,
        ]),
    });

    render(<ViewContractComponent {...props} />);
    await waitFor(() => {
      screen.getByText("locked");
    });
    expect(screen.getByText('locked')).toHaveClass('has-text-success');
    expect(screen.getByText('locked')).toHaveAttribute('title', 'locked title');
  });
});
