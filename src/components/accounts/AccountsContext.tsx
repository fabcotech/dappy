import React from 'react';

import { Account } from '/models';

interface AccountsContextType {
  setViewBox: (box: { boxId: string; account: Account }) => void;
}

export const AccountsContext = React.createContext<AccountsContextType>({
  setViewBox: () => {},
});
