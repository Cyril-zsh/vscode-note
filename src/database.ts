import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import * as objectPath from "object-path";
// import * as vscode from "vscode";

// import untildify = require('untildify');


interface VSNDomain {
    name: string;
    notes: number[];
}

// enum VSNoteKind {
//     SQL
// }
interface VSNNote {
    id: number;
    contents: string[];
}


// // class Database
// const config = vscode.workspace.getConfiguration('vsnote');

// // vscode-note://domains/
// // vscode-note://notes/
// const defaultDBPath: string = untildify(config.get<string>('db') || os.homedir());
// const defaultDomainsFile = path.join(defaultDBPath, "domains.json");
// const defaultNotesPath = path.join(defaultDBPath, "notes");

// const cacheDomains: any = JSON.parse(fs.readFileSync(defaultDomainsFile, { encoding: "utf-8" }));

// export function isDirectory(fp: string): Boolean {
//     return fs.statSync(fp).isDirectory();
// }

// export function readChildDomainName(vsnUri?: vscode.Uri) {

// }
export class VSNoteDatabase {
    private readonly dbPath: string;
    private readonly notesPath: string;
    private readonly domainsFile: string;
    private readonly cacheDomains: any;

    constructor(dbPath: string) {
        this.dbPath = dbPath || os.homedir();
        this.notesPath = path.join(this.dbPath, "notes")
        this.domainsFile = path.join(this.dbPath, "domains.json");
        this.cacheDomains = JSON.parse(fs.readFileSync(this.domainsFile, { encoding: "utf-8" }));
        this.createDBIfNotExist();
    }

    public readChildDomain(dpath?: string): VSNDomain[] {
        let tmpDomains = this.cacheDomains;
        const domainPath: string = dpath || "/";
        for (const domain of domainPath.split("/").filter(p => !!p)) {
            tmpDomains = tmpDomains[domain];
        }
        return Object.keys(tmpDomains)
            .filter(name => name !== ".notes")
            .map(name => { return { name: name, notes: tmpDomains[name].notes }; });
    }

    public existChildDomain(dpath: string): Boolean {
        return this.readChildDomain(dpath).length >= 1 ? true : false;
    }

    public readNotesIdOfDomain(dPath: string): number[] {
        const p = path.join(dPath, ".notes").split("/").filter(n => !!n)
        return objectPath.get<number[]>(this.cacheDomains, p, []);
    }

    // private checkoutDB(): void {
    //     fs.writeFileSync(this.domainsFile, JSON.stringify(this.cacheDomains), { encoding: "utf-8" });
    // }

    private createDBIfNotExist(): void {
        if (fs.existsSync(this.dbPath)) { return; }
        fs.mkdirSync(this.dbPath);
        fs.mkdirSync(this.notesPath);

        fs.writeFileSync(this.domainsFile, "{}", { encoding: 'utf-8' });
    }

    public readNoteById(id: number): VSNNote {
        const dList = fs.readdirSync(path.join(this.notesPath, id.toString())).filter(d => !d.startsWith("."))
        const nregex = /^[0-9]\.[a-z]*$/;
        const contents: string[] = [];
        for (const d of dList) {
            console.info(d)
            const fpath = path.join(this.notesPath, id.toString(), d);
            const fstat = fs.statSync(fpath);
            if (fstat.isFile && nregex.test(d)) {
                const content = fs.readFileSync(fpath, { encoding: "utf-8" });
                contents.push(content);
            }
        }
        return { id, contents };
    }

}


// export function addNoteDomain(domainUrl: string, noteId: number): void {
//     // objectPath.insert(cacheDomains, url.parse(domainUrl).path.split("/"), noteId);
// }

// export function delNoteDomain(domainUrl: string, noteId: number): void {
//     // objectPath.del(cacheDomains, url.parse(domainUrl).path.split("/"));
// }


// export function selectDomain(domainUri: vscode.Uri): any {
//     let tmpDomains = cacheDomains;
//     const domainPath: string = domainUri.path || "/";
//     for (const domain of domainPath.split("/").filter(p => !!p)) {
//         tmpDomains = tmpDomains[domain];
//     }
//     // tmpDomains.notes.forEach(noteId =>)
// }

// export function readNoteContent(id: number) {
//     const noteDir = path.join(defaultNotesPath, id.toString());
//     const fr = /^([0-1])+\.([a-z]+)$/;
//     fs.readdirSync(noteDir).filter(f => f !== ".n.json").filter(f => fr.test(f)).sort().map(f => {

//     });

// }