```mermaid
sequenceDiagram
    NavigationBarHome->>+BrowserWindow: loadResource (address)
    Note right of BrowserWindow: Create new tab
    Note right of BrowserWindow: Name Lookup
    BrowserWindow->>+MainProcess: interprocess://multi-dappy-call get-x-records
    MainProcess-->>-BrowserWindow: Record (name, publicKey, box, price, address, csp, servers, badges)
    BrowserWindow->>+MainProcess: LOAD_OR_RELOAD_BROWSER_VIEW
    MainProcess->>+MainProcess: Create BrowserView
    Note right of MainProcess: Restrict network requests 
    Note right of MainProcess: Restrict permissions like video, audio ...
    Note right of MainProcess: Add Dapps Protocol
    Note right of MainProcess: Add Dappy protocol (built on top of Dapps protocol, deprecated ?)
```;
