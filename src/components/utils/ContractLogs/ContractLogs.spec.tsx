import React from 'react';

import { render, screen, cleanup } from '@testing-library/react';
import { ContractLogsComponent } from './ContractLogs';
import { getFakeNewNamePurchaseLog, getFakeExistingNamePurchaseLog } from '/fakeData';

describe('ContractLogs', () => {
  it('should display empty if contract has no logs', () => {
    render(<ContractLogsComponent nameSystemContractId="bar" contractLogs={{}} />);
    expect(screen.queryByText(/empty/)).not.toBeNull();
    cleanup();

    render(
      <ContractLogsComponent
        nameSystemContractId={undefined}
        contractLogs={{
          bar: [getFakeNewNamePurchaseLog()],
        }}
      />
    );
    expect(screen.queryByText(/empty/)).not.toBeNull();
    cleanup();

    render(
      <ContractLogsComponent
        nameSystemContractId="bar"
        contractLogs={{
          bar: [getFakeNewNamePurchaseLog()],
        }}
      />
    );
    expect(screen.queryByText(/empty/)).toBeNull();
  });
  it('should display log timestamp in ISO format', () => {
    render(
      <ContractLogsComponent
        nameSystemContractId="bar"
        contractLogs={{
          bar: [getFakeNewNamePurchaseLog(new Date('01 Jan 1970 00:00:00 GMT'))],
        }}
      />
    );
    expect(screen.queryByText('1970-01-01T00:00:00.000Z')).not.toBeNull();
  });
  it('should display new name purchase', () => {
    render(
      <ContractLogsComponent
        nameSystemContractId="bar"
        contractLogs={{
          bar: [getFakeNewNamePurchaseLog()],
        }}
      />
    );
    expect(screen.queryByText('New name foo was purchased for 1 REV')).not.toBeNull();
  });
  it('should display existing name purchase', () => {
    render(
      <ContractLogsComponent
        nameSystemContractId="bar"
        contractLogs={{
          bar: [getFakeExistingNamePurchaseLog()],
        }}
      />
    );
    expect(screen.queryByText('Name foo was sold for 1 REV')).not.toBeNull();
  });
  it('should display multiple logs', () => {
    const d = new Date('01 Jan 1970 00:00:00 GMT');
    render(
      <ContractLogsComponent
        nameSystemContractId="bar"
        contractLogs={{
          bar: [
            getFakeExistingNamePurchaseLog(d),
            getFakeExistingNamePurchaseLog(d),
            getFakeExistingNamePurchaseLog(d),
            getFakeNewNamePurchaseLog(d),
          ],
        }}
      />
    );
    expect(screen.queryAllByText('1970-01-01T00:00:00.000Z')).toHaveLength(4);
  });
});
