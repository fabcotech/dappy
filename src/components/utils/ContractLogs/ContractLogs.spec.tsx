import React from 'react';

import { render, screen, cleanup } from '@testing-library/react';
import { ContractLogsComponent } from './ContractLogs';
import { getFakeNewNamePurchaseLog, getFakeExistingNamePurchaseLog } from '/fakeData';

describe('ContractLogs', () => {
  it('should not display if contract has no logs', () => {
    render(
      <ContractLogsComponent
        nameSystemContractId="bar"
        contractLogs={{}}
        loadResource={(a) => null}
        namesBlockchain={undefined}
      />
    );
    expect(screen.queryByText(/Contract logs/)).toBeNull();
    cleanup();

    render(
      <ContractLogsComponent
        loadResource={(a) => null}
        namesBlockchain={undefined}
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
        loadResource={(a) => null}
        namesBlockchain={undefined}
        nameSystemContractId="bar"
        contractLogs={{
          bar: [getFakeNewNamePurchaseLog()],
        }}
      />
    );
    expect(screen.queryByText(/name system logs/)).not.toBeNull();
  });
  it('should display log timestamp in a given format', () => {
    const d = new Date(0);
    render(
      <ContractLogsComponent
        loadResource={(a) => null}
        namesBlockchain={undefined}
        nameSystemContractId="bar"
        contractLogs={{
          bar: [getFakeNewNamePurchaseLog(d)],
        }}
      />
    );
    expect(screen.queryByText('01/01/1970, 01:00')).not.toBeNull();
  });
  it('should display new name purchase', () => {
    render(
      <ContractLogsComponent
        loadResource={(a) => null}
        namesBlockchain={undefined}
        nameSystemContractId="bar"
        contractLogs={{
          bar: [getFakeNewNamePurchaseLog(new Date(0))],
        }}
      />
    );
    expect(screen.queryByTestId('logs')).toHaveTextContent('01/01/1970, 01:00new name foowas purchased for 1 REV');
  });
  it('should display existing name purchase', () => {
    render(
      <ContractLogsComponent
        loadResource={(a) => null}
        namesBlockchain={undefined}
        nameSystemContractId="bar"
        contractLogs={{
          bar: [getFakeExistingNamePurchaseLog()],
        }}
      />
    );
    expect(screen.queryByTestId('logs')).toHaveTextContent('01/01/1970, 01:00name foo was traded for 1 REV');
  });
  it('should display multiple logs', () => {
    const d = new Date(0);
    const d2 = new Date(d.getTime() + 1000);
    const d3 = new Date(d.getTime() + 2000);
    const d4 = new Date(d.getTime() + 3000);
    render(
      <ContractLogsComponent
        loadResource={(a) => null}
        namesBlockchain={undefined}
        nameSystemContractId="bar"
        contractLogs={{
          bar: [
            getFakeExistingNamePurchaseLog(d),
            getFakeExistingNamePurchaseLog(d2),
            getFakeExistingNamePurchaseLog(d3),
            getFakeNewNamePurchaseLog(d4),
          ],
        }}
      />
    );
    expect(screen.queryAllByText('01/01/1970, 01:00')).toHaveLength(4);
  });
  it('should display logs without message parsing if not recognized', () => {
    const d = new Date('01 Jan 1970 00:00:00 GMT');
    const m = `x,${d.getTime()},unknown message`;
    render(
      <ContractLogsComponent
        loadResource={(a) => null}
        namesBlockchain={undefined}
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
        loadResource={(a) => null}
        namesBlockchain={undefined}
      />
    );
    expect(screen.queryByText('no timestamp')).not.toBeNull();
  });
});
