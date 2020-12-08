export const rholangFilesModuleResourceTerm = (registryUri: string, fileId: string) => {
  if (fileId) {
    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
      lookup!(\`rho:id:${registryUri}\`, *entryCh) |
      for(entry <- entryCh) {
        new x, z in {
          entry!({ "type": "READ" }, *x) |
          for (y <- x) {
            lookup!(*y.get("files").get("${fileId}"), *z) |
            for (value <- z) {
              return!(*value)
            }
          }
        }
      }
    }`;
  } else {
    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
      lookup!(\`rho:id:${registryUri}\`, *entryCh) |
      for(entry <- entryCh) {
        new x in {
          entry!({ "type": "READ" }, *x) |
          for (y <- x) {
            return!(*y)
          }
        }
      }
    }`;
  }
};
