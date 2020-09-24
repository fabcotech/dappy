const MSICreator = require('electron-wix-msi').MSICreator;


const main  = async () => {
    // Step 1: Instantiate the MSICreator
    const msiCreator = new MSICreator({
        appDirectory: 'C:\\Users\\charles\\Documents\\dev\\rchainlive\\_executables\\Dappy-win32-ia32\\',
        description: 'Dappy is a blockchain based web application browser, it brings new possibilities, and a much safer navigation than legacy web browsers.',
        exe: 'dappy',
        name: 'Dappy',
        manufacturer: 'FABCO',
        version: '0.1.9',
        outputDirectory: 'C:\\Users\\charles\\Documents\\dev\\rchainlive\\_installers\\win32_x86',
        arch : 'x86'
    });

    // Step 2: Create a .wxs template file
    await msiCreator.create();

    // Step 3: Compile the template to a .msi file
    await msiCreator.compile()
}

main();