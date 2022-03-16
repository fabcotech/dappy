export enum DappyLoadError {
  UnsupportedAddress = "The address format is not supported",
  IncompleteAddress = "The address is incomplete",
  ChainNotFound = "Blockchain not found",
  MissingBlockchainData = "Missing data from the blockchain",
  RecordNotFound = "Record not found",
  ResourceNotFound = "Contract not found",
  ServerError = "Server error",
  FailedToParseResponse = "Failed to parse response",
  InvalidManifest = "Invalid manifest",
  InvalidSignature = "Invalid signature",
  InvalidRecords = "Invalid records",
  InvalidNodes = "Invalid nodes",
  InvalidServers = "Invalid servers",
  PostParseError = "Parse error after multicall",
  UnknownCriticalError = "Unknown critical error",
  DNSResolutionError = "Name System (DNS) resolution error",
  DappyResolutionError = "Dappy Name System resolution error"
}

export interface DappyLoadErrorWithArgs {
  error: DappyLoadError;
  args: {
      [key: string]: any;
  };
}