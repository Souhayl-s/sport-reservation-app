const { FileSystemManager } = require("../services/file_system_manager");
const fs = require('fs');

describe("FileSystemManager tests", () => {
    const fileSystemManager = new FileSystemManager();

    it("readFile should call fs.promises.readFile function", async () => {
        const spy = jest.spyOn(fs.promises, "readFile").mockImplementation(() => {});
        await fileSystemManager.readFile('test');
        expect(spy).toHaveBeenCalled();
    });
});
