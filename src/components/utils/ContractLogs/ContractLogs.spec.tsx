import React from 'react';

import { render, screen, cleanup } from '@testing-library/react';
import { ContractLogsComponent } from './ContractLogs';
import { getFakeNewNamePurchaseLog, getFakeExistingNamePurchaseLog } from '/fakeData';

describe('ContractLogs', () => {
  it('should not display if contract has no logs', () => {
    render(<ContractLogsComponent nameSystemContractId="bar" contractLogs={{}} />);
    expect(screen.queryByText(/Contract logs/)).toBeNull();
    cleanup();

    render(
      <ContractLogsComponent
        nameSystemContractId={undefined}
        contractLogs={{
          bar: [getFakeNewNamePurchaseLog()],
        }}
      />
    );
    expect(screen.queryByText(/Contract logs/)).toBeNull();
    cleanup();

    render(
      <ContractLogsComponent
        nameSystemContractId="bar"
        contractLogs={{
          bar: [getFakeNewNamePurchaseLog()],
        }}
      />
    );
    expect(screen.queryByText(/Contract logs/)).not.toBeNull();
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
    expect(screen.queryByTestId('logs')).toHaveTextContent('New name foo was purchased for 1 REV');
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
    expect(screen.queryByTestId('logs')).toHaveTextContent('Name foo was sold for 1 REV');
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
  it('should display logs without message parsing if not recognized', () => {
    const d = new Date('01 Jan 1970 00:00:00 GMT');
    const m = `x,${d.getTime()},unknown message`;
    render(
      <ContractLogsComponent
        nameSystemContractId="bar"
        contractLogs={{
          bar: [m],
        }}
      />
    );
    expect(screen.queryByText(m)).not.toBeNull();
  });
  it("should display no timestamp if it can't be parsed", () => {
    const m = `x,NOT_A_TIMESTAMP,unknown message`;
    render(
      <ContractLogsComponent
        nameSystemContractId="bar"
        contractLogs={{
          bar: [m],
        }}
      />
    );
    expect(screen.queryByText('no timestamp')).not.toBeNull();
  });
});
