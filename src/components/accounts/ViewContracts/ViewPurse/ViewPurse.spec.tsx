import React from 'react';
import { render, screen } from '@testing-library/react';
import { ViewPurseComponent, ViewPurseProps } from './ViewPurse';
import { getFakeRChainInfos, getFakeAccount, getFakePurse } from '/fakeData';

const duration4days= 1000 * 60 * 60 * 24 * 4;

const getFakeViewPurseProps = (props: Partial<ViewPurseProps> = {}) => ({
  ...{
    id: 'purse1',
    contractId: 'contract1',
    rchainInfos: getFakeRChainInfos(),
    account: getFakeAccount(),
    sendRChainTransaction: () => {},
  },
  ...(props as any),
});

describe('ViewPurse', () => {
  it('should display loading icon if no purse provided', () => {
    const props = getFakeViewPurseProps();

    render(<ViewPurseComponent {...props} />);

    expect(screen.queryByText(props.id)).toBeTruthy();
    expect(screen.getByTestId('loading-icon')).toHaveClass('rotating');
  });

  it('should display expire duration for fungible tokens', () => {
    const today = new Date(2021, 10, 13).getTime();
    const props = getFakeViewPurseProps({
      now: () => today,
      fungible: true,
      purse: getFakePurse({
        timestamp: today,
      }),
      contractExpiration: duration4days,
    });

    render(<ViewPurseComponent {...props} />);
    expect(screen.queryByTestId('expiration')).toHaveTextContent('expires in 4 days');
  });

  it('should display expired for expired fungible tokens', () => {
    const today = new Date(2021, 10, 13).getTime();
    const props = getFakeViewPurseProps({
      now: () => today,
      fungible: true,
      purse: getFakePurse({
        timestamp: new Date(2021, 10, 5).getTime(),
      }),
      contractExpiration: duration4days,
    });

    render(<ViewPurseComponent {...props} />);
    expect(screen.queryByTestId('expiration')).toHaveTextContent('expired');
  });

  it('should not display expire duration for token named 0', () => {
    const today = new Date(2021, 10, 13).getTime();

    render(
      <ViewPurseComponent
        {...getFakeViewPurseProps({
          now: () => today,
          fungible: true,
          purse: getFakePurse({
            id: '0',
            timestamp: today,
          }),
          contractExpiration: duration4days,
        })}
      />
    );
    expect(screen.queryByTestId('expiration')).toBeFalsy();
  });

  it('should not display expire duration for NFT', () => {
    const today = new Date(2021, 10, 13).getTime();
    const props = getFakeViewPurseProps({
      now: () => today,
      fungible: false,
      purse: getFakePurse({
        timestamp: today,
      }),
      contractExpiration: duration4days,
    });

    render(<ViewPurseComponent {...props} />);
    expect(screen.queryByTestId('expiration')).toBeFalsy();
  });

  it('should not display expire duration if contract has no expiration date', () => {
    const today = new Date(2021, 10, 13).getTime();
    const props = getFakeViewPurseProps({
      now: () => today,
      fungible: true,
      purse: getFakePurse({
        timestamp: today
      }),
    });

    render(<ViewPurseComponent {...props} />);
    expect(screen.queryByTestId('expiration')).toBeFalsy();
  });
});
