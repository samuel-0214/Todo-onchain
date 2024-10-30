import {AnchorProvider,Program} from "@coral-xyz/anchor"
import {Commitment, Connection,PublicKey} from "@solana/web3.js"
import idl from "../../../target/idl/todo_solana.json"

interface Window {
    solana:any;
}
const programID = new PublicKey("sA62Db23P2TJsM9UBV6JDNSG3L4esgdxFcM5norjfv4");
const network = "http://127.0.0.1:8899";
const opts = {preflightCommitment:"processed" as Commitment};

export const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);

    if(!window?.solana?.isPhantom){
        alert("Phantom wallet is not found!Please install phantom wallet.");
        return null;
    }

    const provider = new AnchorProvider(connection,window.solana,opts);
    return provider;
};

export const getprogram = () => {
    const provider = getProvider();

    if(!provider) return null;

    const program = new Program(idl,programID,provider);
    return program;
}