export interface SessionItem {
  /*
    Just like Tab.address
  */
  address: string;
}
export interface Session {
  items: SessionItem[];
  cursor: number;
}

export interface Preview {
  id: string;
  title: string;
  img?: string;
  /*
    Just like Tab.address
  */
  search: string;
}
